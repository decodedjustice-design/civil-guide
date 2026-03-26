import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-home.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Layered background with soft gradients */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Justice and dignity" 
          className="w-full h-full object-cover opacity-[0.12]"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-accent-soft/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-gold-soft/30 blur-3xl" />

      {/* Content */}
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center animate-fade-up">
          {/* Elegant decorative line */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div className="w-2 h-2 rounded-full bg-primary/40" />
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </div>

          {/* Headlines */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-navy leading-[1.15] mb-4 tracking-wide">
            Your Experience. Your Rights. Your Justice.
          </h1>

          <p className="text-base md:text-lg text-primary font-medium tracking-wide mb-8 max-w-2xl mx-auto">
            Understand, organize, and present your civil rights case.
          </p>
          
          <p className="text-lg md:text-xl text-navy-soft leading-relaxed mb-12 max-w-2xl mx-auto">
            Decoded Justice exists to help people understand systems that shape their lives — calmly, clearly, and with respect.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="h-14 px-10 text-base shadow-lg hover:shadow-xl transition-all rounded-xl" 
              asChild
            >
              <Link to="/tools">Explore the platform</Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="h-14 px-10 text-base border-2 border-navy/15 text-navy hover:bg-navy/5 hover:border-navy/25 rounded-xl" 
              asChild
            >
              <Link to="/case-builder">Start Your Case</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
