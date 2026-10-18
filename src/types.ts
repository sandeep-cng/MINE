export interface EmotionalJourneyEntry {
  id: string;
  timestamp: string;
  topic: string;
  distressLevel: number; // 0 - 100
  calmnessLevel: number; // 0 - 100
  sentimentLabel: 'High Distress' | 'Moderate Heaviness' | 'Calming Down' | 'Restorative';
  wordsPoured: number;
  affirmation: string;
  circleRecommended: string;
}

export interface UserProfile {
  pseudonym: string;
  whatsapp: string;
  email: string;
  pushEnabled: boolean;
  whatsappCheckinEnabled: boolean;
  isVerified: boolean;
  verifiedAt?: string;
  emotionalHistory?: EmotionalJourneyEntry[];
}

export interface CommunityReply {
  id: string;
  pseudonym: string;
  isVerified: boolean;
  content: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  circleId: string;
  circleTitle: string;
  pseudonym: string;
  isVerified: boolean;
  content: string;
  createdAt: string;
  hugsCount: number;
  replies: CommunityReply[];
}

export interface CircleDefinition {
  id: string;
  title: string;
  shortDesc: string;
  detailedDesc: string;
  iconName: string;
  memberCount: number;
  tags: string[];
  colorTheme?: {
    bg: string;
    border: string;
    badge: string;
    iconColor: string;
    gradient: string;
    cardBg?: string;
    hoverBorder?: string;
    accentText?: string;
    hugBg?: string;
  };
}

export interface RecommendedCircle {
  id: string;
  title: string;
  reason: string;
}

export interface AIListenResponse {
  success: boolean;
  empatheticResponse: string;
  recommendedCircle: RecommendedCircle;
  suggestProfessionalSupport: boolean;
  soothingAffirmation: string;
}

export interface ProfessionalSupportRequest {
  id: string;
  timestamp: string;
  pseudonym: string;
  email: string;
  whatsapp: string;
  concernType: string;
  urgency: string;
  notes: string;
  preferredMode: string;
  consentContact: boolean;
  status: string;
}

export interface ProfessionalStats {
  success: boolean;
  totalCount: number;
  concernBreakdown: Record<string, number>;
  urgencyBreakdown: Record<string, number>;
  targetNotificationEmail: string;
  notificationsSentCount: number;
  recentRequests: Array<{
    id: string;
    timestamp: string;
    pseudonym: string;
    concernType: string;
    urgency: string;
    preferredMode: string;
    hasEmail: boolean;
    hasWhatsApp: boolean;
    status: string;
  }>;
  recentNotifications: Array<{
    id: string;
    timestamp: string;
    recipient: string;
    subject: string;
    summary: string;
    status: string;
  }>;
}

export interface OpenWADispatchLog {
  id: string;
  timestamp: string;
  channel: 'whatsapp' | 'gmail';
  recipient: string;
  subject?: string;
  content: string;
  status: 'delivered' | 'queued_docker_waiting' | 'simulated';
  error?: string;
  waLink?: string;
}

export interface OpenWAStatus {
  online: boolean;
  url: string;
  port: number;
  totalDispatched: number;
  dockerCommand: string;
  recentLogs: OpenWADispatchLog[];
}

export interface LeapOfFaithAssumption {
  id: string;
  rank: number;
  title: string;
  category: 'Willingness to Pay' | 'Trust & Disclosure' | 'Repeat Habit' | 'Single Job' | 'Community Liveliness';
  statement: string;
  realWorldAnalogy: string; // e.g. Uber / Airbnb examples
  howWeTestIt: string;
  metricLabel: string;
  currentValue: string | number;
  targetThreshold: string | number;
  confidenceScore: number; // 0 - 100%
  status: 'validating' | 'on_track' | 'needs_attention';
  votesAgree: number;
  votesDisagree: number;
  keyRisk: string;
}

export interface WillingnessToPayEntry {
  id: string;
  timestamp: string;
  pseudonym: string;
  email?: string;
  whatsapp?: string;
  tierId: 'free' | 'emotional_buddy' | 'licensed_therapy';
  tierName: string;
  currency: 'USD' | 'INR';
  pricePoint: number;
  feedback?: string;
  wouldPay: boolean;
}

export interface EarlyAdopterFeedback {
  id: string;
  timestamp: string;
  pseudonym: string;
  email?: string;
  whatsapp?: string;
  willingProfessionalHelp: string;
  willingJoinCircles: string;
  preferredEngagement: string[];
  featuresVoted: string[];
  feedback?: string;
}
