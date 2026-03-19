import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Printer } from "lucide-react";
import type { ServiceReport } from "../backend.d";

interface VoltageReading {
  label: string;
  value: string;
}

interface Props {
  report: ServiceReport;
  onBack?: () => void;
  showActions?: boolean;
  voltageReadings?: VoltageReading[];
  engineerSignatureData?: string;
  clientSignatureData?: string;
}

const JOB_TYPE_LABELS: Record<string, string> = {
  maintenance: "Preventive Maintenance",
  repair: "Repair",
  inspection: "Inspection",
  installation: "Installation",
  emergency: "Emergency Call",
};

const STATUS_LABELS: Record<string, string> = {
  completed: "COMPLETED",
  inProgress: "IN PROGRESS",
  draft: "DRAFT",
};

const STATUS_COLORS: Record<string, string> = {
  completed: "#1A7A4A",
  inProgress: "#1F8F8A",
  draft: "#7A8792",
};

export default function PrintReport({
  report,
  onBack,
  showActions = true,
  voltageReadings,
  engineerSignatureData,
  clientSignatureData,
}: Props) {
  const handlePrint = () => window.print();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Screen-only action bar */}
      {showActions && (
        <div className="flex items-center justify-between mb-5 print:hidden">
          <Button
            data-ocid="print.back.button"
            variant="outline"
            onClick={onBack}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <div className="flex gap-2">
            <Button
              data-ocid="print.print.button"
              variant="outline"
              onClick={handlePrint}
              className="gap-2"
            >
              <Printer className="w-4 h-4" /> Print
            </Button>
            <Button
              data-ocid="print.export.primary_button"
              onClick={handlePrint}
              className="bg-primary text-primary-foreground hover:bg-secondary gap-2"
            >
              <Download className="w-4 h-4" /> Export PDF
            </Button>
          </div>
        </div>
      )}

      {/* Printable content */}
      <div id="print-report">
        <div className="print-page bg-white border border-border rounded-lg shadow-card p-8 print:shadow-none print:border-0 print:rounded-none">
          {/* Header */}
          <div className="print-header flex items-start justify-between border-b-2 border-primary pb-5 mb-6">
            <div>
              <p className="print-company-name text-xl font-bold text-secondary tracking-wide uppercase">
                DYNAMIC POWER SYSTEMS
              </p>
              <p className="print-company-sub text-sm text-muted-foreground mt-0.5">
                Mysore, Karnataka — Field Service Division
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Tel: +91-821-XXXXXXX | Email: service@dps-mysore.com
              </p>
            </div>
            <div className="text-right">
              <p className="print-report-title text-base font-semibold text-foreground">
                SERVICE REPORT
              </p>
              <p className="print-report-id text-sm text-muted-foreground">
                Report # {report.reportNumber.toString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Date: {report.date}
              </p>
              <span
                className="inline-block mt-2 px-3 py-0.5 rounded text-xs font-bold text-white"
                style={{
                  backgroundColor: STATUS_COLORS[report.status] ?? "#7A8792",
                }}
              >
                {STATUS_LABELS[report.status] ?? report.status}
              </span>
            </div>
          </div>

          {/* Job Details */}
          <Section title="Job Details">
            <Grid2>
              <Field
                label="Job Type"
                value={JOB_TYPE_LABELS[report.jobType] ?? report.jobType}
              />
              <Field
                label="Status"
                value={STATUS_LABELS[report.status] ?? report.status}
              />
              <Field label="Client / Company" value={report.clientName} />
              <Field label="Site Location" value={report.location} />
              <Field label="Service Date" value={report.date} />
              <Field label="Engineer Name" value={report.engineerName} />
            </Grid2>
          </Section>

          {/* Equipment */}
          <Section title="Equipment Information">
            <Grid2>
              <Field label="Asset ID" value={report.assetId} />
              <Field label="Equipment Model" value={report.equipmentModel} />
              <Field label="Serial Number" value={report.serialNumber} />
            </Grid2>
          </Section>

          {/* Service Performed */}
          <Section title="Service Performed">
            <div className="space-y-3">
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide mb-1">
                  Fault Description
                </p>
                <p className="text-sm text-foreground bg-muted/40 rounded p-3 whitespace-pre-wrap min-h-[50px]">
                  {report.faultDescription || "—"}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide mb-1">
                  Work Performed
                </p>
                <p className="text-sm text-foreground bg-muted/40 rounded p-3 whitespace-pre-wrap min-h-[60px]">
                  {report.workPerformed || "—"}
                </p>
              </div>
            </div>
          </Section>

          {/* Parts Used */}
          {report.partsUsed.length > 0 && (
            <Section title="Parts Used">
              <table className="print-table w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-muted/60">
                    <th className="text-left px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground border border-border">
                      Part Name
                    </th>
                    <th className="text-left px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground border border-border">
                      Part Number
                    </th>
                    <th className="text-center px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground border border-border">
                      Qty
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {report.partsUsed.map((p, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: parts list order is stable
                    <tr key={i} className={i % 2 === 0 ? "" : "bg-muted/20"}>
                      <td className="px-3 py-2 border border-border text-sm">
                        {p.partName}
                      </td>
                      <td className="px-3 py-2 border border-border text-sm font-mono text-xs">
                        {p.partNumber}
                      </td>
                      <td className="px-3 py-2 border border-border text-center text-sm">
                        {Number(p.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>
          )}

          {/* Voltage Readings */}
          {voltageReadings && voltageReadings.length > 0 && (
            <Section title="Voltage Readings">
              <table className="print-table w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-muted/60">
                    <th className="text-left px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground border border-border w-8">
                      #
                    </th>
                    <th className="text-left px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground border border-border">
                      Parameter
                    </th>
                    <th className="text-center px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground border border-border w-36">
                      Value (V)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {voltageReadings.map((r, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: voltage list order is stable
                    <tr key={i} className={i % 2 === 0 ? "" : "bg-muted/20"}>
                      <td className="px-3 py-2 border border-border text-xs text-muted-foreground text-center">
                        {i + 1}
                      </td>
                      <td className="px-3 py-2 border border-border text-sm">
                        {r.label || "—"}
                      </td>
                      <td className="px-3 py-2 border border-border text-center text-sm font-mono">
                        {r.value ? `${r.value} V` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>
          )}

          {/* Checklist */}
          {report.checklistItems.length > 0 && (
            <Section title="Service Checklist">
              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                {report.checklistItems.map((c, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: checklist order is stable
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                        c.checked
                          ? "bg-success border-success"
                          : "border-border"
                      }`}
                    >
                      {c.checked && (
                        <svg
                          viewBox="0 0 10 8"
                          className="w-2.5 h-2 fill-current"
                          aria-hidden="true"
                        >
                          <path
                            d="M1 4l2.5 2.5L9 1"
                            stroke="white"
                            strokeWidth="1.5"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs text-foreground">{c.item}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Remarks */}
          {report.remarks && (
            <Section title="Remarks & Additional Notes">
              <p className="text-sm text-foreground bg-muted/40 rounded p-3 whitespace-pre-wrap">
                {report.remarks}
              </p>
            </Section>
          )}

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-12 mt-8 pt-6 border-t border-border">
            <div>
              {engineerSignatureData ? (
                <img
                  src={engineerSignatureData}
                  alt="Engineer Signature"
                  className="h-14 object-contain mb-2 border-b-2 border-foreground/40 w-full"
                  style={{ background: "white" }}
                />
              ) : (
                <div className="h-14 border-b-2 border-foreground/40 mb-2" />
              )}
              <p className="text-xs font-semibold text-foreground">
                Service Engineer
              </p>
              <p className="text-xs text-muted-foreground">
                {report.engineerName || "_____________________"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Dynamic Power Systems, Mysore
              </p>
            </div>
            <div>
              {clientSignatureData ? (
                <img
                  src={clientSignatureData}
                  alt="Client Signature"
                  className="h-14 object-contain mb-2 border-b-2 border-foreground/40 w-full"
                  style={{ background: "white" }}
                />
              ) : (
                <div className="h-14 border-b-2 border-foreground/40 mb-2" />
              )}
              <p className="text-xs font-semibold text-foreground">
                Client / Customer
              </p>
              <p className="text-xs text-muted-foreground">
                {report.clientName || "_____________________"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Authorized Signatory
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-border text-center">
            <p className="text-[10px] text-muted-foreground">
              This is a computer-generated service report by Dynamic Power
              Systems, Mysore. For queries, contact: service@dps-mysore.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: { title: string; children: React.ReactNode }) {
  return (
    <div className="print-section mb-5">
      <h3 className="print-section-title text-[11px] font-bold uppercase tracking-widest text-secondary border-b border-border pb-2 mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Grid2({ children }: { children: React.ReactNode }) {
  return (
    <div className="print-grid-2 grid grid-cols-2 gap-x-8 gap-y-3">
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="print-field">
      <p className="print-label text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="print-value text-sm text-foreground mt-0.5">
        {value || "—"}
      </p>
    </div>
  );
}
