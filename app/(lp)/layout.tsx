import type { ReactNode } from "react";
import { SoundToggle } from "@/components/layout/SoundToggle";

export default function LpLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main id="conteudo">{children}</main>
      <SoundToggle />
    </>
  );
}
