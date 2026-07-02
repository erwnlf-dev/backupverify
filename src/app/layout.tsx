// FILE: src/app/layout.tsx
import { Inter } from 'next/font/google';
import { StoreProvider } from './providers';
import Script from 'next/script';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <title>BackupVerify - Automated Backup Verification</title>
        <meta name="description" content="Automate backup verification with BackupVerify. Ensure your backups are always ready for recovery." />
        <meta property="og:title" content="BackupVerify" />
        <meta property="og:description" content="Automate backup verification with BackupVerify. Ensure your backups are always ready for recovery." />
        <meta property="og:url" content="https://backupverify.com" />
        <meta property="og:site_name" content="BackupVerify" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'BackupVerify',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          description: 'Automate backup verification with BackupVerify. Ensure your backups are always ready for recovery.',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        }) }} />
      </head>
      <body className="min-h-screen bg-[#060907] text-[#ecfdf5]">
        <StoreProvider>
          {children}
        </StoreProvider>
        <Script strategy="lazyOnload" src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
        <Script strategy="lazyOnload" id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </body>
    </html>
  );
}
