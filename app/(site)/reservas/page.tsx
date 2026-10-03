import { ReserveChoices } from "@/components/forms/ReserveChoices";
import { AmbientVideo } from "@/components/ui/AmbientVideo";
import { video } from "@/data/media";
import { HOUSES, site } from "@/data/site";
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
          <div className="sticky top-[76px] h-[calc(100svh-76px)] bg-noite">
            <AmbientVideo source={video.noite} label="A noite no Vila Medí: bar, coquetéis e luminárias" />
          </div>
        </div>
        <div className="shell py-16 md:py-24 lg:px-[clamp(2rem,5vw,6rem)]">
          <h1 className="display-l">Reserve sua mesa.</h1>
          <p className="lede mt-6 max-w-[40ch] opacity-85">
            Escolha a casa e fale direto com a nossa equipe pelo WhatsApp: dia, horário e número de pessoas.
          </p>
          <div className="mt-14">
            <ReserveChoices highlight={defaultHouse} source="reservas" />
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
              <dt className="meta opacity-60">Horário</dt>
              <dd className="mt-2">
                {site.hours.map((h) => (
                  <span key={h.days} className="block">
                    {h.days}: {h.time}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
