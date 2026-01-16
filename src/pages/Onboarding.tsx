import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Scissors, Stethoscope, Phone, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { vapiService, VerticalType } from '@/services/vapiService';
import { cn } from '@/lib/utils';
import { GlassCard, GradientButton } from '@/components/premium';

const verticals = [
  { id: 'real_estate' as VerticalType, name: 'Real Estate', icon: Building2, description: 'Property inquiries, viewings, buyer/seller calls' },
  { id: 'beauty_aesthetics' as VerticalType, name: 'Beauty & Salons', icon: Scissors, description: 'Appointment booking, service inquiries' },
  { id: 'dental' as VerticalType, name: 'Dental Clinic', icon: Stethoscope, description: 'Patient scheduling, dental inquiries' },
];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [selectedVertical, setSelectedVertical] = useState<VerticalType | null>(null);
  const [agentName, setAgentName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState<{ phoneNumber?: string; agentName?: string } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateAgent = async () => {
    if (!selectedVertical) return;
    setIsCreating(true);
    try {
      const response = await vapiService.createAssistant({ vertical: selectedVertical, agentName: agentName || undefined });
      if (response.success) {
        setResult({ phoneNumber: response.phoneNumber, agentName: response.agentName });
        setStep(3);
        toast({ title: 'Success!', description: response.message || 'Your AI receptionist is ready!' });
      } else {
        throw new Error(response.error || 'Failed to create assistant');
      }
    } catch (error) {
      toast({ title: 'Error', description: error instanceof Error ? error.message : 'Something went wrong', variant: 'destructive' });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      </div>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg relative z-10">
        <GlassCard hover={false} className="p-8">
          <div className="text-center mb-8">
            <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold">
              {step === 1 && 'Choose Your Industry'}
              {step === 2 && 'Customize Your Agent'}
              {step === 3 && '🎉 Your AI Receptionist is Live!'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {step === 1 && 'Select the vertical that best fits your business'}
              {step === 2 && 'Optional: Give your AI receptionist a name'}
              {step === 3 && 'Start receiving calls now'}
            </p>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              {verticals.map((v) => (
                <motion.button
                  key={v.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedVertical(v.id)}
                  className={cn(
                    'w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left',
                    selectedVertical === v.id ? 'border-primary bg-primary/10' : 'border-border/50 hover:border-primary/50'
                  )}
                >
                  <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", selectedVertical === v.id ? "gradient-primary" : "bg-muted")}>
                    <v.icon className={cn("h-6 w-6", selectedVertical === v.id ? "text-white" : "text-muted-foreground")} />
                  </div>
                  <div>
                    <p className="font-semibold">{v.name}</p>
                    <p className="text-sm text-muted-foreground">{v.description}</p>
                  </div>
                </motion.button>
              ))}
              <GradientButton className="w-full mt-6" disabled={!selectedVertical} onClick={() => setStep(2)} size="lg">
                Continue
              </GradientButton>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="agentName">Agent Name (Optional)</Label>
                <Input id="agentName" placeholder="e.g., Sarah, Alex, or your business name" value={agentName} onChange={(e) => setAgentName(e.target.value)} className="bg-background/50" />
                <p className="text-sm text-muted-foreground">This is how your AI will introduce itself to callers</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                <GradientButton className="flex-1" onClick={handleCreateAgent} disabled={isCreating} isLoading={isCreating}>
                  {isCreating ? 'Creating...' : 'Activate AI Receptionist'}
                </GradientButton>
              </div>
            </div>
          )}

          {step === 3 && result && (
            <div className="space-y-6 text-center">
              <div className="h-20 w-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-10 w-10 text-accent" />
              </div>
              {result.phoneNumber && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Your AI Receptionist Number</p>
                  <div className="flex items-center justify-center gap-2 text-3xl font-bold gradient-text">
                    <Phone className="h-7 w-7 text-primary" />
                    {result.phoneNumber}
                  </div>
                  <p className="text-sm text-muted-foreground">Call this number now to test your AI receptionist!</p>
                </div>
              )}
              <GradientButton className="w-full" onClick={() => navigate('/dashboard')} size="lg">
                Go to Dashboard
              </GradientButton>
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
}
