export type ViolationSeverity = "high" | "medium" | "possible";

export interface PotentialViolation {
  id: string;
  title: string;
  status: "potential_violation";
  severity: ViolationSeverity;
  confidence: "low" | "medium" | "high";
  legalFramework: string[];
  whyFlagged: string;
  whatWouldNeedToBeTrue: string[];
  evidenceToLookFor: string[];
  missingFacts: string[];
  nextStep: string;
}

type Answers = Record<string, string>;

const has = (answers: Answers, id: string, ...values: string[]) => values.includes(answers[id]);
const contains = (answers: Answers, id: string, term: string) => (answers[id] || "").toLowerCase().includes(term.toLowerCase());

function violation(
  id: string,
  title: string,
  severity: ViolationSeverity,
  confidence: "low" | "medium" | "high",
  legalFramework: string[],
  whyFlagged: string,
  whatWouldNeedToBeTrue: string[],
  evidenceToLookFor: string[],
  missingFacts: string[],
  nextStep: string,
): PotentialViolation {
  return { id, title, status: "potential_violation", severity, confidence, legalFramework, whyFlagged, whatWouldNeedToBeTrue, evidenceToLookFor, missingFacts, nextStep };
}

export function detectPotentialViolations(systemId: string, answers: Answers, location?: string): PotentialViolation[] {
  const out: PotentialViolation[] = [];
  const jurisdiction = location?.trim() ? `Jurisdiction supplied: ${location}. Verify the applicable state/local law.` : "Jurisdiction not supplied; verify state and local law.";

  if (systemId === "police") {
    if (has(answers, "incident-type", "force")) out.push(violation(
      "police_excessive_force", "Possible excessive-force / unreasonable-force claim", "high", "medium",
      ["U.S. Constitution, Fourth Amendment", "42 U.S.C. § 1983", jurisdiction],
      "You reported physical force or physical contact during a law-enforcement encounter.",
      ["The officer was acting under color of law", "The force was objectively unreasonable under the circumstances", "The claim is not barred by a case-specific defense or immunity"],
      ["Body-camera/dash-camera video", "Use-of-force report", "Dispatch/CAD records", "Witness statements", "Medical records and injury photographs"],
      ["Exact force used", "Threat level perceived by officers", "Warnings given", "Duration and sequence", "Injury and treatment"],
      "Preserve the original recordings and obtain the incident/use-of-force records before relying on summaries."
    ));
    if (has(answers, "incident-type", "search")) out.push(violation(
      "police_unreasonable_search", "Possible unreasonable-search issue", "high", "medium",
      ["U.S. Constitution, Fourth Amendment", "42 U.S.C. § 1983", jurisdiction],
      "You reported a search of your person, vehicle, or property.",
      ["A search occurred", "No valid warrant, consent, recognized exception, or other lawful basis justified the search", "The claimant has a legally protected interest in the place or item searched"],
      ["Warrant and affidavit", "Consent form or recording", "Body-camera/dash-camera footage", "Property/evidence inventory", "Search report"],
      ["Exact place searched", "Who authorized it", "Warrant status", "Consent details", "What officers knew beforehand"],
      "Request the warrant/return, reports, and recordings; do not assume the absence of a warrant alone proves unlawfulness."
    ));
    if (has(answers, "incident-type", "arrest", "stop")) out.push(violation(
      "police_unlawful_detention", "Possible unlawful-stop or detention issue", "medium", "low",
      ["U.S. Constitution, Fourth Amendment", "42 U.S.C. § 1983", jurisdiction],
      "You reported an arrest, detention, stop, or questioning encounter.",
      ["The seizure lacked sufficient legal justification or exceeded its lawful scope", "The facts support a constitutional or statutory claim"],
      ["CAD/dispatch timeline", "Body-camera footage", "Citation/arrest records", "Officer reports", "Witness accounts"],
      ["Reason for the stop", "Duration", "Probable cause/reasonable suspicion", "Whether the encounter became consensual", "Any warrant or court order"],
      "Build a minute-by-minute timeline and preserve all dispatch, video, and written records."
    ));
    if (has(answers, "incident-type", "retaliation") || has(answers, "prior-complaints", "filed", "informal")) out.push(violation(
      "police_retaliation", "Possible First Amendment retaliation issue", "high", "low",
      ["U.S. Constitution, First Amendment", "42 U.S.C. § 1983", jurisdiction],
      "You reported protected complaint/reporting activity and/or retaliation concerns involving law enforcement.",
      ["You engaged in protected speech, petitioning, recording, or complaint activity", "The government actor took adverse action", "The protected activity was a motivating factor and the action was not independently justified"],
      ["Complaint and response records", "Emails/texts", "Officer communications", "Body-camera footage", "Chronology showing timing"],
      ["Exact protected activity", "Exact adverse action", "Decision-maker knowledge", "Causal timing", "Legitimate stated reason"],
      "Preserve the communications and create a chronology separating protected activity from later government action."
    ));
  }

  if (systemId === "employer") {
    if (has(answers, "issue-type", "discrimination")) out.push(violation(
      "employment_discrimination", "Possible employment-discrimination issue", "high", "medium",
      ["Title VII", "ADA", "ADEA", "Applicable state/local anti-discrimination law"],
      "You identified discrimination as the workplace issue.",
      ["You are in a protected category", "You experienced an adverse employment action or materially discriminatory treatment", "The treatment was because of the protected characteristic, subject to the applicable legal test"],
      ["HR complaints", "Performance records", "Emails/messages", "Comparator evidence", "Termination/disciplinary documents"],
      ["Protected basis", "Decision-maker", "Comparator treatment", "Timing", "Employer's stated reason"],
      "Preserve employment records and identify concrete events rather than conclusions."
    ));
    if (has(answers, "issue-type", "retaliation") || has(answers, "retaliation-concern", "already-retaliated")) out.push(violation(
      "employment_retaliation", "Possible workplace-retaliation issue", "high", "medium",
      ["Title VII anti-retaliation provisions", "ADA anti-retaliation provisions", "Applicable state/local law"],
      "You reported retaliation or said retaliation occurred after protected activity.",
      ["Protected complaint/activity occurred", "Employer knew about it", "A materially adverse action followed", "The timing and evidence support a causal connection"],
      ["Complaint date", "HR response", "Disciplinary records", "Schedule/pay changes", "Termination documents", "Witnesses"],
      ["Exact protected activity", "Knowledge", "Adverse action", "Timing", "Non-retaliatory explanation"],
      "Create a dated sequence linking the protected activity to each later employment action."
    ));
    if (has(answers, "issue-type", "accommodation")) out.push(violation(
      "employment_accommodation", "Possible disability-accommodation issue", "high", "medium",
      ["Americans with Disabilities Act", "Rehabilitation Act where applicable", "Applicable state/local disability law"],
      "You reported a denied workplace accommodation or leave issue.",
      ["A qualifying disability or protected condition exists", "The employer had sufficient notice", "A reasonable accommodation was requested or otherwise triggered", "The employer failed to engage as required or denied a reasonable accommodation without a lawful basis"],
      ["Accommodation request", "Medical/functional documentation", "Interactive-process communications", "Job description", "Employer response"],
      ["Exact limitation", "Essential functions", "Requested accommodation", "Employer's reason", "Alternative accommodations considered"],
      "Preserve the original accommodation request and every employer response."
    ));
  }

  if (systemId === "housing") {
    if (has(answers, "issue-type", "discrimination")) out.push(violation(
      "housing_discrimination", "Possible housing-discrimination issue", "high", "medium",
      ["Fair Housing Act", "Applicable state/local fair-housing law"],
      "You identified housing discrimination as the problem.",
      ["A protected characteristic or protected activity is implicated", "A housing provider took or threatened an adverse housing action", "The facts support a discriminatory motive or prohibited disparate treatment under the applicable law"],
      ["Applications/messages", "Lease notices", "Screening records", "Comparable-unit evidence", "Witnesses", "Property communications"],
      ["Protected basis", "Decision-maker", "Comparator", "Exact adverse action", "Stated reason"],
      "Keep the original listing, application, communications, notices, and dates."
    ));
    if (has(answers, "issue-type", "eviction")) out.push(violation(
      "housing_due_process", "Possible unlawful eviction / notice issue", "high", "medium",
      ["Applicable state landlord-tenant law", "Applicable local tenant protections"],
      "You reported an eviction-related problem.",
      ["The required notice, timing, service, or court process was not followed", "No lawful basis or required procedure defeats the eviction action"],
      ["All notices", "Lease", "Payment ledger", "Court filings", "Proof of service", "Communications"],
      ["Exact notice type", "Service method", "Dates", "Rent/account history", "Court status"],
      "Do not discard envelopes or proof of service; deadlines can be short."
    ));
    if (has(answers, "issue-type", "habitability", "repairs")) out.push(violation(
      "housing_habitability", "Possible habitability / repair-rights issue", "medium", "medium",
      ["Applicable state landlord-tenant law", "Applicable local housing/building codes"],
      "You reported habitability or repair problems.",
      ["A condition violates an applicable habitability/code requirement", "Required notice and opportunity to repair were provided where required", "The condition and landlord response are documented"],
      ["Photos/videos", "Repair requests", "Inspection reports", "Maintenance records", "Messages"],
      ["Condition", "Duration", "Notice to landlord", "Response", "Health/safety impact"],
      "Photograph conditions with dates and preserve every repair request and response."
    ));
  }

  if (systemId === "school") {
    if (has(answers, "issue-type", "discrimination")) out.push(violation(
      "education_discrimination", "Possible education-discrimination issue", "high", "medium",
      ["Title VI", "Title IX", "Section 504", "ADA Title II", "Applicable state education law"],
      "You reported discrimination in an education setting.",
      ["The student is protected by the implicated law", "The school/program treated the student adversely or denied equal access", "The treatment was because of a protected characteristic or disability, depending on the theory"],
      ["School communications", "Discipline records", "Attendance records", "IEP/504 documents", "Comparable-student evidence", "Witnesses"],
      ["Protected basis", "Adverse treatment", "Decision-maker", "Comparator", "School's stated reason"],
      "Preserve the complete school record and request records in writing where appropriate."
    ));
    if (has(answers, "issue-type", "discipline")) out.push(violation(
      "education_discipline_process", "Possible student-discipline due-process issue", "medium", "medium",
      ["Applicable state student-discipline law", "District discipline policy", "Constitutional due process where applicable"],
      "You reported a school discipline matter.",
      ["The discipline implicated a protected procedural right", "Required notice, opportunity to respond, hearing/review, or policy steps were not followed"],
      ["Discipline notice", "Hearing records", "School policy", "Student statement", "Attendance/behavior records"],
      ["Discipline type", "Notice", "Hearing opportunity", "Decision", "Appeal/review status"],
      "Compare what happened against the district's written discipline procedure."
    ));
    if (has(answers, "issue-type", "accommodation")) out.push(violation(
      "education_disability_access", "Possible disability-access / Section 504 or IDEA issue", "high", "medium",
      ["Section 504", "IDEA where applicable", "ADA Title II", "Applicable state special-education law"],
      "You reported an IEP/504 or accommodation problem.",
      ["The student qualifies or may qualify for protection", "The school knew or should have known of the need where required", "Required evaluation, accommodation, service, or procedural safeguards were not provided"],
      ["IEP/504 plan", "Evaluation records", "Accommodation requests", "Meeting notices/minutes", "Progress data", "School correspondence"],
      ["Eligibility", "Notice", "Plan terms", "Services actually delivered", "Missed services", "Parent/student requests"],
      "Create a side-by-side record of what the plan required versus what was actually provided."
    ));
  }

  if (systemId === "healthcare") {
    if (has(answers, "issue-type", "discrimination")) out.push(violation(
      "healthcare_discrimination", "Possible healthcare-discrimination / access issue", "high", "medium",
      ["Section 1557 of the Affordable Care Act where applicable", "ADA/Section 504 where applicable", "Applicable state law"],
      "You identified discrimination or unequal treatment in healthcare.",
      ["A protected basis is implicated", "A covered provider/program treated the patient adversely or denied access", "The applicable nondiscrimination law covers the provider/program and conduct"],
      ["Medical records", "Accommodation requests", "Billing/coverage records", "Provider communications", "Witnesses"],
      ["Covered entity", "Protected basis", "Specific adverse treatment", "Comparable treatment", "Provider explanation"],
      "Request the complete record and preserve billing, scheduling, and accommodation communications."
    ));
    if (has(answers, "issue-type", "privacy")) out.push(violation(
      "healthcare_privacy", "Possible medical-privacy issue", "medium", "low",
      ["HIPAA where the entity is a covered entity/business associate", "Applicable state medical-record/privacy law"],
      "You reported a healthcare privacy problem.",
      ["Protected health information was involved", "The entity was legally covered", "The disclosure/access lacked a lawful basis or required safeguard"],
      ["Disclosure logs", "Patient portal history", "Authorization forms", "Provider correspondence", "Records of who received information"],
      ["What information was disclosed", "Who disclosed it", "Recipient", "Authorization", "Applicable entity status"],
      "Document exactly what was disclosed, to whom, when, and how you learned of it."
    ));
  }

  if (systemId === "cps_dcyf") {
    if (has(answers, "issue-type", "retaliation")) out.push(violation(
      "child_welfare_retaliation", "Possible retaliation / protected-activity issue", "high", "low",
      ["Applicable constitutional protections", "Applicable Washington child-welfare statutes and regulations", "Agency policy — verify current provision"],
      "You reported retaliation in a child-welfare context.",
      ["You engaged in legally protected activity", "The agency knew of it", "A materially adverse action followed", "The action was causally connected rather than independently justified"],
      ["Case notes", "Emails/texts", "Notices", "Court filings", "Placement records", "Chronology"],
      ["Protected activity", "Decision-maker knowledge", "Adverse action", "Timing", "Independent justification"],
      "Build a chronology that distinguishes documented agency action from your interpretation of motive."
    ));
    if (has(answers, "issue-type", "investigation", "removal", "placement")) out.push(violation(
      "child_welfare_procedure", "Possible child-welfare procedural violation", "high", "low",
      ["RCW 13.34", "RCW 26.44", "RCW 74.13", "WAC 110 child-welfare rules", "Applicable court orders"],
      "You reported an investigation, removal, or placement issue. These systems contain multiple fact-specific notice, investigation, placement, and court-process requirements.",
      ["A specific statutory/regulatory/court-order requirement applied", "The agency action or omission failed that requirement", "No exception or later corrective process resolves the issue"],
      ["Intake and investigation records", "Case notes", "Notices", "Court orders", "Placement records", "Contact logs"],
      ["Exact agency action", "Applicable date", "Notice provided", "Court involvement", "Specific rule/order implicated"],
      "Do not label an action unlawful from the narrative alone; match each event to the exact current statute, rule, or order."
    ));
  }

  if (systemId === "courts") {
    if (has(answers, "issue-type", "due-process")) out.push(violation(
      "court_due_process", "Possible due-process issue", "high", "low",
      ["U.S. Constitution, Fourteenth Amendment", "Washington Constitution", "Applicable court rules and statutes"],
      "You reported a court-process problem affecting notice, opportunity to be heard, or a procedural right.",
      ["A protected liberty/property interest was implicated", "The process provided was constitutionally or statutorily inadequate", "The deficiency was material under the applicable standard"],
      ["Docket", "Notices", "Proof of service", "Orders", "Hearing transcript/audio", "Court filings"],
      ["Protected interest", "Notice", "Opportunity to respond", "Decision", "Prejudice"],
      "Obtain the docket and actual filed orders before relying on recollection alone."
    ));
  }

  if (systemId === "jail") {
    if (has(answers, "issue-type", "medical")) out.push(violation(
      "custody_medical_care", "Possible constitutional medical-care issue", "high", "low",
      ["U.S. Constitution, Eighth or Fourteenth Amendment depending on custody status", "42 U.S.C. § 1983", jurisdiction],
      "You reported a medical-care problem while in custody.",
      ["A serious medical need existed", "Officials were deliberately indifferent under the applicable legal standard"],
      ["Medical requests", "Medication records", "Grievances", "Medical charts", "Sick-call logs", "Witness statements"],
      ["Severity", "Knowledge", "Response", "Delay", "Harm"],
      "Preserve medical-request and grievance records and document the timeline of symptoms and responses."
    ));
  }

  if (systemId === "government") {
    if (has(answers, "issue-type", "records")) out.push(violation(
      "public_records_issue", "Possible public-records compliance issue", "medium", "low",
      ["Applicable state public-records law", "Agency records-retention/disclosure rules"],
      "You reported a government-records access problem.",
      ["The requested record is subject to disclosure", "The request was sufficiently specific and properly submitted", "The agency failed to respond or withhold the record under a lawful exemption"],
      ["Original request", "Agency acknowledgment", "Production/withholding letter", "Search correspondence", "Fee estimate"],
      ["Date submitted", "Agency response", "Exemption cited", "Scope of request", "Records withheld"],
      "Keep the original request, delivery proof, and every agency response together."
    ));
  }

  return out;
}
