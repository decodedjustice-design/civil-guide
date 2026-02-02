import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileNavMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: { email?: string } | null;
  onSignOut: () => void;
}

const navSections = [
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
      { name: "Transcription Tool", href: "/transcription" },
    ],
  },
  {
    label: "LEARNING",
    items: [
      { name: "Library", href: "/library" },
      { name: "Rights Insight", href: "/rights-insight" },
      { name: "Quick Reference Guides", href: "/rights-insight#guides" },
    ],
  },
  {
    label: "FIND HELP",
    items: [
      { name: "Find Attorneys", href: "/find-help" },
      { name: "Courts & Filing Info", href: "/courts-filing-info" },
      { name: "Saved Attorneys", href: "/saved-attorneys" },
    ],
  },
];

export function MobileNavMenu({ isOpen, onClose, user, onSignOut }: MobileNavMenuProps) {
  const location = useLocation();

  const handleLinkClick = () => {
    onClose();
  };

  const handleSignOut = () => {
    onSignOut();
    onClose();
  };

  const isActive = (href: string) => {
    if (href.includes("#")) {
      return location.pathname === href.split("#")[0];
    }
    return location.pathname === href;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in Menu */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-[320px] max-w-[85vw] bg-white shadow-2xl transition-transform duration-300 ease-out overflow-y-auto",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-lg text-navy hover:bg-secondary/60 transition-colors"
          aria-label="Close menu"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="px-6 py-6">
          {/* User Info Section */}
          {user && (
            <div className="pb-6 mb-6 border-b border-border">
              <p className="text-sm text-navy-soft truncate mb-3">{user.email}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="w-full h-10 text-sm border-border hover:bg-secondary/60"
              >
                Sign Out
              </Button>
            </div>
          )}

          {/* Auth Buttons (if not logged in) */}
          {!user && (
            <div className="pb-6 mb-6 border-b border-border flex gap-3">
              <Button variant="outline" size="sm" className="flex-1 h-11 border-border" asChild>
                <Link to="/auth" onClick={handleLinkClick}>
                  Log in
                </Link>
              </Button>
              <Button size="sm" className="flex-1 h-11" asChild>
                <Link to="/auth" onClick={handleLinkClick}>
                  Sign up
                </Link>
              </Button>
            </div>
          )}

          {/* Navigation Sections */}
          <div className="space-y-8">
            {navSections.map((section) => (
              <div key={section.label}>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  {section.label}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={handleLinkClick}
                      className={cn(
                        "flex items-center min-h-[48px] px-4 py-3 text-base font-medium transition-colors rounded-r-lg -ml-4",
                        isActive(item.href)
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
          </div>
        </div>
      </div>
    </>
  );
}
