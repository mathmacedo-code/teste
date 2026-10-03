import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { GlobalStickyReserve } from "@/components/layout/GlobalStickyReserve";
import { Header } from "@/components/layout/Header";
import { SoundToggle } from "@/components/layout/SoundToggle";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[90] focus:bg-cal focus:px-4 focus:py-2">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">{children}</main>
      <Footer />
      <GlobalStickyReserve />
      <SoundToggle />
    </>
  );
}
