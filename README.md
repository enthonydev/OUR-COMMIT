# OUR COMMIT

CLI em TypeScript que lê o `git diff` dos arquivos em staging e usa IA (Claude ou OpenAI) para gerar uma mensagem de commit no padrão [Conventional Commits](https://www.conventionalcommits.org/).

Nasceu de um problema real: escrever boas mensagens de commit consistentemente é chato e a maioria de nós relaxa depois de um tempo ("fix", "ajustes", "wip"). A ideia aqui é automatizar a parte repetitiva sem tirar o controle do desenvolvedor — a mensagem é sempre mostrada antes de qualquer commit ser criado.

## Como funciona

```
git add <arquivos>
      │
      ▼
git diff --staged  ──►  prompt estruturado  ──►  API (Claude ou OpenAI)  ──►  mensagem sugerida
                                                                                   │
                                                                     (opcional) git commit -m
```

1. **`gitDiff.ts`** lê o diff do que está em staging via `execSync("git diff --staged")` — e só o que está em staging, porque é isso que de fato vai pro commit.
2. **`promptBuilder.ts`** monta um prompt com regras claras (Conventional Commits, imperativo, limite de 72 caracteres na primeira linha) e injeta o diff.
3. **`llmProvider.ts`** abstrai a chamada HTTP — o resto do código não sabe (nem precisa saber) se está falando com a Anthropic ou a OpenAI.
4. **`index.ts`** orquestra tudo, trata os casos de erro (sem staging, sem chave de API, erro da API) e, com a flag `--apply`, já cria o commit.

## Instalação

```bash
git clone https://github.com/enthonydev/OUR-COMMIT.git
cd our-commit
npm install
cp .env.example .env
# edite o .env e cole sua ANTHROPIC_API_KEY ou OPENAI_API_KEY
```

## Uso

```bash
git add src/algumArquivo.ts

npx tsx src/index.ts              # mostra a mensagem sugerida
npx tsx src/index.ts --apply      # gera e já cria o commit
npx tsx src/index.ts --openai     # usa OpenAI em vez de Claude
npx tsx src/index.ts --en         # gera a mensagem em inglês
```

## Decisões técnicas

- **TypeScript + `execSync`, sem dependências de git além do próprio binário `git`**: evita depender de bibliotecas de terceiros (como `simple-git`) para uma tarefa simples, reduzindo a superfície de coisas que podem quebrar.
- **Provider abstraído (`llmProvider.ts`)**: troquei de "só Claude" para "Claude ou OpenAI" cedo no design porque isso deixa claro pra quem lê o código qual é o contrato entre o CLI e o modelo de IA, sem acoplar tudo a uma API específica.
- **Diff truncado em 12.000 caracteres**: diffs muito grandes estouram o contexto do modelo e custam mais tokens à toa; o ideal é commits pequenos, então o CLI avisa em vez de silenciosamente cortar sem dizer nada.
- **A mensagem nunca é aplicada sem confirmação implícita do usuário**: por padrão o CLI só mostra a sugestão. Só cria o commit de fato com `--apply` explícito.

## Limitações conhecidas

- Não analisa o histórico de commits anteriores para manter consistência de estilo ao longo do tempo.
- Diffs binários (imagens, por exemplo) não geram contexto útil pro modelo.
- Sem testes automatizados ainda — próximo passo natural do projeto.

## Stack

TypeScript · Node.js · Anthropic API · OpenAI API · dotenv
