import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, BookOpen, Bookmark, BookmarkCheck, CheckCircle2, ChevronRight,
  Clock, FileText, Gavel, GraduationCap, Home, LibraryBig, Search, Shield,
  Scale, Settings2, Users, Accessibility, Landmark, Car, Megaphone, Lock, Stethoscope, Building2
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { libraryCategories } from "@/data/legalEducationLibrary";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const RECENTLY_VIEWED_KEY = "dj_recently_viewed_guides";

type Topic = {
  title: string;
  description: string;
  icon: LucideIcon;
  guideId: string;
  subtopics: string[];
};

type Problem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const topics: Topic[] = [
  { title: "Housing & Stability", description: "Housing rights, vouchers, accommodations, notices, and housing programs.", icon: Home, guideId: "housing-full-guide", subtopics: ["Eviction & termination", "Accommodation", "Discrimination", "Vouchers & public housing"] },
  { title: "Family & Child Welfare", description: "CPS, dependency, caregiver rights, investigations, placement, and records.", icon: Users, guideId: "cps-dcyf-full-guide", subtopics: ["CPS / DCYF", "Dependency", "Caregiver rights", "Placement & court"] },
  { title: "Rights & Government", description: "Police encounters, public records, government decisions, and oversight.", icon: Shield, guideId: "police-full-guide", subtopics: ["Police encounters", "Public records", "Government decisions", "Oversight"] },
  { title: "Disability & Access", description: "Disability rights, accommodations, accessibility, and discrimination.", icon: Accessibility, guideId: "disability-full-guide", subtopics: ["ADA", "Section 504", "Accommodations", "Accessibility"] },
  { title: "Courts & Legal Process", description: "Hearings, filings, procedure, appeals, and understanding court documents.", icon: Gavel, guideId: "courts-full-guide", subtopics: ["Hearings", "Filings", "Appeals", "Court terminology"] },
  { title: "Benefits & Education", description: "Public benefits, Social Security, education records, attendance, and student rights.", icon: GraduationCap, guideId: "education-full-guide", subtopics: ["Benefits", "Social Security", "Education records", "Special education"] },
  { title: "Traffic & Transportation", description: "Traffic stops, citations, vehicle searches, and transportation-related rights.", icon: Car, guideId: "traffic-stops-full-guide", subtopics: ["Traffic stops", "Citations", "Searches", "Vehicle records"] },
  { title: "Speech & Protest", description: "First Amendment principles, public demonstrations, recording, and expressive activity.", icon: Megaphone, guideId: "protest-full-guide", subtopics: ["First Amendment", "Demonstrations", "Recording", "Public spaces"] },
  { title: "Jail & Detention", description: "Rights during incarceration, grievances, medical care, and oversight.", icon: Lock, guideId: "incarceration-full-guide", subtopics: ["Conditions", "Medical care", "Grievances", "Oversight"] },
  { title: "Healthcare & Patient Rights", description: "Medical records, privacy, informed consent, access, and complaints.", icon: Stethoscope, guideId: "healthcare-full-guide", subtopics: ["Medical records", "Privacy", "Consent", "Complaints"] },
  { title: "Government Programs & Benefits", description: "Agency decisions, public assistance, notices, eligibility, and appeals.", icon: Building2, guideId: "government-full-guide", subtopics: ["Benefits", "Eligibility", "Notices", "Appeals"] },
];

const problems: Problem[] = [
  { title: "I received a notice", description: "Understand what the document says, what it may require, and what to preserve.", icon: FileText },
  { title: "Someone made a decision about me", description: "Learn how decisions, notices, reviews, and appeals may work.", icon: Landmark },
  { title: "I need records", description: "Identify records that may exist and organize a request for them.", icon: LibraryBig },
  { title: "A government agency is investigating me", description: "Understand the process, participants, and records that may matter.", icon: Shield },
  { title: "I need an accommodation", description: "Learn how disability-access and accommodation processes work.", icon: Accessibility },
  { title: "I'm going to court", description: "Understand hearings, filings, procedure, and important terminology.", icon: Gavel },
  { title: "I need to appeal", description: "Start by identifying the decision, notice, review path, and applicable deadline.", icon: ArrowRight },
  { title: "I want to understand the law", description: "Move from plain-language guidance to statutes, regulations, and official sources.", icon: Scale },
];

const authorityTypes = [
  ["Statutes", "Primary authority", Scale],
  ["Regulations", "Primary authority", Settings2],
  ["Court decisions", "Primary authority", Gavel],
  ["Agency rules", "Official authority", Landmark],
  ["Official guidance", "Official authority", FileText],
  ["Research guides", "Secondary authority", BookOpen],
] as const;

