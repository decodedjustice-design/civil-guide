import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-home.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background with warm gradient overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Justice and dignity" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90" />
      </div>

      {/* Content */}
      <div className="container relative z-10">
        <div className="max-w-2xl animate-fade-up">
          {/* Decorative accent line */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-0.5 bg-primary" />
            <span className="text-sm font-medium text-primary tracking-wide uppercase">
              Clarity · Justice · Empathy
            </span>
          </div>

          {/* Headlines */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-navy leading-tight mb-6">
            A space for clarity when systems feel overwhelming
          </h1>
          
          <p className="text-lg md:text-xl text-navy-soft leading-relaxed mb-10 max-w-xl">
            Learn, organize, and prepare at your own pace — with dignity, structure, and calm.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <Button size="lg" className="h-14 px-8 text-base shadow-lg hover:shadow-xl transition-all" asChild>
              <Link to="/tools">Explore what's here</Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="h-14 px-8 text-base border-2 border-navy/20 text-navy hover:bg-navy/5 hover:border-navy/30" 
              asChild
            >
              <Link to="/analyzer">Start with the Analyzer</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Subtle decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
