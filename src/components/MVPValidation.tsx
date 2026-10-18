import React, { useState, useEffect } from 'react';
import {
  Vote,
  Sparkles,
  CheckCircle2,
  Send,
  MessageSquare,
  Mail,
  ShieldCheck,
  Heart,
  Headphones,
  Compass,
  BookOpen,
  Calendar,
  Lock,
  Users,
  UserCheck,
  ArrowRight,
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

const MVP_FEATURE_OPTIONS = [
  {
    id: 'live_voice',
    title: 'Live Voice-to-Voice Listener',
    desc: 'Real-time phone-like voice conversation with a gentle empathetic companion.',
    icon: Headphones,
    category: 'Empathy',
    colorName: 'Lavender Mist',
    style: {
      cardNormal: 'bg-gradient-to-br from-purple-50/80 via-white to-violet-50/50 border-purple-200/90 hover:border-purple-400',
      cardSelected: 'bg-gradient-to-br from-purple-100/90 via-purple-50 to-violet-100/80 border-purple-500 shadow-md shadow-purple-100 ring-2 ring-purple-400/40',
      iconBoxNormal: 'bg-purple-100 text-purple-700',
      iconBoxSelected: 'bg-purple-600 text-white shadow-xs',
      badge: 'bg-purple-100 text-purple-900 border-purple-200',
      titleColor: 'text-purple-950',
    },
  },
  {
    id: 'whatsapp_daily',
    title: 'Daily WhatsApp Evening Check-in (8 PM)',
    desc: 'A gentle 30-second audio breath & mindfulness prompt sent directly to your WhatsApp each night.',
    icon: MessageSquare,
    category: 'Daily Care',
    colorName: 'Matcha Mint',
    style: {
      cardNormal: 'bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/50 border-emerald-200/90 hover:border-emerald-400',
      cardSelected: 'bg-gradient-to-br from-emerald-100/90 via-emerald-50 to-teal-100/80 border-emerald-500 shadow-md shadow-emerald-100 ring-2 ring-emerald-400/40',
      iconBoxNormal: 'bg-emerald-100 text-emerald-700',
      iconBoxSelected: 'bg-emerald-600 text-white shadow-xs',
      badge: 'bg-emerald-100 text-emerald-900 border-emerald-200',
      titleColor: 'text-emerald-950',
    },
  },
  {
    id: 'licensed_therapy',
    title: 'Licensed Female Therapy Network',
    desc: 'Affordable, accredited female trauma, postpartum, and career counselors on demand.',
    icon: ShieldCheck,
    category: 'Clinical',
    colorName: 'Rose Quartz',
    style: {
      cardNormal: 'bg-gradient-to-br from-rose-50/80 via-white to-pink-50/50 border-rose-200/90 hover:border-rose-400',
      cardSelected: 'bg-gradient-to-br from-rose-100/90 via-rose-50 to-pink-100/80 border-rose-500 shadow-md shadow-rose-100 ring-2 ring-rose-400/40',
      iconBoxNormal: 'bg-rose-100 text-rose-700',
      iconBoxSelected: 'bg-rose-600 text-white shadow-xs',
      badge: 'bg-rose-100 text-rose-900 border-rose-200',
      titleColor: 'text-rose-950',
    },
  },
  {
    id: 'anonymous_journal',
    title: 'Private Encrypted Emotional Journal',
    desc: 'Voice & text journal that tracks your emotional healing trajectory with gentle monthly insights.',
    icon: BookOpen,
    category: 'Self-Care',
    colorName: 'Honey Amber',
    style: {
      cardNormal: 'bg-gradient-to-br from-amber-50/80 via-white to-orange-50/50 border-amber-200/90 hover:border-amber-400',
      cardSelected: 'bg-gradient-to-br from-amber-100/90 via-amber-50 to-orange-100/80 border-amber-500 shadow-md shadow-amber-100 ring-2 ring-amber-400/40',
      iconBoxNormal: 'bg-amber-100 text-amber-700',
      iconBoxSelected: 'bg-amber-600 text-white shadow-xs',
      badge: 'bg-amber-100 text-amber-900 border-amber-200',
      titleColor: 'text-amber-950',
    },
  },
  {
    id: 'sister_circles',
    title: 'Weekly 15-Min Live Audio Circles',
    desc: 'Small, camera-off voice circles where 4-5 verified sisters share and hold space together.',
    icon: Calendar,
    category: 'Sisterhood',
    colorName: 'Cornflower Blue',
    style: {
      cardNormal: 'bg-gradient-to-br from-sky-50/80 via-white to-indigo-50/50 border-sky-200/90 hover:border-sky-400',
      cardSelected: 'bg-gradient-to-br from-sky-100/90 via-sky-50 to-indigo-100/80 border-sky-500 shadow-md shadow-sky-100 ring-2 ring-sky-400/40',
      iconBoxNormal: 'bg-sky-100 text-sky-700',
      iconBoxSelected: 'bg-sky-600 text-white shadow-xs',
      badge: 'bg-sky-100 text-sky-900 border-sky-200',
      titleColor: 'text-sky-950',
    },
  },
  {
    id: 'mentor_matching',
    title: '1-on-1 Peer Sister Mentorship',
    desc: 'Get paired with a sister who has already navigated and healed from your exact situation.',
    icon: Heart,
    category: 'Mentorship',
    colorName: 'Mauve Orchid',
    style: {
      cardNormal: 'bg-gradient-to-br from-fuchsia-50/80 via-white to-purple-50/50 border-fuchsia-200/90 hover:border-fuchsia-400',
      cardSelected: 'bg-gradient-to-br from-fuchsia-100/90 via-fuchsia-50 to-purple-100/80 border-fuchsia-500 shadow-md shadow-fuchsia-100 ring-2 ring-fuchsia-400/40',
      iconBoxNormal: 'bg-fuchsia-100 text-fuchsia-700',
      iconBoxSelected: 'bg-fuchsia-600 text-white shadow-xs',
      badge: 'bg-fuchsia-100 text-fuchsia-900 border-fuchsia-200',
      titleColor: 'text-fuchsia-950',
    },
  },
];

export const MVPValidation: React.FC<MVPValidationProps> = ({
  userProfile,
  onUpdateProfile,
  onOpenPricing,
  onOpenVerification,
}) => {
  // Survey responses
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
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'live_voice',
    'whatsapp_daily',
    'licensed_therapy',
  ]);
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState(userProfile.email || '');
  const [whatsapp, setWhatsapp] = useState(userProfile.whatsapp || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [stats, setStats] = useState<{
    totalCount: number;
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

  const toggleFeature = (id: string) => {
    if (selectedFeatures.includes(id)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== id));
    } else {
      setSelectedFeatures([...selectedFeatures, id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const featureTitles = selectedFeatures.map(
        (id) => MVP_FEATURE_OPTIONS.find((opt) => opt.id === id)?.title || id
      );

      const res = await fetch('/api/early-adopter/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pseudonym: userProfile.pseudonym,
          email,
          whatsapp,
          willingProfessionalHelp,
          willingJoinCircles,
          preferredEngagement,
          featuresVoted: featureTitles,
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
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-purple-600 block mb-2">
          EARLY ADOPTER VOICE & FEEDBACK
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
          Shape HerSanctuary Before Launch
        </h2>
        <p className="mt-3 text-sm sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
          We are designing this sanctuary for women across all life stages. Tell us how you want to be supported, whether you need professional counseling, and how you would engage most comfortably.
        </p>

        {stats && stats.totalCount > 0 && (
          <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-3 text-xs bg-purple-50 px-4 py-2 rounded-full border border-purple-200">
            <span className="text-purple-900 font-semibold">
              🌸 {stats.totalCount} sisters responded
            </span>
            <span>•</span>
            <span className="text-emerald-700 font-bold">
              {stats.willingProfPercent}% want professional counseling option
            </span>
            <span>•</span>
            <span className="text-purple-700 font-bold">
              {stats.willingCirclesPercent}% want anonymous life-stage circles
            </span>
          </div>
        )}
      </div>

      {submitted ? (
        <div className="bg-white rounded-3xl p-8 border border-purple-200 shadow-xl text-center max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-stone-900">
            Thank You, Sister!
          </h3>
          <p className="mt-2 text-stone-600 text-sm leading-relaxed">
            Your preferences, <strong className="text-purple-900">🌸 {userProfile.pseudonym}</strong>, have been recorded and shared directly with our founding team.
          </p>
          <div className="mt-6 p-4 rounded-2xl bg-purple-50 text-left text-xs text-purple-900 space-y-1.5 border border-purple-200">
            <p className="font-bold">What happens next:</p>
            <p>• Your feedback determines which life-stage circles and counseling layers open first.</p>
            <p>• We will contact you via {whatsapp || email || 'the portal'} when VIP early access begins.</p>
            <p>• Your identity remains 100% anonymous under your protected pseudonym.</p>
          </div>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-6 px-6 py-2 rounded-full bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold transition cursor-pointer"
          >
            Update Your Preferences
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm">
          {/* Question 1: Professional Support Willingness */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80">
            <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
              1. Would you be willing to take professional 1-on-1 support (licensed female counselors / therapists)?
            </label>
            <p className="text-xs text-stone-500 mb-3.5">
              Testing demand for accredited female clinical counseling alongside peer sisterhood.
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

            {onOpenPricing && (
              <div className="mt-3 text-right">
                <button
                  type="button"
                  onClick={onOpenPricing}
                  className="text-xs text-purple-700 hover:text-purple-900 font-semibold underline cursor-pointer"
                >
                  View Proposed Therapy & Buddy Pricing ($/₹) →
                </button>
              </div>
            )}
          </div>

          {/* Question 2: Sister Circles Willingness */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80">
            <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
              2. Would you join an anonymous sister circle with women in your specific life stage?
            </label>
            <p className="text-xs text-stone-500 mb-3.5">
              Circles for working women, career returners, mothers, teens, divorce healing, single life, and bereavement.
            </p>

            <div className="space-y-2 text-xs">
              {[
                'Yes, definitely (Working women, mothers, students, divorce circles)',
                'Maybe — provided it is 100% anonymous with verified zero trolls',
                'Prefer 1-on-1 private listening only',
                'No, community forums are not for me',
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

          {/* Question 3: Preferred Ways to Engage */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                3. How would you engage most comfortably? (Select all that apply)
              </label>
              <span className="text-xs text-purple-700 font-semibold">
                {preferredEngagement.length} selected
              </span>
            </div>
            <p className="text-xs text-stone-500 mb-3.5">
              Help us build daily habits that feel soothing rather than burdensome.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {[
                'Daily 8 PM gentle WhatsApp breath & reflection',
                'On-demand venting whenever feelings get heavy',
                'Weekly 1-on-1 emotional buddy check-in',
                'Weekly 15-minute camera-off live audio circles',
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

          {/* Question 4: Upcoming Features Wishlist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                4. Which upcoming features are most important to you?
              </label>
              <span className="text-xs text-purple-700 font-semibold">
                {selectedFeatures.length} selected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {MVP_FEATURE_OPTIONS.map((opt) => {
                const isSelected = selectedFeatures.includes(opt.id);
                const IconComponent = opt.icon;

                return (
                  <div
                    key={opt.id}
                    onClick={() => toggleFeature(opt.id)}
                    className={`p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                      isSelected ? opt.style.cardSelected : opt.style.cardNormal
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${opt.style.badge}`}>
                          {opt.category}
                        </span>
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                          isSelected ? opt.style.iconBoxSelected : opt.style.iconBoxNormal
                        }`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                      </div>
                      <h4 className={`font-serif font-bold text-sm mb-1 ${opt.style.titleColor}`}>
                        {opt.title}
                      </h4>
                      <p className="text-xs text-stone-600 font-light leading-relaxed">
                        {opt.desc}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-stone-200/50 flex items-center justify-between text-xs font-semibold">
                      <span className={isSelected ? 'text-purple-700' : 'text-stone-400'}>
                        {isSelected ? '✓ Voted' : '+ Vote for this'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Open Feedback */}
          <div>
            <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
              5. What would make this your safest healing sanctuary?
            </label>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell our founding team what would make you feel truly safe, understood, and willing to return..."
              className="w-full p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm focus:border-purple-400 focus:outline-hidden"
            />
          </div>

          {/* Contact Details (Optional) */}
          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 text-xs space-y-3">
            <span className="font-bold text-purple-950 block">
              Where should we send your private early-access invitation? (Optional)
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
              <span>You are signed in as <strong>🌸 {userProfile.pseudonym}</strong>. Contact details are never public.</span>
            </p>
          </div>

          <div className="text-center pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 rounded-full bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-purple-200 flex items-center justify-center gap-2 mx-auto cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Recording Your Preferences...' : 'Submit Early Adopter Preferences'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
