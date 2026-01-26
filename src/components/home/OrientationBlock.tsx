export function OrientationBlock() {
  return (
    <section className="py-12 lg:py-16 bg-muted/30">
      <div className="container max-w-3xl">
        {/* ContextLines */}
        <div className="space-y-4 text-center">
          <p className="text-muted-foreground leading-relaxed">
            This is an educational space for people navigating complex public systems — 
            courts, housing, police, child welfare, benefits, and more.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Nothing here is legal advice. Nothing here predicts outcomes. 
            This is a place to learn, organize, and prepare.
          </p>
        </div>

        {/* ClarityMarkers */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
            Educational only
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
            No legal advice
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
            Your pace, your control
          </span>
        </div>
      </div>
    </section>
  );
}
