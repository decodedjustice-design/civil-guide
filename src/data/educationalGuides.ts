// Full Educational Guides with 11-Section Structure
// Housing & CPS/DCYF Priority

export interface EducationalGuide {
  id: string;
  systemId: string;
  title: string;
  readTime: string;
  
  // Section 1: Before You Start
  beforeYouStart: {
    grounding: string;
    consent: string;
  };
  
  // Section 2: What This System Is
  whatThisSystemIs: {
    description: string;
    whoRunsIt: string;
    whatItControls: string;
  };
  
  // Section 3: Why It Feels So Confusing
  whyConfusing: {
    explanation: string;
    structuralReasons: string[];
  };
  
  // Section 4: What Usually Happens
  whatUsuallyHappens: string[];
  
  // Section 5: What Success Actually Looks Like
  successReframe: {
    reality: string;
    examples: string[];
  };
  
  // Section 6: What They Know — But You Don't
  internalKnowledge: {
    explanation: string;
    examples: string[];
  };
  
  // Section 7: What People Often Misunderstand
  misunderstandings: {
    traps: string[];
  };
  
  // Section 8: What Actually Matters
  whatMatters: string[];
  
  // Section 9: What You Can Do Safely
  safeSteps: string[];
  
  // Section 10: When It's Time to Escalate
  escalation: {
    explanation: string;
    signs: string[];
  };
  
  // Section 11: Closing
  closing: {
    reassurance: string;
  };
  
  // Sources & References
  sources: {
    label: string;
    url: string;
    type: "official" | "agency" | "oversight";
  }[];
}

