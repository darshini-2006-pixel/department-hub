import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/StatusBadge";
import { CategoryBadge } from "@/components/CategoryBadge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";

export default function FacultySubmissions() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Tables<"submissions">[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState<Tables<"submissions"> | null>(null);
  const [feedback, setFeedback] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const load = async () => {
    let q = supabase.from("submissions").select("*").order("created_at", { ascending: false });
    if (filterStatus !== "all") q = q.eq("status", filterStatus as any);
    const { data } = await q;
    setSubmissions(data || []);
  };

  useEffect(() => { load(); }, [filterStatus]);

  const handleAction = async (status: "approved" | "rejected") => {
    if (!selected || !user) return;
    if (status === "rejected" && !feedback.trim()) {
      toast({ title: "Feedback required", description: "Please provide feedback for rejection.", variant: "destructive" });
      return;
    }
    setActionLoading(true);
    const { error } = await supabase.from("submissions").update({
      status,
      faculty_feedback: feedback.trim() || null,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    }).eq("id", selected.id);

    if (!error) {
      // Notify student
      await supabase.from("notifications").insert({
        user_id: selected.student_id,
        type: status === "approved" ? "submission_approved" : "submission_rejected",
        message: status === "approved"
          ? `Your project "${selected.title}" has been approved!`
          : `Your project "${selected.title}" was rejected. Check feedback.`,
        link: "/student/submissions",
      });
      toast({ title: status === "approved" ? "Approved!" : "Rejected", description: `Submission has been ${status}.` });
      setSelected(null);
      setFeedback("");
      load();
    } else {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
    setActionLoading(false);
  };

  return (
    <div className="space-y-4">
      <Select value={filterStatus} onValueChange={setFilterStatus}>
        <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>

      {submissions.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">No submissions found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell className="font-medium">{sub.title}</TableCell>
                <TableCell><CategoryBadge category={sub.category} /></TableCell>
                <TableCell><StatusBadge status={sub.status} /></TableCell>
                <TableCell>{format(new Date(sub.created_at), "MMM d, yyyy")}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => { setSelected(sub); setFeedback(""); }}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div><strong>Category:</strong> <CategoryBadge category={selected.category} /></div>
              <div><strong>Description:</strong> {selected.description}</div>
              {selected.team_members && selected.team_members.length > 0 && (
                <div><strong>Team:</strong> {selected.team_members.join(", ")}</div>
              )}
              {selected.mentor && <div><strong>Mentor:</strong> {selected.mentor}</div>}
              {selected.proof_link && (
                <div><strong>Proof:</strong> <a href={selected.proof_link} target="_blank" rel="noreferrer" className="text-primary underline">{selected.proof_link}</a></div>
              )}
              <div><strong>Status:</strong> <StatusBadge status={selected.status} /></div>

              {selected.status === "pending" && (
                <div className="space-y-2 pt-2">
                  <Textarea placeholder="Feedback (required for rejection)" value={feedback} onChange={(e) => setFeedback(e.target.value)} />
                  <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => handleAction("rejected")} disabled={actionLoading}>
                      Reject
                    </Button>
                    <Button onClick={() => handleAction("approved")} disabled={actionLoading}>
                      Approve
                    </Button>
                  </DialogFooter>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
