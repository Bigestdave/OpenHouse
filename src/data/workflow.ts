import { getProperty, updatePropertyStatus, addCaptureRequest, addTimelineEvent, addProperty } from './store';
import type { Space } from './types';

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

  updatePropertyStatus(propertyId, 'detected');
  addTimelineEvent(propertyId, {
    type: 'detection',
    event: 'New listing detected',
    detail: `Property at ${property.address} detected from listing portal. OpenHouse began background intake.`,
    agentDecision: 'Ingest property description, media manifest, and room expectations.',
    toolUsed: 'ListingWebhookHandler'
  });

  setWorkflowTimer(propertyId, 2500, () => {
    const currentProp = getProperty(propertyId);
    if (!currentProp) return;

    updatePropertyStatus(propertyId, 'checking_media');
    const mediaCount = currentProp.sourceMedia?.length || 8;
    const spaceCount = currentProp.spaces?.length || 7;
    addTimelineEvent(propertyId, {
      type: 'analysis',
      event: 'Checking media quality and coverage',
      detail: `Evaluating ${mediaCount} source captures across ${spaceCount} advertised spaces. Checking overlap & motion stability.`,
      agentDecision: 'Run multimodal Gemini room coverage assessment.',
      evidence: 'Source photographs & listing floor plan',
      toolUsed: 'GeminiMediaAnalyzer'
    });

    const missingSpace = currentProp.spaces.find(s => s.captured === false);
    const delay = missingSpace ? 3500 : 4500;

    setWorkflowTimer(propertyId, delay, () => {
      const propToCheck = getProperty(propertyId);
      if (!propToCheck) return;

      const stillMissingSpace = propToCheck.spaces.find(s => s.captured === false);

      if (stillMissingSpace) {
        updatePropertyStatus(propertyId, 'needs_recapture');
        addTimelineEvent(propertyId, {
          type: 'capture_request',
          event: `Coverage insufficient for ${stillMissingSpace.name}`,
          detail: `The ${stillMissingSpace.name} is listed, but doorway connection coverage is incomplete. One 15-second guided mobile walkthrough requested.`,
          agentDecision: `Pause reconstruction and dispatch capture request to realtor via WhatsApp and in-app link.`,
          evidence: `Floor plan indicates connection between Living Room and ${stillMissingSpace.name}, but video path is missing.`,
          toolUsed: 'CaptureRequestDispatcher'
        });
        
        addCaptureRequest({
          propertyId,
          propertyTitle: propToCheck.title,
          room: stillMissingSpace.name,
          reason: `The ${stillMissingSpace.name} is listed, but its entrance was not clearly captured.`,
          instructions: `Record one slow, 15-second video from the living room through the ${stillMissingSpace.name.toLowerCase()} doorway. Finish after showing the full space.`,
          estimatedTime: '1 minute',
          recipientName: 'David Olabowale',
          recipientPhone: '+234 800 000 0000',
          recipientEmail: 'david@openhouse.com',
          status: 'awaiting_capture'
        });
      } else {
        startPreparing(propertyId);
      }
    });
  });
}

