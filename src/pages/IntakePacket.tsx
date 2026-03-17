import { useState } from "react";
import { useIntakePrefill } from "@/hooks/useIntakePrefill";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { IntakePacketForm, IntakeFormData } from "@/components/intake/IntakePacketForm";
import { IntakePacketPreview } from "@/components/intake/IntakePacketPreview";
import { CaseBriefViewer } from "@/components/intake/CaseBriefViewer";
import { useIntakePacket } from "@/hooks/useIntakePacket";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, ArrowLeft, LogIn } from "lucide-react";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { NextStepBanner } from "@/components/shared/NextStepBanner";
import { EducationalNotice } from "@/components/shared/EducationalNotice";

type ViewState = "form" | "preview";
type Mode = "brief" | "packet";

export default function IntakePacket() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const attorneyId = searchParams.get("attorneyId") || undefined;
  const attorneyName = searchParams.get("attorneyName") || undefined;
  const attorneyFirm = searchParams.get("attorneyFirm") || undefined;

  const [mode, setMode] = useState<Mode>("brief");
  const [viewState, setViewState] = useState<ViewState>("form");
  const [formData, setFormData] = useState<IntakeFormData | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const { prefillData, isLoading: isPrefillLoading } = useIntakePrefill();
  const { isSaving, savedPacket, savePacket } = useIntakePacket({
    attorneyId,
    attorneyName,
    attorneyFirm,
  });

  const handleFormSubmit = (data: IntakeFormData) => {
    setFormData(data);
    setViewState("preview");
  };

  const handleExportPDF = async () => {
    if (!formData) return;
    setIsExporting(true);
    try {
      const printWindow = window.open("", "_blank");
      if (!printWindow) return;
      printWindow.document.write(`<html><body>${document.getElementById("intake-packet-content")?.innerHTML || ""}</body></html>`);
      printWindow.document.close();
      printWindow.print();
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveAndClose = async () => {
    if (!formData) return;
    const packetId = await savePacket(formData);
    if (packetId) navigate(attorneyId ? "/attorney-contacts" : "/self-help");
  };

  if (!user) {
    return (
      <Layout>
        <div className="container max-w-2xl mx-auto px-4 py-12">
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h1 className="text-xl font-semibold mb-2">Sign In Required</h1>
              <p className="text-muted-foreground mb-6">Please sign in to create and save Attorney Intake Packets.</p>
              <Button asChild>
                <Link to={`/auth?redirect=/intake-packet${window.location.search}`}>
                  <LogIn className="w-4 h-4 mr-2" />Sign In
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
      <div className="container max-w-4xl mx-auto px-4 pt-6"><EducationalNotice /></div>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4"><ArrowLeft className="w-4 h-4 mr-1" />Back</Button>
        <div className="flex items-center gap-3 mb-2"><FileText className="w-8 h-8 text-primary" /><h1 className="text-2xl font-bold text-foreground">Attorney Intake Tools</h1></div>
        <p className="text-muted-foreground mb-6">Generate an attorney-readable brief automatically from your saved workspace data, or use the manual packet builder.</p>

        <div className="flex gap-2 mb-6">
          <Button variant={mode === "brief" ? "default" : "outline"} onClick={() => setMode("brief")}>Case Brief Generator (Auto)</Button>
          <Button variant={mode === "packet" ? "default" : "outline"} onClick={() => setMode("packet")}>Manual Intake Packet</Button>
        </div>

        {mode === "brief" ? (
          <CaseBriefViewer />
        ) : viewState === "form" ? (
          <IntakePacketForm
            attorneyId={attorneyId}
            attorneyName={attorneyName}
            attorneyFirm={attorneyFirm}
            onSubmit={handleFormSubmit}
            onCancel={() => navigate(-1)}
            prefillData={isPrefillLoading ? null : prefillData}
          />
        ) : formData ? (
          <IntakePacketPreview
            data={formData}
            attorneyName={attorneyName}
            attorneyFirm={attorneyFirm}
            onExportPDF={handleExportPDF}
            onCopyText={() => undefined}
            onSaveAndClose={handleSaveAndClose}
            isExporting={isExporting}
            isSaving={isSaving}
            packetId={savedPacket?.id}
          />
        ) : null}

        <NextStepBanner heading="When your packet is ready" steps={[{ label: "Find legal help", description: "Search for attorneys who handle your type of case.", href: "/find-help" }, { label: "Track attorney outreach", description: "Log consultations and follow-ups.", href: "/attorney-contacts" }]} />
        <div className="mt-8"><Disclaimer variant="prominent" /></div>
      </div>
    </Layout>
  );
}
