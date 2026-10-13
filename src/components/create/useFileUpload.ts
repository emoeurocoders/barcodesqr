"use client";

import { useEffect, useRef, useState } from "react";
import type { Field } from "./fieldSchema";
import { parseStoredFile } from "./storedValues";
import { matchesAccept } from "@/lib/uploads";
import { UploadError, uploadFile } from "./uploadFile";

/**
 * Picking a file uploads it immediately rather than at save time: the bytes
 * go straight to R2 and only the resulting URL is kept in the values map. The
 * field stays empty until that finishes, which is what keeps step 2's Next
 * from advancing past a file that is still in flight.
 *
 * Shared by the desktop drop zone and the mobile upload box, which look
 * nothing alike but must agree on limits, cancellation and what gets stored.
 */
export function useFileUpload({
  type,
  field,
  value,
  onChange,
}: {
  type: string;
  field: Field;
  value: string;
  onChange: (v: string) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  /** Percent while a file is in flight, null when nothing is uploading. */
  const [progress, setProgress] = useState<number | null>(null);
  /** Local preview of the in-flight file, so the box isn't blank while it uploads. */
  const [pending, setPending] = useState<{
    name: string;
    size: number;
    src?: string;
  } | null>(null);

  // Only the newest pick may finish: replacing a file mid-upload must not let
  // the abandoned one land afterwards and overwrite it.
  const inFlight = useRef<AbortController | null>(null);
  useEffect(() => () => inFlight.current?.abort(), []);

  const stored = parseStoredFile(value);
  const maxMb = field.maxSizeMb ?? 5;

  const take = async (file: File | undefined | null) => {
    if (!file) return;
    if (!matchesAccept(file.name, file.type, field.accept)) {
      setError(
        `That file type isn't supported — use ${field.formats ?? "a supported format"}.`,
      );
      return;
    }
    if (file.size > maxMb * 1024 * 1024) {
      setError(`This file is too large — the maximum size is ${maxMb} MB.`);
      return;
    }

    inFlight.current?.abort();
    const ctrl = new AbortController();
    inFlight.current = ctrl;

    setError(null);
    onChange("");
    const src = file.type.startsWith("image/")
      ? URL.createObjectURL(file)
      : undefined;
    setPending({ name: file.name, size: file.size, src });
    setProgress(0);

    try {
      const { key, url } = await uploadFile({
        type,
        field: field.name,
        file,
        onProgress: setProgress,
        signal: ctrl.signal,
      });
      onChange(JSON.stringify({ name: file.name, size: file.size, key, url }));
    } catch (e) {
      if ((e as Error)?.name === "AbortError") return;
      setError(
        e instanceof UploadError
          ? e.message
          : "The upload failed. Please try again.",
      );
    } finally {
      if (inFlight.current === ctrl) {
        inFlight.current = null;
        setProgress(null);
        setPending(null);
      }
      if (src) URL.revokeObjectURL(src);
    }
  };

  /** Drop whatever is stored or in flight. */
  const clear = () => {
    inFlight.current?.abort();
    inFlight.current = null;
    setProgress(null);
    setPending(null);
    onChange("");
    setError(null);
  };

  return { take, clear, error, progress, pending, stored, maxMb };
}
