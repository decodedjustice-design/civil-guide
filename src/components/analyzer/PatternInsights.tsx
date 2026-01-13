import { AlertTriangle, TrendingUp, Shield, Database, ExternalLink } from 'lucide-react';
import { PatternAnalysis, PatternStrength } from '@/hooks/usePatternEngine';

interface PatternInsightsProps {
  analysis: PatternAnalysis;
  entityName: string;
}

const strengthConfig: Record<PatternStrength, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ElementType;
}> = {
  none: {
    label: 'No Pattern Detected',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/50',
    borderColor: 'border-border',
    icon: Database,
  },
  possible: {
    label: 'Possible Pattern',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    icon: TrendingUp,
  },
  strong: {
    label: 'Strong Pattern',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    icon: AlertTriangle,
  },
  very_strong: {
    label: 'Very Strong Pattern',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    icon: Shield,
  },
};

export function PatternInsights({ analysis, entityName }: PatternInsightsProps) {
  const config = strengthConfig[analysis.strength];
  const Icon = config.icon;
  
  return (
    <div className={`p-6 rounded-2xl ${config.bgColor} border ${config.borderColor} mb-6`}>
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl ${config.bgColor} border ${config.borderColor} flex items-center justify-center shrink-0`}>
          <Icon className={`w-6 h-6 ${config.color}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-foreground">
              What this suggests about your system
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color} border ${config.borderColor}`}>
              {config.label}
            </span>
          </div>
          
          <p className="text-muted-foreground mb-4">
            {analysis.notes}
          </p>
          
          {analysis.totalRelatedCases > 0 && (
            <div className="space-y-3">
              {/* Entity Patterns */}
              {analysis.entityPatterns.length > 0 && (
                <div className="p-4 rounded-xl bg-background/50 border border-border">
                  <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    Entity Pattern: {entityName}
                  </h4>
                  <ul className="space-y-2">
                    {analysis.entityPatterns.map((pattern) => (
                      <li key={pattern.id} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>
                          <strong>{pattern.caseCount}+ documented cases</strong>
                          {pattern.source && (
                            <span className="text-xs ml-1">
                              (Source: {pattern.source}
                              {pattern.isVerified && <span className="text-green-400 ml-1">✓ Verified</span>})
                            </span>
                          )}
                          {pattern.description && (
                            <span className="block text-xs text-muted-foreground/70 mt-1">
                              {pattern.description}
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Claim Patterns */}
              {analysis.claimPatterns.length > 0 && (
                <div className="p-4 rounded-xl bg-background/50 border border-border">
                  <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Similar Claims in Your System
                  </h4>
                  <ul className="space-y-2">
                    {analysis.claimPatterns.slice(0, 3).map((pattern) => (
                      <li key={pattern.id} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>
                          <strong>{pattern.entity}</strong> — {pattern.patternType} pattern
                          {pattern.caseCount > 1 && ` (${pattern.caseCount} cases)`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Escalation Implications */}
              {analysis.strength !== 'none' && (
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Why This Matters for Escalation
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {analysis.strength === 'very_strong' && (
                      <>
                        Pattern evidence significantly strengthens civil rights complaints. 
                        Federal agencies like DOJ and state AGs prioritize <em>pattern-or-practice</em> cases. 
                        Media coverage is more likely when systemic issues are documented.
                      </>
                    )}
                    {analysis.strength === 'strong' && (
                      <>
                        Strong pattern evidence makes your case more compelling to oversight bodies.
                        Consider contacting civil rights attorneys who specialize in Monell claims 
                        (holding institutions accountable for patterns of misconduct).
                      </>
                    )}
                    {analysis.strength === 'possible' && (
                      <>
                        Your documentation may help establish a pattern. 
                        Thorough evidence gathering now could connect your experience to others 
                        and strengthen collective action.
                      </>
                    )}
                  </p>
                </div>
              )}
            </div>
          )}
          
          {analysis.strength === 'none' && (
            <div className="p-4 rounded-xl bg-muted/30 border border-border">
              <p className="text-sm text-muted-foreground">
                <strong>This doesn't mean your case isn't valid.</strong> It means documented pattern data 
                for this specific entity/claim combination isn't yet established. Your thorough documentation 
                could be the foundation for future pattern recognition.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
