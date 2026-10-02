# 🏗️ Pirate Battle - Architecture

Este documento descreve as decisões arquiteturais fundamentais tomadas na construção deste desafio.

## 1. Relacionamento React ↔ PixiJS

A maior complexidade do projeto reside em integrar a reatividade do React com a mutabilidade exigida pela renderização imperativa do Canvas 2D (PixiJS).

**A Solução (`usePixiApp` Hook):**
Para evitar vazamentos de memória (Memory Leaks), problemas de referências cíclicas e re-renders indesejáveis na UI de estado global, encapsulamos a lógica da Engine do Jogo no hook isolado `usePixiApp`.
- Instanciamos a `Application` do PixiJS e a montamos na Referência (`useRef`) da DOM no primeiro `useEffect`.
- A interface gráfica pesada e a Engine do jogo operam de forma isolada. A Engine só repassa informações pontuais de estados (como HP, Score e Time) via Callbacks assíncronos (`onScoreUpdate`, `onHpUpdate`) diretamente pro hook, que dispara atualizações reativas seguras de interface apenas quando necessário para o React através de estados (useState).

## 2. Ciclo de Vida (Game Loop)

A Engine (`GameEngine.ts`) usa o próprio gerenciador embutido de frames do PixiJS (`app.ticker.add`) e trabalha estritamente atrelada ao **Delta Time** (`deltaSeconds`) em vez de FPS constante.
Isto significa que naves ou projéteis não viajarão distâncias relativas menores ou maiores caso a GPU do jogador comece a gerar frame-drops, garantindo física previsível para computadores fracos.

## 3. Sistema de Colisões (AABB e Círculos)

Para maximizar a precisão contra a performance:
- **AABB (Axis-Aligned Bounding Box):** É utilizado entre Entidades quadradas ou semi-quadradas (Islands, Naves), validando simplesmente `left < right && right > left`.
- **Círculos:** Utilizado para a colisão dos **Projéteis** no jogo. Por se tratar de partículas diminutas que chegam de qualquer ângulo rotacional, calcular o raio entre dois eixos `(dx*dx + dy*dy <= raio*raio)` resultou na detecção perfeita e barata, sem precisar gerar matrizes giratórias ou sat-trees (Seperating Axis Theorem).

## 4. Gerenciamento de Assets (Pixi Assets)

Em vez de poluir a memória subindo texturas e carregamentos estáticos para o topo da hierarquia, inserimos a `LoadingScreen.tsx`.
Ela acessa diretamente o módulo estático do PixiJS `Assets.load()`, enviando e preparando os buffers na VRAM de maneira centralizada e com rastreamento (`progress`) *antes* de injetar a classe `GameEngine`.
Isso não apenas impede travamentos in-game, como cria um cache instantâneo e duradouro no escopo principal.

## 5. TanStack Query & MSW (Network & Persistência)

Ao longo de requisições de Leaderboard (`GET /ranking`), Histórico (`GET /history`) e Envio de Partida (`POST /match`), fomos confrontados com os seguintes dilemas:

- **Idempotência no Envio de Score:** Como o MSW simula delays agressivos de rede (timeouts), seria normal a Engine mandar um `POST` contendo os scores da partida duas vezes em caso de Timeout, criando duas entradas clonadas. Para contornar, o React Query envia um UUID único (`matchId`) recém gerado antes de qualquer repetição de envio, mantendo assim o Back-end Mock livre de duplicações indesejadas (O MSW ignora matches recém registradas com mesmo ID).
- **Recuperação Categórica de Scores:** O MSW foi instrumentado para simular Falhas Críticas de Rede (`network-error`). Quando isso acontece durante o Final de uma partida, o React Query salva explicitamente um backup local desse Payload em "Status de Falha" no `localStorage`. Ao dar refresh na aplicação, um interceptador age instantaneamente tentando re-enviar a Partida em Segundo Plano para Leaderboards, restaurando todo o valor do Player!

## 6. Decisões de Balanceamento e Limitações

- Foi implementado Cooldowns individuais e tempos variados entre "Tiros Frontais" (Rápidos) e "Tiros Laterais" (Lentos, de controle de grupo).
- A Inteligência Artificial (Enemy.ts) prioriza se movimentar e se chocar com obstáculos *e desfazer o movimento* do que tentar calcular trilhas predefinidas e pesadas (Pathfinding, A*), pois a fluidez e a infestação visual de inimigos importa mais em um Arcade Shooter 2D deste escopo.

**Limitação Central (O(n*m)):** Pelo jogo ser em um plano totalmente aberto, todos os loopings da engine conferem colisões de 1:Para:Todos (Big O=N²). Em um futuro distante, a aplicação de particionamento estático espacial como QuadTrees melhoraria drasticamente se a tela chegasse a abrigar milhares de entidades conjuntas (Bullets-hell style). No modelo atual de balanceamento com o `SpawnInterval`, isso mal toca ~1ms de CPU e não é perceptível.
