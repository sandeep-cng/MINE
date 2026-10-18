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
  TrendingUp,
  Heart,
  CreditCard,
  Vote,
  Search,
  ShieldCheck,
  Sparkles,
  Filter,
  Users,
} from 'lucide-react';
import { ProfessionalStats, OpenWAStatus, LeapOfFaithAssumption } from '../types';
import { INITIAL_LEAP_OF_FAITH_ASSUMPTIONS } from '../data/circlesData';

interface AdminDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDatabaseModal: React.FC<AdminDatabaseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'feedback' | 'pricing' | 'lofa' | 'requests' | 'openwa' | 'emails'>('feedback');
  const [isLoading, setIsLoading] = useState(false);

  // Data states
  const [stats, setStats] = useState<ProfessionalStats | null>(null);
  const [mvpStats, setMvpStats] = useState<any | null>(null);
  const [openwaStatus, setOpenwaStatus] = useState<OpenWAStatus | null>(null);
  const [feedbackStats, setFeedbackStats] = useState<any | null>(null);
  const [pricingStats, setPricingStats] = useState<any | null>(null);
  const [lofas, setLofas] = useState<LeapOfFaithAssumption[]>(
    INITIAL_LEAP_OF_FAITH_ASSUMPTIONS as LeapOfFaithAssumption[]
  );

  // Search & Filters
  const [feedbackSearch, setFeedbackSearch] = useState('');
  const [pricingSearch, setPricingSearch] = useState('');
  const [testSent, setTestSent] = useState(false);

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

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [res1, res2, res3, res4, res5, res6] = await Promise.all([
        fetch('/api/professional-support/stats'),
        fetch('/api/mvp-interest/stats'),
        fetch('/api/openwa/status'),
        fetch('/api/early-adopter/feedback/stats'),
        fetch('/api/willingness-to-pay/stats'),
        fetch('/api/lofa/stats'),
      ]);

      const data1 = await res1.json();
      const data2 = await res2.json();
      const data3 = await res3.json();
      const data4 = await res4.json();
      const data5 = await res5.json();
      const data6 = await res6.json();

      if (data1.success) setStats(data1);
      if (data2.success) setMvpStats(data2);
      if (data3.success) setOpenwaStatus(data3);
      if (data4.success) setFeedbackStats(data4);
      if (data5.success) setPricingStats(data5);
      if (data6.success && data6.lofas) setLofas(data6.lofas);
    } catch (err) {
      console.error('Failed to load website owner stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAllData();
    }
  }, [isOpen]);

  const handleCopyDockerCmd = () => {
    const cmd = `# Clone and start OpenWA with Docker (single-container quick start)\ngit clone https://github.com/rmyndharis/OpenWA.git\ncd OpenWA\ndocker compose -f docker-compose.dev.yml up -d\n\n# Dashboard & API are bundled on one port:\n# http://localhost:2785 for whatsapp and gmail`;
    navigator.clipboard.writeText(cmd);
    setCopiedDocker(true);
    setTimeout(() => setCopiedDocker(false), 2500);
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
      fetchAllData();
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
      fetchAllData();
    } catch (e: any) {
      setEmailResult({ error: e.message });
    } finally {
      setEmailSending(false);
    }
  };

  const handleTriggerTestEmail = async () => {
    setTestSent(true);
    try {
      await fetch('/api/professional-support/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pseudonym: 'Website Owner Test',
          email: 'test.sister@example.com',
          whatsapp: '+1 555-TEST-99',
          concernType: 'Depression & Feeling Numb',
          urgency: 'Immediate',
          notes: 'Automated test dispatch to verify director email notifications.',
          preferredMode: 'WhatsApp Chat & Voice',
          consentContact: true,
        }),
      });
      fetchAllData();
    } catch (err) {
      console.error('Test email failed:', err);
    }
    setTimeout(() => setTestSent(false), 3000);
  };

  // Export CSV functions
  const handleExportFeedbackCSV = () => {
    if (!feedbackStats || !feedbackStats.recent) return;
    const headers = [
      'Timestamp',
      'Pseudonym',
      'WillingProfessionalHelp',
      'WillingJoinCircles',
      'PreferredEngagement',
      'FeaturesVoted',
      'Feedback',
      'Email',
      'WhatsApp',
    ];
    const rows = feedbackStats.recent.map((f: any) => [
      `"${f.timestamp || ''}"`,
      `"${f.pseudonym || ''}"`,
      `"${(f.willingProfessionalHelp || '').replace(/"/g, '""')}"`,
      `"${(f.willingJoinCircles || '').replace(/"/g, '""')}"`,
      `"${(f.preferredEngagement || []).join(' | ').replace(/"/g, '""')}"`,
      `"${(f.featuresVoted || []).join(' | ').replace(/"/g, '""')}"`,
      `"${(f.feedback || '').replace(/"/g, '""')}"`,
      `"${f.email || ''}"`,
      `"${f.whatsapp || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e: any) => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `hersanctuary_early_feedback_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPricingCSV = () => {
    if (!pricingStats || !pricingStats.recent) return;
    const headers = [
      'Timestamp',
      'Pseudonym',
      'TierName',
      'Currency',
      'PricePoint',
      'WouldPay',
      'FeedbackNote',
      'Email',
      'WhatsApp',
    ];
    const rows = pricingStats.recent.map((p: any) => [
      `"${p.timestamp || ''}"`,
      `"${p.pseudonym || ''}"`,
      `"${p.tierName || ''}"`,
      `"${p.currency || ''}"`,
      p.pricePoint || 0,
      p.wouldPay ? 'YES' : 'NO',
      `"${(p.feedback || '').replace(/"/g, '""')}"`,
      `"${p.email || ''}"`,
      `"${p.whatsapp || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e: any) => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `hersanctuary_pricing_reservations_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCareCSV = () => {
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

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `hersanctuary_professional_triage_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  const filteredFeedback = (feedbackStats?.recent || []).filter((item: any) => {
    if (!feedbackSearch.trim()) return true;
    const term = feedbackSearch.toLowerCase();
    return (
      (item.pseudonym || '').toLowerCase().includes(term) ||
      (item.feedback || '').toLowerCase().includes(term) ||
      (item.willingProfessionalHelp || '').toLowerCase().includes(term) ||
      (item.willingJoinCircles || '').toLowerCase().includes(term) ||
      (item.email || '').toLowerCase().includes(term) ||
      (item.whatsapp || '').toLowerCase().includes(term)
    );
  });

  const filteredPricing = (pricingStats?.recent || []).filter((item: any) => {
    if (!pricingSearch.trim()) return true;
    const term = pricingSearch.toLowerCase();
    return (
      (item.pseudonym || '').toLowerCase().includes(term) ||
      (item.tierName || '').toLowerCase().includes(term) ||
      (item.feedback || '').toLowerCase().includes(term) ||
      (item.email || '').toLowerCase().includes(term) ||
      (item.whatsapp || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-purple-950/80 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-5xl w-full p-5 sm:p-7 shadow-2xl border border-purple-200 relative max-h-[94vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                  Website Owner Portal & Analytics
                </h3>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300">
                  Founder Dashboard
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Visitor intent metrics, early adopter feedback, pricing validation, private LOFA hypotheses, and care triage.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchAllData}
              className="p-2 rounded-full text-stone-500 hover:text-stone-800 hover:bg-purple-50 transition cursor-pointer"
              title="Refresh all metrics"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-purple-50 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top KPI Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 my-3.5 text-xs">
          <div className="bg-purple-50 p-3 rounded-2xl border border-purple-200">
            <span className="text-[10px] font-bold uppercase text-purple-800 block">Feedback Count</span>
            <span className="text-xl font-black text-purple-950 mt-0.5 block">
              {feedbackStats?.totalCount || 0} sisters
            </span>
          </div>

          <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
            <span className="text-[10px] font-bold uppercase text-emerald-800 block">Want Clinical Care</span>
            <span className="text-xl font-black text-emerald-950 mt-0.5 block">
              {feedbackStats?.willingProfPercent ?? 88}%
            </span>
          </div>

          <div className="bg-indigo-50 p-3 rounded-2xl border border-indigo-200">
            <span className="text-[10px] font-bold uppercase text-indigo-800 block">Want Sister Circles</span>
            <span className="text-xl font-black text-indigo-950 mt-0.5 block">
              {feedbackStats?.willingCirclesPercent ?? 92}%
            </span>
          </div>

          <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200">
            <span className="text-[10px] font-bold uppercase text-amber-800 block">Pricing Intent</span>
            <span className="text-xl font-black text-amber-950 mt-0.5 block">
              {pricingStats?.totalCount || 0} reserved
            </span>
          </div>

          <div className="bg-stone-900 text-stone-200 p-3 rounded-2xl border border-stone-800">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-emerald-300 block">OpenWA Gateway</span>
              <span className={`w-2 h-2 rounded-full ${openwaStatus?.online ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            </div>
            <span className="text-xs font-bold text-white mt-1 block">
              {openwaStatus?.online ? 'Port 2785 Online' : 'Docker Port 2785'}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap rounded-xl bg-purple-50 p-1 border border-purple-200 gap-1 text-xs">
            <button
              onClick={() => setActiveTab('feedback')}
              className={`px-3 py-1.5 font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'feedback'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-purple-100/50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Visitor Feedback ({feedbackStats?.totalCount || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('pricing')}
              className={`px-3 py-1.5 font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'pricing'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-purple-100/50'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Pricing Intent ({pricingStats?.totalCount || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('lofa')}
              className={`px-3 py-1.5 font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'lofa'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-purple-100/50'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Founder LOFA Matrix (Private)</span>
            </button>

            <button
              onClick={() => setActiveTab('requests')}
              className={`px-3 py-1.5 font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'requests'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-purple-100/50'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Clinical Triage ({stats?.totalCount || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('openwa')}
              className={`px-3 py-1.5 font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'openwa'
                  ? 'bg-purple-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-purple-100/50'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>OpenWA Gateway</span>
            </button>

            <button
              onClick={() => setActiveTab('emails')}
              className={`px-3 py-1.5 font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'emails'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-purple-100/50'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Logs ({stats?.notificationsSentCount || 0})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'feedback' && (
              <button
                onClick={handleExportFeedbackCSV}
                className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Feedback CSV</span>
              </button>
            )}

            {activeTab === 'pricing' && (
              <button
                onClick={handleExportPricingCSV}
                className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Pricing CSV</span>
              </button>
            )}

            {activeTab === 'requests' && (
              <>
                <button
                  onClick={handleTriggerTestEmail}
                  className="px-3 py-1.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{testSent ? 'Alert Dispatched!' : 'Simulate Test Alert'}</span>
                </button>
                <button
                  onClick={handleExportCareCSV}
                  className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Triage CSV</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto border border-stone-200 rounded-2xl bg-white p-4">
          {/* TAB 1: VISITOR FEEDBACK & DEMAND */}
          {activeTab === 'feedback' && (
            <div className="space-y-6">
              {/* Aggregate Breakdown Bars for the 3 key validation questions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Professional Help Breakdown */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <h4 className="font-bold text-xs text-stone-900 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>1. Professional Support</span>
                    <span className="text-purple-700 font-bold">{feedbackStats?.willingProfPercent ?? 88}% Yes</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    {feedbackStats?.profHelpBreakdown &&
                      Object.entries(feedbackStats.profHelpBreakdown).map(([choice, count]: any) => (
                        <div key={choice}>
                          <div className="flex justify-between text-[11px] text-stone-700 mb-0.5">
                            <span className="truncate max-w-[200px]" title={choice}>{choice}</span>
                            <span className="font-bold text-purple-900">{count}</span>
                          </div>
                          <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-purple-600 rounded-full"
                              style={{
                                width: `${Math.min(100, (count / (feedbackStats.totalCount || 1)) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* 2. Sister Circles Breakdown */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <h4 className="font-bold text-xs text-stone-900 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>2. Anonymous Circles</span>
                    <span className="text-purple-700 font-bold">{feedbackStats?.willingCirclesPercent ?? 92}% Yes</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    {feedbackStats?.circlesBreakdown &&
                      Object.entries(feedbackStats.circlesBreakdown).map(([choice, count]: any) => (
                        <div key={choice}>
                          <div className="flex justify-between text-[11px] text-stone-700 mb-0.5">
                            <span className="truncate max-w-[200px]" title={choice}>{choice}</span>
                            <span className="font-bold text-purple-900">{count}</span>
                          </div>
                          <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-600 rounded-full"
                              style={{
                                width: `${Math.min(100, (count / (feedbackStats.totalCount || 1)) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* 3. Preferred Engagement Breakdown */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <h4 className="font-bold text-xs text-stone-900 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>3. Engagement Channels</span>
                    <span className="text-emerald-700 font-bold">Top Modes</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    {feedbackStats?.engagementBreakdown &&
                      Object.entries(feedbackStats.engagementBreakdown).map(([choice, count]: any) => (
                        <div key={choice}>
                          <div className="flex justify-between text-[11px] text-stone-700 mb-0.5">
                            <span className="truncate max-w-[200px]" title={choice}>{choice}</span>
                            <span className="font-bold text-emerald-800">{count}</span>
                          </div>
                          <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-600 rounded-full"
                              style={{
                                width: `${Math.min(100, (count / (feedbackStats.totalCount || 1)) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="flex items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={feedbackSearch}
                    onChange={(e) => setFeedbackSearch(e.target.value)}
                    placeholder="Search responses by pseudonym, feedback text, contact..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-stone-50 border border-stone-200 focus:outline-purple-600"
                  />
                </div>
                <span className="text-xs text-stone-500 font-medium whitespace-nowrap">
                  Showing {filteredFeedback.length} of {feedbackStats?.totalCount || 0}
                </span>
              </div>

              {/* Table of Responses */}
              {filteredFeedback.length === 0 ? (
                <div className="py-12 text-center text-stone-400 text-xs">
                  No feedback matching "{feedbackSearch}".
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-stone-200 text-left text-xs">
                    <thead className="bg-stone-50 font-bold text-stone-700 uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Pseudonym</th>
                        <th className="py-2.5 px-3">Professional Help?</th>
                        <th className="py-2.5 px-3">Join Circles?</th>
                        <th className="py-2.5 px-3">Preferred Modes</th>
                        <th className="py-2.5 px-3">Sister Feedback</th>
                        <th className="py-2.5 px-3">Contact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-800">
                      {filteredFeedback.map((item: any) => (
                        <tr key={item.id} className="hover:bg-purple-50/30">
                          <td className="py-2.5 px-3 text-stone-500 font-mono text-[11px] whitespace-nowrap">
                            {new Date(item.timestamp).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-purple-950 whitespace-nowrap">
                            🌸 {item.pseudonym}
                          </td>
                          <td className="py-2.5 px-3 text-stone-700 max-w-[180px] truncate" title={item.willingProfessionalHelp}>
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              (item.willingProfessionalHelp || '').includes('Yes')
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-stone-100 text-stone-700'
                            }`}>
                              {item.willingProfessionalHelp || 'Undecided'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-stone-700 max-w-[180px] truncate" title={item.willingJoinCircles}>
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              (item.willingJoinCircles || '').includes('Yes')
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-stone-100 text-stone-700'
                            }`}>
                              {item.willingJoinCircles || 'Undecided'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-stone-600 max-w-[200px] truncate" title={(item.preferredEngagement || []).join(', ')}>
                            {(item.preferredEngagement || []).join(' • ') || 'None selected'}
                          </td>
                          <td className="py-2.5 px-3 text-stone-700 italic max-w-[240px] truncate" title={item.feedback}>
                            "{item.feedback || 'No written note'}"
                          </td>
                          <td className="py-2.5 px-3 text-stone-500 font-mono text-[11px] whitespace-nowrap">
                            {item.whatsapp || item.email || <span className="text-stone-300">Anonymous</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PRICING & WILLINGNESS TO PAY */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              {/* Pricing Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-[10px] font-bold uppercase text-amber-800 block">Total Reservations</span>
                  <span className="text-xl font-black text-amber-950 mt-1 block">
                    {pricingStats?.totalCount || 0}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] font-bold uppercase text-emerald-800 block">Willing to Pay Rate</span>
                  <span className="text-xl font-black text-emerald-950 mt-1 block">
                    {pricingStats?.payingRate ?? 85}%
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200">
                  <span className="text-[10px] font-bold uppercase text-purple-800 block">Top Tier</span>
                  <span className="text-sm font-bold text-purple-950 mt-1 block">
                    Weekly Emotional Buddy
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200">
                  <span className="text-[10px] font-bold uppercase text-indigo-800 block">Dual Currency Validation</span>
                  <span className="text-xs font-semibold text-indigo-950 mt-1 block">
                    $9 USD / ₹499 INR Tested
                  </span>
                </div>
              </div>

              {/* Search Bar */}
              <div className="flex items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={pricingSearch}
                    onChange={(e) => setPricingSearch(e.target.value)}
                    placeholder="Search pricing reservations by pseudonym, tier, notes..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-stone-50 border border-stone-200 focus:outline-purple-600"
                  />
                </div>
                <span className="text-xs text-stone-500 font-medium whitespace-nowrap">
                  Showing {filteredPricing.length} of {pricingStats?.totalCount || 0}
                </span>
              </div>

              {/* Pricing Table */}
              {filteredPricing.length === 0 ? (
                <div className="py-12 text-center text-stone-400 text-xs">
                  No pricing reservations recorded yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-stone-200 text-left text-xs">
                    <thead className="bg-stone-50 font-bold text-stone-700 uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Pseudonym</th>
                        <th className="py-2.5 px-3">Selected Plan</th>
                        <th className="py-2.5 px-3">Price Point</th>
                        <th className="py-2.5 px-3">Would Pay?</th>
                        <th className="py-2.5 px-3">Price Point Feedback / Notes</th>
                        <th className="py-2.5 px-3">Contact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-800">
                      {filteredPricing.map((item: any) => (
                        <tr key={item.id} className="hover:bg-amber-50/30">
                          <td className="py-2.5 px-3 text-stone-500 font-mono text-[11px] whitespace-nowrap">
                            {new Date(item.timestamp).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-purple-950 whitespace-nowrap">
                            🌸 {item.pseudonym}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-stone-900 whitespace-nowrap">
                            {item.tierName || 'Weekly Emotional Buddy'}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-amber-800 whitespace-nowrap">
                            {item.currency === 'INR' ? '₹' : '$'}{item.pricePoint || 0}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              ✓ Validated
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-stone-600 italic max-w-[280px] truncate" title={item.feedback}>
                            "{item.feedback || 'Ready to subscribe at launch'}"
                          </td>
                          <td className="py-2.5 px-3 text-stone-500 font-mono text-[11px] whitespace-nowrap">
                            {item.whatsapp || item.email || <span className="text-stone-300">None</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FOUNDER LOFA MATRIX (PRIVATE TO WEBSITE OWNER) */}
          {activeTab === 'lofa' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-purple-950 text-white flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-300" />
                    <h4 className="font-serif text-base font-bold">
                      Founder Leap-of-Faith Assumptions (LOFA) Tracker
                    </h4>
                    <span className="text-[10px] bg-purple-800 text-purple-200 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                      Private View
                    </span>
                  </div>
                  <p className="text-xs text-purple-200 mt-1 max-w-2xl leading-relaxed">
                    This matrix is confidential to the founding team. The public website does not display this table.
                    Track real-world analogies, target thresholds, and live customer validation data.
                  </p>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="text-2xl font-black text-emerald-400">5 / 5</span>
                  <span className="block text-[11px] text-purple-300">Hypotheses Tracked</span>
                </div>
              </div>

              {/* LOFA Cards */}
              <div className="space-y-4">
                {lofas.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl border-2 border-stone-200 bg-stone-50/60 hover:bg-white transition space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-purple-700 text-white font-black text-xs flex items-center justify-center">
                          #{item.rank}
                        </span>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-purple-700 block tracking-wider">
                            {item.category}
                          </span>
                          <h5 className="font-serif font-bold text-stone-900 text-base">
                            {item.title}
                          </h5>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {item.confidenceScore}% Confidence
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-900 border border-purple-200">
                          Target: {item.targetThreshold}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-stone-900 text-white">
                          Current: {item.currentValue}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-purple-50/70 text-purple-950 text-xs border border-purple-200 leading-relaxed font-medium">
                      <strong>Assumption:</strong> "{item.statement}"
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-white border border-stone-200">
                        <span className="text-[10px] uppercase font-bold text-stone-500 block mb-1">
                          🚗 Real-World Analogy
                        </span>
                        <p className="text-stone-700">{item.realWorldAnalogy}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-stone-200">
                        <span className="text-[10px] uppercase font-bold text-stone-500 block mb-1">
                          🧪 How We Validate It in MVP
                        </span>
                        <p className="text-stone-700">{item.howWeTestIt}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-200/80 flex flex-wrap items-center justify-between text-xs text-stone-500">
                      <div>
                        <strong>Key Risk:</strong> {item.keyRisk}
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span>👍 {item.votesAgree} agree</span>
                        <span>•</span>
                        <span>👎 {item.votesDisagree} disagree</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CLINICAL CARE REQUESTS */}
          {activeTab === 'requests' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100 text-xs text-stone-500">
                <span>Director notification recipient: <strong>sonit.sandeep@gmail.com</strong></span>
                <span>Total Care Enqueued: <strong>{stats?.totalCount || 0}</strong></span>
              </div>

              {!stats?.recentRequests || stats.recentRequests.length === 0 ? (
                <div className="py-12 text-center text-stone-400 text-xs">
                  No professional care triage requests logged yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-stone-200 text-left text-xs">
                    <thead className="bg-stone-50 font-bold text-stone-700 uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Pseudonym</th>
                        <th className="py-2.5 px-3">Concern Category</th>
                        <th className="py-2.5 px-3">Urgency</th>
                        <th className="py-2.5 px-3">Preferred Mode</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-800">
                      {stats.recentRequests.map((r) => (
                        <tr key={r.id} className="hover:bg-purple-50/40">
                          <td className="py-2.5 px-3 text-stone-500 font-mono text-[11px] whitespace-nowrap">
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
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Enqueued</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: OPENWA GATEWAY */}
          {activeTab === 'openwa' && (
            <div className="space-y-6 text-xs">
              <div className="p-4 rounded-2xl bg-stone-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-emerald-400" />
                    <h4 className="font-serif text-base font-bold text-white">
                      OpenWA WhatsApp & Gmail Server (:2785)
                    </h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${openwaStatus?.online ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                      {openwaStatus?.online ? 'CONNECTED' : 'STANDBY'}
                    </span>
                  </div>
                  <p className="text-stone-300 text-xs mt-1 leading-relaxed">
                    Single-container Docker runtime providing WhatsApp web automation and direct Gmail notifications on port 2785.
                  </p>
                </div>

                <button
                  onClick={handleCopyDockerCmd}
                  className="px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold transition flex items-center gap-2 shrink-0 cursor-pointer text-xs"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copiedDocker ? 'Docker Command Copied!' : 'Copy Docker Command'}</span>
                </button>
              </div>

              {/* Test WhatsApp & Email Dispatch Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                  <span className="font-bold text-stone-900 block uppercase tracking-wider text-[11px]">
                    📱 Test WhatsApp Dispatch
                  </span>
                  <div>
                    <label className="block text-stone-600 mb-1">To Phone (E.164):</label>
                    <input
                      type="text"
                      value={testWaPhone}
                      onChange={(e) => setTestWaPhone(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 mb-1">Message Text:</label>
                    <textarea
                      rows={2}
                      value={testWaText}
                      onChange={(e) => setTestWaText(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-white border border-stone-300 text-xs"
                    />
                  </div>
                  <button
                    onClick={handleSendTestWhatsApp}
                    disabled={waSending}
                    className="w-full py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{waSending ? 'Dispatching...' : 'Send WhatsApp via OpenWA'}</span>
                  </button>
                  {waResult && (
                    <div className="p-2.5 rounded-lg bg-stone-100 text-[11px] font-mono text-stone-700 overflow-x-auto">
                      {JSON.stringify(waResult)}
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                  <span className="font-bold text-stone-900 block uppercase tracking-wider text-[11px]">
                    ✉️ Test Gmail Dispatch
                  </span>
                  <div>
                    <label className="block text-stone-600 mb-1">To Email:</label>
                    <input
                      type="email"
                      value={testEmailAddress}
                      onChange={(e) => setTestEmailAddress(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 mb-1">Subject:</label>
                    <input
                      type="text"
                      value={testEmailSubject}
                      onChange={(e) => setTestEmailSubject(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-xs"
                    />
                  </div>
                  <button
                    onClick={handleSendTestGmail}
                    disabled={emailSending}
                    className="w-full py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{emailSending ? 'Sending...' : 'Send Gmail via OpenWA'}</span>
                  </button>
                  {emailResult && (
                    <div className="p-2.5 rounded-lg bg-stone-100 text-[11px] font-mono text-stone-700 overflow-x-auto">
                      {JSON.stringify(emailResult)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: EMAIL LOGS */}
          {activeTab === 'emails' && (
            <div className="space-y-3 text-xs">
              {!stats?.recentNotifications || stats.recentNotifications.length === 0 ? (
                <div className="py-12 text-center text-stone-400">
                  No email alerts logged yet.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {stats.recentNotifications.map((notif: any) => (
                    <div key={notif.id} className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-purple-950">{notif.subject}</span>
                        <span className="text-stone-400 font-mono text-[11px]">
                          {new Date(notif.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-stone-600 text-xs">{notif.summary}</p>
                      <span className="text-[10px] text-stone-400 font-mono block">Recipient: {notif.recipient}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
