"use client";

const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"] as const;
const STORAGE_KEY = "vm_attribution";

export type Attribution = Partial<Record<(typeof KEYS)[number] | "landing_page" | "referrer", string>>;

/** Guarda a origem da visita (primeiro toque da sessão) para anexar aos leads. */
export function captureAttribution() {
  try {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const url = new URL(window.location.href);
    const data: Attribution = { landing_page: url.pathname, referrer: document.referrer || undefined };
    KEYS.forEach((k) => {
      const v = url.searchParams.get(k);
      if (v) data[k] = v;
    });
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* storage indisponível — segue sem atribuição */
  }
}

export function getAttribution(): Attribution {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}
