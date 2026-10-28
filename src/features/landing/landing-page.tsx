import Link from "next/link";
import { SOURCES } from "@/content/lessons";
import { GAME_RULES } from "@/content/rules";
import { TileArt } from "@/features/game/components/tile-art";
import { WarmingStripes } from "@/features/game/components/warming-stripes";
import styles from "./landing-page.module.css";

const { startYear, totalTurns, yearsPerTurn, maxActionsPerTurn } = GAME_RULES.config;
const endYear = startYear + totalTurns * yearsPerTurn;

const STEPS = [
  {
    title: "Escolha ações",
    text: `A cada turno (${yearsPerTurn} anos) você faz até ${maxActionsPerTurn} obras ou políticas: usinas solares, ciclovias, reflorestamento, taxa de carbono…`,
  },
  {
    title: "Equilibre a cidade",
    text: "O orçamento é curto e a população precisa continuar feliz. Nem toda boa ideia cabe no mesmo turno.",
  },
  {
    title: "Aguente o clima",
    text: "Ondas de calor, enchentes e secas ficam mais comuns quanto mais a cidade emite. Adaptação também conta.",
  },
] as const;

export function LandingPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>ODS 13 · Ação contra a mudança global do clima</p>
        <h1 className={styles.title}>
          Ecópolis <span>{endYear}</span>
        </h1>
        <p className={styles.thesis}>
          Você é prefeito(a) de {startYear} a {endYear}. Cada decisão muda a cor do futuro.
        </p>
        <WarmingStripes history={[]} totalTurns={totalTurns} />
        <div className={styles.cta}>
          <Link href="/jogar" className={styles.primary}>
            Começar mandato
          </Link>
          <span className={styles.ctaNote}>Cerca de 10 minutos · seu progresso fica salvo neste navegador</span>
        </div>
      </section>

      <section className={styles.how} aria-labelledby="how-title">
        <h2 id="how-title">Como jogar</h2>
        <ol className={styles.steps}>
          {STEPS.map((step) => (
            <li key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
        <div className={styles.preview} aria-hidden="true">
          {(["coal-plant", "solar-farm", "car-avenue", "transit-avenue", "degraded-land", "forest"] as const).map(
            (kind) => (
              <span key={kind} className={styles.previewTile}>
                <TileArt kind={kind} />
              </span>
            ),
          )}
        </div>
      </section>

      <footer className={styles.footer}>
        <p>
          Projeto de extensão universitária (Descomplica) sobre o{" "}
          <a href={SOURCES.sdg13.url} target="_blank" rel="noreferrer">
            ODS 13
          </a>
          . Feito por{" "}
          <a href="https://github.com/jonorusc" target="_blank" rel="noreferrer">
            @jonorusc
          </a>
          .
        </p>
      </footer>
    </main>
  );
}
