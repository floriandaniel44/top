import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, Download } from "lucide-react";
import jsPDF from "jspdf";

const ProcedureSection = () => {
  const documents = [
    "Passeport valide (6 mois minimum)",
    "Diplômes et certificats professionnels",
    "CV détaillé et lettre de motivation",
    "Justificatifs d'expérience professionnelle",
    "Certificat de langue (DELF, TOEFL, etc.)",
    "Extrait de casier judiciaire",
    "Certificat médical",
    "Photos d'identité récentes"
  ];

  const handleDownloadList = () => {
    const doc = new jsPDF();
    
    // Titre
    doc.setFontSize(20);
    doc.text("Liste Complète des Documents Requis", 20, 20);
    
    // Sous-titre
    doc.setFontSize(12);
    doc.text("Programme de Visa Professionnel - ProVisa", 20, 35);
    
    // Liste des documents
    doc.setFontSize(11);
    let yPosition = 50;
    
    documents.forEach((doc_item, index) => {
      doc.text(`${index + 1}. ${doc_item}`, 20, yPosition);
      yPosition += 10;
    });
    
    // Note en bas
    yPosition += 10;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Note: Tous les documents doivent être traduits en français ou anglais", 20, yPosition);
    doc.text("et certifiés conformes par un traducteur agréé.", 20, yPosition + 7);
    
    // Télécharger
    doc.save("liste-documents-provisa.pdf");
  };

  const steps = [
    {
      number: 1,
      title: "Évaluation Initiale",
      description: "Remplissez notre formulaire en ligne pour évaluer votre éligibilité au programme.",
      duration: "1-3 jours"
    },
    {
      number: 2,
      title: "Constitution du Dossier",
      description: "Notre équipe vous guide dans la préparation de tous les documents nécessaires.",
      duration: "2-3 semaines"
    },
    {
      number: 3,
      title: "Soumission de la Demande",
      description: "Nous soumettons votre dossier complet aux autorités compétentes du pays choisi.",
      duration: "1 semaine"
    },
    {
      number: 4,
      title: "Traitement Administratif",
      description: "Les autorités examinent votre demande. Nous assurons le suivi régulier.",
      duration: "2-4 mois"
    },
    {
      number: 5,
      title: "Décision & Visa",
      description: "Réception de la décision et délivrance de votre titre de séjour professionnel.",
      duration: "1-2 semaines"
    },
    {
      number: 6,
      title: "Préparation au Départ",
      description: "Accompagnement pour le logement, le voyage et l'installation dans votre nouveau pays.",
      duration: "2-4 semaines"
    }
  ];

  return (
    <section id="procedure" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Procédure de Candidature
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Un processus clair et structuré pour maximiser vos chances de succès
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {index < steps.length - 1 && (
                  <div className="absolute left-8 top-20 bottom-0 w-0.5 bg-gradient-to-b from-primary to-accent -translate-x-1/2" />
                )}
                <Card className="p-6 md:p-8 hover:shadow-lg transition-all duration-300">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-2xl shadow-lg">
                        {step.number}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-2xl font-bold text-foreground">{step.title}</h3>
                        <span className="text-sm font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">
                          {step.duration}
                        </span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          <Card className="mt-12 p-8 md:p-12 bg-gradient-to-br from-primary/5 to-accent/5 border-2">
            <h3 className="text-3xl font-bold mb-6 text-center text-foreground">
              Documents Requis
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {documents.map((doc, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="text-success flex-shrink-0" size={20} />
                  <span className="text-muted-foreground">{doc}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button variant="hero" size="xl" onClick={handleDownloadList}>
                <Download className="mr-2" size={20} />
                Télécharger la Liste Complète
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProcedureSection;
