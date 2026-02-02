import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bookmark, 
  ArrowLeft, 
  MapPin, 
  Trash2,
  Globe,
  Phone,
  Mail,
  Search
} from "lucide-react";
import { useSavedAttorneys } from "@/hooks/useSavedAttorneys";
import { sampleAttorneys, Attorney } from "@/data/attorneyData";
import { useState } from "react";
import { AttorneyDetailModal } from "@/components/legal/AttorneyDetailModal";

export default function SavedAttorneys() {
  const { savedIds, removeAttorney } = useSavedAttorneys();
  const [selectedAttorney, setSelectedAttorney] = useState<Attorney | null>(null);

  const savedAttorneys = sampleAttorneys.filter((attorney) => 
    savedIds.includes(attorney.id)
  );

  const getContactIcon = (method: string) => {
    switch (method) {
      case "website": return <Globe className="w-4 h-4" />;
      case "email": return <Mail className="w-4 h-4" />;
      case "phone": return <Phone className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-b from-secondary/50 to-background border-b border-border">
          <div className="container mx-auto px-4 py-12">
            <Link 
              to="/find-help" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Find Legal Help
            </Link>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-accent/10">
                <Bookmark className="w-6 h-6 text-accent" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Saved Attorneys</h1>
            </div>
            
            <p className="text-muted-foreground max-w-2xl">
              Your bookmarked attorneys are saved locally on this device. 
              You can return here anytime to review your list.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          {savedAttorneys.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                <Bookmark className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                No saved attorneys yet
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Browse the attorney directory and click the bookmark icon to save 
                attorneys you'd like to contact later.
              </p>
              <Button asChild variant="accent">
                <Link to="/find-help" className="gap-2">
                  <Search className="w-4 h-4" />
                  Browse Attorney Directory
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                {savedAttorneys.length} saved attorney{savedAttorneys.length !== 1 ? "s" : ""}
              </p>

              <div className="grid gap-4">
                {savedAttorneys.map((attorney) => (
                  <div 
                    key={attorney.id}
                    className="p-5 rounded-xl bg-card border border-border hover:border-accent/30 transition-all shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Attorney Info - Clickable */}
                      <button
                        onClick={() => setSelectedAttorney(attorney)}
                        className="flex-1 text-left"
                      >
                        <h3 className="font-semibold text-foreground text-lg hover:text-accent transition-colors">
                          {attorney.name}
                        </h3>
                        <p className="text-muted-foreground">{attorney.firm}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {attorney.city}, WA
                        </p>
                      </button>

                      {/* Contact & Remove */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          {getContactIcon(attorney.contactMethod)}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAttorney(attorney.id)}
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          title="Remove from saved"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Practice Areas */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {attorney.practiceAreas.slice(0, 3).map((area) => (
                        <Badge 
                          key={area} 
                          variant="secondary"
                          className="bg-accent/10 text-accent border border-accent/20"
                        >
                          {area}
                        </Badge>
                      ))}
                      {attorney.practiceAreas.length > 3 && (
                        <Badge variant="outline" className="text-muted-foreground">
                          +{attorney.practiceAreas.length - 3} more
                        </Badge>
                      )}
                    </div>

                    {/* Fee Types */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {attorney.feeTypes.map((fee) => (
                        <Badge 
                          key={fee} 
                          variant="outline"
                          className="text-muted-foreground border-border text-xs"
                        >
                          {fee}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Disclaimer */}
              <div className="mt-8 p-4 rounded-lg bg-secondary/30 border border-border">
                <p className="text-xs text-muted-foreground text-center">
                  This is a directory listing only, not a referral or endorsement. 
                  Always verify credentials independently before engaging legal services.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <AttorneyDetailModal
        attorney={selectedAttorney}
        isOpen={!!selectedAttorney}
        onClose={() => setSelectedAttorney(null)}
      />
    </Layout>
  );
}
