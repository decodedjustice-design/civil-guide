// Washington State legal-help directory for Decoded Justice.
// Records below were refreshed from current public sources on September 22, 2026.
// This directory is informational, not a referral, endorsement, rating, or quality ranking.
// License status should be rechecked in the WSBA Legal Directory before engagement.

export interface Attorney {
  id: string;
  name: string;
  firm: string;
  city: string;
  practiceAreas: string[];
  counties: string[];
  feeTypes: string[];
  contactMethod: "website" | "email" | "phone";
  contactValue: string;
  description?: string;
  detailedBio?: string;
  barAdmissions?: string[];
  languages?: string[];
  feeStructureDetails?: string;
  email?: string;
  phone?: string;
}

export const WA_COUNTIES = [
  "Adams", "Asotin", "Benton", "Chelan", "Clallam", "Clark", "Columbia",
  "Cowlitz", "Douglas", "Ferry", "Franklin", "Garfield", "Grant", "Grays Harbor",
  "Island", "Jefferson", "King", "Kitsap", "Kittitas", "Klickitat", "Lewis",
  "Lincoln", "Mason", "Okanogan", "Pacific", "Pend Oreille", "Pierce", "San Juan",
  "Skagit", "Skamania", "Snohomish", "Spokane", "Stevens", "Thurston", "Wahkiakum",
  "Walla Walla", "Whatcom", "Whitman", "Yakima"
];

export const PRACTICE_AREAS = [
  "Civil Rights",
  "Police Misconduct",
  "Housing Discrimination",
  "Family Defense",
  "Employment Discrimination",
  "Disability Rights"
];

export const FEE_TYPES = [
  "Free Consultation",
  "Contingency",
  "Hourly",
  "Sliding Scale",
  "Pro Bono / Legal Aid",
  "Verify Fees"
];

