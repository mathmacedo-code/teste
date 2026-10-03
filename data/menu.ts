/**
 * Cardápio completo (abre no próprio site).
 * Itens marcados (imprensa) foram citados em matérias; os demais são EXEMPLOS
 * de estrutura — substituir pelo cardápio oficial. Preço é opcional.
 */
export type MenuItem = { name: string; description?: string; price?: string };
export type MenuSection = { title: string; items: MenuItem[] };
export type MenuHouse = { id: string; name: string; intro: string; sections: MenuSection[] };

export const menu: MenuHouse[] = [
  {
    id: "temperani",
    name: "Temperani Amalfi",
    intro: "Cucina italiana inspirada pela Costa Amalfitana.",
    sections: [
      {
        title: "Antipasti",
        items: [
          { name: "Cubos de lasanha", description: "Empanados e fritos, molho de tomate" }, // (imprensa)
          { name: "Burrata con pomodorini", description: "Tomatinhos confitados, pesto de manjericão e azeite" }, // CONFIRMAR
          { name: "Carpaccio di polpo", description: "Polvo, limão siciliano e alcaparras" },
        ],
      },
      {
        title: "Primi",
        items: [
          { name: "Gnocchi alla Sorrentina", description: "Fior di latte e molho de tomate fresco" }, // (imprensa)
          { name: "Pappardelle al ragù di ossobuco", description: "Massa larga e ragù de ossobuco" }, // (imprensa)
          { name: "Ravioli all'olio verde", description: "Massa fresca, recheio cremoso e azeite de ervas" },
          { name: "Linguine alle vongole", description: "Vôngoles, alho, vinho branco e salsinha" },
          { name: "Risoni al polpo", description: "Polvo na brasa, tomate, stracciatella e manjericão" }, // CONFIRMAR
        ],
      },
      {
        title: "Pizze",
        items: [
          { name: "Margherita", description: "Tomate San Marzano, fior di latte e manjericão" },
          { name: "Amalfi", description: "Limão siciliano, burrata e anchova" },
        ],
      },
    ],
  },
  {
    id: "miimar",
    name: "MII Mar",
    intro: "Sabores do Mediterrâneo em uma atmosfera única.",
    sections: [
      {
        title: "Mezze",
        items: [
          { name: "Labneh", description: "Coalhada seca, azeite, endro e azeitona" },
          { name: "Kibbeh cru", description: "Cebola, hortelã e azeite" },
          { name: "Pão do forno", description: "Assado na hora, para acompanhar" },
        ],
      },
      {
        title: "Pratos",
        items: [
          { name: "Polvo grelhado", description: "Na brasa, com azeite e limão" }, // (imprensa)
          { name: "Moussaka", description: "Berinjela, ragù de cordeiro e bechamel" }, // (imprensa)
          { name: "Roz a djej", description: "Arroz basmati, bombom de alcatra e crispy de frango" }, // (imprensa)
          { name: "Couscous aux fruits de mer", description: "Polvo, camarão, peixe do dia e tomate confit" }, // (imprensa)
        ],
      },
    ],
  },
  {
    id: "cru",
    name: "Cru Oyster Bar",
    intro: "Mar, crudos, ostras e coquetelaria.",
    sections: [
      {
        title: "Ostras",
        items: [
          { name: "Ostras frescas", description: "Abertas na hora, limão e mignonette" },
          { name: "Ostra grelhada", description: "Manteiga de missô e jerez" }, // (imprensa)
          { name: "Plateau Cru", description: "Ostras, sashimis do dia, caviar e torradas, no gelo" }, // CONFIRMAR
        ],
      },
      {
        title: "Crudos",
        items: [
          { name: "Tuna tartare", description: "Mayo de kombu" }, // (imprensa)
          { name: "Crudo de peixe branco", description: "Leite de tigre, pimenta e coentro" },
          { name: "Peixe do dia em sashimi", description: "Inteiro, fatiado no balcão, com ponzu" }, // CONFIRMAR
        ],
      },
      {
        title: "Na brasa",
        items: [{ name: "Lobster X.O.", description: "Creme de couve-flor defumado" }], // (imprensa)
      },
    ],
  },
  {
    id: "bar",
    name: "Bar & Sobremesas",
    intro: "Coquetelaria autoral no bar central e doces para fechar a mesa.",
    sections: [
      {
        title: "Coquetéis",
        items: [
          { name: "Negroni da casa", description: "Gin, vermute rosso e bitter" },
          { name: "Spritz Amalfi", description: "Limoncello, prosecco e água com gás" },
          { name: "Ouzo tonic", description: "Ouzo, tônica e pepino" },
        ],
      },
      {
        title: "Sobremesas",
        items: [
          { name: "Pavlova", description: "Merengue, creme leve e frutas vermelhas" },
          { name: "Torta de chocolate e pistache", description: "Chocolate amargo e pistache tostado" },
        ],
      },
    ],
  },
];
