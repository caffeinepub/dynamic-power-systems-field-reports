import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import AppLayout from "./components/AppLayout";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import LoginPage from "./pages/LoginPage";

export type Page = "dashboard" | "create" | "reports" | "view";

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [viewReportNumber, setViewReportNumber] = useState<bigint | null>(null);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">
            Loading Dynamic Power Systems...
          </p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return (
      <>
        <LoginPage />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <AppLayout
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        viewReportNumber={viewReportNumber}
        setViewReportNumber={setViewReportNumber}
      />
      <Toaster richColors />
    </>
  );
}
