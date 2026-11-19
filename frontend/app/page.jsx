


'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-display', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

/* ---------------------------------- data ---------------------------------- */

const CODE_SNIPPETS = {
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

const TABS = [
  { id: 'nodejs', file: 'send-event.js', badge: 'JS', color: '#68a063', label: 'JavaScript' },
  { id: 'python', file: 'send_event.py', badge: 'PY', color: '#3572A5', label: 'Python' },
  { id: 'java', file: 'HookFlowSender.java', badge: '☕', color: '#b07219', label: 'Java' },
];

const PIPELINE = [
  { label: 'SOURCE', sub: 'your app', dot: 'bg-[#191817]/40', ping: false },
  { label: 'INGEST', sub: 'POST /events', dot: 'bg-[#191817]/40', ping: false },
  { label: 'REDIS', sub: 'SET NX EX 300', dot: 'bg-emerald-500', ping: true },
  { label: 'QUEUE', sub: 'durable', dot: 'bg-[#191817]/40', ping: false },
  { label: 'RELAY', sub: 'backoff ↻', dot: 'bg-amber-500', ping: false },
  { label: 'ENDPOINT', sub: '200 OK', dot: 'bg-[#B08D4C]', ping: true },
];

const FEED = [
  { id: 'evt_9f3ac1', msg: 'payment.completed → relay → endpoint', status: '200 OK · 38ms', tone: 'text-emerald-400' },
  { id: 'evt_9f3ac1', msg: 'duplicate intercepted at Redis NX', status: 'DEDUPED · <1ms', tone: 'text-[#B08D4C]' },
  { id: 'evt_b77e02', msg: 'invoice.issued → relay → endpoint', status: '200 OK · 61ms', tone: 'text-emerald-400' },
  { id: 'evt_c21d90', msg: 'endpoint timeout → backoff scheduled', status: 'RETRY #2 · 10s', tone: 'text-amber-400' },
  { id: 'evt_d40aa7', msg: 'user.created → relay → endpoint', status: '200 OK · 44ms', tone: 'text-emerald-400' },
  { id: 'evt_e58b13', msg: 'signature verified · org key matched', status: 'ACCEPTED · 202', tone: 'text-emerald-400' },
];

const MARQUEE = [
  'AT-LEAST-ONCE DELIVERY', 'REDIS SET NX EX 300', 'ORG-SCOPED SECRET KEYS', 'EXPONENTIAL BACKOFF',
  'DEAD-LETTER RECOVERY', 'IDEMPOTENCY-KEY', '202 ACCEPTED', 'ZERO DUPLICATES',
];

const STATS = [
  { v: '<2ms', l: 'DEDUPE CHECK' },
  { v: '300s', l: 'IDEMPOTENCY TTL' },
  { v: '5s', l: 'RELAY POLL' },
  { v: '0', l: 'DUPLICATES DELIVERED' },
];

/* ----------------------------- syntax tokenizer ---------------------------- */

const TOKEN_RE =
  /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\/\/[^\n]*|#[^\n]*)|\b(import|from|await|async|return|throws|def)\b|\b(const|let|var|new|public|private|class|static|void)\b|\b(\d+(?:\.\d+)?)\b|\b([A-Z][A-Za-z0-9_]*)\b|([A-Za-z_$][\w$]*)(?=\s*\()|([A-Za-z_$][\w$]*)(?=\s*:)/g;

const COLORS = ['#ce9178', '#6a9955', '#c586c0', '#569cd6', '#b5cea8', '#4ec9b0', '#dcdcaa', '#9cdcfe'];

function tokenize(line) {
  const out = [];
  let last = 0;
  let m;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(line))) {
    if (m.index > last) out.push({ text: line.slice(last, m.index), color: '#d4d4d4' });
    const gi = m.slice(1).findIndex((g) => g !== undefined);
    out.push({ text: m[0], color: COLORS[gi] ?? '#d4d4d4' });
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push({ text: line.slice(last), color: '#d4d4d4' });
  return out;
}

