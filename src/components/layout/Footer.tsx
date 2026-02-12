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

          {/* Links row */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 mb-10">
            <Link to="/about" className="text-sm text-white/40 hover:text-gold transition-colors font-light">
              About
            </Link>
            <Link to="/disclaimer" className="text-sm text-white/40 hover:text-gold transition-colors font-light">
              Legal Disclaimer
            </Link>
            <Link to="/privacy" className="text-sm text-white/40 hover:text-gold transition-colors font-light">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-white/40 hover:text-gold transition-colors font-light">
              Terms
            </Link>
            <Link to="/support-network" className="text-sm text-white/40 hover:text-gold transition-colors font-light">
              Resource Directory
            </Link>
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
