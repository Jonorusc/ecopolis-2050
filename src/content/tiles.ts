import type { TileCatalog } from "@/domain/entities/tile";

/**
 * Valores fictícios de uma cidade média (~13 MtCO₂e/ano), com proporções inspiradas
 * no perfil de emissões urbanas: energia, transporte e indústria dominam.
 */
export const TILE_CATALOG: TileCatalog = {
  "coal-plant": { kind: "coal-plant", label: "Termelétrica a carvão", sector: "energy", emissions: 2, growsWithDemand: true },
  "gas-plant": { kind: "gas-plant", label: "Termelétrica a gás", sector: "energy", emissions: 1, growsWithDemand: true },
  "solar-farm": { kind: "solar-farm", label: "Usina solar", sector: "energy", emissions: 0, growsWithDemand: false },
  "wind-farm": { kind: "wind-farm", label: "Parque eólico", sector: "energy", emissions: 0, growsWithDemand: false },
  factory: { kind: "factory", label: "Indústria", sector: "industry", emissions: 0.8, growsWithDemand: false },
  "clean-factory": { kind: "clean-factory", label: "Indústria limpa", sector: "industry", emissions: 0.2, growsWithDemand: false },
  housing: { kind: "housing", label: "Bairro residencial", sector: "buildings", emissions: 0.15, growsWithDemand: true },
  "efficient-housing": { kind: "efficient-housing", label: "Bairro eficiente", sector: "buildings", emissions: 0.04, growsWithDemand: false },
  "car-avenue": { kind: "car-avenue", label: "Avenida de carros", sector: "transport", emissions: 0.35, growsWithDemand: true },
  "transit-avenue": { kind: "transit-avenue", label: "Corredor de ônibus e ciclovia", sector: "transport", emissions: 0.08, growsWithDemand: false },
  landfill: { kind: "landfill", label: "Lixão", sector: "waste", emissions: 0.5, growsWithDemand: true },
  "recycling-center": { kind: "recycling-center", label: "Central de reciclagem e biogás", sector: "waste", emissions: 0.08, growsWithDemand: false },
  "degraded-land": { kind: "degraded-land", label: "Área degradada", sector: "land", emissions: 0.05, growsWithDemand: false },
  forest: { kind: "forest", label: "Floresta", sector: "land", emissions: -0.15, growsWithDemand: false },
  park: { kind: "park", label: "Parque urbano", sector: "land", emissions: -0.05, growsWithDemand: false },
};
