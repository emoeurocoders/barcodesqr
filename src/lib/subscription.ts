/**
 * Whether the subscription lifecycle JB approved (2026-11-18) actually runs:
 * - paid access and dynamic codes last until the paid period ends;
 * - a failed renewal gets a 5-day grace period before codes pause;
 * - reactivating restores paused codes automatically.
 *
 * None of it can run yet — there is no payment processor (Primer, with Stripe
 * underneath, comes later). JB, 2026-11-27: the Help Center may only present
 * the grace period and automatic reactivation as live once both are built AND
 * tested with the processor. Flip this then; until then those sentences stay
 * out of the copy (see app/help/articles.ts).
 */
export const SUBSCRIPTION_LIFECYCLE_LIVE = false;
