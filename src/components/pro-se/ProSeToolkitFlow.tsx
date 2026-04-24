import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AttorneyOutreachStep } from "@/components/pro-se/steps/AttorneyOutreachStep";
import { LegalAidStep } from "@/components/pro-se/steps/LegalAidStep";
import { CaseIntakeStep } from "@/components/pro-se/steps/CaseIntakeStep";
import { RiskAcknowledgmentStep } from "@/components/pro-se/steps/RiskAcknowledgmentStep";
import { proSeApi, ProSeAttorneyContact, ProSeLegalAidContact } from "@/lib/pro-se/api";
import { useAuth } from "@/contexts/AuthContext";

export function ProSeToolkitFlow() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [caseId, setCaseId] = useState<string>("");
  const [attorneyEntries, setAttorneyEntries] = useState<ProSeAttorneyContact[]>([]);
  const [legalAidEntries, setLegalAidEntries] = useState<ProSeLegalAidContact[]>([]);
  const [intake, setIntake] = useState({ caseSummary: "", keyEvents: "", goals: "", concerns: "" });
  const [riskAck, setRiskAck] = useState({ educationalOnly: false, withoutAttorneyRisk: false });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const activeCase = await proSeApi.getOrCreateCase(user.id);
      setCaseId(activeCase.id);
      setIntake((activeCase.intake_data?.intake as any) || { caseSummary: "", keyEvents: "", goals: "", concerns: "" });
      setRiskAck((activeCase.intake_data?.risk_ack as any) || { educationalOnly: false, withoutAttorneyRisk: false });
      const [attorneys, legalAid] = await Promise.all([
        proSeApi.listAttorneyContacts(activeCase.id),
        proSeApi.listLegalAidContacts(activeCase.id),
      ]);
      setAttorneyEntries(attorneys);
      setLegalAidEntries(legalAid);
    })().catch((error) => {
      console.error(error);
      toast({ title: "Could not load toolkit", variant: "destructive" });
    });
  }, [user, toast]);

  const stepComplete = useMemo(() => ({
    1: attorneyEntries.length >= 10,
    2: legalAidEntries.length >= 2,
    3: Object.values(intake).every((value) => !!value.trim()),
    4: riskAck.educationalOnly && riskAck.withoutAttorneyRisk,
  }), [attorneyEntries.length, legalAidEntries.length, intake, riskAck]);

  const saveCaseState = async (nextIntake = intake, nextRisk = riskAck) => {
    if (!caseId) return;
    await proSeApi.updateCaseIntake(caseId, {
      intake: nextIntake,
      risk_ack: nextRisk,
      toolkit_completed: Object.values(stepComplete).every(Boolean),
    });
  };

  const continueStep = async () => {
    await saveCaseState();
    if (step === 4) {
      if (!Object.values(stepComplete).every(Boolean)) {
        toast({ title: "Complete all required steps first" });
        return;
      }
      navigate("/pro-se-toolkit/dashboard");
      return;
    }

    if (!stepComplete[step as keyof typeof stepComplete]) {
      toast({ title: "Please complete this step before continuing." });
      return;
    }

    setStep((prev) => Math.min(prev + 1, 4));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground">Step {step} of 4</p>
      </div>

      {step === 1 && (
        <AttorneyOutreachStep
          entries={attorneyEntries as any}
          onAdd={async (entry) => {
            if (!caseId) return;
            await proSeApi.addAttorneyContact({ ...entry, case_id: caseId });
            setAttorneyEntries((prev) => [entry as any, ...prev]);
          }}
        />
      )}

      {step === 2 && (
        <LegalAidStep
          entries={legalAidEntries as any}
          onAdd={async (entry) => {
            if (!caseId) return;
            await proSeApi.addLegalAidContact({ ...entry, case_id: caseId });
            setLegalAidEntries((prev) => [entry as any, ...prev]);
          }}
        />
      )}

      {step === 3 && (
        <CaseIntakeStep
          value={intake}
          onChange={(value) => {
            setIntake(value);
            saveCaseState(value, riskAck).catch(console.error);
          }}
        />
      )}

      {step === 4 && (
        <RiskAcknowledgmentStep
          educationalOnly={riskAck.educationalOnly}
          withoutAttorneyRisk={riskAck.withoutAttorneyRisk}
          onChange={(value) => {
            setRiskAck(value);
            saveCaseState(intake, value).catch(console.error);
          }}
        />
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep((prev) => Math.max(prev - 1, 1))} disabled={step === 1}>
          Back
        </Button>
        <Button onClick={continueStep}>{step === 4 ? "Open Dashboard" : "Continue"}</Button>
      </div>
    </div>
  );
}
