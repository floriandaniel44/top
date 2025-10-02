import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ApplicationNotificationRequest {
  name: string;
  email: string;
  phone: string;
  country: string;
  profession: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, country, profession, message }: ApplicationNotificationRequest = await req.json();

    console.log("Sending application notification for:", name);

    // Email envoyé à vous (l'administrateur)
    const emailResponse = await resend.emails.send({
      from: "ProVisa <onboarding@resend.dev>",
      to: ["legerolt@gmail.com"],
      subject: `🎯 Nouvelle Candidature - ${name}`,
      html: `
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
                <h1 style="margin: 0; font-size: 28px;">📋 Nouvelle Candidature</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Une nouvelle demande d'immigration professionnelle</p>
              </div>
              <div class="content">
                <div class="info-block">
                  <div class="label">👤 Candidat</div>
                  <div class="value">${name}</div>
                  
                  <div class="label">📧 Email</div>
                  <div class="value"><a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a></div>
                  
                  <div class="label">📱 Téléphone</div>
                  <div class="value"><a href="tel:${phone}" style="color: #667eea; text-decoration: none;">${phone}</a></div>
                  
                  <div class="label">🌍 Pays de destination</div>
                  <div class="value">${country}</div>
                  
                  <div class="label">💼 Profession</div>
                  <div class="value">${profession}</div>
                </div>
                
                <div class="message-box">
                  <div class="label">💬 Message du candidat</div>
                  <div class="value">${message}</div>
                </div>
                
                <div style="text-align: center; margin-top: 25px;">
                  <a href="mailto:${email}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Répondre au candidat</a>
                </div>
              </div>
              <div class="footer">
                <p>Cette candidature a été soumise via le formulaire ProVisa</p>
                <p>© ${new Date().getFullYear()} ProVisa - Tous droits réservés</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Admin notification sent successfully:", emailResponse);

    // Email de confirmation envoyé au candidat
    const confirmationResponse = await resend.emails.send({
      from: "ProVisa <onboarding@resend.dev>",
      to: [email],
      subject: "Nous avons bien reçu votre candidature",
      html: `
        <h1>Merci ${name} !</h1>
        <p>Nous avons bien reçu votre candidature pour la ${country}.</p>
        <p>Notre équipe va l'examiner et vous recontactera dans les 24-48 heures.</p>
        <p><strong>Récapitulatif de votre demande:</strong></p>
        <ul>
          <li><strong>Profession:</strong> ${profession}</li>
          <li><strong>Pays souhaité:</strong> ${country}</li>
        </ul>
        <p>À très bientôt,<br>L'équipe ProVisa</p>
      `,
    });

    console.log("Candidate confirmation sent successfully:", confirmationResponse);

    return new Response(JSON.stringify({ 
      success: true,
      adminEmail: emailResponse,
      confirmationEmail: confirmationResponse 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-application-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
