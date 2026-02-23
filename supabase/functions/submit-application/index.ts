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
  language?: string; // Client language
}

const validateInput = (data: ApplicationRequest): { valid: boolean; error?: string } => {
  if (data.honeypot && data.honeypot.trim() !== "") {
    return { valid: false, error: "Invalid submission" };
  }
  if (data.timestamp && Date.now() - data.timestamp < 3000) {
    return { valid: false, error: "Please take your time to fill the form" };
  }
  const name = data.name?.trim();
  if (!name || name.length < 2 || name.length > 100) {
    return { valid: false, error: "Le nom doit contenir entre 2 et 100 caractères" };
  }
  const email = data.email?.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email) || email.length > 255) {
    return { valid: false, error: "Email invalide" };
  }
  const phone = data.phone?.trim();
  if (!phone || phone.length < 8 || phone.length > 20) {
    return { valid: false, error: "Numéro de téléphone invalide" };
  }
  const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const validCountries = ["france", "belgique", "suisse", "indecis"];
  if (!data.country || !validCountries.includes(normalize(data.country))) {
    return { valid: false, error: "Pays invalide" };
  }
  const profession = data.profession?.trim();
  if (!profession || profession.length < 2 || profession.length > 100) {
    return { valid: false, error: "La profession doit contenir entre 2 et 100 caractères" };
  }
  const message = data.message?.trim();
  if (!message || message.length < 10 || message.length > 1000) {
    return { valid: false, error: "Le message doit contenir entre 10 et 1000 caractères" };
  }
  return { valid: true };
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const projectUrl = Deno.env.get("SUPABASE_URL") ?? Deno.env.get("PROJECT_URL") ?? "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SERVICE_ROLE_KEY") ?? "";
  const resendApiKey = Deno.env.get("RESEND_API_KEY") ?? Deno.env.get("RESEND_KEY") ?? "";

  const supabase = createClient(projectUrl, serviceRoleKey);
  const resend = new Resend(resendApiKey);

  try {
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const data: ApplicationRequest = await req.json();

    const validation = validateInput(data);
    if (!validation.valid) {
      return new Response(JSON.stringify({ error: validation.error }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    // Rate limiting logic
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: rateLimitData } = await supabase
      .from("application_rate_limits")
      .select("*")
      .eq("ip_address", clientIP)
      .single();

    if (rateLimitData) {
      if (rateLimitData.blocked_until && new Date(rateLimitData.blocked_until) > new Date()) {
        return new Response(
          JSON.stringify({ error: "Trop de tentatives. Veuillez réessayer plus tard.", retryAfter: rateLimitData.blocked_until }),
          { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      if (new Date(rateLimitData.last_submission_at) < new Date(oneHourAgo)) {
        await supabase
          .from("application_rate_limits")
          .update({ submission_count: 1, first_submission_at: new Date().toISOString(), last_submission_at: new Date().toISOString(), blocked_until: null })
          .eq("ip_address", clientIP);
      } else {
        const newCount = rateLimitData.submission_count + 1;
        if (newCount > 3) {
          const blockedUntil = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
          await supabase
            .from("application_rate_limits")
            .update({ submission_count: newCount, last_submission_at: new Date().toISOString(), blocked_until: blockedUntil })
            .eq("ip_address", clientIP);

          return new Response(
            JSON.stringify({ error: "Limite de soumissions atteinte. Veuillez réessayer dans 2 heures.", retryAfter: blockedUntil }),
            { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        await supabase
          .from("application_rate_limits")
          .update({ submission_count: newCount, last_submission_at: new Date().toISOString() })
          .eq("ip_address", clientIP);
      }
    } else {
      await supabase
        .from("application_rate_limits")
        .insert({ ip_address: clientIP, submission_count: 1, first_submission_at: new Date().toISOString(), last_submission_at: new Date().toISOString() });
    }

    // Insert application
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

    if (insertError) throw insertError;

    // Email logic
    const lang = data.language?.startsWith('en') ? 'en' : data.language?.startsWith('pt') ? 'pt' : 'fr';
    
    const translations: any = {
      fr: {
        subject: "Candidature bien reçue - ProVisa",
        received: "Candidature bien reçue",
        merci: "Merci",
        welcome: "Nous avons bien reçu votre candidature pour <strong>{country}</strong> et nous vous remercions de votre confiance.",
        delay_title: "Délai de réponse :",
        delay_text: "Notre équipe d'experts va examiner attentivement votre dossier et vous recontactera dans les <strong>24 à 48 heures</strong>.",
        summary_title: "Récapitulatif de votre demande",
        label_name: "Nom :",
        label_email: "Email :",
        label_phone: "Téléphone :",
        label_destination: "Destination :",
        label_profession: "Profession :",
        steps_title: "Prochaines étapes",
        step1: "Notre équipe examine votre candidature",
        step2: "Vous recevrez un email de notre part sous 24-48h",
        step3: "Nous discuterons ensemble de votre projet d'immigration",
        help_title: "Besoin d'aide ?",
        help_text: "N'hésitez pas à nous contacter si vous avez des questions.",
        bye: "À très bientôt !",
        team: "L'équipe ProVisa",
        footer_text: "Cet email a été envoyé car vous avez soumis une candidature sur ProVisa",
        rights: "Tous droits réservés"
      },
      en: {
        subject: "Application received - ProVisa",
        received: "Application received",
        merci: "Thank you",
        welcome: "We have received your application for <strong>{country}</strong> and we thank you for your trust.",
        delay_title: "Response time:",
        delay_text: "Our team of experts will carefully examine your file and will contact you within <strong>24 to 48 hours</strong>.",
        summary_title: "Request Summary",
        label_name: "Full Name:",
        label_email: "Email:",
        label_phone: "Phone:",
        label_destination: "Destination:",
        label_profession: "Profession:",
        steps_title: "Next steps",
        step1: "Our team examines your application",
        step2: "You will receive an email from us within 24-48h",
        step3: "We will discuss your immigration project together",
        help_title: "Need help?",
        help_text: "Do not hesitate to contact us if you have any questions.",
        bye: "See you soon!",
        team: "The ProVisa Team",
        footer_text: "This email was sent because you submitted an application on ProVisa",
        rights: "All rights reserved"
      },
      pt: {
        subject: "Candidatura recebida - ProVisa",
        received: "Candidatura bem recebida",
        merci: "Obrigado",
        welcome: "Recebemos a sua candidatura para <strong>{country}</strong> e agradecemos a sua confiança.",
        delay_title: "Tempo de resposta:",
        delay_text: "Nossa equipe de especialistas examinará cuidadosamente seu dossiê e entrará em contato com você dentro de <strong>24 a 48 horas</strong>.",
        summary_title: "Resumo do pedido",
        label_name: "Nome:",
        label_email: "Email:",
        label_phone: "Telefone:",
        label_destination: "Destino:",
        label_profession: "Profissão:",
        steps_title: "Próximas etapas",
        step1: "Nossa equipe examina sua candidatura",
        step2: "Você receberá um email de nossa parte em 24-48h",
        step3: "Discutiremos juntos seu projeto de imigração",
        help_title: "Precisa de ajuda?",
        help_text: "Não hesite em nos contatar se tiver alguma dúvida.",
        bye: "Até breve!",
        team: "A Equipe ProVisa",
        footer_text: "Este email foi enviado porque você enviou uma candidatura no ProVisa",
        rights: "Todos os direitos reservados"
      }
    };

    const t = translations[lang];
    const welcomeText = t.welcome.replace('{country}', data.country);

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
              <h1 style="margin: 0; font-size: 32px;">${t.received}</h1>
              <p style="margin: 15px 0 0 0; opacity: 0.95; font-size: 18px;">${t.merci} ${data.name}</p>
            </div>
            <div class="content">
              <div class="welcome">
                <p style="font-size: 16px; margin: 0;">${welcomeText}</p>
              </div>
              
              <div class="info-box">
                <p style="margin: 0;"><strong>${t.delay_title}</strong> ${t.delay_text}</p>
              </div>
              
              <div class="summary">
                <h2 style="color: #667eea; margin-top: 0;">${t.summary_title}</h2>
                <div class="summary-item">
                  <span class="label">${t.label_name}</span>
                  <span class="value">${data.name}</span>
                </div>
                <div class="summary-item">
                  <span class="label">${t.label_email}</span>
                  <span class="value">${data.email}</span>
                </div>
                <div class="summary-item">
                  <span class="label">${t.label_phone}</span>
                  <span class="value">${data.phone}</span>
                </div>
                <div class="summary-item">
                  <span class="label">${t.label_destination}</span>
                  <span class="value">${data.country}</span>
                </div>
                <div class="summary-item">
                  <span class="label">${t.label_profession}</span>
                  <span class="value">${data.profession}</span>
                </div>
              </div>
              
              <div class="next-steps">
                <h2 style="color: #667eea; margin-top: 0;">${t.steps_title}</h2>
                <div class="step">
                  <strong>1.</strong> ${t.step1}
                </div>
                <div class="step">
                  <strong>2.</strong> ${t.step2}
                </div>
                <div class="step">
                  <strong>3.</strong> ${t.step3}
                </div>
              </div>
              
              <div class="contact-info">
                <p style="margin: 0;"><strong>${t.help_title}</strong></p>
                <p style="margin: 5px 0 0 0;">${t.help_text}</p>
              </div>
              
              <p style="text-align: center; margin-top: 30px; color: #667eea; font-size: 18px;">
                <strong>${t.bye}</strong>
              </p>
              <p style="text-align: center; color: #666; font-style: italic;">
                ${t.team}
              </p>
            </div>
            <div class="footer">
              <p>${t.footer_text}</p>
              <p>© ${new Date().getFullYear()} ProVisa - ${t.rights}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await resend.emails.send({
      from: "ProVisa <contact@provisa.fr>",
      to: [data.email],
      subject: t.subject,
      html: confirmationHtml,
      replyTo: "contact@provisa.fr",
    });

    // Also send admin notification (hardcoded in FR as usual)
    await resend.emails.send({
      from: "ProVisa <contact@provisa.fr>",
      to: ["contact@provisa.fr"],
      subject: `Nouvelle candidature - ${data.name}`,
      html: `<h1>Nouvelle candidature de ${data.name}</h1><p>Email: ${data.email}</p><p>Pays: ${data.country}</p><p>Profession: ${data.profession}</p><p>Message: ${data.message}</p>`,
      replyTo: data.email,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
  }
};

serve(handler);
