import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  ArrowLeft,
  ShieldAlert,
  Briefcase,
  Home,
  GraduationCap,
  Stethoscope,
  Scale,
  Building,
  Landmark,
  Users,
  HelpCircle,
  Search
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { CaseProfileForm } from "@/components/analyzer/CaseProfileForm";
import { AnalyzerResults, generateResultContent } from "@/components/analyzer/AnalyzerResults";
import { usePatternEngine, CivilRightsSystem } from "@/hooks/usePatternEngine";
import { useAuth } from "@/contexts/AuthContext";
import heroImage from "@/assets/hero-analysis.png";

type SystemId = 
  | "police" 
  | "employer" 
  | "housing" 
  | "school" 
  | "healthcare" 
  | "courts" 
  | "jail" 
  | "government" 
  | "cps_dcyf"
  | "unsure";

interface SystemCategory {
  id: SystemId;
  label: string;
  icon: React.ElementType;
  description: string;
}

interface FollowUpQuestion {
  id: string;
  question: string;
  options: { id: string; label: string }[];
}

interface SystemResult {
  summary: string;
  explanation: string;
  rightsInsightFilter: string;
  supportNetworkFilter: string;
}

// System categories for Step 1
const systemCategories: SystemCategory[] = [
  { 
    id: "police", 
    label: "Police or Sheriff", 
    icon: ShieldAlert, 
    description: "Interactions with law enforcement, arrests, use of force, searches" 
  },
  { 
    id: "employer", 
    label: "Employer or Workplace", 
    icon: Briefcase, 
    description: "Discrimination, harassment, retaliation, termination, accommodations" 
  },
  { 
    id: "housing", 
    label: "Housing or Landlord", 
    icon: Home, 
    description: "Eviction, discrimination, habitability, repairs, lease issues" 
  },
  { 
    id: "school", 
    label: "School or Education Program", 
    icon: GraduationCap, 
    description: "Student rights, discipline, discrimination, IEP/504 plans" 
  },
  { 
    id: "healthcare", 
    label: "Healthcare Provider", 
    icon: Stethoscope, 
    description: "Medical care, discrimination, privacy, access to records" 
  },
  { 
    id: "courts", 
    label: "Court or Prosecutor", 
    icon: Scale, 
    description: "Due process, access to justice, court procedures, appeals" 
  },
  { 
    id: "jail", 
    label: "Jail or Prison", 
    icon: Building, 
    description: "Conditions, medical care, visitation, reentry, communication" 
  },
  { 
    id: "cps_dcyf", 
    label: "CPS or DCYF (Child Welfare)", 
    icon: Users, 
    description: "Investigations, safety plans, dependency cases, family rights" 
  },
  { 
    id: "government", 
    label: "Government Agency", 
    icon: Landmark, 
    description: "Benefits, licensing, permits, administrative decisions" 
  },
  { 
    id: "unsure", 
    label: "Not sure yet", 
    icon: HelpCircle, 
    description: "I'm not sure which system applies to my situation" 
  },
];

