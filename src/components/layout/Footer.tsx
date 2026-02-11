import { Link } from "react-router-dom";
import { Scale } from "lucide-react";
import decodedJusticeLogo from "@/assets/decoded-justice-scales-logo.png";

const footerLinks = [
  { name: "About", href: "/about" },
  { name: "Ethics & Safety", href: "/about" },
  { name: "Privacy", href: "/privacy" },
  { name: "Terms", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="bg-cream-warm border-t border-border/40">
      <div className="container py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={decodedJusticeLogo} 
              alt="Decoded Justice" 
              className="h-8 w-auto opacity-60"
            />
            <span className="text-sm font-medium text-foreground/60 tracking-wide">
              Decoded Justice
            </span>
          </Link>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm text-muted-foreground/70 hover:text-foreground transition-colors font-light tracking-wide"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/30">
        <div className="container py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground/50">
              <Scale className="w-3.5 h-3.5" />
              <span className="tracking-wide">Educational use only · Not legal advice</span>
            </div>
            <p className="text-xs text-muted-foreground/40 tracking-wide">
              © {new Date().getFullYear()} Decoded Justice
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
