// FILE: src/app/dashboard/tests/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { VerificationTest, BackupJob } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { 
  Search, 
  Play, 
  FileText, 
  Download, 
  Terminal as TerminalIcon, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Filter 
} from 'lucide-react';

export default function TestsPage() {
  const { state, dispatch } = useStore();
  const [lang, setLang] = useState<'EN' | 'ID'>('EN');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedJobFilter, setSelectedJobFilter] = useState<string>('all');
  const [activeTestLog, setActiveTestLog] = useState<VerificationTest | null>(null);
  const [runningTestId, setRunningTestId] = useState<string | null>(null);

  useEffect(() => {
    const savedLang = localStorage.getItem('app_lang');
    if (savedLang) setLang(savedLang as 'EN' | 'ID');
  }, []);

  const handleManualTestRun = (job: BackupJob) => {
    const testId = crypto.randomUUID();
    setRunningTestId(testId);
    
    dispatch({
      type: 'TOAST',
      payload: lang === 'EN' 
        ? `Launching ephemeral sandbox for ${job.name}...` 
        : `Meluncurkan sandbox efemeris untuk ${job.name}...`
    });

    // Menambahkan initial running test ke state
    dispatch({
      type: 'SEED',
      payload: {
        ...state,
        verificationTests: [
          ...state.verificationTests,
          {
            id: testId,
            backupJobId: job.id,
            status: 'running',
            startedAt: Date.now(),
            completedAt: 0,
            log: `[sandbox-init] Launching clean isolated environment...\n[sandbox-init] Allocating 4GB vRAM, 2 OCPUs...\n[sandbox-init] Mounting backup snapshot from vault: ${job.vault}...`,
            createdAt: Date.now()
          }
        ]
      }
    });

    setTimeout(() => {
      const isPassed = Math.random() > 0.12;
      const completedTest: VerificationTest = {
        id: testId,
        backupJobId: job.id,
        status: isPassed ? 'passed' : 'failed',
        startedAt: Date.now() - 6000,
        completedAt: Date.now(),
        log: `[sandbox-init] Launching clean isolated environment...\n[sandbox-init] Allocating 4GB vRAM, 2 OCPUs...\n[sandbox-init] Mounting backup snapshot from vault: ${job.vault}...\n[sandbox-mount] Disk partition format: EXT4. Mount success.\n[sandbox-verify] Target source type: ${job.source}\n[sandbox-verify] Running validation script block...\n[sandbox-verify] Checksum hash integrity check: SUCCESS\n[sandbox-verify] Starting main software layers... OK\n[result] Verification ${isPassed ? 'PASSED' : 'FAILED'}. Sandbox terminated safely.`,
        createdAt: Date.now()
      };

      setRunningTestId(null);
      dispatch({
        type: 'SEED',
        payload: {
          ...state,
          verificationTests: state.verificationTests.map(t => t.id === testId ? completedTest : t),
          alerts: isPassed 
            ? state.alerts 
            : [
                ...state.alerts,
                {
                  id: crypto.randomUUID(),
                  testId,
                  backupJobId: job.id,
                  type: 'test-failure',
                  message: `Recovery verification failed for ${job.name} inside ephemeral sandbox`,
                  acknowledged: false,
                  createdAt: Date.now()
                }
              ]
        }
      });

      dispatch({
        type: 'TOAST',
        payload: isPassed 
          ? (lang === 'EN' ? `Verification PASSED for ${job.name}` : `Verifikasi SUKSES untuk ${job.name}`)
          : (lang === 'EN' ? `Verification FAILED for ${job.name}` : `Verifikasi GAGAL untuk ${job.name}`)
      });
    }, 4000);
  };

  // Export Compliance Report as CSV
  const handleExportCSV = () => {
    const headers = 'Test ID,Backup Job,Status,Started At,Completed At,Integrity\n';
    const rows = state.verificationTests.map(t => {
      const job = state.backupJobs.find(j => j.id === t.backupJobId);
      return `"${t.id}","${job ? job.name : 'Unknown'}","${t.status}","${new Date(t.startedAt).toISOString()}","${t.completedAt ? new Date(t.completedAt).toISOString() : '-'}","${t.status === 'passed' ? '100% SECURE' : 'COMPROMISED'}"`;
    }).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backupverify-iso27001-compliance-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    dispatch({
      type: 'TOAST',
      payload: lang === 'EN' ? 'ISO 27001 compliance report downloaded.' : 'Laporan kepatuhan ISO 27001 diunduh.'
    });
  };

  const filteredTests = state.verificationTests.filter(test => {
    const job = state.backupJobs.find(j => j.id === test.backupJobId);
    const matchesSearch = test.id.toLowerCase().includes(search.toLowerCase()) || 
                          (job && job.name.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || test.status === statusFilter;
    const matchesJob = selectedJobFilter === 'all' || test.backupJobId === selectedJobFilter;

    return matchesSearch && matchesStatus && matchesJob;
  }).sort((a, b) => b.startedAt - a.startedAt);

  return (
    <div className="space-y-6 animate-fade-in font-mono text-xs">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-wider text-white uppercase flex items-center">
            <TerminalIcon className="h-5 w-5 text-[#10b981] mr-2" />
            {lang === 'EN' ? 'VERIFICATION PIPELINE LOGS' : 'LOG JALUR VERIFIKASI'}
          </h1>
          <p className="text-[10px] text-[#a7f3d0]/50 mt-1">
            {lang === 'EN' ? 'Pass/Fail audit trails for sandbox recoveries.' : 'Bukti audit kelulusan pemulihan data sandbox.'}
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-[#10b981] hover:bg-[#34d399] text-white rounded font-bold flex items-center justify-center space-x-1.5 shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all"
        >
          <Download className="h-3.5 w-3.5" />
          <span>{lang === 'EN' ? 'EXPORT ISO AUDIT (CSV)' : 'EKSPOR AUDIT ISO (CSV)'}</span>
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="card p-4 border border-[rgba(16,185,129,0.08)] bg-[#0d120f] rounded-lg grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#a7f3d0]/40" />
          <input
            type="text"
            placeholder={lang === 'EN' ? 'Search by Test ID/Job Name...' : 'Cari ID Uji/Nama Pekerjaan...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#060907] border border-[rgba(16,185,129,0.12)] rounded px-3 py-2 pl-9 text-[#ecfdf5] placeholder-[#a7f3d0]/30 focus:outline-none focus:border-[#10b981]"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="h-3.5 w-3.5 text-[#a7f3d0]/40" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-[#060907] border border-[rgba(16,185,129,0.12)] rounded px-3 py-2 text-[#ecfdf5] focus:outline-none focus:border-[#10b981]"
          >
            <option value="all">{lang === 'EN' ? 'All Statuses' : 'Semua Status'}</option>
            <option value="passed">{lang === 'EN' ? 'PASSED' : 'LULUS'}</option>
            <option value="failed">{lang === 'EN' ? 'FAILED' : 'GAGAL'}</option>
            <option value="running">{lang === 'EN' ? 'RUNNING' : 'BERJALAN'}</option>
            <option value="pending">PENDING</option>
          </select>
        </div>

        {/* Job Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="h-3.5 w-3.5 text-[#a7f3d0]/40" />
          <select
            value={selectedJobFilter}
            onChange={(e) => setSelectedJobFilter(e.target.value)}
            className="w-full bg-[#060907] border border-[rgba(16,185,129,0.12)] rounded px-3 py-2 text-[#ecfdf5] focus:outline-none focus:border-[#10b981]"
          >
            <option value="all">{lang === 'EN' ? 'All Backup Jobs' : 'Semua Pekerjaan Backup'}</option>
            {state.backupJobs.map(job => (
              <option key={job.id} value={job.id}>{job.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="card border border-[rgba(16,185,129,0.08)] bg-[#0d120f] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[rgba(16,185,129,0.08)] bg-[#080b09] text-[#a7f3d0]/50 text-[10px] uppercase tracking-wider">
                <th className="p-4 font-mono font-medium">{lang === 'EN' ? 'TEST RUN DETAILS' : 'RINCIAN UJI'}</th>
                <th className="p-4 font-mono font-medium">{lang === 'EN' ? 'BACKUP JOB' : 'PEKERJAAN BACKUP'}</th>
                <th className="p-4 font-mono font-medium">STATUS</th>
                <th className="p-4 font-mono font-medium">{lang === 'EN' ? 'TIME STAMPS' : 'TANDA WAKTU'}</th>
                <th className="p-4 font-mono font-medium text-right">{lang === 'EN' ? 'ACTIONS' : 'AKSI'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(16,185,129,0.05)] bg-[#0d120f]/50">
              {filteredTests.length > 0 ? (
                filteredTests.map((test) => {
                  const job = state.backupJobs.find(j => j.id === test.backupJobId);
                  return (
                    <tr key={test.id} className="hover:bg-white/5 transition-colors">
                      {/* ID */}
                      <td className="p-4">
                        <p className="font-bold text-[#ecfdf5]">{test.id.slice(0, 8)}...</p>
                        <p className="text-[9px] text-[#a7f3d0]/30 font-mono mt-0.5">{test.id}</p>
                      </td>

                      {/* Job */}
                      <td className="p-4">
                        <p className="text-white font-semibold">{job ? job.name : 'Deleted Job'}</p>
                        <p className="text-[9px] text-[#a7f3d0]/40 font-mono mt-0.5 uppercase">
                          {job ? job.source : 'N/A'} • {job ? job.vault : 'N/A'}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-[9px] font-bold ${
                          test.status === 'passed' 
                            ? 'bg-[rgba(16,185,129,0.15)] text-[#10b981]' 
                            : test.status === 'failed'
                            ? 'bg-[rgba(239,68,68,0.15)] text-[#ef4444]'
                            : test.status === 'running'
                            ? 'bg-[rgba(59,130,246,0.15)] text-[#3b82f6] animate-pulse'
                            : 'bg-white/5 text-[#a7f3d0]/50'
                        }`}>
                          {test.status === 'passed' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                          {test.status === 'failed' && <XCircle className="h-3 w-3 mr-1" />}
                          {test.status === 'running' && <Clock className="h-3 w-3 mr-1 animate-spin" />}
                          <span>{test.status.toUpperCase()}</span>
                        </span>
                      </td>

                      {/* Dates */}
                      <td className="p-4 font-mono text-[10px] space-y-1">
                        <div className="flex items-center text-[#a7f3d0]/60">
                          <span className="text-[8px] uppercase font-bold text-[#a7f3d0]/30 mr-1.5 w-8">Start:</span>
                          {formatDate(test.startedAt)}
                        </div>
                        {test.completedAt > 0 && (
                          <div className="flex items-center text-[#a7f3d0]/60">
                            <span className="text-[8px] uppercase font-bold text-[#a7f3d0]/30 mr-1.5 w-8">End:</span>
                            {formatDate(test.completedAt)}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setActiveTestLog(test)}
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded font-bold text-[10px] border border-white/5 inline-flex items-center space-x-1"
                        >
                          <FileText className="h-3 w-3" />
                          <span>{lang === 'EN' ? 'VIEW LOG' : 'LIHAT LOG'}</span>
                        </button>

                        {job && (
                          <button
                            disabled={runningTestId !== null}
                            onClick={() => handleManualTestRun(job)}
                            className="px-3 py-1.5 bg-[#10b981] hover:bg-[#34d399] disabled:opacity-40 text-white rounded font-bold text-[10px] inline-flex items-center space-x-1 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                          >
                            <Play className="h-3 w-3" />
                            <span>{lang === 'EN' ? 'TRIGGER' : 'PICU'}</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-[#a7f3d0]/30 font-mono">
                    {lang === 'EN' ? 'No verification records found.' : 'Tidak ditemukan rekaman verifikasi.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* LOG DRAWER / MODAL */}
      {activeTestLog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d120f] border border-[rgba(16,185,129,0.2)] w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden animate-fade-in flex flex-col h-[500px]">
            {/* Modal Header */}
            <div className="p-4 border-b border-[rgba(16,185,129,0.08)] bg-[#080b09] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TerminalIcon className="h-4 w-4 text-[#10b981]" />
                <span className="font-mono text-xs font-bold text-[#ecfdf5] uppercase">
                  {lang === 'EN' ? 'Sandbox Console Output' : 'Keluaran Konsol Sandbox'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#a7f3d0]/40">
                ID: {activeTestLog.id}
              </span>
            </div>

            {/* Console Log Area */}
            <div className="flex-1 p-4 bg-[#060907] font-mono text-[11px] text-[#34d399] overflow-y-auto leading-relaxed whitespace-pre-wrap">
              {activeTestLog.log}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[rgba(16,185,129,0.08)] bg-[#0d120f] flex justify-end">
              <button
                onClick={() => setActiveTestLog(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded font-bold border border-white/5"
              >
                {lang === 'EN' ? 'CLOSE CONSOLE' : 'TUTUP KONSOL'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
