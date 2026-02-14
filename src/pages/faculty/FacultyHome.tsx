import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, FileText, CheckCircle, XCircle, Users, Clock } from "lucide-react";

export default function FacultyHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ newsletters: 0, pending: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [nlRes, subRes] = await Promise.all([
        supabase.from("newsletters").select("id", { count: "exact", head: true }).eq("created_by", user.id),
        supabase.from("submissions").select("status"),
      ]);
      const subs = subRes.data || [];
      setStats({
        newsletters: nlRes.count || 0,
        pending: subs.filter((s) => s.status === "pending").length,
        approved: subs.filter((s) => s.status === "approved").length,
        rejected: subs.filter((s) => s.status === "rejected").length,
      });
    };
    load();
  }, [user]);

  const cards = [
    { label: "My Newsletters", value: stats.newsletters, icon: Newspaper, color: "text-primary" },
    { label: "Pending Reviews", value: stats.pending, icon: Clock, color: "text-warning" },
    { label: "Approved", value: stats.approved, icon: CheckCircle, color: "text-success" },
    { label: "Rejected", value: stats.rejected, icon: XCircle, color: "text-destructive" },
  ];

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Dashboard Overview</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
              <c.icon className={`h-5 w-5 ${c.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{c.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
