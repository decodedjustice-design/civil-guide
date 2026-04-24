import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { EducationalUseBanner } from "@/components/pro-se/EducationalUseBanner";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { proSeApi, ProSeCaseRow } from "@/lib/pro-se/api";
import { generateCaseInsights } from "@/lib/pro-se/generateCaseInsights";
import { EvidenceManager } from "@/components/pro-se/dashboard/EvidenceManager";
import { ClaimExplorer } from "@/components/pro-se/dashboard/ClaimExplorer";
import { DocumentBuilder } from "@/components/pro-se/dashboard/DocumentBuilder";
import { TimelineTracker } from "@/components/pro-se/dashboard/TimelineTracker";
import { ProcessGuide } from "@/components/pro-se/dashboard/ProcessGuide";

export default function ProSeDashboard() {
  const { user } = useAuth();
  const [activeCase, setActiveCase] = useState<ProSeCaseRow | null>(null);
  const [evidence, setEvidence] = useState<any[]>([]);
  const [attorneyCount, setAttorneyCount] = useState(0);
  const [legalAidCount, setLegalAidCount] = useState(0);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!user) return;

    (async () => {
      const currentCase = await proSeApi.getOrCreateCase(user.id);
      const completed = Boolean(currentCase.intake_data?.toolkit_completed);
      if (!completed) {
        window.location.replace("/pro-se-toolkit");
        return;
      }

      setActiveCase(currentCase);
      const [ev, attorneys, legalAid] = await Promise.all([
        proSeApi.listEvidenceFiles(currentCase.id),
        proSeApi.listAttorneyContacts(currentCase.id),
        proSeApi.listLegalAidContacts(currentCase.id),
      ]);
      setEvidence(ev);
      setAttorneyCount(attorneys.length);
      setLegalAidCount(legalAid.length);
    })().catch(console.error);
  }, [user]);

  if (!user) {
    return (
      <Layout>
        <div className="container max-w-2xl py-14">
          <EducationalUseBanner />
          <h1 className="font-serif text-2xl mt-4">Sign in required</h1>
          <Button asChild className="mt-4"><Link to="/auth?redirect=/pro-se-toolkit/dashboard">Sign In</Link></Button>
        </div>
      </Layout>
    );
  }

  const intake = (activeCase?.intake_data?.intake as Record<string, string>) || {
    caseSummary: "", keyEvents: "", goals: "", concerns: "",
  };

  const insights = generateCaseInsights({
    outreachCount: attorneyCount,
    legalAidCount,
    intakeData: intake,
  });

  return (
    <Layout>
      <div className="container max-w-6xl py-10 space-y-6">
        <EducationalUseBanner />
        <div>
          <h1 className="font-serif text-3xl">Pro Se Dashboard</h1>
          <p className="text-muted-foreground">Educational planning workspace with organization-first tools.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Case Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Information completeness level:</strong> {insights.completenessLevel}</p>
            <div>
              <p className="font-medium">Areas that may need more detail</p>
              <ul className="list-disc pl-5 text-muted-foreground">
                {(insights.areasNeedingDetail.length ? insights.areasNeedingDetail : ["No major gaps detected right now."]).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-medium">General considerations</p>
              <ul className="list-disc pl-5 text-muted-foreground">
                {insights.generalConsiderations.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          <EvidenceManager
            items={evidence}
            onAdd={async (item) => {
              if (!activeCase) return;
              await proSeApi.addEvidenceFile({ ...item, case_id: activeCase.id });
              setEvidence((prev) => [{ ...item, case_id: activeCase.id }, ...prev]);
            }}
          />
          <ClaimExplorer notes={notes} onNotesChange={setNotes} />
          <DocumentBuilder intake={intake} notes={notes} />
          <TimelineTracker />
        </div>

        <ProcessGuide />
      </div>
    </Layout>
  );
}
