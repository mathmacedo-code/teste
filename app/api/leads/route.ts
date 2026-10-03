import { NextResponse } from "next/server";

/**
 * Recebe leads de reserva e de eventos.
 * Integração com CRM: defina LEAD_WEBHOOK_URL (e opcionalmente LEAD_WEBHOOK_TOKEN).
 * O payload enviado é estável e documentado no README.
 */
const str = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const digits = (v: unknown) => str(v, 40).replace(/\D/g, "");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // honeypot: robôs preenchem, pessoas não veem
  if (str(body.website)) return NextResponse.json({ ok: true });

  const type = body.type === "evento" ? "evento" : body.type === "reserva" ? "reserva" : null;
  const nome = str(body.nome, 120);
  const whatsapp = digits(body.whatsapp);
  if (!type || nome.length < 2 || whatsapp.length < 10) {
    return NextResponse.json({ ok: false, error: "invalid_fields" }, { status: 422 });
  }

  const lead = {
    type,
    receivedAt: new Date().toISOString(),
    nome,
    whatsapp: `+55${whatsapp}`,
    email: str(body.email, 160) || undefined,
    data: str(body.data, 20) || undefined,
    horario: str(body.horario, 10) || undefined,
    pessoas: Number(body.pessoas) || undefined,
    casa: str(body.casa, 60) || undefined,
    convidados: Number(body.convidados) || undefined,
    tipo: str(body.tipo, 80) || undefined,
    mensagem: str(body.mensagem, 2000) || str(body.observacoes, 2000) || undefined,
    page: str(body.page, 200),
    attribution: typeof body.attribution === "object" && body.attribution ? body.attribution : {},
  };

  const url = process.env.LEAD_WEBHOOK_URL;
  if (url) {
    const token = process.env.LEAD_WEBHOOK_TOKEN;
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(lead),
    }).catch(() => null);
    if (!res || !res.ok) return NextResponse.json({ ok: false, error: "crm_unavailable" }, { status: 502 });
  } else {
    console.info("[lead]", JSON.stringify(lead));
  }

  return NextResponse.json({ ok: true });
}
