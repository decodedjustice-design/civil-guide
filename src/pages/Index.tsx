import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Shield, Lock, Eye } from "lucide-react";
import heroImage from "@/assets/hero-editorial-person.jpg";

const Index = () => {
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

        <div className="relative z-10 container max-w-3xl text-center px-6 py-32">
          <p className="text-sm sm:text-base text-gold/80 tracking-[0.25em] uppercase mb-10 animate-fade-up">
            Clarity · Justice · Empathy
          </p>

          <div className="space-y-2 mb-10 animate-fade-up" style={{ animationDelay: "0.15s", opacity: 0 }}>
            <p className="font-serif text-2xl sm:text-3xl md:text-4xl text-white/90 leading-snug">
              Every voice deserves to be heard.
            </p>
            <p className="font-serif text-2xl sm:text-3xl md:text-4xl text-white/90 leading-snug">
              Every experience deserves acknowledgment.
            </p>
            <p className="font-serif text-2xl sm:text-3xl md:text-4xl text-white/85 leading-snug">
              Your story matters — and it deserves a path.
            </p>
          </div>

          <p className="text-lg text-white/50 font-light mb-12 animate-fade-up" style={{ animationDelay: "0.3s", opacity: 0 }}>
            When you're ready, begin.
          </p>

          <div className="animate-fade-up" style={{ animationDelay: "0.45s", opacity: 0 }}>
            <Link
              to="/tools"
              className="inline-flex items-center justify-center h-14 px-12 bg-primary hover:bg-maroon-light text-white font-medium text-base tracking-wide rounded transition-all duration-300 hover:shadow-lg"
            >
              Start Here
            </Link>
          </div>

          <p className="text-xs text-white/35 tracking-wide mt-8 animate-fade-in" style={{ animationDelay: "0.7s", opacity: 0 }}>
            No account required · Not legal advice · Attorney-first guidance
          </p>
        </div>
      </section>

      {/* SECTION 2 — WHAT THIS IS */}
      <section className="bg-cream py-28 sm:py-36">
        <div className="container max-w-2xl text-center px-6">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground mb-12 tracking-tight">
            What this is
          </h2>
          <div className="space-y-8 text-lg sm:text-xl text-muted-foreground leading-relaxed font-light">
            <p>
              Decoded Justice is a private civil-rights case organization platform 
              for people documenting police and constitutional violations.
            </p>
            <p>
              We provide clear guidance and structured tools to help you understand 
              what matters, organize your information, and prepare for next steps — 
              whether personal, legal, or both.
            </p>
            <div className="pt-6 border-t border-border/40 mt-10">
              <p className="text-base text-muted-foreground/70">
                We do not provide legal advice and make no promises.<br />
                We provide clarity, structure, and preparation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — THIS IS YOUR SPACE */}
      <section className="bg-espresso py-28 sm:py-36">
        <div className="container max-w-2xl text-center px-6">
          <div className="space-y-3 mb-14">
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
          <div className="space-y-6 text-lg text-white/50 leading-relaxed font-light max-w-xl mx-auto">
            <p>
              This platform helps you organize, understand, and prepare — 
              without pressure or assumptions.
            </p>
            <div className="flex flex-col gap-2 pt-4">
              <p className="text-white/45">Move at your own pace.</p>
              <p className="text-white/45">Keep control of your record.</p>
              <p className="text-white/45">Decide what comes next.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — TRUST & PRIVACY STRIP */}
      <section className="bg-cream-warm py-14">
        <div className="container max-w-4xl px-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-14 text-center">
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-gold/60" strokeWidth={1.5} />
              <span className="text-sm text-muted-foreground/70 tracking-wide">Your information remains private</span>
            </div>
            <div className="flex items-center gap-3">
              <Eye className="w-4 h-4 text-gold/60" strokeWidth={1.5} />
              <span className="text-sm text-muted-foreground/70 tracking-wide">You control what you create</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-gold/60" strokeWidth={1.5} />
              <span className="text-sm text-muted-foreground/70 tracking-wide">Nothing shared without consent</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — FINAL CTA */}
      <section className="bg-cream py-28 sm:py-36">
        <div className="container max-w-2xl text-center px-6">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground mb-12 tracking-tight leading-tight">
            When you're ready, we're here.
          </h2>
          <Link
            to="/tools"
            className="inline-flex items-center justify-center h-14 px-12 bg-primary hover:bg-maroon-light text-white font-medium text-base tracking-wide rounded transition-all duration-300 hover:shadow-lg"
          >
            Start Here
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
