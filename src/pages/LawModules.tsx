import { useMemo, useState } from "react";
import { BookOpen, ExternalLink, Search, Scale } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LAW_MODULES, type LawModule } from "@/lib/law/issueLibrary";
import { POLICE_LAW_MODULES } from "@/lib/law/policeIssueModules";

const ALL_LAW_MODULES: LawModule[] = [...LAW_MODULES, ...POLICE_LAW_MODULES];

function ModuleCard({ module }: { module: LawModule }) {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge variant="outline" className="mb-2">{module.category}</Badge>
            <CardTitle className="font-serif text-xl">{module.title}</CardTitle>
          </div>
          <Scale className="h-5 w-5 text-primary shrink-0" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">Legal definition</h3>
          <p className="text-sm leading-6">{module.definition}</p>
        </section>
        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">Elements to examine</h3>
          <ol className="space-y-2 list-decimal pl-5 text-sm leading-6">
            {module.elements.map((element) => <li key={element}>{element}</li>)}
          </ol>
        </section>
        <div className="grid md:grid-cols-2 gap-5">
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">Evidence to look for</h3>
            <ul className="space-y-1.5 text-sm">{module.evidenceExamples.map((item) => <li key={item}>• {item}</li>)}</ul>
          </section>
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">Questions to ask</h3>
            <ul className="space-y-1.5 text-sm">{module.questions.map((item) => <li key={item}>• {item}</li>)}</ul>
          </section>
        </div>
        <section className="pt-4 border-t border-border">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">Primary authorities</h3>
          <div className="space-y-3">
            {module.authorities.map((authority) => (
              <a key={`${authority.citation}-${authority.url}`} href={authority.url} target="_blank" rel="noreferrer" className="block rounded-lg border border-border p-3 hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-sm">{authority.citation} — {authority.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{authority.jurisdiction} · {authority.type}</p>
                    <p className="text-xs text-muted-foreground mt-2 leading-5">{authority.note}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                </div>
              </a>
            ))}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}

export default function LawModules() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_LAW_MODULES;
    return ALL_LAW_MODULES.filter((module) => [module.category, module.title, module.definition, ...module.authorities.map((a) => `${a.citation} ${a.title}`)].join(" ").toLowerCase().includes(q));
  }, [query]);

  return (
    <DashboardLayout pageTitle="Law Modules">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="max-w-3xl">
          <div className="flex items-center gap-2 text-primary text-sm font-medium mb-2"><BookOpen className="h-4 w-4" /> Washington-focused issue library</div>
          <h1 className="font-serif text-3xl md:text-4xl text-foreground">Law Modules</h1>
          <p className="mt-3 text-muted-foreground leading-7">Plain-language legal issue modules showing the definition, elements to examine, evidence questions, and links to primary legal authorities. These modules help organize research; they do not decide whether a violation occurred.</p>
        </header>

        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search issue categories, authorities, or topics…" className="pl-9" />
        </div>

        <div className="space-y-6">
          {filtered.map((module) => <ModuleCard key={module.id} module={module} />)}
          {filtered.length === 0 && <Card><CardContent className="p-8 text-center text-muted-foreground">No law modules match that search.</CardContent></Card>}
        </div>

        <Card className="bg-muted/30 border-border">
          <CardContent className="p-6">
            <h2 className="font-serif text-xl mb-2">How to add a new module</h2>
            <p className="text-sm text-muted-foreground leading-6">Add a typed entry to <code className="text-xs">src/lib/law/issueLibrary.ts</code> for general modules or a dedicated file such as <code className="text-xs">src/lib/law/policeIssueModules.ts</code> for a focused module family. Give it a stable id, category, analyzer mappings, plain-language definition, elements, evidence examples, research questions, and at least one verified primary authority URL. Then import the module family into the analyzer and Law Modules index. Do not use placeholder citations.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
