<div align="center">

# OUR COMMIT

**Mensagens de commit melhores, sem tirar o controle do desenvolvedor.**

CLI em TypeScript que analisa o diff em staging e usa IA para sugerir mensagens no padrão Conventional Commits.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Anthropic](https://img.shields.io/badge/Anthropic-191919?style=flat&logo=anthropic&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat&logo=openai&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

[Repositório](https://github.com/enthonydev/OUR-COMMIT) · [Conventional Commits](https://www.conventionalcommits.org/)

</div>

---

## Sobre

Escrever boas mensagens de commit de forma consistente é uma tarefa repetitiva e por vezes desafiadora até na escolha dos títulos e descrição. Pensando nisso desenvolvi como projeto de estudo e também ferramenta de uso no dia a dia o **OUR COMMIT**, que automatiza essa parte sem tirar o controle do dev.

A ferramenta analisa somente as alterações que já estão em **staging** e gera uma sugestão de mensagem baseada exatamente no conteúdo preparado para o próximo commit.

Por padrão, o OUR COMMIT **apenas exibe a sugestão**. O commit só é criado quando a flag `--apply` é informada explicitamente.

---

## Como funciona

```
git add <arquivos>
        │
        ▼
git diff --staged
        │
        ▼
Prompt estruturado
        │
        ▼
Claude ou OpenAI
        │
        ▼
Mensagem de commit
        │
        └── --apply ──► git commit
```

O fluxo é dividido em quatro partes:

1. `gitDiff.ts` lê o `git diff --staged` e identifica os arquivos preparados.
2. `promptBuilder.ts` monta o prompt seguindo as regras do Conventional Commits.
3. `llmProvider.ts` abstrai a comunicação com Anthropic e OpenAI.
4. `index.ts` controla o CLI, valida o ambiente, gera a sugestão e, opcionalmente, cria o commit.

---

## Stack

- **TypeScript**
- **Node.js**
- **Git**
- **dotenv**
- **Anthropic API**
- **OpenAI API**

---

## Instalação

Clone o repositório:

```bash
git clone https://github.com/enthonydev/OUR-COMMIT.git
cd OUR-COMMIT
```

Instale as dependências:

```bash
npm install
```

Crie seu arquivo de configuração:

### Linux / macOS

```bash
cp .env.example .env
```

### Windows

```powershell
copy .env.example .env
```

Compile o projeto:

```bash
npm run build
```

O diretório `dist/` é gerado durante o build e não é versionado.

---

## Configuração

Abra o arquivo `.env` e configure o provedor que deseja utilizar:

```env
# Provedor padrão: anthropic ou openai
OUR_COMMIT_PROVIDER=anthropic

# Preencha apenas a chave do provedor que deseja utilizar
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
```

Você precisa configurar **apenas uma chave de API** para utilizar o respectivo provedor.

O provedor padrão é definido por `OUR_COMMIT_PROVIDER`, mas também pode ser escolhido diretamente pelas flags `--anthropic` e `--openai`.

> E vai uma regra de boa prática que o dev que vos fala teve que aprender na raça, NUNCA versione seu arquivo `.env`. Ele guarda suas credenciais/keys (chaves) privadas e por questões de segurança do seu projeto não deve ser colocado no github. E já está incluído no `.gitignore`.

---

## Uso

Primeiro, adicione ao staging as alterações que deseja analisar:

```bash
git add src/algumArquivo.ts
```

Ou adicione todas as alterações:

```bash
git add .
```

Depois, execute o OUR COMMIT:

```bash
npm start
```

O CLI analisa o staging e exibe uma mensagem sugerida:

```text
── Mensagem sugerida ──────────────────────────
feat: adiciona suporte à autenticação do usuário
────────────────────────────────────────────────
```

Nenhum commit é criado automaticamente.

### Criar o commit

Para aplicar a mensagem sugerida diretamente:

```bash
npm start -- --apply
```

### Usar OpenAI

```bash
npm start -- --openai
```

### Usar Anthropic

```bash
npm start -- --anthropic
```

### Gerar mensagem em inglês

```bash
npm start -- --en
```

As opções também podem ser combinadas:

```bash
npm start -- --openai --en --apply
```

---

## Durante o desenvolvimento

O projeto também pode ser executado diretamente pelo TypeScript:

```bash
npm run dev
```

Sempre que alterar arquivos em `src/`, execute novamente:

```bash
npm run build
```

antes de utilizar a versão compilada através de `npm start`.

---

## CLI global

O pacote já define o executável:

```text
our-commit
```

Depois de compilar o projeto, durante o desenvolvimento você pode disponibilizar globalmente com:

```bash
npm link
```

Assim, dentro de qualquer repositório Git, basta executar:

```bash
our-commit
```

Ou:

```bash
our-commit --apply
```

“E para remover o link global posteriormente, como faço?”:

```bash
npm unlink -g our-commit
```

---

## Opções

| Opção | Descrição |
|---|---|
| `--apply` | Cria o commit usando a mensagem gerada |
| `--openai` | Utiliza a OpenAI como provedor |
| `--anthropic` | Utiliza a Anthropic como provedor |
| `--en` | Gera a mensagem em inglês |

Sem nenhuma flag, o CLI utiliza o provedor configurado em `OUR_COMMIT_PROVIDER` e gera a mensagem em português.

---

## Conventional Commits

As mensagens seguem o padrão:

```text
tipo: descrição
```

Exemplos:

```text
feat: adiciona autenticação de usuário
fix: corrige validação do formulário
refactor: simplifica processamento do diff
docs: atualiza instruções de instalação
```

Os tipos permitidos atualmente são:

| Tipo | Uso |
|---|---|
| `feat` | Nova funcionalidade |
| `fix` | Correção |
| `refactor` | Refatoração sem alterar comportamento |
| `docs` | Documentação |
| `test` | Testes |
| `chore` | Manutenção e tarefas auxiliares |
| `style` | Alterações de estilo sem mudança de lógica |
| `perf` | Melhorias de performance |

Além disso, o prompt orienta o modelo a:

- manter a primeira linha com no máximo 72 caracteres;
- utilizar o modo imperativo;
- representar somente alterações presentes no diff;
- priorizar a mudança principal quando houver alterações não relacionadas;
- responder somente com a mensagem de commit.

---

## Diffs grandes

Para evitar o envio desnecessário de grandes volumes de conteúdo para o provedor, o OUR COMMIT limita o diff enviado ao modelo a **12.000 caracteres**.

Quando esse limite é ultrapassado, o conteúdo é truncado e sinalizado no próprio contexto enviado ao modelo.

Os nomes dos arquivos em staging continuam sendo enviados como contexto adicional.

Para alterações muito grandes ou não relacionadas, prefira dividir o trabalho em commits menores.

---

## Estrutura do projeto

```text
.
├── src/
│   ├── gitDiff.ts
│   ├── index.ts
│   ├── llmProvider.ts
│   └── promptBuilder.ts
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

### `gitDiff.ts`

Responsável por ler o diff e os arquivos presentes no staging.

### `promptBuilder.ts`

Constrói as instruções enviadas ao modelo e define as regras das mensagens geradas.

### `llmProvider.ts`

Centraliza a comunicação com os provedores Anthropic e OpenAI.

### `index.ts`

Entrada principal do CLI. Processa argumentos, valida configurações e coordena todo o fluxo.

---

## Decisões técnicas

**TypeScript + Git nativo**

O projeto utiliza o próprio executável `git` através de `execSync`, evitando adicionar uma biblioteca específica para operações simples de diff e commit.

**Provedores desacoplados**

A comunicação com os modelos fica isolada em `llmProvider.ts`, permitindo que o restante da aplicação não dependa diretamente de uma API específica.

**Aplicação explícita**

A geração da mensagem e a criação do commit são ações separadas. O usuário mantém controle sobre quando uma mensagem será efetivamente aplicada.

**Limite de contexto**

Diffs extensos são truncados para reduzir o envio desnecessário de conteúdo e evitar requisições excessivamente grandes.

---

## Limitações conhecidas

- Não analisa o histórico de commits anteriores para reproduzir o estilo do repositório.
- Diffs binários, como imagens, não fornecem contexto textual útil.
- Diffs acima de 12.000 caracteres são truncados.
- O projeto ainda não possui testes automatizados.
- O uso requer uma chave válida da Anthropic ou OpenAI.

---

## Scripts

| Comando | Descrição |
|---|---|
| `npm run build` | Compila o TypeScript para `dist/` |
| `npm start` | Executa a versão compilada |
| `npm run dev` | Executa diretamente pelo TypeScript com `tsx` |

---

## Contribuição

Contribuições são muito bem-vindas e ajudam demais no desenvolvimento mútuo. Deixe a sua!

1. Faça um fork do projeto.
2. Crie uma branch para sua alteração.
3. Instale as dependências com `npm install`.
4. Implemente a alteração.
5. Execute `npm run build`.
6. Abra um Pull Request descrevendo o que foi alterado e como foi validado.

---

## Referências

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Anthropic API](https://docs.anthropic.com/)
- [OpenAI API](https://platform.openai.com/docs/)
- [TypeScript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/)

---

## Licença

Distribuído sob a licença MIT.

---

<div align="center">

Desenvolvido por [Enthony Silva](https://github.com/enthonydev)

**OUR COMMIT**

*Seu código muda. Sua mensagem explica.*

</div>
