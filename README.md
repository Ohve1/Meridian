# Meridian

Career market intelligence OS.

The labour market tells you what is valuable. Your evidence tells you what you can prove. Meridian tells you what to do next.

It is a **decision layer** between the labour market and your evidence — not a job tracker, Notion clone, CV generator, job board, or trend dashboard.

## MVP

The only question: *What should I do next, given the current market and my evidence?*

Core loop:

Market signal → Job / skill demand → Evidence gap → Next action → Application → Outcome

V1 supports:

1. Add / import a Job (manual JD paste)
2. Extract required Skills
3. Store Evidence
4. Match Evidence against the JD
5. Detect evidence gaps
6. Rank a Next Action
7. Track the Application

## Ontology

| Object | Meaning |
| --- | --- |
| **Technology** | What exists in the market (MCP, eval harnesses) |
| **Skill** | What employers ask for (tool orchestration, LLM evaluation) |
| **Evidence** | What you can prove you have done |
| **MarketSignal** | A JD, paper, GitHub event, Reddit thread, or hype post — never mixed across tiers |

Job → requires Skill. Evidence → proves Skill. MarketSignal → indicates Technology / Skill demand.

## Signal hierarchy

Demand ≠ technology momentum ≠ social attention.

1. **Demand** — JDs, career pages, recruiter posts  
2. **Technology** — GitHub, papers, Kaggle  
3. **Practitioner** — Reddit, X, LinkedIn  
4. **Hype** — viral news (never averaged with demand)

V1 ingestion is **manual** (JD paste, evidence entry, optional URL). Schema is ready for later sources. No scraping.

## Next action

Today is the home screen. Every recommended action has why, target, evidence gap, effort, and expected outcome.

Action value is computed, not an LLM opinion:

`Demand × Job relevance × Evidence gap × Jobs affected ÷ Effort`

## Run it

```bash
npm install
npm run dev
```

Demo data is seeded for a London AI Engineer / AI Product search. **Reset demo** restores it.
