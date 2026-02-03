import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Shield, Heart } from "lucide-react";
import { CaseFormData } from "@/hooks/useJusticePlace";

const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "DC", label: "District of Columbia" },
];

const ISSUE_TYPES = [
  { value: "police", label: "Police / Law Enforcement" },
  { value: "courts", label: "Courts / Legal Proceedings" },
  { value: "housing", label: "Housing" },
  { value: "cps_dcyf", label: "CPS / Child Welfare" },
  { value: "medical", label: "Medical / Healthcare" },
  { value: "education", label: "Education / Schools" },
  { value: "other", label: "Other" },
];

// Only state and issue type are required
const formSchema = z.object({
  caseName: z.string().max(200).optional(),
  state: z.string().min(1, "Please select your state"),
  county: z.string().max(100).optional(),
  incidentMonthYear: z.string().optional(),
  issueType: z.string().min(1, "Please select the type of situation"),
});

interface JusticePlaceIntakeProps {
  onSubmit: (data: CaseFormData) => Promise<boolean>;
  isSubmitting: boolean;
}

export function JusticePlaceIntake({ onSubmit, isSubmitting }: JusticePlaceIntakeProps) {
  const form = useForm<CaseFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caseName: "",
      state: "",
      county: "",
      incidentMonthYear: "",
      issueType: "",
    },
  });

  const handleSubmit = async (data: CaseFormData) => {
    await onSubmit(data);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Welcome to Justice Place
          </h1>
          <p className="text-muted-foreground">
            This is your private space. We only need a few things to get started—nothing is required to continue.
          </p>
        </div>

        {/* Wellbeing Note */}
        <div className="mb-6 p-4 rounded-xl bg-accent/5 border border-accent/20 flex items-start gap-3">
          <Heart className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground">
              You can stop and return at any time. Nothing here is filed unless you choose.
            </p>
          </div>
        </div>

        {/* Intake Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Get Started</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="caseName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Case Nickname <span className="text-muted-foreground font-normal">(optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., My Situation or Traffic Stop" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        A short name to identify this—only you will see it.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State <span className="text-destructive">*</span></FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your state" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {US_STATES.map((state) => (
                            <SelectItem key={state.value} value={state.value}>
                              {state.label}
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
                  name="county"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        County <span className="text-muted-foreground font-normal">(optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., King County" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        You can add this later if you're unsure.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="issueType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What type of situation? <span className="text-destructive">*</span></FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select the main area" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ISSUE_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
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
                      <FormLabel>
                        When did this happen? <span className="text-muted-foreground font-normal">(optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="month" {...field} />
                      </FormControl>
                      <FormDescription>
                        Approximate is fine. You can update this anytime.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating Your Space..." : "Create My Justice Place"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <p className="text-xs text-center text-muted-foreground mt-6">
          This platform is for educational purposes only and does not provide legal advice.
        </p>
      </div>
    </div>
  );
}
