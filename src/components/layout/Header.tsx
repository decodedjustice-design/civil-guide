import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { MobileNavMenu } from "./MobileNavMenu";
import decodedJusticeLogo from "@/assets/decoded-justice-scales-logo.png";

// Pre-login navigation — minimal, human-centered
const publicNavItems = [
  { name: "Start Here", href: "/tools" },
  { name: "Understanding Your Rights", href: "/rights-insight" },
  { name: "Find Legal Help", href: "/find-help" },
  { name: "About", href: "/about" },
];

// Post-login navigation — case-focused
const authNavItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Your Case", href: "/justice-place" },
  { name: "Your Evidence", href: "/evidence-vault" },
  { name: "Timeline", href: "/timeline" },
  { name: "Case Review", href: "/analyzer" },
  { name: "Saved Attorneys", href: "/saved-attorneys" },
  { name: "Notes", href: "/notes" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const navItems = user ? authNavItems : publicNavItems;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <nav className="container flex items-center justify-between py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group hover:opacity-80 transition-opacity">
            <img 
              src={decodedJusticeLogo} 
              alt="Decoded Justice" 
              className="h-10 w-auto"
            />
            <div className="hidden sm:block">
              <span className="text-base font-medium text-foreground tracking-wide">
                Decoded Justice
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium transition-colors tracking-wide",
                  location.pathname === item.href
                    ? "text-primary"
                    : "text-foreground/70 hover:text-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-xs text-muted-foreground truncate max-w-[180px] tracking-wide">
                  {user.email}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs h-9 px-4 text-muted-foreground hover:text-foreground hover:bg-secondary/60 tracking-wide"
                  onClick={handleSignOut}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-9 px-4 text-muted-foreground hover:text-foreground hover:bg-secondary/60 tracking-wide" 
                asChild
              >
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2.5 rounded text-foreground/70 hover:text-foreground hover:bg-secondary/60 transition-colors"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </nav>
      </header>

      <MobileNavMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        user={user}
        onSignOut={handleSignOut}
      />
    </>
  );
}
