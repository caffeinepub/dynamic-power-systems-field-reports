import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Bell, LogOut, Menu } from "lucide-react";
import type { Page } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const TABS: { id: Page; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "create", label: "Service Reports" },
  { id: "reports", label: "All Reports" },
];

interface Props {
  currentPage: Page;
  navigate: (page: Page) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function TopNav({
  currentPage,
  navigate,
  sidebarOpen,
  setSidebarOpen,
}: Props) {
  const { identity, clear } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString() ?? "";
  const shortPrincipal = principal ? `${principal.slice(0, 5)}...` : "R Kumar";

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="bg-card border-b border-border flex flex-col flex-shrink-0">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          <button
            type="button"
            data-ocid="topnav.toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden sm:block">
            <span className="text-xs font-semibold text-foreground">
              Engineer Dashboard
            </span>
            <span className="text-xs text-muted-foreground mx-1.5">/</span>
            <span className="text-xs text-muted-foreground">
              Service Report Portal
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:block text-xs text-muted-foreground">
            {dateStr} &bull; {timeStr}
          </span>
          <button
            type="button"
            data-ocid="topnav.notifications.button"
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Bell className="w-4 h-4" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                data-ocid="topnav.user.button"
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors"
              >
                <Avatar className="w-7 h-7">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                    {shortPrincipal.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:block text-xs font-medium text-foreground max-w-[80px] truncate">
                  {shortPrincipal}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                data-ocid="topnav.logout.button"
                onClick={clear}
                className="text-destructive cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-0 px-4 border-t border-border">
        {TABS.map(({ id, label }) => (
          <button
            type="button"
            key={id}
            data-ocid={`topnav.${id}.tab`}
            onClick={() => navigate(id)}
            className={cn(
              "px-4 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px",
              currentPage === id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </header>
  );
}
