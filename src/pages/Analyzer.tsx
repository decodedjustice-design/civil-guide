import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  ArrowLeft,
  ShieldAlert,
  Briefcase,
  Home,
  GraduationCap,
  Stethoscope,
  Scale,
  Building,
  Landmark,
  HelpCircle,
  FileText,
  FolderOpen,
  Phone,
  BookOpen,
  UserSearch,
  Heart,
  Search,
  X,
  Clock
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";
import heroImage from "@/assets/hero-analysis.png";

type SystemId = 
  | "police" 
  | "employer" 
  | "housing" 
  | "school" 
  | "healthcare" 
  | "courts" 
  | "jail" 
  | "government" 
  | "unsure";

interface SystemCategory {
  id: SystemId;
  label: string;
  icon: React.ElementType;
  description: string;
}

interface FollowUpQuestion {
  id: string;
  question: string;
  options: { id: string; label: string }[];
}

interface SystemResult {
  summary: string;
  explanation: string;
  rightsInsightFilter: string;
  supportNetworkFilter: string;
}

// System categories for Step 1
const systemCategories: SystemCategory[] = [
  { 
    id: "police", 
    label: "Police or Sheriff", 
    icon: ShieldAlert, 
    description: "Interactions with law enforcement, arrests, use of force, searches" 
  },
  { 
    id: "employer", 
    label: "Employer or Workplace", 
    icon: Briefcase, 
    description: "Discrimination, harassment, retaliation, termination, accommodations" 
  },
  { 
    id: "housing", 
    label: "Housing or Landlord", 
    icon: Home, 
    description: "Eviction, discrimination, habitability, repairs, lease issues" 
  },
  { 
    id: "school", 
    label: "School or Education Program", 
    icon: GraduationCap, 
    description: "Student rights, discipline, discrimination, IEP/504 plans" 
  },
  { 
    id: "healthcare", 
    label: "Healthcare Provider", 
    icon: Stethoscope, 
    description: "Medical care, discrimination, privacy, access to records" 
  },
  { 
    id: "courts", 
    label: "Court or Prosecutor", 
    icon: Scale, 
    description: "Due process, access to justice, court procedures, appeals" 
  },
  { 
    id: "jail", 
    label: "Jail or Prison", 
    icon: Building, 
    description: "Conditions, medical care, visitation, reentry, communication" 
  },
  { 
    id: "government", 
    label: "Government Agency", 
    icon: Landmark, 
    description: "Benefits, licensing, permits, administrative decisions" 
  },
  { 
    id: "unsure", 
    label: "Not sure yet", 
    icon: HelpCircle, 
    description: "I'm not sure which system applies to my situation" 
  },
];

