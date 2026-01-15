import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Check,
  Link as LinkIcon,
  Calendar,
  Users,
  Zap,
  Webhook,
  ExternalLink,
  Settings,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const integrations = [
  {
    id: "google_calendar",
    name: "Google Calendar",
    description: "Sync appointments directly to Google Calendar",
    icon: Calendar,
    color: "bg-[#4285F4]",
    connected: true,
    config: {
      calendarId: "primary",
      syncEnabled: true,
    },
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Automatically sync leads and contacts to HubSpot CRM",
    icon: Users,
    color: "bg-[#FF7A59]",
    connected: false,
    config: null,
  },
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Push leads and call data to Salesforce",
    icon: Users,
    color: "bg-[#00A1E0]",
    connected: false,
    config: null,
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Connect to 5,000+ apps with Zapier",
    icon: Zap,
    color: "bg-[#FF4A00]",
    connected: true,
    config: {
      webhookUrl: "https://hooks.zapier.com/...",
    },
  },
  {
    id: "webhook",
    name: "Custom Webhook",
    description: "Send call data to your own API endpoint",
    icon: Webhook,
    color: "bg-foreground",
    connected: false,
    config: null,
  },
];

const Integrations = () => {
  const { toast } = useToast();
  const [selectedIntegration, setSelectedIntegration] = useState<typeof integrations[0] | null>(null);
  const [webhookUrl, setWebhookUrl] = useState("");

  const handleConnect = (integration: typeof integrations[0]) => {
    if (integration.id === "webhook") {
      setSelectedIntegration(integration);
    } else {
      toast({
        title: "Connecting...",
        description: `Redirecting to ${integration.name} for authorization.`,
      });
    }
  };

  const handleDisconnect = (integration: typeof integrations[0]) => {
    toast({
      title: "Disconnected",
      description: `${integration.name} has been disconnected.`,
    });
  };

  const handleSaveWebhook = () => {
    toast({
      title: "Webhook Saved",
      description: "Your custom webhook has been configured.",
    });
    setSelectedIntegration(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Integrations</h1>
        <p className="text-muted-foreground mt-1">Connect LynqAI with your favorite tools and services.</p>
      </div>

      {/* Status Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <Check className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-sm text-muted-foreground">Active Integrations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <LinkIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-sm text-muted-foreground">Available Integrations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                <Zap className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-sm text-muted-foreground">Events Synced</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integrations Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Available Integrations</CardTitle>
          <CardDescription>Connect your tools to automate your workflow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {integrations.map((integration) => (
              <Card
                key={integration.id}
                className={cn(
                  "border transition-all",
                  integration.connected ? "border-accent/50 bg-accent/5" : "hover:border-primary/50"
                )}
              >
                <CardContent className="py-4">
                  <div className="flex items-start gap-4">
                    <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", integration.color)}>
                      <integration.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{integration.name}</h3>
                        {integration.connected && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-accent">
                            <Check className="h-3 w-3 mr-1" />
                            Connected
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{integration.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    {integration.connected ? (
                      <>
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedIntegration(integration)}>
                          <Settings className="mr-2 h-4 w-4" />
                          Configure
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => handleDisconnect(integration)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button variant="hero" size="sm" className="flex-1" onClick={() => handleConnect(integration)}>
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Connect
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Webhook Configuration Dialog */}
      <Dialog open={selectedIntegration?.id === "webhook"} onOpenChange={() => setSelectedIntegration(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure Custom Webhook</DialogTitle>
            <DialogDescription>
              Enter your webhook URL to receive call data in real-time.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="webhookUrl">Webhook URL</Label>
              <Input
                id="webhookUrl"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://your-api.com/webhook"
              />
              <p className="text-xs text-muted-foreground">
                We'll send a POST request with call data to this URL after each call.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedIntegration(null)}>
                Cancel
              </Button>
              <Button variant="hero" className="flex-1" onClick={handleSaveWebhook}>
                Save Webhook
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Integration Config Dialog */}
      <Dialog open={selectedIntegration !== null && selectedIntegration.id !== "webhook"} onOpenChange={() => setSelectedIntegration(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure {selectedIntegration?.name}</DialogTitle>
            <DialogDescription>
              Manage your {selectedIntegration?.name} integration settings.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {selectedIntegration?.id === "google_calendar" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sync Appointments</p>
                    <p className="text-sm text-muted-foreground">Automatically add booked appointments to your calendar</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Send Reminders</p>
                    <p className="text-sm text-muted-foreground">Add reminder notifications to calendar events</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            )}
            {selectedIntegration?.id === "zapier" && (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-sm font-mono break-all">{selectedIntegration.config?.webhookUrl}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Use this webhook URL in your Zapier triggers to receive call data.
                </p>
              </div>
            )}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedIntegration(null)}>
                Close
              </Button>
              <Button variant="hero" className="flex-1">
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Integrations;
