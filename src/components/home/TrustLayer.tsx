import { Scale, BookOpen, ShieldCheck, FileX } from "lucide-react";

export function TrustLayer() {
  return (
    <section className="py-20 lg:py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          {/* Section label */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy/5 mb-8">
            <Scale className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-navy">What this is</span>
          </div>

          {/* Main statement */}
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-navy mb-6 leading-tight">
            An educational platform for navigating public systems with clarity and dignity.
          </h2>

          {/* Clarification */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="flex items-center gap-2 text-navy-soft">
              <FileX className="w-4 h-4 text-primary/70" />
              <span className="text-sm">Not legal advice</span>
            </div>
            <div className="flex items-center gap-2 text-navy-soft">
              <ShieldCheck className="w-4 h-4 text-primary/70" />
              <span className="text-sm">Not predictions</span>
            </div>
            <div className="flex items-center gap-2 text-navy-soft">
              <BookOpen className="w-4 h-4 text-primary/70" />
              <span className="text-sm">Not automation of justice</span>
            </div>
          </div>

          {/* Purpose */}
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            A space for understanding, organization, and preparation.
          </p>
        </div>
      </div>
    </section>
  );
}
