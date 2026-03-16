import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-paperwork.png";
import { emptyStateNoTimeline } from "@/assets/index";
import { Clock, Plus, Trash2, Edit2, Save, X, ArrowLeft, Calendar, FolderOpen, FileText, File, Image, Paperclip, ChevronDown, ChevronUp } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { NextStepBanner } from "@/components/shared/NextStepBanner";
import { EducationalNotice } from "@/components/shared/EducationalNotice";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TimelineEntry {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  created_at: string;
}

interface Evidence {
  id: string;
  title: string;
  description: string | null;
  file_type: string | null;
  document_date: string | null;
  source: string | null;
  system_involved: string | null;
}

/** Returns the icon component for a given evidence file_type */
function EvidenceIcon({ type }: { type: string | null }) {
  if (type === "image") return <Image className="w-3.5 h-3.5 shrink-0" />;
  if (type === "document") return <FileText className="w-3.5 h-3.5 shrink-0" />;
  return <File className="w-3.5 h-3.5 shrink-0" />;
}

/**
 * Match evidence to a timeline entry using two heuristics (no FK required):
 *  1. document_date matches event_date exactly
 *  2. document_date is within ±3 days of event_date (nearby evidence)
 *
 * Returns { exact, nearby } arrays.
 */
function matchEvidence(entry: TimelineEntry, allEvidence: Evidence[]) {
  const eventMs = new Date(entry.event_date).getTime();
  const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;

  const exact: Evidence[] = [];
  const nearby: Evidence[] = [];

  for (const ev of allEvidence) {
    if (!ev.document_date) continue;
    const evMs = new Date(ev.document_date).getTime();
    const diff = Math.abs(evMs - eventMs);
    if (diff === 0) {
      exact.push(ev);
    } else if (diff <= THREE_DAYS) {
      nearby.push(ev);
    }
  }

  return { exact, nearby };
}

