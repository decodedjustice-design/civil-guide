import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Filter, UserPlus, Phone, ExternalLink, BriefcaseBusiness, ShieldCheck, AlertTriangle } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { sampleAttorneys, PRACTICE_AREAS, WA_COUNTIES, FEE_TYPES, type Attorney } from "@/data/attorneyData";
import { useCaseSnapshot } from "@/hooks/useCaseSnapshot";
import { Disclaimer } from "@/components/shared/Disclaimer";

function casePracticeAreas(issues: { title: string; category?: string | null }[]) {
  const text = issues.map((i) => `${i.title} ${i.category ?? ""}`).join(" ").toLowerCase();
  const areas = new Set<string>();
  if (/police|law enforcement|excessive force|arrest|constitutional|§ 1983/.test(text)) {
    areas.add("Civil Rights"); areas.add("Police Misconduct");
  }
  if (/housing|landlord|eviction|accommodation|discrimination/.test(text)) areas.add("Housing Discrimination");
  if (/employment|workplace|termination|retaliation/.test(text)) areas.add("Employment Discrimination");
  if (/disability|ada|section 504/.test(text)) areas.add("Disability Rights");
  if (/family|dependency|child welfare|dcyd|cps/.test(text)) areas.add("Family Defense");
  return [...areas];
}

function fitLabels(attorney: Attorney, caseAreas: string[]) {
  return attorney.practiceAreas.filter((area) => caseAreas.includes(area));
}