// Conditional follow-up questions based on system
// Each system has 8-12 questions covering: urgency, deadlines, evidence, retaliation risk, family impact, prior attempts, safety
const followUpQuestions: Record<SystemId, FollowUpQuestion[]> = {
  police: [
    {
      id: "incident-type",
      question: "What best describes what happened?",
      options: [
        { id: "force", label: "Use of force or physical contact" },
        { id: "arrest", label: "Arrest or detention" },
        { id: "search", label: "Search of person, vehicle, or property" },
        { id: "stop", label: "Stop, questioning, or harassment" },
        { id: "retaliation", label: "Retaliation for a complaint or recording" },
        { id: "other", label: "Other interaction" },
      ]
    },
    {
      id: "timing",
      question: "When did this happen?",
      options: [
        { id: "today", label: "Today or in the last few days" },
        { id: "weeks", label: "Within the last few weeks" },
        { id: "months", label: "Within the last few months" },
        { id: "over-year", label: "More than a year ago" },
        { id: "ongoing", label: "It's ongoing or happened multiple times" },
      ]
    },
    {
      id: "injury",
      question: "Did this involve an injury or need for medical attention?",
      options: [
        { id: "serious", label: "Yes — serious injury or hospitalization" },
        { id: "minor", label: "Yes — minor injury" },
        { id: "no-physical", label: "No physical injury, but emotional impact" },
        { id: "none", label: "No injury" },
      ]
    },
    {
      id: "evidence",
      question: "Do you have any documentation or evidence?",
      options: [
        { id: "video", label: "Video or photos of the incident" },
        { id: "medical", label: "Medical records or photos of injuries" },
        { id: "witnesses", label: "Witnesses who saw what happened" },
        { id: "police-report", label: "Police report or incident number" },
        { id: "none", label: "I don't have documentation yet" },
        { id: "unsure", label: "I'm not sure what counts as evidence" },
      ]
    },
    {
      id: "body-camera",
      question: "Do you know if body camera or dash camera footage exists?",
      options: [
        { id: "yes-exists", label: "Yes — I believe footage exists" },
        { id: "requested", label: "I've already requested it" },
        { id: "unknown", label: "I don't know" },
        { id: "no-camera", label: "No cameras were present" },
      ]
    },
    {
      id: "prior-complaints",
      question: "Have you filed a complaint or report about this?",
      options: [
        { id: "filed", label: "Yes — I filed a formal complaint" },
        { id: "informal", label: "I reported it informally" },
        { id: "considering", label: "I'm considering it" },
        { id: "afraid", label: "I'm afraid to file a complaint" },
        { id: "no", label: "No, I haven't reported it" },
      ]
    },
    {
      id: "retaliation-concern",
      question: "Are you concerned about retaliation or ongoing contact with this officer or department?",
      options: [
        { id: "active-case", label: "Yes — I have an active case or ongoing contact" },
        { id: "same-area", label: "Yes — I live or work in the same area" },
        { id: "some-concern", label: "Some concern, but no immediate contact expected" },
        { id: "no-concern", label: "No — I don't expect further contact" },
      ]
    },
    {
      id: "family-impact",
      question: "Did this incident affect others in your household or family?",
      options: [
        { id: "children-present", label: "Children were present or affected" },
        { id: "family-witnessed", label: "Family members witnessed or were involved" },
        { id: "family-impacted", label: "My family has been impacted (stress, fear, financial)" },
        { id: "just-me", label: "It primarily affected just me" },
      ]
    },
    {
      id: "immediate-safety",
      question: "Do you feel safe right now?",
      options: [
        { id: "safe", label: "Yes — I feel safe" },
        { id: "uncertain", label: "Uncertain — I have some concerns" },
        { id: "not-safe", label: "No — I have ongoing safety concerns" },
        { id: "prefer-not", label: "I prefer not to answer" },
      ]
    },
    {
      id: "priority",
      question: "What matters most to you right now?",
      options: [
        { id: "understand", label: "Understanding what happened and my rights" },
        { id: "document", label: "Documenting everything properly" },
        { id: "complaint", label: "Filing a formal complaint" },
        { id: "legal", label: "Talking to an attorney" },
        { id: "safety", label: "Ensuring my safety" },
        { id: "unsure", label: "I'm not sure yet" },
      ]
    },
  ],
  employer: [
    {
      id: "issue-type",
      question: "What issue best fits your situation?",
      options: [
        { id: "discrimination", label: "Discrimination (race, gender, age, disability, etc.)" },
        { id: "retaliation", label: "Retaliation for reporting or whistleblowing" },
        { id: "termination", label: "Wrongful termination or demotion" },
        { id: "harassment", label: "Harassment or hostile work environment" },
        { id: "accommodation", label: "Denied accommodation or leave" },
        { id: "wage", label: "Wage theft or unpaid wages" },
        { id: "other", label: "Other workplace issue" },
      ]
    },
    {
      id: "timing",
      question: "When did this issue begin or occur?",
      options: [
        { id: "current", label: "It's happening now" },
        { id: "recent", label: "Within the last few weeks" },
        { id: "months", label: "Within the last few months" },
        { id: "over-180", label: "More than 6 months ago" },
        { id: "over-year", label: "More than a year ago" },
      ]
    },
    {
      id: "employment-status",
      question: "What is your current employment status?",
      options: [
        { id: "employed", label: "Still employed there" },
        { id: "terminated", label: "Terminated or fired" },
        { id: "resigned", label: "I resigned" },
        { id: "leave", label: "On leave or suspended" },
        { id: "contractor", label: "I was a contractor, not employee" },
      ]
    },
    {
      id: "evidence",
      question: "What documentation do you have?",
      options: [
        { id: "emails", label: "Emails or written communications" },
        { id: "reviews", label: "Performance reviews or HR records" },
        { id: "witnesses", label: "Coworkers who witnessed incidents" },
        { id: "notes", label: "Personal notes or journal entries" },
        { id: "recordings", label: "Recordings (if legal in your state)" },
        { id: "none", label: "I don't have documentation yet" },
      ]
    },
    {
      id: "hr-complaint",
      question: "Have you reported this to HR or management?",
      options: [
        { id: "formal-hr", label: "Yes — formal HR complaint" },
        { id: "informal", label: "Yes — informal conversation" },
        { id: "no-afraid", label: "No — I'm afraid of retaliation" },
        { id: "no-wont-help", label: "No — I don't think it would help" },
        { id: "no-not-yet", label: "No — not yet" },
      ]
    },
    {
      id: "retaliation-concern",
      question: "Are you concerned about retaliation if you take action?",
      options: [
        { id: "already-retaliated", label: "I've already experienced retaliation" },
        { id: "likely", label: "Yes — I expect retaliation" },
        { id: "some-concern", label: "Some concern" },
        { id: "no-concern", label: "No — I'm not worried about that" },
        { id: "already-gone", label: "I no longer work there, so less concern" },
      ]
    },
    {
      id: "agency-filing",
      question: "Have you filed with any external agency?",
      options: [
        { id: "eeoc", label: "Yes — EEOC" },
        { id: "state", label: "Yes — State Human Rights Commission" },
        { id: "other-agency", label: "Yes — another agency" },
        { id: "considering", label: "I'm considering it" },
        { id: "no", label: "No" },
        { id: "unsure-what", label: "I don't know what agencies exist" },
      ]
    },
    {
      id: "family-impact",
      question: "How has this affected your household or family?",
      options: [
        { id: "financial", label: "Financial stress (lost income, bills)" },
        { id: "health", label: "Health or mental health impact" },
        { id: "insurance", label: "Lost health insurance or benefits" },
        { id: "relationships", label: "Strain on relationships" },
        { id: "manageable", label: "It's been difficult but manageable" },
        { id: "prefer-not", label: "I prefer not to answer" },
      ]
    },
    {
      id: "priority",
      question: "What matters most to you right now?",
      options: [
        { id: "job-back", label: "Getting my job back" },
        { id: "compensation", label: "Financial compensation" },
        { id: "record-clear", label: "Clearing my record" },
        { id: "accountability", label: "Holding them accountable" },
        { id: "reference", label: "Getting a fair reference" },
        { id: "understand", label: "Understanding my options" },
      ]
    },
  ],
  housing: [
    {
      id: "issue-type",
      question: "What issue best fits your situation?",
      options: [
        { id: "eviction", label: "Eviction or threat of eviction" },
        { id: "discrimination", label: "Discrimination in housing" },
        { id: "retaliation", label: "Retaliation for complaints or organizing" },
        { id: "habitability", label: "Habitability or repair issues" },
        { id: "accommodation", label: "Denied accommodation for disability" },
        { id: "voucher", label: "Housing voucher or subsidy issue" },
        { id: "other", label: "Other housing issue" },
      ]
    },
    {
      id: "timing",
      question: "When did this issue start?",
      options: [
        { id: "today", label: "Today or in the last few days" },
        { id: "weeks", label: "Within the last few weeks" },
        { id: "months", label: "Within the last few months" },
        { id: "ongoing", label: "It's been ongoing for a while" },
      ]
    },
    {
      id: "notice-received",
      question: "Have you received any written notices from your landlord?",
      options: [
        { id: "eviction-notice", label: "Yes — eviction or pay-or-vacate notice" },
        { id: "lease-violation", label: "Yes — lease violation notice" },
        { id: "rent-increase", label: "Yes — rent increase notice" },
        { id: "other-notice", label: "Yes — another type of notice" },
        { id: "verbal-only", label: "No — only verbal communication" },
        { id: "none", label: "No notices" },
      ]
    },
    {
      id: "deadline",
      question: "Do you have a deadline to respond or move?",
      options: [
        { id: "days", label: "Yes — within the next few days" },
        { id: "weeks", label: "Yes — within the next few weeks" },
        { id: "month-plus", label: "Yes — more than a month away" },
        { id: "unknown", label: "I'm not sure" },
        { id: "none", label: "No deadline that I know of" },
      ]
    },
    {
      id: "evidence",
      question: "What documentation do you have?",
      options: [
        { id: "lease", label: "Copy of my lease" },
        { id: "notices", label: "Notices from landlord" },
        { id: "photos", label: "Photos of conditions or damage" },
        { id: "communications", label: "Texts, emails, or letters" },
        { id: "repair-requests", label: "Written repair requests" },
        { id: "none", label: "I don't have documentation yet" },
      ]
    },
    {
      id: "prior-complaints",
      question: "Have you complained to your landlord about any issues?",
      options: [
        { id: "written", label: "Yes — in writing" },
        { id: "verbal", label: "Yes — verbally" },
        { id: "ignored", label: "Yes — but they ignored me" },
        { id: "retaliated", label: "Yes — and I faced retaliation" },
        { id: "no", label: "No" },
      ]
    },
    {
      id: "family-situation",
      question: "Who lives in the household?",
      options: [
        { id: "children", label: "Children under 18" },
        { id: "elderly", label: "Elderly family members" },
        { id: "disabled", label: "Someone with a disability" },
        { id: "just-me", label: "Just me" },
        { id: "adults", label: "Multiple adults, no children" },
        { id: "prefer-not", label: "I prefer not to answer" },
      ]
    },
    {
      id: "housing-type",
      question: "What type of housing is this?",
      options: [
        { id: "private", label: "Private rental (individual landlord)" },
        { id: "company", label: "Property management company" },
        { id: "public", label: "Public housing" },
        { id: "voucher", label: "Section 8 or housing voucher" },
        { id: "subsidized", label: "Other subsidized housing" },
        { id: "other", label: "Other" },
      ]
    },
    {
      id: "safety",
      question: "Do you feel safe in your current housing?",
      options: [
        { id: "safe", label: "Yes — I feel safe" },
        { id: "conditions", label: "No — due to housing conditions" },
        { id: "landlord", label: "No — due to landlord behavior" },
        { id: "other-residents", label: "No — due to other residents" },
        { id: "prefer-not", label: "I prefer not to answer" },
      ]
    },
    {
      id: "priority",
      question: "What matters most to you right now?",
      options: [
        { id: "stay", label: "Staying in my home" },
        { id: "repairs", label: "Getting repairs made" },
        { id: "time", label: "More time to find a new place" },
        { id: "rights", label: "Understanding my rights" },
        { id: "legal", label: "Getting legal help" },
        { id: "unsure", label: "I'm not sure" },
      ]
    },
  ],
  school: [
    {
      id: "issue-type",
      question: "What issue best fits your situation?",
      options: [
        { id: "discrimination", label: "Discrimination or unequal treatment" },
        { id: "discipline", label: "Suspension, expulsion, or discipline" },
        { id: "iep", label: "IEP, 504 plan, or special education" },
        { id: "harassment", label: "Bullying or harassment" },
        { id: "retaliation", label: "Retaliation for complaints" },
        { id: "records", label: "Records or transcript issues" },
        { id: "other", label: "Other school issue" },
      ]
    },
    {
      id: "who-affected",
      question: "Who is directly affected?",
      options: [
        { id: "child", label: "My child" },
        { id: "myself-student", label: "Myself (I'm a student)" },
        { id: "multiple-children", label: "Multiple children" },
        { id: "other", label: "Someone else I'm advocating for" },
      ]
    },
    {
      id: "timing",
      question: "When did this issue start?",
      options: [
        { id: "current", label: "Currently happening" },
        { id: "recent", label: "Within the last few weeks" },
        { id: "this-year", label: "Earlier this school year" },
        { id: "prior-year", label: "Previous school year" },
        { id: "ongoing", label: "It's been ongoing for a long time" },
      ]
    },
    {
      id: "discipline-status",
      question: "Is there a pending disciplinary action?",
      options: [
        { id: "suspended", label: "Currently suspended" },
        { id: "expulsion-pending", label: "Expulsion hearing scheduled" },
        { id: "hearing-scheduled", label: "Discipline hearing scheduled" },
        { id: "completed", label: "Discipline already completed" },
        { id: "none", label: "No disciplinary action" },
      ]
    },
    {
      id: "deadline",
      question: "Do you have any upcoming deadlines or meetings?",
      options: [
        { id: "days", label: "Yes — within the next few days" },
        { id: "weeks", label: "Yes — within the next few weeks" },
        { id: "scheduled", label: "I have a meeting scheduled" },
        { id: "unknown", label: "I'm not sure" },
        { id: "none", label: "No deadlines that I know of" },
      ]
    },
    {
      id: "evidence",
      question: "What documentation do you have?",
      options: [
        { id: "iep-504", label: "IEP or 504 plan" },
        { id: "discipline-records", label: "Discipline records or notices" },
        { id: "emails", label: "Emails or communications with school" },
        { id: "incident-reports", label: "Incident reports" },
        { id: "notes", label: "Personal notes from meetings" },
        { id: "none", label: "I don't have documentation yet" },
      ]
    },
    {
      id: "prior-complaints",
      question: "Have you raised concerns with the school before?",
      options: [
        { id: "formal", label: "Yes — formal written complaint" },
        { id: "meetings", label: "Yes — in meetings or calls" },
        { id: "ignored", label: "Yes — but I was ignored" },
        { id: "retaliated", label: "Yes — and my child faced retaliation" },
        { id: "no", label: "No" },
      ]
    },
    {
      id: "special-education",
      question: "Does this involve special education services?",
      options: [
        { id: "has-iep", label: "Yes — child has an IEP" },
        { id: "has-504", label: "Yes — child has a 504 plan" },
        { id: "evaluation-needed", label: "I've requested an evaluation" },
        { id: "denied", label: "Services were denied" },
        { id: "no", label: "No special education involvement" },
      ]
    },
    {
      id: "priority",
      question: "What matters most to you right now?",
      options: [
        { id: "return", label: "Getting my child back in school" },
        { id: "services", label: "Getting appropriate services" },
        { id: "record", label: "Clearing the disciplinary record" },
        { id: "safety", label: "Ensuring my child's safety" },
        { id: "understand", label: "Understanding our rights" },
        { id: "unsure", label: "I'm not sure" },
      ]
    },
  ],
  healthcare: [
    {
      id: "issue-type",
      question: "What issue best fits your situation?",
      options: [
        { id: "discrimination", label: "Discrimination in care" },
        { id: "denied", label: "Denied treatment or care" },
        { id: "privacy", label: "Privacy or records violation" },
        { id: "billing", label: "Billing or insurance dispute" },
        { id: "quality", label: "Quality of care concerns" },
        { id: "access", label: "Can't access my records" },
        { id: "other", label: "Other healthcare issue" },
      ]
    },
    {
      id: "timing",
      question: "When did this issue occur?",
      options: [
        { id: "current", label: "Currently ongoing" },
        { id: "recent", label: "Within the last few weeks" },
        { id: "months", label: "Within the last few months" },
        { id: "over-year", label: "More than a year ago" },
      ]
    },
    {
      id: "urgency",
      question: "Is there an urgent medical need right now?",
      options: [
        { id: "urgent", label: "Yes — I need care now" },
        { id: "delayed", label: "Care is being delayed" },
        { id: "ongoing-treatment", label: "I'm in the middle of treatment" },
        { id: "not-urgent", label: "No immediate medical urgency" },
      ]
    },
    {
      id: "provider-type",
      question: "What type of provider is involved?",
      options: [
        { id: "hospital", label: "Hospital" },
        { id: "doctor", label: "Doctor's office or clinic" },
        { id: "insurance", label: "Insurance company" },
        { id: "pharmacy", label: "Pharmacy" },
        { id: "mental-health", label: "Mental health provider" },
        { id: "other", label: "Other" },
      ]
    },
    {
      id: "evidence",
      question: "What documentation do you have?",
      options: [
        { id: "records", label: "Medical records" },
        { id: "bills", label: "Bills or insurance statements" },
        { id: "denial-letters", label: "Denial letters" },
        { id: "communications", label: "Communications with provider" },
        { id: "none", label: "I don't have documentation yet" },
        { id: "requested", label: "I've requested my records" },
      ]
    },
    {
      id: "prior-complaints",
      question: "Have you raised concerns with the provider?",
      options: [
        { id: "formal", label: "Yes — formal complaint" },
        { id: "patient-advocate", label: "Yes — to patient advocate" },
        { id: "verbal", label: "Yes — verbally" },
        { id: "ignored", label: "Yes — but I was ignored" },
        { id: "no", label: "No" },
      ]
    },
    {
      id: "insurance-involved",
      question: "Is insurance involved in this issue?",
      options: [
        { id: "denied-claim", label: "Yes — claim was denied" },
        { id: "coverage-dispute", label: "Yes — coverage dispute" },
        { id: "appealing", label: "Yes — I'm appealing a decision" },
        { id: "no-insurance", label: "I don't have insurance" },
        { id: "not-involved", label: "Insurance isn't the main issue" },
      ]
    },
    {
      id: "family-impact",
      question: "How has this affected you or your family?",
      options: [
        { id: "health-declined", label: "Health has gotten worse" },
        { id: "financial", label: "Financial stress from bills" },
        { id: "emotional", label: "Emotional or mental health impact" },
        { id: "care-disrupted", label: "Ongoing care was disrupted" },
        { id: "manageable", label: "Difficult but manageable" },
        { id: "prefer-not", label: "I prefer not to answer" },
      ]
    },
    {
      id: "priority",
      question: "What matters most to you right now?",
      options: [
        { id: "get-care", label: "Getting the care I need" },
        { id: "records", label: "Accessing my records" },
        { id: "billing", label: "Resolving a billing issue" },
        { id: "complaint", label: "Filing a formal complaint" },
        { id: "understand", label: "Understanding what happened" },
        { id: "unsure", label: "I'm not sure" },
      ]
    },
  ],
  courts: [
    {
      id: "issue-type",
      question: "What issue best fits your situation?",
      options: [
        { id: "due-process", label: "Due process violation" },
        { id: "representation", label: "Denied or inadequate representation" },
        { id: "procedure", label: "Procedural error or unfairness" },
        { id: "appeal", label: "Appeal or post-conviction issue" },
        { id: "access", label: "Can't access the court system" },
        { id: "other", label: "Other court issue" },
      ]
    },
    {
      id: "case-type",
      question: "What type of case is this?",
      options: [
        { id: "criminal", label: "Criminal case" },
        { id: "family", label: "Family law (divorce, custody, etc.)" },
        { id: "civil", label: "Civil lawsuit" },
        { id: "small-claims", label: "Small claims" },
        { id: "administrative", label: "Administrative hearing" },
        { id: "other", label: "Other" },
      ]
    },
    {
      id: "case-status",
      question: "What is the current status of your case?",
      options: [
        { id: "active", label: "Case is active / ongoing" },
        { id: "decided", label: "Decision was made" },
        { id: "appeal-pending", label: "Appeal is pending" },
        { id: "closed", label: "Case is closed" },
        { id: "not-filed", label: "Case hasn't been filed yet" },
      ]
    },
    {
      id: "deadline",
      question: "Do you have any upcoming deadlines?",
      options: [
        { id: "days", label: "Yes — within the next few days" },
        { id: "weeks", label: "Yes — within the next few weeks" },
        { id: "hearing-scheduled", label: "I have a hearing scheduled" },
        { id: "unknown", label: "I'm not sure" },
        { id: "none", label: "No deadlines that I know of" },
      ]
    },
    {
      id: "representation",
      question: "Do you have legal representation?",
      options: [
        { id: "attorney", label: "Yes — I have an attorney" },
        { id: "public-defender", label: "Yes — public defender" },
        { id: "pro-se", label: "No — I'm representing myself" },
        { id: "seeking", label: "I'm looking for an attorney" },
        { id: "cant-afford", label: "I can't afford an attorney" },
      ]
    },
    {
      id: "evidence",
      question: "What documentation do you have?",
      options: [
        { id: "court-orders", label: "Court orders or judgments" },
        { id: "filings", label: "Filings or motions" },
        { id: "transcripts", label: "Hearing transcripts" },
        { id: "correspondence", label: "Letters from the court" },
        { id: "none", label: "I don't have documentation yet" },
      ]
    },
    {
      id: "prior-attempts",
      question: "Have you tried to address this issue?",
      options: [
        { id: "motion-filed", label: "Yes — filed a motion" },
        { id: "appealed", label: "Yes — filed an appeal" },
        { id: "contacted-court", label: "Yes — contacted court staff" },
        { id: "no", label: "No — not yet" },
        { id: "unsure-how", label: "I don't know how to address it" },
      ]
    },
    {
      id: "family-impact",
      question: "How has this affected your life?",
      options: [
        { id: "custody", label: "Affecting custody or family" },
        { id: "financial", label: "Financial impact" },
        { id: "freedom", label: "Affecting my freedom" },
        { id: "housing-job", label: "Affecting housing or job" },
        { id: "stress", label: "Significant stress" },
        { id: "prefer-not", label: "I prefer not to answer" },
      ]
    },
    {
      id: "priority",
      question: "What matters most to you right now?",
      options: [
        { id: "understand", label: "Understanding the process" },
        { id: "deadline", label: "Meeting an upcoming deadline" },
        { id: "representation", label: "Finding legal help" },
        { id: "appeal", label: "Appealing a decision" },
        { id: "records", label: "Getting court records" },
        { id: "unsure", label: "I'm not sure" },
      ]
    },
  ],
  jail: [
    {
      id: "issue-type",
      question: "What issue best fits the situation?",
      options: [
        { id: "conditions", label: "Conditions of confinement" },
        { id: "medical", label: "Medical care or mental health" },
        { id: "communication", label: "Mail, phone, or visitation" },
        { id: "discipline", label: "Disciplinary action or solitary" },
        { id: "reentry", label: "Reentry or release issues" },
        { id: "abuse", label: "Abuse or excessive force" },
        { id: "other", label: "Other incarceration issue" },
      ]
    },
    {
      id: "who-affected",
      question: "Who is directly affected?",
      options: [
        { id: "myself", label: "I am currently incarcerated" },
        { id: "family", label: "A family member is incarcerated" },
        { id: "released", label: "I was recently released" },
        { id: "other", label: "Someone else I'm advocating for" },
      ]
    },
    {
      id: "facility-type",
      question: "What type of facility?",
      options: [
        { id: "county-jail", label: "County jail" },
        { id: "state-prison", label: "State prison" },
        { id: "federal", label: "Federal prison" },
        { id: "detention", label: "Detention center" },
        { id: "juvenile", label: "Juvenile facility" },
        { id: "unsure", label: "I'm not sure" },
      ]
    },
    {
      id: "urgency",
      question: "How urgent is the situation?",
      options: [
        { id: "emergency", label: "Emergency — immediate danger" },
        { id: "urgent", label: "Urgent — needs attention soon" },
        { id: "ongoing", label: "Ongoing issue" },
        { id: "past", label: "Issue already occurred" },
      ]
    },
    {
      id: "grievance-filed",
      question: "Has a grievance been filed?",
      options: [
        { id: "yes-pending", label: "Yes — still pending" },
        { id: "yes-denied", label: "Yes — it was denied" },
        { id: "yes-ignored", label: "Yes — no response" },
        { id: "no", label: "No grievance filed" },
        { id: "unsure-how", label: "Don't know how to file" },
      ]
    },
    {
      id: "evidence",
      question: "What documentation exists?",
      options: [
        { id: "grievances", label: "Grievance forms or responses" },
        { id: "medical-requests", label: "Medical request forms" },
        { id: "letters", label: "Letters or correspondence" },
        { id: "incident-reports", label: "Incident reports" },
        { id: "none", label: "No documentation yet" },
        { id: "hard-to-get", label: "Hard to get documentation inside" },
      ]
    },
    {
      id: "retaliation-concern",
      question: "Is there concern about retaliation?",
      options: [
        { id: "yes-experienced", label: "Yes — retaliation has occurred" },
        { id: "yes-feared", label: "Yes — afraid of retaliation" },
        { id: "some", label: "Some concern" },
        { id: "no", label: "No concern" },
      ]
    },
    {
      id: "outside-contact",
      question: "Has anyone outside been contacted?",
      options: [
        { id: "attorney", label: "Attorney" },
        { id: "family", label: "Family is aware" },
        { id: "advocacy-org", label: "Advocacy organization" },
        { id: "ombudsman", label: "Jail/prison ombudsman" },
        { id: "no-contact", label: "No outside contact yet" },
      ]
    },
    {
      id: "priority",
      question: "What matters most right now?",
      options: [
        { id: "medical", label: "Getting medical attention" },
        { id: "safety", label: "Safety from harm" },
        { id: "communication", label: "Restoring communication" },
        { id: "release", label: "Release or reentry issues" },
        { id: "document", label: "Documenting what happened" },
        { id: "unsure", label: "I'm not sure" },
      ]
    },
  ],
  government: [
    {
      id: "issue-type",
      question: "What issue best fits your situation?",
      options: [
        { id: "benefits-denied", label: "Benefits denied or terminated" },
        { id: "benefits-delayed", label: "Benefits delayed or reduced" },
        { id: "discrimination", label: "Discrimination by agency" },
        { id: "license", label: "Licensing or permit issue" },
        { id: "records", label: "Records or FOIA request" },
        { id: "other", label: "Other government agency issue" },
      ]
    },
    {
      id: "agency-type",
      question: "What type of agency is involved?",
      options: [
        { id: "dshs", label: "DSHS (Department of Social and Health Services)" },
        { id: "unemployment", label: "Unemployment / ESD" },
        { id: "disability", label: "Social Security / Disability" },
        { id: "medicaid", label: "Medicaid / Apple Health" },
        { id: "other-state", label: "Other state agency" },
        { id: "federal", label: "Federal agency" },
        { id: "local", label: "City or county agency" },
      ]
    },
    {
      id: "timing",
      question: "When did this issue occur?",
      options: [
        { id: "current", label: "Currently ongoing" },
        { id: "recent", label: "Within the last few weeks" },
        { id: "months", label: "Within the last few months" },
        { id: "over-year", label: "More than a year ago" },
      ]
    },
    {
      id: "decision-received",
      question: "Did you receive a decision letter?",
      options: [
        { id: "yes-recent", label: "Yes — within the last 30 days" },
        { id: "yes-older", label: "Yes — more than 30 days ago" },
        { id: "verbal-only", label: "No — verbal notice only" },
        { id: "no-notice", label: "No — no notice at all" },
        { id: "pending", label: "Still waiting for a decision" },
      ]
    },
    {
      id: "appeal-deadline",
      question: "Do you know your appeal deadline?",
      options: [
        { id: "days", label: "Yes — within the next few days" },
        { id: "weeks", label: "Yes — within the next few weeks" },
        { id: "missed", label: "I may have missed it" },
        { id: "unknown", label: "I don't know the deadline" },
        { id: "already-appealed", label: "I already filed an appeal" },
      ]
    },
    {
      id: "evidence",
      question: "What documentation do you have?",
      options: [
        { id: "decision-letter", label: "Decision letter" },
        { id: "application", label: "My application or forms" },
        { id: "correspondence", label: "Letters or emails from agency" },
        { id: "records", label: "Supporting documents (medical, financial)" },
        { id: "none", label: "I don't have documentation yet" },
      ]
    },
    {
      id: "prior-attempts",
      question: "Have you tried to resolve this?",
      options: [
        { id: "called", label: "Yes — called the agency" },
        { id: "written", label: "Yes — wrote to the agency" },
        { id: "appealed", label: "Yes — filed an appeal" },
        { id: "hearing", label: "Yes — had a hearing" },
        { id: "no", label: "No — not yet" },
        { id: "unsure-how", label: "I don't know how" },
      ]
    },
    {
      id: "family-impact",
      question: "How has this affected your household?",
      options: [
        { id: "basic-needs", label: "Can't meet basic needs (food, housing)" },
        { id: "medical", label: "Can't access medical care" },
        { id: "children", label: "Children are affected" },
        { id: "financial", label: "Financial stress" },
        { id: "manageable", label: "Difficult but manageable" },
        { id: "prefer-not", label: "I prefer not to answer" },
      ]
    },
    {
      id: "priority",
      question: "What matters most to you right now?",
      options: [
        { id: "restore", label: "Getting benefits restored" },
        { id: "understand", label: "Understanding why I was denied" },
        { id: "appeal", label: "Filing or preparing an appeal" },
        { id: "records", label: "Getting my case file" },
        { id: "help", label: "Finding someone to help" },
        { id: "unsure", label: "I'm not sure" },
      ]
    },
  ],
  cps_dcyf: [
    {
      id: "issue-type",
      question: "What best describes your situation?",
      options: [
        { id: "investigation", label: "CPS investigation or visit" },
        { id: "safety-plan", label: "Safety plan or voluntary services" },
        { id: "removal", label: "Child removed from home" },
        { id: "dependency", label: "Dependency case in court" },
        { id: "reunification", label: "Working toward reunification" },
        { id: "closed", label: "Case is closed but I have concerns" },
        { id: "other", label: "Other child welfare issue" },
      ]
    },
    {
      id: "timing",
      question: "When did DCYF involvement begin?",
      options: [
        { id: "just-started", label: "Just started (this week)" },
        { id: "recent", label: "Within the last few weeks" },
        { id: "months", label: "Several months" },
        { id: "long-term", label: "More than a year" },
      ]
    },
    {
      id: "case-status",
      question: "Is this a voluntary or court-ordered case?",
      options: [
        { id: "voluntary", label: "Voluntary (no court involvement yet)" },
        { id: "court", label: "Court-ordered (dependency filed)" },
        { id: "unsure", label: "I'm not sure" },
        { id: "transitioning", label: "It may be going to court" },
      ]
    },
    {
      id: "children-placement",
      question: "Where are the children currently?",
      options: [
        { id: "home", label: "At home with me" },
        { id: "relative", label: "With a relative" },
        { id: "foster", label: "In foster care" },
        { id: "other-parent", label: "With the other parent" },
        { id: "unsure", label: "I'm not sure" },
      ]
    },
    {
      id: "attorney",
      question: "Do you have an attorney?",
      options: [
        { id: "yes", label: "Yes — I have an attorney" },
        { id: "appointed", label: "One was appointed but I haven't met them" },
        { id: "seeking", label: "I'm looking for one" },
        { id: "no", label: "No" },
        { id: "unsure-need", label: "I don't know if I need one" },
      ]
    },
    {
      id: "allegations",
      question: "Do you know what allegations were made?",
      options: [
        { id: "yes-written", label: "Yes — I received them in writing" },
        { id: "yes-verbal", label: "Yes — I was told verbally" },
        { id: "partially", label: "I know some, but not all" },
        { id: "no", label: "No — I don't know the allegations" },
      ]
    },
    {
      id: "evidence",
      question: "What documentation do you have?",
      options: [
        { id: "safety-plan", label: "Safety plan document" },
        { id: "court-papers", label: "Court papers or orders" },
        { id: "communications", label: "Texts, emails, or letters from DCYF" },
        { id: "notes", label: "Notes from meetings or visits" },
        { id: "none", label: "I don't have documentation yet" },
      ]
    },
    {
      id: "services",
      question: "Have you been asked to complete services?",
      options: [
        { id: "yes-complying", label: "Yes — and I'm participating" },
        { id: "yes-struggling", label: "Yes — but I'm struggling to complete them" },
        { id: "yes-disagree", label: "Yes — but I disagree with them" },
        { id: "no", label: "No services have been required" },
        { id: "waiting", label: "Waiting for services to start" },
      ]
    },
    {
      id: "deadline",
      question: "Do you have upcoming hearings or deadlines?",
      options: [
        { id: "days", label: "Yes — within the next few days" },
        { id: "weeks", label: "Yes — within the next few weeks" },
        { id: "scheduled", label: "Hearing is scheduled" },
        { id: "unknown", label: "I don't know" },
        { id: "none", label: "No upcoming deadlines" },
      ]
    },
    {
      id: "communication",
      question: "How is communication with your caseworker?",
      options: [
        { id: "good", label: "Good — we communicate regularly" },
        { id: "difficult", label: "Difficult — hard to reach them" },
        { id: "tense", label: "Tense or adversarial" },
        { id: "unclear", label: "Unclear — I don't know what's expected" },
        { id: "no-contact", label: "No contact recently" },
      ]
    },
    {
      id: "safety",
      question: "Do you feel safe right now?",
      options: [
        { id: "safe", label: "Yes — I feel safe" },
        { id: "stressed", label: "Safe but extremely stressed" },
        { id: "unsafe-other", label: "No — due to someone else involved in the case" },
        { id: "prefer-not", label: "I prefer not to answer" },
      ]
    },
    {
      id: "priority",
      question: "What matters most to you right now?",
      options: [
        { id: "reunification", label: "Getting my children back" },
        { id: "understand", label: "Understanding the process" },
        { id: "attorney", label: "Finding or talking to an attorney" },
        { id: "allegations", label: "Responding to allegations" },
        { id: "services", label: "Completing required services" },
        { id: "unsure", label: "I'm not sure" },
      ]
    },
  ],
  unsure: [
    {
      id: "describe",
      question: "Can you describe what happened in general terms?",
      options: [
        { id: "authority", label: "Someone in authority treated me unfairly" },
        { id: "denied", label: "I was denied something I believe I'm entitled to" },
        { id: "harmed", label: "I was harmed or my rights were violated" },
        { id: "retaliation", label: "I faced consequences for speaking up" },
        { id: "confused", label: "I'm still trying to understand what happened" },
      ]
    },
    {
      id: "who-involved",
      question: "Who was involved?",
      options: [
        { id: "government", label: "A government agency or employee" },
        { id: "employer", label: "An employer or workplace" },
        { id: "landlord", label: "A landlord or property manager" },
        { id: "police", label: "Police or law enforcement" },
        { id: "school", label: "A school or educational institution" },
        { id: "healthcare", label: "A healthcare provider" },
        { id: "other", label: "Someone else" },
        { id: "multiple", label: "Multiple parties" },
      ]
    },
    {
      id: "timing",
      question: "When did this happen?",
      options: [
        { id: "current", label: "It's happening now" },
        { id: "recent", label: "Within the last few weeks" },
        { id: "months", label: "Within the last few months" },
        { id: "over-year", label: "More than a year ago" },
        { id: "ongoing", label: "It's been ongoing" },
      ]
    },
    {
      id: "urgency",
      question: "Is there any immediate urgency?",
      options: [
        { id: "deadline", label: "Yes — I have a deadline coming up" },
        { id: "safety", label: "Yes — there's a safety concern" },
        { id: "escalating", label: "The situation is getting worse" },
        { id: "stable", label: "No immediate urgency" },
        { id: "unsure", label: "I'm not sure" },
      ]
    },
    {
      id: "evidence",
      question: "Do you have any documentation?",
      options: [
        { id: "yes", label: "Yes — documents, photos, or records" },
        { id: "some", label: "Some, but not organized" },
        { id: "witnesses", label: "Witnesses but no documents" },
        { id: "none", label: "No documentation" },
        { id: "unsure-what", label: "I don't know what counts" },
      ]
    },
    {
      id: "prior-attempts",
      question: "Have you tried to address this?",
      options: [
        { id: "yes-formal", label: "Yes — formally (complaint, appeal, etc.)" },
        { id: "yes-informal", label: "Yes — informally (calls, conversations)" },
        { id: "no-afraid", label: "No — afraid of consequences" },
        { id: "no-unsure", label: "No — not sure where to start" },
        { id: "no", label: "No" },
      ]
    },
    {
      id: "family-impact",
      question: "Has this affected others in your household?",
      options: [
        { id: "children", label: "Children are affected" },
        { id: "family", label: "Family members are affected" },
        { id: "financial", label: "Financial impact on household" },
        { id: "just-me", label: "Primarily affects just me" },
        { id: "prefer-not", label: "I prefer not to answer" },
      ]
    },
    {
      id: "priority",
      question: "What would help you most right now?",
      options: [
        { id: "understand", label: "Understanding what happened" },
        { id: "options", label: "Knowing my options" },
        { id: "document", label: "Help documenting the situation" },
        { id: "resources", label: "Finding resources or help" },
        { id: "just-start", label: "Just getting started somewhere" },
      ]
    },
  ],
};

