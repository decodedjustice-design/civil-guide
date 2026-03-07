// Washington State + Federal Support Network Resources
// Structured for Analyzer compatibility using system tags

export type SystemTag = 
  | "police"
  | "employment" 
  | "housing"
  | "disability"
  | "courts"
  | "incarceration"
  | "education"
  | "healthcare"
  | "government"
  | "public-records"
  | "cps_dcyf";

export interface SupportResource {
  id: string;
  name: string;
  jurisdiction: "washington" | "federal";
  systemTags: SystemTag[];
  whatTheyDo: string;
  whenToContact: string;
  whatTheyCan: string;
  whatTheyCannot: string;
  officialStatus: "official" | "informational";
  website?: string;
  phone?: string;
  notes?: string;
}

export const supportResources: SupportResource[] = [
  // ===== POLICE / LAW ENFORCEMENT =====
  {
    id: "wa-cjtc-opc",
    name: "WA Criminal Justice Training Commission – Office of Professional Conduct",
    jurisdiction: "washington",
    systemTags: ["police"],
    whatTheyDo: "Investigates officer misconduct and manages law enforcement certification in Washington State.",
    whenToContact: "When you believe a certified peace officer violated professional standards or engaged in misconduct.",
    whatTheyCan: "Investigate misconduct, suspend or revoke officer certification, maintain misconduct records.",
    whatTheyCannot: "Provide legal representation, award damages, or prosecute criminal cases.",
    officialStatus: "official",
    website: "https://www.cjtc.wa.gov/certification/professional-conduct",
    phone: "360-486-2380",
    notes: "You do not need to have everything figured out before contacting. They can help clarify if your concern falls under their authority.",
  },
  {
    id: "king-county-oleo",
    name: "King County Office of Law Enforcement Oversight (OLEO)",
    jurisdiction: "washington",
    systemTags: ["police"],
    whatTheyDo: "Provides independent civilian oversight of King County Sheriff's Office.",
    whenToContact: "When you have concerns about Sheriff's Office conduct in King County.",
    whatTheyCan: "Review investigations, recommend policy changes, receive and refer complaints.",
    whatTheyCannot: "Investigate city police departments (Seattle, Bellevue, etc.), provide legal advice, or discipline officers directly.",
    officialStatus: "official",
    website: "https://kingcounty.gov/en/dept/oleo",
    phone: "206-263-8763",
    notes: "Independent from the Sheriff's Office. You can share your experience even if you're not sure what happened.",
  },
  {
    id: "seattle-opa",
    name: "Seattle Office of Police Accountability (OPA)",
    jurisdiction: "washington",
    systemTags: ["police"],
    whatTheyDo: "Investigates complaints against Seattle Police Department officers.",
    whenToContact: "When you have concerns about Seattle police officer conduct.",
    whatTheyCan: "Investigate complaints, recommend discipline, track complaint patterns.",
    whatTheyCannot: "Handle complaints about other agencies, provide legal representation, or award damages.",
    officialStatus: "official",
    website: "https://www.seattle.gov/opa",
    phone: "206-684-8797",
    notes: "You can file anonymously. The process takes time, and that's normal.",
  },
  {
    id: "doj-crt-police",
    name: "DOJ Civil Rights Division – Special Litigation Section",
    jurisdiction: "federal",
    systemTags: ["police", "incarceration"],
    whatTheyDo: "Investigates patterns of police misconduct and unconstitutional conditions in jails/prisons.",
    whenToContact: "When you believe there's a pattern of civil rights violations by a law enforcement agency.",
    whatTheyCan: "Investigate systemic issues, require reform through consent decrees, enforce federal civil rights laws.",
    whatTheyCannot: "Handle individual cases, provide personal legal representation, or award individual damages.",
    officialStatus: "official",
    website: "https://www.justice.gov/crt/special-litigation-section",
    phone: "202-514-6255",
    notes: "This is for systemic issues. Your individual report helps them identify patterns.",
  },

  // ===== EMPLOYMENT =====
  {
    id: "wa-hrc-employment",
    name: "Washington State Human Rights Commission",
    jurisdiction: "washington",
    systemTags: ["employment", "housing", "disability"],
    whatTheyDo: "Enforces Washington's anti-discrimination laws in employment, housing, and public accommodations.",
    whenToContact: "When you believe you've experienced discrimination based on protected characteristics at work.",
    whatTheyCan: "Investigate complaints, mediate disputes, order remedies including reinstatement and damages.",
    whatTheyCannot: "Represent you in court, handle federal-only claims, or provide legal advice.",
    officialStatus: "official",
    website: "https://www.hum.wa.gov",
    phone: "360-753-6770",
    notes: "There are deadlines for filing. Consider reaching out early, even if you're still processing what happened.",
  },
  {
    id: "eeoc-seattle",
    name: "U.S. Equal Employment Opportunity Commission (Seattle District)",
    jurisdiction: "federal",
    systemTags: ["employment", "disability"],
    whatTheyDo: "Enforces federal workplace anti-discrimination laws including Title VII, ADA, and ADEA.",
    whenToContact: "When you believe you've experienced workplace discrimination based on race, color, religion, sex, national origin, age, disability, or genetic information.",
    whatTheyCan: "Investigate complaints, mediate disputes, file lawsuits on behalf of workers, issue right-to-sue letters.",
    whatTheyCannot: "Represent individual workers in all cases, handle state-only claims, or provide legal advice.",
    officialStatus: "official",
    website: "https://www.eeoc.gov/field-office/seattle/location",
    phone: "1-800-669-4000",
    notes: "Filing deadlines are strict (usually 180-300 days). You can call to ask questions before filing.",
  },
  {
    id: "wa-lni",
    name: "Washington State Department of Labor & Industries",
    jurisdiction: "washington",
    systemTags: ["employment"],
    whatTheyDo: "Enforces workplace safety, wage/hour laws, and workers' compensation in Washington.",
    whenToContact: "For unpaid wages, unsafe working conditions, or workers' compensation issues.",
    whatTheyCan: "Investigate wage theft, enforce safety standards, process workers' comp claims.",
    whatTheyCannot: "Handle discrimination claims, represent you in lawsuits, or provide legal advice.",
    officialStatus: "official",
    website: "https://www.lni.wa.gov",
    phone: "360-902-5800",
    notes: "Wage claims have time limits. Document hours worked and pay received when possible.",
  },

  // ===== HOUSING =====
  {
    id: "wa-hrc-housing",
    name: "Washington State Human Rights Commission – Housing",
    jurisdiction: "washington",
    systemTags: ["housing", "disability"],
    whatTheyDo: "Investigates housing discrimination complaints under Washington law.",
    whenToContact: "When you believe you were denied housing, evicted, or treated differently because of a protected characteristic.",
    whatTheyCan: "Investigate complaints, mediate disputes, order remedies.",
    whatTheyCannot: "Stop an eviction in progress, represent you in court, or provide emergency housing.",
    officialStatus: "official",
    website: "https://www.hum.wa.gov/housing",
    phone: "360-753-6770",
    notes: "Disability accommodations are covered. You can file even if you're no longer in the housing.",
  },
  {
    id: "hud-seattle",
    name: "HUD Office of Fair Housing – Seattle Regional Office",
    jurisdiction: "federal",
    systemTags: ["housing", "disability"],
    whatTheyDo: "Enforces the federal Fair Housing Act prohibiting housing discrimination.",
    whenToContact: "When you believe you experienced housing discrimination based on race, color, religion, national origin, sex, disability, or familial status.",
    whatTheyCan: "Investigate complaints, mediate disputes, refer cases for prosecution.",
    whatTheyCannot: "Provide emergency housing, represent you individually in court, or handle landlord-tenant disputes not involving discrimination.",
    officialStatus: "official",
    website: "https://www.hud.gov/states/washington/offices",
    phone: "1-800-877-0246",
    notes: "You have one year to file. They can investigate even if you've moved out.",
  },

  // ===== DISABILITY RIGHTS =====
  {
    id: "disability-rights-wa",
    name: "Disability Rights Washington",
    jurisdiction: "washington",
    systemTags: ["disability", "education", "healthcare", "incarceration"],
    whatTheyDo: "Washington's designated Protection & Advocacy system for people with disabilities.",
    whenToContact: "When facing disability-related barriers in education, healthcare, institutions, or public services.",
    whatTheyCan: "Provide information, investigate abuse/neglect in institutions, provide legal advocacy in some cases.",
    whatTheyCannot: "Take all cases, handle employment discrimination directly (refer to EEOC), or provide emergency services.",
    officialStatus: "official",
    website: "https://www.disabilityrightswa.org",
    phone: "1-800-562-2702",
    notes: "They prioritize cases involving abuse, neglect, or rights violations in institutions. Calling doesn't obligate you to anything.",
  },
  {
    id: "hhs-ocr",
    name: "HHS Office for Civil Rights",
    jurisdiction: "federal",
    systemTags: ["healthcare", "disability"],
    whatTheyDo: "Enforces civil rights in healthcare, including HIPAA and disability access.",
    whenToContact: "When you believe a healthcare provider discriminated against you or violated your privacy rights.",
    whatTheyCan: "Investigate complaints, require corrective action, enforce HIPAA privacy rules.",
    whatTheyCannot: "Award individual damages, provide medical care, or represent you in lawsuits.",
    officialStatus: "official",
    website: "https://www.hhs.gov/ocr",
    phone: "1-800-368-1019",
    notes: "HIPAA and disability rights complaints can be filed online. You have 180 days for most complaints.",
  },

  // ===== COURTS / LEGAL SYSTEM =====
  {
    id: "wa-aoc",
    name: "Washington Administrative Office of the Courts",
    jurisdiction: "washington",
    systemTags: ["courts"],
    whatTheyDo: "Provides information about court procedures and self-help resources for Washington courts.",
    whenToContact: "When you need to understand court processes, forms, or find self-help resources.",
    whatTheyCan: "Provide procedural information, court forms, and self-help resources.",
    whatTheyCannot: "Provide legal advice, represent you, or intervene in your case.",
    officialStatus: "official",
    website: "https://www.courts.wa.gov",
    phone: "360-753-3365",
    notes: "Many courts have self-help centers. Procedural information is not legal advice.",
  },
  {
    id: "doj-crt-courts",
    name: "DOJ Civil Rights Division",
    jurisdiction: "federal",
    systemTags: ["courts", "police", "incarceration"],
    whatTheyDo: "Enforces federal civil rights laws across various systems including courts and law enforcement.",
    whenToContact: "When you believe there are systemic civil rights violations in courts, law enforcement, or corrections.",
    whatTheyCan: "Investigate systemic issues, enforce federal law, require institutional reform.",
    whatTheyCannot: "Handle individual cases, appeal court decisions, or provide personal representation.",
    officialStatus: "official",
    website: "https://www.justice.gov/crt",
    phone: "202-514-4609",
    notes: "Reports help identify patterns. Your experience contributes to their understanding of systemic issues.",
  },

  // ===== JAIL / PRISON / DETENTION =====
  {
    id: "wa-doc-ombuds",
    name: "Washington State Office of the Corrections Ombuds",
    jurisdiction: "washington",
    systemTags: ["incarceration"],
    whatTheyDo: "Independent office that investigates complaints about state prison conditions.",
    whenToContact: "When you or someone you know has concerns about conditions or treatment in WA state prisons.",
    whatTheyCan: "Investigate complaints, recommend changes, report to the legislature.",
    whatTheyCannot: "Handle county jail issues, represent people in legal cases, or override DOC decisions.",
    officialStatus: "official",
    website: "https://oco.wa.gov",
    phone: "1-877-582-0590",
    notes: "Independent from the Department of Corrections. Family members can file on behalf of incarcerated people.",
  },

  // ===== EDUCATION =====
  {
    id: "ospi-civil-rights",
    name: "OSPI Office of Equity & Civil Rights",
    jurisdiction: "washington",
    systemTags: ["education", "disability"],
    whatTheyDo: "Handles civil rights complaints in K-12 public schools including discrimination and discipline issues.",
    whenToContact: "When you believe a student experienced discrimination, harassment, or unfair discipline in a Washington public school.",
    whatTheyCan: "Investigate complaints, require corrective action, provide guidance to districts.",
    whatTheyCannot: "Represent families in court, override school discipline directly, or handle private school issues.",
    officialStatus: "official",
    website: "https://www.k12.wa.us/policy-funding/equity-and-civil-rights",
    phone: "360-725-6162",
    notes: "Parents and students can file complaints. There are timelines, so consider reaching out early.",
  },
  {
    id: "ed-ocr",
    name: "U.S. Department of Education – Office for Civil Rights",
    jurisdiction: "federal",
    systemTags: ["education", "disability"],
    whatTheyDo: "Enforces civil rights laws in schools receiving federal funding, including Title IX and disability rights.",
    whenToContact: "When you believe a school discriminated based on race, sex, disability, or other protected status.",
    whatTheyCan: "Investigate complaints, require corrective action, issue guidance.",
    whatTheyCannot: "Override grades, represent families in court, or handle issues not related to discrimination.",
    officialStatus: "official",
    website: "https://www2.ed.gov/ocr",
    phone: "1-800-421-3481",
    notes: "You generally have 180 days to file. Complaints can be filed online.",
  },

  // ===== HEALTHCARE =====
  {
    id: "wa-doh",
    name: "Washington State Department of Health – Complaint Program",
    jurisdiction: "washington",
    systemTags: ["healthcare"],
    whatTheyDo: "Investigates complaints against licensed healthcare providers and facilities.",
    whenToContact: "When you have concerns about a healthcare provider's conduct, competence, or facility conditions.",
    whatTheyCan: "Investigate complaints, discipline licensed providers, inspect facilities.",
    whatTheyCannot: "Provide medical care, award damages, or represent you in malpractice claims.",
    officialStatus: "official",
    website: "https://www.doh.wa.gov/LicensesPermitsandCertificates/FileComplaintAboutProviderorFacility",
    phone: "360-236-4700",
    notes: "You can file about any licensed provider. Investigations take time, and that's normal.",
  },

  // ===== MEDICAL / EMT OVERSIGHT =====
  {
    id: "wa-doh-ems",
    name: "Washington Department of Health – EMS & Trauma",
    jurisdiction: "washington",
    systemTags: ["healthcare"],
    whatTheyDo: "Oversees emergency medical services, including EMT certification and ambulance services.",
    whenToContact: "When you have concerns about EMT or ambulance service quality or conduct.",
    whatTheyCan: "Investigate complaints about EMS providers, certify EMT personnel, inspect ambulance services.",
    whatTheyCannot: "Provide emergency services, award damages, or handle non-EMS healthcare complaints.",
    officialStatus: "official",
    website: "https://www.doh.wa.gov/licensespermitsandcertificates/facilitiesandservices/emergencymedicalservicesemstrauma",
    phone: "360-236-2828",
    notes: "EMS oversight includes both response time and quality of care issues.",
  },

  // ===== GOVERNMENT / PUBLIC RECORDS =====
  {
    id: "wa-ago-pra",
    name: "Washington Attorney General – Public Records Act Guidance",
    jurisdiction: "washington",
    systemTags: ["public-records", "government"],
    whatTheyDo: "Provides guidance on the Public Records Act and helps resolve public records disputes.",
    whenToContact: "When you've been denied access to public records or need guidance on records requests.",
    whatTheyCan: "Provide guidance, offer dispute resolution services, issue opinions.",
    whatTheyCannot: "Force agencies to release records directly, represent you in court, or provide legal advice.",
    officialStatus: "official",
    website: "https://www.atg.wa.gov/opengovernment",
    phone: "360-753-6200",
    notes: "Start with a clear written request to the agency. Keep copies of all correspondence.",
  },
  {
    id: "wa-ogr",
    name: "Washington Office of the Governor – Constituent Services",
    jurisdiction: "washington",
    systemTags: ["government"],
    whatTheyDo: "Helps constituents navigate state government agencies and escalate concerns.",
    whenToContact: "When you've tried other channels and need help navigating state agency issues.",
    whatTheyCan: "Facilitate communication, help you find the right agency, escalate concerns.",
    whatTheyCannot: "Override agency decisions, provide legal advice, or handle local government issues.",
    officialStatus: "official",
    website: "https://www.governor.wa.gov/contact/contact/contact-governors-office",
    phone: "360-902-4111",
    notes: "This is a last resort after trying the relevant agency directly.",
  },

  // ===== CPS/DCYF SPECIFIC =====
  {
    id: "dcyf-ombuds",
    name: "Washington DCYF Constituent Services",
    jurisdiction: "washington",
    systemTags: ["cps_dcyf"],
    whatTheyDo: "Handles concerns and questions about DCYF services and child welfare cases.",
    whenToContact: "When you need help navigating DCYF processes or want to raise a concern.",
    whatTheyCan: "Answer questions, connect you with case supervisors, escalate concerns within DCYF.",
    whatTheyCannot: "Override case decisions, provide legal advice, or act as your advocate.",
    officialStatus: "official",
    website: "https://www.dcyf.wa.gov/contact-us",
    phone: "1-866-363-4276",
    notes: "This is within DCYF, not independent oversight. For independent review, contact OFCO.",
  },
];

// Helper function to get filter options that match Analyzer system IDs
export const systemFilterOptions = [
  { id: "all", label: "All Resources" },
  { id: "police", label: "Police / Law Enforcement" },
  { id: "employment", label: "Employment / Workplace" },
  { id: "housing", label: "Housing" },
  { id: "disability", label: "Disability Rights" },
  { id: "courts", label: "Courts / Legal System" },
  { id: "incarceration", label: "Jail / Prison" },
  { id: "education", label: "Education" },
  { id: "healthcare", label: "Healthcare" },
  { id: "government", label: "Government Benefits" },
  { id: "public-records", label: "Public Records" },
  { id: "cps_dcyf", label: "CPS / DCYF (Family Rights)" },
] as const;
