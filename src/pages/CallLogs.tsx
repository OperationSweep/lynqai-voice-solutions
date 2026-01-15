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
  Star,
  StarOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCallLogs, useUpdateCallLog } from "@/hooks/useCallLogs";
import { format, formatDistanceToNow } from "date-fns";

const CallLogs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [selectedCall, setSelectedCall] = useState<any | null>(null);

  const { data: callLogs, isLoading } = useCallLogs({ outcome: statusFilter !== 'all' ? statusFilter : undefined });
  const updateCallLog = useUpdateCallLog();

  const filteredCalls = (callLogs || []).filter((call) => {
    const matchesSearch =
      (call.caller_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (call.caller_phone || '').includes(searchQuery);
    return matchesSearch;
  });

  const getSentimentIcon = (outcome: string | null) => {
    if (['appointment_booked', 'lead_qualified'].includes(outcome || '')) return <ThumbsUp className="h-4 w-4 text-accent" />;
    if (['missed', 'voicemail'].includes(outcome || '')) return <ThumbsDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const formatOutcome = (outcome: string | null) => {
    if (!outcome) return 'Unknown';
    return outcome.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const getOutcomeStyle = (outcome: string | null) => {
    if (['appointment_booked', 'lead_qualified'].includes(outcome || '')) return "bg-accent/20 text-accent";
    if (['missed', 'voicemail'].includes(outcome || '')) return "bg-destructive/20 text-destructive";
    return "bg-muted text-muted-foreground";
  };

  const handleToggleStar = async (callId: string, isStarred: boolean) => {
    await updateCallLog.mutateAsync({ id: callId, updates: { is_starred: !isStarred } });
  };

  const handleMarkRead = async (callId: string) => {
    await updateCallLog.mutateAsync({ id: callId, updates: { is_read: true } });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Call Logs</h1>
          <p className="text-muted-foreground mt-1">View and manage all your call history.</p>
        </div>
        <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export CSV</Button>
      </div>

      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name or phone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48"><SelectValue placeholder="Filter by outcome" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Calls</SelectItem>
                <SelectItem value="appointment_booked">Appointment Booked</SelectItem>
                <SelectItem value="lead_qualified">Lead Qualified</SelectItem>
                <SelectItem value="information_provided">Information Provided</SelectItem>
                <SelectItem value="missed">Missed</SelectItem>
                <SelectItem value="voicemail">Voicemail</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {filteredCalls.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No calls found. Your AI receptionist is ready to take calls!</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-muted-foreground border-b border-border">
                    <th className="p-4 font-medium">Caller</th>
                    <th className="p-4 font-medium">Date & Time</th>
                    <th className="p-4 font-medium">Duration</th>
                    <th className="p-4 font-medium">Outcome</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCalls.map((call) => (
                    <>
                      <tr key={call.id} className={cn("border-b border-border/50 cursor-pointer hover:bg-muted/50 transition-colors", expandedRow === call.id && "bg-muted/50", !call.is_read && "bg-primary/5")} onClick={() => { setExpandedRow(expandedRow === call.id ? null : call.id); if (!call.is_read) handleMarkRead(call.id); }}>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                              {(call.caller_name || 'U').split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </div>
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {call.caller_name || 'Unknown'}
                                {call.is_starred && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                              </div>
                              <div className="text-sm text-muted-foreground">{call.caller_phone || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-sm"><Calendar className="h-4 w-4 text-muted-foreground" />{format(new Date(call.call_start), 'MMM d, yyyy')}</div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1"><Clock className="h-4 w-4" />{format(new Date(call.call_start), 'h:mm a')}</div>
                        </td>
                        <td className="p-4 text-sm">{Math.floor((call.duration_seconds || 0) / 60)}:{String((call.duration_seconds || 0) % 60).padStart(2, '0')}</td>
                        <td className="p-4"><span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", getOutcomeStyle(call.outcome))}>{formatOutcome(call.outcome)}</span></td>
                        <td className="p-4">{getSentimentIcon(call.outcome)}</td>
                        <td className="p-4">{expandedRow === call.id ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}</td>
                      </tr>
                      {expandedRow === call.id && (
                        <tr className="bg-muted/30">
                          <td colSpan={6} className="p-6">
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-semibold mb-2">Summary</h4>
                                <p className="text-sm text-muted-foreground">{call.summary || 'No summary available.'}</p>
                                {call.appointment_time && (
                                  <div className="mt-4 p-3 rounded-lg bg-accent/10 border border-accent/20">
                                    <div className="flex items-center gap-2 text-accent font-medium"><Calendar className="h-4 w-4" />Appointment Booked</div>
                                    <p className="text-sm text-muted-foreground mt-1">{format(new Date(call.appointment_time), 'PPpp')}</p>
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col gap-2">
                                <Button variant="outline" size="sm" onClick={() => setSelectedCall(call)}><Phone className="mr-2 h-4 w-4" />View Full Transcript</Button>
                                {call.recording_url && <Button variant="outline" size="sm" onClick={() => window.open(call.recording_url, '_blank')}><Play className="mr-2 h-4 w-4" />Play Recording</Button>}
                                <Button variant="outline" size="sm" onClick={() => handleToggleStar(call.id, call.is_starred || false)}>{call.is_starred ? <StarOff className="mr-2 h-4 w-4" /> : <Star className="mr-2 h-4 w-4" />}{call.is_starred ? 'Unstar' : 'Star'}</Button>
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
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedCall} onOpenChange={() => setSelectedCall(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Call Transcript</DialogTitle>
            <DialogDescription>{selectedCall?.caller_name || 'Unknown'} - {selectedCall?.call_start && format(new Date(selectedCall.call_start), 'PPpp')}</DialogDescription>
          </DialogHeader>
          <div className="bg-muted rounded-lg p-4 font-mono text-sm whitespace-pre-wrap">{selectedCall?.transcript || "No transcript available."}</div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CallLogs;
