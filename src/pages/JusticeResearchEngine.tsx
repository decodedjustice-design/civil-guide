import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink, FileSearch, Search, ShieldCheck } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { lawLibraryResources, LAW_LIBRARY_CATEGORIES } from "@/data/lawLibraryResources";

export default function JusticeResearchEngine() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return lawLibraryResources.filter((resource) => {
      const categoryMatch = category === "all" || resource.category === category;
      const text = [
        resource.name,
        resource.description,
        resource.usefulFor,
        resource.category,
      ].join(" ").toLowerCase();
      return categoryMatch && (!q || text.includes(q));
    });
  }, [query, category]);

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/library"><ArrowLeft className="h-4 w-4 mr-2" /> Library</Link>
          </Button>
          <Link to="/education-library" className="text-sm text-muted-foreground hover:text-foreground">
            Educational Library <ArrowRight className="h-4 w-4 inline ml-1" />
          </Link>
        </div>

        <header className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium">
            <FileSearch className="h-4 w-4" /> Decoded Justice · Research
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium">Justice Research Engine</h1>
          <p className="text-muted-foreground">
            A focused starting point for Washington legal research. Search the curated source library,
            identify the type of authority you need, and open the source itself.
          </p>
        </header>

        <Card className="border-primary/15">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Start with the source</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-[1fr_260px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search statutes, court forms, law libraries, public records…"
                className="pl-9"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue placeholder="Source category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All source categories</SelectItem>
                {LAW_LIBRARY_CATEGORIES.map((item) => (
                  <SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-3">
          {[
            ["1", "Define the issue", "Write the question you are trying to answer before collecting authorities."],
            ["2", "Find primary authority", "Start with statutes, rules, court forms, agency rules, or the controlling court materials for the issue."],
            ["3", "Record the source", "Save the title, URL, access date, and the proposition the source actually supports."],
          ].map(([step, title, text]) => (
            <Card key={step}>
              <CardContent className="p-5">
                <Badge variant="outline" className="mb-3">{step}</Badge>
                <h2 className="font-medium">{title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl">Research sources</h2>
            <p className="text-sm text-muted-foreground mt-1">{results.length} source{results.length === 1 ? "" : "s"} match the current filters.</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4" /> Use the linked source to verify current law.
          </div>
        </div>

        <div className="grid gap-4">
          {results.map((resource) => (
            <Card key={resource.id}>
              <CardContent className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-medium text-lg">{resource.name}</h3>
                      <Badge variant="secondary">
                        {LAW_LIBRARY_CATEGORIES.find((item) => item.id === resource.category)?.label ?? resource.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                    <p className="text-sm"><span className="font-medium">Useful for:</span> {resource.usefulFor}</p>
                  </div>
                  <Button variant="outline" asChild className="shrink-0">
                    <a href={resource.url} target="_blank" rel="noreferrer">
                      Open source <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {results.length === 0 && (
          <Card><CardContent className="p-10 text-center text-muted-foreground">No research sources match those filters.</CardContent></Card>
        )}

        <Card className="bg-secondary/30">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Research quality standard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Decoded Justice should distinguish source text from interpretation, identify the jurisdiction and date, and avoid presenting a secondary summary as if it were the controlling authority.</p>
            <p>When a source changes, preserve the access date and re-check any conclusion that depends on the changed language.</p>
            <p>Research results are informational and do not determine whether a claim is legally valid or what a court will decide.</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Need plain-language background first?</p>
                <p className="text-sm text-muted-foreground">Use the Education Library before moving into source-level research.</p>
              </div>
            </div>
            <Button asChild><Link to="/education-library">Open Education Library <ArrowRight className="h-4 w-4 ml-2" /></Link></Button>
          </CardContent>
        </Card>

        <Disclaimer variant="prominent" />
      </div>
    </Layout>
  );
}
