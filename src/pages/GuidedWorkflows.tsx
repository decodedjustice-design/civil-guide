import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, BookOpen, CheckCircle2, ClipboardCheck, FileSearch,
  FileText, Gavel, HelpCircle, LibraryBig, RotateCcw, Scale, Shield,
  Sparkles, Users, Accessibility, Building2
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type Choice = { label: string; value: string };
type Step = { id: string; question: string; helper?: string; choices: Choice[] };
type Workflow = {
  id: string;
  title: string;
  description: string;
  icon: typeof FileText;
  steps: Step[];
  actions: (answers: Record<string, string>) => Action[];
  escalation: EscalationStep[];
};

type Action = {
  title: string;
  description: string;
  href: string;
  label: string;
  icon: typeof FileText;
};

type EscalationStep = {
  level: number;
  title: string;
  purpose: string;
  escalateWhen: string;
  route: string;
};

const workflows: Workflow[] = [
  {
    id: "notice",
    title: "I received a notice",
    description: "Figure out what the notice is, what date matters, and what to preserve before taking action.",
    icon: FileText,
    steps: [
      { id: "notice_type", question: "What kind of notice is it?", choices: [
        { label: "Housing / landlord", value: "housing" },
        { label: "Government benefits or agency", value: "benefits" },
        { label: "Court or legal process", value: "court" },
        { label: "School, employer, or other organization", value: "other" },
        { label: "I am not sure", value: "unknown" },
      ]},
      { id: "notice_date", question: "Does the notice give you a deadline or hearing date?", choices: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
        { label: "I cannot tell", value: "unknown" },
      ]},
      { id: "notice_copy", question: "Do you have a copy of the notice?", choices: [
        { label: "Yes, I have it", value: "yes" },
        { label: "I have a photo or scan", value: "photo" },
        { label: "No", value: "no" },
      ]},
    ],
    escalation: [
      { level: 1, title: "Preserve and understand the notice", purpose: "Save the original notice, envelope or delivery record, attachments, and every date before responding.", escalateWhen: "You do not understand the notice, the deadline is unclear, or important pages are missing.", route: "Decode the notice and identify the governing process." },
      { level: 2, title: "Respond or ask for correction", purpose: "Use the notice's stated contact, response, reconsideration, or correction process when one exists.", escalateWhen: "The notice is inaccurate, incomplete, or the agency/provider does not address the issue.", route: "Create a written record of what you dispute and what you are asking for." },
      { level: 3, title: "Supervisor or internal review", purpose: "Ask for supervisory review, reconsideration, grievance review, or the next internal level identified by the governing process.", escalateWhen: "The first contact does not resolve the issue or no meaningful response arrives.", route: "Keep the original request, response, and proof of submission together." },
      { level: 4, title: "Formal administrative complaint or appeal", purpose: "Use the formal appeal, grievance, hearing, complaint, or review procedure that applies to the subject.", escalateWhen: "A formal review right exists, a deadline is approaching, or an adverse decision remains in effect.", route: "Verify the procedure and deadline from the official notice, rule, contract, or policy." },
      { level: 5, title: "External oversight", purpose: "Where available, take the matter outside the original decision-maker to an ombuds, inspector, civil-rights agency, licensing body, regulator, or other oversight office.", escalateWhen: "Internal review is exhausted, unavailable, delayed, or the issue falls within an external agency's jurisdiction.", route: "Confirm jurisdiction and preserve proof of earlier complaints." },
      { level: 6, title: "Independent review or court", purpose: "Some disputes can proceed to an administrative tribunal, judicial review, civil action, or another independent forum.", escalateWhen: "A legally available independent review route exists and its filing deadline has been verified.", route: "Check the controlling law and obtain qualified legal help when the procedure is complex." },
      { level: 7, title: "Enforcement, remedy, or compliance", purpose: "If a decision or order is obtained, track implementation, compliance, payment, correction, or other required remedy.", escalateWhen: "The responsible party does not implement the final decision or required remedy.", route: "Document noncompliance and use the enforcement mechanism attached to the decision." },
    ],
    actions: (a) => [
      { title: "Decode the notice", description: "Paste or upload confusing legal language and work through it in plain language.", href: "/legal-decoder", label: "Open Legal Decoder", icon: FileSearch },
      { title: "Prepare a checklist", description: "Track the notice, source document, deadline, questions, and next steps in your case.", href: "/cases", label: "Open Cases", icon: ClipboardCheck },
      ...(a.notice_type === "court" ? [{ title: "Court preparation", description: "Use the general court-preparation checklist and verify requirements from the court.", href: "/cases", label: "Open Case Workspace", icon: Gavel }] : []),
      { title: "Learn the underlying topic", description: "Move from the notice to plain-language education and primary-source research.", href: "/education-library", label: "Open Knowledge Center", icon: BookOpen },
    ],
  },
  {
    id: "decision",
    title: "Someone made a decision about me",
    description: "Separate the decision itself from the notice, reasons, review process, and records behind it.",
    icon: Building2,
    steps: [
      { id: "decision_maker", question: "Who made the decision?", choices: [
        { label: "Government agency", value: "government" },
        { label: "Housing provider", value: "housing" },
        { label: "School or education provider", value: "school" },
        { label: "Employer", value: "employer" },
        { label: "Other organization", value: "other" },
      ]},
      { id: "written", question: "Do you have the decision in writing?", choices: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
        { label: "I have a message or partial record", value: "partial" },
      ]},
      { id: "review", question: "Were you told about a review, appeal, hearing, or reconsideration process?", choices: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
        { label: "I am not sure", value: "unknown" },
      ]},
    ],
    escalation: [
      { level: 1, title: "Get the decision and reasons", purpose: "Preserve the decision, effective date, stated reasons, policy or rule cited, and records used to make it.", escalateWhen: "You were told verbally, the reasons are missing, or the decision conflicts with the written record.", route: "Request the decision and supporting records in writing." },
      { level: 2, title: "Ask for correction or reconsideration", purpose: "Use any correction, reconsideration, supervisor review, or informal resolution process available.", escalateWhen: "The decision-maker does not correct an apparent error or the response is inadequate.", route: "State the specific decision, factual correction, and requested action." },
      { level: 3, title: "Supervisor / internal grievance", purpose: "Move the complaint to the next responsible level rather than restarting the same conversation.", escalateWhen: "The original decision-maker has declined to resolve it or the policy identifies a higher review level.", route: "Submit the record with dates, prior contacts, and supporting documents." },
      { level: 4, title: "Formal appeal or administrative review", purpose: "Use the formal appeal, grievance, hearing, or administrative review process if the decision provides one.", escalateWhen: "The decision remains adverse and a formal review route is available.", route: "Verify the filing method, deadline, standard of review, and required attachments." },
      { level: 5, title: "External complaint or oversight", purpose: "Depending on the subject, external review may include a regulator, civil-rights agency, ombuds, licensing authority, or other independent oversight body.", escalateWhen: "The issue falls within an external body's jurisdiction or internal remedies have been exhausted.", route: "Confirm jurisdiction before filing and preserve the complete complaint record." },
      { level: 6, title: "Independent adjudication or court", purpose: "Some decisions can be reviewed by an administrative tribunal or court, depending on the governing law.", escalateWhen: "An independent review route is legally available and the deadline is verified.", route: "Research the specific review statute or rule before filing." },
      { level: 7, title: "Remedy and implementation", purpose: "Track whether the corrected decision, payment, reinstatement, record correction, or other remedy is actually carried out.", escalateWhen: "A final decision is not implemented.", route: "Use the enforcement or compliance process associated with the final decision." },
    ],
    actions: () => [
      { title: "Build the record", description: "Organize the decision, supporting documents, chronology, and communications in a case.", href: "/cases", label: "Open Cases", icon: ClipboardCheck },
      { title: "Find missing records", description: "Identify records you may need and turn gaps into trackable requests.", href: "/cases", label: "Open Case Workspace", icon: LibraryBig },
      { title: "Understand the process", description: "Start with plain-language guidance before researching the governing authority.", href: "/education-library", label: "Open Knowledge Center", icon: BookOpen },
    ],
  },
  {
    id: "records",
    title: "I need records",
    description: "Identify the records, likely holder, date range, and next action without guessing who should receive a request.",
    icon: LibraryBig,
    steps: [
      { id: "record_type", question: "What records are you looking for?", choices: [
        { label: "Government / public records", value: "public" },
        { label: "My agency or case file", value: "agency" },
        { label: "Court records", value: "court" },
        { label: "Medical or education records", value: "personal" },
        { label: "I am not sure", value: "unknown" },
      ]},
      { id: "holder", question: "Do you know who likely holds the records?", choices: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
        { label: "I know the agency but not the records office", value: "partial" },
      ]},
      { id: "range", question: "Can you identify a date range or event that narrows the search?", choices: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ]},
    ],
    escalation: [
      { level: 1, title: "Identify and request the records", purpose: "Define the records, custodian, date range, format, and legal basis for access.", escalateWhen: "The request is unclear, misrouted, or the records holder does not acknowledge it.", route: "Preserve the submitted request and proof of delivery." },
      { level: 2, title: "Clarify or narrow the request", purpose: "Resolve ambiguity, duplicates, search terms, date ranges, or custodian questions in writing.", escalateWhen: "The response remains incomplete or the custodian says no records were found without enough explanation.", route: "Ask what was searched and what records or exemptions are being relied upon." },
      { level: 3, title: "Supervisor / records officer review", purpose: "Request review by the records officer, public-records officer, supervisor, clerk, or designated records administrator.", escalateWhen: "The initial response is incomplete, delayed, or appears inconsistent with the governing access process.", route: "Link the original request, response, and unresolved items." },
      { level: 4, title: "Formal administrative review", purpose: "Use any statutory review, reconsideration, grievance, or administrative process available for the records system.", escalateWhen: "A formal review mechanism exists or the response invokes an exemption that can be challenged through review.", route: "Verify the review procedure and deadlines from the applicable records law." },
      { level: 5, title: "Oversight / enforcement channel", purpose: "Depending on the records system, escalation may involve an ombuds, attorney general, inspector, court clerk supervisor, regulator, or other oversight body.", escalateWhen: "The custodian does not resolve the issue and an outside body has jurisdiction.", route: "Do not assume every records dispute has the same external complaint route." },
      { level: 6, title: "Court or judicial enforcement", purpose: "Some records laws provide a judicial enforcement mechanism when access rights remain disputed.", escalateWhen: "The governing law permits judicial enforcement and its timing requirements are satisfied.", route: "Verify the statute and seek legal assistance when remedies or deadlines are consequential." },
      { level: 7, title: "Production, correction, or remedy", purpose: "Track the actual records received, missing portions, redactions, fees, and any required correction or enforcement outcome.", escalateWhen: "The final resolution is not implemented or the production remains incomplete.", route: "Create a new record gap for every unresolved production item." },
    ],
    actions: (a) => [
      { title: "Public Request Rights", description: "Learn how Washington public-records and federal FOIA concepts work before sending a request.", href: "/public-request-rights", label: "Review Request Rights", icon: Scale },
      { title: "Track the request", description: "Create a case record, record gap, request, and response trail instead of keeping it in a notes app.", href: "/cases", label: "Open Cases", icon: ClipboardCheck },
      ...(a.holder !== "yes" ? [{ title: "Research the record holder", description: "Use the Knowledge Center and official sources to identify the likely custodian before sending.", href: "/justice-research", label: "Open Research", icon: FileSearch }] : []),
    ],
  },
  {
    id: "investigation",
    title: "A government agency is investigating me",
    description: "Map the investigation, participants, notices, contacts, records, and unanswered questions.",
    icon: Shield,
    steps: [
      { id: "contact", question: "Have you been contacted directly by the agency?", choices: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
        { label: "I received a written notice only", value: "notice" },
      ]},
      { id: "meeting", question: "Is there an interview, meeting, hearing, or response date?", choices: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
        { label: "I cannot tell", value: "unknown" },
      ]},
      { id: "records", question: "Do you have records about the investigation?", choices: [
        { label: "Yes", value: "yes" },
        { label: "Some records", value: "partial" },
        { label: "No", value: "no" },
      ]},
    ],
    escalation: [
      { level: 1, title: "Understand the investigation", purpose: "Identify the agency, investigator, allegations or stated purpose, interview dates, notices, and immediate deadlines.", escalateWhen: "You cannot determine what process you are in or what response is required.", route: "Preserve every contact and request the applicable process information." },
      { level: 2, title: "Respond and correct the record", purpose: "Use the process available to provide a response, submit documents, identify factual corrections, and preserve your position.", escalateWhen: "The agency relies on information you believe is incomplete or inaccurate.", route: "Separate what you know, what you dispute, and what evidence supports each point." },
      { level: 3, title: "Supervisor / case review", purpose: "Ask for supervisory review or clarification when the investigator cannot resolve a material process or record problem.", escalateWhen: "A significant issue remains after direct communication with the assigned worker.", route: "Request review in writing and preserve the response." },
      { level: 4, title: "Formal grievance, administrative review, or hearing", purpose: "Some investigations have a formal complaint, grievance, hearing, appeal, or administrative review process.", escalateWhen: "The agency takes an adverse action or the governing process provides a review right.", route: "Use the official procedure and verify deadlines rather than relying on general complaint language." },
      { level: 5, title: "External oversight", purpose: "Depending on the agency and issue, oversight may include an ombuds, inspector general, licensing body, civil-rights agency, or other independent reviewer.", escalateWhen: "The external body has jurisdiction or internal review does not address the identified issue.", route: "Attach the chronology and prior complaint record." },
      { level: 6, title: "Independent tribunal or court", purpose: "Some agency actions can be challenged through an administrative tribunal, judicial review, or civil action, subject to jurisdiction and deadlines.", escalateWhen: "A specific independent review mechanism applies.", route: "Verify the exact cause of action or review procedure before filing." },
      { level: 7, title: "Final remedy / compliance", purpose: "Track the outcome, correction of records, benefits or services restored, orders entered, or other remedy through completion.", escalateWhen: "The agency does not implement the final resolution.", route: "Document each missed implementation step and use the applicable enforcement process." },
    ],
    actions: () => [
      { title: "Create an investigation record", description: "Keep contacts, communications, events, documents, issues, and requests connected.", href: "/cases", label: "Open Cases", icon: ClipboardCheck },
      { title: "Prepare for the next contact", description: "Use the self-advocacy meeting checklist to organize questions, documents, and requested actions.", href: "/cases", label: "Open Case Workspace", icon: Users },
      { title: "Research the process", description: "Use topic guidance and primary-source research without treating the workflow as a legal conclusion.", href: "/education-library", label: "Open Knowledge Center", icon: BookOpen },
    ],
  },
  {
    id: "accommodation",
    title: "I need an accommodation",
    description: "Organize the request, supporting information, response, and follow-up while keeping the legal standard separate from your facts.",
    icon: Accessibility,
    steps: [
      { id: "setting", question: "Where do you need the accommodation?", choices: [
        { label: "Housing", value: "housing" },
        { label: "School", value: "school" },
        { label: "Work", value: "work" },
        { label: "Government service or program", value: "government" },
        { label: "Court or legal process", value: "court" },
      ]},
      { id: "requested", question: "Have you already made the request?", choices: [
        { label: "Yes, in writing", value: "written" },
        { label: "Yes, verbally", value: "verbal" },
        { label: "No", value: "no" },
      ]},
      { id: "response", question: "Have you received a response?", choices: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
        { label: "I received a response but do not understand it", value: "unclear" },
      ]},
    ],
    escalation: [
      { level: 1, title: "Make and document the request", purpose: "State the accommodation sought, the setting, and information reasonably needed to evaluate the request.", escalateWhen: "The request is ignored, misunderstood, or the process is unclear.", route: "Keep the request and delivery proof." },
      { level: 2, title: "Interactive / internal resolution", purpose: "Ask the responsible office to discuss alternatives, clarify what information is needed, and document the response.", escalateWhen: "The requested accommodation is denied, delayed, or replaced without a clear explanation.", route: "Ask for the reason and any available alternative process in writing." },
      { level: 3, title: "Supervisor / designated access office", purpose: "Escalate to the supervisor, disability/access coordinator, HR, housing manager, school administrator, or designated ADA/Section 504 contact as applicable.", escalateWhen: "The first-level contact does not resolve the request.", route: "Preserve the full request-and-response chronology." },
      { level: 4, title: "Formal grievance / complaint", purpose: "Use the organization's formal grievance or complaint procedure where available.", escalateWhen: "The response remains adverse or the formal policy requires a grievance before outside review.", route: "Verify the internal grievance deadline and required format." },
      { level: 5, title: "External civil-rights or oversight agency", purpose: "Depending on the setting, an external civil-rights, disability-rights, licensing, or oversight body may have jurisdiction.", escalateWhen: "The outside agency accepts complaints about the specific program or entity.", route: "Confirm jurisdiction and filing deadlines before submitting." },
      { level: 6, title: "Administrative or judicial review", purpose: "Some accommodation disputes can proceed through an administrative hearing, agency review, or court depending on the setting and governing law.", escalateWhen: "A legally available independent review route applies.", route: "Identify the specific statute, regulation, contract, or procedural rule governing review." },
      { level: 7, title: "Implementation and monitoring", purpose: "Track whether the accommodation is actually provided and whether the agreed or ordered terms are followed.", escalateWhen: "The accommodation is not implemented or is repeatedly interrupted.", route: "Document each implementation failure and connect it to the prior resolution." },
    ],
    actions: () => [
      { title: "Learn the framework", description: "Review disability and access education before deciding what facts or documents are relevant.", href: "/education-library/topic/disability", label: "Open Disability Guide", icon: BookOpen },
      { title: "Organize the request", description: "Keep the request, response, supporting documents, communications, and next steps together.", href: "/cases", label: "Open Cases", icon: ClipboardCheck },
      { title: "Decode a response", description: "If the response uses legal or policy language, translate it into plain language first.", href: "/legal-decoder", label: "Open Legal Decoder", icon: FileSearch },
    ],
  },
  {
    id: "court",
    title: "I'm going to court",
    description: "Start with the case information, hearing, current order, filing requirement, and source for each deadline.",
    icon: Gavel,
    steps: [
      { id: "court_stage", question: "Where are you in the court process?", choices: [
        { label: "I have a hearing coming up", value: "hearing" },
        { label: "I need to file something", value: "filing" },
        { label: "I received an order or notice", value: "order" },
        { label: "I need to appeal or seek review", value: "appeal" },
        { label: "I am not sure", value: "unknown" },
      ]},
      { id: "case_number", question: "Do you have the case number and current court documents?", choices: [
        { label: "Yes", value: "yes" },
        { label: "Some of them", value: "partial" },
        { label: "No", value: "no" },
      ]},
      { id: "deadline", question: "Do you know the deadline or hearing date from an authoritative source?", choices: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
        { label: "I have a date but need to verify it", value: "verify" },
      ]},
    ],
    escalation: [
      { level: 1, title: "Court notice, order, and deadline", purpose: "Identify the case number, hearing, order, filing requirement, service date, and authoritative source for every deadline.", escalateWhen: "A date or requirement is unclear.", route: "Verify against the court record, order, rule, or clerk—not an estimated date." },
      { level: 2, title: "Filing / response / motion", purpose: "Use the procedure available at the current stage to respond, file, request relief, or correct the record.", escalateWhen: "The court has issued an adverse order or a filing has been rejected or challenged.", route: "Preserve the filed document, proof of filing/service, and court response." },
      { level: 3, title: "Motion for reconsideration or trial-level review", purpose: "Some courts provide a mechanism to ask the same court to reconsider, correct, or clarify an order.", escalateWhen: "The applicable rule or order provides that route.", route: "Verify the exact rule and deadline." },
      { level: 4, title: "Administrative / appellate review", purpose: "Depending on the court and case type, review may proceed to an appellate court or another authorized review body.", escalateWhen: "The order is appealable or reviewable and the applicable deadline is open.", route: "Verify appealability, jurisdiction, record requirements, and filing deadline." },
      { level: 5, title: "Higher appellate review", purpose: "Some decisions can proceed through another appellate level when the governing law permits further review.", escalateWhen: "The applicable appellate rules authorize another level of review.", route: "Track each jurisdictional and filing requirement separately." },
      { level: 6, title: "Post-judgment enforcement or other remedy", purpose: "After a final decision, the process may shift from review to enforcement, compliance, modification, or another authorized remedy.", escalateWhen: "The judgment or order is not being followed or circumstances permit a post-judgment motion.", route: "Identify the specific enforcement or modification mechanism." },
      { level: 7, title: "Record preservation and closure", purpose: "Keep the final orders, filings, transcripts, exhibits, and proof of outcome together for future review or compliance.", escalateWhen: "A later dispute depends on what happened in the case.", route: "Close the case only after the final record and unresolved obligations are documented." },
    ],
    actions: () => [
      { title: "Court preparation checklist", description: "Use a structured preparation list while keeping court-specific requirements verified.", href: "/cases", label: "Open Case Workspace", icon: ClipboardCheck },
      { title: "Court and filing education", description: "Review general court terminology and filing concepts.", href: "/courts-filing-info", label: "Review Court Guide", icon: Gavel },
      { title: "Research the authority", description: "Find statutes, regulations, and decisions rather than relying on an AI-generated deadline.", href: "/justice-research", label: "Open Research", icon: Scale },
    ],
  },
  {
    id: "appeal",
    title: "I need to appeal",
    description: "Identify the decision, notice, review path, and deadline before treating an appeal as available.",
    icon: ArrowRight,
    steps: [
      { id: "decision_source", question: "What are you trying to challenge?", choices: [
        { label: "Government or benefits decision", value: "government" },
        { label: "Housing decision", value: "housing" },
        { label: "School decision", value: "school" },
        { label: "Court decision or order", value: "court" },
        { label: "Other", value: "other" },
      ]},
      { id: "notice", question: "Do you have the decision or notice that explains review rights?", choices: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
        { label: "I have a partial copy", value: "partial" },
      ]},
      { id: "deadline", question: "Is there a stated review or appeal deadline?", choices: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
        { label: "I need to verify it", value: "verify" },
      ]},
    ],
    escalation: [
      { level: 1, title: "Verify the decision and review rights", purpose: "Read the decision or notice for the exact review mechanism, deadline, filing location, and required form.", escalateWhen: "The notice does not clearly identify review rights or the deadline.", route: "Confirm the rule, statute, contract, or official procedure." },
      { level: 2, title: "Reconsideration / correction", purpose: "If available, ask the original decision-maker to correct an error or reconsider the decision.", escalateWhen: "The governing process allows reconsideration and the issue can be addressed there.", route: "State the decision challenged, factual/legal basis, and requested correction." },
      { level: 3, title: "Formal administrative appeal", purpose: "File the designated appeal, grievance, hearing request, or review petition.", escalateWhen: "The decision remains adverse and a formal appeal is available.", route: "Track filing, service, hearing, evidence, and response deadlines separately." },
      { level: 4, title: "Higher administrative review", purpose: "Some systems provide another internal or administrative level after the first appeal.", escalateWhen: "The governing process provides a second-level review.", route: "Do not assume an appeal automatically continues upward; verify the next authorized level." },
      { level: 5, title: "External oversight", purpose: "A regulator, ombuds, civil-rights agency, inspector, or other outside body may address separate process or rights issues.", escalateWhen: "The outside body has jurisdiction over the underlying conduct.", route: "Separate an appeal of the decision from a complaint about how the decision was made." },
      { level: 6, title: "Judicial review / court", purpose: "Some administrative or agency decisions can be reviewed by a court under a specific statute or procedural rule.", escalateWhen: "Judicial review is legally available and the filing deadline is open.", route: "Verify jurisdiction, exhaustion requirements, record requirements, and deadline." },
      { level: 7, title: "Final remedy / implementation", purpose: "Track the result of review and whether the corrected decision or ordered remedy is implemented.", escalateWhen: "The final decision is not carried out.", route: "Use the enforcement or compliance process tied to the final order." },
    ],
    actions: () => [
      { title: "Preserve the decision record", description: "Keep the decision, notice, reasons, communications, and relevant events together.", href: "/cases", label: "Open Cases", icon: ClipboardCheck },
      { title: "Research the review path", description: "Use official sources to verify whether review is available and which procedure applies.", href: "/justice-research", label: "Open Research", icon: Scale },
      { title: "Decode the notice", description: "Translate the notice into plain language before working from it.", href: "/legal-decoder", label: "Open Legal Decoder", icon: FileSearch },
    ],
  },
  {
    id: "understand",
    title: "I want to understand the law",
    description: "Start with a plain-language explanation, then move to the primary source and research questions.",
    icon: Scale,
    steps: [
      { id: "topic", question: "What area are you trying to understand?", choices: [
        { label: "Housing", value: "housing" },
        { label: "Family / child welfare", value: "family" },
        { label: "Police / government", value: "government" },
        { label: "Disability / access", value: "disability" },
        { label: "Courts / procedure", value: "courts" },
        { label: "Benefits / education", value: "benefits" },
      ]},
      { id: "source", question: "What are you working from?", choices: [
        { label: "A notice or letter", value: "notice" },
        { label: "A court order", value: "order" },
        { label: "A statute or regulation", value: "law" },
        { label: "A policy or agency document", value: "policy" },
        { label: "My own situation", value: "facts" },
      ]},
      { id: "goal", question: "What do you need next?", choices: [
        { label: "Understand the words", value: "decode" },
        { label: "Find the source", value: "source" },
        { label: "Organize my facts", value: "case" },
        { label: "Prepare questions", value: "questions" },
      ]},
    ],
    escalation: [
      { level: 1, title: "Plain-language understanding", purpose: "Identify the document, legal term, issue, and question without assuming the answer.", escalateWhen: "The source remains unclear or contradictory.", route: "Use Legal Decoder and the Knowledge Center." },
      { level: 2, title: "Primary source", purpose: "Locate the statute, regulation, court rule, order, policy, or decision that actually governs the question.", escalateWhen: "A summary or secondary source does not answer the question.", route: "Open and preserve the authoritative source." },
      { level: 3, title: "Agency / institutional clarification", purpose: "Where appropriate, ask the responsible office for the procedure, policy, or records needed to understand how the rule is being applied.", escalateWhen: "The published material does not explain the actual process.", route: "Ask factual process questions and preserve the response." },
      { level: 4, title: "Formal complaint or review", purpose: "If the issue concerns how a decision or process was applied, move into the applicable grievance, complaint, reconsideration, or appeal route.", escalateWhen: "A concrete decision or action needs review.", route: "Convert the research question into a documented issue with source material." },
      { level: 5, title: "External oversight", purpose: "If an outside regulator, ombuds, civil-rights agency, licensing body, or other reviewer has jurisdiction, that can be a separate escalation route.", escalateWhen: "The conduct falls within the outside body's authority.", route: "Verify jurisdiction rather than assuming an agency can intervene." },
      { level: 6, title: "Independent adjudication", purpose: "Some disputes ultimately require an administrative tribunal or court to resolve the legal issue.", escalateWhen: "A specific legal review mechanism exists.", route: "Research the governing procedure and deadline before taking that step." },
      { level: 7, title: "Remedy / enforcement", purpose: "If a final decision or order creates an obligation, track whether the remedy is actually delivered.", escalateWhen: "Implementation does not match the final resolution.", route: "Preserve the final decision and document each compliance problem." },
    ],
    actions: (a) => [
      ...(a.goal === "decode" ? [{ title: "Legal Decoder", description: "Turn dense language into a plain-language explanation.", href: "/legal-decoder", label: "Open Legal Decoder", icon: FileSearch }] : []),
      ...(a.goal === "source" ? [{ title: "Justice Research", description: "Search the curated authority library and open source documents.", href: "/justice-research", label: "Open Research", icon: Scale }] : []),
      ...(a.goal === "case" ? [{ title: "Case Builder", description: "Turn your facts into an organized case record.", href: "/case-builder", label: "Open Case Builder", icon: ClipboardCheck }] : []),
      ...(a.goal === "questions" ? [{ title: "Knowledge Center", description: "Use the relevant topic guide to develop research questions.", href: "/education-library", label: "Open Knowledge Center", icon: BookOpen }] : []),
    ],
  },
];

