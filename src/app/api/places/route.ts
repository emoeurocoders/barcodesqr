import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { env } from "@/lib/env";

/**
 * Proxy for Google Places API (New), behind the Maps type's address search.
 *
 * Proxied so the key stays on the server; restricted to what the picker
 * needs, so this cannot be used as a general Places endpoint:
 *
 * - `autocomplete`: 3–120 characters in, at most five suggestions out, with
 *   only the place id and its two display lines requested (field mask).
 * - `details`: one place id in, its id and formatted address out — the
 *   Essentials tier, the cheapest Place Details there is.
 *
 * Both carry the browser's session token. Google bills a session — however
 * many keystrokes, ended by one Details call — as that single Details call,
 * so the picker makes one token per search and drops it on pick.
 *
 * Open to signed-out visitors, like the creator itself. The client debounces
 * and waits for three characters; the hard cap on spend is the per-day quota
 * on the key in Google Cloud (see .env.example), not anything here.
 */

const BASE = "https://places.googleapis.com/v1";
const TOKEN = /^[A-Za-z0-9-]{8,64}$/;
const PLACE_ID = /^[A-Za-z0-9_-]{10,300}$/;

type Suggestion = { placeId: string; name: string; address: string };

export async function POST(request: NextRequest) {
  if (!env.placesConfigured) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  let body: { action?: unknown; input?: unknown; placeId?: unknown; sessionToken?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const sessionToken = typeof body.sessionToken === "string" && TOKEN.test(body.sessionToken) ? body.sessionToken : null;
  if (!sessionToken) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const headers = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": env.GOOGLE_PLACES_API_KEY,
  };

  if (body.action === "autocomplete") {
    const input = typeof body.input === "string" ? body.input.trim() : "";
    if (input.length < 3 || input.length > 120) {
      return NextResponse.json({ suggestions: [] });
    }
    const res = await fetch(`${BASE}/places:autocomplete`, {
      method: "POST",
      headers: {
        ...headers,
        "X-Goog-FieldMask":
          "suggestions.placePrediction.placeId,suggestions.placePrediction.structuredFormat",
      },
      body: JSON.stringify({ input, sessionToken }),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("[places] autocomplete", res.status, (await res.text()).slice(0, 300));
      return NextResponse.json({ error: "upstream" }, { status: 502 });
    }
    const data = (await res.json()) as {
      suggestions?: {
        placePrediction?: {
          placeId?: string;
          structuredFormat?: { mainText?: { text?: string }; secondaryText?: { text?: string } };
        };
      }[];
    };
    const suggestions: Suggestion[] = (data.suggestions ?? [])
      .map((s) => s.placePrediction)
      .filter((p): p is NonNullable<typeof p> => !!p?.placeId)
      .slice(0, 5)
      .map((p) => ({
        placeId: p.placeId!,
        name: p.structuredFormat?.mainText?.text ?? "",
        address: p.structuredFormat?.secondaryText?.text ?? "",
      }));
    return NextResponse.json({ suggestions });
  }

  if (body.action === "details") {
    const placeId = typeof body.placeId === "string" && PLACE_ID.test(body.placeId) ? body.placeId : null;
    if (!placeId) return NextResponse.json({ error: "bad_request" }, { status: 400 });
    const res = await fetch(
      `${BASE}/places/${encodeURIComponent(placeId)}?sessionToken=${encodeURIComponent(sessionToken)}`,
      { headers: { ...headers, "X-Goog-FieldMask": "id,formattedAddress" }, cache: "no-store" },
    );
    if (!res.ok) {
      console.error("[places] details", res.status, (await res.text()).slice(0, 300));
      return NextResponse.json({ error: "upstream" }, { status: 502 });
    }
    const data = (await res.json()) as { id?: string; formattedAddress?: string };
    return NextResponse.json({ placeId: data.id ?? placeId, address: data.formattedAddress ?? "" });
  }

  return NextResponse.json({ error: "bad_request" }, { status: 400 });
}
