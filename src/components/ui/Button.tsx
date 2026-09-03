import type { ButtonHTMLAttributes } from "react";

type Variant =
  | "primary"
  | "outline"
  | "outline-fill"
  | "outline-primary"
  | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-btn font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

const variants: Record<Variant, string> = {
  /**
   * Hover is `primary-press` (#1855db), not `primary-dark` (#1d4ed8). The
   * designer uses both: #1855db on the .btn system's filled buttons (.btnC1 in
   * the header, .btnC3 on the pricing table), and #1d4ed8 on MODAL buttons
   * (.btnContinue, .btnSubmit). This component is the .btn system, so it takes
   * the first; LoginModal keeps primary-dark because it is the second.
   */
  primary: "bg-primary text-on-accent shadow-soft hover:bg-primary-press",
  outline: "border border-line bg-white text-ink hover:bg-bg-alt",
  /**
   * The designer's `.btnC4`, on the pricing table's non-highlighted plans:
   * blue-bordered with BLACK label at rest, filling solid blue with a white
   * label on hover. Distinct from `outline`, whose grey border and grey hover
   * belong to the dismissive buttons (Cancel, Back, Log in), and from
   * `outline-primary`, which tints rather than fills and letters in blue.
   */
  "outline-fill":
    "border border-primary bg-white text-black hover:bg-primary hover:text-on-accent",

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
