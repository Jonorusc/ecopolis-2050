# Ecópolis 2050

Mini game educativo em 2D sobre o **ODS 13: Ação contra a mudança global do clima**.
Projeto de extensão universitária da **Descomplica**.

Você é prefeito(a) de uma cidade fictícia de 2026 a 2050. A cada turno (2 anos) escolhe até 3 ações:
trocar termelétricas por energia solar e eólica, criar corredores de ônibus e ciclovias, reflorestar,
fechar lixões, adotar políticas como tarifa zero ou taxa de carbono, e se preparar para enchentes e
ondas de calor. O orçamento é limitado, a população precisa continuar satisfeita e os eventos
climáticos extremos ficam mais frequentes quanto mais a cidade emite.

No fim do mandato, o jogo mostra quanto CO₂ foi evitado e, numa analogia com os cenários do IPCC,
quanto o planeta aqueceria até 2100 se todas as cidades seguissem o mesmo caminho. Cada decisão
tomada vem acompanhada de uma explicação curta com fonte.

## Como rodar

Requer Node.js 20+.

```bash
npm install
npm run dev      # http://localhost:3000
npm run test     # testes do motor do jogo (Vitest)
npm run lint
npm run build
```

## Arquitetura

O motor do jogo é TypeScript puro e não depende de React nem de Next.js. A interface só consome o motor.

```
src/
  domain/           regras puras: entidades, ações, eventos, cálculo de emissões e projeção de aquecimento
  application/      use-cases (iniciar, aplicar ação, encerrar turno, avaliar resultado), ports e a sessão de jogo
  infrastructure/   implementações concretas: localStorage e gerador aleatório com semente
  content/          dados do jogo: mapa, catálogo de lotes, ações, eventos, lições e fontes
  features/         UI por funcionalidade (landing, game, results)
  app/              rotas do Next.js (/, /jogar, /resultado)
  styles/           design tokens
```

Princípios aplicados:

- **Responsabilidade única:** cada serviço de domínio faz uma coisa; componentes renderizam e a sessão orquestra.
- **Aberto/fechado:** novas ações e eventos são só novos itens em `src/content`, sem mexer no motor.
- **Inversão de dependência:** os use-cases recebem `GameRules`, `GameRepository` e `RandomSource` como abstrações. Os testes usam implementações falsas.
- **Determinismo:** cada turno usa uma semente própria, então recarregar a página não muda o resultado.
- **Estado imutável:** a sessão expõe snapshots para `useSyncExternalStore`, sem efeitos para sincronizar estado.

## Modelo e fontes

Os números da cidade são fictícios e o modelo é propositalmente simplificado, com fim educativo.
As explicações se baseiam em:

- [IPCC AR6: Mitigação (GT III)](https://www.ipcc.ch/report/ar6/wg3/), [Adaptação (GT II)](https://www.ipcc.ch/report/ar6/wg2/) e [Relatório Síntese](https://www.ipcc.ch/report/ar6/syr/)
- [SEEG / Observatório do Clima](https://seeg.eco.br)
- [PNUMA: Global Methane Assessment](https://www.unep.org/resources/report/global-methane-assessment-benefits-and-costs-mitigating-methane-emissions)
- [ONU Brasil: ODS 13](https://brasil.un.org/pt-br/sdgs/13)
- Listras de aquecimento: [Ed Hawkins, #ShowYourStripes](https://showyourstripes.info)

## Autor

[@jonorusc](https://github.com/jonorusc)
