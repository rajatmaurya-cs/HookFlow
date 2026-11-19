'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeLang, setActiveLang] = useState('nodejs');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const codeSnippets = {
    nodejs: `// Node.js (Fetch API / Node 18+)
const crypto = require('crypto');

const secretKey = 'sec_your_organization_key';
const userId = 'usr_6af0b7db7b540b7b50';
const idempotencyKey = crypto.randomUUID(); // Unique key per event

const response = await fetch('http://localhost:2000/api/events/ingest', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'secret-x-key': secretKey,
    'idempotency-key': idempotencyKey, // Prevents duplicate delivery
  },
  body: JSON.stringify({
    userId,
    payload: {
      event: 'payment.completed',
      amount: 4900,
      currency: 'USD',
    },
  }),
});

const data = await response.json();
console.log('HookFlow Response:', data);`,

    python: `# Python 3 (Requests)
import uuid
import requests

secret_key = "sec_your_organization_key"
user_id = "usr_6af0b7db7b540b7b50"
idempotency_key = str(uuid.uuid4())  # Unique key per event

url = "http://localhost:2000/api/events/ingest"

headers = {
    "Content-Type": "application/json",
    "secret-x-key": secret_key,
    "idempotency-key": idempotency_key,  # Prevents duplicate delivery
}

payload = {
    "userId": user_id,
    "payload": {
        "event": "payment.completed",
        "amount": 4900,
        "currency": "USD",
    },
}

response = requests.post(url, json=payload, headers=headers)
print("HookFlow Response:", response.json())`,

    java: `// Java 11+ (HttpClient)
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.UUID;

public class HookFlowSender {
    public static void main(String[] args) throws Exception {
        String secretKey = "sec_your_organization_key";
        String idempotencyKey = UUID.randomUUID().toString(); // Unique key
        
        String jsonPayload = """
            {
              "userId": "usr_6af0b7db7b540b7b50",
              "payload": {
                "event": "payment.completed",
                "amount": 4900,
                "currency": "USD"
              }
            }
            """;

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("http://localhost:2000/api/events/ingest"))
            .header("Content-Type", "application/json")
            .header("secret-x-key", secretKey)
            .header("idempotency-key", idempotencyKey)
            .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
            .build();

        HttpResponse<String> response = client.send(
            request, 
            HttpResponse.BodyHandlers.ofString()
        );
        System.out.println("Status: " + response.statusCode());
        System.out.println("HookFlow Response: " + response.body());
    }
}`,
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[activeLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#1C1917] font-sans antialiased flex flex-col overflow-x-hidden selection:bg-[#C9A86A] selection:text-black">
      <style jsx global>{`
        .font-display { font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; }
        .font-mono-classic { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { transform: translateX(-120%) skewX(-12deg); } 100% { transform: translateX(240%) skewX(-12deg); } }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes floatSlow { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-fadeUp { animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) both; }
        .animate-fadeUp-1 { animation-delay: 0.08s; }
        .animate-fadeUp-2 { animation-delay: 0.18s; }
        .animate-fadeUp-3 { animation-delay: 0.28s; }
        .animate-fadeUp-4 { animation-delay: 0.38s; }
        .btn-shine { position: relative; overflow: hidden; }
        .btn-shine:after { content: ''; position: absolute; top: 0; left: 0; width: 45%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent); animation: shimmer 3.2s infinite; }
        .marquee-track { animation: marquee 28s linear infinite; }
        .paper-grid {
          background-image: linear-gradient(to right, rgba(28,25,23,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(28,25,23,0.045) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(ellipse 90% 70% at 50% 0%, black 30%, transparent 75%);
        }
        .gold-line { background: linear-gradient(90deg, transparent, #C9A86A 30%, #C9A86A 70%, transparent); height: 1px; }
        .card-classic { transition: all 0.45s cubic-bezier(0.22,1,0.36,1); }
        .card-classic:hover { transform: translateY(-6px); border-color: #1C1917; box-shadow: 0 24px 48px -18px rgba(28,25,23,0.22), 0 2px 0 #C9A86A inset; }
        .card-classic:hover .card-num { color: #C9A86A; }
        .card-classic:hover .card-icon { background: #C9A86A; color: #111; transform: rotate(-4deg) scale(1.05); }
        .card-icon { transition: all 0.4s ease; }
        .card-num { transition: color 0.4s ease; }
        .tab-active { box-shadow: 0 -2px 0 #C9A86A inset; }
        ::-webkit-scrollbar { height: 6px; width: 8px; }
        ::-webkit-scrollbar-thumb { background: #D6C9A8; border-radius: 99px; }
      `}</style>

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 paper-grid" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w- h- bg-[#E9D9A6]/35 blur- rounded-full" />
        <div className="absolute top- -left-40 w- h- bg-[#C9A86A]/10 blur- rounded-full" />
        <div className="absolute top- -right-40 w- h- bg-black/[0.04] blur- rounded-full" />
      </div>

      {/* Top Navbar */}
    <header className="sticky top-0 z-50 w-full border-b border-[#E8DFC8] bg-[#FAF7F0]">
  <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">

    {/* LEFT - Logo */}
    <Link href="/" className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black text-white text-lg font-bold">
        H
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-xl font-bold text-black leading-none">HookFlow</span>
        <span className="mt-1 text- font-semibold tracking-[0.25em] text-[#8A7A52] leading-none">
          RELIABILITY INFRA
        </span>
      </span>
    </Link>

    {/* CENTER - Nav */}
    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#57534E]">
      <a href="#features" className="hover:text-black">Features</a>
      <a href="#pipeline" className="hover:text-black">Pipeline</a>
      <a href="#quickstart" className="hover:text-black">Quickstart</a>
      <span className="hidden lg:flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        ALL SYSTEMS LIVE
      </span>
    </nav>

    {/* RIGHT - Button */}
    <div className="flex items-center gap-3">
      {mounted && isLoggedIn ? (
        <Link
          href="/dashboard"
          className="flex h-10 items-center justify-center rounded-full bg-black px-5 text-sm font-semibold text-white"
        >
          Dashboard →
        </Link>
      ) : (
        <>
          <Link href="/login" className="hidden sm:block text-sm font-semibold text-[#44403C] hover:text-black">
            Sign In
          </Link>
          <Link
            href="/register"
            className="flex h-10 items-center justify-center rounded-full bg-black px-5 text-sm font-semibold text-white"
          >
            Get Started →
          </Link>
        </>
      )}
    </div>

  </div>
</header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-14 sm:pt-20 pb-20 flex-1 flex flex-col items-center w-full">
        {/* Hero Badge */}
        <div className="animate-fadeUp inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-[#E8DFC8] text- font-semibold text-[#57534E] shadow-[0_8px_24px_rgba(0,0,0,0.06)] mb-8 tracking-[0.14em] uppercase">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
          </span>
          Webhook Ingestion &amp; Relay Engine
          <span className="w-px h-3 bg-[#E8DFC8]" />
          <span className="text-black font-mono-classic text- tracking-normal font-bold">v1.0 READY</span>
          <span className="hidden sm:inline-flex items-center gap-1 bg-[#FFF8E6] text-[#8A6A1F] border border-[#F0E2B0] px-2 py-0.5 rounded-full normal-case tracking-normal">★ Classic Edition</span>
        </div>

        {/* Hero Title */}
        <div className="text-center max-w-5xl mx-auto space-y-6">
          <p className="animate-fadeUp animate-fadeUp-1 text- sm:text-xs tracking-[0.32em] font-semibold text-[#A68B3A]">— ENGINEERED FOR HIGH RELIABILITY —</p>
          <h1 className="animate-fadeUp animate-fadeUp-2 font-display text- sm:text- md:text- font-black text-[#111010] tracking-[-0.04em] leading-[0.92]">
            Never miss an<br />
            <span className="italic font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#8A6A1F] via-[#C9A86A] to-[#8A6A1F]">Event</span> Again<span className="text-[#C9A86A]">.</span>
          </h1>

          <p className="animate-fadeUp animate-fadeUp-3 text- sm:text-base md:text- text-[#57534E] max-w-2xl mx-auto leading-relaxed text-balance pt-1">
            A resilient dispatch pipeline for high-reliability webhook delivery. Instant duplicate interception with Redis, cryptographically secured organization keys, and an automated background dispatch engine.
          </p>

          <div className="animate-fadeUp animate-fadeUp-4 flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            {mounted && isLoggedIn ? (
              <Link href="/dashboard" className="btn-shine group inline-flex items-center gap-2 px-8 py-4 bg-[#111010] hover:bg-black text-white font-semibold text-sm rounded-full transition-all duration-300 shadow-[0_16px_32px_rgba(0,0,0,0.22)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.28)] hover:-translate-y-0.5">
                <span>Open Dashboard</span><span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            ) : (
              <Link href="/register" className="btn-shine group inline-flex items-center gap-2 px-8 py-4 bg-[#111010] hover:bg-black text-white font-semibold text-sm rounded-full transition-all duration-300 shadow-[0_16px_32px_rgba(0,0,0,0.22)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.28)] hover:-translate-y-0.5">
                <span>Start Free Integration</span><span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            )}
            <a href="#quickstart" className="inline-flex items-center gap-2 px-7 py-4 bg-white border border-[#1C1917] text-[#111010] font-semibold text-sm rounded-full hover:bg-[#111010] hover:text-white transition-all duration-300 hover:-translate-y-0.5 shadow-sm">
              <span className="w-5 h-5 rounded-full bg-[#C9A86A] text-black flex items-center justify-center text-">▶</span>
              View Quickstart
            </a>
          </div>

          <p className="text- text-[#A8A29E] font-mono-classic pt-1">No credit card required &nbsp;•&nbsp; Setup in 2 minutes &nbsp;•&nbsp; Production ready</p>
        </div>

        {/* Stats Bar */}
        <div className="mt-14 w-full max-w-4xl bg-white/80 backdrop-blur border border-[#E8DFC8] rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.06)] grid grid-cols-2 md:grid-cols-4 divide-x divide-[#F0E9D6] overflow-hidden animate-fadeUp animate-fadeUp-4">
          {[
            { v: '99.99%', l: 'Delivery Rate' },
            { v: '< 2ms', l: 'Dedupe Check' },
            { v: '300s', l: 'Redis TTL' },
            { v: '5s', l: 'Auto Polling' },
          ].map((s) => (
            <div key={s.l} className="py-5 px-4 text-center">
              <div className="font-display text-2xl font-bold text-black">{s.v}</div>
              <div className="text- tracking-[0.18em] font-semibold text-[#A8A29E] mt-1 uppercase">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Marquee */}
        <div className="mt-10 w-full overflow-hidden opacity-60 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="marquee-track flex whitespace-nowrap gap-10 w-max text- tracking-[0.28em] font-semibold text-[#78716C]">
            {['PAYMENTS', '◆', 'SAAS APPS', '◆', 'E-COMMERCE', '◆', 'FINTECH', '◆', 'NOTIFICATIONS', '◆', 'AUTOMATION', '◆', 'PAYMENTS', '◆', 'SAAS APPS', '◆', 'E-COMMERCE', '◆', 'FINTECH', '◆', 'NOTIFICATIONS', '◆', 'AUTOMATION', '◆'].map((t, i) => (
              <span key={i} className={t === '◆' ? 'text-[#C9A86A]' : ''}>{t}</span>
            ))}
          </div>
        </div>

        {/* Cards */}
        <section id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full">
          <div className="card-classic relative bg-white border border-[#E8DFC8] rounded- p-7 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h- bg-gradient-to-r from-transparent via-[#C9A86A] to-transparent" />
            <div>
              <div className="flex items-start justify-between mb-6">
                <div className="card-icon w-12 h-12 rounded- bg-[#111010] text-white flex items-center justify-center shadow-lg"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <span className="card-num font-display text- leading-none font-bold text-[#EDE6D0]">01</span>
              </div>
              <span className="text- font-mono-classic font-semibold uppercase tracking-wider text-[#8A6A1F] bg-[#FFF8E6] border border-[#F0E2B0] px-2.5 py-1 rounded-full">&lt; 2ms latency</span>
              <h2 className="font-display text- font-bold text-black mt-4 mb-2.5 tracking-tight">Redis Idempotency</h2>
              <p className="text-[13.5px] text-[#57534E] leading-relaxed">Atomic caching layer that intercepts duplicate requests and rapid repeated clicks at microsecond speeds. Payload hashes ensure duplicate events are caught without database overhead.</p>
            </div>
            <div className="mt-7 pt-4 border-t border-dashed border-[#E8DFC8] flex items-center gap-2 text- font-mono-classic text-[#44403C]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span><span>SET idemp:key EX 300 NX</span>
            </div>
          </div>

          <div className="card-classic relative bg-[#111010] text-[#F5EFE2] border border-[#111010] rounded- p-7 sm:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.22)] flex flex-col justify-between overflow-hidden md:-translate-y-2">
            <div className="absolute top-0 left-0 right-0 h- bg-[#C9A86A]" />
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#C9A86A]/20 blur-3xl rounded-full" />
            <div>
              <div className="flex items-start justify-between mb-6">
                <div className="card-icon w-12 h-12 rounded- bg-[#C9A86A] text-black flex items-center justify-center shadow-lg"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002-2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <span className="card-num font-display text- leading-none font-bold text-white/15">02</span>
              </div>
              <span className="text- font-mono-classic font-semibold uppercase tracking-wider text-[#F5EFE2] bg-white/10 border border-white/15 px-2.5 py-1 rounded-full">sec_••••••</span>
              <h2 className="font-display text- font-bold text-white mt-4 mb-2.5 tracking-tight">Secret Key Verification</h2>
              <p className="text-[13.5px] text-[#D6D0BE] leading-relaxed">Each organization receives an isolated, unforgeable secret key (<code className="font-mono-classic text-xs px-1.5 py-0.5 bg-white/10 text-white rounded">secret-x-key</code>). Incoming data is authenticated and validated before hitting processing queues.</p>
            </div>
            <div className="mt-7 pt-4 border-t border-dashed border-white/15 flex items-center gap-2 text- font-mono-classic text-[#EDE6D0]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A86A]"></span><span>HMAC isolation per organization</span>
            </div>
          </div>

          <div className="card-classic relative bg-white border border-[#E8DFC8] rounded- p-7 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h- bg-gradient-to-r from-transparent via-[#C9A86A] to-transparent" />
            <div>
              <div className="flex items-start justify-between mb-6">
                <div className="card-icon w-12 h-12 rounded- bg-[#111010] text-white flex items-center justify-center shadow-lg"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                </div>
                <span className="card-num font-display text- leading-none font-bold text-[#EDE6D0]">03</span>
              </div>
              <span className="text- font-mono-classic font-semibold uppercase tracking-wider text-[#8A6A1F] bg-[#FFF8E6] border border-[#F0E2B0] px-2.5 py-1 rounded-full">5s auto-poll</span>
              <h2 className="font-display text- font-bold text-black mt-4 mb-2.5 tracking-tight">Automated Relay &amp; Backoff</h2>
              <p className="text-[13.5px] text-[#57534E] leading-relaxed">Background polling monitors pending events continuously. If target destination endpoints fail or timeout, exponential backoff retries preserve your event lifecycle until manual recovery.</p>
            </div>
            <div className="mt-7 pt-4 border-t border-dashed border-[#E8DFC8] flex items-center gap-2 text- font-mono-classic text-[#44403C]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span><span>Dead-letter circuit breaker</span>
            </div>
          </div>
        </section>

        {/* Pipeline */}
    <section id="pipeline" className="mt-16 w-full bg-[#111010] text-[#F5EFE2] rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-[#2A2620] shadow-2xl">
  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#C9A86A] to-transparent" />
  <div className="absolute -top-24 right-0 w-72 h-72 bg-[#C9A86A]/15 blur-3xl rounded-full" />

  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative">
    <div>
      <p className="text-xs tracking-[0.28em] font-semibold text-[#C9A86A]">HOW IT FLOWS</p>
      <h3 className="font-display text-3xl sm:text-4xl font-bold leading-tight mt-2">One event. Zero loss.<br /><span className="italic font-medium text-[#C9A86A]">Five precise steps.</span></h3>
    </div>
    <p className="text-sm text-[#B8B0A0] max-w-xs leading-relaxed">From your server to your destination, every event is verified, deduped, saved and retried.</p>
  </div>

  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-8 relative">
    {[
      { n: '01', t: 'Ingest', d: 'POST /events/ingest', s: 'secret-x-key + idempotency-key' },
      { n: '02', t: 'Dedupe', d: 'Redis SET NX', s: '409 if duplicate • TTL 300s' },
      { n: '03', t: 'Save', d: 'MongoDB • pending', s: 'Validate key • 202 Accepted' },
      { n: '04', t: 'Dispatch', d: 'Poll every 5s', s: 'Forward POST to destination' },
      { n: '05', t: 'Result', d: 'completed / retry / dead', s: 'attempts < 3 retry • >= 3 dead' },
    ].map((s, idx) => (
      <div key={s.n} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 hover:border-[#C9A86A]/50 transition-all group">
        <div className="flex items-center justify-between">
          <span className="font-mono-classic text-xs text-[#C9A86A]">{s.n}</span>
          {idx < 4 && <span className="hidden md:block text-[#C9A86A]">→</span>}
        </div>
        <div className="font-display text-lg font-bold mt-3">{s.t}</div>
        <div className="text-xs font-mono-classic text-white mt-1">{s.d}</div>
        <div className="text-xs text-[#A8A29E] mt-2 leading-relaxed">{s.s}</div>
      </div>
    ))}
  </div>
</section>

        {/* Code Box */}
        <section id="quickstart" className="mt-16 w-full max-w-4xl">
          <div className="text-center mb-6">
            <p className="text- tracking-[0.28em] font-semibold text-[#A68B3A]">QUICKSTART GUIDE</p>
            <h3 className="font-display text- sm:text- font-bold tracking-tight mt-2">Integrate in <span className="italic text-[#8A6A1F]">under 2 minutes</span></h3>
            <p className="text-[13.5px] text-[#78716C] mt-2">Copy, paste, send your first event. Idempotency is already handled.</p>
          </div>

          <div className="p- rounded- bg-gradient-to-b from-[#E8D9A6] via-[#2A2620] to-[#111010] shadow-[0_32px_64px_rgba(0,0,0,0.28)]">
            <div className="rounded- overflow-hidden bg-[#1e1e1e] font-mono-classic">
              <div className="bg-[#2d2d2d] px-4 py-3 flex items-center justify-between border-b border-[#3c3c3c]">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-inner"></span>
                    <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-inner"></span>
                    <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-inner"></span>
                  </div>
                  <span className="text-xs text-[#A8A29E] font-sans font-medium pl-2 select-none hidden sm:inline">HookFlow Ingestion Protocol — Quickstart Guide</span>
                </div>
                <span className="text- font-mono-classic px-2.5 py-1 rounded-full bg-[#1f382a] text-[#4ec9b0] border border-[#2b593f]">POST /api/events/ingest</span>
              </div>

              <div className="bg-[#252526] flex items-center justify-between border-b border-[#1e1e1e] px-2 overflow-x-auto">
                <div className="flex items-center">
                  {[
                    { id: 'nodejs', label: 'send-event.js', badge: 'JS', color: 'text-[#68a063]' },
                    { id: 'python', label: 'send_event.py', badge: 'Py', color: 'text-[#3572A5]' },
                    { id: 'java', label: 'HookFlowSender.java', badge: '☕', color: 'text-[#b07219]' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveLang(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 text-xs transition-colors border-r border-[#1e1e1e] cursor-pointer ${activeLang === tab.id ? 'bg-[#1e1e1e] text-white tab-active' : 'text-[#969696] hover:bg-[#2a2d2e] hover:text-[#cccccc]'}`}
                    >
                      <span className={`${tab.color} font-bold text-sm`}>{tab.badge}</span><span>{tab.label}</span>
                    </button>
                  ))}
                </div>
                <button onClick={handleCopyCode} className="shrink-0 text-xs px-3 py-1.5 bg-[#333333] hover:bg-[#C9A86A] hover:text-black text-[#cccccc] rounded-full border border-[#454545] transition-all flex items-center gap-1.5 cursor-pointer mr-2">
                  {copied ? (<><span className="text-[#4ec9b0]">✓</span><span>Copied</span></>) : (<><span>📋</span><span>Copy Code</span></>)}
                </button>
              </div>

              <div className="p-5 text-xs sm:text-sm leading-relaxed overflow-x-auto bg-[#1e1e1e] text-[#D4D4D4] min-h-96">
                {activeLang === 'nodejs' && (
                  <div className="space-y-1">
                    <p className="text-[#6a9955]">// Node.js (Fetch API with Idempotency Key)</p>
                    <p><span className="text-[#c586c0]">const</span> <span className="text-[#9cdcfe]">crypto</span> = <span className="text-[#dcdcaa]">require</span>(<span className="text-[#ce9178]">&apos;crypto&apos;</span>);</p>
                    <div className="py-1"></div>
                    <p><span className="text-[#c586c0]">const</span> <span className="text-[#9cdcfe]">secretKey</span> = <span className="text-[#ce9178]">&apos;sec_your_organization_key&apos;</span>;</p>
                    <p><span className="text-[#c586c0]">const</span> <span className="text-[#9cdcfe]">userId</span> = <span className="text-[#ce9178]">&apos;usr_6af0b7db7b540b7b50&apos;</span>;</p>
                    <p><span className="text-[#c586c0]">const</span> <span className="text-[#9cdcfe]">idempotencyKey</span> = <span className="text-[#9cdcfe]">crypto</span>.<span className="text-[#dcdcaa]">randomUUID</span>(); <span className="text-[#6a9955]">// Unique UUID per event</span></p>
                    <div className="py-1"></div>
                    <p><span className="text-[#c586c0]">const</span> <span className="text-[#9cdcfe]">response</span> = <span className="text-[#c586c0]">await</span> <span className="text-[#dcdcaa]">fetch</span>(<span className="text-[#ce9178] underline decoration-[#4ec9b0]/40">&apos;http://localhost:2000/api/events/ingest&apos;</span>, &#123;</p>
                    <p className="pl-4"><span className="text-[#9cdcfe]">method</span>: <span className="text-[#ce9178]">&apos;POST&apos;</span>,</p>
                    <p className="pl-4"><span className="text-[#9cdcfe]">headers</span>: &#123;</p>
                    <p className="pl-8"><span className="text-[#9cdcfe]">&apos;Content-Type&apos;</span>: <span className="text-[#ce9178]">&apos;application/json&apos;</span>,</p>
                    <p className="pl-8 bg-[#2a2d2e]/50 py-0.5 rounded"><span className="text-[#9cdcfe]">&apos;secret-x-key&apos;</span>: <span className="text-[#9cdcfe]">secretKey</span>, <span className="text-[#6a9955]">// Authenticated org key</span></p>
                    <p className="pl-8 bg-[#007acc]/15 py-0.5 rounded border-l-2 border-[#007acc]"><span className="text-[#9cdcfe]">&apos;idempotency-key&apos;</span>: <span className="text-[#9cdcfe]">idempotencyKey</span>, <span className="text-[#4ec9b0]">// Intercepts duplicates with Redis</span></p>
                    <p className="pl-4">&#125;,</p>
                    <p className="pl-4"><span className="text-[#9cdcfe]">body</span>: <span className="text-[#4ec9b0]">JSON</span>.<span className="text-[#dcdcaa]">stringify</span>(&#123;</p>
                    <p className="pl-8"><span className="text-[#9cdcfe]">userId</span>,</p>
                    <p className="pl-8"><span className="text-[#9cdcfe]">payload</span>: &#123;</p>
                    <p className="pl-12"><span className="text-[#9cdcfe]">event</span>: <span className="text-[#ce9178]">&apos;payment.completed&apos;</span>,</p>
                    <p className="pl-12"><span className="text-[#9cdcfe]">amount</span>: <span className="text-[#b5cea8]">4900</span>,</p>
                    <p className="pl-12"><span className="text-[#9cdcfe]">currency</span>: <span className="text-[#ce9178]">&apos;USD&apos;</span></p>
                    <p className="pl-8">&#125;,</p>
                    <p className="pl-4">&#125;),</p>
                    <p>&#125;);</p>
                    <div className="py-1"></div>
                    <p><span className="text-[#c586c0]">const</span> <span className="text-[#9cdcfe]">data</span> = <span className="text-[#c586c0]">await</span> <span className="text-[#9cdcfe]">response</span>.<span className="text-[#dcdcaa]">json</span>();</p>
                    <p><span className="text-[#9cdcfe]">console</span>.<span className="text-[#dcdcaa]">log</span>(<span className="text-[#ce9178]">&apos;HookFlow Ingested:&apos;</span>, <span className="text-[#9cdcfe]">data</span>);</p>
                  </div>
                )}
                {activeLang === 'python' && (
                  <div className="space-y-1">
                    <p className="text-[#6a9955]"># Python 3 (Requests with Idempotency Key)</p>
                    <p><span className="text-[#c586c0]">import</span> <span className="text-[#4ec9b0]">uuid</span></p>
                    <p><span className="text-[#c586c0]">import</span> <span className="text-[#4ec9b0]">requests</span></p>
                    <div className="py-1"></div>
                    <p><span className="text-[#9cdcfe]">secret_key</span> = <span className="text-[#ce9178]">&quot;sec_your_organization_key&quot;</span></p>
                    <p><span className="text-[#9cdcfe]">user_id</span> = <span className="text-[#ce9178]">&quot;usr_6af0b7db7b540b7b50&quot;</span></p>
                    <p><span className="text-[#9cdcfe]">idempotency_key</span> = <span className="text-[#dcdcaa]">str</span>(<span className="text-[#4ec9b0]">uuid</span>.<span className="text-[#dcdcaa]">uuid4</span>()) <span className="text-[#6a9955]"># Unique UUID per event</span></p>
                    <div className="py-1"></div>
                    <p><span className="text-[#9cdcfe]">url</span> = <span className="text-[#ce9178] underline decoration-[#4ec9b0]/40">&quot;http://localhost:2000/api/events/ingest&quot;</span></p>
                    <div className="py-1"></div>
                    <p><span className="text-[#9cdcfe]">headers</span> = &#123;</p>
                    <p className="pl-4"><span className="text-[#ce9178]">&quot;Content-Type&quot;</span>: <span className="text-[#ce9178]">&quot;application/json&quot;</span>,</p>
                    <p className="pl-4 bg-[#2a2d2e]/50 py-0.5 rounded"><span className="text-[#ce9178]">&quot;secret-x-key&quot;</span>: <span className="text-[#9cdcfe]">secret_key</span>,</p>
                    <p className="pl-4 bg-[#007acc]/15 py-0.5 rounded border-l-2 border-[#007acc]"><span className="text-[#ce9178]">&quot;idempotency-key&quot;</span>: <span className="text-[#9cdcfe]">idempotency_key</span>, <span className="text-[#4ec9b0]"># Intercepts duplicates with Redis</span></p>
                    <p>&#125;</p>
                    <div className="py-1"></div>
                    <p><span className="text-[#9cdcfe]">payload</span> = &#123;</p>
                    <p className="pl-4"><span className="text-[#ce9178]">&quot;userId&quot;</span>: <span className="text-[#9cdcfe]">user_id</span>,</p>
                    <p className="pl-4"><span className="text-[#ce9178]">&quot;payload&quot;</span>: &#123;</p>
                    <p className="pl-8"><span className="text-[#ce9178]">&quot;event&quot;</span>: <span className="text-[#ce9178]">&quot;payment.completed&quot;</span>,</p>
                    <p className="pl-8"><span className="text-[#ce9178]">&quot;amount&quot;</span>: <span className="text-[#b5cea8]">4900</span>,</p>
                    <p className="pl-8"><span className="text-[#ce9178]">&quot;currency&quot;</span>: <span className="text-[#ce9178]">&quot;USD&quot;</span>,</p>
                    <p className="pl-4">&#125;,</p>
                    <p>&#125;</p>
                    <div className="py-1"></div>
                    <p><span className="text-[#9cdcfe]">response</span> = <span className="text-[#4ec9b0]">requests</span>.<span className="text-[#dcdcaa]">post</span>(<span className="text-[#9cdcfe]">url</span>, <span className="text-[#9cdcfe]">json</span>=<span className="text-[#9cdcfe]">payload</span>, <span className="text-[#9cdcfe]">headers</span>=<span className="text-[#9cdcfe]">headers</span>)</p>
                    <p><span className="text-[#dcdcaa]">print</span>(<span className="text-[#ce9178]">&quot;HookFlow Response:&quot;</span>, <span className="text-[#9cdcfe]">response</span>.<span className="text-[#dcdcaa]">json</span>())</p>
                  </div>
                )}
                {activeLang === 'java' && (
                  <div className="space-y-1">
                    <p className="text-[#6a9955]">// Java 11+ HttpClient with Idempotency Key</p>
                    <p><span className="text-[#c586c0]">import</span> <span className="text-[#4ec9b0]">java.net.URI</span>;</p>
                    <p><span className="text-[#c586c0]">import</span> <span className="text-[#4ec9b0]">java.net.http.HttpClient</span>;</p>
                    <p><span className="text-[#c586c0]">import</span> <span className="text-[#4ec9b0]">java.net.http.HttpRequest</span>;</p>
                    <p><span className="text-[#c586c0]">import</span> <span className="text-[#4ec9b0]">java.net.http.HttpResponse</span>;</p>
                    <p><span className="text-[#c586c0]">import</span> <span className="text-[#4ec9b0]">java.util.UUID</span>;</p>
                    <div className="py-1"></div>
                    <p><span className="text-[#569cd6]">public class</span> <span className="text-[#4ec9b0]">HookFlowSender</span> &#123;</p>
                    <p className="pl-4"><span className="text-[#569cd6]">public static void</span> <span className="text-[#dcdcaa]">main</span>(<span className="text-[#4ec9b0]">String</span>[] <span className="text-[#9cdcfe]">args</span>) <span className="text-[#569cd6]">throws</span> <span className="text-[#4ec9b0]">Exception</span> &#123;</p>
                    <p className="pl-8"><span className="text-[#4ec9b0]">String</span> <span className="text-[#9cdcfe]">secretKey</span> = <span className="text-[#ce9178]">&quot;sec_your_organization_key&quot;</span>;</p>
                    <p className="pl-8"><span className="text-[#4ec9b0]">String</span> <span className="text-[#9cdcfe]">idempotencyKey</span> = <span className="text-[#4ec9b0]">UUID</span>.<span className="text-[#dcdcaa]">randomUUID</span>().<span className="text-[#dcdcaa]">toString</span>();</p>
                    <div className="py-1"></div>
                    <p className="pl-8"><span className="text-[#4ec9b0]">String</span> <span className="text-[#9cdcfe]">jsonPayload</span> = <span className="text-[#ce9178]">&quot;&quot;&quot;</span></p>
                    <p className="pl-12 text-[#ce9178]">&#123;</p>
                    <p className="pl-16 text-[#ce9178]">&quot;userId&quot;: &quot;usr_6af0b7db7b540b7b50&quot;,</p>
                    <p className="pl-16 text-[#ce9178]">&quot;payload&quot;: &#123; &quot;event&quot;: &quot;payment.completed&quot;, &quot;amount&quot;: 4900 &#125;</p>
                    <p className="pl-12 text-[#ce9178]">&#125;</p>
                    <p className="pl-8"><span className="text-[#ce9178]">&quot;&quot;&quot;</span>;</p>
                    <div className="py-1"></div>
                    <p className="pl-8"><span className="text-[#4ec9b0]">HttpClient</span> <span className="text-[#9cdcfe]">client</span> = <span className="text-[#4ec9b0]">HttpClient</span>.<span className="text-[#dcdcaa]">newHttpClient</span>();</p>
                    <p className="pl-8"><span className="text-[#4ec9b0]">HttpRequest</span> <span className="text-[#9cdcfe]">request</span> = <span className="text-[#4ec9b0]">HttpRequest</span>.<span className="text-[#dcdcaa]">newBuilder</span>()</p>
                    <p className="pl-12">.<span className="text-[#dcdcaa]">uri</span>(<span className="text-[#4ec9b0]">URI</span>.<span className="text-[#dcdcaa]">create</span>(<span className="text-[#ce9178]">&quot;http://localhost:2000/api/events/ingest&quot;</span>))</p>
                    <p className="pl-12">.<span className="text-[#dcdcaa]">header</span>(<span className="text-[#ce9178]">&quot;Content-Type&quot;</span>, <span className="text-[#ce9178]">&quot;application/json&quot;</span>)</p>
                    <p className="pl-12">.<span className="text-[#dcdcaa]">header</span>(<span className="text-[#ce9178]">&quot;secret-x-key&quot;</span>, <span className="text-[#9cdcfe]">secretKey</span>)</p>
                    <p className="pl-12 bg-[#007acc]/15 py-0.5 rounded border-l-2 border-[#007acc]">.<span className="text-[#dcdcaa]">header</span>(<span className="text-[#ce9178]">&quot;idempotency-key&quot;</span>, <span className="text-[#9cdcfe]">idempotencyKey</span>) <span className="text-[#4ec9b0]">// Redis idempotency</span></p>
                    <p className="pl-12">.<span className="text-[#dcdcaa]">POST</span>(<span className="text-[#4ec9b0]">HttpRequest</span>.<span className="text-[#4ec9b0]">BodyPublishers</span>.<span className="text-[#dcdcaa]">ofString</span>(<span className="text-[#9cdcfe]">jsonPayload</span>))</p>
                    <p className="pl-12">.<span className="text-[#dcdcaa]">build</span>();</p>
                    <div className="py-1"></div>
                    <p className="pl-8"><span className="text-[#4ec9b0]">HttpResponse</span>&lt;<span className="text-[#4ec9b0]">String</span>&gt; <span className="text-[#9cdcfe]">response</span> = <span className="text-[#9cdcfe]">client</span>.<span className="text-[#dcdcaa]">send</span>(<span className="text-[#9cdcfe]">request</span>, <span className="text-[#4ec9b0]">HttpResponse</span>.<span className="text-[#4ec9b0]">BodyHandlers</span>.<span className="text-[#dcdcaa]">ofString</span>());</p>
                    <p className="pl-8"><span className="text-[#4ec9b0]">System</span>.<span className="text-[#9cdcfe]">out</span>.<span className="text-[#dcdcaa]">println</span>(<span className="text-[#ce9178]">&quot;HookFlow Response: &quot;</span> + <span className="text-[#9cdcfe]">response</span>.<span className="text-[#dcdcaa]">body</span>());</p>
                    <p className="pl-4">&#125;</p>
                    <p>&#125;</p>
                  </div>
                )}
              </div>

              <div className="bg-[#007acc] text-white text- px-4 py-2 flex items-center justify-between font-sans select-none">
                <div className="flex items-center gap-3"><span>⚡ Ready for Ingestion</span><span className="hidden sm:inline">UTF-8</span><span className="hidden sm:inline">Redis 300s TTL</span></div>
                <div className="flex items-center gap-2"><span>{activeLang === 'nodejs' ? 'JavaScript' : activeLang === 'python' ? 'Python' : 'Java'}</span><span>Port: 2000</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mt-16 w-full bg-[#111010] rounded- p-8 sm:p-12 text-center relative overflow-hidden border border-[#2A2620]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w- h- bg-gradient-to-r from-transparent via-[#C9A86A] to-transparent" />
          <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w- h- bg-[#C9A86A]/15 blur- rounded-full" />
          <div className="relative">
            <p className="text- tracking-[0.32em] font-semibold text-[#C9A86A]">READY WHEN YOU ARE</p>
            <h3 className="font-display text- sm:text- font-bold text-white leading-[1.05] mt-3">Build on infrastructure<br /><span className="italic font-medium text-[#C9A86A]">that never drops.</span></h3>
            <p className="text-[#B8B0A0] text- mt-4 max-w-md mx-auto leading-relaxed">Create your organization, get your secret key, and start ingesting events in the next two minutes.</p>
            <div className="flex justify-center mt-7">
              <Link href="/register" className="btn-shine inline-flex items-center gap-2 px-8 py-4 bg-[#C9A86A] hover:bg-[#E2C87F] text-black font-bold text-sm rounded-full transition-all hover:-translate-y-0.5 shadow-[0_16px_32px_rgba(201,168,106,0.35)]">
                Get Your Secret Key <span>→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#E8DFC8] bg-[#FAF7F0]">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 bg-[#111010] text-[#F5EFE2] flex items-center justify-center font-display font-bold rounded-">H</span>
            <div className="leading-none">
              <span className="font-display font-bold text-black text-">HookFlow</span>
              <span className="block text- text-[#78716C] mt-1">Webhook Reliability Infrastructure</span>
            </div>
          </div>
          <div className="flex items-center gap-6 text- font-medium text-[#78716C]">
            <a href="#features" className="hover:text-black">Features</a>
            <a href="#pipeline" className="hover:text-black">Pipeline</a>
            <a href="#quickstart" className="hover:text-black">Docs</a>
          </div>
          <p className="text- text-[#A8A29E]">© {new Date().getFullYear()} HookFlow. Built for high reliability.</p>
        </div>
        <div className="overflow-hidden select-none pointer-events-none">
          <div className="max-w-6xl mx-auto px-6 font-display font-black text- sm:text- leading-[0.8] tracking-[-0.05em] text-[#111010]/[0.06] text-center whitespace-nowrap -mb-4">HOOKFLOW</div>
        </div>
      </footer>
    </div>
  );
}

