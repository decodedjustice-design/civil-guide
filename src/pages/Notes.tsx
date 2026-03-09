import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Plus, Trash2, Edit2, Save, X, ArrowLeft } from "lucide-react";
import { emptyStateNoEntries } from "@/assets/index";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { NextStepBanner } from "@/components/shared/NextStepBanner";
import { EducationalNotice } from "@/components/shared/EducationalNotice";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Note {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
  updated_at: string;
}

export default function Notes() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth?redirect=/notes");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Could not load notes", variant: "destructive" });
    } else {
      setNotes(data || []);
    }
    setIsLoading(false);
  };

  const createNote = async () => {
    if (!newTitle.trim()) return;
    
    const { error } = await supabase.from("notes").insert({
      user_id: user!.id,
      title: newTitle,
      content: newContent,
    });

    if (error) {
      toast({ title: "Error", description: "Could not create note", variant: "destructive" });
    } else {
      setNewTitle("");
      setNewContent("");
      setIsCreating(false);
      fetchNotes();
    }
  };

  const updateNote = async (id: string) => {
    const { error } = await supabase
      .from("notes")
      .update({ title: editTitle, content: editContent })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Could not update note", variant: "destructive" });
    } else {
      setEditingId(null);
      fetchNotes();
    }
  };

  const deleteNote = async (id: string) => {
    const { error } = await supabase.from("notes").delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Could not delete note", variant: "destructive" });
    } else {
      fetchNotes();
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
      <div className="container py-12 lg:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link to="/self-help" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Self-Help Tools
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Notes</h1>
                <p className="text-muted-foreground">
                  Keep detailed notes about conversations, observations, and important details.
                </p>
              </div>
              <Button variant="hero" onClick={() => setIsCreating(true)}>
                <Plus className="w-4 h-4" />
                New Note
              </Button>
            </div>
          </div>

          {/* Wellbeing Note */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border mb-8">
            <p className="text-sm text-muted-foreground text-center">
              <strong className="text-foreground">Take your time.</strong> You can save your work and return later. There's no rush.
            </p>
          </div>

          {/* Create Note Form */}
          {isCreating && (
            <div className="p-6 rounded-2xl bg-card border border-border mb-6 animate-fade-up">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Note title..."
                className="w-full text-lg font-medium bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus:outline-none mb-4"
              />
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Write your notes here..."
                rows={6}
                className="w-full bg-background border border-border rounded-xl p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <div className="flex justify-end gap-3 mt-4">
                <Button variant="ghost" onClick={() => { setIsCreating(false); setNewTitle(""); setNewContent(""); }}>
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
                <Button variant="hero" onClick={createNote} disabled={!newTitle.trim()}>
                  <Save className="w-4 h-4" />
                  Save Note
                </Button>
              </div>
            </div>
          )}

          {/* Notes List */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading notes...</p>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-12 p-6 rounded-2xl bg-card border border-border overflow-hidden">
              <img
                src={emptyStateNoEntries}
                alt=""
                className="w-full h-40 object-cover rounded-xl mb-6 opacity-80"
              />
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No notes yet</h3>
              <p className="text-muted-foreground mb-4">Create your first note to get started.</p>
              <Button variant="hero" onClick={() => setIsCreating(true)}>
                <Plus className="w-4 h-4" />
                Create Note
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => (
                <div key={note.id} className="p-6 rounded-2xl bg-card border border-border">
                  {editingId === note.id ? (
                    <>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full text-lg font-medium bg-transparent border-0 text-foreground focus:outline-none mb-4"
                      />
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={6}
                        className="w-full bg-background border border-border rounded-xl p-4 text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      <div className="flex justify-end gap-3 mt-4">
                        <Button variant="ghost" onClick={() => setEditingId(null)}>
                          <X className="w-4 h-4" />
                          Cancel
                        </Button>
                        <Button variant="hero" onClick={() => updateNote(note.id)}>
                          <Save className="w-4 h-4" />
                          Save
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-foreground mb-2">{note.title}</h3>
                          {note.content && (
                            <p className="text-muted-foreground whitespace-pre-wrap">{note.content}</p>
                          )}
                          <p className="text-xs text-text-softer mt-4">
                            Last updated: {new Date(note.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingId(note.id);
                              setEditTitle(note.title);
                              setEditContent(note.content || "");
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNote(note.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Cross-tool navigation */}
          <NextStepBanner
            heading="Where to go next"
            steps={[
              { label: "Analyze your situation", description: "Understand which systems and rights are involved.", href: "/analyzer" },
              { label: "Upload evidence", description: "Store documents and files securely in your vault.", href: "/evidence-vault" },
            ]}
          />

          {/* Disclaimer */}
          <div className="mt-8 pt-8 border-t border-border">
            <Disclaimer className="justify-center" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
