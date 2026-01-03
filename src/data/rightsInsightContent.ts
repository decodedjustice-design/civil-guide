// Rights Insight Educational Content
// Structured for Analyzer compatibility using system IDs

export type SystemId = 
  | "police"
  | "employment" 
  | "housing"
  | "disability"
  | "courts"
  | "incarceration"
  | "education"
  | "healthcare"
  | "government";

export interface RightsInsightGuide {
  id: string;
  systemId: SystemId;
  title: string;
  readTime: string;
  
  // Quick Orientation
  orientation: {
    whatThisSystemIs: string;
    whoHoldsPower: string;
    whyItFeelsConfusing: string;
  };
  
  // Common Situations
  commonSituations: string[];
  
  // What Usually Matters
  whatMatters: string[];
  
  // What Often Doesn't Matter (as much as people think)
  whatDoesntMatter: string[];
  
  // Related guidance
  keyDeadlines?: string;
  traumaAwareNote?: string;
}

export const rightsInsightGuides: RightsInsightGuide[] = [
  // ===== POLICE / LAW ENFORCEMENT =====
  {
    id: "police-overview",
    systemId: "police",
    title: "Understanding Police Encounters",
    readTime: "8 min read",
    orientation: {
      whatThisSystemIs: "Police and sheriff's departments are government agencies with authority to enforce laws, investigate crimes, and maintain public order. They operate under constitutional limits but have significant discretion in how they apply their authority.",
      whoHoldsPower: "Officers make immediate decisions. Supervisors review conduct. Prosecutors decide charges. Courts rule on legality. Civilian oversight boards (where they exist) review complaints. Internal affairs investigates misconduct.",
      whyItFeelsConfusing: "The gap between what should happen and what actually happens can be disorienting. Rules exist but enforcement varies. You may feel pressure to respond immediately even when you have rights to pause.",
    },
    commonSituations: [
      "Traffic stops or pedestrian stops",
      "Arrests with or without warrants",
      "Searches of person, vehicle, or home",
      "Use of force during encounters",
      "Questioning or interrogation",
      "Retaliation for complaints or recordings",
    ],
    whatMatters: [
      "Writing down what happened as soon as safely possible",
      "Noting officer names, badge numbers, and vehicle numbers",
      "Identifying witnesses and their contact information",
      "Seeking medical attention for any injuries (creates documentation)",
      "Preserving any recordings, photos, or physical evidence",
      "Understanding deadlines for filing complaints",
    ],
    whatDoesntMatter: [
      "Having a perfect memory of every detail",
      "Knowing exactly which laws were violated",
      "Getting the officer to admit wrongdoing",
      "Convincing others immediately that you were wronged",
      "Resolving everything quickly",
    ],
    keyDeadlines: "Complaint deadlines vary by agency and type of claim. Federal civil rights claims typically have 2-3 years, but agency complaints may be much shorter. Check early.",
    traumaAwareNote: "Police encounters can be deeply unsettling. Your response during the encounter—whether you froze, complied, or argued—does not determine your rights. Many people need time to process before taking action.",
  },
  {
    id: "police-complaints",
    systemId: "police",
    title: "Filing Complaints About Police Conduct",
    readTime: "6 min read",
    orientation: {
      whatThisSystemIs: "Complaint systems exist to document concerns about officer conduct. These include internal affairs divisions, civilian oversight boards, and state certification bodies. Each has different authority and limitations.",
      whoHoldsPower: "Internal affairs investigates but reports to the department. Civilian boards have varying authority—some investigate independently, others only review. State certification bodies can affect an officer's ability to work anywhere in the state.",
      whyItFeelsConfusing: "Multiple complaint options exist, but none guarantee the outcome you want. The process can feel slow and opaque. You may never learn the full result of an investigation.",
    },
    commonSituations: [
      "Wanting to document what happened officially",
      "Seeking accountability for officer behavior",
      "Contributing to a pattern that may help others",
      "Unclear which agency handles your type of complaint",
    ],
    whatMatters: [
      "Filing with the appropriate agency (or multiple agencies)",
      "Being factual and specific in your complaint",
      "Meeting any deadlines that apply",
      "Keeping copies of everything you submit",
      "Understanding that complaints create a record regardless of outcome",
    ],
    whatDoesntMatter: [
      "Having evidence that would hold up in criminal court",
      "Knowing the exact policy that was violated",
      "Getting the officer fired (that's rarely the outcome)",
      "Being believed by everyone involved",
    ],
    traumaAwareNote: "Filing a complaint is not required and not always the right choice for everyone. Your wellbeing matters. Some people find it empowering; others find it retraumatizing. Either response is valid.",
  },

  // ===== EMPLOYMENT =====
  {
    id: "employment-overview",
    systemId: "employment",
    title: "Understanding Workplace Rights",
    readTime: "10 min read",
    orientation: {
      whatThisSystemIs: "Employment law covers the relationship between workers and employers. Multiple layers of protection exist—federal, state, and sometimes local. Different rules apply depending on employer size, industry, and your employment status.",
      whoHoldsPower: "Employers control hiring, firing, and daily conditions. HR represents the employer, not you. Government agencies (EEOC, state agencies) enforce laws but have limited resources. Unions, where they exist, provide collective power.",
      whyItFeelsConfusing: "Employment is 'at-will' in most states, meaning employers can fire for many reasons—but not illegal ones. The line between unfair and illegal isn't always clear. Power imbalances make it hard to assert rights while employed.",
    },
    commonSituations: [
      "Discrimination in hiring, pay, or promotions",
      "Harassment or hostile work environment",
      "Retaliation for reporting problems",
      "Denied accommodations for disability or religion",
      "Wage theft or unpaid overtime",
      "Wrongful termination",
    ],
    whatMatters: [
      "Documenting incidents with dates, witnesses, and specifics",
      "Keeping copies of evaluations, emails, and policies",
      "Understanding your employer's internal complaint process",
      "Knowing filing deadlines (often 180-300 days)",
      "Preserving evidence before you lose access",
      "Consulting with an employment attorney early",
    ],
    whatDoesntMatter: [
      "Proving intent (some claims don't require it)",
      "Being a 'perfect' employee",
      "Getting coworkers to publicly support you",
      "Resolving things through HR alone",
      "Having a written contract (most workers don't)",
    ],
    keyDeadlines: "EEOC complaints: 180-300 days from the incident. State agency deadlines vary but are often longer. Some claims have shorter windows. Check early.",
    traumaAwareNote: "Workplace problems often affect your income, health insurance, and daily life. It's okay to prioritize stability while gathering information. You don't have to decide everything right now.",
  },
  {
    id: "employment-discrimination",
    systemId: "employment",
    title: "Workplace Discrimination Basics",
    readTime: "7 min read",
    orientation: {
      whatThisSystemIs: "Discrimination law prohibits treating workers differently based on protected characteristics like race, sex, religion, national origin, age, disability, and others. Both federal and Washington state laws apply.",
      whoHoldsPower: "EEOC and Washington Human Rights Commission investigate complaints. Courts decide cases if agencies don't resolve them. Employers have resources to defend themselves.",
      whyItFeelsConfusing: "Discrimination is often subtle or systemic rather than obvious. Proving it requires showing a pattern or that protected status was a factor—not that it was the only reason.",
    },
    commonSituations: [
      "Passed over for promotion despite qualifications",
      "Paid less than colleagues doing similar work",
      "Subjected to stereotyping or biased comments",
      "Excluded from opportunities offered to others",
      "Terminated after requesting accommodations",
    ],
    whatMatters: [
      "Documenting the different treatment",
      "Identifying comparators (people treated differently)",
      "Filing with the right agency within deadlines",
      "Understanding that circumstantial evidence matters",
    ],
    whatDoesntMatter: [
      "Having a recorded admission of bias",
      "Proving they only discriminated against you",
      "Being liked by everyone at work",
    ],
    traumaAwareNote: "Experiencing discrimination can make you question your own perceptions. Your experience is real. Many people benefit from talking with an attorney or advocate to understand their options.",
  },

  // ===== HOUSING =====
  {
    id: "housing-overview",
    systemId: "housing",
    title: "Understanding Tenant Rights",
    readTime: "10 min read",
    orientation: {
      whatThisSystemIs: "Tenant rights law governs the relationship between renters and landlords. Washington has specific protections regarding eviction procedures, habitability, deposits, and discrimination. Local jurisdictions may add more protections.",
      whoHoldsPower: "Landlords control access to housing. Courts handle eviction cases. Code enforcement addresses habitability. Fair housing agencies address discrimination. Tenant unions provide collective support where they exist.",
      whyItFeelsConfusing: "Housing feels urgent—you live there. Landlords often present their preferences as law. Eviction processes have strict timelines that create pressure. The power imbalance is significant.",
    },
    commonSituations: [
      "Eviction notices and unlawful detainer actions",
      "Security deposit disputes",
      "Needed repairs and habitability issues",
      "Rent increases and lease changes",
      "Discrimination based on protected status",
      "Retaliation for complaints or organizing",
    ],
    whatMatters: [
      "Reading and understanding your lease",
      "Documenting conditions with dated photos/videos",
      "Communicating in writing when possible",
      "Responding to legal notices within required timeframes",
      "Understanding just cause eviction protections if they apply",
      "Seeking help early when facing eviction",
    ],
    whatDoesntMatter: [
      "Whether the landlord 'seems nice'",
      "Verbal promises not in the lease",
      "Having a perfect payment history (though it helps)",
      "What the landlord says you owe without documentation",
    ],
    keyDeadlines: "Eviction notices have strict response deadlines—often just days. Fair housing complaints: 1 year (HUD) or varies by state. Deposit claims: varies by situation.",
    traumaAwareNote: "Housing insecurity is deeply stressful. If you're facing eviction, organizations like Northwest Justice Project and tenant unions can help. You don't have to figure this out alone.",
  },

  // ===== DISABILITY RIGHTS =====
  {
    id: "disability-overview",
    systemId: "disability",
    title: "Understanding Disability Rights",
    readTime: "9 min read",
    orientation: {
      whatThisSystemIs: "Disability rights law requires reasonable accommodations and prohibits discrimination in employment, housing, education, healthcare, and public services. The ADA, Section 504, Fair Housing Act, and state laws all apply in different contexts.",
      whoHoldsPower: "Employers, landlords, schools, and service providers must provide reasonable accommodations unless it causes undue hardship. Government agencies enforce compliance. Disability Rights Washington advocates for systemic change.",
      whyItFeelsConfusing: "The 'interactive process' for accommodations can feel one-sided. What's 'reasonable' is often contested. Medical documentation requirements can feel invasive. Denials often lack clear explanation.",
    },
    commonSituations: [
      "Requesting workplace accommodations",
      "Requesting housing modifications or policy exceptions",
      "Accessing education with IEP or 504 plans",
      "Healthcare access and medical decision-making",
      "Public accommodation access issues",
      "Benefits and services denials",
    ],
    whatMatters: [
      "Requesting accommodations in writing",
      "Having documentation of your disability (what you're comfortable sharing)",
      "Being specific about what you need and why",
      "Following up and documenting the response",
      "Understanding that you don't have to disclose your diagnosis—only your limitations",
      "Knowing where to file complaints and deadlines",
    ],
    whatDoesntMatter: [
      "Having a 'visible' disability",
      "Disclosing your full medical history",
      "Accepting the first 'no'",
      "Being grateful for accommodations (they're legal requirements)",
    ],
    traumaAwareNote: "Advocating for accommodations while managing a disability is exhausting. It's okay to bring support people to meetings. It's okay to pace yourself. Your worth is not defined by your productivity.",
  },

  // ===== COURTS / LEGAL SYSTEM =====
  {
    id: "courts-overview",
    systemId: "courts",
    title: "Navigating the Court System",
    readTime: "12 min read",
    orientation: {
      whatThisSystemIs: "Courts are where legal disputes are formally decided. Different courts handle different matters: criminal, civil, family, small claims, traffic, etc. Each has its own procedures, forms, and customs.",
      whoHoldsPower: "Judges make rulings. Attorneys know the procedures. Court clerks manage paperwork. Prosecutors represent the state in criminal cases. In civil cases, parties represent their own interests (with or without lawyers).",
      whyItFeelsConfusing: "Courts have specialized language and unwritten rules. Pro se (self-represented) parties often feel disadvantaged. Procedures can seem arbitrary. The formality can feel intimidating.",
    },
    commonSituations: [
      "Responding to a lawsuit or legal notice",
      "Filing a case to seek a remedy",
      "Understanding court deadlines and procedures",
      "Representing yourself without an attorney",
      "Dealing with the other party's attorney",
      "Understanding court orders and judgments",
    ],
    whatMatters: [
      "Meeting all deadlines (they're usually strict)",
      "Filing proper responses to any legal documents you receive",
      "Understanding what court your case is in",
      "Keeping copies of everything",
      "Showing up when required",
      "Being prepared and organized",
    ],
    whatDoesntMatter: [
      "Being 'right' without following procedures",
      "Explaining everything verbally without written filings",
      "Assuming the judge will figure things out",
      "What happened in TV courtrooms",
    ],
    keyDeadlines: "Court deadlines are often absolute. Missing a deadline can result in default judgment against you. If you receive legal papers, read them immediately for deadlines.",
    traumaAwareNote: "The legal system can feel overwhelming, especially when you're already stressed. Court facilitators and self-help centers can provide procedural guidance. You can ask for continuances if you need more time.",
  },

  // ===== INCARCERATION =====
  {
    id: "incarceration-overview",
    systemId: "incarceration",
    title: "Understanding Rights During Incarceration",
    readTime: "8 min read",
    orientation: {
      whatThisSystemIs: "People in jails and prisons retain constitutional rights, though they're limited by legitimate security needs. Conditions of confinement, medical care, due process, and grievance procedures are all subject to legal standards.",
      whoHoldsPower: "Facility administrators control daily life. Grievance systems exist but are internal. State ombudsman offices provide independent oversight. Courts can order changes. Family and advocates can draw attention to problems.",
      whyItFeelsConfusing: "Incarcerated people are isolated from outside resources. Retaliation fears are real. Grievance systems can feel like complaining to the people causing the problem. Access to legal help is limited.",
    },
    commonSituations: [
      "Medical care access and quality",
      "Conditions of confinement",
      "Grievance procedure denials",
      "Communication with family and attorneys",
      "Discipline and due process",
      "Reentry planning and barriers",
    ],
    whatMatters: [
      "Exhausting grievance procedures (often required before court)",
      "Documenting everything in writing when possible",
      "Contacting family or advocates to document from outside",
      "Filing grievances even if they seem futile (creates record)",
      "Knowing about independent oversight offices",
    ],
    whatDoesntMatter: [
      "Whether you were convicted of a serious offense",
      "Whether staff believes your complaints",
      "Being a 'model prisoner'",
    ],
    traumaAwareNote: "Incarceration is inherently traumatic. If you're supporting someone inside, your wellbeing matters too. The Office of the Corrections Ombuds can receive complaints from family members.",
  },

  // ===== EDUCATION =====
  {
    id: "education-overview",
    systemId: "education",
    title: "Understanding Student Rights",
    readTime: "9 min read",
    orientation: {
      whatThisSystemIs: "Students have rights in schools, though they're more limited than for adults. Civil rights laws prohibit discrimination. Due process applies to discipline. Special education law requires appropriate services for students with disabilities.",
      whoHoldsPower: "Teachers and administrators make daily decisions. Districts set policies. State agencies provide oversight. Federal agencies enforce civil rights laws. Parents are key advocates for minor children.",
      whyItFeelsConfusing: "Schools have significant authority over students. Discipline can happen quickly. Special education law is technical. Students and families often feel outmatched by bureaucracy.",
    },
    commonSituations: [
      "Discipline: suspension, expulsion, or alternative placement",
      "Discrimination based on race, sex, disability, or other status",
      "Special education: IEP development and implementation",
      "504 plan accommodations",
      "Harassment or bullying",
      "Records access and privacy",
    ],
    whatMatters: [
      "Understanding the school's formal policies",
      "Requesting meetings in writing",
      "Documenting communications",
      "Knowing appeal and complaint procedures",
      "Bringing support to meetings",
      "Understanding timeline rights (especially in special education)",
    ],
    whatDoesntMatter: [
      "Whether school staff 'mean well'",
      "Informal verbal assurances",
      "Being labeled a 'difficult parent'",
    ],
    keyDeadlines: "Special education timelines are specific: 25 days for evaluation decisions, 30 days for IEP development after eligibility, etc. Discipline hearings often have short windows.",
    traumaAwareNote: "Advocating for your child while managing your own stress is hard. Bring a support person to meetings. Take notes or record if allowed. You can request to reschedule if you need time to prepare.",
  },

  // ===== HEALTHCARE =====
  {
    id: "healthcare-overview",
    systemId: "healthcare",
    title: "Understanding Patient Rights",
    readTime: "8 min read",
    orientation: {
      whatThisSystemIs: "Patients have rights regarding medical decisions, privacy, access to records, and non-discrimination. HIPAA protects privacy. Civil rights laws prohibit discrimination. State laws govern informed consent and medical complaints.",
      whoHoldsPower: "Providers make medical decisions but must obtain informed consent. Hospitals have policies and patient advocates. State licensing boards oversee providers. HHS enforces federal civil rights law.",
      whyItFeelsConfusing: "Medical situations are stressful. Power imbalances are significant. Insurance adds complexity. Rushed appointments make it hard to ask questions. Complaints can feel risky when you need ongoing care.",
    },
    commonSituations: [
      "Accessing your medical records",
      "Informed consent and refusal of treatment",
      "Discrimination in care",
      "Privacy violations",
      "Billing disputes and insurance issues",
      "Provider misconduct",
    ],
    whatMatters: [
      "Requesting records in writing",
      "Understanding your right to refuse treatment",
      "Documenting concerns as they happen",
      "Knowing how to file complaints with the right body",
      "Understanding your insurance appeals rights",
    ],
    whatDoesntMatter: [
      "Whether you understand medical terminology",
      "Whether you agreed to something before",
      "Being seen as a 'good patient'",
    ],
    keyDeadlines: "HIPAA complaints: 180 days. State medical board complaints: varies. Insurance appeals: vary by plan but often 30-60 days.",
    traumaAwareNote: "Healthcare settings can trigger trauma, especially for people who have experienced medical mistreatment. You can bring a support person. You can ask for time to think. You can say no.",
  },

  // ===== GOVERNMENT =====
  {
    id: "government-overview",
    systemId: "government",
    title: "Navigating Government Agencies",
    readTime: "8 min read",
    orientation: {
      whatThisSystemIs: "Government agencies administer benefits, licenses, and regulations. Each has its own rules, application processes, and appeal procedures. Administrative law governs how agencies must behave.",
      whoHoldsPower: "Caseworkers make initial decisions. Supervisors can review. Formal appeals go to administrative law judges. Courts review agency actions for legal errors. Ombudsman offices can help navigate.",
      whyItFeelsConfusing: "Bureaucracy is designed for efficiency, not individual needs. Forms and deadlines proliferate. Denial letters are often unclear. Getting a human to explain things can be hard.",
    },
    commonSituations: [
      "Applying for benefits (unemployment, disability, food assistance)",
      "Appealing a denial",
      "License and permit issues",
      "Public records requests",
      "Agency delays and non-response",
    ],
    whatMatters: [
      "Meeting all deadlines (appeals are often time-limited)",
      "Keeping copies of everything you submit",
      "Getting denials and decisions in writing",
      "Understanding the specific reason for denial",
      "Following the appeal process exactly",
    ],
    whatDoesntMatter: [
      "Whether your caseworker agrees with the rules",
      "Verbal explanations that aren't documented",
      "How sympathetic your situation is without meeting legal criteria",
    ],
    keyDeadlines: "Appeal deadlines are strict—often 30-90 days. Missing the deadline usually waives your right to appeal.",
    traumaAwareNote: "Dealing with bureaucracy while stressed is exhausting. It's okay to bring someone to appointments. It's okay to ask for written explanations of verbal statements. Your frustration is valid.",
  },
];

// System category labels for UI
export const systemCategories: { id: SystemId; label: string; description: string }[] = [
  { id: "police", label: "Police & Law Enforcement", description: "Understanding encounters, complaints, and accountability." },
  { id: "employment", label: "Employment & Workplace", description: "Discrimination, wages, and workplace protections." },
  { id: "housing", label: "Housing & Tenant Rights", description: "Eviction, habitability, and fair housing." },
  { id: "disability", label: "Disability Rights", description: "Accommodations, access, and advocacy." },
  { id: "courts", label: "Courts & Legal System", description: "Procedures, self-help, and navigating the system." },
  { id: "incarceration", label: "Jail & Prison", description: "Rights inside, grievances, and oversight." },
  { id: "education", label: "Education & Schools", description: "Discipline, special education, and civil rights." },
  { id: "healthcare", label: "Healthcare", description: "Patient rights, privacy, and complaints." },
  { id: "government", label: "Government Agencies", description: "Benefits, appeals, and bureaucracy." },
];
