import type { ImageKey } from "./media";

/**
 * Pratos em destaque.
 * Nomes com (imprensa) aparecem em matérias sobre a casa.
 * Os demais foram nomeados a partir das imagens — CONFIRMAR com a cozinha.
 */
export type Dish = {
  id: string;
  name: string;
  description: string;
  house: string;
  image: ImageKey;
  alt: string;
};

export const dishes: Record<string, Dish> = {
  "ostra-grelhada": {
    id: "ostra-grelhada",
    name: "Ostra grelhada", // (imprensa)
    description: "Na brasa, com manteiga de missô e jerez. Servida sobre sal grosso.",
    house: "Cru Oyster Bar",
    image: "ostras",
    alt: "Três ostras grelhadas sobre sal grosso",
  },
  couscous: {
    id: "couscous",
    name: "Couscous aux fruits de mer", // (imprensa)
    description: "Polvo, camarão, peixe do dia e tomate confit.",
    house: "MII Mar",
    image: "prato-polvo",
    alt: "Couscous com polvo e frutos do mar em bowl azul",
  },
  ravioli: {
    id: "ravioli",
    name: "Ravioli all'olio verde", // CONFIRMAR
    description: "Massa fresca feita na casa, recheio cremoso e azeite de ervas.",
    house: "Temperani Amalfi",
    image: "prato-ravioli",
    alt: "Ravioli de massa fresca com azeite verde",
  },
  pavlova: {
    id: "pavlova",
    name: "Pavlova", // CONFIRMAR
    description: "Merengue crocante, creme leve e frutas vermelhas.",
    house: "Sobremesas da casa",
    image: "prato-pavlova",
    alt: "Pavlova com frutas vermelhas e calda",
  },
  labneh: {
    id: "labneh",
    name: "Labneh", // CONFIRMAR
    description: "Coalhada seca, azeite, endro e azeitona. Para começar e dividir.",
    house: "MII Mar",
    image: "prato-labneh",
    alt: "Labneh com azeite, endro e azeitona",
  },
  kibbeh: {
    id: "kibbeh",
    name: "Kibbeh cru", // CONFIRMAR
    description: "Cortado na faca, com cebola, hortelã e azeite.",
    house: "MII Mar",
    image: "prato-tartare",
    alt: "Kibbeh cru em prato pintado de azul e branco",
  },
  cordeiro: {
    id: "cordeiro",
    name: "Cordeiro de cozimento lento", // CONFIRMAR
    description: "Horas no forno até soltar do osso. Molho do próprio assado.",
    house: "Temperani Amalfi",
    image: "prato-cordeiro",
    alt: "Pernil de cordeiro assado com molho escuro",
  },
  chocolate: {
    id: "chocolate",
    name: "Torta de chocolate e pistache", // CONFIRMAR
    description: "Chocolate amargo e pistache tostado por cima.",
    house: "Sobremesas da casa",
    image: "prato-chocolate",
    alt: "Fatia de torta de chocolate coberta de pistache",
  },
  "frutos-grelhados": {
    id: "frutos-grelhados",
    name: "Frutos do mar na brasa", // CONFIRMAR
    description: "Da grelha direto para a mesa, sobre folhas, azeite e limão.",
    house: "Cru Oyster Bar",
    image: "frutos-do-mar",
    alt: "Frutos do mar grelhados servidos sobre folhas",
  },
  lobster: {
    id: "lobster",
    name: "Lobster X.O.", // (imprensa)
    description: "Lagosta na grelha com creme de couve-flor defumado.",
    house: "Cru Oyster Bar",
    image: "grelha",
    alt: "Frutos do mar na grelha",
  },
};

/** Ordem da home (4 pratos) e da página Gastronomia (6). */
export const homeDishes = ["ostra-grelhada", "couscous", "ravioli", "pavlova"];
export const gastronomyDishes = ["ostra-grelhada", "couscous", "ravioli", "labneh", "cordeiro", "chocolate"];
