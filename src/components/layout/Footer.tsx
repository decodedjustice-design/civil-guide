import { Link } from "react-router-dom";
import { Scale } from "lucide-react";
import decodedJusticeLogo from "@/assets/decoded-justice-scales-logo.png";

export function Footer() {
  return (
    <footer className="bg-espresso text-white/80">
      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-8">
            <img
              src={decodedJusticeLogo}
              alt="Decoded Justice"
              className="h-8 w-auto brightness-0 invert opacity-70"
            />
            <span className="text-sm font-medium text-white/60 tracking-wide">
              Decoded Justice
            </span>
          </div>

          {/* Links grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-6 mb-10">
            {/* Prepare for Action */}
            <div>
              <p className="text-xs text-white/25 uppercase tracking-[0.15em] font-medium mb-3">Prepare</p>
              <div className="flex flex-col gap-2">
                <Link to="/legal-templates" className="text-sm text-white/40 hover:text-gold transition-colors font-light">Legal Templates</Link>
                <Link to="/intake-packet" className="text-sm text-white/40 hover:text-gold transition-colors font-light">Intake Packet</Link>
                <Link to="/courts-filing-info" className="text-sm text-white/40 hover:text-gold transition-colors font-light">Courts & Filing</Link>
                <Link to="/public-request-rights" className="text-sm text-white/40 hover:text-gold transition-colors font-light">Public Records</Link>
              </div>
            </div>

            {/* Connect */}
            <div>
              <p className="text-xs text-white/25 uppercase tracking-[0.15em] font-medium mb-3">Connect</p>
              <div className="flex flex-col gap-2">
                <Link to="/find-help" className="text-sm text-white/40 hover:text-gold transition-colors font-light">Find Legal Help</Link>
                <Link to="/support-network" className="text-sm text-white/40 hover:text-gold transition-colors font-light">Support Network</Link>
                <Link to="/founders-story" className="text-sm text-white/40 hover:text-gold transition-colors font-light">Founder's Story</Link>
                <Link to="/education-library" className="text-sm text-white/40 hover:text-gold transition-colors font-light">Legal Library</Link>
              </div>
            </div>

            {/* Tools */}
            <div>
              <p className="text-xs text-white/25 uppercase tracking-[0.15em] font-medium mb-3">Tools</p>
              <div className="flex flex-col gap-2">
                <Link to="/case-builder" className="text-sm text-white/40 hover:text-gold transition-colors font-light">Case Builder</Link>
                <Link to="/analyzer" className="text-sm text-white/40 hover:text-gold transition-colors font-light">Analyzer</Link>
                <Link to="/transcription" className="text-sm text-white/40 hover:text-gold transition-colors font-light">Transcription</Link>
                <Link to="/tools" className="text-sm text-white/40 hover:text-gold transition-colors font-light">How It Works</Link>
              </div>
            </div>

            {/* About */}
            <div>
              <p className="text-xs text-white/25 uppercase tracking-[0.15em] font-medium mb-3">About</p>
              <div className="flex flex-col gap-2">
                <Link to="/about" className="text-sm text-white/40 hover:text-gold transition-colors font-light">About</Link>
                <Link to="/disclaimer" className="text-sm text-white/40 hover:text-gold transition-colors font-light">Legal Disclaimer</Link>
                <Link to="/privacy" className="text-sm text-white/40 hover:text-gold transition-colors font-light">Privacy Policy</Link>
                <Link to="/terms" className="text-sm text-white/40 hover:text-gold transition-colors font-light">Terms</Link>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-white/8 mb-6" />

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-white/30">
              <Scale className="w-3.5 h-3.5" />
              <span className="tracking-wide">Educational use only · Not legal advice</span>
            </div>
            <p className="text-xs text-white/25 tracking-wide">
              © {new Date().getFullYear()} Decoded Justice
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
