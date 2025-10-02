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
      subject: ` Nouvelle Candidature - ${name}`,
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
                <h1 style="margin: 0; font-size: 28px;"> Nouvelle Candidature</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Une nouvelle demande d'immigration professionnelle</p>
              </div>
              <div class="content">
                <div class="info-block">
                  <div class="label"> Candidat</div>
                  <div class="value">${name}</div>
                  
                  <div class="label"> Email</div>
                  <div class="value"><a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a></div>
                  
                  <div class="label"> Téléphone</div>
                  <div class="value"><a href="tel:${phone}" style="color: #667eea; text-decoration: none;">${phone}</a></div>
                  
                  <div class="label"> Pays de destination</div>
                  <div class="value">${country}</div>
                  
                  <div class="label"> Profession</div>
                  <div class="value">${profession}</div>
                </div>
                
                <div class="message-box">
                  <div class="label"> Message du candidat</div>
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
      subject: " Candidature bien reçue - ProVisa",
      html: `
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
                <h1 style="margin: 0; font-size: 32px;"> Candidature Reçue !</h1>
                <p style="margin: 15px 0 0 0; opacity: 0.95; font-size: 18px;">Merci ${name}</p>
              </div>
              <div class="content">
                <div class="welcome">
                  <p style="font-size: 16px; margin: 0;">Nous avons bien reçu votre candidature pour <strong>${country}</strong> et nous vous remercions de votre confiance.</p>
                </div>
                
                <div class="info-box">
                  <p style="margin: 0;"><strong> Délai de réponse :</strong> Notre équipe d'experts va examiner attentivement votre dossier et vous recontactera dans les <strong>24 à 48 heures</strong>.</p>
                </div>
                
                <div class="summary">
                  <h2 style="color: #667eea; margin-top: 0;"> Récapitulatif de votre demande</h2>
                  <div class="summary-item">
                    <span class="label"> Nom :</span>
                    <span class="value">${name}</span>
                  </div>
                  <div class="summary-item">
                    <span class="label"> Email :</span>
                    <span class="value">${email}</span>
                  </div>
                  <div class="summary-item">
                    <span class="label"> Téléphone :</span>
                    <span class="value">${phone}</span>
                  </div>
                  <div class="summary-item">
                    <span class="label"> Destination :</span>
                    <span class="value">${country}</span>
                  </div>
                  <div class="summary-item">
                    <span class="label"> Profession :</span>
                    <span class="value">${profession}</span>
                  </div>
                </div>
                
                <div class="next-steps">
                  <h2 style="color: #667eea; margin-top: 0;"> Prochaines étapes</h2>
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
                  <p style="margin: 0;"><strong> Besoin d'aide ?</strong></p>
                  <p style="margin: 5px 0 0 0;">N'hésitez pas à nous contacter si vous avez des questions.</p>
                </div>
                
                <p style="text-align: center; margin-top: 30px; color: #667eea; font-size: 18px;">
                  <strong>À très bientôt ! </strong>
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
