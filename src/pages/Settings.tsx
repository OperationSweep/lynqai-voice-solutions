import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, CreditCard, Bell, Key, ExternalLink, Copy, Eye, EyeOff, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const { toast } = useToast();
  const { signOut } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const [showApiKey, setShowApiKey] = useState(false);
  const [isPortalLoading, setIsPortalLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    businessName: "",
    phone: "",
  });

  // Update form data when profile loads
  useState(() => {
    if (profile) {
      setFormData({
        fullName: profile.full_name || "",
        email: profile.email || "",
        businessName: profile.business_name || "",
        phone: profile.phone || "",
      });
    }
  });

  const apiKey = `lynq_live_${profile?.id?.slice(0, 16) || 'xxxxxxxxxxxxxxxx'}`;

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast({ title: "Copied!", description: "API key copied to clipboard" });
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile.mutateAsync({
        full_name: formData.fullName,
        business_name: formData.businessName,
        phone: formData.phone,
      });
      toast({ title: "Profile Updated", description: "Your profile has been saved successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
    }
  };

  const handleManageSubscription = async () => {
    if (!profile?.stripe_customer_id) {
      toast({ title: "No subscription", description: "Please subscribe to a plan first.", variant: "destructive" });
      return;
    }

    setIsPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-portal-session', {
        body: { returnUrl: window.location.href }
      });

      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (error) {
      toast({ title: "Error", description: "Failed to open billing portal.", variant: "destructive" });
    } finally {
      setIsPortalLoading(false);
    }
  };

  const getTierDisplay = (tier: string | null) => {
    if (!tier) return "Free";
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };

  const getTierPrice = (tier: string | null) => {
    switch (tier) {
      case 'starter': return '$97/month';
      case 'professional': return '$297/month';
      case 'growth': return '$597/month';
      default: return 'Free';
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-muted p-1 h-auto flex-wrap">
          <TabsTrigger value="profile" className="flex items-center gap-2"><User className="h-4 w-4" />Profile</TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2"><CreditCard className="h-4 w-4" />Billing</TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2"><Bell className="h-4 w-4" />Notifications</TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2"><Key className="h-4 w-4" />API</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader><CardTitle>Profile Information</CardTitle><CardDescription>Update your personal and business information.</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2"><Label htmlFor="fullName">Full Name</Label><Input id="fullName" value={formData.fullName || profile?.full_name || ""} onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))} /></div>
                <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={profile?.email || ""} disabled className="bg-muted" /></div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2"><Label htmlFor="businessName">Company Name</Label><Input id="businessName" value={formData.businessName || profile?.business_name || ""} onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))} /></div>
                <div className="space-y-2"><Label htmlFor="phone">Phone Number</Label><Input id="phone" value={formData.phone || profile?.phone || ""} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} /></div>
              </div>
              <div className="flex gap-4">
                <Button variant="hero" onClick={handleSaveProfile} disabled={updateProfile.isPending}>{updateProfile.isPending ? "Saving..." : "Save Changes"}</Button>
                <Button variant="outline" onClick={signOut}>Sign Out</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Current Plan</CardTitle><CardDescription>Manage your subscription and billing.</CardDescription></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/20 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">{getTierDisplay(profile?.subscription_tier)}</span>
                    {profile?.subscription_status === 'active' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-accent"><Check className="h-3 w-3 mr-1" />Active</span>
                    )}
                    {profile?.subscription_status === 'past_due' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-destructive/20 text-destructive">Past Due</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{getTierPrice(profile?.subscription_tier)} • {profile?.included_minutes || 200} minutes included</p>
                </div>
                <Button variant="outline" onClick={handleManageSubscription} disabled={isPortalLoading}>{isPortalLoading ? "Loading..." : "Manage Subscription"}</Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">Overage Rate</span>
                  <span>${profile?.overage_rate || 0.35}/minute</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-muted-foreground">Billing History</span>
                  <Button variant="ghost" size="sm" onClick={handleManageSubscription}>View Invoices<ExternalLink className="ml-2 h-4 w-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader><CardTitle>Notification Preferences</CardTitle><CardDescription>Choose what notifications you want to receive.</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between"><div><p className="font-medium">Call Notifications</p><p className="text-sm text-muted-foreground">Get notified when you receive a new call</p></div><Switch defaultChecked /></div>
                <div className="flex items-center justify-between"><div><p className="font-medium">Appointment Reminders</p><p className="text-sm text-muted-foreground">Receive reminders for upcoming appointments</p></div><Switch defaultChecked /></div>
                <div className="flex items-center justify-between"><div><p className="font-medium">Weekly Summary</p><p className="text-sm text-muted-foreground">Get a weekly email with your call stats</p></div><Switch defaultChecked /></div>
                <div className="flex items-center justify-between"><div><p className="font-medium">Usage Alerts</p><p className="text-sm text-muted-foreground">Get notified when you're approaching your minute limit</p></div><Switch defaultChecked /></div>
              </div>
              <Button variant="hero">Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader><CardTitle>API Access</CardTitle><CardDescription>Use your API key to integrate LynqAI with your applications.</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>API Key</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input type={showApiKey ? "text" : "password"} value={apiKey} readOnly className="pr-20 font-mono" />
                    <button type="button" onClick={() => setShowApiKey(!showApiKey)} className="absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">{showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                    <button type="button" onClick={handleCopyApiKey} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><Copy className="h-4 w-4" /></button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Keep your API key secret. Do not share it or expose it in client-side code.</p>
              </div>
              <div className="p-4 rounded-xl bg-muted">
                <h4 className="font-semibold mb-2">API Documentation</h4>
                <p className="text-sm text-muted-foreground mb-4">Learn how to integrate LynqAI with your applications using our REST API.</p>
                <Button variant="outline">View Documentation<ExternalLink className="ml-2 h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
