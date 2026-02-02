import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { AttorneyContactTracker } from "@/components/intake/AttorneyContactTracker";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  FileText,
  ArrowLeft,
  LogIn,
  Plus,
  Calendar,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Disclaimer } from "@/components/shared/Disclaimer";

interface IntakePacket {
  id: string;
  case_name: string;
  county: string;
  issue_type: string;
  attorney_name: string | null;
  created_at: string;
}

export default function AttorneyContacts() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [packets, setPackets] = useState<IntakePacket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPackets();
    }
  }, [user]);

  const fetchPackets = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("intake_packets")
        .select("id, case_name, county, issue_type, attorney_name, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPackets(data || []);
    } catch (err) {
      console.error("Error fetching packets:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePacket = async (packetId: string) => {
    try {
      const { error } = await supabase
        .from("intake_packets")
        .delete()
        .eq("id", packetId);

      if (error) throw error;

      setPackets((prev) => prev.filter((p) => p.id !== packetId));
      toast({
        title: "Packet deleted",
        description: "The intake packet has been removed.",
      });
    } catch (err) {
      console.error("Error deleting packet:", err);
      toast({
        title: "Error",
        description: "Could not delete the packet.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="container max-w-2xl mx-auto px-4 py-12">
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h1 className="text-xl font-semibold mb-2">Sign In Required</h1>
              <p className="text-muted-foreground mb-6">
                Please sign in to view your attorney contacts and saved packets.
              </p>
              <Button asChild>
                <Link to="/auth?redirect=/attorney-contacts">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-8 h-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">
                  Attorney Contact Hub
                </h1>
              </div>
              <p className="text-muted-foreground">
                Track your attorney outreach and manage saved intake packets.
              </p>
            </div>
            <Button asChild>
              <Link to="/intake-packet">
                <Plus className="w-4 h-4 mr-2" />
                New Intake Packet
              </Link>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="contacts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="contacts" className="gap-2">
              <Users className="w-4 h-4" />
              Contact Tracker
            </TabsTrigger>
            <TabsTrigger value="packets" className="gap-2">
              <FileText className="w-4 h-4" />
              Saved Packets
            </TabsTrigger>
          </TabsList>

          {/* Contact Tracker Tab */}
          <TabsContent value="contacts">
            <AttorneyContactTracker showHeader={false} />
          </TabsContent>

          {/* Saved Packets Tab */}
          <TabsContent value="packets">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Your Intake Packets
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-1/3" />
                          <Skeleton className="h-3 w-1/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : packets.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">No intake packets yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Create your first intake packet to get started
                    </p>
                    <Button asChild className="mt-4">
                      <Link to="/intake-packet">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Packet
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {packets.map((packet) => (
                      <div
                        key={packet.id}
                        className="p-4 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground truncate">
                              {packet.case_name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {packet.county} County • {packet.issue_type}
                            </p>
                            {packet.attorney_name && (
                              <p className="text-sm text-accent mt-1">
                                For: {packet.attorney_name}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(packet.created_at), "MMM d, yyyy")}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                navigate(`/intake-packet?view=${packet.id}`)
                              }
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deletePacket(packet.id)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="hover:border-accent/30 transition-colors">
            <CardContent className="p-4">
              <Link to="/find-help" className="flex items-center gap-3">
                <Users className="w-10 h-10 text-accent" />
                <div>
                  <h3 className="font-medium">Find Attorneys</h3>
                  <p className="text-sm text-muted-foreground">
                    Browse the attorney directory
                  </p>
                </div>
              </Link>
            </CardContent>
          </Card>
          <Card className="hover:border-accent/30 transition-colors">
            <CardContent className="p-4">
              <Link to="/legal-templates" className="flex items-center gap-3">
                <FileText className="w-10 h-10 text-accent" />
                <div>
                  <h3 className="font-medium">Legal Templates</h3>
                  <p className="text-sm text-muted-foreground">
                    Educational document templates
                  </p>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Disclaimer */}
        <div className="mt-8">
          <Disclaimer variant="subtle" />
        </div>
      </div>
    </Layout>
  );
}
