import { Building2, Scissors, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

const verticals = [
  {
    name: "LynqAgent",
    title: "Real Estate",
    description: "Never miss a lead. Qualify buyers, schedule showings, and capture property inquiries 24/7.",
    icon: Building2,
    gradient: "from-indigo-500 to-indigo-600",
    features: ["Lead qualification", "Showing scheduling", "Property info delivery"],
  },
  {
    name: "LynqBook",
    title: "Beauty & Salons",
    description: "Streamline bookings and reduce no-shows. Your clients can book appointments anytime.",
    icon: Scissors,
    gradient: "from-purple-500 to-purple-600",
    features: ["Appointment booking", "Reminder calls", "Service inquiries"],
  },
  {
    name: "LynqCare",
    title: "Dental Clinics",
    description: "Handle patient calls professionally. Book appointments and answer common questions.",
    icon: Stethoscope,
    gradient: "from-emerald-500 to-emerald-600",
    features: ["Patient scheduling", "Insurance questions", "Emergency routing"],
  },
];

export const VerticalsSection = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Built for Your <span className="gradient-text">Industry</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            LynqAI is tailored to handle the specific needs of your business vertical, with industry-specific scripts and workflows.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {verticals.map((vertical, index) => (
            <div
              key={vertical.name}
              className="group relative bg-card rounded-2xl p-8 shadow-card hover:shadow-glow transition-all duration-300 border border-border/50 hover:border-primary/30 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={cn(
                  "inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br mb-6",
                  vertical.gradient
                )}
              >
                <vertical.icon className="h-7 w-7 text-white" />
              </div>

              <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                {vertical.name}
              </div>
              <h3 className="text-xl font-bold mb-3">{vertical.title}</h3>
              <p className="text-muted-foreground mb-6">{vertical.description}</p>

              <ul className="space-y-2">
                {vertical.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
