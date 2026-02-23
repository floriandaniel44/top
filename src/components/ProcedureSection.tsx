import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, Download } from "lucide-react";
import jsPDF from "jspdf";
import { useTranslation } from "react-i18next";

const ProcedureSection = () => {
  const { t } = useTranslation();
  const documents = [
    t("procedure.docs.list.passport"),
    t("procedure.docs.list.diplomas"),
    t("procedure.docs.list.cv"),
    t("procedure.docs.list.experience"),
    t("procedure.docs.list.language"),
    t("procedure.docs.list.criminal"),
    t("procedure.docs.list.medical"),
    t("procedure.docs.list.photos"),
  ];

 const handleDownloadList = async () => {
  try {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 40;

    // helper: fetch image and convert to dataURL
    const fetchImageDataUrl = async (url: string) => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Image not found");
        const blob = await res.blob();
        return await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(String(reader.result));
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (e) {
        console.warn("Failed to load image for PDF", e);
        return null;
      }
    };

    // Draw colored border frame
    doc.setDrawColor(6, 182, 212); // teal
    doc.setLineWidth(8);
    doc.rect(margin / 2, margin / 2, pageW - margin, pageH - margin);

    // Try to load logo
    const logoDataUrl = await fetchImageDataUrl("/logo.png");
    const headerY = 100;

    // Header: logo + title
    if (logoDataUrl) {
      try {
        doc.addImage(logoDataUrl, "PNG", margin + 6, headerY - 30, 64, 64);
      } catch (e) {
        // ignore image errors
      }
    }

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(4, 47, 42);
    const titleX = margin + (logoDataUrl ? 90 : 6);
    const titleText = t("procedure.docs.pdf.title");
    const wrappedTitle = doc.splitTextToSize(titleText, pageW - titleX - margin);
    doc.text(wrappedTitle, titleX, headerY - (wrappedTitle.length > 1 ? 10 : 0));
    
    // Adjust headerY for subtitle if title is wrapped
    const subTitleY = headerY + (wrappedTitle.length > 1 ? 25 : 18);

    // Subtitle
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 119, 110);
    doc.text(t("procedure.docs.pdf.program"), titleX, subTitleY);

    // Accent line
    doc.setDrawColor(6, 182, 212);
    doc.setLineWidth(2);
    doc.line(margin, headerY + 40, pageW - margin, headerY + 40);

    // Sous-titre détaché : Bienvenue
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(6, 95, 85);
    doc.text(t("procedure.docs.pdf.welcome"), margin + 20, headerY + 80);

    // Bloc de paragraphe explicatif
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(17, 24, 39);

    const introParagraph = [
      t("procedure.docs.pdf.intro1"),
      t("procedure.docs.pdf.intro2"),
      t("procedure.docs.pdf.intro3"),
      t("procedure.docs.pdf.intro4")
    ];

    let y = headerY + 110;
    const lineHeight = 18;

    introParagraph.forEach((line) => {
      const wrapped = doc.splitTextToSize(line, pageW - margin * 2 - 40);
      wrapped.forEach((textLine) => {
        doc.text(textLine, margin + 20, y);
        y += lineHeight;
      });
      y += 6;
    });

    y += 20; // marge avant la liste

    // Liste des documents
    for (let i = 0; i < documents.length; i++) {
      const text = `– ${documents[i]}`;
      const split = doc.splitTextToSize(text, pageW - margin * 2 - 40);

      for (let j = 0; j < split.length; j++) {
        const line = split[j];
        const x = margin + 20;
        doc.text(line, x, y);
        y += lineHeight;
      }

      y += 6;

      if (y > pageH - margin - 60) {
        doc.addPage();
        doc.setDrawColor(6, 182, 212);
        doc.setLineWidth(8);
        doc.rect(margin / 2, margin / 2, pageW - margin, pageH - margin);
        const newHeaderY = margin + 30;
        doc.setDrawColor(6, 182, 212);
        doc.setLineWidth(2);
        doc.line(margin, newHeaderY + 40, pageW - margin, newHeaderY + 40);
        y = newHeaderY + 90;
      }
    }

    // Footer
    const footerText = t("procedure.docs.pdf.footer");
    doc.setFontSize(10);
    doc.setTextColor(99, 115, 129);
    doc.text(footerText, margin + 10, pageH - margin - 10);

    // Save
    doc.save(`${t("procedure.docs.pdf.filename")}.pdf`);
  } catch (err) {
    console.error("Erreur génération PDF:", err);
  }
};

  const steps = [
    {
      number: 1,
      title: t("procedure.steps.s1.title"),
      description: t("procedure.steps.s1.desc"),
      duration: t("procedure.steps.s1.duration"),
    },
    {
      number: 2,
      title: t("procedure.steps.s2.title"),
      description: t("procedure.steps.s2.desc"),
      duration: t("procedure.steps.s2.duration"),
    },
    {
      number: 3,
      title: t("procedure.steps.s3.title"),
      description: t("procedure.steps.s3.desc"),
      duration: t("procedure.steps.s3.duration"),
    },
    {
      number: 4,
      title: t("procedure.steps.s4.title"),
      description: t("procedure.steps.s4.desc"),
      duration: t("procedure.steps.s4.duration"),
    },
    {
      number: 5,
      title: t("procedure.steps.s5.title"),
      description: t("procedure.steps.s5.desc"),
      duration: t("procedure.steps.s5.duration"),
    },
    {
      number: 6,
      title: t("procedure.steps.s6.title"),
      description: t("procedure.steps.s6.desc"),
      duration: t("procedure.steps.s6.duration"),
    },
  ];

  return (
    <section id="procedure" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t("procedure.title")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("procedure.subtitle")}
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
                        <h3 className="text-2xl font-bold text-foreground">
                          {step.title}
                        </h3>
                        <span className="text-sm font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">
                          {step.duration}
                        </span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          <Card className="mt-12 p-8 md:p-12 bg-gradient-to-br from-primary/5 to-accent/5 border-2">
            <h3 className="text-3xl font-bold mb-6 text-center text-foreground">
              {t("procedure.docs.title")}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {documents.map((doc, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle
                    className="text-success flex-shrink-0"
                    size={20}
                  />
                  <span className="text-muted-foreground">{doc}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button variant="hero" size="xl" onClick={handleDownloadList}>
                <Download className="mr-2" size={20} />
                {t("procedure.docs.download")}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProcedureSection;
