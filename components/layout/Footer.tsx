import Link from "next/link";
import { Emblem, Wordmark } from "@/components/brand/Logo";
import { restaurantList } from "@/data/restaurants";
import { site, whatsappLink } from "@/data/site";
import { Meander } from "@/components/ui/Motifs";

export function Footer() {
  return (
    <footer className="relative bg-noite pt-24 pb-[calc(env(safe-area-inset-bottom)+6rem)] text-perola md:pb-14">
      <Meander className="absolute inset-x-0 top-0 text-perola opacity-20" />
      <div className="shell">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <Link href="/" aria-label="Vila Medí, página inicial" className="inline-flex flex-col items-start gap-5">
              <Emblem className="w-14" />
              <Wordmark className="w-40" />
            </Link>
            <address className="mt-8 text-[0.95rem] leading-relaxed not-italic opacity-75">
              {site.address.street}, {site.address.floor}
              <br />
              {site.address.venue}, {site.address.city} - {site.address.state}
            </address>
          </div>

          <nav aria-label="As casas" className="md:col-span-3 md:col-start-6">
            <ul className="space-y-2">
              {restaurantList.map((r) => (
                <li key={r.slug}>
                  <Link href={r.path} className="font-serif text-[1.35rem] font-light transition-opacity hover:opacity-70">
                    {r.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Atalhos" className="md:col-span-2">
            <ul className="space-y-2.5 text-[0.95rem]">
              <li><Link className="opacity-80 hover:opacity-100" href="/reservas">Reservas</Link></li>
              <li><Link className="opacity-80 hover:opacity-100" href="/eventos">Eventos</Link></li>
              <li><a className="opacity-80 hover:opacity-100" href={whatsappLink("Olá! Vim pelo site do Vila Medí.")} target="_blank" rel="noopener noreferrer">Contato</a></li>
              <li><a className="opacity-80 hover:opacity-100" href={site.instagram.url} target="_blank" rel="noopener noreferrer">Instagram</a></li>
            </ul>
          </nav>

          <div className="text-[0.95rem] md:col-span-2">
            <ul className="space-y-2.5 opacity-80">
              {site.hours.map((h) => (
                <li key={h.days}>
                  {h.days}
                  <br />
                  <span className="opacity-70">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="meta mt-20 flex flex-col gap-3 opacity-55 md:flex-row md:justify-between">
          <span>© {new Date().getFullYear()} Vila Medí. Restaurante mediterrâneo no Shopping Cidade Jardim, São Paulo.</span>
          <Link href="/politica-de-privacidade" className="hover:opacity-100">Política de privacidade</Link>
        </div>
      </div>
    </footer>
  );
}
