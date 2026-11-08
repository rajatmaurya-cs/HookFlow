import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      {/* Navbar */}
      <header className="border-b border-slate-800/80 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-lg">
            H
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            HookFlow
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-slate-300 hover:text-white transition font-medium px-4 py-2"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="text-sm bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-xl transition shadow-lg shadow-blue-600/25"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-20 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
          Reliable Webhook Relay & Dispatch Engine
        </div>

        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Ingest, verify, and dispatch webhooks{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
            with zero loss
          </span>
        </h1>

        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed">
          Create an organization, receive your secret API key, queue incoming events with Redis idempotency protection, and auto-dispatch to your target endpoints.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/register"
            className="px-8 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-xl shadow-blue-500/25 transition text-center"
          >
            Create Free Account
          </Link>
          <Link
            href="/login"
            className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold rounded-xl transition text-center"
          >
            Sign In
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 text-left w-full">
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-semibold text-lg text-white mb-1">Redis Idempotency</h3>
            <p className="text-slate-400 text-sm">
              Prevents duplicate clicks and payload ingestion using atomic Redis caching.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
            <div className="text-2xl mb-2">🛡️</div>
            <h3 className="font-semibold text-lg text-white mb-1">Secret Key Auth</h3>
            <p className="text-slate-400 text-sm">
              Verify incoming requests against organization keys before processing.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
            <div className="text-2xl mb-2">🔄</div>
            <h3 className="font-semibold text-lg text-white mb-1">Auto-Dispatch & Backoff</h3>
            <p className="text-slate-400 text-sm">
              5-minute background polling engine with backoff retries for failed dispatches.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} HookFlow. Built for high reliability.
      </footer>
    </div>
  );
}