export default function Timeline() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDate, setNewDate] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDate, setEditDate] = useState("");
  // Track which event cards have the evidence panel expanded
  const [expandedEvidence, setExpandedEvidence] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth?redirect=/timeline");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchAll();
    }
  }, [user]);

  const fetchAll = async () => {
    setIsLoading(true);
    const [entriesRes, evidenceRes] = await Promise.all([
      supabase.from("timeline_entries").select("*").order("event_date", { ascending: true }),
      supabase
        .from("evidence")
        .select("id, title, description, file_type, document_date, source, system_involved")
        .order("document_date", { ascending: true }),
    ]);

    if (entriesRes.error) {
      toast({ title: "Error", description: "Could not load timeline", variant: "destructive" });
    } else {
      setEntries(entriesRes.data || []);
    }

    if (!evidenceRes.error) {
      setEvidence(evidenceRes.data || []);
    }

    setIsLoading(false);
  };

  // Pre-compute evidence matches for every entry (memoised so it only recalculates when data changes)
  const evidenceByEntry = useMemo(() => {
    const map = new Map<string, { exact: Evidence[]; nearby: Evidence[] }>();
    for (const entry of entries) {
      map.set(entry.id, matchEvidence(entry, evidence));
    }
    return map;
  }, [entries, evidence]);

  // Total evidence items that have at least one match (for the summary banner)
  const linkedCount = useMemo(() => {
    let count = 0;
    for (const { exact, nearby } of evidenceByEntry.values()) {
      count += exact.length + nearby.length;
    }
    return count;
  }, [evidenceByEntry]);

  const createEntry = async () => {
    if (!newTitle.trim() || !newDate) return;

    const { error } = await supabase.from("timeline_entries").insert({
      user_id: user!.id,
      title: newTitle,
      description: newDescription,
      event_date: newDate,
    });

    if (error) {
      toast({ title: "Error", description: "Could not add entry", variant: "destructive" });
    } else {
      setNewTitle("");
      setNewDescription("");
      setNewDate("");
      setIsCreating(false);
      fetchAll();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && newTitle.trim() && newDate) {
      e.preventDefault();
      createEntry();
    }
  };

  const updateEntry = async (id: string) => {
    const { error } = await supabase
      .from("timeline_entries")
      .update({ title: editTitle, description: editDescription, event_date: editDate })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Could not update entry", variant: "destructive" });
    } else {
      setEditingId(null);
      fetchAll();
    }
  };

  const deleteEntry = async (id: string) => {
    const { error } = await supabase.from("timeline_entries").delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Could not delete entry", variant: "destructive" });
    } else {
      fetchAll();
    }
  };

  const toggleEvidence = (id: string) => {
    setExpandedEvidence((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (loading || (!user && !loading)) {
    return null;
  }

  return (
    <Layout>
      <div className="container max-w-5xl mx-auto px-4 pt-6">
        <EducationalNotice />
      </div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-background/30" />
        </div>

        <div className="container relative py-12 lg:py-16">
          <div className="text-center lg:text-left">
            <Link
              to="/self-help"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Self-Help Tools
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Timeline Creator</h1>
            <p className="text-muted-foreground max-w-xl">
              Build a chronological record of events to help you and professionals understand what happened.
            </p>
          </div>
        </div>
      </section>

      <div className="container py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">

          {/* Wellbeing Note */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border mb-8">
            <p className="text-sm text-muted-foreground text-center">
              <strong className="text-foreground">Go at your own pace.</strong> Reconstructing events can bring up difficult memories. Take breaks when needed.
            </p>
          </div>

          {/* Evidence link summary banner — only shown when there are matches */}
          {!isLoading && linkedCount > 0 && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20 mb-6">
              <Paperclip className="w-4 h-4 text-primary shrink-0" />
              <p className="text-sm text-foreground">
                <strong>{linkedCount} evidence item{linkedCount !== 1 ? "s" : ""}</strong> from your Evidence Vault match dates on this timeline.
                Expand any event to see them.
              </p>
              <Link
                to="/evidence-vault"
                className="ml-auto text-xs text-primary hover:underline shrink-0"
              >
                Go to Evidence Vault →
              </Link>
            </div>
          )}

          {/* Add Event Button (when not creating) */}
          {!isCreating && (
            <div className="mb-6">
              <Button variant="hero" onClick={() => setIsCreating(true)}>
                <Plus className="w-4 h-4" />
                Add Event
              </Button>
            </div>
          )}

          {/* Create Entry Form */}
          {isCreating && (
            <div className="p-6 rounded-2xl bg-card border border-border mb-6 animate-fade-up">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What happened? (brief title)..."
                className="w-full text-lg font-medium bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus:outline-none mb-4"
              />
              <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Describe what happened in more detail..."
                rows={4}
                className="w-full bg-background border border-border rounded-xl p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <p className="text-xs text-muted-foreground mt-2 mb-4">
                Press Enter to save quickly, or use the buttons below.
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsCreating(false);
                    setNewTitle("");
                    setNewDescription("");
                    setNewDate("");
                  }}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
                <Button variant="hero" onClick={createEntry} disabled={!newTitle.trim() || !newDate}>
                  <Save className="w-4 h-4" />
                  Save Event
                </Button>
              </div>
            </div>
          )}

          {/* Timeline */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading timeline...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-12 p-6 rounded-2xl bg-card border border-border overflow-hidden">
              <img
                src={emptyStateNoTimeline}
                alt=""
                className="w-full h-40 object-cover rounded-xl mb-6 opacity-80"
              />
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No timeline entries yet</h3>
              <p className="text-muted-foreground mb-4">Start building your timeline by adding events.</p>
              <Button variant="hero" onClick={() => setIsCreating(true)}>
                <Plus className="w-4 h-4" />
                Add First Event
              </Button>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

              <div className="space-y-6">
                {entries.map((entry) => {
                  const matches = evidenceByEntry.get(entry.id) ?? { exact: [], nearby: [] };
                  const totalMatches = matches.exact.length + matches.nearby.length;
                  const isExpanded = expandedEvidence.has(entry.id);

                  return (
                    <div key={entry.id} className="relative pl-16">
                      {/* Timeline dot — highlighted when evidence is linked */}
                      <div
                        className={`absolute left-4 top-6 w-4 h-4 rounded-full border-4 border-background ${
                          totalMatches > 0 ? "bg-primary ring-2 ring-primary/30" : "bg-primary"
                        }`}
                      />

                      <div className="p-6 rounded-2xl bg-card border border-border">
                        {editingId === entry.id ? (
                          <>
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full text-lg font-medium bg-transparent border-0 text-foreground focus:outline-none mb-4"
                            />
                            <input
                              type="date"
                              value={editDate}
                              onChange={(e) => setEditDate(e.target.value)}
                              className="h-12 px-4 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 mb-4"
                            />
                            <textarea
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              rows={4}
                              className="w-full bg-background border border-border rounded-xl p-4 text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                            <div className="flex justify-end gap-3 mt-4">
                              <Button variant="ghost" onClick={() => setEditingId(null)}>
                                <X className="w-4 h-4" />
                                Cancel
                              </Button>
                              <Button variant="hero" onClick={() => updateEntry(entry.id)}>
                                <Save className="w-4 h-4" />
                                Save
                              </Button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <p className="text-sm text-primary font-medium mb-1">
                                  {new Date(entry.event_date).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </p>
                                <h3 className="text-lg font-medium text-foreground mb-2">{entry.title}</h3>
                                {entry.description && (
                                  <p className="text-muted-foreground whitespace-pre-wrap">{entry.description}</p>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingId(entry.id);
                                    setEditTitle(entry.title);
                                    setEditDescription(entry.description || "");
                                    setEditDate(entry.event_date);
                                  }}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteEntry(entry.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Evidence panel toggle */}
                            {totalMatches > 0 && (
                              <div className="mt-4 border-t border-border pt-4">
                                <button
                                  onClick={() => toggleEvidence(entry.id)}
                                  className="flex items-center gap-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                                >
                                  <Paperclip className="w-3.5 h-3.5" />
                                  {totalMatches} evidence item{totalMatches !== 1 ? "s" : ""} linked by date
                                  {isExpanded ? (
                                    <ChevronUp className="w-3.5 h-3.5 ml-1" />
                                  ) : (
                                    <ChevronDown className="w-3.5 h-3.5 ml-1" />
                                  )}
                                </button>

                                {isExpanded && (
                                  <div className="mt-3 space-y-2">
                                    {/* Exact date matches */}
                                    {matches.exact.length > 0 && (
                                      <>
                                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">
                                          Same date
                                        </p>
                                        {matches.exact.map((ev) => (
                                          <div
                                            key={ev.id}
                                            className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/15"
                                          >
                                            <EvidenceIcon type={ev.file_type} />
                                            <div className="flex-1 min-w-0">
                                              <p className="text-sm font-medium text-foreground truncate">{ev.title}</p>
                                              {ev.description && (
                                                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                                  {ev.description}
                                                </p>
                                              )}
                                              {ev.source && (
                                                <p className="text-xs text-muted-foreground/70 mt-0.5">
                                                  Source: {ev.source}
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                      </>
                                    )}

                                    {/* Nearby date matches */}
                                    {matches.nearby.length > 0 && (
                                      <>
                                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mt-2">
                                          Within 3 days
                                        </p>
                                        {matches.nearby.map((ev) => (
                                          <div
                                            key={ev.id}
                                            className="flex items-start gap-2 p-3 rounded-lg bg-muted/40 border border-border"
                                          >
                                            <EvidenceIcon type={ev.file_type} />
                                            <div className="flex-1 min-w-0">
                                              <p className="text-sm font-medium text-foreground truncate">{ev.title}</p>
                                              {ev.document_date && (
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                  Evidence date:{" "}
                                                  {new Date(ev.document_date).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                  })}
                                                </p>
                                              )}
                                              {ev.description && (
                                                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                                  {ev.description}
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                      </>
                                    )}

                                    <Link
                                      to="/evidence-vault"
                                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                                    >
                                      <FolderOpen className="w-3 h-3" />
                                      Manage in Evidence Vault
                                    </Link>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Prompt to add evidence if none linked */}
                            {totalMatches === 0 && evidence.length > 0 && (
                              <div className="mt-4 border-t border-border pt-3">
                                <Link
                                  to="/evidence-vault"
                                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                                >
                                  <Paperclip className="w-3 h-3" />
                                  Add evidence for this date in Evidence Vault
                                </Link>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cross-tool navigation */}
          <NextStepBanner
            heading="Next in your journey"
            steps={[
              {
                label: "Store your evidence",
                description: "Upload documents, photos, and files that support your timeline.",
                href: "/evidence-vault",
              },
              {
                label: "Analyze your situation",
                description: "Identify which systems and rights are involved.",
                href: "/analyzer",
              },
            ]}
          />

          {/* Disclaimer */}
          <div className="mt-12 pt-8 border-t border-border">
            <Disclaimer className="justify-center" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
