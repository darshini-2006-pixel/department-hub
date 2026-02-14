import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CategoryBadge } from "@/components/CategoryBadge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";

export default function NewsletterArchive() {
  const [newsletters, setNewsletters] = useState<Tables<"newsletters">[]>([]);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<Tables<"newsletters"> | null>(null);
  const pageSize = 10;

  const load = async () => {
    let q = supabase.from("newsletters").select("*", { count: "exact" }).order("created_at", { ascending: false }).range(page * pageSize, (page + 1) * pageSize - 1);
    if (filterCat !== "all") q = q.eq("category", filterCat as any);
    if (search) q = q.ilike("title", `%${search}%`);
    const { data, count } = await q;
    setNewsletters(data || []);
    setTotal(count || 0);
  };

  useEffect(() => { load(); }, [filterCat, search, page]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Input placeholder="Search newsletters…" className="max-w-xs" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} />
        <Select value={filterCat} onValueChange={(v) => { setFilterCat(v); setPage(0); }}>
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
        <div className="space-y-3">
          {newsletters.map((nl) => (
            <Card key={nl.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelected(nl)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{nl.title}</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <CategoryBadge category={nl.category} />
                      <span className="text-xs text-muted-foreground">{format(new Date(nl.created_at), "MMM d, yyyy")}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</Button>
          <span className="text-sm text-muted-foreground">Page {page + 1} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <CategoryBadge category={selected.category} />
                <span className="text-sm text-muted-foreground">{format(new Date(selected.created_at), "MMMM d, yyyy")}</span>
              </div>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: selected.content }} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