const fallback = workflows[0];

export default function GuidedWorkflows() {
  const [params, setParams] = useSearchParams();
  const initial = params.get("type") || "notice";
  const [workflowId, setWorkflowId] = useState(workflows.some((w) => w.id === initial) ? initial : fallback.id);
  const workflow = workflows.find((w) => w.id === workflowId) ?? fallback;
  const [stepIndex, setStepIndex] = useState(-1);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const progress = stepIndex < 0 ? 0 : Math.round(((stepIndex + 1) / workflow.steps.length) * 100);
  const currentStep = workflow.steps[stepIndex];
  const finished = stepIndex >= workflow.steps.length;
  const actions = useMemo(() => workflow.actions(answers), [workflow, answers]);

  const chooseWorkflow = (id: string) => {
    setWorkflowId(id);
    setAnswers({});
    setStepIndex(-1);
    setParams({ type: id });
  };

  const chooseAnswer = (value: string) => {
    const next = { ...answers, [currentStep.id]: value };
    setAnswers(next);
    setStepIndex((valueIndex) => valueIndex + 1);
  };

  const reset = () => {
    setAnswers({});
    setStepIndex(-1);
  };

  return (
    <Layout>
      <main className="min-h-screen bg-background">
        <section className="border-b border-border/60">
          <div className="container max-w-6xl py-12 lg:py-16">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Guided self-advocacy</p>
              <h1 className="mt-3 font-serif text-4xl tracking-tight md:text-5xl">Start with what is happening.</h1>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Answer a few focused questions. Decoded Justice will route you toward the existing tools, education, records, and case-workspace actions that fit your situation.
              </p>
              <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                This is navigation and education—not a legal conclusion or prediction about your case.
              </div>
            </div>
          </div>
        </section>

        <section className="container max-w-6xl py-8">
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <aside className="space-y-2">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Choose a starting point</p>
              {workflows.map((item) => {
                const Icon = item.icon;
                const selected = item.id === workflow.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => chooseWorkflow(item.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${selected ? "border-primary/40 bg-primary/5" : "border-border/60 hover:bg-muted/40"}`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="text-sm">{item.title}</span>
                  </button>
                );
              })}
            </aside>

            <div className="min-w-0">
              <Card className="overflow-hidden">
                <CardHeader className="border-b border-border/60">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl">{workflow.title}</CardTitle>
                      <CardDescription className="mt-2 max-w-2xl leading-6">{workflow.description}</CardDescription>
                    </div>
                    {stepIndex >= 0 && !finished && (
                      <Button variant="ghost" size="sm" onClick={reset}>
                        <RotateCcw className="mr-1.5 h-4 w-4" /> Restart
                      </Button>
                    )}
                  </div>
                  {stepIndex >= 0 && !finished && <Progress className="mt-5" value={progress} aria-label={`${progress}% complete`} />}
                </CardHeader>

                <CardContent className="p-6 md:p-8">
                  {stepIndex < 0 && (
                    <div className="max-w-2xl">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <HelpCircle className="h-6 w-6" />
                      </div>
                      <h2 className="mt-5 text-xl font-semibold">We’ll narrow this down together.</h2>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        You do not need to know the legal terminology. The questions are designed to identify the practical next step and what information may be worth preserving.
                      </p>
                      <Button className="mt-6" onClick={() => setStepIndex(0)}>
                        Start workflow <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {stepIndex >= 0 && !finished && currentStep && (
                    <div className="max-w-2xl">
                      <p className="text-xs font-medium text-muted-foreground">Question {stepIndex + 1} of {workflow.steps.length}</p>
                      <h2 className="mt-3 text-2xl font-semibold tracking-tight">{currentStep.question}</h2>
                      {currentStep.helper && <p className="mt-2 text-sm text-muted-foreground">{currentStep.helper}</p>}
                      <div className="mt-6 grid gap-3">
                        {currentStep.choices.map((choice) => (
                          <button
                            key={choice.value}
                            onClick={() => chooseAnswer(choice.value)}
                            className="group flex items-center justify-between rounded-xl border border-border/70 p-4 text-left transition hover:border-primary/40 hover:bg-primary/5"
                          >
                            <span className="text-sm font-medium">{choice.label}</span>
                            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {finished && (
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold">Your next-step map</h2>
                          <p className="text-sm text-muted-foreground">Based on the answers you gave, these tools are relevant starting points.</p>
                        </div>
                      </div>

                      <section className="mt-7 rounded-2xl border border-primary/20 bg-primary/[0.035] p-5 md:p-6">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Scale className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Path to Justice</p>
                            <h3 className="mt-1 text-xl font-semibold">You do not have to stop at the first complaint.</h3>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                              When a problem is not resolved, move to the next available level. The exact route depends on the subject, jurisdiction, and governing procedure.
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 space-y-3">
                          {workflow.escalation.map((stage) => (
                            <div key={stage.level} className="relative rounded-xl border border-border/60 bg-background p-4">
                              <div className="flex gap-4">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/5 text-sm font-semibold text-primary">
                                  {stage.level}
                                </div>
                                <div className="min-w-0">
                                  <h4 className="font-semibold">{stage.title}</h4>
                                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{stage.purpose}</p>
                                  <div className="mt-3 grid gap-3 text-xs sm:grid-cols-2">
                                    <div className="rounded-lg bg-muted/40 p-3">
                                      <p className="font-semibold text-foreground">Escalate when</p>
                                      <p className="mt-1 leading-5 text-muted-foreground">{stage.escalateWhen}</p>
                                    </div>
                                    <div className="rounded-lg bg-muted/40 p-3">
                                      <p className="font-semibold text-foreground">What to do</p>
                                      <p className="mt-1 leading-5 text-muted-foreground">{stage.route}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-5 rounded-xl border border-border/60 bg-background p-4 text-sm">
                          <p className="font-medium">Keep the escalation record connected.</p>
                          <p className="mt-1 leading-6 text-muted-foreground">
                            Each complaint, response, denial, appeal, referral, and final decision should become part of the same chronology. That creates a record of what you asked for, who responded, what changed, and what remains unresolved.
                          </p>
                        </div>
                      </section>

                      <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {actions.map((action) => {
                          const Icon = action.icon;
                          return (
                            <Card key={action.title} className="border-border/60">
                              <CardContent className="p-5">
                                <Icon className="h-5 w-5 text-primary" />
                                <h3 className="mt-4 font-semibold">{action.title}</h3>
                                <p className="mt-2 text-sm leading-6 text-muted-foreground">{action.description}</p>
                                <Button asChild variant="outline" className="mt-4">
                                  <Link to={action.href}>{action.label} <ArrowRight className="ml-2 h-4 w-4" /></Link>
                                </Button>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>

                      <div className="mt-8 rounded-xl border border-border/60 bg-muted/20 p-5">
                        <p className="text-sm font-medium">Preserve the source material</p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          Keep the original notice, order, message, record, or other source. The workflow does not establish that a legal violation occurred; it helps you organize what to investigate next.
                        </p>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        <Button onClick={reset} variant="ghost"><RotateCcw className="mr-1.5 h-4 w-4" /> Start over</Button>
                        <Button asChild variant="ghost"><Link to="/education-library"><BookOpen className="mr-1.5 h-4 w-4" /> Browse Knowledge Center</Link></Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
