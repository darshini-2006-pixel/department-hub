import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { CategoryBadge } from "@/components/CategoryBadge";
import { format } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";

export default function MySubmissions() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Tables<"submissions">[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("submissions").select("*").eq("student_id", user.id).order("created_at", { ascending: false }).then(({ data }) => {
      setSubmissions(data || []);
    });
  }, [user]);

  return (
    <div className="space-y-4">
      {submissions.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">No submissions yet.</p>
      ) : (
        submissions.map((sub) => (
          <Card key={sub.id}>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{sub.title}</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <CategoryBadge category={sub.category} />
                    <StatusBadge status={sub.status} />
                    <span className="text-xs text-muted-foreground">{format(new Date(sub.created_at), "MMM d, yyyy")}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{sub.description}</p>
              {sub.status === "rejected" && sub.faculty_feedback && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm">
                  <strong>Faculty Feedback:</strong> {sub.faculty_feedback}
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
