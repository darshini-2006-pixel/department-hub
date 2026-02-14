import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Category = Database["public"]["Enums"]["newsletter_category"];

export default function SubmitProject() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("achievements");
  const [description, setDescription] = useState("");
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [memberInput, setMemberInput] = useState("");
  const [mentor, setMentor] = useState("");
  const [proofLink, setProofLink] = useState("");
  const [loading, setLoading] = useState(false);

  const addMember = () => {
    if (memberInput.trim()) {
      setTeamMembers([...teamMembers, memberInput.trim()]);
      setMemberInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const { error } = await supabase.from("submissions").insert({
      student_id: user.id,
      title: title.trim(),
      category,
      description: description.trim(),
      team_members: teamMembers,
      mentor: mentor.trim() || null,
      proof_link: proofLink.trim() || null,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Submitted!", description: "Your project has been submitted for review." });
      navigate("/student/submissions");
    }
    setLoading(false);
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Submit Project</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project title" required />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="placement">Placement</SelectItem>
                <SelectItem value="new_technologies">New Technologies</SelectItem>
                <SelectItem value="achievements">Achievements</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your project…" required />
          </div>
          <div className="space-y-2">
            <Label>Team Members</Label>
            <div className="flex gap-2">
              <Input value={memberInput} onChange={(e) => setMemberInput(e.target.value)} placeholder="Add member name" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addMember())} />
              <Button type="button" variant="outline" onClick={addMember}>Add</Button>
            </div>
            {teamMembers.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {teamMembers.map((m, i) => (
                  <span key={i} className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm">
                    {m}
                    <button type="button" onClick={() => setTeamMembers(teamMembers.filter((_, j) => j !== i))}><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>Mentor (optional)</Label>
            <Input value={mentor} onChange={(e) => setMentor(e.target.value)} placeholder="Guide/Mentor name" />
          </div>
          <div className="space-y-2">
            <Label>Proof Link (optional)</Label>
            <Input value={proofLink} onChange={(e) => setProofLink(e.target.value)} placeholder="https://…" />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Submitting…" : "Submit Project"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
