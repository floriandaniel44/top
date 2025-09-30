import { Card } from "@/components/ui/card";
import { FileText, DollarSign, HandHeart, Home, Plane, Shield } from "lucide-react";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: FileText,
      title: "Titre de Séjour",
      description: "Permis de travail valable 3 ans, renouvelable, vous permettant de vivre et travailler légalement en Europe.",
      color: "bg-primary/10"
    },
    {
      icon: DollarSign,
      title: "Bourse Internationale",
      description: "Aide financière de 5 000€ à 15 000€ pour faciliter votre installation et vos premiers mois sur place.",
      color: "bg-accent/10"
    },
    {
      icon: HandHeart,
      title: "Accompagnement Complet",
      description: "Support personnalisé à chaque étape : dossier, démarches administratives, recherche de logement.",
      color: "bg-success/10"
    },
    {
      icon: Home,
      title: "Aide au Logement",
      description: "Assistance pour trouver un logement adapté à vos besoins avant votre arrivée dans le pays d'accueil.",
      color: "bg-primary/10"
    },
    {
      icon: Plane,
      title: "Facilitation de Voyage",
      description: "Conseils sur les billets d'avion, transport de biens personnels et formalités douanières.",
      color: "bg-accent/10"
    },
    {
      icon: Shield,
      title: "Protection Sociale",
      description: "Accès au système de sécurité sociale et d'assurance du pays d'accueil dès votre arrivée.",
      color: "bg-success/10"
    }
  ];

  return (
    <section id="avantages" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Avantages du Programme
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Un accompagnement global pour réussir votre projet d'expatriation professionnelle en toute sérénité.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card 
              key={index}
              className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`${benefit.color} w-16 h-16 rounded-full flex items-center justify-center mb-6`}>
                <benefit.icon className="text-primary" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
            </Card>
          ))}
        </div>

        <Card className="mt-16 p-8 md:p-12 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Pourquoi Choisir Notre Programme ?
            </h3>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-95">
              Nous simplifions les démarches complexes d'immigration professionnelle et vous offrons 
              les meilleures chances de réussite grâce à notre expertise et notre réseau de partenaires.
            </p>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div>
                <div className="text-5xl font-bold mb-2 text-accent">95%</div>
                <div className="text-lg opacity-90">Taux d'acceptation</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2 text-accent">3-6</div>
                <div className="text-lg opacity-90">Mois de traitement</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2 text-accent">24/7</div>
                <div className="text-lg opacity-90">Support disponible</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default BenefitsSection;
