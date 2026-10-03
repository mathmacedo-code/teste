"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import { EASE } from "./Motion";

type Tone = "cal" | "oliva" | "noite";
const tones: Record<Tone, string> = {
  cal: "bg-cal text-grafite",
  oliva: "bg-oliva-fundo text-perola",
  noite: "bg-noite text-perola",
};

/** Painel em tela cheia (cardápio, formulário de eventos). Esc fecha; o foco vai para "Fechar". */
export function Sheet({
  open, onClose, label, tone = "cal", children,
}: { open: boolean; onClose: () => void; label: string; tone?: Tone; children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement as HTMLElement;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => closeRef.current?.focus(), 60);
    return () => {
      html.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
      lastFocus.current?.focus?.();
    };
  }, [open, onClose]);

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="sheet"
          role="dialog"
          aria-modal="true"
          aria-label={label}
          className={cn("fixed inset-0 z-[80] overflow-y-auto overscroll-contain", tones[tone])}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.75, ease: EASE }}
        >
          <div className="shell sticky top-0 z-10 flex h-[76px] items-center justify-end">
            <button ref={closeRef} onClick={onClose} className="link-u cursor-pointer text-[0.95rem] font-[450]">
              Fechar
            </button>
          </div>
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
