"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Cta } from "@/components/ui/Cta";
import { EASE } from "@/components/ui/Motion";

/**
 * CTA fixo de reserva.
 * - Mobile: pílula compacta no rodapé da tela, em todas as páginas (exceto /reservas).
 * - Some quando o rodapé ou um formulário aparece.
 * - Desktop: só nas páginas das casas ("CTA permanente"), como pílula no canto.
 * Aparece depois que o hero sai de cena.
 */
export function StickyReserve({ label = "Reservar mesa", href = "/reservas", desktop = false }: { label?: string; href?: string; desktop?: boolean }) {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // some quando o rodapé ou um formulário está na tela: não cobre conteúdo nem duplica o botão
    const inView = new Set<Element>();
    const onScroll = () => setShow(inView.size === 0 && window.scrollY > window.innerHeight * 0.55);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? inView.add(e.target) : inView.delete(e.target)));
      onScroll();
    });
    document.querySelectorAll("footer, form").forEach((t) => io.observe(t));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

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
              ? "pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+14px)] z-40 flex justify-center md:inset-x-auto md:right-8 md:bottom-8"
              : "pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+14px)] z-40 flex justify-center md:hidden"
          }
        >
          {/* pílula compacta: chama a reserva sem cobrir a página */}
          <Cta
            href={href}
            variant="solid"
            event="reserve_click"
            location="sticky"
            className="pointer-events-auto !px-6 !py-3 text-[0.9rem] shadow-[0_10px_30px_-8px_rgb(17_48_94/0.55)]"
          >
            {label}
          </Cta>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
