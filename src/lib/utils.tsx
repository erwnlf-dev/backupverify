// FILE: src/lib/utils.ts
'use client';

import { z } from 'zod';
import { BackupJob, VerificationTest, Alert, AppSettings } from '@/lib/types';

export function formatDate(date: number | Date): string {
  const d = new Date(date);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
}

export function formatNumber(num: number, digits = 2): string {
  return num.toFixed(digits);
}

export function classNames(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function exportJSON(data: any, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function importJSON(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        resolve(JSON.parse(reader.result as string));
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export function computeStats(jobs: BackupJob[], tests: VerificationTest[]): { totalJobs: number; totalTests: number; successRate: number; rpoAdherence: number } {
  const totalJobs = jobs.length;
  const totalTests = tests.length;
  const successfulTests = tests.filter(test => test.status === 'passed').length;
  const successRate = totalTests > 0 ? (successfulTests / totalTests) * 100 : 0;
  const rpoAdherence = totalJobs > 0 ? 100 : 0;
  return { totalJobs, totalTests, successRate, rpoAdherence };
}

const BackupJobSchema = z.object({
  id: z.string(),
  name: z.string(),
  source: z.enum(['file-system', 'database', 'vm']),
  schedule: z.string(),
  retentionDays: z.number(),
  vault: z.string(),
  status: z.enum(['active', 'paused']),
  lastRun: z.number(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

const VerificationTestSchema = z.object({
  id: z.string(),
  backupJobId: z.string(),
  status: z.enum(['pending', 'running', 'passed', 'failed']),
  startedAt: z.number(),
  completedAt: z.number(),
  log: z.string(),
  createdAt: z.number(),
});

const AlertSchema = z.object({
  id: z.string(),
  testId: z.string(),
  backupJobId: z.string(),
  type: z.enum(['test-failure', 'rpo-breach', 'low-success-rate']),
  message: z.string(),
  acknowledged: z.boolean(),
  createdAt: z.number(),
});

const AppSettingsSchema = z.object({
  notifications: z.object({
    email: z.boolean(),
    webhook: z.boolean(),
    webhookUrl: z.string().url().optional(),
  }),
  darkMode: z.boolean(),
});

export function validateBackupJob(job: unknown): BackupJob {
  return BackupJobSchema.parse(job) as any;
}

export function validateVerificationTest(test: unknown): VerificationTest {
  return VerificationTestSchema.parse(test) as any;
}

export function validateAlert(alert: unknown): Alert {
  return AlertSchema.parse(alert) as any;
}

export function validateAppSettings(settings: unknown): AppSettings {
  return AppSettingsSchema.parse(settings) as any;
}
