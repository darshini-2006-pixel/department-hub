import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, CheckCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";

export default function Notifications() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Tables<"notifications">[]>([]);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setNotifications(data || []);
  };

  useEffect(() => { load(); }, [user]);

  const markRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    load();
  };

  const markAllRead = async () => {
    if (!user) return;
    await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
    toast({ title: "All marked as read" });
    load();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-4">
      {unreadCount > 0 && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCheck className="mr-1 h-4 w-4" /> Mark all as read
          </Button>
        </div>
      )}

      {notifications.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">No notifications.</p>
      ) : (
        notifications.map((n) => (
          <Card key={n.id} className={n.read ? "opacity-60" : ""} onClick={() => !n.read && markRead(n.id)}>
            <CardContent className="flex items-start gap-3 p-4 cursor-pointer">
              <Bell className={`mt-0.5 h-4 w-4 shrink-0 ${n.read ? "text-muted-foreground" : "text-primary"}`} />
              <div className="flex-1">
                <p className="text-sm">{n.message}</p>
                <span className="text-xs text-muted-foreground">{format(new Date(n.created_at), "MMM d, h:mm a")}</span>
              </div>
              {!n.read && <span className="h-2 w-2 rounded-full bg-primary" />}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
