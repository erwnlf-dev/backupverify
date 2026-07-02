# BackupVerify

Automated backup verification through sandbox restore testing for IT admins and MSPs.

## Features

- **Automated Verification** - Restores backups to isolated sandboxes, runs validation scripts, records results
- **Real-time Dashboard** - Live view of RPO adherence, test success rates, and alert trends
- **Compliance Reports** - Generate PDF/CSV audit reports from verification history
- **Alert Policies** - Email/webhook notifications for failures and compliance breaches
- **Full Data Portability** - Export/import all application data (jobs, tests, alerts) via JSON
- **Cron Scheduling** - Define verification schedules with standard cron expressions
- **Multi-source Support** - Verifies file-system, database, and VM backups
- **Retention Management** - Configurable backup retention policies per job

## Tech Stack

- **Framework**: Next.js 13 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **State Management**: React Context + useReducer
- **Deployment**: Cloudflare Pages

## Getting Started

```bash
# Clone repository
git clone https://github.com/your-org/backupverify.git

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Access the application at `http://localhost:3000`

## Project Structure

```
src/
├── app/
│   ├── dashboard/
│   │   ├── alerts/page.tsx
│   │   ├── backups/page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── settings/page.tsx
│   │   └── tests/page.tsx
│   ├── layout.tsx
│   └── page.tsx
└── lib/
    ├── store.tsx
    ├── types.ts
    └── utils.tsx
```

## License

![License](https://img.shields.io/badge/license-MIT-blue)

[MIT License](LICENSE)