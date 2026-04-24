import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  intake: Record<string, string>;
  notes: string;
}

export function DocumentBuilder({ intake, notes }: Props) {
  const output = `Case Summary\n- ${intake.caseSummary || "(not provided)"}\n\nKey Events\n${intake.keyEvents || "(not provided)"}\n\nGoals\n${intake.goals || "(not provided)"}\n\nClaim Explorer Notes\n${notes || "(not provided)"}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Formatter</CardTitle>
        <p className="text-sm text-muted-foreground">
          Formats your input into a structured document. Not legal advice.
        </p>
      </CardHeader>
      <CardContent>
        <Textarea value={output} readOnly className="min-h-[260px]" />
      </CardContent>
    </Card>
  );
}
