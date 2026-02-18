import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PenLine, Clock, ChevronRight, Shield, FileText, HelpCircle, Save } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ClarionEntry {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

type ClarionView = "write" | "timeline";

export default function Clarion() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [view, setView] = useState<ClarionView>("write");
  const [content, setContent] = useState("");
  const [entries, setEntries] = useState<ClarionEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [entryCounts, setEntryCounts] = useState({ entries: 0, evidence: 0 });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth?redirect=/clarion", { replace: true });
    }
  }, [user, loading, navigate]);

  // Fetch entries on mount
  useEffect(() => {
    if (!user) return;
    fetchEntries();
    fetchCounts();
  }, [user]);

  const fetchEntries = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("clarion_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setEntries(data as ClarionEntry[]);
    }
  };

  const fetchCounts = async () => {
    if (!user) return;
    const [entriesRes, evidenceRes] = await Promise.all([
      supabase.from("clarion_entries").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("evidence").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    ]);
    setEntryCounts({
      entries: entriesRes.count || 0,
      evidence: evidenceRes.count || 0,
    });
  };

  const handleSave = useCallback(async () => {
    if (!user || !content.trim()) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("clarion_entries")
        .insert({ user_id: user.id, content: content.trim() });

      if (error) throw error;

      setContent("");
      setJustSaved(true);
      await fetchEntries();
      await fetchCounts();

      toast({
        title: "Entry saved",
        description: "Your words have been preserved.",
      });
    } catch {
      toast({
        title: "Could not save",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [user, content, toast]);

  const handleUpdateEntry = async (id: string) => {
    if (!editContent.trim()) return;

    const { error } = await supabase
      .from("clarion_entries")
      .update({ content: editContent.trim() })
      .eq("id", id);

    if (!error) {
      setEditingId(null);
      setEditContent("");
      await fetchEntries();
    }
  };

  const handleDeleteEntry = async (id: string) => {
    const { error } = await supabase
      .from("clarion_entries")
      .delete()
      .eq("id", id);

    if (!error) {
      await fetchEntries();
      await fetchCounts();
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (loading || !user) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <section className="bg-espresso py-14 sm:py-18">
        <div className="container max-w-3xl px-6">
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-white/95 mb-3 animate-fade-up">
            Clarion
          </h1>
          <p className="text-base text-white/50 font-light tracking-wide animate-fade-up" style={{ animationDelay: "0.1s", opacity: 0 }}>
            A private space to write what happened — in your own words, at your own pace.
          </p>
        </div>
      </section>

      <div className="bg-cream min-h-[60vh]">
        <div className="container max-w-3xl px-6 py-10">

          {/* Sidebar-style counts for return visits */}
          {entryCounts.entries > 0 && view === "write" && (
            <div className="flex items-center gap-6 mb-8 text-sm text-muted-foreground animate-fade-in">
              <button
                onClick={() => setView("timeline")}
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Clock className="w-4 h-4" />
                {entryCounts.entries} {entryCounts.entries === 1 ? "entry" : "entries"}
              </button>
              {entryCounts.evidence > 0 && (
                <Link to="/evidence-vault" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <FileText className="w-4 h-4" />
                  {entryCounts.evidence} evidence items
                </Link>
              )}
            </div>
          )}

          {/* WRITING VIEW */}
          {view === "write" && !justSaved && (
            <div className="animate-fade-up">
              <p className="text-lg text-foreground font-light leading-relaxed mb-8">
                You can write freely here. Whatever feels important. We'll help organize it later.
              </p>

              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing…"
                className="min-h-[280px] bg-card border-border/50 text-base leading-relaxed font-light resize-y focus:border-gold/30 transition-colors"
              />

              <div className="flex items-center justify-between mt-6">
                <Button
                  onClick={handleSave}
                  disabled={!content.trim() || isSaving}
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Saving…" : "Save Entry"}
                </Button>

                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  Private and secure. Only you can see this.
                </p>
              </div>
            </div>
          )}

          {/* JUST SAVED CONFIRMATION */}
          {view === "write" && justSaved && (
            <div className="animate-fade-up text-center py-12">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                <PenLine className="w-5 h-5 text-gold opacity-70" />
              </div>

              <h2 className="font-serif text-2xl font-medium text-foreground mb-4">
                Here's one way to view your story.
              </h2>
              <p className="text-muted-foreground font-light mb-10 max-w-md mx-auto">
                We've arranged what you shared into a timeline.
                You can adjust anything — nothing is fixed.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  onClick={() => { setView("timeline"); setJustSaved(false); }}
                  variant="default"
                  className="gap-2"
                >
                  <Clock className="w-4 h-4" />
                  View Timeline Draft
                </Button>
                <Button
                  onClick={() => setJustSaved(false)}
                  variant="outline"
                  className="gap-2"
                >
                  <PenLine className="w-4 h-4" />
                  Continue Writing
                </Button>
              </div>
            </div>
          )}

          {/* TIMELINE VIEW */}
          {view === "timeline" && (
            <div className="animate-fade-up">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-2xl font-medium text-foreground">
                  Your Story, In Order
                </h2>
                <Button
                  onClick={() => setView("write")}
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-muted-foreground"
                >
                  <PenLine className="w-4 h-4" />
                  Write More
                </Button>
              </div>

              {entries.length === 0 ? (
                <p className="text-muted-foreground font-light text-center py-12">
                  No entries yet. Start writing to build your timeline.
                </p>
              ) : (
                <div className="space-y-4">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-card border border-border/50 rounded-lg p-6 hover:border-gold/20 transition-colors group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-xs text-muted-foreground tracking-wide">
                          {formatDate(entry.created_at)}
                        </span>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => { setEditingId(entry.id); setEditContent(entry.content); }}
                            className="text-xs text-muted-foreground hover:text-primary transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      {editingId === entry.id ? (
                        <div>
                          <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="min-h-[100px] text-sm bg-background border-border/50 mb-3"
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleUpdateEntry(entry.id)}>
                              Save
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-foreground font-light leading-relaxed whitespace-pre-wrap">
                          {entry.content}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Soft links section */}
              {entries.length > 0 && (
                <div className="mt-12 pt-8 border-t border-border/30">
                  <p className="text-sm text-muted-foreground font-light mb-4">
                    You may also want to organize:
                  </p>
                  <div className="space-y-2">
                    <Link
                      to="/evidence-vault"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                      Documents mentioned
                    </Link>
                    <Link
                      to="/analyzer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                      Agencies involved
                    </Link>
                    <Link
                      to="/notes"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                      Questions you still have
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Wellbeing note */}
          <div className="mt-12 pt-6 border-t border-border/20">
            <p className="text-xs text-muted-foreground/70 text-center font-light flex items-center justify-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              You can pause anytime and return later. There is no deadline here.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
