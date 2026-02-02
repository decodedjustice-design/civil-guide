import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const CIVIL_RIGHTS_CATEGORIES = [
  "Excessive Force",
  "Unlawful Arrest/Detention",
  "False Imprisonment",
  "Malicious Prosecution",
  "First Amendment Retaliation",
  "Fourth Amendment Violations",
  "Due Process Violations",
  "Equal Protection Violations",
  "Housing Discrimination",
  "Employment Discrimination",
  "ADA/Disability Rights",
  "Educational Rights",
  "Child Welfare/CPS Issues",
  "Healthcare Rights",
  "Benefits Denial",
  "Retaliation",
  "Conspiracy",
  "Other",
];

const CASE_STATUS_OPTIONS = [
  "Incident occurred, no action taken yet",
  "Filed complaint with agency",
  "Agency investigation ongoing",
  "Received agency decision",
  "Considering legal action",
  "Filed lawsuit (pending)",
  "Other",
];

const WASHINGTON_COUNTIES = [
  "Adams", "Asotin", "Benton", "Chelan", "Clallam", "Clark", "Columbia",
  "Cowlitz", "Douglas", "Ferry", "Franklin", "Garfield", "Grant", "Grays Harbor",
  "Island", "Jefferson", "King", "Kitsap", "Kittitas", "Klickitat", "Lewis",
  "Lincoln", "Mason", "Okanogan", "Pacific", "Pend Oreille", "Pierce", "San Juan",
  "Skagit", "Skamania", "Snohomish", "Spokane", "Stevens", "Thurston", "Wahkiakum",
  "Walla Walla", "Whatcom", "Whitman", "Yakima"
];

const formSchema = z.object({
  // Case Overview
  caseName: z.string().min(1, "Case name is required").max(200),
  county: z.string().min(1, "County is required"),
  incidentMonthYear: z.string().min(1, "Incident month/year is required"),
  issueType: z.string().min(1, "Issue type is required"),
  opposingParty: z.string().min(1, "Opposing party is required").max(200),
  caseStatus: z.string().min(1, "Case status is required"),
  
  // Narrative
  narrative: z.string().min(50, "Please provide at least 50 characters").max(4000, "Maximum 700 words (~4000 characters)"),
  
  // Issues checklist
  issuesChecklist: z.array(z.string()).min(1, "Select at least one issue category"),
  
  // Evidence snapshot
  evidenceItems: z.string().optional(),
  
  // Deadlines
  incidentDate: z.string().optional(),
  
  // Contact info
  contactName: z.string().min(1, "Your name is required").max(100),
  contactEmail: z.string().email("Valid email required").optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  contactPreferredMethod: z.string().min(1, "Preferred contact method is required"),
});

export type IntakeFormData = z.infer<typeof formSchema>;

interface IntakePacketFormProps {
  attorneyName?: string;
  attorneyFirm?: string;
  attorneyId?: string;
  onSubmit: (data: IntakeFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const STEPS = [
  { id: 1, title: "Case Overview" },
  { id: 2, title: "Your Narrative" },
  { id: 3, title: "Issues & Evidence" },
  { id: 4, title: "Deadlines & Contact" },
];

export function IntakePacketForm({
  attorneyName,
  attorneyFirm,
  attorneyId,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: IntakePacketFormProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<IntakeFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caseName: "",
      county: "",
      incidentMonthYear: "",
      issueType: "",
      opposingParty: "",
      caseStatus: "",
      narrative: "",
      issuesChecklist: [],
      evidenceItems: "",
      incidentDate: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      contactPreferredMethod: "email",
    },
  });

  const narrative = form.watch("narrative");
  const wordCount = narrative ? narrative.trim().split(/\s+/).filter(Boolean).length : 0;

  const validateCurrentStep = async () => {
    let fieldsToValidate: (keyof IntakeFormData)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ["caseName", "county", "incidentMonthYear", "issueType", "opposingParty", "caseStatus"];
        break;
      case 2:
        fieldsToValidate = ["narrative"];
        break;
      case 3:
        fieldsToValidate = ["issuesChecklist"];
        break;
      case 4:
        fieldsToValidate = ["contactName", "contactPreferredMethod"];
        break;
    }

    const result = await form.trigger(fieldsToValidate);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFormSubmit = async (data: IntakeFormData) => {
    onSubmit(data);
  };

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      <div className="p-4 rounded-xl bg-warning/10 border border-warning/30 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground mb-1">
            Initial Inquiry Only
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This is an initial inquiry only. Do not send evidence until conflict of interest is cleared.
            This packet contains no attachments or sensitive documents.
          </p>
        </div>
      </div>