export const educationalGuides: EducationalGuide[] = [
  // ===== HOUSING GUIDE =====
  {
    id: "housing-full-guide",
    systemId: "housing",
    title: "Understanding Housing & Tenant Rights",
    readTime: "15 min read",
    
    beforeYouStart: {
      grounding: "Housing instability is one of the most stressful experiences a person can face. If you're reading this because you're worried about your home, you're not alone. What you're feeling — confusion, fear, frustration — is normal.",
      consent: "You don't have to read all of this at once. You can pause, bookmark sections, or come back later. Nothing here requires you to take action right now. Understanding is a step, not a deadline."
    },
    
    whatThisSystemIs: {
      description: "Housing in Washington is governed by a mix of state law (the Residential Landlord-Tenant Act), local ordinances, and federal fair housing protections. These laws create rights and obligations for both landlords and tenants.",
      whoRunsIt: "Landlords (private individuals, property managers, or housing authorities) control access to housing. Courts handle eviction cases through 'unlawful detainer' proceedings. Code enforcement addresses habitability violations. Fair housing agencies investigate discrimination.",
      whatItControls: "The system controls who can rent, on what terms, how evictions happen, what conditions must be maintained, how deposits work, and how disputes are resolved."
    },
    
    whyConfusing: {
      explanation: "Housing law is confusing because power is uneven, deadlines are short, and landlords often present their preferences as law. Many tenants don't learn their rights until they're already in crisis.",
      structuralReasons: [
        "Landlords often have more experience with the system than tenants do",
        "Eviction notices use legal language that sounds final, even when it isn't",
        "Different cities have different rules (Seattle, Tacoma, etc. have extra protections)",
        "Court processes move fast once they start",
        "Fear of retaliation makes tenants hesitant to assert rights",
        "Housing assistance programs have complex eligibility rules"
      ]
    },
    
    whatUsuallyHappens: [
      "A tenant receives a notice (pay-or-vacate, comply-or-vacate, or termination notice)",
      "The tenant feels pressured to leave immediately, even though they may have time or defenses",
      "If the tenant doesn't leave, the landlord files an eviction case in court",
      "The tenant has a short window to respond (usually 7 days for summons)",
      "A hearing is scheduled; if the tenant doesn't appear, the landlord usually wins by default",
      "If the landlord wins, the sheriff posts a notice giving the tenant 3 days to move",
      "Throughout this, tenants often don't know about legal aid, mediation, or defenses"
    ],
    
    successReframe: {
      reality: "Success in housing disputes often doesn't mean 'keeping the apartment forever' or 'proving the landlord wrong.' It often looks like buying time, negotiating a move-out agreement, getting repairs made, having an eviction dismissed, or preserving your rental record.",
      examples: [
        "Getting a case dismissed because proper notice wasn't given",
        "Negotiating additional time to move so you're not homeless",
        "Getting a harmful eviction removed or 'sealed' from your record",
        "Forcing repairs through code enforcement before moving out",
        "Receiving your full security deposit back after documenting conditions",
        "Filing a fair housing complaint that leads to policy changes"
      ]
    },
    
    internalKnowledge: {
      explanation: "Landlords, property managers, and housing authorities often have access to information and systems you don't see. Understanding what they track can help you navigate strategically.",
      examples: [
        "Tenant screening databases that report eviction filings (even dismissed cases)",
        "Internal notes about maintenance requests and complaints",
        "Communication logs showing when you contacted them",
        "Photos or inspection records they may not have shared with you",
        "Knowledge of how long eviction court typically takes",
        "Awareness of when tenants usually give up and leave",
        "Relationships with local judges and court staff"
      ]
    },
    
    misunderstandings: {
      traps: [
        "That an eviction notice means you must leave immediately — it doesn't; it starts a process",
        "That landlords can change locks or shut off utilities — this may raise legal concerns in Washington",
        "That you can't fight an eviction if you owe rent — there may be procedural defenses or partial payment rules",
        "That verbal agreements override the lease — usually, the written lease controls",
        "That your landlord's 'notice' is the same as a court order — only a judge can order eviction",
        "That being 'behind' means you're automatically wrong — timing, procedure, and conditions all matter",
        "That silence from your landlord means things are fine — put everything in writing"
      ]
    },
    
    whatMatters: [
      "Keeping copies of your lease and all notices",
      "Communicating with your landlord in writing (texts and emails count)",
      "Documenting conditions with dated photos and videos",
      "Responding to court summons within the deadline (usually 7 days)",
      "Showing up to court hearings — missing them usually means you lose",
      "Understanding whether your city has extra protections (just cause eviction, etc.)",
      "Contacting a tenant rights organization or legal aid early"
    ],
    
    safeSteps: [
      "Save a copy of your lease somewhere safe (email it to yourself)",
      "Take photos of the current condition of your unit (do this now, even if nothing is wrong)",
      "Start communicating with your landlord in writing instead of just by phone",
      "If you receive any notice, read it carefully and note all dates",
      "Look up whether your city has a tenant hotline or legal aid organization",
      "If facing eviction, don't ignore court papers — responding is critical",
      "Keep records of all rent payments (bank statements, receipts)"
    ],
    
    escalation: {
      explanation: "Escalation in housing doesn't mean conflict — it means shifting the decision to someone with more authority or oversight. This might be a court, a code enforcement agency, or a fair housing body.",
      signs: [
        "Your landlord refuses to make repairs despite written requests",
        "You receive an eviction notice and want to contest it",
        "You believe you're being discriminated against (race, disability, family status, etc.)",
        "Your landlord is engaging in illegal self-help (lockouts, utility shutoffs)",
        "You've been retaliated against for complaining or organizing",
        "Your security deposit wasn't returned and you documented the condition"
      ]
    },
    
    closing: {
      reassurance: "Whatever brought you here, you have the right to understand the system affecting your housing. You don't have to be perfect, know everything, or fight alone. Taking time to learn is not weakness — it's strategy. You can return to this guide whenever you need it."
    },
    
    sources: [
      { label: "Washington Residential Landlord-Tenant Act (RCW 59.18)", url: "https://apps.leg.wa.gov/rcw/default.aspx?cite=59.18", type: "official" },
      { label: "HUD Fair Housing Overview", url: "https://www.hud.gov/program_offices/fair_housing_equal_opp/fair_housing_rights_and_obligations", type: "official" },
      { label: "Washington Law Help - Tenant Rights", url: "https://www.washingtonlawhelp.org/issues/housing", type: "official" },
      { label: "Seattle Tenant Rights (SDCI)", url: "https://www.seattle.gov/sdci/codes/common-code-questions/renters", type: "agency" },
      { label: "Tacoma Tenant Rights", url: "https://www.tacomaprobono.org/housing", type: "agency" },
      { label: "HUD/DOJ Disability Accommodation Guidance", url: "https://www.hud.gov/program_offices/fair_housing_equal_opp/reasonable_accommodations_and_modifications", type: "official" },
      { label: "Washington State Human Rights Commission", url: "https://www.hum.wa.gov/", type: "oversight" }
    ]
  },
  
  // ===== CPS / DCYF GUIDE =====
  {
    id: "cps-dcyf-full-guide",
    systemId: "cps_dcyf",
    title: "Understanding CPS & DCYF Involvement",
    readTime: "18 min read",
    
    beforeYouStart: {
      grounding: "Few experiences are more destabilizing than having child protective services involved in your family's life. Whether you're facing an investigation, a safety plan, or a dependency case, the fear and confusion you may be feeling are completely understandable. You are not alone in this.",
      consent: "This guide exists to help you understand what's happening — not to tell you what to do. You can read at your own pace, skip sections, or come back later. Knowledge is a form of protection, and you get to decide when and how to use it."
    },
    
    whatThisSystemIs: {
      description: "In Washington, child welfare is primarily handled by the Department of Children, Youth, and Families (DCYF). Child Protective Services (CPS) is the investigation arm. The system is designed to assess child safety and, when concerns are substantiated, to intervene — sometimes through voluntary agreements, sometimes through court orders.",
      whoRunsIt: "CPS social workers investigate reports. Their supervisors approve major decisions. DCYF administrators set policy. Courts oversee dependency cases. Attorneys represent parents, children, and the state. CASA volunteers and guardians ad litem represent children's interests.",
      whatItControls: "The system can investigate your home, require safety plans, offer or mandate services, place children with relatives or foster care, and — in extreme cases — move to terminate parental rights. Courts must approve removal and ongoing placement."
    },
    
    whyConfusing: {
      explanation: "The child welfare system is confusing because it operates in crisis mode, uses unfamiliar procedures, and often asks for cooperation while holding significant power. The line between 'voluntary' and 'required' is often unclear.",
      structuralReasons: [
        "Workers have discretion, so outcomes can vary depending on who's assigned",
        "The system uses 'safety plans' that feel voluntary but can become evidence if you don't comply",
        "Legal terms like 'dependency' and 'finding' have specific meanings that aren't obvious",
        "You may not know what was alleged in the report",
        "The process moves on multiple tracks — investigation, court, services — at once",
        "Fear of retaliation makes parents hesitant to ask questions or push back"
      ]
    },
    
    whatUsuallyHappens: [
      "Someone makes a report to the CPS hotline (you may never know who)",
      "DCYF screens the report and decides whether to investigate",
      "If accepted, a CPS social worker contacts you and wants to interview you and see your children",
      "The worker may ask you to agree to a safety plan — a voluntary set of conditions",
      "If concerns are serious, the worker may ask you to sign a voluntary placement agreement or seek a court order",
      "If a dependency petition is filed, you're entitled to a court hearing within 72 hours of removal",
      "The case proceeds with hearings, service plans, and review — this can last months or years",
      "Throughout, documentation of compliance and engagement is critical"
    ],
    
    successReframe: {
      reality: "Success in CPS cases doesn't always mean 'proving you did nothing wrong' or 'getting them to leave immediately.' More often, it looks like staying informed, engaging strategically, maintaining your relationship with your children, and resolving the case as quickly as possible with your rights intact.",
      examples: [
        "Having a case closed at investigation without a finding",
        "Completing services and reunifying with your children",
        "Negotiating a safety plan that works for your family",
        "Having a dependency dismissed after demonstrating stability",
        "Placing your child with a relative you trust instead of foster care",
        "Preventing a finding from being entered on the background check registry"
      ]
    },
    
    internalKnowledge: {
      explanation: "CPS and DCYF workers have access to systems and information that parents often don't see. Understanding what they're tracking can help you navigate more effectively.",
      examples: [
        "Prior CPS history on you or family members (even unsubstantiated reports)",
        "Background check databases for child abuse findings (the BFIS list)",
        "Internal case notes that document every interaction and observation",
        "Information from collateral contacts (teachers, doctors, neighbors)",
        "Your compliance or non-compliance with every part of a safety plan",
        "Internal risk assessment tools that score your case",
        "Conversations with your child that you weren't present for"
      ]
    },
    
    misunderstandings: {
      traps: [
        "That you have to let CPS in your home without a court order — you have the right to say no, though there can be consequences",
        "That 'cooperating' always helps — cooperation is important, but so is understanding what you're agreeing to",
        "That safety plans are just suggestions — violating a safety plan can be used as evidence against you",
        "That the worker is on your side — their job is to assess safety, not to represent you",
        "That you'll automatically get your children back after services — reunification requires demonstrating change",
        "That what you say can't be used against you — anything you say to a worker can appear in court documents",
        "That the court will see 'both sides fairly' — you need an attorney to advocate for you"
      ]
    },
    
    whatMatters: [
      "Getting an attorney as early as possible — you're entitled to one in dependency cases",
      "Understanding what's alleged against you (request to see the petition or report summary)",
      "Documenting your own parenting, home conditions, and children's wellbeing",
      "Engaging with services genuinely, not just checking boxes",
      "Attending every hearing and arriving on time",
      "Communicating respectfully with the worker, even if you disagree",
      "Understanding the difference between an investigation and a court case",
      "Keeping records of every interaction, agreement, and service"
    ],
    
    safeSteps: [
      "Request a copy of any safety plan before signing — take time to read it",
      "Write down the name, phone number, and supervisor of your assigned worker",
      "Keep a journal of all interactions with DCYF — dates, what was said, who was present",
      "Contact an attorney or legal aid before making major decisions",
      "If your children are in school or daycare, know that staff may be contacted as collaterals",
      "Attend all scheduled visits and services — cancellations are documented",
      "Ask questions if you don't understand what's being asked of you"
    ],
    
    escalation: {
      explanation: "Escalation in CPS cases means invoking oversight, legal process, or advocacy — not conflict. If you feel your rights are being violated or decisions are unfair, there are formal channels.",
      signs: [
        "You weren't informed of your rights or given required notices",
        "Your children were removed without a court order in a non-emergency",
        "You're being asked to sign agreements you don't understand",
        "Your worker is unresponsive or not following through on commitments",
        "You believe the investigation is biased or retaliatory",
        "You disagree with a substantiated finding and want to appeal"
      ]
    },
    
    closing: {
      reassurance: "Being involved with CPS does not define you as a parent. Many families go through investigations and emerge intact. What matters now is understanding the process, protecting your rights, and staying connected to your children. You can pause, breathe, and come back to this whenever you need. Your dignity as a parent is not up for debate."
    },
    
    sources: [
      { label: "Washington DCYF - Family Resources", url: "https://www.dcyf.wa.gov/services/child-welfare-system", type: "agency" },
      { label: "Office of Family and Children's Ombuds (OFCO)", url: "https://ofco.wa.gov/", type: "oversight" },
      { label: "Washington Law Help - CPS and DCYF", url: "https://www.washingtonlawhelp.org/issues/family-law/child-protective-services-cps", type: "official" },
      { label: "Parent Representation Program", url: "https://www.opd.wa.gov/index.php/program-parents", type: "official" },
      { label: "TeamChild - Family Advocacy", url: "https://teamchild.org/", type: "oversight" },
      { label: "DCYF Complaint Process", url: "https://www.dcyf.wa.gov/about/complaints", type: "agency" },
      { label: "Indian Child Welfare Act (ICWA) Information", url: "https://www.bia.gov/bia/ois/dhs/icwa", type: "official" }
    ]
  },

  // ===== AI PROMPT GUIDE =====
  {
    id: "ai-prompt-guide",
    systemId: "ai-tools",
    title: "How to Use AI for Research, Clarity, and Organization (Without Hallucinations)",
    readTime: "12 min read",
    
    beforeYouStart: {
      grounding: "AI tools are becoming more common in daily life, and many people wonder how to use them safely — especially when dealing with sensitive situations like civil rights issues or legal processes. This guide exists to help you use AI as a support tool, not as a substitute for professional guidance or your own judgment.",
      consent: "You don't have to use AI at all if it doesn't feel right for you. This guide is purely educational. Take what's useful, leave what isn't, and remember: you are always in control of your own decisions."
    },
    
    whatThisSystemIs: {
      description: "AI (artificial intelligence) refers to computer systems that can process language, organize information, and generate text. On this platform and others, AI can help you structure your thoughts, understand complex language, and prepare questions. But AI is not a lawyer, not a therapist, and not a source of truth.",
      whoRunsIt: "AI systems are built by technology companies. The AI you interact with follows patterns it learned from large amounts of text. It does not 'know' your situation, does not have access to current databases, and cannot verify facts independently.",
      whatItControls: "AI controls nothing about your case, your rights, or your outcomes. It can only process the information you give it and respond based on patterns. It cannot make decisions for you, and it should never be treated as an authority."
    },
    
    whyConfusing: {
      explanation: "AI can feel confusing because it often sounds confident, even when it's wrong. It may produce text that looks authoritative but contains invented facts, outdated information, or completely fabricated sources. This is called 'hallucination.'",
      structuralReasons: [
        "AI generates responses based on patterns, not verified knowledge",
        "AI cannot distinguish between reliable and unreliable sources",
        "AI may invent citations, case names, or statistics that don't exist",
        "AI often sounds more certain than it should",
        "AI doesn't know when it's wrong",
        "AI has no way to verify current laws, policies, or procedures"
      ]
    },
    
    whatUsuallyHappens: [
      "A person asks AI for help understanding a legal or civil rights issue",
      "AI provides a response that sounds helpful and authoritative",
      "The person assumes the information is accurate because it sounds professional",
      "They may act on that information without verifying it",
      "Later, they discover the AI invented facts, cited cases that don't exist, or gave outdated advice",
      "This can cause confusion, wasted effort, or even harm to their situation"
    ],
    
    successReframe: {
      reality: "Successful use of AI means treating it as an organizer and clarifier — not as an authority or decision-maker. When used carefully, AI can genuinely help you prepare, structure, and understand. The key is knowing its limits.",
      examples: [
        "Using AI to turn messy notes into a clean timeline",
        "Asking AI to simplify complex language without adding interpretation",
        "Having AI generate neutral questions you can ask a professional",
        "Using AI to organize documents into categories",
        "Asking AI to identify what's unclear so you know what to research further",
        "Using AI to format your own writing without changing meaning"
      ]
    },
    
    internalKnowledge: {
      explanation: "Understanding how AI actually works can help you use it more safely. Here are things AI systems know (and don't know) that most users aren't aware of.",
      examples: [
        "AI doesn't 'remember' previous conversations unless specifically designed to",
        "AI cannot access the internet or current databases in most cases",
        "AI was trained on data with a cutoff date — it doesn't know recent developments",
        "AI has no way to verify if what it says is true",
        "AI is designed to sound helpful, which can make it seem more confident than it should be",
        "AI cannot distinguish between your situation and general patterns",
        "AI may give different answers to the same question if asked multiple times"
      ]
    },
    
    misunderstandings: {
      traps: [
        "That AI 'knows' the law — it doesn't; it generates text based on patterns",
        "That AI can predict outcomes — it cannot; it has no access to courts, judges, or real-world data",
        "That AI citations are real — AI frequently invents case names, statutes, and sources",
        "That AI understands your situation — it processes text, not context or lived experience",
        "That AI is neutral — AI reflects biases in its training data",
        "That longer, more detailed AI responses are more accurate — length is not a sign of truth",
        "That AI can replace a lawyer, advocate, or counselor — it absolutely cannot"
      ]
    },
    
    whatMatters: [
      "Always verify any factual claim AI makes before acting on it",
      "Never treat AI as a source of legal, medical, or professional advice",
      "Use AI for organization and clarity, not for conclusions or decisions",
      "If AI cites a source, check whether that source actually exists",
      "Ask AI to label uncertainty — and be skeptical if it sounds too confident",
      "Keep humans in the loop for any decision that affects your rights or safety",
      "Remember: AI is a tool, not an authority"
    ],
    
    safeSteps: [
      "Use AI to organize information you already have — not to generate new facts",
      "Ask AI to simplify or structure text, not to interpret or advise",
      "Include safety prompts that tell AI not to add, assume, or invent",
      "If you get a response with citations, verify them independently",
      "Use AI to prepare questions for professionals, not to replace those conversations",
      "Take breaks — you don't have to process everything at once",
      "Trust your own judgment over AI when something feels wrong"
    ],
    
    escalation: {
      explanation: "Escalation in AI use means recognizing when AI is the wrong tool for the job. If you need verified legal information, medical advice, or professional guidance, AI is not sufficient — you need a human professional.",
      signs: [
        "You're about to take legal action based on AI output",
        "AI is giving you information that will affect your safety or rights",
        "You're unsure whether something AI said is accurate",
        "AI is generating citations or sources you can't verify",
        "You're using AI instead of talking to a lawyer, advocate, or counselor",
        "AI is telling you what to 'do' instead of helping you organize"
      ]
    },
    
    closing: {
      reassurance: "AI can be a genuinely useful tool when used with care. It can help you organize your thoughts, understand complex language, and prepare for important conversations. But it should never replace human judgment, professional guidance, or your own lived experience. You are the expert on your own life. AI is just a helper."
    },
    
    sources: [
      { label: "MIT Technology Review - AI Limitations", url: "https://www.technologyreview.com/", type: "official" },
      { label: "Electronic Frontier Foundation - AI and Rights", url: "https://www.eff.org/issues/ai", type: "oversight" },
      { label: "Partnership on AI - Responsible Practices", url: "https://partnershiponai.org/", type: "oversight" },
      { label: "AI Now Institute - Research", url: "https://ainowinstitute.org/", type: "official" }
    ]
  }
];

import { additionalEducationalGuides } from "./educationFullGuides";

// Combined list of all educational guides
export const allEducationalGuides: EducationalGuide[] = [
  ...educationalGuides,
  ...additionalEducationalGuides,
];

// Helper to get guide by ID from all guides
export const getGuideById = (guideId: string): EducationalGuide | undefined => {
  return allEducationalGuides.find(g => g.id === guideId);
};

// Helper to get guide by system ID
export const getGuideBySystem = (systemId: string): EducationalGuide | undefined => {
  return allEducationalGuides.find(g => g.systemId === systemId);
};
