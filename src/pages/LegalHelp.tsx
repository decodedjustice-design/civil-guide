import { Layout } from "@/components/layout/Layout";

export default function LegalHelp() {
  return (
    <Layout>
      <section className="container max-w-3xl py-16">
        <h1 className="text-3xl font-semibold text-foreground mb-4">Find Legal Help</h1>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Decoded Justice is not a law firm and does not provide legal advice. This platform is designed to help you understand general information and organize your experience.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-10">
          If you need legal advice for your specific situation, you may want to consider speaking with a licensed attorney.
        </p>

        <div className="space-y-4">
          <a href="#" className="block rounded-lg border bg-card p-4 hover:border-primary/40 transition-colors">
            <h2 className="font-medium text-foreground">State bar directory</h2>
            <p className="text-sm text-muted-foreground mt-1">Placeholder link for licensed attorney directories by state.</p>
          </a>

          <a href="#" className="block rounded-lg border bg-card p-4 hover:border-primary/40 transition-colors">
            <h2 className="font-medium text-foreground">Legal aid organizations</h2>
            <p className="text-sm text-muted-foreground mt-1">Placeholder link for nonprofit and low-cost legal support organizations.</p>
          </a>
        </div>
      </section>
    </Layout>
  );
}
