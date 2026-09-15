import type {
  FactTrigger,
  IssueRule,
  RuleOutcome,
  TriageContext,
} from "./issueTypes";

/** Pure helpers — deterministic, no side effects. */
const a = (ctx: TriageContext, q: string) => ctx.answers[q];
const is = (ctx: TriageContext, q: string, ...vals: string[]) =>
  vals.includes(ctx.answers[q] ?? "");

const t = (label: string, questionId?: string, kind: FactTrigger["kind"] = "user_reported"): FactTrigger => ({
  label,
  questionId,
  kind,
});

const out = (
  status: RuleOutcome["status"],
  triggers: FactTrigger[],
  extra: Partial<RuleOutcome> = {}
): RuleOutcome => ({ status, triggers, ...extra });

const ongoing = (ctx: TriageContext) =>
  is(ctx, "timing", "ongoing") || ctx.patternStrength !== "none";

export const issueRules: IssueRule[] = [
  /* ---------------- Police ---------------- */
  {
    issueId: "fourth_amendment",
    systems: ["police"],
    evaluate: (ctx) => {
      const type = a(ctx, "incident-type");
      if (!["search", "stop", "arrest"].includes(type ?? "")) return null;
      const triggers = [
        t(`You selected "${type === "search" ? "Search of person, vehicle, or property" : type === "stop" ? "Stop, questioning, or harassment" : "Arrest or detention"}" as what happened.`, "incident-type"),
      ];
      return out("possible", triggers, { weight: type === "search" ? 90 : 80 });
    },
  },
  {
    issueId: "excessive_force",
    systems: ["police"],
    evaluate: (ctx) => {
      if (!is(ctx, "incident-type", "force")) return null;
      const triggers = [t("You selected \"Use of force or physical contact.\"", "incident-type")];
      let status: RuleOutcome["status"] = "possible";
      if (is(ctx, "injury", "serious", "minor")) {
        triggers.push(t(`You reported an injury (${a(ctx, "injury") === "serious" ? "serious" : "minor"}).`, "injury"));
        if (is(ctx, "evidence", "medical", "video") || is(ctx, "body-camera", "yes-exists", "requested")) {
          status = "stronger";
          triggers.push(t("You indicated that footage or medical documentation may exist.", "evidence"));
        }
      } else if (is(ctx, "injury", "none")) {
        return out("insufficient", triggers, {
          contraryFacts: ["You indicated no injury resulted."],
          weight: 40,
        });
      }
      return out(status, triggers, { weight: status === "stronger" ? 100 : 85 });
    },
  },
  {
    issueId: "false_arrest",
    systems: ["police"],
    evaluate: (ctx) => {
      if (!is(ctx, "incident-type", "arrest")) return null;
      return out("possible", [t("You selected \"Arrest or detention.\"", "incident-type")], { weight: 88 });
    },
  },
  {
    issueId: "first_amendment",
    systems: ["police", "employer", "housing", "school", "jail", "government", "unsure"],
    evaluate: (ctx) => {
      const flags: FactTrigger[] = [];
      if (is(ctx, "incident-type", "retaliation") || is(ctx, "issue-type", "retaliation") || is(ctx, "describe", "retaliation")) {
        flags.push(t("You described consequences that followed speaking up, complaining, or recording.", "issue-type"));
      }
      if (is(ctx, "prior-complaints", "retaliated") || is(ctx, "retaliation-concern", "already-retaliated", "yes-experienced")) {
        flags.push(t("You reported that retaliation has already occurred after a complaint.", "prior-complaints"));
      }
      if (flags.length === 0) return null;
      const governmentActor = ["police", "school", "jail", "government", "cps_dcyf", "courts"].includes(ctx.systemId);
      if (!governmentActor) {
        return out("insufficient", flags, {
          contraryFacts: ["The First Amendment applies to government actors; the entity you described may be private."],
          weight: 45,
        });
      }
      return out(flags.length > 1 ? "stronger" : "possible", flags, { weight: flags.length > 1 ? 95 : 78 });
    },
  },
  {
    issueId: "public_records",
    systems: ["police", "school", "jail", "government", "cps_dcyf", "courts"],
    evaluate: (ctx) => {
      const flags: FactTrigger[] = [];
      if (is(ctx, "body-camera", "yes-exists", "unknown", "requested")) {
        flags.push(t("You indicated recorded footage may exist or has been requested.", "body-camera"));
      }
      if (is(ctx, "issue-type", "records")) {
        flags.push(t("You selected a records-related issue.", "issue-type"));
      }
      if (is(ctx, "evidence", "none", "unsure", "hard-to-get")) {
        flags.push(t("You indicated you do not yet have documentation.", "evidence"));
      }
      if (flags.length === 0) return null;
      return out("possible", flags, { weight: 70 });
    },
  },
  {
    issueId: "municipal_liability",
    systems: ["police", "school", "jail", "government", "cps_dcyf", "courts"],
    evaluate: (ctx) => {
      const flags: FactTrigger[] = [];
      if (ongoing(ctx)) flags.push(t("You indicated this has happened more than once or is ongoing.", "timing"));
      if (is(ctx, "prior-complaints", "filed", "informal", "ignored", "retaliated")) {
        flags.push(t("You reported an earlier complaint about the same entity.", "prior-complaints"));
      }
      if (flags.length < 1) return null;
      return out(flags.length > 1 ? "possible" : "insufficient", flags, { weight: 30 });
    },
  },

  /* ---------------- Employment ---------------- */
  {
    issueId: "employment_discrimination",
    systems: ["employer"],
    evaluate: (ctx) => {
      const type = a(ctx, "issue-type");
      if (!["discrimination", "retaliation", "termination", "harassment", "accommodation"].includes(type ?? "")) return null;
      const triggers = [t(`You selected "${type}" as the workplace issue.`, "issue-type")];
      let status: RuleOutcome["status"] = "possible";
      const contrary: string[] = [];
      if (is(ctx, "employment-status", "contractor")) {
        contrary.push("You indicated you were a contractor, which affects whether employment laws cover the relationship.");
        status = "insufficient";
      }
      if (is(ctx, "hr-complaint", "formal-hr") && is(ctx, "employment-status", "terminated")) {
        triggers.push(t("You reported a formal HR complaint followed by termination.", "hr-complaint"));
        if (status === "possible") status = "stronger";
      }
      return out(status, triggers, { contraryFacts: contrary, weight: status === "stronger" ? 100 : 85 });
    },
  },
  {
    issueId: "ada_504",
    systems: ["employer", "school", "housing", "government", "healthcare", "jail"],
    evaluate: (ctx) => {
      const flags: FactTrigger[] = [];
      if (is(ctx, "issue-type", "accommodation")) flags.push(t("You selected a denied-accommodation issue.", "issue-type"));
      if (is(ctx, "special-education", "has-504", "has-iep", "denied", "evaluation-needed")) {
        flags.push(t("You indicated a disability plan or evaluation is involved.", "special-education"));
      }
      if (is(ctx, "family-situation", "disabled")) flags.push(t("You indicated a household member has a disability.", "family-situation"));
      if (flags.length === 0) return null;
      const publicEntity = ["school", "government", "jail"].includes(ctx.systemId);
      if (!publicEntity && !is(ctx, "housing-type", "public", "voucher", "subsidized")) {
        return out("insufficient", flags, {
          contraryFacts: ["Whether Title II or Section 504 applies depends on whether the entity is public or federally funded."],
          missingFacts: ["Whether the entity is a public body or receives federal funding"],
          weight: 55,
        });
      }
      return out("possible", flags, { weight: 82 });
    },
  },
  {
    issueId: "wlad",
    systems: ["employer", "housing", "healthcare", "government"],
    evaluate: (ctx) => {
      if (!is(ctx, "issue-type", "discrimination", "harassment", "retaliation")) return null;
      return out("possible", [t("You described discriminatory or retaliatory treatment in a setting this state statute can cover.", "issue-type")], {
        weight: 65,
      });
    },
  },

  /* ---------------- Housing ---------------- */
  {
    issueId: "fair_housing",
    systems: ["housing"],
    evaluate: (ctx) => {
      if (!is(ctx, "issue-type", "discrimination", "accommodation", "voucher")) return null;
      return out("possible", [t(`You selected "${a(ctx, "issue-type")}" as the housing issue.`, "issue-type")], { weight: 88 });
    },
  },
  {
    issueId: "wa_landlord_tenant",
    systems: ["housing"],
    evaluate: (ctx) => {
      const flags: FactTrigger[] = [];
      if (is(ctx, "issue-type", "eviction", "habitability", "retaliation")) {
        flags.push(t(`You selected "${a(ctx, "issue-type")}" as the housing issue.`, "issue-type"));
      }
      if (is(ctx, "notice-received", "eviction-notice", "lease-violation", "rent-increase", "other-notice")) {
        flags.push(t("You reported receiving a written notice from the landlord.", "notice-received"));
      }
      if (flags.length === 0) return null;
      const urgent = is(ctx, "deadline", "days", "weeks");
      if (urgent) flags.push(t("You indicated a deadline within days or weeks.", "deadline"));
      return out(urgent ? "stronger" : "possible", flags, { weight: urgent ? 110 : 90 });
    },
  },

  /* ---------------- School ---------------- */
  {
    issueId: "student_rights",
    systems: ["school"],
    evaluate: (ctx) => {
      const type = a(ctx, "issue-type");
      if (!type) return null;
      const flags = [t(`You selected "${type}" as the school issue.`, "issue-type")];
      const urgent = is(ctx, "discipline-status", "expulsion-pending", "hearing-scheduled", "suspended") || is(ctx, "deadline", "days", "scheduled");
      if (urgent) flags.push(t("You indicated a discipline step or hearing is pending.", "discipline-status"));
      return out(urgent ? "stronger" : "possible", flags, { weight: urgent ? 105 : 85 });
    },
  },
  {
    issueId: "due_process",
    systems: ["school", "government", "courts", "jail"],
    evaluate: (ctx) => {
      const flags: FactTrigger[] = [];
      if (is(ctx, "issue-type", "due-process", "benefits-denied", "benefits-delayed", "discipline")) {
        flags.push(t(`You described a decision that took away or reduced something ("${a(ctx, "issue-type")}").`, "issue-type"));
      }
      if (is(ctx, "decision-received", "verbal-only", "no-notice")) {
        flags.push(t("You reported little or no written notice of the decision.", "decision-received"));
      }
      if (flags.length === 0) return null;
      return out(flags.length > 1 ? "stronger" : "possible", flags, { weight: flags.length > 1 ? 105 : 85 });
    },
  },
  {
    issueId: "equal_protection",
    systems: ["police", "school", "jail", "government", "courts", "cps_dcyf"],
    evaluate: (ctx) => {
      if (!is(ctx, "issue-type", "discrimination")) return null;
      return out("possible", [t("You described discriminatory treatment by a government body.", "issue-type")], {
        weight: 80,
      });
    },
  },

  /* ---------------- Healthcare ---------------- */
  {
    issueId: "healthcare_access",
    systems: ["healthcare"],
    evaluate: (ctx) => {
      const type = a(ctx, "issue-type");
      if (!type) return null;
      const flags = [t(`You selected "${type}" as the healthcare issue.`, "issue-type")];
      const urgent = is(ctx, "urgency", "urgent", "delayed");
      if (urgent) flags.push(t("You indicated care is urgent or being delayed.", "urgency"));
      return out(urgent ? "stronger" : "possible", flags, { weight: urgent ? 100 : 80 });
    },
  },

  /* ---------------- Jail / prison ---------------- */
  {
    issueId: "conditions_of_confinement",
    systems: ["jail"],
    evaluate: (ctx) => {
      const type = a(ctx, "issue-type");
      if (!type) return null;
      const flags = [t(`You selected "${type}" as the custody issue.`, "issue-type")];
      const urgent = is(ctx, "urgency", "emergency", "urgent");
      if (urgent) flags.push(t("You indicated the situation is urgent or dangerous.", "urgency"));
      if (is(ctx, "grievance-filed", "yes-denied", "yes-ignored", "yes-pending")) {
        flags.push(t("You reported a grievance was filed.", "grievance-filed"));
      }
      return out(urgent ? "stronger" : "possible", flags, { weight: urgent ? 110 : 88 });
    },
  },

  /* ---------------- Government benefits ---------------- */
  {
    issueId: "benefits_due_process",
    systems: ["government"],
    evaluate: (ctx) => {
      if (!is(ctx, "issue-type", "benefits-denied", "benefits-delayed")) return null;
      const flags = [t(`You selected "${a(ctx, "issue-type")}" as the agency issue.`, "issue-type")];
      const urgent = is(ctx, "appeal-deadline", "days", "weeks", "unknown", "missed");
      if (urgent) flags.push(t("You indicated an appeal deadline may be near, unknown, or passed.", "appeal-deadline"));
      return out(urgent ? "stronger" : "possible", flags, { weight: urgent ? 115 : 90 });
    },
  },

  /* ---------------- Courts ---------------- */
  {
    issueId: "court_access",
    systems: ["courts"],
    evaluate: (ctx) => {
      const type = a(ctx, "issue-type");
      if (!type) return null;
      const flags = [t(`You selected "${type}" as the court issue.`, "issue-type")];
      const urgent = is(ctx, "deadline", "days", "weeks");
      if (urgent) flags.push(t("You indicated a court deadline is approaching.", "deadline"));
      return out(urgent ? "stronger" : "possible", flags, { weight: urgent ? 115 : 85 });
    },
  },

  /* ---------------- Child welfare ---------------- */
  {
    issueId: "family_due_process",
    systems: ["cps_dcyf"],
    evaluate: (ctx) => {
      const flags = [t(`You described child-welfare involvement ("${a(ctx, "issue-type") ?? "unspecified"}").`, "issue-type")];
      let status: RuleOutcome["status"] = "possible";
      if (is(ctx, "allegations", "no", "partially")) {
        flags.push(t("You indicated you do not have the allegations in full.", "allegations"));
        status = "stronger";
      }
      if (is(ctx, "case-status", "court") || is(ctx, "children-placement", "foster", "relative")) {
        flags.push(t("You indicated court involvement or an out-of-home placement.", "case-status"));
        status = "stronger";
      }
      return out(status, flags, { weight: status === "stronger" ? 115 : 90 });
    },
  },

  /* ---------------- Unsure ---------------- */
  {
    issueId: "due_process",
    systems: ["unsure"],
    evaluate: (ctx) => {
      if (!is(ctx, "describe", "denied")) return null;
      return out("insufficient", [t("You described being denied something you believe you are entitled to.", "describe")], {
        missingFacts: ["Which entity made the decision, and whether it is a government body"],
        weight: 60,
      });
    },
  },
  {
    issueId: "equal_protection",
    systems: ["unsure"],
    evaluate: (ctx) => {
      if (!is(ctx, "describe", "authority", "harmed") || !is(ctx, "who-involved", "government", "police", "school")) return null;
      return out("insufficient", [
        t("You described unfair treatment by someone in authority.", "describe"),
        t("You indicated a government body was involved.", "who-involved"),
      ], { weight: 55 });
    },
  },
];
