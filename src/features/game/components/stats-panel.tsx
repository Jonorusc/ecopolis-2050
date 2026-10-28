import type { LiveIndicators } from "@/application/queries/live-indicators";
import { formatEmissions, formatMoney, formatPercent, formatWarming } from "../presentation/format";
import { warmingColor } from "../presentation/warming-color";
import styles from "./stats-panel.module.css";

interface StatsPanelProps {
  readonly indicators: LiveIndicators;
  readonly budget: number;
  readonly happiness: number;
  readonly maxActions: number;
}

export function StatsPanel({ indicators, budget, happiness, maxActions }: StatsPanelProps) {
  const emissionChange = indicators.annualEmissions / indicators.initialEmissions - 1;

  return (
    <section className={styles.panel} aria-labelledby="stats-title">
      <h2 id="stats-title" className="visually-hidden">
        Indicadores da cidade
      </h2>
      <dl className={styles.list}>
        <div className={`${styles.item} ${styles.warming}`}>
          <dt>Aquecimento em 2100 se o mundo seguir sua cidade</dt>
          <dd>
            <span className={styles.swatch} style={{ backgroundColor: warmingColor(indicators.projectedWarming) }} />
            <span className={styles.big}>{formatWarming(indicators.projectedWarming)}</span>
          </dd>
        </div>
        <div className={styles.item}>
          <dt>Emissões</dt>
          <dd>
            <span className={styles.value}>{formatEmissions(indicators.annualEmissions)}</span>
            <span className={styles.unit}> CO₂/ano</span>
            <span className={emissionChange <= 0 ? styles.good : styles.bad}>
              {emissionChange <= 0 ? "▼" : "▲"} {formatPercent(Math.abs(emissionChange))} vs. 2026
            </span>
          </dd>
        </div>
        <div className={styles.item}>
          <dt>Orçamento</dt>
          <dd>
            <span className={budget < 0 ? `${styles.value} ${styles.bad}` : styles.value}>{formatMoney(budget)}</span>
            {indicators.upkeep > 0 && <span className={styles.note}>manutenção {formatMoney(indicators.upkeep)}/turno</span>}
          </dd>
        </div>
        <div className={styles.item}>
          <dt>Bem-estar da população</dt>
          <dd>
            <span className={styles.value}>{happiness}</span>
            <span className={styles.unit}>/100</span>
            <meter className={styles.meter} min={0} max={100} low={35} high={70} optimum={100} value={happiness} />
          </dd>
        </div>
        <div className={styles.item}>
          <dt>Proteção contra desastres</dt>
          <dd>
            <span className={styles.value}>{formatPercent(indicators.resilience)}</span>
          </dd>
        </div>
        <div className={styles.item}>
          <dt>Ações neste turno</dt>
          <dd>
            <span className={styles.value}>
              {indicators.actionsLeft} de {maxActions}
            </span>
          </dd>
        </div>
      </dl>
    </section>
  );
}
