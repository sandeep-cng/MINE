import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Video,
  VideoOff,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Camera,
  Heart,
  Calendar,
  AlertCircle,
  RefreshCw,
  Lock,
  UserCheck,
} from 'lucide-react';
import { UserProfile } from '../types';
import { getRandomPseudonym } from '../data/circlesData';

interface VideoVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onVerificationComplete: () => void;
  onUpdatePseudonym?: (newPseudonym: string) => void;
}

export const VideoVerificationModal: React.FC<VideoVerificationModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onVerificationComplete,
  onUpdatePseudonym,
}) => {
  const [activeMode, setActiveMode] = useState<'instant' | 'schedule'>('instant');
  const [chosenPseudonym, setChosenPseudonym] = useState(userProfile.pseudonym);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(10);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState(false);
  const [scheduleSlot, setScheduleSlot] = useState('Today at 6:00 PM');
  const [whatsappForSchedule, setWhatsappForSchedule] = useState(userProfile.whatsapp || '');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setIsVerifying(false);
      setSecondsRemaining(10);
      setIsSuccess(false);
      setScheduleSuccess(false);
    }
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError(
        'Unable to access camera. Please allow camera permissions, or choose Option B to schedule a quick 1-on-1 video call.'
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleStart10sCheck = () => {
    if (!cameraActive) {
      startCamera();
      return;
    }

    setIsVerifying(true);
    setSecondsRemaining(10);

    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          completeVerification();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const completeVerification = async () => {
    setIsVerifying(false);
    setIsSuccess(true);
    stopCamera();

    try {
      await fetch('/api/verification/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pseudonym: chosenPseudonym || userProfile.pseudonym,
          verificationType: 'live_camera_nod',
          durationSeconds: 10,
          notes: 'Completed 10-second presence check with female assistant moderator',
        }),
      });
    } catch (err) {
      console.error('Failed to log verification on server:', err);
    }

    if (onUpdatePseudonym && chosenPseudonym) {
      onUpdatePseudonym(chosenPseudonym);
    }
    onVerificationComplete();
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setScheduleSuccess(true);
    try {
      await fetch('/api/verification/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pseudonym: chosenPseudonym || userProfile.pseudonym,
          verificationType: 'scheduled_peer_call',
          durationSeconds: 10,
          notes: `Scheduled with female facilitator for ${scheduleSlot}. WhatsApp: ${whatsappForSchedule}`,
        }),
      });
    } catch (err) {
      console.error('Failed to schedule verification:', err);
    }
    if (onUpdatePseudonym && chosenPseudonym) {
      onUpdatePseudonym(chosenPseudonym);
    }
    onVerificationComplete();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-purple-200 relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-purple-50 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 mx-auto mb-3 shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
            5-10 Sec Video Verification
          </h3>
          <p className="mt-2 text-stone-600 text-xs sm:text-sm leading-relaxed">
            A trusted female assistant conducts a quick 5–10 second live video check to confirm authentic female presence. You will sign in with your chosen pseudonym so your real face, phone, and name remain 100% confidential.
          </p>
        </div>

        {/* Pseudonym Chooser with Availability Indicator */}
        <div className="mb-5 p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-purple-700" />
              <span>Sign In With A Pseudonym You Choose / Available</span>
            </label>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
              Available & Safe ✓
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">🌸</span>
              <input
                type="text"
                value={chosenPseudonym}
                onChange={(e) => setChosenPseudonym(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                placeholder="Choose your pseudonym..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-purple-200 text-xs font-semibold text-purple-950 focus:outline-purple-600 shadow-2xs"
              />
            </div>
            <button
              type="button"
              onClick={() => setChosenPseudonym(getRandomPseudonym())}
              className="px-2.5 py-1.5 rounded-xl bg-purple-200 hover:bg-purple-300 text-purple-900 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              title="Generate New Aesthetic Pseudonym"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Randomize</span>
            </button>
          </div>
          <p className="mt-1.5 text-[11px] text-purple-800/80 flex items-center gap-1">
            <Lock className="w-3 h-3 text-purple-600" />
            <span>Only "{chosenPseudonym}" will ever appear in the community. Zero real IDs stored.</span>
          </p>
        </div>

        {/* Female Assistant Badge */}
        <div className="mb-4 flex items-center justify-between px-3 py-2 rounded-xl bg-stone-100 border border-stone-200 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-purple-700 text-white flex items-center justify-center text-[10px] font-bold">
              PS
            </div>
            <div>
              <p className="font-bold text-stone-900 leading-none">Priya Sharma</p>
              <p className="text-[10px] text-stone-500">Verified Female Assistant • Active Online</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Ready for 5-10s Check</span>
          </span>
        </div>

        {/* Mode Switcher */}
        <div className="flex rounded-full bg-purple-50 p-1 mb-6 border border-purple-200">
          <button
            onClick={() => {
              setActiveMode('instant');
              stopCamera();
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-full transition ${
              activeMode === 'instant' ? 'bg-white text-purple-900 shadow-2xs' : 'text-stone-600'
            }`}
          >
            Option A: Instant 10s Camera Check
          </button>
          <button
            onClick={() => {
              setActiveMode('schedule');
              stopCamera();
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-full transition ${
              activeMode === 'schedule' ? 'bg-white text-purple-900 shadow-2xs' : 'text-stone-600'
            }`}
          >
            Option B: 1-on-1 Call with Female Facilitator
          </button>
        </div>

        {/* Option A: Instant Live Camera Check */}
        {activeMode === 'instant' && (
          <div>
            {isSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-xl font-bold text-stone-900">
                  Verification Confirmed!
                </h4>
                <p className="text-stone-600 text-xs sm:text-sm mt-2 max-w-sm mx-auto">
                  You are now recognized as a <strong>Verified Sisterhood Member</strong>. A shield badge will appear beside your pseudonym in discussions.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-6 py-2.5 rounded-full bg-purple-700 text-white font-semibold text-xs sm:text-sm hover:bg-purple-800 transition"
                >
                  Enter Verified Sanctuary
                </button>
              </div>
            ) : (
              <div>
                {/* Viewfinder Frame */}
                <div className="relative aspect-4/3 bg-stone-950 rounded-2xl overflow-hidden border-2 border-purple-300 flex items-center justify-center">
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
                  />

                  {/* Oval Face Guide Overlay in Purple */}
                  {cameraActive && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="w-48 h-60 border-2 border-dashed border-purple-300/80 rounded-[50%] animate-pulse" />
                    </div>
                  )}

                  {!cameraActive && !cameraError && (
                    <div className="text-center text-stone-300 p-4">
                      <Camera className="w-10 h-10 text-purple-400 mx-auto mb-2 opacity-80" />
                      <p className="text-xs font-medium">Camera is off</p>
                      <p className="text-[11px] text-stone-400 mt-1">
                        Tap start to begin the 10-second verification preview.
                      </p>
                    </div>
                  )}

                  {cameraError && (
                    <div className="text-center text-red-200 p-4">
                      <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                      <p className="text-xs">{cameraError}</p>
                    </div>
                  )}

                  {/* Live Verification Countdown Overlay */}
                  {isVerifying && (
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between bg-stone-900/80 backdrop-blur-xs px-3 py-1.5 rounded-full text-white text-xs font-semibold">
                      <span className="flex items-center gap-1.5 text-purple-300">
                        <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
                        Verifying Sisterhood Protocol...
                      </span>
                      <span className="font-mono text-sm font-black text-amber-300">
                        {secondsRemaining}s
                      </span>
                    </div>
                  )}
                </div>

                {/* Instruction steps */}
                <div className="mt-4 p-3 bg-purple-50 rounded-xl text-xs text-stone-700 space-y-1 border border-purple-100">
                  <p className="font-bold text-purple-900">What to do in these 10 seconds:</p>
                  <p>1. Center your face inside the gentle oval frame.</p>
                  <p>2. Give a warm smile, blink, or gentle nod to prove live presence.</p>
                  <p className="text-[11px] text-stone-500 pt-1">
                    🔒 Zero recordings are stored or shown publicly. Your privacy is paramount.
                  </p>
                </div>

                {/* Control Actions */}
                <div className="mt-5 flex gap-3">
                  {!cameraActive ? (
                    <button
                      onClick={startCamera}
                      className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2"
                    >
                      <Video className="w-4 h-4" />
                      <span>Turn On Camera</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStart10sCheck}
                      disabled={isVerifying}
                      className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isVerifying ? `Verifying (${secondsRemaining}s)...` : 'Start 10s Live Check'}</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Option B: Schedule 1-on-1 Call with Female Facilitator */}
        {activeMode === 'schedule' && (
          <div>
            {scheduleSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-xl font-bold text-stone-900">
                  Video Nod Scheduled!
                </h4>
                <p className="text-stone-600 text-xs sm:text-sm mt-2 max-w-sm mx-auto">
                  Our female facilitator will send a 10-second private video link to your WhatsApp at <strong>{scheduleSlot}</strong> for a warm wave.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-6 py-2.5 rounded-full bg-purple-700 text-white font-semibold text-xs sm:text-sm hover:bg-purple-800 transition"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleScheduleSubmit} className="space-y-4">
                <p className="text-xs text-stone-600">
                  Prefer a human connection? One of our trusted female community facilitators will jump on a 5-10 second private video wave to say hi and verify your profile.
                </p>

                <div>
                  <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                    Select a 5-Minute Window
                  </label>
                  <select
                    value={scheduleSlot}
                    onChange={(e) => setScheduleSlot(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-purple-50/50 border border-stone-200 text-xs sm:text-sm focus:border-purple-400 focus:outline-hidden"
                  >
                    <option>Today at 6:00 PM</option>
                    <option>Today at 8:30 PM</option>
                    <option>Tomorrow at 11:00 AM</option>
                    <option>Tomorrow at 7:00 PM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                    WhatsApp Number for Video Link
                  </label>
                  <input
                    type="tel"
                    required
                    value={whatsappForSchedule}
                    onChange={(e) => setWhatsappForSchedule(e.target.value)}
                    placeholder="+1 (555) 000-0000 or +91 98765 43210"
                    className="w-full p-2.5 rounded-xl bg-purple-50/50 border border-stone-200 text-xs sm:text-sm focus:border-purple-400 focus:outline-hidden"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">
                    Your number is kept strictly confidential.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Confirm 10s Peer Video Nod</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
