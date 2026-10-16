import React, { useState } from 'react';
import {
  Heart,
  ShieldCheck,
  Bell,
  Video,
  Sparkles,
  Database,
  Users,
  UserCheck,
  ChevronDown,
  Menu,
  X,
  Vote,
  MessageSquareHeart,
  User,
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  activeTab: 'vent' | 'community' | 'professional' | 'mvp';
  setActiveTab: (tab: 'vent' | 'community' | 'professional' | 'mvp') => void;
  userProfile: UserProfile;
  onOpenProfile: () => void;
  onOpenVerification: () => void;
  onOpenNotifications: () => void;
  onOpenAdminStats: () => void;
  onOpenFeedback: () => void;
  profRequestCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  onOpenProfile,
  onOpenVerification,
  onOpenNotifications,
  onOpenAdminStats,
  onOpenFeedback,
  profRequestCount,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md border-b border-purple-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Minimalist Brand Logo */}
          <div
            onClick={() => setActiveTab('vent')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-400 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white">
                HerSanctuary
              </span>
              <span className="text-[10px] uppercase tracking-widest text-purple-300 font-medium hidden sm:inline">
                Women's Sanctuary
              </span>
            </div>
          </div>

          {/* Clean, Uncluttered Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-purple-900/40 p-1 rounded-full border border-purple-800/60">
            <button
              onClick={() => setActiveTab('vent')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'vent'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-purple-200 hover:text-white hover:bg-purple-800/40'
              }`}
            >
              AI Venting
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'community'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-purple-200 hover:text-white hover:bg-purple-800/40'
              }`}
            >
              Sister Circles
            </button>
            <button
              onClick={() => setActiveTab('professional')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'professional'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-purple-200 hover:text-white hover:bg-purple-800/40'
              }`}
            >
              Professional Care
            </button>
            <button
              onClick={() => setActiveTab('mvp')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
                activeTab === 'mvp'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-purple-300 hover:text-white hover:bg-purple-800/40'
              }`}
            >
              <Vote className="w-3.5 h-3.5 text-purple-300" />
              <span>MVP Wishlist</span>
            </button>
          </nav>

          {/* Minimalist Right Controls: Unified Sister Profile & Quick Menu */}
          <div className="flex items-center gap-2 relative">
            {/* Unified Sister Badge / Pill */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 pl-2.5 pr-2 py-1.5 rounded-full bg-purple-900/60 hover:bg-purple-900 text-purple-100 border border-purple-700/60 transition text-xs font-medium cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {userProfile.pseudonym.charAt(0)}
                </div>
                <span className="max-w-[100px] truncate font-semibold">
                  {userProfile.pseudonym}
                </span>
                {userProfile.isVerified ? (
                  <span title="Verified Sister">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Unverified" />
                )}
                <ChevronDown className="w-3.5 h-3.5 text-purple-400" />
              </button>

              {/* Clean Dropdown with all secondary tools neatly organized */}
              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-purple-950 border border-purple-800 rounded-2xl shadow-xl z-40 py-2 text-xs text-purple-200 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-purple-900/80">
                      <p className="font-bold text-white">🌸 {userProfile.pseudonym}</p>
                      <p className="text-[11px] text-purple-300">
                        {userProfile.isVerified
                          ? '✓ Verified Sisterhood Member'
                          : 'Unverified (5-10s video check needed)'}
                      </p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          onOpenProfile();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-purple-900/60 flex items-center gap-2.5"
                      >
                        <User className="w-3.5 h-3.5 text-purple-400" />
                        <span>Change Pseudonym & Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          onOpenVerification();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-purple-900/60 flex items-center gap-2.5"
                      >
                        <Video className="w-3.5 h-3.5 text-amber-400" />
                        <span>
                          {userProfile.isVerified ? 'Video Check Status' : 'Verify in 5-10s (Camera Check)'}
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          onOpenNotifications();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-purple-900/60 flex items-center gap-2.5"
                      >
                        <Bell className="w-3.5 h-3.5 text-purple-400" />
                        <span>WhatsApp & Push Notifications</span>
                      </button>

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          onOpenAdminStats();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-purple-900/60 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <Database className="w-3.5 h-3.5 text-purple-400" />
                          <span>Triage DB & OpenWA {profRequestCount > 0 ? `(${profRequestCount})` : ''}</span>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                          :2785
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          onOpenFeedback();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-purple-900/60 flex items-center gap-2.5"
                      >
                        <MessageSquareHeart className="w-3.5 h-3.5 text-purple-400" />
                        <span>Share User Feedback</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-xl text-purple-200 hover:text-white hover:bg-purple-900/50"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Accordion */}
        {menuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-purple-900/80 flex flex-col gap-1.5">
            <button
              onClick={() => {
                setActiveTab('vent');
                setMenuOpen(false);
              }}
              className={`text-left px-3.5 py-2 rounded-xl text-xs font-semibold ${
                activeTab === 'vent' ? 'bg-purple-700 text-white' : 'text-purple-200'
              }`}
            >
              AI Venting Sanctuary
            </button>
            <button
              onClick={() => {
                setActiveTab('community');
                setMenuOpen(false);
              }}
              className={`text-left px-3.5 py-2 rounded-xl text-xs font-semibold ${
                activeTab === 'community' ? 'bg-purple-700 text-white' : 'text-purple-200'
              }`}
            >
              Sister Communities
            </button>
            <button
              onClick={() => {
                setActiveTab('professional');
                setMenuOpen(false);
              }}
              className={`text-left px-3.5 py-2 rounded-xl text-xs font-semibold ${
                activeTab === 'professional' ? 'bg-purple-700 text-white' : 'text-purple-200'
              }`}
            >
              Professional Support
            </button>
            <button
              onClick={() => {
                setActiveTab('mvp');
                setMenuOpen(false);
              }}
              className={`text-left px-3.5 py-2 rounded-xl text-xs font-semibold ${
                activeTab === 'mvp' ? 'bg-purple-700 text-white' : 'text-purple-200'
              }`}
            >
              MVP Feature Wishlist
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
