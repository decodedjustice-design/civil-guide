import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Accessibility, ArrowRight, Building2, Car, CheckCircle2,
  FileText, Gavel, HeartPulse, Home, Landmark, Scale,
  Shield, Speech, Users
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type JusticeStage = {
  level: number;
  title: string;
  whatHappens: string;
  escalateWhen: string;
};

type JusticePath = {
  id: string;
  title: string;
  description: string;
  icon: typeof Home;
  stages: JusticeStage[];
  decisionRoute: string;
  conductRoute: string;
  externalRoute: string;
};

const stage = (level: number, title: string, whatHappens: string, escalateWhen: string): JusticeStage => ({
  level, title, whatHappens, escalateWhen,
});

const justicePaths: JusticePath[] = [
  {
    id: "housing",
    title: "Housing & Tenant Rights",
    description: "Move from a landlord or housing-provider problem through internal review, formal complaints, government oversight, and court or administrative remedies when available.",
    icon: Home,
    stages: [
      stage(1, "Document the problem", "Preserve notices, lease terms, photos, messages, repair requests, payment records, and dates.", "You need to prove what happened, when you reported it, and what response you received."),
      stage(2, "Written complaint / request", "Make the repair, accommodation, correction, records, or other request in writing when practical.", "The problem is ignored, denied, delayed, or handled differently from what was requested."),
      stage(3, "Property or management escalation", "Move the issue to the property manager, owner, corporate office, designated grievance contact, or housing program supervisor.", "The first-level contact does not resolve the issue."),
      stage(4, "Formal grievance or administrative review", "Use the housing program's formal grievance, appeal, hearing, or complaint procedure when one applies.", "A written adverse decision is issued or the program identifies a formal review route."),
      stage(5, "External oversight", "Depending on the issue, consider a housing regulator, civil-rights agency, local enforcement body, ombuds, or other agency with jurisdiction.", "The outside body actually has authority over the issue."),
      stage(6, "Court or tribunal", "Some disputes can proceed through housing court, an administrative hearing, judicial review, or another authorized forum.", "A specific legal route exists and its deadline has been verified."),
      stage(7, "Enforcement / remedy", "Track repairs, payment, reinstatement, accommodation, corrected records, or other ordered relief through completion.", "The responsible party does not implement the resolution."),
    ],
    decisionRoute: "Appeal or challenge the actual housing decision through the procedure that governs that program or tenancy.",
    conductRoute: "Use a complaint or oversight channel for conduct such as discrimination, retaliation, licensing, or procedural misconduct where an outside body has jurisdiction.",
    externalRoute: "Do not assume a housing complaint automatically stops an eviction, termination, or other deadline-driven process.",
  },
  {
    id: "family",
    title: "Family & Child Welfare",
    description: "Keep the case record intact while separating worker-level concerns, agency complaints, formal review, court proceedings, and independent oversight.",
    icon: Users,
    stages: [
      stage(1, "Preserve the record", "Keep notices, case plans, contact logs, placement information, assessments, court papers, and communications in chronological order.", "You need to establish exactly what was said, decided, delivered, or omitted."),
      stage(2, "Worker / team resolution", "Raise factual corrections, requests, safety concerns, service questions, or missing-record issues with the assigned team.", "The response does not address the concrete problem or the issue requires supervisory attention."),
      stage(3, "Supervisor / program escalation", "Request review by the supervisor, program manager, or designated agency grievance contact.", "The assigned worker cannot resolve the issue or the concern involves the worker's own conduct."),
      stage(4, "Formal agency complaint / review", "Use the agency's formal complaint, grievance, administrative review, or constituent process when applicable.", "Internal resolution has failed or the agency provides a formal review route."),
      stage(5, "Independent oversight", "Where jurisdiction exists, an independent child-welfare ombuds or oversight body may review specified agency practices or complaints.", "The issue falls within the outside body's jurisdiction."),
      stage(6, "Administrative or court review", "Placement, dependency, benefits, services, and other decisions may have separate administrative or judicial review routes.", "A specific hearing, motion, appeal, or review mechanism is available."),
      stage(7, "Implementation / enforcement", "Track whether orders, services, placement decisions, records corrections, or other remedies are actually carried out.", "A final decision or order is not being implemented."),
    ],
    decisionRoute: "Challenge the underlying placement, service, or dependency decision through the court or administrative procedure that governs that decision.",
    conductRoute: "Use the agency complaint and independent oversight route for alleged misconduct, process failures, or inaccurate records; do not treat that complaint as a substitute for a court deadline.",
    externalRoute: "Different parts of the system have different review bodies. The app should verify jurisdiction before directing a user to a particular office.",
  },
  {
    id: "police",
    title: "Police, Law Enforcement & Government Conduct",
    description: "Create a documented complaint trail while keeping internal discipline, civilian oversight, administrative complaints, and civil claims as separate routes.",
    icon: Shield,
    stages: [
      stage(1, "Preserve evidence", "Save reports, citations, body-camera requests, photographs, video, witness information, medical records, and the exact chronology.", "Evidence can disappear or become harder to obtain with time."),
      stage(2, "Agency complaint", "Submit a complaint to the responsible agency's designated complaint, professional-standards, or internal-affairs process.", "The agency does not acknowledge, investigate, or resolve the complaint."),
      stage(3, "Command / professional standards review", "Escalate within the agency when its process provides supervisory or professional-standards review.", "The initial review is incomplete, disputed, or the complaint concerns the first reviewer."),
      stage(4, "Civilian / external oversight", "Where available, use an independent civilian oversight body, inspector, ombuds, licensing authority, or other external reviewer.", "The outside body has jurisdiction over the conduct."),
      stage(5, "Administrative or civil-rights complaint", "Depending on the facts, an administrative civil-rights or government-oversight process may be available.", "The issue falls within the agency's stated jurisdiction and filing window."),
      stage(6, "Court / independent adjudication", "Potential judicial routes are separate from an agency misconduct complaint and depend on the facts, defendant, jurisdiction, and applicable deadlines.", "A legally available judicial route has been identified and its deadline verified."),
      stage(7, "Remedy / compliance", "Track the result, records corrections, disciplinary outcome if disclosed, damages process, injunction, or other authorized remedy.", "A final resolution is not implemented."),
    ],
    decisionRoute: "Challenge a citation, administrative decision, or other government action through its designated review or court process.",
    conductRoute: "Complain about officer or agency conduct through internal and, where available, independent oversight channels.",
    externalRoute: "An internal complaint generally does not extend a separate court filing deadline. Preserve both tracks.",
  },
  {
    id: "disability",
    title: "Disability, Access & Accommodation",
    description: "Escalate an accommodation or access problem from the responsible office to formal grievance, civil-rights review, and independent adjudication where available.",
    icon: Accessibility,
    stages: [
      stage(1, "Make the request", "Document the accommodation or access barrier, request date, setting, response, and supporting information.", "The request is ignored, delayed, denied, or misunderstood."),
      stage(2, "Interactive / responsible office review", "Work with the designated access, disability, HR, housing, school, or program contact to clarify the request or alternatives.", "The first-level response does not resolve the barrier."),
      stage(3, "Supervisor / coordinator escalation", "Move the issue to the supervisor or designated ADA/Section 504/access coordinator where applicable.", "The original decision-maker cannot or will not resolve it."),
      stage(4, "Formal grievance", "Use the organization's formal grievance or complaint procedure.", "The formal process is required or the denial remains unresolved."),
      stage(5, "External civil-rights review", "Depending on the setting, an external civil-rights, disability-rights, licensing, or oversight agency may have jurisdiction.", "The outside body accepts complaints about that program or entity."),
      stage(6, "Administrative or judicial review", "Some disputes have administrative hearing or judicial remedies depending on the setting and governing law.", "A specific independent review route is available."),
      stage(7, "Implementation / monitoring", "Track whether the accommodation is actually provided and whether interruptions are corrected.", "The agreed or ordered accommodation is not implemented."),
    ],
    decisionRoute: "Use the appeal or grievance procedure governing the underlying program or decision.",
    conductRoute: "Use the access/discrimination complaint route for conduct or rights concerns.",
    externalRoute: "The correct external agency depends on the setting; verify jurisdiction and filing deadlines before submitting.",
  },
  {
    id: "courts",
    title: "Courts & Legal Process",
    description: "Court decisions and court-system complaints require different escalation tracks. An appeal is not the same thing as a complaint about conduct or administration.",
    icon: Gavel,
    stages: [
      stage(1, "Identify the order and deadline", "Preserve the current order, docket entry, hearing notice, filing, service record, and authoritative deadline source.", "You cannot verify what must be filed or when."),
      stage(2, "Trial-level response", "Use the applicable motion, objection, response, correction, or reconsideration procedure.", "The governing rules provide a trial-level review mechanism."),
      stage(3, "Appeal / authorized review", "If the decision is appealable, use the applicable appellate filing process.", "The order is reviewable and the appellate deadline remains open."),
      stage(4, "Higher appellate review", "Some matters can proceed to another appellate level under specific rules.", "The governing law authorizes another level of review."),
      stage(5, "Judicial administration complaint", "For administrative or staff-process problems, use the court's administrative complaint channel where available.", "The concern is about administration or service rather than the correctness of a judicial ruling."),
      stage(6, "Judicial conduct channel", "Where applicable, judicial-conduct concerns use a separate complaint process and do not replace an appeal.", "The concern concerns judicial conduct rather than ordinary disagreement with the ruling."),
      stage(7, "Enforcement / final remedy", "After a final order, track compliance, enforcement, modification, or other authorized post-judgment remedy.", "The final order is not being followed or a permitted post-judgment remedy applies."),
    ],
    decisionRoute: "Use the motion, reconsideration, appeal, or judicial-review route that applies to the order.",
    conductRoute: "Use court administration or judicial-conduct channels for conduct/process concerns; those routes generally do not reverse a judicial decision.",
    externalRoute: "Never let an administrative complaint substitute for a court filing deadline unless an authoritative rule expressly provides that effect.",
  },
  {
    id: "benefits",
    title: "Benefits, Education & Government Programs",
    description: "Move from the caseworker or program decision through reconsideration, hearing, agency review, external oversight, and judicial review when available.",
    icon: Landmark,
    stages: [
      stage(1, "Get the decision", "Preserve the notice, effective date, stated reason, benefit calculation, records, and appeal instructions.", "The decision is unclear or the notice does not explain review rights."),
      stage(2, "Correction / reconsideration", "Ask the responsible office to correct factual or processing errors and document the request.", "The error is not corrected or the adverse action continues."),
      stage(3, "Supervisor / program review", "Escalate to the supervisor, program manager, or designated review office.", "First-level resolution fails."),
      stage(4, "Formal appeal / hearing", "Use the program's formal appeal, fair-hearing, grievance, or review process.", "The decision remains adverse and a formal review right exists."),
      stage(5, "Agency-level review", "Some programs provide another administrative review or higher agency decision.", "The governing process provides another level."),
      stage(6, "External oversight / judicial review", "Depending on the program, an ombuds, regulator, civil-rights agency, or court may have a separate role.", "The outside body has jurisdiction and the applicable review route is available."),
      stage(7, "Restoration / enforcement", "Track restored benefits, corrected records, reimbursement, services, or other ordered remedy.", "The final resolution is not implemented."),
    ],
    decisionRoute: "Follow the appeal or hearing instructions attached to the specific benefit or program decision.",
    conductRoute: "Use complaint or oversight channels for processing, discrimination, records, or service-delivery concerns.",
    externalRoute: "An agency complaint does not necessarily pause termination or appeal deadlines.",
  },
  {
    id: "traffic",
    title: "Traffic & Transportation",
    description: "Separate citation or licensing review from complaints about officer conduct, vehicle services, or administrative processing.",
    icon: Car,
    stages: [
      stage(1, "Preserve the notice and evidence", "Save the citation, license notice, registration record, photographs, video, and dates.", "You need to challenge a factual or procedural issue."),
      stage(2, "Agency / citation response", "Use the stated response, mitigation, contest, hearing, or administrative process.", "The initial response does not resolve the issue."),
      stage(3, "Supervisor / administrative review", "Escalate processing problems to the appropriate supervisor or designated review office.", "The problem concerns agency processing rather than the underlying citation alone."),
      stage(4, "Formal hearing / appeal", "Use the authorized hearing or appeal process for the citation, license, or administrative action.", "The governing procedure provides another review level."),
      stage(5, "External complaint / oversight", "Conduct or service complaints may have separate agency, licensing, or oversight channels.", "An outside body has jurisdiction."),
      stage(6, "Court / judicial review", "Some traffic and licensing matters have judicial review routes separate from administrative complaints.", "A specific judicial route is available and deadlines are verified."),
      stage(7, "Compliance / correction", "Track corrected records, license status, payment, dismissal, or other final result.", "The final resolution is not reflected in the official record."),
    ],
    decisionRoute: "Use the contest, hearing, mitigation, or appeal route specified for the citation or licensing action.",
    conductRoute: "Use the agency complaint process for conduct concerns.",
    externalRoute: "Keep the complaint track separate from any citation or court deadline.",
  },
  {
    id: "speech",
    title: "Speech, Protest & First Amendment Concerns",
    description: "Document the protected activity and government response, then separate agency complaint, civil-rights oversight, and judicial routes.",
    icon: Speech,
    stages: [
      stage(1, "Preserve the event record", "Save video, photographs, posts, notices, citations, witness information, and a precise chronology.", "The dispute depends on what was said, done, recorded, seized, restricted, or threatened."),
      stage(2, "Agency complaint / correction", "Use the responsible agency's complaint or supervisory process where it can address the conduct or record.", "The agency does not resolve the issue."),
      stage(3, "Professional / civilian oversight", "Where available, use professional standards, civilian oversight, or an independent complaint body.", "The body has jurisdiction over the conduct."),
      stage(4, "Civil-rights administrative route", "Some discrimination or government-rights issues may fall within an external civil-rights agency.", "The agency's jurisdiction matches the issue."),
      stage(5, "Administrative review", "If the government imposed a permit, citation, sanction, or other decision, use its formal review process.", "A review mechanism applies to the government action."),
      stage(6, "Court / independent review", "Some constitutional or civil-rights disputes proceed through court subject to jurisdiction and deadlines.", "A specific judicial route has been identified."),
      stage(7, "Remedy / compliance", "Track dismissal, correction, policy remedy, restoration, injunction, damages, or other authorized relief.", "The final resolution is not implemented."),
    ],
    decisionRoute: "Challenge a permit, citation, restriction, or government decision through its designated review process.",
    conductRoute: "Use agency and external oversight channels for conduct concerns while preserving any separate judicial deadline.",
    externalRoute: "A complaint investigation does not automatically substitute for a court action.",
  },
  {
    id: "detention",
    title: "Jail, Detention & Corrections",
    description: "Build a record of conditions, requests, grievances, medical/access issues, and responses while tracking the separate legal-review routes that may apply.",
    icon: Shield,
    stages: [
      stage(1, "Document the condition or incident", "Preserve dates, housing location, requests, grievances, medical records, witnesses, notices, and responses.", "A safety, medical, access, property, discipline, or records issue needs a traceable record."),
      stage(2, "Immediate request / grievance", "Use the facility's request, grievance, medical, classification, or emergency process as appropriate.", "The problem is not corrected or the response is inadequate."),
      stage(3, "Supervisor / grievance appeal", "Escalate through the facility's grievance appeal or supervisory structure.", "The initial grievance is denied, ignored, or incompletely addressed."),
      stage(4, "Agency-level review", "Use the corrections agency's designated review or complaint channel when available.", "Facility-level remedies are exhausted or the process identifies another review level."),
      stage(5, "External oversight", "Depending on the issue, an ombuds, inspector, licensing body, civil-rights reviewer, or other oversight entity may have jurisdiction.", "The external body accepts that category of complaint."),
      stage(6, "Administrative or court review", "Some detention matters have administrative, habeas, civil-rights, or other judicial routes with specific requirements.", "A specific legal mechanism applies and its deadline is verified."),
      stage(7, "Remedy / compliance", "Track medical care, records correction, release-related orders, policy compliance, or other authorized remedy.", "The final resolution is not implemented."),
    ],
    decisionRoute: "Use the facility or agency appeal and the specific judicial review mechanism that applies.",
    conductRoute: "Use grievance, oversight, or civil-rights complaint routes for conditions or conduct.",
    externalRoute: "Do not assume a grievance extends a separate court deadline or replaces a required exhaustion procedure.",
  },
  {
    id: "healthcare",
    title: "Healthcare & Patient Rights",
    description: "Move from the provider's patient-relations process through formal grievance, licensing or regulatory review, and independent legal remedies when available.",
    icon: HeartPulse,
    stages: [
      stage(1, "Preserve the care record", "Keep visit summaries, portal messages, bills, consent forms, records requests, medication information, and dates.", "You need a reliable record of care and communications."),
      stage(2, "Provider / patient relations", "Raise the concern with the provider, patient-relations office, medical-records office, or designated grievance contact.", "The concern is not resolved or the response is inadequate."),
      stage(3, "Clinical / administrative review", "Request review by a supervisor, medical director, compliance office, or records administrator as appropriate.", "The first-level response does not resolve the issue."),
      stage(4, "Formal grievance", "Use the health plan, facility, or program's formal grievance and appeal procedure where applicable.", "The decision remains adverse or the policy requires a formal grievance."),
      stage(5, "Licensing / regulatory oversight", "Depending on the issue, a professional licensing board, health regulator, privacy authority, or other oversight body may have jurisdiction.", "The external body regulates the conduct at issue."),
      stage(6, "Administrative or court remedy", "Some disputes may proceed through an administrative appeal, contractual review, or court depending on the facts and governing law.", "A specific legal route exists and its deadline is verified."),
      stage(7, "Correction / remedy", "Track corrected records, coverage, treatment, refund, authorization, or other final remedy.", "The final resolution is not implemented."),
    ],
    decisionRoute: "Use the health plan, facility, or program appeal process for a coverage or service decision.",
    conductRoute: "Use patient grievance, licensing, regulatory, or privacy complaint channels for conduct and compliance concerns.",
    externalRoute: "A complaint to a licensing or regulatory body may not provide the same remedy as a private legal claim.",
  },
  {
    id: "government-programs",
    title: "Government Programs & Benefits",
    description: "A broader agency-navigation path for programs where decisions, records, service delivery, and appeals can involve several layers.",
    icon: Building2,
    stages: [
      stage(1, "Identify the program decision", "Save the notice, case number, effective date, calculation, reason, and cited policy or rule.", "The decision or deadline is unclear."),
      stage(2, "Caseworker / program correction", "Ask for factual corrections, missing records, or processing review.", "The issue is not resolved at the working level."),
      stage(3, "Supervisor / program manager", "Escalate to the responsible supervisor or designated program review office.", "The initial review fails or the concern involves the original worker."),
      stage(4, "Formal grievance / appeal", "Use the program's formal grievance, fair-hearing, appeal, or reconsideration process.", "A formal review right exists or an adverse decision remains."),
      stage(5, "Higher agency review", "Use any second-level agency review provided by the program.", "The rules provide another administrative level."),
      stage(6, "External oversight / court", "Depending on the issue, use an ombuds, civil-rights agency, regulator, or judicial review route.", "The outside forum has jurisdiction and the procedural requirements are met."),
      stage(7, "Restoration / enforcement", "Track restored benefits, corrected records, services, payment, or other final remedy.", "The resolution is not implemented."),
    ],
    decisionRoute: "Follow the program-specific appeal or hearing route.",
    conductRoute: "Use complaint and oversight channels for service delivery, records, discrimination, or process concerns.",
    externalRoute: "Keep complaint, appeal, and court deadlines in separate tracks unless the governing authority says otherwise.",
  },
];

