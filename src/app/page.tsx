// FILE: src/app/page.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Terminal, 
  RefreshCw, 
  FileSpreadsheet, 
  Layers, 
  Clock, 
  Mail, 
  Globe, 
  ChevronRight, 
  ArrowRight,
  Database,
  Search,
  CreditCard,
  Lock,
  Loader
} from 'lucide-react';

const testimonials = [
  { name: 'Michael Chen', role: 'CTO, StackRestore', text: 'BackupVerify saved us from a disastrous ransomware restore phase. The silent automated tests work flawlessly.' },
  { name: 'Sarah Jenkins', role: 'Lead DevOps, CloudFlow', text: 'Integrating this into our SOC pipeline is the best decision we made. Finally, a tool that actually tests recoveries.' },
  { name: 'Budi Santoso', role: 'IT Manager, TelkoIndo', text: 'Sangat menghemat waktu tim kami. Verifikasi backup yang dulunya butuh seharian kini otomatis berjalan tiap jam.' },
  { name: 'Dave Miller', role: 'MSP Operations, SecurIT', text: 'We manage 200+ customer VMs. BackupVerify automatically spins them up in sandboxes and prints compliance reports.' },
  { name: 'Elena Rostova', role: 'Compliance Director, FinGuard', text: 'ISO 27001 disaster recovery audits are a breeze now. The PDF export log is legally bulletproof evidence.' },
  { name: 'Hasan Ali', role: 'Principal Architect, MedTech', text: 'The sandboxed integrity checks are brilliant. Zero performance impact on our live running nodes.' },
];

const faqs = [
  { question: 'How does BackupVerify automatically verify backups?', answer: 'BackupVerify connects to your backup vault, securely clones the data block into a secure, isolated sandbox environment, runs automatic recovery test scripts, and records log data before tearing down the environment.' },
  { question: 'Does this interfere with my production databases or servers?', answer: 'Absolutely not. All recovery tests run inside temporary virtual environments (sandboxes) that are completely isolated from your production networks.' },
  { question: 'Which backup sources are supported?', answer: 'We natively support File Systems, Databases (PostgreSQL, MySQL, MongoDB), and Virtual Machines (VMware, Hyper-V, AWS EC2).' },
  { question: 'What is RPO Adherence tracking?', answer: 'It calculates the actual time distance between your latest verified backup and current time, showing whether you are meeting your Recovery Point Objective (RPO) SLA requirements.' },
  { question: 'How do email and webhook notifications work?', answer: 'You can configure alert policies. When a recovery verification test fails, a real-time event triggers an email alert or a POST request to your specified webhook URL (e.g. Slack/Discord).' },
  { question: 'Can I export compliance audits for ISO 27001?', answer: 'Yes. The platform generates comprehensive compliance reports in PDF or CSV formats showing historic verification pass rates and test script execution outputs.' },
];

const features = [
  { title: 'Automated Sandbox Verification', desc: 'No manual intervention required. Backups are booted in sandbox and verified automatically.', icon: ShieldCheck },
  { title: 'Script-based Recovery Tests', desc: 'Run custom validation scripts inside the sandbox to ensure application layers start.', icon: Terminal },
  { title: 'RPO Adherence Audits', desc: 'Compute real-time compliance metrics to guarantee zero data loss windows.', icon: Clock },
  { title: 'Smart Alert Notifications', desc: 'Get notified via webhook and email the second a backup file fails to load.', icon: RefreshCw },
  { title: 'ISO 27001 Compliance Reports', desc: 'Export verifiable evidence logs to prove recoverability to system auditors.', icon: FileSpreadsheet },
  { title: 'Multi-Vault Support', desc: 'Validate backups across local, AWS S3, Cloudflare R2, and Azure Blob vaults.', icon: Layers }
];

