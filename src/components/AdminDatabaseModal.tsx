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
} from 'lucide-react';
import { ProfessionalStats } from '../types';

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
  const [isLoading, setIsLoading] = useState(false);
  const [testSent, setTestSent] = useState(false);
  const [activeTab, setActiveTab] = useState<'requests' | 'mvp' | 'emails'>('requests');

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const [res1, res2] = await Promise.all([
        fetch('/api/professional-support/stats'),
        fetch('/api/mvp-interest/stats'),
      ]);
      const data1 = await res1.json();
      const data2 = await res2.json();
      if (data1.success) setStats(data1);
      if (data2.success) setMvpStats(data2);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setIsLoading(false);
    }
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

        {/* Top Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          <div className="bg-purple-50 p-3.5 rounded-2xl border border-purple-200">
            <span className="text-[11px] font-bold uppercase text-purple-800 block">Total In Queue</span>
            <span className="text-2xl font-black text-purple-950 mt-1 block">
              {stats?.totalCount || 0}
            </span>
          </div>
          <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200">
            <span className="text-[11px] font-bold uppercase text-amber-800 block">Immediate Priority</span>
            <span className="text-2xl font-black text-amber-950 mt-1 block">
              {stats?.urgencyBreakdown?.['Immediate'] || 0}
            </span>
          </div>
          <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200">
            <span className="text-[11px] font-bold uppercase text-emerald-800 block">Alerts Dispatched</span>
            <span className="text-2xl font-black text-emerald-950 mt-1 block">
              {stats?.notificationsSentCount || 0}
            </span>
          </div>
          <div className="bg-stone-100 p-3.5 rounded-2xl border border-stone-200">
            <span className="text-[11px] font-bold uppercase text-stone-700 block">Target Email</span>
            <span className="text-xs font-mono text-stone-900 truncate block mt-1" title={stats?.targetNotificationEmail}>
              {stats?.targetNotificationEmail || 'sonit.sandeep@gmail.com'}
            </span>
          </div>
        </div>

        {/* Tabs & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex rounded-xl bg-purple-50 p-1 border border-purple-200">
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                activeTab === 'requests' ? 'bg-white text-purple-950 shadow-2xs' : 'text-stone-600'
              }`}
            >
              Logged Care Requests ({stats?.recentRequests?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('mvp')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                activeTab === 'mvp' ? 'bg-white text-purple-950 shadow-2xs' : 'text-stone-600'
              }`}
            >
              MVP Feature Wishlist ({mvpStats?.totalCount || 0})
            </button>
            <button
              onClick={() => setActiveTab('emails')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                activeTab === 'emails' ? 'bg-white text-purple-950 shadow-2xs' : 'text-stone-600'
              }`}
            >
              Email Notification Logs ({stats?.recentNotifications?.length || 0})
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
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
};
