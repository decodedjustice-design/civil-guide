import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Shield, Lock, Eye, FileText, Clock, Search, BookOpen, Scale, PenLine, HelpCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import heroImage from "@/assets/hero-private-studio.jpg";

const Index = () => {
  const { user } = useAuth();

  return (
    <Layout>
      {/* SECTION 1 — HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt=""
            className="w-full h-full object-cover"
            aria-hidden="true"
          />
          <div className="cinematic-overlay absolute inset-0" />
        </div>

        <div className="relative z-10 container max-w-4xl text-center px-6 py-32">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-white/95 leading-[1.1] tracking-tight mb-8 animate-fade-up">
            Your Truth.<br />
            Your Timeline.<br />
            Your Justice.
          </h1>

          <p className="text-lg sm:text-xl text-white/65 font-light tracking-wide mb-12 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.2s", opacity: 0 }}>
            A private, structured space to document what happened, preserve evidence, and move forward with clarity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-up" style={{ animationDelay: "0.4s", opacity: 0 }}>
            <Link
              to={user ? "/dashboard" : "/auth"}
              className="inline-flex items-center justify-center h-14 px-10 bg-primary hover:bg-maroon-light text-white font-medium text-base tracking-wide rounded transition-all duration-300 hover:shadow-lg"
            >
              {user ? "Go to Dashboard" : "Begin Your Record"}
            </Link>
            <Link
              to="/tools"
              className="inline-flex items-center justify-center h-14 px-10 border border-white/25 hover:border-white/40 text-white/80 hover:text-white font-medium text-base tracking-wide rounded transition-all duration-300"
            >
              Explore the Platform
            </Link>
          </div>

          <p className="text-sm text-white/40 tracking-widest uppercase animate-fade-in" style={{ animationDelay: "0.7s", opacity: 0 }}>
            Private · Secure · No legal promises
          </p>
        </div>
      </section>

      {/* SECTION 2 — WHY DOCUMENTATION MATTERS */}
      <section className="bg-cream py-24 sm:py-32">
        <div className="container max-w-3xl text-center px-6">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground mb-10 tracking-tight">
            Why documentation matters
          </h2>
          <div className="space-y-6 text-lg sm:text-xl text-muted-foreground leading-relaxed font-light">
            <p>
              When something happens, details fade. Witnesses move on.
              Records get harder to obtain. The clearest version of events
              is the one created closest to when they occurred.
            </p>
            <p>
              A structured, private record gives you clarity — and clarity
              creates options. Whether you pursue legal action, file a complaint,
              or simply want to preserve the truth, documentation is the foundation.
            </p>
          </div>
          <div className="w-16 h-px bg-gold/40 mx-auto mt-12" />
        </div>
      </section>

      {/* SECTION — HOW WOULD YOU LIKE TO BEGIN? */}
      <section className="bg-background py-24 sm:py-32">
        <div className="container max-w-4xl px-6">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground text-center mb-6 tracking-tight">
            How would you like to begin?
          </h2>
          <p className="text-center text-muted-foreground font-light mb-16 max-w-xl mx-auto">
            There is no wrong way to start. Choose what feels right.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Option 1: Clarion */}
            <Link
              to={user ? "/clarion" : "/auth?redirect=/clarion"}
              className="group bg-card border border-border/50 rounded-lg p-8 hover:shadow-md hover:border-gold/20 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-lg bg-secondary flex items-center justify-center mb-5 group-hover:bg-gold/10 transition-colors">
                <PenLine className="w-5 h-5 text-gold opacity-70 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl font-medium text-foreground mb-3 group-hover:text-primary transition-colors">
                Tell Your Story
              </h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed mb-6">
                Start with your own words. We'll organize it into a timeline and identify key details for you.
              </p>
              <span className="inline-flex items-center text-sm font-medium text-primary gap-1.5 group-hover:gap-2.5 transition-all">
                Start Writing
                <span className="text-primary/60">→</span>
              </span>
            </Link>

            {/* Option 2: Analyzer */}
            <Link
              to="/analyzer"
              className="group bg-card border border-border/50 rounded-lg p-8 hover:shadow-md hover:border-gold/20 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-lg bg-secondary flex items-center justify-center mb-5 group-hover:bg-gold/10 transition-colors">
                <HelpCircle className="w-5 h-5 text-gold opacity-70 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl font-medium text-foreground mb-3 group-hover:text-primary transition-colors">
                Answer Guided Questions
              </h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed mb-6">
                Prefer structure? Answer a few questions to understand your situation and possible next steps.
              </p>
              <span className="inline-flex items-center text-sm font-medium text-primary gap-1.5 group-hover:gap-2.5 transition-all">
                Use Civil Rights Analyzer
                <span className="text-primary/60">→</span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 3 — HOW DECODED JUSTICE SUPPORTS YOU */}
      <section className="bg-background py-24 sm:py-32">
        <div className="container max-w-5xl px-6">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground text-center mb-16 tracking-tight">
            How Decoded Justice supports you
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: "Private Record Journal",
                description: "A secure, chronological space to document what happened — in your own words, at your own pace.",
              },
              {
                icon: Shield,
                title: "Evidence Organizer",
                description: "Upload and categorize medical records, videos, reports, witness statements, and financial documents.",
              },
              {
                icon: Clock,
                title: "Deadline Awareness",
                description: "Surface time-sensitive information calmly, so you can make informed decisions without pressure.",
              },
              {
                icon: BookOpen,
                title: "Legal Language Decoder",
                description: "AI-powered plain-language explanations of legal documents. Educational only — never legal advice.",
              },
              {
                icon: Search,
                title: "Structured Timeline Builder",
                description: "Build a clear, chronological record of events to see the full picture and identify patterns.",
              },
              {
                icon: Lock,
                title: "Secure Dashboard",
                description: "Your private command center — evidence, notes, timeline, and preparation tools in one place.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-card border border-border/50 rounded-lg p-8 hover:shadow-md hover:border-gold/20 transition-all duration-300"
              >
                <card.icon className="w-6 h-6 text-gold mb-5 opacity-70" strokeWidth={1.5} />
                <h3 className="font-serif text-xl font-medium text-foreground mb-3">
                  {card.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-light">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — CLARITY. JUSTICE. EMPATHY. */}
      <section className="bg-cream-warm py-24 sm:py-32">
        <div className="container max-w-5xl px-6">
          <div className="grid md:grid-cols-3 gap-12 md:gap-16">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/8 flex items-center justify-center mx-auto mb-6">
                <Eye className="w-5 h-5 text-primary/70" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl font-medium text-foreground mb-4">Clarity</h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-light">
                Confusion is normal when systems are fragmented. We help you see the structure, understand the process, and organize what matters.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/8 flex items-center justify-center mx-auto mb-6">
                <Scale className="w-5 h-5 text-primary/70" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl font-medium text-foreground mb-4">Justice</h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-light">
                Every person deserves the ability to document their experience and prepare their case — regardless of resources or legal expertise.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/8 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-5 h-5 text-primary/70" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl font-medium text-foreground mb-4">Empathy</h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-light">
                This platform was built by someone who understands what it feels like. Every feature reflects that lived experience and the need for dignity.
              </p>
            </div>
          </div>
          <div className="w-16 h-px bg-gold/40 mx-auto mt-16" />
        </div>
      </section>

      {/* SECTION 5 — TRUST & PRIVACY STRIP */}
      <section className="bg-espresso-light py-12">
        <div className="container max-w-4xl px-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-center">
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-gold/60" strokeWidth={1.5} />
              <span className="text-sm text-white/50 tracking-wide">Your information remains private</span>
            </div>
            <div className="flex items-center gap-3">
              <Eye className="w-4 h-4 text-gold/60" strokeWidth={1.5} />
              <span className="text-sm text-white/50 tracking-wide">You control what you create</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-gold/60" strokeWidth={1.5} />
              <span className="text-sm text-white/50 tracking-wide">Nothing shared without consent</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — READY TO BEGIN */}
      <section className="bg-cream py-28 sm:py-36">
        <div className="container max-w-3xl text-center px-6">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground mb-10 tracking-tight leading-tight">
            Ready to begin?
          </h2>
          <p className="text-lg text-muted-foreground font-light mb-12 max-w-xl mx-auto">
            Your record is private. Your pace is yours. Start whenever you're ready.
          </p>
          <Link
            to={user ? "/dashboard" : "/auth"}
            className="inline-flex items-center justify-center h-14 px-12 bg-primary hover:bg-maroon-light text-white font-medium text-base tracking-wide rounded transition-all duration-300 hover:shadow-lg"
          >
            {user ? "Go to Dashboard" : "Begin Your Record"}
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
