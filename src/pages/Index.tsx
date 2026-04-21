import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import {
  FileText, Clock, Search,
  BookOpen, PenLine, FolderOpen, ArrowRight,
  Scale, Users, Shield, Wrench, Heart, Eye, Lock,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { libraryCategories } from "@/data/legalEducationLibrary";
import { categoryImages } from "@/assets/index";
import heroImage from "@/assets/hero-private-studio.jpg";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const storedRedirect = sessionStorage.getItem("auth_redirect");
      if (storedRedirect) {
        sessionStorage.removeItem("auth_redirect");
        navigate(storedRedirect, { replace: true });
      }
    }
  }, [user, navigate]);

  const previewCategories = libraryCategories.slice(0, 6);

  return (
    <Layout>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="" className="w-full h-full object-cover" aria-hidden="true" />
          <div className="cinematic-overlay absolute inset-0" />
        </div>

        <div className="relative z-10 container max-w-4xl text-center px-6 py-32">
          <div className="flex items-center justify-center gap-4 mb-12 animate-fade-in">
            <div className="w-12 h-px bg-gold/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-gold/50" />
            <div className="w-12 h-px bg-gold/40" />
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-white/95 leading-[1.25] tracking-wide mb-8 animate-fade-up">
            You deserve a clear place to sort out what happened.
          </h1>

          <p className="text-base sm:text-lg text-gold font-medium tracking-wide mb-6 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.15s", animationFillMode: "both" }}>
            You're not overreacting. You're trying to make sense of something hard.
          </p>

          <p className="text-lg sm:text-xl text-white/60 font-light tracking-wide mb-14 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
            Write down what happened, keep your documents in one place, and see your next steps one at a time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 animate-fade-up" style={{ animationDelay: "0.4s", animationFillMode: "both" }}>
            <Link
              to={user ? "/case-builder" : "/auth?redirect=/case-builder"}
              className="inline-flex items-center justify-center h-14 px-10 bg-primary hover:bg-maroon-light text-white font-medium text-base tracking-wide rounded transition-all duration-300 hover:shadow-lg"
            >
              Start organizing your experience
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center h-14 px-10 border border-white/20 hover:border-white/35 text-white/70 hover:text-white font-medium text-base tracking-wide rounded transition-all duration-300"
            >
              See how it works
            </a>
          </div>

          <p className="text-xs text-white/35 tracking-[0.25em] uppercase animate-fade-in" style={{ animationDelay: "0.7s", animationFillMode: "both" }}>
            Private · Secure · You stay in control
          </p>
        </div>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <div className="container max-w-3xl px-6 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground tracking-tight mb-5">
            Why this exists
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            When something feels wrong, it's hard to know where to start.
            <br className="hidden sm:block" /> Decoded Justice helps you slow things down, organize what happened, and understand what your options might be.
          </p>
        </div>
      </section>

      {/* ── WHAT DECODED JUSTICE DOES ── */}
      <section className="bg-background py-20 sm:py-24">
        <div className="container max-w-4xl px-6">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground tracking-tight mb-4">
              What you can do here
            </h2>
            <p className="text-muted-foreground font-light max-w-2xl mx-auto">
              Built for people in Washington who need a calmer way to sort through a hard experience.
            </p>
          </div>

          <ul className="max-w-2xl mx-auto space-y-4">
            {[
              "Write down your experience in plain words",
              "Keep evidence and notes together",
              "Learn what rights may apply in Washington",
              "Get ready to ask for support",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-foreground">
                <span className="mt-2 block w-1.5 h-1.5 rounded-full bg-primary/80" />
                <span className="text-base sm:text-lg leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CANONICAL FLOW ── */}
      <section id="how-it-works" className="bg-cream py-24 sm:py-32">
        <div className="container max-w-5xl px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground tracking-tight mb-4">
              How it works
            </h2>
            <p className="text-muted-foreground font-light max-w-xl mx-auto">
              One step at a time, so you don't have to figure everything out at once.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {[
              {
                step: 1,
                icon: PenLine,
                title: "Write what happened",
                description: "Tell your story in plain language.",
              },
              {
                step: 2,
                icon: Clock,
                title: "Build timeline",
                description: "Put events in order with dates and locations.",
              },
              {
                step: 3,
                icon: FolderOpen,
                title: "Upload evidence",
                description: "Add photos, files, records, and notes.",
              },
              {
                step: 4,
                icon: Search,
                title: "Review key issues",
                description: "Spot what might matter and what's still missing.",
              },
              {
                step: 5,
                icon: FileText,
                title: "Generate case packet",
                description: "Create a clean summary you can share when you're ready.",
              },
            ].map((item, i) => (
              <div key={item.step} className="text-center animate-fade-in" style={{ animationDelay: `${i * 150}ms`, animationFillMode: "both" }}>
                <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
                  <item.icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                </div>
                <div className="text-xs text-gold font-medium tracking-[0.2em] uppercase mb-3">Step {item.step}</div>
                <h3 className="font-serif text-xl font-medium text-foreground mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-light">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="bg-cream">
        <div className="container max-w-5xl px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        </div>
      </div>

      {/* ── WHAT YOU'LL GET ── */}
      <section className="bg-cream py-24 sm:py-28">
        <div className="container max-w-4xl px-6">
          <div className="text-center mb-14">
            <div className="w-10 h-px bg-gold/40 mx-auto mb-8" />
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground tracking-tight mb-4">
              What you'll get
            </h2>
            <p className="text-muted-foreground font-light max-w-lg mx-auto">
              By the end, you'll have something clear and useful.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              {
                icon: Clock,
                title: "Structured timeline",
                description: "A simple timeline of what happened.",
              },
              {
                icon: FolderOpen,
                title: "Organized evidence",
                description: "Files and records grouped in one place.",
              },
              {
                icon: FileText,
                title: "Shareable summary (PDF)",
                description: "A clear summary you can keep or send.",
              },
              {
                icon: BookOpen,
                title: "Something you can send to an attorney",
                description: "Clear enough for a first conversation.",
              },
            ].map((tool) => (
              <div
                key={tool.title}
                className="group bg-background border border-border/60 rounded-lg p-8 hover:shadow-warm hover:border-gold/25 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-lg bg-secondary flex items-center justify-center mb-5 group-hover:bg-gold/10 transition-colors">
                  <tool.icon className="w-5 h-5 text-gold opacity-70 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl font-medium text-foreground mb-3 group-hover:text-primary transition-colors">
                  {tool.title}
                </h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed mb-6">
                  {tool.description}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to={user ? "/case-builder" : "/auth?redirect=/case-builder"}
              className="inline-flex items-center text-sm font-medium text-primary gap-1.5 hover:gap-2.5 transition-all"
            >
              Start organizing your experience
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── LEGAL EDUCATION PREVIEW ── */}
      <section className="bg-background py-24 sm:py-32">
        <div className="container max-w-5xl px-6">
          <div className="text-center mb-14">
            <div className="w-10 h-px bg-gold/40 mx-auto mb-8" />
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground tracking-tight mb-4">
              Know your rights
            </h2>
            <p className="text-muted-foreground font-light max-w-lg mx-auto">
              Simple guides for common Washington systems, so you can understand what to expect next.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {previewCategories.map((cat, i) => {
              const Icon = cat.icon;
              const img = categoryImages[cat.id];
              return (
                <Link
                  key={cat.id}
                  to={`/guide/${cat.guideId}`}
                  className="group relative rounded-xl border border-border/60 overflow-hidden bg-card hover:shadow-warm hover:border-gold/25 hover:-translate-y-1 transition-all duration-300"
                  style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
                >
                  {img && (
                    <div className="relative h-32 overflow-hidden">
                      <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                      <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-card/80 backdrop-blur-sm flex items-center justify-center">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-medium text-foreground text-sm mb-1 group-hover:text-primary transition-colors">{cat.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{cat.subtitle}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/education-library"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View all 10 categories
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── RESOURCES & SUPPORT ── */}
      <section className="bg-cream-warm py-24 sm:py-28">
        <div className="container max-w-4xl px-6">
          <div className="text-center mb-14">
            <div className="w-10 h-px bg-gold/40 mx-auto mb-8" />
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground tracking-tight mb-4">
              When you're ready to connect
            </h2>
            <p className="text-muted-foreground font-light max-w-lg mx-auto">
              Places to find help, support, and your next step.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Scale, title: "Find Legal Help", description: "Find legal aid and attorneys.", href: "/find-help" },
              { icon: Users, title: "Support Network", description: "Find organizations, advocates, and community support.", href: "/support-network" },
              { icon: FileText, title: "Intake Packet", description: "Put your details in one packet for first meetings.", href: "/intake-packet" },
              { icon: Shield, title: "Public Records", description: "Learn how to request records and stay organized.", href: "/public-request-rights" },
              { icon: Wrench, title: "Self-Help Tools", description: "Use templates and guides to prepare.", href: "/self-help" },
              { icon: Heart, title: "Founder's Story", description: "Why this platform exists and who built it.", href: "/founders-story" },
            ].map((resource) => (
              <Link
                key={resource.title}
                to={resource.href}
                className="group flex flex-col items-center text-center p-6 rounded-lg bg-background border border-border/50 hover:shadow-warm hover:border-gold/20 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-4 group-hover:bg-gold/10 transition-colors">
                  <resource.icon className="w-5 h-5 text-gold opacity-60 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
                </div>
                <h3 className="font-medium text-foreground text-sm mb-1.5 group-hover:text-primary transition-colors">{resource.title}</h3>
                <p className="text-xs text-muted-foreground font-light leading-relaxed">{resource.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── YOUR EXPERIENCE · YOUR RIGHTS · YOUR JUSTICE ── */}
      <section className="bg-background py-24 sm:py-32">
        <div className="container max-w-4xl px-6">
          <div className="w-10 h-px bg-gold/40 mx-auto mb-16" />
          <div className="grid md:grid-cols-3 gap-16 md:gap-12">
            {[
              {
                icon: PenLine,
                title: "Your Experience",
                text: "Capture what happened in plain language, with dates, locations, and context so your account is complete and clear.",
              },
              {
                icon: Scale,
                title: "Your Rights",
                text: "Understand which Washington and federal rights may connect to your experience.",
              },
              {
                icon: Shield,
                title: "Your Justice",
                text: "Take your next step with organized records you can share if and when you choose.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-12 h-12 rounded-full border border-border/50 flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-5 h-5 text-primary/60" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-2xl font-medium text-foreground mb-4">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-light">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
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

      {/* ── FINAL CTA ── */}
      <section className="bg-cream py-28 sm:py-36">
        <div className="container max-w-3xl text-center px-6">
          <div className="w-10 h-px bg-gold/40 mx-auto mb-12" />
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground mb-8 tracking-tight leading-tight">
            Ready to begin?
          </h2>
          <p className="text-lg text-muted-foreground font-light mb-12 max-w-xl mx-auto">
            Your space is private. Your pace is yours. Start whenever you're ready.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={user ? "/case-builder" : "/auth?redirect=/case-builder"}
              className="inline-flex items-center justify-center h-14 px-12 bg-primary hover:bg-maroon-light text-white font-medium text-base tracking-wide rounded transition-all duration-300 hover:shadow-lg"
            >
              Start organizing your experience
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center h-14 px-10 border border-border/60 hover:border-primary/30 text-foreground hover:text-primary font-medium text-base tracking-wide rounded transition-all duration-300"
            >
              See how it works
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
