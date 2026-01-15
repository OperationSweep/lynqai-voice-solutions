import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does the 14-day free trial work?",
    answer: "When you sign up, you get full access to all features for 14 days at no cost. No credit card required to start. You can upgrade to a paid plan anytime during or after your trial.",
  },
  {
    question: "What happens if I go over my included minutes?",
    answer: "If you exceed your plan's included minutes, you'll be charged the overage rate for your plan ($0.25-$0.50/min depending on your tier). We'll notify you when you reach 80% of your minutes so you can upgrade if needed.",
  },
  {
    question: "Can I customize what my AI receptionist says?",
    answer: "Absolutely! You can fully customize your greeting, business information, call handling preferences, and more. Our AI adapts to your specific industry and business needs.",
  },
  {
    question: "How do I get my phone number?",
    answer: "After subscribing, we automatically provision a dedicated phone number for your business. You can forward your existing business line to this number or share it directly with customers.",
  },
  {
    question: "Does LynqAI integrate with my existing tools?",
    answer: "Yes! We integrate with popular tools including Google Calendar, Calendly, HubSpot, Salesforce, and Zapier. You can also use our webhook API for custom integrations.",
  },
  {
    question: "Is my data secure?",
    answer: "Security is our top priority. We use bank-level encryption, and all data is stored securely. For healthcare providers, we offer HIPAA-compliant configurations. All call recordings and transcripts are encrypted at rest.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees. If you cancel, you'll retain access until the end of your billing period.",
  },
];

export const FAQSection = () => {
  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about LynqAI. Can't find what you're looking for? Contact our support team.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-xl border border-border/50 px-6 data-[state=open]:shadow-card transition-shadow"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
