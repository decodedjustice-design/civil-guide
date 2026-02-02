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

const WASHINGTON_COUNTIES = [
  "Adams", "Asotin", "Benton", "Chelan", "Clallam", "Clark", "Columbia",
  "Cowlitz", "Douglas", "Ferry", "Franklin", "Garfield", "Grant", "Grays Harbor",
  "Island", "Jefferson", "King", "Kitsap", "Kittitas", "Klickitat", "Lewis",
  "Lincoln", "Mason", "Okanogan", "Pacific", "Pend Oreille", "Pierce", "San Juan",
  "Skagit", "Skamania", "Snohomish", "Spokane", "Stevens", "Thurston", "Wahkiakum",
  "Walla Walla", "Whatcom", "Whitman", "Yakima"
];

const ISSUE_TYPES = [
  { value: "police", label: "Police / Law Enforcement" },
  { value: "housing", label: "Housing" },
  { value: "cps_dcyf", label: "CPS / Child Welfare" },
  { value: "courts", label: "Courts / Legal Proceedings" },
  { value: "other", label: "Other" },
];

const formSchema = z.object({
  caseName: z.string().min(1, "Give your case a name").max(200),
  county: z.string().min(1, "Select your county"),
  incidentMonthYear: z.string().min(1, "When did this happen?"),
  issueType: z.string().min(1, "Select an issue type"),
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
            This is your personal, private space. Let's set it up with just the basics.
          </p>
        </div>

        {/* Wellbeing Note */}
        <div className="mb-6 p-4 rounded-xl bg-accent/5 border border-accent/20 flex items-start gap-3">
          <Heart className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground">
              Take your time. You can always update this information later, and you can pause 
              at any point. This is your space, and there's no rush.
            </p>
          </div>
        </div>

        {/* Intake Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Case Basics</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="caseName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Case Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., My CPS Case or Traffic Stop Incident" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        A short name to identify this situation—only you will see it.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="county"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>County</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your county" />
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
                      <FormLabel>When Did This Happen?</FormLabel>
                      <FormControl>
                        <Input type="month" {...field} />
                      </FormControl>
                      <FormDescription>
                        Approximate month and year is fine.
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
                      <FormLabel>What Type of Issue?</FormLabel>
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