// Conditional follow-up questions based on system
const followUpQuestions: Record<SystemId, FollowUpQuestion[]> = {
  police: [
    {
      id: "incident-type",
      question: "What best describes what happened?",
      options: [
        { id: "force", label: "Use of force or physical contact" },
        { id: "arrest", label: "Arrest or detention" },
        { id: "search", label: "Search of person, vehicle, or property" },
        { id: "stop", label: "Stop, questioning, or harassment" },
        { id: "retaliation", label: "Retaliation for a complaint or recording" },
        { id: "other", label: "Other interaction" },
      ]
    },
    {
      id: "injury",
      question: "Did this involve an injury or need for medical attention?",
      options: [
        { id: "yes", label: "Yes" },
        { id: "no", label: "No" },
      ]
    }
  ],
  employer: [
    {
      id: "issue-type",
      question: "What issue best fits your situation?",
      options: [
        { id: "discrimination", label: "Discrimination (race, gender, age, disability, etc.)" },
        { id: "retaliation", label: "Retaliation for reporting or whistleblowing" },
        { id: "termination", label: "Wrongful termination or demotion" },
        { id: "harassment", label: "Harassment or hostile work environment" },
        { id: "accommodation", label: "Denied accommodation or leave" },
        { id: "other", label: "Other workplace issue" },
      ]
    },
    {
      id: "timing",
      question: "Is this ongoing or in the past?",
      options: [
        { id: "ongoing", label: "Ongoing — still happening" },
        { id: "past", label: "Past — already occurred" },
      ]
    }
  ],
  housing: [
    {
      id: "issue-type",
      question: "What issue best fits your situation?",
      options: [
        { id: "discrimination", label: "Discrimination in housing" },
        { id: "eviction", label: "Eviction or threat of eviction" },
        { id: "retaliation", label: "Retaliation for complaints or organizing" },
        { id: "habitability", label: "Habitability or repair issues" },
        { id: "accommodation", label: "Denied accommodation for disability" },
        { id: "other", label: "Other housing issue" },
      ]
    }
  ],
  school: [
    {
      id: "issue-type",
      question: "What issue best fits your situation?",
      options: [
        { id: "discrimination", label: "Discrimination or unequal treatment" },
        { id: "discipline", label: "Suspension, expulsion, or discipline" },
        { id: "iep", label: "IEP, 504 plan, or special education" },
        { id: "harassment", label: "Bullying or harassment" },
        { id: "retaliation", label: "Retaliation for complaints" },
        { id: "other", label: "Other school issue" },
      ]
    }
  ],
  healthcare: [
    {
      id: "issue-type",
      question: "What issue best fits your situation?",
      options: [
        { id: "discrimination", label: "Discrimination in care" },
        { id: "access", label: "Denied care or treatment" },
        { id: "privacy", label: "Privacy or records violation" },
        { id: "billing", label: "Billing or insurance dispute" },
        { id: "other", label: "Other healthcare issue" },
      ]
    }
  ],
  courts: [
    {
      id: "issue-type",
      question: "What issue best fits your situation?",
      options: [
        { id: "due-process", label: "Due process violation" },
        { id: "representation", label: "Denied or inadequate representation" },
        { id: "procedure", label: "Procedural error or unfairness" },
        { id: "appeal", label: "Appeal or post-conviction issue" },
        { id: "other", label: "Other court issue" },
      ]
    }
  ],
  jail: [
    {
      id: "issue-type",
      question: "What issue best fits your situation?",
      options: [
        { id: "conditions", label: "Conditions of confinement" },
        { id: "medical", label: "Medical care or mental health" },
        { id: "communication", label: "Mail, phone, or visitation" },
        { id: "discipline", label: "Disciplinary action or solitary" },
        { id: "reentry", label: "Reentry or release issues" },
        { id: "other", label: "Other incarceration issue" },
      ]
    }
  ],
  government: [
    {
      id: "issue-type",
      question: "What issue best fits your situation?",
      options: [
        { id: "benefits", label: "Denied or terminated benefits" },
        { id: "discrimination", label: "Discrimination by agency" },
        { id: "license", label: "Licensing or permit issue" },
        { id: "records", label: "Records or FOIA request" },
        { id: "other", label: "Other government agency issue" },
      ]
    }
  ],
  unsure: [
    {
      id: "describe",
      question: "Can you describe what happened in general terms?",
      options: [
        { id: "authority", label: "Someone in authority treated me unfairly" },
        { id: "denied", label: "I was denied something I believe I'm entitled to" },
        { id: "harmed", label: "I was harmed or my rights were violated" },
        { id: "retaliation", label: "I faced consequences for speaking up" },
        { id: "confused", label: "I'm still trying to understand what happened" },
      ]
    }
  ],
};

// System-specific result content with enhanced guidance
interface EnhancedSystemResult extends SystemResult {
  whatThisMeans: string;
  misunderstandings: string[];
  whatHelpsFirst: string[];
  whyToolsMatter: { tool: string; why: string }[];
}

