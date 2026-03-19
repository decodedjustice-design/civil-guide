import { Link } from "react-router-dom";
import { Shield, Lock, Eye, Server } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";

export default function Privacy() {
  return (
    <Layout>
      <div className="container py-12 lg:py-20">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">
              Privacy & Security
            </h1>
            <p className="text-muted-foreground">
              How we handle your information — with care and transparency.
            </p>
          </div>

          <div className="space-y-8">
            {/* Your Data Belongs to You */}
            <section className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Your Data Belongs to You</h2>
              </div>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                <p>Any information you enter into Decoded Justice — notes, timelines, evidence descriptions, intake packets — is stored securely and is only accessible by you.</p>
                <p>We do not sell, share, or distribute your personal data to third parties. Your records are yours.</p>
              </div>
            </section>

            {/* What We Collect */}
            <section className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">What We Collect</h2>
              </div>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                <p>When you create an account, we collect:</p>
                <ul className="space-y-2 pl-4">
                  {[
                    "Email address (for authentication)",
                    "Display name (optional, for personalization)",
                    "Data you voluntarily enter into tools (notes, timelines, evidence, intake forms)",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>We do not use tracking cookies for advertising. We do not build user profiles for marketing purposes.</p>
              </div>
            </section>

            {/* How We Protect It */}
            <section className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <Server className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">How We Protect It</h2>
              </div>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                <p>Your data is stored using industry-standard encryption and secure cloud infrastructure. Access is controlled through authenticated sessions — only you can view your information.</p>
                <p>We use row-level security policies to ensure that each user's data is isolated and protected at the database level.</p>
              </div>
            </section>

            {/* Your Rights */}
            <section className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Your Rights</h2>
              </div>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                <p>You have the right to:</p>
                <ul className="space-y-2 pl-4">
                  {[
                    "Access all data associated with your account",
                    "Delete your account and all associated data at any time",
                    "Export your information",
                    "Contact us with questions about how your data is handled",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Contact */}
            <section className="p-6 rounded-2xl bg-secondary/30 border border-border/50 text-center">
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about privacy or data handling, please reach out through the platform's contact options or visit our <Link to="/about" className="text-primary hover:underline">About page</Link>.
              </p>
            </section>
          </div>

          <div className="text-center mt-10">
            <Button variant="outline" size="lg" asChild>
              <Link to="/about">Back to About</Link>
            </Button>
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <Disclaimer className="justify-center" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
