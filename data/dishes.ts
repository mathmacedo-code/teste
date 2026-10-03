import type { CutoutKey, ImageKey } from "./media";

/**
 * Pratos em destaque: só os que têm foto feita pela casa.
 * Nomes e descrições foram escritos a partir das fotos — CONFIRMAR com a cozinha.
 * O cardápio completo (só texto) fica em data/menu.ts.
 */
export type Dish = {
  id: string;
  name: string;
  description: string;
  house: string;
  image: ImageKey;
  alt: string;
  /** o mesmo prato recortado, quando existe (elemento gráfico) */
  cutout?: CutoutKey;
};

export const dishes: Record<string, Dish> = {
  plateau: {
    id: "plateau",
    name: "Plateau Cru", // CONFIRMAR
    description: "Ostras frescas, sashimis do dia e caviar, servidos no gelo com torradas e alga crocante.",
    house: "Cru Oyster Bar",
    image: "plateau-cru",
    alt: "Plateau do Cru com ostras, sashimis de atum, salmão e peixe branco no gelo, caviar e torradas em caixas de madeira",
  },
  burrata: {
    id: "burrata",
    name: "Burrata con pomodorini", // CONFIRMAR
    description: "Burrata cremosa sobre tomatinhos confitados, pesto de manjericão e um fio de azeite na hora.",
    house: "Temperani Amalfi",
    image: "prato-burrata",
    alt: "Burrata recebendo um fio de azeite, sobre tomates confit, pesto e folhas de manjericão",
    cutout: "recorte-burrata",
  },
  "orzo-polvo": {
    id: "orzo-polvo",
    name: "Orzo com polvo", // CONFIRMAR
    description: "Orzo cozido no molho de tomate, à moda grega, com polvo na brasa, stracciatella e manjericão.",
    house: "MII Mar",
    image: "prato-polvo-risoni",
    alt: "Orzo ao molho de tomate com tentáculo de polvo grelhado, stracciatella e manjericão em bowl verde",
    cutout: "recorte-risoni",
  },
  "peixe-cru": {
    id: "peixe-cru",
    name: "Peixe do dia em sashimi", // CONFIRMAR
    description: "O peixe inteiro, fatiado no balcão e servido sobre gelo, com ponzu e cerefólio.",
    house: "Cru Oyster Bar",
    image: "prato-peixe-cru",
    alt: "Peixe vermelho inteiro fatiado em sashimi sobre gelo, com molho ponzu ao lado",
    cutout: "recorte-peixe",
  },
};

/** Ordem da home e da página Gastronomia. */
export const homeDishes = ["plateau", "burrata", "orzo-polvo", "peixe-cru"];
export const gastronomyDishes = ["plateau", "burrata", "orzo-polvo", "peixe-cru"];
