import { Link } from "react-router-dom";
import { 
  Search, 
  FileText, 
  BookOpen, 
  FolderOpen,
  Clock,
  Users,
  Mic,
  FileSearch
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface PurposeCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}

function PurposeCard({ icon: Icon, title, description, href }: PurposeCardProps) {
  return (
    <Link
      to={href}
      className="group p-6 rounded-2xl bg-card border border-border/50 shadow-md hover:shadow-lg hover:border-primary/20 transition-all duration-300"
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-4 group-hover:from-primary/20 group-hover:to-primary/10 transition-colors">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground">
        {description}
      </p>
    </Link>
  );
}

interface PurposeGroupProps {
  title: string;
  children: React.ReactNode;
}

function PurposeGroup({ title, children }: PurposeGroupProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 rounded-full bg-primary" />
        <h2 className="text-sm font-semibold text-navy uppercase tracking-wider">
          {title}
        </h2>
      </div>
      <div className="grid gap-4">
        {children}
      </div>
    </div>
  );
}

export function PurposeGrid() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-navy mb-4">
            What's available
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Organized by purpose, not features. Find what you need, when you need it.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          <PurposeGroup title="Understanding">
            <PurposeCard
              icon={Search}
              title="Analyzer"
              description="System identification and clarity"
              href="/analyzer"
            />
            <PurposeCard
              icon={FileText}
              title="Decoder"
              description="Plain language translation"
              href="/legal-decoder"
            />
          </PurposeGroup>

          <PurposeGroup title="Learning">
            <PurposeCard
              icon={BookOpen}
              title="Rights Insight"
              description="System education and knowledge"
              href="/rights-insight"
            />
            <PurposeCard
              icon={FileSearch}
              title="Library"
              description="Reference guides and resources"
              href="/library"
            />
          </PurposeGroup>

          <PurposeGroup title="Organization">
            <PurposeCard
              icon={FolderOpen}
              title="Evidence Vault"
              description="Secure document storage"
              href="/evidence-vault"
            />
            <PurposeCard
              icon={Clock}
              title="Timeline"
              description="Event tracking and history"
              href="/timeline"
            />
          </PurposeGroup>

          <PurposeGroup title="Documentation">
            <PurposeCard
              icon={Mic}
              title="Transcription"
              description="Audio to text conversion"
              href="/transcription"
            />
            <PurposeCard
              icon={Users}
              title="Support"
              description="Help and resource connections"
              href="/support-network"
            />
          </PurposeGroup>
        </div>
      </div>
    </section>
  );
}
