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
