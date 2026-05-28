import { useState, useEffect, useRef, useCallback } from "react";
import {
  Phone, Shield, CheckCircle2, Circle, Printer,
  AlertTriangle, Home, ArrowRight, Heart, MapPin,
  FileText, ChevronDown, ChevronRight, Copy, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────

type HousingStatus =
  | "unsheltered" | "vehicle" | "shelter" | "doubled_up"
  | "facing_eviction" | "at_risk" | "has_voucher";

type Step =
  | "start"
  | "not_safe_resources"
  | "housing_status"
  | "eviction_notice_type"
  | "eviction_deadline"
  | "eviction_legal"
  | "eviction_rental_assist"
  | "unsheltered_shelter"
  | "unsheltered_ce"
  | "shelter_timeline"
  | "shelter_ce"
  | "doubled_up_timeline"
  | "voucher_agency"
  | "voucher_soi"
  | "voucher_search"
  | "at_risk_reason"
  | "at_risk_rental_assist"
  | "household_size"
  | "household_flags"
  | "strengths_income"
  | "barrier_check"
  | "plan_complete";

interface Ctx {
  safe: boolean | null;
  status: HousingStatus | null;
  deadlineText: string | null;
  noticeType: string | null;
  householdSize: number | null;
  hasChildren: boolean;
  hasDV: boolean;
  hasDisability: boolean;
  hasVeteran: boolean;
  voucherAgency: string | null;
  barriers: string[];
  incomeSource: string | null;
  hasID: boolean;
}

const EMPTY_CTX: Ctx = {
  safe: null, status: null, deadlineText: null, noticeType: null,
  householdSize: null, hasChildren: false, hasDV: false,
  hasDisability: false, hasVeteran: false, voucherAgency: null,
  barriers: [], incomeSource: null, hasID: true,
};

type PlanCategory =
  | "today" | "this_week" | "call" | "document"
  | "barrier" | "movein" | "stay_housed";

interface Resource {
  name: string;
  phone?: string;
  note?: string;
  urgent?: boolean;
}

interface QuickReply {
  id: string;
  label: string;
  value: string;
}

interface PlanItem {
  id: string;
  category: PlanCategory;
  action: string;
  script?: string;
  resource?: Resource;
  urgent?: boolean;
  done: boolean;
}

interface HousingPlan {
  crisisLevel: "critical" | "high" | "moderate" | "stable";
  housingGoal: string;
  items: PlanItem[];
}

interface ChatMsg {
  id: string;
  role: "navigator" | "user";
  paragraphs?: string[];
  content?: string;
  script?: string;
  resources?: Resource[];
  quickReplies?: QuickReply[];
  isMultiSelect?: boolean;
}

interface NavMsg {
  paragraphs: string[];
  script?: string;
  resources?: Resource[];
  quickReplies?: QuickReply[];
  isMultiSelect?: boolean;
}

// ─── King County Resources ───────────────────────────────────────────────────

const R = {
  crisisLine: { name: "King County Housing Crisis Line", phone: "866-904-HOME (4663)", note: "24/7 — call or text for emergency shelter access", urgent: true } as Resource,
  twoEleven: { name: "2-1-1 Washington", phone: "2-1-1", note: "Text or call — housing navigation, 24/7" } as Resource,
  sha: { name: "Seattle Housing Authority (SHA)", phone: "206-615-3300", note: "HCV/Section 8 and public housing — sha.org" } as Resource,
  kcha: { name: "King County Housing Authority (KCHA)", phone: "206-574-1100", note: "Vouchers and affordable housing — kcha.org" } as Resource,
  desc: { name: "DESC (Downtown Emergency Service Center)", phone: "206-464-1570", note: "Shelter and services for adults — desc.org" } as Resource,
  ywca: { name: "YWCA Seattle", phone: "206-461-4882", note: "Emergency housing for women, families, DV survivors" } as Resource,
  solidGround: { name: "Solid Ground — Tenant Services", phone: "206-694-6748", note: "Eviction prevention and tenant counseling" } as Resource,
  tenantsUnion: { name: "Tenants Union of Washington", phone: "206-723-0500", note: "Tenant rights and counseling — tenantsunion.org" } as Resource,
  vlp: { name: "King County Bar — Volunteer Lawyers", phone: "206-623-0243", note: "Free legal help for income-qualified tenants" } as Resource,
  nwjp: { name: "Northwest Justice Project", phone: "888-201-1014", note: "Free legal aid for low-income tenants statewide" } as Resource,
  arch: { name: "ARCH (A Regional Coalition for Housing)", phone: "425-861-3677", note: "Affordable housing in East King County — archhousing.org" } as Resource,
  compass: { name: "Compass Housing Alliance", phone: "206-474-1100", note: "Shelter and transitional housing — compasshousingalliance.org" } as Resource,
  lihi: { name: "Low Income Housing Institute (LIHI)", phone: "206-443-9935", note: "Tiny homes and transitional housing" } as Resource,
  wshrc: { name: "WA Human Rights Commission", phone: "800-233-3247", note: "SOI and fair housing complaints — hum.wa.gov" } as Resource,
  drwa: { name: "Disability Rights Washington", phone: "800-562-2702", note: "Housing rights for people with disabilities" } as Resource,
  elap: { name: "Eastside Legal Assistance (ELAP)", phone: "425-747-7274", note: "Free legal help in East King County" } as Resource,
  unitedWay: { name: "United Way of King County", phone: "206-461-3700", note: "Financial assistance programs — uwkc.org" } as Resource,
  dol: { name: "WA Dept. of Licensing (ID Card)", phone: "360-902-3900", note: "Fee waived for homeless individuals — dol.wa.gov" } as Resource,
  vashp: { name: "VA Supportive Housing (VASH)", phone: "206-764-2036", note: "HUD-VASH vouchers for veterans" } as Resource,
};

// ─── State Machine ───────────────────────────────────────────────────────────

function getNavMsg(step: Step, ctx: Ctx): NavMsg {
  switch (step) {

    case "start":
      return {
        paragraphs: [
          "Let's start with what is happening right now.",
          "You do not need to figure out the whole system today.",
          "Are you safe tonight?",
        ],
        quickReplies: [
          { id: "safe_yes", label: "Yes, I am safe tonight", value: "yes" },
          { id: "safe_no", label: "No — I need help right now", value: "no" },
        ],
      };

    case "not_safe_resources":
      return {
        paragraphs: [
          "Your safety comes first.",
          "Call the King County Housing Crisis Line right now. They answer 24 hours a day and can find a shelter bed tonight.",
          "Once you have called and you are somewhere safe, come back and we will build your plan together.",
        ],
        resources: [R.crisisLine, R.twoEleven, R.ywca, R.desc],
        quickReplies: [
          { id: "called_ok", label: "I called — what's next?", value: "called" },
          { id: "need_more", label: "Show me more tonight options", value: "more" },
        ],
      };

    case "housing_status":
      return {
        paragraphs: [
          "Good. Now let's understand exactly what kind of situation you are in.",
          "Which of these fits best right now?",
        ],
        quickReplies: [
          { id: "s_unshel", label: "Outside — no shelter tonight", value: "unsheltered" },
          { id: "s_veh", label: "Living in my car or vehicle", value: "vehicle" },
          { id: "s_shelt", label: "In emergency shelter", value: "shelter" },
          { id: "s_doubled", label: "Staying with someone — can't stay much longer", value: "doubled_up" },
          { id: "s_evict", label: "I got a notice — facing eviction", value: "facing_eviction" },
          { id: "s_risk", label: "Housed but behind on rent or lease ending soon", value: "at_risk" },
          { id: "s_voucher", label: "I have a housing voucher and need to use it", value: "has_voucher" },
        ],
      };

    // ── EVICTION ────────────────────────────────────────────────────────────

    case "eviction_notice_type":
      return {
        paragraphs: [
          "Getting a notice does not mean you have to leave immediately.",
          "Different notices have different deadlines and different options. Let's identify yours.",
          "What does your notice say at the top?",
        ],
        quickReplies: [
          { id: "n_14pay", label: "14-Day Pay or Vacate (rent owed)", value: "14_pay_or_vacate" },
          { id: "n_10comply", label: "10-Day Comply or Vacate (lease violation)", value: "10_comply_or_vacate" },
          { id: "n_20end", label: "20-Day End of Tenancy (no reason given)", value: "20_end_tenancy" },
          { id: "n_summons", label: "I already have court papers (Summons)", value: "summons" },
          { id: "n_sheriff", label: "I received something from the Sheriff", value: "sheriff" },
          { id: "n_unsure", label: "I'm not sure what type it is", value: "unsure" },
        ],
      };

    case "eviction_deadline": {
      const notice = ctx.noticeType || "";
      let explanation = "";
      if (notice === "14_pay_or_vacate")
        explanation = "You have 14 days from the date on the notice. If you pay the full amount owed before the deadline, the eviction can be stopped.";
      else if (notice === "10_comply_or_vacate")
        explanation = "You have 10 days to fix the lease violation described in the notice. Call a tenant lawyer today to understand what counts as fixing it.";
      else if (notice === "20_end_tenancy")
        explanation = "This notice ends your tenancy and cannot be resolved by paying — but you still have rights. Call legal aid. Do not move out before you speak with someone.";
      else if (notice === "summons")
        explanation = "You are already in court proceedings. Your court date is your hard deadline. Do not miss it, and contact legal aid today.";
      else if (notice === "sheriff")
        explanation = "A Writ of Restitution means the court has already ordered you to leave. You may have only hours to days. Call legal aid immediately.";
      else
        explanation = "Let's figure this out. A tenant lawyer can look at the notice with you and tell you exactly what your deadline is.";

      return {
        paragraphs: [
          explanation,
          "Two things need to happen at the same time — find rental assistance AND speak with a tenant lawyer.",
          "How many days are left on your notice?",
        ],
        resources: [R.vlp, R.tenantsUnion, R.nwjp],
        quickReplies: [
          { id: "d_1", label: "3 days or fewer", value: "3" },
          { id: "d_7", label: "4–7 days", value: "7" },
          { id: "d_14", label: "8–14 days", value: "14" },
          { id: "d_20", label: "15–20 days", value: "20" },
          { id: "d_more", label: "More than 20 days", value: "30" },
        ],
      };
    }

    case "eviction_legal":
      return {
        paragraphs: [
          "Call a tenant lawyer today. Even a short phone call can change what happens.",
          "Here is exactly what to say:",
        ],
        script: `"Hi, my name is [your name]. I received a ${(ctx.noticeType || "eviction notice").replace(/_/g, " ")} dated [date on the notice]. I have approximately ${ctx.deadlineText || "a few days"} left. I need to speak with a tenant lawyer as soon as possible. I have [describe your household — e.g., two children, a disability] in my household."`,
        resources: [R.vlp, R.nwjp, R.elap, R.tenantsUnion],
        quickReplies: [
          { id: "legal_next", label: "Got it — who helps with rent?", value: "next" },
        ],
      };

    case "eviction_rental_assist":
      return {
        paragraphs: [
          "Rental assistance can stop an eviction when it is applied quickly.",
          "Call these first — they move fastest in King County.",
        ],
        resources: [
          R.solidGround,
          R.twoEleven,
          { name: "Seattle Human Services Dept.", phone: "206-684-0940", note: "City rental assistance programs" },
          { name: "St. Vincent de Paul", phone: "206-767-6449", note: "Emergency rental assistance — no appointment needed to call" },
        ],
        script: `"Hi, I have received an eviction notice and I need emergency rental assistance immediately. I owe $[amount] and I have [X days] until my deadline. What programs are currently taking applications, and how quickly can assistance be approved?"`,
        quickReplies: [
          { id: "ra_next", label: "Got it — tell me about my household", value: "next" },
        ],
      };

    // ── UNSHELTERED ─────────────────────────────────────────────────────────

    case "unsheltered_shelter": {
      const isVehicle = ctx.status === "vehicle";
      return {
        paragraphs: [
          isVehicle
            ? "Living in your vehicle counts as homelessness for all King County housing programs. That is important — it opens the same doors as being outside."
            : "Let's get you safe first.",
          "Call the Housing Crisis Line. They can find a shelter bed and start the Coordinated Entry process in the same call.",
          isVehicle
            ? "If you want to stay in your vehicle tonight while you sort things out, there are also safe parking programs."
            : "",
        ].filter(Boolean),
        resources: [
          R.crisisLine,
          R.desc,
          R.compass,
          R.lihi,
          ...(isVehicle
            ? [{ name: "LIHI Safe Parking Program", phone: "206-443-9935", note: "Safe overnight parking locations" } as Resource]
            : []),
        ],
        quickReplies: [
          { id: "unsh_ce", label: "What is Coordinated Entry?", value: "ce_explain" },
          { id: "unsh_called", label: "I called — what comes next?", value: "next" },
        ],
      };
    }

    case "unsheltered_ce":
      return {
        paragraphs: [
          "Coordinated Entry (CE) is the main pathway to permanent housing in King County.",
          "It is not housing itself — it is an assessment that scores your level of need and matches you to housing programs.",
          "You call 2-1-1 and ask for a CE assessment. They will ask you questions and assign you a priority score. The more vulnerable your situation, the sooner you can be matched to housing.",
          "You do not need an address to complete a CE assessment. You can do it right now.",
        ],
        script: `"Hi, I need to access Coordinated Entry for housing. I am currently [sleeping outside / living in my vehicle / in emergency shelter] in [general area — Seattle / East King County / South King County]. I need a CE assessment as soon as possible."`,
        resources: [R.twoEleven],
        quickReplies: [
          { id: "ce_ok", label: "Got it — now tell me about my household", value: "next" },
          { id: "ce_done", label: "I've already done CE — what now?", value: "done" },
        ],
      };

    // ── SHELTER ────────────────────────────────────────────────────────────

    case "shelter_timeline":
      return {
        paragraphs: [
          "Good — you have a safe place for now.",
          "Most King County shelters have a time limit. How much time do you have before you need to leave your current shelter?",
        ],
        quickReplies: [
          { id: "t_7", label: "Less than a week", value: "week" },
          { id: "t_30", label: "A few weeks or one month", value: "month" },
          { id: "t_open", label: "More than a month", value: "open" },
          { id: "t_unknown", label: "I don't know my limit", value: "unknown" },
        ],
      };

    case "shelter_ce":
      return {
        paragraphs: [
          "The most important thing right now: complete a Coordinated Entry assessment if you haven't already.",
          "Ask your shelter case manager to connect you to CE, or call 2-1-1 directly.",
          "CE puts you in the priority queue for permanent housing. Every day you are in the system matters.",
        ],
        script: `"I am currently staying in emergency shelter and I need to complete a Coordinated Entry assessment. My shelter is [name]. Can you help me access CE or schedule an assessment?"`,
        resources: [R.twoEleven, R.sha, R.kcha],
        quickReplies: [
          { id: "ce_in_shelter", label: "I'm already in CE — what else can I do?", value: "ce_done" },
          { id: "ce_not_done", label: "I haven't done CE yet", value: "ce_start" },
        ],
      };

    // ── DOUBLED UP ──────────────────────────────────────────────────────────

    case "doubled_up_timeline":
      return {
        paragraphs: [
          "Staying with someone else means your timeline depends on their situation changing too.",
          "Being doubled-up qualifies you as homeless for King County's CE system — you do not need to be outside.",
          "How long can you safely stay where you are now?",
        ],
        quickReplies: [
          { id: "du_days", label: "A few days", value: "days" },
          { id: "du_week", label: "About a week", value: "week" },
          { id: "du_month", label: "A few weeks to a month", value: "month" },
          { id: "du_open", label: "Not sure — they haven't said", value: "unknown" },
        ],
      };

    // ── VOUCHER ─────────────────────────────────────────────────────────────

    case "voucher_agency":
      return {
        paragraphs: [
          "Having a voucher is a real asset.",
          "The challenge in King County is landlord resistance. We're going to work around that.",
          "Which agency issued your voucher?",
        ],
        quickReplies: [
          { id: "va_sha", label: "Seattle Housing Authority (SHA)", value: "sha" },
          { id: "va_kcha", label: "King County Housing Authority (KCHA)", value: "kcha" },
          { id: "va_other", label: "Another agency or I'm not sure", value: "other" },
        ],
      };

    case "voucher_soi":
      return {
        paragraphs: [
          "Washington State law (RCW 49.60.030) makes it illegal for a landlord to refuse your application because you have a housing voucher.",
          "If a landlord says they don't 'accept Section 8' or 'don't participate in the voucher program,' that is illegal.",
          "Here is exactly what to say if a landlord turns you away for having a voucher:",
        ],
        script: `"I want to let you know that refusing to rent to me because I have a housing voucher is Source of Income discrimination and is illegal under Washington State law, specifically RCW 49.60.030. I am asking you to reconsider my application and process it the same as any other applicant. If you have questions about the voucher process, I am happy to connect you with my housing authority."`,
        resources: [
          R.wshrc,
          ctx.voucherAgency === "kcha" ? R.kcha : R.sha,
        ],
        quickReplies: [
          { id: "soi_ok", label: "Got it — how do I find a landlord?", value: "next" },
        ],
      };

    case "voucher_search":
      return {
        paragraphs: [
          "Here is your focused search strategy:",
          "1. Ask your housing authority directly for their list of landlords who are actively accepting vouchers — both SHA and KCHA maintain these lists.",
          "2. Call the Housing Crisis Line and tell them you have a voucher. They can connect you to landlords currently working with the voucher program.",
          "3. For East King County, ARCH tracks affordable housing properties that accept vouchers.",
          "Know your voucher payment standard before you call any landlord — that is your maximum allowable rent. Ask your housing authority if you don't have it.",
        ],
        resources: [R.crisisLine, R.arch, R.sha, R.kcha],
        quickReplies: [
          { id: "vs_ok", label: "Got it — now my household", value: "next" },
        ],
      };

    // ── AT RISK ─────────────────────────────────────────────────────────────

    case "at_risk_reason":
      return {
        paragraphs: [
          "You are not in crisis yet — but let's get ahead of it. The earlier you act, the more options you have.",
          "What is putting your housing at risk?",
        ],
        quickReplies: [
          { id: "ar_rent", label: "I'm behind on rent", value: "behind_on_rent" },
          { id: "ar_lease", label: "Lease is ending / not being renewed", value: "lease_ending" },
          { id: "ar_income", label: "Lost income or income is too low", value: "income_drop" },
          { id: "ar_notice", label: "I got a notice I don't understand", value: "notice_unclear" },
          { id: "ar_cond", label: "Housing conditions are unsafe", value: "unsafe_conditions" },
        ],
      };

    case "at_risk_rental_assist":
      return {
        paragraphs: [
          "Rental assistance can cover back rent, current rent, and sometimes future rent.",
          "Apply while you are still in your unit — most programs cannot help after you have left.",
          "Call these two first. They move the fastest in King County.",
        ],
        script: `"Hi, I am currently housed but at risk of losing my housing. I am [behind on rent / facing a lease end with nowhere to go]. I need rental assistance and want to know what programs are currently accepting applications."`,
        resources: [
          R.solidGround,
          R.twoEleven,
          R.unitedWay,
          { name: "Salvation Army", phone: "206-587-0503", note: "Emergency rent assistance — no appointment to call" },
        ],
        quickReplies: [
          { id: "ar_next", label: "Got it — now tell me about my household", value: "next" },
        ],
      };

    // ── COMMON PATH ─────────────────────────────────────────────────────────

    case "household_size":
      return {
        paragraphs: [
          "Now let's understand your household so we find the right-sized housing.",
          "Including yourself, how many people need housing?",
        ],
        quickReplies: [
          { id: "h1", label: "Just me", value: "1" },
          { id: "h2", label: "2 people", value: "2" },
          { id: "h3", label: "3–4 people", value: "4" },
          { id: "h5", label: "5 or more people", value: "5" },
        ],
      };

    case "household_flags":
      return {
        paragraphs: [
          "Some household situations open additional housing pathways.",
          "Do any of these apply? Select all that fit.",
        ],
        isMultiSelect: true,
        quickReplies: [
          { id: "f_children", label: "Children under 18", value: "children" },
          { id: "f_dv", label: "Fleeing domestic violence", value: "dv" },
          { id: "f_disability", label: "Disability or serious medical condition", value: "disability" },
          { id: "f_veteran", label: "Military veteran", value: "veteran" },
          { id: "f_reentry", label: "Recently released from jail or prison", value: "reentry" },
          { id: "f_none", label: "None of these", value: "none" },
        ],
      };

    case "strengths_income":
      return {
        paragraphs: [
          "Good. Now let's identify what you bring to the housing search.",
          "What is your current source of income or benefits?",
        ],
        quickReplies: [
          { id: "i_employ", label: "Employment (full or part-time)", value: "employment" },
          { id: "i_ssi", label: "SSI or SSDI", value: "ssi_ssdi" },
          { id: "i_tanf", label: "TANF or other public benefits", value: "tanf" },
          { id: "i_cs", label: "Child support or alimony", value: "child_support" },
          { id: "i_none", label: "No income right now", value: "none" },
          { id: "i_other", label: "Other income", value: "other" },
        ],
      };

    case "barrier_check":
      return {
        paragraphs: [
          "Almost there. Some things can make it harder to qualify for housing. Let's surface them now so your plan can address them.",
          "Do any of these apply? Select all that fit.",
        ],
        isMultiSelect: true,
        quickReplies: [
          { id: "b_evict", label: "Prior eviction on record", value: "eviction_history" },
          { id: "b_credit", label: "Poor or no credit history", value: "credit" },
          { id: "b_criminal", label: "Criminal history", value: "criminal_history" },
          { id: "b_noid", label: "No current photo ID", value: "no_id" },
          { id: "b_nomail", label: "No mailing address", value: "no_mail" },
          { id: "b_nophone", label: "No reliable phone", value: "no_phone" },
          { id: "b_nofunds", label: "No money for deposit or first month", value: "no_funds" },
          { id: "b_none", label: "None of these", value: "none" },
        ],
      };

    case "plan_complete":
      return {
        paragraphs: [
          "Here is your housing plan.",
          "These steps are specific to your situation. Take them one at a time — you do not have to do all of this today.",
          "Your plan is on the right. You can print it or save it.",
        ],
        quickReplies: [],
      };

    default:
      return { paragraphs: ["Let's keep going."] };
  }
}

const MULTI_SELECT_STEPS: Step[] = ["household_flags", "barrier_check"];

function getNextStep(step: Step, value: string, ctx: Ctx): { next: Step; ctxUpdate: Partial<Ctx> } {
  switch (step) {
    case "start":
      return value === "no"
        ? { next: "not_safe_resources", ctxUpdate: { safe: false } }
        : { next: "housing_status", ctxUpdate: { safe: true } };

    case "not_safe_resources":
      return { next: "housing_status", ctxUpdate: {} };

    case "housing_status": {
      const status = value as HousingStatus;
      const map: Record<HousingStatus, Step> = {
        unsheltered: "unsheltered_shelter",
        vehicle: "unsheltered_shelter",
        shelter: "shelter_timeline",
        doubled_up: "doubled_up_timeline",
        facing_eviction: "eviction_notice_type",
        at_risk: "at_risk_reason",
        has_voucher: "voucher_agency",
      };
      return { next: map[status] || "household_size", ctxUpdate: { status } };
    }

    case "eviction_notice_type":
      return { next: "eviction_deadline", ctxUpdate: { noticeType: value } };

    case "eviction_deadline": {
      const days = parseInt(value, 10);
      const urgent = !isNaN(days) && days <= 7;
      return {
        next: urgent ? "eviction_legal" : "eviction_rental_assist",
        ctxUpdate: { deadlineText: `${value} days` },
      };
    }

    case "eviction_legal":
      return { next: "eviction_rental_assist", ctxUpdate: {} };

    case "eviction_rental_assist":
      return { next: "household_size", ctxUpdate: {} };

    case "unsheltered_shelter":
      return { next: "unsheltered_ce", ctxUpdate: {} };

    case "unsheltered_ce":
      return { next: "household_size", ctxUpdate: {} };

    case "shelter_timeline":
      return { next: "shelter_ce", ctxUpdate: { deadlineText: value } };

    case "shelter_ce":
      return { next: "household_size", ctxUpdate: {} };

    case "doubled_up_timeline":
      return { next: "household_size", ctxUpdate: { deadlineText: value } };

    case "voucher_agency":
      return { next: "voucher_soi", ctxUpdate: { voucherAgency: value } };

    case "voucher_soi":
      return { next: "voucher_search", ctxUpdate: {} };

    case "voucher_search":
      return { next: "household_size", ctxUpdate: {} };

    case "at_risk_reason":
      return { next: "at_risk_rental_assist", ctxUpdate: {} };

    case "at_risk_rental_assist":
      return { next: "household_size", ctxUpdate: {} };

    case "household_size": {
      const size = parseInt(value, 10);
      return { next: "household_flags", ctxUpdate: { householdSize: isNaN(size) ? null : size } };
    }

    case "household_flags":
      return {
        next: "strengths_income",
        ctxUpdate: {
          hasChildren: value.includes("children"),
          hasDV: value.includes("dv"),
          hasDisability: value.includes("disability"),
          hasVeteran: value.includes("veteran"),
        },
      };

    case "strengths_income":
      return {
        next: "barrier_check",
        ctxUpdate: { incomeSource: value === "none" ? null : value },
      };

    case "barrier_check":
      return {
        next: "plan_complete",
        ctxUpdate: {
          barriers: value === "none" ? [] : value.split(","),
          hasID: !value.includes("no_id"),
        },
      };

    default:
      return { next: "plan_complete", ctxUpdate: {} };
  }
}

// ─── Plan Builder ─────────────────────────────────────────────────────────────

let _planId = 0;
function planItem(category: PlanCategory, action: string, opts?: {
  script?: string;
  resource?: Resource;
  urgent?: boolean;
}): PlanItem {
  return {
    id: `p-${_planId++}`,
    category,
    action,
    script: opts?.script,
    resource: opts?.resource,
    urgent: opts?.urgent,
    done: false,
  };
}

function buildPlan(ctx: Ctx): HousingPlan {
  _planId = 0;
  const items: PlanItem[] = [];

  // Crisis level
  let crisisLevel: HousingPlan["crisisLevel"] = "moderate";
  if (!ctx.safe || ctx.status === "unsheltered" || ctx.status === "vehicle") crisisLevel = "critical";
  else if (ctx.status === "facing_eviction" && ctx.deadlineText && parseInt(ctx.deadlineText) <= 7) crisisLevel = "critical";
  else if (ctx.status === "facing_eviction") crisisLevel = "high";
  else if (ctx.status === "shelter" || ctx.status === "doubled_up") crisisLevel = "high";
  else if (ctx.status === "at_risk" || ctx.status === "has_voucher") crisisLevel = "moderate";

  // Housing goal
  let housingGoal = "Find stable, safe, affordable housing in King County.";
  if (ctx.status === "facing_eviction") housingGoal = "Stop the eviction and stay in your current home, or find safe housing if that is not possible.";
  else if (ctx.status === "unsheltered" || ctx.status === "vehicle") housingGoal = "Get safe and sheltered tonight and access Coordinated Entry for permanent housing.";
  else if (ctx.status === "shelter") housingGoal = "Exit shelter into stable housing through Coordinated Entry and housing applications.";
  else if (ctx.status === "has_voucher") housingGoal = "Successfully lease up before your voucher expires.";
  else if (ctx.status === "at_risk") housingGoal = "Prevent housing loss and stay in your current home.";

  // TODAY (urgent first steps)
  if (!ctx.safe) {
    items.push(planItem("today", "Call the King County Housing Crisis Line — get a shelter placement tonight.", {
      script: `"I need emergency shelter tonight. I have [X] people in my household. Can you help me find a placement right now?"`,
      resource: R.crisisLine,
      urgent: true,
    }));
  }

  if (ctx.status === "facing_eviction") {
    const isUrgent = !!ctx.deadlineText && parseInt(ctx.deadlineText) <= 7;
    items.push(planItem("today", "Call a tenant lawyer — today, even if you just leave a voicemail.", {
      script: `"Hi, my name is [your name]. I received a ${(ctx.noticeType || "eviction notice").replace(/_/g, " ")}. I have approximately ${ctx.deadlineText || "a few days"} remaining. I need to speak with a tenant lawyer as soon as possible."`,
      resource: R.vlp,
      urgent: isUrgent,
    }));
  }

  if (ctx.status === "unsheltered" || ctx.status === "vehicle") {
    items.push(planItem("today", "Call the Housing Crisis Line and request both a shelter placement and a Coordinated Entry assessment in the same call.", {
      script: `"I am currently [outside / living in my vehicle] and I need shelter tonight and a Coordinated Entry assessment. I have [X] people in my household."`,
      resource: R.crisisLine,
      urgent: true,
    }));
  }

  // THIS WEEK
  if (ctx.status === "facing_eviction") {
    items.push(planItem("this_week", "Apply for emergency rental assistance immediately — before the deadline.", {
      script: `"I have an eviction notice and need emergency rental assistance. I owe $[amount] and have [X days] until my deadline. What programs are currently taking applications?"`,
      resource: R.solidGround,
      urgent: true,
    }));
    items.push(planItem("this_week", "Do NOT move out before your court date unless your lawyer tells you to.", {
      resource: R.tenantsUnion,
    }));
    items.push(planItem("this_week", "Photograph the front and back of your notice and save the envelope with the date on it."));
  }

  if (ctx.status === "unsheltered" || ctx.status === "vehicle") {
    items.push(planItem("this_week", "Complete your Coordinated Entry (CE) assessment — this is the main pathway to permanent housing.", {
      script: `"I need to access Coordinated Entry. I am currently [unsheltered / in my vehicle]. I do not have a permanent address. I need a CE assessment as soon as possible."`,
      resource: R.twoEleven,
    }));
  }

  if (ctx.status === "shelter") {
    items.push(planItem("this_week", "Complete a Coordinated Entry assessment today if you haven't already.", {
      script: `"I am in shelter and I need to complete a Coordinated Entry assessment. My shelter is [name]. Can you help me access CE or schedule an appointment?"`,
      resource: R.twoEleven,
    }));
    items.push(planItem("this_week", "Ask your shelter case manager for your CE status and which housing programs you are matched to."));
  }

  if (ctx.status === "doubled_up") {
    items.push(planItem("this_week", "Access Coordinated Entry through 2-1-1 — being doubled-up qualifies you as homeless.", {
      script: `"I am currently staying with someone temporarily and I need to access Coordinated Entry. Being doubled-up means I am considered homeless. I need a CE assessment."`,
      resource: R.twoEleven,
    }));
    items.push(planItem("this_week", "Apply to housing waitlists now — do not wait until your current situation ends."));
  }

  if (ctx.status === "has_voucher") {
    items.push(planItem("this_week", "Ask your housing authority for their list of landlords who are actively accepting vouchers.", {
      script: `"I have an active housing voucher and I need your list of landlords who are currently accepting it. Can you send me the list or tell me who to contact?"`,
      resource: ctx.voucherAgency === "kcha" ? R.kcha : R.sha,
    }));
    items.push(planItem("this_week", "Find out your voucher expiration date and note it in your plan — vouchers can be extended but only if requested before they expire."));
  }

  if (ctx.status === "at_risk") {
    items.push(planItem("this_week", "Apply for rental assistance while you are still in your unit.", {
      script: `"I am currently housed but at risk of losing my housing. I am [behind on rent / facing lease end]. I need rental assistance and I'm still in my unit."`,
      resource: R.solidGround,
    }));
    items.push(planItem("this_week", "Contact 2-1-1 for a full list of current rental assistance programs in your area.", {
      resource: R.twoEleven,
    }));
  }

  if (ctx.hasDV) {
    items.push(planItem("this_week", "Contact YWCA — DV survivors can access emergency housing without a CE referral.", {
      script: `"I am a domestic violence survivor and I need safe emergency housing. Do you have DV housing available? I need to move quickly."`,
      resource: R.ywca,
    }));
  }

  if (ctx.hasVeteran) {
    items.push(planItem("this_week", "Contact VA Supportive Housing (HUD-VASH) — veterans have dedicated housing programs.", {
      script: `"I am a veteran and I am experiencing homelessness. I need to apply for the HUD-VASH program or find out if I am already enrolled."`,
      resource: R.vashp,
    }));
  }

  // CALLS TO MAKE
  items.push(planItem("call", "2-1-1 — housing navigation and resource connection", {
    script: `"Hi, I need help finding housing. I am currently [describe your status]. I have [describe household]. Can you help me identify what programs I qualify for and connect me to Coordinated Entry if I haven't been assessed?"`,
    resource: R.twoEleven,
  }));

  if (ctx.status === "facing_eviction") {
    items.push(planItem("call", "Tenant lawyer — call and leave a message if needed", {
      script: `"Hi, I received a ${(ctx.noticeType || "notice").replace(/_/g, " ")} dated [date] and have ${ctx.deadlineText || "limited time"} remaining. I need legal advice as quickly as possible. Please call me back at [your number]."`,
      resource: R.vlp,
      urgent: true,
    }));
  }

  if (ctx.status === "has_voucher") {
    items.push(planItem("call", "Your housing authority — confirm payment standard, expiration, and landlord list", {
      script: `"Hi, I have an active voucher and I am searching for a unit. Can you confirm my payment standard for [bedroom size], my current expiration date, and whether you have a list of landlords currently accepting vouchers?"`,
      resource: ctx.voucherAgency === "kcha" ? R.kcha : R.sha,
    }));
  }

  // DOCUMENTS NEEDED
  items.push(planItem("document", "Current photo ID (required for most applications and shelter intake)"));
  items.push(planItem("document", "Social Security card or number"));
  if (ctx.householdSize && ctx.householdSize > 1) {
    items.push(planItem("document", "Photo ID and Social Security cards for all adult household members"));
  }
  if (ctx.hasChildren) {
    items.push(planItem("document", "Birth certificates for all children and school enrollment records"));
  }
  items.push(planItem("document", "Proof of income or benefits (pay stubs, benefit award letter, zero-income statement)"));
  if (ctx.status === "facing_eviction") {
    items.push(planItem("document", "Copy of the eviction notice (photograph front and back — keep the envelope)", { urgent: true }));
    items.push(planItem("document", "Current lease and any prior notices or communications with your landlord"));
    items.push(planItem("document", "Rent payment history or receipts"));
  }
  if (ctx.status === "has_voucher") {
    items.push(planItem("document", "Voucher paperwork including payment standard and expiration date"));
  }
  if (ctx.hasDV) {
    items.push(planItem("document", "DV documentation if you have it and it is safe to carry — you do not need it to access services"));
  }
  if (ctx.hasDisability) {
    items.push(planItem("document", "Disability documentation for accommodation requests — you do not have to disclose your diagnosis, just that you have a disability"));
  }

  // BARRIERS TO CLEAR
  if (ctx.barriers.includes("no_id")) {
    items.push(planItem("barrier", "Get a Washington State ID — fee waived for people experiencing homelessness.", {
      script: `"I am currently experiencing homelessness and I need to apply for a Washington State ID. I understand the fee may be waived. What documentation do I need to bring?"`,
      resource: R.dol,
    }));
  }

  if (ctx.barriers.includes("no_mail")) {
    items.push(planItem("barrier", "Get a mailing address — ask a shelter, day center, or case manager if you can use their address for housing mail.", {
      script: `"I am currently without stable housing and I need a mailing address for housing applications. Is there a way I can use this address for that purpose?"`,
    }));
  }

  if (ctx.barriers.includes("eviction_history")) {
    items.push(planItem("barrier", "Contact the Tenants Union for guidance on applying with an eviction record.", {
      script: `"I have a prior eviction on my record and I need help understanding which programs will consider my full situation and how to present my application."`,
      resource: R.tenantsUnion,
    }));
  }

  if (ctx.barriers.includes("criminal_history")) {
    items.push(planItem("barrier", "You have the right to an individualized assessment — landlords cannot automatically reject for criminal history. Contact legal aid.", {
      resource: R.vlp,
    }));
  }

  if (ctx.barriers.includes("no_funds")) {
    items.push(planItem("barrier", "Apply for move-in assistance — rental assistance programs often cover deposits and first month.", {
      script: `"I have found a unit but I need help with the deposit and first month's rent. Do you have programs that cover move-in costs?"`,
      resource: R.twoEleven,
    }));
  }

  if (ctx.hasDisability) {
    items.push(planItem("barrier", "You have the right to request a reasonable accommodation from any landlord or housing authority.", {
      script: `"I have a disability and I am requesting a reasonable accommodation. Specifically, I need [describe accommodation — e.g., a ground-floor unit / an exception to the no-pets policy for my service animal]. I do not need to disclose my diagnosis. I am making this request in writing and will follow up."`,
      resource: R.drwa,
    }));
  }

  // MOVE-IN NEEDS
  items.push(planItem("movein", "Confirm deposit source — apply to rental assistance programs for deposit help before signing anything.", { resource: R.twoEleven }));
  items.push(planItem("movein", "Set up utilities before move-in: electric, gas, water, internet — confirm which are in your name."));
  items.push(planItem("movein", "Walk the unit on move-in day — photograph every wall, floor, and fixture before you unpack. Email photos to yourself immediately."));
  items.push(planItem("movein", "Get a written receipt for your deposit and keep a copy of your signed lease."));
  if (ctx.hasChildren) {
    items.push(planItem("movein", "Enroll children in school at your new address — contact the school district."));
  }

  // STAY HOUSED
  items.push(planItem("stay_housed", "Confirm your rent due date and set a recurring reminder."));
  items.push(planItem("stay_housed", "Update your address with all benefit programs, healthcare, and your housing authority within 30 days of move-in."));
  if (ctx.status === "has_voucher") {
    items.push(planItem("stay_housed", "Know your voucher recertification date — missing it can end your voucher. Add it to your calendar now."));
  }
  items.push(planItem("stay_housed", "If you receive any notice after move-in — call legal aid the same day. Do not wait.", { resource: R.tenantsUnion, urgent: true }));

  return { crisisLevel, housingGoal, items };
}

// ─── Minimal Housing Layout ───────────────────────────────────────────────────

function HousingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-espresso py-4 px-6">
        <div className="container max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Home className="w-4 h-4 text-white/80" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-serif text-base text-white/90 leading-none">Decoded Housing</p>
              <p className="text-[10px] text-white/40 tracking-widest uppercase mt-0.5">Housing Navigator</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-gold/50" />
            <span className="text-xs text-gold/50 tracking-wide">King County, WA</span>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-border/30 py-6">
        <div className="container max-w-5xl px-6">
          <p className="text-[11px] text-muted-foreground/40 text-center">
            Decoded Housing is part of Decoded Justice · Not legal advice · Resources are for King County, WA · Housing Crisis Line: 866-904-HOME (4663)
          </p>
        </div>
      </footer>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScriptCard({ script }: { script: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(script).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gold/6 border border-gold/20 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-medium text-gold/70 uppercase tracking-widest">What to say</p>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="text-sm text-foreground/80 font-light italic leading-relaxed">{script}</p>
    </div>
  );
}

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <div className={cn(
      "flex items-start gap-3 rounded-xl px-3 py-2.5 border",
      resource.urgent
        ? "bg-destructive/5 border-destructive/20"
        : "bg-secondary/20 border-border/40"
    )}>
      <Phone className={cn("w-3.5 h-3.5 mt-0.5 shrink-0", resource.urgent ? "text-destructive" : "text-gold/60")} strokeWidth={1.5} />
      <div>
        <p className="text-xs font-medium text-foreground">{resource.name}</p>
        {resource.phone && <p className="text-xs text-primary font-mono mt-0.5">{resource.phone}</p>}
        {resource.note && <p className="text-[11px] text-muted-foreground mt-0.5">{resource.note}</p>}
      </div>
    </div>
  );
}