// System-specific result content with enhanced guidance
interface EnhancedSystemResult extends SystemResult {
  whatThisMeans: string;
  misunderstandings: string[];
  whatHelpsFirst: string[];
  ifYouDoNothingElse: {
    documentation: string;
    time: string;
    emotionalSafety: string;
    primaryGuideId?: string;
    secondaryGuideId?: string;
  };
  whyToolsMatter: { tool: string; why: string }[];
}

const systemResults: Record<SystemId, EnhancedSystemResult> = {
  police: {
    summary: "issues related to police or law enforcement",
    explanation: "Interactions with police can raise questions about constitutional rights, use of force policies, complaint procedures, and oversight agencies. Documentation and understanding timelines for complaints are often important first steps.",
    whatThisMeans: "People in this situation often experience a mix of confusion, frustration, and sometimes fear about what happened and what comes next. You may be unsure whether what occurred was normal, legal, or appropriate. That uncertainty is common — and it's why understanding the system is a powerful first step.",
    misunderstandings: [
      "That filing a complaint will automatically result in punishment for the officer",
      "That you need to prove your case before filing a complaint — you don't",
      "That internal affairs will contact you with updates — they often don't",
      "That the incident 'wasn't bad enough' to document — document it anyway",
      "That talking to a lawyer is the same as suing — it's not; consultations are just information"
    ],
    whatHelpsFirst: [
      "Write down everything you remember: date, time, location, badge numbers, what was said",
      "Request medical records if you were injured (even minor injuries)",
      "Identify any witnesses and note their contact information",
      "File a formal complaint with the police department or civilian oversight board",
      "Consider requesting any body camera or dash camera footage",
      "Note the deadlines — some complaints must be filed within 60-180 days"
    ],
    ifYouDoNothingElse: {
      documentation: "Write down what happened today — date, time, location, who was involved, what was said. Even rough notes matter.",
      time: "Check if there's a deadline for filing a complaint. Many are 60-180 days. If you're unsure, assume it's sooner rather than later.",
      emotionalSafety: "You don't have to decide anything right now. Documenting is enough for today.",
      primaryGuideId: undefined,
      secondaryGuideId: undefined
    },
    whyToolsMatter: [
      { tool: "Timeline Creator", why: "Reconstructing exactly what happened, step by step, helps attorneys and oversight agencies understand your experience" },
      { tool: "Evidence Vault", why: "Photos of injuries, screenshots of texts, and records need to be stored safely before they're lost or deleted" },
      { tool: "Notes", why: "Your memory of details fades quickly — capture them now while they're fresh" }
    ],
    rightsInsightFilter: "police",
    supportNetworkFilter: "police",
  },
  employer: {
    summary: "workplace or employment-related issues",
    explanation: "Employment issues may involve federal or state anti-discrimination laws, internal HR processes, or external agencies like the EEOC. Understanding relevant deadlines and documentation requirements can be important.",
    whatThisMeans: "Workplace problems often make people feel trapped — you may depend on the job, fear retaliation, or feel like 'it's your word against theirs.' Many people minimize what happened or wait too long to act. Know that documentation and deadlines are critical, and you don't have to have everything figured out to start.",
    misunderstandings: [
      "That HR is there to protect you — HR protects the company first",
      "That you need to file a lawsuit to make anything happen — you don't",
      "That retaliation after a complaint is illegal — it is, but proving it requires documentation",
      "That discrimination has to be 'obvious' or 'intentional' to count — subtle patterns matter too",
      "That you can file anytime — EEOC deadlines can be as short as 180 days"
    ],
    whatHelpsFirst: [
      "Document every incident: date, time, who was present, what was said or done",
      "Save emails, texts, performance reviews, and anything showing a pattern",
      "File internal HR complaints in writing (not just verbally) so there's a record",
      "Note any witnesses or coworkers who saw what happened",
      "Research your company's policies — they can be used to show violations",
      "Consider filing with the EEOC or Washington State Human Rights Commission early"
    ],
    ifYouDoNothingElse: {
      documentation: "Save any emails, texts, or written records related to the issue. Forward work emails to a personal account if allowed.",
      time: "Note the EEOC deadline (often 180-300 days from the incident). Mark it on a calendar.",
      emotionalSafety: "You don't need to confront anyone or make a decision today. Gathering information is a valid step.",
      primaryGuideId: undefined,
      secondaryGuideId: undefined
    },
    whyToolsMatter: [
      { tool: "Timeline Creator", why: "Showing the pattern over time — when incidents occurred and how they escalated — is often essential" },
      { tool: "Evidence Vault", why: "Emails, screenshots, and HR responses can disappear after you leave; save them now" },
      { tool: "Notes", why: "Recording conversations and incidents in detail helps you remember what to share with an attorney or agency" }
    ],
    rightsInsightFilter: "employment",
    supportNetworkFilter: "employment",
  },
  housing: {
    summary: "housing or landlord-related issues",
    explanation: "Housing issues may involve fair housing laws, tenant rights, habitability standards, or eviction procedures. Understanding local laws and available advocacy resources can help you navigate the situation.",
    whatThisMeans: "Housing instability is deeply stressful. Whether you're facing eviction, discrimination, or unsafe conditions, know that tenants have rights — even when landlords don't follow them. Many people don't realize they can fight back or ask for help until it's almost too late.",
    misunderstandings: [
      "That an eviction notice means you have to leave immediately — it doesn't",
      "That landlords can lock you out or shut off utilities — that's illegal in WA",
      "That you can't fight eviction if you owe rent — there may still be defenses",
      "That housing discrimination has to be 'in writing' — verbal and pattern-based discrimination counts",
      "That you need a lawyer to respond to eviction — many people represent themselves with help"
    ],
    whatHelpsFirst: [
      "Keep copies of your lease, all notices, and all communication with your landlord",
      "Document habitability issues with photos, videos, and dated written complaints",
      "If you receive an eviction notice, note the exact deadline and court date",
      "Contact a tenant rights organization or legal aid immediately if facing eviction",
      "Request repairs in writing — texts and emails count as documentation",
      "File a fair housing complaint if discrimination occurred (federal and state)"
    ],
    ifYouDoNothingElse: {
      documentation: "Keep a copy of your lease and photograph any notices you receive. Store these outside your home (email, cloud, or with someone you trust).",
      time: "If you received an eviction notice, find the response deadline. Courts are strict about timing.",
      emotionalSafety: "Housing stress is overwhelming. Reaching out to a tenant hotline isn't committing to anything — it's just getting information.",
      primaryGuideId: "housing",
      secondaryGuideId: undefined
    },
    whyToolsMatter: [
      { tool: "Timeline Creator", why: "A clear history of complaints, repairs, or landlord behavior can be critical in eviction defense" },
      { tool: "Evidence Vault", why: "Photos of mold, broken locks, or notices — and when they were taken — can support your case" },
      { tool: "Notes", why: "Recording what the landlord said or threatened helps you recall details when speaking with an attorney" }
    ],
    rightsInsightFilter: "housing",
    supportNetworkFilter: "housing",
  },
  school: {
    summary: "school or education-related issues",
    explanation: "Education issues may involve student rights, due process for discipline, special education laws (IDEA, Section 504), or anti-discrimination protections. Understanding your rights and the school's obligations is often a key first step.",
    whatThisMeans: "Schools are powerful institutions, and parents or students often feel like they can't push back. But students have legal rights — to due process, to accommodations, to freedom from discrimination. Understanding those rights can change how you approach the situation.",
    misunderstandings: [
      "That schools can suspend or expel without a hearing — due process applies",
      "That an IEP meeting decision is final — you can dispute it",
      "That bullying isn't the school's responsibility — if they ignore it, it may be",
      "That you have to accept whatever the school says — you have appeal rights",
      "That private schools don't have rules — many still must comply with civil rights laws"
    ],
    whatHelpsFirst: [
      "Request your child's complete educational records in writing",
      "Document every meeting and conversation with dates, names, and notes",
      "If special education is involved, request a formal IEP meeting",
      "Put complaints about bullying or discrimination in writing to the principal",
      "File with the Office for Civil Rights (OCR) if discrimination is occurring",
      "Know your state and district appeal procedures for discipline"
    ],
    ifYouDoNothingElse: {
      documentation: "Request your child's educational records in writing. Schools must provide them.",
      time: "If discipline is involved, ask about appeal deadlines. They can be as short as a few days.",
      emotionalSafety: "Advocating for a child is exhausting. You don't have to solve everything in one meeting.",
      primaryGuideId: undefined,
      secondaryGuideId: undefined
    },
    whyToolsMatter: [
      { tool: "Timeline Creator", why: "Showing the sequence of events — incidents, meetings, ignored concerns — helps advocates see the full picture" },
      { tool: "Evidence Vault", why: "IEPs, disciplinary notices, emails with staff, and report cards all matter" },
      { tool: "Notes", why: "Writing down what happened in meetings, especially informal ones, gives you a record to reference later" }
    ],
    rightsInsightFilter: "education",
    supportNetworkFilter: "education",
  },
  healthcare: {
    summary: "healthcare provider-related issues",
    explanation: "Healthcare issues may involve patient rights, medical privacy (HIPAA), non-discrimination in care, or access to medical records. Understanding complaint processes and patient advocacy resources can be helpful.",
    whatThisMeans: "Healthcare is deeply personal, and when something goes wrong — being dismissed, discriminated against, or denied care — it can feel violating. Patients have rights, including the right to access records, file complaints, and seek second opinions.",
    misunderstandings: [
      "That HIPAA prevents you from getting your own records — it guarantees you can",
      "That you can't file a complaint unless you have 'proof' of malpractice — you can report concerns",
      "That providers can refuse care without reason — civil rights laws may apply",
      "That filing a complaint will hurt your care — retaliation is illegal",
      "That insurance decisions are final — you can appeal most denials"
    ],
    whatHelpsFirst: [
      "Request your complete medical records in writing (they must provide them)",
      "Document what happened: dates, providers, what was said or denied",
      "File a complaint with the hospital patient advocate or licensing board",
      "If discrimination occurred, file with the HHS Office for Civil Rights",
      "Get a second opinion if you were denied treatment",
      "Appeal insurance denials — most denials can be challenged"
    ],
    ifYouDoNothingElse: {
      documentation: "Request your medical records in writing. You have a legal right to them.",
      time: "If an insurance denial is involved, note the appeal deadline — often 30-60 days.",
      emotionalSafety: "Being dismissed or mistreated by a provider is painful. You don't have to process everything at once.",
      primaryGuideId: undefined,
      secondaryGuideId: undefined
    },
    whyToolsMatter: [
      { tool: "Timeline Creator", why: "Healthcare incidents often span multiple visits — tracking symptoms, visits, and denials clarifies patterns" },
      { tool: "Evidence Vault", why: "Medical records, bills, denial letters, and prescriptions all matter" },
      { tool: "Notes", why: "What a provider said (or didn't say) during an appointment can be important to recall later" }
    ],
    rightsInsightFilter: "healthcare",
    supportNetworkFilter: "healthcare",
  },
  courts: {
    summary: "court or legal system issues",
    explanation: "Court-related issues may involve due process rights, access to counsel, procedural requirements, or appeal processes. Understanding court procedures and available legal resources is often essential.",
    whatThisMeans: "The court system can feel overwhelming and confusing, especially if you're representing yourself (pro se). Many people don't realize that court procedures have strict rules — but also that errors can sometimes be challenged.",
    misunderstandings: [
      "That missing a deadline means you 'lose forever' — sometimes you can ask for relief",
      "That a judge's decision is always final — appeals exist for a reason",
      "That you need a lawyer for everything — pro se litigants can access help",
      "That court staff can give you legal advice — they can't, only information",
      "That public defenders aren't 'real' lawyers — they often handle complex cases"
    ],
    whatHelpsFirst: [
      "Get copies of all court orders, filings, and notices",
      "Understand key deadlines — courts are strict about timing",
      "Visit the court clerk's office or website to learn procedures",
      "Look for self-help legal clinics or pro bono help in your area",
      "Document any interactions that felt unfair or biased",
      "Request transcripts of hearings if needed for an appeal"
    ],
    ifYouDoNothingElse: {
      documentation: "Get copies of all court documents — orders, filings, and notices. The court clerk can help.",
      time: "Find and write down your next deadline. Courts rarely forgive missed dates.",
      emotionalSafety: "Court processes are stressful even for professionals. One step at a time is enough.",
      primaryGuideId: undefined,
      secondaryGuideId: undefined
    },
    whyToolsMatter: [
      { tool: "Timeline Creator", why: "Court cases have many dates — filings, hearings, orders — keeping them organized is critical" },
      { tool: "Evidence Vault", why: "All court documents, orders, and correspondence should be stored safely" },
      { tool: "Notes", why: "Recording what happened in hearings, what was said, and any concerns helps you track your case" }
    ],
    rightsInsightFilter: "courts",
    supportNetworkFilter: "courts",
  },
  jail: {
    summary: "jail or prison-related issues",
    explanation: "Incarceration issues may involve conditions of confinement, access to medical care, communication rights, or grievance procedures. Understanding available advocacy channels and oversight bodies can be important.",
    whatThisMeans: "People in jails and prisons still have constitutional rights — but exercising them is difficult. If you or a loved one is incarcerated and facing mistreatment, medical neglect, or abuse, documentation and formal grievances are often the only path forward.",
    misunderstandings: [
      "That incarcerated people have 'no rights' — they absolutely do",
      "That grievances don't matter — they're often required before a lawsuit",
      "That medical requests are always ignored — persistence and documentation matter",
      "That nothing can be done from outside — family can file complaints and contact oversight",
      "That conditions are 'just part of punishment' — cruel conditions can be unconstitutional"
    ],
    whatHelpsFirst: [
      "File formal grievances through the facility's process — keep copies",
      "Request medical attention in writing; keep a record of requests",
      "Contact the jail ombudsman, state corrections office, or oversight bodies",
      "Family members can contact civil rights organizations on behalf of incarcerated individuals",
      "Document dates, names, and what happened in as much detail as possible",
      "Look into ACLU or prison rights organizations for assistance"
    ],
    ifYouDoNothingElse: {
      documentation: "File a formal grievance through the facility process. Keep a copy of everything submitted.",
      time: "Grievances often have short deadlines. Ask about the facility's timeline.",
      emotionalSafety: "If you're supporting someone inside, you're already doing something. Pace yourself.",
      primaryGuideId: undefined,
      secondaryGuideId: undefined
    },
    whyToolsMatter: [
      { tool: "Timeline Creator", why: "Incidents inside facilities often happen repeatedly — a timeline shows patterns" },
      { tool: "Evidence Vault", why: "Grievance forms, medical requests, and correspondence should be saved" },
      { tool: "Notes", why: "Recording everything that happens or is communicated helps when filing complaints" }
    ],
    rightsInsightFilter: "incarceration",
    supportNetworkFilter: "incarceration",
  },
  government: {
    summary: "government agency-related issues",
    explanation: "Government agency issues may involve administrative procedures, benefit determinations, licensing decisions, or records requests. Understanding appeal processes and relevant deadlines is often critical.",
    whatThisMeans: "Government agencies can feel like black boxes — slow, unresponsive, and hard to navigate. But there are usually formal processes for appealing decisions, requesting records, or filing complaints. Understanding the process gives you power.",
    misunderstandings: [
      "That benefit denials are final — most can be appealed",
      "That agencies don't have to respond — many have legal deadlines",
      "That you need a lawyer to appeal — many administrative appeals are designed for self-help",
      "That being persistent is 'bothering' them — following up in writing is essential",
      "That requests for records can be ignored — FOIA and public records laws apply"
    ],
    whatHelpsFirst: [
      "Get a copy of any decision letter — it should explain appeal rights",
      "Note the deadline for filing an appeal or response",
      "Request your file or case records in writing",
      "Follow up on requests in writing, not just by phone",
      "File a public records request (FOIA at federal level, state PRA in Washington)",
      "Contact an ombudsman or advocacy group for that agency type"
    ],
    ifYouDoNothingElse: {
      documentation: "Get a copy of any decision letter. It should explain your appeal rights.",
      time: "Find the appeal deadline — it's often 10-30 days from the decision date.",
      emotionalSafety: "Bureaucracy is exhausting. One request at a time is enough.",
      primaryGuideId: undefined,
      secondaryGuideId: undefined
    },
    whyToolsMatter: [
      { tool: "Timeline Creator", why: "Tracking applications, denials, appeals, and responses helps you see the full picture" },
      { tool: "Evidence Vault", why: "Letters, forms, and decisions from agencies are essential records" },
      { tool: "Notes", why: "Recording what staff said, promised, or explained can help if things go wrong" }
    ],
    rightsInsightFilter: "government",
    supportNetworkFilter: "government",
  },
  cps_dcyf: {
    summary: "CPS or DCYF (child welfare) involvement",
    explanation: "Child welfare cases involve investigations, safety plans, and sometimes court proceedings. Understanding the process, your rights, and how to engage strategically is critical.",
    whatThisMeans: "Few experiences are more destabilizing than having child protective services involved in your family's life. The fear and confusion you may be feeling are completely understandable. What matters now is understanding the process and your rights.",
    misunderstandings: [
      "That you must let CPS into your home without a court order — you have rights, though there can be consequences",
      "That 'cooperating' always helps — cooperation is important, but so is understanding what you're agreeing to",
      "That safety plans are just suggestions — violations can be used as evidence",
      "That the worker is on your side — their job is to assess safety, not represent you",
      "That what you say can't be used against you — anything you say can appear in court documents"
    ],
    whatHelpsFirst: [
      "Get an attorney as early as possible — you're entitled to one in dependency cases",
      "Request to see what's alleged against you",
      "Document your own parenting, home conditions, and children's wellbeing",
      "Keep records of every interaction with DCYF",
      "Engage with services genuinely, not just checking boxes",
      "Attend every hearing and scheduled visit"
    ],
    ifYouDoNothingElse: {
      documentation: "Write down what DCYF told you — who said it, when, and what they asked. Keep notes of every interaction.",
      time: "Ask about any deadlines for responding to allegations or attending meetings. These matter.",
      emotionalSafety: "This is one of the most stressful situations a family can face. Getting an attorney isn't escalating — it's protecting yourself.",
      primaryGuideId: "cps_dcyf",
      secondaryGuideId: undefined
    },
    whyToolsMatter: [
      { tool: "Timeline Creator", why: "A clear record of interactions, agreements, and compliance is essential" },
      { tool: "Evidence Vault", why: "Photos of your home, records of services, and correspondence should be saved" },
      { tool: "Notes", why: "Recording what workers said helps when speaking with your attorney" }
    ],
    rightsInsightFilter: "cps_dcyf",
    supportNetworkFilter: "cps_dcyf",
  },
  unsure: {
    summary: "a situation that may involve multiple systems or issues",
    explanation: "It's okay not to be sure which system applies. Many situations involve overlapping issues or multiple institutions. Gathering information and documenting what happened can help clarify next steps.",
    whatThisMeans: "Feeling uncertain is completely normal. Many situations don't fit neatly into one category — and that's okay. The first step is simply documenting what happened, who was involved, and how it affected you. That information will help any professional you speak with later.",
    misunderstandings: [
      "That you need to 'know your legal issue' to get help — advocates can help you figure it out",
      "That your situation 'isn't serious enough' — if it's affecting you, it matters",
      "That you have to do everything at once — take one step at a time",
      "That asking for help is a burden — advocacy organizations exist to help",
      "That nothing can be done if you waited — late is better than never"
    ],
    whatHelpsFirst: [
      "Write down what happened, when, and who was involved",
      "Gather any documents, photos, or communications related to the situation",
      "Talk to a legal aid hotline or advocacy organization — they can help clarify options",
      "Focus on what's affecting you most urgently right now",
      "Don't worry about 'having it all figured out' — just start documenting"
    ],
    ifYouDoNothingElse: {
      documentation: "Write down what happened, who was involved, and when. Even rough notes help.",
      time: "If anything has a deadline (eviction, appeal, complaint), find out when.",
      emotionalSafety: "Not knowing is okay. You don't need to have answers to take a first step.",
      primaryGuideId: undefined,
      secondaryGuideId: undefined
    },
    whyToolsMatter: [
      { tool: "Timeline Creator", why: "Even if you're unsure what happened, a timeline helps you — and others — see patterns" },
      { tool: "Evidence Vault", why: "Save what you have; you don't need to know if it's 'evidence' yet" },
      { tool: "Notes", why: "Writing down your experience can help process it and prepare for conversations" }
    ],
    rightsInsightFilter: "general",
    supportNetworkFilter: "general",
  },
};

