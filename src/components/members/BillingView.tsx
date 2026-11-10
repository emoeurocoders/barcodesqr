"use client";

import { Actions, Card, CardHead, Link, Note, PageTop, Status, btn } from "./ui";

/**
 * member_billing.html, connected to what exists (JB, Monday 5709834361).
 *
 * No payment processor has been chosen yet (docs/EMAILS.md): nothing has
 * been charged, so there is no price, renewal, card, address or invoice to
 * show, and nothing to change or cancel. Each card says so instead of
 * showing the file's sample data or buttons that do nothing (JB). The cards,
 * order and tabs are the file's; the processor fills them in later.
 */

export type BillingData = {
  /** users.plan */
  plan: string;
  planName: string;
  since: string;
};

const ico = {
  crown: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
      <path d="M5 21h14" />
    </svg>
  ),
  file: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  ),
  card: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  chat: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
};

export function BillingView({ d }: { d: BillingData }) {
  const onPlan = d.plan !== "free";
  return (
    <>
      <PageTop
        title="Billing & Subscription"
        tabs={[
          { id: "accPlan", label: "Plan" },
          { id: "accPayment", label: "Payment Method" },
          { id: "accInvoices", label: "Invoices" },
        ]}
      />
      <div className="mt-[22px] grid grid-cols-[minmax(0,1.335fr)_minmax(0,1fr)] items-start gap-[20px] max-[1240px]:grid-cols-1 max-[1240px]:gap-[16px] max-[576px]:mt-[18px]">
        <div className="min-w-0">
          <Card id="accPlan">
            <CardHead icon={ico.crown} tone="teal" title="Current Plan" sub="Manage your subscription and plan details." />
            {/* Their `.accPlan`. */}
            <div className="mt-[18px] rounded-[14px] border border-[#ddf0ee] bg-[#f2f9f8] p-[24px] max-[576px]:px-[16px] max-[576px]:pt-[16px] max-[576px]:pb-[18px]">
              <div className="flex flex-wrap items-center gap-x-[12px] gap-y-[6px]">
                <h3 className="text-[28px] leading-[1.15em] font-extrabold tracking-[-0.02em] text-[#0e1311] max-[576px]:text-[24px]">{onPlan ? d.planName : "No plan"}</h3>
                <Status tone={onPlan ? "ok" : "end"}>{onPlan ? "Active" : "Inactive"}</Status>
              </div>
              {onPlan && (
                <p className="mt-[0.6em] text-[15.5px] text-[#374151] max-[576px]:text-[15px]">
                  Started on <b className="font-medium text-[#0e1311]">{d.since}</b>
                </p>
              )}
              <p className="mt-[0.8em] text-[15px] leading-[1.45em] text-[#4b5563] max-[576px]:text-[14.5px]">
                {onPlan
                  ? "Your QR codes, editing and scan counts are available on this plan."
                  : "You don't have a plan yet. Create a QR code to start one."}
              </p>
            </div>
            <Note>
              Payments aren&apos;t connected yet, so nothing has been charged and there is nothing to renew or cancel. Plan changes and
              cancellation will appear here once they are.
            </Note>
          </Card>
          <Card id="accInvoices">
            <CardHead icon={ico.file} tone="purple" title="Billing History" sub="View and download your past invoices." />
            <Note>No invoices yet.</Note>
          </Card>
        </div>
        <div className="min-w-0">
          <Card id="accPayment">
            <CardHead icon={ico.card} tone="teal" title="Payment Method" sub="Your saved payment method for subscription billing." />
            <Note>No payment method on file.</Note>
          </Card>
          <Card>
            <CardHead icon={ico.pin} title="Billing Address" sub="Your billing address for invoices and receipts." />
            <Note>No billing address on file.</Note>
          </Card>
          <Card>
            <CardHead icon={ico.chat} title="Need Help?" sub="Questions about billing, invoices, or subscription changes?" />
            <Actions>
              <Link href="/help" className={btn("outline")}>
                Contact Support
              </Link>
            </Actions>
          </Card>
        </div>
      </div>
    </>
  );
}
