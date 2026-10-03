"use client";

import { getAttribution } from "@/lib/utm";

export type LeadType = "reserva" | "evento";

/** Envia o lead para /api/leads (que repassa ao CRM via webhook). */
export async function submitLead(type: LeadType, form: HTMLFormElement) {
  const data = Object.fromEntries(new FormData(form).entries());
  const res = await fetch("/api/leads", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ type, ...data, page: window.location.pathname, attribution: getAttribution() }),
  });
  if (!res.ok) throw new Error(`lead ${res.status}`);
  return data;
}