function buildLines(code, lang) {
  let inTextBlock = false;
  return code.split('\n').map((line) => {
    let tokens;
    if (lang === 'java' && inTextBlock) {
      tokens = [{ text: line, color: '#ce9178' }];
      if (line.includes('"""')) inTextBlock = false;
    } else if (lang === 'java' && line.includes('"""')) {
      const i = line.indexOf('"""');
      tokens = [...tokenize(line.slice(0, i)), { text: line.slice(i), color: '#ce9178' }];
      inTextBlock = true;
    } else {
      tokens = tokenize(line);
    }
    const t = line.trim();
    const isComment = t.startsWith('//') || t.startsWith('#');
    const low = line.toLowerCase();
    const hl = !isComment && (low.includes('idempotency-key') || low.includes('idempotency_key'));
    const hl2 = !isComment && !hl && low.includes('secret-x-key');
    return { tokens, cls: hl ? 'hf-hl' : hl2 ? 'hf-hl2' : '' };
  });
}

/* --------------------------------- styles ---------------------------------- */

const PAGE_CSS = `
.hf-root{font-family:var(--font-sans),ui-sans-serif,system-ui,sans-serif;}
.hf-display{font-family:var(--font-display),Georgia,'Times New Roman',serif;}
.hf-mono{font-family:var(--font-mono),ui-monospace,SFMono-Regular,Menlo,monospace;}
html{scroll-behavior:smooth;}
.hf-grain{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E");}
.hf-dotgrid{background-image:radial-gradient(rgba(25,24,23,0.13) 1px,transparent 1px);background-size:22px 22px;-webkit-mask-image:radial-gradient(ellipse 90% 70% at 50% 0%,black 25%,transparent 78%);mask-image:radial-gradient(ellipse 90% 70% at 50% 0%,black 25%,transparent 78%);}
@keyframes hf-rise{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}
.hf-rise{animation:hf-rise .9s cubic-bezier(.16,1,.3,1) both;}
[data-reveal]{opacity:0;transform:translateY(30px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1);}
[data-reveal].is-in{opacity:1;transform:none;}
@keyframes hf-marquee{to{transform:translateX(-50%)}}
.hf-marquee{animation:hf-marquee 30s linear infinite;}
.hf-marquee-wrap:hover .hf-marquee{animation-play-state:paused;}
@keyframes hf-dash{to{background-position:10px 0}}
.hf-connector{height:1px;min-width:24px;background:repeating-linear-gradient(90deg,rgba(25,24,23,.35) 0 5px,transparent 5px 10px);animation:hf-dash .5s linear infinite;}
@keyframes hf-travel{0%{left:0%;opacity:0}6%{opacity:1}94%{opacity:1}100%{left:100%;opacity:0}}
.hf-travel-dot{position:absolute;top:50%;width:7px;height:7px;margin-top:-3.5px;border-radius:9999px;background:#8A6D3B;box-shadow:0 0 10px rgba(176,141,76,.8);animation:hf-travel 5s ease-in-out infinite;z-index:0;}
@keyframes hf-blink{0%,49%{opacity:1}50%,100%{opacity:0}}
.hf-caret{animation:hf-blink 1.1s steps(1) infinite;}
@keyframes hf-feed{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
.hf-feed{animation:hf-feed .45s ease both;}
@keyframes hf-draw{to{stroke-dashoffset:0}}
.hf-draw{stroke-dasharray:320;stroke-dashoffset:320;animation:hf-draw 1.4s .5s cubic-bezier(.16,1,.3,1) forwards;}
.hf-btn{position:relative;overflow:hidden;}
.hf-btn::after{content:'';position:absolute;inset:0;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.28) 50%,transparent 60%);transform:translateX(-130%);transition:transform .7s ease;}
.hf-btn:hover::after{transform:translateX(130%);}
.hf-card::before,.hf-card::after{font-family:var(--font-mono),monospace;position:absolute;color:rgba(25,24,23,.2);font-size:13px;line-height:1;transition:color .4s;content:'+';}
.hf-card::before{top:8px;left:10px;}
.hf-card::after{bottom:8px;right:10px;}
.hf-card:hover::before,.hf-card:hover::after{color:#B08D4C;}
.hf-ln{display:inline-block;width:2.4rem;margin-right:1.2rem;text-align:right;color:#85888e;opacity:.5;user-select:none;}
.hf-hl{background:rgba(0,122,204,.16);box-shadow:inset 2px 0 0 #007acc;}
.hf-hl2{background:rgba(255,255,255,.045);}
.hf-scroll::-webkit-scrollbar{width:9px;height:9px;}
.hf-scroll::-webkit-scrollbar-track{background:transparent;}
.hf-scroll::-webkit-scrollbar-thumb{background:#3c3c3c;border-radius:9999px;border:2px solid #1e1e1e;}
.hf-scroll::-webkit-scrollbar-thumb:hover{background:#4a4a4a;}
.hf-root a:focus-visible,.hf-root button:focus-visible{outline:2px solid #B08D4C;outline-offset:3px;border-radius:2px;}
@media (prefers-reduced-motion:reduce){
  .hf-rise,.hf-marquee,.hf-connector,.hf-travel-dot,.hf-caret,.hf-feed,.hf-draw{animation:none !important;}
  .hf-draw{stroke-dashoffset:0;}
  [data-reveal]{opacity:1 !important;transform:none !important;transition:none !important;}
  .hf-btn::after{display:none;}
  html{scroll-behavior:auto;}
}
`;

