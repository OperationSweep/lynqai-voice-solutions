import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
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
import { Search, Phone, Calendar, Clock, ChevronDown, ChevronUp, Download, Play, Star, StarOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCallLogs, useUpdateCallLog } from "@/hooks/useCallLogs";
import { format, formatDistanceToNow } from "date-fns";
import { GlassCard, StatusBadge } from "@/components/premium";
import { PageTransition } from "@/components/premium/PageTransition";

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

  const getOutcomeStatus = (outcome: string | null): "success" | "error" | "warning" | "neutral" => {
    if (['appointment_booked', 'lead_qualified'].includes(outcome || '')) return "success";
    if (['missed', 'voicemail'].includes(outcome || '')) return "error";
    return "neutral";
  };

  const formatOutcome = (outcome: string | null) => {
    if (!outcome) return 'Unknown';
    return outcome.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const handleToggleStar = async (callId: string, isStarred: boolean) => {
    await updateCallLog.mutateAsync({ id: callId, updates: { is_starred: !isStarred } });
  };

  const handleMarkRead = async (callId: string) => {
    await updateCallLog.mutateAsync({ id: callId, updates: { is_read: true } });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl font-bold">Call Logs</h1>
            <p className="text-muted-foreground mt-1">View and manage all your call history.</p>
          </motion.div>
          <Button variant="outline" className="border-border/50">
            <Download className="mr-2 h-4 w-4" />Export CSV
          </Button>
        </div>

        <GlassCard hover={false} className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name or phone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-background/50" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-background/50">
                <SelectValue placeholder="Filter by outcome" />
              </SelectTrigger>
              <SelectContent className="glass-card">
                <SelectItem value="all">All Calls</SelectItem>
                <SelectItem value="appointment_booked">Appointment Booked</SelectItem>
                <SelectItem value="lead_qualified">Lead Qualified</SelectItem>
                <SelectItem value="missed">Missed</SelectItem>
                <SelectItem value="voicemail">Voicemail</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </GlassCard>

        <GlassCard hover={false} className="p-0 overflow-hidden">
          {filteredCalls.length === 0 ? (
            <div className="p-12 text-center">
              <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No calls found. Your AI receptionist is ready!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-muted-foreground border-b border-border/50">
                    <th className="p-4 font-medium">Caller</th>
                    <th className="p-4 font-medium">Date & Time</th>
                    <th className="p-4 font-medium">Duration</th>
                    <th className="p-4 font-medium">Outcome</th>
                    <th className="p-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCalls.map((call, idx) => (
                    <>
                      <motion.tr
                        key={call.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className={cn("border-b border-border/30 cursor-pointer hover:bg-muted/30 transition-colors", !call.is_read && "bg-primary/5")}
                        onClick={() => { setExpandedRow(expandedRow === call.id ? null : call.id); if (!call.is_read) handleMarkRead(call.id); }}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-white font-medium">
                              {(call.caller_name || 'U').charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {call.caller_name || 'Unknown'}
                                {call.is_starred && <Star className="h-4 w-4 text-amber-400 fill-amber-400" />}
                              </div>
                              <div className="text-sm text-muted-foreground">{call.caller_phone || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-sm"><Calendar className="h-4 w-4 text-muted-foreground" />{format(new Date(call.call_start), 'MMM d, yyyy')}</div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1"><Clock className="h-4 w-4" />{format(new Date(call.call_start), 'h:mm a')}</div>
                        </td>
                        <td className="p-4">{Math.floor((call.duration_seconds || 0) / 60)}:{String((call.duration_seconds || 0) % 60).padStart(2, '0')}</td>
                        <td className="p-4"><StatusBadge status={getOutcomeStatus(call.outcome)} label={formatOutcome(call.outcome)} /></td>
                        <td className="p-4">{expandedRow === call.id ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}</td>
                      </motion.tr>
                      {expandedRow === call.id && (
                        <tr className="bg-muted/20">
                          <td colSpan={5} className="p-6">
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-semibold mb-2">Summary</h4>
                                <p className="text-sm text-muted-foreground">{call.summary || 'No summary available.'}</p>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Button variant="outline" size="sm" onClick={() => setSelectedCall(call)}><Phone className="mr-2 h-4 w-4" />View Transcript</Button>
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
        </GlassCard>

        <Dialog open={!!selectedCall} onOpenChange={() => setSelectedCall(null)}>
          <DialogContent className="max-w-2xl glass-card">
            <DialogHeader>
              <DialogTitle>Call Transcript</DialogTitle>
              <DialogDescription>{selectedCall?.caller_name || 'Unknown'} - {selectedCall?.call_start && format(new Date(selectedCall.call_start), 'PPpp')}</DialogDescription>
            </DialogHeader>
            <div className="bg-muted/50 rounded-xl p-4 font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">{selectedCall?.transcript || "No transcript available."}</div>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
};

export default CallLogs;
