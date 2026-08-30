const fs = require('fs');
const path = require('path');

const rootDir = 'c:/Users/David PC/Documents/antigravity/proud-hawking';

// 1. CaptureRequestsScreen.tsx
const captureRequestsScreenContent = `import { useState } from 'react'
import { Link } from 'react-router-dom'
import { WorkspaceShell } from '../components/WorkspaceShell'
import { SearchIcon, PlusIcon } from '../components/icons2'

interface CaptureRequestItem {
  id: string
  propertyTitle: string
  propertyLocation: string
  propertyImg: string
  captureNeeded: string
  recipient: string
  status: 'Awaiting capture' | 'Footage received' | 'Checking' | 'Resolved'
  updated: string
  actionLabel: string
}

const REQUESTS_DATA: CaptureRequestItem[] = [
  {
    id: '1',
    propertyTitle: '14 Cooper Road',
    propertyLocation: 'Ikoyi, Lagos',
    propertyImg: '/src/assets/prop-kitchen.png',
    captureNeeded: 'Kitchen-to-dining connection',
    recipient: 'Kiki Casa',
    status: 'Awaiting capture',
    updated: '12 minutes ago',
    actionLabel: 'View request',
  },
  {
    id: '2',
    propertyTitle: 'Orchid Apartments, Unit 4',
    propertyLocation: 'Lekki, Lagos',
    propertyImg: '/src/assets/prop-orchid.jpg',
    captureNeeded: 'Bedroom 2 doorway',
    recipient: 'Tola Adeyemi',
    status: 'Footage received',
    updated: '4 minutes ago',
    actionLabel: 'Check footage',
  },
  {
    id: '3',
    propertyTitle: 'Lekki Gardens, Unit 12',
    propertyLocation: 'Lekki, Lagos',
    propertyImg: '/src/assets/prop-lekkigardens.jpg',
    captureNeeded: 'Front entrance approach',
    recipient: 'Kiki Casa',
    status: 'Checking',
    updated: '18 minutes ago',
    actionLabel: 'View',
  },
  {
    id: '4',
    propertyTitle: '8 Admiralty Way',
    propertyLocation: 'Lekki, Lagos',
    propertyImg: '/src/assets/prop-admiralty.jpg',
    captureNeeded: 'Living-room-to-balcony connection',
    recipient: 'Kiki Casa',
    status: 'Resolved',
    updated: 'Today, 14:03',
    actionLabel: 'View history',
  },
]

const filterTabs = ['Open', 'Awaiting capture', 'Received', 'Checking', 'Resolved'] as const
type FilterTab = (typeof filterTabs)[number]

export function CaptureRequestsScreen() {
  const [filter, setFilter] = useState<FilterTab>('Open')
  const [query, setQuery] = useState('')

  const visibleRequests = REQUESTS_DATA.filter((r) => {
    if (query && !r.propertyTitle.toLowerCase().includes(query.toLowerCase()) && !r.captureNeeded.toLowerCase().includes(query.toLowerCase())) {
      return false
    }
    if (filter === 'Open') return r.status !== 'Resolved'
    if (filter === 'Awaiting capture') return r.status === 'Awaiting capture'
    if (filter === 'Received') return r.status === 'Footage received'
    if (filter === 'Checking') return r.status === 'Checking'
    if (filter === 'Resolved') return r.status === 'Resolved'
    return true
  })

  return (
    <WorkspaceShell>
      <div className="mx-auto max-w-[1360px] px-6 sm:px-10 lg:px-12 py-8 lg:py-10 space-y-8">
        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[32px] lg:text-[36px] font-extrabold tracking-tight text-text-primary leading-tight">
              Capture requests
            </h1>
            <p className="text-[14.5px] text-text-secondary font-normal mt-0.5">
              Track missing property evidence and submitted footage.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex w-full sm:w-[320px] lg:w-[360px] items-center gap-2.5 rounded-lg border border-border bg-surface px-3.5 py-2 text-[14px] text-text-primary shadow-subtle focus-within:border-primary">
              <SearchIcon size={16} className="text-text-secondary shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search properties..."
                className="flex-1 bg-transparent text-text-primary outline-none placeholder:text-text-secondary/70"
              />
            </div>

            <Link
              to="/capture-requests/1"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2 text-[14px] font-semibold text-text-inverse shadow-subtle hover:bg-primary-hover transition-colors shrink-0"
            >
              <PlusIcon size={16} />
              <span>New request</span>
            </Link>
          </div>
        </div>

        {/* Counter Subheading */}
        <p className="text-[13.5px] text-text-secondary font-medium">
          <strong className="text-text-primary">2</strong> awaiting capture · <strong className="text-text-primary">1</strong> received · <strong className="text-text-primary">6</strong> resolved this month
        </p>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {filterTabs.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={\`rounded-full px-4 py-1.5 text-[13.5px] font-semibold transition-all duration-150 \${
                filter === f
                  ? 'bg-primary text-text-inverse shadow-subtle'
                  : 'border border-border bg-surface text-text-primary hover:bg-surface-elevated'
              }\`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Requests Data Table */}
        <div className="rounded-2xl border border-border bg-surface shadow-subtle overflow-hidden">
          <div className="grid grid-cols-[2fr_1.8fr_1.2fr_1.2fr_1fr_130px] gap-4 px-6 py-3.5 border-b border-border bg-surface-elevated/50 text-[12.5px] font-bold text-text-secondary uppercase tracking-wider">
            <div>Property</div>
            <div>Capture needed</div>
            <div>Recipient</div>
            <div>Status</div>
            <div>Updated</div>
            <div className="text-right">Action</div>
          </div>

          <div className="divide-y divide-border/60">
            {visibleRequests.map((req) => (
              <div
                key={req.id}
                className="grid grid-cols-[2fr_1.8fr_1.2fr_1.2fr_1fr_130px] items-center gap-4 px-6 py-4 hover:bg-surface-elevated/40 transition-colors"
              >
                {/* Property Column */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={req.propertyImg}
                    alt={req.propertyTitle}
                    className="h-12 w-16 rounded-lg object-cover border border-border shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-text-primary text-[14.5px] truncate">{req.propertyTitle}</p>
                    <p className="text-[12.5px] text-text-secondary truncate">{req.propertyLocation}</p>
                  </div>
                </div>

                {/* Capture Needed */}
                <div className="text-[13.5px] font-medium text-text-primary">
                  {req.captureNeeded}
                </div>

                {/* Recipient */}
                <div className="text-[13.5px] text-text-secondary">
                  {req.recipient}
                </div>

                {/* Status */}
                <div>
                  <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-text-primary">
                    <span
                      className={\`h-2 w-2 rounded-full \${
                        req.status === 'Awaiting capture'
                          ? 'bg-accent'
                          : req.status === 'Footage received'
                          ? 'bg-info'
                          : 'bg-success'
                      }\`}
                    />
                    {req.status}
                  </span>
                </div>

                {/* Updated */}
                <div className="text-[13px] text-text-secondary">
                  {req.updated}
                </div>

                {/* Action */}
                <div className="text-right">
                  <Link
                    to={\`/capture-requests/\${req.id}\`}
                    className="inline-flex items-center justify-center rounded-lg border border-border bg-surface px-3.5 py-1.5 text-[13px] font-semibold text-text-primary hover:bg-surface-elevated shadow-subtle transition-colors"
                  >
                    {req.actionLabel}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Guidance Box */}
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-6 rounded-2xl border border-border bg-surface p-6 shadow-subtle">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0 text-[18px]">
              💡
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-text-primary">A good request is specific.</h3>
              <p className="text-[13.5px] text-text-secondary mt-1 leading-relaxed">
                Clear guidance helps you get the right capture the first time.
              </p>
            </div>
          </div>

          <div className="border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
            <p className="text-[12px] font-bold uppercase tracking-wider text-text-secondary mb-1">
              Example request
            </p>
            <p className="text-[13.5px] italic text-text-primary leading-relaxed">
              “Start in the living room and walk slowly through the balcony doorway.”
            </p>
          </div>
        </div>
      </div>
    </WorkspaceShell>
  )
}
`;

