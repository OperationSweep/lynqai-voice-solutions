import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Phone,
  Clock,
  Calendar,
  Users,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const stats = [
  {
    name: "Total Calls",
    value: "247",
    change: "+12%",
    changeType: "positive",
    icon: Phone,
    description: "This month",
  },
  {
    name: "Minutes Used",
    value: "412",
    change: "+8%",
    changeType: "positive",
    icon: Clock,
    description: "of 500 included",
  },
  {
    name: "Appointments",
    value: "38",
    change: "+23%",
    changeType: "positive",
    icon: Calendar,
    description: "Booked this month",
  },
  {
    name: "Leads Captured",
    value: "156",
    change: "+18%",
    changeType: "positive",
    icon: Users,
    description: "New contacts",
  },
];

const recentCalls = [
  {
    id: 1,
    caller: "Sarah Johnson",
    phone: "(555) 123-4567",
    time: "10 min ago",
    duration: "4:32",
    outcome: "Appointment Booked",
    outcomeType: "success",
  },
  {
    id: 2,
    caller: "Michael Chen",
    phone: "(555) 234-5678",
    time: "25 min ago",
    duration: "2:15",
    outcome: "Information Provided",
    outcomeType: "neutral",
  },
  {
    id: 3,
    caller: "Emily Rodriguez",
    phone: "(555) 345-6789",
    time: "1 hour ago",
    duration: "6:08",
    outcome: "Lead Qualified",
    outcomeType: "success",
  },
  {
    id: 4,
    caller: "Unknown",
    phone: "(555) 456-7890",
    time: "2 hours ago",
    duration: "0:45",
    outcome: "Missed",
    outcomeType: "error",
  },
  {
    id: 5,
    caller: "David Kim",
    phone: "(555) 567-8901",
    time: "3 hours ago",
    duration: "3:22",
    outcome: "Callback Scheduled",
    outcomeType: "neutral",
  },
];

const Dashboard = () => {
  const minutesUsed = 412;
  const minutesIncluded = 500;
  const minutesPercentage = (minutesUsed / minutesIncluded) * 100;
  const isNearLimit = minutesPercentage >= 80;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Welcome back, John! 👋</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your AI receptionist today.</p>
        </div>
        <Button variant="hero" asChild>
          <Link to="/dashboard/calls">
            View All Calls
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Minutes Warning Banner */}
      {isNearLimit && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="h-10 w-10 rounded-full bg-destructive/20 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-destructive">You're approaching your minutes limit</p>
              <p className="text-sm text-muted-foreground">
                You've used {minutesUsed} of {minutesIncluded} minutes. Consider upgrading your plan.
              </p>
            </div>
            <Button variant="outline" size="sm" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
              Upgrade Now
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
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
                <div className="flex flex-col items-end gap-2">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className={cn(
                    "flex items-center text-xs font-medium",
                    stat.changeType === "positive" ? "text-accent" : "text-destructive"
                  )}>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.change}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Minutes Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Minutes Usage</CardTitle>
          <CardDescription>Your usage for the current billing period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Used</span>
              <span className="font-medium">{minutesUsed} / {minutesIncluded} minutes</span>
            </div>
            <Progress value={minutesPercentage} className="h-3" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {minutesIncluded - minutesUsed} minutes remaining
              </span>
              <span className="text-muted-foreground">
                Overage rate: $0.35/min
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Calls Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Recent Calls</CardTitle>
            <CardDescription>Your latest call activity</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/calls">
              View All
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-muted-foreground border-b border-border">
                  <th className="pb-3 font-medium">Caller</th>
                  <th className="pb-3 font-medium">Phone</th>
                  <th className="pb-3 font-medium">Time</th>
                  <th className="pb-3 font-medium">Duration</th>
                  <th className="pb-3 font-medium">Outcome</th>
                </tr>
              </thead>
              <tbody>
                {recentCalls.map((call) => (
                  <tr key={call.id} className="border-b border-border/50 last:border-0">
                    <td className="py-4">
                      <div className="font-medium">{call.caller}</div>
                    </td>
                    <td className="py-4 text-muted-foreground">{call.phone}</td>
                    <td className="py-4 text-muted-foreground">{call.time}</td>
                    <td className="py-4 text-muted-foreground">{call.duration}</td>
                    <td className="py-4">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        call.outcomeType === "success" && "bg-accent/20 text-accent",
                        call.outcomeType === "neutral" && "bg-muted text-muted-foreground",
                        call.outcomeType === "error" && "bg-destructive/20 text-destructive"
                      )}>
                        {call.outcome}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-card transition-shadow cursor-pointer group" onClick={() => {}}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
                <Phone className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold group-hover:text-primary transition-colors">Configure Agent</h3>
                <p className="text-sm text-muted-foreground">Customize your AI receptionist</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-card transition-shadow cursor-pointer group" onClick={() => {}}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center">
                <Calendar className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold group-hover:text-primary transition-colors">View Appointments</h3>
                <p className="text-sm text-muted-foreground">See booked appointments</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-card transition-shadow cursor-pointer group" onClick={() => {}}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold group-hover:text-primary transition-colors">Upgrade Plan</h3>
                <p className="text-sm text-muted-foreground">Get more minutes & features</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
