import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ArrowRight, Clock, FileText, FolderOpen, Search, Users, Scale, Shield, Wrench, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import heroImage from "@/assets/hero-private-studio.jpg";
import storyImage from "@/assets/hero-family-courthouse.png";
import researchImage from "@/assets/tool-legal-research.jpg";
import communityImage from "@/assets/category-support-network.jpg";
import { LegalGate } from "@/components/LegalGate";

const Index = () => {
  const { user } = useAuth();
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

  const workspace: [string, string, React.ElementType][] = [
    ["Timeline", "Record what happened and when.", Clock],
    ["Evidence", "Organize documents and supporting records.", FolderOpen],
    ["Issues", "Track questions and potential issues to investigate.", Search],
    ["People & Organizations", "Keep everyone and every agency connected to the case.", Users],
    ["Communications", "Keep calls, emails, messages, and notices together.", FileText],
    ["Records Requests", "Track requests, responses, deadlines, and missing records.", FileText],
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
        <section className="relative min-h-[82vh] flex items-end overflow-hidden bg-[#171514]">
          <div className="absolute inset-0">
            <img src={heroImage} alt="" className="w-full h-full object-cover object-center" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#171514]/95 via-[#171514]/65 to-[#171514]/15" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171514]/85 via-transparent to-[#171514]/20" />
          </div>
          <div className="relative z-10 container max-w-6xl px-6 py-20 sm:py-24 lg:py-28">
            <div className="max-w-2xl text-left">
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gold mb-6">Decoded Justice · Washington State</p>
              <div className="w-14 h-px bg-gold/70 mb-7" />
              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-medium text-cream leading-[0.98] tracking-tight drop-shadow-lg">Your story can create change.</h1>
              <p className="mt-5 text-xl sm:text-2xl font-serif text-cream-warm">Clarity. Empathy. Justice.</p>
              <p className="mt-6 text-base sm:text-lg text-cream-warm/90 font-light leading-relaxed max-w-xl">A Washington-focused place to understand what happened, organize what you know, and prepare for what comes next.</p>
              <div className="mt-9 flex flex-col sm:flex-row gap-3">
                <Link to={startCaseUrl} className="inline-flex items-center justify-center gap-2 h-12 px-7 bg-primary hover:bg-maroon-light text-white font-medium tracking-wide rounded-sm transition-all duration-300 hover:shadow-lg">Start Your Journey <ArrowRight className="w-4 h-4" /></Link>
                <Link to="/education-library" className="inline-flex items-center justify-center h-12 px-7 border border-cream/40 hover:border-cream/70 text-cream hover:text-white font-medium tracking-wide rounded-sm transition-all duration-300">Explore the Guide</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="relative -mt-px border-b border-white/10 bg-[#171514] text-cream">
          <div className="container max-w-6xl px-6 py-8">
            <div className="grid md:grid-cols-3 border border-white/10 bg-black/25 backdrop-blur-sm shadow-2xl">
              {[
                ["01", "TELL YOUR STORY", "Start with what happened. You do not need to know the legal terminology first.", startCaseUrl],
                ["02", "BUILD YOUR CASE", "Organize your timeline, evidence, people, communications, records, and issues in one workspace.", "/cases"],
                ["03", "UNDERSTAND & PREPARE", "Explore questions, learn how the system works, identify what is missing, and prepare your next step.", "/education-library"],
              ].map(([number, title, description, href]) => (
                <Link key={number} to={href} className="group p-6 sm:p-7 border-b md:border-b-0 md:border-r last:border-0 border-white/10 hover:bg-white/5 transition-colors duration-300">
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[10px] tracking-[0.2em] text-gold">{number}</span>
                    <ArrowRight className="w-4 h-4 text-cream-warm/50 group-hover:text-gold transition-colors" />
                  </div>
                  <h2 className="font-serif text-xl font-medium text-cream group-hover:text-white transition-colors">{title}</h2>
                  <p className="text-sm text-cream-warm/70 font-light leading-relaxed mt-2 max-w-sm">{description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-cream py-20 sm:py-24">
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

        <section className="bg-[#171514] text-cream py-20 sm:py-24 overflow-hidden">
          <div className="container max-w-6xl px-6">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
              <div className="max-w-2xl">
                <p className="text-[10px] uppercase tracking-[0.22em] text-gold mb-3">A clearer way through</p>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight">See the work in context.</h2>
              </div>
              <p className="text-sm text-cream-warm/65 font-light leading-relaxed max-w-md lg:text-right">
                From telling your story to understanding a document and finding support, each part of Decoded Justice is designed to feel calm, human, and focused.
              </p>
            </div>
            <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-4 lg:gap-5">
              <Link to={startCaseUrl} className="group relative min-h-[360px] sm:min-h-[430px] overflow-hidden rounded-sm border border-white/10">
                <img src={storyImage} alt="A family reviewing important paperwork together" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171514]/95 via-[#171514]/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gold mb-2">01 · Your story</p>
                  <h3 className="font-serif text-2xl sm:text-3xl font-medium text-cream">Start with what happened.</h3>
                  <p className="mt-2 max-w-xl text-sm text-cream-warm/75 font-light">Write in your own words. Build the record without having to translate your experience into legal language first.</p>
                </div>
              </Link>
              <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-5">
                <Link to="/legal-decoder" className="group relative min-h-[210px] overflow-hidden rounded-sm border border-white/10">
                  <img src={researchImage} alt="Research materials and legal information on a laptop" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171514]/95 via-[#171514]/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gold mb-1">02 · Understand</p>
                    <h3 className="font-serif text-xl sm:text-2xl font-medium text-cream">Make complex language clearer.</h3>
                  </div>
                </Link>
                <Link to="/support-network" className="group relative min-h-[210px] overflow-hidden rounded-sm border border-white/10">
                  <img src={communityImage} alt="People gathered together to work through a community issue" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171514]/95 via-[#171514]/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gold mb-1">03 · Connect</p>
                    <h3 className="font-serif text-xl sm:text-2xl font-medium text-cream">Find people and resources.</h3>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-background text-foreground py-20 sm:py-24">
          <div className="container max-w-6xl px-6">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-primary mb-3">Where it can help</p>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-foreground max-w-xl">Built for the systems you may have to navigate.</h2>
              </div>
              <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-md lg:text-right">Start with the area closest to your situation, then use the workspace, guides, and tools that fit what you need.</p>
            </div>
            <div className="grid sm:grid-cols-2 border-t border-l border-border/60">
              {issueAreas.map((area, index) => (
                <div key={area.title} className="min-h-28 border-r border-b border-border/60 p-5 sm:p-6 bg-background hover:bg-secondary/30 transition-colors duration-300">
                  <div className="flex items-center justify-between mb-4"><span className="text-[10px] tracking-[0.2em] text-muted-foreground/65">0{index + 1}</span><span className="h-px w-7 bg-primary/35" /></div>
                  <h3 className="font-serif text-lg font-medium text-foreground mb-1">{area.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{area.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#211C1A] text-cream py-20 sm:py-24">
          <div className="container max-w-6xl px-6">
            <div className="max-w-3xl mb-10">
              <p className="text-[10px] uppercase tracking-[0.22em] text-gold mb-3">Understand the system</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-cream mb-4">Learn what matters before you decide what to do next.</h2>
              <p className="text-sm sm:text-base text-cream-warm/70 font-light leading-relaxed">Plain-language education helps you understand how a process works, what information may matter, and what questions to ask.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-white/10 max-w-5xl">
              {[
                ["01", "KNOW YOUR RIGHTS", "Understand protections, responsibilities, and limits that may apply to your situation."],
                ["02", "UNDERSTAND THE PROCESS", "See how an agency, court, program, or other system generally works."],
                ["03", "KNOW WHAT TO DOCUMENT", "Identify records, evidence, notices, communications, and important dates to preserve."],
                ["04", "KNOW WHAT TO ASK", "Turn uncertainty into specific questions you can research, verify, or raise."],
                ["05", "PREPARE FOR WHAT COMES NEXT", "Use what you learn to organize your information and prepare for the next step."],
              ].map(([number, title, description]) => (
                <div key={number} className="min-h-40 border-r border-b border-white/10 p-6 bg-white/[0.02] hover:bg-white/[0.06] transition-colors duration-300">
                  <div className="text-[10px] tracking-[0.2em] text-cream-warm/45 mb-6">{number}</div>
                  <h3 className="font-serif text-xl font-medium text-cream mb-2">{title}</h3>
                  <p className="text-xs text-cream-warm/65 leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link to="/education-library" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">Explore the Washington Education Library <ArrowRight className="w-4 h-4" /></Link>
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