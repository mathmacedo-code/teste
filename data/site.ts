/**
 * Dados institucionais do Vila Medí.
 * ⚠️ Campos marcados com CONFIRMAR são provisórios — validar com o cliente antes de publicar.
 */
export const site = {
  name: "Vila Medí",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://vilamedi.com.br", // CONFIRMAR domínio
  tagline: "O Mediterrâneo encontra São Paulo.",
  description:
    "Restaurante mediterrâneo no Shopping Cidade Jardim, em São Paulo. Temperani Amalfi, MII Mar e Cru Oyster Bar reunidos em um só endereço, com bar de coquetelaria e espaços para eventos.",
  instagram: { handle: "@vilamedicj", url: "https://www.instagram.com/vilamedicj/" },
  // CONFIRMAR: WhatsApp e telefone oficiais (somente dígitos no whatsapp)
  whatsapp: "5511900000000",
  phoneDisplay: "(11) 0000-0000",
  phone: "+55-11-0000-0000",
  email: "contato@vilamedi.com.br", // CONFIRMAR
  eventsEmail: "eventos@vilamedi.com.br", // CONFIRMAR
  // Se usarem plataforma de reservas (Tagme, GetIn, OpenTable...), coloque a URL aqui:
  // os botões "Reservar" continuam levando para /reservas, que mostra o link como opção.
  reservationProviderUrl: "",
  address: {
    venue: "Shopping Cidade Jardim",
    floor: "3º piso",
    street: "Av. Magalhães de Castro, 12000",
    district: "Cidade Jardim",
    city: "São Paulo",
    state: "SP",
    postalCode: "05676-120", // CONFIRMAR
    country: "BR",
  },
  geo: { lat: -23.6006, lng: -46.6982 }, // CONFIRMAR (aprox. Shopping Cidade Jardim)
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Vila+Med%C3%AD+Shopping+Cidade+Jardim+S%C3%A3o+Paulo",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=Shopping%20Cidade%20Jardim%2C%20Av.%20Magalh%C3%A3es%20de%20Castro%2C%2012000%2C%20S%C3%A3o%20Paulo&z=16&output=embed",
  // CONFIRMAR horários exatos (imprensa: abre ao meio-dia; sex e sáb até 0h; domingo fecha mais cedo)
  hours: [
    { days: "Segunda a quinta", time: "12h às 23h", schema: { days: ["Monday", "Tuesday", "Wednesday", "Thursday"], opens: "12:00", closes: "23:00" } },
    { days: "Sexta e sábado", time: "12h à 0h", schema: { days: ["Friday", "Saturday"], opens: "12:00", closes: "23:59" } },
    { days: "Domingo", time: "12h às 22h", schema: { days: ["Sunday"], opens: "12:00", closes: "22:00" } },
  ],
  parking: "Estacionamento e valet do Shopping Cidade Jardim, com acesso direto aos pisos de restaurantes.",
  press: {
    award: { outlet: "Veja São Paulo", title: "Comer & Beber 2025/2026", detail: "Finalista na categoria Estreia do Ano" },
  },
} as const;

export const addressLine = `${site.address.street}, ${site.address.floor}, ${site.address.venue}`;

export const nav = [
  { label: "Vila Medí", href: "/#vila-medi" },
  { label: "Experiências", href: "/#experiencias" },
  { label: "Gastronomia", href: "/gastronomia" },
  { label: "Eventos", href: "/eventos" },
  { label: "Localização", href: "/#localizacao" },
] as const;

export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Opções de casa no formulário de reserva (também aceitas em /reservas?casa=...). */
export const HOUSES = ["Vila Medí (qualquer casa)", "Temperani Amalfi", "MII Mar", "Cru Oyster Bar"];
