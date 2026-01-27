import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import decodedJusticeLogo from "@/assets/decoded-justice-scales-logo.png";

const navigation = [
  { name: "Analyzer", href: "/analyzer" },
  { name: "Rights Insight", href: "/rights-insight" },
  { name: "Library", href: "/library" },
  { name: "Tools", href: "/tools" },
  { name: "Support", href: "/support-network" },
  { name: "Public Requests", href: "/public-request-rights" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/30">
      <nav className="container flex items-center justify-between py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group hover:opacity-90 transition-opacity">
          <img 
            src={decodedJusticeLogo} 
            alt="Decoded Justice" 
            className="h-10 w-auto"
          />
          <div className="hidden sm:block">
            <span className="text-lg font-semibold text-navy">
              Decoded Justice
            </span>
          </div>
        </Link>

        {/* Desktop Navigation - Center */}
        <div className="hidden lg:flex items-center gap-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                location.pathname === item.href
                  ? "text-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop Auth - Right */}
        <div className="hidden lg:flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-sm h-10 px-5 text-muted-foreground hover:text-foreground" 
            asChild
          >
            <Link to="/auth">Log in</Link>
          </Button>
          <Button 
            size="sm" 
            className="text-sm h-10 px-5 shadow-sm" 
            asChild
          >
            <Link to="/auth">Sign up</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-background/95 backdrop-blur-xl border-t border-border/30">
          <div className="container py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === item.href
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-border/50 flex gap-3">
              <Button variant="outline" size="sm" className="flex-1 h-10" asChild>
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  Log in
                </Link>
              </Button>
              <Button size="sm" className="flex-1 h-10" asChild>
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  Sign up
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
