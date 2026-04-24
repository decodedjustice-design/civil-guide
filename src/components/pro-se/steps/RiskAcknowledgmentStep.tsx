import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Props {
  educationalOnly: boolean;
  withoutAttorneyRisk: boolean;
  onChange: (value: { educationalOnly: boolean; withoutAttorneyRisk: boolean }) => void;
}

export function RiskAcknowledgmentStep({ educationalOnly, withoutAttorneyRisk, onChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Acknowledgment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id="educationalOnly"
            checked={educationalOnly}
            onCheckedChange={(checked) => onChange({ educationalOnly: !!checked, withoutAttorneyRisk })}
          />
          <Label htmlFor="educationalOnly" className="font-normal">
            I understand this platform provides educational tools only and not legal advice.
          </Label>
        </div>
        <div className="flex items-start gap-3">
          <Checkbox
            id="withoutAttorneyRisk"
            checked={withoutAttorneyRisk}
            onCheckedChange={(checked) => onChange({ educationalOnly, withoutAttorneyRisk: !!checked })}
          />
          <Label htmlFor="withoutAttorneyRisk" className="font-normal">
            I understand the risks of proceeding without an attorney.
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
