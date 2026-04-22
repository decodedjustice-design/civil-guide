import { Link, useLocation } from "react-router-dom";
import { AlertTriangle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const embedBaseUrl = (import.meta.env.VITE_DECODED_JUSTICE_URL as string | undefined)?.replace(/\/$/, "");

export default function DecodedJusticeEmbed() {
  const location = useLocation();

  if (!embedBaseUrl) {
    return (
      <main className="min-h-screen bg-background text-foreground px-6 py-20">
        <div className="mx-auto max-w-3xl rounded-xl border border-border bg-card p-8 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-primary">
            <AlertTriangle className="h-5 w-5" />
            <h1 className="font-serif text-2xl">Decoded Justice embed is not configured</h1>
          </div>
          <p className="text-muted-foreground">
            Set <code className="rounded bg-muted px-1 py-0.5">VITE_DECODED_JUSTICE_URL</code> in your environment to enable
            the full case-management experience.
          </p>
          <div className="mt-6">
            <Button asChild>
              <Link to="/dashboard">Back to dashboard</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const iframeUrl = `${embedBaseUrl}${location.pathname}${location.search}`;

  return (
    <main className="h-[calc(100vh-64px)] w-full bg-background pt-16">
      <div className="flex h-full w-full flex-col">
        <div className="flex items-center justify-between border-b border-border bg-card/80 px-4 py-2">
          <p className="text-xs text-muted-foreground">Embedded from {embedBaseUrl}</p>
          <a
            href={iframeUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            Open in new tab <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <iframe
          src={iframeUrl}
          className="h-full w-full border-0"
          title="Decoded Justice Case Management"
          allow="clipboard-write"
        />
      </div>
    </main>
  );
}
