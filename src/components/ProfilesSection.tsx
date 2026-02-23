import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Stethoscope,  
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
import { useTranslation } from "react-i18next";

const ProfilesSection = () => {
  const { t } = useTranslation();
  const profiles = [
    { icon: Stethoscope, title: t("profiles.list.docs"), demand: t("profiles.demand.very_high") },
    { icon: Wrench, title: t("profiles.list.engineers"), demand: t("profiles.demand.high") },
    { icon: GraduationCap, title: t("profiles.list.teachers"), demand: t("profiles.demand.medium") },
    { icon: Briefcase, title: t("profiles.list.managers"), demand: t("profiles.demand.medium") },
    { icon: Heart, title: t("profiles.list.social"), demand: t("profiles.demand.high") },
    { icon: Calculator, title: t("profiles.list.accountants"), demand: t("profiles.demand.medium") },
    { icon: Building, title: t("profiles.list.architects"), demand: t("profiles.demand.medium") },
    { icon: ChefHat, title: t("profiles.list.chefs"), demand: t("profiles.demand.medium") },
    { icon: Truck, title: t("profiles.list.logistics"), demand: t("profiles.demand.high") },
    { icon: Palette, title: t("profiles.list.designers"), demand: t("profiles.demand.medium") },
    { icon: FlaskConical, title: t("profiles.list.researchers"), demand: t("profiles.demand.high") },
  ];

  const getDemandColor = (demand: string) => {
    if (demand === t("profiles.demand.very_high")) return "bg-accent text-accent-foreground";
    if (demand === t("profiles.demand.high")) return "bg-success text-success-foreground";
    return "bg-primary/20 text-primary";
  };

  return (
    <section id="profils" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t("profiles.title")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("profiles.subtitle")}
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
            {t("profiles.eligibility.title")}
          </h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              t("profiles.eligibility.c1"),
              t("profiles.eligibility.c2"),
              t("profiles.eligibility.c3"),
              t("profiles.eligibility.c4"),
              t("profiles.eligibility.c5"),
              t("profiles.eligibility.c6")
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
