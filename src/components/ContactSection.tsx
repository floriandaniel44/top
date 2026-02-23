import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Mail, MapPin, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const ContactSection = () => {
  const { t, i18n } = useTranslation();
  
  const applicationSchema = z.object({
    name: z.string().trim().min(2, t("contact.messages.validation_error")).max(100, t("contact.messages.error_title")),
    email: z.string().trim().email(t("contact.messages.error_title")).max(255, t("contact.messages.error_title")),
    phone: z.string().trim().min(8, t("contact.messages.error_title")).max(20, t("contact.messages.error_title")),
    country: z.string().min(1, t("contact.messages.error_title")),
    profession: z
      .string()
      .trim()
      .min(2, t("contact.messages.error_title"))
      .max(100, t("contact.messages.error_title")),
    message: z
      .string()
      .trim()
      .min(10, t("contact.messages.error_title"))
      .max(1000, t("contact.messages.error_title")),
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    profession: "",
    message: "",
    honeypot: "", // Spam trap field
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formLoadTime] = useState(Date.now()); // Track when form loaded

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    try {
      applicationSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: t("contact.messages.validation_error"),
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Debug log: endpoint and key presence
      console.log("Submitting application to Supabase function", import.meta.env.VITE_SUPABASE_URL);

      // Call secure edge function with spam protection fields
      const { data, error } = await supabase.functions.invoke("submit-application", {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          country: formData.country,
          profession: formData.profession,
          message: formData.message,
          honeypot: formData.honeypot, // Spam trap
          timestamp: formLoadTime, // Time-based check
          language: i18n.language, // Current language for email
        },
      });

      if (error) {
        console.error("Supabase functions.invoke error:", error);

        // Handle rate limiting errors
        if (error.message?.includes("Limite de soumissions") || error.message?.includes("Trop de tentatives")) {
          toast({
            title: t("contact.messages.limit_error"),
            description: error.message,
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }

        // Fallback: try direct fetch to inspect HTTP status + body (useful to disambiguate DNS/CORS/HTTP errors)
        try {
          const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-application`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string,
              "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string}`,
            },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              country: formData.country,
              profession: formData.profession,
              message: formData.message,
              honeypot: formData.honeypot,
              timestamp: formLoadTime,
              language: i18n.language,
            }),
          });

          const text = await res.text();
          console.error("Fallback fetch status:", res.status, "body:", text);

          toast({
            title: t("contact.messages.error_title"),
            description: `Erreur HTTP ${res.status} — voir console for more details`,
            variant: "destructive",
          });
        } catch (fetchErr) {
          console.error("Fallback fetch error:", fetchErr);
          toast({
            title: t("contact.messages.network_error"),
            description: t("contact.messages.network_desc"),
            variant: "destructive",
          });
        }

        setIsSubmitting(false);
        return;
      }

      toast({
        title: t("contact.messages.success_title"),
        description: t("contact.messages.success_desc"),
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        country: "",
        profession: "",
        message: "",
        honeypot: "",
      });
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: t("contact.messages.error_title"),
        description: error?.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section id="contact" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{t("contact.title")}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <a href="mailto:contact@provisa.fr" className="flex items-start gap-4 group">
                <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors">
                  <Mail className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">{t("contact.info.email")}</h3>
                  <p className="text-muted-foreground text-sm hover:text-primary transition-colors">
                    contact@provisa.fr
                  </p>
                </div>
              </a>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-success/10 p-3 rounded-full">
                  <MapPin className="text-success" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">{t("contact.info.office")}</h3>
                  <p className="text-muted-foreground text-sm">Paris • Bruxelles • Genève</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
              <h3 className="font-bold text-foreground mb-3">{t("contact.info.hours.title")}</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>{t("contact.info.hours.week")}</p>
                <p>{t("contact.info.hours.sat")}</p>
                <p>{t("contact.info.hours.sun")}</p>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="lg:col-span-2 p-8">
            <h3 className="text-2xl font-bold text-foreground mb-6">{t("contact.form.title")}</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("contact.form.name")}</Label>
                  <Input
                    id="name"
                    placeholder={t("contact.form.name")}
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("contact.form.email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("contact.form.phone")}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+xx x xx xx xx xx"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">{t("contact.form.country")}</Label>
                  <Select value={formData.country} onValueChange={(value) => handleChange("country", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("contact.form.country_placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="france">{t("contact.form.countries.fr")}</SelectItem>
                      <SelectItem value="belgique">{t("contact.form.countries.be")}</SelectItem>
                      <SelectItem value="suisse">{t("contact.form.countries.ch")}</SelectItem>
                      <SelectItem value="indecis">{t("contact.form.countries.undecided")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profession">{t("contact.form.profession")}</Label>
                <Input
                  id="profession"
                  placeholder={t("contact.form.profession_placeholder")}
                  value={formData.profession}
                  onChange={(e) => handleChange("profession", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">{t("contact.form.message")}</Label>
                <Textarea
                  id="message"
                  placeholder={t("contact.form.message_placeholder")}
                  rows={5}
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  required
                />
              </div>

              {/* Honeypot field - hidden from users, visible to bots */}
              <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
                <Input
                  type="text"
                  name="honeypot"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.honeypot}
                  onChange={(e) => handleChange("honeypot", e.target.value)}
                />
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? t("contact.form.submitting") : t("contact.form.submit")}
                <Send size={18} />
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                {t("contact.form.consent")}
              </p>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
