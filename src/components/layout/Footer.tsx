import { Link } from "react-router-dom";
import { BookOpen, Shield, Lock, Scale, Heart } from "lucide-react";
import decodedJusticeLogo from "@/assets/decoded-justice-scales-logo.png";

const footerLinks = {
  platform: [
    { name: "Analyzer", href: "/analyzer" },
    { name: "Rights Insight", href: "/rights-insight" },
    { name: "Library", href: "/library" },
    { name: "Tools", href: "/tools" },
  ],
  resources: [
    { name: "Support Network", href: "/support-network" },
    { name: "Public Requests", href: "/public-request-rights" },
    { name: "Find Legal Help", href: "/find-help" },
  ],
  about: [
    { name: "About", href: "/about" },
  ],
};

const trustSignals = [
  { icon: BookOpen, label: "Built for understanding" },
  { icon: Heart, label: "Designed for dignity" },
  { icon: Lock, label: "Private by design" },
  { icon: Shield, label: "Your information stays yours" },
];

export function Footer() {
  return (
    <footer className="bg-navy text-white/90">
      {/* Trust signals bar */}
      <div className="border-b border-white/10">
        <div className="container py-8">
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
            {trustSignals.map((signal) => (
              <div key={signal.label} className="flex items-center gap-2.5">
                <signal.icon className="w-4 h-4 text-primary" />
                <span className="text-sm text-white/70">{signal.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img 
                src={decodedJusticeLogo} 
                alt="Decoded Justice" 
                className="h-10 w-auto brightness-0 invert opacity-90"
              />
              <span className="text-lg font-semibold text-white">
                Decoded Justice
              </span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed">
              A space for clarity, organization, and preparation. Educational use only.
            </p>
          </div>

          {/* Platform links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Platform
            </h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-sm text-white/60 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Resources
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-sm text-white/60 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              About
            </h3>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-sm text-white/60 hover:text-primary transition-colors"
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
      <div className="border-t border-white/10">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-white/50">
              <Scale className="w-4 h-4" />
              <span>Educational use only · Not legal advice</span>
            </div>
            <p className="text-sm text-white/40">
              © {new Date().getFullYear()} Decoded Justice. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
