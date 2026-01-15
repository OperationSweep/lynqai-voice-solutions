import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Phone,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Download,
  Play,
  UserPlus,
  Mail,
  ThumbsUp,
  ThumbsDown,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const callLogs = [
  {
    id: 1,
    caller: "Sarah Johnson",
    phone: "(555) 123-4567",
    date: "2024-01-15",
    time: "10:32 AM",
    duration: "4:32",
    status: "completed",
    sentiment: "positive",
    leadScore: 9,
    appointmentBooked: true,
    appointmentTime: "2024-01-17 2:00 PM",
    transcript: "AI: Hello! Thank you for calling Premier Properties. I'm your AI assistant. How can I help you today?\n\nCaller: Hi, I'm looking for a 3-bedroom house in the downtown area.\n\nAI: Great! I'd be happy to help you find the perfect home. What's your budget range?\n\nCaller: We're looking at around $500,000 to $600,000.\n\nAI: Excellent. We have several properties in that range. Would you like to schedule a viewing? I can book an appointment with one of our agents.\n\nCaller: Yes, that would be great.\n\nAI: Perfect! I've scheduled a showing for January 17th at 2:00 PM. You'll receive a confirmation text shortly.",
    summary: "Caller interested in 3-bedroom downtown home, budget $500K-$600K. Appointment scheduled for property viewing.",
    recordingUrl: "#",
  },
  {
    id: 2,
    caller: "Michael Chen",
    phone: "(555) 234-5678",
    date: "2024-01-15",
    time: "9:15 AM",
    duration: "2:15",
    status: "completed",
    sentiment: "neutral",
    leadScore: 5,
    appointmentBooked: false,
    transcript: "AI: Hello! Thank you for calling Premier Properties. How can I assist you?\n\nCaller: I'm just calling to get some information about listings in the area.\n\nAI: Of course! What area are you interested in?\n\nCaller: I'm looking at the suburbs, maybe something with a big backyard.\n\nAI: We have several properties that might interest you. Would you like me to email you some listings?\n\nCaller: That would be great, thanks.",
    summary: "Information request about suburban listings with large yards. No appointment scheduled. Email follow-up needed.",
    recordingUrl: "#",
  },
  {
    id: 3,
    caller: "Unknown",
    phone: "(555) 345-6789",
    date: "2024-01-14",
    time: "6:45 PM",
    duration: "0:45",
    status: "missed",
    sentiment: null,
    leadScore: null,
    appointmentBooked: false,
    transcript: "",
    summary: "Caller hung up before conversation started. After-hours call.",
    recordingUrl: "#",
  },
  {
    id: 4,
    caller: "Emily Rodriguez",
    phone: "(555) 456-7890",
    date: "2024-01-14",
    time: "3:22 PM",
    duration: "6:08",
    status: "completed",
    sentiment: "positive",
    leadScore: 8,
    appointmentBooked: true,
    appointmentTime: "2024-01-16 10:00 AM",
    transcript: "Full transcript would appear here...",
    summary: "Hot lead interested in luxury condos. Pre-approved for $800K. Appointment scheduled.",
    recordingUrl: "#",
  },
  {
    id: 5,
    caller: "David Kim",
    phone: "(555) 567-8901",
    date: "2024-01-14",
    time: "11:00 AM",
    duration: "3:22",
    status: "completed",
    sentiment: "negative",
    leadScore: 3,
    appointmentBooked: false,
    transcript: "Full transcript would appear here...",
    summary: "Caller complained about previous service. Issue escalated to manager.",
    recordingUrl: "#",
  },
];

const CallLogs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [selectedCall, setSelectedCall] = useState<typeof callLogs[0] | null>(null);

  const filteredCalls = callLogs.filter((call) => {
    const matchesSearch =
      call.caller.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.phone.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || call.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getSentimentIcon = (sentiment: string | null) => {
    if (sentiment === "positive") return <ThumbsUp className="h-4 w-4 text-accent" />;
    if (sentiment === "negative") return <ThumbsDown className="h-4 w-4 text-destructive" />;
    if (sentiment === "neutral") return <Minus className="h-4 w-4 text-muted-foreground" />;
    return null;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Call Logs</h1>
          <p className="text-muted-foreground mt-1">View and manage all your call history.</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Calls</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="missed">Missed</SelectItem>
                <SelectItem value="voicemail">Voicemail</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Calls Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-muted-foreground border-b border-border">
                  <th className="p-4 font-medium">Caller</th>
                  <th className="p-4 font-medium">Date & Time</th>
                  <th className="p-4 font-medium">Duration</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Sentiment</th>
                  <th className="p-4 font-medium">Lead Score</th>
                  <th className="p-4 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filteredCalls.map((call) => (
                  <>
                    <tr
                      key={call.id}
                      className={cn(
                        "border-b border-border/50 cursor-pointer hover:bg-muted/50 transition-colors",
                        expandedRow === call.id && "bg-muted/50"
                      )}
                      onClick={() => setExpandedRow(expandedRow === call.id ? null : call.id)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                            {call.caller.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <div className="font-medium">{call.caller}</div>
                            <div className="text-sm text-muted-foreground">{call.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {call.date}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Clock className="h-4 w-4" />
                          {call.time}
                        </div>
                      </td>
                      <td className="p-4 text-sm">{call.duration}</td>
                      <td className="p-4">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          call.status === "completed" && "bg-accent/20 text-accent",
                          call.status === "missed" && "bg-destructive/20 text-destructive",
                          call.status === "voicemail" && "bg-muted text-muted-foreground"
                        )}>
                          {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getSentimentIcon(call.sentiment)}
                          <span className="text-sm capitalize">{call.sentiment || "N/A"}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {call.leadScore ? (
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold",
                              call.leadScore >= 7 ? "bg-accent/20 text-accent" :
                              call.leadScore >= 4 ? "bg-yellow-100 text-yellow-700" :
                              "bg-destructive/20 text-destructive"
                            )}>
                              {call.leadScore}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">N/A</span>
                        )}
                      </td>
                      <td className="p-4">
                        {expandedRow === call.id ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </td>
                    </tr>
                    {expandedRow === call.id && (
                      <tr className="bg-muted/30">
                        <td colSpan={7} className="p-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold mb-2">Summary</h4>
                              <p className="text-sm text-muted-foreground">{call.summary}</p>
                              
                              {call.appointmentBooked && (
                                <div className="mt-4 p-3 rounded-lg bg-accent/10 border border-accent/20">
                                  <div className="flex items-center gap-2 text-accent font-medium">
                                    <Calendar className="h-4 w-4" />
                                    Appointment Booked
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">{call.appointmentTime}</p>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button variant="outline" size="sm" onClick={() => setSelectedCall(call)}>
                                <Phone className="mr-2 h-4 w-4" />
                                View Full Transcript
                              </Button>
                              <Button variant="outline" size="sm">
                                <Play className="mr-2 h-4 w-4" />
                                Play Recording
                              </Button>
                              <Button variant="outline" size="sm">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Add to CRM
                              </Button>
                              <Button variant="outline" size="sm">
                                <Mail className="mr-2 h-4 w-4" />
                                Send Follow-up
                              </Button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Transcript Dialog */}
      <Dialog open={!!selectedCall} onOpenChange={() => setSelectedCall(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Call Transcript</DialogTitle>
            <DialogDescription>
              {selectedCall?.caller} - {selectedCall?.date} at {selectedCall?.time}
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted rounded-lg p-4 font-mono text-sm whitespace-pre-wrap">
            {selectedCall?.transcript || "No transcript available."}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CallLogs;
