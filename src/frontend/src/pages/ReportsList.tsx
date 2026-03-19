import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, FilePlus, FileText, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import { useAllReports, useDeleteReport } from "../hooks/useQueries";

const STATUS_COLORS: Record<string, string> = {
  completed: "bg-success/15 text-success border-success/30",
  inProgress: "bg-primary/15 text-primary border-primary/30",
  draft: "bg-muted text-muted-foreground border-border",
};

const STATUS_LABELS: Record<string, string> = {
  completed: "Completed",
  inProgress: "In Progress",
  draft: "Draft",
};

const JOB_TYPE_LABELS: Record<string, string> = {
  maintenance: "Maintenance",
  repair: "Repair",
  inspection: "Inspection",
  installation: "Installation",
  emergency: "Emergency",
};

interface Props {
  navigate: (page: Page) => void;
  onViewReport: (rn: bigint) => void;
}

export default function ReportsList({ navigate, onViewReport }: Props) {
  const { data: reports, isLoading } = useAllReports();
  const deleteReport = useDeleteReport();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<bigint | null>(null);

  const filtered = (reports ?? [])
    .filter((r) => {
      const matchSearch =
        !search ||
        r.clientName.toLowerCase().includes(search.toLowerCase()) ||
        r.reportNumber.toString().includes(search) ||
        r.engineerName.toLowerCase().includes(search.toLowerCase()) ||
        r.location.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => Number(b.reportNumber) - Number(a.reportNumber));

  const handleDelete = async () => {
    if (deleteTarget === null) return;
    try {
      await deleteReport.mutateAsync(deleteTarget);
      toast.success("Report deleted.");
    } catch {
      toast.error("Failed to delete report.");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Service Reports</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {reports?.length ?? 0} total reports
          </p>
        </div>
        <Button
          data-ocid="reports.create.primary_button"
          onClick={() => navigate("create")}
          className="bg-primary text-primary-foreground hover:bg-secondary gap-2"
        >
          <FilePlus className="w-4 h-4" />
          New Report
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-card border-border mb-5">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                data-ocid="reports.search.input"
                className="pl-9 h-9 text-sm"
                placeholder="Search by client, report number, engineer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger
                data-ocid="reports.status.select"
                className="w-full sm:w-44 h-9 text-sm"
              >
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="inProgress">In Progress</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-card border-border">
        <CardHeader className="pb-3 pt-4 px-5">
          <CardTitle className="text-xs font-bold uppercase tracking-wider">
            Reports ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          {isLoading ? (
            <div className="space-y-3 px-5 pb-5">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-14" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              data-ocid="reports.empty_state"
              className="text-center py-12 text-muted-foreground"
            >
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">No reports found</p>
              <p className="text-xs mt-1">
                Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            <Table data-ocid="reports.table">
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground pl-5">
                    Report #
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    Date
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    Client
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground hidden md:table-cell">
                    Job Type
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground hidden lg:table-cell">
                    Engineer
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground text-right pr-5">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r, i) => (
                  <TableRow
                    key={r.reportNumber.toString()}
                    data-ocid={`reports.row.item.${i + 1}`}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="pl-5 font-semibold text-sm text-foreground">
                      #{r.reportNumber.toString()}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {r.date}
                    </TableCell>
                    <TableCell className="text-sm text-foreground font-medium max-w-[140px]">
                      <div className="truncate">{r.clientName}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {r.location}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-xs capitalize text-muted-foreground">
                        {JOB_TYPE_LABELS[r.jobType] ?? r.jobType}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {r.engineerName}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-xs border ${STATUS_COLORS[r.status] ?? ""}`}
                      >
                        {STATUS_LABELS[r.status] ?? r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-5">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          data-ocid={`reports.view.button.${i + 1}`}
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 text-muted-foreground hover:text-primary"
                          onClick={() => onViewReport(r.reportNumber)}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          data-ocid={`reports.delete_button.${i + 1}`}
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 text-muted-foreground hover:text-destructive"
                          onClick={() => setDeleteTarget(r.reportNumber)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete confirm */}
      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent data-ocid="reports.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Report</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete Report #{deleteTarget?.toString()}
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="reports.delete.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="reports.delete.confirm_button"
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
