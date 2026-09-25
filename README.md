<h1 align="center">OUR COMMIT</h1> <p align="center">
<b>Mensagens de commit melhores, sem tirar o controle do desenvolvedor.</b>  

  CLI em TypeScript que analisa o diff em staging e usa IA para sugerir mensagens no padrão Conventional Commits.
</p> <p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Anthropic-191919?style=flat&logo=anthropic&logoColor=white" alt="Anthropic" />
  <img src="https://img.shields.io/badge/OpenAI-412991?style=flat&logo=openai&logoColor=white" alt="OpenAI" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat" alt="MIT License" />
</p> <p align="center">
  <a href="https://github.com/enthonydev/OUR-COMMIT">Repositório</a> ·
  <a href="https://www.conventionalcommits.org/">Conventional Commits</a>
</p>




Sobre

Escrever boas mensagens de commit de forma consistente é uma tarefa repetitiva. O OUR COMMIT automatiza essa parte sem executar commits inesperados: por padrão, ele apenas mostra a sugestão. A aplicação da mensagem só acontece quando a flag --apply é informada explicitamente.

O CLI trabalha apenas com as alterações que já estão em staging. Assim, a mensagem gerada representa exatamente o conteúdo que está preparado para entrar no commit.

Como funciona

Plain Text


git add <arquivos>
      │
      ▼
git diff --staged  ──►  prompt estruturado  ──►  Claude ou OpenAI  ──►  mensagem sugerida
                                                                            │
                                                              (opcional ) git commit -m



1.
gitDiff.ts lê o git diff --staged e lista os arquivos preparados.

2.
promptBuilder.ts monta o prompt com as regras do Conventional Commits e injeta o diff.

3.
llmProvider.ts abstrai a chamada HTTP para a Anthropic ou a OpenAI.

4.
index.ts interpreta as opções, valida o staging e a chave de API, gera a sugestão e, com --apply, cria o commit.

Stack

<p>
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/dotenv-ECD53F?style=flat&logoColor=black" alt="dotenv" />
  <img src="https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white" alt="Git" />
  <img src="https://img.shields.io/badge/Anthropic_API-191919?style=flat&logo=anthropic&logoColor=white" alt="Anthropic API" />
  <img src="https://img.shields.io/badge/OpenAI_API-412991?style=flat&logo=openai&logoColor=white" alt="OpenAI API" />
</p>

Instalação

Bash


git clone https://github.com/enthonydev/OUR-COMMIT.git
cd OUR-COMMIT
npm install
cp .env.example .env



O diretório dist/ é gerado durante o build e não é versionado. Depois de instalar as dependências, compile o código TypeScript:

Bash


npm run build



A versão compilada do CLI pode ser executada com:

Bash


npm start



O comando npm start executa dist/index.js. Sempre que alterar arquivos em src/, rode npm run build novamente antes de usar npm start.

Configuração

Edite o arquivo .env e preencha uma das chaves abaixo:

Plain Text


# Provedor padrão: anthropic ou openai
OUR_COMMIT_PROVIDER=anthropic

# Escolha uma das chaves de API
ANTHROPIC_API_KEY=
OPENAI_API_KEY=



O provedor padrão é definido por OUR_COMMIT_PROVIDER. As flags --anthropic e --openai permitem escolher o provedor diretamente durante a execução.

Uso

Primeiro, adicione as alterações que deseja analisar:

Bash


git add src/algumArquivo.ts



Com o projeto compilado, execute:

Bash


npm start                    # mostra a mensagem sugerida
npm start -- --apply         # gera a mensagem e cria o commit
npm start -- --openai        # usa OpenAI em vez de Claude
npm start -- --en            # gera a mensagem em inglês



Durante o desenvolvimento, também é possível executar o código TypeScript diretamente:

Bash


npm run dev



Se não houver alterações em staging, o CLI encerra sem chamar a API e informa que é necessário executar git add antes.

Regras da mensagem gerada

•
Segue o padrão .

•
Usa tipos como feat, fix, refactor, docs, test, chore, style e perf.

•
Mantém a primeira linha com no máximo 72 caracteres.

•
Usa o modo imperativo.

•
Responde em português do Brasil por padrão.

•
Pode responder em inglês com --en.

•
Não inventa funcionalidade que não esteja presente no diff.

•
Trunca diffs maiores que 12.000 caracteres e avisa sobre o truncamento.

Estrutura do projeto

Plain Text


.
├── src/
│   ├── gitDiff.ts        # leitura do diff em staging
│   ├── index.ts          # entrada e orquestração do CLI
│   ├── llmProvider.ts    # integração com Anthropic e OpenAI
│   └── promptBuilder.ts   # construção do prompt
├── .env.example          # modelo de configuração sem secrets
├── package.json          # scripts e configuração do pacote
├── package-lock.json     # versões fixadas das dependências
└── tsconfig.json         # configuração do TypeScript



Decisões técnicas

•
TypeScript com execSync: usa o próprio binário git sem adicionar uma biblioteca específica para operações simples de diff e commit.

•
Provider abstraído: mantém o restante do programa independente da API usada para gerar texto.

•
Diff limitado a 12.000 caracteres: evita estourar o contexto do modelo e reduz o custo de diffs excessivamente grandes.

•
Aplicação explícita: o CLI apenas sugere a mensagem por padrão; o commit só é criado com --apply.

Limitações conhecidas

•
Não analisa o histórico de commits anteriores para manter consistência de estilo.

•
Diffs binários, como imagens, não geram contexto útil para o modelo.

•
O projeto ainda não possui testes automatizados.

Contribuição

1.
Crie uma branch para sua alteração.

2.
Instale as dependências com npm install.

3.
Execute npm run build antes de abrir sua contribuição.

4.
Descreva claramente a alteração e inclua as validações executadas.

Referências

[1] Conventional Commits
[2] Anthropic API
[3] OpenAI API
Licença

Distribuído sob a licença MIT.

<p align="center">
Desenvolvido por <a href="https://github.com/enthonydev">Enthony Silva</a>
</p>

