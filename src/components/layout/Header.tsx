import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Analyzer", href: "/analyzer" },
  { name: "Legal Decoder", href: "/legal-decoder" },
  { name: "Self-Help Tools", href: "/self-help" },
  { name: "Rights Insight", href: "/rights-insight" },
  { name: "Find Legal Help", href: "/find-help" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <nav className="container flex items-center justify-between py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-primary shadow-glow">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
              {/* Scales of Justice with puzzle piece */}
              <path d="M12 2L12 4M12 4L6 8L2 6L6 12L2 18L12 14M12 4L18 8L22 6L18 12L22 18L12 14M12 14L12 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground"/>
              <circle cx="12" cy="14" r="2" fill="currentColor" className="text-primary-foreground"/>
            </svg>
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

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                location.pathname === item.href
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/signin">Sign In</Link>
          </Button>
          <Button variant="hero" size="sm" asChild>
            <Link to="/analyzer">
              Get Started
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass border-t border-border animate-fade-in">
          <div className="container py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  location.pathname === item.href
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-border space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/signin" onClick={() => setMobileMenuOpen(false)}>
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Link>
              </Button>
              <Button variant="hero" className="w-full" asChild>
                <Link to="/analyzer" onClick={() => setMobileMenuOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
