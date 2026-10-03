import type { ImageKey, VideoKey } from "./media";

/**
 * Landing pages de mídia paga — /lp/[slug]
 * Para criar uma nova campanha, basta adicionar um objeto aqui.
 * As LPs são noindex e têm navegação mínima (foco em conversão).
 */
export type Landing = {
  slug: string;
  meta: { title: string; description: string };
  hero: { video: VideoKey; image: ImageKey; headline: string; sub: string };
  form: "reserva" | "evento";
  house?: string;
  cta: string;
  benefits: { title: string; text: string }[];
  dishes: string[];
  gallery: [ImageKey, ImageKey, ImageKey];
};

export const landings: Landing[] = [
  {
    slug: "jantar",
    meta: { title: "Jantar no Vila Medí | Reserve sua mesa", description: "Um jantar mediterrâneo no Shopping Cidade Jardim. Três cozinhas, bar de coquetelaria e um salão feito para a noite." },
    hero: { video: "noite", image: "mesa-palha", headline: "Hoje o jantar é no Mediterrâneo.", sub: "Três cozinhas, luz baixa e coquetéis no bar central. No 3º piso do Shopping Cidade Jardim." },
    form: "reserva",
    cta: "Reservar meu jantar",
    benefits: [
      { title: "Três cozinhas, uma conta", text: "Massa do Temperani, polvo do MII Mar e ostras do Cru na mesma mesa." },
      { title: "Para a noite toda", text: "Do primeiro drink à sobremesa, sem precisar trocar de lugar." },
      { title: "Fácil de chegar", text: "Estacionamento e valet do shopping, acesso direto ao 3º piso." },
    ],
    dishes: ["ostra-grelhada", "ravioli", "couscous"],
    gallery: ["luminarias", "negroni", "salao"],
  },
  {
    slug: "almoco",
    meta: { title: "Almoço no Vila Medí | Cidade Jardim", description: "Almoço mediterrâneo no Shopping Cidade Jardim: massas frescas, mezze, frutos do mar e luz natural." },
    hero: { video: "forno", image: "prato-labneh", headline: "Um almoço que parece férias.", sub: "Massa fresca, mezze para dividir e luz natural, a poucos minutos da Marginal." },
    form: "reserva",
    cta: "Reservar meu almoço",
    benefits: [
      { title: "Para negócios ou família", text: "Mesas reservadas e um serviço que respeita o seu tempo." },
      { title: "Tudo feito na casa", text: "Pão do forno a lenha e massa aberta à mão todos os dias." },
      { title: "No caminho", text: "No 3º piso do Shopping Cidade Jardim, com valet." },
    ],
    dishes: ["labneh", "ravioli", "pavlova"],
    gallery: ["massa-rolo", "prato-polvo", "adega"],
  },
  {
    slug: "eventos",
    meta: { title: "Eventos no Vila Medí | Solicite uma proposta", description: "Aniversários, eventos corporativos e celebrações no Shopping Cidade Jardim, com menus das três cozinhas." },
    hero: { video: "heroMobile", image: "mesa-longa", headline: "Celebre no Vila Medí.", sub: "Aniversários, confraternizações e eventos de marca com menus das três cozinhas e bar central." },
    form: "evento",
    cta: "Quero realizar meu evento no Vila Medí",
    benefits: [
      { title: "Do íntimo ao grandioso", text: "Mesas longas, salão principal ou a casa inteira." },
      { title: "Menu sob medida", text: "Combine Itália, Grécia e mar em um só cardápio." },
      { title: "Equipe dedicada", text: "Um ponto de contato do primeiro e-mail ao último brinde." },
    ],
    dishes: ["ostra-grelhada", "couscous", "pavlova"],
    gallery: ["mesa-longa", "bartender", "celebracao"],
  },
  {
    slug: "temperani",
    meta: { title: "Temperani Amalfi | Reserve no Cidade Jardim", description: "Cucina italiana inspirada pela Costa Amalfitana: massas frescas e pizzas de forno a lenha." },
    hero: { video: "forno", image: "massa-rolo", headline: "A Costa Amalfitana está no Cidade Jardim.", sub: "Massa fresca, forno a lenha e vinhos italianos no Temperani Amalfi." },
    form: "reserva",
    house: "Temperani Amalfi",
    cta: "Reservar no Temperani",
    benefits: [
      { title: "Massa aberta à mão", text: "Gnocchi, pappardelle e ravioli feitos todos os dias." },
      { title: "Forno a lenha", text: "Pizzas e pães assados diante do salão." },
      { title: "Carta de vinhos", text: "Rótulos italianos escolhidos para cada prato." },
    ],
    dishes: ["ravioli", "cordeiro", "chocolate"],
    gallery: ["forno", "adega", "mesa-palha"],
  },
  {
    slug: "miimar",
    meta: { title: "MII Mar | Cozinha grega no Cidade Jardim", description: "Polvo na brasa, mezze e frutos do mar em uma taberna grega reinventada." },
    hero: { video: "miimar", image: "prato-polvo", headline: "O Mar Egeu, servido em São Paulo.", sub: "Mezze, polvo na brasa e frutos do mar no MII Mar." },
    form: "reserva",
    house: "MII Mar",
    cta: "Reservar no MII Mar",
    benefits: [
      { title: "Para dividir", text: "Mezze que passam de mão em mão." },
      { title: "Na brasa", text: "Polvo e peixes da grelha, com azeite e limão." },
      { title: "Louça pintada à mão", text: "O azul e branco das ilhas gregas à mesa." },
    ],
    dishes: ["couscous", "labneh", "kibbeh"],
    gallery: ["grelha", "frutos-do-mar", "salao"],
  },
  {
    slug: "cru",
    meta: { title: "Cru Oyster Bar | Ostras e coquetéis em São Paulo", description: "Ostras, crudos e coquetelaria autoral no Shopping Cidade Jardim." },
    hero: { video: "cru", image: "ostras", headline: "Ostras, crudos e um bom drink.", sub: "O oyster bar do Vila Medí, no Shopping Cidade Jardim." },
    form: "reserva",
    house: "Cru Oyster Bar",
    cta: "Reservar no Cru",
    benefits: [
      { title: "Frescor no balcão", text: "Ostras abertas na hora e crudos cortados à vista." },
      { title: "Coquetelaria autoral", text: "Drinks do bar central, clássicos e criações da casa." },
      { title: "A noite começa aqui", text: "Música e o melhor lugar para ver o salão." },
    ],
    dishes: ["ostra-grelhada", "frutos-grelhados", "lobster"],
    gallery: ["drink", "negroni", "dj"],
  },
];

export const landingBySlug = (slug: string) => landings.find((l) => l.slug === slug);