export default function Analyzer() {
  const [step, setStep] = useState(0);
  const [selectedSystem, setSelectedSystem] = useState<SystemId | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [entityName, setEntityName] = useState("");
  
  const { user } = useAuth();
  const { 
    isAnalyzing, 
    analysis, 
    analyzePatterns, 
    saveCaseProfile,
    mapSystemToEnum,
    extractClaimTags 
  } = usePatternEngine();

  const handleAnalyze = useCallback((entity: string) => {
    if (selectedSystem) {
      setEntityName(entity);
      analyzePatterns(selectedSystem, entity, answers);
    }
  }, [selectedSystem, answers, analyzePatterns]);

  const currentFollowUps = selectedSystem ? followUpQuestions[selectedSystem] : [];
  const totalSteps = currentFollowUps.length + 1; // +1 for system selection

  const handleSystemSelect = (systemId: SystemId) => {
    setSelectedSystem(systemId);
    setAnswers({});
    setStep(1);
  };

  const handleAnswer = (questionId: string, answerId: string) => {
    const newAnswers = { ...answers, [questionId]: answerId };
    setAnswers(newAnswers);
    
    const currentQuestionIndex = step - 1;
    if (currentQuestionIndex < currentFollowUps.length - 1) {
      setStep(step + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (showResults) {
      setShowResults(false);
    } else if (step > 1) {
      setStep(step - 1);
      // Remove the last answer
      const currentQuestion = currentFollowUps[step - 2];
      if (currentQuestion) {
        const { [currentQuestion.id]: _, ...remaining } = answers;
        setAnswers(remaining);
      }
    } else if (step === 1) {
      setStep(0);
      setSelectedSystem(null);
      setAnswers({});
    }
  };

  const handleRestart = () => {
    setStep(0);
    setSelectedSystem(null);
    setAnswers({});
    setShowResults(false);
  };

  const selectedSystemInfo = systemCategories.find(s => s.id === selectedSystem);
  const resultInfo = selectedSystem ? systemResults[selectedSystem] : null;
  const currentQuestion = step > 0 && step <= currentFollowUps.length ? currentFollowUps[step - 1] : null;

  // Generate result content for new light-theme results page
  const generatedResultContent = selectedSystem 
    ? generateResultContent(selectedSystem, analysis?.strength || 'none')
    : null;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/60" />
        </div>
        
        <div className="container relative py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
                <Search className="w-4 h-4" />
                <span>Understand Your Situation</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Civil Rights Analyzer
              </h1>
              <p className="text-muted-foreground max-w-xl">
                Answer a few questions to understand your situation and discover resources that may help.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-12 lg:py-16">
        <div className="max-w-3xl mx-auto">
          {/* Progress indicator */}
          {!showResults && (
            <div className="flex items-center justify-center gap-2 mb-8">
              {Array.from({ length: Math.min(totalSteps, 3) }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i < step ? "bg-primary w-8" : i === step ? "bg-primary/60 w-6" : "bg-muted w-4"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Step 0: System Selection */}
          {step === 0 && !showResults && (
            <div className="space-y-4 animate-fade-up">
              <h2 className="text-xl font-semibold text-foreground text-center mb-6">
                Which system was involved in what you experienced?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {systemCategories.map((system) => (
                  <button
                    key={system.id}
                    onClick={() => handleSystemSelect(system.id)}
                    className="group p-4 rounded-xl bg-card border-2 border-border hover:border-primary/50 hover:shadow-glow text-left transition-all duration-200 cursor-pointer active:scale-[0.98]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:scale-105 transition-all">
                        <system.icon className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {system.label}
                          </p>
                          <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {system.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Follow-up Questions */}
          {step > 0 && currentQuestion && !showResults && (
            <div className="animate-fade-up">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Go back
              </button>

              <div className="p-6 rounded-2xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  {selectedSystemInfo && (
                    <>
                      <selectedSystemInfo.icon className="w-5 h-5 text-primary" />
                      <span className="text-sm text-primary font-medium">{selectedSystemInfo.label}</span>
                    </>
                  )}
                </div>

                <h2 className="text-xl font-semibold text-foreground mb-6">
                  {currentQuestion.question}
                </h2>

                <div className="space-y-3">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(currentQuestion.id, option.id)}
                      className="w-full p-4 rounded-xl bg-secondary border-2 border-transparent hover:border-primary/50 hover:bg-secondary/80 text-left transition-all duration-200 group cursor-pointer active:scale-[0.99]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {option.label}
                        </span>
                        <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Disclaimer - only show when not in results */}
          {!showResults && (
            <div className="mt-12 pt-8 border-t border-border">
              <Disclaimer className="justify-center" />
            </div>
          )}
        </div>
      </div>

      {/* Results Page - New minimal light design - breaks out of dark container */}
      {showResults && resultInfo && selectedSystem && generatedResultContent && (
        <div className="relative">
          {/* Back button at top of light section */}
          <div className="absolute top-4 left-4 z-10">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 transition-colors bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Go back
            </button>
          </div>
          
          <AnalyzerResults
            systemId={selectedSystem}
            systemLabel={generatedResultContent.label}
            patternStrength={analysis?.strength || 'none'}
            systemControls={generatedResultContent.systemControls}
            systemDoesNotControl={generatedResultContent.systemDoesNotControl}
            decisionMakers={generatedResultContent.decisionMakers}
            commonStuckPoints={generatedResultContent.commonStuckPoints}
            whatUsuallyHappens={generatedResultContent.whatUsuallyHappens}
            whatPeopleMisinterpret={generatedResultContent.whatPeopleMisinterpret}
            tools={generatedResultContent.tools}
            primaryGuideId={generatedResultContent.primaryGuideId}
          />
          
          {/* Disclaimer at bottom */}
          <div className="bg-stone-50 px-4 pb-12">
            <div className="max-w-2xl mx-auto">
              <Disclaimer variant="light" className="justify-center" />
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
