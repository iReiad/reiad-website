/* ============================================================
   functions/_lib/assistant.ts: the assistant's Worker half.
   RESEARCH.md section 21.

   One key (ANTHROPIC_API_KEY, a wrangler secret) and one model, the
   current default for demanding work, with the task's effort as the
   knob; adaptive thinking is on by default on it and is left so.
   Raw HTTP rather than the SDK on purpose: the root package.json's
   rule is that nothing it lists is imported by either Worker, and
   wrangler bundles from it. The request streams, the answer is
   handed to the browser as the same server-sent events, and the
   usage on the last event is what the browser prices. Embeddings
   are Workers AI's multilingual bge-m3 on the AI binding; without
   it the search box is full text only and says so.
   ============================================================ */

export interface AssistantEnv { ANTHROPIC_API_KEY?: string; AI?: { run: (model: string, input: Record<string, unknown>) => Promise<unknown> } }

export const canAssist = (env: AssistantEnv): boolean => Boolean(env.ANTHROPIC_API_KEY);
export const canEmbed = (env: AssistantEnv): boolean => Boolean(env.AI);

export const MODEL = "claude-opus-5";
const VERSION = "2023-06-01";
const MAX_TOKENS = 8000;

export interface Ask { system: string; messages: { role: "user" | "assistant"; content: string }[]; effort: "low" | "medium" | "high" | "xhigh" }

/** The model's stream, as the API sends it. `fallbacks: "default"`
    routes a policy decline to a fallback model inside the same
    call, which is the API's own recommendation for this model. */
export async function ask(env: AssistantEnv, a: Ask): Promise<Response> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY ?? "",
      "anthropic-version": VERSION,
      "anthropic-beta": "server-side-fallback-2026-07-01",
      accept: "text/event-stream",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      stream: true,
      fallbacks: "default",
      output_config: { effort: a.effort },
      system: [{ type: "text", text: a.system, cache_control: { type: "ephemeral" } }],
      messages: a.messages.map((m) => ({ role: m.role, content: m.content })),
    }),
    signal: AbortSignal.timeout(180000),
  });
  return res;
}

/** Embeddings for up to a hundred texts, 1024 wide. */
export async function embed(env: AssistantEnv, texts: string[]): Promise<number[][] | null> {
  if (!env.AI || !texts.length) return null;
  const answer = await env.AI.run("@cf/baai/bge-m3", { text: texts.slice(0, 100).map((t) => t.slice(0, 4000)) }) as { data?: number[][] } | null;
  return Array.isArray(answer?.data) ? answer.data : null;
}
