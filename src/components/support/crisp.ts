export type CrispCommand = unknown[];

declare global {
  interface Window {
    $crisp?: CrispCommand[];
    CRISP_WEBSITE_ID?: string;
  }
}

/** Set in Crisp → Settings → Website Settings → Setup instructions. */
export const CRISP_WEBSITE_ID = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID ?? "";

/**
 * Reveal the (otherwise hidden) chatbox and open the conversation window.
 *
 * A no-op until the Crisp script has booted — see CrispChat. If the website id
 * is unset the widget never loads and this does nothing, which is the intended
 * behaviour in local dev.
 */
export function openLiveHelp() {
  if (typeof window === "undefined" || !window.$crisp) return;
  window.$crisp.push(["do", "chat:show"]);
  window.$crisp.push(["do", "chat:open"]);
}
