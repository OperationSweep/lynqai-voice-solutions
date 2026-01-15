import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "LynqAI has completely transformed how we handle leads. We're booking 3x more showings and never miss a call anymore.",
    author: "Sarah Johnson",
    role: "Real Estate Broker",
    company: "Premier Properties",
    avatar: "SJ",
  },
  {
    quote: "Our no-show rate dropped by 40% since implementing LynqBook. The appointment reminders are a game-changer.",
    author: "Michael Chen",
    role: "Salon Owner",
    company: "Luxe Hair Studio",
    avatar: "MC",
  },
  {
    quote: "Patients love being able to schedule appointments 24/7. Our staff can now focus on in-office care instead of phones.",
    author: "Dr. Emily Rodriguez",
    role: "Dental Practice Owner",
    company: "Bright Smile Dental",
    avatar: "ER",
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Loved by <span className="gradient-text">Thousands</span> of Businesses
          </h2>
          <p className="text-lg text-muted-foreground">
            See what our customers have to say about their experience with LynqAI.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
              className="bg-card rounded-2xl p-8 border border-border/50 shadow-card animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-foreground mb-6">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
