// FILE: src/app/dashboard/tests/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { VerificationTest } from '@/lib/types';
import { validateInput } from '@/lib/validate';
import { z } from 'zod';
import { SearchIcon } from 'lucide-react';

const TestSchema = z.object({
  id: z.string(),
  backupJobId: z.string(),
  status: z.enum(['pending', 'running', 'passed', 'failed']),
  startedAt: z.number(),
  completedAt: z.number(),
  log: z.string(),
  createdAt: z.number(),
});

const TestsPage = () => {
  const [tests, setTests] = useState<VerificationTest[]>([]);
  const [search, setSearch] = useState('');
  const [filteredTests, setFilteredTests] = useState<VerificationTest[]>([]);
  const { dispatch, state } = useStore();

  useEffect(() => {
    setTests(state.verificationTests);
  }, [state.verificationTests]);

  useEffect(() => {
    const filtered = tests.filter(test =>
      test.id.toLowerCase().includes(search.toLowerCase()) ||
      test.status.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredTests(filtered);
  }, [tests, search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleManualTestRun = (backupJobId: string) => {
    // Trigger manual test run logic here
    console.log('Manual test run triggered for backup job:', backupJobId);
  };

  return (
    <div className="min-h-screen bg-[#060907] text-[#ecfdf5]">
      <div className="p-5">
        <h1 className="text-2xl font-bold mb-4">Verification Tests</h1>
        <div className="mb-4 flex items-center">
          <SearchIcon className="mr-2 h-4 w-4" />
          <input
            type="text"
            placeholder="Search tests..."
            value={search}
            onChange={handleSearchChange}
            className="rounded-md border border-[rgba(16,185,129,0.12)] bg-[#161f1a] px-3 py-2 text-sm text-[#ecfdf5] focus:border-[#10b981] focus:outline-none"
          />
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-[rgba(16,185,129,0.08)] bg-[#0d120f] p-2">ID</th>
              <th className="border border-[rgba(16,185,129,0.08)] bg-[#0d120f] p-2">Backup Job ID</th>
              <th className="border border-[rgba(16,185,129,0.08)] bg-[#0d120f] p-2">Status</th>
              <th className="border border-[rgba(16,185,129,0.08)] bg-[#0d120f] p-2">Started At</th>
              <th className="border border-[rgba(16,185,129,0.08)] bg-[#0d120f] p-2">Completed At</th>
              <th className="border border-[rgba(16,185,129,0.08)] bg-[#0d120f] p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTests.map(test => (
              <tr key={test.id}>
                <td className="border border-[rgba(16,185,129,0.08)] bg-[#161f1a] p-2">{test.id}</td>
                <td className="border border-[rgba(16,185,129,0.08)] bg-[#161f1a] p-2">{test.backupJobId}</td>
                <td className="border border-[rgba(16,185,129,0.08)] bg-[#161f1a] p-2">{test.status}</td>
                <td className="border border-[rgba(16,185,129,0.08)] bg-[#161f1a] p-2">{new Date(test.startedAt).toLocaleString()}</td>
                <td className="border border-[rgba(16,185,129,0.08)] bg-[#161f1a] p-2">{test.completedAt ? new Date(test.completedAt).toLocaleString() : '-'}</td>
                <td className="border border-[rgba(16,185,129,0.08)] bg-[#161f1a] p-2">
                  <button
                    onClick={() => handleManualTestRun(test.backupJobId)}
                    className="rounded-md bg-[#10b981] px-4 py-2 text-sm font-medium text-white hover:bg-[#34d399]"
                  >
                    Run Test
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestsPage;