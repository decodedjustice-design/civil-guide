import { Link, useLocation } from "react-router-dom";
import { Shield, Heart, Target, Eye, ArrowRight, BookOpen, User } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";

export default function About() {
  const location = useLocation();
  const isFoundersStory = location.pathname === "/founders-story";
  const isWhatWeAre = location.pathname === "/what-we-are";
  const isPrivacy = location.pathname === "/privacy";
  const isTerms = location.pathname === "/terms";
  const isDisclaimerPage = location.pathname === "/disclaimer";

  // Founder's Story content
  if (isFoundersStory) {
    return (
      <Layout>
        <div className="container py-12 lg:py-20">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-6">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Founder's Story
              </h1>
              <p className="text-xl text-muted-foreground">
                Why Decoded Justice exists
              </p>
            </div>

            <div className="prose max-w-none">
              <div className="space-y-8">
                {/* Opening */}
                <div className="p-8 rounded-2xl bg-card border border-border">
                  <p className="text-muted-foreground leading-relaxed text-lg mb-4">
                    Decoded Justice did not begin as a company.
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-lg font-medium">
                    It began when the systems that were supposed to act simply did not.
                  </p>
                </div>

                {/* The Story */}
                <div className="space-y-6 text-muted-foreground leading-relaxed">
                  <p>
                    After a landlord refused rental assistance and pursued eviction, the founder and her family were pushed into homelessness and into Washington's shelter and coordinated entry system. What should have been an organized path to stability became a maze of lost assessments, changing case managers, and rules that were never clearly explained.
                  </p>

                  <p>
                    While they were still living in shelter, police shot her partner with a so-called "less-lethal" weapon, nearly killing him and leaving lasting injuries. The criminal case that followed came directly from that incident. He was assigned counsel. On paper, he was represented.
                  </p>

                  <div className="p-6 rounded-xl bg-secondary/30 border border-border my-8">
                    <p className="text-foreground font-medium mb-4">In reality, nothing happened.</p>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>His attorneys did not investigate.</li>
                      <li>They did not challenge the record.</li>
                      <li>They did not file motions.</li>
                      <li>They did not respond.</li>
                    </ul>
                  </div>

                  <p className="text-foreground font-medium">
                    When the people responsible for protecting his rights failed to act, there was only one option left: she had to learn the system herself.
                  </p>

                  <p>
                    At the same time, life did not pause. His incarceration triggered the loss of household benefits and automatic child support actions, despite his inability to earn income. Housing instability continued. A housing voucher finally arrived more than a year into shelter living, only to bring new harm—landlord harassment, resistance to the voucher, and repeated illegal eviction attempts.
                  </p>

                  <p>
                    Then another system entered her home.
                  </p>

                  <p>
                    A fourteen-year-old was left in her care. She chose to protect the child, and Child Protective Services became part of her life overnight. Expectations were immediate. Guidance was minimal. Consequences were enormous.
                  </p>

                  <div className="p-6 rounded-xl bg-muted/30 border border-border my-8">
                    <p className="text-foreground font-medium mb-3">Housing. Shelters. Police. Courts. Public defense. Child welfare. Public benefits.</p>
                    <p className="text-muted-foreground">
                      Each system operated independently. Each demanded compliance. None explained how to navigate.
                    </p>
                    <div className="mt-4 space-y-1 text-muted-foreground">
                      <p>There was no roadmap.</p>
                      <p>There was no coordination.</p>
                      <p>There was no margin for error.</p>
                      <p className="text-foreground font-medium">Consequences were life changing.</p>
                    </div>
                  </div>

                  <p className="text-lg text-foreground font-medium">
                    So she built what was missing.
                  </p>

                  <p>
                    Late at night, without help or training, she began documenting everything: timelines that aligned police reports, court dates and deadlines, agency actions, documents and evidence structures, public requests, structured records that turned scattered paperwork into coherent narratives.
                  </p>

                  <p>
                    She did not study law because she wanted to. She learned it because life demanded it of her.
                  </p>

                  <p className="text-muted-foreground italic border-l-4 border-primary/30 pl-4">
                    She learned the system too late to protect the person she was trying to save—but not too late to recognize the tipping scales and build something that will be ready when the next person needs it.
                  </p>
                </div>

                {/* Mission */}
                <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Decoded Justice exists to prevent that silence from happening to others.</h2>
                  
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    This platform does not provide legal advice. That responsibility belongs to attorneys.
                  </p>
                  
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Decoded Justice provides clarity, structure, and preparation—so people are not left trying to understand the law for the first time at the moment that hurts the most.
                  </p>

                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      Which system you are in
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      What usually happens next
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      How to prepare for the actions coming
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      What information actually matters
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      How to preserve your story before it is overwritten
                    </li>
                  </ul>
                </div>

                {/* Values */}
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    Decoded Justice is not about fighting louder.
                  </p>
                  <p className="text-foreground font-medium text-lg">
                    It is about understanding earlier.
                  </p>
                </div>

                {/* Positioning */}
                <div className="text-center py-8">
                  <p className="text-2xl md:text-3xl font-bold text-foreground">
                    Clarity in the chaos.
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">
                    Justice when systems fail.
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">
                    Empathy at every step.
                  </p>
                  <p className="text-muted-foreground mt-6">
                    That is what is being built here.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <Button variant="hero" size="lg" asChild>
                <Link to="/about">
                  Learn About Our Mission
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <Disclaimer className="justify-center" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // What We Are content (also shown on /what-we-are route)
  if (isWhatWeAre) {
    return (
      <Layout>
        <div className="container py-12 lg:py-20">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-6">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                What This Platform Is
              </h1>
            </div>

            <section className="mb-16 grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  What We Are
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    An educational resource platform
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    A preparation and organization tool
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    A calm, supportive space for understanding
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    A guide to help you find proper resources
                  </li>
                </ul>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  What We Are Not
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                    A law firm or legal service
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                    A source of legal advice
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                    A replacement for professional counsel
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                    A guarantee of any outcome
                  </li>
                </ul>
              </div>
            </section>

            <div className="text-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/about">
                  View Full Mission
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <Disclaimer className="justify-center" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Privacy, Terms, Disclaimer pages - simple placeholders
  if (isPrivacy || isTerms || isDisclaimerPage) {
    const pageTitle = isPrivacy ? "Privacy & Security" : isTerms ? "Terms of Service" : "Disclaimer";
    return (
      <Layout>
        <div className="container py-12 lg:py-20">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-6">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {pageTitle}
              </h1>
            </div>

            <div className="p-8 rounded-2xl bg-card border border-border mb-8">
              <p className="text-muted-foreground leading-relaxed mb-6">
                <strong className="text-foreground">Educational Use Only.</strong> Decoded Justice is not a law firm 
                and does not provide legal advice. The information provided on this platform is for educational 
                purposes only and should not be construed as legal advice.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                For legal concerns, please consult with a qualified attorney. Nothing on this platform creates 
                an attorney-client relationship.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We take your privacy seriously. Any information you enter into our tools is stored securely 
                and is only accessible by you. We do not share your data with third parties.
              </p>
            </div>

            <div className="text-center">
              <Button variant="outline" size="lg" asChild>
                <Link to="/about">
                  Back to About
                </Link>
              </Button>
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <Disclaimer className="justify-center" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Main About page
  return (
    <Layout>
      <div className="container py-12 lg:py-20">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              About Decoded Justice
            </h1>
            <p className="text-xl text-muted-foreground">
              A supportive space to regain clarity, organize what matters, and move forward with purpose.
            </p>
          </div>

          {/* Mission */}
          <section className="mb-16">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Our Mission</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Decoded Justice exists to replace confusion and helplessness with understanding and knowledge. 
                We believe that everyone deserves access to clear, calm, and supportive educational resources 
                when navigating potential civil rights, accountability, or justice-system issues — at their own pace, on their terms.
              </p>
            </div>
          </section>

          {/* What We Are / Are Not */}
          <section className="mb-16 grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                What We Are
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  An educational resource platform
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  A preparation and organization tool
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  A calm, supportive space for understanding
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  A guide to help you find proper resources
                </li>
              </ul>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                What We Are Not
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                  A law firm or legal service
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                  A source of legal advice
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                  A replacement for professional counsel
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                  A guarantee of any outcome
                </li>
              </ul>
            </div>
          </section>

          {/* Values - Positioning Statement */}
          <section className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Clarity. Justice. Empathy.
              </h2>
              <p className="text-muted-foreground">Our guiding principles</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "Clarity", description: "Replace confusion with understanding. Know where you stand and what your options are." },
                { title: "Organization", description: "Keep evidence, timelines, and notes in one secure, accessible place." },
                { title: "Preparation", description: "Be ready for conversations with attorneys, agencies, and oversight bodies." },
                { title: "Orientation", description: "Understand how systems work before you engage with them." },
              ].map((value) => (
                <div key={value.title} className="p-5 rounded-xl bg-secondary/30 border border-border/50">
                  <h3 className="font-medium text-foreground mb-1">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Trauma-Aware */}
          <section className="mb-16">
            <div className="p-6 rounded-2xl bg-muted/30 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-6 h-6 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Trauma-Aware Design</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                We understand that navigating these situations can be difficult and emotionally taxing. 
                That's why every aspect of Decoded Justice is designed to be calm, supportive, and respectful of your pace. 
                You can pause, skip sections, or return later — this platform will be here when you're ready.
              </p>
            </div>
          </section>

          {/* CTA */}
          <div className="text-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/founders-story">
                Read the Founder's Story
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="mt-12 pt-8 border-t border-border">
            <Disclaimer className="justify-center" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
