import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Users,
  ShieldCheck,
  RefreshCw,
  Wind,
  Heart,
  Share2,
  AlertCircle,
  CheckCircle2,
  Bot,
  User,
  Trash2,
} from 'lucide-react';
import { UserProfile, AIListenResponse, EmotionalJourneyEntry } from '../types';
import { COMMUNITY_CIRCLES } from '../data/circlesData';

interface MessageItem {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  recommendedCircle?: {
    id: string;
    title: string;
    reason: string;
  };
  suggestProfessionalSupport?: boolean;
  soothingAffirmation?: string;
}

interface AIVentingSanctuaryProps {
  userProfile: UserProfile;
  onJoinCircle: (circleId: string) => void;
  onRequestProfessional: () => void;
  onShareToCommunity: (content: string, circleId: string, circleTitle: string) => void;
  onAddEmotionalMilestone?: (entry: EmotionalJourneyEntry) => void;
}

export const AIVentingSanctuary: React.FC<AIVentingSanctuaryProps> = ({
  userProfile,
  onJoinCircle,
  onRequestProfessional,
  onShareToCommunity,
  onAddEmotionalMilestone,
}) => {
  const [ventText, setVentText] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('General');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);
  const [showBreathingGuide, setShowBreathingGuide] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathTimer, setBreathTimer] = useState(4);
  const [sharedNoticeId, setSharedNoticeId] = useState<string | null>(null);

  // Multi-turn conversation messages
  const [messages, setMessages] = useState<MessageItem[]>(() => {
    return [
      {
        id: 'welcome-1',
        role: 'model',
        content: `Welcome to this sacred space, ${userProfile.pseudonym}. I am Ananya, your empathetic listener.\n\nTake off the heavy armor you've been wearing all day. Whatever is weighing down your heart — heartbreak, postpartum exhaustion, burnout, or grief — you can speak freely here without fear of judgment. How is your heart feeling right now?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        soothingAffirmation: 'You are safe, your feelings are completely valid, and you are not alone.',
      },
    ];
  });

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const samplePrompts = [
    {
      label: 'Postpartum Exhaustion',
      text: "I feel like a terrible mother. My baby won't stop crying and I cried in the shower because I feel so lost and exhausted.",
      style: 'bg-rose-50/90 text-rose-900 border-rose-200/90 hover:border-rose-400 hover:bg-rose-100/80 shadow-2xs',
    },
    {
      label: 'Heartbreak & Betrayal',
      text: "I discovered deceit in my relationship. The physical pain in my chest is suffocating, and I feel embarrassed for trusting so blindly.",
      style: 'bg-fuchsia-50/90 text-fuchsia-900 border-fuchsia-200/90 hover:border-fuchsia-400 hover:bg-fuchsia-100/80 shadow-2xs',
    },
    {
      label: 'Corporate Burnout & Anxiety',
      text: "I'm pretending to be fine at work, but I had a panic attack in the bathroom. I feel like an imposter about to collapse.",
      style: 'bg-amber-50/90 text-amber-900 border-amber-200/90 hover:border-amber-400 hover:bg-amber-100/80 shadow-2xs',
    },
    {
      label: 'Grief & Bereavement',
      text: "Everyone expects me to be okay by now, but the world feels color-drained and empty without my loved one.",
      style: 'bg-indigo-50/90 text-indigo-900 border-indigo-200/90 hover:border-indigo-400 hover:bg-indigo-100/80 shadow-2xs',
    },
    {
      label: 'Loneliness in a New City',
      text: "I moved away for work. Coming home to an empty room every night hurts in a way I didn't expect.",
      style: 'bg-emerald-50/90 text-emerald-900 border-emerald-200/90 hover:border-emerald-400 hover:bg-emerald-100/80 shadow-2xs',
    },
  ];

  // Speech Recognition setup (Voice Venting)
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            setVentText((prev) => prev + (prev ? ' ' : '') + event.results[i][0].transcript);
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech-to-text is not supported in this browser. Please type your vent.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Error starting recognition:', err);
      }
    }
  };

  // Breathing Box Timer
  useEffect(() => {
    if (!showBreathingGuide) return;
    const interval = setInterval(() => {
      setBreathTimer((prev) => {
        if (prev > 1) return prev - 1;
        setBreathPhase((curr) => {
          if (curr === 'Inhale') return 'Hold';
          if (curr === 'Hold') return 'Exhale';
          return 'Inhale';
        });
        return 4;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showBreathingGuide]);

  const handleSubmitVent = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!ventText.trim() || isLoading) return;

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    const userMessage: MessageItem = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: ventText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setVentText('');
    setIsLoading(true);

    try {
      const historyPayload = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/ai/listen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory: historyPayload,
          pseudonym: userProfile.pseudonym,
          ventingTopic: selectedTopic,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const botMessage: MessageItem = {
          id: `bot-${Date.now()}`,
          role: 'model',
          content: data.empatheticResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          recommendedCircle: data.recommendedCircle,
          suggestProfessionalSupport: data.suggestProfessionalSupport,
          soothingAffirmation: data.soothingAffirmation,
        };
        setMessages((prev) => [...prev, botMessage]);

        // Record milestone for visual emotional journey dashboard
        if (onAddEmotionalMilestone) {
          const wordCount = userMessage.content.trim().split(/\s+/).length;
          const distress = Math.min(95, Math.max(45, 60 + Math.floor(wordCount / 3)));
          const calmness = Math.min(92, Math.max(35, 100 - Math.floor(distress * 0.4)));
          const milestone: EmotionalJourneyEntry = {
            id: `milestone-${Date.now()}`,
            timestamp: new Date().toISOString(),
            topic: data.recommendedCircle?.title || selectedTopic || 'General Emotional Vent',
            distressLevel: distress,
            calmnessLevel: calmness,
            sentimentLabel:
              distress > 75
                ? 'High Distress'
                : distress > 55
                ? 'Moderate Heaviness'
                : 'Calming Down',
            wordsPoured: wordCount,
            affirmation: data.soothingAffirmation || 'Your voice matters and you are safe here.',
            circleRecommended: data.recommendedCircle?.title || 'Sister Sanctuary',
          };
          onAddEmotionalMilestone(milestone);
        }
      } else {
        alert(data.error || 'Failed to receive AI response. Please try again.');
      }
    } catch (err) {
      console.error('Failed to submit vent:', err);
      alert('Network issue. Your feelings are important, please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Play AI Voice
  const handlePlayVoice = async (messageId: string, text: string) => {
    if (activePlayingId === messageId) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setActivePlayingId(null);
      return;
    }

    setActivePlayingId(messageId);

    try {
      const res = await fetch('/api/ai/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.slice(0, 450),
        }),
      });

      const data = await res.json();
      if (data.success && data.audioData) {
        if (!audioRef.current) {
          audioRef.current = new Audio();
        }
        audioRef.current.src = data.audioData;
        audioRef.current.onended = () => setActivePlayingId(null);
        audioRef.current.onerror = () => {
          fallbackSpeechSynthesis(text, messageId);
        };
        await audioRef.current.play();
      } else {
        fallbackSpeechSynthesis(text, messageId);
      }
    } catch (err) {
      console.warn('Backend TTS failed, using Web Speech API fallback:', err);
      fallbackSpeechSynthesis(text, messageId);
    }
  };

  const fallbackSpeechSynthesis = (text: string, messageId: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.88;
      utterance.pitch = 1.05;
      utterance.onend = () => setActivePlayingId(null);
      utterance.onerror = () => setActivePlayingId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setActivePlayingId(null);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Clear your conversation thread?')) {
      setMessages([
        {
          id: `welcome-${Date.now()}`,
          role: 'model',
          content: `The slate is cleared, ${userProfile.pseudonym}. I am here and listening whenever you are ready.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Intro Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-900 text-xs font-semibold mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Active Empathetic AI Listener Sanctuary</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
          Tell Me Everything. You Are Safe Here.
        </h2>
        <p className="mt-2 text-stone-600 text-sm sm:text-base max-w-xl mx-auto">
          You are speaking as <span className="font-semibold text-purple-800">🌸 {userProfile.pseudonym}</span>.
          No judgments, no dismissal, no toxic positivity. Just gentle, validating presence.
        </p>

        {/* Breathing Guide Button */}
        <div className="mt-4 flex justify-center gap-3">
          <button
            onClick={() => setShowBreathingGuide(!showBreathingGuide)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 transition"
          >
            <Wind className="w-4 h-4 text-purple-600" />
            <span>{showBreathingGuide ? 'Hide Breathing Guide' : 'Need a Breath First? (4-4-4 Calming Orb)'}</span>
          </button>

          {messages.length > 2 && (
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-stone-500 hover:text-red-600 transition"
              title="Clear chat history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Thread</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Calming Breathing Orb in Purple/Lavender */}
      {showBreathingGuide && (
        <div className="mb-8 p-6 rounded-3xl bg-gradient-to-b from-purple-100/90 via-violet-50 to-indigo-50 border border-purple-200 text-center flex flex-col items-center shadow-inner">
          <p className="text-xs font-bold text-purple-950 uppercase tracking-widest mb-3">
            Box Breathing for Nervous System Regulation
          </p>
          <div className="relative w-36 h-36 flex items-center justify-center my-2">
            <div
              className={`w-32 h-32 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-400 flex items-center justify-center text-white shadow-lg transition-transform duration-1000 ${
                breathPhase === 'Inhale' ? 'scale-110' : breathPhase === 'Hold' ? 'scale-110' : 'scale-90 opacity-80'
              }`}
            >
              <div className="text-center">
                <span className="block text-sm font-bold">{breathPhase}</span>
                <span className="block text-2xl font-black">{breathTimer}s</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-stone-600 mt-2 max-w-xs">
            {breathPhase === 'Inhale' && 'Slowly breathe in through your nose... filling your belly.'}
            {breathPhase === 'Hold' && 'Hold gently and soften your shoulders.'}
            {breathPhase === 'Exhale' && 'Gently sigh out through parted lips... release the tension.'}
          </p>
        </div>
      )}

      {/* Sample Vent Prompts with Distinct Aesthetic Pastel Palettes */}
      <div className="mb-4">
        <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">
          Or tap a situation to begin:
        </label>
        <div className="flex flex-wrap gap-2">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setVentText(p.text);
                setSelectedTopic(p.label);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition border text-left cursor-pointer ${p.style}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Multi-Turn Conversation Thread */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-lg shadow-purple-100/50 border border-purple-200/90 mb-6">
        <div className="space-y-6 max-h-[560px] overflow-y-auto pr-1">
          {messages.map((msg) => {
            const matchedCircle = msg.recommendedCircle
              ? COMMUNITY_CIRCLES.find(
                  (c) =>
                    c.id === msg.recommendedCircle?.id ||
                    c.title.toLowerCase() === msg.recommendedCircle?.title.toLowerCase()
                ) || COMMUNITY_CIRCLES[0]
              : null;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                    <Bot className="w-5 h-5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-3xl p-4 sm:p-5 ${
                    msg.role === 'user'
                      ? 'bg-purple-600 text-white shadow-sm rounded-tr-xs'
                      : 'bg-purple-50/70 border border-purple-200/70 text-stone-800 rounded-tl-xs shadow-2xs'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between gap-2 mb-2 pb-1 border-b border-purple-200/40 text-xs">
                    <span className={`font-bold ${msg.role === 'user' ? 'text-purple-100' : 'text-purple-900'}`}>
                      {msg.role === 'user' ? `🌸 ${userProfile.pseudonym}` : 'Ananya (AI Companion)'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] ${msg.role === 'user' ? 'text-purple-200' : 'text-stone-400'}`}>
                        {msg.timestamp}
                      </span>
                      {msg.role === 'model' && (
                        <button
                          onClick={() => handlePlayVoice(msg.id, msg.content)}
                          className="p-1 rounded-full hover:bg-purple-200/60 text-purple-700 transition"
                          title="Listen to soothing voice"
                        >
                          {activePlayingId === msg.id ? (
                            <VolumeX className="w-3.5 h-3.5 text-purple-700" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5 text-purple-700" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="text-sm leading-relaxed whitespace-pre-line space-y-2 font-sans">
                    {msg.content}
                  </div>

                  {/* Soothing Affirmation */}
                  {msg.soothingAffirmation && (
                    <div className="mt-4 p-3 rounded-2xl bg-purple-100/80 border border-purple-200 text-xs text-purple-950 font-serif italic">
                      "{msg.soothingAffirmation}"
                    </div>
                  )}

                  {/* Recommended Circle Card with Matched Aesthetic Color Box */}
                  {msg.recommendedCircle && matchedCircle && (
                    <div
                      className={`mt-4 p-4 rounded-3xl border-2 shadow-xs ${
                        matchedCircle.colorTheme?.cardBg || 'bg-white'
                      } ${matchedCircle.colorTheme?.border || 'border-purple-300'}`}
                    >
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide mb-1">
                        <span className={`p-1 rounded-lg bg-white shadow-2xs ${matchedCircle.colorTheme?.iconColor || 'text-purple-600'}`}>
                          <Users className="w-3.5 h-3.5" />
                        </span>
                        <span className={matchedCircle.colorTheme?.accentText || 'text-purple-900'}>
                          Recommended Sister Circle
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-sm text-stone-900">
                        {msg.recommendedCircle.title}
                      </h4>
                      <p className="mt-1 text-xs text-stone-600 leading-relaxed font-light">
                        {msg.recommendedCircle.reason}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-stone-200/70 flex flex-wrap items-center justify-between gap-2">
                        <button
                          onClick={() => onJoinCircle(msg.recommendedCircle!.id)}
                          className="py-1.5 px-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <span>Enter Sister Circle</span>
                          <Users className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            onShareToCommunity(
                              msg.content,
                              msg.recommendedCircle!.id,
                              msg.recommendedCircle!.title
                            );
                            setSharedNoticeId(msg.id);
                          }}
                          className={`py-1.5 px-3 rounded-xl font-medium text-xs transition flex items-center gap-1 cursor-pointer border ${
                            matchedCircle.colorTheme?.hugBg || 'bg-purple-50 text-purple-800 border-purple-200'
                          }`}
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Share for Sister Hugs</span>
                        </button>
                      </div>

                      {sharedNoticeId === msg.id && (
                        <div className="mt-2 text-[11px] text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 p-1.5 rounded-lg border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Shared anonymously to circle!</span>
                        </div>
                      )}
                    </div>
                  )}

                {/* Professional Support Suggestion */}
                {msg.suggestProfessionalSupport && (
                  <div className="mt-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-300 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-bold text-amber-900">
                        You seem to be carrying deep distress.
                      </p>
                      <p className="text-amber-800 mt-0.5">
                        You deserve dedicated clinical care. You can request priority professional support right now.
                      </p>
                      <button
                        onClick={onRequestProfessional}
                        className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-900 text-white font-semibold text-[11px] hover:bg-stone-800 transition cursor-pointer"
                      >
                        <ShieldCheck className="w-3 h-3 text-amber-400" />
                        <span>Request Professional Counseling</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-9 h-9 rounded-2xl bg-purple-200 text-purple-800 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm mt-1">
                  {userProfile.pseudonym.charAt(0)}
                </div>
              )}
            </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start items-center text-xs text-purple-700">
              <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
                <RefreshCw className="w-4 h-4 animate-spin text-purple-600" />
              </div>
              <span className="italic">Ananya is holding space and listening deeply...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Venting Input Box */}
        <form onSubmit={handleSubmitVent} className="mt-6 pt-4 border-t border-purple-100">
          <div className="relative">
            <textarea
              value={ventText}
              onChange={(e) => setVentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitVent();
                }
              }}
              placeholder="Tell Ananya what is on your mind... (Press Enter to send, Shift+Enter for new line)"
              rows={3}
              className="w-full p-3.5 rounded-2xl bg-purple-50/50 border border-purple-200 focus:border-purple-400 focus:bg-white focus:outline-hidden text-stone-800 placeholder:text-stone-400 text-sm resize-none leading-relaxed"
            />

            {/* Voice Venting Active Indicator */}
            {isRecording && (
              <div className="absolute top-3 right-3 flex items-center gap-2 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white" />
                <span>Listening to your voice...</span>
              </div>
            )}
          </div>

          {/* Input Controls */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleRecording}
                className={`p-2 rounded-full border transition flex items-center gap-1.5 text-xs font-medium ${
                  isRecording
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                    : 'bg-stone-100 hover:bg-purple-100 text-stone-700 border-stone-200'
                }`}
                title={isRecording ? 'Stop voice recording' : 'Speak to vent'}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-purple-600" />}
                <span className="hidden sm:inline">{isRecording ? 'Stop Voice' : 'Voice Vent (Speak)'}</span>
              </button>

              {ventText && (
                <button
                  type="button"
                  onClick={() => setVentText('')}
                  className="text-xs text-stone-400 hover:text-stone-600 px-2 py-1"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-stone-400">{ventText.length} characters</span>
              <button
                type="submit"
                disabled={isLoading || !ventText.trim()}
                className="py-2.5 px-6 rounded-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold text-sm transition flex items-center gap-2 shadow-sm cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Listening...</span>
                  </>
                ) : (
                  <>
                    <span>Send to Ananya</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
