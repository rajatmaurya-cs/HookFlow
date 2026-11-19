import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F2F3F4] text-[#36454F] flex flex-col justify-between selection:bg-black selection:text-white">
      {/* Navigation Header */}
      <header className="border-b border-[#36454F]/10 bg-[#F2F3F4]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-sm tracking-tight transition-transform group-hover:scale-105">
              H
            </span>
            <span className="font-extrabold text-xl tracking-tight text-black">
              HookFlow
            </span>
          </Link>

          <nav className="flex items-center gap-3 sm:gap-6">
            <Link
              href="/login"
              className="text-sm font-semibold text-[#36454F] hover:text-black transition-colors px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold bg-black hover:bg-neutral-800 text-white px-5 py-2.5 rounded-full transition-all hover:shadow-md cursor-pointer"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-24 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-3xl flex flex-col items-center">
          {/* Subtle Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/5 border border-black/10 text-xs font-semibold text-black mb-8 tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Webhook Ingestion & Relay Engine
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-black leading-[1.08] mb-6">
            Never miss an <br className="hidden sm:inline" />
            Event Again
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-[#36454F]/85 font-normal leading-relaxed max-w-2xl mb-10">
            A resilient dispatch pipeline engineered for high-reliability webhook delivery.
            Instant duplicate interception with Redis, cryptographically secured organization keys, and an automated background dispatch engine.
          </p>

          {/* Primary Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 bg-black hover:bg-neutral-800 text-white font-semibold text-sm rounded-full transition-all shadow-md hover:shadow-lg text-center"
            >
              Start Free Integration
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-[#F2F3F4] text-[#36454F] border border-[#36454F]/20 font-semibold text-sm rounded-full transition-all text-center"
            >
              Open Dashboard →
            </Link>
          </div>
        </div>

        {/* Specifications Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full">
          {/* Redis Card */}
          <div className="bg-white border border-[#36454F]/10 rounded-2xl p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-black/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center text-black mb-5 group-hover:bg-black group-hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-black mb-2 tracking-tight">
              Redis Idempotency
            </h2>
            <p className="text-sm text-[#36454F]/80 leading-relaxed font-normal">
              Atomic caching layer that intercepts duplicate requests and rapid repeated clicks at microsecond speeds. Payload hashes ensure duplicate events are caught without database overhead.
            </p>
          </div>

          {/* Secret Key Card */}
          <div className="bg-white border border-[#36454F]/10 rounded-2xl p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-black/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center text-black mb-5 group-hover:bg-black group-hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-black mb-2 tracking-tight">
              Secret Key Verification
            </h2>
            <p className="text-sm text-[#36454F]/80 leading-relaxed font-normal">
              Each organization receives an isolated, unforgeable secret key (<code className="font-mono text-xs px-1.5 py-0.5 bg-black/5 text-black rounded">secret-x-key</code>). Incoming data is authenticated and validated before hitting processing queues.
            </p>
          </div>

          {/* Auto-Dispatch & Backoff Card */}
          <div className="bg-white border border-[#36454F]/10 rounded-2xl p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-black/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center text-black mb-5 group-hover:bg-black group-hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-black mb-2 tracking-tight">
              Automated Relay & Backoff
            </h2>
            <p className="text-sm text-[#36454F]/80 leading-relaxed font-normal">
              Background polling monitors pending events continuously. If target destination endpoints fail or timeout, exponential backoff retries preserve your event lifecycle until manual recovery.
            </p>
          </div>
        </section>

        {/* Integration Preview Code Box */}
        <section className="mt-16 w-full max-w-3xl bg-white border border-[#36454F]/10 rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between pb-4 border-b border-[#36454F]/10 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-300"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-300"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-300"></span>
              <span className="text-xs font-mono text-[#36454F]/70 ml-2">Ingestion Endpoint</span>
            </div>
            <span className="text-[11px] font-mono font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              POST /api/events/ingest
            </span>
          </div>

          <div className="font-mono text-xs text-[#36454F] space-y-1.5 leading-relaxed overflow-x-auto">
            <p><span className="text-neutral-400"># Header:</span></p>
            <p className="text-black font-semibold">secret-x-key: sec_your_org_key</p>
            <p className="pt-2"><span className="text-neutral-400"># Payload:</span></p>
            <p className="text-black font-medium">&#123;</p>
            <p className="pl-4 text-black">&quot;userId&quot;: &quot;usr_01&quot;,</p>
            <p className="pl-4 text-black">&quot;payload&quot;: &#123; &quot;event&quot;: &quot;payment.completed&quot;, &quot;amount&quot;: 4900 &#125;</p>
            <p className="text-black font-medium">&#125;</p>
          </div>
        </section>
      </main>

      {/* Clean Minimalist Footer */}
      <footer className="border-t border-[#36454F]/10 py-8 bg-white/50">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#36454F]/70 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-sm bg-black text-white flex items-center justify-center font-bold text-[9px]">
              H
            </span>
            <span className="text-black font-bold">HookFlow</span>
            <span>— Webhook Reliability Infrastructure</span>
          </div>
          <p>© {new Date().getFullYear()} HookFlow. Built for high reliability.</p>
        </div>
      </footer>
    </div>
  );
}
