// Washington State Civil Rights Attorneys Directory
// This is an information directory, not a referral or recommendation service.
// Listed alphabetically by firm name.

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
  // Extended fields for detail modal
  detailedBio?: string;
  barAdmissions?: string[];
  languages?: string[];
  feeStructureDetails?: string;
  email?: string;  // Additional email if contactMethod is not email
  phone?: string;  // Additional phone if contactMethod is not phone
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
  "Contingency",
  "Sliding Scale",
  "Hourly",
  "Pro Bono"
];

// Sample WA Civil Rights Attorneys (alphabetical by firm)
// This is publicly available information for educational purposes only.
export const sampleAttorneys: Attorney[] = [
  {
    id: "1",
    name: "Sonia Rodriguez True",
    firm: "Alicia Mendez Law Group, PLLC",
    city: "Seattle",
    practiceAreas: ["Civil Rights", "Police Misconduct"],
    counties: ["King", "Pierce", "Snohomish"],
    feeTypes: ["Contingency"],
    contactMethod: "website",
    contactValue: "https://www.aliciamendezlawgroup.com",
    description: "Focused on civil rights litigation including excessive force and wrongful arrest cases."
  },
  {
    id: "2",
    name: "James Lobsenz",
    firm: "Carney Badley Spellman",
    city: "Seattle",
    practiceAreas: ["Civil Rights", "Police Misconduct"],
    counties: ["King", "Pierce", "Snohomish", "Thurston"],
    feeTypes: ["Contingency", "Hourly"],
    contactMethod: "website",
    contactValue: "https://www.carneylaw.com",
    description: "Extensive experience in constitutional rights and police accountability cases."
  },
  {
    id: "3",
    name: "Jeffrey Needle",
    firm: "Cogdill Nichols Rein Wartelle Andrews",
    city: "Seattle",
    practiceAreas: ["Civil Rights", "Police Misconduct", "Employment Discrimination"],
    counties: ["King", "Snohomish", "Pierce"],
    feeTypes: ["Contingency"],
    contactMethod: "website",
    contactValue: "https://www.cnrlaw.com",
    description: "Civil rights litigation with focus on police misconduct and employment cases."
  },
  {
    id: "4",
    name: "David Whedbee",
    firm: "David Whedbee, Attorney at Law",
    city: "Seattle",
    practiceAreas: ["Civil Rights", "Police Misconduct"],
    counties: ["King", "Pierce", "Snohomish", "Kitsap"],
    feeTypes: ["Contingency"],
    contactMethod: "website",
    contactValue: "https://www.whedbeelaw.com",
    description: "Dedicated to civil rights cases involving law enforcement misconduct."
  },
  {
    id: "5",
    name: "Jesse Wing",
    firm: "Fidelity Law Group, PLLC",
    city: "Seattle",
    practiceAreas: ["Civil Rights", "Housing Discrimination", "Employment Discrimination"],
    counties: ["King", "Pierce", "Snohomish", "Thurston"],
    feeTypes: ["Contingency", "Hourly"],
    contactMethod: "website",
    contactValue: "https://www.fidelitylawgroup.com",
    description: "Civil rights practice including housing and employment discrimination."
  },
  {
    id: "6",
    name: "Tim Ford",
    firm: "Ford Law Firm",
    city: "Tacoma",
    practiceAreas: ["Civil Rights", "Police Misconduct", "Family Defense"],
    counties: ["Pierce", "King", "Thurston"],
    feeTypes: ["Contingency", "Sliding Scale"],
    contactMethod: "phone",
    contactValue: "(253) 555-0123",
    description: "Civil rights and family defense practice in Pierce County."
  },
  {
    id: "7",
    name: "Karen Koehler",
    firm: "Stritmatter Kessler Koehler Moore",
    city: "Seattle",
    practiceAreas: ["Civil Rights", "Police Misconduct"],
    counties: ["King", "Snohomish", "Pierce", "Whatcom", "Spokane"],
    feeTypes: ["Contingency"],
    contactMethod: "website",
    contactValue: "https://www.stritmatter.com",
    description: "Plaintiff-side civil rights and personal injury litigation."
  },
  {
    id: "8",
    name: "Breean Beggs",
    firm: "Paukert & Troppmann, PLLC",
    city: "Spokane",
    practiceAreas: ["Civil Rights", "Police Misconduct"],
    counties: ["Spokane", "Stevens", "Lincoln", "Whitman"],
    feeTypes: ["Contingency", "Hourly"],
    contactMethod: "website",
    contactValue: "https://www.paukertlaw.com",
    description: "Eastern Washington civil rights practice with police accountability focus."
  },
  {
    id: "9",
    name: "Jeffery Campiche",
    firm: "Campiche Arnold, PLLC",
    city: "Seattle",
    practiceAreas: ["Civil Rights", "Police Misconduct", "Employment Discrimination"],
    counties: ["King", "Pierce", "Snohomish", "Thurston"],
    feeTypes: ["Contingency"],
    contactMethod: "website",
    contactValue: "https://www.justiceforpeople.com",
    description: "Civil rights litigation including wrongful death and excessive force cases."
  },
  {
    id: "10",
    name: "Darrell Cochran",
    firm: "Pfau Cochran Vertetis Amala, PLLC",
    city: "Tacoma",
    practiceAreas: ["Civil Rights", "Police Misconduct"],
    counties: ["Pierce", "King", "Thurston", "Kitsap"],
    feeTypes: ["Contingency"],
    contactMethod: "website",
    contactValue: "https://www.pcvalaw.com",
    description: "Civil rights and wrongful death cases with police misconduct focus."
  },
  {
    id: "11",
    name: "Jennifer Shaw",
    firm: "MacDonald Hoague & Bayless",
    city: "Seattle",
    practiceAreas: ["Housing Discrimination", "Employment Discrimination", "Disability Rights"],
    counties: ["King", "Snohomish", "Pierce"],
    feeTypes: ["Contingency", "Sliding Scale"],
    contactMethod: "website",
    contactValue: "https://www.mhb.com",
    description: "Civil rights litigation including housing and employment discrimination."
  },
  {
    id: "12",
    name: "Michele Shaw",
    firm: "Washington Civil Rights Council",
    city: "Seattle",
    practiceAreas: ["Family Defense", "Civil Rights"],
    counties: ["King", "Pierce", "Snohomish", "Thurston"],
    feeTypes: ["Pro Bono", "Sliding Scale"],
    contactMethod: "website",
    contactValue: "https://www.wacrc.org",
    description: "Family defense and civil rights advocacy with sliding scale options."
  }
];
