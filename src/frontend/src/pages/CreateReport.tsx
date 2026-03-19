import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import { JobType, ReportStatus } from "../backend.d";
import type { ChecklistItem, PartUsed, ServiceReport } from "../backend.d";
import PrintReport from "../components/PrintReport";
import { useCreateReport } from "../hooks/useQueries";

const STEPS = [
  { id: 1, label: "Job Info" },
  { id: 2, label: "Equipment" },
  { id: 3, label: "Service" },
  { id: 4, label: "Parts" },
  { id: 5, label: "Checklist" },
  { id: 6, label: "Voltage" },
  { id: 7, label: "Finalize" },
  { id: 8, label: "Signatures" },
];

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { item: "Safety Precautions Observed", checked: false },
  { item: "Tools & Equipment Verified", checked: false },
  { item: "Equipment Tested After Service", checked: false },
  { item: "Area Cleaned After Work", checked: false },
  { item: "Client Sign-off Obtained", checked: false },
  { item: "Electrical Connections Checked", checked: false },
  { item: "Calibration Verified", checked: false },
  { item: "Safety Cover Reinstalled", checked: false },
];

const DEFAULT_VOLTAGE_READINGS = [
  { label: "Input Voltage (R)", value: "" },
  { label: "Input Voltage (Y)", value: "" },
  { label: "Input Voltage (B)", value: "" },
  { label: "Output Voltage", value: "" },
];

interface VoltageReading {
  label: string;
  value: string;
}

interface Props {
  navigate: (page: Page) => void;
  onViewReport: (rn: bigint) => void;
}

function FormField({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={cn("space-y-1.5", full && "sm:col-span-2")}>
      <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
        {label}
      </Label>
      {children}
    </div>
  );
}

function FieldGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
      {children}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start">
      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
      <span className="text-xs text-foreground text-right max-w-[120px] truncate capitalize">
        {value}
      </span>
    </div>
  );
}

const inputCls = "h-9 text-sm border-input focus:ring-ring";

function Step1({
  form,
  set,
}: {
  form: ServiceReport;
  set: (f: keyof ServiceReport, v: unknown) => void;
}) {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-foreground">Job Details</h3>
      <FieldGroup>
        <FormField label="Report ID">
          <Input
            data-ocid="report.id.input"
            className={inputCls}
            value={form.reportNumber.toString()}
            readOnly
          />
        </FormField>
        <FormField label="Date">
          <Input
            data-ocid="report.date.input"
            type="date"
            className={inputCls}
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
          />
        </FormField>
        <FormField label="Job Type">
          <Select
            value={form.jobType}
            onValueChange={(v) => set("jobType", v as JobType)}
          >
            <SelectTrigger
              data-ocid="report.jobtype.select"
              className={inputCls}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(JobType).map((jt) => (
                <SelectItem key={jt} value={jt} className="capitalize">
                  {jt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Status">
          <Select
            value={form.status}
            onValueChange={(v) => set("status", v as ReportStatus)}
          >
            <SelectTrigger
              data-ocid="report.status.select"
              className={inputCls}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ReportStatus).map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Client Name" full>
          <Input
            data-ocid="report.client.input"
            className={inputCls}
            value={form.clientName}
            onChange={(e) => set("clientName", e.target.value)}
            placeholder="e.g. Infosys Technologies Ltd."
          />
        </FormField>
        <FormField label="Location" full>
          <Input
            data-ocid="report.location.input"
            className={inputCls}
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="e.g. IT Park, Mysore"
          />
        </FormField>
        <FormField label="Engineer Name" full>
          <Input
            data-ocid="report.engineer.input"
            className={inputCls}
            value={form.engineerName}
            onChange={(e) => set("engineerName", e.target.value)}
            placeholder="Your full name"
          />
        </FormField>
      </FieldGroup>
    </div>
  );
}

function Step2({
  form,
  set,
}: {
  form: ServiceReport;
  set: (f: keyof ServiceReport, v: unknown) => void;
}) {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-foreground">
        Equipment Information
      </h3>
      <FieldGroup>
        <FormField label="Asset ID">
          <Input
            data-ocid="report.assetid.input"
            className={inputCls}
            value={form.assetId}
            onChange={(e) => set("assetId", e.target.value)}
            placeholder="e.g. UPS-DPS-042"
          />
        </FormField>
        <FormField label="Equipment Model">
          <Input
            data-ocid="report.model.input"
            className={inputCls}
            value={form.equipmentModel}
            onChange={(e) => set("equipmentModel", e.target.value)}
            placeholder="e.g. ABB UPS 80kVA"
          />
        </FormField>
        <FormField label="Serial Number">
          <Input
            data-ocid="report.serial.input"
            className={inputCls}
            value={form.serialNumber}
            onChange={(e) => set("serialNumber", e.target.value)}
            placeholder="e.g. SN2024-0841"
          />
        </FormField>
      </FieldGroup>
    </div>
  );
}

