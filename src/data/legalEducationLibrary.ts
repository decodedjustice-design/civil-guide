import {
  Shield,
  Car,
  Scale,
  Home,
  Heart,
  Megaphone,
  GraduationCap,
  Building2,
  Lock,
  Stethoscope,
} from "lucide-react";

export interface LibraryCategoryCard {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  guideId: string; // maps to educationalGuides id
  color: "maroon" | "gold" | "espresso";
  quickFacts: string[];
}

export const libraryCategories: LibraryCategoryCard[] = [
  {
    id: "police",
    title: "Police Encounters",
    subtitle: "Know your rights during stops, searches, and arrests.",
    icon: Shield,
    guideId: "police-full-guide",
    color: "maroon",
    quickFacts: [
      "You have the right to remain silent",
      "You can refuse consent to search",
      "You can record police in public",
      "Ask if you are free to leave",
    ],
  },
  {
    id: "traffic",
    title: "Traffic Stops",
    subtitle: "What happens during a traffic stop and what you can do.",
    icon: Car,
    guideId: "traffic-stops-full-guide",
    color: "gold",
    quickFacts: [
      "Pull over safely and turn off your engine",
      "You must provide license and registration",
      "You do not have to answer questions beyond ID",
      "Passengers can ask if they are free to leave",
    ],
  },
  {
    id: "courts",
    title: "Courts & Judicial Process",
    subtitle: "How courts work, what to expect, and how to prepare.",
    icon: Scale,
    guideId: "courts-full-guide",
    color: "espresso",
    quickFacts: [
      "Different courts handle different matters",
      "Deadlines are almost always strict",
      "You can represent yourself (pro se)",
      "Court facilitators can help with forms",
    ],
  },
  {
    id: "housing",
    title: "Housing Rights",
    subtitle: "Tenant protections, eviction process, and fair housing.",
    icon: Home,
    guideId: "housing-full-guide",
    color: "maroon",
    quickFacts: [
      "An eviction notice is not a court order",
      "Landlords cannot change locks or shut off utilities",
      "You have the right to habitable conditions",
      "Security deposits have specific return rules",
    ],
  },
  {
    id: "disability",
    title: "Disability Rights",
    subtitle: "Accommodations, access, and protections under the law.",
    icon: Heart,
    guideId: "disability-full-guide",
    color: "gold",
    quickFacts: [
      "You don't need to disclose your diagnosis",
      "Reasonable accommodations are legally required",
      "The ADA applies to employment, housing, and services",
      "Denials can be challenged through formal processes",
    ],
  },
  {
    id: "protest",
    title: "Protest Rights",
    subtitle: "First Amendment protections and how to exercise them safely.",
    icon: Megaphone,
    guideId: "protest-full-guide",
    color: "espresso",
    quickFacts: [
      "Public sidewalks and parks are traditional free speech zones",
      "You can record police and public officials",
      "Permits may be required for large gatherings",
      "You can be arrested but still have been lawful",
    ],
  },
  {
    id: "education",
    title: "Schools & Student Rights",
    subtitle: "Discipline, special education, and civil rights in schools.",
    icon: GraduationCap,
    guideId: "education-full-guide",
    color: "maroon",
    quickFacts: [
      "Students retain constitutional rights in school",
      "Suspensions require due process",
      "IEP and 504 plans are legally binding",
      "Parents can bring advocates to meetings",
    ],
  },
  {
    id: "government",
    title: "Government Benefits",
    subtitle: "Applying, appealing, and navigating agency decisions.",
    icon: Building2,
    guideId: "government-full-guide",
    color: "gold",
    quickFacts: [
      "You have the right to appeal most denials",
      "Appeal deadlines are strict (often 30-90 days)",
      "Get all decisions and denials in writing",
      "Administrative law judges review appeals",
    ],
  },
  {
    id: "incarceration",
    title: "Jail & Detention",
    subtitle: "Rights during incarceration, grievances, and oversight.",
    icon: Lock,
    guideId: "incarceration-full-guide",
    color: "espresso",
    quickFacts: [
      "Incarcerated people retain constitutional rights",
      "Medical care must meet constitutional standards",
      "Grievance procedures must be exhausted before court",
      "Independent oversight offices exist",
    ],
  },
  {
    id: "healthcare",
    title: "Medical Care",
    subtitle: "Patient rights, privacy, informed consent, and complaints.",
    icon: Stethoscope,
    guideId: "healthcare-full-guide",
    color: "maroon",
    quickFacts: [
      "You can access your own medical records",
      "Informed consent is required before treatment",
      "HIPAA protects your medical privacy",
      "You can file complaints about provider conduct",
    ],
  },
];
