import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  ArrowLeft,
  Building2,
  Briefcase,
  Home,
  GraduationCap,
  Stethoscope,
  Scale,
  Building,
  Users,
  AlertCircle,
  FileText,
  FolderOpen,
  Phone,
  BookOpen,
  UserSearch,
  CheckCircle2
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";

// System categories for the first question
const systemCategories = [
  { id: "police", label: "Police / Law Enforcement", icon: Building2, description: "Interactions with police, arrests, use of force, traffic stops" },
  { id: "employer", label: "Employer / Workplace", icon: Briefcase, description: "Discrimination, harassment, retaliation, wrongful termination" },
  { id: "housing", label: "Housing / Landlord", icon: Home, description: "Eviction, discrimination, habitability, lease disputes" },
  { id: "school", label: "School / Education", icon: GraduationCap, description: "Student rights, discrimination, disciplinary actions, IEP/504" },
  { id: "healthcare", label: "Healthcare Provider", icon: Stethoscope, description: "Medical negligence, discrimination, privacy violations" },
  { id: "courts", label: "Courts / Legal System", icon: Scale, description: "Due process, access to justice, court procedures" },
  { id: "jail", label: "Jail / Prison", icon: Building, description: "Conditions, medical care, visitation, reentry" },
  { id: "government", label: "Government Agency", icon: Users, description: "Benefits, licensing, permits, administrative actions" },
];

// Follow-up questions based on system
const followUpQuestions: Record<string, { question: string; options: { id: string; label: string }[] }[]> = {
  police: [
    {
      question: "What type of interaction occurred?",
      options: [
        { id: "arrest", label: "Arrest or detention" },
        { id: "force", label: "Use of force" },
        { id: "search", label: "Search of person or property" },
        { id: "stop", label: "Traffic or pedestrian stop" },
        { id: "other", label: "Other interaction" },
      ]
    },
    {
      question: "When did this occur?",
      options: [
        { id: "recent", label: "Within the last week" },
        { id: "month", label: "Within the last month" },
        { id: "year", label: "Within the last year" },
        { id: "older", label: "More than a year ago" },
      ]
    }
  ],
  employer: [
    {
      question: "What type of workplace issue is this?",
      options: [
        { id: "discrimination", label: "Discrimination" },
        { id: "harassment", label: "Harassment" },
        { id: "retaliation", label: "Retaliation for reporting" },
        { id: "termination", label: "Wrongful termination" },
        { id: "wages", label: "Wage or hour violations" },
        { id: "other", label: "Other workplace issue" },
      ]
    },
    {
      question: "Are you currently employed at this workplace?",
      options: [
        { id: "yes", label: "Yes, still employed" },
        { id: "no", label: "No longer employed" },
        { id: "leave", label: "On leave or suspended" },
      ]
    }
  ],
  // Default follow-up for other systems
  default: [
    {
      question: "How would you describe the situation?",
      options: [
        { id: "ongoing", label: "This is ongoing" },
        { id: "recent", label: "This happened recently" },
        { id: "past", label: "This happened in the past" },
      ]
    },
    {
      question: "Have you documented what happened?",
      options: [
        { id: "yes", label: "Yes, I have documentation" },
        { id: "some", label: "Some, but not complete" },
        { id: "no", label: "Not yet" },
      ]
    }
  ]
};

const resultActions = [
  { icon: FileText, label: "Document what happened", description: "Create a secure record of events", href: "/self-help" },
  { icon: FolderOpen, label: "Gather evidence", description: "Organize documents, photos, and records", href: "/self-help" },
  { icon: Phone, label: "Contact oversight agencies", description: "Find relevant complaint bodies", href: "/support-network" },
  { icon: BookOpen, label: "Learn how the system works", description: "Educational guides and resources", href: "/rights-insight" },
  { icon: UserSearch, label: "Find legal help", description: "Attorneys and legal aid services", href: "/find-help" },
];

export default function Analyzer() {
  const [step, setStep] = useState(0);
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const currentFollowUps = selectedSystem 
    ? (followUpQuestions[selectedSystem] || followUpQuestions.default)
    : [];

  const handleSystemSelect = (systemId: string) => {
    setSelectedSystem(systemId);
    setStep(1);
  };

  const handleAnswer = (answerId: string) => {
    const newAnswers = [...answers, answerId];
    setAnswers(newAnswers);
    
    if (step < currentFollowUps.length) {
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
      setAnswers(answers.slice(0, -1));
    } else if (step === 1) {
      setStep(0);
      setSelectedSystem(null);
      setAnswers([]);
    }
  };

  const handleRestart = () => {
    setStep(0);
    setSelectedSystem(null);
    setAnswers([]);
    setShowResults(false);
  };

  const selectedSystemInfo = systemCategories.find(s => s.id === selectedSystem);

  return (
    <Layout>
      <div className="container py-12 lg:py-20">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Civil Rights Analyzer
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Answer a few questions to understand your situation and discover what resources may help you.
            </p>
          </div>

          {/* Progress indicator */}
          {!showResults && (
            <div className="flex items-center justify-center gap-2 mb-8">
              {[0, 1, 2].map((s) => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    s <= step ? "bg-primary w-8" : "bg-muted w-4"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Step 0: System Selection */}
          {step === 0 && !showResults && (
            <div className="space-y-4 animate-fade-up">
              <h2 className="text-lg font-medium text-foreground text-center mb-6">
                Which system or institution is involved?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {systemCategories.map((system) => (
                  <button
                    key={system.id}
                    onClick={() => handleSystemSelect(system.id)}
                    className="group p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-glow text-left transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                        <system.icon className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {system.label}
                        </p>
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
          {step > 0 && step <= currentFollowUps.length && !showResults && (
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
                  {currentFollowUps[step - 1]?.question}
                </h2>

                <div className="space-y-3">
                  {currentFollowUps[step - 1]?.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(option.id)}
                      className="w-full p-4 rounded-xl bg-secondary/50 border border-transparent hover:border-primary/50 hover:bg-secondary text-left transition-all duration-200 group"
                    >
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {showResults && (
            <div className="animate-fade-up">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Go back
              </button>

              {/* Summary Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                      Analysis Complete
                    </h2>
                    <p className="text-muted-foreground">
                      Based on your answers, here's what may be relevant to your situation involving{" "}
                      <span className="text-foreground font-medium">{selectedSystemInfo?.label.toLowerCase()}</span>.
                    </p>
                  </div>
                </div>
              </div>

              {/* What This May Involve */}
              <div className="p-6 rounded-2xl bg-card border border-border mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  What This May Involve
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Issues with {selectedSystemInfo?.label.toLowerCase()} can involve various rights and procedures. 
                  Understanding the relevant laws, agencies, and timelines is often an important first step.
                </p>
                <Disclaimer variant="prominent" />
              </div>

              {/* Next Actions */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Recommended Next Steps
                </h3>
                <div className="space-y-3">
                  {resultActions.map((action) => (
                    <Link
                      key={action.label}
                      to={action.href}
                      className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-glow transition-all duration-200"
                    >
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                        <action.icon className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {action.label}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Wellbeing Note */}
              <div className="p-4 rounded-xl bg-muted/50 border border-border mb-8">
                <p className="text-sm text-muted-foreground text-center">
                  <strong className="text-foreground">Take your time.</strong> You can pause, skip sections, or return to this later. 
                  There's no rush.
                </p>
              </div>

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
