import { ReservationForm } from "@/components/forms/ReservationForm";
import { Photo } from "@/components/ui/Photo";
import { HOUSES, site, whatsappLink } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Reservas | Vila Medí, Shopping Cidade Jardim",
  description: "Reserve sua mesa no Vila Medí: Temperani Amalfi, MII Mar ou Cru Oyster Bar, no 3º piso do Shopping Cidade Jardim.",
  path: "/reservas",
  absoluteTitle: true,
});

export default async function ReservasPage({ searchParams }: { searchParams: Promise<{ casa?: string }> }) {
  const { casa } = await searchParams;
  const defaultHouse = HOUSES.find((h) => h === casa);

  return (
    <section className="bg-cal pt-[76px]">
      <div className="grid lg:min-h-[calc(100svh-76px)] lg:grid-cols-2">
        <div className="relative hidden lg:block">
          <div className="sticky top-[76px] h-[calc(100svh-76px)]">
            <Photo k="mesa-palha" alt="Mesa posta sob luminária de palha no Vila Medí" sizes="50vw" priority className="object-[50%_40%]" />
          </div>
        </div>
        <div className="shell py-16 md:py-24 lg:px-[clamp(2rem,5vw,6rem)]">
          <h1 className="display-l">Reserve sua mesa.</h1>
          <p className="lede mt-6 max-w-[40ch] opacity-85">
            Escolha a casa, o dia e o horário. Confirmamos pelo WhatsApp.
          </p>
          <div className="mt-14">
            <ReservationForm defaultHouse={defaultHouse} />
          </div>
          <dl className="mt-20 grid gap-8 border-t border-grafite/15 pt-10 text-[0.98rem] sm:grid-cols-2">
            <div>
              <dt className="meta opacity-60">Onde</dt>
              <dd className="mt-2">
                {site.address.venue}, {site.address.floor}
                <br />
                {site.address.street}
              </dd>
            </div>
            <div>
              <dt className="meta opacity-60">Prefere falar com a gente?</dt>
              <dd className="mt-2">
                <a className="link-u" href={whatsappLink("Olá! Gostaria de reservar uma mesa no Vila Medí.")} target="_blank" rel="noopener noreferrer">
                  Reservar pelo WhatsApp
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
