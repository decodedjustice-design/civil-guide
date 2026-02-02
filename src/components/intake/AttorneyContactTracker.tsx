import { useState, useEffect } from "react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Users, 
  FileText, 
  Calendar, 
  Building2,
  MoreVertical,
  ExternalLink,
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface AttorneyContact {
  id: string;
  attorney_id: string;
  attorney_name: string;
  attorney_firm: string | null;
  intake_packet_id: string | null;
  contact_method: string | null;
  contact_date: string;
  status: string | null;
  notes: string | null;
}

interface AttorneyContactTrackerProps {
  limit?: number;
  showHeader?: boolean;
}

const STATUS_OPTIONS = [
  { value: "sent", label: "Sent", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  { value: "pending", label: "Pending Response", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  { value: "responded", label: "Responded", color: "bg-green-500/10 text-green-600 border-green-500/20" },
  { value: "consultation_scheduled", label: "Consultation Scheduled", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  { value: "retained", label: "Retained", color: "bg-accent/10 text-accent border-accent/20" },
  { value: "declined", label: "Declined", color: "bg-red-500/10 text-red-600 border-red-500/20" },
  { value: "no_response", label: "No Response", color: "bg-muted text-muted-foreground border-border" },
];

export function AttorneyContactTracker({ 
  limit, 
  showHeader = true 
}: AttorneyContactTrackerProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<AttorneyContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchContacts();
    }
  }, [user]);

  const fetchContacts = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from("attorney_contacts")
        .select("*")
        .eq("user_id", user.id)
        .order("contact_date", { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      setContacts(data || []);
    } catch (err) {
      console.error("Error fetching attorney contacts:", err);
      toast({
        title: "Error loading contacts",
        description: "Could not load your attorney contact history.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (contactId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("attorney_contacts")
        .update({ status: newStatus })
        .eq("id", contactId);

      if (error) throw error;

      setContacts((prev) =>
        prev.map((c) => (c.id === contactId ? { ...c, status: newStatus } : c))
      );

      toast({
        title: "Status updated",
        description: "Attorney contact status has been updated.",
      });
    } catch (err) {
      console.error("Error updating status:", err);
      toast({
        title: "Error",
        description: "Could not update status.",
        variant: "destructive",
      });
    }
  };

  const deleteContact = async (contactId: string) => {
    try {
      const { error } = await supabase
        .from("attorney_contacts")
        .delete()
        .eq("id", contactId);

      if (error) throw error;

      setContacts((prev) => prev.filter((c) => c.id !== contactId));

      toast({
        title: "Contact removed",
        description: "Attorney contact has been removed from your tracker.",
      });
    } catch (err) {
      console.error("Error deleting contact:", err);
      toast({
        title: "Error",
        description: "Could not remove contact.",
        variant: "destructive",
      });
    }
  };

  const getStatusInfo = (status: string | null) => {
    return STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            <Link to="/auth" className="text-accent hover:underline">
              Sign in
            </Link>{" "}
            to track your attorney contacts.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        {showHeader && (
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Attorney Contact Tracker
            </CardTitle>
          </CardHeader>
        )}
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Attorney Contact Tracker
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>
        {contacts.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No attorney contacts yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Generate an intake packet from an attorney profile to start tracking
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact) => {
              const statusInfo = getStatusInfo(contact.status);
              return (
                <div
                  key={contact.id}
                  className="p-4 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">
                        {contact.attorney_name}
                      </h4>
                      {contact.attorney_firm && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {contact.attorney_firm}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(contact.contact_date), "MMM d, yyyy")}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Select
                        value={contact.status || "sent"}
                        onValueChange={(value) => updateStatus(contact.id, value)}
                      >
                        <SelectTrigger className="w-[160px] h-8">
                          <SelectValue>
                            <Badge
                              variant="outline"
                              className={statusInfo.color}
                            >
                              {statusInfo.label}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <Badge
                                variant="outline"
                                className={option.color}
                              >
                                {option.label}
                              </Badge>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {contact.intake_packet_id && (
                            <DropdownMenuItem asChild>
                              <Link to={`/intake-packet?view=${contact.intake_packet_id}`}>
                                <FileText className="w-4 h-4 mr-2" />
                                View Packet
                              </Link>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem asChild>
                            <Link to="/find-help">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Find Attorney
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => deleteContact(contact.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              );
            })}

            {limit && contacts.length >= limit && (
              <Button variant="outline" className="w-full" asChild>
                <Link to="/attorney-contacts">View All Contacts</Link>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
