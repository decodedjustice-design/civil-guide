import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  value: {
    caseSummary: string;
    keyEvents: string;
    goals: string;
    concerns: string;
  };
  onChange: (value: Props["value"]) => void;
}

export function CaseIntakeStep({ value, onChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Case Intake Form</CardTitle>
        <p className="text-sm text-muted-foreground">
          This form helps organize your information. It does not evaluate your case.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input
          placeholder="Short summary"
          value={value.caseSummary}
          onChange={(e) => onChange({ ...value, caseSummary: e.target.value })}
        />
        <Textarea
          placeholder="Key events"
          value={value.keyEvents}
          onChange={(e) => onChange({ ...value, keyEvents: e.target.value })}
        />
        <Textarea
          placeholder="Your goals"
          value={value.goals}
          onChange={(e) => onChange({ ...value, goals: e.target.value })}
        />
        <Textarea
          placeholder="Current concerns"
          value={value.concerns}
          onChange={(e) => onChange({ ...value, concerns: e.target.value })}
        />
      </CardContent>
    </Card>
  );
}
