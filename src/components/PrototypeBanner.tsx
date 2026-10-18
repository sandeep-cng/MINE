import React, { useState } from 'react';
import {
  ShieldAlert,
  Video,
  Sparkles,
  Lock,
  ChevronRight,
  TrendingUp,
  X,
  CreditCard,
  Heart,
} from 'lucide-react';
import { UserProfile } from '../types';

interface PrototypeBannerProps {
  onOpenLOFA: () => void;
  onOpenVerification: () => void;
  onOpenPricing: () => void;
  userProfile: UserProfile;
}

export const PrototypeBanner: React.FC<PrototypeBannerProps> = ({
  onOpenLOFA,
  onOpenVerification,
  onOpenPricing,
  userProfile,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  if (isMinimized) {
    return (
      <div className="bg-stone-900 text-stone-200 text-xs py-1.5 px-4 flex items-center justify-between border-b border-purple-900/50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-semibold text-amber-300">Prototype Preview Mode</span>
          <span className="hidden sm:inline text-stone-400">— No real payments or external messages are executed.</span>
        </div>
        <button
          onClick={() => setIsMinimized(false)}
          className="text-stone-400 hover:text-white underline text-[11px] cursor-pointer"
        >
          Expand Validation Notice
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-stone-950 via-purple-950 to-stone-950 text-white border-b border-purple-800/60 shadow-md relative z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-2">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-2.5">
          {/* Main Notice */}
          <div className="flex items-start sm:items-center gap-2.5 text-xs text-stone-200">
            <span className="mt-0.5 sm:mt-0 flex-shrink-0 inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40">
              Prototype Preview
            </span>
            <p className="leading-snug">
              <span className="text-white font-medium">No real orders, payments, or messages are sent.</span>{' '}
              <span className="text-stone-300 hidden md:inline">
                For positive verification, a female assistant conducts a 5–10s live video check and you sign in with an encrypted pseudonym you choose. Real identity is kept 100% confidential.
              </span>
            </p>
          </div>

          {/* Action Chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs w-full lg:w-auto justify-end">
            <button
              onClick={onOpenLOFA}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-900/70 hover:bg-purple-800 border border-purple-700/60 text-purple-200 transition text-[11px] font-semibold cursor-pointer"
              title="View the 5 Ranked Leap-of-Faith Assumptions"
            >
              <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
              <span>Ranked Assumptions (LOFA)</span>
            </button>

            <button
              onClick={onOpenPricing}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-900/40 hover:bg-amber-800/60 border border-amber-600/50 text-amber-200 transition text-[11px] font-semibold cursor-pointer"
              title="Test Willingness to Pay ($ / ₹)"
            >
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
              <span>Test Pricing Tier</span>
            </button>

            <button
              onClick={onOpenVerification}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition text-[11px] font-semibold cursor-pointer border ${
                userProfile.isVerified
                  ? 'bg-emerald-950/70 border-emerald-600 text-emerald-300'
                  : 'bg-purple-700 hover:bg-purple-600 border-purple-500 text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>{userProfile.isVerified ? '✓ Verified Sister' : '5-10s Video Check'}</span>
            </button>

            <button
              onClick={() => setIsMinimized(true)}
              className="text-stone-400 hover:text-white p-1 rounded transition cursor-pointer"
              aria-label="Minimize preview banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
