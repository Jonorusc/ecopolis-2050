# Ecópolis 2050 — MVP do jogo (concluído em 2026-10-27)

Projeto de extensão Descomplica, tema ODS 13 (ação contra a mudança global do clima).
Repositório: https://github.com/Jonorusc/ecopolis-2050 (público). Deploy importado na Vercel pelo autor.

## O que foi feito

- **Stack:** Next.js 16 (App Router, Cache Components), React 19, TypeScript strict, CSS Modules + tokens (`src/styles/tokens.css`), Vitest.
- **Jogo:** 12 turnos (2026–2048, 2 anos cada), até 3 ações por turno, mapa 8×6. Obras transformam lotes; políticas valem para a cidade toda, uma única vez. Orçamento, bem-estar, resiliência e eventos climáticos (enchente, onda de calor, seca, incêndio) com chance proporcional ao risco.
- **Projeção de aquecimento:** analogia educativa com os cenários do IPCC AR6 (`domain/services/climate-projection.ts`). Notas A–E em `score-evaluator.ts` (A ≤ 1,8 °C, B ≤ 2,2, C ≤ 2,8, D ≤ 3,4).
- **Telas:** `/` (landing), `/jogar` (mapa isométrico 2.5D, cartas, painel, listras de aquecimento, diálogo de evento), `/resultado` (nota, CO₂ evitado, lições com fonte).
- **Mapa isométrico:** SVG puro em `features/game/components/iso/` (sem WebGL). Direção das avenidas calculada por `presentation/road-axis.ts`.
- **Persistência:** `localStorage` via `GameRepository`; save inválido ou de versão antiga é descartado.

## Decisões que não devem ser desfeitas

- **Motor puro:** `domain/` e `application/` não importam React/Next. A UI consome a sessão (`application/game-session.ts`) via `useSyncExternalStore` em `features/game/hooks/use-game.ts`.
- **Conteúdo é dado:** novas ações e eventos entram em `src/content/` sem mexer no motor.
- **Aleatoriedade determinística:** semente por turno (`infrastructure/seeded-random.ts`, com mix32), então recarregar a página não muda o resultado.
- **Diálogo de evento:** o `useEffect` em `event-dialog.tsx` **não** pode fechar o `<dialog>` no cleanup. Fechar dispara `onClose`, que no StrictMode dispensava o evento antes de aparecer.
- **Balanceamento:** testes em `application/use-cases/game-flow.test.ts` garantem que "não fazer nada" dá E e que uma estratégia verde dá A/B. Rode-os ao mexer em custos, emissões ou faixas de nota.
- **Atribuição:** sem menções ao Claude em commits, README ou código. O crédito é de @jonorusc.

## Verificação

27 testes (Vitest), `npm run lint` e `npm run build` limpos. Partidas completas testadas no navegador (caminho sem ações → E; caminho com ações → C/B), seleção por teclado e layout mobile.
