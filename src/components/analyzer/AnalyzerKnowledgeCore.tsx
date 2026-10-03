import { useEffect, useState } from "react";
import { ExternalLink, FileCheck2, Scale } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type KnowledgeIssue = { id: string; issue_code: string; issue_name: string; description: string | null; analyzer_issue_id: string | null };
type KnowledgeElement = { id: string; issue_id: string; element_name: string; element_description: string | null; required: boolean; sequence_no: number };
type KnowledgeSource = { id: string; title: string; citation: string; official_url: string | null; source_type: string; binding_status: string; precedential_status: string | null };
type KnowledgeProposition = { id: string; source_id: string; proposition: string; proposition_type: string; confidence_status: string };
type KnowledgeAuthority = { issue_id: string; source_id: string; proposition_id: string | null; relationship: string; priority: number };

interface Props { issueIds: string[]; }

export function AnalyzerKnowledgeCore({ issueIds }: Props) {
  const [issues, setIssues] = useState<KnowledgeIssue[]>([]);
  const [elements, setElements] = useState<KnowledgeElement[]>([]);
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [propositions, setPropositions] = useState<KnowledgeProposition[]>([]);
  const [authorities, setAuthorities] = useState<KnowledgeAuthority[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const ids = Array.from(new Set(issueIds)).filter(Boolean);
      if (!ids.length) {
        setIssues([]); setElements([]); setSources([]); setPropositions([]); setAuthorities([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data: issueData, error: issueError } = await supabase
          .from("legal_issues")
          .select("id, issue_code, issue_name, description, analyzer_issue_id")
          .in("analyzer_issue_id", ids)
          .eq("is_published", true);

        if (issueError) throw issueError;

        const legalIssueIds = (issueData ?? []).map((issue) => issue.id);
        if (!legalIssueIds.length) {
          if (!cancelled) {
            setIssues([]); setElements([]); setSources([]); setPropositions([]); setAuthorities([]);
          }
          return;
        }

        const [elementResult, authorityResult] = await Promise.all([
          supabase.from("issue_elements")
            .select("id, issue_id, element_name, element_description, required, sequence_no")
            .in("issue_id", legalIssueIds)
            .order("sequence_no", { ascending: true }),
          supabase.from("issue_authorities")
            .select("issue_id, source_id, proposition_id, relationship, priority")
            .in("issue_id", legalIssueIds)
            .order("priority", { ascending: true }),
        ]);

        if (elementResult.error) throw elementResult.error;
        if (authorityResult.error) throw authorityResult.error;

        const authorityRows = (authorityResult.data ?? []) as KnowledgeAuthority[];
        const sourceIds = Array.from(new Set(authorityRows.map((row) => row.source_id)));
        const propositionIds = Array.from(new Set(authorityRows.map((row) => row.proposition_id).filter(Boolean) as string[]));

        const [sourceResult, propositionResult] = await Promise.all([
          sourceIds.length
            ? supabase.from("legal_sources")
                .select("id, title, citation, official_url, source_type, binding_status, precedential_status")
                .in("id", sourceIds).eq("is_published", true)
            : Promise.resolve({ data: [], error: null }),
          propositionIds.length
            ? supabase.from("legal_propositions")
                .select("id, source_id, proposition, proposition_type, confidence_status")
                .in("id", propositionIds).eq("is_published", true).eq("review_status", "verified")
            : Promise.resolve({ data: [], error: null }),
        ]);

        if (sourceResult.error) throw sourceResult.error;
        if (propositionResult.error) throw propositionResult.error;

        if (!cancelled) {
          setIssues((issueData ?? []) as KnowledgeIssue[]);
          setElements((elementResult.data ?? []) as KnowledgeElement[]);
          setAuthorities(authorityRows);
          setSources((sourceResult.data ?? []) as KnowledgeSource[]);
          setPropositions((propositionResult.data ?? []) as KnowledgeProposition[]);
        }
      } catch (err) {
        console.error("Unable to load Analyzer Knowledge Core", err);
        if (!cancelled) setError("The verified knowledge layer could not be loaded right now.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => { cancelled = true; };
  }, [issueIds]);

  if (!loading && !error && !issues.length) return null;

  const sourceById = new Map(sources.map((source) => [source.id, source]));
  const propositionById = new Map(propositions.map((proposition) => [proposition.id, proposition]));
  const elementsByIssue = new Map<string, KnowledgeElement[]>();

  for (const element of elements) {
    const current = elementsByIssue.get(element.issue_id) ?? [];
    current.push(element);
    elementsByIssue.set(element.issue_id, current);
  }

  return (
    <section className="scroll-mt-6 border-b border-border bg-background px-5 py-8 sm:px-8 sm:py-10" aria-labelledby="analyzer-knowledge-core">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <FileCheck2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Verified knowledge core</p>
          <h3 id="analyzer-knowledge-core" className="mt-1 font-serif text-2xl text-foreground sm:text-3xl">Authority-backed issue library</h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
            These issue records are connected to Decoded Justice's structured legal knowledge base. Published propositions are marked as verified and are kept separate from user-reported facts.
          </p>
        </div>
      </div>

      {loading && <div className="mt-6 rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">Loading verified authorities…</div>}
      {error && <div className="mt-6 rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">{error}</div>}

      <div className="mt-6 space-y-5">
        {issues.map((issue) => {
          const issueAuthorities = authorities.filter((authority) => authority.issue_id === issue.id);
          const issueElements = (elementsByIssue.get(issue.id) ?? []).sort((a, b) => a.sequence_no - b.sequence_no);

          return (
            <article key={issue.id} className="rounded-2xl border border-border bg-card p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <Scale className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-lg font-semibold text-foreground">{issue.issue_name}</h4>
                    <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{issue.issue_code}</span>
                  </div>
                  {issue.description && <p className="mt-2 text-sm leading-6 text-muted-foreground">{issue.description}</p>}
                </div>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">Elements to examine</p>
                  <ul className="mt-3 space-y-2">
                    {issueElements.map((element) => (
                      <li key={element.id} className="flex gap-2 text-sm leading-6 text-foreground/85">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span><span className="font-medium">{element.element_name}</span>{element.element_description ? " — " + element.element_description : ""}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">Verified authorities</p>
                  <div className="mt-3 space-y-3">
                    {issueAuthorities.map((authority) => {
                      const source = sourceById.get(authority.source_id);
                      const proposition = authority.proposition_id ? propositionById.get(authority.proposition_id) : undefined;
                      if (!source) return null;

                      return (
                        <div key={authority.source_id + (authority.proposition_id ?? "")} className="rounded-xl border border-border bg-background p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-foreground">{source.citation}</p>
                              <p className="mt-1 text-xs text-muted-foreground">{source.title}</p>
                            </div>
                            {source.official_url && (
                              <a href={source.official_url} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary hover:underline">
                                Primary source <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            )}
                          </div>

                          <div className="mt-2 flex flex-wrap gap-2 text-[10px] uppercase tracking-wide text-muted-foreground">
                            <span>{source.binding_status}</span>
                            {source.precedential_status && <span>· {source.precedential_status}</span>}
                            <span>· {source.source_type}</span>
                          </div>

                          {proposition && (
                            <p className="mt-3 border-t border-border pt-3 text-xs leading-5 text-foreground/80">
                              <span className="font-semibold">Structured proposition:</span> {proposition.proposition}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
