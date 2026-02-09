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
    name: "Case Tools",
    items: [
      { name: "Evidence Vault", href: "/evidence-vault" },
      { name: "Timeline Creator", href: "/timeline" },
      { name: "Notes", href: "/notes" },
      { name: "Transcription", href: "/transcription" },
      { name: "Legal Templates", href: "/legal-templates" },
    ],
  },
  {
    name: "Guidance",
    items: [
      { name: "Rights Insight", href: "/rights-insight" },
      { name: "Civil Rights Library", href: "/library" },
      { name: "Courts & Filing", href: "/courts-filing-info" },
    ],
  },
  {
    name: "Find Support",
    items: [
      { name: "Find Attorneys", href: "/find-help" },
      { name: "Attorney Contact Hub", href: "/attorney-contacts" },
      { name: "Intake Packet", href: "/intake-packet" },
      { name: "Saved Attorneys", href: "/saved-attorneys" },
    ],
  },
];

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
          "flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors tracking-wide",
          isActive
            ? "text-primary"
            : "text-foreground/70 hover:text-foreground"
        )}
      >
        {item.name}
        <ChevronDown className={cn(
          "h-3.5 w-3.5 transition-transform duration-200",
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
        <div className="bg-card border border-border rounded shadow-lg py-2 min-w-[200px]">
          {item.items.map((subItem) => (
            <Link
              key={subItem.name}
              to={subItem.href}
              className={cn(
                "block px-4 py-2.5 text-sm transition-colors",
                location.pathname === subItem.href
                  ? "text-primary bg-accent-soft"
                  : "text-foreground/70 hover:text-foreground hover:bg-secondary/60"
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
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <nav className="container flex items-center justify-between py-3">
          {/* Logo - Left */}
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

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center gap-4">
            {user && (
              <Link
                to="/dashboard"
                className={cn(
                  "px-3 py-2 text-sm font-semibold transition-colors tracking-wide",
                  location.pathname === "/dashboard"
                    ? "text-primary"
                    : "text-foreground/70 hover:text-foreground"
                )}
              >
                Your Record
              </Link>
            )}
            {desktopNavItems.map((item) => (
              <DesktopNavDropdown key={item.name} item={item} location={location} />
            ))}
            <Link
              to="/about"
              className={cn(
                "px-3 py-2 text-sm font-medium transition-colors tracking-wide",
                location.pathname === "/about"
                  ? "text-primary"
                  : "text-foreground/70 hover:text-foreground"
              )}
            >
              About
            </Link>
          </div>

          {/* Desktop Auth - Right */}
          <div className="hidden lg:flex items-center gap-3">
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
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs h-9 px-4 text-muted-foreground hover:text-foreground hover:bg-secondary/60 tracking-wide" 
                  asChild
                >
                  <Link to="/auth">Log in</Link>
                </Button>
                <Button 
                  size="sm" 
                  className="text-xs h-9 px-6 bg-primary hover:bg-maroon-light text-white tracking-wide" 
                  asChild
                >
                  <Link to="/auth">Sign up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="p-2.5 rounded text-foreground/70 hover:text-foreground hover:bg-secondary/60 transition-colors"
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
