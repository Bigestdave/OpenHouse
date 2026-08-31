import { getProperty, updatePropertyStatus, addCaptureRequest, addTimelineEvent, addProperty } from './store';
import type { Property, Space } from './types';
import { validatePropertySpatialContinuity } from '../lib/gemini';

// Store active timers
const activeTimers = new Map<string, ReturnType<typeof setTimeout>>();

/**
 * Cancel any running workflow timers (cleanup on unmount).
 */
export function cancelWorkflow(propertyId: string): void {
  const timer = activeTimers.get(propertyId);
  if (timer) {
    clearTimeout(timer);
    activeTimers.delete(propertyId);
  }
}

function setWorkflowTimer(propertyId: string, delayMs: number, callback: () => void) {
  cancelWorkflow(propertyId);
  const timer = setTimeout(() => {
    activeTimers.delete(propertyId);
    callback();
  }, delayMs);
  activeTimers.set(propertyId, timer);
}

/**
 * Start the autonomous workflow for a newly detected property.
 * This simulates the agent processing pipeline with realistic delays.
 * Each step adds a timeline event explaining what the agent did.
 */
export function startPropertyWorkflow(propertyId: string): void {
  const property = getProperty(propertyId);
  if (!property) return;

  updatePropertyStatus(propertyId, 'LISTING_RECEIVED');
  addTimelineEvent(propertyId, {
    type: 'detection',
    event: 'Listing received',
    detail: 'Property information collected from listing portal',
  });

  setWorkflowTimer(propertyId, 1200, async () => {
    const currentProp = getProperty(propertyId);
    if (!currentProp) return;

    updatePropertyStatus(propertyId, 'ANALYZING');
    const analysis = await validatePropertySpatialContinuity(
      currentProp.title,
      currentProp.spaces.map((space) => space.name)
    );
    addTimelineEvent(propertyId, {
      type: 'analysis',
      event: `Spatial analysis complete (${analysis.model})`,
      detail: analysis.passed
        ? `Coverage confidence ${(analysis.confidenceScore * 100).toFixed(0)}%`
        : `Missing ${analysis.missingConnections[0]?.toRoom || 'required'} coverage`,
    });

    const missingSpace = currentProp.spaces.find((s) => s.captured === false)
      || (analysis.missingConnections[0]
        ? currentProp.spaces.find((s) => s.name.toLowerCase().includes(analysis.missingConnections[0].toRoom.toLowerCase().split(' ')[0]))
        : undefined);

    setWorkflowTimer(propertyId, 1800, () => {
      const propToCheck = getProperty(propertyId);
      if (!propToCheck) return;

      if (missingSpace) {
        updatePropertyStatus(propertyId, 'NEEDS_CAPTURE');
        addTimelineEvent(propertyId, {
          type: 'capture_request',
          event: `Coverage insufficient for ${missingSpace.name}`,
          detail: 'Recapture required before build can continue',
        });

        if (typeof addCaptureRequest === 'function') {
          addCaptureRequest({
            propertyId,
            propertyTitle: propToCheck.title,
            room: missingSpace.name,
            reason: 'Insufficient coverage',
            instructions: `Please record a continuous 15-second pass covering ${missingSpace.name}`,
            estimatedTime: '1 min',
            recipientName: 'Property Manager',
            status: 'sent',
          });
        }
        updatePropertyStatus(propertyId, 'CAPTURE_REQUESTED');
      } else {
        startVerifying(propertyId);
      }
    });
  });
}

function startVerifying(propertyId: string) {
  updatePropertyStatus(propertyId, 'VERIFYING');
  addTimelineEvent(propertyId, {
    type: 'verification',
    event: 'Verifying evidence quality',
    detail: 'Checking room continuity and media quality thresholds',
  });

  setWorkflowTimer(propertyId, 2200, () => {
    updatePropertyStatus(propertyId, 'READY');
    addTimelineEvent(propertyId, {
      type: 'approval',
      event: 'Verification passed',
      detail: 'Property is ready to build buyer-facing experience',
    });

    setWorkflowTimer(propertyId, 1800, () => {
      updatePropertyStatus(propertyId, 'EXPERIENCE_BUILT');
      addTimelineEvent(propertyId, {
        type: 'reconstruction',
        event: 'Buyer experience built',
        detail: 'Interactive property experience available for publish action',
      });
    });
  });
}

/**
 * Resume the workflow after a capture request is resolved.
 * Called automatically by store.resolveCaptureRequest, but can also be called manually.
 */
export function resumePropertyWorkflow(propertyId: string): void {
  const property = getProperty(propertyId);
  if (!property) return;

  updatePropertyStatus(propertyId, 'CAPTURE_RECEIVED');
  addTimelineEvent(propertyId, {
    type: 'capture_received',
    event: 'Capture upload received',
    detail: 'Running verification on newly uploaded footage',
  });

  setWorkflowTimer(propertyId, 1600, () => {
    const currentProp = getProperty(propertyId);
    if (!currentProp) return;

    const missingSpace = currentProp.spaces.find((s) => s.captured === false);
    if (missingSpace) {
      updatePropertyStatus(propertyId, 'NEEDS_MORE_CAPTURE');
      addTimelineEvent(propertyId, {
        type: 'capture_request',
        event: `Coverage insufficient for ${missingSpace.name}`,
        detail: 'Additional capture is still required',
      });

      if (typeof addCaptureRequest === 'function') {
        addCaptureRequest({
          propertyId,
          propertyTitle: currentProp.title,
          room: missingSpace.name,
          reason: 'Insufficient coverage',
          instructions: `Please provide a 360 panorama or clear photos of the ${missingSpace.name}`,
          estimatedTime: '5 mins',
          recipientName: 'Property Manager',
          status: 'sent',
        });
      }
      updatePropertyStatus(propertyId, 'CAPTURE_REQUESTED');
    } else {
      startVerifying(propertyId);
    }
  });
}

/**
 * Approve a property for publication.
 * Advances from 'ready_for_review' to 'live' and adds publication timeline events.
 */
export function approveProperty(propertyId: string): void {
  cancelWorkflow(propertyId);
  updatePropertyStatus(propertyId, 'PUBLISHED');
  addTimelineEvent(propertyId, {
    type: 'publication',
    event: 'Publication approved by Agent',
    detail: 'Experience is now live and shareable',
  });
}

/**
 * Simulate the full webhook flow: a new listing arrives and triggers the full pipeline.
 * This is called from the Demo Portal when a realtor publishes a listing.
 */
export function handleNewListing(listing: {
  title: string;
  address: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  price: string;
  description: string;
  coverImage?: string;
  spaces?: Array<{ name: string; captured?: boolean }>;
}): string {
  const baseId = `prop-${listing.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'listing'}`;
  const propertyId = getProperty(baseId) ? `${baseId}-${Date.now().toString().slice(-4)}` : baseId;

  const spaces: Space[] = (listing.spaces || []).map((s, idx) => ({
    id: `space-${Date.now()}-${idx}`,
    name: s.name,
    captured: s.captured ?? true,
    verified: false,
    issues: [],
  }));

  const newProperty: Property = {
    id: propertyId,
    title: listing.title,
    address: listing.address,
    type: listing.type,
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
    price: listing.price,
    description: listing.description,
    status: 'LISTING_RECEIVED',
    spaces,
    sourceMedia: [],
    timeline: [],
    coverImage: listing.coverImage,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    workspaceId: 'default',
  };

  if (typeof addProperty === 'function') {
    addProperty(newProperty);
  } else {
    console.warn('addProperty not found in store, could not save new property state.');
  }

  startPropertyWorkflow(propertyId);
  return propertyId;
}
