import { Link } from "react-router-dom";
import { Shield, Heart, Target, Eye, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";

export default function About() {
  return (
    <Layout>
      <div className="container py-12 lg:py-20">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              About Decoded Justice
            </h1>
            <p className="text-xl text-muted-foreground">
              A supportive space to regain clarity, organize what matters, and move forward with purpose.
            </p>
          </div>

          {/* Mission */}
          <section className="mb-16">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Our Mission</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Decoded Justice exists to replace confusion and helplessness with understanding and knowledge. 
                We believe that everyone deserves access to clear, calm, and supportive educational resources 
                when navigating potential civil rights, accountability, or justice-system issues — at their own pace, on their terms.
              </p>
            </div>
          </section>

          {/* What We Are / Are Not */}
          <section className="mb-16 grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                What We Are
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  An educational resource platform
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  A preparation and organization tool
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  A calm, supportive space for understanding
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  A guide to help you find proper resources
                </li>
              </ul>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                What We Are Not
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                  A law firm or legal service
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                  A source of legal advice
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                  A replacement for professional counsel
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                  A guarantee of any outcome
                </li>
              </ul>
            </div>
          </section>

          {/* Values */}
          <section className="mb-16">
            <h2 className="text-xl font-semibold text-foreground mb-6 text-center">Our Core Values</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "Clarity", description: "Replace confusion with understanding. Know where you stand." },
                { title: "Organization", description: "Keep what matters in one secure, accessible place." },
                { title: "Preparation", description: "Be ready for the conversations that matter most." },
                { title: "Orientation", description: "Understand how systems work before engaging with them." },
              ].map((value) => (
                <div key={value.title} className="p-5 rounded-xl bg-secondary/30 border border-border/50">
                  <h3 className="font-medium text-foreground mb-1">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Trauma-Aware */}
          <section className="mb-16">
            <div className="p-6 rounded-2xl bg-muted/30 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-6 h-6 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Trauma-Aware Design</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                We understand that navigating these situations can be difficult and emotionally taxing. 
                That's why every aspect of Decoded Justice is designed to be calm, supportive, and respectful of your pace. 
                You can pause, skip sections, or return later — this platform will be here when you're ready.
              </p>
            </div>
          </section>

          {/* CTA */}
          <div className="text-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/founders-story">
                Read the Founder's Story
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="mt-12 pt-8 border-t border-border">
            <Disclaimer className="justify-center" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
