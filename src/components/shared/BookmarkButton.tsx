import { useState } from "react";
import { Bookmark, BookmarkCheck, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useJusticePlace } from "@/hooks/useJusticePlace";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  resourceType: "library_guide" | "legal_template" | "attorney" | "court_resource";
  resourceId: string;
  resourceTitle: string;
  resourceUrl?: string;
  variant?: "icon" | "button" | "compact";
  className?: string;
}

export function BookmarkButton({
  resourceType,
  resourceId,
  resourceTitle,
  resourceUrl,
  variant = "icon",
  className,
}: BookmarkButtonProps) {
  const navigate = useNavigate();
  const { user, isBookmarked, addBookmark, removeBookmark, bookmarks } = useJusticePlace();
  const [isLoading, setIsLoading] = useState(false);

  const bookmarked = isBookmarked(resourceType, resourceId);
  const bookmark = bookmarks.find(
    (b) => b.resource_type === resourceType && b.resource_id === resourceId
  );

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
      // Redirect to auth with return URL
      navigate(`/auth?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setIsLoading(true);
    try {
      if (bookmarked && bookmark) {
        await removeBookmark(bookmark.id);
      } else {
        await addBookmark({
          resourceType,
          resourceId,
          resourceTitle,
          resourceUrl,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className={cn(
          "p-2 rounded-lg transition-all duration-200",
          bookmarked
            ? "text-accent bg-accent/10 hover:bg-accent/20"
            : "text-muted-foreground hover:text-accent hover:bg-accent/10",
          isLoading && "opacity-50 cursor-not-allowed",
          className
        )}
        title={user ? (bookmarked ? "Remove from Justice Place" : "Save to Justice Place") : "Sign in to save"}
      >
        {!user ? (
          <LogIn className="w-4 h-4" />
        ) : bookmarked ? (
          <BookmarkCheck className="w-4 h-4" />
        ) : (
          <Bookmark className="w-4 h-4" />
        )}
      </button>
    );
  }

  if (variant === "compact") {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleClick}
        disabled={isLoading}
        className={cn(
          "gap-1.5 text-xs",
          bookmarked && "text-accent",
          className
        )}
      >
        {!user ? (
          <>
            <LogIn className="w-3.5 h-3.5" />
            Sign in to save
          </>
        ) : bookmarked ? (
          <>
            <BookmarkCheck className="w-3.5 h-3.5" />
            Saved
          </>
        ) : (
          <>
            <Bookmark className="w-3.5 h-3.5" />
            Save
          </>
        )}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant={bookmarked ? "soft" : "outline"}
      size="sm"
      onClick={handleClick}
      disabled={isLoading}
      className={cn("gap-2", className)}
    >
      {!user ? (
        <>
          <LogIn className="w-4 h-4" />
          Sign in to save
        </>
      ) : bookmarked ? (
        <>
          <BookmarkCheck className="w-4 h-4" />
          Saved to Justice Place
        </>
      ) : (
        <>
          <Bookmark className="w-4 h-4" />
          Save to Justice Place
        </>
      )}
    </Button>
  );
}
