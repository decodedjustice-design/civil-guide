import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Shield, Heart, Target, Eye, ArrowRight, BookOpen, User, Home, Scale, Landmark, Building2, FileText } from "lucide-react";
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
    const scrollTo = (id: string) => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const microNavItems = [
      { label: "Start here", id: "origin" },
      { label: "Why this exists", id: "the-gap" },
      { label: "Why this platform exists", id: "how-built" },
      { label: "What it helps with", id: "the-response" },
      { label: "Explore tools", id: "continue-exploring" },
    ];

    const explorationCards = [
      { label: "Housing", description: "Understand housing systems and protections", href: "/analyzer", icon: Home },
      { label: "Police Encounters", description: "Know your rights during interactions", href: "/rights-insight", icon: Shield },
      { label: "Courts & Judges", description: "Navigate court procedures with clarity", href: "/courts-filing-info", icon: Scale },
      { label: "Government Agencies", description: "Decode agency processes and timelines", href: "/analyzer", icon: Landmark },
      { label: "Documentation Tools", description: "Organize evidence, timelines, and records", href: "/tools", icon: FileText },
    ];

    return (
      <Layout>
        {/* Micro-nav strip */}
        <div className="sticky top-[72px] z-40 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="container">
            <nav className="flex items-center gap-1 py-2.5 overflow-x-auto scrollbar-none">
              {microNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="shrink-0 px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-full transition-colors tracking-wide"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="container py-12 lg:py-20">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">
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
              <section id="origin">
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
              <section id="the-reality">
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
              <section id="human-impact">
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

              {/* Why This Platform Exists */}
              <section id="how-built">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
                  <h2 className="text-xl font-semibold text-foreground">Why This Platform Exists</h2>
                  <span className="text-xs text-primary/70 uppercase tracking-wider">Origin</span>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    While navigating housing instability, landlord abuse, social services sanctions, child support processes, and court pressure at the same time, the founder was asked to foster a young girl who had no stable home.
                  </p>
                  <p>
                    That decision brought new systems into the picture overnight — child welfare services, school officials, caseworkers, compliance requirements, and constant documentation.
                  </p>
                  <p>
                    Nothing existed to help make sense of how these systems overlapped or how to move through them clearly.
                  </p>
                  <p>
                    So she began building her own structure — notes, timelines, binders, decision sheets — anything that could turn confusion into something manageable.
                  </p>
                  <p>
                    Over time, the chaos began to organize.
                  </p>
                  <p>
                    Patterns became visible.<br />
                    Steps became clearer.<br />
                    And what once felt impossible to track started to make sense.
                  </p>
                  <p>
                    Decoded Justice grew from that process.
                  </p>
                  <p>
                    It was created in the middle of navigating real systems, not after them — with the hope that others won't have to spend as long trying to understand where to start, what matters, and how to move forward.
                  </p>
                </div>
              </section>

              {/* The Reality */}
              <section id="reality-bridge" className="py-4">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
                  <h2 className="text-xl font-semibold text-foreground">The Reality</h2>
                  <span className="text-xs text-primary/70 uppercase tracking-wider">Context</span>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Public systems rarely operate in isolation. Housing connects to employment. Schools intersect with child welfare. Courts affect benefits, transportation, and stability. A single issue can quickly expand into multiple agencies, deadlines, and expectations.
                  </p>
                  <p>
                    Most people are expected to understand:
                  </p>
                  <ul className="space-y-2 pl-4">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>what system they're in</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>what rules apply</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>what documentation matters</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>what happens next</span>
                    </li>
                  </ul>
                  <p>
                    …without ever being shown how those pieces connect.
                  </p>
                  <p>
                    When several systems are active at once, confusion becomes the default.
                  </p>
                </div>
              </section>

              {/* The Gap */}
              <section id="the-gap-detail">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
                  <h2 className="text-xl font-semibold text-foreground">The Gap</h2>
                  <span className="text-xs text-primary/70 uppercase tracking-wider">Problem</span>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Information exists, but it's scattered.
                  </p>
                  <p>
                    Legal explanations are written for professionals.<br />
                    Agency instructions assume familiarity.<br />
                    Support resources focus on one system at a time.
                  </p>
                  <p>
                    There is rarely a place where someone can:
                  </p>
                  <ul className="space-y-2 pl-4">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>understand what they're facing</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>organize what's happening</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>see how systems interact</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>move step by step instead of all at once</span>
                    </li>
                  </ul>
                  <p>
                    That gap is where people fall behind — not because they don't care, but because nothing is designed for real-life overlap.
                  </p>
                </div>
              </section>

              {/* 4. The Gap (Clarity + Justice) */}
              <section id="the-gap">
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

              {/* The Response */}
              <section id="the-response">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
                  <h2 className="text-xl font-semibold text-foreground">The Response</h2>
                  <span className="text-xs text-primary/70 uppercase tracking-wider">Solution</span>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Decoded Justice was built to bring structure to that overlap.
                  </p>
                  <p>
                    Not to replace professionals.<br />
                    Not to give legal advice.<br />
                    Not to tell people what choices to make.
                  </p>
                  <p>
                    But to help people:
                  </p>
                  <ul className="space-y-2 pl-4">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>understand their situation</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>identify what matters first</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>document effectively</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>follow clear steps</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>access deeper information only when they're ready</span>
                    </li>
                  </ul>
                  <p className="text-foreground font-medium">
                    Clarity comes before strategy.
                  </p>
                </div>
              </section>

              {/* The Philosophy */}
              <section id="philosophy">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
                  <h2 className="text-xl font-semibold text-foreground">The Philosophy</h2>
                  <span className="text-xs text-primary/70 uppercase tracking-wider">Identity</span>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Clarity reduces pressure.<br />
                    Structure reduces overwhelm.<br />
                    Understanding increases confidence.
                  </p>
                  <p>
                    People don't need more information.<br />
                    They need information that meets them where they are.
                  </p>
                  <p>
                    This platform is built on:
                  </p>
                  <ul className="space-y-2 pl-4">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                      <span>calm guidance</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                      <span>plain language</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                      <span>layered depth</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                      <span>real-world sequencing</span>
                    </li>
                  </ul>
                  <p>
                    So users can start with what's happening now, then move forward.
                  </p>
                </div>
              </section>

              {/* The Mission */}
              <section id="mission">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
                  <h2 className="text-xl font-semibold text-foreground">The Mission</h2>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Decoded Justice exists to make complex systems easier to navigate.
                  </p>
                  <p>
                    To help people:
                  </p>
                  <ul className="space-y-2 pl-4">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>see what's happening</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>know what to do next</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>protect themselves through documentation</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>move through systems with more stability</span>
                    </li>
                  </ul>
                  <p>
                    Not perfectly.<br />
                    Not instantly.<br />
                    But with more clarity than they had before.
                  </p>
                </div>
              </section>

              {/* The Purpose */}
              <section id="purpose">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
                  <h2 className="text-xl font-semibold text-foreground">The Purpose</h2>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Many people encounter housing courts, public agencies, schools, or law enforcement only when something has already gone wrong.
                  </p>
                  <p>
                    By then, expectations are high and guidance is minimal.
                  </p>
                  <p>
                    This platform exists so that when those moments happen, there is a place to begin — structured, steady, and built from lived experience rather than theory.
                  </p>
                  <p>
                    There is no perfect system.<br />
                    But there can be better tools for navigating them.
                  </p>
                </div>
              </section>
            </div>

            {/* Continue Exploring — Navigation Cards */}
            <section id="continue-exploring" className="mt-20">
              <div className="mb-8">
                <h2 className="text-2xl font-serif font-semibold text-foreground mb-2">Continue exploring</h2>
                <div className="w-12 h-px bg-gold" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {explorationCards.map((card) => (
                  <Link
                    key={card.label}
                    to={card.href}
                    className="group p-5 rounded-xl bg-card border border-border hover:border-primary/20 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                      <card.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {card.label}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {card.description}
                    </p>
                  </Link>
                ))}
              </div>
            </section>

            {/* If This Sounds Familiar — Final Entry Point */}
            <section className="mt-16">
              <div className="p-8 rounded-xl bg-secondary/30 border border-border/50 text-center">
                <h2 className="text-xl font-serif font-semibold text-foreground mb-3">
                  If this sounds familiar
                </h2>
                <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto mb-6">
                  If you're navigating housing, courts, schools, agencies, or law enforcement at the same time — start here.
                </p>
                <Button variant="default" size="lg" asChild>
                  <Link to="/tools">
                    Guided Entry
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </section>

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
