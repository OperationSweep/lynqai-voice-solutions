import {
  PhoneCall,
  Calendar,
  MessageSquare,
  BarChart3,
  Zap,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: PhoneCall,
    title: "24/7 Call Handling",
    description: "Never miss a call again. Your AI receptionist answers calls around the clock, even on holidays.",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Automatically book appointments to your calendar. Integrates with Calendly, Cal.com, and more.",
  },
  {
    icon: MessageSquare,
    title: "Natural Conversations",
    description: "Powered by advanced AI, your receptionist handles complex conversations naturally.",
  },
  {
    icon: BarChart3,
    title: "Lead Qualification",
    description: "Score and qualify leads automatically. Get insights on caller intent and urgency.",
  },
  {
    icon: Zap,
    title: "Instant Integrations",
    description: "Connect to your CRM, send SMS follow-ups, and trigger automations via Zapier.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption, HIPAA compliance options, and complete call privacy.",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Capture Every Lead</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features that help you convert more calls into customers, without lifting a finger.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
