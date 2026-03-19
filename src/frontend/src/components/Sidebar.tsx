import { cn } from "@/lib/utils";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FilePlus,
  FileText,
  LayoutDashboard,
  Package,
  Users,
  X,
  Zap,
} from "lucide-react";
import type { Page } from "../App";

interface NavItem {
  id: Page | "schedule" | "clients" | "equipment";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isPrimary?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "create", label: "Create New Report", icon: FilePlus, isPrimary: true },
  { id: "reports", label: "Completed Reports", icon: FileText },
  { id: "schedule", label: "Job Schedule", icon: CalendarDays },
  { id: "clients", label: "Client Database", icon: Users },
  { id: "equipment", label: "Equipment Inventory", icon: Package },
];

interface Props {
  currentPage: Page;
  navigate: (page: Page) => void;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export default function Sidebar({
  currentPage,
  navigate,
  isOpen,
  setOpen,
}: Props) {
  const handleNav = (id: NavItem["id"]) => {
    if (id === "dashboard" || id === "create" || id === "reports") {
      navigate(id);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: overlay backdrop
        <div
          role="button"
          tabIndex={-1}
          aria-label="Close sidebar"
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "flex flex-col bg-sidebar-bg border-r border-sidebar-border z-30 transition-all duration-300 flex-shrink-0",
          "fixed lg:relative inset-y-0 left-0 h-full",
          isOpen ? "w-60" : "w-0 lg:w-16 overflow-hidden",
        )}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-sidebar-border min-h-[64px]">
          <div
            className={cn(
              "flex items-center gap-2.5 overflow-hidden",
              !isOpen && "lg:justify-center lg:w-full",
            )}
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-white" />
            </div>
            {isOpen && (
              <div className="overflow-hidden">
                <p className="font-bold text-xs text-foreground leading-tight tracking-wide uppercase">
                  Dynamic Power
                </p>
                <p className="font-bold text-xs text-foreground leading-tight tracking-wide uppercase">
                  Systems
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Mysore
                </p>
              </div>
            )}
          </div>
          {isOpen && (
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="lg:hidden p-1 rounded text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, icon: Icon, isPrimary }) => {
            const isActive = currentPage === id;
            return (
              <button
                type="button"
                key={id}
                data-ocid={`sidebar.${id}.link`}
                onClick={() => handleNav(id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isPrimary
                    ? "bg-primary text-primary-foreground hover:bg-secondary"
                    : isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  !isOpen && "lg:justify-center lg:px-0",
                )}
                title={!isOpen ? label : undefined}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {isOpen && <span className="truncate">{label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Collapse toggle (desktop) */}
        <button
          type="button"
          className="hidden lg:flex items-center justify-center py-3 border-t border-sidebar-border text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setOpen(!isOpen)}
          title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </aside>
    </>
  );
}
