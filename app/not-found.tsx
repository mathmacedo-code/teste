import Link from "next/link";
import { Emblem } from "@/components/brand/Logo";

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-start justify-center bg-cal">
      <div className="shell">
        <Emblem className="w-12 text-azul" />
        <h1 className="display-l mt-10 max-w-[14ch]">Esta página não está no mapa.</h1>
        <Link href="/" className="link-u mt-10 inline-flex text-[0.95rem] font-[450]">Voltar para o Vila Medí</Link>
      </div>
    </main>
  );
}
