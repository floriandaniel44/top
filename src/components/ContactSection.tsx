import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const applicationSchema = z.object({
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères").max(100, "Le nom est trop long"),
  email: z.string().trim().email("Email invalide").max(255, "L'email est trop long"),
  phone: z.string().trim().min(8, "Numéro de téléphone invalide").max(20, "Numéro de téléphone trop long"),
  country: z.string().min(1, "Veuillez sélectionner un pays"),
  profession: z.string().trim().min(2, "La profession doit contenir au moins 2 caractères").max(100, "La profession est trop longue"),
  message: z.string().trim().min(10, "Le message doit contenir au moins 10 caractères").max(1000, "Le message est trop long")
});

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    profession: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    try {
      applicationSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Erreur de validation",
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('applications')
        .insert([
          {
            nom: formData.name,
            email: formData.email,
            telephone: formData.phone,
            pays: formData.country,
            profession: formData.profession,
            message: formData.message,
          }
        ]);

      if (error) throw error;

      // Envoyer l'email de notification
      try {
        await supabase.functions.invoke('send-application-notification', {
          body: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            country: formData.country,
            profession: formData.profession,
            message: formData.message,
          }
        });
      } catch (emailError) {
        console.error("Erreur d'envoi d'email:", emailError);
        // Continue même si l'email échoue - la candidature est sauvegardée
      }

      toast({
        title: "Message envoyé !",
        description: "Nous vous contacterons dans les 24-48 heures.",
      });
      
      setFormData({ name: "", email: "", phone: "", country: "", profession: "", message: "" });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="contact" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Contactez-Nous
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Une question ? Besoin de plus d'informations ? Notre équipe est là pour vous accompagner
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Mail className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Email</h3>
                  <p className="text-muted-foreground text-sm">contact@provisa.fr</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-accent/10 p-3 rounded-full">
                  <Phone className="text-accent" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Téléphone</h3>
                  <p className="text-muted-foreground text-sm">+33 1 23 45 67 89</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-success/10 p-3 rounded-full">
                  <MapPin className="text-success" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Bureaux</h3>
                  <p className="text-muted-foreground text-sm">Paris • Bruxelles • Genève</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
              <h3 className="font-bold text-foreground mb-3">Horaires d'ouverture</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Lundi - Vendredi: 9h - 18h</p>
                <p>Samedi: 10h - 14h</p>
                <p>Dimanche: Fermé</p>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="lg:col-span-2 p-8">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Commencez Votre Procédure
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet *</Label>
                  <Input
                    id="name"
                    placeholder="Votre nom"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
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
                  <Label htmlFor="phone">Téléphone *</Label>
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
                  <Label htmlFor="country">Pays souhaité *</Label>
                  <Select value={formData.country} onValueChange={(value) => handleChange("country", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un pays" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="france">France</SelectItem>
                      <SelectItem value="belgique">Belgique</SelectItem>
                      <SelectItem value="suisse">Suisse</SelectItem>
                      <SelectItem value="indecis">Pas encore décidé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profession">Profession / Secteur d'activité *</Label>
                <Input
                  id="profession"
                  placeholder="Ex: Infirmier, Ingénieur..."
                  value={formData.profession}
                  onChange={(e) => handleChange("profession", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  placeholder="Parlez-nous de votre projet et de vos questions..."
                  rows={5}
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  required
                />
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Envoi en cours..." : "Envoyer ma demande"}
                <Send size={18} />
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                En soumettant ce formulaire, vous acceptez d'être contacté par notre équipe.
              </p>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
