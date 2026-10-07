// Tour 360° do Edan Park.
//
// Hoje as cenas vêm de quadros do vídeo aéreo (fotos verticais de 720 px). Você fica no centro de uma
// cúpula ao entardecer e gira 360° entre as paradas; ao "entrar" numa cena, a câmera avança até ela.
//
// >>> Tem uma imagem 360° (equirretangular, 2:1) do empreendimento? Basta colocá-la em
//     public/media/tour/panorama.jpg e preencher `panorama` abaixo: ela passa a ser o ambiente
//     ao redor de todas as paradas, e o resto do tour continua funcionando igual.
//     (Para testar sem editar nada: abra /tour-360/#preview e arraste a imagem sobre a página.)

export const tour = {
  // Separação (em graus) entre as paradas no arco. As paradas ficam lado a lado, como num panorama.
  step: 40,

  // Imagem 360° opcional (JPG equirretangular, proporção 2:1, ex.: 8192×4096).
  // Ex.: panorama: { src: "/media/tour/panorama.jpg" }
  panorama: null,

  // Paradas, em ordem. Depois da última, o giro de 360° termina num cartão de contato.
  scenes: [
    {
      id: "visao-geral",
      title: "Visão geral",
      kicker: "Parada 1",
      text: "O polo visto de cima, ao pôr do sol: galpão âncora, vias internas e as serras do Sul de Minas ao fundo.",
      img: "/media/tour/visao-geral.webp",
      aura: "/media/tour/visao-geral-aura.webp",
      spots: [
        { x: 50, y: 24, label: "Serras do Sul de Minas" },
        { x: 52, y: 47, label: "Galpão Edan" },
      ],
    },
    {
      id: "fachada",
      title: "Centro de Distribuição Edan",
      kicker: "Parada 2",
      text: "A empresa âncora do Edan Park: um galpão em escala industrial, com a fachada azul e branca já assinada.",
      img: "/media/tour/fachada.webp",
      aura: "/media/tour/fachada-aura.webp",
      spots: [
        { x: 33, y: 46, label: "Fachada Edan" },
        { x: 52, y: 74, label: "Pátio e acessos" },
      ],
    },
    {
      id: "heliponto",
      title: "Heliponto",
      kicker: "Parada 3",
      text: "Sinalizado e dentro do polo. Ao fundo, o galpão e a pista que liga tudo.",
      img: "/media/tour/heliponto.webp",
      aura: "/media/tour/heliponto-aura.webp",
      spots: [
        { x: 44, y: 86, label: "Heliponto" },
        { x: 62, y: 36, label: "Galpão Edan" },
      ],
    },
    {
      id: "galpao",
      title: "Por dentro do galpão",
      kicker: "Parada 4",
      text: "Estrutura metálica, vão livre e piso industrial: o interior do centro de distribuição, na reta final da obra.",
      img: "/media/tour/galpao.webp",
      aura: "/media/tour/galpao-aura.webp",
      spots: [
        { x: 48, y: 11, label: "Estrutura metálica" },
        { x: 80, y: 28, label: "Frente de obra" },
        { x: 40, y: 66, label: "Piso industrial" },
      ],
    },
    {
      id: "modulos",
      title: "Módulos de apoio",
      kicker: "Parada 5",
      text: "Edificações modulares de apoio, separadas da área operacional, com o horizonte verde do Sul de Minas.",
      img: "/media/tour/modulos.webp",
      aura: "/media/tour/modulos-aura.webp",
      spots: [
        { x: 62, y: 82, label: "Módulos administrativos" },
        { x: 72, y: 30, label: "Área dos lotes" },
      ],
    },
  ],

  // Cartão final, "atrás" de quem fez o giro completo.
  cta: {
    kicker: "Fim do tour",
    title: "Gostou do que viu?",
    text: "Agende uma visita ao polo e conheça de perto os lotes disponíveis.",
    aura: "/media/tour/fachada-aura.webp",
  },
};
