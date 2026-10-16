import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroCTA } from './components/HeroCTA';
import { AIVentingSanctuary } from './components/AIVentingSanctuary';
import { CommunityCircles } from './components/CommunityCircles';
import { ProfessionalSupport } from './components/ProfessionalSupport';
import { MVPValidation } from './components/MVPValidation';
import { VideoVerificationModal } from './components/VideoVerificationModal';
import { NotificationSettingsModal } from './components/NotificationSettingsModal';
import { ProfileDrawer } from './components/ProfileDrawer';
import { AdminDatabaseModal } from './components/AdminDatabaseModal';
import { FeedbackModal } from './components/FeedbackModal';
import { UserProfile, EmotionalJourneyEntry } from './types';
import { getRandomPseudonym, DEFAULT_EMOTIONAL_HISTORY } from './data/circlesData';
import {
  Heart,
  ShieldCheck,
  Sparkles,
  MessageSquareHeart,
  Lock,
  Phone,
  Video,
} from 'lucide-react';

export default function App() {
  // User Profile State (persisted in localStorage)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('hersanctuary_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.emotionalHistory || parsed.emotionalHistory.length === 0) {
          parsed.emotionalHistory = DEFAULT_EMOTIONAL_HISTORY;
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Error reading localStorage:', e);
    }
    return {
      pseudonym: getRandomPseudonym(),
      whatsapp: '',
      email: '',
      pushEnabled: false,
      whatsappCheckinEnabled: true,
      isVerified: false,
      emotionalHistory: DEFAULT_EMOTIONAL_HISTORY,
    };
  });

  // Active Main View Tab: 'vent' | 'community' | 'professional' | 'mvp'
  const [activeTab, setActiveTab] = useState<'vent' | 'community' | 'professional' | 'mvp'>('vent');
  const [selectedCircleId, setSelectedCircleId] = useState<string>('all');

  // Modals state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAdminStatsOpen, setIsAdminStatsOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Real-time professional requests counter
  const [profRequestCount, setProfRequestCount] = useState(0);

  // Sync profile to localStorage
  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem('hersanctuary_profile', JSON.stringify(updated));
      } catch (e) {
        console.warn('Error saving to localStorage:', e);
      }
      return updated;
    });
  };

  // Fetch count of professional requests
  const fetchProfStats = async () => {
    try {
      const res = await fetch('/api/professional-support/stats');
      const data = await res.json();
      if (data.success) {
        setProfRequestCount(data.totalCount || 0);
      }
    } catch (err) {
      console.warn('Failed to fetch stats:', err);
    }
  };

  useEffect(() => {
    fetchProfStats();
    const interval = setInterval(fetchProfStats, 20000);
    return () => clearInterval(interval);
  }, []);

  // Handlers for cross-component transitions
  const handleJoinCircle = (circleId: string) => {
    setSelectedCircleId(circleId);
    setActiveTab('community');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleShareToCommunity = async (
    content: string,
    circleId: string,
    circleTitle: string
  ) => {
    try {
      await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          circleId,
          circleTitle,
          pseudonym: userProfile.pseudonym,
          isVerified: userProfile.isVerified,
          content,
        }),
      });
      setSelectedCircleId(circleId);
      setActiveTab('community');
      window.scrollTo({ top: 400, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to post vent to community:', err);
    }
  };

  const handleAddEmotionalMilestone = (entry: EmotionalJourneyEntry) => {
    const current = userProfile.emotionalHistory || DEFAULT_EMOTIONAL_HISTORY;
    const updated = [...current, entry];
    handleUpdateProfile({ emotionalHistory: updated });
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-purple-200 selection:text-purple-950">
      {/* Top Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenVerification={() => setIsVerificationOpen(true)}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onOpenAdminStats={() => setIsAdminStatsOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        profRequestCount={profRequestCount}
      />

      {/* Highlighted CTA Banner at Top in Purple/Violet */}
      <HeroCTA
        onStartVenting={() => {
          setActiveTab('vent');
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
        onExploreCommunity={() => {
          setActiveTab('community');
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
        onRequestProfessional={() => {
          setActiveTab('professional');
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
        onOpenMVP={() => {
          setActiveTab('mvp');
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
        onOpenVerification={() => setIsVerificationOpen(true)}
        userProfile={userProfile}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {activeTab === 'vent' && (
          <AIVentingSanctuary
            userProfile={userProfile}
            onJoinCircle={handleJoinCircle}
            onRequestProfessional={() => setActiveTab('professional')}
            onShareToCommunity={handleShareToCommunity}
            onAddEmotionalMilestone={handleAddEmotionalMilestone}
          />
        )}

        {activeTab === 'community' && (
          <CommunityCircles
            userProfile={userProfile}
            selectedCircleId={selectedCircleId}
            setSelectedCircleId={setSelectedCircleId}
            onOpenVerification={() => setIsVerificationOpen(true)}
          />
        )}

        {activeTab === 'professional' && (
          <ProfessionalSupport
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onOpenAdminStats={() => setIsAdminStatsOpen(true)}
          />
        )}

        {activeTab === 'mvp' && (
          <MVPValidation
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
          />
        )}
      </main>

      {/* Floating Feedback & Help Buttons */}
      <div className="fixed bottom-5 right-5 z-30 flex flex-col gap-2.5">
        <button
          onClick={() => setIsFeedbackOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-white hover:bg-purple-50 text-stone-800 border border-purple-200 shadow-lg text-xs font-semibold transition group cursor-pointer"
          title="Share Feedback"
        >
          <MessageSquareHeart className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Feedback</span>
        </button>

        {!userProfile.isVerified && (
          <button
            onClick={() => setIsVerificationOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-purple-700 hover:bg-purple-800 text-white shadow-lg text-xs font-bold transition cursor-pointer"
            title="5-10 Sec Video Verification"
          >
            <Video className="w-4 h-4" />
            <span className="hidden sm:inline">Verify (10s)</span>
          </button>
        )}
      </div>

      {/* Sanctuary Footer in Deep Purple/Night Indigo */}
      <footer className="bg-purple-950 text-purple-200 py-12 border-t border-purple-900 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white">
                  <Heart className="w-4 h-4 fill-white" />
                </div>
                <span className="font-serif text-xl font-bold text-white">HerSanctuary</span>
              </div>
              <p className="text-purple-300 text-xs max-w-sm leading-relaxed mb-4">
                A verified, non-judgmental emotional sanctuary designed specifically for women. Here, every tear is respected, and no sister carries heartbreak or burnout alone.
              </p>
              <div className="flex items-center gap-3 text-xs text-purple-300">
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-purple-400" />
                  <span>Encrypted Pseudonyms</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>5-10s Live Video Check</span>
                </span>
              </div>
            </div>

            <div>
              <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
                Sanctuary Portals
              </h5>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={() => setActiveTab('vent')}
                    className="hover:text-purple-300 transition"
                  >
                    AI Empathetic Venting
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('community')}
                    className="hover:text-purple-300 transition"
                  >
                    Sister Community Circles
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('professional')}
                    className="hover:text-purple-300 transition"
                  >
                    Professional Care Triage
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('mvp')}
                    className="hover:text-purple-300 transition"
                  >
                    MVP Feature Wishlist
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsVerificationOpen(true)}
                    className="hover:text-purple-300 transition"
                  >
                    5-10s Video Verification
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
                Crisis & Help Hotlines
              </h5>
              <p className="text-xs text-purple-300 leading-relaxed mb-2">
                If you are in acute crisis, please call free 24/7 confidential help:
              </p>
              <div className="space-y-1 text-xs text-purple-200 font-medium">
                <p>US / Canada: Call or text <strong>988</strong></p>
                <p>UK: Call <strong>111</strong> or Samaritans <strong>116 123</strong></p>
                <p>India: Vandrevala Foundation <strong>9999 666 555</strong></p>
                <p>International: <strong>findahelpline.com</strong></p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-purple-900 flex flex-wrap items-center justify-between gap-4 text-xs text-purple-400">
            <p>© {new Date().getFullYear()} HerSanctuary. All rights reserved. Zero tolerance for harassment or trolling.</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsAdminStatsOpen(true)}
                className="hover:text-white transition"
              >
                Care Database & Notification Logs
              </button>
              <button
                onClick={() => setIsFeedbackOpen(true)}
                className="hover:text-white transition"
              >
                Share Feedback
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={handleUpdateProfile}
        onOpenVerification={() => setIsVerificationOpen(true)}
      />

      <VideoVerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        userProfile={userProfile}
        onVerificationComplete={() => {
          handleUpdateProfile({ isVerified: true, verifiedAt: new Date().toISOString() });
        }}
      />

      <NotificationSettingsModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={handleUpdateProfile}
      />

      <AdminDatabaseModal
        isOpen={isAdminStatsOpen}
        onClose={() => setIsAdminStatsOpen(false)}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        userProfile={userProfile}
      />
    </div>
  );
}
