import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Shield, Lock, Eye, FileText, Clock, Search, Users } from "lucide-react";
import heroImage from "@/assets/hero-workspace-calm.jpg";
import documentsImage from "@/assets/hero-documents-night.jpg";
import filesImage from "@/assets/hero-organized-files.jpg";

const Index = () => {
  return (
    <Layout>
      {/* SECTION 1 — HERO (Full screen cinematic) */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt=""
            className="w-full h-full object-cover"
            aria-hidden="true"
          />
          <div className="cinematic-overlay absolute inset-0" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container max-w-4xl text-center px-6 py-32">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-white/95 leading-[1.1] tracking-tight mb-8 animate-fade-up">
            A private place to prepare your record.
          </h1>

          <div className="space-y-1 mb-12 animate-fade-up" style={{ animationDelay: "0.2s", opacity: 0 }}>
            <p className="text-lg sm:text-xl text-white/70 font-light tracking-wide">
              Document what happened.
            </p>
            <p className="text-lg sm:text-xl text-white/70 font-light tracking-wide">
              Organize your evidence.
            </p>
            <p className="text-lg sm:text-xl text-white/70 font-light tracking-wide">
              Move forward with clarity and control.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-up" style={{ animationDelay: "0.4s", opacity: 0 }}>
            <Link
              to="/auth"
              className="inline-flex items-center justify-center h-14 px-10 bg-primary hover:bg-maroon-light text-white font-medium text-base tracking-wide rounded transition-all duration-300 hover:shadow-lg"
            >
              Begin Your Record
            </Link>
            <Link
              to="/about"
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

      {/* SECTION 2 — WHAT THIS IS */}
      <section className="bg-cream py-24 sm:py-32">
        <div className="container max-w-3xl text-center px-6">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground mb-10 tracking-tight">
            What this is
          </h2>
          <div className="space-y-6 text-lg sm:text-xl text-muted-foreground leading-relaxed font-light">
            <p>
              Decoded Justice is a private civil-rights case organization platform 
              for people documenting police and constitutional violations.
            </p>
            <p>
              We provide clear guidance and structured tools to help you understand 
              what matters, organize your information, and prepare for next steps — 
              whether personal, legal, or both.
            </p>
            <div className="pt-4 border-t border-border/60 mt-8">
              <p className="text-base text-muted-foreground/80">
                We do not provide legal advice and make no promises.<br />
                We provide clarity, structure, and preparation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — THIS IS YOUR SPACE */}
      <section className="bg-espresso py-24 sm:py-32 relative overflow-hidden">
        {/* Subtle background image */}
        <div className="absolute inset-0 opacity-10">
          <img src={documentsImage} alt="" className="w-full h-full object-cover" aria-hidden="true" />
        </div>
        <div className="relative z-10 container max-w-3xl text-center px-6">
          <div className="space-y-3 mb-12">
            <p className="font-serif text-2xl sm:text-3xl md:text-4xl text-white/90 italic leading-snug">
              Your story.
            </p>
            <p className="font-serif text-2xl sm:text-3xl md:text-4xl text-white/90 italic leading-snug">
              Your timeline.
            </p>
            <p className="font-serif text-2xl sm:text-3xl md:text-4xl text-white/90 italic leading-snug">
              Your decisions.
            </p>
          </div>
          <div className="space-y-5 text-lg text-white/55 leading-relaxed font-light max-w-2xl mx-auto">
            <p>
              This platform helps you organize, understand, and prepare — 
              without pressure or assumptions.
            </p>
            <div className="flex flex-col gap-2 pt-4">
              <p className="text-white/50">Move at your own pace.</p>
              <p className="text-white/50">Keep control of your record.</p>
              <p className="text-white/50">Decide what comes next.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — PLATFORM CAPABILITIES */}
      <section className="bg-cream-warm py-24 sm:py-32">
        <div className="container max-w-5xl px-6">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground text-center mb-16 tracking-tight">
            What you can do here
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Search,
                title: "Understand what happened",
                description: "Analyze situations through structured civil-rights frameworks designed for clarity.",
              },
              {
                icon: FileText,
                title: "Organize your evidence",
                description: "Store, label, and manage documents, recordings, and files in a private vault.",
              },
              {
                icon: Clock,
                title: "Build your timeline",
                description: "Create a chronological record of events to see the full picture clearly.",
              },
              {
                icon: Shield,
                title: "Prepare for next steps",
                description: "Generate intake packets, decode legal documents, and get ready for what's ahead.",
              },
              {
                icon: Users,
                title: "Find the right support",
                description: "Search attorneys, access legal resources, and connect with relevant organizations.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="group bg-card border border-border/50 rounded-lg p-8 hover:shadow-md hover:border-gold/20 transition-all duration-300"
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

      {/* SECTION 6 — FINAL CTA */}
      <section className="relative py-28 sm:py-36 overflow-hidden">
        <div className="absolute inset-0 opacity-8">
          <img src={filesImage} alt="" className="w-full h-full object-cover" aria-hidden="true" />
        </div>
        <div className="absolute inset-0 bg-cream/95" />
        <div className="relative z-10 container max-w-3xl text-center px-6">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground mb-10 tracking-tight leading-tight">
            Start building your record with clarity.
          </h2>
          <Link
            to="/auth"
            className="inline-flex items-center justify-center h-14 px-12 bg-primary hover:bg-maroon-light text-white font-medium text-base tracking-wide rounded transition-all duration-300 hover:shadow-lg"
          >
            Begin Your Record
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
