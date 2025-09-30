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
      from: "Evoluez International <provisa@eu.com>",
      to: ["legerolt@gmail.com"], // Remplacez par votre vrai email
      subject: `Nouvelle candidature - ${name}`,
      html: `
        <h1>Nouvelle candidature reçue</h1>
        <p><strong>Candidat:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Téléphone:</strong> ${phone}</p>
        <p><strong>Pays souhaité:</strong> ${country}</p>
        <p><strong>Profession:</strong> ${profession}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">Cette candidature a été soumise via le formulaire de contact sur votre site.</p>
      `,
    });

    console.log("Admin notification sent successfully:", emailResponse);

    // Email de confirmation envoyé au candidat
    const confirmationResponse = await resend.emails.send({
      from: "Provisa <onboarding@resend.dev>",
      to: [email],
      subject: "Nous avons bien reçu votre candidature",
      html: `
        <h1>Merci ${name} !</h1>
        <p>Nous avons bien reçu votre candidature pour ${country}.</p>
        <p>Notre équipe va l'examiner et vous recontactera dans les 24-48 heures.</p>
        <p><strong>Récapitulatif de votre demande:</strong></p>
        <ul>
          <li><strong>Profession:</strong> ${profession}</li>
          <li><strong>Pays souhaité:</strong> ${country}</li>
        </ul>
        <p>À très bientôt,<br>L'équipe Evoluez International</p>
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
