// FILE: src/app/dashboard/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { BackupJob, VerificationTest, Alert } from '@/lib/types';
import { computeStats, formatDate } from '@/lib/utils';
import { Line as LineChart } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement, 
  BarElement 
} from 'chart.js';
import { 
  Play, 
  Plus, 
  Bell, 
  Shield, 
  CheckCircle2, 
  XCircle, 
  History,
  TrendingUp,
  AlertTriangle,
  Zap,
  Info
} from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement);

const changelogData = [
  { version: 'v1.2.0', date: '2026-07-01', changes: ['Added AES-GCM local credentials encryption.', 'Optimized sandbox verification speed by 35%.'] },
  { version: 'v1.1.0', date: '2026-06-15', changes: ['Added Slack and Discord webhook alert integrations.', 'Implemented CSV/PDF compliance report exporter.'] },
];

export default function DashboardPage() {
  const { state, dispatch } = useStore();
  const [lang, setLang] = useState<'EN' | 'ID'>('EN');

  useEffect(() => {
    const savedLang = localStorage.getItem('app_lang');
    if (savedLang) setLang(savedLang as 'EN' | 'ID');
  }, []);

  const stats = computeStats(state.backupJobs, state.verificationTests);

  // Sorting recent tests
  const recentTests = [...state.verificationTests]
    .sort((a, b) => b.completedAt - a.completedAt)
    .slice(0, 5);

  // Chart configuration
  const chartTests = [...state.verificationTests]
    .sort((a, b) => a.completedAt - b.completedAt)
    .slice(-10);

  const chartData = {
    labels: chartTests.map((t, idx) => `Test #${idx + 1}`),
    datasets: [
      {
        label: lang === 'EN' ? 'Validation Status (1=Pass, 0=Fail)' : 'Status Validasi (1=Lulus, 0=Gagal)',
        data: chartTests.map(t => (t.status === 'passed' ? 1 : 0)),
        fill: false,
        backgroundColor: 'rgba(16,185,129,0.2)',
        borderColor: '#10b981',
        borderWidth: 2,
        tension: 0.1,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#0d120f',
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 1,
        ticks: {
          stepSize: 1,
          color: '#a7f3d0',
          font: { family: 'monospace', size: 10 }
        },
        grid: { color: 'rgba(16,185,129,0.05)' }
      },
      x: {
        ticks: {
          color: '#a7f3d0',
          font: { family: 'monospace', size: 10 }
        },
        grid: { color: 'rgba(16,185,129,0.05)' }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#ecfdf5',
          font: { family: 'monospace', size: 11 }
        }
      }
    }
  };

  const triggerQuickTest = () => {
    if (state.backupJobs.length === 0) {
      dispatch({ type: 'TOAST', payload: 'Create a backup job first!' });
      return;
    }
    const job = state.backupJobs[0];
    const testId = crypto.randomUUID();
    
    dispatch({
      type: 'TOAST',
      payload: `Starting manual sandbox test for job: ${job.name}`
    });

    setTimeout(() => {
      const isPassed = Math.random() > 0.15;
      dispatch({
        type: 'SEED',
        payload: {
          ...state,
          verificationTests: [
            ...state.verificationTests,
            {
              id: testId,
              backupJobId: job.id,
              status: isPassed ? 'passed' : 'failed',
              startedAt: Date.now() - 5000,
              completedAt: Date.now(),
              log: `[sandbox-restore] Cloning storage block...\n[sandbox-restore] Mounting partition...\n[verify] Running healthcheck...\n[result] System test ${isPassed ? 'PASSED' : 'FAILED'}.`,
              createdAt: Date.now()
            }
          ],
          alerts: isPassed 
            ? state.alerts 
            : [
                ...state.alerts,
                {
                  id: crypto.randomUUID(),
                  testId,
                  backupJobId: job.id,
                  type: 'test-failure',
                  message: `Automatic verification failed for ${job.name}`,
                  acknowledged: false,
                  createdAt: Date.now()
                }
              ],
          toast: `Recovery test ${isPassed ? 'Passed' : 'Failed'}!`
        }
      });
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-mono uppercase">
            {lang === 'EN' ? 'SYSTEM OVERVIEW' : 'RINGKASAN SISTEM'}
          </h1>
          <p className="text-xs text-[#a7f3d0]/50 mt-1">
            {lang === 'EN' ? 'Continuous backup verifications in isolated sandboxes.' : 'Verifikasi backup berkelanjutan di dalam sandbox terisolasi.'}
          </p>
        </div>

        <div className="flex space-x-3">
          <button 
            onClick={triggerQuickTest}
            className="px-4 py-2 rounded bg-[#10b981] hover:bg-[#34d399] text-xs font-bold text-white flex items-center space-x-1.5 shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all font-mono"
          >
            <Zap className="h-3.5 w-3.5" />
            <span>{lang === 'EN' ? 'RUN QUICK VERIFY' : 'VERIFIKASI CEPAT'}</span>
          </button>
          <Link 
            href="/dashboard/backups"
            className="px-4 py-2 rounded border border-[rgba(16,185,129,0.12)] text-xs font-bold text-[#a7f3d0] hover:bg-white/5 flex items-center space-x-1.5 transition-all font-mono"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{lang === 'EN' ? 'NEW JOB' : 'BARU'}</span>
          </Link>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1 */}
        <div className="card p-5 border border-[rgba(16,185,129,0.08)] bg-[#0d120f] rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono text-[#a7f3d0]/40 uppercase tracking-wider">
              {lang === 'EN' ? 'Active Jobs' : 'Pekerjaan Aktif'}
            </span>
            <Shield className="h-4 w-4 text-[#10b981]" />
          </div>
          <p className="text-3xl font-bold font-mono text-white">{stats.totalJobs}</p>
        </div>

        {/* Card 2 */}
        <div className="card p-5 border border-[rgba(16,185,129,0.08)] bg-[#0d120f] rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono text-[#a7f3d0]/40 uppercase tracking-wider">
              {lang === 'EN' ? 'Total Tests Run' : 'Uji Pemulihan'}
            </span>
            <History className="h-4 w-4 text-[#10b981]" />
          </div>
          <p className="text-3xl font-bold font-mono text-white">{stats.totalTests}</p>
        </div>

        {/* Card 3 */}
        <div className="card p-5 border border-[rgba(16,185,129,0.08)] bg-[#0d120f] rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono text-[#a7f3d0]/40 uppercase tracking-wider">
              {lang === 'EN' ? 'Integrity Rate' : 'Rasio Sukses'}
            </span>
            <CheckCircle2 className="h-4 w-4 text-[#10b981]" />
          </div>
          <p className="text-3xl font-bold font-mono text-white">
            {stats.successRate.toFixed(1)}%
          </p>
        </div>

        {/* Card 4 */}
        <div className="card p-5 border border-[rgba(16,185,129,0.08)] bg-[#0d120f] rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono text-[#a7f3d0]/40 uppercase tracking-wider">
              {lang === 'EN' ? 'RPO SLA Adherence' : 'Kepatuhan RPO SLA'}
            </span>
            <TrendingUp className="h-4 w-4 text-[#10b981]" />
          </div>
          <p className="text-3xl font-bold font-mono text-white">
            {stats.rpoAdherence}%
          </p>
        </div>
      </div>

      {/* CHARTS & RECENT TESTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Panel */}
        <div className="lg:col-span-2 card p-6 border border-[rgba(16,185,129,0.08)] bg-[#0d120f] rounded-lg flex flex-col justify-between">
          <h2 className="text-sm font-bold font-mono text-white uppercase tracking-wider mb-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-[#10b981] mr-2" />
            {lang === 'EN' ? 'VERIFICATION TIMELINE (LAST 10 RUNS)' : 'LINI MASA VERIFIKASI (10 UJI TERAKHIR)'}
          </h2>
          <div className="h-64 w-full relative">
            {state.verificationTests.length > 0 ? (
              <LineChart data={chartData} options={chartOptions} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-[#a7f3d0]/30 border border-dashed border-white/5 rounded">
                {lang === 'EN' ? 'No verification data compiled yet.' : 'Belum ada data pengujian yang dikompilasi.'}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity / Tests Log */}
        <div className="card p-6 border border-[rgba(16,185,129,0.08)] bg-[#0d120f] rounded-lg flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold font-mono text-white uppercase tracking-wider mb-4 flex items-center">
              <History className="h-4 w-4 text-[#10b981] mr-2" />
              {lang === 'EN' ? 'RECENT LOGS' : 'LOG TERKINI'}
            </h2>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {recentTests.length > 0 ? (
                recentTests.map((test) => {
                  const job = state.backupJobs.find(j => j.id === test.backupJobId);
                  return (
                    <div key={test.id} className="p-3 bg-[#060907] border border-white/5 rounded flex items-start justify-between font-mono text-[11px] leading-relaxed">
                      <div className="space-y-1">
                        <p className="font-bold text-[#ecfdf5] truncate w-40">{job ? job.name : 'Unknown Job'}</p>
                        <p className="text-[#a7f3d0]/40 text-[9px]">{formatDate(test.completedAt)}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        test.status === 'passed' 
                          ? 'bg-[rgba(16,185,129,0.15)] text-[#10b981]' 
                          : 'bg-[rgba(239,68,68,0.15)] text-[#ef4444]'
                      }`}>
                        {test.status.toUpperCase()}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-xs font-mono text-[#a7f3d0]/30">
                  {lang === 'EN' ? 'No recent operations.' : 'Tidak ada log aktivitas.'}
                </div>
              )}
            </div>
          </div>
          <Link href="/dashboard/tests" className="block text-center text-xs font-bold text-[#10b981] hover:text-[#34d399] transition-all pt-4 font-mono">
            {lang === 'EN' ? 'VIEW ALL LOGS →' : 'LIHAT SEMUA LOG →'}
          </Link>
        </div>
      </div>

      {/* WHATS NEW CHANGELOG & SYSTEM ADVISORY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Changelog panel */}
        <div className="card p-6 border border-[rgba(16,185,129,0.08)] bg-[#0d120f] rounded-lg">
          <h2 className="text-sm font-bold font-mono text-white uppercase tracking-wider mb-4 flex items-center">
            <Info className="h-4 w-4 text-[#10b981] mr-2" />
            {lang === 'EN' ? "WHAT'S NEW IN VERIFY" : 'YANG BARU DI VERIFY'}
          </h2>
          <div className="space-y-4 font-mono text-xs text-[#a7f3d0]/70">
            {changelogData.map((item, idx) => (
              <details key={idx} className="group border-b border-white/5 pb-3 last:border-0 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between cursor-pointer focus:outline-none py-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[#10b981] font-bold">{item.version}</span>
                    <span className="text-[10px] text-[#a7f3d0]/40">({item.date})</span>
                  </div>
                  <span className="text-[10px] text-[#10b981] group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <ul className="pl-4 space-y-1 list-disc mt-2 leading-relaxed text-[11px] text-[#a7f3d0]/50">
                  {item.changes.map((change, cIdx) => (
                    <li key={cIdx}>{change}</li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </div>

        {/* System Advisory */}
        <div className="card p-6 border border-[rgba(239,68,68,0.15)] bg-[#191010]/30 rounded-lg flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold font-mono text-[#ef4444] uppercase tracking-wider mb-3 flex items-center">
              <AlertTriangle className="h-4 w-4 text-[#ef4444] mr-2" />
              {lang === 'EN' ? 'ACTIVE INCIDENT ADVISORY' : 'ADVISORY INSIDEN AKTIF'}
            </h2>
            <p className="font-mono text-xs text-[#fca5a5] leading-relaxed mb-4">
              {state.alerts.filter(a => !a.acknowledged).length > 0
                ? (lang === 'EN' 
                    ? `Warning: ${state.alerts.filter(a => !a.acknowledged).length} unacknowledged backup verification failure alerts detected.`
                    : `Peringatan: Terdeteksi ${state.alerts.filter(a => !a.acknowledged).length} kegagalan verifikasi backup yang belum di-acknowledge.`)
                : (lang === 'EN'
                    ? 'All systems nominal. No unacknowledged sandbox restore failures currently pending.'
                    : 'Semua sistem berjalan normal. Tidak ada kegagalan sandbox restore tertunda.')}
            </p>
          </div>
          {state.alerts.filter(a => !a.acknowledged).length > 0 && (
            <Link href="/dashboard/alerts" className="inline-block text-center text-xs font-bold bg-[#ef4444] hover:bg-[#f87171] text-white py-2 rounded transition-all font-mono">
              {lang === 'EN' ? 'RESOLVE ALERTS NOW' : 'SELESAIKAN ALARM SEKARANG'}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
