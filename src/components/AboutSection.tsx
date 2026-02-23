import { Card } from "@/components/ui/card";
import { Target, Users, Award } from "lucide-react";
import { useTranslation } from "react-i18next";

const AboutSection = () => {
  const { t } = useTranslation();
  const features = [
    {
      icon: Target,
      title: t("about.mission_title"),
      description: t("about.mission_desc")
    },
    {
      icon: Users,
      title: t("about.profiles_title"),
      description: t("about.profiles_desc")
    },
    {
      icon: Award,
      title: t("about.excellence_title"),
      description: t("about.excellence_desc")
    }
  ];

  return (
    <section id="apropos" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t("about.title")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("about.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2"
            >
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <feature.icon className="text-primary" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>

        <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6 text-foreground">
                {t("about.why_title")}
              </h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  {t("about.why_p1")}
                </p>
                <p>
                  {t("about.why_p2")}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-6 text-foreground">
                {t("about.partners_title")}
              </h3>
              <div className="space-y-4">
                {["🇫🇷 France", "🇧🇪 Belgique", "🇨🇭 Suisse"].map((country, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-4 p-4 bg-background rounded-lg shadow-sm"
                  >
                    <span className="text-3xl">{country.split(" ")[0]}</span>
                    <span className="text-lg font-semibold text-foreground">
                      {country.split(" ")[1]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default AboutSection;
