// Library content structure - explains how systems operate, hide rules, and create harm
// This is not legal advice - it's educational context about institutional patterns

export interface LibrarySubsection {
  id: string;
  title: string;
  content: string[];
  traumaNote?: string;
}

export interface LibrarySection {
  id: string;
  title: string;
  description: string;
  icon: string;
  subsections: LibrarySubsection[];
}

export const libraryContent: LibrarySection[] = [
  {
    id: "systems-power",
    title: "Systems & Power",
    description: "How institutions are structured, who holds authority, and how power flows through bureaucracy.",
    icon: "Building2",
    subsections: [
      {
        id: "police",
        title: "Police",
        content: [
          "Police departments operate under a chain of command that concentrates decision-making authority at the top while insulating leadership from individual incident accountability.",
          "Internal affairs divisions are typically staffed by officers from the same department, creating structural conflicts of interest in misconduct investigations.",
          "Qualified immunity doctrine shields officers from personal liability in most civil rights cases, shifting financial consequences to taxpayers rather than individuals or departments.",
          "Union contracts often include provisions that delay interrogations of accused officers, limit disciplinary records retention, and restrict civilian oversight authority.",
          "Body camera policies vary widely — some departments allow officers to review footage before writing reports, potentially shaping narratives to match recorded events.",
          "The 'blue wall of silence' is reinforced by professional consequences for officers who report misconduct by colleagues, including isolation, denied promotions, and unsafe assignments."
        ],
        traumaNote: "Reading about police power dynamics can be activating. Take breaks as needed."
      },
      {
        id: "cps-dcyf",
        title: "CPS / DCYF",
        content: [
          "Child protective services operate under mandates that prioritize child safety, but 'safety' is defined by caseworkers with significant discretion and limited oversight.",
          "Caseworkers often carry caseloads far exceeding recommended limits, leading to rushed assessments and missed context about family circumstances.",
          "The system's design creates asymmetric power — agencies can intervene quickly based on reports, while families must navigate lengthy legal processes to restore their rights.",
          "Poverty-related conditions like unstable housing or food insecurity are sometimes conflated with neglect, disproportionately impacting low-income families.",
          "Parents have constitutional rights to family integrity, but these rights are often not clearly explained during investigations or home visits.",
          "Cooperation and compliance are different — families have rights even while being investigated, though exercising them may be perceived negatively by caseworkers."
        ],
        traumaNote: "Family separation content can be deeply painful. You can return to this later."
      },
      {
        id: "housing",
        title: "Housing",
        content: [
          "Landlord-tenant power imbalances are structural — landlords control access to shelter while tenants face displacement consequences for disputes.",
          "Eviction records can follow tenants for years, affecting future housing applications even when cases were dismissed or resolved in the tenant's favor.",
          "Housing authorities and property management companies share information through tenant screening services, creating informal blacklists.",
          "Maintenance requests create documentation trails that can work for or against tenants in habitability disputes.",
          "Lease provisions often include clauses that tenants unknowingly agree to, limiting their rights or imposing obligations beyond legal requirements.",
          "Retaliation protections exist in many jurisdictions but proving retaliatory motive is difficult when landlords cite other justifications."
        ],
        traumaNote: "Housing instability affects safety at a fundamental level. Pace yourself."
      },
      {
        id: "courts",
        title: "Courts",
        content: [
          "Court systems are designed by and for legal professionals — procedural rules that seem arbitrary often carry significant consequences for self-represented parties.",
          "Judges have substantial discretion in many areas, and their decisions are shaped by local legal culture, personal philosophy, and caseload pressures.",
          "Pro se (self-represented) litigants are held to the same procedural standards as attorneys, despite lacking legal training.",
          "Court deadlines are often absolute — missing a filing date can result in default judgments or waived rights regardless of the merits.",
          "The adversarial system assumes both parties have comparable resources and knowledge, which rarely reflects reality in disputes between individuals and institutions.",
          "Appellate review is expensive, time-consuming, and limited in scope — trial court errors often become permanent outcomes."
        ]
      },
      {
        id: "healthcare",
        title: "Healthcare",
        content: [
          "Medical records contain subjective assessments and characterizations that can follow patients across providers and institutions.",
          "Insurance denials often rely on internal guidelines that differ from medical standards of care, forcing patients to appeal decisions made by non-treating reviewers.",
          "Patient complaints are processed through systems controlled by the institutions being complained about, with limited external oversight.",
          "Medical debt collection operates differently than other debt, with fewer consumer protections in many jurisdictions.",
          "HIPAA protects some privacy but includes numerous exceptions for institutional information sharing.",
          "Patients in crisis or under treatment face additional barriers to advocating for themselves or questioning care decisions."
        ]
      },
      {
        id: "benefits",
        title: "Benefits & Public Assistance",
        content: [
          "Benefits systems require extensive documentation while serving populations least likely to have stable access to records, identification, and technology.",
          "Eligibility determinations involve discretionary judgments about circumstances that applicants may not know are being evaluated.",
          "Overpayment claims can arise years after benefits were received, often without clear explanation of how the determination was made.",
          "Appeals processes exist but are designed for legal representatives — navigating them alone requires significant time and bureaucratic literacy.",
          "Benefits coordination between programs can create unexpected consequences, where changes in one program affect eligibility in others.",
          "Work requirements and reporting obligations create ongoing compliance burdens that can result in sudden benefit loss for administrative reasons."
        ]
      }
    ]
  },
  {
    id: "hidden-rules",
    title: "Hidden Rules & Blind Spots",
    description: "The unwritten rules that govern how systems actually work — what they don't explain, what they assume, and what they hide.",
    icon: "EyeOff",
    subsections: [
      {
        id: "what-systems-assume",
        title: "What Systems Assume You Know",
        content: [
          "Systems assume you understand their language. Terms like 'hearing,' 'service,' 'notice,' and 'filing' have specific legal meanings that differ from everyday usage.",
          "Deadlines are often counted in specific ways — 'business days' vs 'calendar days,' starting from mailing vs receipt, excluding holidays. Missing these details can be fatal to your case.",
          "You're expected to know which agency or court has authority over your issue. Filing with the wrong body doesn't pause deadlines with the correct one.",
          "Systems assume you can access their preferred communication channels — mail delivery, phone calls during business hours, internet access, transportation to offices.",
          "Written records are treated as truth. If something isn't documented, it often 'didn't happen' in the eyes of the system.",
          "You're expected to advocate for yourself while remaining calm, deferential, and patient — emotional responses may be noted and used to characterize you."
        ],
        traumaNote: "Realizing what you 'should have known' can bring up self-blame. The system's opacity is not your fault."
      },
      {
        id: "documentation-power",
        title: "The Power of Documentation",
        content: [
          "Official documents carry more weight than verbal statements, even when verbal statements are more accurate.",
          "The person who creates the first written record often controls the narrative. Police reports, intake notes, and initial assessments shape everything that follows.",
          "Your documentation matters, but it's evaluated differently than institutional documentation. Photos, recordings, and contemporaneous notes can support your account.",
          "Records you don't know exist may be influencing decisions about you. Request copies of any file an agency keeps about you.",
          "Errors in official records are difficult to correct and may propagate to other systems. Disputing inaccuracies early matters.",
          "Metadata matters — timestamps, locations, and device information in your photos and messages can corroborate your timeline."
        ]
      },
      {
        id: "time-as-weapon",
        title: "How Time Is Used Against You",
        content: [
          "Statutes of limitations are absolute cutoffs, but they're often much shorter than people expect — sometimes 90 days or less for government claims.",
          "Delay benefits the party with more resources. Institutions can wait you out, hoping you'll give up, forget details, or lose evidence.",
          "Urgent-sounding demands may not be as urgent as presented. Understanding real deadlines vs psychological pressure is important.",
          "Your memory of events fades, but institutional records don't. Documenting details while fresh protects your ability to respond later.",
          "Administrative processes have their own timelines that don't align with court timelines. You may need to act in multiple systems simultaneously.",
          "Exhausting administrative remedies is often required before courts will hear your case — but the clock for court filing may still be running."
        ]
      },
      {
        id: "language-framing",
        title: "Language & Framing",
        content: [
          "How your situation is characterized in official records affects how it's treated. 'Non-compliant' vs 'exercising rights' describe the same behavior differently.",
          "Institutional language is designed to sound neutral while embedding judgments. 'Failed to' implies fault. 'Chose not to' implies defiance. 'Was unable to' implies incapacity.",
          "Your words may be paraphrased in ways that change their meaning. When possible, submit statements in writing that you've crafted yourself.",
          "Technical jargon serves as gatekeeping. You can ask for plain-language explanations, though you may not always receive them.",
          "Recorded statements can be quoted selectively. Context matters, but official summaries may omit it.",
          "The framing of your 'role' in the situation (victim, complainant, respondent, defendant) carries implicit weight regardless of underlying facts."
        ]
      }
    ]
  },
  {
    id: "patterns-harm",
    title: "Patterns of Harm",
    description: "Recognizing systemic patterns that affect many people — you're not alone in experiencing this.",
    icon: "AlertTriangle",
    subsections: [
      {
        id: "individual-vs-systemic",
        title: "Individual vs Systemic Harm",
        content: [
          "When harm happens, it's often framed as an individual incident — a 'bad apple,' a mistake, a misunderstanding. This framing protects institutions from accountability.",
          "Patterns become visible when individual experiences are aggregated. What feels isolated to you may be happening to many others.",
          "Systemic harm operates through policies, practices, and cultures that produce predictable outcomes regardless of individual actors' intentions.",
          "Institutions often investigate incidents in isolation, preventing pattern recognition that would reveal systemic problems.",
          "Statistical disparities (who gets stopped, investigated, denied, or removed) can reveal patterns invisible in individual cases.",
          "Your experience may be data that, combined with others', demonstrates actionable patterns — even if your individual case doesn't lead to change."
        ],
        traumaNote: "Recognizing you're part of a pattern can feel validating and overwhelming. Both responses are normal."
      },
      {
        id: "retraumatization",
        title: "Institutional Re-traumatization",
        content: [
          "Reporting harm often requires retelling traumatic events multiple times to different officials who may respond with skepticism or dismissal.",
          "Investigations can feel like being investigated yourself. Your credibility, behavior, and history may be scrutinized more than the alleged harm.",
          "Long timelines with little communication leave you in prolonged uncertainty while institutions proceed at their pace.",
          "Outcomes that feel unjust — cases closed without action, minimal consequences, or retaliation — compound the original harm.",
          "The process itself can become a source of trauma separate from the original incident.",
          "These patterns are predictable, which means preparing for them is possible. Knowing what to expect can help, even when it can't change what happens."
        ]
      },
      {
        id: "who-gets-believed",
        title: "Who Gets Believed",
        content: [
          "Credibility is not distributed equally. Official roles, professional credentials, and social position affect whose account is treated as default truth.",
          "People in crisis, with mental health histories, or with prior system involvement face additional credibility hurdles.",
          "Institutional actors are often presumed to be acting appropriately unless proven otherwise; the burden of proof falls on those challenging them.",
          "Documentation can help, but institutional documentation may be treated as more credible than personal records.",
          "Witnesses who are themselves vulnerable may be discounted or may decline to come forward due to their own risks.",
          "Understanding these dynamics isn't about accepting them — it's about navigating strategically while working toward change."
        ]
      }
    ]
  },
  {
    id: "process-reality",
    title: "Process Reality",
    description: "What actually happens when you engage with systems — beyond what official procedures describe.",
    icon: "Route",
    subsections: [
      {
        id: "complaint-processes",
        title: "What Happens When You Complain",
        content: [
          "Filing a complaint starts a process you don't control. Timelines, communication, and outcomes are determined by the receiving agency.",
          "Your complaint becomes their file. Information you provide may be shared with the people you're complaining about.",
          "Investigation' often means reviewing existing records and interviewing parties — not independent fact-finding.",
          "Sustained findings don't guarantee consequences. Discipline is often confidential or minimal.",
          "Closing a complaint without action is common. Reasons given may be vague or may blame procedural issues rather than address substance.",
          "You may not be told when or how your complaint was resolved unless you actively follow up."
        ]
      },
      {
        id: "what-systems-measure",
        title: "What Systems Measure vs What Matters to You",
        content: [
          "Agencies track metrics that serve institutional goals — cases closed, response times, procedural compliance — not harm reduction or resolution quality.",
          "Success' from their perspective may look nothing like justice from yours.",
          "Pressure to close cases quickly can result in inadequate investigation or premature determinations.",
          "When outcomes are measured internally, there's incentive to define success in achievable ways rather than meaningful ones.",
          "Your case is one of many they handle. It's the only one you have.",
          "Understanding what they're optimizing for helps you anticipate how they'll respond and what arguments may resonate."
        ]
      },
      {
        id: "informal-resolution",
        title: "Informal vs Formal Processes",
        content: [
          "Many situations are resolved (or made worse) through informal interactions before formal processes begin.",
          "Formal processes create records. Informal ones often don't — which can benefit or harm you depending on circumstances.",
          "Escalating to formal processes can change the dynamic, sometimes productively, sometimes triggering defensive institutional responses.",
          "Some protections only apply once you're in a formal process. Others require you to have tried informal resolution first.",
          "Knowing when to document, when to escalate, and when to accept informal resolution is strategic, not one-size-fits-all.",
          "Institutions may prefer informal resolution because it limits documentation and precedent. That's not necessarily bad for you, but understand the tradeoff."
        ]
      }
    ]
  },
  {
    id: "evidence-truths",
    title: "Evidence & Documentation Truths",
    description: "What actually matters for documenting your situation — and what institutions don't tell you.",
    icon: "FileCheck",
    subsections: [
      {
        id: "what-counts",
        title: "What Counts as Evidence",
        content: [
          "Evidence is anything that supports or contradicts a claim. What 'counts' depends on the forum — courts, agencies, and media have different standards.",
          "Contemporaneous records (created at or near the time of events) are generally more credible than later reconstructions.",
          "Physical evidence, electronic records with metadata, and third-party documentation typically carry more weight than personal recollection alone.",
          "Witness statements matter, but witnesses' relationships to you and to the opposing party affect how their accounts are weighted.",
          "Absence of documentation can be used against you. 'If it wasn't written down, it didn't happen' is a common institutional stance.",
          "Evidence that seems minor may become important later. When in doubt, preserve it."
        ]
      },
      {
        id: "creating-records",
        title: "Creating Your Own Records",
        content: [
          "Write things down as soon as possible after they happen. Include dates, times, locations, people present, and exact words when you can remember them.",
          "Save communications — emails, texts, voicemails. Screenshot messages that could be deleted or altered.",
          "Photograph and video document conditions, injuries, damage, or anything visual that's relevant. Metadata (timestamps, GPS) can corroborate your timeline.",
          "Send confirming emails after verbal conversations: 'Following up on our conversation today where you said...' This creates a record and gives them a chance to correct misunderstandings.",
          "Keep records organized and backed up. Cloud storage, secure notes apps, or trusted people who can hold copies.",
          "Your notes to yourself, if dated and detailed, can be valuable evidence of what you knew and experienced at specific times."
        ],
        traumaNote: "Documentation can feel exhausting when you're already overwhelmed. Do what you can. Something is better than nothing."
      },
      {
        id: "their-records",
        title: "Accessing Their Records About You",
        content: [
          "You often have legal rights to records agencies keep about you — police reports, CPS files, medical records, school records, benefits files.",
          "Requesting records requires knowing who has them and what process to use. Different agencies have different rules and timelines.",
          "Records may be redacted (portions blacked out) for various reasons, some legitimate and some that can be challenged.",
          "Comparing what's in official records to what actually happened can reveal bias, errors, or omissions worth documenting.",
          "Records requests create their own paper trail. The date you requested information and what you received becomes part of your documentation.",
          "If records are destroyed, lost, or withheld improperly, that itself may be relevant to your situation."
        ]
      }
    ]
  },
  {
    id: "safety-retaliation",
    title: "Safety, Retaliation & Risk",
    description: "Understanding real risks when engaging with systems that have power over you.",
    icon: "Shield",
    subsections: [
      {
        id: "retaliation-patterns",
        title: "How Retaliation Works",
        content: [
          "Retaliation rarely looks like direct punishment. It's often subtle — changed schedules, increased scrutiny, withheld opportunities, negative characterizations.",
          "Retaliation is often disguised as something legitimate. 'Performance issues' or 'policy enforcement' may begin suspiciously after you complained.",
          "The timing between your protected activity and adverse action matters. Documenting the sequence is important.",
          "Retaliation can come from people other than the direct subject of your complaint — supervisors, colleagues, or connected parties.",
          "Proving retaliation requires showing connection between your protected activity and the harm. Circumstantial evidence (timing, departures from normal practice) can help.",
          "Fear of retaliation keeps many people from asserting rights. This is a feature, not a bug, of power imbalances."
        ],
        traumaNote: "If you're experiencing or fearing retaliation, your safety comes first. Strategic retreat is valid."
      },
      {
        id: "safety-planning",
        title: "Safety While Engaging Systems",
        content: [
          "Assess your actual dependencies before acting. Housing, employment, custody, and benefits can all be affected by system engagement.",
          "Having support — people who know your situation and can help if things escalate — reduces isolation and provides witnesses.",
          "Document everything, but store documentation safely. Consider who might access your devices, mail, or living space.",
          "Know the difference between mandatory reporters, confidential resources, and people with no confidentiality obligation.",
          "You can often get information and preparation before taking action. Consulting doesn't commit you.",
          "Trust your instincts about danger. Systems often underestimate or dismiss safety concerns that you understand better than they do."
        ]
      },
      {
        id: "when-to-wait",
        title: "When Strategic Waiting Makes Sense",
        content: [
          "Not every battle needs to be fought immediately. Sometimes waiting until you're in a stronger position is wise.",
          "Statutes of limitations are real constraints, but within those limits, timing can be strategic.",
          "Gathering evidence, securing support, stabilizing your situation, or waiting for an opportunity can all be reasons to pause.",
          "Strategic waiting is different from avoidance. It involves active preparation during the wait.",
          "Some situations require immediate action — imminent deadlines, safety risks, or time-sensitive evidence. Know the difference.",
          "Consulting with someone knowledgeable can help you assess whether waiting is strategic or risky in your situation."
        ]
      }
    ]
  },
  {
    id: "rights-practice",
    title: "Rights in Practice",
    description: "The gap between rights on paper and rights you can actually exercise.",
    icon: "Scale",
    subsections: [
      {
        id: "paper-vs-reality",
        title: "Paper Rights vs Real Rights",
        content: [
          "Having a legal right doesn't mean you can exercise it without consequence. Asserting rights can trigger defensive or hostile responses.",
          "Rights require enforcement. Without someone willing and able to enforce a right, it may exist only in theory.",
          "Many rights are waivable. Systems are often designed to encourage or pressure you to waive rights, sometimes without knowing you're doing so.",
          "Rights depend on resources. Legal representation, time, money, knowledge, and stability all affect whether rights are practical.",
          "Rights can conflict. Your right to speak may conflict with your interest in not antagonizing someone with power over you.",
          "Understanding the gap between paper rights and practical rights isn't cynicism — it's realism that enables strategic action."
        ]
      },
      {
        id: "when-rights-help",
        title: "When Invoking Rights Helps",
        content: [
          "Invoking rights creates a record. Even if the right isn't respected, your assertion of it can matter later.",
          "Some rights, once waived, are gone. Knowing which rights to preserve — like remaining silent — can be critical.",
          "Rights language can shift power dynamics in conversations. 'I'm exercising my right to X' is different from 'I don't want to.'",
          "Institutional actors often prefer you not know your rights. Knowledge itself is leverage.",
          "Rights provide frameworks for complaints, appeals, and legal action. Even if you don't use those paths, they're options.",
          "Asserting rights with calm clarity is generally more effective than anger or desperation, though the emotional burden of staying calm is real."
        ]
      },
      {
        id: "collective-power",
        title: "Individual vs Collective Action",
        content: [
          "Individual complaints are easily dismissed. Patterns across many complaints are harder to ignore.",
          "Others may have experienced what you have. Finding them can validate your experience and create collective power.",
          "Advocacy organizations, community groups, and legal organizations may be interested in patterns you've identified.",
          "Media attention can change institutional calculus when internal processes fail.",
          "Collective action has risks — visibility, coordination challenges, and group dynamics. But isolation has risks too.",
          "You don't have to lead or organize. Supporting others' efforts, sharing your story, or simply connecting can matter."
        ]
      }
    ]
  }
];

// Utility function to get a section by ID
export function getLibrarySection(sectionId: string): LibrarySection | undefined {
  return libraryContent.find(section => section.id === sectionId);
}

// Utility function to get a subsection by IDs
export function getLibrarySubsection(sectionId: string, subsectionId: string): LibrarySubsection | undefined {
  const section = getLibrarySection(sectionId);
  return section?.subsections.find(sub => sub.id === subsectionId);
}

// For linking from Analyzer Results - maps system types to relevant library sections
export const systemToLibrarySections: Record<string, string[]> = {
  police: ["systems-power", "hidden-rules", "patterns-harm", "safety-retaliation"],
  housing: ["systems-power", "hidden-rules", "evidence-truths", "rights-practice"],
  cps_dcyf: ["systems-power", "hidden-rules", "patterns-harm", "safety-retaliation"],
  courts: ["systems-power", "process-reality", "evidence-truths", "rights-practice"],
  healthcare: ["systems-power", "hidden-rules", "evidence-truths"],
  benefits: ["systems-power", "hidden-rules", "process-reality", "rights-practice"],
  schools: ["systems-power", "hidden-rules", "patterns-harm"],
  other: ["hidden-rules", "evidence-truths", "rights-practice"]
};
