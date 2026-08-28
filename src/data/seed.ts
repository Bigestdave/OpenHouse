import type { Workspace, Property, CaptureRequest } from './types';
import propAdmiraltyImg from '../assets/prop-admiralty.jpg';
import propOrchidImg from '../assets/prop-orchid.jpg';
import propLekkiImg from '../assets/prop-lekkigardens.jpg';
import propBourdillonImg from '../assets/prop-bourdillon.jpg';
import propKitchenImg from '../assets/prop-kitchen.png';

const now = Date.now();
// Use stable IDs for seed data so cross-references between entities remain consistent
let _seedCounter = 0;
const stableId = (prefix: string) => `${prefix}-${++_seedCounter}`;

export const SEED_WORKSPACE: Workspace = {
  id: 'ws-default',
  name: "David's Property Workspace",
  ownerName: 'David Olabowale',
  ownerEmail: 'david@openhouse.com',
  workType: 'agency',
  portfolioSize: '11–50 active properties',
  primaryMarket: 'Lagos, Nigeria',
  teamSize: '2–5 people',
  listingSource: 'demo',
  requireApproval: true,
  defaultVisibility: 'unlisted',
  notificationPreferences: {
    captureRequired: true,
    reviewReady: true,
    published: true,
    processingFailed: true,
    everyUpdate: false,
    channels: ['email', 'in_app'],
  },
  createdAt: now - 86400000 * 30, // 30 days ago
};

export const SEED_PROPERTIES: Property[] = [
  {
    id: stableId('prop'),
    title: '8 Admiralty Way',
    address: 'Lekki',
    type: '3-bed apartment',
    bedrooms: 3,
    bathrooms: 2,
    price: '₦8,000,000/year',
    description: 'Beautiful 3-bedroom apartment in Lekki.',
    status: 'needs_recapture',
    spaces: [
      { id: stableId('s'), name: 'Living Room', captured: true, verified: true, issues: [] },
      { id: stableId('s'), name: 'Kitchen', captured: true, verified: true, issues: [], thumbnailUrl: propKitchenImg },
      { id: stableId('s'), name: 'Main Bedroom', captured: true, verified: true, issues: [] },
      { id: stableId('s'), name: 'Bedroom 2', captured: true, verified: true, issues: [] },
      { id: stableId('s'), name: 'Bedroom 3', captured: true, verified: true, issues: [] },
      { id: stableId('s'), name: 'Bathroom', captured: true, verified: true, issues: [] },
      { id: stableId('s'), name: 'Balcony', captured: false, verified: false, issues: ['Missing full capture'] },
    ],
    sourceMedia: [],
    timeline: [
      { id: stableId('s'), timestamp: now - 3600000 * 4, event: 'Property detected', type: 'detection' },
      { id: stableId('s'), timestamp: now - 3600000 * 3, event: 'Media check', type: 'analysis' },
      { id: stableId('s'), timestamp: now - 3600000 * 2, event: 'Balcony missing', type: 'error', detail: 'Found balcony missing from media' },
      { id: stableId('s'), timestamp: now - 3600000 * 1, event: 'Capture request sent', type: 'capture_request' },
    ],
    coverImage: propAdmiraltyImg,
    createdAt: now - 86400000 * 2,
    updatedAt: now - 3600000 * 1,
    workspaceId: 'ws-default',
  },
  {
    id: stableId('prop'),
    title: '14 Bourdillon Road',
    address: 'Ikoyi',
    type: '5-bed detached house',
    bedrooms: 5,
    bathrooms: 6,
    price: '₦45,000,000/year',
    description: 'Luxury 5-bedroom detached house in Ikoyi.',
    status: 'preparing',
    spaces: Array(10).fill(null).map((_, i) => ({
      id: stableId('prop'), name: `Space ${i + 1}`, captured: true, verified: true, issues: []
    })),
    sourceMedia: [],
    timeline: [
      { id: stableId('s'), timestamp: now - 3600000 * 5, event: 'Property detected', type: 'detection' },
      { id: stableId('s'), timestamp: now - 3600000 * 4, event: 'Media check passed', type: 'analysis' },
      { id: stableId('s'), timestamp: now - 3600000 * 3, event: 'Reconstruction started', type: 'reconstruction' },
    ],
    coverImage: propBourdillonImg,
    createdAt: now - 86400000 * 3,
    updatedAt: now - 3600000 * 3,
    workspaceId: 'ws-default',
  },
  {
    id: stableId('prop'),
    title: 'Orchid Apartments, Unit 4',
    address: 'Lekki',
    type: '2-bed apartment',
    bedrooms: 2,
    bathrooms: 2,
    price: '₦4,500,000/year',
    description: 'Cozy 2-bedroom apartment.',
    status: 'quality_check',
    spaces: Array(5).fill(null).map((_, i) => ({
      id: stableId('prop'), name: `Room ${i + 1}`, captured: true, verified: true, issues: []
    })),
    sourceMedia: [],
    timeline: [
      { id: stableId('s'), timestamp: now - 86400000, event: 'Verification in progress', type: 'verification' }
    ],
    coverImage: propOrchidImg,
    createdAt: now - 86400000 * 4,
    updatedAt: now - 3600000 * 5,
    workspaceId: 'ws-default',
  },
  {
    id: stableId('prop'),
    title: 'Lekki Gardens, Unit 12',
    address: 'Lekki Phase 1',
    type: '3-bed terrace duplex',
    bedrooms: 3,
    bathrooms: 3,
    price: '₦6,000,000/year',
    description: 'Modern 3-bed terrace duplex.',
    status: 'ready_for_review',
    spaces: Array(6).fill(null).map((_, i) => ({
      id: stableId('prop'), name: `Area ${i + 1}`, captured: true, verified: true, issues: []
    })),
    sourceMedia: [],
    timeline: [
      { id: stableId('s'), timestamp: now - 86400000 * 2, event: 'Full pipeline complete, awaiting approval', type: 'info' }
    ],
    coverImage: propLekkiImg,
    createdAt: now - 86400000 * 5,
    updatedAt: now - 86400000 * 2,
    workspaceId: 'ws-default',
  },
  {
    id: stableId('prop'),
    title: 'Victoria Courts, Unit 8',
    address: 'Victoria Island',
    type: '4-bed penthouse',
    bedrooms: 4,
    bathrooms: 4,
    price: '₦18,000,000/year',
    description: 'Exquisite 4-bedroom penthouse.',
    status: 'live',
    spaces: Array(8).fill(null).map((_, i) => ({
      id: stableId('prop'), name: `Zone ${i + 1}`, captured: true, verified: true, issues: []
    })),
    sourceMedia: [],
    timeline: [
      { id: stableId('s'), timestamp: now - 86400000 * 4, event: 'Pipeline complete', type: 'info' },
      { id: stableId('s'), timestamp: now - 86400000 * 3, event: 'Approved', type: 'approval' },
      { id: stableId('s'), timestamp: now - 86400000 * 2, event: 'Published', type: 'publication' }
    ],
    experienceUrl: '/view/victoria-courts',
    coverImage: undefined,
    createdAt: now - 86400000 * 10,
    updatedAt: now - 86400000 * 2,
    workspaceId: 'ws-default',
  }
];

