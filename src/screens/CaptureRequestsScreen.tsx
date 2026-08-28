import { useState } from 'react'
import { Link } from 'react-router-dom'
import { WorkspaceShell } from '../components/WorkspaceShell'
import { SearchIcon, LightBulbIcon } from '../components/icons2'
import { useStore } from '../data/store'
import propAdmiraltyImg from '../assets/prop-admiralty.jpg'
import propKitchenImg from '../assets/prop-kitchen.png'
import propBourdillonImg from '../assets/prop-bourdillon.jpg'

const filterTabs = ['Open', 'Awaiting capture', 'Received', 'Checking', 'Resolved'] as const
type FilterTab = (typeof filterTabs)[number]

export function CaptureRequestsScreen() {
  const { captureRequests } = useStore()
  const [filter, setFilter] = useState<FilterTab>('Open')
  const [query, setQuery] = useState('')

  const visibleRequests = captureRequests.filter((r) => {
    if (query) {
      const q = query.toLowerCase()
      if (!r.propertyTitle.toLowerCase().includes(q) && !r.room.toLowerCase().includes(q) && !r.reason.toLowerCase().includes(q)) {
        return false
      }
    }
    if (filter === 'Open') return r.status !== 'resolved' && r.status !== 'failed'
    if (filter === 'Awaiting capture') return r.status === 'awaiting_capture' || r.status === 'sent' || r.status === 'pending'
    if (filter === 'Received') return r.status === 'received'
    if (filter === 'Checking') return r.status === 'checking'
    if (filter === 'Resolved') return r.status === 'resolved'
    return true
  })

  const getPropertyImg = (propertyTitle: string) => {
    if (propertyTitle.includes('Admiralty')) return propAdmiraltyImg
    if (propertyTitle.includes('Bourdillon')) return propBourdillonImg
    return propKitchenImg
  }

  const awaitingCount = captureRequests.filter(r => r.status === 'awaiting_capture' || r.status === 'sent' || r.status === 'pending').length
  const resolvedCount = captureRequests.filter(r => r.status === 'resolved').length

  return (
    <WorkspaceShell>
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10 xl:px-12 py-6 lg:py-8 space-y-6">
        
        {/* Header and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[26px] sm:text-[30px] lg:text-[32px] font-extrabold tracking-tight text-stone-900 leading-tight">
              Capture requests
            </h1>
            <p className="text-xs text-stone-500 font-normal mt-0.5 whitespace-nowrap">
              Autonomous missing footage requests dispatched to on-site realtors.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex w-full sm:w-[260px] md:w-[300px] lg:w-[320px] items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 shadow-2xs">
              <SearchIcon size={14} className="text-stone-400 shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search capture requests..."
                className="flex-1 bg-transparent text-stone-900 outline-none placeholder:text-stone-400 min-w-0 font-normal"
              />
            </div>

            <Link
              to="/properties"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0B1713] text-white px-4 py-2.5 text-xs font-bold hover:bg-black transition-colors shrink-0 shadow-2xs"
            >
              <span>View Properties ➔</span>
            </Link>
          </div>
        </div>

        {/* Counter Subheading */}
        <p className="text-xs text-stone-500 font-medium whitespace-nowrap">
          <strong className="text-stone-900 font-bold">{awaitingCount}</strong> awaiting capture · <strong className="text-emerald-700 font-bold">{resolvedCount}</strong> resolved
        </p>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {filterTabs.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                filter === f
                  ? 'bg-primary text-text-inverse shadow-xs'
                  : 'border border-border bg-surface text-text-primary hover:bg-surface-elevated'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Requests Data Table */}
        <div className="rounded-2xl border border-border bg-surface shadow-subtle overflow-x-auto">
          <div className="min-w-[880px]">
            <div className="grid grid-cols-[2fr_2fr_1.3fr_1.3fr_1fr_120px] items-center gap-4 px-5 py-3 border-b border-border bg-surface-elevated/50 text-[11px] font-bold text-text-secondary uppercase tracking-wider whitespace-nowrap">
              <div>Property</div>
              <div>Capture needed</div>
              <div>Recipient</div>
              <div>Status</div>
              <div>Created</div>
              <div className="text-right">Action</div>
            </div>

            <div className="divide-y divide-border/60">
              {visibleRequests.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-400">
                  No capture requests found for this filter.
                </div>
              ) : (
                visibleRequests.map((req) => (
                  <div
                    key={req.id}
                    className="grid grid-cols-[2fr_2fr_1.3fr_1.3fr_1fr_120px] items-center gap-4 px-5 py-3.5 hover:bg-surface-elevated/40 transition-colors"
                  >
                    {/* Property Column */}
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={getPropertyImg(req.propertyTitle)}
                        alt={req.propertyTitle}
                        className="h-10 w-14 rounded-lg object-cover border border-border shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-text-primary text-[13.5px] truncate">{req.propertyTitle}</p>
                        <p className="text-[12px] text-text-secondary truncate mt-0.5">{req.room}</p>
                      </div>
                    </div>

                    {/* Capture Needed */}
                    <div className="text-[13px] font-medium text-text-primary truncate">
                      {req.reason}
                    </div>

                    {/* Recipient */}
                    <div className="text-[13px] text-text-secondary truncate whitespace-nowrap">
                      {req.recipientName || 'David Olabowale'}
                    </div>

                    {/* Status */}
                    <div>
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-bold rounded-full px-2.5 py-0.5 whitespace-nowrap ${
                          req.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'received'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            req.status === 'resolved'
                              ? 'bg-emerald-600'
                              : req.status === 'received'
                              ? 'bg-blue-600 animate-spin'
                              : 'bg-rose-600 animate-pulse'
                          }`}
                        />
                        {req.status === 'resolved' ? 'Resolved' : req.status === 'received' ? 'Received' : 'Awaiting capture'}
                      </span>
                    </div>

                    {/* Created */}
                    <div className="text-xs text-text-secondary whitespace-nowrap">
                      {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>

                    {/* Action */}
                    <div className="text-right">
                      <Link
                        to={`/capture-requests/${req.id}`}
                        className="inline-flex items-center justify-center rounded-xl border border-border bg-surface px-3.5 py-1.5 text-xs font-semibold text-text-primary hover:bg-surface-elevated shadow-2xs transition-colors whitespace-nowrap"
                      >
                        View request
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Bottom Guidance Box */}
        <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-6 rounded-2xl border border-border bg-surface-elevated/40 p-5 shadow-subtle">
          <div className="flex items-start gap-3.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 shrink-0 mt-0.5">
              <LightBulbIcon size={18} className="text-primary" />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-text-primary">Autonomous Recapture Engine</h3>
              <p className="text-[13px] text-text-secondary mt-0.5 leading-relaxed">
                OpenHouse dispatches single-link mobile capture requests only when missing spatial connections block 3D reconstruction.
              </p>
            </div>
          </div>

          <div className="border-t md:border-t-0 md:border-l border-border pt-3 md:pt-0 md:pl-6 flex flex-col justify-center">
            <p className="text-[11px] font-bold uppercase tracking-wider text-text-secondary mb-1">
              Active Request Example
            </p>
            <p className="text-[13px] italic text-text-primary leading-relaxed">
              “Record one slow, 15-second video from the living room through the balcony doorway.”
            </p>
          </div>
        </div>
      </div>
    </WorkspaceShell>
  )
}

