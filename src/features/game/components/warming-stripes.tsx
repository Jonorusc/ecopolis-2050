import { HISTORICAL_WARMING } from "@/content/lessons";
import type { TurnRecord } from "@/domain/entities/game-state";
import { formatWarming } from "../presentation/format";
import { warmingColor } from "../presentation/warming-color";
import styles from "./warming-stripes.module.css";

interface WarmingStripesProps {
  readonly history: readonly TurnRecord[];
  readonly totalTurns: number;
  /** Projeção do turno em andamento, mostrada como listra provisória. */
  readonly liveWarming?: number;
  readonly compact?: boolean;
}

/** Elemento-assinatura: o passado real (aproximado) seguido do futuro que o jogador está escrevendo. */
export function WarmingStripes({ history, totalTurns, liveWarming, compact = false }: WarmingStripesProps) {
  const emptySlots = Math.max(totalTurns - history.length - (liveWarming === undefined ? 0 : 1), 0);
  const lastWarming = liveWarming ?? history.at(-1)?.projectedWarming;

  return (
    <figure className={compact ? `${styles.figure} ${styles.compact}` : styles.figure}>
      <div className={styles.stripes} role="img" aria-label={stripesLabel(history, lastWarming)}>
        {HISTORICAL_WARMING.map((decade) => (
          <span
            key={decade.year}
            className={styles.stripe}
            style={{ backgroundColor: warmingColor(decade.anomaly) }}
            title={`Década de ${decade.year}: ${formatWarming(decade.anomaly)}`}
          />
        ))}
        <span className={styles.divider} aria-hidden="true" />
        {history.map((record) => (
          <span
            key={record.year}
            className={`${styles.stripe} ${styles.played}`}
            style={{ backgroundColor: warmingColor(record.projectedWarming) }}
            title={`${record.year}: projeção de ${formatWarming(record.projectedWarming)} em 2100`}
          />
        ))}
        {liveWarming !== undefined && (
          <span
            className={`${styles.stripe} ${styles.live}`}
            style={{ backgroundColor: warmingColor(liveWarming) }}
            title={`Agora: projeção de ${formatWarming(liveWarming)} em 2100`}
          />
        )}
        {Array.from({ length: emptySlots }, (_, i) => (
          <span key={`empty-${i}`} className={`${styles.stripe} ${styles.empty}`} />
        ))}
      </div>
      {!compact && (
        <figcaption className={styles.caption}>
          <span>1850</span>
          <span className={styles.captionCenter}>
            passado real (aprox.) · <strong>o futuro que você escreve</strong>
          </span>
          <span>2050</span>
        </figcaption>
      )}
    </figure>
  );
}

function stripesLabel(history: readonly TurnRecord[], lastWarming: number | undefined): string {
  const base = "Listras de aquecimento: de 1850 até hoje o planeta aqueceu cerca de 1,3 °C.";
  if (lastWarming === undefined) return base;
  return `${base} No caminho da sua cidade, o aquecimento projetado para 2100 é de ${formatWarming(lastWarming)} (${history.length} turnos jogados).`;
}
