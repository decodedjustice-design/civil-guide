import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-paperwork.png";
import { Clock, Plus, Trash2, Edit2, Save, X, ArrowLeft, Calendar, FolderOpen, FileText } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";
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

export default function Timeline() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDate, setNewDate] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDate, setEditDate] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth?redirect=/timeline");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from("timeline_entries")
      .select("*")
      .order("event_date", { ascending: true });

    if (error) {
      toast({ title: "Error", description: "Could not load timeline", variant: "destructive" });
    } else {
      setEntries(data || []);
    }
    setIsLoading(false);
  };

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
      fetchEntries();
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
      fetchEntries();
    }
  };

  const deleteEntry = async (id: string) => {
    const { error } = await supabase.from("timeline_entries").delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Could not delete entry", variant: "destructive" });
    } else {
      fetchEntries();
    }
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
            <Link to="/self-help" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
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
                <Button variant="ghost" onClick={() => { setIsCreating(false); setNewTitle(""); setNewDescription(""); setNewDate(""); }}>
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
            <div className="text-center py-12 p-6 rounded-2xl bg-card border border-border">
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
                {entries.map((entry) => (
                  <div key={entry.id} className="relative pl-16">
                    {/* Timeline dot */}
                    <div className="absolute left-4 top-6 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                    
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
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Tools */}
          <div className="mt-12 p-6 rounded-xl bg-card border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-4">Related Tools</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <Link to="/evidence-vault" className="flex items-center gap-2 text-primary hover:underline">
                <FolderOpen className="w-4 h-4" />
                Evidence Vault — Store documents and files
              </Link>
              <Link to="/notes" className="flex items-center gap-2 text-primary hover:underline">
                <FileText className="w-4 h-4" />
                Notes — Record details and observations
              </Link>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-12 pt-8 border-t border-border">
            <Disclaimer className="justify-center" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
