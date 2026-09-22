import {
  Search,
  LayoutDashboard,
  Clock,
  Upload,
  Scale,
  BookOpen,
  Feather,
  FileText,
  Shield,
  Car,
  Home,
  Heart,
  Megaphone,
  GraduationCap,
  Building2,
  Lock,
  Stethoscope,
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

const educationLinks = [
  { title: "Police Encounters", url: "/guide/police-full-guide", icon: Shield },
  { title: "Traffic Stops", url: "/guide/traffic-stops-full-guide", icon: Car },
  { title: "Courts & Judicial Process", url: "/guide/courts-full-guide", icon: Scale },
  { title: "Child Welfare / DCYF / CPS", url: "/guide/cps-dcyf-full-guide", icon: Building2 },
  { title: "Housing Rights", url: "/guide/housing-full-guide", icon: Home },
  { title: "Disability Rights", url: "/guide/disability-full-guide", icon: Heart },
  { title: "Protest Rights", url: "/guide/protest-full-guide", icon: Megaphone },
  { title: "Schools & Student Rights", url: "/guide/education-full-guide", icon: GraduationCap },
  { title: "Government Agencies & Benefits", url: "/guide/government-full-guide", icon: Building2 },
  { title: "Jail & Detention", url: "/guide/incarceration-full-guide", icon: Lock },
  { title: "Medical Care", url: "/guide/healthcare-full-guide", icon: Stethoscope },
];

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
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const educationActive = educationLinks.some((item) => location.pathname === item.url);

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <SidebarContent className="bg-card pt-4">
        {!collapsed && (
          <div className="px-4 pb-4 mb-2 border-b border-border/30">
            <div className="flex items-center gap-2.5">
              <img src={decodedJusticeLogo} alt="Decoded Justice" className="h-7 w-auto" />
              <span className="text-sm font-medium text-foreground tracking-wide">Decoded Justice</span>
            </div>
          </div>
        )}

        {sidebarGroups.map((group) => {
          const isGroupActive = group.items.some((item) => location.pathname === item.url);
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

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 font-medium px-3">
            Learn & Support
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/legal-decoder"
                    className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-foreground/70 hover:text-foreground hover:bg-secondary/60 transition-colors"
                    activeClassName="bg-accent-soft text-primary font-medium"
                  >
                    <BookOpen className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                    {!collapsed && <span>Understand Documents</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/education-library"
                    className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-foreground/70 hover:text-foreground hover:bg-secondary/60 transition-colors"
                    activeClassName="bg-accent-soft text-primary font-medium"
                  >
                    <BookOpen className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                    {!collapsed && <span>Learn Your Rights</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {!collapsed && (
                <div className="ml-3 pl-3 border-l border-border/60 py-1 space-y-0.5">
                  {educationLinks.map((item) => (
                    <NavLink
                      key={item.url}
                      to={item.url}
                      end
                      className="flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-md text-foreground/60 hover:text-foreground hover:bg-secondary/60 transition-colors"
                      activeClassName="bg-accent-soft text-primary font-medium"
                    >
                      <item.icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                      <span>{item.title}</span>
                    </NavLink>
                  ))}
                </div>
              )}

              <SidebarMenuItem className="mt-1">
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/law-modules"
                    className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-foreground/70 hover:text-foreground hover:bg-secondary/60 transition-colors"
                    activeClassName="bg-accent-soft text-primary font-medium"
                  >
                    <Scale className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                    {!collapsed && <span>Law Modules</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/find-help"
                    className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-foreground/70 hover:text-foreground hover:bg-secondary/60 transition-colors"
                    activeClassName="bg-accent-soft text-primary font-medium"
                  >
                    <Scale className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                    {!collapsed && <span>Find Help</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}