function startPreparing(propertyId: string) {
  updatePropertyStatus(propertyId, 'preparing');
  addTimelineEvent(propertyId, {
    type: 'reconstruction',
    event: 'Evidence requirements satisfied',
    detail: 'All advertised rooms confirmed with sufficient trajectory overlap. Estimating camera poses and starting Gaussian Splat training.',
    agentDecision: 'Execute Colmap camera alignment & Splatfacto 3D reconstruction.',
    evidence: '100% room coverage verified across all spaces.',
    toolUsed: 'SplatfactoPipelineWorker'
  });

  setWorkflowTimer(propertyId, 7000, () => {
    updatePropertyStatus(propertyId, 'quality_check');
    addTimelineEvent(propertyId, {
      type: 'verification',
      event: 'Reconstruction complete · Quality checking',
      detail: 'Generated spatial representation rendered at 12 verification viewpoints. Checking for visual floaters, lighting fidelity, and mobile optimization.',
      agentDecision: 'Compare rendered viewpoints against original reference frames.',
      evidence: '12 verification viewpoints evaluated (0 structural contradictions found).',
      toolUsed: 'ExperienceQualityVerifier'
    });

    setWorkflowTimer(propertyId, 4500, () => {
      updatePropertyStatus(propertyId, 'ready_for_review');
      addTimelineEvent(propertyId, {
        type: 'approval',
        event: 'Quality verification passed · Awaiting approval',
        detail: '6 of 6 spaces represented. Mobile WebGL bundle compressed (12.4 MB). Ready for realtor inspection and publishing.',
        agentDecision: 'Notify realtor that interactive experience is ready for review.',
        toolUsed: 'ApprovalNotificationService'
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

  updatePropertyStatus(propertyId, 'checking_media');
  addTimelineEvent(propertyId, {
    type: 'capture_received',
    event: 'Recapture footage received',
    detail: 'New mobile capture received. Analyzing motion blur, doorway visibility, and scene trajectory.',
    agentDecision: 'Validate newly uploaded capture against missing space requirements.',
    evidence: '15-second mobile video upload',
    toolUsed: 'CaptureQualityInspector'
  });

  setWorkflowTimer(propertyId, 3500, () => {
    const currentProp = getProperty(propertyId);
    if (!currentProp) return;

    const missingSpace = currentProp.spaces.find(s => s.captured === false);
    if (missingSpace) {
      updatePropertyStatus(propertyId, 'needs_recapture');
      addTimelineEvent(propertyId, {
        type: 'capture_request',
        event: `Coverage still incomplete for ${missingSpace.name}`,
        detail: `The ${missingSpace.name} still requires additional footage.`,
        agentDecision: 'Re-request capture.',
        toolUsed: 'CaptureRequestDispatcher'
      });
    } else {
      startPreparing(propertyId);
    }
  });
}

/**
 * Approve a property for publication.
 * Advances from 'ready_for_review' to 'live' and adds publication timeline events.
 */
export function approveProperty(propertyId: string): void {
  cancelWorkflow(propertyId);
  updatePropertyStatus(propertyId, 'live');
  addTimelineEvent(propertyId, {
    type: 'publication',
    event: 'Publication approved · Experience is Live',
    detail: 'Interactive 3D tour published to public viewer. Shareable links and WhatsApp booking cards activated.',
    agentDecision: 'Deploy public viewer bundle and generate unlisted access link.',
    toolUsed: 'ExperiencePublisher'
  });
}

/**
 * Simulate the full webhook flow: a new listing arrives and triggers the full pipeline.
 * This is called from the Demo Portal when a realtor publishes a listing.
 */
export function handleNewListing(listing: {
  title: string
  address: string
  type: string
  bedrooms: number
  bathrooms: number
  price: string
  description: string
  coverImage?: string
  spaces?: Array<{ name: string; captured?: boolean }>
}): string {
  const spaces: Space[] = (listing.spaces && listing.spaces.length > 0)
    ? listing.spaces.map((s, idx) => ({
        id: `space-${Date.now()}-${idx}`,
        name: s.name,
        captured: s.captured ?? true,
        verified: s.captured ?? false,
        issues: s.captured === false ? ['Doorway connection missing'] : []
      }))
    : [
        { id: `sp-1`, name: 'Living Room', captured: true, verified: true, issues: [] },
        { id: `sp-2`, name: 'Kitchen', captured: true, verified: true, issues: [] },
        { id: `sp-3`, name: 'Main Bedroom', captured: true, verified: true, issues: [] },
        { id: `sp-4`, name: 'Bedroom 2', captured: true, verified: true, issues: [] },
        { id: `sp-5`, name: 'Bedroom 3', captured: true, verified: true, issues: [] },
        { id: `sp-6`, name: 'Bathroom', captured: true, verified: true, issues: [] },
        { id: `sp-7`, name: 'Balcony', captured: false, verified: false, issues: ['Connection from living room missing'] }
      ];

  const created = addProperty({
    title: listing.title,
    address: listing.address,
    type: listing.type,
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
    price: listing.price,
    description: listing.description,
    status: 'detected',
    spaces,
    sourceMedia: [],
    timeline: [],
    coverImage: listing.coverImage,
    workspaceId: 'ws-default'
  });

  startPropertyWorkflow(created.id);
  return created.id;
}

