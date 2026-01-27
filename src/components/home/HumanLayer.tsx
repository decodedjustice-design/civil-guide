import heroAnalysis from "@/assets/hero-analysis.png";

export function HumanLayer() {
  return (
    <section className="py-20 lg:py-28 overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-lg">
              <img 
                src={heroAnalysis} 
                alt="Understanding and clarity" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/20 to-transparent" />
            </div>
            {/* Decorative accent */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-2xl bg-primary/10 -z-10" />
            <div className="absolute -top-4 -left-4 w-24 h-24 rounded-2xl bg-gold-soft -z-10" />
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-0.5 bg-primary" />
              <span className="text-sm font-medium text-primary tracking-wide uppercase">
                Human-Centered
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-semibold text-navy mb-6 leading-tight">
              Justice with humanity. Clarity with dignity.
            </h2>

            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                Systems weren't designed with you in mind. But understanding them is possible — and you don't have to face it alone.
              </p>
              <p>
                This is a space built around dignity, structure, and calm. Take what you need. Move at your pace. Return when you're ready.
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-border/50">
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm font-medium text-foreground">Clarity</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm font-medium text-foreground">Dignity</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm font-medium text-foreground">Empowerment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
