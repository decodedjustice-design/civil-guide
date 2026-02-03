import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  FileText,
  Bookmark,
  StickyNote,
  Book,
  Download,
  ExternalLink,
  Trash2,
  Plus,
  AlertCircle,
  Scale,
  FolderOpen,
  Heart,
} from "lucide-react";
import { JusticePlaceBookmark } from "@/hooks/useJusticePlace";
import { cn } from "@/lib/utils";

interface Note {
  id: string;
  title: string;
  content: string | null;
  updated_at: string;
}

interface IntakePacket {
  id: string;
  case_name: string;
  attorney_name: string | null;
  created_at: string;
}

interface AttorneyContact {
  id: string;
  attorney_name: string;
  attorney_firm: string | null;
  status: string | null;
  contact_date: string;
}

interface JusticePlaceSectionsProps {
  bookmarks: JusticePlaceBookmark[];
  onRemoveBookmark: (id: string) => Promise<boolean>;
}

export function JusticePlaceSections({ bookmarks, onRemoveBookmark }: JusticePlaceSectionsProps) {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [intakePackets, setIntakePackets] = useState<IntakePacket[]>([]);
  const [attorneyContacts, setAttorneyContacts] = useState<AttorneyContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const [notesRes, packetsRes, contactsRes] = await Promise.all([
        supabase
          .from("notes")
          .select("id, title, content, updated_at")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false })
          .limit(5),
        supabase
          .from("intake_packets")
          .select("id, case_name, attorney_name, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("attorney_contacts")
          .select("id, attorney_name, attorney_firm, status, contact_date")
          .eq("user_id", user.id)
          .order("contact_date", { ascending: false })
          .limit(5),
      ]);

      setNotes(notesRes.data || []);
      setIntakePackets(packetsRes.data || []);
      setAttorneyContacts(contactsRes.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter bookmarks by type
  const guideBookmarks = bookmarks.filter((b) => 
    b.resource_type === "guide" || b.resource_type === "library_guide"
  );
  const templateBookmarks = bookmarks.filter((b) => 
    b.resource_type === "template" || b.resource_type === "legal_template"
  );
  const attorneyBookmarks = bookmarks.filter((b) => b.resource_type === "attorney");

  const STATUS_LABELS: Record<string, string> = {
    sent: "Sent",
    pending: "Pending",
    responded: "Responded",
    consultation_scheduled: "Scheduled",
    retained: "Retained",
    declined: "Declined",
    no_response: "No Response",
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reassurance Banner */}
      <div className="p-4 rounded-xl bg-muted/30 border border-border flex items-start gap-3">
        <Heart className="w-5 h-5 text-accent shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          Nothing here is filed unless you choose. You can stop and return at any time.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 1. Notes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <StickyNote className="w-5 h-5" />
                Notes
              </CardTitle>
              <CardDescription className="mt-1">
                Your personal notes—autosaved as you type
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/notes">
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-3 p-2 rounded-lg bg-warning/5 border border-warning/20 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-warning shrink-0" />
              <p className="text-xs text-muted-foreground">
                Notes are for personal organization—not evidence.
              </p>
            </div>
            {notes.length === 0 ? (
              <EmptyState
                icon={StickyNote}
                message="No notes yet"
                action={{ label: "Create Note", href: "/notes" }}
              />
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <Link
                    key={note.id}
                    to="/notes"
                    className="block p-3 rounded-lg bg-muted/30 border border-border hover:border-accent/30 transition-colors"
                  >
                    <p className="font-medium text-foreground truncate">{note.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Updated {format(new Date(note.updated_at), "MMM d, yyyy")}
                    </p>
                  </Link>
                ))}
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/notes">View All Notes</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 2. Bookmarks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bookmark className="w-5 h-5" />
              Bookmarks
            </CardTitle>
            <CardDescription>
              Saved resources, attorneys, and guides
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="attorneys" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="attorneys">Attorneys</TabsTrigger>
                <TabsTrigger value="guides">Guides</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
              </TabsList>

              <TabsContent value="attorneys">
                {attorneyBookmarks.length === 0 ? (
                  <EmptyState
                    icon={Users}
                    message="No saved attorneys"
                    action={{ label: "Find Attorneys", href: "/find-help" }}
                  />
                ) : (
                  <BookmarkList bookmarks={attorneyBookmarks} onRemove={onRemoveBookmark} />
                )}
              </TabsContent>

              <TabsContent value="guides">
                {guideBookmarks.length === 0 ? (
                  <EmptyState
                    icon={Book}
                    message="No saved guides"
                    action={{ label: "Browse Library", href: "/library" }}
                  />
                ) : (
                  <BookmarkList bookmarks={guideBookmarks} onRemove={onRemoveBookmark} />
                )}
              </TabsContent>

              <TabsContent value="templates">
                {templateBookmarks.length === 0 ? (
                  <EmptyState
                    icon={FileText}
                    message="No saved templates"
                    action={{ label: "View Templates", href: "/legal-templates" }}
                  />
                ) : (
                  <BookmarkList bookmarks={templateBookmarks} onRemove={onRemoveBookmark} />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* 3. Evidence Vault (Placeholder) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FolderOpen className="w-5 h-5" />
              Evidence Vault
            </CardTitle>
            <CardDescription>
              Securely store documents and files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={FolderOpen}
              message="Your evidence vault is ready"
              action={{ label: "Open Vault", href: "/evidence-vault" }}
            />
          </CardContent>
        </Card>

        {/* 4. Analyzer (Entry Point) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Scale className="w-5 h-5" />
              Situation Analyzer
            </CardTitle>
            <CardDescription>
              Understand your civil rights situation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <Scale className="w-10 h-10 mx-auto text-primary/60 mb-3" />
              <p className="text-sm text-muted-foreground mb-4">
                Get clarity on what system you're dealing with and what usually happens next.
              </p>
              <Button asChild>
                <Link to="/analyzer">
                  Start Analyzer
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 5. Templates (View-Only) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5" />
              Templates
            </CardTitle>
            <CardDescription>
              Starter legal templates and letters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={FileText}
              message="Browse available templates"
              action={{ label: "View Templates", href: "/legal-templates" }}
            />
          </CardContent>
        </Card>

        {/* 6. Exports (Placeholder - Disabled) */}
        <Card className="opacity-75">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Download className="w-5 h-5" />
                Exports
              </CardTitle>
              <CardDescription>
                Attorney packets and case summaries
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {intakePackets.length === 0 ? (
              <div className="text-center py-6">
                <Download className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground mb-1">No exports yet</p>
                <p className="text-xs text-muted-foreground">
                  Create an intake packet when you're ready to reach out to attorneys.
                </p>
                <Button variant="outline" size="sm" className="mt-4" asChild>
                  <Link to="/intake-packet">Create Packet</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {intakePackets.map((packet) => (
                  <Link
                    key={packet.id}
                    to={`/intake-packet?view=${packet.id}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border hover:border-accent/30 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{packet.case_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {packet.attorney_name && `For: ${packet.attorney_name} • `}
                        {format(new Date(packet.created_at), "MMM d, yyyy")}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
                  </Link>
                ))}
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/attorney-contacts">View All</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Attorney Tracker Section */}
      {attorneyContacts.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5" />
                Attorney Contact Tracker
              </CardTitle>
              <CardDescription>
                Track your outreach to legal professionals
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/attorney-contacts">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {attorneyContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {contact.attorney_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(contact.contact_date), "MMM d, yyyy")}
                    </p>
                  </div>
                  <Badge variant="outline" className="shrink-0">
                    {STATUS_LABELS[contact.status || "sent"] || contact.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper Components
function EmptyState({
  icon: Icon,
  message,
  action,
}: {
  icon: React.ElementType;
  message: string;
  action: { label: string; href: string };
}) {
  return (
    <div className="text-center py-6">
      <Icon className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
      <p className="text-sm text-muted-foreground mb-3">{message}</p>
      <Button variant="outline" size="sm" asChild>
        <Link to={action.href}>{action.label}</Link>
      </Button>
    </div>
  );
}

function BookmarkList({
  bookmarks,
  onRemove,
}: {
  bookmarks: JusticePlaceBookmark[];
  onRemove: (id: string) => Promise<boolean>;
}) {
  return (
    <div className="space-y-3">
      {bookmarks.slice(0, 5).map((bookmark) => (
        <BookmarkItem key={bookmark.id} bookmark={bookmark} onRemove={onRemove} />
      ))}
    </div>
  );
}

function BookmarkItem({
  bookmark,
  onRemove,
}: {
  bookmark: JusticePlaceBookmark;
  onRemove: (id: string) => Promise<boolean>;
}) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    await onRemove(bookmark.id);
    setIsRemoving(false);
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
      <div className="min-w-0 flex-1">
        {bookmark.resource_url ? (
          <Link
            to={bookmark.resource_url}
            className="font-medium text-foreground hover:text-accent truncate block"
          >
            {bookmark.resource_title}
          </Link>
        ) : (
          <p className="font-medium text-foreground truncate">{bookmark.resource_title}</p>
        )}
        <p className="text-xs text-muted-foreground">
          {format(new Date(bookmark.created_at), "MMM d, yyyy")}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
        onClick={handleRemove}
        disabled={isRemoving}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
