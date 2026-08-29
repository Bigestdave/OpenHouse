import { useSyncExternalStore } from 'react';
import type {
  StoreState,
  Property,
  CaptureRequest,
  Booking,
  Workspace,
  PropertyStatus,
  TimelineEvent,
  MediaItem,
  Space,
} from './types';
import { getSeedData } from './seed';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEY = 'openhouse.store';
const db = supabase as any;

// In-memory single source of truth
let state: StoreState = {
  workspace: null,
  properties: [],
  captureRequests: [],
  bookings: [],
  initialized: false,
};

const listeners = new Set<(state: StoreState) => void>();
let realtimeInitialized = false;

export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

function notify() {
  listeners.forEach((listener) => {
    try {
      listener(state);
    } catch (e) {
      console.error('Error in store listener:', e);
    }
  });
}

function persistLocal() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  } catch (e) {
    console.error('Failed to persist store locally:', e);
  }
}

// Transform DB row (snake_case) to Frontend Property (camelCase)
function transformDbProperty(row: any, spaces: Space[] = [], timeline: TimelineEvent[] = []): Property {
  return {
    id: row.id,
    workspaceId: row.workspace_id || '00000000-0000-0000-0000-000000000001',
    title: row.title,
    address: row.address,
    type: row.type,
    bedrooms: row.bedrooms ?? 1,
    bathrooms: row.bathrooms ?? 1,
    price: row.price,
    description: row.description || '',
    status: row.status as PropertyStatus,
    experienceUrl: row.experience_url || undefined,
    coverImage: row.cover_image || undefined,
    createdAt: new Date(row.created_at).getTime(),
    updatedAt: new Date(row.updated_at).getTime(),
    spaces,
    sourceMedia: [],
    timeline,
  };
}

// Transform DB row to Frontend CaptureRequest
function transformDbCaptureRequest(row: any): CaptureRequest {
  return {
    id: row.id,
    propertyId: row.property_id,
    propertyTitle: row.property_title,
    room: row.room,
    reason: row.reason,
    instructions: row.instructions,
    estimatedTime: row.estimated_time || '1 minute',
    status: row.status,
    recipientName: row.recipient_name || 'David Olabowale',
    recipientPhone: row.recipient_phone || undefined,
    recipientEmail: row.recipient_email || undefined,
    captureUrl: row.capture_url || `/capture/${row.id}`,
    uploadedMedia: row.uploaded_media || [],
    createdAt: new Date(row.created_at).getTime(),
    updatedAt: new Date(row.updated_at).getTime(),
  };
}

// Transform DB row to Frontend Booking
function transformDbBooking(row: any): Booking {
  return {
    id: row.id,
    propertyId: row.property_id,
    propertyTitle: row.property_title,
    renterName: row.renter_name,
    renterPhone: row.renter_phone,
    renterEmail: row.renter_email,
    preferredDate: row.preferred_date,
    preferredTime: row.preferred_time,
    message: row.message || undefined,
    status: row.status || 'requested',
    createdAt: new Date(row.created_at).getTime(),
  };
}

// Transform DB row to Frontend Workspace
function transformDbWorkspace(row: any): Workspace {
  return {
    id: row.id,
    name: row.name,
    ownerName: row.owner_name,
    ownerEmail: row.owner_email,
    workType: row.work_type,
    portfolioSize: row.portfolio_size || '11–50 active properties',
    primaryMarket: row.primary_market || 'Lagos, Nigeria',
    teamSize: row.team_size || '2–5 people',
    listingSource: row.listing_source || 'demo',
    requireApproval: row.require_approval ?? true,
    defaultVisibility: row.default_visibility || 'unlisted',
    notificationPreferences: row.notification_preferences || {
      captureRequired: true,
      reviewReady: true,
      published: true,
      processingFailed: true,
      everyUpdate: false,
      channels: ['email', 'whatsapp', 'in_app'],
    },
    branding: row.branding || undefined,
    createdAt: new Date(row.created_at).getTime(),
  };
}

/**
 * Fetch latest remote data from Supabase and synchronize local state.
 */
