import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { MobileNavMenu } from "./MobileNavMenu";
import decodedJusticeLogo from "@/assets/decoded-justice-scales-logo.png";

const desktopNavItems = [
  {
    name: "Tools",
    items: [
      { name: "Evidence Vault", href: "/evidence-vault" },
      { name: "Timeline Creator", href: "/timeline" },
      { name: "Notes", href: "/notes" },
      { name: "Transcription", href: "/transcription" },
      { name: "Legal Templates", href: "/legal-templates" },
    ],
  },
  {
    name: "Learning",
    items: [
      { name: "Library", href: "/library" },
      { name: "Rights Insight", href: "/rights-insight" },
    ],
  },
  {
    name: "Find Help",
    items: [
      { name: "Find Attorneys", href: "/find-help" },
      { name: "Attorney Contact Hub", href: "/attorney-contacts" },
      { name: "Intake Packet", href: "/intake-packet" },
      { name: "Courts & Filing", href: "/courts-filing-info" },
      { name: "Saved Attorneys", href: "/saved-attorneys" },
    ],
  },
];

// Justice Place is shown as a top-level prominent link for logged-in users

function DesktopNavDropdown({ item, location }: { item: typeof desktopNavItems[0]; location: ReturnType<typeof useLocation> }) {
  const [isOpen, setIsOpen] = useState(false);
  const isActive = item.items.some(subItem => location.pathname === subItem.href);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className={cn(
          "flex items-center gap-1 px-4 py-2 text-base font-medium transition-colors",
          isActive
            ? "text-primary"
            : "text-navy hover:text-primary"
        )}
      >
        {item.name}
        <ChevronDown className={cn(
          "h-4 w-4 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </button>
      
      {/* Dropdown */}
      <div
        className={cn(
          "absolute left-0 top-full pt-2 z-50 transition-all duration-200",
          isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-1"
        )}
      >
        <div className="bg-card border border-border rounded-lg shadow-lg py-2 min-w-[180px]">
          {item.items.map((subItem) => (
            <Link
              key={subItem.name}
              to={subItem.href}
              className={cn(
                "block px-4 py-2.5 text-sm font-medium transition-colors",
                location.pathname === subItem.href
                  ? "text-primary bg-accent-soft"
                  : "text-navy hover:text-primary hover:bg-secondary/60"
              )}
            >
              {subItem.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border/40 shadow-sm">
        <nav className="container flex items-center justify-between py-3">
          {/* Logo - Left */}
          <Link to="/" className="flex items-center gap-3 group hover:opacity-90 transition-opacity">
            <img 
              src={decodedJusticeLogo} 
              alt="Decoded Justice" 
              className="h-11 w-auto"
            />
            <div className="hidden sm:block">
              <span className="text-lg font-semibold text-navy tracking-tight">
                Decoded Justice
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center gap-6">
            {/* Justice Place - Prominent for logged in users */}
            {user && (
              <Link
                to="/justice-place"
                className={cn(
                  "px-4 py-2 text-base font-semibold transition-colors",
                  location.pathname === "/justice-place"
                    ? "text-primary"
                    : "text-navy hover:text-primary"
                )}
              >
                Justice Place
              </Link>
            )}
            {desktopNavItems.map((item) => (
              <DesktopNavDropdown key={item.name} item={item} location={location} />
            ))}
            <Link
              to="/about"
              className={cn(
                "px-4 py-2 text-base font-medium transition-colors",
                location.pathname === "/about"
                  ? "text-primary"
                  : "text-navy hover:text-primary"
              )}
            >
              About
            </Link>
          </div>

          {/* Desktop Auth - Right */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-navy-soft truncate max-w-[200px]">
                  {user.email}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-sm h-10 px-5 text-navy-soft hover:text-navy hover:bg-secondary/60"
                  onClick={handleSignOut}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-sm h-10 px-5 text-navy-soft hover:text-navy hover:bg-secondary/60" 
                  asChild
                >
                  <Link to="/auth">Log in</Link>
                </Button>
                <Button 
                  size="sm" 
                  className="text-sm h-10 px-6 shadow-md hover:shadow-lg transition-shadow bg-primary hover:bg-accent-strong" 
                  asChild
                >
                  <Link to="/auth">Sign up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button - Always visible hamburger */}
          <button
            type="button"
            className="p-2.5 rounded-lg text-navy hover:bg-secondary/60 transition-colors"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </nav>
      </header>

      {/* Mobile Navigation Menu */}
      <MobileNavMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        user={user}
        onSignOut={handleSignOut}
      />
    </>
  );
}
