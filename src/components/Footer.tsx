import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Évoluez International</h3>
            <p className="text-primary-foreground/80 text-sm">
              Votre partenaire pour une carrière internationale réussie en Europe.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Programme</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#apropos" className="text-primary-foreground/80 hover:text-primary-foreground">À propos</a></li>
              <li><a href="#profils" className="text-primary-foreground/80 hover:text-primary-foreground">Profils</a></li>
              <li><a href="#avantages" className="text-primary-foreground/80 hover:text-primary-foreground">Avantages</a></li>
              <li><a href="#procedure" className="text-primary-foreground/80 hover:text-primary-foreground">Procédure</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Ressources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#faq" className="text-primary-foreground/80 hover:text-primary-foreground">FAQ</a></li>
              <li><a href="#testimonials" className="text-primary-foreground/80 hover:text-primary-foreground">Témoignages</a></li>
              <li><a href="#contact" className="text-primary-foreground/80 hover:text-primary-foreground">Contact</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Suivez-nous</h4>
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
          <p>© 2025 Évoluez International. Tous droits réservés.</p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="#" className="hover:text-primary-foreground">Mentions légales</a>
            <a href="#" className="hover:text-primary-foreground">Politique de confidentialité</a>
            <a href="#" className="hover:text-primary-foreground">CGU</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
