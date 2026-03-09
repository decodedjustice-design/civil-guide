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

const navItems = [
  { name: "Home", href: "/" },
  { name: "Private Record", href: "/dashboard" },
  { name: "How It Works", href: "/tools" },
  { name: "Learn", href: "/library" },
  { name: "Find Help", href: "/find-help" },
  { name: "About", href: "/about" },
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

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 transition-opacity duration-300",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in Menu */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-[320px] max-w-[85vw] bg-card shadow-2xl transition-transform duration-300 ease-out overflow-y-auto",
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
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded text-foreground/60 hover:text-foreground hover:bg-secondary/60 transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-6 py-6">
          {/* Auth Section */}
          {user ? (
            <div className="pb-6 mb-6 border-b border-border">
              <p className="text-xs text-muted-foreground truncate mb-3 tracking-wide">{user.email}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="w-full h-10 text-sm border-border hover:bg-secondary/60 tracking-wide"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="pb-6 mb-6 border-b border-border">
              <Button size="sm" className="w-full h-11 bg-primary hover:bg-maroon-light tracking-wide" asChild>
                <Link to="/case-builder" onClick={handleLinkClick}>
                  Start Your Case
                </Link>
              </Button>
            </div>
          )}

          {/* Navigation Links */}
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-center min-h-[44px] px-4 py-2.5 text-sm transition-colors rounded tracking-wide",
                  location.pathname === item.href
                    ? "text-primary bg-accent-soft font-medium"
                    : "text-foreground/70 hover:text-foreground hover:bg-secondary/60"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
