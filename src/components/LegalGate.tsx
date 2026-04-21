import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "decoded_justice_legal_gate_accepted_v1";

export function hasAcceptedLegalGate() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEY) === "true";
}

export function LegalGate() {
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);
  const [acceptedEducationalUse, setAcceptedEducationalUse] = useState(false);

  const canContinue = useMemo(
    () => acceptedDisclaimer && acceptedEducationalUse,
    [acceptedDisclaimer, acceptedEducationalUse]
  );

  const handleContinue = () => {
    window.localStorage.setItem(STORAGE_KEY, "true");
    window.dispatchEvent(new Event("legal-gate-updated"));
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-8 shadow-2xl">
        <h1 className="text-2xl font-semibold text-foreground mb-3">Welcome to Decoded Justice</h1>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          Before you continue, please confirm you understand what this platform can and can't do.
        </p>

        <div className="space-y-4 mb-6">
          <label className="flex items-start gap-3 text-sm text-foreground">
            <input
              type="checkbox"
              className="mt-0.5"
              checked={acceptedDisclaimer}
              onChange={(event) => setAcceptedDisclaimer(event.target.checked)}
            />
            <span>I understand Decoded Justice is not a lawyer and does not provide legal advice.</span>
          </label>

          <label className="flex items-start gap-3 text-sm text-foreground">
            <input
              type="checkbox"
              className="mt-0.5"
              checked={acceptedEducationalUse}
              onChange={(event) => setAcceptedEducationalUse(event.target.checked)}
            />
            <span>I understand this platform helps me learn and stay organized, but it does not act for me.</span>
          </label>
        </div>

        <Button onClick={handleContinue} disabled={!canContinue} className="w-full h-11">
          I Understand &amp; Continue
        </Button>
      </div>
    </div>
  );
}
