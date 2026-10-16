import React from 'react';
import {
  Sparkles,
  Users,
  Lock,
  Video,
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
  Vote,
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeroCTAProps {
  onStartVenting: () => void;
  onExploreCommunity: () => void;
  onRequestProfessional: () => void;
  onOpenMVP: () => void;
  onOpenVerification: () => void;
  userProfile: UserProfile;
}

export const HeroCTA: React.FC<HeroCTAProps> = ({
  onStartVenting,
  onExploreCommunity,
  onRequestProfessional,
  onOpenMVP,
  onOpenVerification,
  userProfile,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-purple-950 via-purple-900/90 to-purple-950 text-white pt-12 pb-16 border-b border-purple-800/40">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Subtle Editorial Kicker (inspired by Mindful Brewing teaser style) */}
        <div className="text-center mb-4">
          <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-purple-300">
            A MINDFUL SANCTUARY FOR WOMEN
          </span>
        </div>

        {/* Vision Headline */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight leading-tight text-white">
            In the quiet, <span className="text-purple-300 italic">a space to heal.</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-purple-200/90 leading-relaxed max-w-2xl mx-auto font-light">
            Pour out the grief, heartbreak, postpartum tears, or corporate burnout you’ve kept hidden.
            An empathetic AI listens deeply to your heart, validates your feelings without toxic positivity, and connects you with a verified sisterhood walking through the exact same pain.
          </p>
        </div>

        {/* Minimalist Trust & Safety Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-purple-300">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/40 border border-purple-700/50">
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            <span>100% Anonymous (Register with Pseudonym)</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/40 border border-purple-700/50">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Women-Only Verified Sanctuary</span>
          </span>
          <button
            onClick={onOpenVerification}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/60 hover:bg-purple-800 border border-purple-700/60 transition text-amber-300 cursor-pointer"
          >
            <Video className="w-3.5 h-3.5" />
            <span>
              {userProfile.isVerified ? '✓ Verified Sister' : '5-10s Live Video Check (Zero Fakes)'}
            </span>
          </button>
        </div>

        {/* The Value Proposition (Clean 3-Pillar Architecture) */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pillar 1 */}
          <div
            onClick={onStartVenting}
            className="group cursor-pointer p-6 rounded-2xl bg-purple-900/40 hover:bg-purple-900/70 border border-purple-800/60 hover:border-purple-500 transition-all shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                  PILLAR 01
                </span>
                <Sparkles className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white mb-2">
                Empathetic AI Listening
              </h3>
              <p className="text-xs text-purple-200/80 leading-relaxed">
                Vent freely by voice or text. Receive gentle, validating reflections without dismissal, plus interactive 4-4-4 breathing guidance.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-purple-800/40 flex items-center justify-between text-xs text-purple-300 font-semibold group-hover:text-white">
              <span>Start Venting</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Pillar 2 */}
          <div
            onClick={onExploreCommunity}
            className="group cursor-pointer p-6 rounded-2xl bg-purple-900/40 hover:bg-purple-900/70 border border-purple-800/60 hover:border-purple-500 transition-all shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                  PILLAR 02
                </span>
                <Users className="w-4 h-4 text-violet-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white mb-2">
                Sister Community Circles
              </h3>
              <p className="text-xs text-purple-200/80 leading-relaxed">
                Matched automatically by AI to sisters enduring similar challenges — postpartum overwhelm, heartbreak, grief, or workplace burnout.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-purple-800/40 flex items-center justify-between text-xs text-purple-300 font-semibold group-hover:text-white">
              <span>Explore Circles</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Pillar 3 */}
          <div
            onClick={onRequestProfessional}
            className="group cursor-pointer p-6 rounded-2xl bg-purple-900/40 hover:bg-purple-900/70 border border-purple-800/60 hover:border-purple-500 transition-all shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                  PILLAR 03
                </span>
                <HeartHandshake className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white mb-2">
                Professional Clinical Triage
              </h3>
              <p className="text-xs text-purple-200/80 leading-relaxed">
                When peer venting isn't enough, join our priority queue for licensed female trauma and clinical counselors (coming soon).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-purple-800/40 flex items-center justify-between text-xs text-purple-300 font-semibold group-hover:text-white">
              <span>Seek Professional Care</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Teaser MVP Interest Prompt Bar */}
        <div className="mt-8 p-4 rounded-2xl bg-purple-900/60 border border-purple-700/60 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-purple-200 shrink-0">
              <Vote className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-white">Help Us Shape the Minimum Viable Product (MVP)</p>
              <p className="text-purple-300">
                Vote on upcoming features and record your feedback so we build what you actually need.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenMVP}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span>Vote on MVP Features</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
