import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    monthlyPrice: 97,
    yearlyPrice: 81,
    description: "Perfect for small businesses just getting started",
    features: [
      "100 minutes included",
      "1 phone number",
      "24/7 AI receptionist",
      "Call transcripts",
      "Basic CRM sync",
      "Email support",
      "$0.50/min overage",
    ],
    popular: false,
  },
  {
    name: "Professional",
    monthlyPrice: 297,
    yearlyPrice: 247,
    description: "For growing businesses that need more power",
    features: [
      "500 minutes included",
      "2 phone numbers",
      "Everything in Starter",
      "SMS follow-ups",
      "3 custom workflows",
      "Priority support",
      "$0.35/min overage",
    ],
    popular: true,
  },
  {
    name: "Growth",
    monthlyPrice: 597,
    yearlyPrice: 497,
    description: "For businesses ready to scale",
    features: [
      "1,500 minutes included",
      "5 phone numbers",
      "Everything in Professional",
      "Unlimited workflows",
      "White-label option",
      "Dedicated account manager",
      "$0.25/min overage",
    ],
    popular: false,
  },
];

export const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Choose the plan that fits your business. All plans include a 14-day free trial.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={cn("text-sm font-medium", !isAnnual && "text-primary")}>Monthly</span>
            <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
            <span className={cn("text-sm font-medium", isAnnual && "text-primary")}>
              Annual
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-accent">
                Save 17%
              </span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={cn(
                "relative rounded-2xl p-8 transition-all duration-300 animate-slide-up",
                plan.popular
                  ? "bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-glow scale-105"
                  : "bg-card border border-border/50 shadow-card hover:border-primary/30"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-4 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                  <Star className="h-4 w-4" />
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className={cn("text-xl font-bold mb-2", !plan.popular && "text-foreground")}>
                  {plan.name}
                </h3>
                <p className={cn("text-sm mb-4", plan.popular ? "text-primary-foreground/80" : "text-muted-foreground")}>
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className={cn("text-4xl font-bold", !plan.popular && "text-foreground")}>
                    ${isAnnual ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span className={cn("text-sm", plan.popular ? "text-primary-foreground/80" : "text-muted-foreground")}>
                    /month
                  </span>
                </div>
                {isAnnual && (
                  <p className={cn("text-sm mt-1", plan.popular ? "text-primary-foreground/80" : "text-muted-foreground")}>
                    Billed annually
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className={cn("h-5 w-5 flex-shrink-0 mt-0.5", plan.popular ? "text-accent" : "text-accent")} />
                    <span className={cn("text-sm", plan.popular ? "text-primary-foreground/90" : "text-muted-foreground")}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={plan.popular ? "hero-outline" : "hero"}
                size="lg"
                onClick={() => navigate("/signup")}
              >
                Start Free Trial
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
