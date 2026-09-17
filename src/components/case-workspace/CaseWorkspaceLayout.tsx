import { ReactNode } from "react";
import { NavLink, useNavigate, useParams, Link } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarClock,
  FolderArchive,
  ListTree,
  Users,
  MessageSquare,
  FileSearch,
  Search,
  ScanSearch,
  PackageOpen,
  Scale,
  BookOpen,
  LifeBuoy,
  Compass,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { EducationalNotice } from "@/components/shared/EducationalNotice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCases } from "@/hooks/useCases";
import { cn } from "@/lib/utils";

const caseTabs = [
  { slug: "", label: "Overview", icon: LayoutDashboard },
  { slug: "timeline", label: "Timeline", icon: CalendarClock },
  { slug: "evidence", label: "Evidence & Exhibits", icon: FolderArchive },
  { slug: "issues", label: "Claims & Issues", icon: ListTree },
  { slug: "people", label: "People & Organizations", icon: Users },
  { slug: "communications", label: "Communications", icon: MessageSquare },
  { slug: "requests", label: "Requests & Deadlines", icon: FileSearch },
  { slug: "search", label: "Record Search", icon: Search },
  { slug: "content-check", label: "Content Check", icon: ScanSearch },
  { slug: "packets", label: "Packets & Exports", icon: PackageOpen },
];

const learnLinks = [
  { to: "/analyzer", label: "Analyzer", icon: Compass },
  { to: "/legal-decoder", label: "Legal Decoder", icon: Scale },
  { to: "/education-library", label: "Education Library", icon: BookOpen },
  { to: "/find-help", label: "Find Help", icon: LifeBuoy },
  { to: "/support-network", label: "Support Network", icon: Users },
];

interface Props {
  title: string;
  description?: string;
  children: ReactNode;
}

export function CaseWorkspaceLayout({ title, description, children }: Props) {
  const { id: caseId } = useParams();
  const navigate = useNavigate();
  const { cases, isLoading } = useCases();
  const activeCase = cases.find((c) => c.id === caseId);

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0 space-y-6">
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70 font-medium">
                Active case
              </p>
              {isLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  value={caseId ?? ""}
                  onValueChange={(value) =>
                    value === "__all" ? navigate("/cases") : navigate(`/cases/${value}`)
                  }
                >
                  <SelectTrigger aria-label="Switch case">
                    <SelectValue placeholder="Choose a case" />
                  </SelectTrigger>
                  <SelectContent>
                    {cases.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="__all">All cases…</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            <nav className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70 font-medium px-3 pb-1">
                Case workspace
              </p>
              {caseTabs.map((tab) => (
                <NavLink
                  key={tab.slug || "overview"}
                  to={`/cases/${caseId}${tab.slug ? `/${tab.slug}` : ""}`}
                  end={tab.slug === ""}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors",
                      isActive
                        ? "bg-accent-soft text-primary font-medium"
                        : "text-foreground/70 hover:text-foreground hover:bg-secondary/60"
                    )
                  }
                >
                  <tab.icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                  <span className="truncate">{tab.label}</span>
                </NavLink>
              ))}
            </nav>

            <nav className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70 font-medium px-3 pb-1">
                Understand &amp; learn
              </p>
              {learnLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-foreground/70 hover:text-foreground hover:bg-secondary/60 transition-colors"
                >
                  <link.icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                  <span className="truncate">{link.label}</span>
                </Link>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="min-w-0 flex-1 space-y-6">
            <EducationalNotice />

            <div>
              {activeCase && (
                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                  {activeCase.name}
                </p>
              )}
              <h1 className="font-serif text-2xl sm:text-3xl font-medium text-foreground">
                {title}
              </h1>
              {description && (
                <p className="text-sm text-muted-foreground mt-1.5">{description}</p>
              )}
            </div>

            {!isLoading && !activeCase ? (
              <Card>
                <CardContent className="p-8 text-center text-sm text-muted-foreground">
                  This case could not be found.{" "}
                  <Link to="/cases" className="text-primary underline">
                    Back to your cases
                  </Link>
                  .
                </CardContent>
              </Card>
            ) : (
              children
            )}

            <Disclaimer variant="prominent" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