function Step3({
  form,
  set,
}: {
  form: ServiceReport;
  set: (f: keyof ServiceReport, v: unknown) => void;
}) {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-foreground">
        Service Performed
      </h3>
      <FormField label="Fault Description" full>
        <Textarea
          data-ocid="report.fault.textarea"
          className="text-sm min-h-[100px] resize-y"
          value={form.faultDescription}
          onChange={(e) => set("faultDescription", e.target.value)}
          placeholder="Describe the fault or issue reported by the client..."
        />
      </FormField>
      <FormField label="Work Performed" full>
        <Textarea
          data-ocid="report.work.textarea"
          className="text-sm min-h-[120px] resize-y"
          value={form.workPerformed}
          onChange={(e) => set("workPerformed", e.target.value)}
          placeholder="Describe the work performed to resolve the issue..."
        />
      </FormField>
    </div>
  );
}

function Step4({
  form,
  addPart,
  removePart,
  updatePart,
}: {
  form: ServiceReport;
  addPart: () => void;
  removePart: (i: number) => void;
  updatePart: (i: number, f: keyof PartUsed, v: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Parts Used</h3>
        <Button
          type="button"
          data-ocid="report.addpart.button"
          variant="outline"
          size="sm"
          onClick={addPart}
          className="gap-1 text-xs h-7"
        >
          <Plus className="w-3.5 h-3.5" /> Add Part
        </Button>
      </div>
      {form.partsUsed.length === 0 ? (
        <div
          data-ocid="report.parts.empty_state"
          className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-lg"
        >
          <p className="text-sm">No parts added yet.</p>
          <p className="text-xs mt-1">
            Click &ldquo;Add Part&rdquo; to add parts used.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-12 gap-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide px-1">
            <div className="col-span-5">Part Name</div>
            <div className="col-span-4">Part Number</div>
            <div className="col-span-2">Qty</div>
            <div className="col-span-1" />
          </div>
          {form.partsUsed.map((p, i) => (
            <div
              key={`part-${i}-${p.partName}`}
              data-ocid={`report.part.item.${i + 1}`}
              className="grid grid-cols-12 gap-2 items-center"
            >
              <div className="col-span-5">
                <Input
                  data-ocid={`report.part.name.input.${i + 1}`}
                  className="h-8 text-xs"
                  value={p.partName}
                  onChange={(e) => updatePart(i, "partName", e.target.value)}
                  placeholder="Part name"
                />
              </div>
              <div className="col-span-4">
                <Input
                  className="h-8 text-xs"
                  value={p.partNumber}
                  onChange={(e) => updatePart(i, "partNumber", e.target.value)}
                  placeholder="Part #"
                />
              </div>
              <div className="col-span-2">
                <Input
                  className="h-8 text-xs"
                  type="number"
                  min="1"
                  value={Number(p.quantity)}
                  onChange={(e) => updatePart(i, "quantity", e.target.value)}
                />
              </div>
              <div className="col-span-1 flex justify-end">
                <button
                  type="button"
                  data-ocid={`report.part.delete_button.${i + 1}`}
                  onClick={() => removePart(i)}
                  className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Step5({
  form,
  toggleCheck,
}: {
  form: ServiceReport;
  toggleCheck: (i: number) => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">
        Service Checklist
      </h3>
      <div className="space-y-3">
        {form.checklistItems.map((item, i) => (
          <div
            key={item.item}
            data-ocid={`report.checklist.item.${i + 1}`}
            className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
          >
            <Checkbox
              data-ocid={`report.checklist.checkbox.${i + 1}`}
              id={`check-${i}`}
              checked={item.checked}
              onCheckedChange={() => toggleCheck(i)}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label
              htmlFor={`check-${i}`}
              className="text-sm text-foreground cursor-pointer flex-1"
            >
              {item.item}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step6Voltage({
  voltageReadings,
  setVoltageReadings,
}: {
  voltageReadings: VoltageReading[];
  setVoltageReadings: (readings: VoltageReading[]) => void;
}) {
  const addReading = () =>
    setVoltageReadings([...voltageReadings, { label: "", value: "" }]);

  const removeReading = (i: number) =>
    setVoltageReadings(voltageReadings.filter((_, idx) => idx !== i));

  const updateReading = (i: number, field: keyof VoltageReading, val: string) =>
    setVoltageReadings(
      voltageReadings.map((r, idx) => (idx === i ? { ...r, [field]: val } : r)),
    );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Voltage Readings
        </h3>
        <Button
          type="button"
          data-ocid="report.addvoltage.button"
          variant="outline"
          size="sm"
          onClick={addReading}
          className="gap-1 text-xs h-7"
        >
          <Plus className="w-3.5 h-3.5" /> Add Reading
        </Button>
      </div>
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="grid grid-cols-12 gap-0 bg-muted/60 px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground border-b border-border">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-6 pl-2">Parameter Label</div>
          <div className="col-span-4 pl-2">Value (Volts)</div>
          <div className="col-span-1" />
        </div>
        <div className="divide-y divide-border">
          {voltageReadings.map((r, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: voltage list order is stable
              key={`voltage-${i}`}
              data-ocid={`report.voltage.item.${i + 1}`}
              className="grid grid-cols-12 gap-2 items-center px-3 py-2 hover:bg-muted/20 transition-colors"
            >
              <div className="col-span-1 text-center text-xs font-semibold text-muted-foreground">
                {i + 1}
              </div>
              <div className="col-span-6">
                <Input
                  data-ocid={`report.voltage.label.input.${i + 1}`}
                  className="h-8 text-xs border-0 bg-transparent focus-visible:ring-1 focus-visible:ring-ring"
                  value={r.label}
                  onChange={(e) => updateReading(i, "label", e.target.value)}
                  placeholder="Parameter name"
                />
              </div>
              <div className="col-span-4">
                <div className="relative">
                  <Input
                    data-ocid={`report.voltage.value.input.${i + 1}`}
                    className="h-8 text-xs border-0 bg-transparent focus-visible:ring-1 focus-visible:ring-ring pr-8"
                    type="number"
                    step="0.1"
                    value={r.value}
                    onChange={(e) => updateReading(i, "value", e.target.value)}
                    placeholder="0.0"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-medium">
                    V
                  </span>
                </div>
              </div>
              <div className="col-span-1 flex justify-center">
                <button
                  type="button"
                  data-ocid={`report.voltage.delete_button.${i + 1}`}
                  onClick={() => removeReading(i)}
                  disabled={voltageReadings.length <= 1}
                  className="p-1 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Record voltage measurements at all test points. Minimum 4 readings
        required.
      </p>
    </div>
  );
}

function SignaturePad({
  label,
  name,
  canvasRef,
  onClear,
  ocidPrefix,
}: {
  label: string;
  name: string;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onClear: () => void;
  ocidPrefix: string;
}) {
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawing.current = true;
    lastPos.current = getPos(e);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !lastPos.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    lastPos.current = pos;
  };

  const onPointerUp = () => {
    isDrawing.current = false;
    lastPos.current = null;
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <canvas
        ref={canvasRef}
        data-ocid={`${ocidPrefix}.canvas_target`}
        width={300}
        height={150}
        className="border-2 border-dashed border-border rounded-lg bg-white cursor-crosshair touch-none w-full"
        style={{ maxWidth: 300, height: 150 }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      />
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">
          {name || "___________________"}
        </p>
        <p className="text-xs text-muted-foreground">Sign above</p>
      </div>
      <Button
        type="button"
        data-ocid={`${ocidPrefix}.secondary_button`}
        variant="outline"
        size="sm"
        onClick={onClear}
        className="text-xs h-7"
      >
        Clear
      </Button>
    </div>
  );
}

function Step8Signatures({
  engineerName,
  clientName,
  engineerCanvasRef,
  clientCanvasRef,
  onClearEngineer,
  onClearClient,
}: {
  engineerName: string;
  clientName: string;
  engineerCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  clientCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  onClearEngineer: () => void;
  onClearClient: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Signatures</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Both engineer and client must sign to finalize the report.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-4 rounded-xl border border-border bg-muted/20">
          <SignaturePad
            label="Engineer Signature"
            name={engineerName}
            canvasRef={engineerCanvasRef}
            onClear={onClearEngineer}
            ocidPrefix="report.engineer_sig"
          />
        </div>
        <div className="p-4 rounded-xl border border-border bg-muted/20">
          <SignaturePad
            label="Client Signature"
            name={clientName}
            canvasRef={clientCanvasRef}
            onClear={onClearClient}
            ocidPrefix="report.client_sig"
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Draw your signature using mouse or touch.
      </p>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide block">
        {label}
      </span>
      <span className="text-sm text-foreground capitalize">
        {value || "\u2014"}
      </span>
    </div>
  );
}

function Step7({
  form,
  set,
  voltageReadings,
}: {
  form: ServiceReport;
  set: (f: keyof ServiceReport, v: unknown) => void;
  voltageReadings: VoltageReading[];
}) {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-foreground">
        Finalize &amp; Review
      </h3>
      <div className="bg-muted/50 rounded-lg p-4 space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <ReviewRow label="Report #" value={form.reportNumber.toString()} />
          <ReviewRow label="Date" value={form.date} />
          <ReviewRow label="Client" value={form.clientName} />
          <ReviewRow label="Location" value={form.location} />
          <ReviewRow label="Engineer" value={form.engineerName} />
          <ReviewRow label="Job Type" value={form.jobType} />
          <ReviewRow label="Asset ID" value={form.assetId} />
          <ReviewRow label="Model" value={form.equipmentModel} />
          <ReviewRow
            label="Parts Used"
            value={`${form.partsUsed.length} item(s)`}
          />
          <ReviewRow
            label="Checklist"
            value={`${form.checklistItems.filter((c) => c.checked).length}/${form.checklistItems.length} completed`}
          />
          <ReviewRow
            label="Voltage Readings"
            value={`${voltageReadings.filter((r) => r.value).length}/${voltageReadings.length} recorded`}
          />
        </div>
      </div>
      <FormField label="Remarks / Additional Notes" full>
        <Textarea
          data-ocid="report.remarks.textarea"
          className="text-sm min-h-[100px] resize-y"
          value={form.remarks}
          onChange={(e) => set("remarks", e.target.value)}
          placeholder="Any additional remarks, follow-up actions, or notes..."
        />
      </FormField>
    </div>
  );
}

export default function CreateReport({ navigate, onViewReport }: Props) {
  const [step, setStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const createReport = useCreateReport();

  const today = new Date().toISOString().slice(0, 10);
  const reportNum = BigInt(Date.now() % 100000);

  const [form, setForm] = useState<ServiceReport>({
    reportNumber: reportNum,
    date: today,
    jobType: JobType.maintenance,
    clientName: "",
    location: "",
    status: ReportStatus.draft,
    engineerName: "",
    assetId: "",
    equipmentModel: "",
    serialNumber: "",
    faultDescription: "",
    workPerformed: "",
    partsUsed: [],
    checklistItems: DEFAULT_CHECKLIST,
    remarks: "",
  });

  const [voltageReadings, setVoltageReadings] = useState<VoltageReading[]>(
    DEFAULT_VOLTAGE_READINGS,
  );
  const [engineerSignatureData, setEngineerSignatureData] = useState("");
  const [clientSignatureData, setClientSignatureData] = useState("");

  const engineerCanvasRef = useRef<HTMLCanvasElement>(null);
  const clientCanvasRef = useRef<HTMLCanvasElement>(null);

  const captureSignatures = useCallback(() => {
    if (engineerCanvasRef.current) {
      setEngineerSignatureData(
        engineerCanvasRef.current.toDataURL("image/png"),
      );
    }
    if (clientCanvasRef.current) {
      setClientSignatureData(clientCanvasRef.current.toDataURL("image/png"));
    }
  }, []);

  const clearCanvas = (ref: React.RefObject<HTMLCanvasElement | null>) => {
    if (!ref.current) return;
    const ctx = ref.current.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, ref.current.width, ref.current.height);
  };

  const set = (field: keyof ServiceReport, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const addPart = () =>
    setForm((prev) => ({
      ...prev,
      partsUsed: [
        ...prev.partsUsed,
        { partName: "", partNumber: "", quantity: BigInt(1) },
      ],
    }));

  const removePart = (i: number) =>
    setForm((prev) => ({
      ...prev,
      partsUsed: prev.partsUsed.filter((_, idx) => idx !== i),
    }));

  const updatePart = (i: number, field: keyof PartUsed, value: string) =>
    setForm((prev) => ({
      ...prev,
      partsUsed: prev.partsUsed.map((p, idx) =>
        idx === i
          ? {
              ...p,
              [field]:
                field === "quantity" ? BigInt(Number(value) || 1) : value,
            }
          : p,
      ),
    }));

  const toggleCheck = (i: number) =>
    setForm((prev) => ({
      ...prev,
      checklistItems: prev.checklistItems.map((c, idx) =>
        idx === i ? { ...c, checked: !c.checked } : c,
      ),
    }));

  const handleSubmit = async () => {
    captureSignatures();
    try {
      const id = await createReport.mutateAsync({
        ...form,
        status: ReportStatus.completed,
      });
      toast.success("Report submitted successfully!");
      onViewReport(id);
    } catch {
      toast.error("Failed to submit report. Please try again.");
    }
  };

  const handleSaveDraft = async () => {
    try {
      await createReport.mutateAsync({ ...form, status: ReportStatus.draft });
      toast.success("Draft saved!");
      navigate("reports");
    } catch {
      toast.error("Failed to save draft.");
    }
  };

  const handlePreview = () => {
    captureSignatures();
    setShowPreview(true);
  };

  if (showPreview) {
    return (
      <PrintReport
        report={form}
        onBack={() => setShowPreview(false)}
        showActions
        voltageReadings={voltageReadings}
        engineerSignatureData={engineerSignatureData}
        clientSignatureData={clientSignatureData}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Create Service Report
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Report #{form.reportNumber.toString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Form Card */}
        <div className="lg:col-span-2">
          <Card className="shadow-card border-border">
            <CardHeader className="pb-0 pt-5 px-5">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">
                Create Service Report
              </CardTitle>
              <div className="flex items-center gap-0">
                {STEPS.map((s, i) => (
                  <div
                    key={s.id}
                    className="flex items-center flex-1 last:flex-none"
                  >
                    <button
                      type="button"
                      data-ocid={`report.step.${s.id}.button`}
                      onClick={() => setStep(s.id)}
                      className="flex flex-col items-center gap-1 min-w-0"
                    >
                      <div
                        className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                          step === s.id
                            ? "bg-primary text-primary-foreground"
                            : step > s.id
                              ? "bg-success text-white"
                              : "bg-muted text-muted-foreground",
                        )}
                      >
                        {s.id}
                      </div>
                      <span
                        className={cn(
                          "text-[9px] font-medium hidden sm:block",
                          step === s.id
                            ? "text-primary"
                            : "text-muted-foreground",
                        )}
                      >
                        {s.label}
                      </span>
                    </button>
                    {i < STEPS.length - 1 && (
                      <div
                        className={cn(
                          "flex-1 h-px mx-1",
                          step > s.id ? "bg-success" : "bg-border",
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardHeader>
            <CardContent className="px-5 pt-5 pb-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {step === 1 && <Step1 form={form} set={set} />}
                  {step === 2 && <Step2 form={form} set={set} />}
                  {step === 3 && <Step3 form={form} set={set} />}
                  {step === 4 && (
                    <Step4
                      form={form}
                      addPart={addPart}
                      removePart={removePart}
                      updatePart={updatePart}
                    />
                  )}
                  {step === 5 && (
                    <Step5 form={form} toggleCheck={toggleCheck} />
                  )}
                  {step === 6 && (
                    <Step6Voltage
                      voltageReadings={voltageReadings}
                      setVoltageReadings={setVoltageReadings}
                    />
                  )}
                  {step === 7 && (
                    <Step7
                      form={form}
                      set={set}
                      voltageReadings={voltageReadings}
                    />
                  )}
                  {step === 8 && (
                    <Step8Signatures
                      engineerName={form.engineerName}
                      clientName={form.clientName}
                      engineerCanvasRef={engineerCanvasRef}
                      clientCanvasRef={clientCanvasRef}
                      onClearEngineer={() => clearCanvas(engineerCanvasRef)}
                      onClearClient={() => clearCanvas(clientCanvasRef)}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                <Button
                  type="button"
                  data-ocid="report.prev.button"
                  variant="outline"
                  onClick={() => setStep((p) => Math.max(1, p - 1))}
                  disabled={step === 1}
                  className="gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </Button>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    data-ocid="report.save.button"
                    variant="outline"
                    onClick={handleSaveDraft}
                    disabled={createReport.isPending}
                    className="gap-1 text-xs"
                  >
                    <Save className="w-4 h-4" /> Save Draft
                  </Button>
                  <Button
                    type="button"
                    data-ocid="report.preview.button"
                    variant="outline"
                    onClick={handlePreview}
                    className="gap-1 text-xs"
                  >
                    <Eye className="w-4 h-4" /> Preview PDF
                  </Button>
                  {step === STEPS.length ? (
                    <Button
                      type="button"
                      data-ocid="report.export.primary_button"
                      onClick={handleSubmit}
                      disabled={createReport.isPending}
                      className="bg-primary text-primary-foreground hover:bg-secondary gap-1 text-xs"
                    >
                      <Download className="w-4 h-4" />
                      {createReport.isPending
                        ? "Submitting..."
                        : "Submit & Export PDF"}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      data-ocid="report.next.button"
                      onClick={() =>
                        setStep((p) => Math.min(STEPS.length, p + 1))
                      }
                      className="bg-primary text-primary-foreground hover:bg-secondary gap-1"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Summary */}
        <div className="space-y-4">
          <Card className="shadow-card border-border border-l-4 border-l-primary">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-xs font-bold uppercase tracking-wider">
                Report Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-2">
              <SummaryRow
                label="Report #"
                value={form.reportNumber.toString()}
              />
              <SummaryRow label="Date" value={form.date} />
              <SummaryRow label="Client" value={form.clientName || "\u2014"} />
              <SummaryRow label="Job Type" value={form.jobType} />
              <SummaryRow label="Status" value={form.status} />
              <SummaryRow
                label="Engineer"
                value={form.engineerName || "\u2014"}
              />
            </CardContent>
          </Card>
          <Card className="shadow-card border-border">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-xs font-bold uppercase tracking-wider">
                Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="space-y-2">
                {STEPS.map((s) => (
                  <div key={s.id} className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold",
                        step > s.id
                          ? "bg-success text-white"
                          : step === s.id
                            ? "bg-primary text-white"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      {s.id}
                    </div>
                    <span
                      className={cn(
                        "text-xs",
                        step === s.id
                          ? "text-foreground font-medium"
                          : "text-muted-foreground",
                      )}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
