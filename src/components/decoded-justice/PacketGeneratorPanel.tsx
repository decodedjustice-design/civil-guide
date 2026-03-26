import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function PacketGeneratorPanel() {
  const [progress, setProgress] = useState(0);

  const simulateGeneration = () => {
    setProgress(10);
    const marks = [35, 60, 80, 100];
    marks.forEach((value, idx) => {
      setTimeout(() => setProgress(value), (idx + 1) * 500);
    });
  };

  return (
    <section className="rounded-xl border bg-card p-5 space-y-4">
      <h2 className="text-xl font-semibold">Generate case packet</h2>
      <p className="text-sm text-muted-foreground">
        Build a professional packet with summary, timeline, evidence index, and issue context.
      </p>
      <Button onClick={simulateGeneration}>Generate packet</Button>
      <Progress value={progress} className="h-2" />
      <div className="text-xs text-muted-foreground">Progress: {progress}%</div>

      <div className="grid gap-2 md:grid-cols-3">
        <Button variant="secondary">Download PDF</Button>
        <Button variant="secondary">Download ZIP</Button>
        <Button variant="secondary">Create secure share link</Button>
      </div>
    </section>
  );
}
