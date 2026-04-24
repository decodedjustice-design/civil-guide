import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface LegalAidContact {
  org_name: string;
  result: string;
}

interface Props {
  entries: LegalAidContact[];
  onAdd: (entry: LegalAidContact) => Promise<void>;
}

export function LegalAidStep({ entries, onAdd }: Props) {
  const [draft, setDraft] = useState<LegalAidContact>({ org_name: "", result: "" });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Legal Aid Contact Step</CardTitle>
        <p className="text-sm text-muted-foreground">{entries.length} of 2 completed</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <Input placeholder="Organization" value={draft.org_name} onChange={(e) => setDraft((prev) => ({ ...prev, org_name: e.target.value }))} />
          <Input placeholder="Result" value={draft.result} onChange={(e) => setDraft((prev) => ({ ...prev, result: e.target.value }))} />
        </div>
        <Button
          type="button"
          onClick={async () => {
            if (!draft.org_name || !draft.result || entries.length >= 2) return;
            await onAdd(draft);
            setDraft({ org_name: "", result: "" });
          }}
          disabled={entries.length >= 2}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Legal Aid Contact
        </Button>

        <div className="space-y-2">
          {entries.map((entry, idx) => (
            <div key={`${entry.org_name}-${idx}`} className="rounded-md border border-border p-3 text-sm">
              <span className="font-medium">{entry.org_name}</span> · {entry.result}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
