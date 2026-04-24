import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function TimelineTracker() {
  const [entry, setEntry] = useState("");
  const [items, setItems] = useState<string[]>([]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline Tracker</CardTitle>
        <p className="text-sm text-muted-foreground">This tracker does not calculate legal deadlines.</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input value={entry} onChange={(e) => setEntry(e.target.value)} placeholder="Add timeline note" />
          <button
            className="px-3 rounded-md bg-primary text-primary-foreground text-sm"
            onClick={() => {
              if (!entry.trim()) return;
              setItems((prev) => [entry, ...prev]);
              setEntry("");
            }}
          >
            Add
          </button>
        </div>
        <div className="space-y-2 text-sm">
          {items.map((item, idx) => (
            <div key={`${item}-${idx}`} className="border rounded-md p-2">{item}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
