'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:2000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to register');
      }

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F3F4] text-[#36454F] flex flex-col justify-between selection:bg-black selection:text-white">
      {/* Minimal Top Header */}
      <header className="border-b border-[#36454F]/10 bg-[#F2F3F4]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-sm tracking-tight transition-transform group-hover:scale-105">
              H
            </span>
            <span className="font-extrabold text-xl tracking-tight text-black">
              HookFlow
            </span>
          </Link>
          <Link
            href="/"
            className="text-xs font-semibold text-[#36454F]/70 hover:text-black transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Register Card */}
      <main className="flex-1 flex items-center justify-center p-6 py-12">
        <div className="w-full max-w-md bg-white border border-[#36454F]/10 rounded-3xl p-8 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-black mb-2">
              Create an account
            </h1>
            <p className="text-sm text-[#36454F]/70 font-normal">
              Set up your account to start dispatching webhooks
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#36454F]/80 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-[#F2F3F4]/60 border border-[#36454F]/15 rounded-xl text-black placeholder:text-[#36454F]/40 text-sm focus:outline-none focus:bg-white focus:border-black transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#36454F]/80 mb-2">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="name@company.com"
                className="w-full px-4 py-3 bg-[#F2F3F4]/60 border border-[#36454F]/15 rounded-xl text-black placeholder:text-[#36454F]/40 text-sm focus:outline-none focus:bg-white focus:border-black transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#36454F]/80 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[#F2F3F4]/60 border border-[#36454F]/15 rounded-xl text-black placeholder:text-[#36454F]/40 text-sm focus:outline-none focus:bg-white focus:border-black transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-black hover:bg-neutral-800 text-white font-semibold text-sm rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer mt-2"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-xs text-[#36454F]/70 mt-8 font-medium">
            Already have an account?{' '}
            <Link href="/login" className="text-black font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-[#36454F]/60 font-medium">
        © {new Date().getFullYear()} HookFlow. All rights reserved.
      </footer>
    </div>
  );
}
