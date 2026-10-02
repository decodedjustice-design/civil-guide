import { ArrowRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import {
  categoryImages,
  knowledgeCenterImages,
  bannerCourtsFiling,
  bannerEvidenceVault,
  bannerLibrary,
  dashboardOrientation,
  toolLegalResearch,
  categoryGovernment,
  categoryCourts,
} from "@/assets";

type HeaderConfig = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  position?: string;
};

const configs: Array<{ match: (pathname: string) => boolean; config: HeaderConfig }> = [
  { match: p => p === "/dashboard", config: { eyebrow: "Case command center", title: "Your case, organized.", description: "Keep the record connected as you build it.", image: dashboardOrientation } },
  { match: p => p === "/analyzer", config: { eyebrow: "Civil Rights Analyzer", title: "Understand what to look at.", description: "Work through the facts, questions, and records that may matter.", image: categoryImages.police } },
  { match: p => p === "/case-builder", config: { eyebrow: "Case Builder", title: "Start with your story.", description: "Tell us what happened. We’ll help organize it with you.", image: knowledgeCenterImages.family } },
  { match: p => p === "/legal-decoder", config: { eyebrow: "Legal Decoder", title: "Make the language clearer.", description: "Explore legal concepts and authorities in plain language.", image: toolLegalResearch } },
  { match: p => p === "/support-network", config: { eyebrow: "Support Network", title: "Find people and organizations.", description: "Explore advocates, services, and community resources.", image: categoryImages.support } },
  { match: p => p === "/find-help" || p === "/legal-help" || p === "/attorney-search", config: { eyebrow: "Legal Help", title: "Find the right next conversation.", description: "Explore legal-help and advocacy resources.", image: categoryGovernment } },
  { match: p => p === "/education-library" || p.startsWith("/education-library/") || p === "/library", config: { eyebrow: "Education Library", title: "Learn how the system works.", description: "Build understanding before deciding what to do next.", image: bannerLibrary } },
  { match: p => p === "/rights-insight", config: { eyebrow: "Rights Insight", title: "Understand your rights.", description: "Explore practical information about systems, procedures, and records.", image: categoryCourts } },
  { match: p => p === "/tools", config: { eyebrow: "Documentation Tools", title: "Turn information into an organized record.", description: "Practical tools for documenting and preparing.", image: toolLegalResearch } },
  { match: p => p === "/public-request-rights", config: { eyebrow: "Public Records", title: "Request. Track. Preserve.", description: "Organize public-records requests, responses, and gaps.", image: bannerCourtsFiling } },
  { match: p => p === "/courts-filing-info", config: { eyebrow: "Courts & Filing", title: "Navigate the process.", description: "Understand filing and court-process information.", image: bannerCourtsFiling } },
  { match: p => p === "/templates" || p === "/legal-templates", config: { eyebrow: "Templates", title: "Start with a usable document.", description: "Practical templates for organizing and communicating.", image: categoryGovernment } },
  { match: p => p === "/transcription", config: { eyebrow: "Transcription", title: "Turn recordings into a record.", description: "Create an organized text record from audio.", image: knowledgeCenterImages.speech } },
  { match: p => p === "/housing-navigator", config: { eyebrow: "Housing", title: "Find a clearer path to housing resources.", description: "Explore housing information and navigation tools.", image: knowledgeCenterImages.housing } },
  { match: p => p === "/founders-story", config: { eyebrow: "Why Decoded Justice exists", title: "Built from lived experience.", description: "The story behind the work.", image: knowledgeCenterImages.family } },
  { match: p => p === "/about" || p === "/what-we-are", config: { eyebrow: "About Decoded Justice", title: "Clarity. Empathy. Justice.", description: "A Washington-focused resource for understanding and organizing complex situations.", image: knowledgeCenterImages.rightsGovernment } },
  { match: p => p === "/privacy", config: { eyebrow: "Privacy", title: "Your information matters.", description: "Learn how information is handled within Decoded Justice.", image: knowledgeCenterImages.disability } },
  { match: p => p === "/terms", config: { eyebrow: "Terms", title: "Using Decoded Justice.", description: "Review the terms that govern use of the service.", image: categoryGovernment } },
  { match: p => p === "/disclaimer", config: { eyebrow: "Important information", title: "Know what this tool is — and is not.", description: "Review the educational and informational limits of Decoded Justice.", image: knowledgeCenterImages.courts } },
  { match: p => p === "/auth" || p === "/signin" || p === "/signup", config: { eyebrow: "Decoded Justice", title: "A private place to begin.", description: "Sign in or create an account to build your workspace.", image: categoryImages.support } },
  { match: p => p === "/cases", config: { eyebrow: "Your cases", title: "Your case workspace.", description: "Open a case or start organizing a new one.", image: bannerEvidenceVault } },
  { match: p => p.startsWith("/cases/"), config: { eyebrow: "Case workspace", title: "Keep the record connected.", description: "Review, organize, and build from the same underlying case record.", image: bannerEvidenceVault } },
  { match: p => p === "/justice-research", config: { eyebrow: "Justice Research", title: "Research with context.", description: "Explore authorities and information relevant to your questions.", image: toolLegalResearch } },
  { match: p => p === "/pro-se-toolkit" || p.startsWith("/pro-se-toolkit/"), config: { eyebrow: "Pro Se Toolkit", title: "Tools for representing yourself.", description: "Organize preparation, documents, and next steps.", image: categoryCourts } },
];

export function CinematicPageHeader() {
  const { pathname } = useLocation();

  if (pathname === "/") return null;

  const match = configs.find(item => item.match(pathname));
  const config = match?.config ?? {
    eyebrow: "Decoded Justice",
    title: "A clearer way through.",
    description: "Understand, organize, and prepare.",
    image: categoryCourts,
  };

  return (
    <section
      aria-labelledby="cinematic-page-title"
      className="relative isolate overflow-hidden bg-[#171514] min-h-[250px] sm:min-h-[290px] flex items-end"
    >
      <div className="absolute inset-0">
        <img
          src={config.image}
          alt=""
          aria-hidden="true"
          className={`h-full w-full object-cover scale-[1.01] ${config.position ?? "object-center"}`}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#171514]/95 via-[#171514]/65 to-[#171514]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171514]/90 via-[#171514]/20 to-transparent" />
      </div>

      <div className="relative z-10 container max-w-6xl px-6 py-10 sm:py-12">
        <div className="max-w-3xl">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.28em] text-gold mb-4">
            {config.eyebrow}
          </p>
          <div className="w-12 h-px bg-gold/70 mb-5" />
          <h1
            id="cinematic-page-title"
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium leading-[1.02] tracking-tight text-cream drop-shadow-lg"
          >
            {config.title}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-cream-warm/85 max-w-2xl leading-relaxed">
            {config.description}
          </p>
        </div>
        <div className="absolute right-6 bottom-8 hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-cream/40">
          Decoded Justice <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </section>
  );
}
