import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  CreditCard,
  Bell,
  Key,
  ExternalLink,
  Copy,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [showApiKey, setShowApiKey] = useState(false);

  // Mock data
  const user = {
    fullName: "John Doe",
    email: "john@example.com",
    companyName: "Premier Properties",
    phone: "(555) 123-4567",
  };

  const subscription = {
    plan: "Professional",
    status: "active",
    nextBilling: "February 15, 2024",
    amount: "$297/month",
    paymentMethod: "**** **** **** 4242",
  };

  const apiKey = "lynq_live_sk_1234567890abcdef";

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast({
      title: "Copied!",
      description: "API key copied to clipboard",
    });
  };

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-muted p-1 h-auto flex-wrap">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            API
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal and business information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" defaultValue={user.fullName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user.email} />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" defaultValue={user.companyName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue={user.phone} />
                </div>
              </div>
              <Button variant="hero" onClick={handleSaveProfile}>
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Manage your subscription and billing.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/20 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">{subscription.plan}</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-accent">
                      <Check className="h-3 w-3 mr-1" />
                      Active
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {subscription.amount} • Next billing: {subscription.nextBilling}
                  </p>
                </div>
                <Button variant="outline">
                  Change Plan
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">Payment Method</span>
                  <div className="flex items-center gap-2">
                    <span>{subscription.paymentMethod}</span>
                    <Button variant="ghost" size="sm">Update</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-muted-foreground">Billing History</span>
                  <Button variant="ghost" size="sm">
                    View Invoices
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <Button variant="outline" className="text-destructive hover:bg-destructive hover:text-destructive-foreground">
                  Cancel Subscription
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what notifications you want to receive.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Call Notifications</p>
                    <p className="text-sm text-muted-foreground">Get notified when you receive a new call</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Appointment Reminders</p>
                    <p className="text-sm text-muted-foreground">Receive reminders for upcoming appointments</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekly Summary</p>
                    <p className="text-sm text-muted-foreground">Get a weekly email with your call stats</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Usage Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified when you're approaching your minute limit</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing Updates</p>
                    <p className="text-sm text-muted-foreground">Receive news about new features and updates</p>
                  </div>
                  <Switch />
                </div>
              </div>
              <Button variant="hero">
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Tab */}
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>Use your API key to integrate LynqAI with your applications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>API Key</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type={showApiKey ? "text" : "password"}
                      value={apiKey}
                      readOnly
                      className="pr-20 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyApiKey}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <Button variant="outline">Regenerate</Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Keep your API key secret. Do not share it or expose it in client-side code.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-muted">
                <h4 className="font-semibold mb-2">API Documentation</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Learn how to integrate LynqAI with your applications using our REST API.
                </p>
                <Button variant="outline">
                  View Documentation
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
