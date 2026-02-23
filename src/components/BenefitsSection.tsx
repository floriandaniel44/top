import { Card } from "@/components/ui/card";
import { FileText, DollarSign, HandHeart, Home, Plane, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

const BenefitsSection = () => {
  const { t } = useTranslation();
  const benefits = [
    {
      icon: FileText,
      title: t("benefits.residence.title"),
      description: t("benefits.residence.desc"),
      color: "bg-primary/10"
    },
    {
      icon: DollarSign,
      title: t("benefits.grant.title"),
      description: t("benefits.grant.desc"),
      color: "bg-accent/10"
    },
    {
      icon: HandHeart,
      title: t("benefits.support.title"),
      description: t("benefits.support.desc"),
      color: "bg-success/10"
    },
    {
      icon: Home,
      title: t("benefits.housing.title"),
      description: t("benefits.housing.desc"),
      color: "bg-primary/10"
    },
    {
      icon: Plane,
      title: t("benefits.travel.title"),
      description: t("benefits.travel.desc"),
      color: "bg-accent/10"
    },
    {
      icon: Shield,
      title: t("benefits.insurance.title"),
      description: t("benefits.insurance.desc"),
      color: "bg-success/10"
    }
  ];

  return (
    <section id="avantages" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t("benefits.title")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("benefits.subtitle")}
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
              {t("benefits.why.title")}
            </h3>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-95">
              {t("benefits.why.desc")}
            </p>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div>
                <div className="text-5xl font-bold mb-2 text-accent">95%</div>
                <div className="text-lg opacity-90">{t("benefits.why.rate")}</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2 text-accent">3-6</div>
                <div className="text-lg opacity-90">{t("benefits.why.time")}</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2 text-accent">24/7</div>
                <div className="text-lg opacity-90">{t("benefits.why.support")}</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default BenefitsSection;
