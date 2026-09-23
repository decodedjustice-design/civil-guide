/**
 * Shared classification vocabulary for the unified case model.
 * Records never silently become "fact" — analyzer output enters as
 * "allegation" or "unknown" and only a person can change it.
 */
export type Classification = "fact" | "allegation" | "inference" | "disputed" | "unknown";

export const CLASSIFICATIONS: { value: Classification; label: string; help: string }[] = [
  { value: "fact", label: "Fact", help: "Documented in a record you can point to." },
  { value: "allegation", label: "Allegation", help: "Someone stated it. Not yet verified." },
  { value: "inference", label: "Inference", help: "Your reasonable read of the record." },
  { value: "disputed", label: "Disputed", help: "Accounts conflict." },
  { value: "unknown", label: "Unknown", help: "Not yet reviewed or classified." },
];

export const CLASSIFICATION_LABELS: Record<Classification, string> = CLASSIFICATIONS.reduce(
  (acc, c) => ({ ...acc, [c.value]: c.label }),
  {} as Record<Classification, string>
);

/** Tailwind classes per classification, using semantic tokens only. */
export const classificationBadgeClass = (value?: string | null): string => {
  switch (value) {
    case "fact":
      return "bg-primary/10 text-primary border-primary/25";
    case "allegation":
      return "bg-accent/15 text-accent-foreground border-accent/30";
    case "disputed":
      return "bg-destructive/10 text-destructive border-destructive/25";
    case "inference":
      return "bg-secondary text-secondary-foreground border-border";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

export const REVIEW_STATUSES = [
  { value: "needs_review", label: "Needs review" },
  { value: "reviewed", label: "Reviewed" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Set aside" },
];

export const ISSUE_STATUSES = [
  { value: "open", label: "Open" },
  { value: "monitoring", label: "Monitoring" },
  { value: "needs_records", label: "Needs records" },
  { value: "resolved", label: "Resolved" },
];

export const REQUEST_STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "acknowledged", label: "Acknowledged" },
  { value: "partial", label: "Partial response" },
  { value: "complete", label: "Complete" },
  { value: "denied", label: "Denied" },
  { value: "overdue", label: "Past due" },
];

export const RECORD_GAP_STATUSES = [
  { value: "identified", label: "Identified" },
  { value: "needed", label: "Needed" },
  { value: "requested", label: "Requested" },
  { value: "partial", label: "Partially received" },
  { value: "received", label: "Received" },
  { value: "not_available", label: "Not available" },
  { value: "resolved", label: "Resolved" },
];


export const COMMUNICATION_METHODS = [
  "Email",
  "Phone",
  "Text",
  "In person",
  "Court/hearing",
  "Letter",
  "Voicemail",
  "Records portal",
  "Other",
].map((m) => ({ value: m, label: m }));

export const TIMELINE_CATEGORIES = [
  "Agency decision",
  "Court/hearing event",
  "Police contact",
  "Housing event",
  "School event",
  "Medical event",
  "Records request",
  "Missed deadline",
  "Allegation first appears",
  "Disputed statement",
  "Communication",
  "Other significant event",
].map((c) => ({ value: c, label: c }));

export const IMPORTANCE_LEVELS = ["Critical", "High", "Medium", "Low"].map((v) => ({
  value: v,
  label: v,
}));

export const exhibitLabel = (n?: number | null) =>
  typeof n === "number" ? `EX-${String(n).padStart(2, "0")}` : "Unnumbered";
