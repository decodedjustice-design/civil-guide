import type { IssueDefinition } from "./issueTypes";

/**
 * Issue definitions. Authority fields carry authority-level names only.
 * Where currency or applicability cannot be confirmed inside the app,
 * `verified: false` renders as "Authority needs verification".
 */

const RIGHTS = (topic: string) => `/rights-insight?from=analyzer&topic=${topic}`;

export const issueLibrary: Record<string, IssueDefinition> = {
  first_amendment: {
    id: "first_amendment",
    title: "First Amendment — speech, petition, or retaliation",
    explanation:
      "Some of what you described involves speaking up, complaining, recording, or petitioning a government body, which is the area the First Amendment covers.",
    authorities: [
      { label: "U.S. Constitution, First Amendment", verified: true },
      { label: "42 U.S.C. § 1983 (civil action for deprivation of rights)", verified: true },
    ],
    factors: [
      "Whether the speech or complaint was directed at a government actor",
      "Whether the activity is the kind the First Amendment covers",
      "Whether an adverse action followed",
      "Whether the timing or stated reasons connect the two",
      "Whether the same action would have happened anyway",
    ],
    contraryFacts: [
      "The adverse action was already planned or documented before you spoke up",
      "The decision-maker did not know about your complaint or recording",
      "A private party, not a government actor, took the action",
    ],
    missingFacts: [
      "What exactly you said, wrote, filed, or recorded, and when",
      "Who knew about it before the adverse action",
      "The reason the entity gave, in writing, for its action",
    ],
    evidenceToPreserve: [
      "Copies of the complaint, grievance, post, or recording",
      "Dates showing what happened before and after",
      "Any written reason given for the action taken against you",
    ],
    nextAction:
      "Write a dated sequence showing the protected activity, who knew, and what changed afterward.",
    jurisdiction: "Federal (applies to government actors)",
    learnMoreHref: RIGHTS("first-amendment"),
    urgency: 3,
  },

  fourth_amendment: {
    id: "fourth_amendment",
    title: "Fourth Amendment — search or seizure",
    explanation:
      "You described a stop, detention, or search, which is the area the Fourth Amendment addresses.",
    authorities: [
      { label: "U.S. Constitution, Fourth Amendment", verified: true },
      { label: "Washington Constitution, Article I, Section 7", verified: true },
    ],
    factors: [
      "Whether there was a warrant, and what it covered",
      "Whether reasonable suspicion or probable cause is claimed",
      "Whether consent was asked for and given",
      "The scope and duration of the stop or search",
      "Whether a recognized exception is claimed",
    ],
    contraryFacts: [
      "A warrant existed and covered what was searched",
      "Consent was given voluntarily",
      "The encounter was brief and you were free to leave",
    ],
    missingFacts: [
      "What officers said the reason for the stop or search was",
      "Whether consent was requested, and exactly what was said",
      "How long the encounter lasted and what was searched",
    ],
    evidenceToPreserve: [
      "Body-camera and dash-camera footage (request before retention periods lapse)",
      "Incident or case number, officer names and badge numbers",
      "Any citation, receipt, or inventory of property taken",
    ],
    nextAction:
      "Request the report and any recorded footage, and write down the stated reason you were given at the time.",
    jurisdiction: "Federal and Washington State",
    learnMoreHref: RIGHTS("search-and-seizure"),
    urgency: 5,
  },

  excessive_force: {
    id: "excessive_force",
    title: "Use of force — reasonableness review",
    explanation:
      "Physical force was described, which is reviewed under an objective-reasonableness standard rather than a single fixed rule.",
    authorities: [
      { label: "U.S. Constitution, Fourth Amendment (force during seizure)", verified: true },
      { label: "RCW 10.120 — Permissible uses of force (Washington)", verified: false },
    ],
    factors: [
      "What the officer knew at the moment force was used",
      "The severity of the suspected offense",
      "Whether there was an immediate threat described",
      "Whether there was active resistance or flight",
      "The amount and duration of force relative to the situation",
    ],
    contraryFacts: [
      "Active physical resistance or flight is documented",
      "A weapon or immediate threat was reasonably perceived",
      "Force stopped as soon as control was gained",
    ],
    missingFacts: [
      "What officers reported as their reason for using force",
      "Whether injuries were documented medically and when",
      "Whether other officers or bystanders recorded the event",
    ],
    evidenceToPreserve: [
      "Dated photographs of injuries as they change",
      "Medical records and discharge paperwork",
      "Body-camera footage and witness contact information",
    ],
    nextAction:
      "Get medical documentation dated as close to the incident as possible, and preserve any footage now.",
    jurisdiction: "Federal and Washington State",
    learnMoreHref: RIGHTS("use-of-force"),
    urgency: 6,
  },

  false_arrest: {
    id: "false_arrest",
    title: "Arrest or detention — lawful basis review",
    explanation:
      "You described being arrested or held, and whether that was lawful turns on the basis officers had at the time.",
    authorities: [
      { label: "U.S. Constitution, Fourth Amendment", verified: true },
      { label: "42 U.S.C. § 1983", verified: true },
    ],
    factors: [
      "What facts officers knew before the arrest",
      "Whether charges were filed, and what happened to them",
      "Whether a warrant existed",
      "How long the detention lasted",
      "Whether a judge later reviewed the basis",
    ],
    contraryFacts: [
      "Charges were filed and are still pending or resulted in conviction",
      "A valid warrant existed at the time",
      "A court found probable cause",
    ],
    missingFacts: [
      "The charge listed on the paperwork, if any",
      "The current status or outcome of any charges",
      "How long you were held and where",
    ],
    evidenceToPreserve: [
      "Booking paperwork, citation, or release documents",
      "Court docket number and any dismissal order",
      "Names of anyone present during the arrest",
    ],
    nextAction:
      "Collect the charging or release paperwork and note the current status of any case.",
    jurisdiction: "Federal and Washington State",
    learnMoreHref: RIGHTS("arrest-and-detention"),
    urgency: 6,
  },

  due_process: {
    id: "due_process",
    title: "Procedural due process — notice and a chance to respond",
    explanation:
      "When a government body takes away something you were already receiving or entitled to, procedural due process asks whether you got notice and a real chance to respond.",
    authorities: [
      { label: "U.S. Constitution, Fourteenth Amendment (Due Process Clause)", verified: true },
      { label: "Washington Administrative Procedure Act, RCW 34.05", verified: false },
    ],
    factors: [
      "Whether an interest you already held was taken or reduced",
      "Whether written notice was given, and what it said",
      "Whether you were told how and by when to respond",
      "Whether a hearing or review was available",
      "Whether the decision-maker was neutral",
    ],
    contraryFacts: [
      "Written notice with appeal instructions was provided",
      "A hearing was offered and you were able to participate",
      "The action was a denial of a new application rather than a removal",
    ],
    missingFacts: [
      "Whether you received anything in writing, and on what date",
      "What the notice said about appealing",
      "Whether a deadline has already run",
    ],
    evidenceToPreserve: [
      "The decision letter and the envelope or email showing the date",
      "Any appeal form or confirmation you submitted",
      "Notes of calls, with dates and who you spoke to",
    ],
    nextAction:
      "Find the written decision and check it for an appeal route and date — that date usually drives everything else.",
    jurisdiction: "Federal and Washington State",
    learnMoreHref: RIGHTS("due-process"),
    urgency: 7,
  },

  equal_protection: {
    id: "equal_protection",
    title: "Equal protection — differential treatment by a government body",
    explanation:
      "You described being treated differently by a government body, which is the area equal protection addresses.",
    authorities: [
      { label: "U.S. Constitution, Fourteenth Amendment (Equal Protection Clause)", verified: true },
      { label: "42 U.S.C. § 1983", verified: true },
    ],
    factors: [
      "Whether the entity is a government actor",
      "Whether a protected characteristic is involved",
      "Whether comparable people were treated differently",
      "Whether there is evidence of intent, not only different outcomes",
      "What reason the entity gave for its decision",
    ],
    contraryFacts: [
      "A consistent, documented policy was applied to everyone",
      "Comparable people were treated the same way",
      "A non-discriminatory reason is documented contemporaneously",
    ],
    missingFacts: [
      "Who else was in a similar situation and how they were treated",
      "Any statements suggesting the reason for the difference",
      "The entity's written policy on the decision at issue",
    ],
    evidenceToPreserve: [
      "Statements, emails, or remarks showing how the decision was explained",
      "Records of how similar situations were handled",
      "Copies of the applicable policy",
    ],
    nextAction:
      "Write down specific comparisons: who, when, what was different, and how you know.",
    jurisdiction: "Federal and Washington State",
    learnMoreHref: RIGHTS("equal-protection"),
    urgency: 4,
  },

  municipal_liability: {
    id: "municipal_liability",
    title: "Policy or practice indicators (secondary)",
    explanation:
      "Repeated or multi-person patterns are sometimes reviewed as an issue with a policy, training, or practice rather than one individual's conduct. This is a secondary consideration, not a standalone violation.",
    authorities: [
      { label: "42 U.S.C. § 1983 (municipal liability doctrine)", verified: true },
    ],
    factors: [
      "Whether the conduct repeated across time or people",
      "Whether a written policy or training gap is identifiable",
      "Whether supervisors knew and did nothing",
      "Whether prior complaints exist",
    ],
    contraryFacts: [
      "A single isolated incident by one person",
      "The entity's policy prohibits what happened and was enforced",
    ],
    missingFacts: [
      "Whether others have reported similar treatment",
      "Whether prior complaints were investigated and what came of them",
      "The entity's written policy and training records",
    ],
    evidenceToPreserve: [
      "Public records responses about complaints and policies",
      "News coverage or oversight reports about the same entity",
      "Your own record of each repeated incident with dates",
    ],
    nextAction:
      "Track each incident separately with dates — patterns are built from individually documented events.",
    jurisdiction: "Federal",
    learnMoreHref: RIGHTS("patterns-and-practices"),
    secondary: true,
    urgency: 2,
  },

  ada_504: {
    id: "ada_504",
    title: "Disability access — ADA Title II / Section 504 indicators",
    explanation:
      "A disability-related need or denial involving a public entity or federally funded program falls in the area these laws address.",
    authorities: [
      { label: "Americans with Disabilities Act, Title II (42 U.S.C. § 12131 et seq.)", verified: true },
      { label: "Rehabilitation Act of 1973, Section 504 (29 U.S.C. § 794)", verified: true },
    ],
    factors: [
      "Whether the entity is a public entity or receives federal funding",
      "Whether a disability as defined by these laws is involved",
      "Whether an accommodation or modification was requested",
      "How the entity responded, and what reason it gave",
      "Whether an alternative was offered",
    ],
    contraryFacts: [
      "No accommodation was ever requested and the need was not obvious",
      "An effective alternative was offered and declined",
      "The entity is purely private and receives no federal funds",
    ],
    missingFacts: [
      "Exactly what accommodation was asked for, how, and when",
      "The connection between the disability and the need",
      "The reason the entity gave for denying or not responding",
    ],
    evidenceToPreserve: [
      "The written accommodation request and any response",
      "Medical or provider documentation of the disability-related need",
      "Notes of verbal requests, with dates and names",
    ],
    nextAction:
      "Put the accommodation request in writing (even if you already asked verbally) and keep a copy.",
    jurisdiction: "Federal",
    learnMoreHref: RIGHTS("disability-rights"),
    urgency: 5,
  },

  fair_housing: {
    id: "fair_housing",
    title: "Fair Housing Act — housing discrimination indicators",
    explanation:
      "You described treatment in housing tied to who you are or a disability-related need, which is the area fair-housing law addresses.",
    authorities: [
      { label: "Fair Housing Act (42 U.S.C. § 3601 et seq.)", verified: true },
      { label: "HUD fair housing complaint process", verified: false },
    ],
    factors: [
      "Whether a protected characteristic is involved",
      "How comparable applicants or tenants were treated",
      "What was said or written around the decision",
      "Whether a reasonable accommodation or modification was requested",
      "The timing between a request or complaint and the action",
    ],
    contraryFacts: [
      "A neutral screening standard was applied consistently",
      "Documented non-payment or lease breach preceded the action",
    ],
    missingFacts: [
      "What reason the landlord gave, in writing",
      "How similar tenants or applicants were handled",
      "Whether any accommodation request was made and how",
    ],
    evidenceToPreserve: [
      "All texts, emails, notices, and the lease",
      "Listing or advertisement language and application records",
      "Names of witnesses to conversations",
    ],
    nextAction:
      "Save every written communication with the landlord in one place, in date order.",
    jurisdiction: "Federal",
    learnMoreHref: RIGHTS("housing-discrimination"),
    urgency: 5,
  },

  wlad: {
    id: "wlad",
    title: "Washington Law Against Discrimination indicators",
    explanation:
      "Washington's anti-discrimination statute covers employment, housing, and public accommodation situations, and may apply alongside federal law.",
    authorities: [
      { label: "RCW 49.60 — Washington Law Against Discrimination", verified: true },
      { label: "Washington State Human Rights Commission complaint process", verified: false },
    ],
    factors: [
      "Whether the setting is one the statute covers",
      "Whether a protected characteristic is involved",
      "Whether the treatment was different from others",
      "Whether a complaint was made before an adverse action",
    ],
    contraryFacts: [
      "The conduct occurred entirely outside Washington",
      "A documented, consistently applied reason explains the action",
    ],
    missingFacts: [
      "Where the conduct took place",
      "The size and type of the entity involved",
      "Whether any agency complaint has already been filed",
    ],
    evidenceToPreserve: [
      "Dated records of the treatment described",
      "Any complaint you filed and the response",
      "Names and roles of decision-makers",
    ],
    nextAction:
      "Note the location and the entity type — coverage under this statute depends on both.",
    jurisdiction: "Washington State",
    learnMoreHref: RIGHTS("wlad"),
    urgency: 4,
  },

  employment_discrimination: {
    id: "employment_discrimination",
    title: "Workplace discrimination or retaliation indicators",
    explanation:
      "Workplace treatment tied to who you are, or to reporting something, is the area employment civil-rights law addresses — coverage depends on the employer and your working relationship.",
    authorities: [
      { label: "Title VII of the Civil Rights Act of 1964 (42 U.S.C. § 2000e)", verified: true },
      { label: "RCW 49.60 — Washington Law Against Discrimination", verified: true },
      { label: "EEOC and Washington State Human Rights Commission filing processes", verified: false },
    ],
    factors: [
      "Whether you were an employee and the employer is covered",
      "Whether a protected characteristic or protected activity is involved",
      "What adverse action occurred and when",
      "Whether the employer's stated reason is consistent over time",
      "Filing windows with administrative agencies, which can be short",
    ],
    contraryFacts: [
      "Documented performance problems predate your complaint",
      "You were an independent contractor rather than an employee",
      "The same action was applied to everyone in a layoff or closure",
    ],
    missingFacts: [
      "The employer's size and whether you were classified as an employee",
      "The reason given for the action, in writing",
      "Whether and when any agency complaint was filed",
    ],
    evidenceToPreserve: [
      "Emails, performance reviews, and HR correspondence",
      "Your own dated notes of conversations",
      "Pay records and the termination or discipline notice",
    ],
    nextAction:
      "Gather the written reason for the action and check whether an agency complaint window applies to your situation.",
    jurisdiction: "Federal and Washington State",
    learnMoreHref: RIGHTS("employment-rights"),
    urgency: 7,
  },

  wa_landlord_tenant: {
    id: "wa_landlord_tenant",
    title: "Washington landlord-tenant statutory issues",
    explanation:
      "Notices, repairs, deposits, and eviction steps in Washington are governed by a specific statute with its own required procedures.",
    authorities: [
      { label: "RCW 59.18 — Residential Landlord-Tenant Act", verified: true },
      { label: "RCW 59.12 — Unlawful Detainer", verified: false },
    ],
    factors: [
      "What type of notice was given and how it was delivered",
      "Whether required content and timing were followed",
      "Whether repair requests were made in writing",
      "Whether a court case has actually been filed",
      "Whether any retaliation timing is present",
    ],
    contraryFacts: [
      "The notice appears to follow the required form and delivery",
      "Rent is undisputedly unpaid and no defense is identified",
    ],
    missingFacts: [
      "The exact wording and date of any notice",
      "Whether a court summons has been served",
      "Whether repair requests exist in writing",
    ],
    evidenceToPreserve: [
      "The lease, every notice, and the envelope or delivery method",
      "Photos of conditions with dates",
      "Written repair requests and any response",
    ],
    nextAction:
      "Photograph every notice you received and note the date and how it was delivered — deadlines here move fast.",
    jurisdiction: "Washington State",
    learnMoreHref: RIGHTS("landlord-tenant"),
    urgency: 9,
  },

  public_records: {
    id: "public_records",
    title: "Washington Public Records Act indicators",
    explanation:
      "Records held by Washington state and local agencies are generally requestable, and the request process has its own rules.",
    authorities: [
      { label: "RCW 42.56 — Public Records Act", verified: true },
    ],
    factors: [
      "Whether the entity is a Washington state or local agency",
      "Whether the request was made in writing and is identifiable",
      "Whether the agency responded and how",
      "Whether exemptions were claimed and explained",
    ],
    contraryFacts: [
      "The entity is federal or private, so a different process applies",
      "The records requested do not exist",
    ],
    missingFacts: [
      "Which agency holds the records",
      "Whether a written request has been submitted, and when",
      "What response, if any, the agency gave",
    ],
    evidenceToPreserve: [
      "A copy of your request and the agency's acknowledgment",
      "Any exemption log or partial production received",
    ],
    nextAction:
      "Submit or re-send your request in writing and keep the confirmation — footage and recordings are often deleted on a schedule.",
    jurisdiction: "Washington State",
    learnMoreHref: RIGHTS("public-records"),
    urgency: 8,
  },

  student_rights: {
    id: "student_rights",
    title: "Student civil-rights indicators",
    explanation:
      "School discipline, special education, and harassment situations each have their own protections and procedures.",
    authorities: [
      { label: "Individuals with Disabilities Education Act (20 U.S.C. § 1400 et seq.)", verified: true },
      { label: "Rehabilitation Act of 1973, Section 504", verified: true },
      { label: "Title IX of the Education Amendments of 1972", verified: true },
      { label: "WAC 392-400 — Student discipline (Washington)", verified: false },
    ],
    factors: [
      "Whether written notice of the discipline and its reasons was given",
      "Whether a hearing or appeal was offered and explained",
      "Whether a disability or IEP/504 plan is involved",
      "Whether the school knew about harassment and how it responded",
      "Whether the response differed from how others were treated",
    ],
    contraryFacts: [
      "Written notice and an appeal route were provided and followed",
      "The school investigated promptly and documented its steps",
    ],
    missingFacts: [
      "What the school put in writing and when",
      "Whether an evaluation or plan was requested",
      "What appeal steps the district's own policy sets out",
    ],
    evidenceToPreserve: [
      "Discipline notices, IEP or 504 documents, and evaluation requests",
      "Every email with the school, in date order",
      "Notes from meetings, including who attended",
    ],
    nextAction:
      "Put any request (evaluation, records, appeal) in writing to the district and keep a dated copy.",
    jurisdiction: "Federal and Washington State",
    learnMoreHref: RIGHTS("education-rights"),
    urgency: 7,
  },

  conditions_of_confinement: {
    id: "conditions_of_confinement",
    title: "Custody conditions and medical care indicators",
    explanation:
      "Conditions, safety, and medical care in custody are reviewed under constitutional standards that differ depending on whether a person is held pretrial or after conviction.",
    authorities: [
      { label: "U.S. Constitution, Eighth Amendment (post-conviction)", verified: true },
      { label: "U.S. Constitution, Fourteenth Amendment (pretrial detainees)", verified: true },
      { label: "Prison Litigation Reform Act (42 U.S.C. § 1997e)", verified: true },
    ],
    factors: [
      "Whether the person is held pretrial or after conviction",
      "Whether staff knew of a serious risk or medical need",
      "How staff responded once they knew",
      "Whether the facility's grievance process was used",
      "How long the condition has continued",
    ],
    contraryFacts: [
      "Care was provided promptly after the request",
      "The concern is a disagreement about which treatment was chosen",
    ],
    missingFacts: [
      "Whether grievances were filed and what responses came back",
      "What medical requests were submitted and when",
      "Who was told about the risk and on what date",
    ],
    evidenceToPreserve: [
      "Copies of grievance forms and any responses",
      "Medical kite or request forms",
      "Names and dates for each report made to staff",
    ],
    nextAction:
      "Keep copies of every grievance and medical request — the facility's internal process usually has to be used first.",
    jurisdiction: "Federal",
    learnMoreHref: RIGHTS("incarceration-rights"),
    urgency: 8,
  },

  benefits_due_process: {
    id: "benefits_due_process",
    title: "Government benefits — denial, reduction, or termination",
    explanation:
      "Benefit denials, reductions, and terminations usually come with a written notice, an appeal route, and a deadline set by the program.",
    authorities: [
      { label: "U.S. Constitution, Fourteenth Amendment (Due Process Clause)", verified: true },
      { label: "Washington Administrative Procedure Act, RCW 34.05", verified: false },
      { label: "Program-specific federal and state regulations", verified: false },
    ],
    factors: [
      "Whether benefits were already being received or newly applied for",
      "Whether a written decision was issued",
      "Whether the notice explained the reason and the appeal route",
      "Whether the appeal window is still open",
      "Whether continued benefits pending appeal are available",
    ],
    contraryFacts: [
      "A clear written notice with reasons and appeal rights was received",
      "A hearing has already been held with full participation",
    ],
    missingFacts: [
      "The exact date on the decision letter",
      "Whether the notice states an appeal deadline",
      "Whether an appeal has already been filed",
    ],
    evidenceToPreserve: [
      "The decision letter and its envelope or email header",
      "Your application and any supporting documents submitted",
      "Records of calls: date, time, and who you spoke with",
    ],
    nextAction:
      "Locate the decision letter and read it for the appeal instructions and date before anything else.",
    jurisdiction: "Federal and Washington State",
    learnMoreHref: RIGHTS("government-benefits"),
    urgency: 9,
  },

  family_due_process: {
    id: "family_due_process",
    title: "Family and child-welfare due process indicators",
    explanation:
      "Child-welfare involvement carries its own notice, counsel, and hearing protections that differ between voluntary and court cases.",
    authorities: [
      { label: "U.S. Constitution, Fourteenth Amendment (Due Process Clause)", verified: true },
      { label: "RCW 13.34 — Juvenile Court Act (dependency)", verified: true },
      { label: "RCW 26.44 — Abuse of children", verified: false },
      { label: "Indian Child Welfare Act (25 U.S.C. § 1901 et seq.)", verified: true },
    ],
    factors: [
      "Whether the case is voluntary or court-involved",
      "Whether the allegations were provided in writing",
      "Whether counsel has been appointed or requested",
      "Whether hearings were noticed and attended",
      "Whether tribal affiliation may apply",
    ],
    contraryFacts: [
      "Written allegations, counsel, and hearing notice have all been provided",
      "The case is fully voluntary with no court involvement or removal",
    ],
    missingFacts: [
      "What the written allegations actually say",
      "Whether a court case has been filed and the next hearing date",
      "Whether an attorney has been appointed",
    ],
    evidenceToPreserve: [
      "Safety plans, court papers, and every DCYF letter",
      "Notes from each visit or call, with dates and names",
      "Records of services completed",
    ],
    nextAction:
      "Ask in writing for a copy of the allegations and any court paperwork, and note every scheduled date.",
    jurisdiction: "Washington State and Federal",
    learnMoreHref: RIGHTS("family-rights"),
    urgency: 9,
  },

  healthcare_access: {
    id: "healthcare_access",
    title: "Healthcare access, privacy, or records indicators",
    explanation:
      "Care denials, records access, and privacy in healthcare are governed by separate rules depending on the provider and funding involved.",
    authorities: [
      { label: "HIPAA Privacy Rule (45 C.F.R. Parts 160 and 164)", verified: true },
      { label: "Affordable Care Act, Section 1557 (nondiscrimination)", verified: true },
      { label: "Emergency Medical Treatment and Labor Act (42 U.S.C. § 1395dd)", verified: true },
    ],
    factors: [
      "The type of provider and whether it receives federal funds",
      "Whether care was denied, delayed, or ended",
      "Whether a protected characteristic or disability is involved",
      "Whether records were requested in writing",
      "What reason the provider gave",
    ],
    contraryFacts: [
      "A clinical reason for the decision is documented",
      "Records were provided within the provider's stated process",
    ],
    missingFacts: [
      "Whether the request or complaint was made in writing",
      "The provider's stated reason",
      "Whether an insurance denial is the actual decision point",
    ],
    evidenceToPreserve: [
      "Denial letters and explanations of benefits",
      "Your written records request and any response",
      "Notes of what was said, by whom, and when",
    ],
    nextAction:
      "Request your records in writing and keep the denial letters together in date order.",
    jurisdiction: "Federal and Washington State",
    learnMoreHref: RIGHTS("healthcare-rights"),
    urgency: 5,
  },

  court_access: {
    id: "court_access",
    title: "Court process and access indicators",
    explanation:
      "Court situations involve procedural rules, representation questions, and appeal windows that are specific to the type of case.",
    authorities: [
      { label: "U.S. Constitution, Sixth Amendment (criminal representation)", verified: true },
      { label: "U.S. Constitution, Fourteenth Amendment (Due Process Clause)", verified: true },
      { label: "Washington Court Rules and Rules of Appellate Procedure", verified: false },
    ],
    factors: [
      "The type of case and its current stage",
      "Whether representation was requested or appointed",
      "Whether a deadline to respond or appeal is running",
      "Whether the record reflects what happened",
    ],
    contraryFacts: [
      "Counsel was appointed and is actively engaged",
      "The matter is still open with time remaining to raise the issue",
    ],
    missingFacts: [
      "The case number and current status",
      "Any deadline stated in court paperwork",
      "What was requested on the record and when",
    ],
    evidenceToPreserve: [
      "All court paperwork and the docket",
      "Correspondence with any attorney",
      "Hearing dates and notes on what happened",
    ],
    nextAction:
      "Write down the case number and any dates on your paperwork — court deadlines are rarely extendable.",
    jurisdiction: "Washington State and Federal",
    learnMoreHref: RIGHTS("courts-and-procedure"),
    urgency: 9,
  },
};

export const getIssueDefinition = (id: string): IssueDefinition | undefined =>
  issueLibrary[id];
