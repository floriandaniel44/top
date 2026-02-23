import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import aminataDiallo from "@/assets/testimonials/aminata-diallo.jpg";
import carlosSilva from "@/assets/testimonials/carlos-silva.jpg";
import sophieKowalski from "@/assets/testimonials/sophie-kowalski.jpg";
import ahmedHassan from "@/assets/testimonials/ahmed-hassan.jpg";
import mariaSantos from "@/assets/testimonials/maria-santos.jpg";
import davidNguyen from "@/assets/testimonials/david-nguyen.jpg";

const TestimonialsSection = () => {
  const { t } = useTranslation();
  const testimonials = [
    {
      name: "Dr. Maguérith Pichet",
      profession: t("testimonials.professions.doctor"),
      country: "France",
      image: aminataDiallo,
      rating: 5,
      text: t("testimonials.list.t1.text")
    },
    {
      name: "Carlos Silva",
      profession: t("testimonials.professions.engineer"),
      country: "Belgique",
      image: carlosSilva,
      rating: 5,
      text: t("testimonials.list.t2.text")
    },
    {
      name: "Sophie Boere",
      profession: t("testimonials.professions.teacher"),
      country: "Suisse",
      image: sophieKowalski,
      rating: 5,
      text: t("testimonials.list.t3.text")
    },
    {
      name: "Ahmed Hassan",
      profession: t("testimonials.professions.chef"),
      country: "France",
      image: ahmedHassan,
      rating: 5,
      text: t("testimonials.list.t4.text")
    },
    {
      name: "Maria Lahir",
      profession: t("testimonials.professions.nurse"),
      country: "Belgique",
      image: mariaSantos,
      rating: 4,
      text: t("testimonials.list.t5.text")
    },
    {
      name: "David Nguyen",
      profession: t("testimonials.professions.architect"),
      country: "Suisse",
      image: davidNguyen,
      rating: 4,
      text: t("testimonials.list.t6.text")
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t("testimonials.title")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("testimonials.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div>
                <div className="mb-4 flex justify-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
                  />
                </div>
                
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-accent fill-accent" size={16} />
                  ))}
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>

                <div className="border-t pt-4">
                  <p className="font-bold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.profession}</p>
                  <p className="text-sm text-accent font-semibold mt-1">
                      {testimonial.country}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
