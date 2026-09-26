import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { EducationalNotice } from "@/components/shared/EducationalNotice";
import { DjPageHeader } from "@/components/ui/dj-page-header";
import { NarrativeCaseBuilder } from "@/components/case-builder/NarrativeCaseBuilder";
import { LogIn, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function CaseBuilder() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Layout>
        <div className="container max-w-2xl mx-auto px-4 py-12">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-xl font-semibold mb-2">Case Builder</h1>
              <p className="text-muted-foreground mb-6">
                Start with your story. Decoded Justice will help organize the details into your case workspace as you go.
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

  return (
    <Layout>
      <DjPageHeader
        title="Case Builder"
        subtitle="Tell your story once. Build your timeline, evidence, people, issues, and case record as you go."
        variant="espresso"
      />

      <div className="container max-w-7xl mx-auto px-4 py-8">
        <EducationalNotice />

        <div className="my-6 p-4 rounded-xl bg-accent/5 border border-accent/20 flex items-start gap-3">
          <Heart className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            Start anywhere and pause whenever you need to. Your original story is preserved, and the structured case record grows alongside it.
          </p>
        </div>

        <NarrativeCaseBuilder />

        <div className="mt-12">
          <Disclaimer variant="prominent" />
        </div>
      </div>
    </Layout>
  );
}
