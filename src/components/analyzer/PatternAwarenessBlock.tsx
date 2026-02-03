import { Info, AlertCircle } from 'lucide-react';
import { PatternCopyBlock } from '@/hooks/usePatternAwareness';

interface PatternAwarenessBlockProps {
  blocks: PatternCopyBlock[];
}

export function PatternAwarenessBlock({ blocks }: PatternAwarenessBlockProps) {
  if (blocks.length === 0) return null;
  
  const contextBlocks = blocks.filter(b => b.type === 'context');
  const cautionBlocks = blocks.filter(b => b.type === 'caution');
  const disclaimerBlocks = blocks.filter(b => b.type === 'disclaimer');
  
  return (
    <section className="mb-8">
      <div className="rounded-2xl bg-muted/30 border border-border p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Info className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">What Others Have Experienced</h2>
        </div>
        
        <div className="space-y-3 mb-6">
          {contextBlocks.map((block) => (
            <p key={block.id} className="text-muted-foreground text-sm leading-relaxed">
              {block.text}
            </p>
          ))}
        </div>
        
        {cautionBlocks.length > 0 && (
          <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            {cautionBlocks.map((block) => (
              <p key={block.id} className="text-amber-600 dark:text-amber-400 text-sm leading-relaxed">
                {block.text}
              </p>
            ))}
          </div>
        )}
        
        {disclaimerBlocks.length > 0 && (
          <div className="pt-4 border-t border-border">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-2">
                {disclaimerBlocks.map((block) => (
                  <p key={block.id} className="text-xs text-muted-foreground leading-relaxed">
                    {block.text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
