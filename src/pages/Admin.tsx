import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Building2, Scissors, Stethoscope } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// Mock data
const stats = {
  totalUsers: 2847,
  mrr: 284700,
  newSignups: 127,
};

const verticalData = [
  { name: "Real Estate", value: 1245, color: "#6366F1" },
  { name: "Beauty & Salons", value: 892, color: "#8B5CF6" },
  { name: "Dental Clinics", value: 710, color: "#10B981" },
];

const recentSignups = [
  { id: 1, name: "Sarah Johnson", email: "sarah@realestate.com", vertical: "real_estate", date: "2 hours ago" },
  { id: 2, name: "Michael Chen", email: "michael@salon.com", vertical: "beauty", date: "3 hours ago" },
  { id: 3, name: "Dr. Emily Rodriguez", email: "emily@dental.com", vertical: "dental", date: "5 hours ago" },
  { id: 4, name: "David Kim", email: "david@properties.com", vertical: "real_estate", date: "8 hours ago" },
  { id: 5, name: "Lisa Wang", email: "lisa@beautyspa.com", vertical: "beauty", date: "1 day ago" },
];

const getVerticalIcon = (vertical: string) => {
  switch (vertical) {
    case "real_estate":
      return <Building2 className="h-4 w-4 text-primary" />;
    case "beauty":
      return <Scissors className="h-4 w-4 text-secondary" />;
    case "dental":
      return <Stethoscope className="h-4 w-4 text-accent" />;
    default:
      return null;
  }
};

const Admin = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of platform metrics and users.</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">${(stats.mrr / 100).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Monthly Recurring Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.newSignups}</p>
                <p className="text-sm text-muted-foreground">New Signups (This Week)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Users by Vertical</CardTitle>
            <CardDescription>Distribution of users across industries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={verticalData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {verticalData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-card border border-border rounded-lg shadow-lg p-3">
                            <p className="font-medium">{payload[0].name}</p>
                            <p className="text-sm text-muted-foreground">
                              {payload[0].value?.toLocaleString()} users
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {verticalData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Signups */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Signups</CardTitle>
            <CardDescription>Latest users who joined the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSignups.map((user) => (
                <div key={user.id} className="flex items-center gap-4 py-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                    {user.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{user.name}</p>
                      {getVerticalIcon(user.vertical)}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{user.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
