'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const fetchData = async (token) => {
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-lg">
            H
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            HookFlow
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400">
            Welcome, <strong className="text-white">{user?.name}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        {/* Create Organization Section */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-semibold text-white mb-1">Create Organization</h2>
          <p className="text-sm text-slate-400 mb-5">
            Register your organization to generate your secret key and set your target destination webhook API.
          </p>

          {orgError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {orgError}
            </div>
          )}

          <form onSubmit={handleCreateOrg} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Organization Name</label>
              <input
                type="text"
                placeholder="e.g. Acme Corp"
                value={orgForm.name}
                onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Target Destination API URL</label>
              <input
                type="url"
                placeholder="https://api.yourdomain.com/webhooks/receive"
                value={orgForm.destinationUrl}
                onChange={(e) => setOrgForm({ ...orgForm, destinationUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={creatingOrg}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-xl text-sm transition shadow-lg shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
              >
                {creatingOrg ? 'Generating Key...' : 'Register Organization'}
              </button>
            </div>
          </form>
        </section>

        {/* Organizations Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">Your Organizations</h2>

          {organizations.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-sm">
              No organizations created yet. Register one above to get your secret key!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {organizations.map((org) => {
                const orgId = org._id || org.id;
                const isVisible = showSecret[orgId];

                return (
                  <div key={orgId} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg text-white">{org.name}</h3>
                      <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-mono">
                        Active
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-slate-400">
                          Secret Key (Header: secret-x-key)
                        </label>
                        <button
                          onClick={() => toggleSecret(orgId)}
                          className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer underline"
                        >
                          {isVisible ? 'Hide Secret' : 'Show Secret'}
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type={isVisible ? 'text' : 'password'}
                          readOnly
                          value={org.secretKey}
                          className="w-full font-mono text-xs px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-300"
                        />
                        <button
                          onClick={() => handleCopy(org.secretKey, `sec-${orgId}`)}
                          className="text-xs px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 whitespace-nowrap cursor-pointer"
                        >
                          {copiedKey === `sec-${orgId}` ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400">Ingestion API URL</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value="http://localhost:2000/api/events/ingest"
                          className="w-full font-mono text-xs px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-blue-400"
                        />
                        <button
                          onClick={() => handleCopy('http://localhost:2000/api/events/ingest', `url-${orgId}`)}
                          className="text-xs px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 whitespace-nowrap cursor-pointer"
                        >
                          {copiedKey === `url-${orgId}` ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    <div className="text-xs text-slate-400 pt-2 border-t border-slate-800">
                      Destination Forwarding URL:{' '}
                      <span className="text-slate-200 font-mono">
                        {org.destinationUrl || 'Not configured'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Webhook Activity Table */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Webhook Activity & Dispatches</h2>
              <p className="text-xs text-slate-400">Recent events ingested and forwarded by the scanner</p>
            </div>
            <button
              onClick={() => fetchData(localStorage.getItem('accessToken'))}
              className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 cursor-pointer"
            >
              Refresh Logs
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/50 text-slate-400 text-xs uppercase border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Event ID</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Attempts</th>
                  <th className="py-3 px-4 text-center">Payload</th>
                  <th className="py-3 px-4">Reason / Error</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 text-sm">
                      No events received yet. Send a POST request to your Ingestion API!
                    </td>
                  </tr>
                ) : (
                  events.map((evt) => (
                    <tr key={evt._id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-4 font-mono text-xs text-slate-400">{evt._id}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            evt.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : evt.status === 'dead'
                              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                              : evt.status === 'failed'
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {evt.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs font-mono">{evt.attempts}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setSelectedPayload(evt)}
                          title="View formatted payload"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-blue-600/15 text-blue-400 border border-blue-500/30 hover:bg-blue-600/25 transition cursor-pointer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          View
                        </button>
                      </td>
                      <td className="py-3 px-4 text-xs text-red-400 max-w-xs truncate">
                        {evt.reason || '—'}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
                        {new Date(evt.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {evt.status === 'failed' || evt.status === 'dead' ? (
                          <button
                            onClick={() => handleRetryEvent(evt._id)}
                            disabled={retryingIds[evt._id]}
                            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25 transition cursor-pointer disabled:opacity-50"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className={`w-3.5 h-3.5 ${retryingIds[evt._id] ? 'animate-spin' : ''}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                            {retryingIds[evt._id] ? 'Retrying...' : 'Retry'}
                          </button>
                        ) : (
                          <span className="text-xs text-slate-600">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Structured Payload Modal Popup */}
      {selectedPayload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Event Payload</h3>
                  <p className="text-xs font-mono text-slate-400">
                    ID: {selectedPayload._id}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyModalPayload}
                  className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
                >
                  {copiedModal ? '✓ Copied' : 'Copy JSON'}
                </button>
                <button
                  onClick={() => setSelectedPayload(null)}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Metadata strip */}
            <div className="px-6 py-2.5 bg-slate-950/30 border-b border-slate-800/80 flex items-center gap-4 text-xs text-slate-400">
              <span>
                Status:{' '}
                <strong
                  className={`capitalize ${
                    selectedPayload.status === 'completed'
                      ? 'text-emerald-400'
                      : selectedPayload.status === 'dead'
                      ? 'text-purple-400'
                      : selectedPayload.status === 'failed'
                      ? 'text-red-400'
                      : 'text-amber-400'
                  }`}
                >
                  {selectedPayload.status}
                </strong>
              </span>
              <span>
                Attempts: <strong className="text-slate-200">{selectedPayload.attempts}</strong>
              </span>
              <span>
                Timestamp:{' '}
                <strong className="text-slate-200">
                  {new Date(selectedPayload.createdAt).toLocaleString()}
                </strong>
              </span>
            </div>

            {/* Modal Body - Pretty JSON */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-950/70 font-mono text-xs">
              <pre className="text-emerald-400 leading-relaxed whitespace-pre-wrap select-all">
                {JSON.stringify(selectedPayload.payload, null, 2)}
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-800 flex justify-end bg-slate-950/40">
              <button
                onClick={() => setSelectedPayload(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition cursor-pointer"
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
