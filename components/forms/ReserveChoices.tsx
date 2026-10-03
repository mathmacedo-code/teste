"use client";

import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { HOUSES, site, whatsappLink } from "@/data/site";

/**
 * Reserva sem formulário: cada casa é um botão que abre o WhatsApp com a
 * mensagem pronta (ou a plataforma de reservas, se `site.reservationProviderUrl` existir).
 */
export function ReserveChoices({
  houses = HOUSES,
  highlight,
  source,
  tone = "light",
}: {
  houses?: readonly string[];
  /** casa que vem primeiro e destacada (ex.: /reservas?casa=MII%20Mar) */
  highlight?: string;
  source: string;
  tone?: "light" | "dark";
}) {
  const list = highlight ? [highlight, ...houses.filter((h) => h !== highlight)] : [...houses];
  const href = (h: string) =>
    site.reservationProviderUrl ||
    whatsappLink(h.startsWith("Vila Medí") ? "Olá! Gostaria de reservar uma mesa no Vila Medí." : `Olá! Gostaria de reservar uma mesa no ${h}, no Vila Medí.`);

  return (
    <ul className={cn("border-t", tone === "dark" ? "border-perola/15" : "border-grafite/15")}>
      {list.map((h, i) => (
        <li key={h}>
          <a
            href={href(h)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_click", { location: `${source}:${h}` })}
            className={cn(
              "group flex items-center justify-between gap-6 border-b py-6 transition-colors duration-500",
              tone === "dark" ? "border-perola/15" : "border-grafite/15",
            )}
          >
            <span>
              <span className={cn("font-serif font-light", i === 0 && highlight ? "text-[clamp(1.9rem,3vw,2.6rem)]" : "text-[clamp(1.5rem,2.4vw,2rem)]")}>
                {h.replace(" (qualquer casa)", "")}
              </span>
              {h.includes("qualquer casa") && <span className="meta mt-1 block opacity-60">qualquer uma das três casas</span>}
            </span>
            <span
              className={cn(
                "flex shrink-0 items-center gap-3 rounded-full px-5 py-3 text-[0.9rem] transition-colors duration-500",
                tone === "dark" ? "bg-perola text-noite group-hover:bg-white" : "bg-azul text-cal group-hover:bg-azul-claro",
              )}
            >
              Reservar
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <path d="M4 12h16M14 6l6 6-6 6" />
              </svg>
            </span>
          </a>
        </li>
      ))}
      <li className="pt-5 text-[0.9rem] opacity-65">
        {site.reservationProviderUrl ? "Reserva online, com confirmação imediata." : "Você fala direto com a nossa equipe pelo WhatsApp e recebe a confirmação por lá."}
      </li>
    </ul>
  );
}
