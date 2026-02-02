import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import decodedJusticeLogo from "@/assets/decoded-justice-scales-logo.png";

const desktopNavItems = [
  {
    name: "Tools",
    items: [
      { name: "Evidence Vault", href: "/evidence-vault" },
      { name: "Timeline Creator", href: "/timeline" },
      { name: "Notes", href: "/notes" },
      { name: "Transcription", href: "/transcription" },
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
      { name: "Courts & Filing", href: "/courts-filing-info" },
      { name: "Saved Attorneys", href: "/saved-attorneys" },
    ],
  },
];

const mobileNavSections = [
  {
    label: "HOME",
    items: [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "Why This Exists", href: "/founders-story" },
    ],
  },
  {
    label: "TOOLS",
    items: [
      { name: "Self-Help Tools", href: "/self-help" },
      { name: "Evidence Vault", href: "/evidence-vault" },
      { name: "Timeline Creator", href: "/timeline" },
      { name: "Notes", href: "/notes" },
      { name: "Transcription", href: "/transcription" },
    ],
  },
  {
    label: "LEARNING",
    items: [
      { name: "Library", href: "/library" },
      { name: "Rights Insight", href: "/rights-insight" },
    ],
  },
  {
    label: "FIND HELP",
    items: [
      { name: "Find Attorneys", href: "/find-help" },
      { name: "Courts & Filing", href: "/courts-filing-info" },
      { name: "Saved Attorneys", href: "/saved-attorneys" },
    ],
  },
];

const userNavSection = {
  label: "USER",
  items: [
    { name: "Bookmarks", href: "/bookmarks" },
    { name: "Account Settings", href: "/account" },
  ],
};

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
    setMobileMenuOpen(false);
  };

  return (
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
        <div className="hidden md:flex items-center gap-8">
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

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="lg:hidden p-2.5 rounded-lg text-navy-soft hover:text-navy hover:bg-secondary/60 transition-colors"
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
        <div className="lg:hidden fixed inset-0 top-[57px] bg-card/98 backdrop-blur-xl border-t border-border/40 overflow-y-auto">
          <div className="container py-6">
            {/* Close button */}
            <button
              type="button"
              className="absolute top-4 right-4 p-2 rounded-lg text-navy-soft hover:text-navy hover:bg-secondary/60 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>

            {/* User email if logged in */}
            {user && (
              <div className="mb-6 pb-4 border-b border-border/50">
                <p className="text-sm text-navy-soft truncate">{user.email}</p>
              </div>
            )}

            {/* Navigation Sections */}
            <div className="space-y-6">
              {mobileNavSections.map((section) => (
                <div key={section.label}>
                  <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">
                    {section.label}
                  </h3>
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "block px-4 py-2.5 text-base font-medium transition-colors rounded-r-lg",
                          location.pathname === item.href
                            ? "text-primary bg-accent-soft border-l-4 border-primary"
                            : "text-navy hover:bg-secondary/60 border-l-4 border-transparent"
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {/* User Section - only if logged in */}
              {user && (
                <div>
                  <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">
                    {userNavSection.label}
                  </h3>
                  <div className="space-y-1">
                    {userNavSection.items.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "block px-4 py-2.5 text-base font-medium transition-colors rounded-r-lg",
                          location.pathname === item.href
                            ? "text-primary bg-accent-soft border-l-4 border-primary"
                            : "text-navy hover:bg-secondary/60 border-l-4 border-transparent"
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2.5 text-base font-medium text-navy hover:bg-secondary/60 transition-colors rounded-r-lg border-l-4 border-transparent"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Auth buttons - only if NOT logged in */}
            {!user && (
              <div className="pt-6 mt-6 border-t border-border/50 flex gap-3">
                <Button variant="outline" size="sm" className="flex-1 h-11 border-border" asChild>
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    Log in
                  </Link>
                </Button>
                <Button size="sm" className="flex-1 h-11" asChild>
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    Sign up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
