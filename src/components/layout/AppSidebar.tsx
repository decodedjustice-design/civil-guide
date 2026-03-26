import {
  Search,
  LayoutDashboard,
  Clock,
  Upload,
  Scale,
  BookOpen,
  Feather,
  FileText,
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
      { title: "Case Builder", url: "/case-builder", icon: Scale },
    ],
  },
  {
    label: "Build Your Case Packet",
    items: [
      { title: "Write Your Story", url: "/clarion", icon: Feather },
      { title: "Build Timeline", url: "/timeline", icon: Clock },
      { title: "Upload Evidence", url: "/evidence-vault", icon: Upload },
      { title: "Review Key Issues", url: "/analyzer", icon: Search },
      { title: "Generate Case Packet", url: "/intake-packet", icon: FileText },
    ],
  },{
    label: "Learn & Support",
    items: [
      { title: "Understand Documents", url: "/legal-decoder", icon: BookOpen },
      { title: "Learn Your Rights", url: "/education-library", icon: BookOpen },
      { title: "Find Help", url: "/find-help", icon: Scale },
    ]
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
