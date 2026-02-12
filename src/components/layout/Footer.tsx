import { Link } from "react-router-dom";
import { Scale } from "lucide-react";
import decodedJusticeLogo from "@/assets/decoded-justice-scales-logo.png";

const footerLinks = {
  platform: [
    { name: "Analyzer", href: "/analyzer" },
    { name: "Evidence Vault", href: "/evidence-vault" },
    { name: "Timeline", href: "/timeline" },
    { name: "Notes", href: "/notes" },
  ],
  resources: [
    { name: "Library", href: "/library" },
    { name: "Rights Insight", href: "/rights-insight" },
    { name: "Find Attorneys", href: "/find-help" },
    { name: "Courts & Filing", href: "/courts-filing-info" },
  ],
  about: [
    { name: "About", href: "/about" },
    { name: "Support Network", href: "/support-network" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-espresso text-white/80">
      {/* Main footer */}
      <div className="container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <img 
                src={decodedJusticeLogo} 
                alt="Decoded Justice" 
                className="h-10 w-auto brightness-0 invert opacity-80"
              />
              <span className="text-base font-medium text-white/80 tracking-wide">
                Decoded Justice
              </span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed font-light">
              A private space for clarity, organization, and preparation. Educational use only.
            </p>
          </div>

          {/* Platform links */}
          <div>
            <h3 className="text-xs font-medium text-white/50 mb-5 uppercase tracking-[0.15em]">
              Platform
            </h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-sm text-white/40 hover:text-gold transition-colors font-light"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h3 className="text-xs font-medium text-white/50 mb-5 uppercase tracking-[0.15em]">
              Resources
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-sm text-white/40 hover:text-gold transition-colors font-light"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-xs font-medium text-white/50 mb-5 uppercase tracking-[0.15em]">
              About
            </h3>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-sm text-white/40 hover:text-gold transition-colors font-light"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
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
