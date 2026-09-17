import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ArrowRight, Clock, FileText, FolderOpen, Search, Users, Scale, Shield, Wrench, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { libraryCategories } from "@/data/legalEducationLibrary";
import { categoryImages } from "@/assets/index";
import heroImage from "@/assets/hero-private-studio.jpg";
import { LegalGate } from "@/components/LegalGate";

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
  const startCaseUrl = user ? "/case-builder" : "/auth?redirect=/case-builder";

  const issueAreas = [
    { title: "Civil Rights", detail: "Discrimination · Government action · Accessibility" },
    { title: "Child Welfare", detail: "DCYF · Dependency · Placement · Caregiver issues" },
    { title: "Housing", detail: "Tenant issues · Discrimination · Accommodations" },
    { title: "Disability", detail: "ADA · Section 504 · Accommodations · Accessibility" },
    { title: "Law Enforcement", detail: "Encounters · Reports · Evidence · Communications" },
    { title: "Public Records", detail: "Requests · Deadlines · Responses · Missing records" },
    { title: "Education", detail: "School records · Accessibility · Discrimination" },
    { title: "Benefits & Services", detail: "Agency decisions · Notices · Applications · Appeals" },
  ];

  const resources = [
    { icon: Scale, title: "Find Legal Help", description: "Attorney search and legal aid resources.", href: "/find-help" },
    { icon: Users, title: "Support Network", description: "Organizations, advocates, and community resources.", href: "/support-network" },
    { icon: FileText, title: "Intake Packet", description: "Prepare a structured inquiry for attorney consultations.", href: "/intake-packet" },
    { icon: Shield, title: "Public Records", description: "Understand and organize public records requests.", href: "/public-request-rights" },
    { icon: Wrench, title: "Self-Help Tools", description: "Templates, guides, and preparation resources.", href: "/self-help" },
    { icon: Heart, title: "Founder's Story", description: "Why this platform exists and who built it.", href: "/founders-story" },
  ];

  return (
    <Layout>
      <main className="bg-background">
        <section className="relative min-h-[76vh] flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <img src={heroImage} alt="" className="w-full h-full object-cover" aria-hidden="true" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,18,27,0.88)_0%,rgba(37,20,29,0.72)_48%,rgba(15,18,27,0.45)_100%)]" />
            <div className="absolute inset-0 bg-black/15" />
          </div>

          <div className="relative z-10 container max-w-6xl px-6 py-20 sm:py-24">
            <div className="max-w-4xl">
              <p className="text-[11px] sm:text-xs uppercase tracking-[0.28em] text-gold/90 mb-6">Decoded Justice · Washington State</p>
              <div className="w-16 h-px bg-gold/45 mb-7" />
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-white leading-[1.05] tracking-tight max-w-3xl">
                Clarity for complicated situations.
              </h1>
              <p className="mt-7 text-lg sm:text-xl text-white/72 font-light leading-relaxed max-w-2xl">
                A Washington-focused platform for understanding what happened, organizing what matters, and identifying issues worth investigating.
              </p>

              <div className="mt-9 flex flex-col sm:flex-row gap-3">
                <Link
                  to={startCaseUrl}
                  className="inline-flex items-center justify-center gap-2 h-13 px-7 bg-primary hover:bg-maroon-light text-white font-medium tracking-wide rounded-sm transition-all duration-300 hover:shadow-lg"
                >
                  Begin Your Case
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/education-library"
                  className="inline-flex items-center justify-center h-13 px-7 border border-white/25 hover:border-white/45 text-white/80 hover:text-white font-medium tracking-wide rounded-sm transition-all duration-300"
                >
                  Explore the Washington Guide
                </Link>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 text-[11px] uppercase tracking-[0.2em] text-white/45">
                <span>Clarity</span>
                <span className="hidden sm:block h-3 w-px bg-white/15" />
                <span>Empathy</span>
                <span className="hidden sm:block h-3 w-px bg-white/15" />
                <span>Justice</span>
              </div>

              <div className="mt-8 max-w-md">
                <LegalGate />
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border/60 bg-background">
          <div className="container max-w-6xl px-6 py-7 grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/60">
            {[
              ["01", "UNDERSTAND", "Make complicated information easier to understand."],
              ["02", "ORGANIZE", "Bring evidence, records, timelines, and communications together."],
              ["03", "PREPARE", "Create organized materials you can use for self-advocacy or legal support."],
            ].map(([number, title, description]) => (
              <div key={number} className="py-4 md:py-1 md:px-8 first:pl-0 last:pr-0">
                <div className="text-[10px] tracking-[0.22em] text-gold uppercase mb-2">{number}</div>
                <h2 className="font-serif text-xl font-medium tracking-tight text-foreground mb-2">{title}</h2>
                <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-sm">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-cream py-20 sm:py-24">
          <div className="container max-w-6xl px-6">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-gold mb-3">Washington-specific areas</p>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-foreground max-w-xl">
                  A structured place to work through the systems people encounter most.
                </h2>
              </div>
              <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-md lg:text-right">
                Start with the issue area closest to your experience. Decoded Justice helps you organize facts and identify questions without assuming a legal conclusion.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-border/60">
              {issueAreas.map((area, index) => (
                <div key={area.title} className="min-h-36 border-r border-b border-border/60 p-6 sm:p-7 bg-cream hover:bg-background/70 transition-colors duration-300">
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-[10px] tracking-[0.2em] text-muted-foreground/65">0{index + 1}</span>
                    <span className="h-px w-7 bg-gold/35" />
                  </div>
                  <h3 className="font-serif text-xl font-medium text-foreground mb-2">{area.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{area.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-background py-20 sm:py-24">
          <div className="container max-w-6xl px-6">
            <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16 items-start">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-gold mb-3">Your case, in one place</p>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-foreground mb-5">
                  Your story doesn't have to be organized before you begin.
                </h2>
                <p className="text-base text-muted-foreground font-light leading-relaxed max-w-lg">
                  Start with what you know. Add what you discover. Build the record as you go.
                </p>
              </div>

              <div className="border border-border/70 bg-card shadow-warm-sm">
                <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">Case workspace</p>
                    <h3 className="font-serif text-2xl font-medium mt-1">My Case</h3>
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-gold">Structured record</div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-y divide-border/60">
                  {[
                    ["Timeline", "24 events", Clock],
                    ["Evidence", "18 exhibits", FolderOpen],
                    ["Issues", "7 identified", Search],
                    ["Communications", "31 entries", Users],
                    ["Records Requests", "4 active", FileText],
                    ["Documents", "46 files", FileText],
                  ].map(([label, value, Icon]) => (
                    <div key={String(label)} className="p-5">
                      <Icon className="w-4 h-4 text-gold/80 mb-4" strokeWidth={1.5} />
                      <p className="text-sm font-medium text-foreground">{label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-5 bg-secondary/40 border-t border-border/60">
                  <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    <span>Story</span><span>→</span><span>Timeline</span><span>→</span><span>Record</span><span>→</span><span>Issues</span><span>→</span><span>Evidence</span><span>→</span><span>Case Packet</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-cream-warm py-20 sm:py-24">
          <div className="container max-w-6xl px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <p className="text-[10px] uppercase tracking-[0.22em] text-gold mb-3">Know the landscape</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-foreground mb-4">Washington legal education</h2>
              <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                Plain-language guides for the systems people encounter most. Learn how a process works, what questions to ask, and what information may matter.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {previewCategories.map((cat) => {
                const Icon = cat.icon;
                const img = categoryImages[cat.id];
                return (
                  <Link key={cat.id} to={`/guide/${cat.guideId}`} className="group border border-border/60 bg-background/80 hover:bg-background hover:border-gold/30 transition-all duration-300 overflow-hidden">
                    {img && (
                      <div className="relative h-28 overflow-hidden">
                        <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/15 to-transparent" />
                        <div className="absolute left-4 bottom-3 w-8 h-8 border border-white/25 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-serif text-lg font-medium text-foreground mb-1 group-hover:text-primary transition-colors">{cat.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{cat.subtitle}</p>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="text-center mt-8">
              <Link to="/education-library" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                View all Washington guides <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-background py-20 sm:py-24">
          <div className="container max-w-6xl px-6">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-10">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-gold mb-3">When you're ready to connect</p>
                <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-foreground">Tools and support beyond the workspace.</h2>
              </div>
              <p className="text-sm text-muted-foreground font-light max-w-md">Organize first. Then decide what kind of help or next step makes sense for you.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-border/60">
              {resources.map((resource) => {
                const Icon = resource.icon;
                return (
                  <Link key={resource.title} to={resource.href} className="border-r border-b border-border/60 p-6 bg-background hover:bg-secondary/30 transition-colors duration-300 group">
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <Icon className="w-5 h-5 text-gold/80 mb-6" strokeWidth={1.5} />
                        <h3 className="font-serif text-xl font-medium text-foreground group-hover:text-primary transition-colors">{resource.title}</h3>
                        <p className="text-sm text-muted-foreground font-light leading-relaxed mt-2">{resource.description}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-primary text-primary-foreground py-16 sm:py-20">
          <div className="container max-w-4xl px-6 text-center">
            <p className="text-[10px] uppercase tracking-[0.28em] text-gold/90 mb-5">Clarity · Empathy · Justice</p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight">Start with what you know.</h2>
            <p className="mt-5 text-white/70 font-light max-w-xl mx-auto leading-relaxed">You do not need the whole story perfectly organized before you begin building the record.</p>
            <div className="mt-8">
              <Link to={startCaseUrl} className="inline-flex items-center gap-2 h-12 px-7 bg-white text-primary hover:bg-white/90 font-medium rounded-sm transition-colors">
                Begin Your Case <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="mt-7 text-[11px] text-white/45">Washington-focused information and organizational tools. Not legal advice.</p>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Index;
