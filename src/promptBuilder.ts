/**
 * Monta o prompt enviado ao modelo. Isolar isso numa função própria
 * facilita ajustar o "estilo" das mensagens geradas sem mexer no
 * resto da lógica do programa.
 */
export function buildCommitPrompt(
  diff: string,
  fileNames: string[],
  language: "pt" | "en"
): string {
  const filesList = fileNames.length
    ? fileNames.join("\n")
    : "(nenhum arquivo em staging encontrado)";

  const instructions =
    language === "pt"
      ? `Você é um assistente que escreve mensagens de commit git no padrão
Conventional Commits (tipo: descrição curta, depois corpo opcional).
Tipos válidos: feat, fix, refactor, docs, test, chore, style, perf.

Regras:
- A primeira linha tem no máximo 72 caracteres.
- Use o imperativo ("adiciona", "corrige", "remove"), não passado.
- Se o diff tocar várias coisas não relacionadas, foque na mudança principal.
- Não invente funcionalidade que não está no diff.
- Responda em português do Brasil.
- Responda SOMENTE com a mensagem de commit, sem explicações extras.`
      : `You are an assistant that writes git commit messages following the
Conventional Commits standard (type: short description, optional body).
Valid types: feat, fix, refactor, docs, test, chore, style, perf.

Rules:
- First line is at most 72 characters.
- Use the imperative mood ("add", "fix", "remove"), not past tense.
- If the diff touches multiple unrelated things, focus on the main change.
- Do not invent functionality that isn't in the diff.
- Reply in English.
- Reply ONLY with the commit message, no extra explanation.`;

  return `${instructions}

Arquivos alterados:
${filesList}

Diff:
\`\`\`diff
${diff}
\`\`\`
`;
}
