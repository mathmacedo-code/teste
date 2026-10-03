"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { MenuContent } from "@/components/menu/MenuContent";
import { EventForm } from "@/components/forms/EventForm";
import { Sheet } from "@/components/ui/Sheet";
import { ctaStyles } from "@/components/ui/Cta";
import { track } from "@/lib/analytics";

type Ctx = { openMenu: (house?: string) => void; openEvent: (source?: string) => void };
const OverlayCtx = createContext<Ctx>({ openMenu: () => {}, openEvent: () => {} });
export const useOverlays = () => useContext(OverlayCtx);

/** Cardápio e formulário de eventos acessíveis de qualquer ponto do site. */
export function OverlayProvider({ children }: { children: ReactNode }) {
  const [menuHouse, setMenuHouse] = useState<string | null>(null);
  const [eventSource, setEventSource] = useState<string | null>(null);

  const openMenu = useCallback((house = "temperani") => {
    track("menu_open", { house });
    setMenuHouse(house);
  }, []);
  const openEvent = useCallback((source = "home") => {
    track("event_click", { location: source });
    setEventSource(source);
  }, []);
  const closeMenu = useCallback(() => setMenuHouse(null), []);
  const closeEvent = useCallback(() => setEventSource(null), []);

  return (
    <OverlayCtx.Provider value={{ openMenu, openEvent }}>
      {children}
      <Sheet open={menuHouse !== null} onClose={closeMenu} label="Cardápio">
        <div className="shell pt-4 pb-28">
          <h2 className="display-l">Cardápio.</h2>
          <div className="mt-12">
            <MenuContent initial={menuHouse ?? "temperani"} />
          </div>
        </div>
      </Sheet>
      <Sheet open={eventSource !== null} onClose={closeEvent} label="Realizar meu evento" tone="oliva">
        <div className="shell grid gap-14 pt-4 pb-28 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="display-l">Realizar meu evento.</h2>
            <p className="lede mt-6 max-w-sm opacity-85">
              Conte a data, o número de convidados e a ocasião. Respondemos com espaços, menus e valores.
            </p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <EventForm source={eventSource ?? "home"} />
          </div>
        </div>
      </Sheet>
    </OverlayCtx.Provider>
  );
}

/** Botões que abrem os painéis (podem ser usados dentro de componentes de servidor). */
export function OpenMenuButton({ house, children, variant = "line" }: { house?: string; children: ReactNode; variant?: "line" | "solid" | "light" }) {
  const { openMenu } = useOverlays();
  return (
    <button type="button" onClick={() => openMenu(house)} className={`${ctaStyles[variant]} cursor-pointer`}>
      {children}
    </button>
  );
}

export function OpenEventButton({ source, children, variant = "light" }: { source?: string; children: ReactNode; variant?: "light" | "solid" | "line" }) {
  const { openEvent } = useOverlays();
  return (
    <button type="button" onClick={() => openEvent(source)} className={`${ctaStyles[variant]} cursor-pointer`}>
      {children}
    </button>
  );
}