export async function syncWithSupabase() {
  if (!isSupabaseConfigured) return;

  try {
    const [wsRes, propRes, spacesRes, timelineRes, reqRes, bookRes] = await Promise.all([
      db.from('workspaces').select('*').limit(1).maybeSingle(),
      db.from('properties').select('*').order('created_at', { ascending: false }),
      db.from('spaces').select('*'),
      db.from('timeline_events').select('*').order('timestamp', { ascending: false }),
      db.from('capture_requests').select('*').order('created_at', { ascending: false }),
      db.from('bookings').select('*').order('created_at', { ascending: false }),
    ]);

    const spacesByProp = new Map<string, Space[]>();
    (spacesRes?.data || []).forEach((s: any) => {
      const arr = spacesByProp.get(s.property_id) || [];
      arr.push({
        id: s.id,
        name: s.name,
        captured: s.captured,
        verified: s.verified,
        issues: s.issues || [],
        captureRequestId: s.capture_request_id || undefined,
        thumbnailUrl: s.thumbnail_url || undefined,
      });
      spacesByProp.set(s.property_id, arr);
    });

    const timelineByProp = new Map<string, TimelineEvent[]>();
    (timelineRes?.data || []).forEach((t: any) => {
      const arr = timelineByProp.get(t.property_id) || [];
      arr.push({
        id: t.id,
        timestamp: new Date(t.timestamp).getTime(),
        event: t.event,
        detail: t.detail || undefined,
        type: t.type,
        agentDecision: t.agent_decision || undefined,
        evidence: t.evidence || undefined,
        toolUsed: t.tool_used || undefined,
      });
      timelineByProp.set(t.property_id, arr);
    });

    const properties: Property[] = (propRes?.data || []).map((p: any) =>
      transformDbProperty(p, spacesByProp.get(p.id) || [], timelineByProp.get(p.id) || [])
    );

    const captureRequests: CaptureRequest[] = (reqRes?.data || []).map(transformDbCaptureRequest);
    const bookings: Booking[] = (bookRes?.data || []).map(transformDbBooking);
    const workspace: Workspace | null = wsRes?.data ? transformDbWorkspace(wsRes.data) : state.workspace;

    if (properties.length > 0 || captureRequests.length > 0) {
      state = {
        workspace,
        properties,
        captureRequests,
        bookings,
        initialized: true,
      };
      persistLocal();
      notify();
    }
  } catch (err) {
    console.error('Failed to synchronize store with Supabase:', err);
  }
}

/**
 * Setup Supabase Realtime Channels for instant multi-user reactivity.
 */
function setupRealtimeSubscriptions() {
  if (!isSupabaseConfigured || realtimeInitialized) return;
  realtimeInitialized = true;

  db
    .channel('openhouse_realtime_sync')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'properties' },
      () => {
        syncWithSupabase();
      }
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'spaces' },
      () => {
        syncWithSupabase();
      }
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'timeline_events' },
      () => {
        syncWithSupabase();
      }
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'capture_requests' },
      () => {
        syncWithSupabase();
      }
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'bookings' },
      () => {
        syncWithSupabase();
      }
    )
    .subscribe();
}

/**
 * Initialize Store with fallback to LocalStorage/Seed data and Supabase sync.
 */
export function initStore(): void {
  if (state.initialized) return;

  try {
    const raw = typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.properties)) {
        state = { ...parsed, initialized: true };
      } else {
        state = { ...getSeedData(), initialized: true };
      }
    } else {
      state = { ...getSeedData(), initialized: true };
    }
  } catch (e) {
    console.error('Failed to load local store:', e);
    state = { ...getSeedData(), initialized: true };
  }

  persistLocal();
  notify();

  // If Supabase is available, sync and setup realtime listeners
  if (isSupabaseConfigured) {
    syncWithSupabase();
    setupRealtimeSubscriptions();
  }
}

// Auto-initialize store on module import
initStore();

export function resetStore(): void {
  const seed = getSeedData();
  state = {
    ...seed,
    initialized: true,
  };
  persistLocal();
  notify();

  if (isSupabaseConfigured) {
    syncWithSupabase();
  }
}

export function getState(): StoreState {
  return state;
}

