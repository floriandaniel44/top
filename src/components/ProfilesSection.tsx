import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Stethoscope, 
  Code, 
  Wrench, 
  GraduationCap, 
  Briefcase, 
  Heart,
  Calculator,
  Building,
  ChefHat,
  Truck,
  Palette,
  FlaskConical
} from "lucide-react";

const ProfilesSection = () => {
  const profiles = [
    { icon: Stethoscope, title: "Médecins & Infirmiers", demand: "Très forte" },
    { icon: Code, title: "Développeurs & IT", demand: "Forte" },
    { icon: Wrench, title: "Ingénieurs", demand: "Forte" },
    { icon: GraduationCap, title: "Enseignants", demand: "Moyenne" },
    { icon: Briefcase, title: "Gestionnaires", demand: "Moyenne" },
    { icon: Heart, title: "Travailleurs Sociaux", demand: "Forte" },
    { icon: Calculator, title: "Comptables", demand: "Moyenne" },
    { icon: Building, title: "Architectes", demand: "Moyenne" },
    { icon: ChefHat, title: "Chefs Cuisiniers", demand: "Moyenne" },
    { icon: Truck, title: "Logisticiens", demand: "Forte" },
    { icon: Palette, title: "Designers", demand: "Moyenne" },
    { icon: FlaskConical, title: "Chercheurs", demand: "Forte" },
  ];

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case "Très forte": return "bg-accent text-accent-foreground";
      case "Forte": return "bg-success text-success-foreground";
      default: return "bg-primary/20 text-primary";
    }
  };

  return (
    <section id="profils" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Profils Concernés
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Le programme s'adresse aux professionnels qualifiés dans des secteurs à forte demande en Europe. 
            Découvrez si votre profil est éligible.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {profiles.map((profile, index) => (
            <Card 
              key={index}
              className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <profile.icon className="text-primary" size={28} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{profile.title}</h3>
                  <Badge className={getDemandColor(profile.demand)}>
                    {profile.demand}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-8 md:p-12 bg-gradient-to-br from-accent/10 to-primary/10 border-2">
          <h3 className="text-3xl font-bold mb-6 text-center text-foreground">
            Critères d'Éligibilité
          </h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              "Diplôme ou certification professionnelle reconnu",
              "Expérience professionnelle d'au moins 2 ans",
              "Niveau de langue B1 minimum (français, anglais ou allemand)",
              "Âge entre 21 et 45 ans",
              "Casier judiciaire vierge",
              "Motivation et projet professionnel clair"
            ].map((criterion, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="bg-accent rounded-full w-2 h-2 mt-2 flex-shrink-0" />
                <p className="text-muted-foreground">{criterion}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ProfilesSection;
