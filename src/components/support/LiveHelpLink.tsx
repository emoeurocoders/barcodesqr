"use client";

import { MessageCircle } from "lucide-react";
import { openLiveHelp } from "./crisp";

/**
 * Footer "Live Help" trigger. Renders like the other footer links but opens the
 * Crisp chatbox instead of navigating — the mockup's `href="#"` was always a
 * placeholder for this action.
 */
export function LiveHelpLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={openLiveHelp}
      className={`cursor-pointer ${className ?? ""}`}
    >
      Live Help
      <MessageCircle className="h-4 w-4 text-primary" />
    </button>
  );
}
