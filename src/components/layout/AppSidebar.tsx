import {
  Feather,
  Search,
  Archive,
  Briefcase,
  Users,
  LayoutDashboard,
  FileText,
  Clock,
  Upload,
  Mic,
  Scale,
  BookOpen,
  Shield,
  Gavel,
  Phone,
  Heart,
  Bookmark,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import decodedJusticeLogo from "@/assets/decoded-justice-scales-logo.png";

const sidebarGroups = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Tell Your Story",
    items: [
      { title: "Clarion", url: "/clarion", icon: Feather },
      { title: "Timeline", url: "/timeline", icon: Clock },
      { title: "Notes", url: "/notes", icon: FileText },
      { title: "Transcription", url: "/transcription", icon: Mic },
    ],
  },
  {
    label: "Understand Your Case",
    items: [
      { title: "Analyzer", url: "/analyzer", icon: Search },
      { title: "Legal Decoder", url: "/legal-decoder", icon: BookOpen },
      { title: "Rights Insight", url: "/rights-insight", icon: Shield },
      { title: "Library", url: "/library", icon: BookOpen },
    ],
  },
  {
    label: "Organize Your Proof",
    items: [
      { title: "Evidence Vault", url: "/evidence-vault", icon: Archive },
      { title: "Public Records", url: "/public-request-rights", icon: Upload },
    ],
  },
  {
    label: "Prepare for Action",
    items: [
      { title: "Legal Templates", url: "/legal-templates", icon: Briefcase },
      { title: "Intake Packet", url: "/intake-packet", icon: FileText },
      { title: "Courts & Filing", url: "/courts-filing-info", icon: Gavel },
    ],
  },
  {
    label: "Connect & Advocate",
    items: [
      { title: "Find Legal Help", url: "/find-help", icon: Scale },
      { title: "Attorney Contacts", url: "/attorney-contacts", icon: Phone },
      { title: "Saved Attorneys", url: "/saved-attorneys", icon: Bookmark },
      { title: "Support Network", url: "/support-network", icon: Heart },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <SidebarContent className="bg-card pt-4">
        {/* Logo in sidebar */}
        {!collapsed && (
          <div className="px-4 pb-4 mb-2 border-b border-border/30">
            <div className="flex items-center gap-2.5">
              <img src={decodedJusticeLogo} alt="Decoded Justice" className="h-7 w-auto" />
              <span className="text-sm font-medium text-foreground tracking-wide">
                Decoded Justice
              </span>
            </div>
          </div>
        )}

        {sidebarGroups.map((group) => {
          const isGroupActive = group.items.some(
            (item) => location.pathname === item.url
          );

          return (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 font-medium px-3">
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          end
                          className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-foreground/70 hover:text-foreground hover:bg-secondary/60 transition-colors"
                          activeClassName="bg-accent-soft text-primary font-medium"
                        >
                          <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                          {!collapsed && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}