export function subscribe(listener: (state: StoreState) => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// --- Properties API ---

export function getProperties(): Property[] {
  return state.properties;
}

export function getProperty(id: string): Property | undefined {
  return state.properties.find((p) => p.id === id);
}

export function addProperty(property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Property {
  const newId = generateId();
  const now = Date.now();
  const newProperty: Property = {
    ...property,
    id: newId,
    createdAt: now,
    updatedAt: now,
  };

  // Optimistic update
  state = {
    ...state,
    properties: [newProperty, ...state.properties],
  };
  persistLocal();
  notify();

  // Background Supabase Sync
  if (isSupabaseConfigured) {
    const workspaceId = property.workspaceId || '00000000-0000-0000-0000-000000000001';
    db
      .from('properties')
      .insert({
        id: newId,
        workspace_id: workspaceId,
        title: property.title,
        address: property.address,
        type: property.type,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        price: property.price,
        description: property.description,
        status: property.status,
        cover_image: property.coverImage || null,
        experience_url: property.experienceUrl || null,
      })
      .then(async (res: any) => {
        if (res?.error) {
          console.error('Supabase property insert error:', res.error);
          return;
        }
        // Insert spaces
        if (property.spaces && property.spaces.length > 0) {
          const spaceRows = property.spaces.map((s) => ({
            id: s.id.includes('-') && s.id.length > 20 ? s.id : generateId(),
            property_id: newId,
            name: s.name,
            captured: s.captured,
            verified: s.verified,
            issues: s.issues || [],
          }));
          await db.from('spaces').insert(spaceRows);
        }
      });
  }

  return newProperty;
}

export function updateProperty(id: string, updates: Partial<Property>): Property | undefined {
  let updatedProperty: Property | undefined;
  state = {
    ...state,
    properties: state.properties.map((p) => {
      if (p.id === id) {
        updatedProperty = { ...p, ...updates, updatedAt: Date.now() };
        return updatedProperty;
      }
      return p;
    }),
  };

  if (updatedProperty) {
    persistLocal();
    notify();

    if (isSupabaseConfigured) {
      const dbUpdates: any = {
        updated_at: new Date().toISOString(),
      };
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.address !== undefined) dbUpdates.address = updates.address;
      if (updates.price !== undefined) dbUpdates.price = updates.price;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.coverImage !== undefined) dbUpdates.cover_image = updates.coverImage;
      if (updates.experienceUrl !== undefined) dbUpdates.experience_url = updates.experienceUrl;

      db.from('properties').update(dbUpdates).eq('id', id);
    }
  }
  return updatedProperty;
}

export function updatePropertyStatus(
  id: string,
  status: PropertyStatus,
  timelineEvent?: Omit<TimelineEvent, 'id' | 'timestamp'>
): Property | undefined {
  let updatedProperty: Property | undefined;
  const eventId = generateId();
  const now = Date.now();

  state = {
    ...state,
    properties: state.properties.map((p) => {
      if (p.id === id) {
        const updatedTimeline = timelineEvent
          ? [{ ...timelineEvent, id: eventId, timestamp: now }, ...p.timeline]
          : p.timeline;

        updatedProperty = {
          ...p,
          status,
          timeline: updatedTimeline,
          updatedAt: now,
        };
        return updatedProperty;
      }
      return p;
    }),
  };

  if (updatedProperty) {
    persistLocal();
    notify();

    if (isSupabaseConfigured) {
      db.from('properties').update({ status, updated_at: new Date().toISOString() }).eq('id', id).then();
      if (timelineEvent) {
        db
          .from('timeline_events')
          .insert({
            id: eventId,
            property_id: id,
            event: timelineEvent.event,
            detail: timelineEvent.detail || null,
            type: timelineEvent.type,
            agent_decision: timelineEvent.agentDecision || null,
            evidence: timelineEvent.evidence || null,
            tool_used: timelineEvent.toolUsed || null,
          })
          .then();
      }
    }
  }
  return updatedProperty;
}