      {/* Attorney Info (if generating for specific attorney) */}
      {attorneyName && (
        <Card className="border-accent/20 bg-accent/5">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Generating packet for:</p>
            <p className="font-medium text-foreground">{attorneyName}</p>
            {attorneyFirm && <p className="text-sm text-muted-foreground">{attorneyFirm}</p>}
          </CardContent>
        </Card>
      )}

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  currentStep >= step.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {step.id}
              </div>
              <span className="text-xs text-muted-foreground mt-1 hidden sm:block">
                {step.title}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-8 sm:w-16 mx-2",
                  currentStep > step.id ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Step 1: Case Overview */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Case Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="caseName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Case Name / Short Description</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Traffic Stop Incident - March 2024" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>A brief identifier for this matter</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="county"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>County</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select county" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {WASHINGTON_COUNTIES.map((county) => (
                              <SelectItem key={county} value={county}>
                                {county} County
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="incidentMonthYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Incident Month/Year</FormLabel>
                        <FormControl>
                          <Input 
                            type="month" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="issueType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Issue Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select issue type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="police">Police / Law Enforcement</SelectItem>
                          <SelectItem value="housing">Housing Discrimination</SelectItem>
                          <SelectItem value="cps_dcyf">Child Welfare / CPS / DCYF</SelectItem>
                          <SelectItem value="schools">Education / Schools</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="benefits">Government Benefits</SelectItem>
                          <SelectItem value="employment">Employment</SelectItem>
                          <SelectItem value="other">Other Civil Rights</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="opposingParty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Opposing Party / Agency</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., City of Seattle Police Department" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>The government entity or party involved</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="caseStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Case Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CASE_STATUS_OPTIONS.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Step 2: Narrative */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Narrative</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                  <p className="font-medium mb-2">Guidance for your narrative:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Write in plain language—no legal terms needed</li>
                    <li>Focus on <strong>what happened</strong>, not how you felt</li>
                    <li>Include approximate dates, locations, and people involved</li>
                    <li>Keep it factual and professional</li>
                    <li>Maximum 700 words</li>
                  </ul>
                </div>

                <FormField
                  control={form.control}
                  name="narrative"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What Happened</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the incident or situation in your own words. Start with when and where it happened, then describe what occurred..."
                          className="min-h-[250px] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <div className="flex justify-between items-center">
                        <FormMessage />
                        <span className={cn(
                          "text-xs",
                          wordCount > 700 ? "text-destructive" : "text-muted-foreground"
                        )}>
                          {wordCount}/700 words
                        </span>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Step 3: Issues & Evidence */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Issues Checklist</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="issuesChecklist"
                    render={() => (
                      <FormItem>
                        <FormDescription className="mb-4">
                          Select all categories that may apply to your situation
                        </FormDescription>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {CIVIL_RIGHTS_CATEGORIES.map((category) => (
                            <FormField
                              key={category}
                              control={form.control}
                              name="issuesChecklist"
                              render={({ field }) => (
                                <FormItem className="flex items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(category)}
                                      onCheckedChange={(checked) => {
                                        const current = field.value || [];
                                        if (checked) {
                                          field.onChange([...current, category]);
                                        } else {
                                          field.onChange(current.filter((v) => v !== category));
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <Label className="text-sm font-normal cursor-pointer">
                                    {category}
                                  </Label>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage className="mt-2" />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Evidence Snapshot</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="evidenceItems"
                    render={({ field }) => (
                      <FormItem>
                        <FormDescription className="mb-3">
                          List evidence you have (do NOT upload files—this is a description only)
                        </FormDescription>
                        <FormControl>
                          <Textarea
                            placeholder="Example:
- Body camera footage (requested via PRA)
- Medical records from ER visit
- 3 witness statements
- Photos taken at scene
- Text message screenshots"
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: Deadlines & Contact */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Deadline Awareness</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="incidentDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specific Incident Date (if known)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription>
                          This helps estimate statute of limitations windows
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="p-3 rounded-lg bg-warning/5 border border-warning/20 text-sm">
                    <p className="font-medium text-foreground mb-1">
                      Important Deadline Information
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Civil rights claims have strict filing deadlines. Common timeframes include:
                    </p>
                    <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                      <li>• WA State Tort Claims: 60 days to file notice</li>
                      <li>• Federal §1983 Claims: Generally 3 years in WA</li>
                      <li>• Administrative complaints: Varies by agency</li>
                    </ul>
                    <p className="text-xs text-muted-foreground mt-2 italic">
                      This is general information only—consult an attorney for specific deadlines.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="your@email.com" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number (optional)</FormLabel>
                          <FormControl>
                            <Input 
                              type="tel" 
                              placeholder="(555) 555-5555" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="contactPreferredMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Contact Method</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select preference" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Phone</SelectItem>
                            <SelectItem value="either">Either is fine</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={currentStep === 1 ? onCancel : handleBack}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              {currentStep === 1 ? "Cancel" : "Back"}
            </Button>

            {currentStep < 4 ? (
              <Button type="button" onClick={handleNext}>
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Generating..." : "Generate Packet"}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
