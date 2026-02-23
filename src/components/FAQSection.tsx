import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";

const FAQSection = () => {
  const { t } = useTranslation();
  const faqs = [
    {
      question: t("faq.q1.q"),
      answer: t("faq.q1.a")
    },
    {
      question: t("faq.q2.q"),
      answer: t("faq.q2.a")
    },
    {
      question: t("faq.q3.q"),
      answer: t("faq.q3.a")
    },
    {
      question: t("faq.q4.q"),
      answer: t("faq.q4.a")
    },
    {
      question: t("faq.q5.q"),
      answer: t("faq.q5.a")
    },
    {
      question: t("faq.q6.q"),
      answer: t("faq.q6.a")
    },
    {
      question: t("faq.q7.q"),
      answer: t("faq.q7.a")
    },
    {
      question: t("faq.q8.q"),
      answer: t("faq.q8.a")
    }
  ];

  return (
    <section id="faq" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t("faq.title")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("faq.subtitle")}
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
