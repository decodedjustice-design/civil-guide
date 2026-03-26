import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { EducationalNotice } from "@/components/shared/EducationalNotice";
import { DjPageHeader } from "@/components/ui/dj-page-header";
import { CaseBuilderProgress } from "@/components/case-builder/CaseBuilderProgress";
import { IncidentIntakeStep } from "@/components/case-builder/IncidentIntakeStep";
import { EvidenceVaultStep } from "@/components/case-builder/EvidenceVaultStep";
import { TimelineBuilderStep } from "@/components/case-builder/TimelineBuilderStep";
import { LegalIssueMappingStep } from "@/components/case-builder/LegalIssueMappingStep";
import { CasePacketStep } from "@/components/case-builder/CasePacketStep";
import { useCaseBuilder, CASE_BUILDER_STEPS } from "@/hooks/useCaseBuilder";
import { LogIn, Heart } from "lucide-react";

export default function CaseBuilder() {
  const {
    user,
    currentStep,
    currentStepIndex,
    progress,
    progressPercent,
    isLoading,
    goToStep,
    goNext,
    goBack,
    isStepComplete,
    isStepUnlocked,
    refetchProgress,
  } = useCaseBuilder();

  // Not logged in
  if (!user) {
    return (
      <Layout>
        <div className="container max-w-2xl mx-auto px-4 py-12">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-xl font-semibold mb-2">Case Builder</h1>
              <p className="text-muted-foreground mb-6">
                Sign in to build your case step by step — from intake to a ready-to-share case packet.
              </p>
              <Button asChild>
                <Link to="/auth?redirect=/case-builder">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In to Continue
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container max-w-3xl mx-auto px-4 py-8">
          <Skeleton className="h-12 w-full mb-6" />
          <Skeleton className="h-32 w-full mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>
      </Layout>
    );
  }

  const currentStepData = CASE_BUILDER_STEPS[currentStepIndex];

  const handleIntakeComplete = () => {
    refetchProgress();
    goNext();
  };

  return (
    <Layout>
      <DjPageHeader
        title="Case Builder"
        subtitle="Follow one guided flow to produce a clear, attorney-ready case packet."
        variant="espresso"
      />

      <div className="container max-w-3xl mx-auto px-4 py-8">
        <EducationalNotice />

        {/* Wellbeing note */}
        <div className="mb-6 p-4 rounded-xl bg-accent/5 border border-accent/20 flex items-start gap-3">
          <Heart className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            You can pause at any step and return later. Everything is saved automatically.
          </p>
        </div>

        {/* Progress tracker */}
        <div className="mb-8 p-5 rounded-xl bg-card border border-border">
          <CaseBuilderProgress
            currentStep={currentStep}
            isStepComplete={isStepComplete}
            isStepUnlocked={isStepUnlocked}
            onStepClick={goToStep}
            progressPercent={progressPercent}
          />
        </div>

        {/* Current step header */}
        <div className="mb-6">
          <h2 className="font-serif text-2xl font-medium text-foreground">
            Step {currentStepIndex + 1}: {currentStepData.label}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">{currentStepData.description}</p>
        </div>

        {/* Step content */}
        {currentStep === "incident-intake" && (
          <IncidentIntakeStep
            onComplete={handleIntakeComplete}
            isAlreadyComplete={isStepComplete("incident-intake")}
          />
        )}
        {currentStep === "timeline-builder" && (
          <TimelineBuilderStep
            onNext={goNext}
            onBack={goBack}
            timelineCount={progress.timelineCount}
          />
        )}
        {currentStep === "evidence-vault" && (
          <EvidenceVaultStep
            onNext={goNext}
            onBack={goBack}
            evidenceCount={progress.evidenceCount}
          />
        )}
        {currentStep === "legal-issue-mapping" && (
          <LegalIssueMappingStep
            onNext={goNext}
            onBack={goBack}
            isComplete={isStepComplete("legal-issue-mapping")}
          />
        )}
        {currentStep === "case-packet" && (
          <CasePacketStep
            onBack={goBack}
            progress={progress}
          />
        )}

        {/* Disclaimer */}
        <div className="mt-12">
          <Disclaimer variant="prominent" />
        </div>
      </div>
    </Layout>
  );
}
