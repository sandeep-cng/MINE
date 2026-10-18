import React, { useState, useEffect } from 'react';
import {
  Vote,
  Sparkles,
  CheckCircle2,
  Send,
  MessageSquare,
  Mail,
  ShieldCheck,
  TrendingUp,
  Heart,
  Headphones,
  Compass,
  BookOpen,
  Calendar,
} from 'lucide-react';
import { UserProfile } from '../types';
import { LOFAMatrix } from './LOFAMatrix';

interface MVPValidationProps {
  userProfile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onOpenPricing: () => void;
  onOpenVerification: () => void;
  onStartVenting: () => void;
  onExploreCommunity: () => void;
}

const MVP_FEATURE_OPTIONS = [
  {
    id: 'live_voice',
    title: 'Live Voice-to-Voice AI Listener',
    desc: 'Real-time phone-like voice conversation with an empathetic AI listener (powered by Gemini Live).',
    icon: Headphones,
    category: 'AI Empathy',
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
    desc: 'Affordable, accredited female trauma, postpartum, and relationship counselors on demand.',
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
    desc: 'Get paired with a sister who has already navigated and healed from your exact same situation.',
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
  onStartVenting,
  onExploreCommunity,
}) => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'live_voice',
    'whatsapp_daily',
    'licensed_therapy',
  ]);
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState(userProfile.email || '');
  const [whatsapp, setWhatsapp] = useState(userProfile.whatsapp || '');
  const [interestLevel, setInterestLevel] = useState('Very High - Need this now');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [stats, setStats] = useState<{
    totalCount: number;
    featureVotes: Record<string, number>;
  } | null>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/mvp-interest/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data);
      }
    } catch (err) {
      console.warn('Failed to fetch MVP stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const toggleFeature = (id: string) => {
    if (selectedFeatures.includes(id)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== id));
    } else {
      setSelectedFeatures([...selectedFeatures, id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFeatures.length === 0) {
      alert('Please select at least one feature you would like to see.');
      return;
    }

    setIsSubmitting(true);
    try {
      const featureTitles = selectedFeatures.map(
        (id) => MVP_FEATURE_OPTIONS.find((opt) => opt.id === id)?.title || id
      );

      const res = await fetch('/api/mvp-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pseudonym: userProfile.pseudonym,
          email,
          whatsapp,
          featuresVoted: featureTitles,
          feedback,
          interestLevel,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        onUpdateProfile({ email, whatsapp });
        fetchStats();
      } else {
        alert(data.error || 'Failed to submit interest.');
      }
    } catch (err) {
      console.error('Failed to submit MVP interest:', err);
      alert('Network issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      {/* 1. Ranked Leap-of-Faith Assumptions Matrix */}
      <LOFAMatrix
        userProfile={userProfile}
        onOpenPricing={onOpenPricing}
        onOpenVerification={onOpenVerification}
        onStartVenting={onStartVenting}
        onExploreCommunity={onExploreCommunity}
      />

      {/* 2. Feature Wishlist & Early Adopter Priority Voting */}
      <div>
        <div className="text-center mb-8">
          <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-purple-600 block mb-2">
            EARLY ADOPTER FEATURE WISHLIST
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
            Help Us Shape the Upcoming Features
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-stone-600 max-w-xl mx-auto leading-relaxed">
            Vote for the features you need most in our next release and shape HerSanctuary.
          </p>
        </div>

      {submitted ? (
        <div className="bg-white rounded-3xl p-8 border border-purple-200 shadow-xl text-center max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-stone-900">
            Your Voice is Recorded!
          </h3>
          <p className="mt-2 text-stone-600 text-sm leading-relaxed">
            Thank you, <strong className="text-purple-900">🌸 {userProfile.pseudonym}</strong>.
            Your feature votes and feedback have been added to our founder backlog and emailed to our team.
          </p>
          <div className="mt-6 p-4 rounded-2xl bg-purple-50 text-left text-xs text-purple-900 space-y-1 border border-purple-200">
            <p className="font-bold">Next Steps for Early Adopters:</p>
            <p>• We will contact you via {whatsapp || email || 'your profile'} when the top voted features go live.</p>
            <p>• You have priority access to licensed therapy triage and free private sisterhood rooms.</p>
          </div>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-6 px-6 py-2 rounded-full bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold transition cursor-pointer"
          >
            Update Your Feature Votes
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Feature Wishlist Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                1. Which features would you use the most? (Select all that apply)
              </label>
              <span className="text-xs text-purple-700 font-semibold">
                {selectedFeatures.length} selected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MVP_FEATURE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedFeatures.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={() => toggleFeature(opt.id)}
                    className={`p-4.5 rounded-3xl border-2 transition-all duration-200 cursor-pointer flex items-start gap-3.5 relative overflow-hidden group ${
                      isSelected ? opt.style.cardSelected : opt.style.cardNormal
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                        isSelected ? opt.style.iconBoxSelected : opt.style.iconBoxNormal
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs font-bold leading-snug ${opt.style.titleColor}`}>
                          {opt.title}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${opt.style.badge}`}>
                          {opt.category}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-stone-600 leading-relaxed font-light">
                        {opt.desc}
                      </p>
                      <div className="mt-2.5 flex items-center justify-between text-[11px]">
                        <span className="text-[10px] text-stone-400 font-medium">
                          Palette: {opt.colorName}
                        </span>
                        <span
                          className={`font-semibold flex items-center gap-1 ${
                            isSelected ? 'text-stone-900 font-bold' : 'text-stone-400'
                          }`}
                        >
                          {isSelected ? '✓ Selected' : '+ Add Vote'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* User Feedback Question: What can be added? */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs">
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
              2. What else would bring you peace and emotional comfort? (Suggestions for MVP)
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="e.g. 'I wish there was a room for women dealing with narcissistic partners', or 'I need a panic attack SOS button with soothing sounds'..."
              rows={3}
              className="w-full p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm focus:border-purple-400 focus:bg-white focus:outline-hidden resize-none leading-relaxed"
            />
          </div>

          {/* Contact & Early Access */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                3. Early Access Notification (WhatsApp & Email)
              </label>
              <span className="text-xs text-stone-400">Kept strictly confidential</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  WhatsApp Number (with country code)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+1 (555) 000-0000 or +91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm focus:border-purple-400 focus:bg-white focus:outline-hidden"
                  />
                  <MessageSquare className="w-4 h-4 text-emerald-600 absolute right-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sister@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm focus:border-purple-400 focus:bg-white focus:outline-hidden"
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-600 font-medium">Interest Level:</span>
                <select
                  value={interestLevel}
                  onChange={(e) => setInterestLevel(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-800"
                >
                  <option>Very High - Need this now</option>
                  <option>Interested in joining</option>
                  <option>Just browsing / curious</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="py-2.5 px-6 rounded-full bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm transition flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Recording...' : 'Submit MVP Wishlist & Join'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Community Wishlist Live Stats */}
      {stats && stats.totalCount > 0 && (
        <div className="mt-12 p-6 rounded-3xl bg-purple-950 text-white border border-purple-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <h4 className="font-serif font-bold text-sm">
                Community MVP Wishlist Trends ({stats.totalCount} sisters polled)
              </h4>
            </div>
            <span className="text-xs text-purple-300">Live Validation</span>
          </div>

          <div className="space-y-2.5">
            {Object.entries(stats.featureVotes || {}).map(([feature, votes]) => {
              const percent = Math.round((votes / (stats.totalCount || 1)) * 100);
              return (
                <div key={feature} className="text-xs">
                  <div className="flex justify-between text-purple-200 mb-1">
                    <span>{feature}</span>
                    <span className="font-bold text-purple-300">{percent}% ({votes} votes)</span>
                  </div>
                  <div className="w-full bg-purple-900 h-1.5 rounded-full overflow-hidden">
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
