import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { JusticePlaceIntake } from "@/components/justice-place/JusticePlaceIntake";
import { CaseHeader } from "@/components/justice-place/CaseHeader";
import { JusticePlaceSections } from "@/components/justice-place/JusticePlaceSections";
import { useJusticePlace, CaseStatus } from "@/hooks/useJusticePlace";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, LogIn, Heart } from "lucide-react";
import { Disclaimer } from "@/components/shared/Disclaimer";

export default function JusticePlace() {
  const {
    user,
    caseData,
    bookmarks,
    isLoading,
    isSaving,
    needsIntake,
    createCase,
    updateCase,
    removeBookmark,
  } = useJusticePlace();

  // Not logged in
  if (!user) {
    return (
      <Layout>
        <div className="container max-w-2xl mx-auto px-4 py-12">
          <Card>
            <CardContent className="p-8 text-center">
              <Shield className="w-12 h-12 mx-auto text-primary mb-4" />
              <h1 className="text-xl font-semibold mb-2">Welcome to Justice Place</h1>
              <p className="text-muted-foreground mb-6">
                Sign in to access your personal, private workspace for organizing 
                your civil rights situation.
              </p>
              <Button asChild>
                <Link to="/auth?redirect=/justice-place">
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

  // Loading
  if (isLoading) {
    return (
      <Layout>
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <Skeleton className="h-32 w-full mb-6" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </Layout>
    );
  }

  // Needs intake (first time setup)
  if (needsIntake) {
    return (
      <JusticePlaceIntake
        onSubmit={createCase}
        isSubmitting={isSaving}
      />
    );
  }

  // Main dashboard
  if (!caseData) {
    return null;
  }

  const handleUpdateCase = async (updates: { caseName?: string; caseStatus?: CaseStatus }) => {
    return updateCase(updates);
  };

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Wellbeing Note */}
        <div className="mb-6 p-4 rounded-xl bg-accent/5 border border-accent/20 flex items-start gap-3">
          <Heart className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground font-medium mb-1">
              This is your space
            </p>
            <p className="text-sm text-muted-foreground">
              Take your time here. Everything is saved automatically, and you can return 
              whenever you're ready. Nothing here is filed unless you choose.
            </p>
          </div>
        </div>

        {/* Case Header */}
        <div className="mb-8">
          <CaseHeader
            caseData={caseData}
            onUpdate={handleUpdateCase}
            isSaving={isSaving}
          />
        </div>

        {/* Main Sections */}
        <JusticePlaceSections
          bookmarks={bookmarks}
          onRemoveBookmark={removeBookmark}
        />

        {/* Disclaimer */}
        <div className="mt-8">
          <Disclaimer variant="prominent" />
        </div>
      </div>
    </Layout>
  );
}
