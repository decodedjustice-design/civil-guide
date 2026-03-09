import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FolderOpen, Plus, Trash2, Save, X, ArrowLeft, File, Image, FileText as FileTextIcon, Upload, Calendar, Building, Users, FileQuestion, Info, Eye, Shield, Clock } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { NextStepBanner } from "@/components/shared/NextStepBanner";
import { EducationalNotice } from "@/components/shared/EducationalNotice";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-paperwork.png";
import { emptyStateNoDocuments } from "@/assets/index";

interface Evidence {
  id: string;
  title: string;
  description: string | null;
  file_type: string | null;
  file_url: string | null;
  document_date: string | null;
  source: string | null;
  system_involved: string | null;
  people_involved: string | null;
  relevance_notes: string | null;
  created_at: string;
}

const systemOptions = [
  { value: "", label: "Select system..." },
  { value: "police", label: "Police / Law Enforcement" },
  { value: "courts", label: "Courts / Legal System" },
  { value: "housing", label: "Housing / Landlord" },
  { value: "employer", label: "Employer / Workplace" },
  { value: "healthcare", label: "Healthcare Provider" },
  { value: "school", label: "School / Education" },
  { value: "government", label: "Government Agency" },
  { value: "other", label: "Other" },
];

export default function EvidenceVault() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form state
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newFileType, setNewFileType] = useState("document");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentDate, setDocumentDate] = useState("");
  const [source, setSource] = useState("");
  const [systemInvolved, setSystemInvolved] = useState("");
  const [peopleInvolved, setPeopleInvolved] = useState("");
  const [relevanceNotes, setRelevanceNotes] = useState("");

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!newTitle) {
        setNewTitle(file.name.replace(/\.[^/.]+$/, "")); // Use filename without extension as title
      }
      // Auto-detect file type
      if (file.type.startsWith("image/")) {
        setNewFileType("image");
      } else if (file.type.startsWith("audio/")) {
        setNewFileType("audio");
      } else if (file.type.startsWith("video/")) {
        setNewFileType("video");
      } else {
        setNewFileType("document");
      }
    }
  };

  const resetForm = () => {
    setNewTitle("");
    setNewDescription("");
    setNewFileType("document");
    setSelectedFile(null);
    setDocumentDate("");
    setSource("");
    setSystemInvolved("");
    setPeopleInvolved("");
    setRelevanceNotes("");
    setIsCreating(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const createEvidence = async () => {
    if (!newTitle.trim()) return;

    setIsUploading(true);
    let fileUrl: string | null = null;

    try {
      // Upload file if selected
      if (selectedFile && user) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("evidence-files")
          .upload(fileName, selectedFile);

        if (uploadError) {
          throw uploadError;
        }

        // Store the file path for signed URL generation on access
        fileUrl = fileName;
      }

      const { error } = await supabase.from("evidence").insert({
        user_id: user!.id,
        title: newTitle,
        description: newDescription || null,
        file_type: newFileType,
        file_url: fileUrl,
        document_date: documentDate || null,
        source: source || null,
        system_involved: systemInvolved || null,
        people_involved: peopleInvolved || null,
        relevance_notes: relevanceNotes || null,
      });

      if (error) {
        toast({ title: "Error", description: "Could not add evidence", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Evidence added to your vault" });
        resetForm();
        fetchEvidence();
      }
    } catch (error) {
      toast({ title: "Error", description: "Could not upload file", variant: "destructive" });
    } finally {
      setIsUploading(false);
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

  const viewFile = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("evidence-files")
        .createSignedUrl(filePath, 3600); // 1 hour expiration

      if (error) throw error;
      
      window.open(data.signedUrl, '_blank');
    } catch (error) {
      toast({ title: "Error", description: "Could not open file", variant: "destructive" });
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
      <div className="container max-w-5xl mx-auto px-4 pt-6">
        <EducationalNotice />
      </div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/60" />
        </div>
        
        <div className="container relative py-12 lg:py-16">
          <div className="text-center lg:text-left">
            <Link to="/self-help" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Self-Help Tools
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Evidence Vault</h1>
            <p className="text-muted-foreground max-w-xl">
              Securely catalog and organize evidence related to your situation.
            </p>
          </div>
        </div>
      </section>

      <div className="container py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header Actions */}
          <div className="flex items-center justify-end mb-8">
            <Button variant="hero" onClick={() => setIsCreating(true)}>
              <Plus className="w-4 h-4" />
              Add Evidence
            </Button>
          </div>

          {/* Privacy & Trust Framing */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/5 border border-accent/20 mb-6">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Private and secure</p>
              <p className="text-xs text-muted-foreground">
                Your files are stored securely and are only accessible to you. Nothing is shared with third parties.
              </p>
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
              {/* File Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Upload File (Optional)
                </label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-xl bg-background hover:border-primary/50 hover:bg-muted/30 transition-all cursor-pointer"
                >
                  <Upload className="w-8 h-8 text-muted-foreground mb-3" />
                  {selectedFile ? (
                    <p className="text-foreground font-medium">{selectedFile.name}</p>
                  ) : (
                    <>
                      <p className="text-foreground font-medium mb-1">Click to upload a file</p>
                      <p className="text-xs text-muted-foreground">Documents, photos, audio, or video</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt"
                />
              </div>

              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Title <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Brief title for this evidence..."
                  className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Type
                </label>
                <select
                  value={newFileType}
                  onChange={(e) => setNewFileType(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="document">Document</option>
                  <option value="image">Photo/Image</option>
                  <option value="audio">Audio Recording</option>
                  <option value="video">Video</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Metadata Section */}
              <div className="p-4 rounded-xl bg-muted/30 border border-border mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Evidence Details</span>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Adding details helps you organize and find evidence later, and helps professionals understand your situation.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Date of Document/Incident */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      Date of Document/Incident
                    </label>
                    <input
                      type="date"
                      value={documentDate}
                      onChange={(e) => setDocumentDate(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <p className="text-xs text-muted-foreground mt-1">When did this happen or when was it created?</p>
                  </div>

                  {/* Source */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      Source (Agency/Person)
                    </label>
                    <input
                      type="text"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      placeholder="e.g., Seattle PD, Dr. Smith..."
                      className="w-full h-10 px-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Who created or sent this?</p>
                  </div>

                  {/* System Involved */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                      <FileQuestion className="w-4 h-4 text-muted-foreground" />
                      System Involved
                    </label>
                    <select
                      value={systemInvolved}
                      onChange={(e) => setSystemInvolved(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      {systemOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <p className="text-xs text-muted-foreground mt-1">Which system or institution is involved?</p>
                  </div>

                  {/* People Involved */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      People Involved
                    </label>
                    <input
                      type="text"
                      value={peopleInvolved}
                      onChange={(e) => setPeopleInvolved(e.target.value)}
                      placeholder="Names, badge numbers, titles..."
                      className="w-full h-10 px-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Who was present or involved?</p>
                  </div>
                </div>

                {/* Relevance Notes */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Relevance / Notes
                  </label>
                  <textarea
                    value={relevanceNotes}
                    onChange={(e) => setRelevanceNotes(e.target.value)}
                    placeholder="Why is this important? What does it show?"
                    rows={2}
                    className="w-full bg-background border border-border rounded-lg p-3 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Explain why you're keeping this and what it demonstrates.</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Additional Description
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Any other details about this evidence..."
                  rows={3}
                  className="w-full bg-background border border-border rounded-xl p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={resetForm} disabled={isUploading}>
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
                <Button variant="hero" onClick={createEvidence} disabled={!newTitle.trim() || isUploading}>
                  <Save className="w-4 h-4" />
                  {isUploading ? "Uploading..." : "Save Evidence"}
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
                        {item.system_involved && (
                          <p className="text-xs text-muted-foreground mb-1">
                            System: {systemOptions.find(s => s.value === item.system_involved)?.label || item.system_involved}
                          </p>
                        )}
                        {item.document_date && (
                          <p className="text-xs text-muted-foreground mb-1">
                            Date: {new Date(item.document_date).toLocaleDateString()}
                          </p>
                        )}
                        {item.source && (
                          <p className="text-xs text-muted-foreground mb-1">
                            Source: {item.source}
                          </p>
                        )}
                        {item.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{item.description}</p>
                        )}
                        <p className="text-xs text-text-softer mt-2">
                          Added: {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1">
                        {item.file_url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => viewFile(item.file_url!)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
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
                  </div>
                );
              })}
            </div>
          )}

          {/* Cross-tool navigation */}
          <NextStepBanner
            heading="Next in your journey"
            steps={[
              { label: "Prepare your intake packet", description: "Bundle your case info for an attorney consultation.", href: "/intake-packet" },
              { label: "Build your timeline", description: "Organize events chronologically alongside your evidence.", href: "/timeline" },
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