const tools = [
  ["Case Builder", "Turn what happened into an organized case record.", "/case-builder"],
  ["Timeline", "Build a chronological record of events and communications.", "/cases"],
  ["Evidence & Exhibits", "Organize documents and evidence mentioned in your story.", "/cases"],
  ["Record Requests", "Track requests, productions, gaps, and follow-up.", "/cases"],
  ["Legal Templates", "Use structured templates for common legal and administrative tasks.", "/templates"],
  ["Find Legal Help", "Locate legal-aid, self-help, and referral resources.", "/find-help"],
];

function getRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || "[]"); } catch { return []; }
}

function TopicCard({ topic, saved, onSave }: { topic: Topic; saved: boolean; onSave?: () => void }) {
  const Icon = topic.icon;
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-warm-sm">
      {onSave && (
        <button onClick={(e) => { e.preventDefault(); onSave(); }} aria-label={saved ? `Remove ${topic.title} from saved` : `Save ${topic.title}`} className="absolute right-4 top-4 z-10 rounded-lg border border-border bg-card p-2 text-muted-foreground hover:text-primary">
          {saved ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
        </button>
      )}
      <Link to={`/guide/${topic.guideId}`} className="block p-6 pr-14 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-primary/15 bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Explore topic</p>
        <h3 className="text-xl font-semibold tracking-tight text-foreground group-hover:text-primary">{topic.title}</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{topic.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {topic.subtopics.map((item) => <span key={item} className="rounded-full border border-border bg-secondary/40 px-2.5 py-1 text-[10px] text-muted-foreground">{item}</span>)}
        </div>
        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary">Explore <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></span>
      </Link>
    </article>
  );
}

export default function EducationLibrary() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [recentIds] = useState<string[]>(getRecent);

  useEffect(() => {
    if (!user) return;
    supabase.from("justice_place_bookmarks").select("resource_id").eq("user_id", user.id).eq("resource_type", "guide")
      .then(({ data }) => setSaved(new Set((data || []).map((row) => row.resource_id))));
  }, [user]);

  const toggleSave = async (guideId: string, title: string) => {
    if (!user) return;
    const next = new Set(saved);
    if (next.has(guideId)) {
      next.delete(guideId);
      setSaved(next);
      await supabase.from("justice_place_bookmarks").delete().eq("user_id", user.id).eq("resource_type", "guide").eq("resource_id", guideId);
    } else {
      next.add(guideId);
      setSaved(next);
      await supabase.from("justice_place_bookmarks").insert({ user_id: user.id, resource_type: "guide", resource_id: guideId, resource_title: title, resource_url: `/guide/${guideId}` });
    }
  };

  const filteredTopics = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return topics;
    return topics.filter((topic) => [topic.title, topic.description, ...topic.subtopics].join(" ").toLowerCase().includes(q));
  }, [query]);

  const recentCategories = recentIds.map((id) => libraryCategories.find((c) => c.guideId === id)).filter(Boolean) as LibraryCategoryCard[];

  return (
    <Layout>
      <main className="bg-background">
        <section className="border-b border-border bg-card">
          <div className="container py-12 lg:py-16">
            <div className="mx-auto max-w-5xl">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Knowledge Center</p>
              <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:items-end">
                <div>
                  <h1 className="font-serif text-4xl leading-tight tracking-tight text-foreground md:text-5xl">Legal knowledge, decoded.</h1>
                  <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">Understand the system. Find the authority. Know what to look for.</p>
                </div>
                <div>
                  <label htmlFor="knowledge-search" className="sr-only">What are you trying to understand?</label>
                  <div className="flex h-14 items-center rounded-xl border border-border bg-background px-4 shadow-sm focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10">
                    <Search className="mr-3 h-5 w-5 shrink-0 text-muted-foreground" />
                    <input id="knowledge-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="What are you trying to understand?" className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Notice", "Records", "Appeals", "Accommodation", "Investigations"].map((item) => (
                      <button key={item} onClick={() => setQuery(item)} className="rounded-full border border-border px-3 py-1.5 text-[11px] text-muted-foreground transition hover:border-primary/30 hover:text-primary">{item}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container py-12 lg:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Explore</p>
                <h2 className="mt-2 font-serif text-3xl text-foreground">Start with a legal topic</h2>
                <p className="mt-2 text-sm text-muted-foreground">Choose the system closest to your situation.</p>
              </div>
              <span className="hidden text-xs text-muted-foreground sm:block">{filteredTopics.length} topic areas</span>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredTopics.map((topic) => {
                return <TopicCard key={topic.guideId} topic={topic} saved={saved.has(topic.guideId)} onSave={user ? () => toggleSave(topic.guideId, topic.title) : undefined} />;
              })}
            </div>
            {!filteredTopics.length && <div className="rounded-2xl border border-dashed border-border py-14 text-center text-sm text-muted-foreground">No topic matches “{query}”. Try a broader phrase or start with a problem below.</div>}
          </div>
        </section>

        <section className="border-y border-border bg-secondary/20">
          <div className="container py-12 lg:py-16">
            <div className="mx-auto max-w-6xl">
              <div className="mb-7">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Problem pathways</p>
                <h2 className="mt-2 font-serif text-3xl text-foreground">Start with what happened</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">You do not need to know the legal term first. Start with the situation you are trying to understand.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {problems.map(({ title, description, icon: Icon }) => (
                  <Link key={title} to="/analyzer" className="group rounded-xl border border-border bg-card p-5 transition hover:border-primary/30 hover:shadow-sm">
                    <Icon className="mb-4 h-5 w-5 text-primary" />
                    <h3 className="font-medium text-foreground">{title}</h3>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">{description}</p>
                    <span className="mt-4 inline-flex items-center text-xs font-medium text-primary">Explore <ArrowRight className="ml-1 h-3.5 w-3.5" /></span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="container py-12 lg:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Research & authority</p>
                <h2 className="mt-2 font-serif text-3xl text-foreground">Trace the answer to its source.</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">Move from plain-language guidance to the statutes, regulations, decisions, and official material behind it.</p>
                <Button variant="outline" className="mt-6" asChild><Link to="/education-library?view=research">Open research center <ArrowRight className="h-4 w-4" /></Link></Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {authorityTypes.map(([title, type, Icon]) => (
                  <div key={title} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-primary/10 p-2"><Icon className="h-4 w-4 text-primary" /></div>
                      <div><p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{type}</p><h3 className="mt-1 text-sm font-medium text-foreground">{title}</h3></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-card">
          <div className="container py-12 lg:py-16">
            <div className="mx-auto max-w-6xl">
              <div className="mb-7">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Tools & forms</p>
                <h2 className="mt-2 font-serif text-3xl text-foreground">Turn knowledge into organized work.</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map(([title, description, href]) => (
                  <Link key={title} to={href} className="group rounded-xl border border-border bg-background p-5 transition hover:border-primary/30">
                    <div className="flex items-center justify-between"><h3 className="font-medium text-foreground">{title}</h3><ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" /></div>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">{description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="container py-12 lg:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Your library</p>
                <h2 className="mt-2 font-serif text-3xl text-foreground">Keep your research close.</h2>
              </div>
              <Link to="/education-library?tab=saved" className="text-xs font-medium text-primary">View saved →</Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Link to="/education-library?tab=saved" className="rounded-xl border border-border bg-card p-5 hover:border-primary/30">
                <Bookmark className="h-5 w-5 text-primary" /><h3 className="mt-4 font-medium">Saved</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{saved.size ? `${saved.size} saved guide${saved.size === 1 ? "" : "s"}.` : "Save guides and return to them later."}</p>
              </Link>
              <div className="rounded-xl border border-border bg-card p-5">
                <Clock className="h-5 w-5 text-primary" /><h3 className="mt-4 font-medium">Recently viewed</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{recentCategories.length ? `${recentCategories.length} recent guide${recentCategories.length === 1 ? "" : "s"}.` : "Guides you open can appear here."}</p>
              </div>
              <Link to="/cases" className="rounded-xl border border-primary/20 bg-primary/5 p-5 hover:border-primary/40">
                <CheckCircle2 className="h-5 w-5 text-primary" /><h3 className="mt-4 font-medium">For your case</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">Connect research to your Case Workspace as you work.</p><span className="mt-4 inline-flex text-xs font-medium text-primary">Open Case Workspace →</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="container pb-16">
          <div className="mx-auto max-w-3xl rounded-2xl border border-primary/15 bg-primary/5 p-7 text-center">
            <p className="text-sm text-muted-foreground">Have a specific situation and do not know where to begin?</p>
            <Button variant="hero" className="mt-4" asChild><Link to="/analyzer">Start with the Analyzer <ArrowRight className="h-4 w-4" /></Link></Button>
          </div>
          <div className="mx-auto mt-10 max-w-4xl border-t border-border pt-8"><Disclaimer className="justify-center" /></div>
        </section>
      </main>
    </Layout>
  );
}
