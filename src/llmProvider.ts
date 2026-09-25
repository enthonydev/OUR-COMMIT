/**
 * Abstração simples sobre provedores de IA. A ideia é que o resto do
 * programa não precise saber se está falando com a API da Anthropic
 * ou da OpenAI — só pede "gera texto a partir desse prompt".
 */

export type Provider = "anthropic" | "openai";

interface GenerateOptions {
  provider: Provider;
  apiKey: string;
  prompt: string;
}

export async function generateText({
  provider,
  apiKey,
  prompt,
}: GenerateOptions): Promise<string> {
  if (provider === "anthropic") {
    return callAnthropic(apiKey, prompt);
  }
  return callOpenAI(apiKey, prompt);
}

async function callAnthropic(apiKey: string, prompt: string): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Erro na API da Anthropic (${response.status}): ${body}`);
  }

  const data = (await response.json()) as {
    content: { type: string; text?: string }[];
  };

  const textBlock = data.content.find((block) => block.type === "text");
  if (!textBlock?.text) {
    throw new Error("A resposta da Anthropic não trouxe texto utilizável.");
  }
  return textBlock.text.trim();
}

async function callOpenAI(apiKey: string, prompt: string): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Erro na API da OpenAI (${response.status}): ${body}`);
  }

  const data = (await response.json()) as {
    choices: { message: { content: string } }[];
  };

  const text = data.choices[0]?.message?.content;
  if (!text) {
    throw new Error("A resposta da OpenAI não trouxe texto utilizável.");
  }
  return text.trim();
}
