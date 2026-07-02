### 1. Product Overview
BackupVerify automates backup verification through sandbox restore testing for IT admins and MSPs. It proves backup recoverability, unlike reporting-only tools. Key differentiator: automated, non-disruptive restore validation with compliance reports.

### 2. Core Functional Requirements
1. **Create and manage backup jobs** defining source, schedule (cron), retention, and target vault.
2. **Execute and track verification tests** that automatically restore backup to a sandbox, run scripts, and record pass/fail with logs.
3. **View a real-time dashboard** computing recovery point objective (RPO) adherence, test success rates, and alert trends from stored data.
4. **Define and manage alert policies** for failed tests or compliance breaches (email/webhook).
5. **Generate and export compliance reports** for completed verifications (PDF/CSV).
6. **Import/export all application data** (backups, tests, alerts) via JSON for portability.
7. **Reset application state** with confirmation to clear all data.

### 3. Data Model & Persistence
```typescript
interface BackupJob {
  id: string;
  name: string;
  source: 'file-system' | 'database' | 'vm';
  schedule: string; // cron expression
  retentionDays: number;
  vault: string;
  status: 'active' | 'paused';
  lastRun: number; // Unix timestamp
  createdAt: number;
  updatedAt: number;
}

interface VerificationTest {
  id: string;
  backupJobId: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  startedAt: number;
  completedAt: number;
  log: string;
  createdAt: number;
}

interface Alert {
  id: string;
  testId: string;
  backupJobId: string;
  type: 'test-failure' | 'rpo-breach' | 'low-success-rate';
  message: string;
  acknowledged: boolean;
  createdAt: number;
}

interface AppSettings {
  notifications: {
    email: boolean;
    webhook: boolean;
    webhookUrl: string;
  };
  darkMode: boolean;
}
```
Persistence: `localStorage` with JSON. Keys: `app_backupJobs`, `app_verificationTests`, `app_alerts`, `app_settings`.

### 4. Pages, Routes & FUNCTIONALITY
- **Landing page (/)**: Decide/Learn surface. Marketing. Hero, 6+ features, 3 pricing tiers, 6+ FAQ, testimonials, CTA.
- **Dashboard (/dashboard)**: Monitor surface. Shows **real computed stats** from localStorage: total jobs, tests run, success rate %, RPO adherence %. Charts for test results over time. Activity feed of last 10 actions.
- **Backup Jobs (/dashboard/backups)**: Operate surface. Full CRUD table for `BackupJob`. Create via modal form, inline edit status/schedule, delete with confirmation, search, sort, filter by status/source.
- **Verification Tests (/dashboard/tests)**: Operate surface. List of tests, filter by job/status. View detail with logs. Can **trigger manual test run** from a job.
- **Alerts (/dashboard/alerts)**: Operate surface. List alerts, filter by type/acknowledged. Acknowledge single or bulk.
- **Settings (/dashboard/settings)**: Configure surface. Profile/notification form with save. Data export (JSON download). Data import (JSON upload + merge). Reset with confirmation modal.

### 5. Component Specification per Page
- **Dashboard**: `Sidebar(240px, nav links)`, `StatCards(4 computed)`, `TestResultsChart(LineChart from last 30 days)`, `ActivityFeed(last 10 actions)`, `QuickActions(create job button)`.
- **Backup Jobs Page**: `DataTable(columns: name, source, schedule, status, lastRun, actions)`, `CreateJobModal(form)`, `EditJobInline`, `DeleteConfirmationModal`.
- **Verification Tests Page**: `FilterBar(job select, status select)`, `TestsTable`, `TestDetailDrawer(log viewer)`, `RunTestButton`.
- **Alerts Page**: `AlertTable`, `AcknowledgeButton`, `BulkAcknowledgeButton`.
- **Settings Page**: `ProfileForm`, `NotificationToggles`, `ExportButton`, `ImportFileUploader`, `ResetButton(confirm modal)`.

### 6. User Flows
1. **Create & Verify**: User clicks "Create Job" -> fills form -> saves to localStorage -> job appears in table -> user clicks "Run Test" -> test created -> dashboard stats update -> success toast.
2. **Review Alert**: Dashboard shows alert count -> user goes to Alerts page -> views failed test log -> acknowledges alert -> alert count decrements.
3. **Reset Data**: Settings -> "Reset Data" -> confirmation modal -> clears all localStorage -> redirects to landing page.

### 7. Mock Data (seed on first load)
On first load (if `app_backupJobs` empty): Seed with 5 `BackupJob` instances, 20 `VerificationTest` instances (last 30 days), 8 `Alert` instances, and default `AppSettings`. Use realistic names/schedules.

### 8. File Manifest (MUST be valid JSON)
```json
[
  {"path": "src/app/layout.tsx", "purpose": "Root layout: Inter font, dark theme, metadata, GlobalProvider wrapper", "dependencies": []},
  {"path": "src/app/globals.css", "purpose": "Tailwind directives + CSS custom properties", "dependencies": []},
  {"path": "src/app/page.tsx", "purpose": "Landing page — Decide/Learn surface: hero, features, pricing, FAQ, social proof, CTA", "dependencies": []},
  {"path": "src/app/dashboard/layout.tsx", "purpose": "Dashboard layout: sidebar nav + topbar + main content area. Wraps all dashboard pages with StoreProvider.", "dependencies": []},
  {"path": "src/app/dashboard/page.tsx", "purpose": "Dashboard home — Monitor surface: computed stat cards, charts from real data, recent activity feed", "dependencies": []},
  {"path": "src/app/dashboard/backups/page.tsx", "purpose": "Backup Jobs CRUD list — Operate surface: data table, create/edit/delete, search, sort, filter", "dependencies": []},
  {"path": "src/app/dashboard/tests/page.tsx", "purpose": "Verification Tests list — Operate surface: list, filter, view log, trigger manual test", "dependencies": []},
  {"path": "src/app/dashboard/alerts/page.tsx", "purpose": "Alerts list — Operate surface: list, acknowledge single/bulk", "dependencies": []},
  {"path": "src/app/dashboard/settings/page.tsx", "purpose": "Settings — Configure surface: profile form, notification toggles, data export/import/reset", "dependencies": []},
  {"path": "src/lib/store.tsx", "purpose": "React Context + useReducer global state: all CRUD, seed data, localStorage sync, toast notifications", "dependencies": []},
  {"path": "src/lib/types.ts", "purpose": "TypeScript interfaces for BackupJob, VerificationTest, Alert, AppSettings, state shapes", "dependencies": []},
  {"path": "src/lib/utils.ts", "purpose": "Utilities: formatDate, formatNumber, classNames, generateId, exportJSON, importJSON, computeStats", "dependencies": []}
]
```