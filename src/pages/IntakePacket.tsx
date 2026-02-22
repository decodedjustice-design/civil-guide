import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { IntakePacketForm, IntakeFormData } from "@/components/intake/IntakePacketForm";
import { IntakePacketPreview } from "@/components/intake/IntakePacketPreview";
import { useIntakePacket } from "@/hooks/useIntakePacket";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, ArrowLeft, LogIn } from "lucide-react";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { EducationalNotice } from "@/components/shared/EducationalNotice";

type ViewState = "form" | "preview";

export default function IntakePacket() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Get attorney info from URL params (when generated from attorney profile)
  const attorneyId = searchParams.get("attorneyId") || undefined;
  const attorneyName = searchParams.get("attorneyName") || undefined;
  const attorneyFirm = searchParams.get("attorneyFirm") || undefined;

  const [viewState, setViewState] = useState<ViewState>("form");
  const [formData, setFormData] = useState<IntakeFormData | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const { isSaving, savedPacket, savePacket } = useIntakePacket({
    attorneyId,
    attorneyName,
    attorneyFirm,
  });

  const handleFormSubmit = (data: IntakeFormData) => {
    setFormData(data);
    setViewState("preview");
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleExportPDF = async () => {
    if (!formData) return;

    setIsExporting(true);

    try {
      // Use browser print for PDF generation
      const printContent = document.getElementById("intake-packet-content");
      if (printContent) {
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Attorney Intake Packet</title>
                <style>
                  body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    padding: 40px;
                    max-width: 800px;
                    margin: 0 auto;
                    color: #1a1a1a;
                    line-height: 1.6;
                  }
                  h1 { font-size: 24px; margin-bottom: 8px; }
                  h2 { font-size: 18px; margin-top: 24px; margin-bottom: 12px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px; }
                  .warning { 
                    background: #fef3cd; 
                    border: 1px solid #ffc107; 
                    padding: 16px; 
                    border-radius: 8px; 
                    margin-bottom: 24px;
                  }
                  .warning-title { font-weight: 600; margin-bottom: 4px; }
                  .section { margin-bottom: 24px; }
                  .label { color: #666; font-size: 14px; }
                  .value { font-weight: 500; }
                  .badge { 
                    display: inline-block;
                    padding: 4px 12px;
                    background: #f0f0f0;
                    border-radius: 4px;
                    margin: 4px 4px 4px 0;
                    font-size: 14px;
                  }
                  .disclaimer {
                    margin-top: 40px;
                    padding: 16px;
                    background: #f5f5f5;
                    border-radius: 8px;
                    font-size: 12px;
                    color: #666;
                    text-align: center;
                  }
                  @media print {
                    body { padding: 20px; }
                  }
                </style>
              </head>
              <body>
                <div class="warning">
                  <div class="warning-title">⚠️ INITIAL INQUIRY ONLY — CONFLICT CHECK REQUIRED</div>
                  <div>Do not send evidence until attorney confirms no conflict of interest.</div>
                </div>
                
                <h1>Attorney Intake Packet</h1>
                <p>Generated: ${new Date().toLocaleDateString()}</p>
                ${attorneyName ? `<p>Prepared for: ${attorneyName}${attorneyFirm ? `, ${attorneyFirm}` : ""}</p>` : ""}
                
                <h2>1. Case Overview</h2>
                <div class="section">
                  <p><span class="label">Case Name:</span> <span class="value">${formData.caseName}</span></p>
                  <p><span class="label">County:</span> <span class="value">${formData.county} County, Washington</span></p>
                  <p><span class="label">Incident Month/Year:</span> <span class="value">${formData.incidentMonthYear}</span></p>
                  <p><span class="label">Issue Type:</span> <span class="value">${formData.issueType}</span></p>
                  <p><span class="label">Opposing Party:</span> <span class="value">${formData.opposingParty}</span></p>
                  <p><span class="label">Case Status:</span> <span class="value">${formData.caseStatus}</span></p>
                </div>
                
                <h2>2. Case Narrative</h2>
                <div class="section">
                  <p>${formData.narrative.replace(/\n/g, "<br>")}</p>
                </div>
                
                <h2>3. Applicable Issues</h2>
                <div class="section">
                  ${formData.issuesChecklist.map((issue) => `<span class="badge">${issue}</span>`).join("")}
                </div>
                
                <h2>4. Evidence Snapshot</h2>
                <div class="section">
                  <p>${formData.evidenceItems ? formData.evidenceItems.replace(/\n/g, "<br>") : "No evidence items listed"}</p>
                  <p><em>Note: No files attached. Evidence provided after conflict clearance.</em></p>
                </div>
                
                <h2>5. Deadline Awareness</h2>
                <div class="section">
                  <p>${formData.incidentDate ? `Incident Date: ${formData.incidentDate}` : "Specific incident date not provided."}</p>
                  <p><em>Consult attorney for specific deadline calculations.</em></p>
                </div>
                
                <h2>6. Contact Information</h2>
                <div class="section">
                  <p><span class="label">Name:</span> <span class="value">${formData.contactName}</span></p>
                  ${formData.contactEmail ? `<p><span class="label">Email:</span> <span class="value">${formData.contactEmail}</span></p>` : ""}
                  ${formData.contactPhone ? `<p><span class="label">Phone:</span> <span class="value">${formData.contactPhone}</span></p>` : ""}
                  <p><span class="label">Preferred Contact:</span> <span class="value">${formData.contactPreferredMethod}</span></p>
                </div>
                
                <div class="disclaimer">
                  This document is for educational and informational purposes only. 
                  It does not constitute legal advice and does not create an attorney-client relationship.
                </div>
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.print();
        }
      }
    } catch (err) {
      console.error("PDF export error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyText = () => {
    // Copy is handled in IntakePacketPreview
  };

  const handleSaveAndClose = async () => {
    if (!formData) return;

    const packetId = await savePacket(formData);
    if (packetId) {
      // Navigate to exports or back to attorney contacts
      if (attorneyId) {
        navigate("/attorney-contacts");
      } else {
        navigate("/self-help");
      }
    }
  };

  // Require authentication
  if (!user) {
    return (
      <Layout>
        <div className="container max-w-2xl mx-auto px-4 py-12">
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h1 className="text-xl font-semibold mb-2">Sign In Required</h1>
              <p className="text-muted-foreground mb-6">
                Please sign in to create and save Attorney Intake Packets.
              </p>
              <Button asChild>
                <Link to={`/auth?redirect=/intake-packet${window.location.search}`}>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
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
      <div className="container max-w-3xl mx-auto px-4 pt-6">
        <EducationalNotice />
      </div>
      <div className="container max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">
              Attorney Intake Packet
            </h1>
          </div>
          <p className="text-muted-foreground">
            Generate a conflict-safe initial inquiry packet for attorney consultation.
          </p>
        </div>

        {/* Form or Preview */}
        {viewState === "form" ? (
          <IntakePacketForm
            attorneyId={attorneyId}
            attorneyName={attorneyName}
            attorneyFirm={attorneyFirm}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        ) : formData ? (
          <IntakePacketPreview
            data={formData}
            attorneyName={attorneyName}
            attorneyFirm={attorneyFirm}
            onExportPDF={handleExportPDF}
            onCopyText={handleCopyText}
            onSaveAndClose={handleSaveAndClose}
            isExporting={isExporting}
            isSaving={isSaving}
            packetId={savedPacket?.id}
          />
        ) : null}

        {/* Educational Disclaimer */}
        <div className="mt-8">
          <Disclaimer variant="prominent" />
        </div>
      </div>
    </Layout>
  );
}
