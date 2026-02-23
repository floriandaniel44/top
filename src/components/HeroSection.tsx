import { Button } from "@/components/ui/button";
import { ArrowRight, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import heroImage from "@/assets/hero-image.jpg";

const HeroSection = () => {
  const { t } = useTranslation();
  return (
    <section id="accueil" className="relative min-h-screen flex items-center pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Professional international environment"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-6 animate-fade-in">
            <Globe className="text-accent" size={32} />
            <span className="text-accent font-semibold text-lg">
              {t("hero.badge")}
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 animate-fade-in-up">
            {t("hero.title")}
          </h1>
          
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 leading-relaxed animate-fade-in-up animation-delay-200">
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-400">
            <Button variant="accent" size="xl" className="group" asChild>
              <a href="#contact">
                {t("hero.cta_start")}
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button 
              variant="outline" 
              size="xl"
              className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
              asChild
            >
              <a href="#apropos">{t("hero.cta_learn")}</a>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 animate-fade-in-up animation-delay-600">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">3</div>
              <div className="text-primary-foreground/80 text-sm">{t("hero.stat_countries")}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">15+</div>
              <div className="text-primary-foreground/80 text-sm">{t("hero.stat_professions")}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">100%</div>
              <div className="text-primary-foreground/80 text-sm">{t("hero.stat_support")}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
