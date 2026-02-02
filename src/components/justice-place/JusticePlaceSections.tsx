import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Calendar,
  Trash2,
  Plus,
  AlertCircle,
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
      // Fetch notes, intake packets, and attorney contacts in parallel
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
  const guideBookmarks = bookmarks.filter((b) => b.resource_type === "guide");
  const templateBookmarks = bookmarks.filter((b) => b.resource_type === "template");
  const courtBookmarks = bookmarks.filter((b) => b.resource_type === "court");
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
        {[1, 2, 3, 4].map((i) => (
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
      {/* Saved & Ongoing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Saved & Ongoing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="contacts" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="contacts">Attorney Tracker</TabsTrigger>
              <TabsTrigger value="saved">Saved Attorneys</TabsTrigger>
            </TabsList>

            <TabsContent value="contacts">
              {attorneyContacts.length === 0 ? (
                <EmptyState
                  icon={Users}
                  message="No attorney contacts yet"
                  action={{ label: "Find Attorneys", href: "/find-help" }}
                />
              ) : (
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
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to="/attorney-contacts">View All Contacts</Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="saved">
              {attorneyBookmarks.length === 0 ? (
                <EmptyState
                  icon={Bookmark}
                  message="No saved attorneys"
                  action={{ label: "Browse Directory", href: "/find-help" }}
                />
              ) : (
                <div className="space-y-3">
                  {attorneyBookmarks.slice(0, 5).map((bookmark) => (
                    <BookmarkItem
                      key={bookmark.id}
                      bookmark={bookmark}
                      onRemove={onRemoveBookmark}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <StickyNote className="w-5 h-5" />
            Notes
          </CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link to="/notes">
              <Plus className="w-4 h-4 mr-1" />
              Add Note
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-3 p-2 rounded-lg bg-warning/5 border border-warning/20 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-warning shrink-0" />
            <p className="text-xs text-muted-foreground">
              Notes are for personal organization only—not for evidence.
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

      {/* Library Saves */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="w-5 h-5" />
            Library Saves
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="guides" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="guides">Guides</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="courts">Courts</TabsTrigger>
            </TabsList>

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

            <TabsContent value="courts">
              {courtBookmarks.length === 0 ? (
                <EmptyState
                  icon={Bookmark}
                  message="No saved court resources"
                  action={{ label: "Courts & Filing", href: "/courts-filing-info" }}
                />
              ) : (
                <BookmarkList bookmarks={courtBookmarks} onRemove={onRemoveBookmark} />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Exports */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exports
          </CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link to="/intake-packet">
              <Plus className="w-4 h-4 mr-1" />
              New Packet
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {intakePackets.length === 0 ? (
            <EmptyState
              icon={FileText}
              message="No intake packets yet"
              action={{ label: "Create Packet", href: "/intake-packet" }}
            />
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
                <Link to="/attorney-contacts">View All Exports</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
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
