import type { ReactNode } from "react";

export default function LpLayout({ children }: { children: ReactNode }) {
  return <main id="conteudo">{children}</main>;
}
