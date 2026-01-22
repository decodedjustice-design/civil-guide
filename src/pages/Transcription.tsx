import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Upload, 
  FileAudio, 
  FileText, 
  Download, 
  Save, 
  Loader2, 
  RefreshCw,
  Clock,
  ArrowLeft,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TranscriptSegment {
  speaker: string;
  text: string;
  startTime: number;
  endTime: number;
}

interface TranscriptionResult {
  fullText: string;
  segments: TranscriptSegment[];
  wordCount: number;
}

const formatTimestamp = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function Transcription() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"upload" | "paste">("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [transcriptTitle, setTranscriptTitle] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/auth?redirect=/transcription");
    }
  }, [user, navigate]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["audio/mpeg", "audio/wav", "audio/mp4", "audio/x-m4a", "audio/m4a"];
      if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|m4a)$/i)) {
        toast.error("Please upload an MP3, WAV, or M4A file.");
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        toast.error("File size must be under 20MB.");
        return;
      }
      setSelectedFile(file);
      setError(null);
      setTranscriptionResult(null);
      if (!transcriptTitle) {
        setTranscriptTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleTranscribe = async () => {
    if (!selectedFile) {
      toast.error("Please select an audio file first.");
      return;
    }

    setIsTranscribing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("audio", selectedFile);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/transcribe-audio`,
        {
          method: "POST",
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Transcription failed");
      }

      const result: TranscriptionResult = await response.json();
      setTranscriptionResult(result);
      toast.success("Transcription complete!");
    } catch (err) {
      console.error("Transcription error:", err);
      const message = err instanceof Error ? err.message : "Transcription failed. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handlePastedTextSubmit = () => {
    if (!pastedText.trim()) {
      toast.error("Please paste some text first.");
      return;
    }
    setTranscriptionResult({
      fullText: pastedText.trim(),
      segments: [{ speaker: "Speaker", text: pastedText.trim(), startTime: 0, endTime: 0 }],
      wordCount: pastedText.trim().split(/\s+/).length,
    });
    toast.success("Text ready for saving.");
  };

  const generateTranscriptText = (): string => {
    if (!transcriptionResult) return "";
    
    if (transcriptionResult.segments.length > 1 || transcriptionResult.segments[0]?.startTime > 0) {
      return transcriptionResult.segments
        .map(seg => `[${formatTimestamp(seg.startTime)}] ${seg.speaker}: ${seg.text}`)
        .join("\n\n");
    }
    return transcriptionResult.fullText;
  };

  const handleDownload = () => {
    const text = generateTranscriptText();
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${transcriptTitle || "transcript"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Transcript downloaded.");
  };

  const handleSaveToVault = async () => {
    if (!user || !transcriptionResult) return;

    setIsSaving(true);
    try {
      const transcriptText = generateTranscriptText();
      const blob = new Blob([transcriptText], { type: "text/plain" });
      const fileName = `transcript-${Date.now()}.txt`;
      const filePath = `${user.id}/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("evidence-files")
        .upload(filePath, blob, { contentType: "text/plain" });

      if (uploadError) throw uploadError;

      // Save to evidence table
      const { error: insertError } = await supabase
        .from("evidence")
        .insert({
          user_id: user.id,
          title: transcriptTitle || "Audio Transcript",
          description: `Transcription with ${transcriptionResult.wordCount} words`,
          file_type: "transcript",
          file_url: filePath,
          source: activeTab === "upload" ? "Audio upload" : "Text paste",
        });

      if (insertError) throw insertError;

      toast.success("Transcript saved to Evidence Vault!");
      navigate("/evidence-vault");
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save transcript. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPastedText("");
    setTranscriptTitle("");
    setTranscriptionResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="container py-12 lg:py-20">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/self-help")}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Self-Help Tools
            </Button>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-4">
                <FileAudio className="w-4 h-4" />
                <span>Personal Documentation</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Transcription Tool
              </h1>
              <p className="text-muted-foreground max-w-lg mx-auto">
                This tool is for personal documentation and clarity. Upload audio or paste text to organize what was said during important interactions.
              </p>
            </div>
          </div>

          {/* Wellbeing Note */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border mb-8">
            <p className="text-sm text-muted-foreground text-center">
              <strong className="text-foreground">You can pause or return later.</strong> Take your time — there's no rush.
            </p>
          </div>

          {/* Main Content */}
          {!transcriptionResult ? (
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">Add Your Content</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "upload" | "paste")}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="upload" className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Audio
                    </TabsTrigger>
                    <TabsTrigger value="paste" className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Paste Text
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upload" className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Title (optional)
                      </label>
                      <Input
                        value={transcriptTitle}
                        onChange={(e) => setTranscriptTitle(e.target.value)}
                        placeholder="e.g., Phone call with caseworker"
                      />
                    </div>

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-accent/50 hover:bg-accent/5 transition-colors"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".mp3,.wav,.m4a,audio/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      {selectedFile ? (
                        <div className="flex flex-col items-center gap-2">
                          <CheckCircle className="w-10 h-10 text-accent" />
                          <p className="font-medium text-foreground">{selectedFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <FileAudio className="w-10 h-10 text-muted-foreground" />
                          <p className="font-medium text-foreground">Click to upload audio</p>
                          <p className="text-sm text-muted-foreground">MP3, WAV, or M4A (max 20MB)</p>
                        </div>
                      )}
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {error}
                      </div>
                    )}

                    <Button
                      onClick={handleTranscribe}
                      disabled={!selectedFile || isTranscribing}
                      className="w-full"
                      variant="hero"
                      size="lg"
                    >
                      {isTranscribing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Transcribing...
                        </>
                      ) : (
                        <>
                          <FileText className="w-5 h-5" />
                          Transcribe Audio
                        </>
                      )}
                    </Button>
                  </TabsContent>

                  <TabsContent value="paste" className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Title (optional)
                      </label>
                      <Input
                        value={transcriptTitle}
                        onChange={(e) => setTranscriptTitle(e.target.value)}
                        placeholder="e.g., Meeting notes"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Paste your transcript
                      </label>
                      <Textarea
                        value={pastedText}
                        onChange={(e) => setPastedText(e.target.value)}
                        placeholder="Paste your existing transcript here..."
                        rows={10}
                        className="resize-none"
                      />
                    </div>

                    <Button
                      onClick={handlePastedTextSubmit}
                      disabled={!pastedText.trim()}
                      className="w-full"
                      variant="hero"
                      size="lg"
                    >
                      <FileText className="w-5 h-5" />
                      Continue
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            /* Transcript Result View */
            <div className="space-y-6">
              <Card className="border-2 border-accent/30">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{transcriptTitle || "Transcript"}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {transcriptionResult.wordCount} words
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={resetForm}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Start Over
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="max-h-96 overflow-y-auto rounded-lg bg-muted/30 p-4 space-y-4">
                    {transcriptionResult.segments.map((segment, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-semibold text-accent">{segment.speaker}</span>
                          {segment.startTime > 0 && (
                            <span className="flex items-center gap-1 text-muted-foreground text-xs">
                              <Clock className="w-3 h-3" />
                              {formatTimestamp(segment.startTime)}
                            </span>
                          )}
                        </div>
                        <p className="text-foreground leading-relaxed">{segment.text}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  <Download className="w-5 h-5" />
                  Download as Text
                </Button>
                <Button
                  onClick={handleSaveToVault}
                  disabled={isSaving}
                  variant="hero"
                  size="lg"
                  className="flex-1"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save to Evidence Vault
                    </>
                  )}
                </Button>
              </div>

              {/* Confirmation */}
              <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 text-center">
                <p className="text-sm text-muted-foreground">
                  Your transcript will be saved privately in your Evidence Vault.
                </p>
              </div>
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
