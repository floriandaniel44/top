import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: t("nav.home"), href: "#accueil" },
    { label: t("nav.about"), href: "#apropos" },
    { label: t("nav.profiles"), href: "#profils" },
    { label: t("nav.benefits"), href: "#avantages" },
    { label: t("nav.procedure"), href: "#procedure" },
    { label: t("nav.faq"), href: "#faq" },
    { label: t("nav.testimonials"), href: "#testimonials" },
    { label: t("nav.contact"), href: "#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <LanguageSwitcher />
            <a href="#accueil" className="text-2xl font-bold text-primary">
             ProVisa
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-foreground/80 hover:text-primary transition-colors"
              >
                {item.label}
              </a>
            ))}
            <Button variant="hero" size="default" asChild>
              <a href="#contact">{t("nav.apply")}</a>
            </Button>
            {isAdmin && (
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin')}
                className="gap-2"
              >
                <Shield className="w-4 h-4" />
                {t("nav.admin")}
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 bg-background/95 backdrop-blur-md">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block py-3 text-foreground/80 hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Button variant="hero" size="default" className="w-full mt-4" asChild>
              <a href="#contact">{t("nav.apply")}</a>
            </Button>
            {isAdmin && (
              <Button 
                variant="outline" 
                onClick={() => {
                  navigate('/admin');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full mt-2 gap-2"
              >
                <Shield className="w-4 h-4" />
                {t("nav.admin")}
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
