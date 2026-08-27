import Script from "next/script";
import { CRISP_WEBSITE_ID } from "./crisp";

/**
 * Boots the Crisp chat widget for every route.
 *
 * The default launcher bubble is kept hidden: the only way into a chat is the
 * footer "Live Help" link (see LiveHelpLink), which calls `openLiveHelp()`.
 * When Crisp closes the conversation we re-hide it so the bubble never
 * reappears.
 *
 * Rendered as an inline `next/script` with `lazyOnload` — the strategy the
 * Next.js guide recommends for chat-support plugins. Renders nothing when
 * NEXT_PUBLIC_CRISP_WEBSITE_ID is unset, so local dev stays quiet.
 */
export function CrispChat() {
  if (!CRISP_WEBSITE_ID) return null;

  return (
    <Script id="crisp-widget" strategy="lazyOnload">
      {`
        window.$crisp = [];
        window.CRISP_WEBSITE_ID = ${JSON.stringify(CRISP_WEBSITE_ID)};
        window.$crisp.push(["config", "color:theme", ["black"]]);
        window.$crisp.push(["do", "chat:hide"]);
        window.$crisp.push(["on", "chat:closed", function () {
          window.$crisp.push(["do", "chat:hide"]);
        }]);
        (function () {
          var s = document.createElement("script");
          s.src = "https://client.crisp.chat/l.js";
          s.async = 1;
          document.getElementsByTagName("head")[0].appendChild(s);
        })();
      `}
    </Script>
  );
}
