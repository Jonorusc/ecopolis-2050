"use client";

import { useEffect, useRef } from "react";
import type { ClimateEvent, EventOutcome } from "@/domain/events/climate-event";
import { formatMoney, formatPercent } from "../presentation/format";
import styles from "./event-dialog.module.css";

interface EventDialogProps {
  readonly event: ClimateEvent;
  readonly outcome: EventOutcome;
  readonly year: number;
  readonly onClose: () => void;
}

export function EventDialog({ event, outcome, year, onClose }: EventDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Sem cleanup: fechar no unmount dispararia `onClose` e dispensaria o evento (ex.: no StrictMode).
  // Remover o elemento do DOM já encerra o modal.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog ref={dialogRef} className={styles.dialog} aria-labelledby="event-title" onClose={onClose}>
      <p className={styles.eyebrow}>Evento climático · {year}</p>
      <h2 id="event-title" className={styles.title}>
        {event.title}
      </h2>
      <p>{event.description}</p>
      <ul className={styles.damage}>
        <li>−{formatMoney(outcome.budgetLoss)} no orçamento</li>
        <li>−{outcome.happinessLoss} de bem-estar</li>
        {outcome.destroyedTileId !== null && <li>Uma floresta virou área degradada</li>}
      </ul>
      <p className={styles.note}>
        {outcome.mitigated > 0
          ? `Suas ações de adaptação evitaram ${formatPercent(outcome.mitigated)} do prejuízo.`
          : "Quanto mais o planeta aquece, mais frequentes ficam esses eventos. Ações de adaptação reduzem o prejuízo."}
      </p>
      <form method="dialog">
        <button type="submit" className={styles.button} autoFocus>
          Seguir em frente
        </button>
      </form>
    </dialog>
  );
}
