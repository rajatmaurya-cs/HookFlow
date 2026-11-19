'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Tab: "events" | "organizations"
  const [activeTab, setActiveTab] = useState('events');

  const [orgForm, setOrgForm] = useState({ name: '', destinationUrl: '' });
  const [creatingOrg, setCreatingOrg] = useState(false);
  const [orgError, setOrgError] = useState('');
  const [copiedKey, setCopiedKey] = useState('');
  const [showSecret, setShowSecret] = useState({});

  // Payload modal state
  const [selectedPayload, setSelectedPayload] = useState(null);
  const [copiedModal, setCopiedModal] = useState(false);

  // Retrying state
  const [retryingIds, setRetryingIds] = useState({});

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (!token) {
      router.push('/login');
      return;
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    fetchData(token);
  }, []);

  const fetchData = async (token, isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const [orgsRes, eventsRes] = await Promise.all([
        fetch('http://localhost:2000/api/organizations', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('http://localhost:2000/api/events/my-events', {
          headers: { Authorization: `Bearer ${token}` },
        }),
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
      const res = await fetch('http://localhost:2000/api/organizations/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orgForm),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create organization');
      }

      setOrganizations([data.organization, ...organizations]);
      setOrgForm({ name: '', destinationUrl: '' });
      setActiveTab('organizations');
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
      const res = await fetch(`http://localhost:2000/api/events/${eventId}/retry`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to retry event');
        return;
      }

      setEvents((prev) =>
        prev.map((evt) => (evt._id === eventId ? { ...evt, status: 'pending', reason: '', attempts: 0 } : evt))
      );

      setTimeout(() => {
        fetchData(token);
      }, 1500);
    } catch (err) {
      alert('Error triggering retry: ' + err.message);
    } finally {
      setRetryingIds((prev) => ({ ...prev, [eventId]: false }));
    }
  };

  const toggleSecret = (orgId) => {
    setShowSecret((prev) => ({
      ...prev,
      [orgId]: !prev[orgId],
    }));
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(''), 2000);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#021217] flex items-center justify-center text-[#94a3b8] font-mono text-sm">
        <span className="inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00ed64] animate-pulse"></span>
          Connecting to HookFlow Data Explorer...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#021217] text-[#e2e8f0] font-sans flex flex-col selection:bg-[#00ed64] selection:text-black">
      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Tree Explorer Sidebar */}
        <aside className="w-64 bg-[#001e2b] border-r border-[#0a3b4e] flex flex-col justify-between select-none">
          <div>
            <div className="p-3 border-b border-[#0a3b4e] flex items-center justify-between text-xs text-[#94a3b8]">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-5 h-5 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#00ed64]" fill="currentColor">
                    <path d="M12 2C12 2 8 8 8 13.5C8 17.5 10 20 12 22C14 20 16 17.5 16 13.5C16 8 12 2 12 2Z" />
                  </svg>
                </div>
                <span className="font-bold text-white tracking-wider uppercase text-[11px] group-hover:text-[#00ed64] transition-colors">
                  DATA EXPLORER
                </span>
              </Link>
              <span className="text-[10px] bg-[#00ed64]/10 text-[#00ed64] px-1.5 py-0.5 rounded border border-[#00ed64]/30 font-mono">
                LIVE
              </span>
            </div>

            <div className="p-2 space-y-1">
              <div className="text-[11px] font-semibold text-[#64748b] px-2 py-1 tracking-wider uppercase">
                COLLECTIONS
              </div>

              <button
                onClick={() => setActiveTab('events')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition cursor-pointer font-medium ${
                  activeTab === 'events'
                    ? 'bg-[#003847] text-[#00ed64] border-l-2 border-[#00ed64]'
                    : 'text-[#94a3b8] hover:bg-[#0a2733] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  <span>events</span>
                </div>
                <span className="text-[10px] font-mono bg-[#021217] px-1.5 py-0.5 rounded text-[#94a3b8]">
                  {events.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('organizations')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition cursor-pointer font-medium ${
                  activeTab === 'organizations'
                    ? 'bg-[#003847] text-[#00ed64] border-l-2 border-[#00ed64]'
                    : 'text-[#94a3b8] hover:bg-[#0a2733] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>organizations</span>
                </div>
                <span className="text-[10px] font-mono bg-[#021217] px-1.5 py-0.5 rounded text-[#94a3b8]">
                  {organizations.length}
                </span>
              </button>
            </div>
          </div>

          {/* Sidebar System Status Footer */}
          <div className="p-3 border-t border-[#0a3b4e] text-[11px] text-[#64748b]">
            <div className="flex items-center gap-2 text-white mb-1">
              <span className="w-2 h-2 rounded-full bg-[#00ed64]"></span>
              <span className="font-semibold text-xs">Dispatch Engine</span>
            </div>
            <p className="text-[10px] text-[#94a3b8]">Auto-retry: 5s interval</p>
          </div>
        </aside>

        {/* Right Content Panel */}
        <div className="flex-1 flex flex-col bg-[#021217] overflow-y-auto">
          {/* Unified Breadcrumb Header Bar */}
          <div className="h-12 bg-[#001e2b] border-b border-[#0a3b4e] px-4 flex items-center justify-between text-xs sticky top-0 z-20">
            <div className="flex items-center gap-2">
              <span className="text-[#64748b]">Cluster0 &gt; HookFlow &gt;</span>
              <span className="font-mono text-[#00ed64] font-semibold">{activeTab}</span>
            </div>

            <div className="flex items-center gap-3">
              {/* User Pill */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#021217] border border-[#0a3b4e] text-xs text-[#94a3b8]">
                <span className="w-2 h-2 rounded-full bg-[#00ed64]"></span>
                <span>User:</span>
                <strong className="text-white font-medium">{user?.name}</strong>
              </div>

              {/* Refresh Button with Spinner & Loading State */}
              <button
                onClick={() => fetchData(localStorage.getItem('accessToken'), true)}
                disabled={refreshing}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0a2733] hover:bg-[#0e3646] text-[#94a3b8] hover:text-white border border-[#0f4356] transition cursor-pointer text-xs disabled:opacity-50"
              >
                <svg
                  className={`w-3.5 h-3.5 text-[#00ed64] ${refreshing ? 'animate-spin' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="text-xs px-3 py-1 bg-[#0a2733] hover:bg-[#0e3646] text-[#94a3b8] hover:text-white rounded border border-[#0f4356] transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6 max-w-6xl w-full mx-auto">
            {/* TAB 1: EVENTS VIEW (Document Explorer Format) */}
            {activeTab === 'events' && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Events ({events.length})
                    </span>
                    <span className="text-[11px] text-[#64748b] font-mono">
                      Query: &#123; user: &quot;{user?.id || user?._id}&quot; &#125;
                    </span>
                  </div>
                </div>

                {events.length === 0 ? (
                  <div className="bg-[#001e2b] border border-[#0a3b4e] rounded-lg p-12 text-center text-[#64748b] font-mono text-xs">
                    No Events found in events collection. Post data to your Ingestion API.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {events.map((evt) => (
                      <div
                        key={evt._id}
                        className="bg-[#001e2b] border border-[#0a3b4e] rounded-lg p-4 font-mono text-xs hover:border-[#00ed64]/40 transition-colors"
                      >
                        {/* Document Top Bar */}
                        <div className="flex items-center justify-between pb-3 border-b border-[#0a3b4e] mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[#64748b]">_id:</span>
                            <span className="text-[#ff7961] font-semibold">ObjectId(&apos;{evt._id}&apos;)</span>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Status Badge */}
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                                evt.status === 'completed'
                                  ? 'bg-[#00ed64]/10 text-[#00ed64] border border-[#00ed64]/30'
                                  : evt.status === 'dead'
                                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                                  : evt.status === 'failed'
                                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              }`}
                            >
                              {evt.status}
                            </span>

                            {/* View Payload Button */}
                            <button
                              onClick={() => setSelectedPayload(evt)}
                              className="px-2.5 py-1 bg-[#021217] hover:bg-[#003847] text-[#93c5fd] border border-[#0a3b4e] hover:border-[#00ed64] rounded transition cursor-pointer text-[11px]"
                            >
                              View Payload &#123;...&#125;
                            </button>

                            {/* Retry Button if Dead */}
                            {evt.status === 'dead' && (
                              <button
                                onClick={() => handleRetryEvent(evt._id)}
                                disabled={retryingIds[evt._id]}
                                className="px-2.5 py-1 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 rounded transition cursor-pointer text-[11px] flex items-center gap-1"
                              >
                                {retryingIds[evt._id] ? 'Retrying...' : '↻ Retry Dispatch'}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Document JSON Fields (MongoDB Explorer Replica) */}
                        <div className="space-y-1 text-[11px] leading-relaxed">
                          <div>
                            <span className="text-[#64748b]">user: </span>
                            <span className="text-[#ff7961]">ObjectId(&apos;{evt.user}&apos;)</span>
                          </div>
                          <div>
                            <span className="text-[#64748b]">secretKey: </span>
                            <span className="text-[#00ed64]">&quot;{evt.secretKey}&quot;</span>
                          </div>
                          <div>
                            <span className="text-[#64748b]">attempts: </span>
                            <span className="text-[#f59e0b]">{evt.attempts}</span>
                          </div>
                          {evt.reason && (
                            <div>
                              <span className="text-[#64748b]">reason: </span>
                              <span className="text-rose-400">&quot;{evt.reason}&quot;</span>
                            </div>
                          )}
                          <div>
                            <span className="text-[#64748b]">createdAt: </span>
                            <span className="text-[#94a3b8]">{new Date(evt.createdAt).toISOString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* TAB 2: ORGANIZATIONS VIEW */}
            {activeTab === 'organizations' && (
              <section className="space-y-6">
                {/* Register Organization Card */}
                <div className="bg-[#001e2b] border border-[#0a3b4e] rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#00ed64]"></span>
                      <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                        Register New Organization
                      </h2>
                    </div>
                    <span className="text-[11px] font-mono text-[#94a3b8]">
                      Auto generates secret-x-key
                    </span>
                  </div>

                  {orgError && (
                    <div className="mb-4 p-2.5 bg-rose-500/10 border border-rose-500/30 rounded text-rose-400 text-xs font-mono">
                      {orgError}
                    </div>
                  )}

                  <form onSubmit={handleCreateOrg} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-[#94a3b8] mb-1">
                        Organization Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Acme Payments"
                        value={orgForm.name}
                        onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                        required
                        className="w-full px-3 py-2 bg-[#021217] border border-[#0a3b4e] rounded text-white text-xs font-mono placeholder-[#475569] focus:outline-none focus:border-[#00ed64]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-[#94a3b8] mb-1">
                        Target Destination API URL
                      </label>
                      <input
                        type="url"
                        placeholder="http://localhost:4000/receive-event"
                        value={orgForm.destinationUrl}
                        onChange={(e) => setOrgForm({ ...orgForm, destinationUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-[#021217] border border-[#0a3b4e] rounded text-white text-xs font-mono placeholder-[#475569] focus:outline-none focus:border-[#00ed64]"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        type="submit"
                        disabled={creatingOrg}
                        className="w-full py-2 px-4 bg-[#00ed64] hover:bg-[#00c955] text-black font-semibold rounded text-xs transition cursor-pointer disabled:opacity-50 tracking-wide"
                      >
                        {creatingOrg ? 'Generating...' : '+ Add Organization'}
                      </button>
                    </div>
                  </form>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Registered Organizations ({organizations.length})
                  </span>
                </div>

                {organizations.length === 0 ? (
                  <div className="bg-[#001e2b] border border-[#0a3b4e] rounded-lg p-12 text-center text-[#64748b] font-mono text-xs">
                    No organizations created. Register one above to receive your secret-x-key.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {organizations.map((org) => {
                      const orgId = org._id || org.id;
                      const isVisible = showSecret[orgId];

                      return (
                        <div
                          key={orgId}
                          className="bg-[#001e2b] border border-[#0a3b4e] rounded-lg p-4 font-mono text-xs space-y-3"
                        >
                          <div className="flex items-center justify-between pb-2 border-b border-[#0a3b4e]">
                            <h3 className="font-bold text-white text-sm">{org.name}</h3>
                            <span className="text-[10px] bg-[#00ed64]/10 text-[#00ed64] px-1.5 py-0.5 rounded border border-[#00ed64]/30">
                              ACTIVE
                            </span>
                          </div>

                          {/* Secret Key Row */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px] text-[#94a3b8]">
                              <span>secret-x-key:</span>
                              <button
                                onClick={() => toggleSecret(orgId)}
                                className="text-[#93c5fd] hover:underline cursor-pointer"
                              >
                                {isVisible ? 'Hide' : 'Show'}
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type={isVisible ? 'text' : 'password'}
                                readOnly
                                value={org.secretKey}
                                className="w-full bg-[#021217] border border-[#0a3b4e] px-2.5 py-1.5 rounded text-[#00ed64] text-[11px]"
                              />
                              <button
                                onClick={() => handleCopy(org.secretKey, `sec-${orgId}`)}
                                className="px-2.5 py-1.5 bg-[#0a2733] hover:bg-[#0e3646] text-white border border-[#0f4356] rounded text-[11px] cursor-pointer whitespace-nowrap"
                              >
                                {copiedKey === `sec-${orgId}` ? '✓ Copied' : 'Copy'}
                              </button>
                            </div>
                          </div>

                          {/* Ingest Endpoint */}
                          <div className="space-y-1">
                            <span className="text-[11px] text-[#94a3b8]">Ingestion API:</span>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                readOnly
                                value="http://localhost:2000/api/events/ingest"
                                className="w-full bg-[#021217] border border-[#0a3b4e] px-2.5 py-1.5 rounded text-[#93c5fd] text-[11px]"
                              />
                              <button
                                onClick={() => handleCopy('http://localhost:2000/api/events/ingest', `url-${orgId}`)}
                                className="px-2.5 py-1.5 bg-[#0a2733] hover:bg-[#0e3646] text-white border border-[#0f4356] rounded text-[11px] cursor-pointer whitespace-nowrap"
                              >
                                {copiedKey === `url-${orgId}` ? '✓ Copied' : 'Copy'}
                              </button>
                            </div>
                          </div>

                          <div className="text-[11px] text-[#94a3b8] pt-1 border-t border-[#0a3b4e]">
                            Forwarding Destination:{' '}
                            <span className="text-white">
                              {org.destinationUrl || 'Not configured'}
                            </span>
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

      {/* Structured Payload Modal (MongoDB JSON Document Style) */}
      {selectedPayload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs font-mono">
          <div className="relative w-full max-w-2xl bg-[#001e2b] border border-[#0a3b4e] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-5 py-3 border-b border-[#0a3b4e] flex items-center justify-between bg-[#021217]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00ed64]"></span>
                <span className="text-xs text-white font-bold">Document Payload</span>
                <span className="text-[11px] text-[#64748b]">_id: {selectedPayload._id}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyModalPayload}
                  className="text-xs px-2.5 py-1 bg-[#0a2733] hover:bg-[#0e3646] text-[#00ed64] rounded border border-[#0f4356] cursor-pointer"
                >
                  {copiedModal ? '✓ Copied' : 'Copy JSON'}
                </button>
                <button
                  onClick={() => setSelectedPayload(null)}
                  className="w-6 h-6 rounded bg-[#0a2733] text-[#94a3b8] hover:text-white flex items-center justify-center cursor-pointer text-xs"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-5 overflow-y-auto flex-1 bg-[#021217] text-xs">
              <pre className="text-[#00ed64] leading-relaxed whitespace-pre-wrap select-all">
                {JSON.stringify(selectedPayload.payload, null, 2)}
              </pre>
            </div>

            <div className="px-5 py-2.5 border-t border-[#0a3b4e] flex justify-end bg-[#021217]">
              <button
                onClick={() => setSelectedPayload(null)}
                className="px-3 py-1 bg-[#0a2733] hover:bg-[#0e3646] text-white text-xs rounded border border-[#0f4356] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
