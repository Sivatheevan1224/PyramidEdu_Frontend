import { Card } from "@/components/ui/card";

interface SectionPlaceholderProps {
  title: string;
  description: string;
  emptyMessage: string;
}

export const SectionPlaceholder = ({
  title,
  description,
  emptyMessage,
}: SectionPlaceholderProps) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    <Card className="p-6 text-sm text-muted-foreground">{emptyMessage}</Card>
  </div>
);
