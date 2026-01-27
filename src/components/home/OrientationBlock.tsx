export function OrientationBlock() {
  return (
    <section className="py-8 bg-muted/30">
      <div className="container max-w-2xl">
        <div className="text-center mb-6">
          <h2 className="text-sm font-medium text-foreground mb-2">What this is</h2>
          <p className="text-sm text-muted-foreground">
            An educational space for understanding public systems — not legal advice.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-primary/50" />
            Learning
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-primary/50" />
            Organization
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-primary/50" />
            Preparation
          </span>
        </div>
      </div>
    </section>
  );
}
