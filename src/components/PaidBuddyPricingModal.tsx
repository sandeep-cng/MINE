import React, { useState } from 'react';
import {
  X,
  CreditCard,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Heart,
  Calendar,
  Lock,
  MessageSquare,
  Building,
  HelpCircle,
} from 'lucide-react';
import { UserProfile } from '../types';

interface PaidBuddyPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

export const PaidBuddyPricingModal: React.FC<PaidBuddyPricingModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
}) => {
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');
  const [selectedTier, setSelectedTier] = useState<'free' | 'emotional_buddy' | 'licensed_therapy'>('emotional_buddy');
  const [payerType, setPayerType] = useState<'self' | 'employer'>('self');
  const [email, setEmail] = useState(userProfile.email || '');
  const [whatsapp, setWhatsapp] = useState(userProfile.whatsapp || '');
  const [customPriceFeedback, setCustomPriceFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const TIERS = [
    {
      id: 'free' as const,
      name: 'Free Sister Sanctuary',
      badge: 'Always 100% Free',
      priceUSD: 0,
      priceINR: 0,
      billingCycle: 'forever',
      description: 'Instant emotional first-aid whenever you are overwhelmed.',
      features: [
        'Structured CBT Venting & Thought Records',
        'Somatic 5-4-3-2-1 Grounding & Box Breathing',
        '100% Anonymous Pseudonym Verification',
        'Access to Life-Stage Sister Circles',
        'Emergency 24/7 Crisis Helpline Directory',
      ],
      highlight: false,
      ctaText: 'Use Free Sanctuary',
    },
    {
      id: 'emotional_buddy' as const,
      name: 'Weekly Emotional Buddy',
      badge: 'Core MVP Test Tier',
      priceUSD: 9,
      priceINR: 749,
      billingCycle: 'per month',
      description: 'Dedicated accountability & gentle emotional accompaniment.',
      features: [
        'All Free Sanctuary Features',
        'Daily 8 PM WhatsApp Gentle Breath & Check-in',
        'Dedicated Weekly Emotional Journey Tracking',
        'AI Assisted Life-Stage Circle Matching',
        'Priority Sister Circles & Voice Rooms',
        'Employer Reimbursement Invoice Support',
      ],
      highlight: true,
      ctaText: 'Reserve Early Adopter Spot',
    },
    {
      id: 'licensed_therapy' as const,
      name: 'Licensed Female Therapist Layer',
      badge: 'Clinical Support Layer',
      priceUSD: 29,
      priceINR: 1499,
      billingCycle: 'per 45-min session',
      description: 'Accredited female trauma, postpartum, and career therapists.',
      features: [
        '1-on-1 Confidential 45-Min Video / Audio Session',
        'Accredited Clinical Female Counselors',
        'Pre-session CBT Summary for your Therapist',
        'Emergency Priority Booking within 24 Hours',
        'Zero Stigma, Completely Private & Encrypted',
      ],
      highlight: false,
      ctaText: 'Reserve Consultation Spot',
    },
  ];

  const currentTierObj = TIERS.find((t) => t.id === selectedTier) || TIERS[1];
  const priceDisplay =
    currency === 'INR'
      ? currentTierObj.priceINR === 0
        ? '₹0'
        : `₹${currentTierObj.priceINR}`
      : currentTierObj.priceUSD === 0
      ? '$0'
      : `$${currentTierObj.priceUSD}`;

  const handleSubmitReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const pricePoint = currency === 'INR' ? currentTierObj.priceINR : currentTierObj.priceUSD;

      const res = await fetch('/api/willingness-to-pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pseudonym: userProfile.pseudonym,
          email,
          whatsapp,
          tierId: selectedTier,
          tierName: currentTierObj.name,
          currency,
          pricePoint,
          feedback: `${payerType === 'employer' ? '[Employer Sponsored Interest] ' : ''}${customPriceFeedback}`,
          wouldPay: selectedTier !== 'free',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedSuccess(true);
        onUpdateProfile({ email, whatsapp });
      }
    } catch (err) {
      console.error('Failed to submit reservation:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 border border-stone-200 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedSuccess ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-stone-900">
              Reservation Test Recorded!
            </h3>
            <p className="mt-2 text-stone-600 text-sm max-w-md mx-auto leading-relaxed">
              Thank you, <strong className="text-purple-900">🌸 {userProfile.pseudonym}</strong>.
              Your interest in the <strong>{currentTierObj.name} ({priceDisplay})</strong> has been logged to validate our core venture assumption on willingness to pay.
            </p>

            <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left text-xs text-amber-900 space-y-1.5 max-w-md mx-auto">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Prototype Clarity Guarantee:</span>
              </p>
              <p>• Absolutely no payment method was charged today.</p>
              <p>• We will notify you via {whatsapp || email || 'the portal'} when early access spots open.</p>
              <p>• You maintain full free access to the structured CBT emotional sanctuary.</p>
            </div>

            <button
              onClick={() => {
                setSubmittedSuccess(false);
                onClose();
              }}
              className="mt-6 px-6 py-2.5 rounded-full bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold transition cursor-pointer"
            >
              Back to Sanctuary
            </button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="text-center mb-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-purple-700 block mb-1">
                PROTOTYPE PREVIEW • EMOTIONAL SUPPORT TIERS
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                Emotional Buddy & Care Membership
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
                Explore our proposed plans for structured emotional accompaniment, private sisterhood check-ins, and clinical guidance. Help us calibrate fair, honest pricing.
              </p>

              {/* Currency Selector */}
              <div className="mt-4 inline-flex items-center p-1 rounded-xl bg-stone-100 border border-stone-200 text-xs">
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                    currency === 'USD'
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  USD ($)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('INR')}
                  className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                    currency === 'INR'
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  INR (₹)
                </button>
              </div>
            </div>

            {/* Tiers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {TIERS.map((tier) => {
                const isSelected = selectedTier === tier.id;
                const tierPrice =
                  currency === 'INR'
                    ? tier.priceINR === 0
                      ? '₹0'
                      : `₹${tier.priceINR}`
                    : tier.priceUSD === 0
                    ? '$0'
                    : `$${tier.priceUSD}`;

                return (
                  <div
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id)}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-purple-50/80 border-purple-500 ring-2 ring-purple-400/30 shadow-md'
                        : 'bg-stone-50/60 hover:bg-stone-50 border-stone-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                          {tier.badge}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-purple-700" />
                        )}
                      </div>
                      <h4 className="font-serif font-bold text-stone-900 text-base">
                        {tier.name}
                      </h4>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="font-serif text-2xl font-bold text-stone-900">
                          {tierPrice}
                        </span>
                        <span className="text-stone-500 text-[11px]">
                          /{tier.billingCycle}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-stone-600 leading-relaxed">
                        {tier.description}
                      </p>

                      <ul className="mt-3 space-y-1.5 text-[11px] text-stone-700 pt-3 border-t border-stone-200">
                        {tier.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-purple-600 font-bold">✓</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      className={`mt-4 w-full py-1.5 px-3 rounded-xl text-xs font-bold transition ${
                        isSelected
                          ? 'bg-purple-700 text-white'
                          : 'bg-stone-200 hover:bg-stone-300 text-stone-800'
                      }`}
                    >
                      {isSelected ? 'Selected Tier' : 'Select'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Reservation Form */}
            <form onSubmit={handleSubmitReservation} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-stone-200">
                <span className="font-bold text-stone-800">
                  Who would be paying for this support?
                </span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="payerType"
                      checked={payerType === 'self'}
                      onChange={() => setPayerType('self')}
                      className="accent-purple-700"
                    />
                    <span>Self (Out of pocket)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="payerType"
                      checked={payerType === 'employer'}
                      onChange={() => setPayerType('employer')}
                      className="accent-purple-700"
                    />
                    <span>Employer / Health Benefit</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 mb-1">
                    Pseudonym:
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`🌸 ${userProfile.pseudonym}`}
                    className="w-full px-3 py-1.5 rounded-lg bg-stone-200 text-stone-700 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1">
                    WhatsApp (For launch notification):
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 or +91..."
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-stone-300 focus:outline-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 mb-1">
                  What price point would make this an absolute no-brainer for you?
                </label>
                <input
                  type="text"
                  placeholder="e.g. $5/mo, ₹499/mo, or 'I prefer free with optional donation'..."
                  value={customPriceFeedback}
                  onChange={(e) => setCustomPriceFeedback(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-stone-300 focus:outline-purple-600"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[11px] text-stone-500 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-stone-400" />
                  <span>Prototype preview only. Zero credit card or payment collected.</span>
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Recording...' : currentTierObj.ctaText}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
