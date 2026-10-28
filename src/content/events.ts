import type { ClimateEvent } from "@/domain/events/climate-event";

export const EVENTS: readonly ClimateEvent[] = [
  {
    id: "heatwave",
    title: "Onda de calor",
    description: "Dias seguidos acima de 40 °C lotam os postos de saúde e sobrecarregam a rede elétrica.",
    weight: 3,
    budgetDamage: 15,
    happinessDamage: 8,
  },
  {
    id: "flood",
    title: "Enchente",
    description: "Uma chuva extrema alaga bairros inteiros e danifica ruas e casas.",
    weight: 3,
    budgetDamage: 35,
    happinessDamage: 6,
  },
  {
    id: "drought",
    title: "Seca",
    description: "Os reservatórios baixam e a cidade precisa racionar água.",
    weight: 2,
    budgetDamage: 20,
    happinessDamage: 5,
  },
  {
    id: "wildfire",
    title: "Incêndio florestal",
    description: "Com o tempo seco e quente, o fogo se espalha e destrói uma floresta.",
    weight: 2,
    budgetDamage: 10,
    happinessDamage: 4,
    destroys: { from: "forest", to: "degraded-land" },
  },
];
