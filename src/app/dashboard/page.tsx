// FILE: src/app/dashboard/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { BackupJob, VerificationTest, Alert } from '@/lib/types';
import { LineChart, BarChart, PieChart } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js';
import { formatDistanceToNow } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement);

const DashboardPage = () => {
  const { state } = useStore();
  const [backupJobs, setBackupJobs] = useState<BackupJob[]>([]);
  const [verificationTests, setVerificationTests] = useState<VerificationTest[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    setBackupJobs(state.backupJobs);
    setVerificationTests(state.verificationTests);
    setAlerts(state.alerts);
  }, [state]);

  const totalJobs = backupJobs.length;
  const totalTests = verificationTests.length;
  const successRate = ((verificationTests.filter(test => test.status === 'passed').length / totalTests) * 100).toFixed(2);
  const rpoAdherence = 'N/A'; // Placeholder for actual RPO calculation

  const recentActivity = [
    ...backupJobs.map(job => ({ type: 'Backup Job', name: job.name, action: 'created', time: job.createdAt })),
    ...verificationTests.map(test => ({ type: 'Verification Test', name: test.id, action: test.status, time: test.completedAt })),
    ...alerts.map(alert => ({ type: 'Alert', name: alert.type, action: 'triggered', time: alert.createdAt }))
  ].sort((a, b) => b.time - a.time).slice(0, 10);

  const chartData = {
    labels: verificationTests.map(test => formatDistanceToNow(new Date(test.completedAt))),
    datasets: [
      {
        label: 'Test Status',
        data: verificationTests.map(test => (test.status === 'passed' ? 1 : 0)),
        fill: false,
        backgroundColor: '#10b981',
        borderColor: '#10b981',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#060907] text-[#ecfdf5]">
      <div className="p-5">
        <h1 className="text-3xl font-bold mb-5">Dashboard</h1>
        <div className="grid grid-cols-3 gap-5 mb-5">
          <div className="card rounded-lg border border-[rgba(16,185,129,0.08)] bg-[#0d120f] p-5">
            <h2 className="text-xl font-semibold">Total Jobs</h2>
            <p className="text-2xl">{totalJobs}</p>
          </div>
          <div className="card rounded-lg border border-[rgba(16,185,129,0.08)] bg-[#0d120f] p-5">
            <h2 className="text-xl font-semibold">Total Tests</h2>
            <p className="text-2xl">{totalTests}</p>
          </div>
          <div className="card rounded-lg border border-[rgba(16,185,129,0.08)] bg-[#0d120f] p-5">
            <h2 className="text-xl font-semibold">Success Rate</h2>
            <p className="text-2xl">{successRate}%</p>
          </div>
          <div className="card rounded-lg border border-[rgba(16,185,129,0.08)] bg-[#0d120f] p-5">
            <h2 className="text-xl font-semibold">RPO Adherence</h2>
            <p className="text-2xl">{rpoAdherence}</p>
          </div>
        </div>
        <div className="mb-5">
          <h2 className="text-2xl font-semibold mb-3">Recent Activity</h2>
          <ul className="list-disc pl-5">
            {recentActivity.map((activity, index) => (
              <li key={index}>
                {activity.type} {activity.name} {activity.action} {formatDistanceToNow(new Date(activity.time))}
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-5">
          <h2 className="text-2xl font-semibold mb-3">Test Results Over Time</h2>
          <LineChart data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;