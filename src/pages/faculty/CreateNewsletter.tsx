import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RichTextEditor } from "@/components/RichTextEditor";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Category = Database["public"]["Enums"]["newsletter_category"];

const categories: { value: Category; label: string }[] = [
  { value: "technical", label: "Technical" },
  { value: "placement", label: "Placement" },
  { value: "new_technologies", label: "New Technologies" },
  { value: "achievements", label: "Achievements" },
];

export default function CreateNewsletter() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("technical");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim() || !content.trim()) return;
    setLoading(true);

    const { error } = await supabase.from("newsletters").insert({
      title: title.trim(),
      category,
      content,
      created_by: user.id,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      // Create notifications for all students
      const { data: studentRoles } = await supabase.from("user_roles").select("user_id").eq("role", "student");
      if (studentRoles && studentRoles.length > 0) {
        const notifications = studentRoles.map((sr) => ({
          user_id: sr.user_id,
          type: "newsletter_posted" as const,
          message: `New ${categories.find(c => c.value === category)?.label} update: ${title.trim()}`,
          link: "/student/newsletters",
        }));
        await supabase.from("notifications").insert(notifications);
      }
      toast({ title: "Published!", description: "Newsletter has been posted." });
      navigate("/faculty/newsletters");
    }
    setLoading(false);
  };

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>Create Newsletter</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Newsletter title" required />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Content</Label>
            <RichTextEditor content={content} onChange={setContent} />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Publishing…" : "Publish Newsletter"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
