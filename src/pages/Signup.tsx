import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { Eye, EyeOff, Mail, Lock, User, Building2, Scissors, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

type Vertical = "real_estate" | "beauty" | "dental";

const verticals = [
  { id: "real_estate" as Vertical, name: "Real Estate", icon: Building2 },
  { id: "beauty" as Vertical, name: "Beauty & Salons", icon: Scissors },
  { id: "dental" as Vertical, name: "Dental Clinics", icon: Stethoscope },
];

const Signup = () => {
  const navigate = useNavigate();
  const { signUp, user, loading } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [vertical, setVertical] = useState<Vertical | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      navigate("/pricing");
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vertical) return;
    
    setIsLoading(true);
    const { error } = await signUp(email, password, fullName);
    
    if (error) {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    } else {
      toast({
        title: "Account created!",
        description: "Please select a plan to get started.",
      });
      navigate("/pricing");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link to="/"><Logo size="lg" className="justify-center mb-8" /></Link>
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-muted-foreground mt-2">Start your 14-day free trial</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="fullName" type="text" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} className="pl-10" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10" required minLength={8} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
            </div>

            <div className="space-y-2">
              <Label>What industry are you in?</Label>
              <div className="grid grid-cols-3 gap-3">
                {verticals.map((v) => (
                  <button key={v.id} type="button" onClick={() => setVertical(v.id)} className={cn("flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all", vertical === v.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50")}>
                    <v.icon className={cn("h-6 w-6", vertical === v.id ? "text-primary" : "text-muted-foreground")} />
                    <span className={cn("text-xs font-medium", vertical === v.id ? "text-primary" : "text-muted-foreground")}>{v.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" variant="hero" className="w-full" size="lg" disabled={isLoading || !vertical}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 gradient-primary items-center justify-center p-12">
        <div className="max-w-md text-center text-primary-foreground">
          <h2 className="text-3xl font-bold mb-4">Start Your Free Trial</h2>
          <p className="text-lg text-primary-foreground/80 mb-8">Get 14 days of full access. No credit card required. Cancel anytime.</p>
          <ul className="text-left space-y-4">
            <li className="flex items-center gap-3"><div className="h-6 w-6 rounded-full bg-primary-foreground/20 flex items-center justify-center">✓</div><span>100 free minutes</span></li>
            <li className="flex items-center gap-3"><div className="h-6 w-6 rounded-full bg-primary-foreground/20 flex items-center justify-center">✓</div><span>Dedicated phone number</span></li>
            <li className="flex items-center gap-3"><div className="h-6 w-6 rounded-full bg-primary-foreground/20 flex items-center justify-center">✓</div><span>Full feature access</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Signup;
