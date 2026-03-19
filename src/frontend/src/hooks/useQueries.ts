import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ServiceReport } from "../backend.d";
import { useActor } from "./useActor";

export function useAllReports() {
  const { actor, isFetching } = useActor();
  return useQuery<ServiceReport[]>({
    queryKey: ["reports"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllReports();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetReport(reportNumber: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<ServiceReport | null>({
    queryKey: ["report", reportNumber?.toString()],
    queryFn: async () => {
      if (!actor || reportNumber === null) return null;
      return actor.getReportById(reportNumber);
    },
    enabled: !!actor && !isFetching && reportNumber !== null,
  });
}

export function useCreateReport() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (report: ServiceReport) => {
      if (!actor) throw new Error("Not connected");
      return actor.createReport(report);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}

export function useUpdateReport() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      reportNumber,
      report,
    }: {
      reportNumber: bigint;
      report: ServiceReport;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateReport(reportNumber, report);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}

export function useDeleteReport() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (reportNumber: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteReport(reportNumber);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}
