/**
 * SolWarning — Statute of Limitations Warning
 *
 * Displays a tiered urgency alert based on the number of days elapsed
 * since the incident date. The thresholds are based on the shortest
 * common civil rights deadlines in Washington State:
 *
 *   - 60 days  : WA tort claim notice against government agencies
 *   - 180 days : EEOC / WSHRC administrative complaint filing
 *   - 1 year   : Some administrative complaint windows
 *   - 3 years  : Federal §1983 claims (WA personal injury SOL)
 *
 * This component provides general educational information only.
 * It does not constitute legal advice and does not calculate any
 * specific deadline for any specific claim.
 */

import { AlertTriangle, Clock, ShieldAlert, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface SolWarningProps {
  incidentDate: string; // YYYY-MM-DD
  issueType?: string;
}

interface UrgencyLevel {
  level: "critical" | "high" | "moderate" | "standard" | "none";
  daysElapsed: number;
  headline: string;
  body: string;
  actionLine: string;
  colorClasses: string;
  borderClasses: string;
  iconClasses: string;
  Icon: React.ElementType;
}

function calcUrgency(incidentDateStr: string, issueType?: string): UrgencyLevel | null {
  if (!incidentDateStr) return null;

  const incident = new Date(incidentDateStr);
  if (isNaN(incident.getTime())) return null;

  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysElapsed = Math.floor((now.getTime() - incident.getTime()) / msPerDay);

  // Don't show anything for future dates
  if (daysElapsed < 0) return null;

  // ── Critical: within or past the 60-day government tort notice window ──
  if (daysElapsed >= 45 && daysElapsed <= 75) {
    return {
      level: "critical",
      daysElapsed,
      headline: "Critical: 60-Day Government Notice Window",
      body:
        "Washington State requires a formal tort claim notice to be filed within 60 days of an incident involving a government agency or employee. " +
        "Based on the date you entered, you are in or near this window. Missing this deadline can permanently bar your claim — even if you later hire an attorney.",
      actionLine: "Contact an attorney today. Do not wait.",
      colorClasses: "bg-destructive/10",
      borderClasses: "border-destructive/50",
      iconClasses: "text-destructive",
      Icon: ShieldAlert,
    };
  }

  // ── High: 45–180 days — administrative complaint windows ──
  if (daysElapsed > 75 && daysElapsed <= 180) {
    const isEmployment = issueType === "employment";
    return {
      level: "high",
      daysElapsed,
      headline: isEmployment
        ? "High Urgency: EEOC / WSHRC Filing Window"
        : "High Urgency: Administrative Complaint Deadlines",
      body: isEmployment
        ? "Employment discrimination claims must be filed with the EEOC or Washington State Human Rights Commission (WSHRC) within 180 days of the discriminatory act (or 300 days if a state agency also covers the claim). " +
          "Based on the date you entered, you are approaching or within this window."
        : "Many civil rights administrative complaints — including those with the Office of Civil Rights, HUD, and state agencies — must be filed within 180 days of the incident. " +
          "Based on the date you entered, you may be approaching this window.",
      actionLine: "Reach out to an attorney or legal aid organization as soon as possible.",
      colorClasses: "bg-warning/10",
      borderClasses: "border-warning/40",
      iconClasses: "text-warning",
      Icon: AlertTriangle,
    };
  }

  // ── Moderate: 180 days – 2 years ──
  if (daysElapsed > 180 && daysElapsed <= 730) {
    return {
      level: "moderate",
      daysElapsed,
      headline: "Deadline Awareness: Act Before Time Runs Out",
      body:
        "Federal civil rights claims under 42 U.S.C. § 1983 generally have a 3-year statute of limitations in Washington State. " +
        "However, shorter deadlines may apply depending on the type of claim and the agencies involved. " +
        "The longer you wait, the harder it becomes to gather evidence and find representation.",
      actionLine: "Do not delay. Contact an attorney to confirm the deadlines that apply to your situation.",
      colorClasses: "bg-warning/5",
      borderClasses: "border-warning/25",
      iconClasses: "text-warning",
      Icon: Clock,
    };
  }

  // ── Standard: 2–3 years ──
  if (daysElapsed > 730 && daysElapsed <= 1095) {
    return {
      level: "standard",
      daysElapsed,
      headline: "Deadline Reminder: Approaching the 3-Year Window",
      body:
        "The general statute of limitations for federal civil rights claims (§ 1983) in Washington State is 3 years from the date of the incident. " +
        "Based on the date you entered, you are approaching this window. Some claims may have shorter deadlines that have already passed.",
      actionLine: "Consult an attorney now to understand which deadlines apply to your specific claims.",
      colorClasses: "bg-muted/50",
      borderClasses: "border-muted-foreground/20",
      iconClasses: "text-muted-foreground",
      Icon: Info,
    };
  }

  // ── Beyond 3 years — still show, but as informational ──
  if (daysElapsed > 1095) {
    return {
      level: "standard",
      daysElapsed,
      headline: "Important: Statute of Limitations May Have Passed",
      body:
        "Based on the date you entered, more than 3 years have elapsed since the incident. " +
        "The general statute of limitations for federal civil rights claims in Washington State is 3 years. " +
        "Some claims may still be viable depending on the specific facts, tolling provisions, or other legal theories — but time is critical.",
      actionLine: "Speak with an attorney immediately to understand whether your claims are still viable.",
      colorClasses: "bg-destructive/5",
      borderClasses: "border-destructive/30",
      iconClasses: "text-destructive",
      Icon: AlertTriangle,
    };
  }

  // Under 45 days — show a gentle general reminder
  return {
    level: "none",
    daysElapsed,
    headline: "Deadline Reminder",
    body:
      "Civil rights claims have strict filing deadlines. Some deadlines — like the 60-day government tort notice in Washington State — begin immediately after an incident.",
    actionLine: "Contact an attorney as soon as possible to understand the deadlines that apply to your situation.",
    colorClasses: "bg-muted/30",
    borderClasses: "border-muted-foreground/15",
    iconClasses: "text-muted-foreground",
    Icon: Info,
  };
}

export function SolWarning({ incidentDate, issueType }: SolWarningProps) {
  const urgency = calcUrgency(incidentDate, issueType);
  if (!urgency) return null;

  const { headline, body, actionLine, colorClasses, borderClasses, iconClasses, Icon, daysElapsed } = urgency;

  return (
    <div
      className={cn(
        "rounded-xl border p-4 space-y-2",
        colorClasses,
        borderClasses
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <Icon className={cn("w-5 h-5 shrink-0 mt-0.5", iconClasses)} />
        <div className="flex-1 space-y-1">
          <p className="text-sm font-semibold text-foreground">{headline}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
          <p className="text-xs font-medium text-foreground mt-2">{actionLine}</p>
        </div>
      </div>

      {/* Days elapsed indicator */}
      <div className="flex items-center gap-2 pt-1 border-t border-current/10">
        <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        <p className="text-xs text-muted-foreground">
          {daysElapsed === 0
            ? "Incident date: today"
            : daysElapsed === 1
            ? "1 day since incident date"
            : `${daysElapsed.toLocaleString()} days since incident date`}
        </p>
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] text-muted-foreground/70 italic pt-1">
        This is general educational information only. It is not legal advice and does not calculate
        any specific deadline for any specific claim. Consult a licensed attorney for advice about
        your situation.
      </p>
    </div>
  );
}
