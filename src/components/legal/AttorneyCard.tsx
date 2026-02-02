import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MapPin, 
  Globe, 
  Phone, 
  Mail, 
  ExternalLink,
  FileText,
  Bookmark,
  ClipboardList
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Attorney } from "@/data/attorneyData";
import { SafeCaseSummaryModal } from "./SafeCaseSummaryModal";
import { AttorneyDetailModal } from "./AttorneyDetailModal";
import { useSavedAttorneys } from "@/hooks/useSavedAttorneys";
import { cn } from "@/lib/utils";

interface AttorneyCardProps {
  attorney: Attorney;
}

export function AttorneyCard({ attorney }: AttorneyCardProps) {
  const navigate = useNavigate();
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const { isSaved, toggleSaved } = useSavedAttorneys();

  const saved = isSaved(attorney.id);

  const handleGenerateIntakePacket = (e: React.MouseEvent) => {
    e.stopPropagation();
    const params = new URLSearchParams({
      attorneyId: attorney.id,
      attorneyName: attorney.name,
      attorneyFirm: attorney.firm,
    });
    navigate(`/intake-packet?${params.toString()}`);
  };

  const getContactIcon = () => {
    switch (attorney.contactMethod) {
      case "website": return <Globe className="w-4 h-4" />;
      case "email": return <Mail className="w-4 h-4" />;
      case "phone": return <Phone className="w-4 h-4" />;
    }
  };

  const getContactLabel = () => {
    switch (attorney.contactMethod) {
      case "website": return "Website";
      case "email": return "Email";
      case "phone": return attorney.contactValue;
    }
  };

  return (
    <>
      <div 
        onClick={() => setShowDetailModal(true)}
        className="p-5 rounded-xl bg-card border border-border hover:border-accent/30 transition-all shadow-sm hover:shadow-warm cursor-pointer group"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-lg group-hover:text-accent transition-colors">
              {attorney.name}
            </h3>
            <p className="text-muted-foreground">{attorney.firm}</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" />
              {attorney.city}, WA
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                toggleSaved(attorney.id);
              }}
              className={cn(
                "h-8 w-8",
                saved 
                  ? "text-accent hover:text-accent/80" 
                  : "text-muted-foreground hover:text-accent"
              )}
              title={saved ? "Remove from saved" : "Save attorney"}
            >
              <Bookmark className={cn("w-4 h-4", saved && "fill-current")} />
            </Button>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              {getContactIcon()}
              <span className="hidden sm:inline">{getContactLabel()}</span>
              {attorney.contactMethod === "website" && <ExternalLink className="w-3 h-3" />}
            </div>
          </div>
        </div>

        {/* Practice Areas */}
        <div className="flex flex-wrap gap-2 mt-3">
          {attorney.practiceAreas.slice(0, 3).map((area) => (
            <Badge 
              key={area} 
              variant="secondary"
              className="bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20"
            >
              {area}
            </Badge>
          ))}
          {attorney.practiceAreas.length > 3 && (
            <Badge variant="outline" className="text-muted-foreground border-border">
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

        {/* Quick Actions - Stop propagation to not trigger detail modal */}
        <div className="mt-4 pt-3 border-t border-border flex flex-wrap gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={handleGenerateIntakePacket}
            className="gap-2 flex-1 sm:flex-none"
          >
            <ClipboardList className="w-4 h-4" />
            Intake Packet
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setShowSummaryModal(true);
            }}
            className="gap-2 flex-1 sm:flex-none"
          >
            <FileText className="w-4 h-4" />
            Case Summary
          </Button>
        </div>
      </div>

      <AttorneyDetailModal
        attorney={attorney}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />

      <SafeCaseSummaryModal
        isOpen={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        attorneyName={attorney.name}
        firmName={attorney.firm}
      />
    </>
  );
}
