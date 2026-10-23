#!/usr/bin/env node
import "dotenv/config";
import { execFileSync } from "node:child_process";
import { getStagedDiff, getStagedFileNames, truncateDiff } from "./gitDiff.js";
import { buildCommitPrompt } from "./promptBuilder.js";
import { generateText, type Provider } from "./llmProvider.js";

interface CliOptions {
  provider: Provider | "local";
  language: "pt" | "en";
  apply: boolean;
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    provider: (process.env.OUR_COMMIT_PROVIDER as Provider) || "anthropic",
    language: "pt",
    apply: false,
  };

  for (const arg of argv) {
    if (arg === "--local") options.provider = "local";
    else if (arg === "--openai") options.provider = "openai";
    if (arg === "--anthropic") options.provider = "anthropic";
    if (arg === "--en") options.language = "en";
    if (arg === "--apply") options.apply = true;
    if (arg === "--help" || arg === "-h") {
      console.log("Uso: our-commit [--local | --openai | --anthropic] [--en] [--apply]");
      process.exit(0);
    }
    if (arg.startsWith("-") && !["--local","--openai","--anthropic","--en","--apply","--help","-h"].includes(arg)) throw new Error(`Opção desconhecida: ${arg}`);
  }

  return options;
}

function getApiKey(provider: Provider): string {
  const key =
    provider === "anthropic"
      ? process.env.ANTHROPIC_API_KEY
      : process.env.OPENAI_API_KEY;

  if (!key) {
    console.error(
      `\n❌ Faltando a variável de ambiente ${
        provider === "anthropic" ? "ANTHROPIC_API_KEY" : "OPENAI_API_KEY"
      }.\n   Copie .env.example para .env e preencha sua chave.\n`
    );
    process.exit(1);
  }
  return key;
}

function suggestLocalMessage(files: string[], language: "pt" | "en"): string {
  const paths = files.map((line) => line.replace(/^[A-Z?]+\\s+/, ""));
  const docsOnly = paths.every((path) => path.endsWith(".md") || path.startsWith("docs/"));
  const testsOnly = paths.every((path) => path.includes("test") || path.includes("spec"));
  const type = docsOnly ? "docs" : testsOnly ? "test" : "chore";
  const description = language === "en"
    ? docsOnly ? "update documentation" : testsOnly ? "update tests" : "update staged files"
    : docsOnly ? "atualiza documentação" : testsOnly ? "atualiza testes" : "atualiza arquivos preparados";
  return `${type}: ${description}`;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  const diff = getStagedDiff();
  if (!diff) {
    console.log(
      "\nNenhuma mudança em staging. Rode `git add <arquivos>` antes de usar o our-commit.\n"
    );
    return;
  }

  const fileNames = getStagedFileNames();
  const truncated = truncateDiff(diff);
  const prompt = buildCommitPrompt(truncated, fileNames, options.language);
  const apiKey = options.provider === "local" ? "" : getApiKey(options.provider);

  console.log(`\n🤖 Gerando mensagem de commit com ${options.provider}...\n`);

  const message = options.provider === "local"
    ? suggestLocalMessage(fileNames, options.language)
    : await generateText({ provider: options.provider, apiKey, prompt });

  console.log("── Mensagem sugerida ──────────────────────────");
  console.log(message);
  console.log("────────────────────────────────────────────────\n");

  if (options.apply) {
    execFileSync("git", ["commit", "-m", message], { stdio: "inherit" });
    console.log("✅ Commit criado.\n");
  } else {
    console.log(
      "Dica: rode com --apply pra já criar o commit com essa mensagem.\n" +
        "Exemplo: our-commit --apply\n"
    );
  }
}

main().catch((error) => {
  console.error(`\n❌ ${error.message}\n`);
  process.exit(1);
});
