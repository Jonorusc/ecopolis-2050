"use client";

import { useEffect, useEffectEvent } from "react";
import styles from "./turn-bar.module.css";

interface TurnBarProps {
  readonly hint: string;
  readonly message: string | null;
  readonly confirmLabel?: string;
  readonly onConfirm: () => void;
  readonly onCancel?: () => void;
  readonly onEndTurn: () => void;
  readonly isLastTurn: boolean;
}

export function TurnBar({ hint, message, confirmLabel, onConfirm, onCancel, onEndTurn, isLastTurn }: TurnBarProps) {
  const canCancel = onCancel !== undefined;
  const cancel = useEffectEvent(() => onCancel?.());

  useEffect(() => {
    if (!canCancel) return;
    const cancelOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") cancel();
    };
    window.addEventListener("keydown", cancelOnEscape);
    return () => window.removeEventListener("keydown", cancelOnEscape);
  }, [canCancel]);

  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        <p className={styles.hint} aria-live="polite">
          {message ? <strong className={styles.error}>{message}</strong> : hint}
        </p>
        <div className={styles.buttons}>
          {onCancel && (
            <button type="button" className={styles.secondary} onClick={onCancel}>
              Cancelar
            </button>
          )}
          {confirmLabel && (
            <button type="button" className={styles.confirm} onClick={onConfirm}>
              {confirmLabel}
            </button>
          )}
          <button type="button" className={styles.endTurn} onClick={onEndTurn}>
            {isLastTurn ? "Encerrar mandato" : "Encerrar turno →"}
          </button>
        </div>
      </div>
    </div>
  );
}
