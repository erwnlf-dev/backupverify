// FILE: src/app/dashboard/settings/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { z } from 'zod';
import { Settings } from '@/lib/types';
import { Input, Btn } from '@/components/ui';

const settingsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  notifications: z.object({
    email: z.boolean(),
    webhook: z.boolean(),
    webhookUrl: z.string().url({ message: 'Invalid URL' }).optional(),
  }),
  darkMode: z.boolean(),
});

const initialSettings: Settings = {
  name: '',
  email: '',
  notifications: {
    email: false,
    webhook: false,
    webhookUrl: '',
  },
  darkMode: false,
};

const SettingsPage = () => {
  const [settings, setSettings] = useState(initialSettings);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { state, dispatch } = useStore();

  useEffect(() => {
    const storedSettings = JSON.parse(localStorage.getItem('app_settings') || '{}');
    setSettings(storedSettings);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [name]: checked,
      },
    }));
  };

  const handleWebhookUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        webhookUrl: value,
      },
    }));
  };

  const validate = () => {
    try {
      settingsSchema.parse(settings);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors = error.issues.reduce((acc, issue) => {
          acc[issue.path.join('.')] = issue.message;
          return acc;
        }, {} as { [key: string]: string });
        setErrors(validationErrors);
      }
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      localStorage.setItem('app_settings', JSON.stringify(settings));
      dispatch({ type: 'TOAST', payload: 'Settings saved' });
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify({
      backupJobs: state.backupJobs,
      verificationTests: state.verificationTests,
      alerts: state.alerts
    });
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backupverify_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    dispatch({ type: 'TOAST', payload: 'Data exported' });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = JSON.parse(event.target?.result as string);
        dispatch({ type: 'SEED', payload: data as any });
        dispatch({ type: 'TOAST', payload: 'Data imported' });
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data?')) {
      localStorage.clear();
      dispatch({
        type: 'SEED',
        payload: {
          backupJobs: [],
          verificationTests: [],
          alerts: [],
          appSettings: settings,
          loaded: true,
          toast: null
        }
      });
      dispatch({ type: 'TOAST', payload: 'Data reset' });
    }
  };

  return (
    <div className="min-h-screen bg-[#060907] text-[#ecfdf5]">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#d1fae5]">
              Name
            </label>
            <Input
              type="text"
              id="name"
              name="name"
              value={settings.name}
              onChange={handleChange}
              className="mt-1 block w-full"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#d1fae5]">
              Email
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              value={settings.email}
              onChange={handleChange}
              className="mt-1 block w-full"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Notifications</h2>
            <div className="flex items-center space-x-2">
              <Input
                type="checkbox"
                id="email-notifications"
                name="email"
                checked={settings.notifications.email}
                onChange={handleNotificationChange}
              />
              <label htmlFor="email-notifications" className="text-sm text-[#d1fae5]">
                Email Notifications
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="checkbox"
                id="webhook-notifications"
                name="webhook"
                checked={settings.notifications.webhook}
                onChange={handleNotificationChange}
              />
              <label htmlFor="webhook-notifications" className="text-sm text-[#d1fae5]">
                Webhook Notifications
              </label>
            </div>
            {settings.notifications.webhook && (
              <div className="mt-2">
                <label htmlFor="webhook-url" className="block text-sm font-medium text-[#d1fae5]">
                  Webhook URL
                </label>
                <Input
                  type="url"
                  id="webhook-url"
                  name="webhookUrl"
                  value={settings.notifications.webhookUrl || ''}
                  onChange={handleWebhookUrlChange}
                  className="mt-1 block w-full"
                />
                {errors['notifications.webhookUrl'] && (
                  <p className="text-red-500 text-sm mt-1">{errors['notifications.webhookUrl']}</p>
                )}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#d1fae5]">
              Dark Mode
            </label>
            <Input
              type="checkbox"
              id="dark-mode"
              name="darkMode"
              checked={settings.darkMode}
              onChange={handleChange}
            />
          </div>
          <Btn type="submit" className="mt-4">
            Save Settings
          </Btn>
        </form>
        <div className="mt-8 space-y-4">
          <Btn onClick={handleExport} className="w-full">
            Export Data
          </Btn>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
            id="import-file"
          />
          <label htmlFor="import-file" className="btn w-full">
            Import Data
          </label>
          <Btn onClick={handleReset} className="w-full btn-danger">
            Reset Data
          </Btn>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;