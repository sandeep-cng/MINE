import React, { useState, useMemo } from 'react';
import {
  X,
  User,
  ShieldCheck,
  RefreshCw,
  Video,
  CheckCircle2,
  Lock,
  Sparkles,
  Heart,
  TrendingDown,
  TrendingUp,
  Activity,
  Calendar,
  Clock,
  Compass,
  Smile,
  BarChart2,
  Sliders,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { UserProfile, EmotionalJourneyEntry } from '../types';
import { getRandomPseudonym, DEFAULT_EMOTIONAL_HISTORY } from '../data/circlesData';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onOpenVerification: () => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  onOpenVerification,
}) => {
  const [drawerTab, setDrawerTab] = useState<'dashboard' | 'identity'>('dashboard');
  const [pseudoInput, setPseudoInput] = useState(userProfile.pseudonym);
  const [isSaved, setIsSaved] = useState(false);

  const history: EmotionalJourneyEntry[] = useMemo(() => {
    if (userProfile.emotionalHistory && userProfile.emotionalHistory.length > 0) {
      return userProfile.emotionalHistory;
    }
    return DEFAULT_EMOTIONAL_HISTORY;
  }, [userProfile.emotionalHistory]);

  if (!isOpen) return null;

  const handleRandomize = () => {
    const randomName = getRandomPseudonym();
    setPseudoInput(randomName);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pseudoInput.trim()) return;
    onUpdateProfile({ pseudonym: pseudoInput.trim() });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 1200);
  };

  // 1. Prepare Trajectory Chart Data
  const trajectoryData = history.map((entry, index) => {
    const date = new Date(entry.timestamp);
    const dateLabel = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    return {
      name: dateLabel || `Session ${index + 1}`,
      distress: entry.distressLevel,
      calmness: entry.calmnessLevel,
      topic: entry.topic,
      affirmation: entry.affirmation,
      words: entry.wordsPoured,
    };
  });

  // 2. Prepare Frequency by Time of Day Data
  const timeOfDayCounts: Record<string, number> = {
    'Morning (6-12)': 0,
    'Afternoon (12-18)': 0,
    'Evening (18-22)': 0,
    'Night (22-6)': 0,
  };

  history.forEach((entry) => {
    const hour = new Date(entry.timestamp).getHours();
    if (hour >= 6 && hour < 12) timeOfDayCounts['Morning (6-12)']++;
    else if (hour >= 12 && hour < 18) timeOfDayCounts['Afternoon (12-18)']++;
    else if (hour >= 18 && hour < 22) timeOfDayCounts['Evening (18-22)']++;
    else timeOfDayCounts['Night (22-6)']++;
  });

  const frequencyData = Object.entries(timeOfDayCounts).map(([period, count]) => ({
    period,
    vents: count,
  }));

  // 3. Prepare Topic Breakdown
  const topicCounts: Record<string, number> = {};
  history.forEach((e) => {
    const shortTopic = e.topic.split('&')[0].trim();
    topicCounts[shortTopic] = (topicCounts[shortTopic] || 0) + 1;
  });

  const topicDistribution = Object.entries(topicCounts).map(([topic, count]) => ({
    topic,
    percent: Math.round((count / history.length) * 100),
    count,
  }));

  // Calculate Metrics
  const avgDistress = Math.round(
    history.reduce((acc, curr) => acc + curr.distressLevel, 0) / history.length
  );
  const avgCalmness = Math.round(
    history.reduce((acc, curr) => acc + curr.calmnessLevel, 0) / history.length
  );
  const reliefDelta = Math.max(0, avgCalmness - (100 - avgDistress));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-purple-950/80 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl border border-purple-200 relative max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white text-base font-black shadow-xs">
              {userProfile.pseudonym.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
                  🌸 {userProfile.pseudonym}
                </h3>
                {userProfile.isVerified ? (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Sister</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    Unverified
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500">
                Personal Sanctuary Dashboard & Emotional Trajectory
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Tab Switcher */}
            <div className="flex rounded-full bg-purple-50 p-1 border border-purple-200 mr-2">
              <button
                onClick={() => setDrawerTab('dashboard')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition flex items-center gap-1.5 ${
                  drawerTab === 'dashboard'
                    ? 'bg-purple-700 text-white shadow-2xs'
                    : 'text-stone-600 hover:text-purple-900'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Emotional Journey</span>
              </button>
              <button
                onClick={() => setDrawerTab('identity')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition flex items-center gap-1.5 ${
                  drawerTab === 'identity'
                    ? 'bg-purple-700 text-white shadow-2xs'
                    : 'text-stone-600 hover:text-purple-900'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Identity Settings</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-purple-50 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pt-4 pr-1 space-y-6">
          {drawerTab === 'dashboard' ? (
            <div className="space-y-6">
              {/* KPI Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-purple-50/80 p-3.5 rounded-2xl border border-purple-200/80">
                  <span className="text-[11px] font-bold uppercase text-purple-800 block">
                    Vents Shared
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-purple-950">{history.length}</span>
                    <span className="text-xs text-purple-700 font-medium">sessions</span>
                  </div>
                </div>

                <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200">
                  <span className="text-[11px] font-bold uppercase text-emerald-800 block">
                    Relief Index
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-emerald-950">+{reliefDelta}%</span>
                    <span className="text-xs text-emerald-700 font-medium">calm delta</span>
                  </div>
                </div>

                <div className="bg-indigo-50/80 p-3.5 rounded-2xl border border-indigo-200">
                  <span className="text-[11px] font-bold uppercase text-indigo-800 block">
                    Average Heaviness
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-indigo-950">{avgDistress}/100</span>
                  </div>
                </div>

                <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200">
                  <span className="text-[11px] font-bold uppercase text-amber-800 block">
                    Sister Safe Streak
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-amber-950">Active</span>
                    <span className="text-xs text-amber-700 font-medium">held safe</span>
                  </div>
                </div>
              </div>

              {/* Chart 1: Distress vs. Calmness Trajectory (Recharts Area Chart) */}
              <div className="bg-white p-5 rounded-3xl border border-purple-200 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <h4 className="font-serif font-bold text-stone-900 text-sm sm:text-base flex items-center gap-1.5">
                      <TrendingDown className="w-4 h-4 text-purple-600" />
                      <span>Sentiment & Distress Trajectory Over Time</span>
                    </h4>
                    <p className="text-xs text-stone-500 font-light">
                      Tracking how venting to Ananya alleviates internal distress and elevates calm relief.
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                    Live Session Log
                  </span>
                </div>

                <div className="h-56 sm:h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trajectoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="distressGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#9333ea" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#9333ea" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="calmnessGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ff" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#6b7280' }} />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-purple-950 text-white p-3 rounded-2xl shadow-xl text-xs space-y-1 border border-purple-800">
                                <p className="font-bold text-purple-200">{label}</p>
                                <p className="text-stone-300">Topic: <strong>{data.topic}</strong></p>
                                <div className="flex gap-3 pt-1 border-t border-purple-800">
                                  <span className="text-purple-300">Distress: <strong>{data.distress}</strong></span>
                                  <span className="text-emerald-300">Calmness: <strong>{data.calmness}</strong></span>
                                </div>
                                {data.affirmation && (
                                  <p className="text-[10px] text-purple-300 italic pt-1">
                                    "{data.affirmation}"
                                  </p>
                                )}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                      <Area
                        type="monotone"
                        dataKey="distress"
                        name="Distress (Initial Heaviness)"
                        stroke="#9333ea"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#distressGrad)"
                      />
                      <Area
                        type="monotone"
                        dataKey="calmness"
                        name="Calmness (Post-Vent Relief)"
                        stroke="#10b981"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#calmnessGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Usage Frequency & Time of Day Rhythm (Recharts Bar Chart) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-purple-200 shadow-sm">
                  <h4 className="font-serif font-bold text-stone-900 text-sm mb-1 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span>When Your Heart Tends to Need Support</span>
                  </h4>
                  <p className="text-xs text-stone-500 mb-3">
                    Venting session frequency segmented by time of day.
                  </p>

                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={frequencyData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ff" />
                        <XAxis dataKey="period" tick={{ fontSize: 9, fill: '#6b7280' }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#3b0764',
                            borderRadius: '12px',
                            color: '#fff',
                            fontSize: '11px',
                            border: 'none',
                          }}
                        />
                        <Bar
                          dataKey="vents"
                          name="Venting Sessions"
                          fill="#7c3aed"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Primary Struggles Distribution */}
                <div className="bg-white p-5 rounded-3xl border border-purple-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-stone-900 text-sm mb-1 flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-purple-600" />
                      <span>Emotional Themes Explored</span>
                    </h4>
                    <p className="text-xs text-stone-500 mb-3">
                      Where you have poured out vulnerability the most.
                    </p>

                    <div className="space-y-2.5">
                      {topicDistribution.map((t) => (
                        <div key={t.topic} className="text-xs">
                          <div className="flex justify-between text-stone-700 mb-1">
                            <span>{t.topic}</span>
                            <span className="font-bold text-purple-800">
                              {t.percent}% ({t.count} vents)
                            </span>
                          </div>
                          <div className="w-full bg-purple-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-purple-600 h-full rounded-full transition-all duration-500"
                              style={{ width: `${t.percent}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-purple-50 text-[11px] text-purple-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Every vent is private, unshared, and stored only under your chosen pseudonym.</span>
                  </div>
                </div>
              </div>

              {/* Recent Emotional Milestones Log */}
              <div className="bg-white p-5 rounded-3xl border border-purple-200 shadow-sm">
                <h4 className="font-serif font-bold text-stone-900 text-sm mb-3">
                  Recent Healing Reflections & Grounding Affirmations
                </h4>
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {history.slice(-4).reverse().map((entry) => (
                    <div
                      key={entry.id}
                      className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-purple-950">{entry.topic}</span>
                          <span className="text-[10px] text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full font-medium">
                            {entry.sentimentLabel}
                          </span>
                        </div>
                        <p className="text-stone-600 italic">"{entry.affirmation}"</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-stone-400 block font-mono">
                          {new Date(entry.timestamp).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-700 block">
                          Calm: {entry.calmnessLevel}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Tab 2: Identity & Security Settings */
            <div className="space-y-5">
              {/* Verification Status Card */}
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Safety Verification
                  </span>
                  {userProfile.isVerified ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified Sister
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                      Unverified
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs text-stone-600 leading-relaxed">
                  {userProfile.isVerified
                    ? 'You have completed the 5-10 second video verification check. Sisters know your profile is genuine.'
                    : 'Take 10 seconds to do a private camera check or quick video nod with our female facilitator to unlock your Verified badge.'}
                </p>
                {!userProfile.isVerified && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenVerification();
                    }}
                    className="mt-3 w-full py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Video className="w-4 h-4" />
                    <span>Verify Now (5-10 Sec Video)</span>
                  </button>
                )}
              </div>

              {/* Pseudonym Customizer */}
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                      Change Pseudonym
                    </label>
                    <button
                      type="button"
                      onClick={handleRandomize}
                      className="text-xs text-purple-700 hover:text-purple-800 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Suggest Name</span>
                    </button>
                  </div>

                  <input
                    type="text"
                    value={pseudoInput}
                    onChange={(e) => setPseudoInput(e.target.value)}
                    maxLength={24}
                    placeholder="e.g. GentleSparrow, CalmOcean..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-purple-50/40 border border-stone-200 text-sm focus:border-purple-400 focus:bg-white focus:outline-hidden font-medium text-stone-900"
                  />
                </div>

                {/* Privacy statement */}
                <div className="p-3 rounded-2xl bg-purple-50/80 border border-purple-200/80 text-xs text-stone-700 flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Why Pseudonyms?</strong> Psychological safety is paramount. Sharing anonymously frees you from social stigma, family judgment, or career repercussions.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  {isSaved ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Pseudonym Saved!</span>
                    </>
                  ) : (
                    <span>Save Pseudonym</span>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
