import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface AttorneyContact {
  name: string;
  outcome: string;
  date: string;
}

interface Props {
  entries: AttorneyContact[];
  onAdd: (entry: AttorneyContact) => Promise<void>;
}

export function AttorneyOutreachStep({ entries, onAdd }: Props) {
  const [draft, setDraft] = useState<AttorneyContact>({ name: "", outcome: "", date: "" });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attorney Outreach Tracker</CardTitle>
        <p className="text-sm text-muted-foreground">{entries.length} of 10 completed</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-3 gap-3">
          <Input placeholder="Attorney name" value={draft.name} onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))} />
          <Input placeholder="Outcome" value={draft.outcome} onChange={(e) => setDraft((prev) => ({ ...prev, outcome: e.target.value }))} />
          <Input type="date" value={draft.date} onChange={(e) => setDraft((prev) => ({ ...prev, date: e.target.value }))} />
        </div>
        <Button
          type="button"
          onClick={async () => {
            if (!draft.name || !draft.outcome || !draft.date || entries.length >= 10) return;
            await onAdd(draft);
            setDraft({ name: "", outcome: "", date: "" });
          }}
          disabled={entries.length >= 10}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Outreach Entry
        </Button>

        <div className="space-y-2">
          {entries.map((entry, idx) => (
            <div key={`${entry.name}-${idx}`} className="rounded-md border border-border p-3 text-sm">
              <span className="font-medium">{entry.name}</span> · {entry.outcome} · {entry.date}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
