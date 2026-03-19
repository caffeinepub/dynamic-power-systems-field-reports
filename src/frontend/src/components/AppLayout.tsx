import { useState } from "react";
import type { Page } from "../App";
import { useGetReport } from "../hooks/useQueries";
import CreateReport from "../pages/CreateReport";
import Dashboard from "../pages/Dashboard";
import ReportsList from "../pages/ReportsList";
import PrintReport from "./PrintReport";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";

interface Props {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  viewReportNumber: bigint | null;
  setViewReportNumber: (n: bigint | null) => void;
}

export default function AppLayout({
  currentPage,
  setCurrentPage,
  viewReportNumber,
  setViewReportNumber,
}: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { data: viewReport } = useGetReport(viewReportNumber);

  const navigate = (page: Page) => {
    setCurrentPage(page);
    if (page !== "view") setViewReportNumber(null);
  };

  const handleViewReport = (rn: bigint) => {
    setViewReportNumber(rn);
    setCurrentPage("view");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        currentPage={currentPage}
        navigate={navigate}
        isOpen={sidebarOpen}
        setOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNav
          currentPage={currentPage}
          navigate={navigate}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <main className="flex-1 overflow-y-auto p-5 lg:p-6">
          {currentPage === "dashboard" && (
            <Dashboard navigate={navigate} onViewReport={handleViewReport} />
          )}
          {currentPage === "create" && (
            <CreateReport navigate={navigate} onViewReport={handleViewReport} />
          )}
          {currentPage === "reports" && (
            <ReportsList navigate={navigate} onViewReport={handleViewReport} />
          )}
          {currentPage === "view" && viewReport && (
            <PrintReport
              report={viewReport}
              onBack={() => navigate("reports")}
            />
          )}
        </main>
        <footer className="border-t border-border bg-card py-3 px-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Dynamic Power Systems, Mysore. Built with
          love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </footer>
      </div>
    </div>
  );
}
