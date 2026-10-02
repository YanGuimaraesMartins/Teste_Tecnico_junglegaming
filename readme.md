# 🏴‍☠️ Pirate Battle - Space Edition

Bem-vindo ao **Pirate Battle**, um jogo de batalha espacial 2D construído com **React**, **TypeScript** e **PixiJS**, desenvolvido como parte do desafio técnico.

## 🚀 Tecnologias e Stack

- **Framework UI:** React 18 + Vite
- **Game Engine:** PixiJS v8
- **Linguagem:** TypeScript (Strict Mode)
- **Gerenciamento de Estado/HTTP:** TanStack Query v5 + Axios
- **Mocking de Rede:** Mock Service Worker (MSW v2)
- **Testes E2E:** Playwright

## 🛠️ Comandos Disponíveis

| Comando | Descrição |
| --- | --- |
| `npm install` | Instala todas as dependências |
| `npm run dev` | Inicia o servidor de desenvolvimento na porta 5173 |
| `npm run build` | Compila o projeto (com validação TypeScript strict) |
| `npm run preview` | Serve os arquivos de build locais gerados |
| `npm run lint` | Executa o ESLint para encontrar e corrigir problemas |
| `npm run typecheck` | Roda o compilador TypeScript apenas checando tipos |
| `npx playwright test` | Executa a suíte de testes ponta a ponta (E2E) |

## 🎮 Como Jogar (Controles)

- **W** / **S**: Acelerar e Frear
- **A** / **D**: Rotacionar a nave (Esquerda/Direita)
- **Espaço**: Atirar com o Canhão Frontal
- **Q** / **E**: Atirar com Canhões Laterais (Múltiplos tiros)
- **P**: Pausar/Despausar o jogo manualmente
- *(Suporte completo à controles por touch em dispositivos Mobile através de D-Pad Virtual e Botões na tela).*

## ⚙️ Variáveis de Ambiente e MSW

O projeto usa o **Mock Service Worker (MSW)** para interceptar todas as requisições HTTP (Leaderboard, Histórico, Submissão de Partidas).

O ambiente suporta simulação de vários cenários de rede diretamente pelo `.env` ou pelo Widget flutuante no app:

```env
VITE_MSW_SCENARIO=success
```

### Cenários Disponíveis:
- `success` - Respostas HTTP normais (Default)
- `empty` - Retorna arrays vazios de Leaderboard
- `slow` - Aplica um atraso considerável (~3s) para simular lentidão de rede
- `timeout` - Causa timeout explícito nas chamadas (Playwright timeout)
- `network-error` - Causa falha generalizada de conexão (Network Error)
- `ranking-fail` - Falha somente ao tentar obter Rankings
- `paginated` - Injeta dados falsos (fakes) preenchendo as páginas de history e leaderboard

**Como testar In-Game:**
Enquanto você estiver rodando o ambiente (`npm run dev`), no canto inferior direito aparecerá um **Botão do MSW**. Você pode trocar dinamicamente de cenários para ver como a UI lida com estados de Carregamento (`slow`), Erro (`network-error`) ou Vazio (`empty`).

## ⚖️ Configuração de Gameplay

No menu do jogo, você tem acesso às **Opções**:
- **Duração da Partida**: O tempo máximo até o Game Over por Timeout.
- **Intervalo de Spawn**: De quanto em quanto tempo um novo inimigo vai surgir na tela (quanto menor o intervalo, mais rápida a tela será infestada).

*Tais configs são salvas diretamente no `localStorage` do navegador para a próxima jogatina.*

## 🧪 Recuperação de Partidas (Pending Matches)

Caso a internet caia no momento do Fim da Partida (quando o resultado seria enviado para o Leaderboard), a requisição irá falhar, porém o React Query salvará uma cópia "Pendente" do payload no `localStorage`.
Quando o jogo recarregar em uma conexão ativa, um hook silencioso verificará envios pendentes e fará as requisições em background para você! Idempotência assegurada por `matchId` via UUID.