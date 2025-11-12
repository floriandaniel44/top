import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ApplicationRequest {
  name: string;
  email: string;
  phone: string;
  country: string;
  profession: string;
  message: string;
  honeypot?: string; // Spam trap
  timestamp?: number; // Submission timestamp
}

// Server-side validation schema
const validateInput = (data: ApplicationRequest): { valid: boolean; error?: string } => {
  // Check honeypot field (should be empty)
  if (data.honeypot && data.honeypot.trim() !== "") {
    console.log("Honeypot triggered - likely spam");
    return { valid: false, error: "Invalid submission" };
  }

  // Check submission timing (minimum 3 seconds from page load)
  if (data.timestamp && Date.now() - data.timestamp < 3000) {
    console.log("Form submitted too quickly - likely bot");
    return { valid: false, error: "Please take your time to fill the form" };
  }

  // Validate name
  const name = data.name?.trim();
  if (!name || name.length < 2 || name.length > 100) {
    return { valid: false, error: "Le nom doit contenir entre 2 et 100 caractères" };
  }

  // Validate email
  const email = data.email?.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email) || email.length > 255) {
    return { valid: false, error: "Email invalide" };
  }

  // Validate phone
  const phone = data.phone?.trim();
  if (!phone || phone.length < 8 || phone.length > 20) {
    return { valid: false, error: "Numéro de téléphone invalide" };
  }

  // Validate country (normalize accents and case so frontend variations match)
  const normalize = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const validCountries = ["france", "belgique", "suisse", "indecis"];
  if (!data.country || !validCountries.includes(normalize(data.country))) {
    return { valid: false, error: "Pays invalide" };
  }

  // Validate profession
  const profession = data.profession?.trim();
  if (!profession || profession.length < 2 || profession.length > 100) {
    return { valid: false, error: "La profession doit contenir entre 2 et 100 caractères" };
  }

  // Validate message
  const message = data.message?.trim();
  if (!message || message.length < 10 || message.length > 1000) {
    return { valid: false, error: "Le message doit contenir entre 10 et 1000 caractères" };
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /viagra|cialis|casino|lottery|winner/i,
    /\bhttps?:\/\/[^\s]+\b.*\bhttps?:\/\/[^\s]+\b/i, // Multiple URLs
    /<script|javascript:|onclick|onerror/i, // XSS attempts
  ];

  const allText = `${name} ${email} ${message} ${profession}`;
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(allText)) {
      console.log("Suspicious content detected");
      return { valid: false, error: "Invalid content detected" };
    }
  }

  return { valid: true };
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Read env vars with fallbacks because Dashboard/CLI may block names starting with SUPABASE_
  const projectUrl = Deno.env.get("SUPABASE_URL") ?? Deno.env.get("PROJECT_URL") ?? Deno.env.get("PROJECT_SUPABASE_URL") ?? "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SERVICE_ROLE_KEY") ?? Deno.env.get("SERVICE_ROLE") ?? "";
  const resendApiKey = Deno.env.get("RESEND_API_KEY") ?? Deno.env.get("RESEND_KEY") ?? "";

  const supabase = createClient(projectUrl, serviceRoleKey);
  const resend = new Resend(resendApiKey);

  // Debug: log presence of critical env vars (do NOT log secrets themselves)
  console.log("ENV: projectUrl set:", !!projectUrl);
  console.log("ENV: serviceRoleKey set:", !!serviceRoleKey);
  console.log("ENV: resendApiKey set:", !!resendApiKey);

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0] || 
                     req.headers.get("x-real-ip") || 
                     "unknown";

    console.log("Processing application submission from IP:", clientIP);

    // Parse request body
    const data: ApplicationRequest = await req.json();

    // Server-side validation
    const validation = validateInput(data);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        {
          status: 400,
          headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders },
        }
      );
    }

    // Check rate limiting
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
    // Get existing rate limit record
    const { data: rateLimitData } = await supabase
      .from("application_rate_limits")
      .select("*")
      .eq("ip_address", clientIP)
      .single();

    if (rateLimitData) {
      // Check if IP is temporarily blocked
      if (rateLimitData.blocked_until && new Date(rateLimitData.blocked_until) > new Date()) {
        console.log("IP is temporarily blocked:", clientIP);
        return new Response(
          JSON.stringify({ 
            error: "Trop de tentatives. Veuillez réessayer plus tard.",
            retryAfter: rateLimitData.blocked_until 
          }),
          {
            status: 429,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      // Reset counter if last submission was over 1 hour ago
      if (new Date(rateLimitData.last_submission_at) < new Date(oneHourAgo)) {
        await supabase
          .from("application_rate_limits")
          .update({
            submission_count: 1,
            first_submission_at: new Date().toISOString(),
            last_submission_at: new Date().toISOString(),
            blocked_until: null,
          })
          .eq("ip_address", clientIP);
      } else {
        // Increment counter
        const newCount = rateLimitData.submission_count + 1;
        
        // Block if more than 3 submissions in 1 hour
        if (newCount > 3) {
          const blockedUntil = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(); // 2 hours
          await supabase
            .from("application_rate_limits")
            .update({
              submission_count: newCount,
              last_submission_at: new Date().toISOString(),
              blocked_until: blockedUntil,
            })
            .eq("ip_address", clientIP);

          console.log("IP blocked due to rate limit:", clientIP);
          return new Response(
            JSON.stringify({ 
              error: "Limite de soumissions atteinte. Veuillez réessayer dans 2 heures.",
              retryAfter: blockedUntil 
            }),
            {
              status: 429,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            }
          );
        }

        await supabase
          .from("application_rate_limits")
          .update({
            submission_count: newCount,
            last_submission_at: new Date().toISOString(),
          })
          .eq("ip_address", clientIP);
      }
    } else {
      // Create new rate limit record
      await supabase
        .from("application_rate_limits")
        .insert({
          ip_address: clientIP,
          submission_count: 1,
          first_submission_at: new Date().toISOString(),
          last_submission_at: new Date().toISOString(),
        });
    }

    // Insert application into database
    const { error: insertError } = await supabase
      .from("applications")
      .insert({
        nom: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        telephone: data.phone.trim(),
        pays: data.country.toLowerCase(),
        profession: data.profession.trim(),
        message: data.message.trim(),
      });

    if (insertError) {
      console.error("Database insert error:", insertError);
      throw new Error("Erreur lors de la sauvegarde de la candidature");
    }

    console.log("Application saved successfully");

    // Send notification emails
    try {
      // Admin notification email
      const adminEmailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .info-block { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
              .label { color: #667eea; font-weight: bold; margin-bottom: 5px; }
              .value { color: #333; font-size: 16px; margin-bottom: 15px; }
              .message-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; border-radius: 4px; }
              .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; padding: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 28px;">Nouvelle candidature</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Une nouvelle demande d'immigration professionnelle</p>
              </div>
              <div class="content">
                <div class="info-block">
                  <div class="label">Candidat</div>
                  <div class="value">${data.name}</div>
                  
                  <div class="label">Email</div>
                  <div class="value"><a href="mailto:${data.email}" style="color: #667eea; text-decoration: none;">${data.email}</a></div>
                  
                  <div class="label">Téléphone</div>
                  <div class="value"><a href="tel:${data.phone}" style="color: #667eea; text-decoration: none;">${data.phone}</a></div>
                  
                  <div class="label">Pays de destination</div>
                  <div class="value">${data.country}</div>
                  
                  <div class="label">Profession</div>
                  <div class="value">${data.profession}</div>
                </div>
                
                <div class="message-box">
                  <div class="label">Message du candidat</div>
                  <div class="value">${data.message}</div>
                </div>
                
                <div style="text-align: center; margin-top: 25px;">
                  <a href="mailto:${data.email}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Répondre au candidat</a>
                </div>
              </div>
              <div class="footer">
                <p>Cette candidature a été soumise via le formulaire ProVisa</p>
                <p>© ${new Date().getFullYear()} ProVisa - Tous droits réservés</p>
              </div>
            </div>
          </body>
        </html>
      `;

      const adminResp = await resend.emails.send({
        from: "ProVisa <contact@provisa.fr>",
        to: ["contact@provisa.fr"],
        subject: `Nouvelle candidature - ${data.name}`,
        html: adminEmailHtml,
        replyTo: data.email,
      });
      console.log("Resend admin response:", adminResp);

      // Confirmation email to candidate
      const confirmationHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .welcome { background: white; padding: 25px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
              .info-box { background: #e8f4f8; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px; }
              .summary { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
              .summary-item { padding: 10px 0; border-bottom: 1px solid #eee; }
              .summary-item:last-child { border-bottom: none; }
              .label { color: #667eea; font-weight: bold; display: inline-block; width: 150px; }
              .value { color: #333; }
              .next-steps { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
              .step { padding: 15px; margin: 10px 0; background: #f8f9fa; border-radius: 6px; }
              .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; padding: 20px; }
              .contact-info { background: #fff3cd; padding: 15px; margin: 20px 0; border-radius: 6px; text-align: center; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 32px;">Candidature bien reçue</h1>
                <p style="margin: 15px 0 0 0; opacity: 0.95; font-size: 18px;">Merci ${data.name}</p>
              </div>
              <div class="content">
                <div class="welcome">
                  <p style="font-size: 16px; margin: 0;">Nous avons bien reçu votre candidature pour <strong>${data.country}</strong> et nous vous remercions de votre confiance.</p>
                </div>
                
                <div class="info-box">
                  <p style="margin: 0;"><strong>Délai de réponse :</strong> Notre équipe d'experts va examiner attentivement votre dossier et vous recontactera dans les <strong>24 à 48 heures</strong>.</p>
                </div>
                
                <div class="summary">
                  <h2 style="color: #667eea; margin-top: 0;">Récapitulatif de votre demande</h2>
                  <div class="summary-item">
                    <span class="label">Nom :</span>
                    <span class="value">${data.name}</span>
                  </div>
                  <div class="summary-item">
                    <span class="label">Email :</span>
                    <span class="value">${data.email}</span>
                  </div>
                  <div class="summary-item">
                    <span class="label">Téléphone :</span>
                    <span class="value">${data.phone}</span>
                  </div>
                  <div class="summary-item">
                    <span class="label">Destination :</span>
                    <span class="value">${data.country}</span>
                  </div>
                  <div class="summary-item">
                    <span class="label">Profession :</span>
                    <span class="value">${data.profession}</span>
                  </div>
                </div>
                
                <div class="next-steps">
                  <h2 style="color: #667eea; margin-top: 0;">Prochaines étapes</h2>
                  <div class="step">
                    <strong>1.</strong> Notre équipe examine votre candidature
                  </div>
                  <div class="step">
                    <strong>2.</strong> Vous recevrez un email de notre part sous 24-48h
                  </div>
                  <div class="step">
                    <strong>3.</strong> Nous discuterons ensemble de votre projet d'immigration
                  </div>
                </div>
                
                <div class="contact-info">
                  <p style="margin: 0;"><strong>Besoin d'aide ?</strong></p>
                  <p style="margin: 5px 0 0 0;">N'hésitez pas à nous contacter si vous avez des questions.</p>
                </div>
                
                <p style="text-align: center; margin-top: 30px; color: #667eea; font-size: 18px;">
                  <strong>À très bientôt !</strong>
                </p>
                <p style="text-align: center; color: #666; font-style: italic;">
                  L'équipe ProVisa
                </p>
              </div>
              <div class="footer">
                <p>Cet email a été envoyé car vous avez soumis une candidature sur ProVisa</p>
                <p>© ${new Date().getFullYear()} ProVisa - Tous droits réservés</p>
              </div>
            </div>
          </body>
        </html>
      `;

      const confirmResp = await resend.emails.send({
        from: "ProVisa <contact@provisa.fr>",
        to: [data.email],
        subject: "Candidature bien reçue - ProVisa",
        html: confirmationHtml,
        replyTo: "contact@provisa.fr",
      });
      console.log("Resend confirmation response:", confirmResp);

      console.log("Notification emails sent successfully");
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Continue even if email fails - application is saved
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Candidature soumise avec succès"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in submit-application function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Une erreur est survenue" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders },
      }
    );
  }
};

serve(handler);
