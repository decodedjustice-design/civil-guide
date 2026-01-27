import familyPaperwork from "@/assets/family-paperwork.png";
import { Heart, Shield, Users } from "lucide-react";

export function HumanLayer() {
  return (
    <section className="py-24 lg:py-32 overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-lg">
              <img 
                src={familyPaperwork} 
                alt="Family working together on documents" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/30 via-transparent to-transparent" />
            </div>
            {/* Decorative accents */}
            <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-2xl bg-primary/10 -z-10" />
            <div className="absolute -top-6 -left-6 w-32 h-32 rounded-2xl bg-gold-soft -z-10" />
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-8">
              <Heart className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Human-Centered</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-semibold text-navy mb-6 leading-tight">
              Built for families. Designed for dignity.
            </h2>

            <div className="space-y-5 text-lg text-muted-foreground leading-relaxed mb-10">
              <p>
                Systems weren't built with you in mind. But understanding them is possible — and you don't have to navigate alone.
              </p>
              <p>
                This is a space built around calm strength, clear thinking, and human dignity. Take what you need. Move at your pace.
              </p>
            </div>

            {/* Trust signals */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-navy">Dignity</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-navy">Privacy</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-navy">Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