function NavigatorBubble({
  msg,
  onReply,
  activeMultiSelect,
  onMultiToggle,
  onMultiSubmit,
}: {
  msg: ChatMsg;
  onReply: (value: string, label: string) => void;
  activeMultiSelect: string[];
  onMultiToggle: (value: string) => void;
  onMultiSubmit: () => void;
}) {
  return (
    <div className="flex gap-3 max-w-[92%]">
      <div className="w-8 h-8 rounded-full bg-primary/8 border border-primary/15 flex items-center justify-center shrink-0 mt-1">
        <Home className="w-4 h-4 text-primary/70" strokeWidth={1.5} />
      </div>
      <div className="space-y-2.5 flex-1 min-w-0">
        <div className="bg-card border border-border/40 rounded-2xl rounded-tl-sm px-4 py-3 space-y-2">
          {(msg.paragraphs || [msg.content || ""]).filter(Boolean).map((p, i) => (
            <p key={i} className="text-sm text-foreground leading-relaxed">{p}</p>
          ))}
        </div>

        {msg.script && <ScriptCard script={msg.script} />}

        {msg.resources && msg.resources.length > 0 && (
          <div className="space-y-1.5">
            {msg.resources.map((r, i) => <ResourceCard key={i} resource={r} />)}
          </div>
        )}

        {msg.quickReplies && msg.quickReplies.length > 0 && (
          <div>
            <div className={cn(
              "flex flex-wrap gap-2",
              msg.isMultiSelect && "mb-2"
            )}>
              {msg.quickReplies.map((qr) => (
                <button
                  key={qr.id}
                  onClick={() => msg.isMultiSelect ? onMultiToggle(qr.value) : onReply(qr.value, qr.label)}
                  className={cn(
                    "text-xs px-3 py-1.5 rounded-full border transition-colors",
                    msg.isMultiSelect && activeMultiSelect.includes(qr.value)
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {qr.label}
                </button>
              ))}
            </div>
            {msg.isMultiSelect && (
              <button
                onClick={onMultiSubmit}
                className="text-xs px-4 py-1.5 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                {activeMultiSelect.length === 0 ? "None of these →" : `Continue (${activeMultiSelect.length} selected) →`}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function UserBubble({ msg }: { msg: ChatMsg }) {
  return (
    <div className="flex justify-end">
      <div className="bg-primary/10 border border-primary/20 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[78%]">
        <p className="text-sm text-foreground">{msg.content}</p>
      </div>
    </div>
  );
}

const CATEGORY_META: Record<PlanCategory, { label: string; icon: React.ElementType; color: string }> = {
  today: { label: "Today's First Step", icon: AlertTriangle, color: "text-destructive" },
  this_week: { label: "This Week", icon: CheckCircle2, color: "text-primary" },
  call: { label: "Calls to Make", icon: Phone, color: "text-gold" },
  document: { label: "Documents Needed", icon: FileText, color: "text-muted-foreground" },
  barrier: { label: "Barriers to Clear", icon: Shield, color: "text-primary" },
  movein: { label: "Move-In Needs", icon: Home, color: "text-teal" },
  stay_housed: { label: "Stay Housed", icon: Heart, color: "text-accent" },
};

function PlanSection({
  category,
  items,
  onToggle,
}: {
  category: PlanCategory;
  items: PlanItem[];
  onToggle: (id: string) => void;
}) {
  const [open, setOpen] = useState(category === "today" || category === "this_week" || category === "call");
  const meta = CATEGORY_META[category];
  const Icon = meta.icon;
  const doneCount = items.filter((i) => i.done).length;

  return (
    <div className="border-b border-border/30 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/20 transition-colors text-left"
      >
        <div className="flex items-center gap-2.5">
          <Icon className={cn("w-3.5 h-3.5", meta.color)} strokeWidth={1.5} />
          <span className="text-xs font-medium text-foreground">{meta.label}</span>
          <span className="text-[10px] text-muted-foreground/60">{doneCount}/{items.length}</span>
        </div>
        {open ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/40" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />}
      </button>

      {open && (
        <div className="pb-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "px-4 py-3 cursor-pointer hover:bg-muted/10 transition-colors border-t border-border/20",
                item.done && "opacity-40"
              )}
              onClick={() => onToggle(item.id)}
            >
              <div className="flex items-start gap-2.5">
                {item.done
                  ? <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  : <Circle className={cn("w-4 h-4 shrink-0 mt-0.5", item.urgent ? "text-destructive" : "text-border")} />
                }
                <div className="flex-1 min-w-0">
                  {item.urgent && !item.done && (
                    <span className="text-[10px] text-destructive font-medium uppercase tracking-wider mr-1.5">Urgent</span>
                  )}
                  <p className={cn("text-xs leading-relaxed", item.done ? "line-through text-muted-foreground" : "text-foreground")}>
                    {item.action}
                  </p>
                  {item.resource?.phone && !item.done && (
                    <p className="text-[11px] text-primary font-mono mt-1">{item.resource.phone} — {item.resource.name}</p>
                  )}
                  {item.script && !item.done && (
                    <p className="text-[10px] text-muted-foreground mt-1 italic leading-relaxed line-clamp-2">
                      {item.script}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PlanPanel({
  plan,
  onToggle,
  onPrint,
}: {
  plan: HousingPlan | null;
  onToggle: (id: string) => void;
  onPrint: () => void;
}) {
  if (!plan) {
    return (
      <div className="bg-card border border-border/40 rounded-2xl p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-3">
          <Home className="w-6 h-6 text-primary/30" strokeWidth={1.5} />
        </div>
        <p className="text-sm font-medium text-foreground mb-1">My Housing Plan</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Answer the questions in the conversation and your personalized housing plan will appear here.
        </p>
      </div>
    );
  }

  const crisisColors: Record<HousingPlan["crisisLevel"], string> = {
    critical: "text-destructive bg-destructive/8 border-destructive/20",
    high: "text-amber-600 bg-amber-50 border-amber-200",
    moderate: "text-primary bg-primary/8 border-primary/20",
    stable: "text-green-700 bg-green-50 border-green-200",
  };

  const allCategories = Object.keys(CATEGORY_META) as PlanCategory[];
  const grouped = allCategories
    .map((cat) => ({ cat, items: plan.items.filter((i) => i.category === cat) }))
    .filter(({ items }) => items.length > 0);

  const totalDone = plan.items.filter((i) => i.done).length;
  const totalItems = plan.items.length;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/40">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-base font-medium text-foreground">My Housing Plan</h2>
          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
        </div>

        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wider", crisisColors[plan.crisisLevel])}>
          {plan.crisisLevel === "critical" && <AlertTriangle className="w-2.5 h-2.5 mr-1" />}
          {plan.crisisLevel} priority
        </span>

        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{plan.housingGoal}</p>

        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-border/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${totalItems > 0 ? (totalDone / totalItems) * 100 : 0}%` }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground shrink-0">{totalDone}/{totalItems}</span>
        </div>
      </div>

      {/* Sections */}
      <div>
        {grouped.map(({ cat, items }) => (
          <PlanSection key={cat} category={cat} items={items} onToggle={onToggle} />
        ))}
      </div>

      <div className="px-5 py-3 border-t border-border/30">
        <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
          <Heart className="w-3 h-3 text-muted-foreground/50" />
          Take one step at a time. Tap any step to check it off.
        </p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const STORAGE_KEY = "decoded-housing-nav-v2";

interface SavedState {
  messages: ChatMsg[];
  ctx: Ctx;
  currentStep: Step;
  plan: HousingPlan | null;
}

export default function HousingNavigator() {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [ctx, setCtx] = useState<Ctx>(EMPTY_CTX);
  const [currentStep, setCurrentStep] = useState<Step>("start");
  const [plan, setPlan] = useState<HousingPlan | null>(null);
  const [input, setInput] = useState("");
  const [pendingReplies, setPendingReplies] = useState<QuickReply[] | null>(null);
  const [isMultiStepActive, setIsMultiStepActive] = useState(false);
  const [multiSelect, setMultiSelect] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const save = useCallback((msgs: ChatMsg[], c: Ctx, step: Step, p: HousingPlan | null) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages: msgs, ctx: c, currentStep: step, plan: p }));
    } catch { /* storage full — ignore */ }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const state: SavedState = JSON.parse(saved);
        setMessages(state.messages);
        setCtx(state.ctx);
        setCurrentStep(state.currentStep);
        setPlan(state.plan);
        const last = state.messages[state.messages.length - 1];
        if (last?.role === "navigator" && last.quickReplies) {
          setPendingReplies(last.quickReplies);
          setIsMultiStepActive(!!last.isMultiSelect);
        }
        return;
      } catch { /* corrupt state */ }
    }
    const navMsg = getNavMsg("start", EMPTY_CTX);
    const msg: ChatMsg = {
      id: `nav-${Date.now()}`,
      role: "navigator",
      paragraphs: navMsg.paragraphs,
      quickReplies: navMsg.quickReplies,
    };
    setMessages([msg]);
    setPendingReplies(navMsg.quickReplies ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleResponse = useCallback((value: string, label: string) => {
    const userMsg: ChatMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      content: label,
    };
    const withUser = [...messages, userMsg];
    setMessages(withUser);

    const { next, ctxUpdate } = getNextStep(currentStep, value, ctx);
    const newCtx = { ...ctx, ...ctxUpdate };
    setCtx(newCtx);
    setCurrentStep(next);
    setPendingReplies(null);
    setIsMultiStepActive(false);
    setMultiSelect([]);

    const newPlan = next === "plan_complete" ? buildPlan(newCtx) : plan;
    if (next === "plan_complete") setPlan(newPlan);
    save(withUser, newCtx, next, newPlan);

    setTimeout(() => {
      const navMsg = getNavMsg(next, newCtx);
      const navChatMsg: ChatMsg = {
        id: `nav-${Date.now() + 1}`,
        role: "navigator",
        paragraphs: navMsg.paragraphs,
        script: navMsg.script,
        resources: navMsg.resources,
        quickReplies: navMsg.quickReplies,
        isMultiSelect: navMsg.isMultiSelect,
      };
      const final = [...withUser, navChatMsg];
      setMessages(final);
      save(final, newCtx, next, newPlan);
      if (navMsg.quickReplies && navMsg.quickReplies.length > 0) {
        setPendingReplies(navMsg.quickReplies);
        setIsMultiStepActive(!!navMsg.isMultiSelect);
      }
    }, 400);
  }, [ctx, currentStep, messages, plan, save]);

  const handleMultiSelectSubmit = useCallback(() => {
    const labels = (pendingReplies || [])
      .filter((r) => multiSelect.includes(r.value))
      .map((r) => r.label);
    const value = multiSelect.length === 0 ? "none" : multiSelect.join(",");
    const label = multiSelect.length === 0 ? "None of these" : labels.join(", ");
    handleResponse(value, label);
  }, [pendingReplies, multiSelect, handleResponse]);

  const handleTextSubmit = () => {
    if (!input.trim()) return;
    handleResponse(input.trim(), input.trim());
    setInput("");
  };

  const handleTogglePlanItem = (id: string) => {
    if (!plan) return;
    const updated: HousingPlan = {
      ...plan,
      items: plan.items.map((item) => item.id === id ? { ...item, done: !item.done } : item),
    };
    setPlan(updated);
    save(messages, ctx, currentStep, updated);
  };

  const handleRestart = () => {
    localStorage.removeItem(STORAGE_KEY);
    const navMsg = getNavMsg("start", EMPTY_CTX);
    const msg: ChatMsg = {
      id: `nav-${Date.now()}`,
      role: "navigator",
      paragraphs: navMsg.paragraphs,
      quickReplies: navMsg.quickReplies,
    };
    setMessages([msg]);
    setCtx(EMPTY_CTX);
    setCurrentStep("start");
    setPlan(null);
    setInput("");
    setPendingReplies(navMsg.quickReplies ?? null);
    setMultiSelect([]);
    setIsMultiStepActive(false);
  };

  const isDone = currentStep === "plan_complete";

  return (
    <HousingLayout>
      <div className="container max-w-5xl px-4 sm:px-6 py-6 sm:py-10">
        <div className="grid lg:grid-cols-5 gap-6 items-start">

          {/* Chat column */}
          <div className="lg:col-span-3 print:hidden">
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              {/* Messages */}
              <div className="h-[62vh] overflow-y-auto p-5 space-y-5">
                {messages.map((msg) =>
                  msg.role === "navigator" ? (
                    <NavigatorBubble
                      key={msg.id}
                      msg={msg}
                      onReply={handleResponse}
                      activeMultiSelect={multiSelect}
                      onMultiToggle={(v) => setMultiSelect((prev) => prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v])}
                      onMultiSubmit={handleMultiSelectSubmit}
                    />
                  ) : (
                    <UserBubble key={msg.id} msg={msg} />
                  )
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input area */}
              {!isDone && (
                <div className="border-t border-border/40 p-4 space-y-3 bg-card/50">
                  {pendingReplies && pendingReplies.length > 0 && !isMultiStepActive && (
                    <div className="flex flex-wrap gap-2">
                      {pendingReplies.map((qr) => (
                        <button
                          key={qr.id}
                          onClick={() => handleResponse(qr.value, qr.label)}
                          className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {qr.label}
                        </button>
                      ))}
                    </div>
                  )}
                  {isMultiStepActive && pendingReplies && (
                    <div className="flex flex-wrap gap-2">
                      {pendingReplies.map((qr) => (
                        <button
                          key={qr.id}
                          onClick={() => setMultiSelect((prev) => prev.includes(qr.value) ? prev.filter((x) => x !== qr.value) : [...prev, qr.value])}
                          className={cn(
                            "text-xs px-3 py-1.5 rounded-full border transition-colors",
                            multiSelect.includes(qr.value)
                              ? "border-primary bg-primary/10 text-primary font-medium"
                              : "border-border text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
                          )}
                        >
                          {qr.label}
                        </button>
                      ))}
                      <button
                        onClick={handleMultiSelectSubmit}
                        className="text-xs px-4 py-1.5 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
                      >
                        {multiSelect.length === 0 ? "None of these →" : `Continue (${multiSelect.length} selected) →`}
                      </button>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleTextSubmit();
                        }
                      }}
                      placeholder="Type your response…"
                      rows={2}
                      className="resize-none text-sm bg-background border-border/50 focus:border-gold/30 transition-colors"
                    />
                    <Button
                      onClick={handleTextSubmit}
                      disabled={!input.trim()}
                      size="sm"
                      className="h-auto px-4 self-end"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {isDone && (
                <div className="border-t border-border/40 p-4 flex items-center justify-between bg-card/50">
                  <p className="text-xs text-muted-foreground">Your plan is ready. Check off each step as you go.</p>
                  <button onClick={handleRestart} className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2">
                    Start over
                  </button>
                </div>
              )}
            </div>

            <p className="text-[10px] text-muted-foreground/40 text-center mt-3 leading-relaxed">
              Private — your answers are saved only on this device. Not legal advice. King County, WA only.
            </p>
          </div>

          {/* Plan column */}
          <div className="lg:col-span-2 space-y-4">
            <PlanPanel plan={plan} onToggle={handleTogglePlanItem} onPrint={() => window.print()} />

            {/* Always-visible crisis line */}
            <div className="bg-destructive/5 border border-destructive/15 rounded-xl p-4">
              <p className="text-[10px] font-medium text-destructive uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3 h-3" />
                Housing Crisis Line — 24/7
              </p>
              <p className="text-sm font-mono font-medium text-foreground">866-904-HOME (4663)</p>
              <p className="text-[11px] text-muted-foreground mt-1">Call or text anytime for emergency shelter access in King County.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Print view */}
      <div className="hidden print:block px-8 py-12">
        {plan && (
          <>
            <h1 className="text-2xl font-bold mb-1">My Housing Plan</h1>
            <p className="text-sm text-gray-600 mb-1">Decoded Housing · King County, WA · {new Date().toLocaleDateString()}</p>
            <p className="text-sm font-medium text-gray-800 mb-6 border-b pb-4">Goal: {plan.housingGoal}</p>
            {(Object.keys(CATEGORY_META) as PlanCategory[]).map((cat) => {
              const sectionItems = plan.items.filter((i) => i.category === cat);
              if (!sectionItems.length) return null;
              return (
                <div key={cat} className="mb-6">
                  <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700 mb-3 border-b pb-1">
                    {CATEGORY_META[cat].label}
                  </h2>
                  {sectionItems.map((item) => (
                    <div key={item.id} className="mb-4 pl-4">
                      <p className="text-sm font-medium text-gray-900">{item.urgent ? "⚠ URGENT — " : ""}{item.action}</p>
                      {item.resource && (
                        <p className="text-xs text-gray-600 mt-0.5">{item.resource.name}{item.resource.phone ? ` — ${item.resource.phone}` : ""}</p>
                      )}
                      {item.script && (
                        <p className="text-xs text-gray-500 italic mt-1 leading-relaxed">What to say: {item.script}</p>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
            <p className="text-xs text-gray-400 border-t pt-4 mt-8">
              Generated by Decoded Housing · Not legal advice · Housing Crisis Line: 866-904-HOME (4663)
            </p>
          </>
        )}
      </div>
    </HousingLayout>
  );
}
