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
              <p className="text-lg text-muted-foreground">
                The origin of Decoded Justice
              </p>
            </div>

            <div className="space-y-16">
              {/* 1. Simple Origin */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border">
                  How It Started
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Decoded Justice began as a personal attempt to make sense of systems that were not designed to be understood.
                  </p>
                  <p>
                    It was not created as a business or a product. It emerged from the experience of navigating housing instability, court proceedings, police encounters, child welfare involvement, and public benefits—all at once, with no coordination, no guidance, and no central place to organize what was happening.
                  </p>
                  <p>
                    There was no roadmap. So one was built.
                  </p>
                </div>
              </section>

              {/* 2. The Problem */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border">
                  The Problem
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Public systems—courts, housing authorities, police departments, child welfare agencies, public defense offices, benefits programs—do not communicate with each other. They operate independently, often with conflicting timelines, overlapping demands, and no shared understanding of your situation.
                  </p>
                  <p>
                    Each system assumes you already understand how it works. Each expects compliance without offering explanation. Each creates records that may later be used in ways you did not anticipate.
                  </p>
                  <p>
                    The result is fragmentation: scattered documents, missed deadlines, inconsistent information, and decisions made without your input or awareness.
                  </p>
                </div>
              </section>

              {/* 3. The Gap */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border">
                  What Was Missing
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    When navigating these systems, there was no central place to:
                  </p>
                  <ul className="space-y-2 pl-4">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>Understand which system you are actually in</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>Learn what typically happens next</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>Organize documents and records coherently</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>Build a timeline that makes sense</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>Access information written in plain language</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>Receive guidance that acknowledges the stress of the situation</span>
                    </li>
                  </ul>
                  <p>
                    Legal aid is limited. Attorneys are expensive. And by the time most people seek help, critical deadlines have often passed or records have already been created without their input.
                  </p>
                </div>
              </section>

              {/* 4. The Response */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border">
                  Why Decoded Justice Was Built
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    This platform was built to address that gap—not by providing legal advice, but by providing structure.
                  </p>
                  <p>
                    The goal is to help people:
                  </p>
                  <ul className="space-y-2 pl-4">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>Organize information before it becomes overwhelming</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>Understand how systems generally operate</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>Preserve records while they are still accessible</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>Reduce confusion during already difficult situations</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>Prepare for conversations with attorneys or advocates</span>
                    </li>
                  </ul>
                  <p>
                    Decoded Justice does not replace professional legal counsel. It creates a foundation so that when you do speak with an attorney, you arrive organized.
                  </p>
                </div>
              </section>

              {/* 5. The Philosophy */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border">
                  Core Beliefs
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    The philosophy behind this platform is straightforward:
                  </p>
                  <ul className="space-y-3 pl-4">
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-medium shrink-0">Clarity over chaos.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span>Understanding before reaction.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span>Structure before conflict.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span>Documentation before damage.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span>Support without exploitation.</span>
                    </li>
                  </ul>
                  <p>
                    This is not about fighting louder. It is about understanding earlier.
                  </p>
                </div>
              </section>

              {/* 6. The Mission Statement */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border">
                  The Mission
                </h2>
                <div className="p-6 rounded-xl bg-card border border-border">
                  <p className="text-foreground leading-relaxed">
                    Decoded Justice exists to provide clarity, structure, and educational resources for people navigating complex public systems—so they are not left trying to understand how things work only after harm has occurred.
                  </p>
                </div>
              </section>

              {/* 7. Closing Section */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border">
                  Why This Matters
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Most people do not learn how housing courts work until they face eviction. Most people do not understand police report processes until they are named in one. Most people do not know how child welfare investigations proceed until a caseworker is at their door.
                  </p>
                  <p>
                    This platform exists so people do not have to learn systems only after harm occurs.
                  </p>
                  <p className="text-foreground">
                    That is the purpose. Nothing more, nothing less.
                  </p>
                </div>
              </section>
            </div>

            {/* CTA */}
            <div className="text-center mt-16">
              <Button variant="outline" size="lg" asChild>
                <Link to="/about">
                  Learn About the Platform
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
