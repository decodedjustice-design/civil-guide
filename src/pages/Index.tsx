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

  const startCaseUrl = user ? "/case-builder" : "/auth?redirect=/case-builder";

  const issueAreas = [
    { title: "Civil Rights", detail: "Discrimination · Government action · Accessibility" },
    { title: "Law Enforcement", detail: "Encounters · Stops · Searches · Records" },
    { title: "Child Welfare", detail: "DCYF · Dependency · Placement · Caregiver issues" },
    { title: "Housing", detail: "Tenant issues · Discrimination · Accommodations" },
    { title: "Disability", detail: "ADA · Section 504 · Accommodations · Accessibility" },
    { title: "Public Records", detail: "Requests · Deadlines · Responses · Missing records" },
    { title: "Education", detail: "School records · Accessibility · Discrimination" },
    { title: "Benefits & Services", detail: "Agency decisions · Notices · Applications · Appeals" },
  ];

  const workspace = [
    ["Timeline", "Record what happened and when.", Clock],
    ["Evidence", "Organize documents and supporting records.", FolderOpen],
    ["Issues", "Track questions and potential issues to investigate.", Search],
    ["People & Organizations", "Keep everyone and every agency connected to the case.", Users],
    ["Communications", "Keep calls, emails, messages, and notices together.", FileText],
    ["Records Requests", "Track requests, responses, deadlines, and missing records.", FileText],
  ];

  const guides = [
    { title: "Police Encounters", description: "Know your rights during stops, searches, and arrests.", guideId: "police-encounters" },
    { title: "Traffic Stops", description: "What happens during a traffic stop and what you can do.", guideId: "traffic-stops" },
    { title: "Courts & Judicial Process", description: "How courts work, what to expect, and how to prepare.", guideId: "courts-judicial-process" },
    { title: "Housing Rights", description: "Tenant protections, eviction process, and fair housing.", guideId: "housing-rights" },
    { title: "Disability Rights", description: "Accommodations, access, and protections under the law.", guideId: "disability-rights" },
    { title: "Protest Rights", description: "First Amendment protections and how to exercise them safely.", guideId: "protest-rights" },
  ];

  const resources = [
    { icon: Scale, title: "Find Legal Help", description: "Attorney search and legal aid resources.", href: "/find-help" },
    { icon: Users, title: "Support Network", description: "Organizations, advocates, and community resources.", href: "/support-network" },
    { icon: FileText, title: "Intake Packet", description: "Prepare an organized inquiry for legal or advocacy support.", href: "/intake-packet" },
    { icon: Shield, title: "Public Records", description: "Learn how to request and organize government records.", href: "/public-request-rights" },
    { icon: Wrench, title: "Self-Help Tools", description: "Templates, guides, and preparation resources.", href: "/self-help" },
    { icon: Heart, title: "Founder's Story", description: "Why Decoded Justice exists.", href: "/founders-story" },
  ];

  return (
    <Layout>
      <main className="bg-background">
        <section className="relative min-h-[76vh] flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <img src={heroImage} alt="" className="w-full h-full object-cover" aria-hidden="true" />
          </div>
          <div className="relative z-10 container max-w-6xl px-6 py-20 sm:py-24 text-center">
            <div className="max-w-4xl">
              <p className="text-[11px] sm:text-xs uppercase tracking-[0.28em] text-gold/90 mb-6">Decoded Justice · Washington State</p>
              <div className="w-16 h-px bg-gold/60 mb-7 mx-auto" />
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-white leading-[1.05] tracking-tight max-w-3xl mx-auto drop-shadow-lg">Clarity. Empathy. Justice.</h1>
              <p className="mt-5 text-2xl sm:text-3xl font-serif text-white max-w-2xl mx-auto drop-shadow-md">Your story. Your voice. Your justice.</p>
              <p className="mt-6 text-lg sm:text-xl text-white/95 font-light leading-relaxed max-w-2xl mx-auto drop-shadow-md">A Washington-focused platform that helps you understand what happened, organize what matters, identify questions worth investigating, and build a clear record of your case.</p>
              <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
                <Link to={startCaseUrl} className="inline-flex items-center justify-center gap-2 h-13 px-7 bg-primary hover:bg-maroon-light text-white font-medium tracking-wide rounded-sm transition-all duration-300 hover:shadow-lg">Start Your Case <ArrowRight className="w-4 h-4" /></Link>
                <Link to="/education-library" className="inline-flex items-center justify-center h-13 px-7 border border-white/25 hover:border-white/45 text-white/80 hover:text-white font-medium tracking-wide rounded-sm transition-all duration-300">Explore the Washington Guide</Link>
              </div>
              <div className="mt-8 max-w-md mx-auto"><LegalGate /></div>
            </div>
          </div>
        </section>

        <section className="border-b border-border/60 bg-background">
          <div className="container max-w-6xl px-6 py-7 grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/60">
            {[
              ["01", "UNDERSTAND", "Make complicated laws, notices, records, and processes easier to understand."],
              ["02", "ORGANIZE", "Bring your story, timeline, evidence, communications, and records into one case workspace."],
              ["03", "PREPARE", "Turn what you know into an organized case record and materials for your next step."],
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
                <p className="text-[10px] uppercase tracking-[0.22em] text-gold mb-3">How you use Decoded Justice</p>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-foreground max-w-xl">Start with what happened. Build from there.</h2>
              </div>
              <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-md lg:text-right">You do not need to know the legal terminology or have everything organized before you begin.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-border/60">
              {[
                ["01", "TELL YOUR STORY", "Describe what happened, who was involved, when it happened, and what you want to understand."],
                ["02", "BUILD YOUR RECORD", "Add documents, evidence, communications, people, agencies, and events as you gather them."],
                ["03", "EXPLORE QUESTIONS", "Use guided tools to identify important facts, missing information, and issues worth investigating."],
                ["04", "PREPARE YOUR NEXT STEP", "Organize the record into a clearer case file and structured materials for advocacy or legal support."],              ].map(([number, title, description]) => (
                <div key={number} className="min-h-48 border-r border-b border-border/60 p-6 sm:p-7 bg-cream hover:bg-background/70 transition-colors duration-300">
                  <div className="text-[10px] tracking-[0.2em] text-muted-foreground/65 mb-7">{number}</div>
                  <h3 className="font-serif text-xl font-medium text-foreground mb-2">{title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-background py-20 sm:py-24">
          <div className="container max-w-6xl px-6">
            <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16 items-start">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-gold mb-3">Your case workspace</p>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-foreground mb-5">One place for the pieces of your story.</h2>
                <p className="text-base text-muted-foreground font-light leading-relaxed max-w-lg">Your case grows with you. Add information as you receive it, connect related records, and keep track of what is known, disputed, or still missing.</p>
              </div>
              <div className="border border-border/70 bg-card shadow-warm-sm">
                <div className="px-6 py-4 border-b border-border/60">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">Inside your case</p>
                  <h3 className="font-serif text-2xl font-medium mt-1">Case Workspace</h3>
                </div>
                <div className="grid sm:grid-cols-2 divide-x divide-y divide-border/60">
                  {workspace.map(([label, description, Icon]) => (
                    <div key={String(label)} className="p-5">
                      <Icon className="w-4 h-4 text-gold/80 mb-4" strokeWidth={1.5} />
                      <p className="text-sm font-medium text-foreground">{label}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-5 bg-secondary/40 border-t border-border/60"><p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Story → Timeline → Records → Issues → Evidence → Case Packet</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-cream-warm py-20 sm:py-24">
          <div className="container max-w-6xl px-6">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-gold mb-3">Where it can help</p>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-foreground max-w-xl">Built for the systems you may have to navigate.</h2>
              </div>
              <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-md lg:text-right">Choose the area closest to your situation, then use the guide and case tools together.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-border/60">
              {issueAreas.map((area, index) => (
                <div key={area.title} className="min-h-36 border-r border-b border-border/60 p-6 sm:p-7 bg-cream-warm hover:bg-background/70 transition-colors duration-300">
                  <div className="flex items-center justify-between mb-8"><span className="text-[10px] tracking-[0.2em] text-muted-foreground/65">0{index + 1}</span><span className="h-px w-7 bg-gold/35" /></div>
                  <h3 className="font-serif text-xl font-medium text-foreground mb-2">{area.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{area.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-background py-20 sm:py-24">
          <div className="container max-w-6xl px-6">
            <div className="max-w-3xl mb-10">
              <p className="text-[10px] uppercase tracking-[0.22em] text-gold mb-3">Learn before you act</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-foreground mb-4">Washington legal education</h2>
              <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">Plain-language guides explain how common Washington systems work, what questions to ask, and what information may matter.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-0 border-t border-l border-border/60 max-w-5xl">
              {guides.map((guide, index) => (
                <Link key={guide.title} to={`/guide/${guide.guideId}`} className="group border-r border-b border-border/60 p-6 sm:p-7 bg-background hover:bg-secondary/30 transition-colors duration-300 min-h-32">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] tracking-[0.2em] text-muted-foreground/65">0{index + 1}</span>
                      <h3 className="font-serif text-xl font-medium text-foreground mt-3 group-hover:text-primary transition-colors">{guide.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-2 max-w-md">{guide.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0 mt-1" />
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8">
              <Link to="/education-library" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">View all Washington guides <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
        </section>

        <section className="bg-cream-warm py-20 sm:py-24">
          <div className="container max-w-6xl px-6">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-10">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-gold mb-3">More ways to prepare</p>
                <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-foreground">Tools and support when you need them.</h2>
              </div>
              <p className="text-sm text-muted-foreground font-light max-w-md">Organize first. Then decide what kind of help or next step makes sense for you.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-border/60">
              {resources.map((resource) => {
                const Icon = resource.icon;
                return (
                  <Link key={resource.title} to={resource.href} className="border-r border-b border-border/60 p-6 bg-cream-warm hover:bg-background transition-colors duration-300 group">
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
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight">Your story. Your voice. Your justice.</h2>
            <p className="mt-5 text-white/70 font-light max-w-xl mx-auto leading-relaxed">Decoded Justice gives you the tools and structure to understand your situation, organize your information, and decide what comes next.</p>
            <div className="mt-8"><Link to={startCaseUrl} className="inline-flex items-center gap-2 h-12 px-7 bg-white text-primary hover:bg-white/90 font-medium rounded-sm transition-colors">Start Your Case <ArrowRight className="w-4 h-4" /></Link></div>
            <p className="mt-7 text-[11px] text-white/45">Washington-focused information and organizational tools. Not legal advice.</p>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Index;