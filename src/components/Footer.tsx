import { Facebook, Twitter } from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">ProVisa</h3>
            <p className="text-primary-foreground/80 text-sm">
              {t("footer.desc")}
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">{t("footer.program")}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#apropos" className="text-primary-foreground/80 hover:text-primary-foreground">{t("nav.about")}</a></li>
              <li><a href="#profils" className="text-primary-foreground/80 hover:text-primary-foreground">{t("nav.profiles")}</a></li>
              <li><a href="#avantages" className="text-primary-foreground/80 hover:text-primary-foreground">{t("nav.benefits")}</a></li>
              <li><a href="#procedure" className="text-primary-foreground/80 hover:text-primary-foreground">{t("nav.procedure")}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">{t("footer.resources")}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#faq" className="text-primary-foreground/80 hover:text-primary-foreground">{t("nav.faq")}</a></li>
              <li><a href="#testimonials" className="text-primary-foreground/80 hover:text-primary-foreground">{t("nav.testimonials")}</a></li>
              <li><a href="#contact" className="text-primary-foreground/80 hover:text-primary-foreground">{t("nav.contact")}</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">{t("footer.follow")}</h4>
            <div className="flex gap-4">
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Twitter size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/60">
          <p>{t("footer.rights")}</p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="#" className="hover:text-primary-foreground">{t("footer.links.legal")}</a>
            <a href="#" className="hover:text-primary-foreground">{t("footer.links.privacy")}</a>
            <a href="#" className="hover:text-primary-foreground">{t("footer.links.terms")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
