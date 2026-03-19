import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ServiceReport {
    status: ReportStatus;
    clientName: string;
    assetId: string;
    jobType: JobType;
    date: string;
    faultDescription: string;
    partsUsed: Array<PartUsed>;
    engineerName: string;
    serialNumber: string;
    checklistItems: Array<ChecklistItem>;
    workPerformed: string;
    reportNumber: bigint;
    equipmentModel: string;
    location: string;
    remarks: string;
}
export interface ChecklistItem {
    checked: boolean;
    item: string;
}
export interface PartUsed {
    partNumber: string;
    partName: string;
    quantity: bigint;
}
export interface UserProfile {
    name: string;
}
export enum JobType {
    repair = "repair",
    inspection = "inspection",
    emergency = "emergency",
    maintenance = "maintenance",
    installation = "installation"
}
export enum ReportStatus {
    completed = "completed",
    draft = "draft",
    inProgress = "inProgress"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createReport(report: ServiceReport): Promise<bigint>;
    deleteReport(reportNumber: bigint): Promise<void>;
    getAllReports(): Promise<Array<ServiceReport>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getReportById(reportNumber: bigint): Promise<ServiceReport | null>;
    getReportsByEngineer(engineerName: string): Promise<Array<ServiceReport>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateReport(reportNumber: bigint, updatedReport: ServiceReport): Promise<void>;
}
