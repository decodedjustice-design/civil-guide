import type { EducationalGuide } from "./educationalGuides";

/**
 * Washington-focused Government Agencies & Benefits guide.
 *
 * This guide is educational. Program rules, deadlines, and eligibility vary by
 * agency and benefit. The written notice and current agency rules control.
 */
export const governmentBenefitsGuide: EducationalGuide = {
  id: "government-full-guide",
  systemId: "government",
  title: "Understanding Government Agencies & Benefits",
  readTime: "18 min read",

  beforeYouStart: {
    grounding:
      "When a government agency controls access to food, cash assistance, health coverage, unemployment benefits, disability-related services, child support, or another essential program, an agency letter can feel like a final answer. It usually is not the end of the process. The first job is to identify which agency acted, what decision was made, the effective date, and what appeal instructions the notice gives you.",
    consent:
      "You do not have to solve the whole problem at once. Start with the decision notice, deadline, and records supporting the decision. This guide explains the structure of Washington's benefits and administrative-review system so you can identify the next question to research."
  },

  whatThisSystemIs: {
    description:
      "Washington public benefits are administered through different agencies and programs. DSHS administers major public-assistance programs such as Basic Food and TANF and operates administrative processes for many DSHS decisions. The Health Care Authority administers Washington Apple Health and other health programs. The Employment Security Department handles unemployment benefits and related appeals. Other agencies administer housing, child support, disability, education, and specialized programs. The Office of Administrative Hearings (OAH) conducts administrative hearings for many agency disputes.",
    whoRunsIt:
      "The agency that issued the decision applies the program's statutes, administrative rules, and agency procedures. OAH is a separate agency that conducts administrative hearings before Administrative Law Judges. Some decisions can then be reviewed by an agency board or commissioner, and some final administrative decisions may be subject to judicial review. The exact path depends on the program and the notice you received.",
    whatItControls:
      "Agency decisions can affect eligibility, benefit amount, payment timing, overpayments, services, coverage, work requirements, sanctions, or other program rights. An agency generally must follow the rules that apply to the particular program and provide the notice and review rights required by law."
  },

  whyConfusing: {
    explanation:
      "Government benefits are difficult to navigate because the same household may interact with several agencies at once, and each program can use different eligibility rules, notices, deadlines, and appeal systems.",
    structuralReasons: [
      "Different benefits are administered by different agencies and divisions",
      "The program name on a notice may not tell you which legal authority controls the decision",
      "Eligibility calculations can depend on household composition, income, assets, disability, immigration category, work activity, or program-specific facts",
      "Agency case notes and eligibility systems may contain information that is not visible in the notice",
      "Appeal deadlines vary by program",
      "A complaint about an employee is not necessarily the same thing as an appeal of the underlying benefits decision",
      "Some disputes can be resolved by the agency before a formal hearing, while others proceed to an administrative hearing"
    ]
  },

  whatUsuallyHappens: [
    "You apply for a benefit or submit a required review, verification, or change report.",
    "The agency requests information and makes an eligibility or service decision.",
    "You receive a notice approving, denying, reducing, suspending, terminating, or changing benefits, or assessing an overpayment.",
    "The notice should identify the decision and explain how to challenge it when an appeal right exists.",
    "You decide whether to ask the agency to correct the decision, request an administrative hearing, or use another program-specific review process.",
    "If a hearing is scheduled, an Administrative Law Judge may receive testimony and evidence and issue an initial decision.",
    "Some programs provide another level of administrative review, such as review by the DSHS Board of Appeals or an agency-specific review body.",
    "Some final administrative decisions may be eligible for judicial review; the applicable notice and rules control the deadline and procedure."
  ],

  successReframe: {
    reality:
      "A useful outcome is not limited to receiving every benefit requested. It can mean getting a decision corrected, preserving benefits while a timely appeal is pending when continuation rules apply, reducing an overpayment, obtaining the records needed to understand a decision, or creating a clear administrative record for further review.",
    examples: [
      "The agency changes a decision after receiving missing or corrected information",
      "A timely hearing request puts the disputed decision into the formal review process",
      "An incorrect eligibility calculation is corrected",
      "An overpayment determination is changed, waived, or otherwise resolved under the program's rules",
      "A hearing record clearly documents the evidence and testimony supporting your position",
      "You obtain the agency records needed to understand what information was used"
    ]
  },

  internalKnowledge: {
    explanation:
      "Agencies maintain case-management and eligibility records that can affect decisions. You may see only the final notice, while the underlying record contains applications, verification, case notes, system entries, notices, and communications.",
    examples: [
      "Applications and eligibility reviews",
      "Verification documents and income information",
      "Caseworker or specialist notes",
      "Notices generated by the eligibility system",
      "Payment and benefit histories",
      "Prior decisions and appeal records",
      "Communications with agency staff",
      "Hearing exhibits, recordings, orders, or review decisions"
    ]
  },

  misunderstandings: {
    traps: [
      "A denial is automatically final — many agency decisions have an administrative appeal or hearing process.",
      "The caseworker's explanation is the legal authority — the controlling authority may be a statute, WAC, program rule, policy, or court order.",
      "Every benefits appeal has the same deadline — deadlines differ by program; follow the notice.",
      "A complaint automatically appeals a benefits decision — a service complaint and a formal hearing request can be different processes.",
      "You must use a special legal form for every hearing request — some Washington programs permit a hearing request orally or in writing, while others have different procedures.",
      "Missing information means you should abandon the application — ask what can still be submitted and whether the agency will accept a corrected or supplemental submission.",
      "A hearing is just another conversation with the caseworker — an administrative hearing is a legal proceeding before an Administrative Law Judge."
    ]
  },

  whatMatters: [
    "The exact agency and program that issued the decision",
    "The date on the notice and the date you received it",
    "The effective date of the action",
    "The reason the agency gives for the decision",
    "The rule, policy, or eligibility factor identified by the agency",
    "The appeal or hearing deadline stated in the notice",
    "Whether benefits can continue while an appeal is pending under the applicable program rules",
    "The documents and information the agency relied upon",
    "A chronological record of applications, submissions, contacts, decisions, and appeals"
  ],

  safeSteps: [
    "Save the complete notice, including every page and attachment.",
    "Write the appeal deadline and effective date on the first page of your case folder.",
    "Identify the program and agency before researching the law.",
    "Keep copies of everything you submit and proof of when you submitted it.",
    "If the decision is unclear, ask the agency to explain the reason and identify the rule or program requirement involved.",
    "If you disagree, follow the appeal instructions in the notice rather than relying on a general internet deadline.",
    "If you request a hearing, keep the confirmation, docket information, and later hearing notices.",
    "Organize evidence by issue: eligibility, household, income, medical or disability information, work activity, verification, payments, or another program-specific category.",
    "Ask for an interpreter or disability accommodation when needed to participate in the process.",
    "For a complex or high-stakes dispute, consider civil legal aid or a benefits attorney."
  ],

  escalation: {
    explanation:
      "Escalation means moving a dispute into the formal review, oversight, or legal process that applies to the program. Start with the decision notice because it should identify the available review route.",
    signs: [
      "Benefits were denied, reduced, suspended, or terminated and you disagree",
      "An overpayment was assessed and you dispute the amount, basis, or responsibility",
      "The agency did not explain the decision sufficiently for you to understand what was decided",
      "You believe required notice or hearing information was missing",
      "You need an interpreter or disability accommodation and cannot obtain one",
      "A deadline is approaching or you missed one and need to determine whether a late request can be accepted",
      "You have already received an administrative decision and need to determine whether another level of review or judicial review is available"
    ]
  },

  closing: {
    reassurance:
      "A government benefits decision is a recordable event, not a verdict about your worth. Slow the problem down into the agency, program, decision, effective date, rule, deadline, evidence, and review path. Once those pieces are identified, the system becomes easier to navigate and the next step becomes more concrete."
  },

  sources: [
    {
      label: "Washington DSHS — Rights & Responsibilities",
      url: "https://www.dshs.wa.gov/esa/community-services-offices/rights-and-responsibilities",
      type: "agency"
    },
    {
      label: "Washington DSHS — Administrative Hearings",
      url: "https://www.dshs.wa.gov/esa/administrative-hearings",
      type: "agency"
    },
    {
      label: "Washington Office of Administrative Hearings — How to File an Appeal",
      url: "https://oah.wa.gov/case-preparation/how-file-appeal",
      type: "official"
    },
    {
      label: "Washington Health Care Authority — Requesting an Administrative Hearing",
      url: "https://www.hca.wa.gov/free-or-low-cost-health-care/i-help-others-apply-and-access-apple-health/requesting-administrative-hearing",
      type: "agency"
    },
    {
      label: "Washington Employment Security Department — Appeal an Unemployment Benefits Decision",
      url: "https://esd.wa.gov/get-financial-help/unemployment-benefits/appeal-unemployment-benefits-decision",
      type: "agency"
    },
    {
      label: "Washington LawHelp — Benefits",
      url: "https://www.washingtonlawhelp.org/en/topics/benefits",
      type: "official"
    },
    {
      label: "Washington LawHelp — Problems With Benefits",
      url: "https://www.washingtonlawhelp.org/en/topics/benefits/problems-benefits",
      type: "official"
    },
    {
      label: "DSHS Board of Appeals",
      url: "https://www.dshs.wa.gov/office-of-the-secretary/board-appeals",
      type: "oversight"
    },
    {
      label: "Washington Connection — Apply for State Benefits",
      url: "https://www.washingtonconnection.org/",
      type: "agency"
    }
  ]
};
