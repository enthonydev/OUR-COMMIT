import { execSync } from "node:child_process";

/**
 * Lê o diff dos arquivos que já estão em staging (git add).
 * Usamos --staged porque é isso que efetivamente vai entrar no commit.
 */
export function getStagedDiff(): string {
  try {
    const diff = execSync("git diff --staged --unified=3", {
      encoding: "utf-8",
      maxBuffer: 1024 * 1024 * 10, // 10MB, o suficiente pra diffs grandes
    });
    return diff.trim();
  } catch (error) {
    throw new Error(
      "Não foi possível ler o diff. Você está dentro de um repositório git?"
    );
  }
}

/**
 * Lista os nomes dos arquivos alterados em staging, pra dar contexto
 * extra ao modelo além do diff bruto (ajuda em diffs grandes/truncados).
 */
export function getStagedFileNames(): string[] {
  const output = execSync("git diff --staged --name-status", {
    encoding: "utf-8",
  }).trim();

  if (!output) return [];
  return output.split("\n").map((line) => line.trim());
}

/**
 * Corta o diff se ele for gigante, pra não estourar o limite de contexto
 * do modelo nem gastar tokens à toa. Mantém o início (normalmente onde
 * estão as mudanças mais relevantes) e avisa que foi truncado.
 */
export function truncateDiff(diff: string, maxChars = 12000): string {
  if (diff.length <= maxChars) return diff;
  return (
    diff.slice(0, maxChars) +
    "\n\n[... diff truncado por tamanho; considere commits menores ...]"
  );
}
