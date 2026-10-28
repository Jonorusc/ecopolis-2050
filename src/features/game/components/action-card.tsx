import type { ActionBlocker } from "@/application/use-cases/apply-action";
import type { ClimateAction } from "@/domain/actions/climate-action";
import type { TileCatalog } from "@/domain/entities/tile";
import { BLOCKER_MESSAGES, describeEffects, formatMoney } from "../presentation/format";
import styles from "./action-card.module.css";

interface ActionCardProps {
  readonly action: ClimateAction;
  readonly tiles: TileCatalog;
  readonly blocker: ActionBlocker | null;
  readonly isSelected: boolean;
  readonly onSelect: (actionId: string) => void;
}

export function ActionCard({ action, tiles, blocker, isSelected, onSelect }: ActionCardProps) {
  const isAdopted = blocker === "policy-already-adopted";
  const className = [styles.card, isSelected && styles.selected, isAdopted && styles.adopted].filter(Boolean).join(" ");
  const reasonId = `${action.id}-reason`;

  return (
    <li>
      <button
        type="button"
        className={className}
        aria-pressed={isSelected}
        aria-describedby={blocker ? reasonId : undefined}
        disabled={blocker !== null}
        onClick={() => onSelect(action.id)}
      >
        <span className={styles.header}>
          <span className={styles.title}>{action.title}</span>
          <span className={styles.cost}>{isAdopted ? "adotada" : formatMoney(action.cost)}</span>
        </span>
        <span className={styles.summary}>{action.summary}</span>
        <span className={styles.effects}>
          {describeEffects(action, tiles).map((effect) => (
            <span key={effect} className={styles.effect}>
              {effect}
            </span>
          ))}
        </span>
        {blocker && !isAdopted && (
          <span id={reasonId} className={styles.reason}>
            {BLOCKER_MESSAGES[blocker]}
          </span>
        )}
      </button>
    </li>
  );
}
