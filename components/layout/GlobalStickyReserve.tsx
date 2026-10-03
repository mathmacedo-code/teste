"use client";

import { usePathname } from "next/navigation";
import { StickyReserve } from "./StickyReserve";

const HOUSE_PAGES = ["/temperani-amalfi", "/miimar", "/cru-oyster-bar"];

/** Barra de reserva mobile; nas páginas das casas, a própria página renderiza a versão com nome da casa. */
export function GlobalStickyReserve() {
  const pathname = usePathname();
  if (HOUSE_PAGES.includes(pathname)) return null;
  return <StickyReserve />;
}
