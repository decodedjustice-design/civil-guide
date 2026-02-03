import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ExternalLink, 
  Phone, 
  Bookmark, 
  X, 
  ChevronDown, 
  ChevronRight,
  Scale,
  FileSearch,
  Stethoscope,
  Users,
  Globe,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MatchedResource, 
  categoryLabels, 
  useResourceMatching,
  groupResourcesByCategory 
} from '@/hooks/useResourceMatching';
import { CaseContext } from '@/hooks/useCaseContext';
import { useAuth } from '@/contexts/AuthContext';
import { useJusticePlace } from '@/hooks/useJusticePlace';
import { toast } from '@/hooks/use-toast';

interface SmartResourceListProps {
  context: CaseContext;
  onDismiss?: (id: string) => void;
  showExplanation?: boolean;
}

const categoryIcons: Record<MatchedResource['category'], React.ElementType> = {
  legal_help: Scale,
  records_accountability: FileSearch,
  medical_oversight: Stethoscope,
  community_advocacy: Users,
  additional_support: Users,
  general: Globe,
};

function ResourceCard({ 
  resource, 
  onDismiss,
  onBookmark,
  isBookmarked,
}: { 
  resource: MatchedResource;
  onDismiss?: (id: string) => void;
  onBookmark?: (resource: MatchedResource) => void;
  isBookmarked?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="p-4 rounded-xl bg-card border border-border hover:border-accent/30 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h4 className="font-medium text-foreground text-sm">{resource.name}</h4>
            <Badge variant="outline" className="text-xs">
              {resource.jurisdiction === 'washington' ? 'WA' : 'Federal'}
            </Badge>
          </div>
          
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
            {resource.description}
          </p>
          
          {/* No relevance reason displayed - scoring is internal only */}
        </div>
        
        <div className="flex items-center gap-1 shrink-0">
          {onBookmark && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onBookmark(resource)}
            >
              <Bookmark 
                className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-accent text-accent' : 'text-muted-foreground'}`} 
              />
            </Button>
          )}
          {onDismiss && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={() => onDismiss(resource.id)}
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Expandable details */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1 mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        {isExpanded ? 'Less' : 'More info'}
      </button>
      
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-border flex flex-wrap gap-3 text-sm">
          {resource.phone && (
            <a 
              href={`tel:${resource.phone}`}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              {resource.phone}
            </a>
          )}
          {resource.website && (
            <a
              href={resource.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-accent hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Visit website
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function ResourceCategory({
  category,
  resources,
  onDismiss,
  onBookmark,
  bookmarkedIds,
  defaultExpanded = true,
}: {
  category: MatchedResource['category'];
  resources: MatchedResource[];
  onDismiss?: (id: string) => void;
  onBookmark?: (resource: MatchedResource) => void;
  bookmarkedIds: Set<string>;
  defaultExpanded?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const Icon = categoryIcons[category];
  
  if (resources.length === 0) return null;
  
  return (
    <div className="mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 w-full text-left mb-3 group"
      >
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-accent" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-sm group-hover:text-accent transition-colors">
            {categoryLabels[category]}
          </h3>
          <p className="text-xs text-muted-foreground">{resources.length} resources</p>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      
      {isExpanded && (
        <div className="space-y-3 ml-10">
          {resources.map(resource => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onDismiss={onDismiss}
              onBookmark={onBookmark}
              isBookmarked={bookmarkedIds.has(resource.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function SmartResourceList({ 
  context, 
  onDismiss,
  showExplanation = true,
}: SmartResourceListProps) {
  const { user } = useAuth();
  const { addBookmark } = useJusticePlace();
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);
  
  const { 
    resources, 
    groupedResources, 
    topResources,
    dismissResource, 
    dismissedCount 
  } = useResourceMatching(context);
  
  const handleDismiss = (id: string) => {
    dismissResource(id);
    onDismiss?.(id);
  };
  
  const handleBookmark = async (resource: MatchedResource) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save resources to Justice Place.",
      });
      return;
    }
    
    try {
      await addBookmark({
        resourceId: resource.id,
        resourceType: resource.source === 'legal' ? 'legal_resource' : 'support_resource',
        resourceTitle: resource.name,
        resourceUrl: resource.website,
      });
      setBookmarkedIds(prev => new Set([...prev, resource.id]));
      toast({
        title: "Resource saved",
        description: "Added to your Justice Place bookmarks.",
      });
    } catch (error) {
      toast({
        title: "Could not save",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const displayResources = showAll ? resources : topResources;
  const hasMoreResources = resources.length > topResources.length;
  
  return (
    <div className="rounded-2xl bg-card border border-border p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-1">
            Resources for Your Situation
          </h2>
          {showExplanation && (
            <p className="text-sm text-muted-foreground">
              These resources are shown based on what you shared.
            </p>
          )}
        </div>
        {dismissedCount > 0 && (
          <Badge variant="outline" className="text-xs">
            {dismissedCount} hidden
          </Badge>
        )}
      </div>
      
      {/* Explanation note */}
      {showExplanation && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 mb-6">
          <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Resources are prioritized by relevance to your system, issue type, and stage. 
            Save what's helpful, dismiss what's not, or show more general resources.
          </p>
        </div>
      )}
      
      {/* Grouped or flat view */}
      {showAll ? (
        // Grouped view when showing all
        <div>
          {(['legal_help', 'records_accountability', 'medical_oversight', 'community_advocacy', 'additional_support', 'general'] as const).map(category => (
            <ResourceCategory
              key={category}
              category={category}
              resources={groupedResources[category]}
              onDismiss={handleDismiss}
              onBookmark={handleBookmark}
              bookmarkedIds={bookmarkedIds}
              defaultExpanded={category !== 'general'}
            />
          ))}
        </div>
      ) : (
        // Top resources flat list
        <div className="space-y-3">
          {displayResources.map(resource => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onDismiss={handleDismiss}
              onBookmark={handleBookmark}
              isBookmarked={bookmarkedIds.has(resource.id)}
            />
          ))}
        </div>
      )}
      
      {/* Show more/less toggle */}
      {hasMoreResources && (
        <div className="mt-4 pt-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="w-full"
          >
            {showAll ? 'Show fewer resources' : `Show all ${resources.length} resources`}
          </Button>
        </div>
      )}
      
      {/* Link to full directories */}
      <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-3">
        <Link
          to="/find-legal-help"
          className="text-sm text-accent hover:underline flex items-center gap-1"
        >
          <Scale className="w-3.5 h-3.5" />
          Full attorney directory
        </Link>
        <Link
          to="/support-network"
          className="text-sm text-accent hover:underline flex items-center gap-1"
        >
          <Users className="w-3.5 h-3.5" />
          All support resources
        </Link>
      </div>
      
      {/* Disclaimer */}
      <p className="mt-4 text-xs text-muted-foreground italic">
        This is educational information, not legal advice. Resources are not referrals.
      </p>
    </div>
  );
}
