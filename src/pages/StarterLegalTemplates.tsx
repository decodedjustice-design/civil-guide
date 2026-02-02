import { useState } from "react";
import { 
  FileText, 
  Shield, 
  AlertTriangle, 
  ChevronDown,
  ScrollText,
  FileSearch,
  Scale,
  ClipboardList,
  Mail
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { cn } from "@/lib/utils";

interface LegalTemplate {
  id: string;
  title: string;
  icon: React.ElementType;
  whatItIs: string;
  whenUsed: string;
  whatItDoesNot: string[];
  templateContent: string;
}

const legalTemplates: LegalTemplate[] = [
  {
    id: "evidence-preservation",
    title: "Evidence Preservation Letter",
    icon: Shield,
    whatItIs: "A formal written request asking an organization to preserve (not destroy) documents, videos, emails, or other records that may be relevant to a potential legal matter. This creates a paper trail showing you requested preservation.",
    whenUsed: "When you believe an organization (police department, employer, school, hospital, etc.) may have records related to an incident involving you, and you want to ensure those records are not routinely deleted or destroyed before you can obtain them through proper channels.",
    whatItDoesNot: [
      "Guarantee the organization will comply",
      "Legally compel preservation (only a court order can do that)",
      "Substitute for a formal public records request",
      "Create any attorney-client relationship"
    ],
    templateContent: `EVIDENCE PRESERVATION REQUEST

Date: [DATE]

To: [ORGANIZATION NAME]
    [RECORDS CUSTODIAN / LEGAL DEPARTMENT]
    [ADDRESS]

Re: Request to Preserve Evidence

Dear Records Custodian:

I am writing to formally request that [ORGANIZATION NAME] preserve all documents, records, and materials that may be relevant to [BRIEF DESCRIPTION OF INCIDENT OR MATTER].

This preservation request includes, but is not limited to:
• All video recordings (including body camera, surveillance, dashcam footage)
• All audio recordings
• All written reports, notes, and memoranda
• All electronic communications (emails, text messages, radio transmissions)
• All photographs
• All dispatch records and call logs
• All personnel files related to involved parties
• All policies and procedures in effect at the time

Relevant time period: [START DATE] through [END DATE]
Relevant location(s): [LOCATION]
Relevant individuals: [NAMES IF KNOWN]

Please confirm receipt of this request in writing within [14] days.

I understand that routine document destruction may occur. This letter serves as formal notice that these records may be relevant to a legal matter, and I am requesting they be preserved.

Respectfully,

[YOUR NAME]
[YOUR ADDRESS]
[YOUR PHONE/EMAIL]

---
DISCLAIMER: This is an educational template only. It does not constitute legal advice. Consult with a licensed attorney for guidance specific to your situation.`
  },
  {
    id: "public-records-request",
    title: "Public Records Request (WA PRA)",
    icon: FileSearch,
    whatItIs: "A formal request under Washington's Public Records Act (RCW 42.56) asking a government agency to provide copies of public records. Washington has one of the strongest public records laws in the nation, and agencies must respond within 5 business days.",
    whenUsed: "When you need to obtain documents from Washington State or local government agencies, including police reports, emails, policies, contracts, personnel records (with limitations), or other government documents.",
    whatItDoesNot: [
      "Guarantee you will receive all records requested (some exemptions apply)",
      "Apply to federal agencies (use FOIA instead)",
      "Apply to private companies or individuals",
      "Waive any applicable fees for copies"
    ],
    templateContent: `PUBLIC RECORDS REQUEST
Under the Washington Public Records Act (RCW 42.56)

Date: [DATE]

To: [AGENCY NAME]
    Public Records Officer
    [ADDRESS]

Re: Public Records Request

Dear Public Records Officer:

Pursuant to the Washington Public Records Act, RCW 42.56, I am requesting copies of the following public records:

1. [DESCRIBE RECORD TYPE - be as specific as possible]

2. [DESCRIBE RECORD TYPE]

3. [DESCRIBE RECORD TYPE]

Relevant time period: [START DATE] through [END DATE]
Relevant case/incident number (if known): [NUMBER]
Relevant individuals (if applicable): [NAMES]

I am requesting these records in [electronic/paper] format.

Please provide an estimate of any applicable copying fees before processing. I am willing to pay up to $[AMOUNT] without prior approval.

If any portion of this request is denied, please cite the specific exemption(s) and provide a written explanation as required by RCW 42.56.210.

As required by law, please respond within five (5) business days.

Preferred contact method: [EMAIL/MAIL]

Thank you for your assistance.

Respectfully,

[YOUR NAME]
[YOUR ADDRESS]
[YOUR EMAIL]
[YOUR PHONE]

---
DISCLAIMER: This is an educational template only. It does not constitute legal advice. The Public Records Act has specific procedures and exemptions. Consult with a licensed attorney for guidance specific to your situation.`
  },
  {
    id: "tort-claim-notice",
    title: "Tort Claim Notice (RCW 4.96.020)",
    icon: ScrollText,
    whatItIs: "A mandatory pre-lawsuit notice required before suing Washington State or local governments for injuries or damages. Under RCW 4.96.020, you must file this claim within the statutory time limit (typically 3 years for most claims, but shorter for some).",
    whenUsed: "Before filing a lawsuit against a Washington State agency, county, city, or other local government for personal injury, property damage, or other tort claims. This is a REQUIRED step — failure to file may bar your lawsuit.",
    whatItDoesNot: [
      "File a lawsuit (it only preserves your right to sue later)",
      "Guarantee you will receive compensation",
      "Extend or toll the statute of limitations",
      "Substitute for legal representation in complex cases"
    ],
    templateContent: `TORT CLAIM NOTICE
Pursuant to RCW 4.96.020

Date: [DATE]

CLAIMANT INFORMATION:
Name: [YOUR FULL LEGAL NAME]
Date of Birth: [DOB]
Address: [YOUR ADDRESS]
Phone: [YOUR PHONE]
Email: [YOUR EMAIL]

CLAIM AGAINST:
[NAME OF GOVERNMENT ENTITY]
[ADDRESS OF GOVERNMENT ENTITY]

CLAIM DETAILS:

1. DATE OF INCIDENT: [DATE]

2. TIME OF INCIDENT: [TIME]

3. LOCATION OF INCIDENT: 
[SPECIFIC ADDRESS/LOCATION]

4. DESCRIPTION OF INCIDENT:
[Describe what happened in factual terms. Include relevant details but do not speculate or make legal conclusions.]

5. DESCRIPTION OF INJURIES OR DAMAGES:
[Describe physical injuries, property damage, or other losses. Be factual.]

6. NAMES OF GOVERNMENT EMPLOYEES INVOLVED (if known):
[LIST NAMES AND TITLES]

7. NAMES OF WITNESSES (if known):
[LIST NAMES AND CONTACT INFO IF AVAILABLE]

8. AMOUNT OF DAMAGES CLAIMED:
$[AMOUNT] or "To be determined based on ongoing medical treatment/investigation"

I declare under penalty of perjury under the laws of the State of Washington that the foregoing is true and correct.

Signed at [CITY], Washington on [DATE].

_______________________________
[YOUR SIGNATURE]
[YOUR PRINTED NAME]

---
DISCLAIMER: This is an educational template only. It does not constitute legal advice. Tort claims have STRICT DEADLINES that vary by claim type. Missing the deadline may permanently bar your claim. Consult with a licensed attorney IMMEDIATELY for guidance specific to your situation.`
  },
  {
    id: "section-1983-outline",
    title: "Federal Civil Rights Complaint Outline (§1983)",
    icon: Scale,
    whatItIs: "An educational outline showing the basic structure of a federal civil rights complaint under 42 U.S.C. § 1983. Section 1983 allows individuals to sue state and local government officials who violate their constitutional rights.",
    whenUsed: "As an educational reference for understanding what elements are typically included in a federal civil rights lawsuit. This outline shows common sections but is NOT a complete, court-ready document.",
    whatItDoesNot: [
      "Provide a complete, filing-ready complaint",
      "Cover all possible claims or legal theories",
      "Substitute for attorney representation in federal court",
      "Address federal rules of civil procedure requirements"
    ],
    templateContent: `FEDERAL CIVIL RIGHTS COMPLAINT OUTLINE
42 U.S.C. § 1983 - Educational Reference Only

UNITED STATES DISTRICT COURT
[WESTERN/EASTERN] DISTRICT OF WASHINGTON

[YOUR NAME],
    Plaintiff,
                                        Case No. ____________
v.
                                        COMPLAINT FOR VIOLATION
[DEFENDANT NAME(S)],                    OF CIVIL RIGHTS
    Defendant(s).                       42 U.S.C. § 1983

---

I. INTRODUCTION
[Brief statement of what the case is about - 1-2 paragraphs]

II. JURISDICTION AND VENUE
• Federal question jurisdiction: 28 U.S.C. § 1331
• Civil rights jurisdiction: 28 U.S.C. § 1343
• Venue proper because events occurred in this district

III. PARTIES
A. Plaintiff
   [Your name, address, and relevant background]
   
B. Defendant(s)
   [For each defendant: name, title, employer, and whether sued in individual/official capacity]

IV. FACTUAL ALLEGATIONS
[Numbered paragraphs describing what happened - be specific and factual]
1. On [DATE], at approximately [TIME]...
2. [Continue chronologically]

V. CLAIMS FOR RELIEF

COUNT I: [CONSTITUTIONAL VIOLATION - e.g., "Fourth Amendment - Excessive Force"]
• Restate relevant facts by reference
• Identify the constitutional right violated
• Explain how defendant's actions violated that right
• State defendant acted under color of state law

COUNT II: [ADDITIONAL CLAIMS IF APPLICABLE]

VI. PRAYER FOR RELIEF
Plaintiff requests:
1. Compensatory damages in an amount to be proven at trial
2. Punitive damages against individual defendants
3. Declaratory relief
4. Injunctive relief [if applicable]
5. Reasonable attorney's fees under 42 U.S.C. § 1988
6. Costs of suit
7. Such other relief as the Court deems just

VII. JURY DEMAND
Plaintiff demands a trial by jury on all issues so triable.

Dated: _______________

_______________________________
[Signature]
[Printed Name]
[Address]
[Phone]
[Email]
Pro Se Plaintiff

---
DISCLAIMER: This is an EDUCATIONAL OUTLINE only. Federal civil rights litigation is complex. Pro se complaints must meet specific formatting and pleading requirements. Missing elements or deadlines can result in dismissal. STRONGLY CONSULT a licensed attorney before filing in federal court.`
  },
  {
    id: "discovery-examples",
    title: "Discovery Request Examples",
    icon: ClipboardList,
    whatItIs: "Educational examples of common discovery requests used in civil litigation. Discovery is the formal process where parties exchange information and evidence before trial. These examples show the types and format of requests.",
    whenUsed: "As an educational reference for understanding what discovery requests look like. Actual discovery is governed by court rules (Federal Rules of Civil Procedure or Washington Superior Court Civil Rules) and typically occurs after a lawsuit is filed.",
    whatItDoesNot: [
      "Provide complete, case-specific discovery",
      "Cover all possible discovery methods",
      "Apply to pre-lawsuit situations",
      "Substitute for attorney guidance on discovery strategy"
    ],
    templateContent: `DISCOVERY REQUEST EXAMPLES
Educational Reference Only

---

EXAMPLE: INTERROGATORIES (Written Questions)

PLAINTIFF'S FIRST SET OF INTERROGATORIES TO DEFENDANT

INSTRUCTIONS: Pursuant to [FRCP 33 / CR 33], you are required to answer each interrogatory separately and fully, in writing and under oath, within [30] days.

INTERROGATORY NO. 1:
State the full name, job title, badge number (if applicable), and current contact information for each person who was present at [LOCATION] on [DATE] between [TIME] and [TIME].

INTERROGATORY NO. 2:
Describe in detail all training you received regarding [USE OF FORCE / SUBJECT MATTER] during the five years preceding [DATE OF INCIDENT].

INTERROGATORY NO. 3:
Identify all documents, recordings, or other evidence you are aware of relating to the incident on [DATE], including the custodian of each item.

---

EXAMPLE: REQUESTS FOR PRODUCTION OF DOCUMENTS

PLAINTIFF'S FIRST REQUEST FOR PRODUCTION OF DOCUMENTS

REQUEST NO. 1:
All video recordings, including but not limited to body camera, dashboard camera, and surveillance footage, depicting any portion of the incident on [DATE].

REQUEST NO. 2:
All written reports, including incident reports, use of force reports, and supervisory reviews, relating to the incident on [DATE].

REQUEST NO. 3:
All policies, procedures, and training materials in effect on [DATE] relating to [SUBJECT MATTER].

REQUEST NO. 4:
All communications, including emails, text messages, and radio transmissions, relating to [PLAINTIFF NAME] or the incident on [DATE].

REQUEST NO. 5:
The complete personnel file for [DEFENDANT OFFICER NAME], including all prior complaints, disciplinary actions, and commendations.

---

EXAMPLE: REQUESTS FOR ADMISSION

PLAINTIFF'S FIRST REQUESTS FOR ADMISSION

REQUEST NO. 1:
Admit that on [DATE], you were employed by [AGENCY NAME] as a [TITLE].

REQUEST NO. 2:
Admit that on [DATE], you were acting within the scope of your employment when you encountered [PLAINTIFF NAME].

REQUEST NO. 3:
Admit that the video recording marked as Exhibit A is an authentic and unaltered copy of body camera footage from [DATE].

REQUEST NO. 4:
Admit that no written policy authorized the conduct depicted in Exhibit A.

---
DISCLAIMER: These are EDUCATIONAL EXAMPLES only. Discovery rules are complex and have strict deadlines. Improperly formatted discovery may be objected to or stricken. Discovery strategy should be developed with a licensed attorney.`
  }
];

function TemplateCard({ template }: { template: LegalTemplate }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = template.icon;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between text-left hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
            <Icon className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{template.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">Click to view template and guidance</p>
          </div>
        </div>
        <ChevronDown 
          className={cn(
            "w-6 h-6 text-muted-foreground shrink-0 transition-transform duration-200",
            isExpanded && "rotate-180"
          )} 
        />
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-6 border-t border-border">
          {/* Educational Info */}
          <div className="pt-6 space-y-4">
            {/* What It Is */}
            <div className="p-4 rounded-xl bg-secondary/50">
              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-accent" />
                What This Document Is
              </h4>
              <p className="text-sm text-muted-foreground">{template.whatItIs}</p>
            </div>

            {/* When Used */}
            <div className="p-4 rounded-xl bg-secondary/50">
              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent" />
                When It Is Used
              </h4>
              <p className="text-sm text-muted-foreground">{template.whenUsed}</p>
            </div>

            {/* What It Does NOT Do */}
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
              <h4 className="text-sm font-semibold text-destructive mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                What This Document Does NOT Do
              </h4>
              <ul className="space-y-1">
                {template.whatItDoesNot.map((item, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Template Content */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Educational Template</h4>
            <div className="p-4 rounded-xl bg-muted/50 border border-border overflow-x-auto">
              <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed">
                {template.templateContent}
              </pre>
            </div>
          </div>

          {/* Not Legal Advice Warning */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">This is NOT legal advice</p>
              <p className="text-sm text-muted-foreground mt-1">
                This template is for educational purposes only. It does not create an attorney-client relationship. 
                Laws and procedures vary. Consult with a licensed attorney before using any legal document.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StarterLegalTemplates() {
  return (
    <Layout>
      <div className="container py-12 lg:py-20">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
              <FileText className="w-4 h-4" />
              <span>Educational Templates</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Starter Legal Templates
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Educational templates to help you understand common legal documents. 
              These are starting points for learning — not substitutes for legal advice.
            </p>
          </div>

          {/* Prominent Disclaimer */}
          <div className="mb-12">
            <Disclaimer variant="prominent" />
          </div>

          {/* Important Notice */}
          <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-12">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">Before Using These Templates</h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span><strong className="text-foreground">These are educational examples only.</strong> They are not tailored to your specific situation.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span><strong className="text-foreground">Do not auto-fill with real facts</strong> until you understand what you're doing and have consulted appropriate resources.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span><strong className="text-foreground">Legal deadlines are strict.</strong> Many claims have short filing windows. Missing a deadline can bar your claim permanently.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span><strong className="text-foreground">Consider consulting an attorney</strong> — especially for tort claims, federal complaints, and complex matters.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Wellbeing Note */}
          <div className="p-4 rounded-xl bg-secondary/50 border border-border mb-8">
            <p className="text-sm text-muted-foreground text-center">
              <span className="text-accent font-medium">Take your time.</span> You can save this page and return later. 
              Legal matters can feel overwhelming — it's okay to pause and come back when you're ready.
            </p>
          </div>

          {/* Templates */}
          <div className="space-y-4">
            {legalTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>

          {/* Footer Disclaimer */}
          <div className="mt-12 pt-8 border-t border-border">
            <Disclaimer className="justify-center" />
          </div>

        </div>
      </div>
    </Layout>
  );
}
