import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EvidenceItem {
  id?: string;
  category: string;
  file_url: string;
  metadata?: Record<string, any>;
}

interface Props {
  items: EvidenceItem[];
  onAdd: (item: Omit<EvidenceItem, "id">) => Promise<void>;
}

export function EvidenceManager({ items, onAdd }: Props) {
  const [category, setCategory] = useState("Documents");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evidence Organizer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2 items-center">
          <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" className="max-w-xs" />
          <Input
            type="file"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              await onAdd({
                category,
                file_url: `local://${file.name}`,
                metadata: { fileName: file.name, size: file.size, type: file.type },
              });
              e.target.value = "";
            }}
          />
        </div>

        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={`${item.file_url}-${idx}`} className="rounded-md border border-border p-3 text-sm">
              <p className="font-medium">{item.metadata?.fileName ?? item.file_url}</p>
              <p className="text-muted-foreground">Category: {item.category}</p>
            </div>
          ))}
          {!items.length && <p className="text-sm text-muted-foreground">No files added yet.</p>}
        </div>

        <Button variant="outline" size="sm" disabled>
          File interpretation is intentionally disabled.
        </Button>
      </CardContent>
    </Card>
  );
}
