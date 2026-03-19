import { Link } from "react-router-dom";
import { FileText, CheckCircle, AlertTriangle } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";

export default function Terms() {
  return (
    <Layout>
      <div className="container py-12 lg:py-20">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-6">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">
              Terms of Use
            </h1>
            <p className="text-muted-foreground">
              By using Decoded Justice, you agree to the following terms.
            </p>
          </div>

          <div className="space-y-8">
            {/* Educational Purpose */}
            <section className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Educational Purpose</h2>
              </div>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                <p>Decoded Justice is an educational platform. All content, tools, and resources provided are for informational and educational purposes only.</p>
                <p>Nothing on this platform constitutes legal advice, legal representation, or the creation of an attorney-client relationship.</p>
              </div>
            </section>

            {/* User Responsibility */}
            <section className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">User Responsibility</h2>
              </div>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                <p>You are responsible for:</p>
                <ul className="space-y-2 pl-4">
                  {[
                    "Seeking professional legal counsel for your specific situation",
                    "Verifying any information before relying on it for decision-making",
                    "Maintaining the security of your account credentials",
                    "Using the platform in accordance with applicable laws",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Content & Tools */}
            <section className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Content & Tools</h2>
              </div>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                <p>The tools provided — including the Analyzer, Case Builder, Evidence Vault, Timeline, and Intake Packet — are designed to help you organize and understand information. They do not generate legal documents or legal analysis.</p>
                <p>Content may be updated periodically. We make reasonable efforts to ensure accuracy but cannot guarantee that all information is current or complete.</p>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Limitation of Liability</h2>
              </div>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                <p>Decoded Justice is provided "as is" without warranties of any kind. We are not liable for any decisions made based on the information or tools provided on this platform.</p>
                <p>For legal concerns, always consult with a qualified attorney in your jurisdiction.</p>
              </div>
            </section>

            {/* Changes to Terms */}
            <section className="p-6 rounded-2xl bg-secondary/30 border border-border/50">
              <p className="text-muted-foreground leading-relaxed text-center">
                These terms may be updated from time to time. Continued use of the platform constitutes acceptance of any changes.
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
