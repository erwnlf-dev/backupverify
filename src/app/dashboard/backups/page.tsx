'use client';
import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Input, Btn, Card } from '@/components/ui';

interface Backup {
  id: string;
  name: string;
  size: string;
  status: 'Verified' | 'Failed' | 'Pending';
  timestamp: number;
  database: string;
}

export default function BackupsPage() {
  const { state, dispatch } = useStore();
  const [backups, setBackups] = useState<Backup[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    // Seed default backups if empty
    const defaultBackups: Backup[] = [
      { id: '1', name: 'prod-db-daily-2026-07-02.sql', size: '1.2 GB', status: 'Verified', timestamp: Date.now() - 3600000, database: 'production' },
      { id: '2', name: 'prod-db-hourly-0800.sql', size: '1.2 GB', status: 'Verified', timestamp: Date.now() - 7200000, database: 'production' },
      { id: '3', name: 'stg-db-weekly-2026-06-28.sql', size: '450 MB', status: 'Failed', timestamp: Date.now() - 86400000, database: 'staging' },
      { id: '4', name: 'prod-db-hourly-0700.sql', size: '1.1 GB', status: 'Pending', timestamp: Date.now() - 10800000, database: 'production' },
    ];
    setBackups(defaultBackups);
  }, []);

  const triggerVerification = (id: string) => {
    setBackups(prev =>
      prev.map(b => (b.id === id ? { ...b, status: 'Pending' } : b))
    );
    setTimeout(() => {
      setBackups(prev =>
        prev.map(b =>
          b.id === id
            ? { ...b, status: Math.random() > 0.15 ? 'Verified' : 'Failed' }
            : b
        )
      );
    }, 2000);
  };

  const filtered = backups.filter(b =>
    b.name.toLowerCase().includes(filter.toLowerCase()) ||
    b.database.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Backup Jobs</h1>
          <p className="text-zinc-400 text-sm">Monitor and trigger automated recovery tests on backup files.</p>
        </div>
        <Btn onClick={() => alert('New backup source integration pending!')}>
          Add Backup Source
        </Btn>
      </div>

      <Card>
        <div className="mb-4">
          <Input
            placeholder="Search by backup filename or DB name..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="text-xs uppercase bg-zinc-900 text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="px-4 py-3">Filename</th>
                <th className="px-4 py-3">Target DB</th>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Checked At</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filtered.map(b => (
                <tr key={b.id} className="hover:bg-zinc-900/50">
                  <td className="px-4 py-4 font-mono text-xs text-zinc-200">{b.name}</td>
                  <td className="px-4 py-4">{b.database}</td>
                  <td className="px-4 py-4">{b.size}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        b.status === 'Verified'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : b.status === 'Failed'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs text-zinc-400">
                    {new Date(b.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Btn
                      disabled={b.status === 'Pending'}
                      onClick={() => triggerVerification(b.id)}
                      className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 py-1 px-3"
                    >
                      {b.status === 'Pending' ? 'Verifying...' : 'Test Restore'}
                    </Btn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
