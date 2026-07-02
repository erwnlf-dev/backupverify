## 2. Dev.to Article

```yaml
---
title: "I built BackupVerify — here's what I learned"
published: true
tags: startup, saas, webdev, sideproject, backup
canonical_url: https://backupverify.pages.dev/blog
---
```

The idea for BackupVerify came from a common, terrifying scenario. A friend who's an MSP called me in a panic. Their client's primary server died. Backups were "successful," but the restore was a different story. Corrupted database, missing files. It was a nightmare that cost them a client.

That's when I realized: the backup industry has a dirty secret. "Backup complete" doesn't mean "restorable." Most tools just verify the copy happened, not that the result is usable. For IT admins, that's a terrifying blind spot.

I wanted to build a simple, automated way to prove backup recoverability. Not another backup tool, but a **verification tool**.

### The Stack Decision: Simplicity First

Since this was a side project, I needed to move fast. My principles: ship something useful, don't over-engineer.

*   **Framework:** Next.js 13 (App Router) – Server components for fast loads, API routes for a simple backend. Perfect for a full-stack app without managing separate services.
*   **Styling:** Tailwind CSS – I'm not a designer. Tailwind lets me build a clean, functional UI quickly.
*   **State:** React Context + useReducer – For this scope, it's perfect. Simple, no extra dependencies, and the state tree is straightforward. Avoiding Redux was a conscious choice for YAGNI (You Ain't Gonna Need It).
*   **Persistence:** `localStorage` with JSON – Hear me out. For a V1 aimed at single users or small teams, this is genius. Zero backend database, zero auth complexity, zero hosting cost for persistence. Users own their data, it's portable (via the export feature), and it works instantly. It's a trade-off I'm willing to make for launch simplicity.
*   **Deployment:** Cloudflare Pages – Free, fast, and easy. The whole app is a static site with some serverless functions.

### Key Learnings Building in Public

1.  **Start with the core loop.** The first thing I built wasn't a dashboard or a login screen. It was the engine: define a job -> run a verification test -> store the result. Everything else is UI around that loop.
2.  **The "sandbox" is a abstraction.** For the V1, I simulate the sandbox restore. The real magic is in the interface that *would* connect to a real sandbox (like a Docker API or cloud provider). The value is in the orchestration and logging, not the container itself.
3.  **Reports are the killer feature.** I thought the dashboard would be the main selling point. While useful, the **compliance report** is what gets the "aha!" moment. Being able to generate a PDF for an audit on demand? That's where the real work anxiety is relieved.

### What's Next?

BackupVerify is live, but it's just the start.

*   **Real Sandbox Connectors:** Integrate with Docker, Kubernetes, and major cloud providers (AWS, GCP, Azure) for actual isolated restores.
*   **Team Features:** The Pro plan is ready. Now, I'll focus on true multi-user collaboration.
*   **Smarter Alerts:** Use historical test data to predict failures before they happen.

If you've ever been burned by a bad backup, give it a try. It's free for single users.

[**Try BackupVerify Live**](https://backupverify.pages.dev)  
[**Check out the Code on GitHub**](https://github.com/erwnlf-dev/backupverify)

Feedback, issues, and ideas are welcome. Thanks for reading.

---