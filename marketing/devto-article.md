## 2. Dev.to Article

---
title: "I built BackupVerify — here's what I learned"
published: true
tags: #startup, #saas, #webdev, #sideproject, #backup
canonical_url: https://backupverify.pages.dev/blog
---

### The "Backup Lie" and My Side Project to Fix It

There's a dirty secret in IT: most "backups" are just scheduled file-copy jobs. The real test—can you restore this to a working state in a crisis?—is almost never done automatically. I kept seeing this gap while working with IT teams. The backup software says "success," but nobody has the time to manually spin up a VM, restore the data, and run sanity checks.

So I built **BackupVerify**.

**Live Demo:** https://backupverify.pages.dev
**GitHub Repo:** https://github.com/erwnlf-dev/backupverify

### The Core Idea

A tool that automates the restore test. Not just logging that a backup file exists, but actually restoring it into a disposable sandbox environment and running a validation script you define. If the script passes, the backup is verified. If it fails, you get an alert *before* you need to recover.

### Technical Deep Dive & Lessons

#### 1. **The "Sandbox" is a Concept, Not Just Infrastructure**
Since this is a MVP SaaS and not a full orchestration platform, the "sandbox" is initially a **logical sandbox**. The tool manages the verification *process* and *state*. The actual restore target is a path or service you specify. This makes it adaptable immediately without requiring specific cloud integrations. The focus is on the workflow: trigger restore -> run check -> record result.
*   *Lesson:* Start with the abstract workflow. The specific infrastructure plugin (AWS, Proxmox, etc.) can come later.

#### 2. **State Management in the Browser is Harder Than It Looks**
The entire app state lives in `localStorage`. The `useReducer` context pattern works well for a single-user, in-browser app. The tricky part was making it feel "real" for a SaaS.
*   **Import/Export:** This was key. The JSON import/export makes the `localStorage` persistence feel like a real, portable data layer. It's a poor-man's database, but for a demo, it's brilliant.
*   *Lesson:* For internal tools or MVPs, don't underestimate the power of client-side state with a solid export format. It removes backend complexity from day one.

#### 3. **Building for the "Report" is Building for the Product**
A huge differentiator is the compliance report. I built the PDF/CSV export logic *early*. This forced me to structure the data models (`VerificationTest`, `Alert`) correctly from the start. A test isn't just a pass/fail; it's a timestamped log with a linked job.
*   *Lesson:* If your product's value is in reporting, make reporting a core data concern, not an afterthought.

#### 4. **Next.js 13 App Router is Perfect for This Pattern**
The dashboard is a collection of data-driven pages. The App Router's nested layouts and server components (even if most logic is client-side here) make organizing the UI sections (backups, tests, alerts) clean and intuitive. The file-system routing mirrors the product's feature set.
*   *Lesson:* Use the framework's structure to inform your product's information architecture.

### What's Next?

The free tier is live and fully functional. The next steps are:
1.  **Webhook Integrations:** For Slack, Teams, etc.
2.  **More Validation Script Templates:** For common databases, web servers.
3.  **Cloud Storage Connectors:** Direct S3/GCS integration for source/target.

This is a tool I'm building because I believe the industry needs it. If you're an IT admin, MSP, or just someone who cares about real data resilience, give it a try. All feedback, issues, and PRs are welcome on the GitHub repo.

**Thanks for reading. Go verify a backup.**

---