export function addTimelineEvent(propertyId: string, event: Omit<TimelineEvent, 'id' | 'timestamp'>): void {
  const eventId = generateId();
  const now = Date.now();

  state = {
    ...state,
    properties: state.properties.map((p) => {
      if (p.id === propertyId) {
        return {
          ...p,
          timeline: [{ ...event, id: eventId, timestamp: now }, ...p.timeline],
          updatedAt: now,
        };
      }
      return p;
    }),
  };
  persistLocal();
  notify();

  if (isSupabaseConfigured) {
    db
      .from('timeline_events')
      .insert({
        id: eventId,
        property_id: propertyId,
        event: event.event,
        detail: event.detail || null,
        type: event.type,
        agent_decision: event.agentDecision || null,
        evidence: event.evidence || null,
        tool_used: event.toolUsed || null,
      })
      .then();
  }
}

export function deleteProperty(id: string): void {
  state = {
    ...state,
    properties: state.properties.filter((p) => p.id !== id),
  };
  persistLocal();
  notify();

  if (isSupabaseConfigured) {
    db.from('properties').delete().eq('id', id).then();
  }
}

export function getPropertiesByStatus(status: PropertyStatus): Property[] {
  return state.properties.filter((p) => p.status === status);
}

export function getPropertyStats() {
  const stats = { total: 0, live: 0, preparing: 0, needsAttention: 0, readyForReview: 0 };
  state.properties.forEach((p) => {
    stats.total++;
    if (p.status === 'live') stats.live++;
    if (p.status === 'preparing') stats.preparing++;
    if (p.status === 'needs_recapture' || p.status === 'failed') stats.needsAttention++;
    if (p.status === 'ready_for_review') stats.readyForReview++;
  });
  return stats;
}

// --- Capture Requests API ---

export function getCaptureRequests(): CaptureRequest[] {
  return state.captureRequests;
}

export function getCaptureRequest(id: string): CaptureRequest | undefined {
  return state.captureRequests.find((cr) => cr.id === id);
}

export function getCaptureRequestsForProperty(propertyId: string): CaptureRequest[] {
  return state.captureRequests.filter((cr) => cr.propertyId === propertyId);
}

export function addCaptureRequest(
  request: Omit<CaptureRequest, 'id' | 'createdAt' | 'updatedAt' | 'captureUrl'>
): CaptureRequest {
  const id = generateId();
  const now = Date.now();
  const newRequest: CaptureRequest = {
    ...request,
    id,
    captureUrl: `/capture/${id}`,
    createdAt: now,
    updatedAt: now,
  };

  state = {
    ...state,
    captureRequests: [newRequest, ...state.captureRequests],
  };
  persistLocal();
  notify();

  if (isSupabaseConfigured) {
    db
      .from('capture_requests')
      .insert({
        id,
        property_id: request.propertyId,
        property_title: request.propertyTitle,
        room: request.room,
        reason: request.reason,
        instructions: request.instructions,
        estimated_time: request.estimatedTime || '1 minute',
        status: request.status,
        recipient_name: request.recipientName,
        recipient_phone: request.recipientPhone || null,
        recipient_email: request.recipientEmail || null,
        capture_url: `/capture/${id}`,
        uploaded_media: [],
      })
      .then();
  }

  return newRequest;
}

export function updateCaptureRequest(id: string, updates: Partial<CaptureRequest>): CaptureRequest | undefined {
  let updatedRequest: CaptureRequest | undefined;
  state = {
    ...state,
    captureRequests: state.captureRequests.map((cr) => {
      if (cr.id === id) {
        updatedRequest = { ...cr, ...updates, updatedAt: Date.now() };
        return updatedRequest;
      }
      return cr;
    }),
  };

  if (updatedRequest) {
    persistLocal();
    notify();

    if (isSupabaseConfigured) {
      const dbUpdates: any = { updated_at: new Date().toISOString() };
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.uploadedMedia !== undefined) dbUpdates.uploaded_media = updates.uploadedMedia;
      db.from('capture_requests').update(dbUpdates).eq('id', id).then();
    }
  }
  return updatedRequest;
}

