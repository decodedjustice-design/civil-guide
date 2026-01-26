export function BelongingPanel() {
  return (
    <section className="py-12 lg:py-16">
      <div className="container max-w-2xl">
        <div className="p-6 lg:p-8 rounded-2xl bg-card/50 border border-border/50">
          {/* HumanNote */}
          <p className="text-foreground leading-relaxed mb-4">
            If you're here, you're likely dealing with something difficult. 
            That's okay. Confusion is normal when systems are fragmented.
          </p>

          {/* PermissionLanguage */}
          <p className="text-muted-foreground leading-relaxed text-sm">
            You can take your time. You can pause. You can come back later. 
            There's no rush, no pressure, and no one watching.
          </p>
        </div>
      </div>
    </section>
  );
}
