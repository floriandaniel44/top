import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "Qui peut participer à ce programme ?",
      answer: "Le programme s'adresse aux professionnels qualifiés âgés de 21 à 45 ans, possédant un diplôme reconnu et au moins 2 ans d'expérience dans leur domaine. Les secteurs prioritaires incluent la santé, l'IT, l'ingénierie, et l'enseignement."
    },
    {
      question: "Combien coûte la participation au programme ?",
      answer: "Les frais de participation varient selon le pays choisi et votre situation. Ils incluent les frais administratifs, l'accompagnement personnalisé et les démarches consulaires. Contactez-nous pour un devis personnalisé. La bourse internationale que vous recevrez couvre largement ces frais."
    },
    {
      question: "Combien de temps prend le processus complet ?",
      answer: "En moyenne, le processus complet prend entre 3 et 6 mois, de la soumission du dossier à l'obtention du visa. Ce délai peut varier selon le pays et la période de l'année."
    },
    {
      question: "Puis-je choisir le pays de destination ?",
      answer: "Oui, vous pouvez indiquer vos préférences parmi la France, la Belgique et la Suisse. Nous vous conseillerons sur le pays le plus adapté à votre profil et à vos objectifs professionnels."
    },
    {
      question: "Le titre de séjour est-il renouvelable ?",
      answer: "Oui, le titre de séjour initial est généralement valable 3 ans et peut être renouvelé si vous maintenez une activité professionnelle dans le pays d'accueil. Après 5 ans, vous pourrez demander un titre de résident permanent."
    },
    {
      question: "Puis-je venir avec ma famille ?",
      answer: "Oui, le regroupement familial est possible. Votre conjoint(e) et vos enfants peuvent vous accompagner ou vous rejoindre ultérieurement. Des conditions spécifiques s'appliquent selon le pays."
    },
    {
      question: "Que se passe-t-il si ma demande est refusée ?",
      answer: "En cas de refus, nous analysons les raisons et vous proposons un plan d'action. Vous pouvez généralement faire appel ou soumettre une nouvelle demande après avoir corrigé les points problématiques."
    },
    {
      question: "Dois-je déjà avoir une offre d'emploi ?",
      answer: "Non, ce programme ne requiert pas d'offre d'emploi préalable. Cependant, avoir des contacts professionnels ou des pistes dans le pays d'accueil peut renforcer votre dossier."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Questions Fréquentes
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Trouvez les réponses aux questions les plus courantes sur le programme
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border-2 rounded-lg px-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
