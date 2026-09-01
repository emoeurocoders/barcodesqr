import { LINK_LOGO_FIELD } from "@/lib/uploads";

/**
 * Puts one picked file into R2 and returns where it landed.
 *
 * Two hops: ask our API to approve the file and sign a URL for it, then PUT
 * the bytes straight at R2. The bytes deliberately do not pass through the
 * app — see src/lib/storage.ts.
 *
 * XMLHttpRequest rather than fetch, because a 50 MB video over a phone
 * connection needs a progress bar and fetch cannot report upload progress.
 */

export type Uploaded = { key: string; url: string };

export { LINK_LOGO_FIELD };

/** Thrown with a message already fit to show the visitor. */
export class UploadError extends Error {}

export async function uploadFile({
  type,
  field,
  file,
  onProgress,
  signal,
}: {
  type: string;
  field: string;
  file: File;
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
}): Promise<Uploaded> {
  const res = await fetch("/api/uploads", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      type,
      field,
      filename: file.name,
      // Browsers leave this empty for types they don't recognise; the server
      // still has the filename to judge by.
      contentType: file.type || "application/octet-stream",
      size: file.size,
    }),
    signal,
  });

  const approved = await res.json().catch(() => null);
  if (!res.ok) {
    throw new UploadError(
      approved?.error ?? "That upload could not be started. Please try again.",
    );
  }

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", approved.uploadUrl);
    // Must match what the server signed, or R2 rejects the PUT.
    xhr.setRequestHeader("content-type", file.type || "application/octet-stream");

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new UploadError("The upload was refused. Please try again."));
    xhr.onerror = () =>
      reject(new UploadError("The upload failed. Check your connection and try again."));
    xhr.onabort = () => reject(new DOMException("Aborted", "AbortError"));

    signal?.addEventListener("abort", () => xhr.abort(), { once: true });
    xhr.send(file);
  });

  return { key: approved.key, url: approved.url };
}
