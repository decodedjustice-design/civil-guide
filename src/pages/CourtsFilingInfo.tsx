import { Layout } from "@/components/layout/Layout";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { 
  Scale, 
  Building2, 
  MapPin, 
  ExternalLink, 
  FileText, 
  Clock, 
  AlertCircle,
  Gavel,
  BookOpen,
  Phone,
  Globe
} from "lucide-react";

export default function CourtsFilingInfo() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background">
        <div className="container max-w-4xl py-12 px-4">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
              <Scale className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-navy mb-3">
              Courts & Filing Information
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Understanding where and how to file civil rights cases in Washington State and federal courts.
            </p>
          </div>

          {/* Prominent Disclaimer */}
          <Disclaimer variant="prominent" className="mb-10" />

          {/* Section 1: Choosing the Right Court */}
          <section className="mb-10">
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Gavel className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-navy">Choosing the Right Court</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  Civil rights cases can be filed in either federal or state court, depending on the legal claims involved. Understanding jurisdiction helps you file in the right place.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-secondary/30 border border-border/50">
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="w-5 h-5 text-primary" />
                      <h3 className="font-medium text-navy">Federal Court</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      For claims under federal law, such as Section 1983 (constitutional violations by government actors), Title VII (employment discrimination), or Fair Housing Act claims.
                    </p>
                  </div>
                  
                  <div className="p-5 rounded-xl bg-secondary/30 border border-border/50">
                    <div className="flex items-center gap-2 mb-3">
                      <Scale className="w-5 h-5 text-primary" />
                      <h3 className="font-medium text-navy">State Court</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      For claims under Washington State law, such as the Washington Law Against Discrimination (WLAD), state constitutional claims, or tort claims against state agencies.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-gold-soft/50 border border-gold/20">
                  <p className="text-sm text-navy-soft">
                    <strong>Note:</strong> Some claims can be filed in either court. If you're unsure, consider consulting with an attorney or reviewing the specific statutes that apply to your situation.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section 2: Federal Courts */}
          <section className="mb-10">
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-navy">Federal Courts (Western District of Washington)</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  The U.S. District Court for the Western District of Washington handles federal civil rights cases for western Washington, including King, Pierce, Snohomish, and surrounding counties.
                </p>

                <Accordion type="single" collapsible className="space-y-3">
                  <AccordionItem value="locations" className="border rounded-xl px-4 bg-card">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="font-medium text-navy">Courthouse Locations</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-secondary/30">
                          <h4 className="font-medium text-navy mb-2">Seattle Courthouse</h4>
                          <p className="text-sm text-muted-foreground">
                            United States Courthouse<br />
                            700 Stewart Street<br />
                            Seattle, WA 98101
                          </p>
                        </div>
                        <div className="p-4 rounded-lg bg-secondary/30">
                          <h4 className="font-medium text-navy mb-2">Tacoma Courthouse</h4>
                          <p className="text-sm text-muted-foreground">
                            Union Station Courthouse<br />
                            1717 Pacific Avenue<br />
                            Tacoma, WA 98402
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="filing" className="border rounded-xl px-4 bg-card">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="font-medium text-navy">Filing Methods</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-secondary/30">
                          <h4 className="font-medium text-navy mb-2">Electronic Filing (CM/ECF)</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            Pro se litigants may register for CM/ECF electronic filing. This allows you to file documents online 24/7.
                          </p>
                          <Button variant="outline" size="sm" asChild>
                            <a href="https://www.wawd.uscourts.gov/cm-ecf" target="_blank" rel="noopener noreferrer" className="gap-2">
                              <Globe className="w-4 h-4" />
                              CM/ECF Information
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </Button>
                        </div>
                        <div className="p-4 rounded-lg bg-secondary/30">
                          <h4 className="font-medium text-navy mb-2">Paper Filing</h4>
                          <p className="text-sm text-muted-foreground">
                            You may also file documents in person at the Clerk's Office during business hours (8:00 AM - 5:00 PM, Monday-Friday).
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="fees" className="border rounded-xl px-4 bg-card">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="font-medium text-navy">Filing Fees & Fee Waivers</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          The current filing fee for a civil case is <strong>$405</strong> (as of 2024). This includes both the filing fee and administrative fee.
                        </p>
                        <div className="p-4 rounded-lg bg-gold-soft/50 border border-gold/20">
                          <h4 className="font-medium text-navy mb-2">In Forma Pauperis (IFP)</h4>
                          <p className="text-sm text-muted-foreground">
                            If you cannot afford the filing fee, you may apply to proceed "in forma pauperis" (IFP). This requires completing a financial affidavit demonstrating financial hardship.
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="contact" className="border rounded-xl px-4 bg-card">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-primary" />
                        <span className="font-medium text-navy">Clerk's Office Contact</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          <strong>Phone:</strong> (206) 370-8400<br />
                          <strong>Hours:</strong> Monday - Friday, 8:00 AM - 5:00 PM
                        </p>
                        <Button variant="outline" size="sm" asChild>
                          <a href="https://www.wawd.uscourts.gov" target="_blank" rel="noopener noreferrer" className="gap-2">
                            <Globe className="w-4 h-4" />
                            WDWA Court Website
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="prose" className="border rounded-xl px-4 bg-card">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <span className="font-medium text-navy">Pro Se Resources</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          The court provides resources specifically for self-represented litigants, including forms, guides, and procedural information.
                        </p>
                        <Button variant="outline" size="sm" asChild>
                          <a href="https://www.wawd.uscourts.gov/sites/wawd/files/ProSeGuidetoFilingYourLawsuitinFederalCourt.pdf" target="_blank" rel="noopener noreferrer" className="gap-2">
                            <BookOpen className="w-4 h-4" />
                            Pro Se Litigant Guide (PDF)
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </section>

          {/* Section 3: Washington State Courts */}
          <section className="mb-10">
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Scale className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-navy">Washington State Courts</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Accordion type="single" collapsible className="space-y-3">
                  <AccordionItem value="superior" className="border rounded-xl px-4 bg-card">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-4 h-4 text-primary" />
                        <span className="font-medium text-navy">Superior Court</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Superior Courts are the general trial courts in Washington State. They handle civil cases with no upper limit on damages, including civil rights claims under state law.
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Each county has its own Superior Court. Filing locations and procedures may vary by county.
                        </p>
                        <Button variant="outline" size="sm" asChild>
                          <a href="https://www.courts.wa.gov/court_dir/" target="_blank" rel="noopener noreferrer" className="gap-2">
                            <MapPin className="w-4 h-4" />
                            Find Your County Court
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="district" className="border rounded-xl px-4 bg-card">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3">
                        <Gavel className="w-4 h-4 text-primary" />
                        <span className="font-medium text-navy">District & Municipal Courts</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          District and Municipal Courts are limited jurisdiction courts. They typically handle smaller civil matters (under $100,000) and are generally <strong>not</strong> the appropriate venue for civil rights claims.
                        </p>
                        <div className="p-4 rounded-lg bg-gold-soft/50 border border-gold/20">
                          <p className="text-sm text-navy-soft">
                            Most civil rights cases should be filed in Superior Court (state) or U.S. District Court (federal), not in District or Municipal Court.
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="casefinder" className="border rounded-xl px-4 bg-card">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="font-medium text-navy">Case Search & Records</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Washington Courts provides online access to case information through the Odyssey Portal.
                        </p>
                        <Button variant="outline" size="sm" asChild>
                          <a href="https://dw.courts.wa.gov/" target="_blank" rel="noopener noreferrer" className="gap-2">
                            <FileText className="w-4 h-4" />
                            WA Courts Case Search
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </section>

          {/* Section 4: Appeals */}
          <section className="mb-10">
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Scale className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-navy">Appeals Courts</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  If you receive an unfavorable ruling, you may have the right to appeal. Different courts handle appeals depending on where your case originated.
                </p>

                <div className="space-y-4">
                  <div className="p-5 rounded-xl bg-secondary/30 border border-border/50">
                    <div className="flex items-center gap-2 mb-3">
                      <Scale className="w-5 h-5 text-primary" />
                      <h3 className="font-medium text-navy">Washington Court of Appeals</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Appeals from Superior Court decisions go to the Washington Court of Appeals. There are three divisions serving different regions of the state.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://www.courts.wa.gov/appellate_trial_courts/appellatecourts/" target="_blank" rel="noopener noreferrer" className="gap-2">
                        <Globe className="w-4 h-4" />
                        Court of Appeals Info
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                  </div>

                  <div className="p-5 rounded-xl bg-secondary/30 border border-border/50">
                    <div className="flex items-center gap-2 mb-3">
                      <Gavel className="w-5 h-5 text-primary" />
                      <h3 className="font-medium text-navy">Washington Supreme Court</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      The highest state court. Reviews cases from the Court of Appeals on a discretionary basis (by petition).
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://www.courts.wa.gov/appellate_trial_courts/SupremeCourt/" target="_blank" rel="noopener noreferrer" className="gap-2">
                        <Globe className="w-4 h-4" />
                        Supreme Court Info
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                  </div>

                  <div className="p-5 rounded-xl bg-secondary/30 border border-border/50">
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="w-5 h-5 text-primary" />
                      <h3 className="font-medium text-navy">Ninth Circuit Court of Appeals</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Appeals from U.S. District Court (federal) go to the Ninth Circuit Court of Appeals, based in San Francisco.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://www.ca9.uscourts.gov" target="_blank" rel="noopener noreferrer" className="gap-2">
                        <Globe className="w-4 h-4" />
                        Ninth Circuit Info
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section 5: Helpful Tips */}
          <section className="mb-10">
            <Card className="border-border/50 shadow-sm bg-gradient-to-br from-card to-secondary/20">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-gold" />
                  </div>
                  <CardTitle className="text-xl text-navy">Helpful Tips</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border/50">
                    <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-medium text-navy mb-1">Deadlines Matter</h4>
                      <p className="text-sm text-muted-foreground">
                        Civil rights claims have strict statutes of limitations. Federal Section 1983 claims in Washington typically must be filed within 3 years. State claims may have different deadlines.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border/50">
                    <BookOpen className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-medium text-navy mb-1">Local Rules Apply</h4>
                      <p className="text-sm text-muted-foreground">
                        Each court has its own local rules in addition to state or federal rules of procedure. Review the local rules for your specific court before filing.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border/50">
                    <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-medium text-navy mb-1">Confirm Filing Location</h4>
                      <p className="text-sm text-muted-foreground">
                        Before submitting any documents, verify the correct courthouse and filing method. Some courts have specific requirements for pro se filers.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Footer Disclaimer */}
          <div className="text-center">
            <Disclaimer variant="light" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
