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
    <div className="min-h-screen bg-[#F2F3F4] text-[#36454F] font-sans antialiased flex flex-col justify-between selection:bg-neutral-900 selection:text-white">
      {/* Top Navbar */}
      <header className="w-full border-b border-[#36454F]/10 bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-base shadow-sm">
              H
            </span>
            <span className="text-xl font-extrabold tracking-tight text-black">
              HookFlow
            </span>
          </div>

          <div className="flex items-center gap-4">
            {mounted && isLoggedIn ? (
              <Link
                href="/dashboard"
                className="px-5 py-2 bg-black hover:bg-neutral-800 text-white font-medium text-xs rounded-full transition-all shadow-sm"
              >
                Dashboard →
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-xs font-semibold text-[#36454F] hover:text-black transition-colors px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 bg-black hover:bg-neutral-800 text-white font-medium text-xs rounded-full transition-all shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 pt-16 sm:pt-20 pb-20 flex-1 flex flex-col items-center">
        {/* Hero Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#36454F]/15 text-[11px] font-semibold text-[#36454F] shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-8 tracking-wide uppercase">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Webhook Ingestion & Relay Engine
          <span className="text-black/30 font-light">|</span>
          <span className="text-black font-mono text-[10px] tracking-normal font-bold">v1.0 Ready</span>
        </div>

        {/* Hero Title & Description */}
        <div className="text-center max-w-4xl mx-auto space-y-5">
          <h1 className="text-4xl sm:text-6xl md:text-[68px] font-bold text-black tracking-[-0.03em] leading-[1.08]">
            Never miss an <span className="underline decoration-black/20 decoration-wavy underline-offset-8">Event</span> Again
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-[#36454F]/80 max-w-2xl mx-auto font-normal leading-relaxed text-balance pt-1">
            A resilient dispatch pipeline engineered for high-reliability webhook delivery. Instant duplicate interception with Redis, cryptographically secured organization keys, and an automated background dispatch engine.
          </p>

          {/* CTA Action */}
          <div className="flex items-center justify-center pt-4">
            {mounted && isLoggedIn ? (
              <Link
                href="/dashboard"
                className="group relative inline-flex items-center gap-2 px-8 py-3.5 bg-black hover:bg-neutral-800 text-white font-semibold text-sm rounded-full transition-all duration-200 shadow-[0_4px_16px_rgba(0,0,0,0.16)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.24)] hover:-translate-y-0.5"
              >
                <span>Open Dashboard</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            ) : (
              <Link
                href="/register"
                className="group relative inline-flex items-center gap-2 px-8 py-3.5 bg-black hover:bg-neutral-800 text-white font-semibold text-sm rounded-full transition-all duration-200 shadow-[0_4px_16px_rgba(0,0,0,0.16)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.24)] hover:-translate-y-0.5"
              >
                <span>Start Free Integration</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            )}
          </div>
        </div>

        {/* Enhanced Specifications Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full">
          {/* Card 1: Redis Idempotency */}
          <div className="relative bg-white border border-[#36454F]/12 rounded-2xl p-7 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:border-black/40 transition-all duration-300 flex flex-col justify-between group overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-all"></div>
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-black/60 bg-[#F2F3F4] px-2.5 py-1 rounded-full border border-black/5">
                  &lt; 2ms latency
                </span>
              </div>
              <h2 className="text-xl font-bold text-black mb-2.5 tracking-tight group-hover:text-black">
                Redis Idempotency
              </h2>
              <p className="text-xs sm:text-sm text-[#36454F]/85 leading-relaxed">
                Atomic caching layer that intercepts duplicate requests and rapid repeated clicks at microsecond speeds. Payload hashes ensure duplicate events are caught without database overhead.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#36454F]/8 flex items-center gap-2 text-[11px] font-mono text-black/70">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>SET idemp:key EX 300 NX</span>
            </div>
          </div>

          {/* Card 2: Secret Key Verification */}
          <div className="relative bg-white border border-[#36454F]/12 rounded-2xl p-7 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:border-black/40 transition-all duration-300 flex flex-col justify-between group overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/10 transition-all"></div>
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-black/60 bg-[#F2F3F4] px-2.5 py-1 rounded-full border border-black/5">
                  sec_••••••
                </span>
              </div>
              <h2 className="text-xl font-bold text-black mb-2.5 tracking-tight group-hover:text-black">
                Secret Key Verification
              </h2>
              <p className="text-xs sm:text-sm text-[#36454F]/85 leading-relaxed">
                Each organization receives an isolated, unforgeable secret key (<code className="font-mono text-xs px-1.5 py-0.5 bg-black/5 text-black rounded font-medium">secret-x-key</code>). Incoming data is authenticated and validated before hitting processing queues.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#36454F]/8 flex items-center gap-2 text-[11px] font-mono text-black/70">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <span>HMAC isolation per organization</span>
            </div>
          </div>

          {/* Card 3: Automated Relay & Backoff */}
          <div className="relative bg-white border border-[#36454F]/12 rounded-2xl p-7 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:border-black/40 transition-all duration-300 flex flex-col justify-between group overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/10 transition-all"></div>
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-black/60 bg-[#F2F3F4] px-2.5 py-1 rounded-full border border-black/5">
                  5s auto-poll
                </span>
              </div>
              <h2 className="text-xl font-bold text-black mb-2.5 tracking-tight group-hover:text-black">
                Automated Relay & Backoff
              </h2>
              <p className="text-xs sm:text-sm text-[#36454F]/85 leading-relaxed">
                Background polling monitors pending events continuously. If target destination endpoints fail or timeout, exponential backoff retries preserve your event lifecycle until manual recovery.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#36454F]/8 flex items-center gap-2 text-[11px] font-mono text-black/70">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span>Dead-letter circuit breaker</span>
            </div>
          </div>
        </section>

        {/* VS Code Dark Modern Code Box with Multi-Language Guides */}
        <section className="mt-20 w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl border border-[#30363d] bg-[#1e1e1e] font-mono">
          {/* VS Code Title Bar */}
          <div className="bg-[#2d2d2d] px-4 py-2.5 flex items-center justify-between border-b border-[#3c3c3c]">
            <div className="flex items-center gap-3">
              {/* Traffic Light Window Controls */}
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-inner"></span>
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-inner"></span>
                <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-inner"></span>
              </div>
              <span className="text-xs text-[#969696] font-sans font-medium pl-2 select-none hidden sm:inline">
                HookFlow Ingestion Protocol — Quickstart Guide
              </span>
            </div>

            {/* Ingestion Endpoint Pill */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#1f382a] text-[#4ec9b0] border border-[#2b593f]">
                POST /api/events/ingest
              </span>
            </div>
          </div>

          {/* VS Code Editor Tabs */}
          <div className="bg-[#252526] flex items-center justify-between border-b border-[#1e1e1e] px-2 overflow-x-auto">
            <div className="flex items-center">
              <button
                onClick={() => setActiveLang('nodejs')}
                className={`flex items-center gap-2 px-4 py-2 text-xs transition-colors border-r border-[#1e1e1e] cursor-pointer ${
                  activeLang === 'nodejs'
                    ? 'bg-[#1e1e1e] text-[#ffffff] border-t-2 border-t-[#007acc]'
                    : 'text-[#969696] hover:bg-[#2a2d2e] hover:text-[#cccccc]'
                }`}
              >
                <span className="text-[#68a063] font-bold text-sm">JS</span>
                <span>send-event.js</span>
              </button>

              <button
                onClick={() => setActiveLang('python')}
                className={`flex items-center gap-2 px-4 py-2 text-xs transition-colors border-r border-[#1e1e1e] cursor-pointer ${
                  activeLang === 'python'
                    ? 'bg-[#1e1e1e] text-[#ffffff] border-t-2 border-t-[#007acc]'
                    : 'text-[#969696] hover:bg-[#2a2d2e] hover:text-[#cccccc]'
                }`}
              >
                <span className="text-[#3572A5] font-bold text-sm">Py</span>
                <span>send_event.py</span>
              </button>

              <button
                onClick={() => setActiveLang('java')}
                className={`flex items-center gap-2 px-4 py-2 text-xs transition-colors border-r border-[#1e1e1e] cursor-pointer ${
                  activeLang === 'java'
                    ? 'bg-[#1e1e1e] text-[#ffffff] border-t-2 border-t-[#007acc]'
                    : 'text-[#969696] hover:bg-[#2a2d2e] hover:text-[#cccccc]'
                }`}
              >
                <span className="text-[#b07219] font-bold text-sm">☕</span>
                <span>HookFlowSender.java</span>
              </button>
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopyCode}
              className="text-xs px-3 py-1 bg-[#333333] hover:bg-[#444444] text-[#cccccc] hover:text-white rounded border border-[#454545] transition-all flex items-center gap-1.5 cursor-pointer mr-2"
            >
              {copied ? (
                <>
                  <span className="text-[#4ec9b0]">✓</span>
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <span>📋</span>
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* VS Code Code Area with Colorful Syntax Highlighting */}
          <div className="p-5 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto bg-[#1e1e1e]">
            {activeLang === 'nodejs' && (
              <div className="space-y-1">
                <p className="text-[#6a9955]">// Node.js (Fetch API with Idempotency Key)</p>
                <p>
                  <span className="text-[#c586c0]">const</span>{' '}
                  <span className="text-[#9cdcfe]">crypto</span> ={' '}
                  <span className="text-[#dcdcaa]">require</span>(
                  <span className="text-[#ce9178]">&apos;crypto&apos;</span>);
                </p>
                <div className="py-1"></div>
                <p>
                  <span className="text-[#c586c0]">const</span>{' '}
                  <span className="text-[#9cdcfe]">secretKey</span> ={' '}
                  <span className="text-[#ce9178]">&apos;sec_your_organization_key&apos;</span>;
                </p>
                <p>
                  <span className="text-[#c586c0]">const</span>{' '}
                  <span className="text-[#9cdcfe]">userId</span> ={' '}
                  <span className="text-[#ce9178]">&apos;usr_6af0b7db7b540b7b50&apos;</span>;
                </p>
                <p>
                  <span className="text-[#c586c0]">const</span>{' '}
                  <span className="text-[#9cdcfe]">idempotencyKey</span> ={' '}
                  <span className="text-[#9cdcfe]">crypto</span>.
                  <span className="text-[#dcdcaa]">randomUUID</span>();{' '}
                  <span className="text-[#6a9955]">// Unique UUID per event</span>
                </p>
                <div className="py-1"></div>
                <p>
                  <span className="text-[#c586c0]">const</span>{' '}
                  <span className="text-[#9cdcfe]">response</span> ={' '}
                  <span className="text-[#c586c0]">await</span>{' '}
                  <span className="text-[#dcdcaa]">fetch</span>(
                  <span className="text-[#ce9178] underline decoration-[#4ec9b0]/40">
                    &apos;http://localhost:2000/api/events/ingest&apos;
                  </span>
                  , &#123;
                </p>
                <p className="pl-4">
                  <span className="text-[#9cdcfe]">method</span>:{' '}
                  <span className="text-[#ce9178]">&apos;POST&apos;</span>,
                </p>
                <p className="pl-4">
                  <span className="text-[#9cdcfe]">headers</span>: &#123;
                </p>
                <p className="pl-8">
                  <span className="text-[#9cdcfe]">&apos;Content-Type&apos;</span>:{' '}
                  <span className="text-[#ce9178]">&apos;application/json&apos;</span>,
                </p>
                <p className="pl-8 bg-[#2a2d2e]/50 py-0.5 rounded">
                  <span className="text-[#9cdcfe]">&apos;secret-x-key&apos;</span>:{' '}
                  <span className="text-[#9cdcfe]">secretKey</span>,{' '}
                  <span className="text-[#6a9955]">// Authenticated org key</span>
                </p>
                <p className="pl-8 bg-[#007acc]/15 py-0.5 rounded border-l-2 border-[#007acc]">
                  <span className="text-[#9cdcfe]">&apos;idempotency-key&apos;</span>:{' '}
                  <span className="text-[#9cdcfe]">idempotencyKey</span>,{' '}
                  <span className="text-[#4ec9b0]">// Intercepts duplicates with Redis</span>
                </p>
                <p className="pl-4">&#125;,</p>
                <p className="pl-4">
                  <span className="text-[#9cdcfe]">body</span>:{' '}
                  <span className="text-[#4ec9b0]">JSON</span>.
                  <span className="text-[#dcdcaa]">stringify</span>(&#123;
                </p>
                <p className="pl-8">
                  <span className="text-[#9cdcfe]">userId</span>,
                </p>
                <p className="pl-8">
                  <span className="text-[#9cdcfe]">payload</span>: &#123;
                </p>
                <p className="pl-12">
                  <span className="text-[#9cdcfe]">event</span>:{' '}
                  <span className="text-[#ce9178]">&apos;payment.completed&apos;</span>,
                </p>
                <p className="pl-12">
                  <span className="text-[#9cdcfe]">amount</span>:{' '}
                  <span className="text-[#b5cea8]">4900</span>,
                </p>
                <p className="pl-12">
                  <span className="text-[#9cdcfe]">currency</span>:{' '}
                  <span className="text-[#ce9178]">&apos;USD&apos;</span>
                </p>
                <p className="pl-8">&#125;,</p>
                <p className="pl-4">&#125;),</p>
                <p>&#125;);</p>
                <div className="py-1"></div>
                <p>
                  <span className="text-[#c586c0]">const</span>{' '}
                  <span className="text-[#9cdcfe]">data</span> ={' '}
                  <span className="text-[#c586c0]">await</span>{' '}
                  <span className="text-[#9cdcfe]">response</span>.
                  <span className="text-[#dcdcaa]">json</span>();
                </p>
                <p>
                  <span className="text-[#9cdcfe]">console</span>.
                  <span className="text-[#dcdcaa]">log</span>(
                  <span className="text-[#ce9178]">&apos;HookFlow Ingested:&apos;</span>,{' '}
                  <span className="text-[#9cdcfe]">data</span>);
                </p>
              </div>
            )}

            {activeLang === 'python' && (
              <div className="space-y-1">
                <p className="text-[#6a9955]"># Python 3 (Requests with Idempotency Key)</p>
                <p>
                  <span className="text-[#c586c0]">import</span>{' '}
                  <span className="text-[#4ec9b0]">uuid</span>
                </p>
                <p>
                  <span className="text-[#c586c0]">import</span>{' '}
                  <span className="text-[#4ec9b0]">requests</span>
                </p>
                <div className="py-1"></div>
                <p>
                  <span className="text-[#9cdcfe]">secret_key</span> ={' '}
                  <span className="text-[#ce9178]">&quot;sec_your_organization_key&quot;</span>
                </p>
                <p>
                  <span className="text-[#9cdcfe]">user_id</span> ={' '}
                  <span className="text-[#ce9178]">&quot;usr_6af0b7db7b540b7b50&quot;</span>
                </p>
                <p>
                  <span className="text-[#9cdcfe]">idempotency_key</span> ={' '}
                  <span className="text-[#dcdcaa]">str</span>(
                  <span className="text-[#4ec9b0]">uuid</span>.
                  <span className="text-[#dcdcaa]">uuid4</span>())  <span className="text-[#6a9955]"># Unique UUID per event</span>
                </p>
                <div className="py-1"></div>
                <p>
                  <span className="text-[#9cdcfe]">url</span> ={' '}
                  <span className="text-[#ce9178] underline decoration-[#4ec9b0]/40">
                    &quot;http://localhost:2000/api/events/ingest&quot;
                  </span>
                </p>
                <div className="py-1"></div>
                <p>
                  <span className="text-[#9cdcfe]">headers</span> = &#123;
                </p>
                <p className="pl-4">
                  <span className="text-[#ce9178]">&quot;Content-Type&quot;</span>:{' '}
                  <span className="text-[#ce9178]">&quot;application/json&quot;</span>,
                </p>
                <p className="pl-4 bg-[#2a2d2e]/50 py-0.5 rounded">
                  <span className="text-[#ce9178]">&quot;secret-x-key&quot;</span>:{' '}
                  <span className="text-[#9cdcfe]">secret_key</span>,
                </p>
                <p className="pl-4 bg-[#007acc]/15 py-0.5 rounded border-l-2 border-[#007acc]">
                  <span className="text-[#ce9178]">&quot;idempotency-key&quot;</span>:{' '}
                  <span className="text-[#9cdcfe]">idempotency_key</span>,  <span className="text-[#4ec9b0]"># Intercepts duplicates with Redis</span>
                </p>
                <p>&#125;</p>
                <div className="py-1"></div>
                <p>
                  <span className="text-[#9cdcfe]">payload</span> = &#123;
                </p>
                <p className="pl-4">
                  <span className="text-[#ce9178]">&quot;userId&quot;</span>:{' '}
                  <span className="text-[#9cdcfe]">user_id</span>,
                </p>
                <p className="pl-4">
                  <span className="text-[#ce9178]">&quot;payload&quot;</span>: &#123;
                </p>
                <p className="pl-8">
                  <span className="text-[#ce9178]">&quot;event&quot;</span>:{' '}
                  <span className="text-[#ce9178]">&quot;payment.completed&quot;</span>,
                </p>
                <p className="pl-8">
                  <span className="text-[#ce9178]">&quot;amount&quot;</span>:{' '}
                  <span className="text-[#b5cea8]">4900</span>,
                </p>
                <p className="pl-8">
                  <span className="text-[#ce9178]">&quot;currency&quot;</span>:{' '}
                  <span className="text-[#ce9178]">&quot;USD&quot;</span>,
                </p>
                <p className="pl-4">&#125;,</p>
                <p>&#125;</p>
                <div className="py-1"></div>
                <p>
                  <span className="text-[#9cdcfe]">response</span> ={' '}
                  <span className="text-[#4ec9b0]">requests</span>.
                  <span className="text-[#dcdcaa]">post</span>(
                  <span className="text-[#9cdcfe]">url</span>,{' '}
                  <span className="text-[#9cdcfe]">json</span>=
                  <span className="text-[#9cdcfe]">payload</span>,{' '}
                  <span className="text-[#9cdcfe]">headers</span>=
                  <span className="text-[#9cdcfe]">headers</span>)
                </p>
                <p>
                  <span className="text-[#dcdcaa]">print</span>(
                  <span className="text-[#ce9178]">&quot;HookFlow Response:&quot;</span>,{' '}
                  <span className="text-[#9cdcfe]">response</span>.
                  <span className="text-[#dcdcaa]">json</span>())
                </p>
              </div>
            )}

            {activeLang === 'java' && (
              <div className="space-y-1">
                <p className="text-[#6a9955]">// Java 11+ HttpClient with Idempotency Key</p>
                <p>
                  <span className="text-[#c586c0]">import</span>{' '}
                  <span className="text-[#4ec9b0]">java.net.URI</span>;
                </p>
                <p>
                  <span className="text-[#c586c0]">import</span>{' '}
                  <span className="text-[#4ec9b0]">java.net.http.HttpClient</span>;
                </p>
                <p>
                  <span className="text-[#c586c0]">import</span>{' '}
                  <span className="text-[#4ec9b0]">java.net.http.HttpRequest</span>;
                </p>
                <p>
                  <span className="text-[#c586c0]">import</span>{' '}
                  <span className="text-[#4ec9b0]">java.net.http.HttpResponse</span>;
                </p>
                <p>
                  <span className="text-[#c586c0]">import</span>{' '}
                  <span className="text-[#4ec9b0]">java.util.UUID</span>;
                </p>
                <div className="py-1"></div>
                <p>
                  <span className="text-[#569cd6]">public class</span>{' '}
                  <span className="text-[#4ec9b0]">HookFlowSender</span> &#123;
                </p>
                <p className="pl-4">
                  <span className="text-[#569cd6]">public static void</span>{' '}
                  <span className="text-[#dcdcaa]">main</span>(
                  <span className="text-[#4ec9b0]">String</span>[]{' '}
                  <span className="text-[#9cdcfe]">args</span>) <span className="text-[#569cd6]">throws</span>{' '}
                  <span className="text-[#4ec9b0]">Exception</span> &#123;
                </p>
                <p className="pl-8">
                  <span className="text-[#4ec9b0]">String</span>{' '}
                  <span className="text-[#9cdcfe]">secretKey</span> ={' '}
                  <span className="text-[#ce9178]">&quot;sec_your_organization_key&quot;</span>;
                </p>
                <p className="pl-8">
                  <span className="text-[#4ec9b0]">String</span>{' '}
                  <span className="text-[#9cdcfe]">idempotencyKey</span> ={' '}
                  <span className="text-[#4ec9b0]">UUID</span>.
                  <span className="text-[#dcdcaa]">randomUUID</span>().
                  <span className="text-[#dcdcaa]">toString</span>();
                </p>
                <div className="py-1"></div>
                <p className="pl-8">
                  <span className="text-[#4ec9b0]">String</span>{' '}
                  <span className="text-[#9cdcfe]">jsonPayload</span> ={' '}
                  <span className="text-[#ce9178]">&quot;&quot;&quot;</span>
                </p>
                <p className="pl-12 text-[#ce9178]">&#123;</p>
                <p className="pl-16 text-[#ce9178]">&quot;userId&quot;: &quot;usr_6af0b7db7b540b7b50&quot;,</p>
                <p className="pl-16 text-[#ce9178]">&quot;payload&quot;: &#123; &quot;event&quot;: &quot;payment.completed&quot;, &quot;amount&quot;: 4900 &#125;</p>
                <p className="pl-12 text-[#ce9178]">&#125;</p>
                <p className="pl-8">
                  <span className="text-[#ce9178]">&quot;&quot;&quot;</span>;
                </p>
                <div className="py-1"></div>
                <p className="pl-8">
                  <span className="text-[#4ec9b0]">HttpClient</span>{' '}
                  <span className="text-[#9cdcfe]">client</span> ={' '}
                  <span className="text-[#4ec9b0]">HttpClient</span>.
                  <span className="text-[#dcdcaa]">newHttpClient</span>();
                </p>
                <p className="pl-8">
                  <span className="text-[#4ec9b0]">HttpRequest</span>{' '}
                  <span className="text-[#9cdcfe]">request</span> ={' '}
                  <span className="text-[#4ec9b0]">HttpRequest</span>.
                  <span className="text-[#dcdcaa]">newBuilder</span>()
                </p>
                <p className="pl-12">
                  .<span className="text-[#dcdcaa]">uri</span>(
                  <span className="text-[#4ec9b0]">URI</span>.
                  <span className="text-[#dcdcaa]">create</span>(
                  <span className="text-[#ce9178]">&quot;http://localhost:2000/api/events/ingest&quot;</span>))
                </p>
                <p className="pl-12">
                  .<span className="text-[#dcdcaa]">header</span>(
                  <span className="text-[#ce9178]">&quot;Content-Type&quot;</span>,{' '}
                  <span className="text-[#ce9178]">&quot;application/json&quot;</span>)
                </p>
                <p className="pl-12">
                  .<span className="text-[#dcdcaa]">header</span>(
                  <span className="text-[#ce9178]">&quot;secret-x-key&quot;</span>,{' '}
                  <span className="text-[#9cdcfe]">secretKey</span>)
                </p>
                <p className="pl-12 bg-[#007acc]/15 py-0.5 rounded border-l-2 border-[#007acc]">
                  .<span className="text-[#dcdcaa]">header</span>(
                  <span className="text-[#ce9178]">&quot;idempotency-key&quot;</span>,{' '}
                  <span className="text-[#9cdcfe]">idempotencyKey</span>){' '}
                  <span className="text-[#4ec9b0]">// Redis idempotency</span>
                </p>
                <p className="pl-12">
                  .<span className="text-[#dcdcaa]">POST</span>(
                  <span className="text-[#4ec9b0]">HttpRequest</span>.
                  <span className="text-[#4ec9b0]">BodyPublishers</span>.
                  <span className="text-[#dcdcaa]">ofString</span>(
                  <span className="text-[#9cdcfe]">jsonPayload</span>))
                </p>
                <p className="pl-12">
                  .<span className="text-[#dcdcaa]">build</span>();
                </p>
                <div className="py-1"></div>
                <p className="pl-8">
                  <span className="text-[#4ec9b0]">HttpResponse</span>&lt;<span className="text-[#4ec9b0]">String</span>&gt;{' '}
                  <span className="text-[#9cdcfe]">response</span> ={' '}
                  <span className="text-[#9cdcfe]">client</span>.
                  <span className="text-[#dcdcaa]">send</span>(
                  <span className="text-[#9cdcfe]">request</span>,{' '}
                  <span className="text-[#4ec9b0]">HttpResponse</span>.
                  <span className="text-[#4ec9b0]">BodyHandlers</span>.
                  <span className="text-[#dcdcaa]">ofString</span>());
                </p>
                <p className="pl-8">
                  <span className="text-[#4ec9b0]">System</span>.<span className="text-[#9cdcfe]">out</span>.
                  <span className="text-[#dcdcaa]">println</span>(
                  <span className="text-[#ce9178]">&quot;HookFlow Response: &quot;</span> +{' '}
                  <span className="text-[#9cdcfe]">response</span>.
                  <span className="text-[#dcdcaa]">body</span>());
                </p>
                <p className="pl-4">&#125;</p>
                <p>&#125;</p>
              </div>
            )}
          </div>

          {/* VS Code Status Bar */}
          <div className="bg-[#007acc] text-white text-[11px] px-3 py-1 flex items-center justify-between font-sans select-none">
            <div className="flex items-center gap-3">
              <span>⚡ Ready for Ingestion</span>
              <span className="hidden sm:inline">UTF-8</span>
              <span className="hidden sm:inline">Redis 300s TTL</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{activeLang === 'nodejs' ? 'JavaScript' : activeLang === 'python' ? 'Python' : 'Java'}</span>
              <span>Port: 2000</span>
            </div>
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
