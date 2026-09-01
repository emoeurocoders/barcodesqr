import { PhoneFrame } from "../PhonePreview";
import { fileSrc, parseStoredFile } from "../storedValues";

/** The pale disc colour scattered behind the photo. */
const BLOB = "#eceff2";

/**
 * Step-2 preview for the Image type: the uploaded photo as a printed snap,
 * pegged to the wall. Falls back to the designer's sample until a photo has
 * been uploaded, so the empty state still matches the mockup.
 */
export function ImagePreview({ values }: { values: Record<string, string> }) {
  const uploaded = fileSrc(parseStoredFile(values.file));
  return (
    <PhoneFrame>
      <div className="relative flex h-full flex-col items-center overflow-hidden bg-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div
            className="absolute -right-8 top-8 h-24 w-24 rounded-full"
            style={{ background: BLOB }}
          />
          <div
            className="absolute -right-14 top-[42%] h-32 w-32 rounded-full"
            style={{ background: BLOB }}
          />
          <div
            className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full"
            style={{ background: BLOB }}
          />
          <div
            className="absolute bottom-16 right-10 h-3 w-3 rounded-full"
            style={{ background: BLOB }}
          />
        </div>

        <h3 className="relative pt-9 text-center text-[13px] font-semibold tracking-heading text-ink">
          QR-code for image
        </h3>

        <div className="relative mt-20 w-[74%]">
          {/* The peg holding the print up */}
          <div className="absolute -top-[17px] left-1/2 z-20 flex -translate-x-1/2 flex-col items-center">
            <div className="-mb-0.5 flex gap-3">
              <div
                className="h-3.5 w-2.5 -rotate-[22deg] rounded-t-full border-2 border-b-0"
                style={{ borderColor: "#3a3b3f" }}
              />
              <div
                className="h-3.5 w-2.5 rotate-[22deg] rounded-t-full border-2 border-b-0"
                style={{ borderColor: "#3a3b3f" }}
              />
            </div>
            <div
              className="h-4 w-9 rounded-[3px]"
              style={{ background: "#3a3b3f" }}
            />
          </div>

          {/* A second print behind, fanned out */}
          <div className="absolute inset-0 rotate-3 rounded-sm bg-white shadow-soft" />

          <div className="relative z-10 -rotate-2 rounded-sm bg-white p-2 pb-7 shadow-pop">
            <div className="h-44 w-full overflow-hidden rounded-[2px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={uploaded ?? "/previews/sunset-hearts.jpg"}
                alt=""
                aria-hidden="true"
                className="h-full w-full"
                style={{ objectFit: "cover", objectPosition: "50% 50%" }}
              />
            </div>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
