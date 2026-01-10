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
  Search
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

// System-specific result content
const systemResults: Record<SystemId, SystemResult> = {
  police: {
    summary: "issues related to police or law enforcement",
    explanation: "Interactions with police can raise questions about constitutional rights, use of force policies, complaint procedures, and oversight agencies. Documentation and understanding timelines for complaints are often important first steps.",
    rightsInsightFilter: "police",
    supportNetworkFilter: "police",
  },
  employer: {
    summary: "workplace or employment-related issues",
    explanation: "Employment issues may involve federal or state anti-discrimination laws, internal HR processes, or external agencies like the EEOC. Understanding relevant deadlines and documentation requirements can be important.",
    rightsInsightFilter: "employment",
    supportNetworkFilter: "employment",
  },
  housing: {
    summary: "housing or landlord-related issues",
    explanation: "Housing issues may involve fair housing laws, tenant rights, habitability standards, or eviction procedures. Understanding local laws and available advocacy resources can help you navigate the situation.",
    rightsInsightFilter: "housing",
    supportNetworkFilter: "housing",
  },
  school: {
    summary: "school or education-related issues",
    explanation: "Education issues may involve student rights, due process for discipline, special education laws (IDEA, Section 504), or anti-discrimination protections. Understanding your rights and the school's obligations is often a key first step.",
    rightsInsightFilter: "education",
    supportNetworkFilter: "education",
  },
  healthcare: {
    summary: "healthcare provider-related issues",
    explanation: "Healthcare issues may involve patient rights, medical privacy (HIPAA), non-discrimination in care, or access to medical records. Understanding complaint processes and patient advocacy resources can be helpful.",
    rightsInsightFilter: "healthcare",
    supportNetworkFilter: "healthcare",
  },
  courts: {
    summary: "court or legal system issues",
    explanation: "Court-related issues may involve due process rights, access to counsel, procedural requirements, or appeal processes. Understanding court procedures and available legal resources is often essential.",
    rightsInsightFilter: "courts",
    supportNetworkFilter: "courts",
  },
  jail: {
    summary: "jail or prison-related issues",
    explanation: "Incarceration issues may involve conditions of confinement, access to medical care, communication rights, or grievance procedures. Understanding available advocacy channels and oversight bodies can be important.",
    rightsInsightFilter: "incarceration",
    supportNetworkFilter: "incarceration",
  },
  government: {
    summary: "government agency-related issues",
    explanation: "Government agency issues may involve administrative procedures, benefit determinations, licensing decisions, or records requests. Understanding appeal processes and relevant deadlines is often critical.",
    rightsInsightFilter: "government",
    supportNetworkFilter: "government",
  },
  unsure: {
    summary: "a situation that may involve multiple systems or issues",
    explanation: "It's okay not to be sure which system applies. Many situations involve overlapping issues or multiple institutions. Gathering information and documenting what happened can help clarify next steps.",
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

              {/* What This Usually Involves */}
              <div className="p-6 rounded-2xl bg-card border border-border mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  What This Usually Involves
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {resultInfo.explanation}
                </p>
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
