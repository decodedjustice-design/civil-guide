import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import decodedJusticeLogo from "@/assets/decoded-justice-scales-logo.png";

const navigation = [
  { name: "Tools", href: "/tools" },
  { name: "Analyzer", href: "/analyzer" },
  { name: "Library", href: "/library" },
  { name: "Find Help", href: "/find-help" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <nav className="container flex items-center justify-between py-2">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group hover:opacity-90 transition-opacity">
          <img 
            src={decodedJusticeLogo} 
            alt="Decoded Justice" 
            className="h-10 w-auto"
          />
          <span className="text-sm font-medium text-foreground">
            Decoded Justice
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm transition-colors",
                location.pathname === item.href
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden lg:flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-sm h-8" asChild>
            <Link to="/auth">Log in</Link>
          </Button>
          <Button size="sm" className="text-sm h-8" asChild>
            <Link to="/auth">Sign up</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="lg:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors"
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
        <div className="lg:hidden glass border-t border-border">
          <div className="container py-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-md text-sm transition-colors",
                  location.pathname === item.href
                    ? "text-primary font-medium bg-primary/5"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-border flex gap-2">
              <Button variant="ghost" size="sm" className="flex-1 h-8" asChild>
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  Log in
                </Link>
              </Button>
              <Button size="sm" className="flex-1 h-8" asChild>
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
