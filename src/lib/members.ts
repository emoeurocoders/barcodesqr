/**
 * What the members-area sidebar says about the customer: their own name, and
 * the plan their account is actually on (not the mockup's "Pro Plan").
 */
export const planLabel = (plan: string | null | undefined) =>
  ({ free: "Free", trial: "Trial Plan", quarterly: "Quarterly Plan", biannual: "Biannual Plan" })[plan ?? "free"] ?? "Free";

export const shellName = (u: { firstName?: string | null; name?: string | null; email?: string | null }) =>
  u.firstName || u.name?.split(" ")[0] || u.email?.split("@")[0] || "Account";
