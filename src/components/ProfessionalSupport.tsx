import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  HeartHandshake,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Database,
  Mail,
  MessageSquare,
  Lock,
  BarChart3,
  Sparkles,
  PhoneCall,
  Video,
} from 'lucide-react';
import { UserProfile, ProfessionalStats } from '../types';

interface ProfessionalSupportProps {
  userProfile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onOpenAdminStats: () => void;
}

export const ProfessionalSupport: React.FC<ProfessionalSupportProps> = ({
  userProfile,
  onUpdateProfile,
  onOpenAdminStats,
}) => {
  const [concernType, setConcernType] = useState('Severe Anxiety & Panic');
  const [urgency, setUrgency] = useState('Within 24-48 hours');
  const [preferredMode, setPreferredMode] = useState('WhatsApp Chat & Voice');
  const [email, setEmail] = useState(userProfile.email || '');
  const [whatsapp, setWhatsapp] = useState(userProfile.whatsapp || '');
  const [notes, setNotes] = useState('');
  const [consent, setConsent] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<any | null>(null);
  const [stats, setStats] = useState<ProfessionalStats | null>(null);

  const concernOptions = [
    'Severe Anxiety & Panic',
    'Depression & Feeling Numb',
    'Postpartum Depression / Overwhelm',
    'Relationship Heartbreak & Trauma',
    'Grief, Loss & Bereavement',
    'Domestic Stress & Family Pressure',
    'Workplace Burnout & Imposter Syndrome',
    'Other Emotional Struggle',
  ];

  const urgencyOptions = [
    { label: 'Immediate (High Distress)', value: 'Immediate' },
    { label: 'Within 24-48 hours', value: 'Within 24-48 hours' },
    { label: 'Within 1-2 weeks', value: 'Within 1-2 weeks' },
    { label: 'Just exploring options', value: 'Just exploring' },
  ];

  const modeOptions = [
    { label: 'WhatsApp Confidential Chat', value: 'WhatsApp Chat & Voice', icon: MessageSquare },
    { label: 'Private 1-on-1 Video Session', value: '1-on-1 Private Video', icon: Video },
    { label: 'Audio Phone Call', value: 'Audio Phone Call', icon: PhoneCall },
  ];

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/professional-support/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      alert('Please confirm consent to be contacted.');
      return;
    }
    if (!whatsapp && !email) {
      alert('Please provide either your WhatsApp number or Email so we can reach you.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/professional-support/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pseudonym: userProfile.pseudonym,
          email,
          whatsapp,
          concernType,
          urgency,
          notes,
          preferredMode,
          consentContact: consent,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedSuccess(data);
        onUpdateProfile({ email, whatsapp });
        fetchStats();
      } else {
        alert(data.error || 'Failed to submit request.');
      }
    } catch (err) {
      console.error('Error submitting professional support request:', err);
      alert('Network issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-900 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
          <HeartHandshake className="w-4 h-4 text-purple-700" />
          <span>Licensed Professional Care • Coming Soon Priority Queue</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 leading-tight">
          When Venting Isn't Enough: Connect with Licensed Female Counselors
        </h2>
        <p className="mt-3 text-stone-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          We are partnering with accredited female clinical psychologists, trauma therapists, and postpartum specialists.
          Record your request in our private triage database to get early priority access and notify our clinical care director.
        </p>
      </div>

      {/* Success Confirmation View */}
      {submittedSuccess ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-300 shadow-lg text-center max-w-2xl mx-auto my-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-stone-900">
            Your Request is Confirmed in Our Database
          </h3>
          <p className="mt-2 text-stone-600 text-sm leading-relaxed">
            Thank you, <span className="font-bold text-stone-800">{userProfile.pseudonym}</span>.
            Your care request (ID: <code className="text-xs bg-stone-100 px-2 py-0.5 rounded font-mono text-stone-800">{submittedSuccess.requestId}</code>) has been recorded with priority triage.
          </p>

          <div className="mt-5 p-4 rounded-2xl bg-purple-50 border border-purple-200 text-left text-xs sm:text-sm text-purple-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-purple-900">
              <Mail className="w-4 h-4 text-purple-700" />
              <span>Notification Dispatched to Care Director</span>
            </div>
            <p className="text-xs text-purple-900">
              An alert email has been dispatched to <strong>{submittedSuccess.notifiedEmail}</strong> with your urgency level ({urgency}) and preferred mode ({preferredMode}) so our team can prioritize matching you.
            </p>
          </div>

          <button
            onClick={() => setSubmittedSuccess(null)}
            className="mt-6 px-6 py-2.5 rounded-full bg-purple-700 text-white font-semibold text-xs sm:text-sm hover:bg-purple-800 transition cursor-pointer"
          >
            Submit Another Request or Update Details
          </button>
        </div>
      ) : (
        /* Intake Form */
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-200 shadow-md shadow-purple-100/50 mb-10"
        >
          <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-semibold text-stone-700">
                100% Confidential & Secure Database Submission
              </span>
            </div>
            <span className="text-xs text-stone-400">Zero Public Display</span>
          </div>

          {/* 1. Primary Concern */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
              1. What is your primary emotional or mental health concern?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { label: 'Severe Anxiety & Panic', theme: 'border-purple-200 bg-purple-50/50 hover:border-purple-400 text-purple-950' },
                { label: 'Depression & Feeling Numb', theme: 'border-indigo-200 bg-indigo-50/50 hover:border-indigo-400 text-indigo-950' },
                { label: 'Postpartum Depression / Overwhelm', theme: 'border-rose-200 bg-rose-50/50 hover:border-rose-400 text-rose-950' },
                { label: 'Relationship Heartbreak & Trauma', theme: 'border-fuchsia-200 bg-fuchsia-50/50 hover:border-fuchsia-400 text-fuchsia-950' },
                { label: 'Grief, Loss & Bereavement', theme: 'border-sky-200 bg-sky-50/50 hover:border-sky-400 text-sky-950' },
                { label: 'Domestic Stress & Family Pressure', theme: 'border-violet-200 bg-violet-50/50 hover:border-violet-400 text-violet-950' },
                { label: 'Workplace Burnout & Imposter Syndrome', theme: 'border-amber-200 bg-amber-50/50 hover:border-amber-400 text-amber-950' },
                { label: 'Other Emotional Struggle', theme: 'border-emerald-200 bg-emerald-50/50 hover:border-emerald-400 text-emerald-950' },
              ].map(({ label, theme }) => (
                <button
                  type="button"
                  key={label}
                  onClick={() => setConcernType(label)}
                  className={`p-3 rounded-2xl text-xs font-medium text-left border-2 transition cursor-pointer ${
                    concernType === label
                      ? 'bg-purple-100/90 border-purple-600 text-purple-950 font-bold shadow-xs ring-2 ring-purple-400/30'
                      : `${theme}`
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Urgency Level */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
              2. How urgent is your need for professional support?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { label: 'Immediate (High Distress)', value: 'Immediate', isPriority: true, theme: 'bg-rose-50/60 border-rose-200 hover:border-rose-400 text-rose-950' },
                { label: 'Within 24-48 hours', value: 'Within 24-48 hours', theme: 'bg-amber-50/60 border-amber-200 hover:border-amber-400 text-amber-950' },
                { label: 'Within 1-2 weeks', value: 'Within 1-2 weeks', theme: 'bg-purple-50/60 border-purple-200 hover:border-purple-400 text-purple-950' },
                { label: 'Just exploring options', value: 'Just exploring', theme: 'bg-emerald-50/60 border-emerald-200 hover:border-emerald-400 text-emerald-950' },
              ].map((u) => (
                <button
                  type="button"
                  key={u.value}
                  onClick={() => setUrgency(u.value)}
                  className={`p-3 rounded-2xl text-xs font-medium text-left border-2 transition cursor-pointer flex items-center justify-between ${
                    urgency === u.value
                      ? 'bg-purple-100/90 border-purple-600 text-purple-950 font-bold shadow-xs ring-2 ring-purple-400/30'
                      : `${u.theme}`
                  }`}
                >
                  <span>{u.label}</span>
                  {u.isPriority && (
                    <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold border border-red-200">
                      Priority
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Preferred Mode with Distinct Aesthetic Palettes */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
              3. Preferred Consultation Format
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  label: 'WhatsApp Confidential Chat',
                  value: 'WhatsApp Chat & Voice',
                  icon: MessageSquare,
                  theme: 'bg-emerald-50/80 border-emerald-200/90 hover:border-emerald-400 text-emerald-950',
                  iconColor: 'text-emerald-600',
                  active: 'bg-emerald-100/90 border-emerald-600 ring-2 ring-emerald-400/30',
                },
                {
                  label: 'Private 1-on-1 Video Session',
                  value: '1-on-1 Private Video',
                  icon: Video,
                  theme: 'bg-purple-50/80 border-purple-200/90 hover:border-purple-400 text-purple-950',
                  iconColor: 'text-purple-600',
                  active: 'bg-purple-100/90 border-purple-600 ring-2 ring-purple-400/30',
                },
                {
                  label: 'Audio Phone Call',
                  value: 'Audio Phone Call',
                  icon: PhoneCall,
                  theme: 'bg-amber-50/80 border-amber-200/90 hover:border-amber-400 text-amber-950',
                  iconColor: 'text-amber-600',
                  active: 'bg-amber-100/90 border-amber-600 ring-2 ring-amber-400/30',
                },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = preferredMode === m.value;
                return (
                  <button
                    type="button"
                    key={m.value}
                    onClick={() => setPreferredMode(m.value)}
                    className={`p-3.5 rounded-2xl text-xs font-semibold text-center border-2 transition cursor-pointer flex flex-col items-center gap-2 shadow-2xs ${
                      isSelected ? m.active : m.theme
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-2xs">
                      <Icon className={`w-4 h-4 ${m.iconColor}`} />
                    </div>
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                WhatsApp Number (with country code)
              </label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+1 (555) 000-0000 or +91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-xl bg-purple-50/40 border border-stone-200 text-sm focus:border-purple-400 focus:bg-white focus:outline-hidden"
              />
              <p className="text-[11px] text-stone-400 mt-1">
                Used for confidential session coordination and gentle check-ins.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sister.contact@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-purple-50/40 border border-stone-200 text-sm focus:border-purple-400 focus:bg-white focus:outline-hidden"
              />
              <p className="text-[11px] text-stone-400 mt-1">
                For therapist credentials and booking confirmations.
              </p>
            </div>
          </div>

          {/* 5. Notes */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
              Any brief context or therapist preferences? (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. 'Prefer someone experienced with postpartum depression and birth trauma', or 'Need evening appointments'..."
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl bg-purple-50/40 border border-stone-200 text-sm focus:border-purple-400 focus:bg-white focus:outline-hidden resize-none"
            />
          </div>

          {/* Consent */}
          <div className="mb-6 p-3 rounded-xl bg-purple-50/70 border border-purple-200">
            <label className="flex items-start gap-2.5 text-xs text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 rounded text-purple-600 focus:ring-purple-500"
              />
              <span>
                I agree to be anonymously triaged and contacted via WhatsApp/Email when licensed counselors are onboarded. I understand that for immediate life-threatening crises, I should call local emergency numbers (988 in the US/Canada or 112 in Europe/India).
              </span>
            </label>
          </div>

          {/* Submit */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-stone-500">
              Dispatches automated alert to platform facilitator database.
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-3 px-8 rounded-full bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-semibold text-sm transition flex items-center gap-2 shadow-md shadow-purple-200 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Recording Request...' : 'Join Care Triage (Record Need)'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Real-time Care Need Database Dashboard */}
      <div className="bg-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-800">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-purple-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-800 border border-purple-600 flex items-center justify-center text-purple-300">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold">
                Community Mental Health Need Tracker
              </h3>
              <p className="text-xs text-purple-300">
                Live database metrics recording how many sisters require professional counseling.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenAdminStats}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-900 hover:bg-purple-800 text-purple-200 hover:text-white text-xs font-semibold border border-purple-700 transition cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
            <span>Open Database Logs & Email Audit</span>
          </button>
        </div>

        {/* Metrics Grid with Distinct Aesthetic Jewel Colors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Card 1: Amethyst Violet */}
          <div className="bg-gradient-to-br from-purple-900/90 via-violet-950 to-indigo-950 p-5 rounded-3xl border-2 border-purple-500/70 shadow-lg shadow-purple-950/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-purple-300 bg-purple-800/80 px-2 py-0.5 rounded-full border border-purple-600/50">
                AMETHYST • QUEUE
              </span>
            </div>
            <span className="text-xs text-purple-200 uppercase font-semibold tracking-wider block mt-2">
              Total Care Requests Logged
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">
                {stats?.totalCount || 0}
              </span>
              <span className="text-xs text-purple-300">women recorded</span>
            </div>
          </div>

          {/* Card 2: Sunset Amber Topaz */}
          <div className="bg-gradient-to-br from-amber-950/90 via-orange-950 to-stone-950 p-5 rounded-3xl border-2 border-amber-500/70 shadow-lg shadow-amber-950/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-200 bg-amber-900/80 px-2 py-0.5 rounded-full border border-amber-600/50">
                TOPAZ • PRIORITY
              </span>
            </div>
            <span className="text-xs text-amber-200 uppercase font-semibold tracking-wider block mt-2">
              Immediate High Distress
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-200">
                {stats?.urgencyBreakdown?.['Immediate'] || 0}
              </span>
              <span className="text-xs text-amber-300">urgent triage</span>
            </div>
          </div>

          {/* Card 3: Emerald Oasis */}
          <div className="bg-gradient-to-br from-emerald-950/90 via-teal-950 to-stone-950 p-5 rounded-3xl border-2 border-emerald-500/70 shadow-lg shadow-emerald-950/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-200 bg-emerald-900/80 px-2 py-0.5 rounded-full border border-emerald-600/50">
                EMERALD • DISPATCH
              </span>
            </div>
            <span className="text-xs text-emerald-200 uppercase font-semibold tracking-wider block mt-2">
              Director Alert Notification
            </span>
            <div className="mt-2">
              <span className="text-xs font-mono text-emerald-300 break-all block font-bold">
                {stats?.targetNotificationEmail || 'sonit.sandeep@gmail.com'}
              </span>
              <span className="text-[11px] text-emerald-300 mt-1 block">
                {stats?.notificationsSentCount || 0} dispatch records
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown by Concern */}
        {stats?.concernBreakdown && Object.keys(stats.concernBreakdown).length > 0 && (
          <div className="bg-purple-900/40 p-4 rounded-2xl border border-purple-800">
            <span className="text-xs text-purple-300 uppercase font-bold tracking-wider mb-3 block">
              Breakdown by Top Requested Specializations
            </span>
            <div className="space-y-2">
              {Object.entries(stats.concernBreakdown).map(([concern, count]) => {
                const percent = Math.round((count / (stats.totalCount || 1)) * 100);
                return (
                  <div key={concern} className="text-xs">
                    <div className="flex justify-between text-purple-200 mb-1">
                      <span>{concern}</span>
                      <span className="font-bold text-purple-300">
                        {count} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-purple-950 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-purple-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
