import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  MapPin, 
  Calendar, 
  Scale, 
  Pencil, 
  Check, 
  X,
  Shield
} from "lucide-react";
import { JusticePlaceCase, CaseStatus, getCaseStatusLabel } from "@/hooks/useJusticePlace";
import { cn } from "@/lib/utils";

interface CaseHeaderProps {
  caseData: JusticePlaceCase;
  onUpdate: (updates: { caseName?: string; caseStatus?: CaseStatus }) => Promise<boolean>;
  isSaving: boolean;
}

const ISSUE_TYPE_LABELS: Record<string, string> = {
  police: "Police / Law Enforcement",
  housing: "Housing",
  cps_dcyf: "CPS / Child Welfare",
  courts: "Courts",
  other: "Other",
};

const CASE_STATUS_OPTIONS: CaseStatus[] = [
  "getting_oriented",
  "gathering_information",
  "preparing_outreach",
  "awaiting_responses",
  "reviewing_options",
  "taking_next_steps",
  "on_hold",
];

const STATUS_COLORS: Record<CaseStatus, string> = {
  getting_oriented: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  gathering_information: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  preparing_outreach: "bg-teal-500/10 text-teal-600 border-teal-500/20",
  awaiting_responses: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  reviewing_options: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  taking_next_steps: "bg-green-500/10 text-green-600 border-green-500/20",
  on_hold: "bg-muted text-muted-foreground border-border",
};

export function CaseHeader({ caseData, onUpdate, isSaving }: CaseHeaderProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(caseData.case_name);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const formatIncidentDate = () => {
    if (!caseData.incident_month_year) return "Not specified";
    try {
      const [year, month] = caseData.incident_month_year.split("-");
      return format(new Date(parseInt(year), parseInt(month) - 1), "MMMM yyyy");
    } catch {
      return caseData.incident_month_year;
    }
  };

  const handleSaveName = async () => {
    if (editedName.trim() && editedName !== caseData.case_name) {
      const success = await onUpdate({ caseName: editedName.trim() });
      if (success) {
        setIsEditingName(false);
      }
    } else {
      setEditedName(caseData.case_name);
      setIsEditingName(false);
    }
  };

  const handleStatusChange = async (newStatus: CaseStatus) => {
    await onUpdate({ caseStatus: newStatus });
    setStatusDialogOpen(false);
  };

  return (
    <Card className="border-accent/20 bg-gradient-to-br from-card to-accent/5">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          {/* Left: Case Info */}
          <div className="flex-1 min-w-0">
            {/* Case Name */}
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-6 h-6 text-primary shrink-0" />
              {isEditingName ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="h-9 text-lg font-semibold max-w-xs"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveName();
                      if (e.key === "Escape") {
                        setEditedName(caseData.case_name);
                        setIsEditingName(false);
                      }
                    }}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={handleSaveName}
                    disabled={isSaving}
                  >
                    <Check className="w-4 h-4 text-green-600" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => {
                      setEditedName(caseData.case_name);
                      setIsEditingName(false);
                    }}
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-foreground truncate">
                    {caseData.case_name}
                  </h1>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    onClick={() => setIsEditingName(true)}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}
            </div>

            {/* Case Details */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {caseData.county} County, WA
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatIncidentDate()}
              </span>
              <span className="flex items-center gap-1.5">
                <Scale className="w-4 h-4" />
                {ISSUE_TYPE_LABELS[caseData.issue_type] || caseData.issue_type}
              </span>
            </div>
          </div>

          {/* Right: Status */}
          <div className="flex flex-col items-end gap-2">
            <p className="text-xs text-muted-foreground">Current Status</p>
            <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 h-9">
                  <Badge
                    variant="outline"
                    className={cn("font-medium", STATUS_COLORS[caseData.case_status])}
                  >
                    {getCaseStatusLabel(caseData.case_status)}
                  </Badge>
                  <Pencil className="w-3 h-3 text-muted-foreground" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Update Your Status</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    This is just for your own reference—there's no right or wrong choice.
                  </p>
                  <div className="grid gap-2">
                    {CASE_STATUS_OPTIONS.map((status) => (
                      <Button
                        key={status}
                        variant={caseData.case_status === status ? "default" : "outline"}
                        className="justify-start h-auto py-3"
                        onClick={() => handleStatusChange(status)}
                        disabled={isSaving}
                      >
                        <Badge
                          variant="outline"
                          className={cn(
                            "mr-3",
                            caseData.case_status === status
                              ? "bg-white/20 text-white border-white/30"
                              : STATUS_COLORS[status]
                          )}
                        >
                          {getCaseStatusLabel(status)}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Ownership Message */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            This is your private space. Everything here is only visible to you.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
