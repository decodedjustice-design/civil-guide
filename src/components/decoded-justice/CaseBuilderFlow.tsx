import { useMemo, useState } from "react";

const steps = ["Write Story", "Timeline", "Evidence", "Issues"] as const;

type Step = (typeof steps)[number];

export function CaseBuilderFlow() {
  const [activeStep, setActiveStep] = useState<Step>("Write Story");

  const helperText = useMemo(() => {
    switch (activeStep) {
      case "Write Story":
        return "Use plain language and describe what happened first.";
      case "Timeline":
        return "Add dates in order so your timeline is easy to follow.";
      case "Evidence":
        return "Upload files and explain why each one matters.";
      case "Issues":
        return "Select issue areas that match your situation.";
      default:
        return "";
    }
  }, [activeStep]);

  return (
    <section className="rounded-xl border bg-card p-5 space-y-4">
      <h2 className="text-xl font-semibold">Case Builder</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        {steps.map((step) => (
          <button
            key={step}
            type="button"
            onClick={() => setActiveStep(step)}
            className={`rounded-md px-3 py-2 text-sm text-left border transition ${
              activeStep === step ? "bg-primary text-primary-foreground border-primary" : "bg-background"
            }`}
          >
            {step}
          </button>
        ))}
      </div>
      <div className="rounded-md bg-muted/50 p-4 text-sm text-muted-foreground">
        {helperText}
      </div>
    </section>
  );
}
