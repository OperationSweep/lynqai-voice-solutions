import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Scissors, Stethoscope, Phone, CheckCircle2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { vapiService, VerticalType } from '@/services/vapiService';
import { cn } from '@/lib/utils';

const verticals = [
  { 
    id: 'real_estate' as VerticalType, 
    name: 'Real Estate', 
    icon: Building2,
    description: 'Property inquiries, viewings, buyer/seller calls'
  },
  { 
    id: 'beauty_aesthetics' as VerticalType, 
    name: 'Beauty & Salons', 
    icon: Scissors,
    description: 'Appointment booking, service inquiries'
  },
  { 
    id: 'dental' as VerticalType, 
    name: 'Dental Clinic', 
    icon: Stethoscope,
    description: 'Patient scheduling, dental inquiries'
  },
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
      const response = await vapiService.createAssistant({
        vertical: selectedVertical,
        agentName: agentName || undefined,
      });

      if (response.success) {
        setResult({
          phoneNumber: response.phoneNumber,
          agentName: response.agentName,
        });
        setStep(3);
        toast({
          title: 'Success!',
          description: response.message || 'Your AI receptionist is ready!',
        });
      } else {
        throw new Error(response.error || 'Failed to create assistant');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {step === 1 && 'Choose Your Industry'}
            {step === 2 && 'Customize Your Agent'}
            {step === 3 && '🎉 Your AI Receptionist is Live!'}
          </CardTitle>
          <CardDescription>
            {step === 1 && 'Select the vertical that best fits your business'}
            {step === 2 && 'Optional: Give your AI receptionist a name'}
            {step === 3 && 'Start receiving calls now'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Choose Vertical */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-3">
                {verticals.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVertical(v.id)}
                    className={cn(
                      'w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left',
                      selectedVertical === v.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <v.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{v.name}</p>
                      <p className="text-sm text-muted-foreground">{v.description}</p>
                    </div>
                  </button>
                ))}
              </div>
              <Button 
                className="w-full" 
                disabled={!selectedVertical}
                onClick={() => setStep(2)}
              >
                Continue
              </Button>
            </div>
          )}

          {/* Step 2: Customize */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="agentName">Agent Name (Optional)</Label>
                <Input
                  id="agentName"
                  placeholder="e.g., Sarah, Alex, or your business name"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  This is how your AI will introduce itself to callers
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button className="flex-1" onClick={handleCreateAgent} disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Your Agent...
                    </>
                  ) : (
                    'Activate AI Receptionist'
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && result && (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-accent" />
                </div>
              </div>

              {result.phoneNumber && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Your AI Receptionist Number</p>
                  <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary">
                    <Phone className="h-6 w-6" />
                    {result.phoneNumber}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Call this number now to test your AI receptionist!
                  </p>
                </div>
              )}

              <Button className="w-full" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