export const sampleAttorneys: Attorney[] = [
  {
    id: "wa-james-bible",
    name: "James Bible",
    firm: "James Bible Law Group",
    city: "Bellevue",
    practiceAreas: ["Civil Rights", "Police Misconduct"],
    counties: ["King", "Pierce", "Snohomish"],
    feeTypes: ["Verify Fees"],
    contactMethod: "website",
    contactValue: "https://biblelawgroup.com",
    phone: "(425) 519-3675",
    email: "james@biblelawgroup.com",
    description: "Bellevue attorney whose WSBA profile lists litigation, personal injury and tort practice. Public case materials also identify the firm as counsel in civil-rights litigation.",
    detailedBio: "WSBA's public legal profile lists James Bible as an active Washington lawyer eligible to practice, admitted October 20, 2003. His profile lists litigation, personal injury and torts; public federal-court materials also identify him in civil-rights litigation.",
    barAdmissions: ["Washington — WSBA #33985"],
    feeStructureDetails: "Fee arrangement was not confirmed from the current public sources reviewed; verify directly."
  },
  {
    id: "wa-victoria-vreeland",
    name: "Victoria L. Vreeland",
    firm: "Vreeland Law",
    city: "Bellevue",
    practiceAreas: ["Civil Rights", "Employment Discrimination", "Disability Rights"],
    counties: ["King", "Pierce", "Snohomish"],
    feeTypes: ["Verify Fees"],
    contactMethod: "website",
    contactValue: "https://vreeland-law.com",
    phone: "(425) 626-2401",
    email: "info@vreeland-law.com",
    description: "Bellevue-based attorney whose firm identifies employment, discrimination, civil-rights-related and appellate work.",
    detailedBio: "Vreeland Law identifies Victoria L. Vreeland as its attorney and lists employment, discrimination, sexual coercion and harassment, childhood sexual abuse, personal injury, commercial torts and appellate practice. The WSBA public profile reviewed lists her as an active Washington lawyer eligible to practice.",
    barAdmissions: ["Washington — WSBA #8046"],
    feeStructureDetails: "Consultation is offered through the firm's website; fee terms should be confirmed directly."
  },
  {
    id: "wa-jordan-taren",
    name: "Jordan Taren",
    firm: "Taren Law Group PLLC",
    city: "Seattle",
    practiceAreas: ["Civil Rights", "Police Misconduct", "Housing Discrimination", "Employment Discrimination", "Disability Rights"],
    counties: ["King", "Pierce", "Snohomish"],
    feeTypes: ["Verify Fees"],
    contactMethod: "website",
    contactValue: "https://tarenlaw.com",
    phone: "(206) 622-1604",
    email: "admin@tarenlaw.com",
    description: "Seattle civil-rights firm handling fair-housing, disability, employment and government/civil-rights matters, including police and state-actor misconduct.",
    detailedBio: "Taren Law Group's current practice pages identify fair housing, reasonable accommodations, Housing Choice Voucher/Section 8 discrimination, disability rights, due process, equal protection and police/state-actor misconduct among its work.",
    feeStructureDetails: "The firm invites prospective clients to contact it for a consultation; specific fee terms were not confirmed."
  },
  {
    id: "wa-edwin-budge",
    name: "Edwin Budge",
    firm: "Budge & Heipt PLLC",
    city: "Seattle",
    practiceAreas: ["Civil Rights", "Police Misconduct"],
    counties: ["King", "Pierce", "Snohomish"],
    feeTypes: ["Free Consultation", "Verify Fees"],
    contactMethod: "website",
    contactValue: "https://budgeandheipt.com",
    phone: "(206) 624-3060",
    description: "Seattle civil-rights firm focused on serious police, jail and prison cases, including police misconduct and constitutional claims.",
    detailedBio: "The firm's current attorney page identifies Edwin Budge as a civil-rights litigator. The firm states that it handles select police-misconduct cases and civil-rights matters involving serious injury or death.",
    barAdmissions: ["Washington"],
    feeStructureDetails: "The firm currently states that initial case discussions are free and without obligation; representation terms are governed by a written agreement."
  },
  {
    id: "wa-erik-heipt",
    name: "Erik J. Heipt",
    firm: "Budge & Heipt PLLC",
    city: "Seattle",
    practiceAreas: ["Civil Rights", "Police Misconduct"],
    counties: ["King", "Pierce", "Snohomish"],
    feeTypes: ["Free Consultation", "Verify Fees"],
    contactMethod: "website",
    contactValue: "https://budgeandheipt.com",
    phone: "(206) 624-3060",
    description: "Seattle civil-rights litigator handling serious constitutional, police, jail and prison matters.",
    detailedBio: "Budge & Heipt identifies Erik J. Heipt as an experienced courtroom litigator and states that its attorneys represent victims and families in federal civil-rights matters.",
    barAdmissions: ["Washington", "California"],
    feeStructureDetails: "The firm states that prospective clients can discuss qualifying cases at no cost or obligation; confirm any representation fee arrangement directly."
  },
  {
    id: "wa-raymond-delos-reyes",
    name: "Raymond Delos Reyes",
    firm: "Delos Reyes Law, LLC",
    city: "Seattle",
    practiceAreas: ["Family Defense"],
    counties: ["King"],
    feeTypes: ["Verify Fees"],
    contactMethod: "website",
    contactValue: "https://www.rdelosreyeslaw.com",
    phone: "(425) 961-5950",
    email: "raymond@rdelosreyeslaw.com",
    description: "Seattle attorney with documented King County dependency/CPS parent-defense experience.",
    detailedBio: "Washington Office of Civil Legal Aid and the attorney's current website identify Raymond Delos Reyes as providing public-defense services to parents subject to dependency/CPS petitions in King County. His current practice page also lists CPS investigations.",
    barAdmissions: ["Washington"],
    feeStructureDetails: "Private consultation and representation terms should be confirmed directly. Public-defense eligibility is a separate appointment process."
  },
  {
    id: "wa-king-county-family-defense",
    name: "Family Defense — King County Department of Public Defense",
    firm: "King County Department of Public Defense",
    city: "Seattle",
    practiceAreas: ["Family Defense"],
    counties: ["King"],
    feeTypes: ["Pro Bono / Legal Aid"],
    contactMethod: "website",
    contactValue: "https://kingcounty.gov/en/dept/dpd/about-public-defense/practice-areas/family-defense",
    phone: "(206) 477-9727",
    description: "Public-defense program representing eligible parents and children in King County dependency matters.",
    detailedBio: "King County states that its Department of Public Defense represents parents who could lose their children in dependency actions and provides family-defense representation through its divisions.",
    feeStructureDetails: "Representation is eligibility-based public defense, not a private-fee attorney referral. Contact DPD to determine eligibility and assignment."
  },
  {
    id: "wa-mineiro-law",
    name: "Nicholle Mineiro",
    firm: "Mineiro Law PLLC",
    city: "Bellevue",
    practiceAreas: ["Disability Rights"],
    counties: ["King", "Snohomish", "Pierce"],
    feeTypes: ["Verify Fees"],
    contactMethod: "website",
    contactValue: "https://www.mlp-law.net",
    phone: "(425) 300-2589",
    email: "nicholle@mlp-law.net",
    description: "Bellevue attorney focused on special-education law and disability-related advocacy for children and youth.",
    detailedBio: "Mineiro Law identifies Nicholle Mineiro as a special-education attorney. Her current biography describes education-law advocacy involving evaluations, IEPs, due process and state/federal complaints, and notes pro bono service.",
    feeStructureDetails: "Current fee terms were not confirmed from the sources reviewed; verify directly."
  },
  {
    id: "wa-mhb",
    name: "MacDonald Hoague & Bayless",
    firm: "MacDonald Hoague & Bayless",
    city: "Seattle",
    practiceAreas: ["Civil Rights", "Police Misconduct", "Housing Discrimination", "Employment Discrimination", "Disability Rights"],
    counties: ["King", "Pierce", "Snohomish"],
    feeTypes: ["Verify Fees"],
    contactMethod: "website",
    contactValue: "https://www.mhb.com",
    phone: "(206) 622-1604",
    description: "Seattle civil-rights firm whose current practice pages identify employment discrimination, housing, public accommodations, police misconduct, public records and civil rights.",
    detailedBio: "The firm's current website lists civil rights, police misconduct, fair housing, public records/FOIA, employment discrimination and workplace accommodations among its practice areas.",
    feeStructureDetails: "Fee arrangement depends on matter and was not confirmed from the sources reviewed."
  },
  {
    id: "wa-elap",
    name: "Eastside Legal Assistance Program",
    firm: "Eastside Legal Assistance Program (ELAP)",
    city: "Bellevue",
    practiceAreas: ["Housing Discrimination", "Family Defense", "Disability Rights", "Employment Discrimination"],
    counties: ["King"],
    feeTypes: ["Pro Bono / Legal Aid"],
    contactMethod: "website",
    contactValue: "https://www.elap.org",
    phone: "(425) 747-7274",
    description: "King County civil legal-aid organization serving East, Northeast and Southeast King County with free legal clinics and advice in housing, family, benefits and other civil matters.",
    detailedBio: "Washington's public legal-resource listings describe ELAP as providing free legal assistance and clinics for eligible King County residents, including housing and family-law consultations.",
    feeStructureDetails: "Eligibility and scope vary by clinic. Public listings state that qualifying services are free and that some clinics provide advice rather than full representation."
  },
  {
    id: "wa-njp",
    name: "Northwest Justice Project",
    firm: "Northwest Justice Project",
    city: "Seattle",
    practiceAreas: ["Housing Discrimination", "Family Defense", "Disability Rights", "Employment Discrimination"],
    counties: WA_COUNTIES,
    feeTypes: ["Pro Bono / Legal Aid"],
    contactMethod: "website",
    contactValue: "https://nwjustice.org",
    phone: "1-888-201-1012",
    description: "Statewide civil legal-aid provider addressing housing, family safety, income security, health care, education and other fundamental needs for eligible low-income Washington residents.",
    detailedBio: "NJP's current public materials describe statewide civil legal assistance and direct people to CLEAR and other intake pathways. King County residents can also use the 211 legal-information/referral pathway.",
    feeStructureDetails: "Eligibility-based legal aid. Availability and scope depend on the legal problem, income, location and program capacity."
  }
];
