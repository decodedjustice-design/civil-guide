import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  notes: string;
  onNotesChange: (value: string) => void;
}

export function ClaimExplorer({ notes, onNotesChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Claim Explorer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Explore common issue categories and process language in plain English. This content is educational.
        </p>
        <ul className="text-sm list-disc pl-5 text-muted-foreground space-y-1">
          <li>Agency complaints and internal review paths</li>
          <li>Record-keeping practices that support clarity</li>
          <li>Questions people often ask during legal consultations</li>
        </ul>
        <Textarea placeholder="Attach your notes here" value={notes} onChange={(e) => onNotesChange(e.target.value)} />
      </CardContent>
    </Card>
  );
}
