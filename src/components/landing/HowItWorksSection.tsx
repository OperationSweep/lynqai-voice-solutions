import { Check } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Sign Up & Choose Your Plan",
    description: "Create your account and select the plan that fits your business. Start with a 14-day free trial.",
  },
  {
    number: "02",
    title: "Configure Your AI Agent",
    description: "Customize your greeting, business hours, and call handling preferences. Connect your calendar.",
  },
  {
    number: "03",
    title: "Get Your Phone Number",
    description: "We'll provision a dedicated phone number for your AI receptionist. Forward your calls or use it directly.",
  },
  {
    number: "04",
    title: "Start Capturing Leads",
    description: "Your AI receptionist is live! Monitor calls, view transcripts, and watch leads flow into your dashboard.",
  },
];

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get Started in <span className="gradient-text">Minutes</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Setting up your AI receptionist is simple. Follow these four steps and start capturing leads today.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-accent hidden sm:block" />

            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`relative flex items-start gap-6 mb-12 last:mb-0 animate-slide-up ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Step number bubble */}
                <div className="relative z-10 flex-shrink-0 w-16 h-16 rounded-full gradient-primary flex items-center justify-center shadow-glow">
                  <span className="text-xl font-bold text-primary-foreground">{step.number}</span>
                </div>

                {/* Content */}
                <div className={`flex-1 bg-card rounded-2xl p-6 border border-border/50 shadow-card ${
                  index % 2 === 0 ? "md:mr-[calc(50%-4rem)]" : "md:ml-[calc(50%-4rem)]"
                }`}>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