export default function PathToJustice() {
  const [selectedId, setSelectedId] = useState("housing");
  const selected = useMemo(
    () => justicePaths.find((path) => path.id === selectedId) ?? justicePaths[0],
    [selectedId],
  );
  const Icon = selected.icon;

  return (
    <Layout>
      <main className="min-h-screen bg-background">
        <section className="border-b border-border/60">
          <div className="container max-w-6xl py-12 lg:py-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Self-advocacy escalation</p>
            <h1 className="mt-3 max-w-4xl font-serif text-4xl tracking-tight md:text-5xl">The Path to Justice</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
              A complaint is not the end of the road. Choose a subject to see the possible escalation ladder—from documenting the problem, through internal review and formal complaints, to independent oversight, adjudication, and enforcement when those routes exist.
            </p>
            <div className="mt-5 max-w-3xl rounded-xl border border-border/60 bg-muted/20 p-4 text-sm leading-6 text-muted-foreground">
              <strong className="text-foreground">Important:</strong> These are navigation maps, not guarantees that every level is available in every case. The exact route, exhaustion requirement, jurisdiction, and deadline must be verified from the governing notice, rule, statute, order, contract, or official procedure.
            </div>
          </div>
        </section>

        <section className="container max-w-6xl py-8">
          <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
            <aside className="space-y-2">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Choose a subject</p>
              {justicePaths.map((path) => {
                const PathIcon = path.icon;
                const active = path.id === selected.id;
                return (
                  <button
                    key={path.id}
                    onClick={() => setSelectedId(path.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${active ? "border-primary/40 bg-primary/5" : "border-border/60 hover:bg-muted/40"}`}
                  >
                    <PathIcon className="h-4 w-4 shrink-0" />
                    <span className="text-sm">{path.title}</span>
                  </button>
                );
              })}
            </aside>

            <div className="min-w-0">
              <Card className="overflow-hidden">
                <CardHeader className="border-b border-border/60">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{selected.title}</CardTitle>
                      <CardDescription className="mt-2 max-w-2xl leading-6">{selected.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6 md:p-8">
                  <div className="space-y-4">
                    {selected.stages.map((item) => (
                      <div key={item.level} className="rounded-2xl border border-border/60 bg-background p-5">
                        <div className="flex gap-4">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/5 text-sm font-semibold text-primary">
                            {item.level}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h2 className="font-semibold">{item.title}</h2>
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.whatHappens}</p>
                            <div className="mt-3 rounded-xl bg-muted/30 p-3">
                              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Escalate when</p>
                              <p className="mt-1 text-sm leading-6">{item.escalateWhen}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-7 grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-border/60 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Decision route</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{selected.decisionRoute}</p>
                    </div>
                    <div className="rounded-xl border border-border/60 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Conduct route</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{selected.conductRoute}</p>
                    </div>
                    <div className="rounded-xl border border-border/60 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Deadline protection</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{selected.externalRoute}</p>
                    </div>
                  </div>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <Button asChild>
                      <Link to="/guided-workflows">
                        Start guided workflow <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link to="/cases">
                        Build the record <FileText className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link to="/justice-research">
                        Verify the governing process <Scale className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>

                  <div className="mt-7 rounded-xl border border-primary/20 bg-primary/[0.035] p-5">
                    <div className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <div>
                        <p className="font-medium">Build an escalation record, not just a complaint.</p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          Keep the original problem, every request, each response, every escalation, the governing source, and the final outcome connected. Decoded Justice can preserve those relationships in the case timeline, communications, requests, documents, issues, and evidence review.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
