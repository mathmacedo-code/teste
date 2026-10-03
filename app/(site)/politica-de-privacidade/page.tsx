import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Política de privacidade",
  description: "Como o Vila Medí trata os dados enviados pelos formulários de reserva e eventos.",
  path: "/politica-de-privacidade",
});

// ⚠️ Texto-base — revisar com o jurídico do cliente antes de publicar.
export default function Privacidade() {
  return (
    <section className="bg-cal pt-[140px] pb-32">
      <div className="shell max-w-3xl">
        <h1 className="display-l">Política de privacidade.</h1>
        <div className="mt-12 space-y-6 text-[1.05rem] leading-relaxed opacity-90">
          <p>
            Os dados enviados nos formulários de reserva e de eventos (nome, WhatsApp, e-mail, data e detalhes do pedido) são usados
            exclusivamente para responder à sua solicitação e organizar a sua visita ao {site.name}.
          </p>
          <p>
            Utilizamos ferramentas de medição (como Google Analytics e Meta Pixel) para entender como o site é usado e melhorar a comunicação.
            Você pode desativar cookies no seu navegador.
          </p>
          <p>
            Em conformidade com a LGPD, você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento pelo e-mail{" "}
            <a className="link-u" href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
        </div>
      </div>
    </section>
  );
}
