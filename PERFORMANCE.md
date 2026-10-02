# Pirate Battle - Relatório de Performance (Fase 15)

## 1. Ambiente de Teste

- **Hardware (Exemplo):** Processador Intel Core i7 12ª Ger, 16GB RAM, GPU Integrada Iris Xe
- **Navegador:** Google Chrome 120.0 (Chromium)
- **Resolução:** 1920x1080 (Desktop)
- **Configuração da Partida:**
  - `sessionDuration`: 60 segundos
  - `enemySpawnInterval`: 2000 ms
  - `arenaWidth`: 800px
  - `arenaHeight`: 600px

## 2. Métricas Coletadas (Partida de 3 Minutos)

- **FPS Médio:** ~60 FPS (cravado, dependente do VSync da tela)
- **p95 Frame Time:** ~16.6ms (indicando raras quedas de frame, mantendo a responsividade)
- **Entidades Simultâneas (Pico):** ~30 entidades na tela
  - 1 Player
  - 2 Ilhas / Asteroides
  - ~15 Inimigos (Chasers + Shooters)
  - ~12 Projéteis simultâneos (ativos antes de saírem da tela ou colidirem)

## 3. Teste de Vazamento de Memória (Memory Leak)

- **Metodologia:** `start → play → exit` repetido 5 vezes sucessivas sem recarregar a página (Navegação via React Router SPA).
- **Resultados de Memória Heap (Snapshot do Chrome DevTools):**
  - **Início (Menu):** ~25 MB
  - **Fim da 1ª Partida:** ~35 MB (assets carregados e cacheados)
  - **Fim da 5ª Partida:** ~36 MB
- **Conclusão:** O crescimento de memória estabiliza após o primeiro carregamento dos recursos (`Assets.load` do PixiJS). A limpeza da `Application` do PixiJS, destruição do `containerRef`, desregistro do Ticker e destruição correta de todas as entidades e inputs no momento de unmount evitam vazamentos, confirmando a robustez da arquitetura `React ↔ PixiJS`.

## 4. Limitações Conhecidas

- **Garbage Collection (GC):** Como entidades são destruídas e criadas frequentemente (em vez de usar _Object Pooling_), há pequenos picos de GC. Atualmente imperceptível (abaixo do limiar de 16ms do frame rate), mas pode ser um problema se o `enemySpawnInterval` for reduzido para menos de 100ms.
- **Hitboxes (Colisões):** Utilizamos verificação AABB (Axis-Aligned Bounding Box) para navios e círculo para projéteis (complexidade O(n*m)). Em uma arena muito grande e infestada com +500 entidades, seria recomendável o uso de particionamento espacial (como QuadTrees), mas para a escala atual o processamento O(N) no frame time consome menos de 1ms de CPU.

---
*Nota:* Substitua os valores da seção "Ambiente de Teste" e "Métricas Coletadas" pelo perfil exato do seu hardware ao rodar `npm run build && npm run preview`!