const systemResults: Record<SystemId, EnhancedSystemResult> = {
  police: {
    summary: "issues related to police or law enforcement",
    explanation: "Interactions with police can raise questions about constitutional rights, use of force policies, complaint procedures, and oversight agencies. Documentation and understanding timelines for complaints are often important first steps.",
    whatThisMeans: "People in this situation often experience a mix of confusion, frustration, and sometimes fear about what happened and what comes next. You may be unsure whether what occurred was normal, legal, or appropriate. That uncertainty is common — and it's why understanding the system is a powerful first step.",
    misunderstandings: [
      "That filing a complaint will automatically result in punishment for the officer",
      "That you need to prove your case before filing a complaint — you don't",
      "That internal affairs will contact you with updates — they often don't",
      "That the incident 'wasn't bad enough' to document — document it anyway",
      "That talking to a lawyer is the same as suing — it's not; consultations are just information"
    ],
    whatHelpsFirst: [
      "Write down everything you remember: date, time, location, badge numbers, what was said",
      "Request medical records if you were injured (even minor injuries)",
      "Identify any witnesses and note their contact information",
      "File a formal complaint with the police department or civilian oversight board",
      "Consider requesting any body camera or dash camera footage",
      "Note the deadlines — some complaints must be filed within 60-180 days"
    ],
    whyToolsMatter: [
      { tool: "Timeline Creator", why: "Reconstructing exactly what happened, step by step, helps attorneys and oversight agencies understand your experience" },
      { tool: "Evidence Vault", why: "Photos of injuries, screenshots of texts, and records need to be stored safely before they're lost or deleted" },
      { tool: "Notes", why: "Your memory of details fades quickly — capture them now while they're fresh" }
    ],
    rightsInsightFilter: "police",
    supportNetworkFilter: "police",
  },
  employer: {
    summary: "workplace or employment-related issues",
    explanation: "Employment issues may involve federal or state anti-discrimination laws, internal HR processes, or external agencies like the EEOC. Understanding relevant deadlines and documentation requirements can be important.",
    whatThisMeans: "Workplace problems often make people feel trapped — you may depend on the job, fear retaliation, or feel like 'it's your word against theirs.' Many people minimize what happened or wait too long to act. Know that documentation and deadlines are critical, and you don't have to have everything figured out to start.",
    misunderstandings: [
      "That HR is there to protect you — HR protects the company first",
      "That you need to file a lawsuit to make anything happen — you don't",
      "That retaliation after a complaint is illegal — it is, but proving it requires documentation",
      "That discrimination has to be 'obvious' or 'intentional' to count — subtle patterns matter too",
      "That you can file anytime — EEOC deadlines can be as short as 180 days"
    ],
    whatHelpsFirst: [
      "Document every incident: date, time, who was present, what was said or done",
      "Save emails, texts, performance reviews, and anything showing a pattern",
      "File internal HR complaints in writing (not just verbally) so there's a record",
      "Note any witnesses or coworkers who saw what happened",
      "Research your company's policies — they can be used to show violations",
      "Consider filing with the EEOC or Washington State Human Rights Commission early"
    ],
    whyToolsMatter: [
      { tool: "Timeline Creator", why: "Showing the pattern over time — when incidents occurred and how they escalated — is often essential" },
      { tool: "Evidence Vault", why: "Emails, screenshots, and HR responses can disappear after you leave; save them now" },
      { tool: "Notes", why: "Recording conversations and incidents in detail helps you remember what to share with an attorney or agency" }
    ],
    rightsInsightFilter: "employment",
    supportNetworkFilter: "employment",
  },
  housing: {
    summary: "housing or landlord-related issues",
    explanation: "Housing issues may involve fair housing laws, tenant rights, habitability standards, or eviction procedures. Understanding local laws and available advocacy resources can help you navigate the situation.",
    whatThisMeans: "Housing instability is deeply stressful. Whether you're facing eviction, discrimination, or unsafe conditions, know that tenants have rights — even when landlords don't follow them. Many people don't realize they can fight back or ask for help until it's almost too late.",
    misunderstandings: [
      "That an eviction notice means you have to leave immediately — it doesn't",
      "That landlords can lock you out or shut off utilities — that's illegal in WA",
      "That you can't fight eviction if you owe rent — there may still be defenses",
      "That housing discrimination has to be 'in writing' — verbal and pattern-based discrimination counts",
      "That you need a lawyer to respond to eviction — many people represent themselves with help"
    ],
    whatHelpsFirst: [
      "Keep copies of your lease, all notices, and all communication with your landlord",
      "Document habitability issues with photos, videos, and dated written complaints",
      "If you receive an eviction notice, note the exact deadline and court date",
      "Contact a tenant rights organization or legal aid immediately if facing eviction",
      "Request repairs in writing — texts and emails count as documentation",
      "File a fair housing complaint if discrimination occurred (federal and state)"
    ],
    whyToolsMatter: [
      { tool: "Timeline Creator", why: "A clear history of complaints, repairs, or landlord behavior can be critical in eviction defense" },
      { tool: "Evidence Vault", why: "Photos of mold, broken locks, or notices — and when they were taken — can support your case" },
      { tool: "Notes", why: "Recording what the landlord said or threatened helps you recall details when speaking with an attorney" }
    ],
    rightsInsightFilter: "housing",
    supportNetworkFilter: "housing",
  },
  school: {
    summary: "school or education-related issues",
    explanation: "Education issues may involve student rights, due process for discipline, special education laws (IDEA, Section 504), or anti-discrimination protections. Understanding your rights and the school's obligations is often a key first step.",
    whatThisMeans: "Schools are powerful institutions, and parents or students often feel like they can't push back. But students have legal rights — to due process, to accommodations, to freedom from discrimination. Understanding those rights can change how you approach the situation.",
    misunderstandings: [
      "That schools can suspend or expel without a hearing — due process applies",
      "That an IEP meeting decision is final — you can dispute it",
      "That bullying isn't the school's responsibility — if they ignore it, it may be",
      "That you have to accept whatever the school says — you have appeal rights",
      "That private schools don't have rules — many still must comply with civil rights laws"
    ],
    whatHelpsFirst: [
      "Request your child's complete educational records in writing",
      "Document every meeting and conversation with dates, names, and notes",
      "If special education is involved, request a formal IEP meeting",
      "Put complaints about bullying or discrimination in writing to the principal",
      "File with the Office for Civil Rights (OCR) if discrimination is occurring",
      "Know your state and district appeal procedures for discipline"
    ],
    whyToolsMatter: [
      { tool: "Timeline Creator", why: "Showing the sequence of events — incidents, meetings, ignored concerns — helps advocates see the full picture" },
      { tool: "Evidence Vault", why: "IEPs, disciplinary notices, emails with staff, and report cards all matter" },
      { tool: "Notes", why: "Writing down what happened in meetings, especially informal ones, gives you a record to reference later" }
    ],
    rightsInsightFilter: "education",
    supportNetworkFilter: "education",
  },
  healthcare: {
    summary: "healthcare provider-related issues",
    explanation: "Healthcare issues may involve patient rights, medical privacy (HIPAA), non-discrimination in care, or access to medical records. Understanding complaint processes and patient advocacy resources can be helpful.",
    whatThisMeans: "Healthcare is deeply personal, and when something goes wrong — being dismissed, discriminated against, or denied care — it can feel violating. Patients have rights, including the right to access records, file complaints, and seek second opinions.",
    misunderstandings: [
      "That HIPAA prevents you from getting your own records — it guarantees you can",
      "That you can't file a complaint unless you have 'proof' of malpractice — you can report concerns",
      "That providers can refuse care without reason — civil rights laws may apply",
      "That filing a complaint will hurt your care — retaliation is illegal",
      "That insurance decisions are final — you can appeal most denials"
    ],
    whatHelpsFirst: [
      "Request your complete medical records in writing (they must provide them)",
      "Document what happened: dates, providers, what was said or denied",
      "File a complaint with the hospital patient advocate or licensing board",
      "If discrimination occurred, file with the HHS Office for Civil Rights",
      "Get a second opinion if you were denied treatment",
      "Appeal insurance denials — most denials can be challenged"
    ],
    whyToolsMatter: [
      { tool: "Timeline Creator", why: "Healthcare incidents often span multiple visits — tracking symptoms, visits, and denials clarifies patterns" },
      { tool: "Evidence Vault", why: "Medical records, bills, denial letters, and prescriptions all matter" },
      { tool: "Notes", why: "What a provider said (or didn't say) during an appointment can be important to recall later" }
    ],
    rightsInsightFilter: "healthcare",
    supportNetworkFilter: "healthcare",
  },
  courts: {
    summary: "court or legal system issues",
    explanation: "Court-related issues may involve due process rights, access to counsel, procedural requirements, or appeal processes. Understanding court procedures and available legal resources is often essential.",
    whatThisMeans: "The court system can feel overwhelming and confusing, especially if you're representing yourself (pro se). Many people don't realize that court procedures have strict rules — but also that errors can sometimes be challenged.",
    misunderstandings: [
      "That missing a deadline means you 'lose forever' — sometimes you can ask for relief",
      "That a judge's decision is always final — appeals exist for a reason",
      "That you need a lawyer for everything — pro se litigants can access help",
      "That court staff can give you legal advice — they can't, only information",
      "That public defenders aren't 'real' lawyers — they often handle complex cases"
    ],
    whatHelpsFirst: [
      "Get copies of all court orders, filings, and notices",
      "Understand key deadlines — courts are strict about timing",
      "Visit the court clerk's office or website to learn procedures",
      "Look for self-help legal clinics or pro bono help in your area",
      "Document any interactions that felt unfair or biased",
      "Request transcripts of hearings if needed for an appeal"
    ],
    whyToolsMatter: [
      { tool: "Timeline Creator", why: "Court cases have many dates — filings, hearings, orders — keeping them organized is critical" },
      { tool: "Evidence Vault", why: "All court documents, orders, and correspondence should be stored safely" },
      { tool: "Notes", why: "Recording what happened in hearings, what was said, and any concerns helps you track your case" }
    ],
    rightsInsightFilter: "courts",
    supportNetworkFilter: "courts",
  },
  jail: {
    summary: "jail or prison-related issues",
    explanation: "Incarceration issues may involve conditions of confinement, access to medical care, communication rights, or grievance procedures. Understanding available advocacy channels and oversight bodies can be important.",
    whatThisMeans: "People in jails and prisons still have constitutional rights — but exercising them is difficult. If you or a loved one is incarcerated and facing mistreatment, medical neglect, or abuse, documentation and formal grievances are often the only path forward.",
    misunderstandings: [
      "That incarcerated people have 'no rights' — they absolutely do",
      "That grievances don't matter — they're often required before a lawsuit",
      "That medical requests are always ignored — persistence and documentation matter",
      "That nothing can be done from outside — family can file complaints and contact oversight",
      "That conditions are 'just part of punishment' — cruel conditions can be unconstitutional"
    ],
    whatHelpsFirst: [
      "File formal grievances through the facility's process — keep copies",
      "Request medical attention in writing; keep a record of requests",
      "Contact the jail ombudsman, state corrections office, or oversight bodies",
      "Family members can contact civil rights organizations on behalf of incarcerated individuals",
      "Document dates, names, and what happened in as much detail as possible",
      "Look into ACLU or prison rights organizations for assistance"
    ],
    whyToolsMatter: [
      { tool: "Timeline Creator", why: "Incidents inside facilities often happen repeatedly — a timeline shows patterns" },
      { tool: "Evidence Vault", why: "Grievance forms, medical requests, and correspondence should be saved" },
      { tool: "Notes", why: "Recording everything that happens or is communicated helps when filing complaints" }
    ],
    rightsInsightFilter: "incarceration",
    supportNetworkFilter: "incarceration",
  },
  government: {
    summary: "government agency-related issues",
    explanation: "Government agency issues may involve administrative procedures, benefit determinations, licensing decisions, or records requests. Understanding appeal processes and relevant deadlines is often critical.",
    whatThisMeans: "Government agencies can feel like black boxes — slow, unresponsive, and hard to navigate. But there are usually formal processes for appealing decisions, requesting records, or filing complaints. Understanding the process gives you power.",
    misunderstandings: [
      "That benefit denials are final — most can be appealed",
      "That agencies don't have to respond — many have legal deadlines",
      "That you need a lawyer to appeal — many administrative appeals are designed for self-help",
      "That being persistent is 'bothering' them — following up in writing is essential",
      "That requests for records can be ignored — FOIA and public records laws apply"
    ],
    whatHelpsFirst: [
      "Get a copy of any decision letter — it should explain appeal rights",
      "Note the deadline for filing an appeal or response",
      "Request your file or case records in writing",
      "Follow up on requests in writing, not just by phone",
      "File a public records request (FOIA at federal level, state PRA in Washington)",
      "Contact an ombudsman or advocacy group for that agency type"
    ],
    whyToolsMatter: [
      { tool: "Timeline Creator", why: "Tracking applications, denials, appeals, and responses helps you see the full picture" },
      { tool: "Evidence Vault", why: "Letters, forms, and decisions from agencies are essential records" },
      { tool: "Notes", why: "Recording what staff said, promised, or explained can help if things go wrong" }
    ],
    rightsInsightFilter: "government",
    supportNetworkFilter: "government",
  },
  unsure: {
    summary: "a situation that may involve multiple systems or issues",
    explanation: "It's okay not to be sure which system applies. Many situations involve overlapping issues or multiple institutions. Gathering information and documenting what happened can help clarify next steps.",
    whatThisMeans: "Feeling uncertain is completely normal. Many situations don't fit neatly into one category — and that's okay. The first step is simply documenting what happened, who was involved, and how it affected you. That information will help any professional you speak with later.",
    misunderstandings: [
      "That you need to 'know your legal issue' to get help — advocates can help you figure it out",
      "That your situation 'isn't serious enough' — if it's affecting you, it matters",
      "That you have to do everything at once — take one step at a time",
      "That asking for help is a burden — advocacy organizations exist to help",
      "That nothing can be done if you waited — late is better than never"
    ],
    whatHelpsFirst: [
      "Write down what happened, when, and who was involved",
      "Gather any documents, photos, or communications related to the situation",
      "Talk to a legal aid hotline or advocacy organization — they can help clarify options",
      "Focus on what's affecting you most urgently right now",
      "Don't worry about 'having it all figured out' — just start documenting"
    ],
    whyToolsMatter: [
      { tool: "Timeline Creator", why: "Even if you're unsure what happened, a timeline helps you — and others — see patterns" },
      { tool: "Evidence Vault", why: "Save what you have; you don't need to know if it's 'evidence' yet" },
      { tool: "Notes", why: "Writing down your experience can help process it and prepare for conversations" }
    ],
    rightsInsightFilter: "general",
    supportNetworkFilter: "general",
  },
};

