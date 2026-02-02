import { 
  MapPin, 
  Globe, 
  Phone, 
  Mail, 
  ExternalLink,
  Scale,
  Languages,
  DollarSign,
  X,
  Bookmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Attorney } from "@/data/attorneyData";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSavedAttorneys } from "@/hooks/useSavedAttorneys";
import { cn } from "@/lib/utils";

interface AttorneyDetailModalProps {
  attorney: Attorney | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AttorneyDetailModal({ attorney, isOpen, onClose }: AttorneyDetailModalProps) {
  const isMobile = useIsMobile();
  const { isSaved, toggleSaved } = useSavedAttorneys();

  if (!attorney) return null;

  const saved = isSaved(attorney.id);

  const getContactLink = () => {
    switch (attorney.contactMethod) {
      case "website": return attorney.contactValue;
      case "email": return `mailto:${attorney.contactValue}`;
      case "phone": return `tel:${attorney.contactValue}`;
    }
  };

  const getEmailTemplateLink = () => {
    const email = attorney.contactMethod === "email" 
      ? attorney.contactValue 
      : attorney.email || "";
    
    if (!email) return null;

    const subject = encodeURIComponent("Inquiry About Legal Representation");
    const body = encodeURIComponent(
      `Dear ${attorney.name},\n\n` +
      `I am reaching out regarding a potential civil rights matter and would like to discuss whether your firm might be able to assist.\n\n` +
      `I would appreciate the opportunity to schedule a consultation at your convenience.\n\n` +
      `Thank you for your time.\n\n` +
      `Best regards`
    );

    return `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const emailLink = getEmailTemplateLink();

  const content = (
    <div className="space-y-6">
      {/* Header Info with Save Button */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">{attorney.name}</h3>
          <p className="text-muted-foreground font-medium">{attorney.firm}</p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {attorney.city}, WA
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => toggleSaved(attorney.id)}
          className={cn(
            "h-10 w-10 shrink-0",
            saved 
              ? "text-accent hover:text-accent/80" 
              : "text-muted-foreground hover:text-accent"
          )}
          title={saved ? "Remove from saved" : "Save attorney"}
        >
          <Bookmark className={cn("w-5 h-5", saved && "fill-current")} />
        </Button>
      </div>

      {/* Practice Areas */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-2">Practice Areas</h4>
        <div className="flex flex-wrap gap-2">
          {attorney.practiceAreas.map((area) => (
            <Badge 
              key={area} 
              variant="secondary"
              className="bg-accent/10 text-accent border border-accent/20"
            >
              {area}
            </Badge>
          ))}
        </div>
      </div>

      {/* Bio / Description */}
      {(attorney.detailedBio || attorney.description) && (
        <div>
          <h4 className="text-sm font-medium text-foreground mb-2">About</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {attorney.detailedBio || attorney.description}
          </p>
        </div>
      )}

      {/* Bar Admissions */}
      {attorney.barAdmissions && attorney.barAdmissions.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <Scale className="w-4 h-4 text-accent" />
            Bar Admissions
          </h4>
          <div className="flex flex-wrap gap-2">
            {attorney.barAdmissions.map((bar) => (
              <Badge key={bar} variant="outline" className="text-muted-foreground">
                {bar}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {attorney.languages && attorney.languages.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <Languages className="w-4 h-4 text-accent" />
            Languages
          </h4>
          <p className="text-sm text-muted-foreground">
            {attorney.languages.join(", ")}
          </p>
        </div>
      )}

      {/* Fee Structure */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-accent" />
          Fee Structure
        </h4>
        <div className="flex flex-wrap gap-2 mb-2">
          {attorney.feeTypes.map((fee) => (
            <Badge key={fee} variant="outline" className="text-muted-foreground border-border">
              {fee}
            </Badge>
          ))}
        </div>
        {attorney.feeStructureDetails && (
          <p className="text-sm text-muted-foreground">
            {attorney.feeStructureDetails}
          </p>
        )}
      </div>

      {/* Counties Served */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-2">Counties Served</h4>
        <p className="text-sm text-muted-foreground">
          {attorney.counties.join(", ")}
        </p>
      </div>

      {/* Contact Information */}
      <div className="pt-4 border-t border-border space-y-3">
        <h4 className="text-sm font-medium text-foreground">Contact</h4>
        
        {/* Primary Contact */}
        <a
          href={getContactLink()}
          target={attorney.contactMethod === "website" ? "_blank" : undefined}
          rel={attorney.contactMethod === "website" ? "noopener noreferrer" : undefined}
          className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
        >
          {attorney.contactMethod === "website" && <Globe className="w-5 h-5 text-accent" />}
          {attorney.contactMethod === "email" && <Mail className="w-5 h-5 text-accent" />}
          {attorney.contactMethod === "phone" && <Phone className="w-5 h-5 text-accent" />}
          <span className="text-sm text-foreground">{attorney.contactValue}</span>
          {attorney.contactMethod === "website" && <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto" />}
        </a>

        {/* Additional contact info if available */}
        {attorney.phone && attorney.contactMethod !== "phone" && (
          <a
            href={`tel:${attorney.phone}`}
            className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
          >
            <Phone className="w-5 h-5 text-accent" />
            <span className="text-sm text-foreground">{attorney.phone}</span>
          </a>
        )}

        {attorney.email && attorney.contactMethod !== "email" && (
          <a
            href={`mailto:${attorney.email}`}
            className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
          >
            <Mail className="w-5 h-5 text-accent" />
            <span className="text-sm text-foreground">{attorney.email}</span>
          </a>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-4 space-y-3">
        {emailLink && (
          <Button asChild className="w-full" variant="accent">
            <a href={emailLink}>
              <Mail className="w-4 h-4 mr-2" />
              Contact via Email
            </a>
          </Button>
        )}
        
        {attorney.contactMethod === "website" && (
          <Button asChild variant="outline" className="w-full">
            <a href={attorney.contactValue} target="_blank" rel="noopener noreferrer">
              <Globe className="w-4 h-4 mr-2" />
              Visit Website
              <ExternalLink className="w-3 h-3 ml-2" />
            </a>
          </Button>
        )}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center pt-4 border-t border-border">
        This is a directory listing only, not a referral or endorsement. 
        Always verify credentials independently.
      </p>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-lg">Attorney Details</DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>
          <ScrollArea className="flex-1 px-4 pb-6">
            {content}
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Attorney Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          {content}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
