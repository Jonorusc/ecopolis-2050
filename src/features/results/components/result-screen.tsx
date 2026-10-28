"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { evaluateOutcome } from "@/application/use-cases/evaluate-outcome";
import { ACTION_LESSONS, SOURCES } from "@/content/lessons";
import { GAME_RULES } from "@/content/rules";
import type { Grade } from "@/domain/services/score-evaluator";
import { findAction } from "@/domain/services/rules-queries";
import { WarmingStripes } from "@/features/game/components/warming-stripes";
import { gameSession } from "@/features/game/game-session";
import { useGame } from "@/features/game/hooks/use-game";
import { formatEmissions, formatMoney, formatWarming } from "@/features/game/presentation/format";
import { warmingColor } from "@/features/game/presentation/warming-color";
import { LessonCard } from "./lesson-card";
import styles from "./result-screen.module.css";

const GRADE_HEADLINES: Readonly<Record<Grade, string>> = {
  A: "Uma cidade à altura do Acordo de Paris.",
  B: "Bem perto da meta. Mais um empurrão e chegava lá.",
  C: "Teve progresso, mas devagar demais.",
  D: "Pouca coisa mudou.",
  E: "Nada mudou, e o planeta sentiu.",
};

export function ResultScreen() {
  const snapshot = useGame();
  const router = useRouter();

  if (!snapshot) return <p className={styles.loading}>Calculando o futuro…</p>;

  const { game } = snapshot;

  if (game.phase !== "finished") {
    return (
      <main className={styles.page}>
        <section className={styles.empty}>
          <h1>O mandato ainda não acabou.</h1>
          <p>Jogue até 2050 para ver o impacto das suas decisões.</p>
          <Link href="/jogar" className={styles.primary}>
            Voltar para a cidade
          </Link>
        </section>
      </main>
    );
  }

  const outcome = evaluateOutcome(game, GAME_RULES);

  function playAgain() {
    gameSession.restart();
    router.push("/jogar");
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="grade-title">
        <p className={styles.grade} style={{ backgroundColor: warmingColor(outcome.projectedWarming) }}>
          <span className="visually-hidden">Nota </span>
          {outcome.grade}
        </p>
        <div className={styles.heroText}>
          <p className={styles.eyebrow}>Ecópolis · resultado do mandato 2026–2050</p>
          <h1 id="grade-title">{GRADE_HEADLINES[outcome.grade]}</h1>
          <p className={styles.lead}>
            Se todas as cidades do mundo seguissem o seu caminho, o planeta aqueceria cerca de{" "}
            <strong>{formatWarming(outcome.projectedWarming)}</strong> até 2100.{" "}
            {outcome.baselineWarming - outcome.projectedWarming < 0.05 ? (
              "É o mesmo cenário de uma cidade que não faz nada."
            ) : (
              <>
                Sem nenhuma ação, seriam <strong>{formatWarming(outcome.baselineWarming)}</strong>.
              </>
            )}
          </p>
        </div>
      </section>

      <WarmingStripes history={game.history} totalTurns={GAME_RULES.config.totalTurns} />

      <dl className={styles.numbers}>
        <div>
          <dt>CO₂ evitado</dt>
          <dd>{formatEmissions(Math.max(outcome.avoidedEmissions, 0))}</dd>
        </div>
        <div>
          <dt>CO₂ emitido em 24 anos</dt>
          <dd>{formatEmissions(outcome.cumulativeEmissions)}</dd>
        </div>
        <div>
          <dt>Bem-estar final</dt>
          <dd>{outcome.finalHappiness}/100</dd>
        </div>
        <div>
          <dt>Caixa final</dt>
          <dd>{formatMoney(outcome.finalBudget)}</dd>
        </div>
      </dl>

      <section className={styles.lessons} aria-labelledby="lessons-title">
        <h2 id="lessons-title">Por que suas decisões importam</h2>
        {outcome.actions.length === 0 ? (
          <p>
            Você não tomou nenhuma ação. Na vida real, adiar também é uma escolha: cada ano sem cortar emissões
            deixa a meta de 1,5 °C mais distante.
          </p>
        ) : (
          <ul className={styles.lessonList}>
            {outcome.actions.map(({ actionId, count }) => {
              const action = findAction(GAME_RULES, actionId);
              const lesson = ACTION_LESSONS[actionId];
              if (!action || !lesson) return null;
              return <LessonCard key={actionId} title={action.title} count={count} lesson={lesson} />;
            })}
          </ul>
        )}
      </section>

      <footer className={styles.footer}>
        <p className={styles.disclaimer}>
          Modelo educativo simplificado: as emissões da cidade são fictícias e o aquecimento é uma analogia com
          os cenários do{" "}
          <a href={SOURCES.ipccSynthesis.url} target="_blank" rel="noreferrer">
            {SOURCES.ipccSynthesis.label}
          </a>
          . Listras de aquecimento por{" "}
          <a href={SOURCES.stripes.url} target="_blank" rel="noreferrer">
            {SOURCES.stripes.label}
          </a>
          .
        </p>
        <div className={styles.actions}>
          <button type="button" className={styles.primary} onClick={playAgain}>
            Jogar de novo
          </button>
          <Link href="/" className={styles.secondary}>
            Início
          </Link>
        </div>
      </footer>
    </main>
  );
}
