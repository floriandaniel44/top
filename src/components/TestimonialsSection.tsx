import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Dr. Aminata Diallo",
      profession: "Médecin Généraliste",
      country: "France",
      image: "👩🏾‍⚕️",
      rating: 5,
      text: "Grâce à ce programme, j'ai pu obtenir mon titre de séjour en 4 mois seulement. L'accompagnement a été exceptionnel, et la bourse m'a vraiment aidée à m'installer sereinement à Lyon."
    },
    {
      name: "Carlos Silva",
      profession: "Ingénieur Logiciel",
      country: "Belgique",
      image: "👨🏽‍💻",
      rating: 5,
      text: "Un processus fluide et transparent du début à la fin. L'équipe a géré tous les aspects administratifs, me permettant de me concentrer sur ma recherche d'emploi. Je travaille maintenant à Bruxelles !"
    },
    {
      name: "Sophie Kowalski",
      profession: "Enseignante",
      country: "Suisse",
      image: "👩🏼‍🏫",
      rating: 5,
      text: "Je recommande vivement ce programme. Le soutien personnalisé et les conseils précieux m'ont permis de réaliser mon rêve de vivre et enseigner en Suisse. Merci infiniment !"
    },
    {
      name: "Ahmed Hassan",
      profession: "Chef Cuisinier",
      country: "France",
      image: "👨🏻‍🍳",
      rating: 5,
      text: "L'équipe a été d'une aide précieuse pour préparer mon dossier et trouver un logement à Paris. Le processus a été plus rapide que prévu et la bourse m'a beaucoup aidé financièrement."
    },
    {
      name: "Maria Santos",
      profession: "Infirmière",
      country: "Belgique",
      image: "👩🏻‍⚕️",
      rating: 5,
      text: "Une expérience formidable ! Tout a été géré professionnellement et j'ai été informée à chaque étape. Je travaille maintenant dans un hôpital à Anvers et je suis très heureuse."
    },
    {
      name: "David Nguyen",
      profession: "Architecte",
      country: "Suisse",
      image: "👨🏻‍💼",
      rating: 5,
      text: "Service impeccable et résultats rapides. En 5 mois, j'avais mon visa et j'étais installé à Genève. Le programme offre vraiment ce qu'il promet. Une opportunité à ne pas manquer !"
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Témoignages de Réussite
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez les histoires inspirantes de professionnels qui ont réussi leur projet d'expatriation
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div>
                <div className="text-6xl mb-4">{testimonial.image}</div>
                
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
