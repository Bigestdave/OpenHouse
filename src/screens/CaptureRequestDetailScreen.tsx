import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { WorkspaceShell } from '../components/WorkspaceShell'
import { CopyIcon, PersonIcon, MailIcon, ClockIcon, LinkIcon } from '../components/icons2'
import { CheckCircle } from '../components/icons'
import { useStore } from '../data/store'
import propAdmiraltyImg from '../assets/prop-admiralty.jpg'
import propKitchenImg from '../assets/prop-kitchen.png'
import propBourdillonImg from '../assets/prop-bourdillon.jpg'

export function CaptureRequestDetailScreen() {
  const { id } = useParams()
  const { captureRequests, properties } = useStore()
  const [copied, setCopied] = useState(false)

  const request = captureRequests.find(r => r.id === id || r.propertyId === id) || captureRequests[0]
  const property = properties.find(p => p.id === request?.propertyId) || properties[0]

  const propertyImg = request?.propertyTitle?.includes('Bourdillon') ? propBourdillonImg : request?.propertyTitle?.includes('Admiralty') ? propAdmiraltyImg : propKitchenImg
  const captureLink = `${window.location.origin}/#/capture/${request?.id || 'req-admiralty-balcony'}`

  if (!request) {
    return (
      <WorkspaceShell breadcrumb="Capture requests" backTo="/capture-requests">
        <div className="mx-auto max-w-[1400px] px-6 py-16 text-center">
          <p className="text-sm font-semibold text-stone-700">Capture request not found.</p>
          <Link to="/capture-requests" className="text-xs font-bold text-[#194534] underline mt-2 block">
            Return to capture requests
          </Link>
        </div>
      </WorkspaceShell>
    )
  }

  return (
    <WorkspaceShell
      breadcrumb={
        <div className="flex items-center gap-2 text-[13.5px] text-text-secondary whitespace-nowrap">
          <Link to="/capture-requests" className="hover:text-text-primary">Capture requests</Link>
          <span>&gt;</span>
          <span className="font-semibold text-text-primary">{request.propertyTitle}</span>
        </div>
      }
      backTo="/capture-requests"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10 xl:px-12 py-6 lg:py-8 space-y-6">
        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-[26px] sm:text-[30px] lg:text-[32px] font-extrabold tracking-tight text-text-primary leading-tight">
              {request.room} Capture
            </h1>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[13.5px] text-text-secondary whitespace-nowrap">
              <span>{request.propertyTitle}</span>
              <span>·</span>
              <span>{property?.address || 'Lekki, Lagos'}</span>
              <span>·</span>
              <span>{new Date(request.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span>·</span>
              <div className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${request.status === 'resolved' ? 'bg-emerald-600' : 'bg-accent'} shrink-0`} />
                <span className="text-text-primary font-medium">
                  {request.status === 'resolved' ? 'Resolved' : 'Awaiting capture'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              to={`/capture/${request.id}`}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0B1713] px-4 py-2.5 text-xs font-bold text-white shadow-subtle hover:bg-black transition-colors whitespace-nowrap"
            >
              <LinkIcon size={14} className="text-white" />
              <span>Open capture app ↗</span>
            </Link>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(captureLink)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              }}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs font-semibold text-text-primary shadow-subtle hover:bg-surface-elevated transition-colors whitespace-nowrap"
            >
              <CopyIcon size={14} />
              <span>{copied ? 'Copied link!' : 'Copy secure link'}</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Left Annotation Canvas + Directions, Right Details & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 items-start">
          {/* Left Column: Visual Perspective & Directions */}
          <div className="space-y-6">
            {/* Perspective Spatial Image with Dashed Doorway Bounding Box */}
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-sidebar border border-border shadow-card">
              <img
                src={propertyImg}
                alt="Capture perspective"
                className="h-full w-full object-cover"
              />

              {/* Perspective Doorway Dashed Box Overlay */}
              <div className="absolute inset-y-8 right-16 w-56 border-2 border-dashed border-accent rounded-lg pointer-events-none" />

              {/* Dotted Walking Trajectory on Floor */}
              <svg className="absolute inset-0 h-full w-full pointer-events-none">
                <path
                  d="M 280 320 Q 380 310 440 240"
                  fill="none"
                  stroke="#D97945"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                />
              </svg>

              {/* Bottom-Left Room Tag */}
              <div className="absolute bottom-4 left-4 rounded-md bg-black/65 backdrop-blur-md px-3 py-1.5 text-white border border-white/10 text-[12px] font-bold">
                {request.room} Target
              </div>
            </div>

            {/* Direction and Time Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-[1.5fr_1fr] gap-4 rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-subtle">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0 mt-0.5">
                    <span className="text-[11px] font-bold">1</span>
                  </span>
                  <div>
                    <h3 className="text-[14px] font-bold text-text-primary">Capture direction</h3>
                    <p className="text-[13px] text-text-secondary mt-1 leading-relaxed">
                      {request.instructions || 'Start in the room. Walk slowly through the doorway and finish after showing the full space.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                    <ClockIcon size={14} className="text-primary" />
                  </span>
                  <div>
                    <span className="text-[12px] text-text-secondary">Estimated recording time</span>
                    <p className="text-[14px] font-bold text-text-primary">{request.estimatedTime || '15–20 seconds'}</p>
                  </div>
                </div>
              </div>

              {/* Video Example Thumbnail */}
              <div className="flex flex-col items-center justify-center border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-4">
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-sidebar group cursor-pointer border border-border">
                  <img src={propertyImg} alt="Example capture" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black shadow-md text-[12px] font-bold pl-0.5">
                      ▶
                    </span>
                  </div>
                </div>
                <Link to={`/capture/${request.id}`} className="text-[12.5px] font-semibold text-text-primary hover:text-primary mt-2 flex items-center gap-1">
                  Preview in app ↗
                </Link>
              </div>
            </div>

            {/* WHAT TO INCLUDE Checklist */}
            <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-subtle">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-secondary mb-3.5">
                AUTONOMOUS INSTRUCTIONS
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px] text-text-primary font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle size={15} className="text-success shrink-0" />
                  <span>Begin several steps before entrance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={15} className="text-success shrink-0" />
                  <span>Continuous steady walking pace</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={15} className="text-success shrink-0" />
                  <span>Keep entire doorway threshold visible</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={15} className="text-success shrink-0" />
                  <span>Slow final pan across {request.room}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Request Details, Status History, Controls */}
          <div className="space-y-5">
            {/* Request Details Panel */}
            <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-subtle space-y-4">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                REQUEST DETAILS
              </h3>

              <div className="space-y-3 text-[13px]">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary flex items-center gap-2">
                    <PersonIcon size={14} className="text-text-secondary" />
                    <span>Recipient</span>
                  </span>
                  <span className="font-bold text-text-primary">{request.recipientName || 'David Olabowale'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary flex items-center gap-2">
                    <MailIcon size={14} className="text-text-secondary" />
                    <span>Delivery</span>
                  </span>
                  <span className="font-medium text-text-primary">WhatsApp & Mobile Web</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary flex items-center gap-2">
                    <ClockIcon size={14} className="text-text-secondary" />
                    <span>Created</span>
                  </span>
                  <span className="font-medium text-text-primary">
                    {new Date(request.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-text-secondary flex items-center gap-2">
                    <LinkIcon size={14} className="text-text-secondary" />
                    <span>Secure link</span>
                  </span>
                  <span className="font-mono text-[12px] text-text-primary truncate max-w-[150px]">openhouse.app/capture/14-cooper</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText('https://openhouse.app/capture/14-cooper')
                    alert('Secure link copied to clipboard')
                  }}
                  className="w-full rounded-lg bg-primary py-2 text-[13px] font-semibold text-text-inverse shadow-subtle hover:bg-primary-hover transition-colors"
                >
                  Copy link
                </button>
                <button className="w-full rounded-lg border border-border bg-surface py-2 text-[13px] font-semibold text-text-primary hover:bg-surface-elevated transition-colors">
                  Resend request
                </button>
                <button className="w-full rounded-lg border border-border bg-surface py-2 text-[13px] font-semibold text-text-primary hover:bg-surface-elevated transition-colors">
                  Change recipient
                </button>
              </div>
            </div>

            {/* Status History */}
            <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-subtle space-y-3.5">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                STATUS HISTORY
              </h3>

              <div className="space-y-3 text-[13px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-text-primary font-medium">
                    <CheckCircle size={14} className="text-success" />
                    <span>Request created</span>
                  </div>
                  <span className="text-text-secondary text-[12px]">Today, 18:31</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-text-primary font-medium">
                    <CheckCircle size={14} className="text-success" />
                    <span>Secure link generated</span>
                  </div>
                  <span className="text-text-secondary text-[12px]">Today, 18:31</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-text-primary font-medium">
                    <CheckCircle size={14} className="text-success" />
                    <span>Request delivered</span>
                  </div>
                  <span className="text-text-secondary text-[12px]">Today, 18:31</span>
                </div>

                <div className="flex items-center justify-between font-bold text-text-primary">
                  <div className="flex items-center gap-2 text-accent">
                    <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                    <span>Awaiting capture</span>
                  </div>
                  <span className="text-text-secondary text-[12px]">—</span>
                </div>

                <div className="flex items-center justify-between text-text-secondary/60">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full border border-border" />
                    <span>Quality check</span>
                  </div>
                  <span className="text-[12px]">—</span>
                </div>

                <div className="flex items-center justify-between text-text-secondary/60">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full border border-border" />
                    <span>Resume property preparation</span>
                  </div>
                  <span className="text-[12px]">—</span>
                </div>
              </div>
            </div>

            {/* Request Controls */}
            <div className="rounded-2xl border border-border bg-surface p-4 shadow-subtle flex items-center justify-between gap-3">
              <button className="flex-1 rounded-lg border border-border bg-surface py-2 text-[12.5px] font-semibold text-text-primary hover:bg-surface-elevated transition-colors">
                Edit instructions
              </button>
              <button className="flex-1 rounded-lg border border-border bg-surface py-2 text-[12.5px] font-semibold text-danger hover:bg-danger/10 transition-colors">
                Cancel request
              </button>
            </div>
          </div>
        </div>
      </div>
    </WorkspaceShell>
  )
}
