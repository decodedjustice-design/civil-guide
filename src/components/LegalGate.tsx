import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "decoded_justice_legal_gate_accepted_v1";

export function hasAcceptedLegalGate() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEY) === "true";
}

export function LegalGate() {
  const [isAcknowledged, setIsAcknowledged] = useState(hasAcceptedLegalGate());

  const handleContinue = () => {
    window.localStorage.setItem(STORAGE_KEY, "true");
    window.dispatchEvent(new Event("legal-gate-updated"));
    setIsAcknowledged(true);
  };

  if (isAcknowledged) return null;

  return (
    <div className="w-full max-w-xl rounded-2xl border border-border/70 bg-background/95 p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
      <h2 className="mb-3 text-center text-2xl font-semibold text-foreground">Before You Begin</h2>
      <p className="mb-6 text-center text-sm leading-relaxed text-muted-foreground">
        Decoded Justice helps you organize information and understand civil rights. It does NOT provide legal advice
        and does NOT create an attorney-client relationship.
      </p>

      <Button onClick={handleContinue} className="h-11 w-full">
        I understand — get started
      </Button>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Not ready?{" "}
        <Link to="/about" className="text-primary hover:underline">
          Learn more first
        </Link>
      </p>
    </div>
  );
}
