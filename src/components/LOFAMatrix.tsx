import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  ArrowRight,
  CreditCard,
  Video,
  Clock,
  Users,
  Heart,
  HelpCircle,
  Zap,
  Target,
  RefreshCw,
} from 'lucide-react';
import { LeapOfFaithAssumption, UserProfile } from '../types';
import { INITIAL_LEAP_OF_FAITH_ASSUMPTIONS } from '../data/circlesData';

interface LOFAMatrixProps {
  userProfile: UserProfile;
  onOpenPricing: () => void;
  onOpenVerification: () => void;
  onStartVenting: () => void;
  onExploreCommunity: () => void;
}

export const LOFAMatrix: React.FC<LOFAMatrixProps> = ({
  userProfile,
  onOpenPricing,
  onOpenVerification,
  onStartVenting,
  onExploreCommunity,
}) => {
  const [assumptions, setAssumptions] = useState<LeapOfFaithAssumption[]>(
    INITIAL_LEAP_OF_FAITH_ASSUMPTIONS as LeapOfFaithAssumption[]
  );
  const [votedMap, setVotedMap] = useState<Record<string, 'agree' | 'disagree'>>({});
  const [activeFilter, setActiveFilter] = useState<'all' | 'financial' | 'behavioral'>('all');
  const [viewMode, setViewMode] = useState<'matrix' | 'venture_analogy'>('matrix');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch('/api/lofa/stats');
      const data = await res.json();
      if (data.success && data.lofas) {
        setAssumptions(data.lofas);
      }
    } catch (e) {
      console.warn('Using initial LOFA assumptions:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleVote = async (lofaId: string, vote: 'agree' | 'disagree') => {
    if (votedMap[lofaId]) return;

    setVotedMap((prev) => ({ ...prev, [lofaId]: vote }));

    // Optimistic update
    setAssumptions((prev) =>
      prev.map((item) => {
        if (item.id === lofaId) {
          const agree = item.votesAgree + (vote === 'agree' ? 1 : 0);
          const disagree = item.votesDisagree + (vote === 'disagree' ? 1 : 0);
          const total = agree + disagree;
          return {
            ...item,
            votesAgree: agree,
            votesDisagree: disagree,
            confidenceScore: Math.round((agree / total) * 100),
          };
        }
        return item;
      })
    );

    try {
      await fetch('/api/lofa/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lofaId, vote, pseudonym: userProfile.pseudonym }),
      });
    } catch (e) {
      console.error('Failed to submit LOFA vote:', e);
    }
  };

  const filteredAssumptions = assumptions.filter((item) => {
    if (activeFilter === 'financial') return item.category === 'Willingness to Pay';
    if (activeFilter === 'behavioral') return item.category !== 'Willingness to Pay';
    return true;
  });

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8">
      {/* Header with clear Venture Validation Purpose */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200">
              Venture Hypotheses • MVP Validation Matrix
            </span>
            <span className="text-[11px] text-stone-500 font-medium">Ranked 1 to 5</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Leap-of-Faith Assumptions (LOFA)
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
            Just as Uber tested whether <em>"people will get into a car with a stranger"</em>,
            HerSanctuary tests 5 fundamental assumptions that make or break our women-only emotional wellness platform.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            onClick={() => setViewMode(viewMode === 'matrix' ? 'venture_analogy' : 'matrix')}
            className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>{viewMode === 'matrix' ? 'How It Maps to Venture' : 'View Ranked List'}</span>
          </button>
          <button
            onClick={fetchStats}
            disabled={isRefreshing}
            className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 transition cursor-pointer"
            title="Refresh Live Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Venture Analogy Spotlight Card */}
      {viewMode === 'venture_analogy' && (
        <div className="my-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-purple-900 via-indigo-950 to-purple-950 text-white shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300">
              HOW OUR VENTURE IS ANALOGOUS
            </span>
            <span className="text-xs text-purple-200">Anti-Slop Clean Venture Architecture</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-purple-100">
            <div className="p-4 rounded-xl bg-purple-800/40 border border-purple-700/50 space-y-2">
              <p className="font-bold text-white text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-300" />
                <span>The Core Wedge: Structured CBT Companion</span>
              </p>
              <p className="leading-relaxed text-purple-200">
                A <strong>free AI chat companion built on structured CBT exercises</strong> (Thought records, somatic 5-4-3-2-1 grounding, reframing), rather than endless wandering chat. The first interaction builds immediate trust through complete anonymity and authentic emotional relief.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-purple-800/40 border border-purple-700/50 space-y-2">
              <p className="font-bold text-white text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-300" />
                <span>The Paid Layer: Emotional Buddy & Therapists</span>
              </p>
              <p className="leading-relaxed text-purple-200">
                Users return because they feel emotionally safe. The wanting to return provides an <strong>Emotional Buddy via recurring subscription ($9/mo or ₹749/mo)</strong>, with licensed human coaches and therapists available on demand as a paid clinical layer.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-purple-800/40 border border-purple-700/50 space-y-2">
              <p className="font-bold text-white text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-300" />
                <span>Conversation-Guided Anonymous Communities</span>
              </p>
              <p className="leading-relaxed text-purple-200">
                Based on conversational analytics, the platform matches the user to an anonymous peer circle of women in their exact life stage (Working women, career returners, mothers, teens, single, separated).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-purple-800/40 border border-purple-700/50 space-y-2">
              <p className="font-bold text-white text-sm flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-sky-300" />
                <span>Working Women Professional Peer Support</span>
              </p>
              <p className="leading-relaxed text-purple-200">
                A dedicated community where working women actively assist each other with work-related stress, manager gaslighting, boundary setting, and trusted job findings without corporate politics.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 my-5 text-xs">
        <span className="text-stone-400 font-medium">Filter Category:</span>
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-stone-900 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          All 5 Ranked Assumptions
        </button>
        <button
          onClick={() => setActiveFilter('financial')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
            activeFilter === 'financial'
              ? 'bg-purple-700 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          Willingness to Pay (Rank #1)
        </button>
        <button
          onClick={() => setActiveFilter('behavioral')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
            activeFilter === 'behavioral'
              ? 'bg-purple-700 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          Trust, Retention & Community (Ranks #2–#5)
        </button>
      </div>

      {/* Assumptions Cards Grid */}
      <div className="space-y-5">
        {filteredAssumptions.map((lofa) => {
          const userVote = votedMap[lofa.id];
          const totalVotes = lofa.votesAgree + lofa.votesDisagree;
          const agreePct = totalVotes > 0 ? Math.round((lofa.votesAgree / totalVotes) * 100) : 85;

          return (
            <div
              key={lofa.id}
              className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                lofa.rank === 1
                  ? 'bg-gradient-to-br from-purple-50/70 via-white to-violet-50/40 border-purple-300 shadow-sm'
                  : 'bg-stone-50/70 hover:bg-white border-stone-200/90'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-stone-900 text-white font-serif font-bold text-xs flex items-center justify-center shadow-xs">
                    #{lofa.rank}
                  </span>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                      {lofa.category}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-stone-900 leading-tight">
                      {lofa.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-stone-500">
                    Community Confidence:
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {lofa.confidenceScore}% Validated
                  </span>
                </div>
              </div>

              {/* Leap of Faith Hypothesis Statement */}
              <div className="p-3.5 rounded-xl bg-white border border-stone-200/80 mb-3.5">
                <p className="text-xs sm:text-sm text-stone-800 font-medium leading-relaxed">
                  "{lofa.statement}"
                </p>
              </div>

              {/* Real-World Analogy & Test Mechanism */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-xs">
                <div className="p-3 rounded-xl bg-stone-100/80 border border-stone-200/60">
                  <span className="font-bold text-stone-800 uppercase tracking-wider block mb-1 text-[10px]">
                    Real-World Precedent:
                  </span>
                  <p className="text-stone-600 leading-relaxed italic">
                    {lofa.realWorldAnalogy}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-purple-50/80 border border-purple-200/60">
                  <span className="font-bold text-purple-900 uppercase tracking-wider block mb-1 text-[10px]">
                    How This Prototype Tests It:
                  </span>
                  <p className="text-purple-800 leading-relaxed">
                    {lofa.howWeTestIt}
                  </p>
                </div>
              </div>

              {/* Metrics Bar & Interactive Action Row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-3 border-t border-stone-200/80">
                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">
                      Target Threshold
                    </span>
                    <span className="font-bold text-stone-700">{lofa.targetThreshold}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">
                      Prototype Signal
                    </span>
                    <span className="font-bold text-emerald-700">{lofa.currentValue}</span>
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">
                      Key Venture Risk
                    </span>
                    <span className="text-stone-500 max-w-xs truncate block" title={lofa.keyRisk}>
                      {lofa.keyRisk}
                    </span>
                  </div>
                </div>

                {/* Direct Action Link & Voting Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {lofa.rank === 1 && (
                    <button
                      onClick={onOpenPricing}
                      className="px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1 shadow-xs"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Test Willingness-to-Pay ($/₹)</span>
                    </button>
                  )}

                  {lofa.rank === 2 && (
                    <button
                      onClick={onOpenVerification}
                      className="px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1 shadow-xs"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Try 5-10s Verification</span>
                    </button>
                  )}

                  {lofa.rank === 4 && (
                    <button
                      onClick={onStartVenting}
                      className="px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1 shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Try 60s CBT Relief</span>
                    </button>
                  )}

                  {lofa.rank === 5 && (
                    <button
                      onClick={onExploreCommunity}
                      className="px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1 shadow-xs"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>View Anonymous Circles</span>
                    </button>
                  )}

                  {/* Agree / Disagree Voting */}
                  <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200">
                    <button
                      onClick={() => handleVote(lofa.id, 'agree')}
                      disabled={!!userVote}
                      className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer ${
                        userVote === 'agree'
                          ? 'bg-emerald-600 text-white'
                          : 'hover:bg-white text-stone-700'
                      }`}
                      title="Validate: I agree women will behave this way"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{lofa.votesAgree}</span>
                    </button>

                    <button
                      onClick={() => handleVote(lofa.id, 'disagree')}
                      disabled={!!userVote}
                      className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer ${
                        userVote === 'disagree'
                          ? 'bg-rose-600 text-white'
                          : 'hover:bg-white text-stone-700'
                      }`}
                      title="Doubt: I believe this assumption is too risky"
                    >
                      <ThumbsDown className="w-3 h-3" />
                      <span>{lofa.votesDisagree}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function Briefcase(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}
