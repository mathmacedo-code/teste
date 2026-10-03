"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Cta } from "@/components/ui/Cta";
import { EASE } from "@/components/ui/Motion";

/**
 * CTA fixo de reserva.
 * - Mobile: barra inferior em todas as páginas (exceto /reservas).
 * - Desktop: só nas páginas das casas ("CTA permanente"), como pílula no canto.
 * Aparece depois que o hero sai de cena.
 */
export function StickyReserve({ label = "Reservar mesa", href = "/reservas", desktop = false }: { label?: string; href?: string; desktop?: boolean }) {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.55);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/reservas") return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: EASE }}
          className={
            desktop
              ? "fixed right-4 bottom-[calc(env(safe-area-inset-bottom)+12px)] left-4 z-40 md:right-8 md:bottom-8 md:left-auto"
              : "fixed right-4 bottom-[calc(env(safe-area-inset-bottom)+12px)] left-4 z-40 md:hidden"
          }
        >
          <Cta href={href} variant="solid" event="reserve_click" location="sticky" className="w-full md:w-auto">
            {label}
          </Cta>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
