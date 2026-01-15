import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { Eye, EyeOff, Mail, Lock, User, Building2, Scissors, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

type Vertical = "real_estate" | "beauty" | "dental";

const verticals = [
  { id: "real_estate" as Vertical, name: "Real Estate", icon: Building2 },
  { id: "beauty" as Vertical, name: "Beauty & Salons", icon: Scissors },
  { id: "dental" as Vertical, name: "Dental Clinics", icon: Stethoscope },
];

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [vertical, setVertical] = useState<Vertical | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vertical) return;
    
    setIsLoading(true);
    // Simulate signup - will be replaced with Supabase auth
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link to="/">
              <Logo size="lg" className="justify-center mb-8" />
            </Link>
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-muted-foreground mt-2">Start your 14-day free trial</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
            </div>

            <div className="space-y-2">
              <Label>What industry are you in?</Label>
              <div className="grid grid-cols-3 gap-3">
                {verticals.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVertical(v.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                      vertical === v.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <v.icon className={cn("h-6 w-6", vertical === v.id ? "text-primary" : "text-muted-foreground")} />
                    <span className={cn("text-xs font-medium", vertical === v.id ? "text-primary" : "text-muted-foreground")}>
                      {v.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" variant="hero" className="w-full" size="lg" disabled={isLoading || !vertical}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button variant="outline" className="w-full" size="lg">
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>

          <p className="text-center text-xs text-muted-foreground">
            By creating an account, you agree to our{" "}
            <a href="#" className="underline">Terms of Service</a> and{" "}
            <a href="#" className="underline">Privacy Policy</a>
          </p>
        </div>
      </div>

      {/* Right side - Decorative */}
      <div className="hidden lg:flex flex-1 gradient-primary items-center justify-center p-12">
        <div className="max-w-md text-center text-primary-foreground">
          <h2 className="text-3xl font-bold mb-4">Start Your Free Trial</h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Get 14 days of full access. No credit card required. Cancel anytime.
          </p>
          <ul className="text-left space-y-4">
            <li className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-primary-foreground/20 flex items-center justify-center">✓</div>
              <span>100 free minutes</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-primary-foreground/20 flex items-center justify-center">✓</div>
              <span>Dedicated phone number</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-primary-foreground/20 flex items-center justify-center">✓</div>
              <span>Full feature access</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Signup;
