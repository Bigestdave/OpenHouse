export type PropertyStatus =
  | 'LISTING_RECEIVED'
  | 'ANALYZING'
  | 'NEEDS_CAPTURE'
  | 'CAPTURE_REQUESTED'
  | 'CAPTURE_RECEIVED'
  | 'VERIFYING'
  | 'NEEDS_MORE_CAPTURE'
  | 'READY'
  | 'EXPERIENCE_BUILT'
  | 'PUBLISHED';

export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
  LISTING_RECEIVED: 'Listing received',
  ANALYZING: 'Analyzing media',
  NEEDS_CAPTURE: 'Needs capture',
  CAPTURE_REQUESTED: 'Capture requested',
  CAPTURE_RECEIVED: 'Capture received',
  VERIFYING: 'Verifying media',
  NEEDS_MORE_CAPTURE: 'Needs more capture',
  READY: 'Ready',
  EXPERIENCE_BUILT: 'Experience built',
  PUBLISHED: 'Published',
};

export const PROPERTY_STATUS_ORDER: PropertyStatus[] = [
  'LISTING_RECEIVED',
  'ANALYZING',
  'NEEDS_CAPTURE',
  'CAPTURE_REQUESTED',
  'CAPTURE_RECEIVED',
  'VERIFYING',
  'NEEDS_MORE_CAPTURE',
  'READY',
  'EXPERIENCE_BUILT',
  'PUBLISHED',
];

export type CaptureRequestStatus =
  | 'pending'
  | 'sent'
  | 'awaiting_capture'
  | 'received'
  | 'checking'
  | 'resolved'
  | 'failed';

export interface Space {
  id: string;
  name: string;
  captured: boolean;
  verified: boolean;
  issues: string[];
  captureRequestId?: string;
  thumbnailUrl?: string;
}

export interface MediaItem {
  id: string;
  url: string;
  type: 'photo' | 'video' | 'floor_plan' | 'panorama';
  room?: string;
  quality: 'good' | 'acceptable' | 'poor' | 'unchecked';
  uploadedAt: number;
}

export interface TimelineEvent {
  id: string;
  timestamp: number;
  event: string;
  detail?: string;
  type:
    | 'detection'
    | 'analysis'
    | 'capture_request'
    | 'capture_received'
    | 'reconstruction'
    | 'verification'
    | 'approval'
    | 'publication'
    | 'error'
    | 'info';
  agentDecision?: string;
  evidence?: string;
  toolUsed?: string;
}

export interface Property {
  id: string;
  title: string;
  address: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  price: string;
  description: string;
  status: PropertyStatus;
  spaces: Space[];
  sourceMedia: MediaItem[];
  timeline: TimelineEvent[];
  experienceUrl?: string;
  coverImage?: string;
  createdAt: number;
  updatedAt: number;
  workspaceId: string;
}

export interface CaptureRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  room: string;
  reason: string;
  instructions: string;
  estimatedTime: string;
  status: CaptureRequestStatus;
  recipientName: string;
  recipientPhone?: string;
  recipientEmail?: string;
  captureUrl: string;
  uploadedMedia?: MediaItem[];
  createdAt: number;
  updatedAt: number;
}

export interface Booking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  renterName: string;
  renterPhone: string;
  renterEmail: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
  status: 'requested' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: number;
}

export interface NotificationPreferences {
  captureRequired: boolean;
  reviewReady: boolean;
  published: boolean;
  processingFailed: boolean;
  everyUpdate: boolean;
  channels: ('email' | 'whatsapp' | 'sms' | 'in_app')[];
}

export interface BrandingConfig {
  agencyName?: string;
  logoUrl?: string;
  brandColor?: string;
  contactDestination?: string;
}

export interface Workspace {
  id: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  workType: 'agency' | 'independent' | 'manager';
  portfolioSize: string;
  primaryMarket: string;
  teamSize: string;
  listingSource: 'demo' | 'webhook' | 'csv' | 'manual';
  requireApproval: boolean;
  defaultVisibility: 'unlisted' | 'public' | 'password';
  notificationPreferences: NotificationPreferences;
  branding?: BrandingConfig;
  createdAt: number;
}

export interface StoreState {
  workspace: Workspace | null;
  properties: Property[];
  captureRequests: CaptureRequest[];
  bookings: Booking[];
  initialized: boolean;
}
