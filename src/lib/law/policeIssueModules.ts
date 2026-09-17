import type { LawModule } from "./issueLibrary";

export const POLICE_LAW_MODULES: LawModule[] = [
  {
    id: "police-unlawful-stop-detention",
    category: "Civil Rights & Law Enforcement",
    analyzerSystems: ["police"],
    title: "Potential unlawful stop or detention",
    definition: "A police stop or detention generally requires lawful authority. For an investigative Terry stop, Washington courts require reasonable suspicion grounded in specific and articulable facts connecting the person stopped to criminal activity or another recognized basis for the seizure.",
    elements: [
      "A seizure or detention occurred, rather than a purely consensual encounter.",
      "The officer lacked a warrant or another recognized lawful basis, or the detention exceeded the lawful scope or duration.",
      "For a Terry investigation, the officer had or lacked reasonable suspicion based on specific and articulable facts connecting the person to a crime.",
      "The complete circumstances, including any later-discovered facts and applicable exceptions, must be evaluated rather than assuming the user's account alone establishes unlawfulness."
    ],
    evidenceExamples: ["Body-camera/dash-camera video", "CAD/dispatch records", "Officer reports", "Citation or arrest records", "Witness statements", "911 recordings"],
    questions: ["What exact reason did the officer give?", "What facts did the officer know before the stop?", "When did the encounter become a detention?", "How long did it last?", "Did the purpose or scope change?"],
    authorities: [
      { citation: "State v. Acrey, 148 Wn.2d 738 (2003)", title: "Terry stop—reasonable suspicion", type: "case", jurisdiction: "Washington", url: "https://www.courts.wa.gov/opinions/pdf/775138.pdf", note: "Washington Supreme Court authority discussing investigative detention and reasonable suspicion; verify the cited opinion and subsequent treatment for the precise issue." },
      { citation: "U.S. Const. amend. IV", title: "Fourth Amendment", type: "case", jurisdiction: "United States", url: "https://constitution.congress.gov/constitution/amendment-4/", note: "Constitutional protection against unreasonable searches and seizures; the classification is retained as a primary constitutional authority rather than a statute." }
    ]
  },
  {
    id: "police-search-seizure",
    category: "Civil Rights & Law Enforcement",
    analyzerSystems: ["police"],
    title: "Potential unreasonable search or seizure",
    definition: "Washington and federal search-and-seizure law generally requires legal authority for a warrantless search or seizure unless a recognized exception applies. The precise analysis depends on what was searched, the person's protected interest, and the claimed justification.",
    elements: [
      "A search or seizure occurred within the meaning of the applicable constitutional protection.",
      "The person had a protected privacy or possessory interest where required.",
      "The search or seizure lacked a warrant or other lawful authority, or the claimed exception did not apply to the facts.",
      "The scope, duration, purpose, consent, and information known to officers must be established from the record."
    ],
    evidenceExamples: ["Search warrant and affidavit", "Warrant return/inventory", "Body-camera footage", "Consent recording or form", "Property/evidence inventory", "Officer reports"],
    questions: ["What exactly was searched or seized?", "Was there a warrant?", "If not, what exception was claimed?", "Was consent requested or given?", "What did officers know before acting?"],
    authorities: [
      { citation: "State v. Ladson, 138 Wn.2d 343, 979 P.2d 833 (1999)", title: "Pretextual traffic stops under article I, section 7", type: "case", jurisdiction: "Washington", url: "https://law.justia.com/cases/washington/supreme-court/1999/65801-3-1.html", note: "Washington Supreme Court authority holding that pretextual traffic stops violate article I, section 7 of the Washington Constitution." },
      { citation: "Wash. Const. art. I, § 7", title: "Invasion of private affairs or home prohibited", type: "case", jurisdiction: "Washington", url: "https://lawfilesext.leg.wa.gov/law/constitution/Table%20of%20Contents/TABLE%20OF%20CONTENTS.htm", note: "Washington Constitution provision protecting private affairs and homes from disturbance without authority of law." }
    ]
  },
  {
    id: "police-pretextual-stop",
    category: "Civil Rights & Law Enforcement",
    analyzerSystems: ["police"],
    title: "Potential pretextual stop",
    definition: "Washington's constitution provides an independent privacy protection. A traffic stop may present a pretext issue when an otherwise lawful traffic basis is used as a pretext for an unrelated investigative purpose that lacks independent lawful authority.",
    elements: [
      "A stop or seizure occurred.",
      "There was a stated legal basis for the stop, such as a traffic infraction.",
      "The evidence may support an argument that the stated basis was used as a pretext for another purpose.",
      "The totality of the circumstances and the officer's objective conduct must be examined under Washington law."
    ],
    evidenceExamples: ["CAD notes", "Body-camera footage", "Officer reports", "Traffic citation", "Dispatch communications", "Chronology of questioning/search"],
    questions: ["What was the stated reason?", "What happened immediately after the stop?", "Were unrelated questions or searches initiated?", "What did officers say about their purpose?", "What does the video show?"],
    authorities: [
      { citation: "State v. Ladson, 138 Wn.2d 343, 979 P.2d 833 (1999)", title: "Pretextual traffic stops", type: "case", jurisdiction: "Washington", url: "https://law.justia.com/cases/washington/supreme-court/1999/65801-3-1.html", note: "Primary Washington Supreme Court case addressing pretextual traffic stops under article I, section 7." }
    ]
  }
];

export function getPoliceLawModules(answers: Record<string, string> = {}): LawModule[] {
  const incident = (answers["incident-type"] || "").toLowerCase();
  const justification = Object.entries(answers)
    .filter(([key]) => /justif|reason|suspicion|basis|warrant|consent/i.test(key))
    .map(([, value]) => value || "")
    .join(" ")
    .toLowerCase();

  const searchStop = /search|stop|detain|seizure|traffic/.test(incident);
  const noJustification = /no|none|not sure|unknown|without|didn't|did not/.test(justification);

  if (!searchStop) return [];
  if (noJustification) return POLICE_LAW_MODULES;
  return POLICE_LAW_MODULES.filter((m) => m.id !== "police-pretextual-stop");
}
