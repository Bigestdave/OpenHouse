import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { WorkspaceShell } from '../components/WorkspaceShell'
import { useProperty, useStore } from '../data/store'
import { Button, Badge, Callout } from '../components/ui'
import { MapPinIcon } from '../components/icons2'

const tabs = ['Overview', 'Source Evidence', 'Confidence Ledger', 'Agent Activity (Judges)', 'Publication Settings'] as const
type TabType = (typeof tabs)[number]

const CONFIDENCE_LEDGER = [
  {
    claim: 'Property has three bedrooms',
    evidence: 'Listing description, floor plan, captured rooms',
    status: 'Confirmed',
    statusVariant: 'success' as const,
  },
  {
    claim: 'Bedroom 2 is ensuite',
    evidence: 'Floor plan and visible doorway in capture',
    status: 'Confirmed',
    statusVariant: 'success' as const,
  },
  {
    claim: 'Living room connects to balcony',
    evidence: '15-second guided mobile doorway capture',
    status: 'Confirmed',
    statusVariant: 'success' as const,
  },
  {
    claim: 'Living-room wall is 3.4m',
    evidence: 'Supplied dimensioned floor plan (scale 1:50)',
    status: 'Verified Measurement',
    statusVariant: 'info' as const,
  },
  {
    claim: 'Kitchen has abundant natural light',
    evidence: 'Window visible across multiple daytime frames',
    status: 'Observed',
    statusVariant: 'neutral' as const,
  },
  {
    claim: 'Balcony depth clearance is 1.8m',
    evidence: 'Unverified from single perspective footage',
    status: 'Unverified',
    statusVariant: 'accent' as const,
  },
]

