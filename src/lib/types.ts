// FILE: src/lib/types.ts
'use client';

interface BackupJob {
  id: string;
  name: string;
  source: 'file-system' | 'database' | 'vm';
  schedule: string;
  retentionDays: number;
  vault: string;
  status: 'active' | 'paused';
  lastRun: number;
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
