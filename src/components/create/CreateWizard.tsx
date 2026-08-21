"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { StepRail } from "./StepRail";
import { TypePicker } from "./TypePicker";
import { StepContent } from "./StepContent";
import { StepCustomize } from "./StepCustomize";
import { PreviewPanel } from "./PreviewPanel";
import { QrPreview, defaultQrStyle } from "./QrPreview";
import type { QrStyle } from "./QrPreview";
import { fieldSchema } from "./fieldSchema";
import { allTypes } from "./qrTypes";
import { encodeQr } from "./encodeQr";
import { Button } from "@/components/ui/Button";

type Values = Record<string, string>;

const defaultName = (type: string) =>
  `My ${allTypes.find((t) => t.value === type)?.label ?? "QR"} QR Code`;

/** Every required field for the type must be filled before moving on. */
function isComplete(type: string, values: Values) {
  const required = (fieldSchema[type] ?? []).filter((f) => f.required);
  if (!required.length) return true;
  return required.every((f) => (values[f.name] ?? "").trim().length > 0);
}

export function CreateWizard() {
  const [step, setStep] = useState(1);
  const [type, setType] = useState("website");
  const [values, setValues] = useState<Values>({});
  const [name, setName] = useState(defaultName("website"));
  const [style, setStyle] = useState<QrStyle>(defaultQrStyle);
  const [password, setPassword] = useState("");
  const downloadRef = useRef<((ext: "png" | "jpeg" | "svg") => void) | null>(
    null,
  );

  const qrValue = useMemo(() => encodeQr(type, values), [type, values]);
  const complete = isComplete(type, values);

  const chooseType = (next: string) => {
    setType(next);
    setValues({});
    setName(defaultName(next));
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-line/80 bg-white shadow-soft">
      <StepRail current={step} />

      <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-start">
        {step === 1 && (
          <TypePicker selected={type} onSelect={chooseType} />
        )}

        {step === 2 && (
          <>
            <StepContent
              type={type}
              values={values}
              setValues={setValues}
              name={name}
              setName={setName}
            />
            <SidePreview qrValue={qrValue} style={style} />
          </>
        )}

        {step === 3 && (
          <>
            <StepCustomize
              style={style}
              setStyle={setStyle}
              password={password}
              setPassword={setPassword}
            />
            <SidePreview
              qrValue={qrValue}
              style={style}
              onReady={(fn) => {
                downloadRef.current = fn;
              }}
            />
          </>
        )}

        {step === 1 && <PreviewPanel />}
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-between gap-4 border-t border-line/80 bg-[#fbfcfd] px-5 py-4">
        {step === 1 ? (
          <Link href="/">
            <Button variant="outline">Cancel</Button>
          </Link>
        ) : (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        )}

        {step < 3 ? (
          <Button
            size="lg"
            disabled={step === 2 && !complete}
            onClick={() => setStep(step + 1)}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex flex-wrap items-center justify-end gap-2">
            {(["png", "jpeg", "svg"] as const).map((ext) => (
              <Button
                key={ext}
                size="lg"
                variant={ext === "png" ? "primary" : "outline"}
                onClick={() => downloadRef.current?.(ext)}
              >
                <Download className="h-4 w-4" />
                {ext.toUpperCase()}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** Live QR alongside steps 2 and 3, framed the way the customiser asks. */
function SidePreview({
  qrValue,
  style,
  onReady,
}: {
  qrValue: string;
  style: QrStyle;
  onReady?: (fn: (ext: "png" | "jpeg" | "svg") => void) => void;
}) {
  const framed = style.frame !== null;

  return (
    <aside className="h-fit shrink-0 rounded-2xl border border-line/80 bg-white p-5 text-center lg:sticky lg:top-24 lg:w-[330px]">
      <div
        className={`mx-auto w-fit ${
          framed ? "rounded-2xl border-2 p-3" : ""
        }`}
        style={framed ? { borderColor: style.fg, background: style.bg } : undefined}
      >
        {framed && style.frame === "top" && (
          <p
            className="mb-2 text-sm font-bold tracking-wide"
            style={{ color: style.fg }}
          >
            {style.caption}
          </p>
        )}

        <QrPreview
          value={qrValue}
          style={style}
          size={240}
          onReady={onReady}
          className="mx-auto"
        />

        {framed && style.frame !== "top" && (
          <p
            className="mt-2 text-sm font-bold tracking-wide"
            style={{ color: style.fg }}
          >
            {style.caption}
          </p>
        )}
      </div>

      <p className="mt-4 text-xs text-muted">
        {qrValue
          ? "Scan to test before you download."
          : "Fill in the details to see your code."}
      </p>
    </aside>
  );
}