const featuresID = [
  { title: 'Verifikasi Sandbox Otomatis', desc: 'Tanpa intervensi manual. File backup dimuat di sandbox dan diverifikasi mandiri.', icon: ShieldCheck },
  { title: 'Skrip Pengujian Pemulihan', desc: 'Jalankan skrip kustom di dalam sandbox untuk memastikan lapisan aplikasi berjalan.', icon: Terminal },
  { title: 'Audit Kepatuhan RPO', desc: 'Hitung metrik kepatuhan langsung untuk menjamin jendela kehilangan data nol.', icon: Clock },
  { title: 'Notifikasi Alarm Pintar', desc: 'Dapatkan pemberitahuan via webhook & email saat berkas backup gagal dimuat.', icon: RefreshCw },
  { title: 'Laporan Kepatuhan ISO 27001', desc: 'Ekspor log bukti otentik untuk membuktikan pemulihan data kepada auditor.', icon: FileSpreadsheet },
  { title: 'Dukungan Multi-Vault', desc: 'Validasi backup di penyimpanan lokal, AWS S3, Cloudflare R2, dan Azure Blob.', icon: Layers }
];

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [lang, setLang] = useState<'EN' | 'ID'>('EN');
  const [abTestGroup, setAbTestGroup] = useState<string>('A');
  const [cookieConsent, setCookieConsent] = useState<boolean>(true);

  // Checkout Modal State
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<string>('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    // i18n
    const savedLang = localStorage.getItem('app_lang');
    if (savedLang) setLang(savedLang as 'EN' | 'ID');

    // A/B test
    let group = localStorage.getItem('ab_test_group');
    if (!group) {
      group = Math.random() > 0.5 ? 'A' : 'B';
      localStorage.setItem('ab_test_group', group);
    }
    setAbTestGroup(group);

    // GDPR
    const gdpr = localStorage.getItem('cookie-consent');
    if (gdpr === 'accepted' || gdpr === 'declined') {
      setCookieConsent(false);
    }
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('lead_email', email);
    setEmail('');
    alert(lang === 'EN' ? 'Thank you! We will keep you updated.' : 'Terima kasih! Kami akan memberi Anda kabar terbaru.');
  };

  const handleCookieAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setCookieConsent(false);
  };

  const handleCookieDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setCookieConsent(false);
  };

  const toggleLanguage = () => {
    const next = lang === 'EN' ? 'ID' : 'EN';
    setLang(next);
    localStorage.setItem('app_lang', next);
  };

  const handleOpenCheckout = (planName: string, priceVal: string) => {
    setSelectedPlan(planName);
    setSelectedPrice(priceVal);
    setValidationError('');
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!checkoutEmail.includes('@')) {
      setValidationError(lang === 'EN' ? 'Please enter a valid email address.' : 'Silakan masukkan alamat email yang valid.');
      return;
    }
    if (cardNumber.replace(/\s/g, '').length < 16) {
      setValidationError(lang === 'EN' ? 'Card number must be 16 digits.' : 'Nomor kartu harus terdiri dari 16 digit.');
      return;
    }
    if (!cardExpiry.includes('/')) {
      setValidationError(lang === 'EN' ? 'Expiry format must be MM/YY.' : 'Format kedaluwarsa harus MM/YY.');
      return;
    }
    if (cardCvv.length < 3) {
      setValidationError(lang === 'EN' ? 'CVV must be at least 3 digits.' : 'CVV harus terdiri dari minimal 3 digit.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      localStorage.setItem('checkout_completed', 'true');
      localStorage.setItem('subscribed_plan', selectedPlan || '');
      setSelectedPlan(null);
      
      // Auto-populate email capture to lead database
      localStorage.setItem('lead_email', checkoutEmail);

      alert(lang === 'EN' 
        ? `Payment successful! Welcome to BackupVerify ${selectedPlan}. Redirecting to dashboard...`
        : `Pembayaran sukses! Selamat datang di BackupVerify ${selectedPlan}. Mengalihkan ke dashboard...`
      );
      router.push('/dashboard');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#060907] text-[#ecfdf5] font-sans selection:bg-[#10b981]/30 selection:text-white">
      {/* NAVBAR */}
      <nav className="border-b border-[rgba(16,185,129,0.05)] bg-[#060907]/75 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="h-5 w-5 text-[#10b981]" />
            <span className="font-mono text-base font-bold tracking-wider uppercase bg-gradient-to-r from-[#10b981] to-[#34d399] bg-clip-text text-transparent">
              BackupVerify
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <button 
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded border border-[rgba(16,185,129,0.12)] text-xs text-[#a7f3d0] hover:bg-white/5"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>{lang}</span>
            </button>
            <Link 
              href="/dashboard" 
              className="px-4 py-2 text-xs font-semibold rounded bg-[#10b981] text-white hover:bg-[#34d399] transition-all flex items-center space-x-1.5 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
            >
              <span>{lang === 'EN' ? 'Enter Dashboard' : 'Masuk Dashboard'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[rgba(16,185,129,0.05)] via-transparent to-transparent"></div>
        <div className="container mx-auto px-6 relative text-center">
          <div className="inline-flex items-center space-x-2 bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.15)] px-3 py-1 rounded-full text-xs font-mono text-[#10b981] mb-6">
            <span>{lang === 'EN' ? 'RECOVERY-POINT COMPLIANCE' : 'KEPATUHAN RECOVERY-POINT'}</span>
          </div>

          {abTestGroup === 'A' ? (
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
              {lang === 'EN' ? 'Stop Guessing If Your' : 'Berhenti Menebak Apakah'} <br />
              <span className="bg-gradient-to-r from-[#10b981] to-[#34d399] bg-clip-text text-transparent">
                {lang === 'EN' ? 'Backups Will Restore' : 'Backup Anda Bisa Dipulihkan'}
              </span>
            </h1>
          ) : (
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
              {lang === 'EN' ? 'Automated Sandbox Testing For' : 'Pengujian Sandbox Otomatis Untuk'} <br />
              <span className="bg-gradient-to-r from-[#10b981] to-[#34d399] bg-clip-text text-transparent">
                {lang === 'EN' ? 'Guaranteed Recovery SLAs' : 'Garansi SLA Pemulihan Data'}
              </span>
            </h1>
          )}

          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#a7f3d0]/60 leading-relaxed mb-8">
            {lang === 'EN' 
              ? 'BackupVerify automates non-disruptive sandbox restores. It boots backup files, runs system health scripts, and generates auditable ISO 27001 compliance logs.'
              : 'BackupVerify mengotomatiskan pemulihan sandbox tanpa gangguan. Sistem memuat file backup, menjalankan skrip kesehatan, dan menghasilkan log kepatuhan ISO 27001.'}
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={() => handleOpenCheckout('Production Pro', '$29/mo')}
              className="w-full sm:w-auto px-8 py-3.5 rounded bg-[#10b981] hover:bg-[#34d399] text-sm font-bold text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center justify-center space-x-2"
            >
              <span>{lang === 'EN' ? 'Start Free Verification' : 'Mulai Verifikasi Gratis'}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
            <a 
              href="#features"
              className="w-full sm:w-auto px-8 py-3.5 rounded border border-[rgba(16,185,129,0.12)] text-sm font-semibold text-[#a7f3d0] hover:bg-white/5 transition-all text-center"
            >
              {lang === 'EN' ? 'Read Features' : 'Lihat Fitur'}
            </a>
          </div>
        </div>
      </header>

      {/* CORE FEATURES GRID */}
      <section id="features" className="py-24 border-t border-[rgba(16,185,129,0.05)] bg-[#090d0a]/30">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              {lang === 'EN' ? 'Complete Verification Pipeline' : 'Pipa Verifikasi Lengkap'}
            </h2>
            <p className="text-xs md:text-sm text-[#a7f3d0]/65 font-mono">
              {lang === 'EN' ? 'PROVING RECOVERABILITY, NOT JUST REPORTING FILE STATUS' : 'MEMBUKTIKAN PEMULIHAN, BUKAN HANYA LAPORAN FILE'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(lang === 'EN' ? features : featuresID).map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="card p-6 border border-[rgba(16,185,129,0.08)] bg-[#0d120f] rounded-lg relative overflow-hidden group hover:border-[rgba(16,185,129,0.15)] transition-all duration-300">
                  <div className="h-10 w-10 rounded bg-[rgba(16,185,129,0.08)] flex items-center justify-center text-[#10b981] mb-5 border border-[rgba(16,185,129,0.12)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-xs text-[#a7f3d0]/50 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRICING TABLE */}
      <section className="py-24 border-t border-[rgba(16,185,129,0.05)] bg-[#060907]">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              {lang === 'EN' ? 'Flexible Enterprise Pricing' : 'Harga Enterprise Fleksibel'}
            </h2>
            <p className="text-xs md:text-sm text-[#a7f3d0]/65 font-mono">
              {lang === 'EN' ? 'SCALE SECURELY FROM A SINGLE INSTANCE TO MULTI-CLOUD VAULTS' : 'SKALA AMAN DARI SATU INSTANCE HINGGA MULTI-CLOUD VAULT'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free */}
            <div className="card p-8 border border-[rgba(16,185,129,0.08)] bg-[#0d120f] rounded-lg flex flex-col justify-between hover:scale-[1.01] transition-all">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Developer Free</h3>
                <p className="text-xs text-[#a7f3d0]/50 mb-6">{lang === 'EN' ? 'Perfect for testing local backup validation.' : 'Cocok untuk mencoba validasi backup lokal.'}</p>
                <div className="text-4xl font-mono font-bold text-white mb-6">$0</div>
                <ul className="space-y-3 font-mono text-xs text-[#a7f3d0]/70 mb-8">
                  <li>• 1 Vault Target</li>
                  <li>• 2 Backup Jobs</li>
                  <li>• Manual Sandbox Runs</li>
                  <li>• Local JSON State</li>
                  <li>• Community Slack</li>
                </ul>
              </div>
              <button 
                onClick={() => handleOpenCheckout('Developer Free', '$0')}
                className="w-full py-2.5 rounded bg-white/5 border border-[rgba(16,185,129,0.12)] hover:bg-white/10 text-center font-bold text-xs text-white transition-all"
              >
                {lang === 'EN' ? 'Start Free' : 'Mulai Gratis'}
              </button>
            </div>

            {/* Pro */}
            <div className="card p-8 border-2 border-[#10b981] bg-[#0f1612] rounded-lg flex flex-col justify-between shadow-[0_0_20px_rgba(16,185,129,0.1)] relative">
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-[#10b981] text-white text-[9px] font-bold uppercase font-mono px-2.5 py-0.5 rounded-full tracking-wider">
                {lang === 'EN' ? 'POPULAR' : 'POPULER'}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Production Pro</h3>
                <p className="text-xs text-[#a7f3d0]/50 mb-6">{lang === 'EN' ? 'Automated daily verification pipeline.' : 'Pipa verifikasi otomatis harian.'}</p>
                <div className="text-4xl font-mono font-bold text-white mb-6">$29<span className="text-xs text-[#a7f3d0]/50">/mo</span></div>
                <ul className="space-y-3 font-mono text-xs text-[#a7f3d0]/75 mb-8">
                  <li>• 5 Vault Targets</li>
                  <li>• 10 Backup Jobs</li>
                  <li>• Automated Sandbox Cron</li>
                  <li>• Webhook / Email Alerts</li>
                  <li>• PDF Audit Export</li>
                  <li>• Priority Email</li>
                </ul>
              </div>
              <button 
                onClick={() => handleOpenCheckout('Production Pro', '$29/mo')}
                className="w-full py-2.5 rounded bg-[#10b981] hover:bg-[#34d399] text-center font-bold text-xs text-white transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)]"
              >
                {lang === 'EN' ? 'Upgrade Pro' : 'Tingkatkan Pro'}
              </button>
            </div>

            {/* Enterprise */}
            <div className="card p-8 border border-[rgba(16,185,129,0.08)] bg-[#0d120f] rounded-lg flex flex-col justify-between hover:scale-[1.01] transition-all">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Cloud Enterprise</h3>
                <p className="text-xs text-[#a7f3d0]/50 mb-6">{lang === 'EN' ? 'High throughput multi-region vaults.' : 'Vault multi-wilayah kapasitas tinggi.'}</p>
                <div className="text-4xl font-mono font-bold text-white mb-6">$99<span className="text-xs text-[#a7f3d0]/50">/mo</span></div>
                <ul className="space-y-3 font-mono text-xs text-[#a7f3d0]/70 mb-8">
                  <li>• Unlimited Vaults</li>
                  <li>• Unlimited Jobs</li>
                  <li>• Instant Script Trigger</li>
                  <li>• Multi-Region Sandbox</li>
                  <li>• SSO/SAML & API Keys</li>
                  <li>• 24/7 SLA Support</li>
                </ul>
              </div>
              <button 
                onClick={() => handleOpenCheckout('Cloud Enterprise', '$99/mo')}
                className="w-full py-2.5 rounded bg-white/5 border border-[rgba(16,185,129,0.12)] hover:bg-white/10 text-center font-bold text-xs text-white transition-all"
              >
                {lang === 'EN' ? 'Contact Sales' : 'Hubungi Sales'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 border-t border-[rgba(16,185,129,0.05)] bg-[#090d0a]/30">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              {lang === 'EN' ? 'Trusted by Site Reliability Engineers' : 'Dipercaya oleh Site Reliability Engineer'}
            </h2>
            <p className="text-xs md:text-sm text-[#a7f3d0]/65 font-mono">
              {lang === 'EN' ? 'PRODUCING AUDIT EVIDENCE FOR LEADING SYSTEM TEAMS' : 'PENGUMPUL BUKTI AUDIT UNTUK TIM UTAMA'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testi, idx) => (
              <div key={idx} className="card p-6 border border-[rgba(16,185,129,0.08)] bg-[#0d120f] rounded-lg">
                <p className="text-xs text-[#a7f3d0]/60 leading-relaxed italic mb-4">"{testi.text}"</p>
                <div className="flex items-center space-x-2 pt-2 border-t border-white/5">
                  <div className="h-7 w-7 rounded-full bg-[rgba(16,185,129,0.12)] text-[#10b981] flex items-center justify-center font-bold text-xs">
                    {testi.name[0]}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{testi.name}</h4>
                    <p className="text-[10px] text-[#a7f3d0]/40 font-mono">{testi.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COLLAPSIBLE FAQ LIST */}
      <section className="py-24 border-t border-[rgba(16,185,129,0.05)] bg-[#060907]">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              {lang === 'EN' ? 'Frequently Asked Questions' : 'Pertanyaan Sering Diajukan'}
            </h2>
            <p className="text-xs md:text-sm text-[#a7f3d0]/65 font-mono">
              {lang === 'EN' ? 'DEEP INSIGHT INTO SANDBOX ARCHITECTURE & SECURITY' : 'PANDUAN LENGKAP ARSITEKTUR SANDBOX & KEAMANAN'}
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <details key={idx} className="group card border border-[rgba(16,185,129,0.08)] bg-[#0d120f] rounded-lg [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer focus:outline-none">
                  <h3 className="text-sm font-bold text-white font-mono">{faq.question}</h3>
                  <span className="h-5 w-5 flex items-center justify-center rounded-full bg-white/5 text-[#10b981] group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="px-5 pb-5 pt-1 text-xs text-[#a7f3d0]/60 leading-relaxed border-t border-white/5">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* LEAD CAPTURE CTA FORM */}
      <section className="py-24 border-t border-[rgba(16,185,129,0.05)] bg-[#090d0a]/30">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">
            {lang === 'EN' ? 'Build Verification Pipeline Today' : 'Bangun Jalur Verifikasi Hari Ini'}
          </h2>
          <p className="text-xs text-[#a7f3d0]/50 mb-8">
            {lang === 'EN' ? 'Keep your SRE teams sleeping securely. Free-tier setup takes less than 2 minutes.' : 'Jaga tim SRE Anda tidur dengan tenang. Pengaturan gratis memakan waktu kurang dari 2 menit.'}
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center max-w-md mx-auto space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="relative w-full">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a7f3d0]/40" />
              <input
                type="email"
                placeholder={lang === 'EN' ? 'Enter corporate email...' : 'Ketik email perusahaan...'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-xs bg-[#0d120f] border border-[rgba(16,185,129,0.12)] rounded text-[#ecfdf5] focus:outline-none focus:border-[#10b981] font-mono"
                required
              />
            </div>
            <button type="submit" className="w-full sm:w-auto px-6 py-3 rounded bg-[#10b981] hover:bg-[#34d399] text-xs font-bold text-white transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)] shrink-0">
              {lang === 'EN' ? 'Get Beta Access' : 'Dapatkan Akses Beta'}
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-[rgba(16,185,129,0.05)] bg-[#060907] font-mono text-xs text-[#a7f3d0]/40">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <p>© 2026 BackupVerify. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-[#10b981] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#10b981] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#10b981] transition-colors">GDPR Audit Info</a>
          </div>
        </div>
      </footer>

      {/* INTERACTIVE CHECKOUT MODAL */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d120f] border border-[rgba(16,185,129,0.2)] w-full max-w-md rounded-lg shadow-2xl overflow-hidden animate-fade-in font-mono text-xs text-[#a7f3d0] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-[rgba(16,185,129,0.08)] bg-[#080b09] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-[#10b981]" />
                <span className="font-bold text-[#ecfdf5]">{lang === 'EN' ? 'SECURE STRIPE CHECKOUT' : 'PEMBAYARAN STRIPE AMAN'}</span>
              </div>
              <button 
                onClick={() => setSelectedPlan(null)}
                className="text-[#a7f3d0]/40 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Plan Info */}
            <div className="p-4 bg-[rgba(16,185,129,0.05)] border-b border-[rgba(16,185,129,0.08)] flex justify-between items-center">
              <div>
                <p className="font-bold text-[#ecfdf5] text-sm">{selectedPlan}</p>
                <p className="text-[10px] text-[#a7f3d0]/50">{lang === 'EN' ? 'Automated Sandbox Pipeline' : 'Pipa Sandbox Otomatis'}</p>
              </div>
              <p className="text-base font-bold text-[#10b981]">{selectedPrice}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-4">
              {validationError && (
                <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-400 rounded text-[11px] leading-relaxed">
                  ⚠️ {validationError}
                </div>
              )}

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-[#a7f3d0]/40">{lang === 'EN' ? 'Account Email' : 'Email Akun'}</label>
                <input
                  type="email"
                  placeholder="admin@corporate.com"
                  value={checkoutEmail}
                  onChange={(e) => setCheckoutEmail(e.target.value)}
                  className="w-full bg-[#060907] border border-[rgba(16,185,129,0.12)] rounded px-3 py-2 text-[#ecfdf5] placeholder-[#a7f3d0]/20 focus:outline-none focus:border-[#10b981]"
                  required
                  disabled={isProcessing}
                />
              </div>

              {/* Cardholder Name */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-[#a7f3d0]/40">{lang === 'EN' ? 'Cardholder Name' : 'Nama Pemilik Kartu'}</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full bg-[#060907] border border-[rgba(16,185,129,0.12)] rounded px-3 py-2 text-[#ecfdf5] placeholder-[#a7f3d0]/20 focus:outline-none focus:border-[#10b981]"
                  required
                  disabled={isProcessing}
                />
              </div>

              {/* Card Number */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-[#a7f3d0]/40">{lang === 'EN' ? 'Card Number' : 'Nomor Kartu'}</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#a7f3d0]/30" />
                  <input
                    type="text"
                    maxLength={19}
                    placeholder="4242 4242 4242 4242"
                    value={cardNumber}
                    onChange={(e) => {
                      // Format digits with space separation
                      const val = e.target.value.replace(/\D/g, '').match(/.{1,4}/g)?.join(' ') || '';
                      setCardNumber(val);
                    }}
                    className="w-full bg-[#060907] border border-[rgba(16,185,129,0.12)] rounded pl-10 pr-3 py-2 text-[#ecfdf5] placeholder-[#a7f3d0]/20 focus:outline-none focus:border-[#10b981]"
                    required
                    disabled={isProcessing}
                  />
                </div>
              </div>

              {/* Expiry & CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-[#a7f3d0]/40">{lang === 'EN' ? 'Expiry (MM/YY)' : 'Kedaluwarsa (MM/YY)'}</label>
                  <input
                    type="text"
                    maxLength={5}
                    placeholder="12/28"
                    value={cardExpiry}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      if (val.length >= 2) {
                        setCardExpiry(val.slice(0, 2) + '/' + val.slice(2, 4));
                      } else {
                        setCardExpiry(val);
                      }
                    }}
                    className="w-full bg-[#060907] border border-[rgba(16,185,129,0.12)] rounded px-3 py-2 text-[#ecfdf5] placeholder-[#a7f3d0]/20 focus:outline-none focus:border-[#10b981] text-center"
                    required
                    disabled={isProcessing}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-[#a7f3d0]/40">CVV</label>
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="•••"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-[#060907] border border-[rgba(16,185,129,0.12)] rounded px-3 py-2 text-[#ecfdf5] placeholder-[#a7f3d0]/20 focus:outline-none focus:border-[#10b981] text-center"
                    required
                    disabled={isProcessing}
                  />
                </div>
              </div>

              {/* Safe Lock advisory */}
              <div className="pt-2 flex items-center space-x-2 text-[10px] text-[#a7f3d0]/40">
                <Lock className="h-3.5 w-3.5 text-[#10b981]" />
                <span>{lang === 'EN' ? 'TLS 1.3 256-bit encryption. Demo simulator mode.' : 'Enkripsi TLS 1.3 256-bit. Mode simulator demo.'}</span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 bg-[#10b981] hover:bg-[#34d399] disabled:opacity-50 text-white rounded font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)] flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>{lang === 'EN' ? 'PROCESSING SECURELY...' : 'MEMPROSES TRANSAKSI...'}</span>
                  </>
                ) : (
                  <span>{lang === 'EN' ? `CONFIRM PAYMENT ${selectedPrice}` : `KONFIRMASI PEMBAYARAN ${selectedPrice}`}</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* GDPR COOKIE BANNER */}
      {cookieConsent && (
        <div className="fixed bottom-6 left-6 z-50 max-w-sm card p-5 border border-[rgba(16,185,129,0.15)] bg-[#0d120f]/90 backdrop-blur-md rounded-lg shadow-2xl flex flex-col font-mono text-xs text-[#a7f3d0] animate-fade-in">
          <p className="leading-relaxed mb-4">
            {lang === 'EN' 
              ? 'We use analytical cookies to benchmark sandbox restore times and optimize user-interface pipelines.'
              : 'Kami menggunakan cookie analitis untuk mengukur waktu pemulihan sandbox dan mengoptimalkan antrean pengguna.'}
          </p>
          <div className="flex justify-end space-x-2">
            <button 
              onClick={handleCookieDecline}
              className="px-3 py-1.5 rounded border border-white/5 hover:bg-white/5 text-[10px] text-[#a7f3d0]/50"
            >
              {lang === 'EN' ? 'Decline' : 'Tolak'}
            </button>
            <button 
              onClick={handleCookieAccept}
              className="px-4 py-1.5 rounded bg-[#10b981] hover:bg-[#34d399] text-[10px] text-white font-bold transition-all shadow-[0_0_10px_rgba(16,185,129,0.15)]"
            >
              {lang === 'EN' ? 'Accept' : 'Terima'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
