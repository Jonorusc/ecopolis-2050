"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { getLiveIndicators } from "@/application/queries/live-indicators";
import { eligibleTileIds } from "@/application/use-cases/apply-action";
import { GAME_RULES } from "@/content/rules";
import { findAction } from "@/domain/services/rules-queries";
import { gameSession } from "../game-session";
import { useGame } from "../hooks/use-game";
import { BLOCKER_MESSAGES, formatMoney } from "../presentation/format";
import { ActionDeck } from "./action-deck";
import { CityMap } from "./city-map";
import { EventDialog } from "./event-dialog";
import { StatsPanel } from "./stats-panel";
import { TurnBar } from "./turn-bar";
import { WarmingStripes } from "./warming-stripes";
import styles from "./game-screen.module.css";

const rules = GAME_RULES;
/** Mesmo breakpoint de `game-screen.module.css`. */
const STACKED_LAYOUT_QUERY = "(max-width: 900px)";

export function GameScreen() {
  const snapshot = useGame();
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  if (!snapshot) return <p className={styles.loading}>Carregando sua cidade…</p>;

  const { game, pendingEvent } = snapshot;
  const indicators = getLiveIndicators(game, rules);
  const selectedAction = selectedActionId ? findAction(rules, selectedActionId) : undefined;
  const pickableTiles =
    selectedAction?.type === "tile-upgrade" ? new Set(eligibleTileIds(game, selectedAction)) : null;
  const eventDefinition = pendingEvent ? rules.events.find((event) => event.id === pendingEvent.eventId) : undefined;
  const isFinished = game.phase === "finished";

  function run(actionId: string, tileId?: number) {
    const result = gameSession.applyAction(actionId, tileId);
    setMessage(result.ok ? null : BLOCKER_MESSAGES[result.reason]);
    if (result.ok) setSelectedActionId(null);
  }

  function selectAction(actionId: string) {
    const isDeselecting = selectedActionId === actionId;
    setMessage(null);
    setSelectedActionId(isDeselecting ? null : actionId);
    if (!isDeselecting && findAction(rules, actionId)?.type === "tile-upgrade") revealMapOnStackedLayout();
  }

  /** No layout empilhado (mobile) o mapa fica fora da tela quando o jogador escolhe uma obra. */
  function revealMapOnStackedLayout() {
    if (!window.matchMedia(STACKED_LAYOUT_QUERY).matches) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    cityRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  function endTurn() {
    setSelectedActionId(null);
    setMessage(null);
    gameSession.endTurn();
  }

  function restart() {
    setSelectedActionId(null);
    setMessage(null);
    gameSession.restart();
  }

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          Ecópolis <span>2050</span>
        </Link>
        <p className={styles.year} aria-live="polite">
          <span className={styles.yearValue}>{indicators.year}</span>
          <span className={styles.turn}>
            {isFinished ? "mandato encerrado" : `turno ${game.turn + 1} de ${rules.config.totalTurns}`}
          </span>
        </p>
        <RestartButton onConfirm={restart} />
      </header>

      <WarmingStripes
        history={game.history}
        totalTurns={rules.config.totalTurns}
        liveWarming={isFinished ? undefined : indicators.projectedWarming}
      />

      <main className={styles.layout}>
        <div ref={cityRef} className={styles.cityColumn}>
          <CityMap
            tiles={game.tiles}
            catalog={rules.tiles}
            risk={indicators.risk}
            eligibleTileIds={pickableTiles}
            onTileSelect={(tileId) => selectedActionId && run(selectedActionId, tileId)}
          />
          <StatsPanel
            indicators={indicators}
            budget={game.budget}
            happiness={game.happiness}
            maxActions={rules.config.maxActionsPerTurn}
          />
        </div>

        <div className={styles.deckColumn}>
          {isFinished ? (
            <section className={styles.finished}>
              <h2>Seu mandato terminou.</h2>
              <p>Veja quanto CO₂ sua cidade evitou e o que cada decisão significou para o clima.</p>
              <Link href="/resultado" className={styles.primaryLink}>
                Ver o resultado
              </Link>
            </section>
          ) : (
            <ActionDeck game={game} rules={rules} selectedActionId={selectedActionId} onSelect={selectAction} />
          )}
        </div>
      </main>

      {!isFinished && (
        <TurnBar
          hint={turnHint(selectedAction?.type, selectedAction?.title)}
          message={message}
          confirmLabel={
            selectedAction?.type === "policy" ? `Adotar · ${formatMoney(selectedAction.cost)}` : undefined
          }
          onConfirm={() => selectedActionId && run(selectedActionId)}
          onCancel={selectedAction ? () => setSelectedActionId(null) : undefined}
          onEndTurn={endTurn}
          isLastTurn={game.turn === rules.config.totalTurns - 1}
        />
      )}

      {pendingEvent && eventDefinition && (
        <EventDialog
          event={eventDefinition}
          outcome={pendingEvent}
          year={game.history.at(-1)?.year ?? indicators.year}
          onClose={() => gameSession.dismissEvent()}
        />
      )}
    </div>
  );
}

function turnHint(type: "tile-upgrade" | "policy" | undefined, title: string | undefined): string {
  if (type === "tile-upgrade") return `${title}: escolha um lote destacado no mapa.`;
  if (type === "policy") return `${title}: confirme para adotar a política.`;
  const { maxActionsPerTurn, yearsPerTurn } = rules.config;
  return `Escolha até ${maxActionsPerTurn} ações e encerre o turno. Cada turno vale ${yearsPerTurn} anos.`;
}

function RestartButton({ onConfirm }: { onConfirm: () => void }) {
  const [isConfirming, setIsConfirming] = useState(false);

  if (!isConfirming) {
    return (
      <button type="button" className={styles.ghostButton} onClick={() => setIsConfirming(true)}>
        Recomeçar
      </button>
    );
  }

  return (
    <div className={styles.confirm} role="group" aria-label="Confirmar recomeço">
      <span>Apagar esta partida?</span>
      <button
        type="button"
        className={styles.dangerButton}
        onClick={() => {
          setIsConfirming(false);
          onConfirm();
        }}
      >
        Sim, recomeçar
      </button>
      <button type="button" className={styles.ghostButton} onClick={() => setIsConfirming(false)}>
        Não
      </button>
    </div>
  );
}