export function ShowOverviewScreen() {
  const { id } = useParams()
  const store = useStore()
  const [tab, setTab] = useState<TabType>('Overview')
  const [copiedLink, setCopiedLink] = useState(false)
  const [visibility, setVisibility] = useState<'public' | 'unlisted' | 'password'>('unlisted')

  const prop = useProperty(id || '') || store.properties[0]

  if (!prop) {
    return (
      <WorkspaceShell breadcrumb="Properties" backTo="/properties">
        <div className="flex h-[300px] flex-col items-center justify-center gap-4 text-center">
          <p className="text-sm text-ink-2">Listing not found.</p>
          <Link to="/properties">
            <Button variant="secondary" size="md">Back to properties</Button>
          </Link>
        </div>
      </WorkspaceShell>
    )
  }

  const missingSpace = prop.spaces.find((s) => !s.captured)
  const isNeedsAttention = prop.status === 'needs_recapture' || !!missingSpace
  const isLive = prop.status === 'live'
  const isReadyForReview = prop.status === 'ready_for_review'

  const handleCopy = () => {
    const url = `${window.location.origin}/#/view/${prop.id}`
    navigator.clipboard.writeText(url)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const handleWhatsApp = () => {
    const url = `${window.location.origin}/#/view/${prop.id}`
    const text = `Explore ${prop.title} in 3D: ${url}`
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <WorkspaceShell
      breadcrumb={
        <div className="flex items-center gap-2 text-xs text-ink-2">
          <Link to="/properties" className="hover:text-ink">Properties</Link>
          <span>/</span>
          <span className="font-semibold text-ink truncate max-w-[200px]">{prop.title}</span>
          <span>/</span>
          <span className="text-ink-3">{tab}</span>
        </div>
      }
      backTo="/properties"
    >
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-10 py-6 lg:py-8 font-sans text-ink">
        
        {/* Top Header Card */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-border">
          <div>
            <div className="flex items-center gap-2.5 pb-1">
              <h1 className="text-[24px] sm:text-[28px] font-extrabold tracking-tight text-ink leading-tight">
                {prop.title}
              </h1>
              {isLive ? (
                <Badge variant="success">â— Live 24/7</Badge>
              ) : isNeedsAttention ? (
                <Badge variant="accent">â— Needs Attention</Badge>
              ) : isReadyForReview ? (
                <Badge variant="info">â— Ready for Review</Badge>
              ) : (
                <Badge variant="neutral">â— {prop.status.replace(/_/g, ' ')}</Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-ink-2 mt-1">
              <span className="flex items-center gap-1 font-medium text-ink">
                <MapPinIcon size={14} className="text-ink-3" />
                {prop.address}
              </span>
              <span>Â·</span>
              <span className="font-bold text-primary">{prop.price}</span>
              <span>Â·</span>
              <span>{prop.bedrooms} Beds / {prop.bathrooms} Baths</span>
              <span>Â·</span>
              <span>{prop.type}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button variant="ghost" size="md" onClick={handleWhatsApp}>
              WhatsApp
            </Button>
            <Button variant="secondary" size="md" onClick={handleCopy}>
              {copiedLink ? 'Copied Link!' : 'Copy Link'}
            </Button>
            {isNeedsAttention ? (
              <Link to={`/capture/${prop.id}`}>
                <Button variant="primary" size="md">
                  Record missing capture (15s)
                </Button>
              </Link>
            ) : isReadyForReview ? (
              <Link to="/approvals">
                <Button variant="primary" size="md">
                  Review & Publish â†’
                </Button>
              </Link>
            ) : (
              <Link to={`/view/${prop.id}`} target="_blank">
                <Button variant="primary" size="md">
                  Explore 3D Walkthrough â†—
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 sm:gap-2 py-4 overflow-x-auto border-b border-border mb-6">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                tab === t
                  ? 'bg-primary text-text-inverse shadow-subtle'
                  : 'text-ink-2 hover:bg-raised-2 hover:text-ink'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {tab === 'Overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-8">
            
            {/* Left Column: Lifecycle & Progress */}
            <div className="space-y-6">
              
              {/* Needs Attention Callout */}
              {isNeedsAttention && missingSpace && (
                <Callout>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-ink">Coverage insufficient for {missingSpace.name}</p>
                      <p className="text-xs text-ink-2 mt-0.5">
                        Please record one slow 15-second pass from the living room through the balcony doorway.
                      </p>
                    </div>
                    <Link to={`/capture/${prop.id}`}>
                      <Button variant="primary" size="sm">
                        Record now
                      </Button>
                    </Link>
                  </div>
                </Callout>
              )}

              {/* What OpenHouse is doing */}
              <div className="rounded-2xl border border-border bg-surface p-6 shadow-subtle">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div>
                    <h2 className="text-base font-bold text-ink">What OpenHouse is doing</h2>
                    <p className="text-xs text-ink-2 mt-0.5">
                      {isLive
                        ? 'Experience published and live for renters'
                        : isReadyForReview
                        ? 'All checks passed Â· Awaiting your 1-click approval'
                        : isNeedsAttention
                        ? 'Waiting for 1 short mobile recapture'
                        : 'Autonomous production in progress'}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-primary">
                    {isLive ? '100% Done' : isReadyForReview ? '95% Ready' : 'In Progress'}
                  </span>
                </div>

                <div className="py-4 space-y-3.5 text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-[11px] font-bold">âœ“</span>
                    <span className="text-ink font-medium">Listing collected from portal</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-[11px] font-bold">âœ“</span>
                    <span className="text-ink font-medium">{prop.bedrooms} bedrooms & features identified</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-[11px] font-bold">âœ“</span>
                    <span className="text-ink font-medium">Floor plan geometry processed</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-[11px] font-bold">âœ“</span>
                    <span className="text-ink font-medium">Capture quality and lighting checked</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${isLive || isReadyForReview ? 'bg-primary text-white' : 'bg-accent/20 text-accent animate-pulse'}`}>
                      {isLive || isReadyForReview ? 'âœ“' : 'â€¢'}
                    </span>
                    <span className="text-ink font-medium">Building interactive 3D tour</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${isLive || isReadyForReview ? 'bg-primary text-white' : 'bg-raised-2 text-ink-3'}`}>
                      {isLive || isReadyForReview ? 'âœ“' : 'â—‹'}
                    </span>
                    <span className={isLive || isReadyForReview ? 'text-ink font-medium' : 'text-ink-3'}>Final quality review & floater cleanup</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${isLive ? 'bg-primary text-white' : 'bg-raised-2 text-ink-3'}`}>
                      {isLive ? 'âœ“' : 'â—‹'}
                    </span>
                    <span className={isLive ? 'text-ink font-medium' : 'text-ink-3'}>Publication approval</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-ink-2">
                  <span>Nothing is required from you.</span>
                  <span className="font-semibold text-ink">Estimated completion: 18â€“25 minutes</span>
                </div>
              </div>

              {/* Spaces Grid */}
              <div className="rounded-2xl border border-border bg-surface p-6 shadow-subtle">
                <h2 className="text-base font-bold text-ink pb-3">
                  Identified Spaces ({prop.spaces.length})
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {prop.spaces.map((s) => (
                    <div
                      key={s.id}
                      className={`rounded-xl border p-3 ${
                        s.captured
                          ? 'border-border bg-canvas/50'
                          : 'border-accent bg-accent/5'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-1">
                        <span className="text-xs font-bold text-ink truncate">{s.name}</span>
                        {s.captured ? (
                          <span className="text-primary text-xs">âœ“</span>
                        ) : (
                          <span className="text-accent text-[10px] font-bold uppercase">Missing</span>
                        )}
                      </div>
                      <p className="text-[11px] text-ink-2">
                        {s.captured ? 'Captured & aligned' : 'Requires 15s video'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Hero Preview & Quick Actions */}
            <div className="space-y-6">
              
              <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-subtle">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-sidebar">
                  <img
                    src={prop.coverImage || '/src/assets/prop-hero-waterfront.jpg'}
                    alt={prop.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <div className="text-white">
                      <p className="text-base font-bold">{prop.title}</p>
                      <p className="text-xs text-white/80">{prop.address}</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <p className="text-xs text-ink-2 leading-relaxed">
                    {prop.description}
                  </p>

                  <div className="pt-3 border-t border-border flex flex-col gap-2">
                    <Link to={`/view/${prop.id}`} target="_blank" className="w-full">
                      <Button variant="primary" size="md" fullWidth>
                        Open Renter Walkthrough â†—
                      </Button>
                    </Link>
                    <Button variant="secondary" size="md" fullWidth onClick={handleWhatsApp}>
                      Share via WhatsApp
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quick Specs */}
              <div className="rounded-2xl border border-border bg-surface p-5 shadow-subtle space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink-2">Listing Specs</h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-ink-3 block">Price</span>
                    <span className="font-bold text-ink">{prop.price}</span>
                  </div>
                  <div>
                    <span className="text-ink-3 block">Property Type</span>
                    <span className="font-bold text-ink">{prop.type}</span>
                  </div>
                  <div>
                    <span className="text-ink-3 block">Bedrooms / Baths</span>
                    <span className="font-bold text-ink">{prop.bedrooms} Bed / {prop.bathrooms} Bath</span>
                  </div>
                  <div>
                    <span className="text-ink-3 block">Listing Source</span>
                    <span className="font-bold text-ink">Direct Webhook</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: SOURCE EVIDENCE */}
        {tab === 'Source Evidence' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-subtle">
              <h2 className="text-base font-bold text-ink pb-2">Uploaded Source Media & Evidence</h2>
              <p className="text-xs text-ink-2 pb-6">
                All raw imagery, phone walkthrough videos, and floor plans collected for this property.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {prop.spaces.map((s) => (
                  <div key={s.id} className="overflow-hidden rounded-xl border border-border bg-canvas/40">
                    <div className="relative aspect-[16/10] bg-sidebar">
                      <img
                        src={prop.coverImage || '/src/assets/prop-admiralty.jpg'}
                        alt={s.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge variant={s.captured ? 'success' : 'accent'}>
                          {s.captured ? 'Coverage Verified' : 'Missing'}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-xs font-bold text-ink">{s.name}</h3>
                      <p className="text-[11px] text-ink-2 mt-0.5">
                        {s.captured ? 'Frame overlap: 84% Â· Motion quality: Stable' : 'Awaiting 15s phone clip'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CONFIDENCE LEDGER */}
        {tab === 'Confidence Ledger' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-subtle">
              <div className="pb-4 border-b border-border">
                <h2 className="text-base font-bold text-ink">Evidence & Confidence Ledger</h2>
                <p className="text-xs text-ink-2 mt-1">
                  OpenHouse does not manufacture certainty. It records what the property evidence can actually support.
                </p>
              </div>

              <div className="overflow-x-auto pt-4">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-border text-[11.5px] font-bold uppercase tracking-wider text-ink-2">
                      <th className="pb-3 pr-4">Property Claim</th>
                      <th className="pb-3 px-4">Evidence Source</th>
                      <th className="pb-3 pl-4">Verification Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {CONFIDENCE_LEDGER.map((row, idx) => (
                      <tr key={idx} className="hover:bg-raised-2/50 transition-colors">
                        <td className="py-3.5 pr-4 font-semibold text-ink">{row.claim}</td>
                        <td className="py-3.5 px-4 text-xs text-ink-2">{row.evidence}</td>
                        <td className="py-3.5 pl-4">
                          <Badge variant={row.statusVariant}>{row.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Measurement Policy Alert */}
              <div className="mt-6 rounded-xl border border-border bg-canvas p-4 text-xs text-ink-2 leading-relaxed">
                <span className="font-bold text-ink block mb-1">ðŸ“ Strict Measurement Policy</span>
                Gaussian splatting provides photorealistic visual walkthroughs, but geometry is verified only when scaled dimensioned floor plans or calibrated depth metrics are supplied. Unsupported measurements are flagged and refused gracefully to protect trust.
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AGENT ACTIVITY (JUDGES AUDIT DRAWER) */}
        {tab === 'Agent Activity (Judges)' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-subtle">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div>
                  <h2 className="text-base font-bold text-ink">How OpenHouse Prepared This Listing</h2>
                  <p className="text-xs text-ink-2 mt-0.5">
                    Deterministic spatial toolchain orchestrated by Gemini Multimodal Agent.
                  </p>
                </div>
                <Badge variant="neutral">Audit Log</Badge>
              </div>

              <div className="py-6 space-y-4">
                {[
                  {
                    time: '09:01',
                    title: 'New listing detected via webhook',
                    detail: 'Extracted title, price (â‚¦8m/year), and 12 advertised images.',
                    tool: 'Google Cloud Pub/Sub',
                    decision: 'Initialize property workflow',
                  },
                  {
                    time: '09:01',
                    title: 'Expected spaces identified',
                    detail: 'Gemini multimodal analyzed listing text and images to inventory 7 rooms.',
                    tool: 'Gemini 1.5 Pro (Multimodal)',
                    decision: '7 spaces registered: Living, Kitchen, 3 Bedrooms, 2 Baths, Balcony',
                  },
                  {
                    time: '09:02',
                    title: 'Balcony coverage found insufficient',
                    detail: 'Detected missing doorway transition between Living room and Balcony.',
                    tool: 'Coverage & Feature Matcher',
                    decision: 'Pause pipeline and generate precise WhatsApp recapture request',
                  },
                  {
                    time: '09:08',
                    title: 'New mobile footage received',
                    detail: '15-second video received via secure one-time mobile link.',
                    tool: 'Mobile Ingest Endpoint',
                    decision: 'Resume workflow and run auto-check verification',
                  },
                  {
                    time: '09:10',
                    title: '3D Reconstruction started',
                    detail: 'Extracted 180 keyframes, estimated camera poses, and optimized 3D Gaussian Splat.',
                    tool: 'Nerfstudio / Splatfacto Engine',
                    decision: 'Render novel verification viewpoints',
                  },
                  {
                    time: '09:32',
                    title: 'Verification found minor visual artifact',
                    detail: 'Floater detected near doorway edge; auto-cropped bounding box.',
                    tool: 'Experience Verifier',
                    decision: 'Artifact cropped cleanly; mobile WebGL performance validated',
                  },
                  {
                    time: '09:35',
                    title: 'Publication approval requested',
                    detail: 'Ready for 1-click realtor review with 6/6 rooms verified.',
                    tool: 'Approval Gatekeeper',
                    decision: 'Awaiting human authorization before going live',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-border bg-canvas/60 p-4 transition-all hover:border-line-strong"
                  >
                    <div className="flex items-center justify-between text-xs pb-1">
                      <span className="font-mono font-bold text-primary">{item.time}</span>
                      <Badge variant="neutral">{item.tool}</Badge>
                    </div>
                    <h3 className="text-sm font-bold text-ink">{item.title}</h3>
                    <p className="text-xs text-ink-2 mt-0.5">{item.detail}</p>
                    <div className="mt-2 pt-2 border-t border-border/60 text-[11px] text-ink-3">
                      <span className="font-semibold text-ink-2">Agent Decision:</span> {item.decision}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PUBLICATION SETTINGS */}
        {tab === 'Publication Settings' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-subtle max-w-[720px]">
              <h2 className="text-base font-bold text-ink pb-2">Experience Visibility & Share Controls</h2>
              <p className="text-xs text-ink-2 pb-6">
                Choose who can access this interactive 3D open house.
              </p>

              <div className="space-y-3 pb-6">
                {[
                  { id: 'public', title: 'Public', desc: 'Indexed and accessible on property portals and search.' },
                  { id: 'unlisted', title: 'Unlisted link (Recommended)', desc: 'Only people with the link or WhatsApp share can view.' },
                  { id: 'password', title: 'Password protected', desc: 'Requires private code provided by realtor.' },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    onClick={() => setVisibility(opt.id as any)}
                    className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all ${
                      visibility === opt.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-surface hover:bg-raised-2'
                    }`}
                  >
                    <input
                      type="radio"
                      name="visibility"
                      checked={visibility === opt.id}
                      onChange={() => setVisibility(opt.id as any)}
                      className="mt-0.5 accent-primary"
                    />
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-ink block">{opt.title}</span>
                      <span className="text-xs text-ink-2 block mt-0.5">{opt.desc}</span>
                    </div>
                  </label>
                ))}
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <Button variant="secondary" size="md" onClick={handleCopy}>
                  {copiedLink ? 'Copied Embed Code!' : 'Copy Embed Code'}
                </Button>
                <Button variant="primary" size="md" onClick={() => alert('Settings updated!')}>
                  Save Settings
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </WorkspaceShell>
  )
}
