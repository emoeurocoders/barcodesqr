"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const inputClass =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-faint shadow-soft transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50";

export function Field({
  name,
  label,
  type = "text",
  required = false,
  autoComplete,
  action,
}: {
  name: string;
  label: string;
  type?: "text" | "email" | "password";
  required?: boolean;
  autoComplete?: string;
  /** Optional link rendered opposite the label, e.g. "Forgot password?". */
  action?: React.ReactNode;
}) {
  const [shown, setShown] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && shown ? "text" : type;

  return (
    <div className="block">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <label htmlFor={name} className="text-sm font-medium text-ink">
          {label}
          {required && <span className="ml-0.5 text-danger">*</span>}
        </label>
        {action}
      </div>

      <div className="relative">
        <input
          id={name}
          name={name}
          type={inputType}
          required={required}
          autoComplete={autoComplete}
          className={`${inputClass}${isPassword ? " pe-10" : ""}`}
        />

        {isPassword && (
          <button
            type="button"
            aria-label={shown ? "Hide password" : "Show password"}
            aria-pressed={shown}
            onClick={() => setShown((v) => !v)}
            className="absolute end-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1 text-faint transition-colors hover:bg-bg-alt hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            {shown ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
