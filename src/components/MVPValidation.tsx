import React, { useState, useEffect } from 'react';
import {
  Heart,
  CheckCircle2,
  Send,
  MessageSquare,
  Lock,
  Sparkles,
  Users,
  ShieldCheck,
  Calendar,
  Clock,
  Compass,
} from 'lucide-react';
import { UserProfile } from '../types';

interface MVPValidationProps {
  userProfile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onOpenPricing?: () => void;
  onOpenVerification?: () => void;
  onStartVenting?: () => void;
  onExploreCommunity?: () => void;
}

export const MVPValidation: React.FC<MVPValidationProps> = ({
  userProfile,
  onUpdateProfile,
  onStartVenting,
  onExploreCommunity,
}) => {
  // Survey responses centered around "Would you come back?"
  const [wouldComeBack, setWouldComeBack] = useState(
    'Yes, definitely (I would return weekly or whenever overwhelmed)'
  );
  const [willingProfessionalHelp, setWillingProfessionalHelp] = useState(
    'Yes, definitely (1-on-1 licensed female therapist)'
  );
  const [willingJoinCircles, setWillingJoinCircles] = useState(
    'Yes, definitely (Working women, mothers, students, divorce circles)'
  );
  const [preferredEngagement, setPreferredEngagement] = useState<string[]>([
    'Daily 8 PM gentle WhatsApp breath & reflection',
    'On-demand venting whenever feelings get heavy',
  ]);
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState(userProfile.email || '');
  const [whatsapp, setWhatsapp] = useState(userProfile.whatsapp || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [stats, setStats] = useState<{
    totalCount: number;
    wouldComeBackPercent?: number;
    willingProfPercent: number;
    willingCirclesPercent: number;
  } | null>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/early-adopter/feedback/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data);
      }
    } catch (err) {
      console.warn('Failed to fetch stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const toggleEngagement = (mode: string) => {
    if (preferredEngagement.includes(mode)) {
      setPreferredEngagement(preferredEngagement.filter((m) => m !== mode));
    } else {
      setPreferredEngagement([...preferredEngagement, mode]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/early-adopter/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pseudonym: userProfile.pseudonym,
          email,
          whatsapp,
          wouldComeBack,
          willingProfessionalHelp,
          willingJoinCircles,
          preferredEngagement,
          feedback,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        onUpdateProfile({ email, whatsapp });
        fetchStats();
      } else {
        alert(data.error || 'Failed to submit feedback.');
      }
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      alert('Network issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-900 text-xs font-semibold mb-3">
          <Heart className="w-3.5 h-3.5 fill-purple-600 text-purple-600" />
          <span>SISTER FEEDBACK & REFLECTION</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
          Would You Come Back to HerSanctuary?
        </h2>
        <p className="mt-3 text-sm sm:text-base text-stone-600 max-w-xl mx-auto leading-relaxed">
          We created this sanctuary to be a safe, comforting haven for women. Your honest thoughts help us understand whether this space truly supports you when life feels heavy.
        </p>

        {stats && stats.totalCount > 0 && (
          <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-2.5 text-xs bg-purple-50 px-4 py-2 rounded-full border border-purple-200">
            <span className="text-purple-950 font-bold">
              🌸 {stats.totalCount} sisters shared thoughts
            </span>
            <span>•</span>
            <span className="text-emerald-700 font-bold">
              {stats.wouldComeBackPercent ?? 95}% would return when overwhelmed
            </span>
            <span>•</span>
            <span className="text-purple-700 font-semibold">
              {stats.willingCirclesPercent}% want life-stage sister circles
            </span>
          </div>
        )}
      </div>

      {submitted ? (
        <div className="bg-white rounded-3xl p-8 border border-purple-200 shadow-xl text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-stone-900">
            Thank You, Sister!
          </h3>
          <p className="mt-2 text-stone-600 text-sm leading-relaxed">
            Your reflection, <strong className="text-purple-900">🌸 {userProfile.pseudonym}</strong>, has been received with warmth and gratitude.
          </p>
          <div className="mt-6 p-4 rounded-2xl bg-purple-50 text-left text-xs text-purple-900 space-y-2 border border-purple-200">
            <p className="font-bold">What your voice does:</p>
            <p>• Ensures HerSanctuary remains 100% anonymous, tender, and safe for all women.</p>
            <p>• Guides which life-stage circles (working women, mothers, students, divorce) open next.</p>
            <p>• Your identity stays completely confidential under your protected pseudonym.</p>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSubmitted(false)}
              className="px-5 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition cursor-pointer"
            >
              Edit Your Answers
            </button>
            {onStartVenting && (
              <button
                onClick={onStartVenting}
                className="px-5 py-2 rounded-full bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold transition cursor-pointer"
              >
                Talk to Your Assistant Ananya
              </button>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm">
          {/* Question 1: Would you come back? (The Core Question!) */}
          <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200/90">
            <label className="block text-xs font-bold text-purple-950 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 fill-purple-700 text-purple-700" />
              <span>1. Would you come back to HerSanctuary?</span>
            </label>
            <p className="text-xs text-stone-600 mb-3.5">
              When you feel exhausted, heartbroken, carrying heavy thoughts, or burnt out, would you return to this space?
            </p>

            <div className="space-y-2 text-xs">
              {[
                'Yes, definitely (I would return weekly or whenever overwhelmed)',
                'Yes, whenever I need to vent with your assistant Ananya or do CBT calming',
                'Only during acute life crisis (heartbreak, divorce, postpartum, grief, job loss)',
                'Undecided / Depends on community safety, anonymity, and warmth',
              ].map((opt) => (
                <label
                  key={opt}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition cursor-pointer ${
                    wouldComeBack === opt
                      ? 'bg-purple-100/90 border-purple-500 text-purple-950 font-bold shadow-2xs'
                      : 'bg-white border-stone-200 text-stone-700 hover:border-purple-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="wouldComeBack"
                    checked={wouldComeBack === opt}
                    onChange={() => setWouldComeBack(opt)}
                    className="accent-purple-700"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Question 2: Professional Support */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80">
            <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
              <span>2. Would you take professional 1-on-1 support (licensed female counselors / therapists)?</span>
            </label>
            <p className="text-xs text-stone-500 mb-3.5">
              Confidential clinical guidance alongside gentle peer sisterhood.
            </p>

            <div className="space-y-2 text-xs">
              {[
                'Yes, definitely (1-on-1 licensed female therapist)',
                'Only during acute crisis or major life transitions (heartbreak, divorce, postpartum)',
                'Prefer free sister circles and self-guided CBT exercises only',
                'Not right now / Undecided',
              ].map((opt) => (
                <label
                  key={opt}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition cursor-pointer ${
                    willingProfessionalHelp === opt
                      ? 'bg-purple-50/80 border-purple-400 text-purple-950 font-semibold'
                      : 'bg-white border-stone-200 text-stone-700 hover:border-purple-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="willingProfessionalHelp"
                    checked={willingProfessionalHelp === opt}
                    onChange={() => setWillingProfessionalHelp(opt)}
                    className="accent-purple-700"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Question 3: Sister Circles */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80">
            <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-700" />
              <span>3. Would you join an anonymous sister circle with women in your specific life stage?</span>
            </label>
            <p className="text-xs text-stone-500 mb-3.5">
              Confidential spaces for working women, mothers, students, divorce healing, single life, and career returners.
            </p>

            <div className="space-y-2 text-xs">
              {[
                'Yes, definitely (Working women, mothers, students, divorce circles)',
                'Maybe — provided it stays 100% anonymous with verified zero trolls',
                'Prefer 1-on-1 private emotional space only',
                'No, group circles are not for me',
              ].map((opt) => (
                <label
                  key={opt}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition cursor-pointer ${
                    willingJoinCircles === opt
                      ? 'bg-purple-50/80 border-purple-400 text-purple-950 font-semibold'
                      : 'bg-white border-stone-200 text-stone-700 hover:border-purple-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="willingJoinCircles"
                    checked={willingJoinCircles === opt}
                    onChange={() => setWillingJoinCircles(opt)}
                    className="accent-purple-700"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Question 4: Preferred Engagement Modes */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-700" />
                <span>4. How would you engage most comfortably? (Select all that apply)</span>
              </label>
              <span className="text-xs text-purple-700 font-semibold">
                {preferredEngagement.length} selected
              </span>
            </div>
            <p className="text-xs text-stone-500 mb-3.5">
              Tell us how you would like to connect and receive comfort.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                'Daily 8 PM gentle WhatsApp breath & reflection',
                'On-demand venting whenever feelings get heavy',
                'Weekly 1-on-1 emotional buddy check-in',
                'Weekly 15-minute camera-off voice circles',
                'Private encrypted emotional healing journal',
                'Peer mentorship with a sister who overcame the same pain',
              ].map((mode) => {
                const isChecked = preferredEngagement.includes(mode);
                return (
                  <div
                    key={mode}
                    onClick={() => toggleEngagement(mode)}
                    className={`p-3 rounded-xl border transition cursor-pointer flex items-center gap-2.5 ${
                      isChecked
                        ? 'bg-purple-50 border-purple-400 text-purple-950 font-semibold'
                        : 'bg-white border-stone-200 text-stone-700 hover:border-purple-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="accent-purple-700"
                    />
                    <span>{mode}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Question 5: What would make you come back? */}
          <div>
            <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
              5. What would make you truly want to come back?
            </label>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What would give you the deepest emotional comfort, peace, or relief whenever you return? Tell us anything that comes to heart..."
              className="w-full p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm focus:border-purple-400 focus:outline-hidden"
            />
          </div>

          {/* Contact Details (Optional) */}
          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 text-xs space-y-3">
            <span className="font-bold text-purple-950 block">
              Want us to notify you when new sister circles launch? (Optional)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-600 mb-1">WhatsApp Number:</label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+1 or +91..."
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-200 focus:outline-purple-600"
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-1">Email Address:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sister@example.com"
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-200 focus:outline-purple-600"
                />
              </div>
            </div>
            <p className="text-[11px] text-purple-800 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-purple-600" />
              <span>You are signed in as <strong>🌸 {userProfile.pseudonym}</strong>. Real details are 100% private.</span>
            </p>
          </div>

          <div className="text-center pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 rounded-full bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-purple-200 flex items-center justify-center gap-2 mx-auto cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Recording Your Voice...' : 'Share My Reflection'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
