// FILE: src/app/page.tsx
'use client';
import { useState } from 'react';
import { MailIcon } from 'lucide-react';

const testimonials = [
  { name: 'John Doe', text: 'BackupVerify saved us from a disaster!' },
  { name: 'Jane Smith', text: 'Best backup solution out there.' },
];

const faqs = [
  { question: 'What is BackupVerify?', answer: 'It automates backup verification through sandbox restore testing.' },
  { question: 'How does it work?', answer: 'It restores backups to a sandbox, runs scripts, and records results.' },
  { question: 'Is it secure?', answer: 'Yes, it uses secure methods to handle your data.' },
];

export default function Home() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('emailCapture', email);
    setEmail('');
    alert('Email captured!');
  };

  return (
    <div className="min-h-screen bg-[#060907] text-[#ecfdf5]">
      <header className="py-12">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-brand to-hover bg-clip-text text-transparent">BackupVerify</h1>
          <p className="mt-4 text-xl">Ensure your backups are always ready to restore.</p>
        </div>
      </header>
      <section className="py-12">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card">
              <h3>Automated Verification</h3>
              <p>No more manual testing. Let BackupVerify handle it.</p>
            </div>
            <div className="card">
              <h3>Sandbox Restores</h3>
              <p>Test restores in a safe environment without affecting production.</p>
            </div>
            <div className="card">
              <h3>Compliance Reports</h3>
              <p>Generate detailed reports to meet compliance standards.</p>
            </div>
            {/* Add more features here */}
          </div>
        </div>
      </section>
      <section className="py-12 bg-[#0d120f]">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-[#ecfdf5]">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card">
              <h3>Free</h3>
              <p className="text-2xl font-bold">$0</p>
              <ul>
                <li>1 user</li>
                <li>Basic features</li>
                <li>Community support</li>
                <li>100 items</li>
                <li>No AI</li>
              </ul>
              <button className="btn-primary mt-4">Sign Up</button>
            </div>
            <div className="card">
              <h3>Pro</h3>
              <p className="text-2xl font-bold">$9-29/mo</p>
              <ul>
                <li>5 users</li>
                <li>All features</li>
                <li>Email support</li>
                <li>Unlimited</li>
                <li>AI features</li>
              </ul>
              <button className="btn-primary mt-4">Sign Up</button>
            </div>
            <div className="card">
              <h3>Enterprise</h3>
              <p className="text-2xl font-bold">$49-99/mo</p>
              <ul>
                <li>Unlimited users</li>
                <li>Custom config</li>
                <li>Priority support</li>
                <li>SSO/SAML</li>
                <li>API access</li>
              </ul>
              <button className="btn-primary mt-4">Contact Us</button>
            </div>
          </div>
        </div>
      </section>
      <section className="py-12">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8">Social Proof</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card">
                <p>{testimonial.text}</p>
                <p className="mt-2 text-subtle">— {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12 bg-[#0d120f]">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-[#ecfdf5]">FAQ</h2>
          <div className="grid grid-cols-1 gap-8">
            {faqs.map((faq, index) => (
              <div key={index} className="card">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8">Join Our Community</h2>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row items-center">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input mr-0 sm:mr-4 mb-4 sm:mb-0"
                required
              />
              <button type="submit" className="btn-primary">
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </section>
      <footer className="py-8 bg-[#060907]">
        <div className="container mx-auto text-center">
          <p>&copy; 2023 BackupVerify. All rights reserved.</p>
          <nav className="mt-4">
            <a href="#" className="text-subtle mr-4">Privacy Policy</a>
            <a href="#" className="text-subtle">Terms of Service</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
