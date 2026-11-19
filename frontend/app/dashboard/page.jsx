

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';

const ui = Space_Grotesk({ subsets: ['latin'], variable: '--font-ui', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

const API_BASE = 'http://localhost:2000';
const INGEST_URL = `${API_BASE}/api/events/ingest`;

/* --------------------------------- tokens ---------------------------------- */

const TONES = {
  green:  { text: 'text-[#00ed64]', glow: 'hf-glow-green',  bar: 'bg-[#00ed64]',  soft: 'bg-[#00ed64]/10',  border: 'border-[#00ed64]/30',  hex: '#00ed64' },
  cyan:   { text: 'text-[#22d3ee]', glow: 'hf-glow-cyan',   bar: 'bg-[#22d3ee]',  soft: 'bg-[#22d3ee]/10',  border: 'border-[#22d3ee]/30',  hex: '#22d3ee' },
  amber:  { text: 'text-[#f59e0b]', glow: 'hf-glow-amber',  bar: 'bg-[#f59e0b]',  soft: 'bg-[#f59e0b]/10',  border: 'border-[#f59e0b]/30',  hex: '#f59e0b' },
  rose:   { text: 'text-[#fb7185]', glow: 'hf-glow-rose',   bar: 'bg-[#fb7185]',  soft: 'bg-[#fb7185]/10',  border: 'border-[#fb7185]/30',  hex: '#fb7185' },
  purple: { text: 'text-[#a78bfa]', glow: 'hf-glow-purple', bar: 'bg-[#a78bfa]',  soft: 'bg-[#a78bfa]/10',  border: 'border-[#a78bfa]/30',  hex: '#a78bfa' },
};

const STATUS = { completed: TONES.green, pending: TONES.amber, failed: TONES.rose, dead: TONES.purple };
const FILTERS = ['all', 'completed', 'pending', 'failed', 'dead'];
const BOOT_LINES = ['AUTHENTICATING SESSION', 'RESOLVING CLUSTER0 → HOOKFLOW', 'OPENING COLLECTIONS CURSOR', 'SYNCING DOCUMENTS'];

/* ---------------------------------- CSS ------------------------------------ */

const CSS = `
@property --hf-angle{syntax:'<angle>';initial-value:0deg;inherits:false;}
.hf-root{font-family:var(--font-ui),ui-sans-serif,system-ui,sans-serif;}
.hf-mono{font-family:var(--font-mono),ui-monospace,SFMono-Regular,Menlo,monospace;}
.hf-grid{background-image:linear-gradient(rgba(10,59,78,.22) 1px,transparent 1px),linear-gradient(90deg,rgba(10,59,78,.22) 1px,transparent 1px);background-size:42px 42px;-webkit-mask-image:radial-gradient(ellipse 100% 90% at 50% 0%,black 20%,transparent 80%);mask-image:radial-gradient(ellipse 100% 90% at 50% 0%,black 20%,transparent 80%);}
.hf-noise{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E");}
@keyframes hf-spin{to{--hf-angle:360deg}}
.hf-orbit{position:relative;}
.hf-orbit::before{content:'';position:absolute;inset:0;border-radius:inherit;padding:1px;background:conic-gradient(from var(--hf-angle),transparent 0deg,rgba(0,237,100,.9) 70deg,rgba(34,211,238,.7) 140deg,transparent 210deg);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);mask-composite:exclude;opacity:0;transition:opacity .45s ease;animation:hf-spin 4s linear infinite;pointer-events:none;}
.hf-orbit:hover::before,.hf-orbit-live::before{opacity:1;}
@keyframes hf-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
.hf-rise{animation:hf-rise .7s cubic-bezier(.16,1,.3,1) both;}
@keyframes hf-pop{from{opacity:0;transform:translateY(10px) scale(.985)}to{opacity:1;transform:none}}
.hf-pop{animation:hf-pop .55s cubic-bezier(.16,1,.3,1) both;}
@keyframes hf-fade{from{opacity:0}to{opacity:1}}
.hf-fade{animation:hf-fade .25s ease both;}
.hf-shine{position:relative;overflow:hidden;}
.hf-shine::after{content:'';position:absolute;inset:0;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.35) 50%,transparent 60%);transform:translateX(-130%);transition:transform .7s ease;}
.hf-shine:hover::after{transform:translateX(130%);}
.hf-tile::before,.hf-tile::after{content:'';position:absolute;width:10px;height:10px;border-color:rgba(0,237,100,.7);border-style:solid;opacity:0;transition:opacity .35s,transform .35s;pointer-events:none;}
.hf-tile::before{top:6px;left:6px;border-width:1px 0 0 1px;transform:translate(4px,4px);}
.hf-tile::after{bottom:6px;right:6px;border-width:0 1px 1px 0;transform:translate(-4px,-4px);}
.hf-tile:hover::before,.hf-tile:hover::after{opacity:1;transform:none;}
.hf-input{transition:border-color .25s,box-shadow .25s;}
.hf-input:focus{outline:none;border-color:#00ed64;box-shadow:0 0 0 3px rgba(0,237,100,.12),0 0 20px -6px rgba(0,237,100,.55);}
.hf-glow-green{text-shadow:0 0 16px rgba(0,237,100,.5);}
.hf-glow-cyan{text-shadow:0 0 16px rgba(34,211,238,.5);}
.hf-glow-amber{text-shadow:0 0 16px rgba(245,158,11,.5);}
.hf-glow-rose{text-shadow:0 0 16px rgba(251,113,133,.5);}
.hf-glow-purple{text-shadow:0 0 16px rgba(167,139,250,.5);}
.hf-gradient-text{background:linear-gradient(90deg,#00ed64,#22d3ee);-webkit-background-clip:text;background-clip:text;color:transparent;}
@keyframes hf-slide{to{background-position:-200% 0}}
.hf-headerline{background:linear-gradient(90deg,transparent,rgba(0,237,100,.8),transparent);background-size:200% 100%;animation:hf-slide 5s linear infinite;}
@keyframes hf-blink{0%,49%{opacity:1}50%,100%{opacity:0}}
.hf-caret{animation:hf-blink 1.1s steps(1) infinite;}
@keyframes hf-heart{to{stroke-dashoffset:0}}
.hf-heart{stroke-dasharray:34 166;stroke-dashoffset:200;animation:hf-heart 2.4s linear infinite;}
@keyframes hf-shimmer{to{transform:translateX(100%)}}
@keyframes hf-boot{from{width:0%}to{width:92%}}
.hf-boot-bar{animation:hf-boot 2.6s cubic-bezier(.2,.8,.2,1) forwards;position:relative;overflow:hidden;}
.hf-boot-bar::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.5),transparent);transform:translateX(-100%);animation:hf-shimmer 1.2s ease infinite;}
@keyframes hf-toast{from{opacity:0;transform:translateY(14px) scale(.97)}to{opacity:1;transform:none}}
.hf-toast{animation:hf-toast .35s cubic-bezier(.16,1,.3,1) both;}
.hf-ln{display:inline-block;width:2.2rem;margin-right:1rem;text-align:right;color:#33566b;user-select:none;}
.hf-scroll{scrollbar-width:thin;scrollbar-color:#0f4356 transparent;}
.hf-scroll::-webkit-scrollbar{width:8px;height:8px;}
.hf-scroll::-webkit-scrollbar-track{background:transparent;}
.hf-scroll::-webkit-scrollbar-thumb{background:#0a3b4e;border-radius:9999px;}
.hf-scroll::-webkit-scrollbar-thumb:hover{background:#0f4356;}
.hf-root a:focus-visible,.hf-root button:focus-visible{outline:2px solid rgba(0,237,100,.7);outline-offset:2px;border-radius:4px;}
@media (prefers-reduced-motion:reduce){
  .hf-rise,.hf-pop,.hf-fade,.hf-toast,.hf-caret,.hf-heart,.hf-boot-bar,.hf-boot-bar::after,.hf-headerline,.hf-orbit::before{animation:none !important;}
  .hf-boot-bar{width:92%;}
  .hf-shine::after{display:none;}
}
`;

/* -------------------------------- helpers ---------------------------------- */

const timeAgo = (iso) => {
  if (!iso) return '';
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (Number.isNaN(s)) return '';
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const JSON_RE = /("(?:[^"\\]|\\.)*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;

function tokenizeJSONLine(line) {
  const out = [];
  let last = 0;
  let m;
  JSON_RE.lastIndex = 0;
  while ((m = JSON_RE.exec(line))) {
    if (m.index > last) out.push({ t: line.slice(last, m.index), c: '#64748b' });
    if (m[1] !== undefined) {
      if (m[2] !== undefined) { out.push({ t: m[1], c: '#93c5fd' }); out.push({ t: m[2], c: '#64748b' }); }
      else out.push({ t: m[1], c: '#00ed64' });
    } else if (m[3] !== undefined) out.push({ t: m[0], c: '#c084fc' });
    else out.push({ t: m[0], c: '#f59e0b' });
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push({ t: line.slice(last), c: '#64748b' });
  return out;
}

function useCountUp(target, duration = 900) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      setVal(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

const Spinner = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

const Leaf = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12 2C12 2 8 8 8 13.5C8 17.5 10 20 12 22C14 20 16 17.5 16 13.5C16 8 12 2 12 2Z" />
  </svg>
);

/* ------------------------------- boot screen -------------------------------- */

function BootScreen() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep((s) => Math.min(s + 1, BOOT_LINES.length - 1)), 520);
    return () => clearInterval(t);
  }, []);

  return (
    <div className={`${ui.variable} ${mono.variable} hf-root min-h-screen bg-[#021217] text-[#e2e8f0] flex items-center justify-center relative overflow-hidden`}>
      <style>{CSS}</style>
      <div aria-hidden="true" className="hf-grid absolute inset-0 pointer-events-none" />
      <div aria-hidden="true" className="absolute -top-32 left-1/2 -translate-x-1/2 w-[560px] h-[420px] rounded-full bg-[#00ed64]/[0.06] blur-[120px] pointer-events-none" />
      <div aria-hidden="true" className="hf-noise absolute inset-0 opacity-[0.035] pointer-events-none" />

      <div className="hf-rise relative flex flex-col items-center">
        <div className="hf-orbit hf-orbit-live w-14 h-14 rounded-xl bg-[#001e2b] border border-[#0a3b4e] flex items-center justify-center text-[#00ed64]">
          <Leaf className="w-6 h-6" />
        </div>
        <p className="mt-5 font-bold tracking-[0.35em] text-white text-sm">HOOKFLOW</p>
        <p className="hf-mono hf-gradient-text text-[9px] tracking-[0.4em] uppercase mt-1">Data Explorer</p>

        <div className="mt-8 w-72 space-y-1.5">
          {BOOT_LINES.map((line, i) => (
            <div key={line} className="hf-mono text-[10px] flex items-center gap-2">
              <span className={i < step ? 'text-[#00ed64]' : i === step ? 'text-white' : 'text-[#33566b]'}>
                {i < step ? '✓' : i === step ? '▸' : '·'}
              </span>
              <span className={i < step ? 'text-[#94a3b8]' : i === step ? 'text-white' : 'text-[#33566b]'}>
                {line}
                {i === step && <span className="hf-caret text-[#00ed64]">▍</span>}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 w-72 h-1 rounded-full bg-[#001e2b] border border-[#0a3b4e] overflow-hidden">
          <div className="hf-boot-bar h-full bg-gradient-to-r from-[#00ed64] to-[#22d3ee]" />
        </div>
        <p className="mt-3 hf-mono text-[8px] tracking-[0.35em] uppercase text-[#33566b]">Establishing secure channel</p>
      </div>
    </div>
  );
}

/* --------------------------------- stat tile -------------------------------- */

function StatCard({ label, value, sub, tone, icon, pct, delay }) {
  const n = useCountUp(value);
  return (
    <div
      className="hf-tile hf-pop relative overflow-hidden rounded-xl bg-[#001e2b] border border-[#0a3b4e] p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0f4356]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-[2px] ${tone.bar} opacity-70`} />
      <div className="flex items-start justify-between gap-2">
        <p className="hf-mono text-[9px] tracking-[0.25em] uppercase text-[#64748b]">{label}</p>
        <span className={`w-7 h-7 shrink-0 rounded-md ${tone.soft} border ${tone.border} ${tone.text} flex items-center justify-center`}>
          {icon}
        </span>
      </div>
      <p className={`hf-mono text-3xl sm:text-4xl font-bold mt-2 ${tone.text} ${tone.glow}`}>{n}</p>
      <p className="hf-mono text-[9px] text-[#64748b] mt-1 tracking-wider uppercase">{sub}</p>
      <div className="mt-3 h-0.5 rounded bg-[#021217] overflow-hidden">
        <div className={`h-full ${tone.bar} transition-all duration-1000`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ---------------------------------- page ------------------------------------ */

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('events');

  const [orgForm, setOrgForm] = useState({ name: '', destinationUrl: '' });
  const [creatingOrg, setCreatingOrg] = useState(false);
  const [orgError, setOrgError] = useState('');
  const [copiedKey, setCopiedKey] = useState('');
  const [showSecret, setShowSecret] = useState({});

  const [selectedPayload, setSelectedPayload] = useState(null);
  const [copiedModal, setCopiedModal] = useState(false);

  const [retryingIds, setRetryingIds] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  // Additive UI state
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toast, setToast] = useState(null);
  const [clock, setClock] = useState('');
  const [lastSync, setLastSync] = useState('');
  const copyTimer = useRef(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (!token) {
      router.push('/login');
      return;
    }
    if (storedUser) setUser(JSON.parse(storedUser));
    fetchData(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('en-GB', { hour12: false }));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!selectedPayload) return;
    const onKey = (e) => { if (e.key === 'Escape') setSelectedPayload(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedPayload]);

  const showToast = (msg, tone = 'green') => {
    setToast({ msg, tone, id: Date.now() });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  };

  const fetchData = async (token, isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const [orgsRes, eventsRes] = await Promise.all([
        fetch(`${API_BASE}/api/organizations`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/events/my-events`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (orgsRes.status === 401 || eventsRes.status === 401) {
        localStorage.clear();
        router.push('/login');
        return;
      }

      const orgsData = await orgsRes.json();
      const eventsData = await eventsRes.json();

      setOrganizations(orgsData.organizations || []);
      setEvents(eventsData.events || []);
      setLastSync(new Date().toLocaleTimeString('en-GB', { hour12: false }));
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  };

  const handleCreateOrg = async (e) => {
    e.preventDefault();
    setCreatingOrg(true);
    setOrgError('');
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE}/api/organizations/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(orgForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create organization');

      setOrganizations([data.organization, ...organizations]);
      setOrgForm({ name: '', destinationUrl: '' });
      setActiveTab('organizations');
      showToast('Organization registered — secret key generated', 'green');
    } catch (err) {
      setOrgError(err.message || 'Error creating organization');
    } finally {
      setCreatingOrg(false);
    }
  };

  const handleRetryEvent = async (eventId) => {
    setRetryingIds((prev) => ({ ...prev, [eventId]: true }));
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE}/api/events/${eventId}/retry`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to retry event', 'rose');
        return;
      }
      setEvents((prev) =>
        prev.map((evt) => (evt._id === eventId ? { ...evt, status: 'pending', reason: '', attempts: 0 } : evt))
      );
      showToast('Retry queued — dispatch engine engaged', 'green');
      setTimeout(() => fetchData(token), 1500);
    } catch (err) {
      showToast('Error triggering retry: ' + err.message, 'rose');
    } finally {
      setRetryingIds((prev) => ({ ...prev, [eventId]: false }));
    }
  };

  const toggleSecret = (orgId) => setShowSecret((prev) => ({ ...prev, [orgId]: !prev[orgId] }));

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopiedKey(''), 2000);
  };

  const handleCopyModalPayload = () => {
    if (!selectedPayload) return;
    navigator.clipboard.writeText(JSON.stringify(selectedPayload.payload, null, 2));
    setCopiedModal(true);
    setTimeout(() => setCopiedModal(false), 2000);
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const stats = useMemo(() => {
    const s = { completed: 0, pending: 0, failed: 0, dead: 0 };
    events.forEach((e) => { if (s[e.status] !== undefined) s[e.status] += 1; else s.pending += 1; });
    return { ...s, total: events.length };
  }, [events]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((evt) => {
      if (statusFilter !== 'all' && evt.status !== statusFilter) return false;
      if (!q) return true;
      return [evt._id, evt.status, evt.reason, evt.secretKey, evt.payload?.event, JSON.stringify(evt.payload)]
        .join(' ').toLowerCase().includes(q);
    });
  }, [events, query, statusFilter]);

  const payloadView = useMemo(() => {
    if (!selectedPayload) return null;
    const raw = JSON.stringify(selectedPayload.payload ?? {}, null, 2);
    return { lines: raw.split('\n').map(tokenizeJSONLine), bytes: new TextEncoder().encode(raw).length };
  }, [selectedPayload]);

  if (loading) return <BootScreen />;

  const uid = user?.id || user?._id;
  const deliveryPct = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;
  const share = (n) => (stats.total ? Math.round((n / stats.total) * 100) : 0);

  const kpis = [
    { label: 'Total Events', value: stats.total, sub: 'documents in collection', tone: TONES.cyan, pct: 100,
      icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" /></svg> },
    { label: 'Delivered', value: stats.completed, sub: `${deliveryPct}% delivery rate`, tone: TONES.green, pct: deliveryPct,
      icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { label: 'In Flight', value: stats.pending + stats.failed, sub: 'awaiting dispatch / retry', tone: TONES.amber, pct: share(stats.pending + stats.failed),
      icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
    { label: 'Dead Letter', value: stats.dead, sub: 'manual recovery required', tone: TONES.purple, pct: share(stats.dead),
      icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z" /></svg> },
  ];

  const btnBase = 'hf-mono text-[10px] tracking-wider uppercase px-2.5 py-1.5 rounded-md bg-[#0a2733] hover:bg-[#0e3646] border border-[#0f4356] text-[#94a3b8] hover:text-white transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer';

  return (
    <div className={`${ui.variable} ${mono.variable} hf-root h-screen overflow-hidden bg-[#021217] text-[#e2e8f0] flex flex-col selection:bg-[#00ed64] selection:text-black`}>
      <style>{CSS}</style>

      {/* Atmosphere */}
      <div aria-hidden="true" className="hf-grid fixed inset-0 pointer-events-none" />
      <div aria-hidden="true" className="fixed -top-40 -left-40 w-[560px] h-[560px] rounded-full bg-[#00ed64]/[0.05] blur-[130px] pointer-events-none" />
      <div aria-hidden="true" className="fixed -bottom-52 -right-40 w-[620px] h-[620px] rounded-full bg-[#22d3ee]/[0.05] blur-[130px] pointer-events-none" />
      <div aria-hidden="true" className="hf-noise fixed inset-0 opacity-[0.035] pointer-events-none z-[60]" />

      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* ------------------------------ SIDEBAR ------------------------------ */}
        <aside className="hidden lg:flex w-72 bg-[#001e2b]/90 backdrop-blur border-r border-[#0a3b4e] flex-col justify-between select-none">
          <div className="flex-1 overflow-y-auto hf-scroll">
            {/* Connection header */}
            <div className="p-3.5 border-b border-[#0a3b4e] flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2.5 group">
                <span className="w-7 h-7 rounded-md bg-[#00ed64]/10 border border-[#00ed64]/30 flex items-center justify-center text-[#00ed64]">
                  <Leaf />
                </span>
                <span className="flex flex-col">
                  <span className="font-bold text-[11px] tracking-[0.2em] text-white group-hover:text-[#00ed64] transition-colors">HOOKFLOW</span>
                  <span className="hf-mono hf-gradient-text text-[8px] tracking-[0.35em] uppercase">Data Explorer</span>
                </span>
              </Link>
              <span className="hf-mono text-[8px] tracking-[0.2em] bg-[#00ed64]/10 text-[#00ed64] px-1.5 py-0.5 rounded border border-[#00ed64]/30 flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ed64] opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00ed64]" />
                </span>
                LIVE
              </span>
            </div>

            {/* Tree */}
            <div className="p-3 space-y-1">
              <p className="hf-mono text-[8px] tracking-[0.3em] uppercase text-[#33566b] px-2 py-1">Connection</p>
              <div className="flex items-center gap-1.5 px-2 py-1">
                <svg className="w-3 h-3 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                <span className="hf-mono text-[11px] text-white font-semibold">Cluster0</span>
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00ed64]" />
              </div>
              <div className="flex items-center gap-1.5 ml-4 px-2 py-1">
                <svg className="w-3.5 h-3.5 text-[#22d3ee]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" /><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
                </svg>
                <span className="hf-mono text-[11px] text-[#93c5fd]">hookflow</span>
              </div>

              <div className="ml-[22px] border-l border-[#0a3b4e] pl-2 space-y-0.5 pt-0.5">
                {[
                  { id: 'events',
                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /> },
                  { id: 'organizations',
                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /> },
                ].map((col) => (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => setActiveTab(col.id)}
                    className={`relative w-full flex items-center justify-between px-2.5 py-2 rounded-md hf-mono text-[11px] transition cursor-pointer ${
                      activeTab === col.id
                        ? 'bg-gradient-to-r from-[#00ed64]/15 to-transparent text-[#00ed64] font-semibold'
                        : 'text-[#94a3b8] hover:bg-[#0a2733] hover:text-white'
                    }`}
                  >
                    {activeTab === col.id && (
                      <span aria-hidden="true" className="absolute -left-[9px] top-1 bottom-1 w-[2px] rounded bg-[#00ed64] shadow-[0_0_8px_rgba(0,237,100,0.8)]" />
                    )}
                    <span className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">{col.icon}</svg>
                      {col.id}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Engine footer */}
          <div className="p-3.5 border-t border-[#0a3b4e]">
            <div className="flex items-center gap-2 text-white">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ed64] opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ed64]" />
              </span>
              <span className="font-semibold text-xs">Dispatch Engine</span>
              <span className="ml-auto hf-mono text-[8px] text-[#64748b] border border-[#0a3b4e] rounded px-1.5 py-0.5">v1.0</span>
            </div>
            <svg className="w-full h-6 mt-2" viewBox="0 0 120 24" fill="none" aria-hidden="true">
              <path d="M0 12h20l4-7 5 14 5-11 3 4h20l4-7 5 14 5-11 3 4h20l4-7 5 14 5-11 3 4h9" stroke="#0a3b4e" strokeWidth="1.5" />
              <path className="hf-heart" pathLength={200} d="M0 12h20l4-7 5 14 5-11 3 4h20l4-7 5 14 5-11 3 4h20l4-7 5 14 5-11 3 4h9" stroke="#00ed64" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div className="flex justify-between hf-mono text-[8px] tracking-[0.2em] uppercase text-[#64748b] mt-1">
              <span>Auto-retry</span><span>5s interval</span>
            </div>
          </div>
        </aside>

        {/* ------------------------------ MAIN PANEL ------------------------------ */}
        <div className="flex-1 flex flex-col overflow-y-auto hf-scroll">
          {/* Header */}
          <div className="h-14 bg-[#001e2b]/85 backdrop-blur-md border-b border-[#0a3b4e] px-4 flex items-center justify-between sticky top-0 z-20">
            <span aria-hidden="true" className="hf-headerline absolute bottom-[-1px] left-0 right-0 h-px opacity-50" />
            <div className="flex items-center gap-3 min-w-0">
              <Link href="/" className="lg:hidden w-7 h-7 rounded-md bg-[#00ed64]/10 border border-[#00ed64]/30 flex items-center justify-center text-[#00ed64] shrink-0">
                <Leaf />
              </Link>
              <div className="hf-mono text-[11px] flex items-center gap-1.5 min-w-0">
                <span className="hidden sm:inline text-[#64748b]">Cluster0 <span className="text-[#33566b]">›</span> hookflow <span className="text-[#33566b]">›</span></span>
                <span className="text-[#00ed64] font-semibold hf-glow-green">{activeTab}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="hidden xl:flex items-center gap-1.5 hf-mono text-[10px] text-[#64748b]">
                <span className="w-1 h-1 rounded-full bg-[#00ed64]" />{clock} LOCAL
              </span>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#021217] border border-[#0a3b4e] text-[11px] text-[#94a3b8]">
                <span className="w-5 h-5 rounded-full bg-[#00ed64]/15 border border-[#00ed64]/40 text-[#00ed64] text-[9px] font-bold flex items-center justify-center">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </span>
                <strong className="text-white font-medium truncate max-w-[100px]">{user?.name}</strong>
              </div>
              <button type="button" onClick={() => fetchData(localStorage.getItem('accessToken'), true)} disabled={refreshing} className={btnBase}>
                {refreshing ? <Spinner className="w-3.5 h-3.5 text-[#00ed64]" /> : (
                  <svg className="w-3.5 h-3.5 text-[#00ed64]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
                <span className="hidden sm:inline">{refreshing ? 'Refreshing' : 'Refresh'}</span>
              </button>
              <button type="button" onClick={handleLogout} className={`${btnBase} hover:text-rose-300 hover:border-rose-500/40`}>
                Logout
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-6 max-w-6xl w-full mx-auto">
            {/* Mobile collection switcher */}
            <div className="lg:hidden grid grid-cols-2 gap-1 p-1 rounded-lg bg-[#001e2b] border border-[#0a3b4e]">
              {['events', 'organizations'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`hf-mono text-[10px] uppercase tracking-wider py-2 rounded-md transition cursor-pointer ${
                    activeTab === tab ? 'bg-[#003847] text-[#00ed64] ring-1 ring-[#00ed64]/30' : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  {tab} ({tab === 'events' ? events.length : organizations.length})
                </button>
              ))}
            </div>

            {/* KPI strip (shown only on Events tab) */}
            {activeTab === 'events' && (
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
                {kpis.map((k, i) => <StatCard key={k.label} {...k} delay={i * 80} />)}
              </div>
            )}

            {/* ------------------------------ EVENTS ------------------------------ */}
            {activeTab === 'events' && (
              <section className="hf-rise space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white uppercase tracking-wider">Events</span>
                      <span className="hf-mono text-[9px] bg-[#00ed64]/10 text-[#00ed64] border border-[#00ed64]/30 px-1.5 py-0.5 rounded">{filtered.length} / {events.length}</span>
                    </div>
                    <p className="hf-mono text-[10px] text-[#64748b] mt-1 truncate">{`db.events.find({ user: ObjectId("${uid}") })`}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {lastSync && <span className="hidden md:inline hf-mono text-[9px] tracking-wider text-[#33566b] uppercase">Synced {lastSync}</span>}
                    <div className="relative">
                      <svg className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#475569]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                      </svg>
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Filter documents…"
                        className="hf-input hf-mono text-[11px] pl-8 pr-3 py-2 w-56 bg-[#001e2b] border border-[#0a3b4e] rounded-md text-white placeholder-[#475569]"
                      />
                    </div>
                  </div>
                </div>

                {/* Status filter pills */}
                <div className="flex gap-1.5 flex-wrap">
                  {FILTERS.map((f) => {
                    const active = statusFilter === f;
                    const tone = f === 'all' ? TONES.cyan : STATUS[f];
                    const count = f === 'all' ? events.length : stats[f];
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setStatusFilter(f)}
                        className={`hf-mono text-[9px] tracking-[0.15em] uppercase px-2.5 py-1 rounded-full border transition cursor-pointer ${
                          active ? `${tone.soft} ${tone.text} ${tone.border}` : 'border-[#0a3b4e] text-[#64748b] hover:text-white hover:border-[#0f4356]'
                        }`}
                      >
                        {f} · {count}
                      </button>
                    );
                  })}
                </div>

                {events.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[#0a3b4e] bg-[#001e2b]/50 p-12 text-center">
                    <p className="hf-mono text-4xl text-[#00ed64]/30 hf-glow-green">{'{ }'}</p>
                    <p className="text-sm text-white font-semibold mt-4">No documents in events collection</p>
                    <p className="hf-mono text-[10px] text-[#64748b] mt-2">Post data to your ingestion API to see events stream in.</p>
                    <span className="inline-block mt-4 hf-mono text-[10px] text-[#00ed64] bg-[#00ed64]/10 border border-[#00ed64]/30 rounded px-2.5 py-1">POST /api/events/ingest</span>
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[#0a3b4e] bg-[#001e2b]/50 p-10 text-center">
                    <p className="hf-mono text-xs text-[#64748b]">No documents match the current filter.</p>
                    <button type="button" onClick={() => { setQuery(''); setStatusFilter('all'); }} className={`${btnBase} mx-auto mt-4`}>Reset filter</button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filtered.map((evt, i) => {
                      const tone = STATUS[evt.status] || TONES.amber;
                      return (
                        <div
                          key={evt._id}
                          className="hf-pop relative overflow-hidden rounded-xl bg-[#001e2b] border border-[#0a3b4e] p-4 hf-mono text-[11px] transition-all duration-300 hover:border-[#00ed64]/40 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-12px_rgba(0,237,100,0.15)]"
                          style={{ animationDelay: `${Math.min(i * 45, 360)}ms` }}
                        >
                          <span aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-[2px] opacity-80" style={{ backgroundColor: tone.hex }} />

                          {/* Document header */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#0a3b4e] mb-3">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-[#64748b]">_id:</span>
                              <span className="text-[#ff7961] font-semibold truncate">{`ObjectId('${evt._id}')`}</span>
                              <button
                                type="button"
                                onClick={() => handleCopy(evt._id, `id-${evt._id}`)}
                                className="text-[9px] text-[#64748b] hover:text-white transition cursor-pointer shrink-0"
                                title="Copy _id"
                              >
                                {copiedKey === `id-${evt._id}` ? '✓' : '⧉'}
                              </button>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${tone.soft} ${tone.text} border ${tone.border}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${tone.bar} ${evt.status === 'pending' ? 'animate-pulse' : ''}`} />
                                {evt.status}
                              </span>

                              <button
                                type="button"
                                onClick={() => setSelectedPayload(evt)}
                                className="px-2.5 py-1 rounded-md bg-[#021217] border border-[#0a3b4e] hover:border-[#00ed64]/60 text-[#93c5fd] hover:text-white text-[10px] transition cursor-pointer"
                              >
                                {'View Payload {…}'}
                              </button>

                              {evt.status === 'dead' && (
                                <button
                                  type="button"
                                  onClick={() => handleRetryEvent(evt._id)}
                                  disabled={retryingIds[evt._id]}
                                  className="px-2.5 py-1 rounded-md bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 text-[10px] transition cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
                                >
                                  {retryingIds[evt._id] ? <Spinner className="w-3 h-3" /> : <span>↻</span>}
                                  {retryingIds[evt._id] ? 'Retrying' : 'Retry Dispatch'}
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Document fields */}
                          <div className="space-y-1 leading-relaxed">
                            <div><span className="text-[#64748b]">user: </span><span className="text-[#ff7961]">{`ObjectId('${evt.user}')`}</span></div>
                            <div className="truncate"><span className="text-[#64748b]">secretKey: </span><span className="text-[#00ed64]">{`"${evt.secretKey}"`}</span></div>
                            {evt.payload?.event && (
                              <div><span className="text-[#64748b]">event: </span><span className="text-[#22d3ee]">{`"${evt.payload.event}"`}</span></div>
                            )}
                            <div className="flex items-center">
                              <span className="text-[#64748b]">attempts: </span>
                              <span className="text-[#f59e0b]">{evt.attempts}</span>
                              <span className="inline-flex gap-0.5 ml-2" title={`${evt.attempts} attempts`}>
                                {Array.from({ length: 5 }).map((_, t) => (
                                  <span key={t} className={`w-1 h-2.5 rounded-sm ${t < Math.min(evt.attempts, 5) ? 'bg-[#f59e0b]' : 'bg-[#0a3b4e]'}`} />
                                ))}
                              </span>
                            </div>
                            {evt.reason && (
                              <div><span className="text-[#64748b]">reason: </span><span className="text-rose-400">{`"${evt.reason}"`}</span></div>
                            )}
                            <div>
                              <span className="text-[#64748b]">createdAt: </span>
                              <span className="text-[#94a3b8]">{new Date(evt.createdAt).toISOString()}</span>
                              <span className="text-[#33566b]"> · {timeAgo(evt.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            {/* --------------------------- ORGANIZATIONS --------------------------- */}
            {activeTab === 'organizations' && (
              <section className="hf-rise space-y-6">
                {/* Register card */}
                <div className="hf-orbit rounded-xl">
                  <div className="relative overflow-hidden rounded-xl bg-[#001e2b] border border-[#0a3b4e] p-5">
                    <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#00ed64] to-[#22d3ee] opacity-70" />
                    <div aria-hidden="true" className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#00ed64]/5 blur-2xl pointer-events-none" />

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-md bg-[#00ed64]/10 border border-[#00ed64]/30 text-[#00ed64] flex items-center justify-center text-sm font-bold">+</span>
                        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Register New Organization</h2>
                      </div>
                      <span className="hidden sm:inline hf-mono text-[9px] tracking-[0.2em] uppercase text-[#64748b]">Auto-generates secret-x-key</span>
                    </div>

                    {orgError && (
                      <div className="mb-4 p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-md text-rose-400 text-[11px] hf-mono flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z" /></svg>
                        {orgError}
                      </div>
                    )}

                    <form onSubmit={handleCreateOrg} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block hf-mono text-[9px] tracking-[0.2em] uppercase text-[#94a3b8] mb-1.5">Organization Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Acme Payments"
                          value={orgForm.name}
                          onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                          required
                          className="hf-input w-full px-3 py-2.5 bg-[#021217] border border-[#0a3b4e] rounded-md text-white text-[11px] hf-mono placeholder-[#475569]"
                        />
                      </div>
                      <div>
                        <label className="block hf-mono text-[9px] tracking-[0.2em] uppercase text-[#94a3b8] mb-1.5">Target Destination API URL</label>
                        <input
                          type="url"
                          placeholder="http://localhost:4000/receive-event"
                          value={orgForm.destinationUrl}
                          onChange={(e) => setOrgForm({ ...orgForm, destinationUrl: e.target.value })}
                          className="hf-input w-full px-3 py-2.5 bg-[#021217] border border-[#0a3b4e] rounded-md text-white text-[11px] hf-mono placeholder-[#475569]"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="submit"
                          disabled={creatingOrg}
                          className="hf-shine w-full py-2.5 px-4 rounded-md bg-[#00ed64] hover:bg-[#00c955] text-black font-bold text-[11px] tracking-[0.15em] uppercase transition disabled:opacity-60 shadow-[0_8px_24px_-8px_rgba(0,237,100,0.6)] cursor-pointer flex items-center justify-center gap-2"
                        >
                          {creatingOrg && <Spinner className="w-3.5 h-3.5" />}
                          {creatingOrg ? 'Generating' : '+ Add Organization'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white uppercase tracking-wider">Registered Organizations</span>
                    <span className="hf-mono text-[9px] bg-[#00ed64]/10 text-[#00ed64] border border-[#00ed64]/30 px-1.5 py-0.5 rounded">{organizations.length}</span>
                  </div>
                  <span className="hidden sm:inline hf-mono text-[9px] tracking-[0.2em] uppercase text-[#33566b]">secret-x-key · per-org isolation</span>
                </div>

                {organizations.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[#0a3b4e] bg-[#001e2b]/50 p-12 text-center">
                    <p className="hf-mono text-4xl text-[#00ed64]/30 hf-glow-green">{'{ }'}</p>
                    <p className="text-sm text-white font-semibold mt-4">No organizations created</p>
                    <p className="hf-mono text-[10px] text-[#64748b] mt-2">Register one above to receive your secret-x-key.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {organizations.map((org, i) => {
                      const orgId = org._id || org.id;
                      const isVisible = showSecret[orgId];
                      const routed = events.filter((e) => e.secretKey === org.secretKey).length;

                      return (
                        <div key={orgId} className="hf-orbit hf-pop rounded-xl" style={{ animationDelay: `${Math.min(i * 60, 300)}ms` }}>
                          <div className="relative overflow-hidden rounded-xl bg-[#001e2b] border border-[#0a3b4e] p-4 hf-mono text-[11px] space-y-3">
                            <div className="flex items-center justify-between pb-2.5 border-b border-[#0a3b4e]">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="w-6 h-6 rounded-md bg-[#22d3ee]/10 border border-[#22d3ee]/30 text-[#22d3ee] text-[10px] font-bold flex items-center justify-center shrink-0">
                                  {org.name?.[0]?.toUpperCase() || 'O'}
                                </span>
                                <h3 className="font-bold text-white text-sm truncate" style={{ fontFamily: 'var(--font-ui)' }}>{org.name}</h3>
                              </div>
                              <span className="inline-flex items-center gap-1.5 text-[8px] tracking-[0.2em] bg-[#00ed64]/10 text-[#00ed64] px-1.5 py-0.5 rounded border border-[#00ed64]/30 shrink-0">
                                <span className="relative flex h-1 w-1">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ed64] opacity-75" />
                                  <span className="relative inline-flex rounded-full h-1 w-1 bg-[#00ed64]" />
                                </span>
                                ACTIVE
                              </span>
                            </div>

                            {/* Secret key */}
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-[9px] tracking-[0.15em] uppercase text-[#94a3b8]">
                                <span>secret-x-key:</span>
                                <button type="button" onClick={() => toggleSecret(orgId)} className="text-[#93c5fd] hover:text-white hover:underline cursor-pointer transition normal-case tracking-normal text-[10px]">
                                  {isVisible ? 'Hide' : 'Show'}
                                </button>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type={isVisible ? 'text' : 'password'}
                                  readOnly
                                  value={org.secretKey}
                                  className="hf-input w-full bg-[#021217] border border-[#0a3b4e] px-2.5 py-2 rounded-md text-[#00ed64] text-[10.5px] tracking-wider"
                                />
                                <button type="button" onClick={() => handleCopy(org.secretKey, `sec-${orgId}`)} className={`${btnBase} whitespace-nowrap min-w-[72px] justify-center ${copiedKey === `sec-${orgId}` ? 'text-[#00ed64]' : ''}`}>
                                  {copiedKey === `sec-${orgId}` ? '✓ Copied' : 'Copy'}
                                </button>
                              </div>
                            </div>

                            {/* Ingest endpoint */}
                            <div className="space-y-1.5">
                              <span className="block text-[9px] tracking-[0.15em] uppercase text-[#94a3b8]">Ingestion API:</span>
                              <div className="flex items-center gap-2">
                                <input type="text" readOnly value={INGEST_URL} className="hf-input w-full bg-[#021217] border border-[#0a3b4e] px-2.5 py-2 rounded-md text-[#93c5fd] text-[10.5px]" />
                                <button type="button" onClick={() => handleCopy(INGEST_URL, `url-${orgId}`)} className={`${btnBase} whitespace-nowrap min-w-[72px] justify-center ${copiedKey === `url-${orgId}` ? 'text-[#00ed64]' : ''}`}>
                                  {copiedKey === `url-${orgId}` ? '✓ Copied' : 'Copy'}
                                </button>
                              </div>
                            </div>

                            <div className="pt-2.5 border-t border-[#0a3b4e] flex items-center justify-between gap-2 text-[9.5px]">
                              <span className="text-[#94a3b8] truncate">
                                FORWARDING → <span className="text-white">{org.destinationUrl || 'Not configured'}</span>
                              </span>
                              <span className="shrink-0 text-[#00ed64] bg-[#00ed64]/10 border border-[#00ed64]/30 rounded px-1.5 py-0.5">{routed} routed</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------- PAYLOAD MODAL ------------------------------- */}
      {selectedPayload && payloadView && (
        <div
          className="hf-fade fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setSelectedPayload(null); }}
        >
          <div className="hf-pop hf-orbit hf-orbit-live relative w-full max-w-2xl max-h-[85vh] rounded-xl bg-[#001e2b] border border-[#0a3b4e] shadow-[0_40px_120px_-20px_rgba(0,237,100,0.2)] overflow-hidden flex flex-col">
            <div className="px-5 py-3 border-b border-[#0a3b4e] flex items-center justify-between gap-3 bg-[#021217]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-6 h-6 rounded-md bg-[#00ed64]/10 border border-[#00ed64]/30 text-[#00ed64] flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6M9 8h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" /></svg>
                </span>
                <span className="text-xs text-white font-bold shrink-0">Document Payload</span>
                <span className="hidden sm:inline hf-mono text-[9px] text-[#64748b] truncate">{`_id: ${selectedPayload._id}`}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button type="button" onClick={handleCopyModalPayload} className={`${btnBase} text-[#00ed64]`}>
                  {copiedModal ? '✓ Copied' : '⧉ Copy JSON'}
                </button>
                <button type="button" onClick={() => setSelectedPayload(null)} className="w-7 h-7 rounded-md bg-[#0a2733] border border-[#0f4356] text-[#94a3b8] hover:text-white hover:border-rose-500/50 flex items-center justify-center cursor-pointer text-xs transition" aria-label="Close">
                  ✕
                </button>
              </div>
            </div>

            <div className="p-5 overflow-y-auto hf-scroll flex-1 bg-[#021217] hf-mono text-[11.5px] leading-[1.8]">
              {payloadView.lines.map((tokens, i) => (
                <div key={i}>
                  <span className="hf-ln">{i + 1}</span>
                  <span className="whitespace-pre-wrap break-all align-top">
                    {tokens.length === 0 ? '\u00A0' : tokens.map((tok, j) => <span key={j} style={{ color: tok.c }}>{tok.t}</span>)}
                    {i === payloadView.lines.length - 1 && <span className="hf-caret text-[#00ed64]">▍</span>}
                  </span>
                </div>
              ))}
            </div>

            <div className="px-5 py-2.5 border-t border-[#0a3b4e] flex justify-between items-center bg-[#021217]">
              <span className="hf-mono text-[9px] tracking-[0.2em] uppercase text-[#33566b]">
                UTF-8 · JSON · {payloadView.bytes} B · {payloadView.lines.length} lines
              </span>
              <button type="button" onClick={() => setSelectedPayload(null)} className={btnBase}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------- TOAST ---------------------------------- */}
      {toast && (
        <div key={toast.id} className={`hf-toast fixed bottom-5 right-5 z-[80] flex items-center gap-3 bg-[#001e2b] border ${TONES[toast.tone].border} rounded-lg px-4 py-3 shadow-2xl max-w-sm`}>
          <span className={`w-2 h-2 rounded-full shrink-0 ${TONES[toast.tone].bar}`} />
          <p className="hf-mono text-[11px] text-white">{toast.msg}</p>
          <button type="button" onClick={() => setToast(null)} className="text-[#64748b] hover:text-white text-xs cursor-pointer shrink-0" aria-label="Dismiss">✕</button>
        </div>
      )}
    </div>
  );
}