/* -------------------------------- components ------------------------------- */

const Arrow = ({ className = '' }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeLang, setActiveLang] = useState('nodejs');
  const [copied, setCopied] = useState(false);
  const [feedIdx, setFeedIdx] = useState(0);
  const copyTimer = useRef(null);

  useEffect(() => {
    setMounted(true);
    if (localStorage.getItem('accessToken')) setIsLoggedIn(true);

    const els = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setFeedIdx((i) => (i + 1) % FEED.length), 2600);
    return () => clearInterval(t);
  }, []);

  const lines = useMemo(() => buildLines(CODE_SNIPPETS[activeLang], activeLang), [activeLang]);
  const feed = FEED[feedIdx];

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(CODE_SNIPPETS[activeLang]);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  };

  const ctaHref = mounted && isLoggedIn ? '/dashboard' : '/register';
  const ctaLabel = mounted && isLoggedIn ? 'OPEN DASHBOARD' : 'START FREE INTEGRATION';

  return (
    <div
      id="top"
      className={`${sans.variable} ${serif.variable} ${mono.variable} hf-root min-h-screen bg-[#F5F4EF] text-[#191817] antialiased flex flex-col selection:bg-[#191817] selection:text-[#F5F4EF]`}
    >
      <style>{PAGE_CSS}</style>

      {/* Film grain over everything */}
      <div aria-hidden="true" className="hf-grain fixed inset-0 z-[70] pointer-events-none opacity-[0.05]" />

      {/* Status micro-bar */}
      <div className="w-full bg-[#141311] text-[#F5F4EF]/70">
        <div className="max-w-6xl mx-auto px-6 h-8 flex items-center justify-between hf-mono text-[9px] tracking-[0.25em] uppercase">
          <span className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            All systems operational
          </span>
          <span className="hidden sm:inline text-[#F5F4EF]/40">Redis connected · TTL 300s · Poll 5s</span>
        </div>
      </div>

      {/* Navbar */}
      <header className="w-full border-b border-[#191817]/10 bg-[#F5F4EF]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="relative w-8 h-8 rounded-[6px] bg-[#191817] text-[#F5F4EF] flex items-center justify-center hf-display text-lg shadow-sm">
              H
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#B08D4C]" />
            </span>
            <span className="hf-display text-[22px] tracking-tight">HookFlow</span>
            <span className="hidden sm:inline hf-mono text-[8px] tracking-[0.2em] uppercase border border-[#191817]/15 rounded-full px-2 py-0.5 text-[#191817]/50">v1.0</span>
          </Link>

          <nav aria-label="Primary" className="hidden md:flex items-center gap-7 hf-mono text-[10px] tracking-[0.25em] uppercase text-[#191817]/60">
            {[['Capabilities', '#capabilities'], ['The Wire', '#wire'], ['Quickstart', '#quickstart']].map(([label, href]) => (
              <a key={href} href={href} className="relative hover:text-[#191817] transition-colors after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-[#B08D4C] after:transition-all hover:after:w-full">
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {mounted && isLoggedIn ? (
              <Link href="/dashboard" className="hf-btn inline-flex items-center gap-2 px-5 py-2.5 bg-[#191817] hover:bg-[#2a2823] text-[#F5F4EF] hf-mono text-[10px] tracking-[0.2em] uppercase rounded-[4px] transition-colors">
                Dashboard <Arrow />
              </Link>
            ) : (
              <>
                <Link href="/login" className="hf-mono text-[10px] tracking-[0.2em] uppercase text-[#191817]/60 hover:text-[#191817] transition-colors px-2 py-2">
                  Sign In
                </Link>
                <Link href="/register" className="hf-btn inline-flex items-center gap-2 px-5 py-2.5 bg-[#191817] hover:bg-[#2a2823] text-[#F5F4EF] hf-mono text-[10px] tracking-[0.2em] uppercase rounded-[4px] transition-colors">
                  Get Started <Arrow />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ------------------------------- HERO ------------------------------- */}
        <section className="relative -mt-12 max-w-6xl mx-auto px-6 pt-16 sm:pt-24 pb-8 flex flex-col items-center text-center">
          <div aria-hidden="true" className="hf-dotgrid absolute inset-0 pointer-events-none" />
          <div aria-hidden="true" className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[480px] rounded-full bg-[#B08D4C]/10 blur-[110px] pointer-events-none" />
          <span aria-hidden="true" className="hidden lg:block absolute top-2 left-6 hf-mono text-[#191817]/25 select-none">+</span>
          <span aria-hidden="true" className="hidden lg:block absolute top-2 right-6 hf-mono text-[#191817]/25 select-none">+</span>
          <span aria-hidden="true" className="hidden xl:block absolute -left-14 top-28 [writing-mode:vertical-rl] rotate-180 hf-mono text-[9px] tracking-[0.45em] uppercase text-[#191817]/30 select-none">
            Reliability infrastructure — est. 2026
          </span>
          <span aria-hidden="true" className="hidden xl:block absolute -right-14 top-28 [writing-mode:vertical-rl] hf-mono text-[9px] tracking-[0.45em] uppercase text-[#191817]/30 select-none">
            Ingest ✦ Dedupe ✦ Relay ✦ Deliver
          </span>

          <div className="hf-rise relative inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur border border-[#191817]/10 hf-mono text-[9px] sm:text-[10px] font-medium tracking-[0.25em] uppercase text-[#191817]/70 shadow-[0_2px_8px_rgba(25,24,23,0.04)] mb-9">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Webhook Ingestion &amp; Relay Engine
            <span className="text-[#191817]/20">|</span>
            <span className="text-[#8A6D3B]">v1.0 Ready</span>
          </div>

          <h1 className="hf-rise relative hf-display text-[15vw] sm:text-7xl md:text-8xl leading-[0.98] tracking-[-0.01em] max-w-4xl" style={{ animationDelay: '0.08s' }}>
            Never miss an<br className="hidden sm:block" />{' '}
            <span className="relative inline-block italic text-[#8A6D3B] px-1">
              event
              <svg className="absolute left-0 -bottom-1 sm:-bottom-2 w-full h-[12px] sm:h-[14px]" viewBox="0 0 240 14" preserveAspectRatio="none" fill="none" aria-hidden="true">
                <path className="hf-draw" d="M3 10 C 40 3, 75 13, 115 7 C 150 2, 185 12, 237 5" stroke="#B08D4C" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </span>{' '}
            again.
          </h1>

          <div className="hf-rise relative flex flex-col sm:flex-row items-center justify-center gap-3 pt-9" style={{ animationDelay: '0.24s' }}>
  <Link href={ctaHref} className="hf-btn group inline-flex items-center gap-3 px-8 py-4 bg-[#191817] hover:bg-[#2a2823] text-[#F5F4EF] hf-mono text- tracking-[0.2em] uppercase rounded- transition-all duration-200 shadow-[0_10px_28px_-10px_rgba(25,24,23,0.5)] hover:-translate-y-0.5">
    {ctaLabel}
    <Arrow className="transition-transform group-hover:translate-x-1" />
  </Link>

  <a href="#quickstart" className="group inline-flex items-center gap-3 px-8 py-4 border border-[#191817]/20 hover:border-[#191817] text-[#191817] hf-mono text- tracking-[0.2em] uppercase rounded- transition-colors bg-white/60">
    <span
      className="flex h-6 w-6 items-center justify-center rounded-full transition-all duration-200"
      style={{ border: '1px solid #D4AF37', backgroundColor: 'rgba(212,175,55,0.12)', color: '#D4AF37' }}
    >
      <svg width="9" height="9" viewBox="0 0 24 24" fill="#D4AF37" aria-hidden="true">
        <path d="M8 5.14v13.72c0 .8.87 1.3 1.56.88l10.5-6.86a1.03 1.03 0 0 0 0-1.76L9.56 4.26A1.03 1.03 0 0 0 8 5.14Z" />
      </svg>
    </span>
    View Quickstart
  </a>
</div>

          <div className="hf-rise relative flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-9 hf-mono text-[9px] tracking-[0.3em] uppercase text-[#191817]/50" style={{ animationDelay: '0.32s' }}>
            <span>{'<2ms dedupe'}</span><span className="text-[#B08D4C]">✦</span>
            <span>Exponential backoff</span><span className="text-[#B08D4C]">✦</span>
            <span>Org-scoped keys</span>
          </div>
        </section>

        {/* ----------------------------- THE WIRE ----------------------------- */}
        <section id="wire" className="max-w-6xl mx-auto px-6 w-full scroll-mt-28" data-reveal>
          <div className="flex items-center justify-between mb-4">
            <p className="hf-mono text-[10px] tracking-[0.35em] uppercase text-[#191817]/60 flex items-center gap-2.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              The Wire — Live Pipeline
            </p>
            <p className="hidden sm:block hf-mono text-[10px] tracking-[0.25em] uppercase text-[#191817]/40">Poll 5s · TTL 300s</p>
          </div>

          <div className="bg-white border border-[#191817]/10 rounded-lg p-5 sm:p-6 shadow-[0_4px_20px_rgba(25,24,23,0.04)]">
            <div className="overflow-x-auto pb-1">
              <div className="relative flex items-center min-w-[680px] px-1">
                <span aria-hidden="true" className="hf-travel-dot" />
                {PIPELINE.map((node, i) => (
                  <div key={node.label} className="contents">
                    {i > 0 && <div aria-hidden="true" className="hf-connector flex-1" />}
                    <div className="relative z-10 flex flex-col items-center gap-1 bg-[#F5F4EF] border border-[#191817]/15 rounded-md px-3 py-2 min-w-[96px]">
                      <span className="flex items-center gap-1.5 hf-mono text-[9px] tracking-[0.2em] text-[#191817]">
                        <span className="relative flex h-1.5 w-1.5">
                          {node.ping && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${node.dot} opacity-60`} />}
                          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${node.dot}`} />
                        </span>
                        {node.label}
                      </span>
                      <span className="hf-mono text-[9px] text-[#191817]/50">{node.sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 rounded-md bg-[#141311] px-4 py-3 border border-[#191817]">
              <div key={feedIdx} className="hf-feed flex items-center gap-3 hf-mono text-[10.5px] min-w-0">
                <span className="text-[#F5F4EF]/40 shrink-0">{feed.id}</span>
                <span className="text-[#F5F4EF]/80 truncate">{feed.msg}</span>
                <span className={`${feed.tone} shrink-0`}>{feed.status}</span>
              </div>
              <span className="flex items-center gap-2 hf-mono text-[9px] tracking-[0.25em] text-emerald-400 shrink-0">
                <span className="hf-caret">▍</span>LIVE
              </span>
            </div>
          </div>
        </section>

        {/* ------------------------------ MARQUEE ------------------------------ */}
        <section aria-hidden="true" className="hf-marquee-wrap mt-16 border-y border-[#191817]/10 bg-white/40 py-4 overflow-hidden">
          <div className="hf-marquee flex w-max">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex items-center gap-10 pr-10 hf-mono text-[10px] tracking-[0.3em] uppercase text-[#191817]/60 whitespace-nowrap">
                {MARQUEE.map((item) => (
                  <span key={item} className="flex items-center gap-10">
                    {item}<span className="text-[#B08D4C]">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* ---------------------------- CAPABILITIES ---------------------------- */}
        <section id="capabilities" className="max-w-6xl mx-auto px-6 w-full mt-20 scroll-mt-28">
          <div className="flex items-end justify-between gap-6 mb-10" data-reveal>
            <div>
              <p className="hf-mono text-[10px] tracking-[0.35em] text-[#8A6D3B] uppercase mb-3">№ 01 — Capabilities</p>
              <h2 className="hf-display text-4xl sm:text-5xl tracking-tight">The reliability stack</h2>
            </div>
            <p className="hidden md:block max-w-xs text-[13px] leading-relaxed text-[#191817]/60">
              Three guarantees, enforced on every single request that enters the pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                n: '01', chip: '<2MS', dot: 'bg-emerald-500', cmd: 'SET idemp:key EX 300 NX',
                title: 'Redis Idempotency',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />,
                body: <>An atomic caching layer intercepts duplicate requests and rapid retries at microsecond speed. Payload keys are checked before any database write ever happens.</>,
              },
              {
                n: '02', chip: 'SEC_••••••', dot: 'bg-blue-500', cmd: 'HMAC isolation per organization',
                title: 'Secret Key Verification',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
                body: <>Every organization carries an isolated, unforgeable secret key (<code className="hf-mono text-[11px] px-1.5 py-0.5 bg-[#191817]/5 rounded">secret-x-key</code>). Requests are authenticated and validated before they ever reach the processing queue.</>,
              },
              {
                n: '03', chip: '5S POLL', dot: 'bg-amber-500', cmd: 'Dead-letter circuit breaker',
                title: 'Automated Relay & Backoff',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />,
                body: <>A background worker polls pending events every five seconds. Failed or timed-out endpoints are retried with exponential backoff until delivery or manual recovery.</>,
              },
            ].map((card, i) => (
              <article
                key={card.n}
                data-reveal
                style={{ transitionDelay: `${i * 100}ms` }}
                className="hf-card group relative bg-white border border-[#191817]/10 rounded-lg p-7 sm:p-8 flex flex-col justify-between overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:border-[#191817]/30 hover:shadow-[0_24px_48px_-20px_rgba(25,24,23,0.25)]"
              >
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] bg-[#B08D4C] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                <span aria-hidden="true" className="absolute -top-5 right-2 hf-display italic text-[120px] leading-none text-[#191817]/[0.05] group-hover:text-[#8A6D3B]/10 transition-colors duration-500 select-none pointer-events-none">
                  {card.n}
                </span>

                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-11 h-11 rounded-[8px] border border-[#191817]/15 bg-[#F5F4EF] text-[#191817] group-hover:bg-[#191817] group-hover:text-[#F5F4EF] flex items-center justify-center transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        {card.icon}
                      </svg>
                    </div>
                    <span className="hf-mono text-[9px] tracking-[0.18em] uppercase border border-[#191817]/10 bg-[#F5F4EF] px-2.5 py-1 rounded-full text-[#191817]/60">
                      {card.chip}
                    </span>
                  </div>
                  <h3 className="hf-display text-[26px] leading-snug tracking-tight mb-2.5">{card.title}</h3>
                  <p className="text-[13px] text-[#191817]/70 leading-relaxed">{card.body}</p>
                </div>

                <div className="relative mt-6 pt-4 border-t border-[#191817]/10 flex items-center gap-2 hf-mono text-[10.5px] text-[#191817]/70">
                  <span className={`w-1.5 h-1.5 rounded-full ${card.dot}`} />
                  <span>{card.cmd}</span>
                </div>
              </article>
            ))}
          </div>

          {/* Stats band */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-[#191817]/10 border-y border-[#191817]/10" data-reveal>
            {STATS.map((s) => (
              <div key={s.l} className="bg-[#F5F4EF] p-6 sm:p-8 text-center">
                <p className="hf-display text-4xl sm:text-5xl">{s.v}</p>
                <p className="mt-2 hf-mono text-[9px] tracking-[0.3em] uppercase text-[#191817]/50">{s.l}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ----------------------------- QUICKSTART ----------------------------- */}
        <section id="quickstart" className="max-w-6xl mx-auto px-6 w-full mt-24 scroll-mt-28">
          <div className="flex items-end justify-between gap-6 mb-8" data-reveal>
            <div>
              <p className="hf-mono text-[10px] tracking-[0.35em] text-[#8A6D3B] uppercase mb-3">№ 02 — Quickstart</p>
              <h2 className="hf-display text-4xl sm:text-5xl tracking-tight">Sixty seconds to first event.</h2>
            </div>
            <p className="hidden md:block max-w-xs text-[13px] leading-relaxed text-[#191817]/60">
              One endpoint, three headers, any language. Copy a snippet and ship.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-8 hf-mono text-[9px] tracking-[0.2em] uppercase" data-reveal>
            {['01 · Create org key', '02 · Set headers', '03 · Post payload'].map((step) => (
              <span key={step} className="border border-[#191817]/15 bg-white px-3.5 py-1.5 rounded-full text-[#191817]/70">
                <span className="text-[#8A6D3B]">{step.slice(0, 2)}</span>{step.slice(2)}
              </span>
            ))}
          </div>

          <div className="relative max-w-4xl mx-auto" data-reveal>
            <div aria-hidden="true" className="absolute -inset-8 rounded-[24px] bg-[radial-gradient(60%_60%_at_50%_40%,rgba(176,141,76,0.18),rgba(16,123,90,0.08)_60%,transparent_78%)] blur-2xl" />

            <div role="region" aria-label="Quickstart code examples" className="relative rounded-xl overflow-hidden border border-[#3c3c3c] bg-[#1e1e1e] shadow-[0_40px_80px_-24px_rgba(25,24,23,0.55)]">
              {/* Title bar */}
              <div className="bg-[#2d2d2d] px-4 py-2.5 flex items-center justify-between border-b border-[#3c3c3c]">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-inner" />
                    <span className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-inner" />
                    <span className="w-3 h-3 rounded-full bg-[#27c93f] shadow-inner" />
                  </div>
                  <span className="hf-mono text-[10px] text-[#969696] pl-2 select-none hidden sm:inline">
                    hookflow — ingestion protocol
                  </span>
                </div>
                <span className="hf-mono text-[9px] tracking-[0.15em] px-2 py-0.5 rounded bg-[#1f382a] text-[#4ec9b0] border border-[#2b593f]">
                  POST /api/events/ingest
                </span>
              </div>

              {/* Tabs */}
              <div className="bg-[#252526] flex items-center justify-between border-b border-[#1e1e1e] pl-1 overflow-x-auto hf-scroll">
                <div role="tablist" aria-label="Language" className="flex items-center">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={activeLang === tab.id}
                      onClick={() => setActiveLang(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 hf-mono text-[11px] whitespace-nowrap transition-colors border-r border-r-[#1e1e1e] border-t-2 cursor-pointer ${
                        activeLang === tab.id
                          ? 'bg-[#1e1e1e] text-white border-t-[#007acc]'
                          : 'text-[#969696] border-t-transparent hover:bg-[#2a2d2e] hover:text-[#cccccc]'
                      }`}
                    >
                      <span className="font-bold text-[10px]" style={{ color: tab.color }}>{tab.badge}</span>
                      <span>{tab.file}</span>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="hf-mono text-[9px] tracking-[0.15em] uppercase px-3 py-1.5 mx-2 shrink-0 bg-[#333333] hover:bg-[#444444] text-[#cccccc] hover:text-white rounded border border-[#454545] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? (<><span className="text-[#4ec9b0]">✓</span>Copied</>) : (<><span>⧉</span>Copy</>)}
                </button>
              </div>

              {/* Code — tokenized, numbered, key lines highlighted */}
              <div className="hf-scroll bg-[#1e1e1e] overflow-auto max-h-[560px] py-4 hf-mono text-[12px] sm:text-[12.5px] leading-[1.8]">
                {lines.map((line, i) => (
                  <div key={i} className={`px-3 ${line.cls}`}>
                    <span className="hf-ln">{i + 1}</span>
                    <span className="whitespace-pre">
                      {line.tokens.length === 0 ? '\u00A0' : line.tokens.map((tok, j) => (
                        <span key={j} style={{ color: tok.color }}>{tok.text}</span>
                      ))}
                      {i === lines.length - 1 && <span className="hf-caret text-[#d4d4d4]">▍</span>}
                    </span>
                  </div>
                ))}
              </div>

              {/* Status bar */}
              <div className="bg-[#007acc] text-white/95 hf-mono text-[9px] tracking-[0.1em] px-3 py-1.5 flex items-center justify-between select-none uppercase">
                <div className="flex items-center gap-3">
                  <span>⚡ Ready</span>
                  <span className="hidden sm:inline">UTF-8</span>
                  <span className="hidden sm:inline">Redis TTL 300s</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>{TABS.find((t) => t.id === activeLang)?.label}</span>
                  <span>Ln {lines.length}</span>
                  <span className="hidden sm:inline">Port 2000</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------ FINAL CTA ------------------------------ */}
        <section className="mt-24 relative bg-[#141311] text-[#F5F4EF] overflow-hidden">
          <div aria-hidden="true" className="hf-grain absolute inset-0 opacity-[0.07] pointer-events-none" />
          <div aria-hidden="true" className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#B08D4C]/15 blur-[110px] pointer-events-none" />
          <div className="relative max-w-6xl mx-auto px-6 py-20 sm:py-24 text-center" data-reveal>
            <p className="hf-mono text-[10px] tracking-[0.4em] uppercase text-[#B08D4C] mb-6">Begin — it takes minutes</p>
            <h2 className="hf-display text-5xl sm:text-6xl md:text-7xl leading-[1.02] tracking-tight">
              Every event, <span className="italic text-[#B08D4C]">accounted for.</span>
            </h2>
            <p className="mt-6 text-[15px] text-[#F5F4EF]/60 max-w-md mx-auto leading-relaxed">
              Create an organization, copy your secret key, and post your first event in under a minute.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href={ctaHref} className="hf-btn group inline-flex items-center gap-3 px-8 py-4 bg-[#F5F4EF] hover:bg-white text-[#191817] hf-mono text-[11px] tracking-[0.2em] uppercase rounded-[4px] transition-all hover:-translate-y-0.5">
                {ctaLabel}
                <Arrow className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a href="#quickstart" className="inline-flex items-center px-8 py-4 border border-[#F5F4EF]/25 hover:border-[#F5F4EF]/60 hf-mono text-[11px] tracking-[0.2em] uppercase rounded-[4px] transition-colors">
                Read the Quickstart
              </a>
            </div>
            <p className="mt-8 hf-mono text-[9px] tracking-[0.3em] uppercase text-[#F5F4EF]/40">
              Free to start ✦ First event in 60 seconds
            </p>
          </div>
        </section>
      </main>

      {/* -------------------------------- FOOTER -------------------------------- */}
      <footer className="border-t border-[#191817]/10 bg-[#F5F4EF]">
        <div className="max-w-6xl mx-auto px-6 pt-14 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 pb-12">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-6 h-6 rounded-[5px] bg-[#191817] text-[#F5F4EF] flex items-center justify-center hf-display text-sm">H</span>
                <span className="hf-display text-lg">HookFlow</span>
              </div>
              <p className="text-[12px] leading-relaxed text-[#191817]/60 max-w-[220px]">
                Webhook reliability infrastructure. Ingest, dedupe, relay — with certainty.
              </p>
            </div>
            <div>
              <p className="hf-mono text-[9px] tracking-[0.3em] uppercase text-[#8A6D3B] mb-4">Product</p>
              <ul className="space-y-2.5 text-[12px] text-[#191817]/70">
                <li><a href="#capabilities" className="hover:text-[#191817] transition-colors">Capabilities</a></li>
                <li><a href="#wire" className="hover:text-[#191817] transition-colors">The Wire</a></li>
                <li><a href="#quickstart" className="hover:text-[#191817] transition-colors">Quickstart</a></li>
                <li>
                  <Link href={mounted && isLoggedIn ? '/dashboard' : '/login'} className="hover:text-[#191817] transition-colors">
                    {mounted && isLoggedIn ? 'Dashboard' : 'Sign In'}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="hf-mono text-[9px] tracking-[0.3em] uppercase text-[#8A6D3B] mb-4">Protocol</p>
              <ul className="space-y-2.5 hf-mono text-[10.5px] text-[#191817]/70">
                <li><span className="text-[#8A6D3B]">POST</span> /api/events/ingest</li>
                <li>secret-x-key <span className="text-[#191817]/40">— org auth</span></li>
                <li>idempotency-key <span className="text-[#191817]/40">— dedupe</span></li>
                <li className="flex items-center gap-2 pt-1 text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> All systems operational
                </li>
              </ul>
            </div>
          </div>

          <p aria-hidden="true" className="hf-display italic text-center leading-[0.8] text-[clamp(64px,14vw,180px)] text-[#191817]/[0.06] select-none pointer-events-none">
            HookFlow
          </p>

          <div className="mt-6 pt-6 border-t border-[#191817]/10 flex flex-col sm:flex-row items-center justify-between gap-3 hf-mono text-[9px] tracking-[0.2em] uppercase text-[#191817]/50">
            <p>© {new Date().getFullYear()} HookFlow — Engineered for certainty</p>
            <a href="#top" className="hover:text-[#191817] transition-colors">↑ Back to top</a>
          </div>
        </div>
      </footer>
    </div>
  );
}