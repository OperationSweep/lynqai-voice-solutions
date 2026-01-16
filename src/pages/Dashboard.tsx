import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Phone, Clock, Calendar, Users, TrendingUp, AlertTriangle, 
  ArrowRight, ArrowUpRight, CheckCircle2, ExternalLink, 
  Save, Loader2, Pencil, X, Zap, Activity 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/useProfile";
import { useUsage } from "@/hooks/useUsage";
import { useCallLogs } from "@/hooks/useCallLogs";
import { useAgent, useUpdateAgent } from "@/hooks/useAgent";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { StatCard, GlassCard, StatusBadge, MiniChart, GradientButton } from "@/components/premium";
import { PageTransition } from "@/components/premium/PageTransition";

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

  // Generate mock chart data based on actual usage
  const chartData = [
    { name: "Mon", value: Math.floor(Math.random() * 20) + 5 },
    { name: "Tue", value: Math.floor(Math.random() * 20) + 5 },
    { name: "Wed", value: Math.floor(Math.random() * 20) + 5 },
    { name: "Thu", value: Math.floor(Math.random() * 20) + 5 },
    { name: "Fri", value: Math.floor(Math.random() * 20) + 5 },
    { name: "Sat", value: Math.floor(Math.random() * 10) + 2 },
    { name: "Sun", value: Math.floor(Math.random() * 10) + 2 },
  ];

  const getOutcomeStyle = (outcome: string | null) => {
    if (['appointment_booked', 'lead_qualified'].includes(outcome || '')) return "success";
    if (['missed', 'voicemail'].includes(outcome || '')) return "error";
    return "neutral";
  };

  const formatOutcome = (outcome: string | null) => {
    if (!outcome) return 'Unknown';
    return outcome.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  useEffect(() => {
    if (!profileLoading && !agentLoading && profile) {
      if (profile.subscription_status === 'active' && !profile.onboarding_completed && !agent) {
        navigate('/onboarding');
      }
    }
  }, [profile, agent, profileLoading, agentLoading, navigate]);

  if (profileLoading || usageLoading || agentLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Welcome back, <span className="gradient-text">{profile?.full_name?.split(' ')[0] || 'there'}</span>! 👋
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Here's what's happening with your AI receptionist today.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <GradientButton onClick={() => navigate("/dashboard/calls")} size="lg">
              View All Calls
              <ArrowRight className="h-5 w-5" />
            </GradientButton>
          </motion.div>
        </div>

        {/* Phone Number Card */}
        {agent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <GlassCard hover={false} className={cn(
              agent.phone_number && !isEditingPhone
                ? "border-primary/30"
                : "border-amber-500/30"
            )}>
              {agent.phone_number && !isEditingPhone ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                      <Phone className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Your AI Receptionist</p>
                      <p className="text-2xl font-bold gradient-text">{agent.phone_number}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge status="success" label="Live" pulse />
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
                      "h-14 w-14 rounded-2xl flex items-center justify-center flex-shrink-0",
                      isEditingPhone ? "gradient-primary" : "bg-amber-500/20"
                    )}>
                      {isEditingPhone ? (
                        <Phone className="h-7 w-7 text-white" />
                      ) : (
                        <AlertTriangle className="h-7 w-7 text-amber-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={cn("font-semibold text-lg", !isEditingPhone && "text-amber-400")}>
                        {isEditingPhone ? "Update Phone Number" : "No Phone Number Configured"}
                      </p>
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
                  <div className="flex gap-3 ml-[72px]">
                    <Input
                      placeholder="+1 (555) 123-4567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="max-w-xs bg-background/50"
                    />
                    <GradientButton 
                      onClick={handleSavePhoneNumber}
                      disabled={isSavingPhone || !phoneNumber.trim()}
                      isLoading={isSavingPhone}
                    >
                      <Save className="h-4 w-4" />
                      Save
                    </GradientButton>
                    {isEditingPhone && (
                      <Button 
                        variant="ghost"
                        onClick={() => {
                          setIsEditingPhone(false);
                          setPhoneNumber(agent.phone_number || "");
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}

        {/* Usage Warning */}
        {isNearLimit && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard hover={false} className="border-destructive/50">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-destructive/20 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-destructive">You're approaching your minutes limit</p>
                  <p className="text-sm text-muted-foreground">
                    You've used {Math.round(minutesUsed)} of {minutesIncluded} minutes. Consider upgrading your plan.
                  </p>
                </div>
                <GradientButton 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/pricing")}
                >
                  Upgrade Now
                </GradientButton>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Stats Grid - Bento Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Calls"
            value={Number(usage?.total_calls || 0)}
            icon={Phone}
            description="This month"
            trend={{ value: 12, isPositive: true }}
            delay={0}
          />
          <StatCard
            title="Minutes Used"
            value={Math.round(minutesUsed)}
            icon={Clock}
            suffix={` / ${minutesIncluded}`}
            description="Included minutes"
            delay={1}
          />
          <StatCard
            title="Appointments"
            value={Number(usage?.appointments_booked || 0)}
            icon={Calendar}
            description="Booked this month"
            trend={{ value: 8, isPositive: true }}
            delay={2}
          />
          <StatCard
            title="Leads Captured"
            value={Number(usage?.leads_qualified || 0)}
            icon={Users}
            description="New contacts"
            trend={{ value: 15, isPositive: true }}
            delay={3}
          />
        </div>

        {/* Charts and Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Minutes Usage Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <GlassCard hover={false}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-lg">Call Activity</h3>
                  <p className="text-sm text-muted-foreground">Last 7 days</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Activity className="h-4 w-4 text-primary" />
                  <span>Live tracking</span>
                </div>
              </div>
              <MiniChart data={chartData} height={120} color="primary" />
              <div className="mt-6 pt-6 border-t border-border/50">
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-muted-foreground">Minutes Used</span>
                  <span className="font-medium">{Math.round(minutesUsed)} / {minutesIncluded}</span>
                </div>
                <Progress value={minutesPercentage} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                  <span>{Math.max(0, minutesIncluded - Math.round(minutesUsed))} minutes remaining</span>
                  <span>Overage: ${profile?.overage_rate || 0.35}/min</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
          >
            <GlassCard hover={false} className="h-full">
              <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/dashboard/agent" className="block">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all group">
                    <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium group-hover:text-primary transition-colors">Configure Agent</p>
                      <p className="text-xs text-muted-foreground">Customize your AI</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
                <Link to="/dashboard/calls" className="block">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all group">
                    <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium group-hover:text-primary transition-colors">View Appointments</p>
                      <p className="text-xs text-muted-foreground">See booked calls</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
                <Link to="/pricing" className="block">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all group">
                    <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium group-hover:text-primary transition-colors">Upgrade Plan</p>
                      <p className="text-xs text-muted-foreground">Get more minutes</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Recent Calls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <GlassCard hover={false}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-lg">Recent Calls</h3>
                <p className="text-sm text-muted-foreground">Your latest call activity</p>
              </div>
              <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80">
                <Link to="/dashboard/calls">
                  View All
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            {callsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
            ) : recentCalls && recentCalls.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-muted-foreground border-b border-border/50">
                      <th className="pb-4 font-medium">Caller</th>
                      <th className="pb-4 font-medium">Phone</th>
                      <th className="pb-4 font-medium">Time</th>
                      <th className="pb-4 font-medium">Duration</th>
                      <th className="pb-4 font-medium">Outcome</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentCalls.map((call, index) => (
                      <motion.tr 
                        key={call.id} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-medium">
                              {(call.caller_name || 'U').charAt(0)}
                            </div>
                            <span className="font-medium">{call.caller_name || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="py-4 text-muted-foreground">{call.caller_phone || 'N/A'}</td>
                        <td className="py-4 text-muted-foreground">{formatDistanceToNow(new Date(call.call_start), { addSuffix: true })}</td>
                        <td className="py-4 text-muted-foreground">
                          {Math.floor((call.duration_seconds || 0) / 60)}:{String((call.duration_seconds || 0) % 60).padStart(2, '0')}
                        </td>
                        <td className="py-4">
                          <StatusBadge 
                            status={getOutcomeStyle(call.outcome) as any} 
                            label={formatOutcome(call.outcome)} 
                          />
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No calls yet. Your AI receptionist is ready to take calls!</p>
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
