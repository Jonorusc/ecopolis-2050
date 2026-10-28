import { getActionBlocker } from "@/application/use-cases/apply-action";
import type { ClimateAction } from "@/domain/actions/climate-action";
import type { GameState } from "@/domain/entities/game-state";
import type { GameRules } from "@/domain/rules";
import { ActionCard } from "./action-card";
import styles from "./action-deck.module.css";

interface ActionDeckProps {
  readonly game: GameState;
  readonly rules: GameRules;
  readonly selectedActionId: string | null;
  readonly onSelect: (actionId: string) => void;
}

const GROUPS: readonly { readonly type: ClimateAction["type"]; readonly title: string; readonly hint: string }[] = [
  { type: "tile-upgrade", title: "Obras", hint: "Transformam um lote do mapa." },
  { type: "policy", title: "Políticas", hint: "Valem para a cidade inteira, uma vez só." },
];

export function ActionDeck({ game, rules, selectedActionId, onSelect }: ActionDeckProps) {
  return (
    <section className={styles.deck} aria-labelledby="deck-title">
      <h2 id="deck-title" className={styles.title}>
        O que fazer neste turno?
      </h2>
      {GROUPS.map((group) => (
        <div key={group.type} className={styles.group}>
          <h3 className={styles.groupTitle}>
            {group.title} <span className={styles.hint}>{group.hint}</span>
          </h3>
          <ul className={styles.list}>
            {rules.actions
              .filter((action) => action.type === group.type)
              .map((action) => (
                <ActionCard
                  key={action.id}
                  action={action}
                  tiles={rules.tiles}
                  blocker={getActionBlocker(game, rules, action)}
                  isSelected={selectedActionId === action.id}
                  onSelect={onSelect}
                />
              ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
