import type { ImageKey, VideoKey } from "./media";

export type RestaurantSlug = "temperani" | "miimar" | "cru";
export type Theme = "cal" | "branco" | "noite";

export type Restaurant = {
  slug: RestaurantSlug;
  path: string;
  name: string;
  origin: string;
  line: string; // frase curta usada na home
  hoverLine: string; // texto que surge no hover da home
  cover: ImageKey;
  theme: Theme;
  cta: string;
  seo: { title: string; description: string; cuisine: string[] };
  hero: { video?: VideoKey; image: ImageKey; headline: string; sub: string };
  concept: { title: string; text: string[]; image: ImageKey; imageAlt: string };
  kitchen?: { title: string; text: string; image: ImageKey; imageAlt: string };
  signatureDishes: string[]; // ids em data/dishes.ts
  menuHighlights: { name: string; note: string }[];
  ambience: { title: string; text: string; images: [ImageKey, ImageKey] };
  feature: { title: string; text: string; image: ImageKey; imageAlt: string };
  gallery: ImageKey[];
  closing: string;
};

export const restaurants: Record<RestaurantSlug, Restaurant> = {
  temperani: {
    slug: "temperani",
    path: "/temperani-amalfi",
    name: "Temperani Amalfi",
    origin: "Itália",
    line: "Cucina italiana inspirada pela Costa Amalfitana.",
    hoverLine: "Massa fresca, forno a lenha e o azul da Campânia.",
    cover: "forno",
    theme: "cal",
    cta: "Reservar no Temperani",
    seo: {
      title: "Temperani Amalfi | Restaurante italiano no Cidade Jardim",
      description:
        "Cucina italiana inspirada pela Costa Amalfitana no Shopping Cidade Jardim: massas frescas, pizzas de forno a lenha, frutos do mar e carta de vinhos.",
      cuisine: ["Italiana", "Mediterrânea"],
    },
    hero: {
      video: "forno",
      image: "massa-rolo",
      headline: "Um pedaço da Costa Amalfitana em São Paulo.",
      sub: "Massa aberta à mão, forno a lenha e receitas que atravessaram a Campânia até o Cidade Jardim.",
    },
    concept: {
      title: "A Itália do sul, sem pressa.",
      text: [
        "O Temperani Amalfi nasce da cozinha de beira-mar: massas frescas, molhos de tomate cozidos devagar, limão, azeite e peixe do dia.",
        "Tudo pensado para uma mesa longa, compartilhada, que começa no almoço e às vezes termina no jantar.",
      ],
      image: "massa-maos",
      imageAlt: "Mãos sovando a massa sobre a bancada de granito",
    },
    kitchen: {
      title: "A brigada.",
      text: "Uma cozinha aberta ao forno e ao salão, onde a massa é sovada, aberta e assada diante de quem chega.",
      image: "equipe",
      imageAlt: "Equipe de cozinha do Vila Medí reunida no passe",
    },
    signatureDishes: ["ravioli", "cordeiro"],
    menuHighlights: [
      { name: "Gnocchi alla Sorrentina", note: "Fior di latte e molho de tomate fresco" },
      { name: "Pappardelle al ragù di ossobuco", note: "Massa larga e ragù cozido lentamente" },
      { name: "Cubos de lasanha", note: "Empanados e fritos, para dividir" },
      { name: "Pizzas de forno a lenha", note: "Massa de longa fermentação" },
    ],
    ambience: {
      title: "Luz baixa, palha e madeira.",
      text: "Mesas sob luminárias de palha, banquetas estofadas e o calor do forno ao fundo do salão.",
      images: ["mesa-palha", "luminarias"],
    },
    feature: {
      title: "Carta de vinhos.",
      text: "Uma adega à vista, com rótulos italianos e do Mediterrâneo escolhidos para acompanhar massa, peixe e brasa. Seleção de Ricardo Santinho.",
      image: "adega",
      imageAlt: "Parede de vinhos iluminada no Vila Medí",
    },
    gallery: ["padeiro", "forno", "adega", "mesa-palha", "prato-chocolate", "luminarias"],
    closing: "A mesa está posta na Costa Amalfitana.",
  },
  miimar: {
    slug: "miimar",
    path: "/miimar",
    name: "MII Mar",
    origin: "Grécia",
    line: "Sabores do Mediterrâneo em uma atmosfera única.",
    hoverLine: "Polvo na brasa, mezze e o branco das ilhas gregas.",
    cover: "prato-polvo",
    theme: "branco",
    cta: "Reservar no MII Mar",
    seo: {
      title: "MII Mar | Cozinha grega e mediterrânea no Cidade Jardim",
      description:
        "Releitura contemporânea das tabernas gregas no Shopping Cidade Jardim: polvo na brasa, mezze, couscous de frutos do mar e moussaka.",
      cuisine: ["Grega", "Mediterrânea"],
    },
    hero: {
      video: "miimar",
      image: "prato-polvo",
      headline: "Sol, sal e brasa do Mar Egeu.",
      sub: "Uma taberna grega reinventada para São Paulo, com mezze para dividir e frutos do mar na grelha.",
    },
    concept: {
      title: "Da taberna ao Cidade Jardim.",
      text: [
        "O MII Mar revisita a mesa grega e do Mediterrâneo oriental: azeite, limão, ervas, coalhada e o mar como protagonista.",
        "Pratos servidos em louça pintada à mão, pensados para passar de mão em mão.",
      ],
      image: "prato-tartare",
      imageAlt: "Kibbeh cru com hortelã e cebola em prato pintado à mão de azul e branco",
    },
    signatureDishes: ["couscous", "labneh"],
    menuHighlights: [
      { name: "Polvo grelhado", note: "Na brasa, com azeite e limão" },
      { name: "Moussaka", note: "O clássico grego, em camadas" },
      { name: "Roz a djej", note: "Arroz basmati, bombom de alcatra e crispy de frango" },
      { name: "Couscous aux fruits de mer", note: "Polvo, camarão, peixe do dia e tomate confit" },
    ],
    ambience: {
      title: "O branco das ilhas, à noite.",
      text: "Arcos, paredes caiadas, listras e azulejos em azul e branco. Um salão que lembra um terraço sobre o Egeu.",
      images: ["frutos-do-mar", "salao"],
    },
    feature: {
      title: "A grelha.",
      text: "Polvo, peixes e frutos do mar passam pela brasa antes de chegar à mesa, com o mínimo de interferência.",
      image: "grelha",
      imageAlt: "Frutos do mar na grelha",
    },
    gallery: ["janela", "prato-polvo", "grelha", "prato-labneh", "teto", "salao"],
    closing: "O Egeu fica no 3º piso.",
  },
  cru: {
    slug: "cru",
    path: "/cru-oyster-bar",
    name: "Cru Oyster Bar",
    origin: "Mar",
    line: "Mar, crudos, ostras e coquetelaria.",
    hoverLine: "Ostras, crudos e o balcão que vira noite.",
    cover: "ostras",
    theme: "noite",
    cta: "Reservar no Cru Oyster Bar",
    seo: {
      title: "Cru Oyster Bar | Oyster bar em São Paulo, no Cidade Jardim",
      description:
        "Oyster bar no Shopping Cidade Jardim: ostras frescas e grelhadas, crudos, tuna tartare, lobster na brasa e coquetelaria autoral.",
      cuisine: ["Frutos do mar", "Oyster bar"],
    },
    hero: {
      video: "cru",
      image: "ostras",
      headline: "Mar, crudos e a noite que começa no balcão.",
      sub: "Ostras, peixes crus e coquetéis autorais em um balcão feito para ficar mais um pouco.",
    },
    concept: {
      title: "O mar, do jeito mais direto.",
      text: [
        "No Cru, o frescor manda: ostras abertas na hora, crudos cortados no balcão e a brasa usada com precisão.",
        "Ao redor, o bar central dita o ritmo da noite.",
      ],
      image: "bartender",
      imageAlt: "Bartender montando um coquetel no balcão",
    },
    signatureDishes: ["ostra-grelhada", "frutos-grelhados", "lobster"],
    menuHighlights: [
      { name: "Ostras frescas", note: "Abertas na hora, com limão e mignonette" },
      { name: "Ostra grelhada", note: "Manteiga de missô e jerez" },
      { name: "Tuna tartare", note: "Mayo de kombu" },
      { name: "Lobster X.O.", note: "Na grelha, com creme de couve-flor defumado" },
    ],
    ambience: {
      title: "Quando a luz baixa.",
      text: "Coquetéis, música e conversa ao redor do balcão. O Cru é onde a noite do Vila Medí acontece.",
      images: ["dj", "escultura"],
    },
    feature: {
      title: "Coquetelaria.",
      text: "Drinks autorais e clássicos bem executados, assinados por Rafael Welbert no bar central da casa.",
      image: "negroni",
      imageAlt: "Negroni com casca de laranja sobre guardanapo do Vila Medí",
    },
    gallery: ["ostras", "drink", "negroni", "bar-convidado", "rose", "celebracao"],
    closing: "O balcão está à sua espera.",
  },
};

export const restaurantList = [restaurants.temperani, restaurants.miimar, restaurants.cru];
