import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProcessGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Process Guide</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">
          Educational overview only. This section explains common filing stages and motion terms in plain language.
        </p>
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
          <li>Complaint: the first document that starts a civil court case.</li>
          <li>Response/Answer: the written response from the other side.</li>
          <li>Motion: a formal request asking the court to decide a procedural issue.</li>
        </ul>
      </CardContent>
    </Card>
  );
}
