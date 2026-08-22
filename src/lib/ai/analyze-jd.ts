import { createServerFn } from "@tanstack/react-start";

export interface AnalyzedSkill {
  name: string;
  importance: "must" | "nice";
  matchedId?: string;
}

export interface AnalyzeResult {
  ok: true;
  seniority: string;
  keywords: string[];
  skills: AnalyzedSkill[];
  summary: string;
}

export interface AnalyzeFail {
  ok: false;
  error: string;
}

export const analyzeJd = createServerFn({ method: "POST" })
  .validator(
    (input: {
      jd: string;
      company?: string;
      title?: string;
      catalog: { id: string; name: string; aliases: string[] }[];
    }) => input,
  )
  .handler(async ({ data }): Promise<AnalyzeResult | AnalyzeFail> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false, error: "AI is not available in this environment" };

    const catalog = data.catalog
      .map((s) => `${s.id}: ${s.name} [${s.aliases.join(", ")}]`)
      .join("\n");

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 700,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You extract structured hiring signals from job descriptions. Return JSON only. Prefer matching the provided skill catalog ids. Never invent salary. Be conservative with must-haves.",
          },
          {
            role: "user",
            content: `Company: ${data.company ?? ""}
Title: ${data.title ?? ""}

Skill catalog (id: name [aliases]):
${catalog}

Job description:
${data.jd.slice(0, 8000)}

Return JSON:
{
  "seniority": "Junior|Mid|Mid-Senior|Senior|Staff+",
  "keywords": ["up to 6 short keywords"],
  "skills": [{"name":"catalog name or new skill","importance":"must"|"nice","matchedId":"catalog id or omit"}],
  "summary": "one sentence on what this role actually buys"
}`,
          },
        ],
      }),
    });

    if (!res.ok) return { ok: false, error: `xAI API error ${res.status}` };

    const body = (await res.json()) as {
      choices: { message: { content: string } }[];
    };
    const text = body.choices[0]?.message.content ?? "";
    try {
      const parsed = JSON.parse(text) as {
        seniority?: string;
        keywords?: string[];
        skills?: AnalyzedSkill[];
        summary?: string;
      };
      return {
        ok: true,
        seniority: parsed.seniority ?? "Mid",
        keywords: (parsed.keywords ?? []).slice(0, 8),
        skills: parsed.skills ?? [],
        summary: parsed.summary ?? "",
      };
    } catch {
      return { ok: false, error: "Could not parse model output" };
    }
  });
