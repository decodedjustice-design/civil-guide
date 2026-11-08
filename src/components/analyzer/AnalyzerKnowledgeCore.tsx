interface Props { issueIds: string[]; }
/** The live schema has no published knowledge-core relations. Local law modules remain available. */
export function AnalyzerKnowledgeCore({ issueIds }: Props) {
  if (!issueIds.length) return null;
  return <section className="border-b border-border bg-background px-5 py-8 sm:px-8">
    <p className="text-sm text-muted-foreground">The verified knowledge layer is unavailable. Existing issue-library references remain educational; authority needs verification.</p>
  </section>;
}