// 2. CaptureRequestDetailScreen.tsx
const captureRequestDetailContent = `import { useState } from 'react'
import { Link } from 'react-router-dom'
import { WorkspaceShell } from '../components/WorkspaceShell'
import { CopyIcon } from '../components/icons2'
import { Ellipsis, CheckCircle } from '../components/icons'

export function CaptureRequestDetailScreen() {
  const [copied, setCopied] = useState(false)

  return (
    <WorkspaceShell
      breadcrumb={
        <div className="flex items-center gap-2 text-[14px] text-text-secondary">
          <Link to="/capture-requests" className="hover:text-text-primary">Capture requests</Link>
          <span>&gt;</span>
          <span className="font-semibold text-text-primary">14 Cooper Road</span>
        </div>
      }
      backTo="/capture-requests"
    >
      <div className="mx-auto max-w-[1360px] px-6 sm:px-10 lg:px-12 py-8 lg:py-10 space-y-8">
        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-[30px] lg:text-[34px] font-extrabold tracking-tight text-text-primary leading-tight">
              Kitchen-to-dining connection
            </h1>
            <div className="flex items-center gap-2 pt-1.5 text-[14px] text-text-secondary">
              <span>14 Cooper Road</span>
              <span>·</span>
              <span>Ikoyi, Lagos</span>
              <span>·</span>
              <span>Sent 12 minutes ago</span>
              <span>·</span>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-accent" />
                <span className="text-text-primary font-medium">Awaiting capture</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                navigator.clipboard?.writeText('https://openhouse.app/capture/14-cooper')
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-[14px] font-semibold text-text-primary shadow-subtle hover:bg-surface-elevated transition-colors"
            >
              <CopyIcon size={16} />
              <span>{copied ? 'Copied link!' : 'Copy secure link'}</span>
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary hover:text-text-primary shadow-subtle">
              <Ellipsis size={18} />
            </button>
          </div>
        </div>

        {/* Main Grid: Left Annotation Canvas + Directions, Right Details & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 items-start">
          {/* Left Column: Visual Perspective & Directions */}
          <div className="space-y-6">
            {/* Perspective Spatial Image with Dashed Doorway Bounding Box */}
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-sidebar border border-border shadow-card">
              <img
                src="/src/assets/prop-kitchen.png"
                alt="Dining to kitchen doorway"
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
                Dining room
              </div>
            </div>

            {/* Direction and Time Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-[1.5fr_1fr] gap-4 rounded-2xl border border-border bg-surface p-6 shadow-subtle">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[13px] shrink-0 mt-0.5">
                    ▶
                  </span>
                  <div>
                    <h3 className="text-[14.5px] font-bold text-text-primary">Capture direction</h3>
                    <p className="text-[13.5px] text-text-secondary mt-1 leading-relaxed">
                      Start in the dining room. Walk slowly through the kitchen doorway and finish after showing the full kitchen.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-[13px] shrink-0">
                    ⏱
                  </span>
                  <div>
                    <span className="text-[13px] text-text-secondary">Estimated recording time</span>
                    <p className="text-[15px] font-bold text-text-primary">20 seconds</p>
                  </div>
                </div>
              </div>

              {/* Video Example Thumbnail */}
              <div className="flex flex-col items-center justify-center border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-4">
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-sidebar group cursor-pointer border border-border">
                  <img src="/src/assets/prop-kitchen.png" alt="Example capture" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black shadow-md font-bold">
                      ▶
                    </span>
                  </div>
                </div>
                <button className="text-[13px] font-semibold text-text-primary hover:text-primary mt-2 flex items-center gap-1">
                  See an example ↗
                </button>
              </div>
            </div>

            {/* WHAT TO INCLUDE Checklist */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-subtle">
              <h3 className="text-[12px] font-bold uppercase tracking-wider text-text-secondary mb-4">
                WHAT TO INCLUDE
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13.5px] text-text-primary font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-success shrink-0" />
                  <span>Dining room before entering</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-success shrink-0" />
                  <span>Continuous movement into the kitchen</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-success shrink-0" />
                  <span>Entire doorway</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-success shrink-0" />
                  <span>A slow final view of the kitchen</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Request Details, Status History, Controls */}
          <div className="space-y-6">
            {/* Request Details Panel */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-subtle space-y-4">
              <h3 className="text-[12px] font-bold uppercase tracking-wider text-text-secondary">
                REQUEST DETAILS
              </h3>

              <div className="space-y-3 text-[13.5px]">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary flex items-center gap-2">👤 Recipient</span>
                  <span className="font-bold text-text-primary">Kiki Casa</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary flex items-center gap-2">✉️ Delivery</span>
                  <span className="font-medium text-text-primary">WhatsApp and email</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary flex items-center gap-2">⏱ Sent</span>
                  <span className="font-medium text-text-primary">Today, 18:31</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-text-secondary flex items-center gap-2">🔗 Secure link</span>
                  <span className="font-mono text-[12px] text-text-primary truncate max-w-[150px]">openhouse.app/capture/14-cooper</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText('https://openhouse.app/capture/14-cooper')
                    alert('Secure link copied to clipboard')
                  }}
                  className="w-full rounded-lg bg-primary py-2.5 text-[14px] font-semibold text-text-inverse shadow-subtle hover:bg-primary-hover transition-colors"
                >
                  Copy link
                </button>
                <button className="w-full rounded-lg border border-border bg-surface py-2 text-[13.5px] font-semibold text-text-primary hover:bg-surface-elevated transition-colors">
                  Resend request
                </button>
                <button className="w-full rounded-lg border border-border bg-surface py-2 text-[13.5px] font-semibold text-text-primary hover:bg-surface-elevated transition-colors">
                  Change recipient
                </button>
              </div>
            </div>

            {/* Status History */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-subtle space-y-4">
              <h3 className="text-[12px] font-bold uppercase tracking-wider text-text-secondary">
                STATUS HISTORY
              </h3>

              <div className="space-y-3.5 text-[13px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-text-primary font-medium">
                    <CheckCircle size={15} className="text-success" />
                    <span>Request created</span>
                  </div>
                  <span className="text-text-secondary text-[12px]">Today, 18:31</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-text-primary font-medium">
                    <CheckCircle size={15} className="text-success" />
                    <span>Secure link generated</span>
                  </div>
                  <span className="text-text-secondary text-[12px]">Today, 18:31</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-text-primary font-medium">
                    <CheckCircle size={15} className="text-success" />
                    <span>Request delivered</span>
                  </div>
                  <span className="text-text-secondary text-[12px]">Today, 18:31</span>
                </div>

                <div className="flex items-center justify-between font-bold text-text-primary">
                  <div className="flex items-center gap-2.5 text-accent">
                    <span>➔</span>
                    <span>Awaiting capture</span>
                  </div>
                  <span className="text-text-secondary text-[12px]">—</span>
                </div>

                <div className="flex items-center justify-between text-text-secondary/60">
                  <div className="flex items-center gap-2.5">
                    <span className="h-3.5 w-3.5 rounded-full border border-border" />
                    <span>Quality check</span>
                  </div>
                  <span className="text-[12px]">—</span>
                </div>

                <div className="flex items-center justify-between text-text-secondary/60">
                  <div className="flex items-center gap-2.5">
                    <span className="h-3.5 w-3.5 rounded-full border border-border" />
                    <span>Resume property preparation</span>
                  </div>
                  <span className="text-[12px]">—</span>
                </div>
              </div>
            </div>

            {/* Request Controls */}
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-subtle flex items-center justify-between gap-3">
              <button className="flex-1 rounded-lg border border-border bg-surface py-2 text-[13.5px] font-semibold text-text-primary hover:bg-surface-elevated transition-colors">
                Edit instructions
              </button>
              <button className="flex-1 rounded-lg border border-border bg-surface py-2 text-[13.5px] font-semibold text-danger hover:bg-danger/10 transition-colors">
                Cancel request
              </button>
            </div>
          </div>
        </div>
      </div>
    </WorkspaceShell>
  )
}
`;

fs.writeFileSync(path.join(rootDir, 'src/screens/CaptureRequestsScreen.tsx'), captureRequestsScreenContent, 'utf8');
fs.writeFileSync(path.join(rootDir, 'src/screens/CaptureRequestDetailScreen.tsx'), captureRequestDetailContent, 'utf8');
console.log('Capture Requests Screens created successfully.');
