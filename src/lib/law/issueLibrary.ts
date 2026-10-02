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
      { citation: "42 U.S.C. § 1983", title: "Civil action for deprivation of rights", type: "statute", jurisdiction: "United States", url: "https://uscode.house.gov/view.xhtml?req=%28title%3A42+section%3A1983+edition%3Aprelim%29", note: "Federal cause-of-action statute for certain deprivations committed under color of state law." },
      { citation: "State v. Ladson, 138 Wn.2d 343, 979 P.2d 833 (1999)", title: "Pretextual traffic stops", type: "case", jurisdiction: "Washington", url: "https://law.justia.com/cases/washington/supreme-court/1999/65801-3-1.html", note: "Washington Supreme Court decision addressing pretextual traffic stops under article I, section 7." },
      { citation: "State v. Acrey, 148 Wn.2d 738, 64 P.3d 594 (2003)", title: "Community caretaking and warrantless seizure", type: "case", jurisdiction: "Washington", url: "https://law.justia.com/cases/washington/supreme-court/2003/72259-5-1.html", note: "Washington Supreme Court decision addressing warrantless seizure and the community-caretaking exception." }
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
      { citation: "RCW 13.34.096", title: "Right to be heard—Notice", type: "statute", jurisdiction: "Washington", url: "https://app.leg.wa.gov/rcw/default.aspx?cite=13.34.096", note: "Provides statutory notice/hearing-related rights in dependency proceedings." },
      { citation: "RCW 74.13.300", title: "Notification of proposed placement changes", type: "statute", jurisdiction: "Washington", url: "https://app.leg.wa.gov/rcw/default.aspx?cite=74.13.300", note: "Sets notice requirements for specified proposed foster-placement changes." },
      { citation: "RCW 74.13.332", title: "Rights of foster parents", type: "statute", jurisdiction: "Washington", url: "https://app.leg.wa.gov/rcw/default.aspx?cite=74.13.332", note: "Protects foster parents from specified coercion, discrimination, and reprisal and recognizes the right to voice grievances." },
      { citation: "RCW 74.13.333", title: "Rights of foster parents—Complaints and retaliation", type: "statute", jurisdiction: "Washington", url: "https://app.leg.wa.gov/rcw/default.aspx?cite=74.13.333", note: "Provides a complaint process for specified foster-parent retaliation or discrimination claims." },
      { citation: "RCW 26.44.100", title: "Notification of investigation, report, and findings", type: "statute", jurisdiction: "Washington", url: "https://app.leg.wa.gov/rcw/default.aspx?cite=26.44.100", note: "Requires specified notification to parents, guardians, or legal custodians concerning allegations and investigative findings." },
      { citation: "WAC 110-30-0130", title: "CPS notification responsibilities", type: "regulation", jurisdiction: "Washington", url: "https://lawfilesext.leg.wa.gov/Law/WACArchive/2025/htm/WAC%20110%20-%2030%20CHAPTER/WAC%20110%20-%2030%20-0130.htm", note: "CPS notification rule governing when and how parents, guardians, or legal custodians are notified in specified CPS cases." },
      { citation: "WAC 110-30-0140", title: "Notification of allegations", type: "regulation", jurisdiction: "Washington", url: "https://lawfilesext.leg.wa.gov/Law/WACArchive/2025/htm/WAC%20110%20-%2030%20CHAPTER/WAC%20110%20-%2030%20-0140.htm", note: "Regulation addressing when the department must notify a parent, guardian, or legal custodian of allegations." }
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
      { citation: "RCW 49.60.180", title: "Unfair practices of employers", type: "statute", jurisdiction: "Washington", url: "https://app.leg.wa.gov/RCW/default.aspx?cite=49.60.180", note: "Washington Law Against Discrimination employment provision." },
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
      { citation: "20 U.S.C. § 1232g", title: "Family educational and privacy rights (FERPA)", type: "statute", jurisdiction: "United States", url: "https://uscode.house.gov/view.xhtml?req=%28title%3A20+section%3A1232g+edition%3Aprelim%29", note: "Federal statute governing specified education-record privacy and access requirements." },
      { citation: "34 C.F.R. § 99.10", title: "Right to inspect and review education records", type: "regulation", jurisdiction: "United States", url: "https://www.ecfr.gov/current/title-34/subtitle-A/part-99/subpart-B/section-99.10", note: "Federal FERPA regulation addressing a parent or eligible student's right to inspect and review education records, subject to the regulation's terms." }
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
      { citation: "42 U.S.C. § 1320d–2", title: "Standards for information transactions and data elements", type: "statute", jurisdiction: "United States", url: "https://uscode.house.gov/view.xhtml?req=%28title%3A42+section%3A1320d-2+edition%3Aprelim%29", note: "HIPAA statutory provision addressing standards and security safeguards; the privacy rules themselves are implemented through federal regulations." },
      { citation: "45 C.F.R. § 164.502", title: "Uses and disclosures of protected health information", type: "regulation", jurisdiction: "United States", url: "https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-E/section-164.502", note: "Federal HIPAA Privacy Rule provision governing specified uses and disclosures of protected health information." },
      { citation: "45 C.F.R. § 164.524", title: "Access of individuals to protected health information", type: "regulation", jurisdiction: "United States", url: "https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-E/section-164.524", note: "Federal HIPAA Privacy Rule provision governing individual access to protected health information, subject to stated conditions and exceptions." }
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
      { citation: "Goldberg v. Kelly, 397 U.S. 254 (1970)", title: "Due process and termination of public benefits", type: "case", jurisdiction: "United States", url: "https://supreme.justia.com/cases/federal/us/397/254/", note: "U.S. Supreme Court decision concerning procedural due process before termination of certain public benefits." },
      { citation: "Mathews v. Eldridge, 424 U.S. 319 (1976)", title: "Procedural due process balancing", type: "case", jurisdiction: "United States", url: "https://supreme.justia.com/cases/federal/us/424/319/", note: "U.S. Supreme Court framework for evaluating what process is due." },
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
      { citation: "42 U.S.C. § 1983", title: "Civil action for deprivation of rights", type: "statute", jurisdiction: "United States", url: "https://uscode.house.gov/view.xhtml?req=%28title%3A42+section%3A1983+edition%3Aprelim%29", note: "Potential federal civil-rights vehicle for qualifying state or local custody claims." },
      { citation: "Estelle v. Gamble, 429 U.S. 97 (1976)", title: "Serious medical needs in custody", type: "case", jurisdiction: "United States", url: "https://caselaw.findlaw.com/court/us-supreme-court/429/97.html", note: "U.S. Supreme Court decision addressing deliberate indifference to serious medical needs under the Eighth Amendment." },
      { citation: "Farmer v. Brennan, 511 U.S. 825 (1994)", title: "Deliberate indifference to substantial risk", type: "case", jurisdiction: "United States", url: "https://supreme.justia.com/cases/federal/us/511/825/", note: "U.S. Supreme Court decision defining deliberate indifference to a substantial risk of serious harm in prison conditions cases." }
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
      { citation: "RCW 42.56.050", title: "Invasion of privacy, when", type: "statute", jurisdiction: "Washington", url: "https://app.leg.wa.gov/RCW/default.aspx?cite=42.56.050", note: "One statutory provision governing privacy-related public-records analysis." },
      { citation: "RCW 42.56.070", title: "Documents and indexes to be made public", type: "statute", jurisdiction: "Washington", url: "https://app.leg.wa.gov/RCW/default.aspx?cite=42.56.070", note: "Public Records Act provision concerning agency disclosure and publication duties, subject to exemptions and other law." },
      { citation: "RCW 42.56.550", title: "Judicial review of agency actions", type: "statute", jurisdiction: "Washington", url: "https://app.leg.wa.gov/RCW/default.aspx?cite=42.56.550", note: "Provides judicial review mechanisms and remedies for Public Records Act disputes." }
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
      { citation: "42 U.S.C. § 12132", title: "ADA Title II—Discrimination", type: "statute", jurisdiction: "United States", url: "https://uscode.house.gov/view.xhtml?edition=prelim&f=treesort&jumpTo=true&num=0&req=%28title%3A42+section%3A12132+edition%3Aprelim%29", note: "Primary federal statutory authority for discrimination by covered public entities on the basis of disability." },
      { citation: "28 C.F.R. § 35.130", title: "ADA Title II—General prohibitions against discrimination", type: "regulation", jurisdiction: "United States", url: "https://www.ecfr.gov/current/title-28/chapter-I/part-35/subpart-B/section-35.130", note: "Federal ADA Title II regulation addressing discrimination and reasonable modifications in covered public services." },
      { citation: "28 C.F.R. § 35.160", title: "Communications", type: "regulation", jurisdiction: "United States", url: "https://www.ecfr.gov/current/title-28/chapter-I/part-35/subpart-E/section-35.160", note: "Federal ADA Title II regulation addressing effective communication and auxiliary aids and services." }
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
      { citation: "42 U.S.C. § 1983", title: "Civil action for deprivation of rights", type: "statute", jurisdiction: "United States", url: "https://uscode.house.gov/view.xhtml?req=%28title%3A42+section%3A1983+edition%3Aprelim%29", note: "May be relevant to some government-action claims, but benefit programs often have their own administrative remedies and limits." },
      { citation: "Goldberg v. Kelly, 397 U.S. 254 (1970)", title: "Procedural due process and public benefits", type: "case", jurisdiction: "United States", url: "https://supreme.justia.com/cases/federal/us/397/254/", note: "U.S. Supreme Court decision addressing procedural safeguards before termination of certain welfare benefits." },
      { citation: "Mathews v. Eldridge, 424 U.S. 319 (1976)", title: "Procedural due process balancing", type: "case", jurisdiction: "United States", url: "https://supreme.justia.com/cases/federal/us/424/319/", note: "U.S. Supreme Court framework for determining what process is due in a particular governmental decision." }
    ]
  }
];

