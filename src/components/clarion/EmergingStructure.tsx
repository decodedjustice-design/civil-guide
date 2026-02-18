import { useMemo } from "react";
import { Clock, Users, Link2, Sparkles } from "lucide-react";

interface ClarionEntry {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface EmergingStructureProps {
  entries: ClarionEntry[];
  visible: boolean;
}

/** Extract simple structure signals from raw entry text */
function extractStructure(entries: ClarionEntry[]) {
  const allText = entries.map((e) => e.content).join("\n");

  // Timeline: group entries by date
  const timeline = entries.map((e) => ({
    date: new Date(e.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    preview: e.content.slice(0, 80) + (e.content.length > 80 ? "…" : ""),
  }));

  // People: naive extraction of capitalized proper nouns (2+ words)
  const namePattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b/g;
  const namesSet = new Set<string>();
  let match;
  while ((match = namePattern.exec(allText)) !== null) {
    namesSet.add(match[1]);
  }

  // Connections: look for references to organizations, agencies, places
  const orgPatterns = /\b(?:CPS|DCYF|DHS|police|hospital|school|court|office|department|agency|clinic)\b/gi;
  const connections = new Set<string>();
  let orgMatch;
  while ((orgMatch = orgPatterns.exec(allText)) !== null) {
    connections.add(orgMatch[0].charAt(0).toUpperCase() + orgMatch[0].slice(1).toLowerCase());
  }

  // Standout moments: sentences with emotional weight indicators
  const sentences = allText.split(/[.!?\n]+/).filter((s) => s.trim().length > 20);
  const emotionalWords = /\b(scared|afraid|confused|angry|hurt|worried|shocked|frustrated|relieved|surprised|crying|yelling|threatening|refused|denied|ignored|lied)\b/i;
  const standouts = sentences
    .filter((s) => emotionalWords.test(s))
    .slice(0, 3)
    .map((s) => s.trim());

  return {
    timeline,
    people: Array.from(namesSet).slice(0, 6),
    connections: Array.from(connections).slice(0, 6),
    standouts,
  };
}

export default function EmergingStructure({ entries, visible }: EmergingStructureProps) {
  const structure = useMemo(() => extractStructure(entries), [entries]);

  if (!visible || entries.length === 0) return null;

  const sections = [
    {
      key: "timeline",
      icon: Clock,
      label: "Timeline forming",
      hasContent: structure.timeline.length > 0,
      content: (
        <div className="space-y-2">
          {structure.timeline.map((t, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <span className="text-muted-foreground/60 text-xs min-w-[48px] pt-0.5">{t.date}</span>
              <span className="text-foreground/80 font-light leading-relaxed">{t.preview}</span>
            </div>
          ))}
        </div>
      ),
      delay: "0s",
    },
    {
      key: "people",
      icon: Users,
      label: "Who was part of this",
      hasContent: structure.people.length > 0,
      content: (
        <div className="flex flex-wrap gap-2">
          {structure.people.map((name) => (
            <span
              key={name}
              className="text-xs bg-secondary/50 text-foreground/70 px-3 py-1.5 rounded-full"
            >
              {name}
            </span>
          ))}
        </div>
      ),
      delay: "0.15s",
    },
    {
      key: "connections",
      icon: Link2,
      label: "Things connected to this",
      hasContent: structure.connections.length > 0,
      content: (
        <div className="flex flex-wrap gap-2">
          {structure.connections.map((c) => (
            <span
              key={c}
              className="text-xs bg-secondary/50 text-foreground/70 px-3 py-1.5 rounded-full"
            >
              {c}
            </span>
          ))}
        </div>
      ),
      delay: "0.3s",
    },
    {
      key: "standouts",
      icon: Sparkles,
      label: "Moments that stand out",
      hasContent: structure.standouts.length > 0,
      content: (
        <div className="space-y-2">
          {structure.standouts.map((s, i) => (
            <p key={i} className="text-sm text-foreground/70 font-light leading-relaxed italic">
              "{s}"
            </p>
          ))}
        </div>
      ),
      delay: "0.45s",
    },
  ];

  const activeSections = sections.filter((s) => s.hasContent);

  if (activeSections.length === 0) {
    return (
      <div
        className="mt-10 pt-8 border-t border-border/20 animate-fade-up"
        style={{ animationDelay: "0.2s", animationFillMode: "both" }}
      >
        <p className="text-sm text-muted-foreground/60 font-light text-center">
          As you write more, patterns and structure will begin to surface here.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10 pt-8 border-t border-border/20 space-y-6">
      {activeSections.map((section) => (
        <div
          key={section.key}
          className="animate-fade-up"
          style={{ animationDelay: section.delay, animationFillMode: "both" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <section.icon className="w-3.5 h-3.5 text-muted-foreground/50" />
            <span className="text-xs text-muted-foreground/60 tracking-wide uppercase font-medium">
              {section.label}
            </span>
          </div>
          {section.content}
        </div>
      ))}
    </div>
  );
}
