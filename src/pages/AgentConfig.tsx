import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Check,
  Phone,
  Building2,
  Clock,
  MessageSquare,
  Calendar,
  Settings,
  Play,
  Copy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const steps = [
  { id: 1, name: "Business Info", icon: Building2 },
  { id: 2, name: "Greeting", icon: MessageSquare },
  { id: 3, name: "Calendar", icon: Calendar },
  { id: 4, name: "Settings", icon: Settings },
];

const AgentConfig = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "Premier Properties",
    businessAddress: "123 Main Street, Suite 100, New York, NY 10001",
    businessPhone: "(555) 123-4567",
    openTime: "09:00",
    closeTime: "17:00",
    weekends: false,
    greeting: "Hello! Thank you for calling Premier Properties. I'm your AI assistant. How can I help you today?",
    calendarLink: "",
    afterHoursMessage: "We're currently closed, but I'd be happy to schedule a callback during business hours.",
    emergencyNumber: "",
    collectCallerInfo: true,
    sendSmsConfirmation: true,
  });

  // Mock assigned phone number
  const assignedPhoneNumber = "(555) 987-6543";

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(assignedPhoneNumber);
    toast({
      title: "Copied!",
      description: "Phone number copied to clipboard",
    });
  };

  const handleTestCall = () => {
    toast({
      title: "Test Call Initiated",
      description: "You'll receive a call shortly on your phone.",
    });
  };

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your agent configuration has been updated.",
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">AI Agent Configuration</h1>
        <p className="text-muted-foreground mt-1">Set up your AI receptionist to handle calls exactly how you want.</p>
      </div>

      {/* Phone Number Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex flex-col md:flex-row items-start md:items-center gap-4 py-6">
          <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
            <Phone className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">Your AI Receptionist Number</p>
            <p className="text-2xl font-bold">{assignedPhoneNumber}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopyNumber}>
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
            <Button variant="hero" size="sm" onClick={handleTestCall}>
              <Play className="mr-2 h-4 w-4" />
              Test Call
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Steps Navigation */}
      <div className="flex items-center justify-between overflow-x-auto pb-4">
        {steps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => setCurrentStep(step.id)}
            className={cn(
              "flex items-center gap-3 px-4 py-2 rounded-xl transition-all whitespace-nowrap",
              currentStep === step.id
                ? "bg-primary text-primary-foreground"
                : currentStep > step.id
                ? "bg-accent/20 text-accent"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            <div className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold",
              currentStep === step.id
                ? "bg-primary-foreground/20"
                : currentStep > step.id
                ? "bg-accent text-accent-foreground"
                : "bg-background"
            )}>
              {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
            </div>
            <span className="hidden md:inline font-medium">{step.name}</span>
          </button>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            {currentStep === 1 && "Business Information"}
            {currentStep === 2 && "Greeting Customization"}
            {currentStep === 3 && "Calendar Integration"}
            {currentStep === 4 && "Call Handling Settings"}
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && "Tell us about your business so your AI can represent you accurately."}
            {currentStep === 2 && "Customize how your AI greets callers."}
            {currentStep === 3 && "Connect your calendar for automatic appointment booking."}
            {currentStep === 4 && "Configure how calls are handled in different scenarios."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Business Info */}
          {currentStep === 1 && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange("businessName", e.target.value)}
                    placeholder="Your business name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessPhone">Business Phone</Label>
                  <Input
                    id="businessPhone"
                    value={formData.businessPhone}
                    onChange={(e) => handleInputChange("businessPhone", e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessAddress">Business Address</Label>
                <Input
                  id="businessAddress"
                  value={formData.businessAddress}
                  onChange={(e) => handleInputChange("businessAddress", e.target.value)}
                  placeholder="123 Main St, City, State ZIP"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="openTime">Opening Time</Label>
                  <Input
                    id="openTime"
                    type="time"
                    value={formData.openTime}
                    onChange={(e) => handleInputChange("openTime", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="closeTime">Closing Time</Label>
                  <Input
                    id="closeTime"
                    type="time"
                    value={formData.closeTime}
                    onChange={(e) => handleInputChange("closeTime", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Open on Weekends</Label>
                  <div className="flex items-center gap-2 h-10">
                    <Switch
                      checked={formData.weekends}
                      onCheckedChange={(checked) => handleInputChange("weekends", checked)}
                    />
                    <span className="text-sm text-muted-foreground">
                      {formData.weekends ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Step 2: Greeting */}
          {currentStep === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="greeting">Greeting Message</Label>
                <Textarea
                  id="greeting"
                  value={formData.greeting}
                  onChange={(e) => handleInputChange("greeting", e.target.value)}
                  placeholder="Hello! Thank you for calling..."
                  rows={4}
                />
                <p className="text-sm text-muted-foreground">
                  This is what your AI will say when answering a call.
                </p>
              </div>

              <Card className="bg-muted/50">
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">Preview</p>
                      <p className="text-sm text-muted-foreground italic">"{formData.greeting}"</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Step 3: Calendar */}
          {currentStep === 3 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="calendarLink">Calendar Booking Link</Label>
                <Input
                  id="calendarLink"
                  value={formData.calendarLink}
                  onChange={(e) => handleInputChange("calendarLink", e.target.value)}
                  placeholder="https://calendly.com/your-link"
                />
                <p className="text-sm text-muted-foreground">
                  Paste your Calendly, Cal.com, or other booking link. Your AI will use this to book appointments.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-muted/50 cursor-pointer hover:border-primary/50 transition-colors">
                  <CardContent className="py-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-[#006BFF] flex items-center justify-center">
                      <span className="text-white font-bold text-lg">C</span>
                    </div>
                    <div>
                      <p className="font-medium">Calendly</p>
                      <p className="text-sm text-muted-foreground">Connect your Calendly account</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50 cursor-pointer hover:border-primary/50 transition-colors">
                  <CardContent className="py-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-foreground flex items-center justify-center">
                      <span className="text-background font-bold text-lg">Cal</span>
                    </div>
                    <div>
                      <p className="font-medium">Cal.com</p>
                      <p className="text-sm text-muted-foreground">Connect your Cal.com account</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* Step 4: Settings */}
          {currentStep === 4 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="afterHoursMessage">After Hours Message</Label>
                <Textarea
                  id="afterHoursMessage"
                  value={formData.afterHoursMessage}
                  onChange={(e) => handleInputChange("afterHoursMessage", e.target.value)}
                  placeholder="We're currently closed..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyNumber">Emergency Routing Number</Label>
                <Input
                  id="emergencyNumber"
                  value={formData.emergencyNumber}
                  onChange={(e) => handleInputChange("emergencyNumber", e.target.value)}
                  placeholder="(555) 999-9999"
                />
                <p className="text-sm text-muted-foreground">
                  Urgent calls will be transferred to this number.
                </p>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Collect Caller Information</p>
                    <p className="text-sm text-muted-foreground">Ask for name and contact details</p>
                  </div>
                  <Switch
                    checked={formData.collectCallerInfo}
                    onCheckedChange={(checked) => handleInputChange("collectCallerInfo", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Send SMS Confirmations</p>
                    <p className="text-sm text-muted-foreground">Text appointment confirmations to callers</p>
                  </div>
                  <Switch
                    checked={formData.sendSmsConfirmation}
                    onCheckedChange={(checked) => handleInputChange("sendSmsConfirmation", checked)}
                  />
                </div>
              </div>
            </>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSave}>
                Save Changes
              </Button>
              {currentStep < 4 ? (
                <Button variant="hero" onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}>
                  Next Step
                </Button>
              ) : (
                <Button variant="hero" onClick={handleSave}>
                  Complete Setup
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentConfig;
