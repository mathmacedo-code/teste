// Todo o conteúdo editável do site fica aqui. Itens marcados com CONFIRMAR vieram de
// reportagens públicas ou do vídeo — valide com o Edan Park antes de publicar.

export const site = {
  name: "Edan Park",
  tagline: "Polo Industrial e Logístico",
  url: process.env.SITE_URL || "https://edanpark.com.br",
  city: "Estiva",
  state: "MG",
  region: "Sul de Minas Gerais",

  // Canais de contato. Campos vazios simplesmente não aparecem no site.
  // CONFIRMAR: preencher com os dados reais.
  contact: {
    whatsapp: "", // só dígitos com DDI, ex.: "5535999999999"
    phone: "", // exibição, ex.: "(35) 3000-0000"
    email: "", // ex.: "comercial@edanpark.com.br"
    address: "", // endereço completo / CEP
    // Endpoint de formulário (Formspree, Netlify Forms, Make, n8n...). Se vazio, o formulário
    // abre o WhatsApp ou o e-mail acima, com a mensagem já preenchida.
    formEndpoint: "",
  },

  // CONFIRMAR: coordenadas exatas do empreendimento (hoje: centro de Estiva, aproximado).
  geo: { lat: -22.4575, lon: -46.0178 },
  social: {
    instagram: "", // ex.: "https://instagram.com/edanpark"
    linkedin: "",
  },
};

// As abas. Para renomear, reordenar ou remover uma aba, edite aqui (e a página em src/pages).
export const nav = [
  { id: "inicio", label: "Início", href: "/" },
  { id: "empreendimento", label: "Empreendimento", href: "/empreendimento/" },
  { id: "infraestrutura", label: "Infraestrutura", href: "/infraestrutura/" },
  { id: "localizacao", label: "Localização", href: "/localizacao/" },
  { id: "tour", label: "Tour 360°", href: "/tour-360/" },
  { id: "contato", label: "Contato", href: "/contato/", cta: true },
];

// Números do empreendimento. CONFIRMAR todos (fonte: Agência Minas e imprensa regional).
export const stats = [
  { value: 13, suffix: "", label: "lotes modulares", note: "para indústria e logística" },
  { value: 35, prefix: "até ", suffix: " mil m²", label: "por lote", note: "a partir de 5 mil m²" },
  { value: 20, prefix: "R$ ", suffix: " mi", label: "em investimento privado", note: "na estrutura do polo" },
  { value: 750, prefix: "~", suffix: "", label: "empregos diretos", note: "previstos para Estiva e região" },
];

export const segments = ["Logística", "Indústria", "Distribuição", "E-commerce", "Armazenagem", "Fulfillment", "Varejo", "Atacado"];

export const pillars = [
  {
    icon: "grid",
    title: "Lotes modulares",
    text: "De 5.000 a 35.000 m². Você escolhe o tamanho que cabe na operação de hoje e já sabe onde crescer amanhã.",
  },
  {
    icon: "anchor",
    title: "Empresa âncora",
    text: "A Edan escolheu o Edan Park para o seu Centro de Distribuição. Um vizinho de peso para quem chega.",
  },
  {
    icon: "layers",
    title: "Estrutura completa",
    text: "Galpões em estrutura metálica, piso industrial, acessos pavimentados, módulos administrativos e heliponto.",
  },
  {
    icon: "pin",
    title: "Sul de Minas",
    text: "Estiva, no Sul de Minas Gerais: um polo pensado para gerar empregos e desenvolvimento onde a empresa se instala.",
  },
];

// Etapas da obra — CONFIRMAR o andamento real. No vídeo, o piso do galpão ainda está sendo concretado.
export const phases = [
  { title: "Terraplenagem", text: "Plataformas e vias abertas, lotes demarcados.", state: "done" },
  { title: "Estrutura metálica", text: "Galpão Edan de pé, com cobertura e fechamento.", state: "done" },
  { title: "Piso industrial", text: "Concretagem do piso do centro de distribuição em andamento.", state: "current" },
  { title: "Acabamentos e entrega", text: "Módulos administrativos, acabamentos e entrega do polo.", state: "next" },
];

// Empresa âncora — CONFIRMAR (fonte: Agência Minas / imprensa regional).
export const anchor = {
  name: "Edan",
  text: "Referência nacional no setor de decoração e móveis, a Edan escolheu o Edan Park para o seu novo Centro de Distribuição.",
  facts: [
    { value: "R$ 60 mi", label: "investimento inicial no CD" },
    { value: "+200", label: "empregos diretos no CD" },
    { value: "~750", label: "empregos diretos previstos no projeto" },
  ],
};

// Paradas da aba "Infraestrutura": imagem (quadro do vídeo) + texto.
// CONFIRMAR: os textos descrevem o que aparece no vídeo; ajuste com as especificações reais.
export const infra = [
  {
    id: "galpao",
    img: "/media/tour/fachada.webp",
    kicker: "Galpões",
    title: "Estrutura metálica, escala industrial",
    text: "O galpão âncora mostra o padrão do polo: grandes vãos livres, cobertura metálica e fachada de escala industrial.",
  },
  {
    id: "piso",
    img: "/media/tour/galpao.webp",
    kicker: "Interior",
    title: "Vão livre e piso industrial",
    text: "Pilares bem espaçados, luminárias no vão da cobertura e piso de concreto. Espaço para organizar estantes, esteiras e empilhadeiras sem improviso.",
  },
  {
    id: "heliponto",
    img: "/media/tour/heliponto.webp",
    kicker: "Heliponto",
    title: "Chegar também pelo ar",
    text: "Heliponto sinalizado dentro do polo: mais uma forma de chegar e de conectar a sua operação.",
  },
  {
    id: "acessos",
    img: "/media/tour/visao-geral.webp",
    kicker: "Acessos",
    title: "Vias pavimentadas e pátios amplos",
    text: "Via interna larga e pavimentada liga os lotes ao acesso, com pátios abertos para a manobra de veículos pesados.",
  },
  {
    id: "modulos",
    img: "/media/tour/modulos.webp",
    kicker: "Apoio",
    title: "Módulos administrativos",
    text: "Edificações modulares de apoio, separadas da área operacional, para a rotina administrativa do polo.",
  },
];

export const faq = [
  {
    q: "Qual o tamanho dos lotes?",
    a: "Os 13 lotes modulares variam de 5.000 a 35.000 m². Consulte a disponibilidade e as combinações possíveis.",
  },
  {
    q: "Posso expandir depois?",
    a: "Essa é a ideia da modularidade: começar no tamanho certo e crescer dentro do polo. Fale com a gente para ver as opções.",
  },
  {
    q: "Quando o polo fica pronto?",
    a: "A obra está na reta final. Peça a previsão atualizada e a visita guiada pelo formulário de contato.",
  },
];
