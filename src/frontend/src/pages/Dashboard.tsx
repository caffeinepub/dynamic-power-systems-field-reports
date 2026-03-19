import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  FilePlus,
  FileText,
  Wrench,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import type { Page } from "../App";
import { useAllReports } from "../hooks/useQueries";

const STATUS_LABELS: Record<string, string> = {
  completed: "Completed",
  inProgress: "In Progress",
  draft: "Draft",
};

const STATUS_COLORS: Record<string, string> = {
  completed: "bg-success/15 text-success border-success/30",
  inProgress: "bg-primary/15 text-primary border-primary/30",
  draft: "bg-muted text-muted-foreground border-border",
};

interface Props {
  navigate: (page: Page) => void;
  onViewReport: (rn: bigint) => void;
}

const RECENT_ACTIVITIES: {
  text: string;
  time: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}[] = [
  {
    text: "Report #1042 submitted",
    time: "2 hours ago",
    icon: CheckCircle2,
    color: "text-success",
  },
  {
    text: "Preventive maintenance on TF-200",
    time: "Yesterday",
    icon: Wrench,
    color: "text-primary",
  },
  {
    text: "Emergency call at Infosys Campus",
    time: "2 days ago",
    icon: Zap,
    color: "text-destructive",
  },
  {
    text: "Parts ordered for Generator G-9",
    time: "3 days ago",
    icon: Clock,
    color: "text-muted-foreground",
  },
];

const CURRENT_JOB = {
  title: "Annual Maintenance \u2013 ABB UPS 80kVA",
  client: "Wipro Technologies, Mysore",
  location: "Block C, Electrical Room",
  scheduled: "Today, 11:00 AM",
  priority: "High",
};

export default function Dashboard({ navigate, onViewReport }: Props) {
  const { data: reports, isLoading } = useAllReports();

  const total = reports?.length ?? 0;
  const completed =
    reports?.filter((r) => r.status === "completed").length ?? 0;
  const inProgress =
    reports?.filter((r) => r.status === "inProgress").length ?? 0;
  const drafts = reports?.filter((r) => r.status === "draft").length ?? 0;

  const stats = [
    {
      label: "Total Reports",
      value: total,
      icon: FileText,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle2,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "In Progress",
      value: inProgress,
      icon: Clock,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Drafts",
      value: drafts,
      icon: AlertCircle,
      color: "text-muted-foreground",
      bg: "bg-muted",
    },
  ];

  const recentReports =
    reports
      ?.slice()
      .sort((a, b) => Number(b.reportNumber) - Number(a.reportNumber))
      .slice(0, 5) ?? [];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Overview of field service activities
          </p>
        </div>
        <Button
          data-ocid="dashboard.create.primary_button"
          onClick={() => navigate("create")}
          className="bg-primary text-primary-foreground hover:bg-secondary gap-2"
        >
          <FilePlus className="w-4 h-4" />
          New Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(({ label, value, icon: Icon, color, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.35 }}
          >
            <Card className="shadow-card border-border">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                      {label}
                    </p>
                    {isLoading ? (
                      <Skeleton className="h-8 w-12" />
                    ) : (
                      <p className="text-3xl font-bold text-foreground">
                        {value}
                      </p>
                    )}
                  </div>
                  <div
                    className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Reports */}
        <div className="lg:col-span-2">
          <Card className="shadow-card border-border">
            <CardHeader className="pb-3 px-5 pt-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Recent Reports
                </CardTitle>
                <Button
                  data-ocid="dashboard.reports.link"
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("reports")}
                  className="text-primary h-7 px-2 text-xs gap-1"
                >
                  View All <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              {isLoading ? (
                <div className="space-y-3 px-5 pb-5">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12" />
                  ))}
                </div>
              ) : recentReports.length === 0 ? (
                <div
                  data-ocid="dashboard.reports.empty_state"
                  className="text-center py-10 text-muted-foreground"
                >
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">
                    No reports yet. Create your first report.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {recentReports.map((r, i) => (
                    <button
                      type="button"
                      key={r.reportNumber.toString()}
                      data-ocid={`dashboard.report.item.${i + 1}`}
                      className="w-full flex items-center justify-between px-5 py-3 hover:bg-muted/50 transition-colors text-left"
                      onClick={() => onViewReport(r.reportNumber)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Report #{r.reportNumber.toString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {r.clientName} &bull; {r.date}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={`text-xs border ${STATUS_COLORS[r.status] ?? "bg-muted text-muted-foreground"}`}
                      >
                        {STATUS_LABELS[r.status] ?? r.status}
                      </Badge>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Current Job */}
          <Card className="shadow-card border-border border-l-4 border-l-primary">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
                Current Job Assignment
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="font-semibold text-sm text-foreground leading-snug mb-2">
                {CURRENT_JOB.title}
              </p>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  &#127962; {CURRENT_JOB.client}
                </p>
                <p className="text-xs text-muted-foreground">
                  &#128205; {CURRENT_JOB.location}
                </p>
                <p className="text-xs text-muted-foreground">
                  &#128336; {CURRENT_JOB.scheduled}
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Badge className="bg-destructive/10 text-destructive border-destructive/30 text-xs border">
                  {CURRENT_JOB.priority} Priority
                </Badge>
                <Button
                  data-ocid="dashboard.job.primary_button"
                  size="sm"
                  onClick={() => navigate("create")}
                  className="h-7 px-3 text-xs bg-primary text-primary-foreground hover:bg-secondary"
                >
                  Start Report
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="shadow-card border-border">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="space-y-3">
                {RECENT_ACTIVITIES.map(
                  ({ text, time, icon: Icon, color }, i) => (
                    <div
                      key={text}
                      data-ocid={`dashboard.activity.item.${i + 1}`}
                      className="flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className={`w-3.5 h-3.5 ${color}`} />
                      </div>
                      <div>
                        <p className="text-xs text-foreground leading-snug">
                          {text}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {time}
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
