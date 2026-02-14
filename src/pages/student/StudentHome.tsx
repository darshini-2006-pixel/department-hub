import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryBadge } from "@/components/CategoryBadge";
import { Bell } from "lucide-react";
import { format } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";

export default function StudentHome() {
  const { user } = useAuth();
  const [newsletters, setNewsletters] = useState<Tables<"newsletters">[]>([]);
  const [notifications, setNotifications] = useState<Tables<"notifications">[]>([]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("newsletters").select("*").order("created_at", { ascending: false }).limit(5),
      supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
    ]).then(([nlRes, notRes]) => {
      setNewsletters(nlRes.data || []);
      setNotifications(notRes.data || []);
    });
  }, [user]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Welcome Back!</h2>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-3 text-lg font-semibold">Latest Newsletters</h3>
          {newsletters.length === 0 ? (
            <p className="text-muted-foreground">No newsletters yet.</p>
          ) : (
            <div className="space-y-3">
              {newsletters.map((nl) => (
                <Card key={nl.id}>
                  <CardContent className="flex items-start justify-between p-4">
                    <div>
                      <Link to="/student/newsletters" className="font-medium hover:text-primary">{nl.title}</Link>
                      <div className="mt-1 flex items-center gap-2">
                        <CategoryBadge category={nl.category} />
                        <span className="text-xs text-muted-foreground">{format(new Date(nl.created_at), "MMM d, yyyy")}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-3 text-lg font-semibold">Recent Notifications</h3>
          {notifications.length === 0 ? (
            <p className="text-muted-foreground">No notifications.</p>
          ) : (
            <div className="space-y-2">
              {notifications.map((n) => (
                <Card key={n.id} className={n.read ? "opacity-60" : ""}>
                  <CardContent className="flex items-start gap-3 p-4">
                    <Bell className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <p className="text-sm">{n.message}</p>
                      <span className="text-xs text-muted-foreground">{format(new Date(n.created_at), "MMM d, h:mm a")}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
