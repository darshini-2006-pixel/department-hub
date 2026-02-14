import { Badge } from "@/components/ui/badge";

const categoryLabels: Record<string, string> = {
  technical: "Technical",
  placement: "Placement",
  new_technologies: "New Technologies",
  achievements: "Achievements",
};

export function CategoryBadge({ category }: { category: string }) {
  return (
    <Badge variant="secondary">
      {categoryLabels[category] || category}
    </Badge>
  );
}
