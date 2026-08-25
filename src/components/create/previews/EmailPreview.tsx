"use client";

import { Mail, X, ArrowUp, User, Tag } from "lucide-react";
import { PhoneFrame } from "../PhonePreview";

type Values = Record<string, string>;

const FIELD = "#8e8e93";
/** The hairline under the To: / Subject: rows. */
const RULE = "#e8e8ea";

/**
 * Step-2 preview for the Email type: the compose sheet a scan opens, filling
 * in as the recipient, subject and body are typed.
 */
export function EmailPreview({ values }: { values: Values }) {
  const to = values.to?.trim();
  const subject = values.subject?.trim();
  const body = values.body?.trim();

  return (
    <PhoneFrame>
      <div
        className="relative flex h-full flex-col"
        style={{ background: "#e7e8ec" }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div
            className="absolute -right-24 -top-28 h-72 w-72 rounded-full"
            style={{ border: "26px solid rgba(242, 243, 245, 0.9)" }}
          />
          <div
            className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full"
            style={{ border: "30px solid rgba(242, 243, 245, 0.9)" }}
          />
        </div>

        <div className="relative px-6 pt-12">
          <span
            className="grid h-12 w-12 place-items-center rounded-xl shadow-soft"
            style={{ background: "linear-gradient(#6ab0f0, #3972ed)" }}
          >
            <Mail className="h-6 w-6 text-white" />
          </span>
        </div>

        <div className="relative mx-auto mt-4 w-[90%]">
          <div
            className="mx-auto mb-1.5 h-1 w-7 rounded-full"
            style={{ background: "#dddddd" }}
          />
          <div className="rounded-[20px] bg-white p-4 shadow-pop">
            <div className="flex items-center justify-between">
              <span
                className="grid h-8 w-8 place-items-center rounded-full"
                style={{ background: "#f0f0f2" }}
              >
                <X className="h-4 w-4" style={{ color: "#6b6b6e" }} />
              </span>
              <span
                className="grid h-9 w-9 place-items-center rounded-full"
                style={{ background: "#3c86f7" }}
              >
                <ArrowUp className="h-4 w-4 text-white" />
              </span>
            </div>

            <p
              className="mt-3 text-lg font-bold"
              style={{ color: "#0a0a0a" }}
            >
              New Message
            </p>

            <div
              className="mt-2 flex items-center gap-2 border-b py-2"
              style={{ borderColor: RULE }}
            >
              <User className="h-3.5 w-3.5 shrink-0 text-faint" />
              <span className="truncate text-[11px]" style={{ color: FIELD }}>
                {to ? `To: ${to}` : "To:"}
              </span>
            </div>

            <div
              className="flex items-center gap-2 border-b py-2"
              style={{ borderColor: RULE }}
            >
              <Tag className="h-3.5 w-3.5 shrink-0 text-faint" />
              <span className="truncate text-[11px]" style={{ color: FIELD }}>
                {subject ? `Subject: ${subject}` : "Subject:"}
              </span>
            </div>

            <div className="min-h-[132px] py-2">
              <span
                className={body ? "line-clamp-6 text-[11px]" : "text-[11px]"}
                style={{ color: FIELD }}
              >
                {body || "Body"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
