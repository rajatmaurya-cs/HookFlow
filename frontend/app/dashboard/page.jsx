'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Organization form state
  const [orgForm, setOrgForm] = useState({ name: '', destinationUrl: '' });
  const [creatingOrg, setCreatingOrg] = useState(false);
  const [orgError, setOrgError] = useState('');
  const [copiedKey, setCopiedKey] = useState('');

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
        fetch('http://localhost:5000/api/organizations', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('http://localhost:5000/api/events/my-events', {
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
      const res = await fetch('http://localhost:5000/api/organizations/register', {
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

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(''), 2000);
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
      {/* Top Navbar */}
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

      {/* Main Content */}
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

        {/* Organizations List */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">Your Organizations & Ingest Details</h2>

          {organizations.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-sm">
              No organizations created yet. Register one above to get your secret key!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {organizations.map((org) => (
                <div key={org._id || org.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg text-white">{org.name}</h3>
                    <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full font-mono">
                      Active
                    </span>
                  </div>

                  {/* Secret Key Box */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-400">Secret Key (Header: secret-x-key)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="password"
                        readOnly
                        value={org.secretKey}
                        className="w-full font-mono text-xs px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-300"
                      />
                      <button
                        onClick={() => handleCopy(org.secretKey, `sec-${org._id || org.id}`)}
                        className="text-xs px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 whitespace-nowrap cursor-pointer"
                      >
                        {copiedKey === `sec-${org._id || org.id}` ? '✓ Copied' : 'Copy Key'}
                      </button>
                    </div>
                  </div>

                  {/* Ingestion URL */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-400">Ingestion API (Send data here)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value="http://localhost:5000/api/events/ingest"
                        className="w-full font-mono text-xs px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-blue-400"
                      />
                      <button
                        onClick={() => handleCopy('http://localhost:5000/api/events/ingest', `url-${org._id || org.id}`)}
                        className="text-xs px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 whitespace-nowrap cursor-pointer"
                      >
                        {copiedKey === `url-${org._id || org.id}` ? '✓ Copied' : 'Copy URL'}
                      </button>
                    </div>
                  </div>

                  {/* Target Destination */}
                  <div className="text-xs text-slate-400 pt-2 border-t border-slate-800">
                    Target Forwarding URL:{' '}
                    <span className="text-slate-200 font-mono">
                      {org.destinationUrl || 'Not configured'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Live Dispatched Events / Webhook Logs */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Webhook Activity & Dispatches</h2>
              <p className="text-xs text-slate-400">Recent events ingested and forwarded by the 5-minute scanner</p>
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
                  <th className="py-3 px-4">Payload Preview</th>
                  <th className="py-3 px-4">Reason / Error</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 text-sm">
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
                              : evt.status === 'failed'
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {evt.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs font-mono">{evt.attempts}</td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-300 max-w-xs truncate">
                        {JSON.stringify(evt.payload)}
                      </td>
                      <td className="py-3 px-4 text-xs text-red-400 max-w-xs truncate">
                        {evt.reason || '—'}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
                        {new Date(evt.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
