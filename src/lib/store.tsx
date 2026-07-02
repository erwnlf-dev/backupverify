// FILE: src/lib/store.tsx
'use client';
import { createContext, useContext, useReducer, useEffect } from 'react';
import { validateInput } from './validate';

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

interface State {
  backupJobs: BackupJob[];
  verificationTests: VerificationTest[];
  alerts: Alert[];
  appSettings: AppSettings;
  loaded: boolean;
  toast?: string | null;
}

type Action =
  | { type: 'SEED'; payload: any }
  | { type: 'ADD_ENTITY'; entity: 'backupJobs' | 'verificationTests' | 'alerts'; payload: any }
  | { type: 'UPDATE_ENTITY'; entity: 'backupJobs' | 'verificationTests' | 'alerts'; payload: any }
  | { type: 'DELETE_ENTITY'; entity: 'backupJobs' | 'verificationTests' | 'alerts'; payload: string }
  | { type: 'TOAST'; payload: string }
  | { type: 'DISMISS_TOAST' };

const initialState: State = {
  backupJobs: [],
  verificationTests: [],
  alerts: [],
  appSettings: {
    notifications: {
      email: false,
      webhook: false,
      webhookUrl: '',
    },
    darkMode: false,
  },
  loaded: false,
  toast: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SEED':
      return { ...action.payload, loaded: true };
    case 'ADD_ENTITY':
      return {
        ...state,
        [action.entity]: [...state[action.entity], { ...action.payload, createdAt: Date.now(), updatedAt: Date.now() }],
        toast: 'Created',
      };
    case 'UPDATE_ENTITY':
      return {
        ...state,
        [action.entity]: state[action.entity].map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload, updatedAt: Date.now() } : item
        ),
        toast: 'Updated',
      };
    case 'DELETE_ENTITY':
      return {
        ...state,
        [action.entity]: state[action.entity].filter((item) => item.id !== action.payload),
        toast: 'Deleted',
      };
    case 'TOAST':
      return { ...state, toast: action.payload };
    case 'DISMISS_TOAST':
      return { ...state, toast: null };
    default:
      return state;
  }
}

const StoreContext = createContext<{ state: State; dispatch: React.Dispatch<Action> }>({
  state: initialState,
  dispatch: () => {},
});

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const loadState = () => {
      const backupJobs = JSON.parse(localStorage.getItem('app_backupJobs') || '[]');
      const verificationTests = JSON.parse(localStorage.getItem('app_verificationTests') || '[]');
      const alerts = JSON.parse(localStorage.getItem('app_alerts') || '[]');
      const appSettings = JSON.parse(localStorage.getItem('app_settings') || JSON.stringify(initialState.appSettings));

      if (backupJobs.length === 0 && verificationTests.length === 0 && alerts.length === 0) {
        dispatch({ type: 'SEED', payload: { backupJobs: seedBackupJobs, verificationTests: [], alerts: [], appSettings, loaded: true } });
      } else {
        dispatch({ type: 'SEED', payload: { backupJobs, verificationTests, alerts, appSettings, loaded: true } });
      }
    };

    loadState();
  }, []);

  useEffect(() => {
    if (state.loaded) {
      localStorage.setItem('app_backupJobs', JSON.stringify(state.backupJobs));
      localStorage.setItem('app_verificationTests', JSON.stringify(state.verificationTests));
      localStorage.setItem('app_alerts', JSON.stringify(state.alerts));
      localStorage.setItem('app_settings', JSON.stringify(state.appSettings));
    }
  }, [state]);

  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
};

export const useStore = () => useContext(StoreContext);

const seedBackupJobs: BackupJob[] = [
  { id: '1', name: 'Daily Server Backup', source: 'vm', schedule: '0 0 * * *', retentionDays: 30, vault: 'AWS S3', status: 'active', lastRun: Date.now() - 86400000, createdAt: Date.now() - 86400000, updatedAt: Date.now() - 86400000 },
  { id: '2', name: 'Weekly Database Backup', source: 'database', schedule: '0 0 * * 0', retentionDays: 90, vault: 'Azure Blob', status: 'paused', lastRun: Date.now() - 604800000, createdAt: Date.now() - 604800000, updatedAt: Date.now() - 604800000 },
  { id: '3', name: 'Monthly File System Backup', source: 'file-system', schedule: '0 0 1 * *', retentionDays: 365, vault: 'Google Cloud Storage', status: 'active', lastRun: Date.now() - 2592000000, createdAt: Date.now() - 2592000000, updatedAt: Date.now() - 2592000000 },
];