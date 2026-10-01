import { useMemo, useState } from "react";
import { ArrowLeft, BookOpen, ExternalLink, Search, Scale } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { LAW_MODULES, type LawModule } from "@/lib/law/issueLibrary";
import { POLICE_LAW_MODULES } from "@/lib/law/policeIssueModules";

const ALL_LAW_MODULES: LawModule[] = [...LAW_MODULES, ...POLICE_LAW_MODULES];

const authorityLevels = [
  { label: "Primary Authority", description: "Statutes, regulations, constitutions, and court decisions." },
  { label: "Official Authority", description: "Agency rules, policies, and official guidance." },
  { label: "Secondary Research", description: "Research materials that help explain or locate authority." },
];

function ModuleCard({ module }: { module: LawModule }) {
  return (
    <article className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="p-6 md:p-7">
        <div className="flex items-start justify-between gap-5">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline">{module.category}</Badge>
              <Badge variant="secondary">Research module</Badge>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl text-foreground">{module.title}</h2>
            <p className="text-muted-foreground leading-6 mt-3 max-w-3xl">{module.definition}</p>
          </div>
          <Scale className="h-6 w-6 text-primary shrink-0 hidden sm:block" />
        </div>
      </div>

      <div className="border-t border-border grid md:grid-cols-2">
        <div className="p-6 border-b md:border-b-0 md:border-r border-border">
          <p className="text-xs uppercase tracking-[0.18em] text-primary mb-3">What to examine</p>
          <ol className="space-y-2 list-decimal pl-5 text-sm leading-6 text-foreground">
            {module.elements.map((element) => <li key={element}>{element}</li>)}
          </ol>
        </div>
        <div className="p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-primary mb-3">Evidence & questions</p>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-foreground mb-2">Evidence to look for</p>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {module.evidenceExamples.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground mb-2">Research questions</p>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {module.questions.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border p-6 bg-muted/20">
        <div className="flex items-center gap-2 mb-4">
          <p className="text-xs uppercase tracking-[0.18em] text-primary">Source trail</p>
          <span className="text-xs text-muted-foreground">Verify current text before relying on it.</span>
        </div>
        <div className="space-y-2">
          {module.authorities.map((authority) => (
            <a key={`${authority.citation}-${authority.url}`} href={authority.url} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition-colors">
              <div>
                <p className="text-xs text-primary uppercase tracking-wide">{authority.type}</p>
                <p className="text-sm font-medium text-foreground mt-1">{authority.citation} — {authority.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{authority.jurisdiction} · {authority.note}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function LawModules() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => ["All", ...Array.from(new Set(ALL_LAW_MODULES.map((m) => m.category))).sort()], []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_LAW_MODULES.filter((module) => {
      const categoryMatch = category === "All" || module.category === category;
      const text = [module.category, module.title, module.definition, ...module.authorities.map((a) => `${a.citation} ${a.title}`), ...module.questions].join(" ").toLowerCase();
      return categoryMatch && (!q || text.includes(q));
    });
  }, [query, category]);

  return (
    <Layout>
      <main className="bg-background min-h-screen">
        <section className="bg-[#0D0D0E] text-[#F4F4F0]">
          <div className="container mx-auto px-6 py-8">
            <Link to="/education-library" className="inline-flex items-center gap-2 text-sm text-[#F4F4F0]/65 hover:text-[#F4F4F0]">
              <ArrowLeft className="w-4 h-4" /> Knowledge Center
            </Link>
          </div>
          <div className="container mx-auto px-6 pb-14 pt-8 max-w-6xl">
            <p className="text-xs uppercase tracking-[0.24em] text-[#C5A880] mb-5">Research & authority</p>
            <h1 className="font-serif text-4xl md:text-6xl leading-tight max-w-4xl">Find the authority behind the explanation.</h1>
            <p className="text-lg text-[#F4F4F0]/70 max-w-2xl leading-relaxed mt-5">Use these issue modules to organize legal research. Each module connects a plain-language issue to elements, evidence questions, and source links. It does not determine whether a violation occurred.</p>
          </div>
        </section>

        <div className="container mx-auto px-6 py-12 max-w-6xl">
          <section className="grid md:grid-cols-3 gap-4 mb-10">
            {authorityLevels.map((level) => (
              <div key={level.label} className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-primary mb-2">{level.label}</p>
                <p className="text-sm text-muted-foreground leading-6">{level.description}</p>
              </div>
            ))}
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 md:p-6 mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Search className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Research the issue</p>
                <p className="text-xs text-muted-foreground">Search topics, definitions, questions, or citations.</p>
              </div>
            </div>
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search legal issues, authorities, or research questions…" className="h-12" />
            <div className="flex gap-2 overflow-x-auto pt-4 pb-1">
              {categories.map((item) => (
                <Button key={item} type="button" size="sm" variant={category === item ? "default" : "outline"} onClick={() => setCategory(item)} className="shrink-0">
                  {item}
                </Button>
              ))}
            </div>
          </section>

          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Research library</p>
              <h2 className="font-serif text-3xl text-foreground mt-2">{filtered.length} research module{filtered.length === 1 ? "" : "s"}</h2>
            </div>
            <BookOpen className="w-5 h-5 text-primary" />
          </div>

          <div className="space-y-6">
            {filtered.map((module) => <ModuleCard key={module.id} module={module} />)}
            {filtered.length === 0 && (
              <Card><CardContent className="p-10 text-center">
                <p className="font-serif text-xl text-foreground">No research modules match that search.</p>
                <p className="text-sm text-muted-foreground mt-2">Try a broader topic, authority, or issue term.</p>
              </CardContent></Card>
            )}
          </div>

          <div className="mt-10 rounded-2xl border border-border bg-muted/20 p-6">
            <p className="text-sm text-muted-foreground leading-6">Research sources can change. Confirm the current text, jurisdiction, effective date, and procedural context before relying on an authority. The Knowledge Center is educational information, not legal advice.</p>
          </div>
        </div>
      </main>
      <Disclaimer />
    </Layout>
  );
}
