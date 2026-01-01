import { Link } from "react-router-dom";
import { Shield, Heart } from "lucide-react";

const footerLinks = {
  platform: [
    { name: "Civil Rights Analyzer", href: "/analyzer" },
    { name: "Legal Decoder", href: "/legal-decoder" },
    { name: "Rights Insight", href: "/rights-insight" },
    { name: "Find Legal Help", href: "/find-help" },
    { name: "Support Network", href: "/support-network" },
  ],
  about: [
    { name: "About & Mission", href: "/about" },
    { name: "Founder's Story", href: "/founders-story" },
    { name: "What This Platform Is", href: "/what-we-are" },
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
      <div className="container py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-primary">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-foreground leading-tight">
                  Decoded
                </span>
                <span className="text-xs text-primary font-medium -mt-1">
                  Justice
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              A supportive place to regain clarity, organize what matters, and move forward with purpose.
            </p>
            <div className="flex items-center gap-2 text-xs text-text-softer">
              <Heart className="w-3 h-3 text-primary" />
              <span>Built with care for those who need it most</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Platform</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">About</h3>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="mt-12 p-4 rounded-xl bg-muted/50 border border-border">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            <strong className="text-foreground">Educational Use Only.</strong> Decoded Justice is not a law firm and does not provide legal advice. 
            The information provided is for educational purposes only and should not be construed as legal advice. 
            For legal concerns, please consult with a qualified attorney.
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-xs text-text-softer text-center">
            © {new Date().getFullYear()} Decoded Justice. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