export const FIRST_ISSUE_LIBRARY: LawModule[] = [
  {
    id: "first-amendment-retaliation",
    category: "Constitutional Rights",
    analyzerSystems: ["police", "government", "courts", "jail", "school"],
    title: "First Amendment retaliation",
    definition: "A government actor may violate the First Amendment when they take adverse action because a person engaged in constitutionally protected speech, petitioning, or other protected activity. The key questions are what was protected, what adverse action occurred, and whether the protected activity caused the action.",
    elements: [
      "Protected activity: the person engaged in speech, petitioning, filing a grievance or complaint, or another activity protected by the First Amendment.",
      "Adverse action: the government actor took an action that would deter a person of ordinary firmness from continuing the protected activity.",
      "Causation: the protected activity was a substantial or motivating factor in the adverse action; the required causation test can vary with the type of retaliation claim.",
      "Identify the government actor and the action taken, and distinguish retaliation from an independently justified government action.",
      "For retaliatory-arrest claims, probable cause and the narrow Nieves exception require a separate analysis."
    ],
    evidenceExamples: ["Complaint, grievance, petition, public comment, recording, or other protected expression","Dates showing what happened before and after the protected activity","Texts, emails, reports, messages, or statements referencing the protected activity","Citation, arrest, search, restriction, discipline, denial, or other alleged adverse action","Records showing how similarly situated people were treated, when relevant","Body-camera, CAD/dispatch, case notes, or other contemporaneous records"],
    questions: ["What exactly did the person say, write, file, or do?","Why is that activity protected by the First Amendment?","What specific action happened afterward, and who took it?","What evidence connects the action to the protected activity?","Was there a stated legitimate reason for the action, and what records support that reason?","If the allegation involves an arrest, was there probable cause and does the Nieves exception potentially apply?"],
    authorities: [
      { citation: "Skoog v. County of Clackamas, 469 F.3d 1221, 1231–32 (9th Cir. 2006)", title: "First Amendment retaliation", type: "case", jurisdiction: "United States / Ninth Circuit", url: "https://cdn.ca9.uscourts.gov/datastore/opinions/2006/11/27/0413670.pdf", note: "Ninth Circuit authority describing the core retaliation inquiry: protected activity, an adverse action that would chill a person of ordinary firmness, and causation." },
      { citation: "O'Brien v. Welty, 818 F.3d 920, 932–33 (9th Cir. 2016)", title: "Retaliation for protected speech", type: "case", jurisdiction: "United States / Ninth Circuit", url: "https://cdn.ca9.uscourts.gov/datastore/opinions/2016/04/07/13-16279.pdf", note: "Ninth Circuit explains that otherwise lawful government action may still be unconstitutional if substantially motivated by protected speech or expressive conduct." },
      { citation: "Nieves v. Bartlett, 587 U.S. 391, 402–07 (2019)", title: "Retaliatory arrest and probable cause", type: "case", jurisdiction: "United States", url: "https://supreme.justia.com/cases/federal/us/587/17-1174/", note: "Supreme Court framework for First Amendment retaliatory-arrest claims, including the general probable-cause rule and a narrow exception." }
    ]
  },
  {
    id: "fourth-amendment-search",
    category: "Constitutional Rights",
    analyzerSystems: ["police", "government", "jail"],
    title: "Fourth Amendment search",
    definition: "The Fourth Amendment protects against unreasonable searches. Start by asking whether government conduct was a search—such as an intrusion into a protected privacy interest or a physical intrusion to obtain information—and then examine the warrant requirement, any exception, the scope of the search, and overall reasonableness.",
    elements: [
      "Search threshold: determine whether government conduct intruded on a reasonable expectation of privacy or physically intruded on a constitutionally protected area to obtain information.",
      "Warrant requirement: if a search occurred, determine whether a warrant was required and, if so, whether a valid warrant existed.",
      "Exception or justification: if there was no warrant, identify the claimed exception, such as consent, exigent circumstances, search incident to arrest, or another recognized exception.",
      "Scope: compare what officers searched with what the warrant, consent, or exception actually authorized.",
      "Reasonableness and remedy: identify the circumstances, intrusion, governmental justification, and any separate exclusionary-rule or civil-claim questions."
    ],
    evidenceExamples: ["Search warrant, affidavit, return, and inventory","Body-camera, dash-camera, photographs, and scene documentation","Consent form, recording, or statements about consent","Reports describing what officers knew before the search","CAD/dispatch records and time stamps","Phone, vehicle, home, person, container, or digital-device records showing the scope of the search"],
    questions: ["What exactly was searched, and what information were officers trying to obtain?","Where did the search occur, and did the person have a privacy interest there?","Was there a warrant? If so, what did it specifically authorize?","If there was no warrant, what exception did the government rely on?","What facts were known before the search, and when did officers learn them?","Did the search stay within the authorized scope?"],
    authorities: [
      { citation: "Katz v. United States, 389 U.S. 347, 351–53 (1967)", title: "Reasonable expectation of privacy", type: "case", jurisdiction: "United States", url: "https://supreme.justia.com/cases/federal/us/389/347/", note: "Supreme Court authority recognizing Fourth Amendment protection for certain reasonable expectations of privacy." },
      { citation: "United States v. Jones, 565 U.S. 400, 404–13 (2012)", title: "Physical intrusion and information gathering", type: "case", jurisdiction: "United States", url: "https://supreme.justia.com/cases/federal/us/565/400/", note: "Supreme Court held that a government trespassory intrusion on a constitutionally protected area to obtain information is a search." },
      { citation: "Riley v. California, 573 U.S. 373, 385–97 (2014)", title: "Searching digital information", type: "case", jurisdiction: "United States", url: "https://supreme.justia.com/cases/federal/us/573/373/", note: "Supreme Court held that police generally must obtain a warrant before searching digital information on a cell phone seized from an arrested person, subject to applicable exceptions." },
      { citation: "Terry v. Ohio, 392 U.S. 1, 20–27 (1968)", title: "Reasonable suspicion for limited investigative stops and frisks", type: "case", jurisdiction: "United States", url: "https://supreme.justia.com/cases/federal/us/392/1/", note: "Supreme Court permits limited investigative detention and a protective frisk under the circumstances described in Terry; it is not a general warrant exception for every search." }
    ]
  }
];

export const getLawModulesForAnalyzer = (systemId: string): LawModule[] =>
  LAW_MODULES.filter((module) => module.analyzerSystems.includes(systemId));

export const getLawModule = (id: string): LawModule | undefined =>
  LAW_MODULES.find((module) => module.id === id);
