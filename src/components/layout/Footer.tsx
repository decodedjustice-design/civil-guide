import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import decodedJusticeLogo from "@/assets/decoded-justice-scales-logo.png";

const footerLinks = {
  platform: [
    { name: "Civil Rights Analyzer", href: "/analyzer" },
    { name: "Justice Decoder", href: "/legal-decoder" },
    { name: "Rights Insight", href: "/rights-insight" },
    { name: "Find Legal Help", href: "/find-help" },
    { name: "Support Network", href: "/support-network" },
  ],
  about: [
    { name: "About & Mission", href: "/about" },
    { name: "Founder's Story", href: "/founders-story" },
    { name: "What We Are", href: "/what-we-are" },
  ],
  legal: [
    { name: "Privacy & Security", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Disclaimer", href: "/disclaimer" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container py-8 lg:py-10">
        {/* Main Footer Content - Horizontal Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-6">
          {/* Brand Column */}
          <div className="lg:w-[280px] shrink-0">
            <Link to="/" className="flex items-center gap-2 mb-2 hover:opacity-80 transition-opacity">
              <img 
                src={decodedJusticeLogo} 
                alt="Decoded Justice" 
                className="h-14 md:h-16 w-auto"
              />
              <span className="text-lg font-semibold text-foreground">Decoded Justice</span>
            </Link>
            <p className="text-[10px] tracking-widest text-muted-foreground font-medium uppercase mb-2">
              Clarity <span className="text-accent">·</span> Justice <span className="text-accent">·</span> Empathy
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              A supportive space to regain clarity, organize what matters, and move forward with purpose.
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-text-softer">
              <Heart className="w-2.5 h-2.5 text-accent" />
              <span>Built with care for those who need it most</span>
            </div>
          </div>

          {/* Links Columns Container */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-6 lg:gap-8">
            {/* Platform Links */}
            <div>
              <h3 className="text-xs font-semibold text-accent mb-3">Platform</h3>
              <ul className="space-y-2">
                {footerLinks.platform.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-xs text-muted-foreground hover:text-accent transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* About Links */}
            <div>
              <h3 className="text-xs font-semibold text-accent mb-3">About</h3>
              <ul className="space-y-2">
                {footerLinks.about.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-xs text-muted-foreground hover:text-accent transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-xs font-semibold text-accent mb-3">Legal</h3>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-xs text-muted-foreground hover:text-accent transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="mt-6 p-3 rounded-lg bg-muted/50 border border-border">
          <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
            <strong className="text-foreground">Educational Use Only.</strong> Decoded Justice is not a law firm and does not provide legal advice. 
            The information provided is for educational purposes only and should not be construed as legal advice. 
            For legal concerns, please consult with a qualified attorney.
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-[10px] text-text-softer text-center">
            © {new Date().getFullYear()} Decoded Justice. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
