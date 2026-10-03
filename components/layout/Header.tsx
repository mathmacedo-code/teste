"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Emblem, Wordmark } from "@/components/brand/Logo";
import { Cta } from "@/components/ui/Cta";
import { EASE } from "@/components/ui/Motion";
import { nav, site } from "@/data/site";
import { restaurantList } from "@/data/restaurants";
import { cn } from "@/lib/cn";

/** Páginas que começam com mídia escura em tela cheia: menu transparente sobre ela. */
const OVERLAY = ["/", "/temperani-amalfi", "/miimar", "/cru-oyster-bar", "/eventos", "/gastronomia"];
const DARK = ["/cru-oyster-bar"];

export function Header() {
  const pathname = usePathname();
  const overlay = OVERLAY.includes(pathname);
  const dark = DARK.includes(pathname);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.72);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const solid = !overlay || scrolled;
  const onDark = !solid || dark;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,color,backdrop-filter] duration-700 ease-[var(--ease-lux)]",
          solid ? (dark ? "bg-noite/88 text-perola backdrop-blur-md" : "bg-cal/90 text-grafite backdrop-blur-md") : "text-perola",
        )}
      >
        {!solid && <div aria-hidden className="scrim-top pointer-events-none absolute inset-x-0 top-0 -z-10 h-36" />}
        <div className="shell flex h-[76px] items-center justify-between">
          <Link href="/" aria-label="Vila Medí, página inicial" className="flex items-center gap-3">
            <Emblem className="w-[26px]" />
            <Wordmark className="w-[104px]" />
          </Link>

          <nav aria-label="Principal" className="hidden items-center gap-9 lg:flex">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="text-[0.92rem] font-[420] tracking-[0.01em] opacity-90 transition-opacity hover:opacity-100">
                {item.label}
              </Link>
            ))}
            <Cta href="/reservas" variant={onDark ? "light" : "solid"} event="reserve_click" location="header" className="!px-6 !py-2.5">
              Reservar
            </Cta>
          </nav>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="link-u cursor-pointer text-[0.95rem] font-[450] lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
          >
            Menu
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-noite text-perola lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="shell flex h-[76px] shrink-0 items-center justify-between">
              <Emblem className="w-[26px]" />
              <button type="button" onClick={() => setOpen(false)} className="link-u cursor-pointer text-[0.95rem] font-[450]">
                Fechar
              </button>
            </div>
            <nav aria-label="Menu mobile" className="shell flex flex-1 flex-col justify-center gap-1 py-10">
              {nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.08 + i * 0.05, ease: EASE }}
                >
                  <Link href={item.href} onClick={() => setOpen(false)} className="display-m block py-1.5">
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-10 flex flex-col gap-2">
                {restaurantList.map((r) => (
                  <Link key={r.slug} href={r.path} onClick={() => setOpen(false)} className="font-serif text-[1.25rem] italic opacity-75">
                    {r.name}
                  </Link>
                ))}
              </div>
            </nav>
            <div className="shell pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
              <Cta href="/reservas" variant="light" event="reserve_click" location="menu_mobile" className="w-full">
                Reservar mesa
              </Cta>
              <p className="meta mt-5 opacity-60">
                {site.address.venue}, {site.address.floor}. {site.address.city}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
