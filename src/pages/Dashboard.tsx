import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Phone, Clock, Calendar, Users, TrendingUp, AlertTriangle, ArrowRight, ArrowUpRight, CheckCircle2, ExternalLink, Save, Loader2, Pencil, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/useProfile";
import { useUsage } from "@/hooks/useUsage";
import { useCallLogs } from "@/hooks/useCallLogs";
import { useAgent, useUpdateAgent } from "@/hooks/useAgent";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: usage, isLoading: usageLoading } = useUsage();
  const { data: recentCalls, isLoading: callsLoading } = useCallLogs({ limit: 5 });
  const { data: agent, isLoading: agentLoading } = useAgent();
  const updateAgent = useUpdateAgent();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSavingPhone, setIsSavingPhone] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  // Sync phone number input with agent data
  useEffect(() => {
    if (agent?.phone_number) {
      setPhoneNumber(agent.phone_number);
    }
  }, [agent?.phone_number]);

  const handleSavePhoneNumber = async () => {
    if (!agent?.id) return;
    
    setIsSavingPhone(true);
    try {
      await updateAgent.mutateAsync({
        id: agent.id,
        updates: { phone_number: phoneNumber || null }
      });
      toast.success("Phone number saved successfully!");
      setIsEditingPhone(false);
    } catch (error) {
      console.error("Failed to save phone number:", error);
      toast.error("Failed to save phone number");
    } finally {
      setIsSavingPhone(false);
    }
  };

  const minutesUsed = Number(usage?.total_minutes || 0);
  const minutesIncluded = profile?.included_minutes || 200;
  const minutesPercentage = Math.min((minutesUsed / minutesIncluded) * 100, 100);
  const isNearLimit = minutesPercentage >= 80;

  const stats = [
    { name: "Total Calls", value: String(usage?.total_calls || 0), icon: Phone, description: "This month" },
    { name: "Minutes Used", value: String(Math.round(minutesUsed)), icon: Clock, description: `of ${minutesIncluded} included` },
    { name: "Appointments", value: String(usage?.appointments_booked || 0), icon: Calendar, description: "Booked this month" },
    { name: "Leads Captured", value: String(usage?.leads_qualified || 0), icon: Users, description: "New contacts" },
  ];

  const getOutcomeStyle = (outcome: string | null) => {
    if (['appointment_booked', 'lead_qualified'].includes(outcome || '')) return "bg-accent/20 text-accent";
    if (['missed', 'voicemail'].includes(outcome || '')) return "bg-destructive/20 text-destructive";
    return "bg-muted text-muted-foreground";
  };

  const formatOutcome = (outcome: string | null) => {
    if (!outcome) return 'Unknown';
    return outcome.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  // Redirect to onboarding if subscription active but no agent
  useEffect(() => {
    if (!profileLoading && !agentLoading && profile) {
      if (profile.subscription_status === 'active' && !profile.onboarding_completed && !agent) {
        navigate('/onboarding');
      }
    }
  }, [profile, agent, profileLoading, agentLoading, navigate]);

  if (profileLoading || usageLoading || agentLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}! 👋</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your AI receptionist today.</p>
        </div>
        <Button variant="hero" asChild><Link to="/dashboard/calls">View All Calls<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
      </div>

      {/* Agent Phone Number Card */}
      {agent && (
        <Card className={cn(
          "border-primary/30",
          agent.phone_number 
            ? "bg-gradient-to-r from-primary/5 to-primary/10" 
            : "bg-gradient-to-r from-amber-500/5 to-amber-500/10 border-amber-500/30"
        )}>
          <CardContent className="py-4">
            {agent.phone_number && !isEditingPhone ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Your AI Receptionist</p>
                    <p className="text-xl font-bold text-primary">{agent.phone_number}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium text-accent">Live</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingPhone(true)}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0",
                    isEditingPhone ? "bg-primary/20" : "bg-amber-500/20"
                  )}>
                    {isEditingPhone ? (
                      <Phone className="h-6 w-6 text-primary" />
                    ) : (
                      <AlertTriangle className="h-6 w-6 text-amber-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    {isEditingPhone ? (
                      <p className="font-medium">Update Phone Number</p>
                    ) : (
                      <p className="font-medium text-amber-700 dark:text-amber-400">No Phone Number Configured</p>
                    )}
                    <p className="text-sm text-muted-foreground mt-1">
                      {isEditingPhone ? (
                        "Enter the phone number from your Vapi account."
                      ) : (
                        <>
                          Your AI receptionist is ready, but needs a phone number. Configure one in your{" "}
                          <a 
                            href="https://dashboard.vapi.ai/phone-numbers" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline inline-flex items-center gap-1"
                          >
                            Vapi Dashboard
                            <ExternalLink className="h-3 w-3" />
                          </a>
                          , then enter it below.
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 ml-16">
                  <Input
                    placeholder="+1 (555) 123-4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="max-w-xs"
                  />
                  <Button 
                    onClick={handleSavePhoneNumber}
                    disabled={isSavingPhone || !phoneNumber.trim()}
                    size="default"
                  >
                    {isSavingPhone ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </>
                    )}
                  </Button>
                  {isEditingPhone && (
                    <Button 
                      variant="ghost"
                      onClick={() => {
                        setIsEditingPhone(false);
                        setPhoneNumber(agent.phone_number || "");
                      }}
                      size="default"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {isNearLimit && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="h-10 w-10 rounded-full bg-destructive/20 flex items-center justify-center"><AlertTriangle className="h-5 w-5 text-destructive" /></div>
            <div className="flex-1">
              <p className="font-medium text-destructive">You're approaching your minutes limit</p>
              <p className="text-sm text-muted-foreground">You've used {Math.round(minutesUsed)} of {minutesIncluded} minutes. Consider upgrading your plan.</p>
            </div>
            <Button variant="outline" size="sm" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground" asChild><Link to="/pricing">Upgrade Now</Link></Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="hover:shadow-card transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center"><stat.icon className="h-5 w-5 text-primary" /></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Minutes Usage</CardTitle><CardDescription>Your usage for the current billing period</CardDescription></CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Used</span><span className="font-medium">{Math.round(minutesUsed)} / {minutesIncluded} minutes</span></div>
            <Progress value={minutesPercentage} className="h-3" />
            <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">{Math.max(0, minutesIncluded - Math.round(minutesUsed))} minutes remaining</span><span className="text-muted-foreground">Overage rate: ${profile?.overage_rate || 0.35}/min</span></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between"><div><CardTitle className="text-lg">Recent Calls</CardTitle><CardDescription>Your latest call activity</CardDescription></div><Button variant="ghost" size="sm" asChild><Link to="/dashboard/calls">View All<ArrowUpRight className="ml-1 h-4 w-4" /></Link></Button></CardHeader>
        <CardContent>
          {callsLoading ? (
            <p className="text-muted-foreground">Loading calls...</p>
          ) : recentCalls && recentCalls.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="text-left text-sm text-muted-foreground border-b border-border"><th className="pb-3 font-medium">Caller</th><th className="pb-3 font-medium">Phone</th><th className="pb-3 font-medium">Time</th><th className="pb-3 font-medium">Duration</th><th className="pb-3 font-medium">Outcome</th></tr></thead>
                <tbody>
                  {recentCalls.map((call) => (
                    <tr key={call.id} className="border-b border-border/50 last:border-0">
                      <td className="py-4"><div className="font-medium">{call.caller_name || 'Unknown'}</div></td>
                      <td className="py-4 text-muted-foreground">{call.caller_phone || 'N/A'}</td>
                      <td className="py-4 text-muted-foreground">{formatDistanceToNow(new Date(call.call_start), { addSuffix: true })}</td>
                      <td className="py-4 text-muted-foreground">{Math.floor((call.duration_seconds || 0) / 60)}:{String((call.duration_seconds || 0) % 60).padStart(2, '0')}</td>
                      <td className="py-4"><span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", getOutcomeStyle(call.outcome))}>{formatOutcome(call.outcome)}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground">No calls yet. Your AI receptionist is ready to take calls!</p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/dashboard/agent"><Card className="hover:shadow-card transition-shadow cursor-pointer group"><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center"><Phone className="h-6 w-6 text-primary-foreground" /></div><div className="flex-1"><h3 className="font-semibold group-hover:text-primary transition-colors">Configure Agent</h3><p className="text-sm text-muted-foreground">Customize your AI receptionist</p></div><ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" /></div></CardContent></Card></Link>
        <Link to="/dashboard/calls"><Card className="hover:shadow-card transition-shadow cursor-pointer group"><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center"><Calendar className="h-6 w-6 text-secondary-foreground" /></div><div className="flex-1"><h3 className="font-semibold group-hover:text-primary transition-colors">View Appointments</h3><p className="text-sm text-muted-foreground">See booked appointments</p></div><ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" /></div></CardContent></Card></Link>
        <Link to="/pricing"><Card className="hover:shadow-card transition-shadow cursor-pointer group"><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center"><TrendingUp className="h-6 w-6 text-accent-foreground" /></div><div className="flex-1"><h3 className="font-semibold group-hover:text-primary transition-colors">Upgrade Plan</h3><p className="text-sm text-muted-foreground">Get more minutes & features</p></div><ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" /></div></CardContent></Card></Link>
      </div>
    </div>
  );
};

export default Dashboard;
