// FILE: src/app/dashboard/alerts/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Alert } from '@/lib/types';
import { validateInput } from '@/lib/validate';
import { z } from 'zod';
import { CheckCircleIcon, XCircleIcon } from 'lucide-react';

const alertSchema = z.object({
  id: z.string(),
  testId: z.string(),
  backupJobId: z.string(),
  type: z.enum(['test-failure', 'rpo-breach', 'low-success-rate']),
  message: z.string(),
  acknowledged: z.boolean(),
  createdAt: z.number(),
});

function AlertList() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);
  const { state, dispatch } = useStore();

  useEffect(() => {
    setAlerts(state.alerts);
  }, [state.alerts]);

  const handleAcknowledgeSingle = (id: string) => {
    const updatedAlerts = alerts.map(alert =>
      alert.id === id ? { ...alert, acknowledged: true } : alert
    );
    dispatch({ type: 'UPDATE_ENTITY', entity: 'alerts', payload: updatedAlerts });
    setAlerts(updatedAlerts);
  };

  const handleAcknowledgeBulk = () => {
    const updatedAlerts = alerts.map(alert =>
      selectedAlerts.includes(alert.id) ? { ...alert, acknowledged: true } : alert
    );
    dispatch({ type: 'UPDATE_ENTITY', entity: 'alerts', payload: updatedAlerts });
    setAlerts(updatedAlerts);
    setSelectedAlerts([]);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedAlerts(alerts.map(alert => alert.id));
    } else {
      setSelectedAlerts([]);
    }
  };

  const handleSelect = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
    if (event.target.checked) {
      setSelectedAlerts([...selectedAlerts, id]);
    } else {
      setSelectedAlerts(selectedAlerts.filter(selectedId => selectedId !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#060907] text-[#ecfdf5]">
      <div className="p-5">
        <h1 className="text-2xl font-bold mb-5">Alerts</h1>
        <button
          className="rounded-md bg-[#10b981] px-4 py-2 text-sm font-medium text-white hover:bg-[#34d399]"
          onClick={handleAcknowledgeBulk}
          disabled={selectedAlerts.length === 0}
        >
          Acknowledge Selected
        </button>
        <table className="w-full mt-5">
          <thead>
            <tr>
              <th className="px-4 py-2">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedAlerts.length === alerts.length && alerts.length > 0}
                />
              </th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Message</th>
              <th className="px-4 py-2">Acknowledged</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map(alert => (
              <tr key={alert.id}>
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedAlerts.includes(alert.id)}
                    onChange={(event) => handleSelect(event, alert.id)}
                  />
                </td>
                <td className="px-4 py-2">{alert.type}</td>
                <td className="px-4 py-2">{alert.message}</td>
                <td className="px-4 py-2">
                  {alert.acknowledged ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircleIcon className="w-5 h-5 text-red-500" />
                  )}
                </td>
                <td className="px-4 py-2">
                  <button
                    className="rounded-md bg-[#10b981] px-4 py-2 text-sm font-medium text-white hover:bg-[#34d399]"
                    onClick={() => handleAcknowledgeSingle(alert.id)}
                  >
                    Acknowledge
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AlertList;