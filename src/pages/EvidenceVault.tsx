import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FolderOpen, Plus, Trash2, Edit2, Save, X, ArrowLeft, File, Image, FileText as FileTextIcon } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Evidence {
  id: string;
  title: string;
  description: string | null;
  file_type: string | null;
  created_at: string;
}

export default function EvidenceVault() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newFileType, setNewFileType] = useState("document");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth?redirect=/evidence-vault");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchEvidence();
    }
  }, [user]);

  const fetchEvidence = async () => {
    const { data, error } = await supabase
      .from("evidence")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Could not load evidence", variant: "destructive" });
    } else {
      setEvidence(data || []);
    }
    setIsLoading(false);
  };

  const createEvidence = async () => {
    if (!newTitle.trim()) return;

    const { error } = await supabase.from("evidence").insert({
      user_id: user!.id,
      title: newTitle,
      description: newDescription,
      file_type: newFileType,
    });

    if (error) {
      toast({ title: "Error", description: "Could not add evidence", variant: "destructive" });
    } else {
      setNewTitle("");
      setNewDescription("");
      setIsCreating(false);
      fetchEvidence();
    }
  };

  const deleteEvidence = async (id: string) => {
    const { error } = await supabase.from("evidence").delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Could not delete evidence", variant: "destructive" });
    } else {
      fetchEvidence();
    }
  };

  const getIcon = (type: string | null) => {
    switch (type) {
      case "image": return Image;
      case "document": return FileTextIcon;
      default: return File;
    }
  };

  if (loading || (!user && !loading)) {
    return null;
  }

  return (
    <Layout>
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
                <h1 className="text-3xl font-bold text-foreground mb-2">Evidence Vault</h1>
                <p className="text-muted-foreground">
                  Securely catalog and organize evidence related to your situation.
                </p>
              </div>
              <Button variant="hero" onClick={() => setIsCreating(true)}>
                <Plus className="w-4 h-4" />
                Add Evidence
              </Button>
            </div>
          </div>

          {/* Wellbeing Note */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border mb-8">
            <p className="text-sm text-muted-foreground text-center">
              <strong className="text-foreground">Pace yourself.</strong> Gathering evidence can be emotionally difficult. Take breaks when needed.
            </p>
          </div>

          {/* Create Evidence Form */}
          {isCreating && (
            <div className="p-6 rounded-2xl bg-card border border-border mb-6 animate-fade-up">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Evidence title (e.g., 'Photo of incident')..."
                className="w-full text-lg font-medium bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus:outline-none mb-4"
              />
              <select
                value={newFileType}
                onChange={(e) => setNewFileType(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 mb-4"
              >
                <option value="document">Document</option>
                <option value="image">Photo/Image</option>
                <option value="audio">Audio Recording</option>
                <option value="video">Video</option>
                <option value="other">Other</option>
              </select>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Describe this evidence (where you got it, when, what it shows)..."
                rows={4}
                className="w-full bg-background border border-border rounded-xl p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <div className="flex justify-end gap-3 mt-4">
                <Button variant="ghost" onClick={() => { setIsCreating(false); setNewTitle(""); setNewDescription(""); }}>
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
                <Button variant="hero" onClick={createEvidence} disabled={!newTitle.trim()}>
                  <Save className="w-4 h-4" />
                  Save Evidence
                </Button>
              </div>
            </div>
          )}

          {/* Evidence List */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading evidence...</p>
            </div>
          ) : evidence.length === 0 ? (
            <div className="text-center py-12 p-6 rounded-2xl bg-card border border-border">
              <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No evidence cataloged yet</h3>
              <p className="text-muted-foreground mb-4">Start organizing your evidence by adding items.</p>
              <Button variant="hero" onClick={() => setIsCreating(true)}>
                <Plus className="w-4 h-4" />
                Add Evidence
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {evidence.map((item) => {
                const Icon = getIcon(item.file_type);
                return (
                  <div key={item.id} className="p-6 rounded-2xl bg-card border border-border group">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-foreground mb-1 truncate">{item.title}</h3>
                        <p className="text-xs text-primary mb-2 capitalize">{item.file_type}</p>
                        {item.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                        )}
                        <p className="text-xs text-text-softer mt-2">
                          Added: {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => deleteEvidence(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-12 pt-8 border-t border-border">
            <Disclaimer className="justify-center" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
