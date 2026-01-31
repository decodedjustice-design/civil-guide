import { useState } from "react";
import { format, parseISO } from "date-fns";
import { 
  MapPin, 
  Globe, 
  Phone, 
  ExternalLink,
  ChevronDown,
  AlertTriangle,
  Calendar,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LegalResource } from "@/data/legalResources";
import { toast } from "@/hooks/use-toast";

interface ResourceCardProps {
  resource: LegalResource;
  expanded?: boolean;
}

export function LegalResourceCard({ resource, expanded = false }: ResourceCardProps) {
  const [isOpen, setIsOpen] = useState(expanded);
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const getCategoryColor = () => {
    switch (resource.category) {
      case "legal-aid": return "bg-accent/20 text-accent border-accent/30";
      case "civil-rights": return "bg-primary/20 text-primary border-primary/30";
      case "advocacy": return "bg-secondary text-secondary-foreground border-border";
    }
  };

  const getCategoryLabel = () => {
    switch (resource.category) {
      case "legal-aid": return "Legal Aid";
      case "civil-rights": return "Civil Rights";
      case "advocacy": return "Advocacy";
    }
  };

  const handleReportBrokenLink = () => {
    // In production, this would send to a backend
    setReportSubmitted(true);
    toast({
      title: "Report Submitted",
      description: "Thank you for helping keep our directory current.",
    });
  };

  const verifiedDate = parseISO(resource.lastVerified);
  const isRecent = (new Date().getTime() - verifiedDate.getTime()) < 90 * 24 * 60 * 60 * 1000; // 90 days

  return (
    <div className="p-4 rounded-xl bg-secondary/30 border border-border hover:border-accent/30 transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex items-start justify-between gap-3"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h4 className="font-medium text-foreground">{resource.name}</h4>
            <Badge className={`${getCategoryColor()} text-xs`}>
              {getCategoryLabel()}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {resource.serviceType}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {resource.location}
          </p>
        </div>
        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      {isOpen && (
        <div className="mt-3 pt-3 border-t border-border space-y-4">
          <p className="text-sm text-muted-foreground">{resource.description}</p>
          
          {resource.eligibilityNotes && (
            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <p className="text-xs font-medium text-muted-foreground mb-1">Eligibility</p>
              <p className="text-sm text-foreground">{resource.eligibilityNotes}</p>
            </div>
          )}

          {/* Contact Info */}
          <div className="flex flex-wrap gap-3 text-sm">
            {resource.phone && resource.phone !== "N/A" && (
              <a 
                href={`tel:${resource.phone}`}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="w-4 h-4" />
                {resource.phone}
              </a>
            )}
            <a
              href={resource.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-accent font-medium hover:underline px-3 py-1 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors"
            >
              <Globe className="w-4 h-4" />
              Visit Website
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Verification & Report */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>Last verified: {format(verifiedDate, "MMM d, yyyy")}</span>
              {isRecent && (
                <CheckCircle className="w-3 h-3 text-green-500" />
              )}
            </div>
            
            {!reportSubmitted ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReportBrokenLink}
                className="text-xs h-7 text-muted-foreground hover:text-destructive"
              >
                <AlertTriangle className="w-3 h-3 mr-1" />
                Report Broken Link
              </Button>
            ) : (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                Reported
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
