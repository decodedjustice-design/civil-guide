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
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why This Platform Exists
              </h1>
              <div className="flex items-center justify-center gap-3 text-primary text-sm tracking-wide mt-4">
                <span>Clarity</span>
                <span className="w-1 h-1 rounded-full bg-primary" />
                <span>Justice</span>
                <span className="w-1 h-1 rounded-full bg-primary" />
                <span>Empathy</span>
              </div>
            </div>

            <div className="space-y-14">
              {/* 1. Origin (Clarity) */}
              <section>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
                  <h2 className="text-xl font-semibold text-foreground">Origin</h2>
                  <span className="text-xs text-primary/70 uppercase tracking-wider">Clarity</span>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Decoded Justice began when one person could not find a single place that explained how the systems affecting their life actually worked.
                  </p>
                  <p>
                    It was not a business idea. It was not a product concept. It started as an attempt to organize scattered information—court filings, agency letters, case numbers, deadlines—into something that made sense.
                  </p>
                  <p>
                    The confusion was not personal failure. It was structural. The systems were designed without coordination, without explanation, without a map.
                  </p>
                  <p>
                    So one was built.
                  </p>
                </div>
              </section>

              {/* 2. The Reality (Justice) */}
              <section>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
                  <h2 className="text-xl font-semibold text-foreground">The Reality</h2>
                  <span className="text-xs text-primary/70 uppercase tracking-wider">Justice</span>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Public systems—courts, housing authorities, police departments, child welfare agencies, public defense offices, benefits programs—do not operate as a unified structure. They run independently. They do not share information. They do not coordinate timelines.
                  </p>
                  <p>
                    Each system assumes you already understand how it works. Each expects compliance without providing explanation. Each creates records that may be used later in ways you did not anticipate.
                  </p>
                  <p>
                    Power is distributed unevenly. Institutions have staff, attorneys, and established procedures. Most people navigating these systems have none of those resources.
                  </p>
                  <p>
                    This is not a conspiracy. It is structural design. And that design produces consistent outcomes: confusion, delay, missed deadlines, and decisions made without informed participation.
                  </p>
                </div>
              </section>

              {/* 3. The Human Impact (Empathy) */}
              <section>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
                  <h2 className="text-xl font-semibold text-foreground">The Human Impact</h2>
                  <span className="text-xs text-primary/70 uppercase tracking-wider">Empathy</span>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    What does this actually feel like?
                  </p>
                  <p>
                    It feels like receiving mail you do not fully understand. It feels like deadlines that passed before you knew they existed. It feels like being spoken to in language designed for professionals, not for you.
                  </p>
                  <p>
                    It feels like overwhelm. Isolation. Fear of making the wrong choice. Fear of saying the wrong thing. Fear that one mistake will cascade into something you cannot undo.
                  </p>
                  <p>
                    And often, it feels like shame—because the confusion gets internalized as personal failure, when it is actually system failure.
                  </p>
                  <p>
                    This platform does not forget that reality. Every design decision accounts for it.
                  </p>
                </div>
              </section>

              {/* 4. The Gap (Clarity + Justice) */}
              <section>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
                  <h2 className="text-xl font-semibold text-foreground">The Gap</h2>
                  <span className="text-xs text-primary/70 uppercase tracking-wider">Clarity + Justice</span>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    When navigating these systems, there was no central resource to:
                  </p>
                  <ul className="space-y-2 pl-4">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>Explain which system you are actually in and how it typically operates</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>Organize documents, records, and communications coherently</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>Build a timeline of events that makes chronological sense</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>Access plain-language explanations written for clarity, not for legal professionals</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>Receive guidance that acknowledges the emotional weight of the situation</span>
                    </li>
                  </ul>
                  <p>
                    Legal aid is limited. Attorneys are expensive. And by the time most people seek help, critical deadlines have passed or records have been created without their input.
                  </p>
                  <p>
                    The gap was not access to legal advice. The gap was access to understanding—before crisis.
                  </p>
                </div>
              </section>

              {/* 5. The Response (Clarity + Empathy) */}
              <section>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
                  <h2 className="text-xl font-semibold text-foreground">The Response</h2>
                  <span className="text-xs text-primary/70 uppercase tracking-wider">Clarity + Empathy</span>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Decoded Justice was built to address that gap.
                  </p>
                  <p>
                    Not to provide legal advice. Not to replace attorneys. Not to promise outcomes.
                  </p>
                  <p>
                    But to provide structure. To help people:
                  </p>
                  <ul className="space-y-2 pl-4">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>Organize information before it becomes overwhelming</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>Understand how systems generally operate before having to navigate them</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>Preserve records while they are still accessible</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>Prepare for conversations with attorneys, advocates, or officials</span>
                    </li>
                  </ul>
                  <p>
                    The platform was designed to reduce confusion—not to add another layer of complexity to an already difficult situation.
                  </p>
                </div>
              </section>

              {/* 6. The Philosophy (Identity Pillars) */}
              <section>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
                  <h2 className="text-xl font-semibold text-foreground">The Philosophy</h2>
                  <span className="text-xs text-primary/70 uppercase tracking-wider">Identity</span>
                </div>
                <div className="space-y-6 text-muted-foreground leading-relaxed">
                  <div className="p-5 rounded-lg bg-card border border-border">
                    <h3 className="font-semibold text-foreground mb-2">Clarity as Protection</h3>
                    <p>
                      When you understand what is happening, you are less vulnerable to being misled. When you can see the structure, you can navigate it. Clarity is not a luxury—it is a form of protection.
                    </p>
                  </div>
                  <div className="p-5 rounded-lg bg-card border border-border">
                    <h3 className="font-semibold text-foreground mb-2">Justice as Access to Understanding</h3>
                    <p>
                      Justice is not only what happens in courtrooms. It begins with whether people can understand the systems that govern their lives. If information is inaccessible, the system is not just. Access to understanding is a prerequisite to any meaningful participation.
                    </p>
                  </div>
                  <div className="p-5 rounded-lg bg-card border border-border">
                    <h3 className="font-semibold text-foreground mb-2">Empathy as Design Principle</h3>
                    <p>
                      This platform was built with the assumption that users may be stressed, afraid, or exhausted. Every interface, every instruction, every piece of content is designed with that reality in mind. Empathy is not a tone—it is a structural commitment.
                    </p>
                  </div>
                </div>
              </section>

              {/* 7. The Mission */}
              <section>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
                  <h2 className="text-xl font-semibold text-foreground">The Mission</h2>
                </div>
                <div className="p-6 rounded-xl bg-card border border-border">
                  <p className="text-foreground leading-relaxed">
                    Decoded Justice exists to provide clarity, structure, and educational resources for people navigating complex public systems—so they can understand what is happening, organize their information, and prepare for what comes next.
                  </p>
                </div>
              </section>

              {/* 8. Purpose Statement */}
              <section>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
                  <h2 className="text-xl font-semibold text-foreground">The Purpose</h2>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Most people do not learn how housing courts work until they face eviction. Most people do not understand police report processes until they are named in one. Most people do not know how child welfare investigations proceed until a caseworker arrives at their door.
                  </p>
                  <p>
                    By then, critical deadlines may have passed. Records may already exist. Decisions may have been made.
                  </p>
                  <p className="text-foreground font-medium">
                    This platform exists so people do not have to learn systems only after harm occurs.
                  </p>
                  <p className="text-sm text-muted-foreground pt-4 italic">
                    That is the purpose. Nothing more. Nothing less.
                  </p>
                </div>
              </section>
            </div>

            {/* CTA */}
            <div className="text-center mt-16">
              <Button variant="outline" size="lg" asChild>
                <Link to="/tools">
                  Explore the Tools
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
