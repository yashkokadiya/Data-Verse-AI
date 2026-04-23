import {
  Upload, Table, Sparkles, BarChart3, Lightbulb, Download,
  PieChart, Settings, Brush, TrendingUp, LayoutDashboard, Lock, Wrench,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Item = {
  title: string;
  url: string;
  icon: any;
  /** if true, the item is locked until data is loaded */
  requiresData?: boolean;
};

const overviewItems: Item[] = [
  { title: "Workspace", url: "/dashboard", icon: Wrench },
  { title: "Overview", url: "/dashboard/overview", icon: LayoutDashboard },
];

const stepItems: Item[] = [
  { title: "1. Import", url: "/dashboard/import", icon: Upload },
  { title: "2. Preview", url: "/dashboard/preview", icon: Table, requiresData: true },
  { title: "3. Clean", url: "/dashboard/clean", icon: Brush, requiresData: true },
  { title: "4. Visualize", url: "/dashboard/charts", icon: BarChart3, requiresData: true },
  { title: "5. Insights", url: "/dashboard/insights", icon: Lightbulb, requiresData: true },
  { title: "6. Export", url: "/dashboard/export", icon: Download, requiresData: true },
];

const extrasItems: Item[] = [
  { title: "Custom Chart", url: "/dashboard/custom-chart", icon: PieChart, requiresData: true },
  { title: "Forecasting", url: "/dashboard/forecasting", icon: TrendingUp, requiresData: true },
];

const bottomItems: Item[] = [
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

const AppSidebar = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";
  const { rawData } = useData();
  const hasData = rawData.length > 0;

  const renderItem = (item: Item) => {
    const locked = item.requiresData && !hasData;
    const isActive =
      location.pathname === item.url ||
      (item.url !== "/dashboard" && location.pathname.startsWith(item.url));

    const inner = (
      <div
        className={cn(
          "flex items-center w-full rounded-xl transition-all duration-300 px-3 py-2",
          locked
            ? "text-muted-foreground/50 cursor-not-allowed"
            : "text-muted-foreground hover:bg-primary/10",
          !locked && isActive && "gradient-primary text-primary-foreground font-semibold shadow-md glow-primary",
        )}
      >
        <item.icon className="mr-3 h-4 w-4 shrink-0" />
        {!collapsed && (
          <span className="text-sm flex-1 truncate">{item.title}</span>
        )}
        {!collapsed && locked && <Lock className="w-3 h-3 ml-2 opacity-60" />}
      </div>
    );

    const button = (
      <SidebarMenuButton asChild>
        {locked ? (
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="w-full text-left"
          >
            {inner}
          </button>
        ) : (
          <NavLink to={item.url} end className="w-full">
            {inner}
          </NavLink>
        )}
      </SidebarMenuButton>
    );

    if (locked) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div>{button}</div>
          </TooltipTrigger>
          <TooltipContent side="right">
            Import data first to unlock this step
          </TooltipContent>
        </Tooltip>
      );
    }
    return button;
  };

  const renderGroup = (label: string, items: Item[]) => (
    <SidebarGroup>
      {!collapsed && (
        <SidebarGroupLabel className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/70 px-3 mt-2">
          {label}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>{renderItem(item)}</SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r-0 bg-sidebar">
      <SidebarContent className="pt-4 flex flex-col h-full">
        {!collapsed && (
          <div className="px-4 pb-4 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground tracking-tight">DataVerse AI</h2>
                <p className="text-[10px] text-muted-foreground">Data Intelligence</p>
              </div>
            </div>
          </div>
        )}

        {renderGroup("Workspace", overviewItems)}
        {renderGroup("Workflow", stepItems)}
        {renderGroup("Advanced", extrasItems)}

        <div className="mt-auto">
          {renderGroup("Account", bottomItems)}
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