export const SEED_CAPTURE_REQUESTS: CaptureRequest[] = [
  {
    id: stableId('prop'),
    propertyId: SEED_PROPERTIES[0].id,
    propertyTitle: '8 Admiralty Way',
    room: 'Balcony',
    reason: 'The balcony is listed, but its entrance was not clearly captured.',
    instructions: 'Record one slow, 15-second video from the living room through the balcony doorway. Finish after showing the full balcony.',
    status: 'awaiting_capture',
    estimatedTime: '1 minute',
    recipientName: 'David Olabowale',
    captureUrl: '/capture/' + stableId('s'),
    createdAt: now - 3600000,
    updatedAt: now - 3600000,
  },
  {
    id: stableId('prop'),
    propertyId: SEED_PROPERTIES[1].id,
    propertyTitle: '14 Bourdillon Road',
    room: 'Garden terrace',
    reason: 'The garden terrace footage had excessive motion blur.',
    instructions: 'Record a steady 20-second pass along the garden terrace.',
    status: 'resolved',
    estimatedTime: '1 minute',
    recipientName: 'David Olabowale',
    captureUrl: '/capture/' + stableId('s'),
    createdAt: now - 86400000,
    updatedAt: now - 43200000,
  }
];

export function getSeedData() {
  return {
    workspace: SEED_WORKSPACE,
    properties: SEED_PROPERTIES,
    captureRequests: SEED_CAPTURE_REQUESTS,
    bookings: [],
    initialized: true,
  };
}
