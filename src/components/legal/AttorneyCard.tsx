import { useState } from "react";
import { 
  MapPin, 
  Globe, 
  Phone, 
  Mail, 
  ExternalLink,
  FileText,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Attorney } from "@/data/attorneyData";
import { SafeCaseSummaryModal } from "./SafeCaseSummaryModal";

interface AttorneyCardProps {
  attorney: Attorney;
}

export function AttorneyCard({ attorney }: AttorneyCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  const getContactIcon = () => {
    switch (attorney.contactMethod) {
      case "website": return <Globe className="w-4 h-4" />;
      case "email": return <Mail className="w-4 h-4" />;
      case "phone": return <Phone className="w-4 h-4" />;
    }
  };

  const getContactLink = () => {
    switch (attorney.contactMethod) {
      case "website": return attorney.contactValue;
      case "email": return `mailto:${attorney.contactValue}`;
      case "phone": return `tel:${attorney.contactValue}`;
    }
  };

  const getContactLabel = () => {
    switch (attorney.contactMethod) {
      case "website": return "Visit Website";
      case "email": return attorney.contactValue;
      case "phone": return attorney.contactValue;
    }
  };

  return (
    <>
      <div className="p-5 rounded-xl bg-card border border-border hover:border-accent/30 transition-all shadow-sm hover:shadow-warm">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-lg">{attorney.name}</h3>
            <p className="text-muted-foreground">{attorney.firm}</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" />
              {attorney.city}, WA
            </p>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Practice Areas */}
        <div className="flex flex-wrap gap-2 mt-3">
          {attorney.practiceAreas.map((area) => (
            <Badge 
              key={area} 
              variant="secondary"
              className="bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20"
            >
              {area}
            </Badge>
          ))}
        </div>

        {/* Fee Types */}
        <div className="flex flex-wrap gap-2 mt-2">
          {attorney.feeTypes.map((fee) => (
            <Badge 
              key={fee} 
              variant="outline"
              className="text-muted-foreground border-border"
            >
              {fee}
            </Badge>
          ))}
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border space-y-4">
            {attorney.description && (
              <p className="text-sm text-muted-foreground">{attorney.description}</p>
            )}

            {/* Counties */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Counties Served</p>
              <p className="text-sm text-foreground">{attorney.counties.join(", ")}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <a
                href={getContactLink()}
                target={attorney.contactMethod === "website" ? "_blank" : undefined}
                rel={attorney.contactMethod === "website" ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 text-accent font-medium hover:bg-accent/20 transition-colors text-sm"
              >
                {getContactIcon()}
                {getContactLabel()}
                {attorney.contactMethod === "website" && <ExternalLink className="w-3 h-3" />}
              </a>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSummaryModal(true)}
                className="gap-2"
              >
                <FileText className="w-4 h-4" />
                Generate Safe Case Summary
              </Button>
            </div>
          </div>
        )}
      </div>

      <SafeCaseSummaryModal
        isOpen={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        attorneyName={attorney.name}
        firmName={attorney.firm}
      />
    </>
  );
}
