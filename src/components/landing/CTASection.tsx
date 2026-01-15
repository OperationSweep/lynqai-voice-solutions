import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-primary opacity-95" />
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
          Ready to Never Miss a Call Again?
        </h2>
        <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
          Join thousands of businesses using LynqAI to capture more leads, book more appointments, and grow their revenue.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="hero-outline"
            size="xl"
            onClick={() => navigate("/signup")}
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button variant="hero-outline" size="xl">
            Talk to Sales
          </Button>
        </div>

        <p className="text-sm text-primary-foreground/60 mt-6">
          No credit card required • 14-day free trial • Cancel anytime
        </p>
      </div>
    </section>
  );
};
