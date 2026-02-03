// Washington State Legal Aid Resources
// Legal Aid, Civil Rights Orgs, Advocacy Groups

// Cultural/identity tags for targeted resources
export type CulturalTag = 
  | 'hispanic_latino'
  | 'black_african_american'
  | 'asian_pacific_islander'
  | 'native_american'
  | 'lgbtq'
  | 'immigrant'
  | 'refugee'
  | 'veteran'
  | 'disability'
  | 'women'
  | 'youth'
  | 'senior';

// Language services offered
export type LanguageService = 'spanish' | 'chinese' | 'vietnamese' | 'korean' | 'russian' | 'somali' | 'other';

export interface LegalResource {
  id: string;
  name: string;
  category: "legal-aid" | "civil-rights" | "advocacy";
  serviceType: string;
  description: string;
  eligibilityNotes?: string;
  location: string;
  website: string;
  phone: string;
  lastVerified: string; // ISO date
  // New fields for enhanced matching
  culturalTags?: CulturalTag[];
  languageServices?: LanguageService[];
  counties?: string[]; // Specific counties served, empty = statewide
}

export const legalResources: LegalResource[] = [
  // Legal Aid
  {
    id: "nwjp",
    name: "Northwest Justice Project",
    category: "legal-aid",
    serviceType: "Free Legal Aid",
    description: "Free civil legal aid for low-income people in Washington, covering housing, family, benefits, and civil rights.",
    eligibilityNotes: "Income-based eligibility. Call CLEAR hotline for screening.",
    location: "Washington State",
    website: "https://nwjustice.org/",
    phone: "1-888-201-1014",
    lastVerified: "2025-12-15",
    languageServices: ['spanish'],
  },
  {
    id: "wa-lawhelp",
    name: "Washington LawHelp",
    category: "legal-aid",
    serviceType: "Self-Help Resources",
    description: "Self-help legal information and resources. Find forms, guides, and legal aid organizations.",
    eligibilityNotes: "Free for all. Online resources available 24/7.",
    location: "Washington State",
    website: "https://www.washingtonlawhelp.org/",
    phone: "N/A",
    lastVerified: "2025-12-20",
    languageServices: ['spanish'],
  },
  {
    id: "kcba",
    name: "King County Bar Association Lawyer Referral",
    category: "legal-aid",
    serviceType: "Low-Cost Consultations",
    description: "Low-cost attorney consultations ($45 for 30 minutes) with attorneys in various practice areas.",
    eligibilityNotes: "Available to all. Sliding scale options for follow-up.",
    location: "King County, WA",
    website: "https://www.kcba.org/For-the-Public/Lawyer-Referral-Service",
    phone: "(206) 267-7100",
    lastVerified: "2025-11-01",
    counties: ['King'],
  },
  {
    id: "wsba",
    name: "Washington State Bar Lawyer Referral",
    category: "legal-aid",
    serviceType: "Attorney Referrals",
    description: "Statewide referral service to connect with attorneys offering reduced-fee initial consultations.",
    eligibilityNotes: "Available to all Washington residents.",
    location: "Washington State",
    website: "https://www.wsba.org/for-the-public/find-legal-help",
    phone: "(206) 443-9722",
    lastVerified: "2025-11-15",
  },
  {
    id: "clear",
    name: "CLEAR Hotline",
    category: "legal-aid",
    serviceType: "Legal Hotline",
    description: "Free legal advice hotline for low-income Washington residents. Helps with housing, family, benefits, and consumer issues.",
    eligibilityNotes: "Income-based. Call weekdays 9:15am-12:15pm.",
    location: "Washington State",
    website: "https://nwjustice.org/get-legal-help",
    phone: "1-888-201-1014",
    lastVerified: "2025-12-01",
    languageServices: ['spanish'],
  },
  
  // Civil Rights Organizations
  {
    id: "aclu-wa",
    name: "ACLU of Washington",
    category: "civil-rights",
    serviceType: "Legal Advocacy",
    description: "Legal advocacy and representation for civil liberties cases including police misconduct, discrimination, and constitutional rights.",
    eligibilityNotes: "Case selection based on impact potential. Not all cases accepted.",
    location: "Washington State",
    website: "https://www.aclu-wa.org/",
    phone: "(206) 624-2184",
    lastVerified: "2025-12-10",
  },
  {
    id: "columbia-legal",
    name: "Columbia Legal Services",
    category: "civil-rights",
    serviceType: "Impact Litigation",
    description: "Impact litigation and advocacy for systemic change in civil rights, housing, and economic justice.",
    eligibilityNotes: "Focus on systemic issues. Individual case support limited.",
    location: "Washington State",
    website: "https://columbialegal.org/",
    phone: "(206) 464-5911",
    lastVerified: "2025-11-20",
    culturalTags: ['immigrant', 'refugee'],
    languageServices: ['spanish'],
  },
  {
    id: "drw",
    name: "Disability Rights Washington",
    category: "civil-rights",
    serviceType: "Disability Advocacy",
    description: "Legal advocacy for people with disabilities, including discrimination, access, education, and institutional issues.",
    eligibilityNotes: "Must have a disability. Priority for institutionalized individuals.",
    location: "Washington State",
    website: "https://www.disabilityrightswa.org/",
    phone: "1-800-562-2702",
    lastVerified: "2025-12-05"
  },
  {
    id: "fhc",
    name: "Fair Housing Center of Washington",
    category: "civil-rights",
    serviceType: "Housing Discrimination",
    description: "Investigates housing discrimination complaints and provides legal assistance for fair housing violations.",
    eligibilityNotes: "Free intake for housing discrimination claims.",
    location: "Washington State",
    website: "https://fhcwashington.org/",
    phone: "(253) 274-9523",
    lastVerified: "2025-11-10"
  },
  
  // Advocacy Groups
  {
    id: "teamchild",
    name: "TeamChild",
    category: "advocacy",
    serviceType: "Youth Advocacy",
    description: "Legal advocacy for youth in foster care, juvenile justice, and education systems. Helps with dependency cases and youth rights.",
    eligibilityNotes: "For youth under 21 in WA state systems.",
    location: "Washington State",
    website: "https://teamchild.org/",
    phone: "(206) 322-2444",
    lastVerified: "2025-12-12"
  },
  {
    id: "ofco",
    name: "Office of the Family and Children's Ombuds (OFCO)",
    category: "advocacy",
    serviceType: "DCYF/CPS Oversight",
    description: "Independent state agency that investigates complaints about DCYF/CPS. Can help families understand their rights and the system.",
    eligibilityNotes: "For families involved with DCYF. Free service.",
    location: "Washington State",
    website: "https://ofco.wa.gov/",
    phone: "1-800-571-7321",
    lastVerified: "2025-12-08"
  },
  {
    id: "ccyj",
    name: "Center for Children & Youth Justice",
    category: "advocacy",
    serviceType: "System Reform",
    description: "Advocacy and system reform for youth in foster care and juvenile justice. Resources for families navigating the system.",
    eligibilityNotes: "Resources available to all. Advocacy for system-involved youth.",
    location: "Washington State",
    website: "https://ccyj.org/",
    phone: "(206) 696-7503",
    lastVerified: "2025-11-25"
  },
  {
    id: "wshrc",
    name: "Washington State Human Rights Commission",
    category: "advocacy",
    serviceType: "Discrimination Complaints",
    description: "Investigates employment, housing, and public accommodation discrimination complaints under Washington law.",
    eligibilityNotes: "Free complaint process. Time limits apply (6 months for most claims).",
    location: "Washington State",
    website: "https://www.hum.wa.gov/",
    phone: "1-800-233-3247",
    lastVerified: "2025-12-01"
  },
  {
    id: "treehouse",
    name: "Treehouse",
    category: "advocacy",
    serviceType: "Foster Youth Support",
    description: "Support services for youth in foster care including education advocacy, housing, and graduation support.",
    eligibilityNotes: "For current and former foster youth in WA.",
    location: "Washington State",
    website: "https://treehouseforkids.org/",
    phone: "(206) 767-7000",
    lastVerified: "2025-11-30"
  }
];

export const RESOURCE_CATEGORIES = [
  { id: "all", label: "All Resources" },
  { id: "legal-aid", label: "Legal Aid" },
  { id: "civil-rights", label: "Civil Rights Orgs" },
  { id: "advocacy", label: "Advocacy Groups" }
];
