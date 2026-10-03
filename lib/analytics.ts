"use client";

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    fbq?: (...args: unknown[]) => void;
  }
}

/** Eventos padronizados do site — o nome vai para o dataLayer (GTM / GA4). */
export type TrackEvent =
  | "reserve_click"
  | "event_click"
  | "menu_open"
  | "directions_click"
  | "whatsapp_click"
  | "reservation_submit"
  | "event_lead_submit";

/** Mapeamento para eventos padrão do Meta Pixel. */
const META_MAP: Partial<Record<TrackEvent, string>> = {
  reservation_submit: "Schedule",
  event_lead_submit: "Lead",
  reserve_click: "InitiateCheckout",
  directions_click: "FindLocation",
  whatsapp_click: "Contact",
};

export function track(event: TrackEvent, params: Params = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
  const metaEvent = META_MAP[event];
  if (metaEvent && typeof window.fbq === "function") {
    window.fbq("track", metaEvent, params);
  }
}
