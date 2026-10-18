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
            Your assistant Ananya listens deeply to your heart, validates your feelings without toxic positivity, and guides you with structured mindfulness and CBT-grounding exercises.
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

        {/* The Value Proposition (Clean 3-Pillar Architecture with distinct, rich aesthetic jewel colors) */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Pillar 1: Amethyst & Twilight Violet */}
          <div
            onClick={onStartVenting}
            className="group cursor-pointer p-6 rounded-3xl bg-gradient-to-br from-purple-900/90 via-violet-950/95 to-indigo-950 border-2 border-purple-400/60 hover:border-purple-300 transition-all duration-300 shadow-xl shadow-purple-950/60 hover:-translate-y-1 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-purple-200 bg-purple-800/80 px-2.5 py-1 rounded-full border border-purple-500/50 shadow-xs">
                  AMETHYST OASIS • 01
                </span>
                <div className="w-9 h-9 rounded-2xl bg-purple-600/70 border border-purple-400/60 flex items-center justify-center text-purple-100 group-hover:scale-110 transition-transform shadow-sm">
                  <Sparkles className="w-4 h-4 text-purple-200" />
                </div>
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">
                Your Assistant Ananya
              </h3>
              <p className="text-xs text-purple-200/90 leading-relaxed font-light">
                Voice or text emotional chamber. Speak freely with your assistant Ananya, catch cognitive distortions with structured CBT, and practice somatic calming.
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-purple-700/60 flex items-center justify-between text-xs text-purple-300 font-semibold group-hover:text-white relative z-10">
              <span>Enter Sanctuary</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Pillar 2: Rose Quartz & Petal Blush */}
          <div
            onClick={onExploreCommunity}
            className="group cursor-pointer p-6 rounded-3xl bg-gradient-to-br from-rose-950/90 via-pink-950/95 to-purple-950 border-2 border-rose-400/60 hover:border-rose-300 transition-all duration-300 shadow-xl shadow-rose-950/60 hover:-translate-y-1 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-pink-200 bg-rose-900/80 px-2.5 py-1 rounded-full border border-rose-500/50 shadow-xs">
                  ROSE QUARTZ • 02
                </span>
                <div className="w-9 h-9 rounded-2xl bg-rose-700/70 border border-rose-400/60 flex items-center justify-center text-rose-100 group-hover:scale-110 transition-transform shadow-sm">
                  <Users className="w-4 h-4 text-pink-200" />
                </div>
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-2 group-hover:text-pink-200 transition-colors">
                Sister Community Circles
              </h3>
              <p className="text-xs text-pink-200/90 leading-relaxed font-light">
                Gently matched with sisters enduring similar challenges — postpartum overwhelm, heartbreak, grief, or workplace burnout.
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-rose-800/60 flex items-center justify-between text-xs text-pink-300 font-semibold group-hover:text-white relative z-10">
              <span>Explore Sister Circles</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Pillar 3: Golden Topaz & Warm Honey Amber */}
          <div
            onClick={onRequestProfessional}
            className="group cursor-pointer p-6 rounded-3xl bg-gradient-to-br from-amber-950/90 via-yellow-950/95 to-stone-950 border-2 border-amber-400/60 hover:border-amber-300 transition-all duration-300 shadow-xl shadow-amber-950/60 hover:-translate-y-1 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-200 bg-amber-900/80 px-2.5 py-1 rounded-full border border-amber-500/50 shadow-xs">
                  GOLDEN TOPAZ • 03
                </span>
                <div className="w-9 h-9 rounded-2xl bg-amber-600/70 border border-amber-400/60 flex items-center justify-center text-amber-100 group-hover:scale-110 transition-transform shadow-sm">
                  <HeartHandshake className="w-4 h-4 text-amber-200" />
                </div>
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-2 group-hover:text-amber-200 transition-colors">
                Professional Clinical Triage
              </h3>
              <p className="text-xs text-amber-200/90 leading-relaxed font-light">
                When peer venting isn't enough, join our priority queue for licensed female trauma and clinical counselors (coming soon).
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-amber-800/60 flex items-center justify-between text-xs text-amber-300 font-semibold group-hover:text-white relative z-10">
              <span>Seek Professional Care</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* Teaser MVP Interest Prompt Bar with Periwinkle & Lavender Velvet box */}
        <div className="mt-8 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-indigo-950/90 via-purple-900/90 to-violet-950/95 border-2 border-indigo-400/50 shadow-lg flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-purple-200 shrink-0">
              <Vote className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-white flex items-center gap-1.5">
                <span>Early Adopter Feedback & Feature Wishlist</span>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/40">
                  PROTOTYPE PREVIEW
                </span>
              </p>
              <p className="text-purple-300">
                Tell us whether you would like professional counseling, peer sister circles, or daily evening check-ins.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenMVP}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span>Share Feedback & Vote</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