export default function AttorneySearch() {
  const [params] = useSearchParams();
  const caseId = params.get("caseId");
  const { user } = useAuth();
  const { toast } = useToast();
  const { snapshot } = useCaseSnapshot(caseId ?? undefined);
  const [query, setQuery] = useState("");
  const [practice, setPractice] = useState("all");
  const [county, setCounty] = useState("all");
  const [fee, setFee] = useState("all");
  const [saving, setSaving] = useState<string | null>(null);

  const caseAreas = useMemo(() => casePracticeAreas(snapshot?.issues ?? []), [snapshot?.issues]);

  const results = useMemo(() => sampleAttorneys
    .filter((a) => {
      const q = query.trim().toLowerCase();
      const searchMatch = !q || [a.name, a.firm, a.city, ...a.practiceAreas].join(" ").toLowerCase().includes(q);
      return searchMatch
        && (practice === "all" || a.practiceAreas.includes(practice))
        && (county === "all" || a.counties.includes(county))
        && (fee === "all" || a.feeTypes.includes(fee));
    })
    .sort((a, b) => {
      if (!caseAreas.length) return a.firm.localeCompare(b.firm);
      return fitLabels(b, caseAreas).length - fitLabels(a, caseAreas).length || a.firm.localeCompare(b.firm);
    }), [query, practice, county, fee, caseAreas]);

  const trackContact = async (attorney: Attorney) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Sign in to track attorney outreach." });
      return;
    }
    setSaving(attorney.id);
    try {
      const { error } = await supabase.from("attorney_contacts").insert({
        user_id: user.id,
        attorney_id: attorney.id,
        attorney_name: attorney.name,
        attorney_firm: attorney.firm,
        contact_method: attorney.contactMethod,
        status: "sent",
        notes: caseId ? `Linked from case ${caseId}.` : null,
      });
      if (error) throw error;

      if (caseId) {
        const { error: communicationError } = await supabase.from("case_communications").insert({
          user_id: user.id,
          case_id: caseId,
          occurred_on: new Date().toISOString().slice(0, 10),
          method: "Attorney outreach",
          person: attorney.name,
          agency: attorney.firm,
          subject: "Attorney search / outreach",
          summary: "Attorney identified through the Decoded Justice directory. Contact information has not been independently verified by Decoded Justice.",
          classification: "unknown",
        });
        if (communicationError) throw communicationError;
      }

      toast({
        title: caseId ? "Attorney outreach tracked in case" : "Attorney outreach tracked",
        description: `${attorney.name} was added to your contact tracker.`,
      });
    } catch (error) {
      console.error(error);
      toast({ title: "Could not save", description: "The contact could not be recorded.", variant: "destructive" });
    } finally {
      setSaving(null);
    }
  };

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70 font-medium mb-2">Decoded Justice · Attorney Search</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium">Find legal help</h1>
          <p className="text-muted-foreground mt-2">Search by practice area, Washington county, and fee structure. The search describes directory information; it does not rank or recommend attorneys.</p>
        </div>

        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-sm space-y-1">
              <p className="font-medium">Directory verification is required</p>
              <p className="text-muted-foreground">The current attorney records are legacy seeded directory data. Decoded Justice has not independently verified each attorney's current license status, availability, fees, or contact information. Verify those details directly before relying on them.</p>
            </div>
          </CardContent>
        </Card>

        {caseId && (
          <Card>
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Searching for this case</p>
                <p className="font-medium mt-1">{caseAreas.length ? `Case issue areas detected: ${caseAreas.join(", ")}` : "No practice-area match could be inferred from the current issue records."}</p>
              </div>
              <Link to={`/cases/${caseId}`} className="text-sm text-primary hover:underline">Back to case</Link>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search attorney, firm, city, or practice area…" className="pl-9" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select value={practice} onValueChange={setPractice}><SelectTrigger><SelectValue placeholder="Practice area" /></SelectTrigger><SelectContent><SelectItem value="all">All practice areas</SelectItem>{PRACTICE_AREAS.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select>
              <Select value={county} onValueChange={setCounty}><SelectTrigger><SelectValue placeholder="County" /></SelectTrigger><SelectContent><SelectItem value="all">All counties</SelectItem>{WA_COUNTIES.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select>
              <Select value={fee} onValueChange={setFee}><SelectTrigger><SelectValue placeholder="Fee structure" /></SelectTrigger><SelectContent><SelectItem value="all">All fee structures</SelectItem>{FEE_TYPES.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><Filter className="h-3.5 w-3.5" /> {results.length} directory record{results.length === 1 ? "" : "s"}</div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {results.map((attorney) => {
            const overlap = fitLabels(attorney, caseAreas);
            return (
              <Card key={attorney.id}>
                <CardContent className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-5">
                    <div className="min-w-0 flex-1 space-y-3">
                      <div><h2 className="text-lg font-medium">{attorney.name}</h2><p className="text-sm text-muted-foreground">{attorney.firm} · {attorney.city}, WA</p></div>
                      <div className="flex flex-wrap gap-1.5">{attorney.practiceAreas.map((v) => <Badge key={v} variant="secondary">{v}</Badge>)}</div>
                      {overlap.length > 0 && <div className="flex items-center gap-2 text-xs text-primary"><ShieldCheck className="h-3.5 w-3.5" /> Descriptive overlap with this case: {overlap.join(", ")}</div>}
                      <p className="text-sm text-muted-foreground">{attorney.description ?? "No directory description supplied."}</p>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1"><BriefcaseBusiness className="h-3.5 w-3.5" /> {attorney.counties.join(", ")} counties</span><span>Fees listed: {attorney.feeTypes.join(", ")}</span></div>
                    </div>
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:w-44 shrink-0">
                      <Button onClick={() => trackContact(attorney)} disabled={saving === attorney.id}><UserPlus className="h-4 w-4 mr-2" />{saving === attorney.id ? "Saving…" : caseId ? "Track for case" : "Track outreach"}</Button>
                      <Button variant="outline" asChild><a href={attorney.contactValue} target="_blank" rel="noreferrer">{attorney.contactMethod === "phone" ? <Phone className="h-4 w-4 mr-2" /> : <ExternalLink className="h-4 w-4 mr-2" />}Open listed contact</a></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {results.length === 0 && <Card><CardContent className="p-10 text-center text-muted-foreground">No directory records match those filters.</CardContent></Card>}

        <Card>
          <CardHeader><CardTitle className="font-serif text-lg">Keep the search auditable</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Record where the attorney information came from, when you verified it, what you were told about fees, and whether the attorney actually handles your type of matter.</p>
            <p>Do not treat directory inclusion, case-area overlap, or a successful contact as a statement about attorney quality or case outcome.</p>
          </CardContent>
        </Card>
        <Disclaimer variant="prominent" />
      </div>
    </Layout>
  );
}
