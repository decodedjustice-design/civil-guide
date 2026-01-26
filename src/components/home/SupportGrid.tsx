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

interface SupportItemProps {
  icon: LucideIcon;
  label: string;
  description: string;
  href: string;
}

function SupportItem({ icon: Icon, label, description, href }: SupportItemProps) {
  return (
    <Link
      to={href}
      className="group flex items-start gap-3 p-4 rounded-xl hover:bg-muted/50 transition-colors"
    >
      <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
        <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
          {label}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {description}
        </p>
      </div>
    </Link>
  );
}

interface SupportGroupProps {
  title: string;
  children: React.ReactNode;
}

function SupportGroup({ title, children }: SupportGroupProps) {
  return (
    <div>
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-4">
        {title}
      </h3>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}

export function SupportGrid() {
  return (
    <section className="py-12 lg:py-16 bg-muted/20">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-xl font-medium text-foreground mb-2">
              What's available here
            </h2>
            <p className="text-sm text-muted-foreground">
              Quiet support for understanding, organizing, and preparing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <SupportGroup title="Understanding">
              <SupportItem
                icon={Search}
                label="Civil Rights Analyzer"
                description="Understand which systems are involved"
                href="/analyzer"
              />
              <SupportItem
                icon={FileText}
                label="Justice Decoder"
                description="Plain-language explanations"
                href="/legal-decoder"
              />
            </SupportGroup>

            <SupportGroup title="Learning">
              <SupportItem
                icon={BookOpen}
                label="Rights Insight"
                description="Learn how systems work"
                href="/rights-insight"
              />
              <SupportItem
                icon={FileSearch}
                label="Library"
                description="Guides and reference materials"
                href="/library"
              />
            </SupportGroup>

            <SupportGroup title="Organization">
              <SupportItem
                icon={FolderOpen}
                label="Evidence Vault"
                description="Store and organize documents"
                href="/evidence-vault"
              />
              <SupportItem
                icon={Clock}
                label="Timeline"
                description="Track events and dates"
                href="/timeline"
              />
            </SupportGroup>

            <SupportGroup title="Documentation">
              <SupportItem
                icon={Mic}
                label="Transcription"
                description="Convert audio to text"
                href="/transcription"
              />
              <SupportItem
                icon={Users}
                label="Support Network"
                description="Find help and resources"
                href="/support-network"
              />
            </SupportGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