export function resolveCaptureRequest(id: string, media?: MediaItem[]): void {
  const request = getCaptureRequest(id);
  if (!request) return;

  // 1. Update capture request
  updateCaptureRequest(id, {
    status: 'resolved',
    uploadedMedia: media || [],
  });

  // 2. Update associated property and space
  state = {
    ...state,
    properties: state.properties.map((p) => {
      if (p.id === request.propertyId) {
        const otherPendingRequests = state.captureRequests.filter(
          (cr) => cr.propertyId === p.id && cr.id !== id && cr.status !== 'resolved' && cr.status !== 'failed'
        );

        const updatedSpaces = p.spaces.map((space) => {
          if (space.name === request.room || space.captureRequestId === id) {
            return { ...space, captured: true, verified: true };
          }
          return space;
        });

        const newStatus =
          p.status === 'needs_recapture' && otherPendingRequests.length === 0
            ? 'checking_media'
            : p.status;

        return {
          ...p,
          spaces: updatedSpaces,
          status: newStatus,
          updatedAt: Date.now(),
        };
      }
      return p;
    }),
  };

  persistLocal();
  notify();

  if (isSupabaseConfigured) {
    // Update Space in Supabase
    db
      .from('spaces')
      .update({ captured: true, verified: true })
      .eq('property_id', request.propertyId)
      .eq('name', request.room)
      .then();

    // Conditionally restore property status
    const property = getProperty(request.propertyId);
    if (property && property.status === 'checking_media') {
      db
        .from('properties')
        .update({ status: 'checking_media', updated_at: new Date().toISOString() })
        .eq('id', request.propertyId)
        .then();
    }
  }
}

// --- Bookings API ---

export function getBookings(): Booking[] {
  return state.bookings;
}

export function addBooking(booking: Omit<Booking, 'id' | 'createdAt'>): Booking {
  const id = generateId();
  const now = Date.now();
  const newBooking: Booking = {
    ...booking,
    id,
    createdAt: now,
  };

  state = {
    ...state,
    bookings: [newBooking, ...state.bookings],
  };
  persistLocal();
  notify();

  if (isSupabaseConfigured) {
    db
      .from('bookings')
      .insert({
        id,
        property_id: booking.propertyId,
        property_title: booking.propertyTitle,
        renter_name: booking.renterName,
        renter_phone: booking.renterPhone,
        renter_email: booking.renterEmail,
        preferred_date: booking.preferredDate,
        preferred_time: booking.preferredTime,
        message: booking.message || null,
        status: booking.status || 'requested',
      })
      .then();
  }

  return newBooking;
}

// --- Workspace API ---

export function getWorkspace(): Workspace | null {
  return state.workspace;
}

export function setWorkspace(workspace: Workspace): void {
  state = {
    ...state,
    workspace,
  };
  persistLocal();
  notify();

  if (isSupabaseConfigured) {
    db
      .from('workspaces')
      .upsert({
        id: workspace.id,
        name: workspace.name,
        owner_name: workspace.ownerName,
        owner_email: workspace.ownerEmail,
        work_type: workspace.workType,
        portfolio_size: workspace.portfolioSize,
        primary_market: workspace.primaryMarket,
        team_size: workspace.teamSize,
        listing_source: workspace.listingSource,
        require_approval: workspace.requireApproval,
        default_visibility: workspace.defaultVisibility,
        notification_preferences: workspace.notificationPreferences as any,
        branding: workspace.branding as any,
      })
      .then();
  }
}

// --- React Hooks ---

export function useStore(): StoreState {
  return useSyncExternalStore(subscribe, getState, getState);
}

export function useProperty(id: string): Property | undefined {
  const currentStore = useStore();
  return currentStore.properties.find((p) => p.id === id);
}

export function usePropertyStats() {
  const currentStore = useStore();
  const stats = { total: 0, live: 0, preparing: 0, needsAttention: 0, readyForReview: 0 };
  currentStore.properties.forEach((p) => {
    stats.total++;
    if (p.status === 'live') stats.live++;
    if (p.status === 'preparing') stats.preparing++;
    if (p.status === 'needs_recapture' || p.status === 'failed') stats.needsAttention++;
    if (p.status === 'ready_for_review') stats.readyForReview++;
  });
  return stats;
}

export function useCaptureRequests(): CaptureRequest[] {
  const currentStore = useStore();
  return currentStore.captureRequests;
}
