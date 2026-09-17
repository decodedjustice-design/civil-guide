export type LawAuthorityType = "statute" | "regulation" | "case";

export interface LawAuthority {
  citation: string;
  title: string;
  type: LawAuthorityType;
  jurisdiction: string;
  url: string;
  note: string;
}

export interface LawModule {
  id: string;
  category: string;
  analyzerSystems: string[];
  title: string;
  definition: string;
  elements: string[];
  evidenceExamples: string[];
  questions: string[];
  authorities: LawAuthority[];
}

/**
 * Curated primary-authority starting points for Washington-focused issue spotting.
 * These are research leads, not legal conclusions. Keep analyzer findings Unknown
 * until the user supplies facts and supporting records.
 */
export const LAW_MODULES: LawModule[] = [
  {
    id: "police-civil-rights",
    category: "Civil Rights & Law Enforcement",
    analyzerSystems: ["police", "government", "courts", "jail"],
    title: "Government action and constitutional rights",
    definition: "A potential civil-rights issue may arise when a state or local actor, acting under color of law, allegedly deprives a person of a right secured by the Constitution or federal law.",
    elements: [
      "A defendant acted under color of state law or another qualifying government authority.",
      "The conduct allegedly deprived the person of a right, privilege, or immunity secured by the Constitution or laws.",
      "The specific right and the facts supporting the alleged deprivation can be identified.",
      "Any applicable defenses, immunities, causation requirements, and remedies must be evaluated separately."
    ],
    evidenceExamples: ["Incident reports", "CAD/dispatch records", "Body-camera or video", "Witness statements", "Orders, notices, or correspondence"],
    questions: ["Who acted?", "What authority were they exercising?", "What specific right may be implicated?", "What record proves each material fact?"],
    authorities: [
      { citation: "42 U.S.C. § 1983", title: "Civil action for deprivation of rights", type: "statute", jurisdiction: "United States", url: "https://uscode.house.gov/view.xhtml?req=%28title%3A42+section%3A1983+edition%3Aprelim%29", note: "Federal cause-of-action statute for certain deprivations committed under color of state law." }
    ]
  },
  {
    id: "housing-tenant",
    category: "Housing & Tenant Issues",
    analyzerSystems: ["housing"],
    title: "Residential landlord-tenant duties and remedies",
    definition: "Washington's Residential Landlord-Tenant Act establishes duties, notices, restrictions, and remedies governing many residential tenancies.",
    elements: [
      "The parties and tenancy fall within the applicable statutory chapter.",
      "A specific landlord or tenant duty, notice requirement, prohibition, or remedy applies.",
      "The relevant act or omission occurred during the tenancy or another covered period.",
      "The required notice, timing, causation, and available remedy must be evaluated for the particular provision."
    ],
    evidenceExamples: ["Lease and addenda", "Rent ledger", "Notices", "Repair requests", "Inspection or code records", "Emails/texts with management"],
    questions: ["What provision governs the conduct?", "What notice was given and when?", "What did the lease say?", "What records establish the condition or communication?"],
    authorities: [
      { citation: "RCW 59.18.060", title: "Landlord—Duties", type: "statute", jurisdiction: "Washington", url: "https://app.leg.wa.gov/RCW/default.aspx?cite=59.18.060", note: "Sets specified landlord duties, including maintaining premises fit for human habitation and certain health and safety conditions." },
      { citation: "RCW 59.18.240", title: "Reprisals or retaliatory actions by landlord—Prohibited", type: "statute", jurisdiction: "Washington", url: "https://app.leg.wa.gov/RCW/default.aspx?cite=59.18.240", note: "Primary authority for Washington residential landlord retaliation issues." },
      { citation: "RCW 59.18.650", title: "Eviction of tenant—Cause—Notice—Penalties", type: "statute", jurisdiction: "Washington", url: "https://app.leg.wa.gov/RCW/default.aspx?cite=59.18.650", note: "Current statutory starting point for covered termination/eviction questions; verify the effective-date provisions for the case." }
    ]
  },
  {
    id: "child-welfare-dependency",
    category: "Child Welfare & Dependency",
    analyzerSystems: ["cps_dcyf"],
    title: "Dependency procedure and child-welfare rights",
    definition: "Washington dependency law governs when a child may be found dependent, custody and shelter-care procedures, notice, hearings, services, placement, and permanency.",
    elements: [
      "Identify the dependency proceeding, agency action, placement decision, or court order at issue.",
      "Identify the governing dependency statute, court rule, regulation, or order.",
      "Identify the required notice, hearing, service, finding, or procedure and compare it with the record.",
      "Separate agency allegations from established facts and court findings."
    ],
    evidenceExamples: ["Dependency petitions/orders", "Shelter-care notices", "FTDM records", "Placement notices", "Case notes", "Service plans", "Court docket and transcripts"],
    questions: ["What action occurred?", "What notice was provided?", "What court order governed?", "What does the agency record actually say?"],
    authorities: [
      { citation: "RCW 13.34.030", title: "Definitions—Dependent child", type: "statute", jurisdiction: "Washington", url: "https://app.leg.wa.gov/rcw/default.aspx?cite=13.34.030", note: "Defines key dependency terms and circumstances for a dependent child." },
      { citation: "RCW 13.34.062", title: "Shelter care—Notice of custody and rights", type: "statute", jurisdiction: "Washington", url: "https://app.leg.wa.gov/rcw/default.aspx?cite=13.34.062", note: "Primary authority for specified shelter-care notice and rights questions." },
      { citation: "RCW 13.34.096", title: "Right to be heard—Notice", type: "statute", jurisdiction: "Washington", url: "https://app.leg.wa.gov/rcw/default.aspx?cite=13.34.096", note: "Provides statutory notice/hearing-related rights in dependency proceedings." }
    ]
  },
  {
    id: "employment-discrimination",
    category: "Employment & Workplace Rights",
    analyzerSystems: ["employer"],
    title: "Washington employment discrimination and retaliation",
    definition: "Washington's Law Against Discrimination prohibits specified employment discrimination and separately addresses retaliation for opposing prohibited practices or participating in covered proceedings.",
    elements: [
      "Identify the employment relationship and covered actor.",
      "Identify the protected characteristic or protected activity implicated by the facts.",
      "Identify the employment action or condition at issue.",
      "Evaluate timing, comparators, stated reasons, evidence, and applicable defenses or exceptions."
    ],
    evidenceExamples: ["Employment policies", "Performance records", "Emails", "HR complaints", "Accommodation requests", "Disciplinary notices", "Comparator evidence"],
    questions: ["What protected characteristic or activity is involved?", "What action changed?", "Who made the decision?", "What explanation was given?"],
    authorities: [
      { citation: "RCW 49.60.180", title: "Unfair practices of employers", type: "statute", jurisdiction: "Washington", url: "https://app.leg.wa.gov/rcW/default.aspx?cite=49.60.180", note: "Washington Law Against Discrimination employment provision." },
      { citation: "RCW 49.60.210", title: "Unfair practices—Retaliation", type: "statute", jurisdiction: "Washington", url: "https://app.leg.wa.gov/RCW/default.aspx?cite=49.60.210", note: "Washington retaliation provision for specified protected opposition, participation, and whistleblower contexts." }
    ]
  },
  {
    id: "education-records",
    category: "Education & School Issues",
    analyzerSystems: ["school"],
    title: "Student attendance and education-record rights",
    definition: "Washington education law and federal student-record law establish duties and rights that depend on the student's age, school setting, records involved, and circumstances.",
    elements: [
      "Identify the school, student status, and specific educational action or record at issue.",
      "Identify the applicable Washington or federal provision.",
      "Document the request, response, decision, or attendance event.",
      "Check statutory exceptions, procedural requirements, and available administrative remedies."
    ],
    evidenceExamples: ["IEP/504 records", "Attendance records", "School correspondence", "Discipline records", "Enrollment records", "Education-record requests"],
    questions: ["What record or educational decision is at issue?", "Who requested or denied access?", "What policy or statute was cited?", "What dates matter?"],
    authorities: [
      { citation: "RCW 28A.225.010", title: "Attendance mandatory—Exceptions", type: "statute", jurisdiction: "Washington", url: "https://app.leg.wa.gov/RCW/?cite=28A.225.010", note: "Washington compulsory-attendance provision with specified exceptions." },
      { citation: "20 U.S.C. § 1232g", title: "Family educational and privacy rights (FERPA)", type: "statute", jurisdiction: "United States", url: "https://uscode.house.gov/view.xhtml?req=%28title%3A20+section%3A1232g+edition%3Aprelim%29", note: "Federal statute governing specified education-record privacy and access requirements." }
    ]
  },
  {
    id: "healthcare-rights",
    category: "Healthcare & Records",
    analyzerSystems: ["healthcare"],
    title: "Health-information privacy and access",
    definition: "Federal health-information rules apply to covered entities and business associates in specified circumstances; the exact rule depends on the type of entity, record, and requested disclosure or use.",
    elements: [
      "Identify whether the actor is subject to the applicable federal health-information requirements.",
      "Identify the information and the use, disclosure, access, or security practice at issue.",
      "Identify the specific regulatory or statutory requirement implicated.",
      "Check exceptions, authorizations, permitted disclosures, and enforcement mechanisms."
    ],
    evidenceExamples: ["Medical-record requests", "Authorization forms", "Provider correspondence", "Privacy notices", "Disclosure logs", "Portal records"],
    questions: ["Who held the information?", "What information was involved?", "Was the issue access, disclosure, use, or security?", "What response or exception was given?"],
    authorities: [
      { citation: "42 U.S.C. § 1320d–2", title: "Standards for information transactions and data elements", type: "statute", jurisdiction: "United States", url: "https://uscode.house.gov/view.xhtml?req=%28title%3A42+section%3A1320d-2+edition%3Aprelim%29", note: "HIPAA statutory provision addressing standards and security safeguards; the privacy rules themselves are implemented through federal regulations." }
    ]
  },
  {
    id: "court-access-procedure",
    category: "Courts & Legal Procedure",
    analyzerSystems: ["courts"],
    title: "Procedural due process and access to court proceedings",
    definition: "Potential procedural issues require identifying the legal proceeding, the interest affected, the process provided, and the particular rule or constitutional protection that governs.",
    elements: [
      "Identify the proceeding and the governmental action or order at issue.",
      "Identify the protected interest or procedural right claimed.",
      "Identify the notice, hearing, opportunity to be heard, or other process actually provided.",
      "Identify the governing statute, court rule, constitutional provision, or order."
    ],
    evidenceExamples: ["Docket entries", "Court orders", "Summons/notices", "Proofs of service", "Transcripts", "Hearing recordings"],
    questions: ["What proceeding was pending?", "What notice was required?", "What notice was actually received?", "What does the docket establish?"],
    authorities: [
      { citation: "U.S. Const. amend. XIV", title: "Due Process Clause", type: "statute", jurisdiction: "United States", url: "https://constitution.congress.gov/constitution/amendment-14/", note: "Constitutional starting point for many state-government procedural due-process questions." },
      { citation: "42 U.S.C. § 1983", title: "Civil action for deprivation of rights", type: "statute", jurisdiction: "United States", url: "https://uscode.house.gov/view.xhtml?req=%28title%3A42+section%3A1983+edition%3Aprelim%29", note: "Potential federal civil-rights vehicle when its requirements are satisfied; it is not itself proof that a constitutional violation occurred." }
    ]
  },
  {
    id: "jail-prison-conditions",
    category: "Jail & Prison Conditions",
    analyzerSystems: ["jail"],
    title: "Constitutional protections in custody",
    definition: "Conditions-of-confinement issues depend on custody status, the constitutional provision implicated, the nature of the harm, and what officials knew and did.",
    elements: [
      "Identify the person's custody status and the responsible actor.",
      "Identify the specific condition or treatment challenged.",
      "Identify the constitutional or statutory right potentially implicated.",
      "Document notice, response, duration, harm, and available grievance or medical records."
    ],
    evidenceExamples: ["Grievances", "Medical records", "Classification records", "Incident reports", "Photographs", "Witness statements"],
    questions: ["What was the condition?", "How long did it last?", "Who knew?", "What response occurred?", "What records document it?"],
    authorities: [
      { citation: "42 U.S.C. § 1983", title: "Civil action for deprivation of rights", type: "statute", jurisdiction: "United States", url: "https://uscode.house.gov/view.xhtml?req=%28title%3A42+section%3A1983+edition%3Aprelim%29", note: "Potential federal civil-rights vehicle for qualifying state or local custody claims." }
    ]
  },
  {
    id: "public-records",
    category: "Public Records & Government Transparency",
    analyzerSystems: ["government"],
    title: "Washington Public Records Act response requirements",
    definition: "Washington's Public Records Act establishes a process for requesting and responding to public-records requests, subject to statutory exemptions and other applicable rules.",
    elements: [
      "Identify whether the recipient is an agency subject to the Public Records Act.",
      "Identify the records requested and whether the request was sufficiently clear.",
      "Document the agency's response within the applicable statutory timeframe.",
      "For withheld records, identify the claimed exemption and the agency's explanation."
    ],
    evidenceExamples: ["Original request", "Delivery confirmation", "Agency acknowledgment", "Production logs", "Withholding/redaction logs", "Correspondence"],
    questions: ["When was the request received?", "What response was provided?", "Was a reasonable estimate given?", "What exemption was cited for any withholding?"],
    authorities: [
      { citation: "RCW 42.56.520", title: "Prompt responses required", type: "statute", jurisdiction: "Washington", url: "https://app.leg.wa.gov/RCW/?cite=42.56.520", note: "Requires an agency to respond within five business days in one of the ways specified by the statute." },
      { citation: "RCW 42.56.050", title: "Invasion of privacy, when", type: "statute", jurisdiction: "Washington", url: "https://app.leg.wa.gov/RCW/default.aspx?cite=42.56.050", note: "One statutory provision governing privacy-related public-records analysis." }
    ]
  },
  {
    id: "disability-access",
    category: "Disability & Accessibility",
    analyzerSystems: ["government", "school", "employer", "healthcare", "housing"],
    title: "Disability discrimination in public services",
    definition: "Title II of the ADA prohibits a qualified individual with a disability from being excluded from, denied the benefits of, or subjected to discrimination in covered services, programs, or activities of a public entity because of disability.",
    elements: [
      "The defendant is a public entity covered by Title II.",
      "The person is a qualified individual with a disability under the applicable definitions.",
      "The person was excluded, denied benefits, or discriminated against in a covered service, program, or activity.",
      "The exclusion or discrimination was by reason of disability, subject to the statute's requirements and exceptions."
    ],
    evidenceExamples: ["Accommodation request", "Medical/support documentation", "Agency response", "Policies", "Service records", "Communication logs"],
    questions: ["What service or program was involved?", "What accommodation or modification was requested?", "What response was given?", "What record documents the disability-related connection?"],
    authorities: [
      { citation: "42 U.S.C. § 12132", title: "ADA Title II—Discrimination", type: "statute", jurisdiction: "United States", url: "https://uscode.house.gov/view.xhtml?edition=prelim&f=treesort&jumpTo=true&num=0&req=%28title%3A42+section%3A12132+edition%3Aprelim%29", note: "Primary federal statutory authority for discrimination by covered public entities on the basis of disability." }
    ]
  },
  {
    id: "benefits-government-services",
    category: "Benefits & Government Services",
    analyzerSystems: ["government"],
    title: "Access to government benefits and services",
    definition: "Benefits issues are program-specific. The analysis starts with identifying the program, eligibility rule, agency decision, notice, appeal process, and records supporting the decision.",
    elements: [
      "Identify the specific benefit or government service and governing program.",
      "Identify the eligibility, reporting, verification, or procedural rule at issue.",
      "Document the agency decision and the notice provided.",
      "Identify applicable reconsideration, hearing, appeal, or review procedures."
    ],
    evidenceExamples: ["Application", "Eligibility notices", "Benefit statements", "Agency correspondence", "Verification documents", "Appeal requests"],
    questions: ["What program is involved?", "What rule did the agency cite?", "What notice was received?", "What appeal deadline applies?"],
    authorities: [
      { citation: "42 U.S.C. § 1983", title: "Civil action for deprivation of rights", type: "statute", jurisdiction: "United States", url: "https://uscode.house.gov/view.xhtml?req=%28title%3A42+section%3A1983+edition%3Aprelim%29", note: "May be relevant to some government-action claims, but benefit programs often have their own administrative remedies and limits." }
    ]
  }
];

export const getLawModulesForAnalyzer = (systemId: string): LawModule[] =>
  LAW_MODULES.filter((module) => module.analyzerSystems.includes(systemId));

export const getLawModule = (id: string): LawModule | undefined =>
  LAW_MODULES.find((module) => module.id === id);
