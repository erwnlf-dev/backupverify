// FILE: src/app/dashboard/layout.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { useStore } from '@/lib/store';
import { 
  LayoutDashboard, 
  Database, 
  FileCheck, 
  AlertOctagon, 
  Settings as SettingsIcon, 
  Search, 
  Globe, 
  HelpCircle, 
  Terminal,
  LogOut
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useStore();
  const [lang, setLang] = useState<'EN' | 'ID'>('EN');
  const [abTestGroup, setAbTestGroup] = useState<string>('A');
  const [isCmdKOpen, setIsCmdKOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // i18n initialization
    const savedLang = localStorage.getItem('app_lang');
    if (savedLang) setLang(savedLang as 'EN' | 'ID');

    // A/B Testing initialization
    let savedAb = localStorage.getItem('ab_test_group');
    if (!savedAb) {
      savedAb = Math.random() > 0.5 ? 'A' : 'B';
      localStorage.setItem('ab_test_group', savedAb);
    }
    setAbTestGroup(savedAb);

    // Referral tracking
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      localStorage.setItem('affiliate_ref', ref);
    }

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdKOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsCmdKOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleLanguage = () => {
    const next = lang === 'EN' ? 'ID' : 'EN';
    setLang(next);
    localStorage.setItem('app_lang', next);
  };

  const navItems = [
    { name: lang === 'EN' ? 'Overview' : 'Ikhtisar', path: '/dashboard', icon: LayoutDashboard },
    { name: lang === 'EN' ? 'Backup Jobs' : 'Pekerjaan Backup', path: '/dashboard/backups', icon: Database },
    { name: lang === 'EN' ? 'Recovery Tests' : 'Pengujian Pemulihan', path: '/dashboard/tests', icon: FileCheck },
    { name: lang === 'EN' ? 'Alerts' : 'Peringatan', path: '/dashboard/alerts', icon: AlertOctagon },
    { name: lang === 'EN' ? 'Settings' : 'Pengaturan', path: '/dashboard/settings', icon: SettingsIcon },
  ];

  // Command palette search items
  const filteredSearchItems = searchQuery.trim() === '' 
    ? [] 
    : [
        ...navItems.map(item => ({ type: 'navigation', label: `Go to ${item.name}`, action: () => { router.push(item.path); setIsCmdKOpen(false); } })),
        ...state.backupJobs.filter(job => job.name.toLowerCase().includes(searchQuery.toLowerCase())).map(job => ({
          type: 'backup',
          label: `Backup: ${job.name} (${job.source})`,
          action: () => { router.push(`/dashboard/backups`); setIsCmdKOpen(false); }
        })),
        ...state.alerts.filter(alert => alert.message.toLowerCase().includes(searchQuery.toLowerCase())).map(alert => ({
          type: 'alert',
          label: `Alert: ${alert.message}`,
          action: () => { router.push(`/dashboard/alerts`); setIsCmdKOpen(false); }
        }))
      ];

  return (
    <div className="min-h-screen bg-[#060907] text-[#ecfdf5] flex">
      {/* SIDEBAR NAVIGATION */}
      <aside className="fixed inset-y-0 left-0 w-64 border-r border-[rgba(16,185,129,0.08)] bg-[#0d120f] flex flex-col z-20">
        <div className="p-6 border-b border-[rgba(16,185,129,0.08)] flex items-center space-x-2">
          <Terminal className="h-6 w-6 text-[#10b981]" />
          <span className="font-mono text-lg font-bold tracking-wider uppercase bg-gradient-to-r from-[#10b981] to-[#34d399] bg-clip-text text-transparent">
            BackupVerify
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
                  isActive 
                    ? 'bg-[rgba(16,185,129,0.12)] text-[#10b981] border-l-2 border-[#10b981] font-semibold' 
                    : 'text-[#a7f3d0]/75 hover:bg-white/5 hover:text-[#ecfdf5]'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-[#10b981]' : 'text-[#a7f3d0]/60'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* PROFILE INFO & LANGUAGE TOGGLE */}
        <div className="p-4 border-t border-[rgba(16,185,129,0.08)] space-y-3 bg-[#0a0e0b]">
          <div className="flex items-center justify-between">
            <button 
              onClick={toggleLanguage}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded border border-[rgba(16,185,129,0.12)] text-xs text-[#a7f3d0] hover:bg-white/5"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>{lang}</span>
            </button>
            <span className="text-[10px] uppercase font-mono text-[#a7f3d0]/40 tracking-wider">
              Group {abTestGroup}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-[rgba(16,185,129,0.15)] flex items-center justify-center font-bold text-xs text-[#10b981]">
                AD
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-[#ecfdf5]">Admin</p>
                <p className="text-[10px] text-[#a7f3d0]/50 font-mono">verify.local</p>
              </div>
            </div>
            <Link href="/" className="p-1.5 rounded hover:bg-white/5 text-[#a7f3d0]/50 hover:text-[#ef4444] transition-colors">
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        {/* TOP BAR */}
        <header className="sticky top-0 bg-[#060907]/80 backdrop-blur-md border-b border-[rgba(16,185,129,0.05)] h-16 flex items-center justify-between px-8 z-10">
          <div className="flex items-center w-96 relative">
            <Search className="absolute left-3 h-4 w-4 text-[#a7f3d0]/45" />
            <button 
              onClick={() => setIsCmdKOpen(true)}
              className="w-full text-left bg-[#0d120f]/50 border border-[rgba(16,185,129,0.08)] rounded-md pl-10 pr-3 py-1.5 text-xs text-[#a7f3d0]/50 flex items-center justify-between hover:border-[rgba(16,185,129,0.15)]"
            >
              <span>{lang === 'EN' ? 'Search jobs, alerts...' : 'Cari pekerjaan, alarm...'}</span>
              <kbd className="font-mono bg-[rgba(16,185,129,0.15)] text-[10px] text-[#10b981] px-1.5 py-0.5 rounded leading-none">
                ⌘K
              </kbd>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5 text-xs font-mono bg-[rgba(16,185,129,0.08)] px-2.5 py-1 rounded-full border border-[rgba(16,185,129,0.12)] text-[#10b981]">
              <span className="h-2 w-2 rounded-full bg-[#10b981] animate-pulse"></span>
              <span>SANDBOX: READY</span>
            </span>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-8">
          <Toaster position="top-right" toastOptions={{
            style: {
              background: '#0d120f',
              color: '#ecfdf5',
              border: '1px solid rgba(16,185,129,0.15)',
              fontFamily: 'monospace'
            }
          }} />
          {children}
        </main>
      </div>

      {/* COMMAND PALETTE DIALOG (Cmd+K) */}
      {isCmdKOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4">
          <div className="bg-[#0d120f] border border-[rgba(16,185,129,0.15)] w-full max-w-lg rounded-lg shadow-2xl overflow-hidden animate-fade-in">
            <div className="p-4 border-b border-[rgba(16,185,129,0.08)] flex items-center space-x-3">
              <Search className="h-5 w-5 text-[#10b981]" />
              <input
                type="text"
                placeholder={lang === 'EN' ? 'Type to search everything...' : 'Ketik untuk mencari...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-[#ecfdf5] placeholder-[#a7f3d0]/30 w-full text-sm font-mono"
                autoFocus
              />
              <button 
                onClick={() => setIsCmdKOpen(false)}
                className="text-xs font-mono text-[#a7f3d0]/40 hover:text-[#ecfdf5] px-1.5 py-0.5 rounded border border-white/5"
              >
                ESC
              </button>
            </div>
            
            <div className="max-h-72 overflow-y-auto p-2">
              {filteredSearchItems.length > 0 ? (
                filteredSearchItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={item.action}
                    className="w-full text-left px-3 py-2.5 rounded hover:bg-[rgba(16,185,129,0.08)] text-xs text-[#a7f3d0] flex items-center justify-between font-mono transition-colors"
                  >
                    <span>{item.label}</span>
                    <span className="text-[10px] uppercase font-semibold text-[#10b981] bg-[rgba(16,185,129,0.15)] px-1.5 py-0.5 rounded">
                      {item.type}
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-[#a7f3d0]/40 font-mono">
                  {searchQuery ? (lang === 'EN' ? 'No results found.' : 'Tidak ditemukan hasil.') : (lang === 'EN' ? 'Type something to search.' : 'Ketik sesuatu untuk mulai mencari.')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FLOATING HELP/FEEDBACK WIDGET */}
      <div className="fixed bottom-4 right-4 z-40">
        <details className="group bg-[#0d120f] border border-[rgba(16,185,129,0.15)] rounded-lg shadow-lg overflow-hidden">
          <summary className="list-none flex items-center justify-center p-3 cursor-pointer hover:bg-white/5 transition-colors">
            <HelpCircle className="h-5 w-5 text-[#10b981]" />
            <span className="max-w-0 overflow-hidden group-open:max-w-[120px] transition-all duration-300 ease-out pl-0 group-open:pl-2 text-xs font-semibold text-[#ecfdf5]">
              {lang === 'EN' ? 'Help & Support' : 'Bantuan'}
            </span>
          </summary>
          <div className="p-4 border-t border-[rgba(16,185,129,0.08)] w-64 space-y-3 font-mono text-xs text-[#a7f3d0]">
            <p className="font-semibold text-[#10b981]">
              {lang === 'EN' ? 'Quick Command Console' : 'Konsol Perintah Cepat'}
            </p>
            <ul className="space-y-1 bg-[#060907] p-2 rounded border border-white/5 leading-relaxed">
              <li>• <kbd className="bg-white/10 px-1 rounded text-[#ecfdf5]">Ctrl+K</kbd> : search palette</li>
              <li>• <kbd className="bg-white/10 px-1 rounded text-[#ecfdf5]">ESC</kbd> : close panels</li>
            </ul>
            <div className="pt-2 border-t border-white/5">
              <a 
                href="mailto:support@backupverify.com" 
                className="block text-center bg-[#10b981] hover:bg-[#34d399] text-white py-1.5 rounded transition-all"
              >
                {lang === 'EN' ? 'Send Feedback' : 'Kirim Umpan Balik'}
              </a>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
