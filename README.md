# Meridian

Career market intelligence OS.

The labour market tells you what is valuable. Your evidence tells you what you can prove. Meridian tells you what to do next.

This is not a job tracker. Jobs are **demand signals**. Evidence is the asset. A CV is a projection of that evidence. The home screen is **next action**, not a database.

## Three worlds

| World | What it holds |
| --- | --- |
| **Market** | Jobs, papers, GitHub, practitioner talk, and hype — kept in separate tiers so a viral post is never treated as hiring demand |
| **Person** | Skills, evidence, projects that manufacture evidence, CV versions |
| **Decision** | What to learn, what to build, what to apply to, how to position |

Signal source hierarchy:

1. **Demand** — JDs, hiring data, recruiter posts  
2. **Technology** — papers, GitHub, product launches  
3. **Practitioner** — Reddit, X, LinkedIn  
4. **Hype** — influencers and viral news (never averaged with demand)

## Run it

```bash
npm install
npm run dev
```

Then open the app. Demo data is seeded for a London AI Engineer / AI Product search. **Reset demo** in the sidebar restores it.

Paste a JD via **Add job**. Local extraction always runs; **Analyse with AI** uses xAI when `XAI_API_KEY` is available.

## Stack

React 19, TanStack Start, Tailwind v4, Zustand (local persistence). No accounts. Your evidence stays in the browser.

## Product loop

Add Job → Analyse gap → Select evidence → Build CV → Create project → Apply → Record outcome
