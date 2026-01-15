import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Phone, Clock, Calendar, Users, TrendingUp, AlertTriangle, ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/useProfile";
import { useUsage } from "@/hooks/useUsage";
import { useCallLogs } from "@/hooks/useCallLogs";
import { formatDistanceToNow } from "date-fns";

const Dashboard = () => {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: usage, isLoading: usageLoading } = useUsage();
  const { data: recentCalls, isLoading: callsLoading } = useCallLogs({ limit: 5 });

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

  if (profileLoading || usageLoading) {
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
