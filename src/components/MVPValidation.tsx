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

interface MVPValidationProps {
  userProfile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

const MVP_FEATURE_OPTIONS = [
  {
    id: 'live_voice',
    title: 'Live Voice-to-Voice AI Listener',
    desc: 'Real-time phone-like voice conversation with an empathetic AI listener (powered by Gemini Live).',
    icon: Headphones,
    category: 'AI Empathy',
  },
  {
    id: 'whatsapp_daily',
    title: 'Daily WhatsApp Evening Check-in (8 PM)',
    desc: 'A gentle 30-second audio breath & mindfulness prompt sent directly to your WhatsApp each night.',
    icon: MessageSquare,
    category: 'Daily Care',
  },
  {
    id: 'licensed_therapy',
    title: 'Licensed Female Therapy Network',
    desc: 'Affordable, accredited female trauma, postpartum, and relationship counselors on demand.',
    icon: ShieldCheck,
    category: 'Clinical',
  },
  {
    id: 'anonymous_journal',
    title: 'Private Encrypted Emotional Journal',
    desc: 'Voice & text journal that tracks your emotional healing trajectory with gentle monthly insights.',
    icon: BookOpen,
    category: 'Self-Care',
  },
  {
    id: 'sister_circles',
    title: 'Weekly 15-Min Live Audio Circles',
    desc: 'Small, camera-off voice circles where 4-5 verified sisters share and hold space together.',
    icon: Calendar,
    category: 'Sisterhood',
  },
  {
    id: 'mentor_matching',
    title: '1-on-1 Peer Sister Mentorship',
    desc: 'Get paired with a sister who has already navigated and healed from your exact same situation.',
    icon: Heart,
    category: 'Mentorship',
  },
];

export const MVPValidation: React.FC<MVPValidationProps> = ({
  userProfile,
  onUpdateProfile,
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
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Editorial Teaser Header (Inspired by mindful-brewing) */}
      <div className="text-center mb-10">
        <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-purple-600 block mb-2">
          EARLY ADOPTER VALIDATION
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
          Help Us Shape the Minimum Viable Product
        </h2>
        <p className="mt-3 text-sm sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
          We are currently testing our initial prototype with a private circle of women.
          Vote for the features you need most and tell us what would make this your safest healing sanctuary.
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {MVP_FEATURE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedFeatures.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={() => toggleFeature(opt.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-purple-50 border-purple-500 shadow-2xs'
                        : 'bg-white border-stone-200 hover:border-purple-200 hover:bg-purple-50/20'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition ${
                        isSelected
                          ? 'bg-purple-600 text-white'
                          : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900">{opt.title}</span>
                        <span className="text-[10px] text-purple-700 font-semibold bg-purple-100 px-2 py-0.5 rounded-full">
                          {opt.category}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-stone-600 leading-relaxed font-light">
                        {opt.desc}
                      </p>
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
  );
};
