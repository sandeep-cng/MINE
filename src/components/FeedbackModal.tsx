import React, { useState } from 'react';
import {
  X,
  Heart,
  MessageSquareHeart,
  Send,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { UserProfile } from '../types';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  userProfile,
}) => {
  const [rating, setRating] = useState(5);
  const [feltHeard, setFeltHeard] = useState<boolean>(true);
  const [neededCircle, setNeededCircle] = useState('');
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pseudonym: userProfile.pseudonym,
          rating,
          feltHeard,
          neededCircle,
          comments,
          email: userProfile.email,
          whatsapp: userProfile.whatsapp,
        }),
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-purple-200 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-purple-50 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 mx-auto mb-3">
            <MessageSquareHeart className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
            Your Voice & Feedback
          </h3>
          <p className="mt-1.5 text-stone-600 text-xs sm:text-sm">
            HerSanctuary is built by women, for women. Help us make this sanctuary safer and more healing.
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2 animate-bounce" />
            <h4 className="font-serif text-lg font-bold text-stone-900">Thank you, Sister!</h4>
            <p className="text-xs text-stone-600 mt-1">Your feedback warms our hearts.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Heart Rating */}
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2 text-center">
                How supported did you feel?
              </label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 transition hover:scale-125 cursor-pointer"
                  >
                    <Heart
                      className={`w-7 h-7 ${
                        star <= rating
                          ? 'text-purple-600 fill-purple-600'
                          : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Felt Heard Poll */}
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                Did your assistant Ananya make you feel genuinely heard?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFeltHeard(true)}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    feltHeard === true
                      ? 'bg-purple-100 border-purple-400 text-purple-950'
                      : 'bg-stone-50 border-stone-200 text-stone-600'
                  }`}
                >
                  Yes, deeply validating
                </button>
                <button
                  type="button"
                  onClick={() => setFeltHeard(false)}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    feltHeard === false
                      ? 'bg-purple-100 border-purple-400 text-purple-950'
                      : 'bg-stone-50 border-stone-200 text-stone-600'
                  }`}
                >
                  Could be deeper
                </button>
              </div>
            </div>

            {/* Missing circle */}
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                What circle or topic is missing?
              </label>
              <input
                type="text"
                value={neededCircle}
                onChange={(e) => setNeededCircle(e.target.value)}
                placeholder="e.g. Chronic illness, Fertility journey, Empty nest..."
                className="w-full px-3.5 py-2 rounded-xl bg-purple-50/40 border border-stone-200 text-xs sm:text-sm focus:border-purple-400 focus:outline-hidden"
              />
            </div>

            {/* Comments */}
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                Any reflections for the sanctuary?
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Share your thoughts..."
                rows={2}
                className="w-full px-3.5 py-2 rounded-xl bg-purple-50/40 border border-stone-200 text-xs sm:text-sm focus:border-purple-400 focus:outline-hidden resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Sending...' : 'Send Feedback'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
