import { Link } from "react-router-dom";
import { 
  Search, 
  FileText, 
  Scale, 
  BookOpen, 
  Users, 
  ArrowRight,
  Shield,
  Clock,
  Folder,
  Compass
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";
import heroImage from "@/assets/hero-courthouse.png";

const features = [
  {
    icon: Search,
    title: "Civil Rights Analyzer",
    description: "Answer a few questions to understand what systems may be involved and what your options might be.",
    href: "/analyzer",
    cta: "Start Analysis",
    primary: true,
  },
  {
    icon: FileText,
    title: "Justice Decoder",
    description: "Paste official documents or legal language to get plain-English explanations of what they mean.",
    href: "/legal-decoder",
    cta: "Decode Text",
  },
  {
    icon: BookOpen,
    title: "Rights Insight",
    description: "Learn about your rights and how different systems work — at your own pace, in plain language.",
    href: "/rights-insight",
    cta: "Explore Guides",
  },
  {
    icon: Users,
    title: "Find Legal Help",
    description: "Find attorneys, legal aid organizations, and referral services in your area.",
    href: "/find-help",
    cta: "Search Resources",
  },
];

const principles = [
  {
    icon: Compass,
    title: "Clarity",
    description: "Replace confusion with understanding. Know where you stand and what your options are."
  },
  {
    icon: Folder,
    title: "Organization",
    description: "Keep evidence, timelines, and notes in one secure, accessible place."
  },
  {
    icon: Clock,
    title: "Preparation",
    description: "Be ready for conversations with attorneys, agencies, and oversight bodies."
  },
  {
    icon: Shield,
    title: "Orientation",
    description: "Understand how systems work before you engage with them."
  },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section with Image */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--primary)/0.1)_0%,_transparent_50%)]" />
        
        <div className="container relative py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Mobile: Image above text */}
            <div className="lg:hidden relative rounded-2xl overflow-hidden aspect-[16/10]">
              <img 
                src={heroImage} 
                alt="" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            </div>

            {/* Text Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 animate-fade-up">
                <Shield className="w-4 h-4" />
                <span>Education & Preparation — Not Legal Advice</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
                A supportive space to{" "}
                <span className="gradient-text">regain clarity</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
                Organize what matters and move forward with purpose. Decoded Justice helps everyday people understand their rights, 
                prepare their information, and find the resources they need.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8 animate-fade-up" style={{ animationDelay: "0.3s" }}>
                <Button variant="hero" size="xl" asChild>
                  <Link to="/analyzer">
                    Start the Analyzer
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/rights-insight">
                    Learn About Your Rights
                  </Link>
                </Button>
              </div>
              
              <Disclaimer className="justify-center lg:justify-start" />
            </div>

            {/* Desktop: Image on right */}
            <div className="hidden lg:block relative rounded-2xl overflow-hidden aspect-square">
              <img 
                src={heroImage} 
                alt="" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-background/20 to-background/60" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-card/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Tools Built for Your Journey
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every feature is designed to be calm, clear, and supportive — helping you take one step at a time.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Link
                key={feature.title}
                to={feature.href}
                className="group p-6 lg:p-8 rounded-2xl bg-card border-2 border-border hover:border-primary/50 hover:shadow-glow hover:-translate-y-1 transition-all duration-300 animate-fade-up cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl shrink-0 transition-all group-hover:scale-110 ${
                    feature.primary 
                      ? "bg-gradient-to-br from-primary to-primary/70 shadow-glow" 
                      : "bg-secondary group-hover:bg-primary/20"
                  }`}>
                    <feature.icon className={`w-6 h-6 transition-colors ${
                      feature.primary ? "text-primary-foreground" : "text-foreground group-hover:text-primary"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {feature.description}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-lg group-hover:bg-primary/20 transition-all">
                      {feature.cta}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Principles Section */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              What We Help You Achieve
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              When you're facing a difficult situation, having the right preparation can make all the difference.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((principle, index) => (
              <div
                key={principle.title}
                className="text-center p-6 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                  <principle.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {principle.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wellbeing Note */}
      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Take your time.</strong> This process can be difficult. 
              You can pause, skip sections, or return later. There's no rush — this platform will be here when you're ready.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center p-8 lg:p-12 rounded-3xl bg-gradient-to-br from-card to-card/50 border border-border">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to Begin?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Start with the Civil Rights Analyzer to understand your situation, 
              or explore our educational resources at your own pace.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="lg" asChild>
                <Link to="/analyzer">
                  Start the Analyzer
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="soft" size="lg" asChild>
                <Link to="/about">
                  Learn More About Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
