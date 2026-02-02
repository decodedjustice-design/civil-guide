export interface LawLibraryResource {
  id: string;
  name: string;
  category: string;
  description: string;
  usefulFor: string;
  url: string;
  isExternal: boolean;
}

export const LAW_LIBRARY_CATEGORIES = [
  { id: "state-law-libraries", label: "Washington State Law Library" },
  { id: "county-law-libraries", label: "County Law Libraries" },
  { id: "municipal-law-libraries", label: "Municipal Law Libraries" },
  { id: "court-forms", label: "Court Forms Libraries" },
  { id: "bar-association", label: "WA Bar Association" },
  { id: "public-records", label: "Public Records Portals" },
];

export const lawLibraryResources: LawLibraryResource[] = [
  // State Law Libraries
  {
    id: "wa-state-law-library",
    name: "Washington State Law Library",
    category: "state-law-libraries",
    description: "Official law library of Washington State, maintained by the Washington State Supreme Court. Provides access to legal research databases, reference assistance, and self-help resources.",
    usefulFor: "Legal research, finding statutes and case law, understanding Washington legal procedures, free access to legal databases for in-person visitors.",
    url: "https://www.courts.wa.gov/library/",
    isExternal: true,
  },
  {
    id: "wa-state-legislature-rcw",
    name: "Revised Code of Washington (RCW)",
    category: "state-law-libraries",
    description: "The official compilation of all laws currently in force in Washington State, organized by subject matter.",
    usefulFor: "Looking up specific Washington State laws, understanding your legal rights under state statutes, researching civil rights and anti-discrimination laws.",
    url: "https://apps.leg.wa.gov/rcw/",
    isExternal: true,
  },
  {
    id: "wa-administrative-code",
    name: "Washington Administrative Code (WAC)",
    category: "state-law-libraries",
    description: "State agency rules and regulations that implement and interpret Washington State laws.",
    usefulFor: "Understanding how state agencies enforce laws, researching regulations for specific state programs, finding procedural rules for administrative hearings.",
    url: "https://apps.leg.wa.gov/wac/",
    isExternal: true,
  },

  // County Law Libraries
  {
    id: "king-county-law-library",
    name: "King County Law Library",
    category: "county-law-libraries",
    description: "Largest county law library in Washington, located in the King County Courthouse in Seattle. Offers free legal research assistance, self-help resources, and legal forms.",
    usefulFor: "In-person legal research in Seattle area, free access to Westlaw and LexisNexis, self-help clinics, notary services.",
    url: "https://kcll.org/",
    isExternal: true,
  },
  {
    id: "pierce-county-law-library",
    name: "Pierce County Law Library",
    category: "county-law-libraries",
    description: "Public law library serving Pierce County, located in the County-City Building in Tacoma.",
    usefulFor: "Legal research in Tacoma area, accessing legal databases, finding court forms for Pierce County Superior Court.",
    url: "https://www.piercecountylawlibrary.org/",
    isExternal: true,
  },
  {
    id: "spokane-county-law-library",
    name: "Spokane County Law Library",
    category: "county-law-libraries",
    description: "Public law library serving Spokane County, providing access to legal materials and research assistance.",
    usefulFor: "Legal research in Eastern Washington, accessing court rules and forms, understanding Spokane County court procedures.",
    url: "https://www.spokanecounty.org/1282/Law-Library",
    isExternal: true,
  },
  {
    id: "snohomish-county-law-library",
    name: "Snohomish County Law Library",
    category: "county-law-libraries",
    description: "Public law library serving Snohomish County, located in the courthouse in Everett.",
    usefulFor: "Legal research in Snohomish County, finding local court forms and rules, accessing legal databases.",
    url: "https://snohomishcountywa.gov/2102/Law-Library",
    isExternal: true,
  },

  // Municipal Law Libraries
  {
    id: "seattle-municipal-code",
    name: "Seattle Municipal Code",
    category: "municipal-law-libraries",
    description: "Official codified ordinances of the City of Seattle, searchable online database.",
    usefulFor: "Researching Seattle city laws, understanding local regulations on housing, employment, civil rights protections within Seattle.",
    url: "https://library.municode.com/wa/seattle/codes/municipal_code",
    isExternal: true,
  },
  {
    id: "tacoma-municipal-code",
    name: "Tacoma Municipal Code",
    category: "municipal-law-libraries",
    description: "Official codified ordinances of the City of Tacoma.",
    usefulFor: "Understanding Tacoma city laws, local civil rights ordinances, landlord-tenant regulations in Tacoma.",
    url: "https://www.cityoftacoma.org/government/city_departments/city_clerks_office/tacoma_municipal_code",
    isExternal: true,
  },
  {
    id: "spokane-municipal-code",
    name: "Spokane Municipal Code",
    category: "municipal-law-libraries",
    description: "Official codified ordinances of the City of Spokane.",
    usefulFor: "Researching Spokane city laws, understanding local police policies, city-level civil rights protections.",
    url: "https://my.spokanecity.org/smc/",
    isExternal: true,
  },

  // Court Forms Libraries
  {
    id: "wa-courts-forms",
    name: "WA Courts Forms Library",
    category: "court-forms",
    description: "Official Washington Courts pattern forms approved by the Administrative Office of the Courts. Includes forms for civil, family, and other case types.",
    usefulFor: "Downloading official court forms, filing pro se motions and pleadings, understanding required court documents for your case type.",
    url: "https://www.courts.wa.gov/forms/",
    isExternal: true,
  },
  {
    id: "federal-uscourts-forms",
    name: "Federal Court Forms (USCOURTS.gov)",
    category: "court-forms",
    description: "National repository of forms used in federal courts, including civil rights complaint forms and pro se litigant resources.",
    usefulFor: "Filing federal civil rights cases (Section 1983, Title VII), understanding federal court requirements, downloading IFP applications.",
    url: "https://www.uscourts.gov/forms",
    isExternal: true,
  },
  {
    id: "wdwa-forms",
    name: "Western District of WA Forms",
    category: "court-forms",
    description: "Local forms specific to the U.S. District Court for the Western District of Washington (Seattle/Tacoma).",
    usefulFor: "Filing cases in federal court in Western Washington, local rule compliance, specific procedural forms for WDWA.",
    url: "https://www.wawd.uscourts.gov/forms",
    isExternal: true,
  },
  {
    id: "edwa-forms",
    name: "Eastern District of WA Forms",
    category: "court-forms",
    description: "Local forms specific to the U.S. District Court for the Eastern District of Washington (Spokane/Yakima/Richland).",
    usefulFor: "Filing cases in federal court in Eastern Washington, local rule compliance, specific procedural forms for EDWA.",
    url: "https://www.waed.uscourts.gov/forms",
    isExternal: true,
  },

  // WA Bar Association
  {
    id: "wsba-main",
    name: "Washington State Bar Association (WSBA)",
    category: "bar-association",
    description: "The official organization for licensed attorneys in Washington State. Provides lawyer referral services, ethics resources, and public legal information.",
    usefulFor: "Finding a licensed attorney, verifying an attorney's license status, understanding attorney ethics and complaint procedures.",
    url: "https://www.wsba.org/",
    isExternal: true,
  },
  {
    id: "wsba-lawyer-directory",
    name: "WSBA Lawyer Directory",
    category: "bar-association",
    description: "Searchable database of all licensed attorneys in Washington State, including their bar number, admission date, and disciplinary history.",
    usefulFor: "Verifying if an attorney is licensed, checking for disciplinary actions, finding attorneys by practice area or location.",
    url: "https://www.mywsba.org/PersonifyEbusiness/LegalDirectory.aspx",
    isExternal: true,
  },
  {
    id: "wsba-lawyer-referral",
    name: "WSBA Lawyer Referral Service",
    category: "bar-association",
    description: "Fee-based referral service connecting the public with attorneys for a low-cost initial consultation.",
    usefulFor: "Getting a 30-minute consultation for a nominal fee, being matched with attorneys who handle your type of case.",
    url: "https://www.wsba.org/for-the-public/find-legal-help",
    isExternal: true,
  },

  // Public Records Portals
  {
    id: "wa-state-public-records",
    name: "Washington Public Records Portal",
    category: "public-records",
    description: "State-level portal for submitting public records requests to Washington State agencies under the Public Records Act (RCW 42.56).",
    usefulFor: "Requesting documents from state agencies, obtaining police reports, accessing government communications and files.",
    url: "https://www.governor.wa.gov/public-records-requests",
    isExternal: true,
  },
  {
    id: "king-county-records",
    name: "King County Records Portal",
    category: "public-records",
    description: "King County's online portal for submitting public records requests to county departments.",
    usefulFor: "Requesting records from King County agencies, obtaining sheriff reports, accessing county government documents.",
    url: "https://kingcounty.gov/depts/records-licensing/records-management/public-records.aspx",
    isExternal: true,
  },
  {
    id: "seattle-public-records",
    name: "Seattle Public Records Portal",
    category: "public-records",
    description: "City of Seattle's centralized system for public records requests, including Seattle Police Department records.",
    usefulFor: "Requesting Seattle city records, obtaining SPD incident reports, accessing city department communications.",
    url: "https://www.seattle.gov/public-records",
    isExternal: true,
  },
  {
    id: "tacoma-public-records",
    name: "Tacoma Public Records",
    category: "public-records",
    description: "City of Tacoma's portal for public records requests.",
    usefulFor: "Requesting Tacoma city records, obtaining Tacoma Police reports, accessing city government documents.",
    url: "https://www.cityoftacoma.org/government/city_departments/city_clerks_office/public_records_requests",
    isExternal: true,
  },
  {
    id: "spokane-public-records",
    name: "Spokane Public Records",
    category: "public-records",
    description: "City of Spokane's portal for public records requests.",
    usefulFor: "Requesting Spokane city records, obtaining SPD incident reports, accessing city department files.",
    url: "https://my.spokanecity.org/opendata/public-records-requests/",
    isExternal: true,
  },
];
