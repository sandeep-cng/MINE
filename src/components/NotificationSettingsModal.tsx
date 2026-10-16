import React, { useState } from 'react';
import {
  X,
  Bell,
  MessageSquare,
  Mail,
  CheckCircle2,
  Send,
  Sparkles,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { UserProfile } from '../types';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
}) => {
  const [whatsapp, setWhatsapp] = useState(userProfile.whatsapp || '');
  const [email, setEmail] = useState(userProfile.email || '');
  const [pushEnabled, setPushEnabled] = useState(userProfile.pushEnabled || false);
  const [whatsappCheckin, setWhatsappCheckin] = useState(
    userProfile.whatsappCheckinEnabled ?? true
  );
  const [testNotificationSent, setTestNotificationSent] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleRequestPushPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop/mobile push notifications.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setPushEnabled(true);
        new Notification('HerSanctuary Sisterhood', {
          body: '🌸 Push notifications enabled. We will gently hold space for your healing.',
          icon: '/favicon.ico',
        });
      } else {
        alert('Push notifications were denied. You can re-enable them in browser site settings.');
      }
    } catch (err) {
      console.error('Push error:', err);
    }
  };

  const handleTriggerTestPush = () => {
    setTestNotificationSent(true);
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('HerSanctuary Gentle Check-in', {
        body: `🌸 Gentle reminder for ${userProfile.pseudonym}: Take a deep breath. A sister left you a warm hug.`,
      });
    }
    setTimeout(() => setTestNotificationSent(false), 4000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      whatsapp: whatsapp.trim(),
      email: email.trim(),
      pushEnabled,
      whatsappCheckinEnabled: whatsappCheckin,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-purple-200 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-purple-50 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 mx-auto mb-3">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
            WhatsApp & Push Notifications
          </h3>
          <p className="mt-1.5 text-stone-600 text-xs sm:text-sm">
            Load your contact details for gentle reminders to return, check in on your emotional health, and receive sister hugs.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* WhatsApp Field */}
          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
              WhatsApp Number (with country code)
            </label>
            <div className="relative">
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+1 (555) 234-5678 or +91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-xl bg-purple-50/40 border border-stone-200 text-sm focus:border-purple-400 focus:bg-white focus:outline-hidden"
              />
              <MessageSquare className="w-4 h-4 text-emerald-600 absolute right-3.5 top-3" />
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              Used for confidential evening check-ins and community responses.
            </p>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sister@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-purple-50/40 border border-stone-200 text-sm focus:border-purple-400 focus:bg-white focus:outline-hidden"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute right-3.5 top-3" />
            </div>
          </div>

          {/* Toggles */}
          <div className="pt-2 space-y-3">
            <label className="flex items-start gap-3 p-3 rounded-2xl bg-purple-50/80 border border-purple-200/80 cursor-pointer">
              <input
                type="checkbox"
                checked={whatsappCheckin}
                onChange={(e) => setWhatsappCheckin(e.target.checked)}
                className="mt-1 rounded text-purple-600 focus:ring-purple-500"
              />
              <div className="text-xs">
                <span className="font-bold text-stone-900 block">
                  Daily Evening WhatsApp Check-In (8:00 PM)
                </span>
                <span className="text-stone-600 text-[11px]">
                  A soothing prompt: "How is your heart feeling tonight? Come back and breathe with us."
                </span>
              </div>
            </label>

            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-3">
              <div className="text-xs">
                <span className="font-bold text-stone-900 block">
                  Browser Push Notifications
                </span>
                <span className="text-stone-600 text-[11px]">
                  Alerts when another sister sends you a warm hug or reply.
                </span>
              </div>
              <button
                type="button"
                onClick={handleRequestPushPermission}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  pushEnabled
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-purple-700 text-white hover:bg-purple-800'
                }`}
              >
                {pushEnabled ? 'Enabled ✓' : 'Enable'}
              </button>
            </div>
          </div>

          {/* Test Push Trigger */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={handleTriggerTestPush}
              className="text-xs text-purple-700 hover:text-purple-800 underline font-medium"
            >
              Send Me a Test Check-in Alert Now
            </button>
            {testNotificationSent && (
              <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                ✓ Test notification sent! Check your notification tray.
              </p>
            )}
          </div>

          {/* Privacy Guarantee */}
          <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-100 text-[11px] text-stone-600 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Your phone and email are never shared, sold, or displayed to other members.
            </span>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Preferences Saved!</span>
              </>
            ) : (
              <span>Save Contact & Notification Settings</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
