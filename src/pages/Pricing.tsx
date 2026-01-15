import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Check, Star, Building2, Scissors, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Vertical = "real_estate" | "beauty" | "dental";

const verticals = [
  { id: "real_estate" as Vertical, name: "Real Estate", icon: Building2 },
  { id: "beauty" as Vertical, name: "Beauty & Salons", icon: Scissors },
  { id: "dental" as Vertical, name: "Dental Clinics", icon: Stethoscope },
];

const plans = [
  {
    name: "Starter",
    tier: "starter",
    monthlyPrice: 97,
    yearlyPrice: 81,
    description: "Perfect for small businesses just getting started",
    features: [
      "200 minutes included",
      "1 phone number",
      "24/7 AI receptionist",
      "Call transcripts",
      "Basic CRM sync",
      "Email support",
      "$0.35/min overage",
    ],
    popular: false,
  },
  {
    name: "Professional",
    tier: "professional",
    monthlyPrice: 297,
    yearlyPrice: 247,
    description: "For growing businesses that need more power",
    features: [
      "600 minutes included",
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
    tier: "growth",
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
      "$0.35/min overage",
    ],
    popular: false,
  },
];

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedVertical, setSelectedVertical] = useState<Vertical>("real_estate");
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubscribe = async (tier: string) => {
    if (!user) {
      navigate("/signup");
      return;
    }

    setLoadingTier(tier);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          tier,
          successUrl: `${window.location.origin}/dashboard?checkout=success`,
          cancelUrl: `${window.location.origin}/pricing?checkout=canceled`,
        }
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, Transparent <span className="gradient-text">Pricing</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose the plan that fits your business. All plans include a 14-day free trial.
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-muted rounded-xl p-1">
              {verticals.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVertical(v.id)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all",
                    selectedVertical === v.id
                      ? "bg-card shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <v.icon className="h-4 w-4" />
                  {v.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={cn("text-sm font-medium", !isAnnual && "text-primary")}>Monthly</span>
            <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
            <span className={cn("text-sm font-medium", isAnnual && "text-primary")}>
              Annual
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-accent">
                2 Months Free
              </span>
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  "relative rounded-2xl p-8 transition-all duration-300",
                  plan.popular
                    ? "bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-glow scale-105"
                    : "bg-card border border-border/50 shadow-card hover:border-primary/30"
                )}
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
                      Billed annually (${plan.yearlyPrice * 12}/year)
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
                  onClick={() => handleSubscribe(plan.tier)}
                  disabled={loadingTier === plan.tier}
                >
                  {loadingTier === plan.tier ? "Loading..." : user ? "Subscribe Now" : "Start Free Trial"}
                </Button>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-muted-foreground">
              Have questions?{" "}
              <a href="/#faq" className="text-primary font-medium hover:underline">
                Check our FAQ
              </a>{" "}
              or{" "}
              <a href="#" className="text-primary font-medium hover:underline">
                contact sales
              </a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
