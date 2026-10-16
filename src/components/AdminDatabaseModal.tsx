import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  Mail,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  UserCheck,
  Send,
  Eye,
  MessageSquare,
  Smartphone,
  ExternalLink,
  Copy,
  Terminal,
  Zap,
} from 'lucide-react';
import { ProfessionalStats, OpenWAStatus } from '../types';

interface AdminDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDatabaseModal: React.FC<AdminDatabaseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [stats, setStats] = useState<ProfessionalStats | null>(null);
  const [mvpStats, setMvpStats] = useState<any | null>(null);
  const [openwaStatus, setOpenwaStatus] = useState<OpenWAStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testSent, setTestSent] = useState(false);
  const [activeTab, setActiveTab] = useState<'requests' | 'mvp' | 'emails' | 'openwa'>('requests');

  // OpenWA testing states
  const [testWaPhone, setTestWaPhone] = useState('+1 (555) 234-5678');
  const [testWaText, setTestWaText] = useState('🌸 [HerSanctuary] OpenWA live test message from port 2785. You are valued and safe here.');
  const [waSending, setWaSending] = useState(false);
  const [waResult, setWaResult] = useState<any | null>(null);

  const [testEmailAddress, setTestEmailAddress] = useState('sonit.sandeep@gmail.com');
  const [testEmailSubject, setTestEmailSubject] = useState('🌸 [HerSanctuary] OpenWA Gateway Test Alert');
  const [testEmailBody, setTestEmailBody] = useState('This is a test notification confirming OpenWA Gmail API connectivity on port 2785.');
  const [emailSending, setEmailSending] = useState(false);
  const [emailResult, setEmailResult] = useState<any | null>(null);
  const [copiedDocker, setCopiedDocker] = useState(false);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const [res1, res2, res3] = await Promise.all([
        fetch('/api/professional-support/stats'),
        fetch('/api/mvp-interest/stats'),
        fetch('/api/openwa/status'),
      ]);
      const data1 = await res1.json();
      const data2 = await res2.json();
      const data3 = await res3.json();
      if (data1.success) setStats(data1);
      if (data2.success) setMvpStats(data2);
      if (data3.success) setOpenwaStatus(data3);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendTestWhatsApp = async () => {
    if (!testWaPhone.trim()) return;
    setWaSending(true);
    setWaResult(null);
    try {
      const res = await fetch('/api/openwa/test-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: testWaPhone, message: testWaText }),
      });
      const data = await res.json();
      setWaResult(data);
      fetchStats();
    } catch (e: any) {
      setWaResult({ error: e.message });
    } finally {
      setWaSending(false);
    }
  };

  const handleSendTestGmail = async () => {
    if (!testEmailAddress.trim()) return;
    setEmailSending(true);
    setEmailResult(null);
    try {
      const res = await fetch('/api/openwa/test-gmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: testEmailAddress,
          subject: testEmailSubject,
          body: testEmailBody,
        }),
      });
      const data = await res.json();
      setEmailResult(data);
      fetchStats();
    } catch (e: any) {
      setEmailResult({ error: e.message });
    } finally {
      setEmailSending(false);
    }
  };

  const handleCopyDockerCmd = () => {
    const cmd = `# Clone and start with Docker (single-container quick start)\ngit clone https://github.com/rmyndharis/OpenWA.git\ncd OpenWA\ndocker compose -f docker-compose.dev.yml up -d\n\n# Dashboard & API are bundled on one port:\n# http://localhost:2785 for whatsapp and gmail`;
    navigator.clipboard.writeText(cmd);
    setCopiedDocker(true);
    setTimeout(() => setCopiedDocker(false), 2500);
  };

  useEffect(() => {
    if (isOpen) {
      fetchStats();
    }
  }, [isOpen]);

  const handleExportCSV = () => {
    if (!stats || !stats.recentRequests) return;
    const headers = ['ID', 'Timestamp', 'Pseudonym', 'Concern', 'Urgency', 'PreferredMode', 'Status'];
    const rows = stats.recentRequests.map((r) => [
      r.id,
      r.timestamp,
      `"${r.pseudonym}"`,
      `"${r.concernType}"`,
      `"${r.urgency}"`,
      `"${r.preferredMode}"`,
      r.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hersanctuary_professional_triage_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTriggerTestEmail = async () => {
    setTestSent(true);
    try {
      await fetch('/api/professional-support/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pseudonym: 'Test Sister Alert',
          email: 'test.sister@example.com',
          whatsapp: '+1 555-TEST-99',
          concernType: 'Depression & Feeling Numb',
          urgency: 'Immediate',
          notes: 'Automated test dispatch to verify director email notifications.',
          preferredMode: 'WhatsApp Chat & Voice',
          consentContact: true,
        }),
      });
      fetchStats();
    } catch (err) {
      console.error('Test email failed:', err);
    }
    setTimeout(() => setTestSent(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-purple-200 relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-700 text-white flex items-center justify-center shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                Professional Care Database & Notification Logs
              </h3>
              <p className="text-xs text-stone-500">
                Live registry of care requests and email alert dispatches to{' '}
                <strong className="text-stone-800">{stats?.targetNotificationEmail || 'sonit.sandeep@gmail.com'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchStats}
              className="p-2 rounded-full text-stone-500 hover:text-stone-800 hover:bg-purple-50 transition"
              title="Refresh database"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-purple-50 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Summary Metrics with OpenWA */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 my-4">
          <div className="bg-purple-50 p-3 rounded-2xl border border-purple-200">
            <span className="text-[10px] font-bold uppercase text-purple-800 block">Total In Queue</span>
            <span className="text-xl font-black text-purple-950 mt-1 block">
              {stats?.totalCount || 0}
            </span>
          </div>
          <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200">
            <span className="text-[10px] font-bold uppercase text-amber-800 block">Immediate</span>
            <span className="text-xl font-black text-amber-950 mt-1 block">
              {stats?.urgencyBreakdown?.['Immediate'] || 0}
            </span>
          </div>
          <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
            <span className="text-[10px] font-bold uppercase text-emerald-800 block">Alerts Dispatched</span>
            <span className="text-xl font-black text-emerald-950 mt-1 block">
              {stats?.notificationsSentCount || 0}
            </span>
          </div>
          <div className="bg-emerald-950/80 p-3 rounded-2xl border border-emerald-500/30 text-emerald-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block">OpenWA :2785</span>
              <span className={`w-2 h-2 rounded-full ${openwaStatus?.online ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            </div>
            <span className="text-xs font-bold text-white mt-1 block">
              {openwaStatus?.online ? 'Online (Docker)' : 'Docker Ready'}
            </span>
          </div>
          <div className="bg-stone-100 p-3 rounded-2xl border border-stone-200">
            <span className="text-[10px] font-bold uppercase text-stone-700 block">Target Email</span>
            <span className="text-[11px] font-mono text-stone-900 truncate block mt-1" title={stats?.targetNotificationEmail}>
              {stats?.targetNotificationEmail || 'sonit.sandeep@gmail.com'}
            </span>
          </div>
        </div>

        {/* Tabs & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
          <div className="flex flex-wrap rounded-xl bg-purple-50 p-1 border border-purple-200 gap-1">
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                activeTab === 'requests' ? 'bg-white text-purple-950 shadow-2xs' : 'text-stone-600'
              }`}
            >
              Logged Care ({stats?.recentRequests?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('mvp')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                activeTab === 'mvp' ? 'bg-white text-purple-950 shadow-2xs' : 'text-stone-600'
              }`}
            >
              MVP Wishlist ({mvpStats?.totalCount || 0})
            </button>
            <button
              onClick={() => setActiveTab('emails')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                activeTab === 'emails' ? 'bg-white text-purple-950 shadow-2xs' : 'text-stone-600'
              }`}
            >
              Email Logs ({stats?.recentNotifications?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('openwa')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'openwa' ? 'bg-purple-900 text-white shadow-2xs' : 'text-stone-700 hover:text-purple-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>OpenWA Gateway (:2785)</span>
              {openwaStatus?.online ? (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerTestEmail}
              className="px-3 py-1.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{testSent ? 'Alert Dispatched!' : 'Simulate Test Alert'}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto border border-stone-200 rounded-2xl">
          {activeTab === 'requests' ? (
            <table className="min-w-full divide-y divide-stone-200 text-left text-xs">
              <thead className="bg-stone-50 font-bold text-stone-700 uppercase tracking-wider sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Pseudonym</th>
                  <th className="py-2.5 px-3">Concern Category</th>
                  <th className="py-2.5 px-3">Urgency</th>
                  <th className="py-2.5 px-3">Mode</th>
                  <th className="py-2.5 px-3">Contact Stored</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {!stats?.recentRequests || stats.recentRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-stone-400">
                      No professional care requests in database yet.
                    </td>
                  </tr>
                ) : (
                  stats.recentRequests.map((r) => (
                    <tr key={r.id} className="hover:bg-purple-50/40">
                      <td className="py-2.5 px-3 text-stone-500 font-mono">
                        {new Date(r.timestamp).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-purple-950">
                        🌸 {r.pseudonym}
                      </td>
                      <td className="py-2.5 px-3">{r.concernType}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            r.urgency === 'Immediate'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {r.urgency}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-stone-600">{r.preferredMode}</td>
                      <td className="py-2.5 px-3">
                        <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>
                            {r.hasWhatsApp ? 'WhatsApp' : ''}
                            {r.hasWhatsApp && r.hasEmail ? ' + ' : ''}
                            {r.hasEmail ? 'Email' : ''}
                          </span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : activeTab === 'mvp' ? (
            <div className="p-4 space-y-4">
              {/* Feature tallies */}
              {mvpStats?.featureVotes && Object.keys(mvpStats.featureVotes).length > 0 && (
                <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200">
                  <span className="text-xs font-bold text-purple-900 block mb-2 uppercase tracking-wider">
                    Feature Wishlist Popularity Tally
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {Object.entries(mvpStats.featureVotes).map(([feat, votes]: any) => (
                      <div key={feat} className="flex justify-between bg-white px-3 py-1.5 rounded-lg border border-purple-100">
                        <span className="text-stone-700">{feat}</span>
                        <span className="font-bold text-purple-700">{votes} votes</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Entries list */}
              {!mvpStats?.entries || mvpStats.entries.length === 0 ? (
                <div className="py-8 text-center text-stone-400 text-xs">
                  No MVP wishlist votes recorded yet.
                </div>
              ) : (
                <table className="min-w-full divide-y divide-stone-200 text-left text-xs">
                  <thead className="bg-stone-50 font-bold text-stone-700 uppercase tracking-wider">
                    <tr>
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Pseudonym</th>
                      <th className="py-2 px-3">Features Voted</th>
                      <th className="py-2 px-3">User Feedback</th>
                      <th className="py-2 px-3">Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-800">
                    {mvpStats.entries.map((entry: any) => (
                      <tr key={entry.id} className="hover:bg-purple-50/30">
                        <td className="py-2 px-3 text-stone-500 font-mono text-[11px]">
                          {new Date(entry.timestamp).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-2 px-3 font-bold text-purple-950">
                          🌸 {entry.pseudonym}
                        </td>
                        <td className="py-2 px-3 text-purple-800 font-medium">
                          {(entry.featuresVoted || []).join(', ') || 'General Interest'}
                        </td>
                        <td className="py-2 px-3 text-stone-600 italic">
                          "{entry.feedback || 'No extra notes'}"
                        </td>
                        <td className="py-2 px-3 text-stone-500 font-mono text-[11px]">
                          {entry.whatsapp || entry.email || 'None'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : activeTab === 'emails' ? (
            <div className="p-4 space-y-3">
              {!stats?.recentNotifications || stats.recentNotifications.length === 0 ? (
                <div className="py-8 text-center text-stone-400 text-xs">
                  No email alerts logged yet.
                </div>
              ) : (
                stats.recentNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-3.5 rounded-xl bg-purple-50/40 border border-purple-200 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-950 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-purple-600" />
                        <span>{notif.subject}</span>
                      </span>
                      <span className="text-[11px] text-stone-400 font-mono">
                        {new Date(notif.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-stone-700 leading-relaxed font-sans">{notif.summary}</p>
                    <div className="text-[11px] text-stone-500 flex items-center gap-2 pt-1 border-t border-purple-200/60">
                      <span>Recipient: <strong>{notif.recipient}</strong></span>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold">Status: {notif.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* OpenWA Gateway Tab (Docker: http://localhost:2785 for WhatsApp & Gmail) */
            <div className="p-4 sm:p-6 space-y-6">
              {/* Docker Quick Start Hero Card */}
              <div className="rounded-2xl bg-stone-900 text-stone-100 p-4 sm:p-5 border border-stone-800 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-stone-200 uppercase tracking-wider">
                      OpenWA Docker Container Quick Start
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                      Port 2785
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyDockerCmd}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-stone-300" />
                      <span>{copiedDocker ? 'Copied!' : 'Copy Commands'}</span>
                    </button>
                    <a
                      href="http://localhost:2785"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>OpenWA Dashboard (:2785)</span>
                    </a>
                  </div>
                </div>

                <pre className="p-3.5 rounded-xl bg-black/60 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed border border-stone-800">
{`# Clone and start with Docker (single-container quick start)
git clone https://github.com/rmyndharis/OpenWA.git
cd OpenWA
docker compose -f docker-compose.dev.yml up -d

# Dashboard & API are bundled on one port:
# http://localhost:2785 for whatsapp and gmail`}
                </pre>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-400">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${openwaStatus?.online ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                    <span>
                      Gateway Status:{' '}
                      <strong className={openwaStatus?.online ? 'text-emerald-400' : 'text-amber-300'}>
                        {openwaStatus?.online ? 'Connected to http://localhost:2785' : 'Waiting for Docker container on :2785 (Auto-fallback enabled)'}
                      </strong>
                    </span>
                  </div>
                  <span>Total OpenWA Dispatches: <strong className="text-white">{openwaStatus?.totalDispatched || 0}</strong></span>
                </div>
              </div>

              {/* Interactive Dispatcher Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. WhatsApp Dispatcher */}
                <div className="rounded-2xl p-4 bg-emerald-50/60 border border-emerald-200/80">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                        Test WhatsApp via OpenWA
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full">
                      WhatsApp Web API
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Recipient Phone (with country code)
                      </label>
                      <input
                        type="tel"
                        value={testWaPhone}
                        onChange={(e) => setTestWaPhone(e.target.value)}
                        placeholder="+1 555-0199"
                        className="w-full px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-xs focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Message Content
                      </label>
                      <textarea
                        rows={2}
                        value={testWaText}
                        onChange={(e) => setTestWaText(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-xs focus:outline-hidden resize-none"
                      />
                    </div>

                    <button
                      onClick={handleSendTestWhatsApp}
                      disabled={waSending}
                      className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{waSending ? 'Dispatching to OpenWA...' : 'Dispatch WhatsApp via OpenWA (:2785)'}</span>
                    </button>

                    {waResult && (
                      <div className="p-3 rounded-xl bg-white border border-emerald-200 text-xs space-y-1.5 animate-in fade-in">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-900">
                            {waResult.openwaOnline ? '✓ Sent to OpenWA Container' : 'Queued (Docker Offline)'}
                          </span>
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            {waResult.status}
                          </span>
                        </div>
                        {waResult.waLink && (
                          <div className="pt-1 border-t border-stone-100">
                            <a
                              href={waResult.waLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold hover:underline"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Open direct WhatsApp web chat (wa.me)</span>
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Gmail Dispatcher */}
                <div className="rounded-2xl p-4 bg-purple-50/60 border border-purple-200/80">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-purple-700 text-white flex items-center justify-center">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                        Test Gmail via OpenWA
                      </span>
                    </div>
                    <span className="text-[10px] text-purple-800 font-semibold bg-purple-100 px-2 py-0.5 rounded-full">
                      Gmail SMTP / API
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Recipient Email
                      </label>
                      <input
                        type="email"
                        value={testEmailAddress}
                        onChange={(e) => setTestEmailAddress(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-white border border-purple-300 text-xs focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Subject Line
                      </label>
                      <input
                        type="text"
                        value={testEmailSubject}
                        onChange={(e) => setTestEmailSubject(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-white border border-purple-300 text-xs focus:outline-hidden"
                      />
                    </div>

                    <button
                      onClick={handleSendTestGmail}
                      disabled={emailSending}
                      className="w-full py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{emailSending ? 'Dispatching to OpenWA...' : 'Dispatch Gmail via OpenWA (:2785)'}</span>
                    </button>

                    {emailResult && (
                      <div className="p-3 rounded-xl bg-white border border-purple-200 text-xs space-y-1.5 animate-in fade-in">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-purple-900">
                            {emailResult.openwaOnline ? '✓ Sent to OpenWA Container' : 'Queued (Docker Standby)'}
                          </span>
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">
                            {emailResult.status}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* OpenWA Dispatch Logs Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-500" />
                    <span>OpenWA Live Dispatch Audit Log</span>
                  </h4>
                  <span className="text-[11px] text-stone-500 font-mono">
                    Showing latest {openwaStatus?.recentLogs?.length || 0} events
                  </span>
                </div>

                {!openwaStatus?.recentLogs || openwaStatus.recentLogs.length === 0 ? (
                  <div className="p-6 text-center text-xs text-stone-400 bg-stone-50 rounded-2xl border border-stone-200">
                    No OpenWA dispatches yet. Use the test triggers above or submit a triage request with WhatsApp or Email!
                  </div>
                ) : (
                  <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden bg-white text-xs">
                    {openwaStatus.recentLogs.map((log) => (
                      <div key={log.id} className="p-3.5 hover:bg-stone-50/80 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              log.channel === 'whatsapp'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-purple-100 text-purple-800 border border-purple-200'
                            }`}>
                              {log.channel}
                            </span>
                            <span className="font-bold text-stone-900">{log.recipient}</span>
                            <span className="text-[11px] text-stone-400 font-mono">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-stone-600 line-clamp-1">{log.content}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            log.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {log.status === 'delivered' ? 'Delivered via 2785' : 'Queued (Docker Standby)'}
                          </span>
                          {log.waLink && (
                            <a
                              href={log.waLink}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 rounded bg-stone-100 hover:bg-emerald-50 text-stone-600 hover:text-emerald-700 transition"
                              title="Open direct WhatsApp conversation"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