export default function Analyzer() {
  const [step, setStep] = useState(0);
  const [selectedSystem, setSelectedSystem] = useState<SystemId | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const currentFollowUps = selectedSystem ? followUpQuestions[selectedSystem] : [];
  const totalSteps = currentFollowUps.length + 1; // +1 for system selection

  const handleSystemSelect = (systemId: SystemId) => {
    setSelectedSystem(systemId);
    setAnswers({});
    setStep(1);
  };

  const handleAnswer = (questionId: string, answerId: string) => {
    const newAnswers = { ...answers, [questionId]: answerId };
    setAnswers(newAnswers);
    
    const currentQuestionIndex = step - 1;
    if (currentQuestionIndex < currentFollowUps.length - 1) {
      setStep(step + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (showResults) {
      setShowResults(false);
    } else if (step > 1) {
      setStep(step - 1);
      // Remove the last answer
      const currentQuestion = currentFollowUps[step - 2];
      if (currentQuestion) {
        const { [currentQuestion.id]: _, ...remaining } = answers;
        setAnswers(remaining);
      }
    } else if (step === 1) {
      setStep(0);
      setSelectedSystem(null);
      setAnswers({});
    }
  };

  const handleRestart = () => {
    setStep(0);
    setSelectedSystem(null);
    setAnswers({});
    setShowResults(false);
  };

  const selectedSystemInfo = systemCategories.find(s => s.id === selectedSystem);
  const resultInfo = selectedSystem ? systemResults[selectedSystem] : null;
  const currentQuestion = step > 0 && step <= currentFollowUps.length ? currentFollowUps[step - 1] : null;

  // Build next action links with filters
  const getResultActions = () => {
    const filter = resultInfo?.rightsInsightFilter || "general";
    return [
      { 
        icon: FileText, 
        label: "Document what happened", 
        description: "Create a secure record of events and details", 
        href: "/self-help",
        requiresAuth: true
      },
      { 
        icon: FolderOpen, 
        label: "Gather evidence", 
        description: "Organize documents, photos, and records in your vault", 
        href: "/self-help",
        requiresAuth: true
      },
      { 
        icon: Phone, 
        label: "Contact oversight agencies", 
        description: "Find relevant complaint bodies and oversight agencies", 
        href: `/support-network?filter=${filter}`
      },
      { 
        icon: BookOpen, 
        label: "Learn how this system works", 
        description: "Educational guides about your rights and processes", 
        href: `/rights-insight?filter=${filter}`
      },
      { 
        icon: UserSearch, 
        label: "Find legal help", 
        description: "Attorneys, legal aid, and referral services", 
        href: "/find-help"
      },
    ];
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/60" />
        </div>
        
        <div className="container relative py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
                <Search className="w-4 h-4" />
                <span>Understand Your Situation</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Civil Rights Analyzer
              </h1>
              <p className="text-muted-foreground max-w-xl">
                Answer a few questions to understand your situation and discover resources that may help.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-12 lg:py-16">
        <div className="max-w-3xl mx-auto">
          {/* Progress indicator */}
          {!showResults && (
            <div className="flex items-center justify-center gap-2 mb-8">
              {Array.from({ length: Math.min(totalSteps, 3) }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i < step ? "bg-primary w-8" : i === step ? "bg-primary/60 w-6" : "bg-muted w-4"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Step 0: System Selection */}
          {step === 0 && !showResults && (
            <div className="space-y-4 animate-fade-up">
              <h2 className="text-xl font-semibold text-foreground text-center mb-6">
                Which system was involved in what you experienced?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {systemCategories.map((system) => (
                  <button
                    key={system.id}
                    onClick={() => handleSystemSelect(system.id)}
                    className="group p-4 rounded-xl bg-card border-2 border-border hover:border-primary/50 hover:shadow-glow text-left transition-all duration-200 cursor-pointer active:scale-[0.98]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:scale-105 transition-all">
                        <system.icon className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {system.label}
                          </p>
                          <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {system.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Follow-up Questions */}
          {step > 0 && currentQuestion && !showResults && (
            <div className="animate-fade-up">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Go back
              </button>

              <div className="p-6 rounded-2xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  {selectedSystemInfo && (
                    <>
                      <selectedSystemInfo.icon className="w-5 h-5 text-primary" />
                      <span className="text-sm text-primary font-medium">{selectedSystemInfo.label}</span>
                    </>
                  )}
                </div>

                <h2 className="text-xl font-semibold text-foreground mb-6">
                  {currentQuestion.question}
                </h2>

                <div className="space-y-3">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(currentQuestion.id, option.id)}
                      className="w-full p-4 rounded-xl bg-secondary border-2 border-transparent hover:border-primary/50 hover:bg-secondary/80 text-left transition-all duration-200 group cursor-pointer active:scale-[0.99]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {option.label}
                        </span>
                        <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results Page */}
          {showResults && resultInfo && (
            <div className="animate-fade-up">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Go back
              </button>

              {/* Plain-Language Summary */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  Based on what you shared
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your situation may involve {resultInfo.summary}. The information below can help you 
                  understand your options and take steps at your own pace.
                </p>
              </div>

              {/* What This Usually Means */}
              <div className="p-6 rounded-2xl bg-card border border-border mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">1</span>
                  What this usually means
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {resultInfo.whatThisMeans}
                </p>
              </div>

              {/* What People Often Misunderstand */}
              <div className="p-6 rounded-2xl bg-card border border-border mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent text-sm font-bold">2</span>
                  What people often misunderstand
                </h3>
                <ul className="space-y-3">
                  {resultInfo.misunderstandings.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center shrink-0 mt-0.5">
                        <X className="w-3 h-3 text-destructive" />
                      </span>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What Usually Helps First */}
              <div className="p-6 rounded-2xl bg-card border border-border mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center text-success text-sm font-bold">3</span>
                  What usually helps first
                </h3>
                <p className="text-sm text-muted-foreground mb-4 italic">
                  Not legal advice — just orientation on what people in similar situations often do.
                </p>
                <ul className="space-y-3">
                  {resultInfo.whatHelpsFirst.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs text-primary font-medium">{i + 1}</span>
                      </span>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Why These Tools Matter */}
              <div className="p-6 rounded-2xl bg-secondary/30 border border-border mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Why these tools matter for your situation
                </h3>
                <div className="space-y-4">
                  {resultInfo.whyToolsMatter.map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                        {item.tool === "Timeline Creator" && <Clock className="w-5 h-5 text-primary" />}
                        {item.tool === "Evidence Vault" && <FolderOpen className="w-5 h-5 text-primary" />}
                        {item.tool === "Notes" && <FileText className="w-5 h-5 text-primary" />}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{item.tool}</p>
                        <p className="text-sm text-muted-foreground">{item.why}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Actions */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Next Steps You Can Take
                </h3>
                <div className="space-y-3">
                  {getResultActions().map((action) => (
                    <Link
                      key={action.label}
                      to={action.href}
                      className="group flex items-center gap-4 p-4 rounded-xl bg-card border-2 border-border hover:border-primary/50 hover:shadow-glow transition-all duration-200 cursor-pointer active:scale-[0.99]"
                    >
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:scale-105 transition-all">
                        <action.icon className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {action.label}
                          {action.requiresAuth && (
                            <span className="ml-2 text-xs text-muted-foreground font-normal">(account required)</span>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Wellbeing Note */}
              <div className="p-5 rounded-xl bg-muted/50 border border-border mb-8">
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-foreground font-medium mb-1">Take your time</p>
                    <p className="text-sm text-muted-foreground">
                      Some experiences are difficult to revisit. You can pause, save, or return at any time. 
                      There's no pressure to do everything at once.
                    </p>
                  </div>
                </div>
              </div>

              {/* Micro-Disclaimer */}
              <Disclaimer variant="prominent" className="mb-8" />

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/self-help">
                    Start Documenting
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" onClick={handleRestart}>
                  Start Over
                </Button>
              </div>
            </div>
          )}

          {/* Bottom Disclaimer */}
          <div className="mt-12 pt-8 border-t border-border">
            <Disclaimer className="justify-center" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
