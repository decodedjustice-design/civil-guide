import { Link } from 'react-router-dom';
import { 
  Lock, 
  Unlock, 
  FileText, 
  FolderOpen, 
  Clock, 
  FileSearch, 
  UserSearch, 
  Scale, 
  Newspaper,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { PatternStrength } from '@/hooks/usePatternEngine';

interface Tool {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: React.ElementType;
  requiresAuth: boolean;
  minStrength: PatternStrength;
  unlockReason?: string;
}

interface DynamicToolUnlockProps {
  patternStrength: PatternStrength;
  systemFilter: string;
  isLoggedIn: boolean;
}

const strengthOrder: PatternStrength[] = ['none', 'possible', 'strong', 'very_strong'];

function isUnlocked(toolStrength: PatternStrength, currentStrength: PatternStrength): boolean {
  return strengthOrder.indexOf(currentStrength) >= strengthOrder.indexOf(toolStrength);
}

const allTools: Tool[] = [
  // Always available (none)
  {
    id: 'timeline',
    label: 'Timeline Creator',
    description: 'Organize events chronologically to reveal patterns',
    href: '/timeline',
    icon: Clock,
    requiresAuth: true,
    minStrength: 'none',
    unlockReason: 'Essential for any civil rights case',
  },
  {
    id: 'evidence',
    label: 'Evidence Vault',
    description: 'Securely store documents, photos, and records',
    href: '/evidence-vault',
    icon: FolderOpen,
    requiresAuth: true,
    minStrength: 'none',
    unlockReason: 'Documentation is your foundation',
  },
  {
    id: 'notes',
    label: 'Notes',
    description: "Record details while they're fresh",
    href: '/notes',
    icon: FileText,
    requiresAuth: true,
    minStrength: 'none',
    unlockReason: 'Memory fades — capture details now',
  },
  {
    id: 'records',
    label: 'Public Request Rights',
    description: 'Understand, request, and organize public records and documents',
    href: '/public-request-rights?from=analyzer',
    icon: FileSearch,
    requiresAuth: false,
    minStrength: 'none',
    unlockReason: 'Know what you can request',
  },
  // Possible pattern
  {
    id: 'attorney',
    label: 'Attorney Matching',
    description: 'Find civil rights attorneys who handle similar cases',
    href: '/find-help',
    icon: UserSearch,
    requiresAuth: false,
    minStrength: 'possible',
    unlockReason: 'Unlocked because similar complaints exist',
  },
  // Strong pattern
  {
    id: 'oversight',
    label: 'Oversight Body Contacts',
    description: 'File complaints with agencies that investigate patterns',
    href: '/support-network',
    icon: Scale,
    requiresAuth: false,
    minStrength: 'strong',
    unlockReason: 'Available due to pattern detection',
  },
  // Very strong pattern
  {
    id: 'doj',
    label: 'DOJ Escalation Info',
    description: 'Learn about federal civil rights investigation processes',
    href: '/rights-insight?filter=federal',
    icon: Scale,
    requiresAuth: false,
    minStrength: 'very_strong',
    unlockReason: 'Escalation enabled by repeat-actor data',
  },
  {
    id: 'media',
    label: 'Media Preparation Guide',
    description: 'Guidance for public accountability when appropriate',
    href: '/rights-insight?filter=media',
    icon: Newspaper,
    requiresAuth: false,
    minStrength: 'very_strong',
    unlockReason: 'Enabled by documented pattern evidence',
  },
];

export function DynamicToolUnlock({ patternStrength, systemFilter, isLoggedIn }: DynamicToolUnlockProps) {
  const unlockedTools = allTools.filter(tool => isUnlocked(tool.minStrength, patternStrength));
  const lockedTools = allTools.filter(tool => !isUnlocked(tool.minStrength, patternStrength));
  
  return (
    <div className="space-y-6 mb-8">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Tools Available for Your Situation
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Based on your answers and pattern analysis, these tools are most relevant to you.
        </p>
      </div>
      
      {/* Unlocked Tools */}
      <div className="space-y-3">
        {unlockedTools.map((tool) => (
          <Link
            key={tool.id}
            to={tool.href}
            className="group flex items-center gap-4 p-4 rounded-xl bg-card border-2 border-border hover:border-primary/50 hover:shadow-glow transition-all duration-200 cursor-pointer active:scale-[0.99]"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-all">
              <tool.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {tool.label}
                </p>
                {tool.requiresAuth && !isLoggedIn && (
                  <span className="text-xs text-muted-foreground">(account required)</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {tool.description}
              </p>
              {tool.minStrength !== 'none' && (
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-400">{tool.unlockReason}</span>
                </div>
              )}
            </div>
            <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
      
      {/* Locked Tools */}
      {lockedTools.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Additional Tools (unlock with more documentation)
          </h4>
          <div className="space-y-2">
            {lockedTools.map((tool) => (
              <div
                key={tool.id}
                className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 border border-border/50 opacity-60"
              >
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-muted-foreground text-sm">
                    {tool.label}
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    Requires: {tool.minStrength === 'possible' ? 'Possible pattern' : 
                              tool.minStrength === 'strong' ? 'Strong pattern' : 'Very strong pattern'} detection
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            As you document your case and pattern evidence grows, additional escalation tools become available.
          </p>
        </div>
      )}
    </div>
  );
}
