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
          <div className="flex items-center justify-center gap-4 mb-12 animate-fade-in">
            <div className="w-12 h-px bg-gold/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-gold/50" />
            <div className="w-12 h-px bg-gold/40" />
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-white/95 leading-[1.1] tracking-tight mb-8 animate-fade-up">
            Your Truth.<br />
            Your Timeline.<br />
            Your Justice.
          </h1>

          <p className="text-lg sm:text-xl text-white/60 font-light tracking-wide mb-14 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.2s", opacity: 0 }}>
            A private, structured space to understand what's happening, organize your situation, and decide your next step with clarity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 animate-fade-up" style={{ animationDelay: "0.4s", opacity: 0 }}>
            <Link
              to={user ? "/dashboard" : "/auth"}
              className="inline-flex items-center justify-center h-14 px-10 bg-primary hover:bg-maroon-light text-white font-medium text-base tracking-wide rounded transition-all duration-300 hover:shadow-lg"
            >
              {user ? "Go to Dashboard" : "Get Started"}
            </Link>
            <Link
              to="/tools"
              className="inline-flex items-center justify-center h-14 px-10 border border-white/20 hover:border-white/35 text-white/70 hover:text-white font-medium text-base tracking-wide rounded transition-all duration-300"
            >
              Explore the Platform
            </Link>
          </div>

          <p className="text-xs text-white/35 tracking-[0.25em] uppercase animate-fade-in" style={{ animationDelay: "0.7s", opacity: 0 }}>
            Private · Secure · No legal promises
          </p>
        </div>
      </section>

      {/* SECTION 2 — WHAT THIS IS FOR */}
      <section className="bg-cream py-24 sm:py-32">
        <div className="container max-w-3xl text-center px-6">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground mb-10 tracking-tight">
            A Platform That Lets You Decide
          </h2>
          <div className="space-y-6 text-lg sm:text-xl text-muted-foreground leading-relaxed font-light text-left max-w-2xl mx-auto">
            <p>
              This platform is built for people dealing with police, courts, housing, child welfare, employers, medical systems, or other institutions where something doesn't feel right and clarity is hard to find.
            </p>
            <p>
              It helps you organize what feels scattered, understand what's actually happening, and move forward with a grounded decision.
            </p>
            <p className="text-foreground/80 font-normal">
              It doesn't tell you what to do — it helps you see clearly and choose your direction.
            </p>
          </div>
        </div>
      </section>

      {/* Thin divider */}
      <div className="bg-cream">
        <div className="container max-w-5xl px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        </div>
      </div>

      {/* SECTION 3 — HOW WOULD YOU LIKE TO BEGIN? */}
      <section className="bg-cream py-24 sm:py-28">
        <div className="container max-w-4xl px-6">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground text-center mb-6 tracking-tight">
            How would you like to begin?
          </h2>
          <p className="text-center text-muted-foreground font-light mb-14 max-w-xl mx-auto">
            There is no wrong way to start. Choose what feels right.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Option 1: Clarion */}
            <Link
              to={user ? "/clarion" : "/auth?redirect=/clarion"}
              className="group bg-background border border-border/60 rounded-lg p-8 hover:shadow-warm hover:border-gold/25 transition-all duration-300"
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
              className="group bg-background border border-border/60 rounded-lg p-8 hover:shadow-warm hover:border-gold/25 transition-all duration-300"
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

      {/* SECTION 4 — HOW DECODED JUSTICE SUPPORTS YOU */}
      <section className="bg-background py-24 sm:py-32">
        <div className="container max-w-5xl px-6">
          <div className="text-center mb-16">
            <div className="w-10 h-px bg-gold/40 mx-auto mb-8" />
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground tracking-tight">
              How Decoded Justice supports you
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: "Clarify Your Thoughts",
                description: "Write freely about what happened. The platform helps you organize your words into a clear, structured picture.",
              },
              {
                icon: Shield,
                title: "Understand the System",
                description: "Learn how the system you're dealing with actually works — who has power, what usually happens, and where people get stuck.",
              },
              {
                icon: Clock,
                title: "Know What's Time-Sensitive",
                description: "Surface time-sensitive information calmly, so you can make informed decisions without pressure.",
              },
              {
                icon: BookOpen,
                title: "Decode Legal Language",
                description: "AI-powered plain-language explanations of legal documents. Educational only — never legal advice.",
              },
              {
                icon: Search,
                title: "See the Full Picture",
                description: "Bring events, people, and details together in a timeline so patterns and connections become visible.",
              },
              {
                icon: Lock,
                title: "Organize Everything",
                description: "Your private space — notes, files, timeline, and tools in one place so nothing gets lost.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-cream border border-border/40 rounded-lg p-8 hover:shadow-warm hover:border-gold/20 transition-all duration-300"
              >
                <card.icon className="w-6 h-6 text-gold mb-5 opacity-60" strokeWidth={1.5} />
                <h3 className="font-serif text-lg font-medium text-foreground mb-3">
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

      {/* SECTION 5 — CLARITY. JUSTICE. EMPATHY. */}
      <section className="bg-cream-warm py-24 sm:py-32">
        <div className="container max-w-4xl px-6">
          <div className="w-10 h-px bg-gold/40 mx-auto mb-16" />
          <div className="grid md:grid-cols-3 gap-16 md:gap-12">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border border-border/50 flex items-center justify-center mx-auto mb-6">
                <Eye className="w-5 h-5 text-primary/60" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl font-medium text-foreground mb-4">Clarity</h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-light">
                When systems are fragmented, confusion is the first barrier. We help you see the structure, understand the process, and organize what matters.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border border-border/50 flex items-center justify-center mx-auto mb-6">
                <Scale className="w-5 h-5 text-primary/60" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl font-medium text-foreground mb-4">Justice</h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-light">
                Every person deserves the ability to understand their situation and organize their path forward — regardless of resources or legal expertise.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border border-border/50 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-5 h-5 text-primary/60" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl font-medium text-foreground mb-4">Empathy</h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-light">
                This platform was built by someone who understands what it feels like. Every feature reflects that lived experience and the need for dignity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — TRUST & PRIVACY STRIP */}
      <section className="bg-espresso py-10">
        <div className="container max-w-4xl px-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-center">
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-gold/50" strokeWidth={1.5} />
              <span className="text-sm text-white/45 tracking-wide font-light">Your information remains private</span>
            </div>
            <div className="flex items-center gap-3">
              <Eye className="w-4 h-4 text-gold/50" strokeWidth={1.5} />
              <span className="text-sm text-white/45 tracking-wide font-light">You control what you create</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-gold/50" strokeWidth={1.5} />
              <span className="text-sm text-white/45 tracking-wide font-light">Nothing shared without consent</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 — READY TO BEGIN */}
      <section className="bg-cream py-28 sm:py-36">
        <div className="container max-w-3xl text-center px-6">
          <div className="w-10 h-px bg-gold/40 mx-auto mb-12" />
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground mb-8 tracking-tight leading-tight">
            Ready to begin?
          </h2>
          <p className="text-lg text-muted-foreground font-light mb-12 max-w-xl mx-auto">
            Your space is private. Your pace is yours. Start whenever you're ready.
          </p>
          <Link
            to={user ? "/dashboard" : "/auth"}
            className="inline-flex items-center justify-center h-14 px-12 bg-primary hover:bg-maroon-light text-white font-medium text-base tracking-wide rounded transition-all duration-300 hover:shadow-lg"
          >
            {user ? "Go to Dashboard" : "Get Started"}
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
