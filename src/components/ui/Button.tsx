import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "outline" | "outline-primary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-btn font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-on-accent shadow-soft hover:bg-primary-dark",
  outline: "border border-line bg-white text-ink hover:bg-bg-alt",
  // The wizard's Back button: same shape as `outline`, but drawn in the action
  // colour so stepping backwards reads as navigation rather than dismissal.
  "outline-primary":
    "border border-primary text-primary bg-white hover:bg-primary-soft/40",
  ghost: "text-ink hover:bg-bg-alt",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "sm",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        base,
        variants[variant],
        sizes[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
