export interface Source {
  readonly label: string;
  readonly url: string;
}

export interface Lesson {
  readonly text: string;
  readonly source: Source;
}

export const SOURCES = {
  ipccMitigation: { label: "IPCC AR6, Grupo de Trabalho III (2022)", url: "https://www.ipcc.ch/report/ar6/wg3/" },
  ipccAdaptation: { label: "IPCC AR6, Grupo de Trabalho II (2022)", url: "https://www.ipcc.ch/report/ar6/wg2/" },
  ipccSynthesis: { label: "IPCC AR6, Relatório Síntese (2023)", url: "https://www.ipcc.ch/report/ar6/syr/" },
  seeg: { label: "SEEG — Observatório do Clima", url: "https://seeg.eco.br" },
  methane: {
    label: "PNUMA — Global Methane Assessment (2021)",
    url: "https://www.unep.org/resources/report/global-methane-assessment-benefits-and-costs-mitigating-methane-emissions",
  },
  sdg13: { label: "ONU Brasil — ODS 13: Ação contra a mudança global do clima", url: "https://brasil.un.org/pt-br/sdgs/13" },
  stripes: { label: "Ed Hawkins — #ShowYourStripes", url: "https://showyourstripes.info" },
} as const satisfies Record<string, Source>;

/** O porquê de cada ação, mostrado no relatório final. */
export const ACTION_LESSONS: Readonly<Record<string, Lesson>> = {
  "solar-farm": {
    text: "Energia solar e eólica estão entre as opções de corte de emissões com maior potencial e menor custo, segundo o IPCC.",
    source: SOURCES.ipccMitigation,
  },
  "wind-farm": {
    text: "Trocar carvão e gás por vento elimina a principal fonte de CO₂ da geração elétrica. O Nordeste brasileiro é um dos melhores lugares do mundo para isso.",
    source: SOURCES.ipccMitigation,
  },
  "clean-industry": {
    text: "Eletrificar processos e usar energia com mais eficiência são as alavancas principais para descarbonizar a indústria.",
    source: SOURCES.ipccMitigation,
  },
  "housing-retrofit": {
    text: "Prédios eficientes gastam menos energia para o mesmo conforto. Aquecedor solar e LED já se pagam em poucos anos.",
    source: SOURCES.ipccMitigation,
  },
  "transit-corridor": {
    text: "Transporte coletivo e bicicleta movem mais gente com muito menos emissões por passageiro do que o carro.",
    source: SOURCES.ipccMitigation,
  },
  "recycling-center": {
    text: "Lixões liberam metano, um gás que aquece o planeta dezenas de vezes mais que o CO₂ no curto prazo. Capturá-lo é uma das ações climáticas mais rápidas.",
    source: SOURCES.methane,
  },
  reforestation: {
    text: "No Brasil, a mudança de uso da terra (desmatamento) é a maior fonte de emissões. Restaurar florestas tira CO₂ do ar.",
    source: SOURCES.seeg,
  },
  "urban-park": {
    text: "Áreas verdes absorvem carbono, refrescam a cidade e ajudam a água da chuva a infiltrar no solo.",
    source: SOURCES.ipccAdaptation,
  },
  "free-transit": {
    text: "Transporte público barato e frequente faz as pessoas trocarem o carro pelo ônibus.",
    source: SOURCES.ipccMitigation,
  },
  "selective-collection": {
    text: "Separar o lixo orgânico para compostagem evita que ele apodreça no lixão e gere metano.",
    source: SOURCES.methane,
  },
  "climate-education": {
    text: "Estratégias do lado da demanda, como mudar hábitos de transporte, dieta e consumo, podem reduzir de 40% a 70% das emissões de uso final até 2050, segundo o IPCC.",
    source: SOURCES.ipccMitigation,
  },
  "carbon-price": {
    text: "Colocar preço no carbono faz quem polui pagar pelo dano e incentiva tecnologias limpas.",
    source: SOURCES.ipccMitigation,
  },
  "green-building-code": {
    text: "Regras de construção eficientes evitam décadas de desperdício de energia em prédios novos.",
    source: SOURCES.ipccMitigation,
  },
  drainage: {
    text: "Adaptação também é ação climática: o aquecimento já contratado aumenta chuvas extremas, e a cidade precisa se preparar.",
    source: SOURCES.ipccAdaptation,
  },
  "heat-plan": {
    text: "Árvores e telhados verdes reduzem as ilhas de calor urbanas, que tornam as ondas de calor mais perigosas.",
    source: SOURCES.ipccAdaptation,
  },
  "early-warning": {
    text: "Sistemas de alerta antecipado salvam vidas e estão entre as medidas de adaptação com melhor custo-benefício.",
    source: SOURCES.ipccAdaptation,
  },
};

/**
 * Anomalia aproximada da temperatura média global por década (°C, vs. 1850–1900),
 * arredondada a partir das séries usadas em #ShowYourStripes. Serve só para o contexto visual.
 */
export const HISTORICAL_WARMING: readonly { readonly year: number; readonly anomaly: number }[] = [
  { year: 1850, anomaly: -0.05 },
  { year: 1860, anomaly: 0 },
  { year: 1870, anomaly: 0 },
  { year: 1880, anomaly: -0.05 },
  { year: 1890, anomaly: -0.1 },
  { year: 1900, anomaly: -0.05 },
  { year: 1910, anomaly: -0.15 },
  { year: 1920, anomaly: 0 },
  { year: 1930, anomaly: 0.1 },
  { year: 1940, anomaly: 0.2 },
  { year: 1950, anomaly: 0.1 },
  { year: 1960, anomaly: 0.2 },
  { year: 1970, anomaly: 0.25 },
  { year: 1980, anomaly: 0.45 },
  { year: 1990, anomaly: 0.6 },
  { year: 2000, anomaly: 0.8 },
  { year: 2010, anomaly: 1 },
  { year: 2020, anomaly: 1.3 },
];
