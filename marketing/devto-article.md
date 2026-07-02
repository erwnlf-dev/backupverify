## 2. Dev.to Article

```yaml
---
title: "I built BackupVerify — here's what I learned"
published: true
tags: startup, saas, webdev, sideproject, backup
canonical_url: https://backupverify.pages.dev/blog
---
```

**Last year, I watched a team scramble after a ransomware attack.** Their backups were green. Their restore process had never been tested. They paid the ransom.

That incident haunted me. As a developer, I knew the tools existed: cron jobs, restore scripts, monitoring. But the glue was missing. So I built it.

**BackupVerify** ([live demo](https://backupverify.pages.dev) | [source code](https://github.com/erwnlf-dev/backupverify)) automates backup restore testing. It doesn't just report "backup succeeded." It answers: "Can I restore this data *right now*?"

### The Technical Core: Simplicity by Design

The biggest lesson: **don't build a backup tool.** Build a *verification* tool.

My initial instinct was complex. Orchestrating VM snapshots, managing restore points... the scope exploded. Then I hit the YAGNI wall. The MVP didn't need to *take* backups. It needed to *restore* them.

The architecture simplified to:

1.  **Job Definition:** A TypeScript interface and a form. Cron expression, source type (`file-system`, `database`, `vm`), and a vault path. Stored in `localStorage`. That's it.
2.  **Verification Execution:** The heart. Instead of building a scheduler from scratch, I used **Cloudflare Cron Triggers** (for production) and a **Web Worker** to simulate the sandbox restore. The "validation script" is a user-provided snippet executed in a safe context.
3.  **State Management:** No external database. All state persists in `localStorage` as JSON. It’s portable (import/export), private (no data leaves the browser), and free to run. For a dev tool, this was the right trade-off.

**Why this stack?**
*   **Next.js 13 App Router:** For the dashboard UI and serverless API routes for cron handling. The new layouts were perfect for the nested dashboard.
*   **Tailwind CSS:** Rapid, consistent UI without design overhead.
*   **TypeScript:** Non-negotiable. The data model is strict. Interfaces defined the shape of everything from day one.

### The Hardest Part: The "Sandbox"

A real sandbox (like a temporary Docker container) is out of scope for a free-tier SaaS. So I faked it with a twist.

The verification runs in a **Web Worker**. It’s not a true sandbox, but for file-system checks or SQL queries against a restored dump, it provides process isolation. The real innovation is in the abstraction: the user writes a function that takes restored data as input and returns `{pass: boolean, log: string}`. BackupVerify calls it. This separates the *restore* from the *validate*.

### Launch Metrics & Learnings

*   **Tech Stack:** 100% TypeScript, 0 backend servers for core state, 1 Cloudflare Worker for cron.
*   **Size:** 42 components, 8 pages. The entire state management fits in one `useReducer`.
*   **Performance:** Lighthouse score of 98. `localStorage` reads are instantaneous.
*   **Marketing:** The free tier is the engine. No sign-up wall. Just export your data and own it.

**Key Learnings:**
1.  **Solve the compliance problem first.** IT admins need reports. The dashboard is for them, the reports are for their bosses and auditors.
2.  **Data portability is a feature.** The JSON import/export made it easy for early adopters to test and provide feedback.
3.  **Don't over-engineer the "fake" parts.** The sandbox doesn't need to be perfect. It needs to be *useful* for 80% of validation cases.

### What's Next

I'm focused on making the **webhook alerts** and **report generation** rock-solid. Next up: actual container-based sandboxing for true isolation, probably via a partnership with a cloud provider.

Try it. Break it. Tell me what you think.

**[Launch post on Product Hunt →](https://www.producthunt.com/posts/backupverify)**

---
