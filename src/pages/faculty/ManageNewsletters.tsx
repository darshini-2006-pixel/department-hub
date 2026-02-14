import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CategoryBadge } from "@/components/CategoryBadge";
import { Trash2, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";

export default function ManageNewsletters() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newsletters, setNewsletters] = useState<Tables<"newsletters">[]>([]);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");

  const load = async () => {
    if (!user) return;
    let q = supabase.from("newsletters").select("*").eq("created_by", user.id).order("created_at", { ascending: false });
    if (filterCat !== "all") q = q.eq("category", filterCat as any);
    if (search) q = q.ilike("title", `%${search}%`);
    const { data } = await q;
    setNewsletters(data || []);
  };

  useEffect(() => { load(); }, [user, filterCat, search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this newsletter?")) return;
    const { error } = await supabase.from("newsletters").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted" }); load(); }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Input placeholder="Search by title…" className="max-w-xs" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select value={filterCat} onValueChange={setFilterCat}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="technical">Technical</SelectItem>
            <SelectItem value="placement">Placement</SelectItem>
            <SelectItem value="new_technologies">New Technologies</SelectItem>
            <SelectItem value="achievements">Achievements</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {newsletters.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">No newsletters found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {newsletters.map((nl) => (
              <TableRow key={nl.id}>
                <TableCell className="font-medium">{nl.title}</TableCell>
                <TableCell><CategoryBadge category={nl.category} /></TableCell>
                <TableCell>{format(new Date(nl.created_at), "MMM d, yyyy")}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(nl.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
