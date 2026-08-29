import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { WorkspaceShell } from '../components/WorkspaceShell'
import { useStore } from '../data/store'
import { approveProperty } from '../data/workflow'
import { PROPERTY_STATUS_LABELS, type PropertyStatus } from '../data/types'
import { CopyIcon } from '../components/icons2'
import { CheckCircle, FullscreenIcon } from '../components/icons'
import propAdmiraltyImg from '../assets/prop-admiralty.jpg'
import propOrchidImg from '../assets/prop-orchid.jpg'
import propLekkiImg from '../assets/prop-lekkigardens.jpg'
import propBourdillonImg from '../assets/prop-bourdillon.jpg'
import propKitchenImg from '../assets/prop-kitchen.png'

const tabs = ['Overview', 'Evidence', 'Experience', 'Activity'] as const
type TabType = (typeof tabs)[number]

const DEFAULT_ROOMS = [
  { id: 'living', name: 'Living Room', img: propAdmiraltyImg },
  { id: 'kitchen', name: 'Kitchen', img: propKitchenImg },
  { id: 'main-bed', name: 'Main Bedroom', img: propBourdillonImg },
  { id: 'bed-2', name: 'Bedroom 2', img: propLekkiImg },
  { id: 'bed-3', name: 'Bedroom 3', img: propOrchidImg },
  { id: 'balcony', name: 'Balcony', img: propAdmiraltyImg },
]

export function ShowOverviewScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { properties } = useStore()
  const [tab, setTab] = useState<TabType>('Overview')
  const [activeRoom, setActiveRoom] = useState('living')
  const [copied, setCopied] = useState(false)
  const [isApproving, setIsApproving] = useState(false)

  // Find property by id, slug, or fallback to first
  const property = properties.find((p) => 
    p.id === id || 
    p.title.toLowerCase().replace(/[^a-z0-9]/g, '-').includes(id?.toLowerCase() || '') ||
    (id?.includes('admiralty') && p.title.includes('Admiralty'))
  ) || properties[0]

  if (!property) {
    return (
      <WorkspaceShell breadcrumb="Properties" backTo="/shows">
        <div className="mx-auto max-w-[1400px] px-6 py-16 text-center">
          <p className="text-sm font-semibold text-stone-700">Property not found.</p>
          <Link to="/properties" className="text-xs font-bold text-[#194534] underline mt-2 block">
            Return to properties
          </Link>
        </div>
      </WorkspaceShell>
    )
  }

  const handleApprove = () => {
    setIsApproving(true)
    approveProperty(property.id)
    setTimeout(() => {
      setIsApproving(false)
      navigate(`/experience/${property.id}/published`)
    }, 900)
  }

  const handleCopyId = () => {
    navigator.clipboard?.writeText?.(property.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getCoverImage = () => {
    if (property.coverImage) return property.coverImage
    if (property.title.includes('Admiralty')) return propAdmiraltyImg
    if (property.title.includes('Bourdillon')) return propBourdillonImg
    if (property.title.includes('Orchid')) return propOrchidImg
    return propLekkiImg
  }

  const getStatusBadge = (status: PropertyStatus) => {
    switch (status) {
      case 'live':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800"><span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />Live</span>
      case 'ready_for_review':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-900"><span className="h-1.5 w-1.5 rounded-full bg-amber-600" />Ready for review</span>
      case 'needs_recapture':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800"><span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-pulse" />Capture needed</span>
      case 'preparing':
      case 'checking_media':
      case 'quality_check':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800"><span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-spin" />{PROPERTY_STATUS_LABELS[status]}</span>
      default:
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-semibold text-stone-700">{PROPERTY_STATUS_LABELS[status] || status}</span>
    }
  }

  return (
    <WorkspaceShell
      breadcrumb={
        <div className="flex items-center gap-2 text-xs text-stone-500 whitespace-nowrap">
          <Link to="/properties" className="hover:text-stone-900">Properties</Link>
          <span>&gt;</span>
          <span className="font-semibold text-stone-900">{property.title}</span>
          {tab !== 'Overview' && (
            <>
              <span>&gt;</span>
              <span className="font-semibold text-stone-900">{tab}</span>
            </>
          )}
        </div>
      }
      backTo="/properties"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10 xl:px-12 py-6 lg:py-8 space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-[26px] sm:text-[30px] lg:text-[32px] font-extrabold tracking-tight text-stone-900 leading-none">
                {property.title}
              </h1>
              <button
                onClick={handleCopyId}
                className="text-stone-400 hover:text-stone-700 p-1 rounded transition-colors"
                title="Copy Property ID"
              >
                <CopyIcon size={14} />
              </button>
              {copied && <span className="text-[11px] text-emerald-600 font-bold">Copied!</span>}
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1.5 text-xs text-stone-500">
              <span>{property.address}</span>
              <span>·</span>
              <span>{property.type}</span>
              <span>·</span>
              <span className="font-bold text-stone-900">{property.price}</span>
              <span>·</span>
              <div>{getStatusBadge(property.status)}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {property.status === 'ready_for_review' && (
              <button
                onClick={handleApprove}
                disabled={isApproving}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0B1713] text-white px-5 py-2.5 text-xs font-bold hover:bg-black transition-all shadow-sm disabled:opacity-50"
              >
                {isApproving ? 'Publishing…' : 'Approve and publish ↗'}
              </button>
            )}

            <Link
              to={`/view/${property.id}`}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-semibold text-stone-800 shadow-2xs hover:bg-stone-50 transition-colors whitespace-nowrap"
            >
              <span>Preview 3D Tour ↗</span>
            </Link>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-6 sm:gap-8 border-b border-stone-200">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative pb-3 text-xs font-bold transition-colors whitespace-nowrap ${
                tab === t ? 'text-[#194534]' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              {t}
              {tab === t && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#194534]" />
              )}
            </button>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW */}
        {/* ========================================================================= */}
        {tab === 'Overview' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* 3-Part Status Hero Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs">
              {/* Photo Left */}
              <div className="relative aspect-[16/10] lg:aspect-auto lg:col-span-5 lg:h-[300px] overflow-hidden bg-stone-900">
                <img src={getCoverImage()} alt={property.title} className="h-full w-full object-cover" />
                <div className="absolute top-3 left-3">
                  {getStatusBadge(property.status)}
                </div>
              </div>

              {/* Center Status Card */}
              <div className="flex flex-col justify-between p-6 lg:col-span-4 border-b lg:border-b-0 lg:border-r border-stone-100 bg-white">
                <div>
                  <div className="flex items-center gap-1.5 pb-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-800">
                      OPENHOUSE STATUS
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  </div>

                  <h2 className="text-lg font-bold text-stone-900 leading-snug">
                    {property.status === 'live'
                      ? 'Experience is Published & Live'
                      : property.status === 'ready_for_review'
                      ? 'Ready for Publication Review'
                      : property.status === 'needs_recapture'
                      ? 'Awaiting Balcony Capture'
                      : 'Building the Property Experience'}
                  </h2>
                  <p className="pt-1.5 text-xs text-stone-600 leading-relaxed">
                    {property.status === 'needs_recapture'
                      ? 'OpenHouse needs one short 15-second mobile video through the balcony doorway.'
                      : property.status === 'live'
                      ? 'Tour is active and shareable via listing embed and WhatsApp.'
                      : 'OpenHouse is preparing, aligning camera poses, and verifying spatial fidelity in the background.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100">
                  <p className="text-xs text-stone-500">
                    {property.status === 'live' ? (
                      <span className="font-bold text-emerald-700">Live 24/7 Virtual Open House</span>
                    ) : (
                      <>
                        <span className="font-bold text-stone-900">18–25 minutes</span> Estimated completion
                      </>
                    )}
                  </p>
                  
                  {property.status === 'needs_recapture' ? (
                    <Link
                      to={`/capture/${property.id}`}
                      className="mt-2.5 inline-flex items-center justify-center rounded-xl bg-[#0B1713] text-white px-4 py-2 text-xs font-bold hover:bg-black transition-colors"
                    >
                      Record missing capture
                    </Link>
                  ) : property.status === 'ready_for_review' ? (
                    <button
                      onClick={handleApprove}
                      className="mt-2.5 inline-flex items-center justify-center rounded-xl bg-[#0B1713] text-white px-4 py-2 text-xs font-bold hover:bg-black transition-colors"
                    >
                      Approve & Publish
                    </button>
                  ) : (
                    <button
                      onClick={() => setTab('Activity')}
                      className="mt-2.5 inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-stone-800 hover:bg-stone-50 transition-colors"
                    >
                      View activity log
                    </button>
                  )}
                </div>
              </div>

              {/* Right Milestone Stepper */}
              <div className="p-6 lg:col-span-3 flex flex-col justify-center bg-stone-50/60 text-xs">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-stone-700 font-medium">
                    <CheckCircle size={14} className="text-emerald-700 shrink-0" />
                    <span>Listing collected</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-700 font-medium">
                    <CheckCircle size={14} className="text-emerald-700 shrink-0" />
                    <span>{property.spaces.length} spaces identified</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-700 font-medium">
                    <CheckCircle size={14} className="text-emerald-700 shrink-0" />
                    <span>Quality checked</span>
                  </div>
                  <div className="flex items-center gap-2 font-bold text-stone-900">
                    <span className="h-2 w-2 rounded-full bg-[#194534] shrink-0 animate-pulse" />
                    <span>Interactive 3D reconstruction</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-400">
                    <span className="h-3 w-3 rounded-full border border-stone-300 shrink-0" />
                    <span>Publication approval</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom 2-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Col 1: Property Spaces & Coverage */}
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                  <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Property Spaces ({property.spaces.length})
                  </h3>
                  <span className="text-[11px] text-stone-500">
                    {property.spaces.filter(s => s.captured).length} of {property.spaces.length} captured
                  </span>
                </div>

                <div className="divide-y divide-stone-100 text-xs">
                  {property.spaces.map((space) => (
                    <div key={space.id} className="py-2.5 flex items-center justify-between">
                      <span className="font-semibold text-stone-900">{space.name}</span>
                      <div className="flex items-center gap-2">
                        {space.captured ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-bold">
                            ✓ Captured
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-bold">
                            ! Coverage needed
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Col 2: Collapsible Agent Activity & Decision Ledger */}
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                  <div>
                    <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                      Agent Decision Ledger
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      Autonomous decisions logged during intake & processing
                    </p>
                  </div>
                  <span className="text-[10px] bg-stone-100 px-2 py-0.5 rounded text-stone-600 font-bold">
                    Judge Audit View
                  </span>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {property.timeline.length === 0 ? (
                    <p className="text-xs text-stone-400 py-4 text-center">No timeline events yet.</p>
                  ) : (
                    property.timeline.map((event) => (
                      <div key={event.id} className="text-xs bg-stone-50/80 rounded-xl p-3 border border-stone-100 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-stone-900">{event.event}</span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {event.detail && (
                          <p className="text-[11px] text-stone-600">{event.detail}</p>
                        )}
                        {event.agentDecision && (
                          <div className="text-[10px] text-emerald-800 bg-emerald-50/80 rounded px-2 py-1 mt-1">
                            <strong>Decision:</strong> {event.agentDecision}
                          </div>
                        )}
                        {event.toolUsed && (
                          <span className="inline-block text-[9px] text-stone-400 font-mono mt-0.5">
                            Tool: {event.toolUsed}
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: EVIDENCE */}
        {/* ========================================================================= */}
        {tab === 'Evidence' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-stone-900">
                What OpenHouse Verified
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl bg-emerald-50/60 border border-emerald-200 p-4 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    Verified Evidence
                  </h4>
                  <ul className="space-y-1.5 text-xs text-emerald-800 font-medium">
                    <li>✓ All {property.spaces.length} advertised rooms represented</li>
                    <li>✓ Doorway and circulation connectivity confirmed</li>
                    <li>✓ Kitchen layout matches source listing footage</li>
                    <li>✓ Privacy check passed (no private documents or people visible)</li>
                  </ul>
                </div>

                <div className="rounded-xl bg-amber-50/60 border border-amber-200 p-4 space-y-2">
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                    Evidence Limitations (Disciplined Autonomy)
                  </h4>
                  <ul className="space-y-1.5 text-xs text-amber-800 font-medium">
                    <li>! Bedroom 3 dimensions are estimated from visual ratio</li>
                    <li>! Balcony depth requires dimensioned floor plan for survey-grade accuracy</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: EXPERIENCE (Review Mode) */}
        {/* ========================================================================= */}
        {tab === 'Experience' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* 3D Viewport Left */}
              <div className="lg:col-span-8 rounded-2xl border border-stone-200 bg-stone-950 overflow-hidden shadow-subtle relative min-h-[460px] flex flex-col justify-between p-4">
                <img
                  src={DEFAULT_ROOMS.find(r => r.id === activeRoom)?.img || propAdmiraltyImg}
                  alt="Tour preview"
                  className="absolute inset-0 h-full w-full object-cover opacity-80"
                />

                <div className="relative z-10 flex items-center justify-between text-white bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl">
                  <span className="text-xs font-bold">{property.title} · Review Mode</span>
                  <Link to={`/view/${property.id}`} className="text-white hover:text-stone-300">
                    <FullscreenIcon size={16} />
                  </Link>
                </div>

                <div className="relative z-10 flex items-center gap-2 overflow-x-auto bg-black/60 backdrop-blur-md p-2 rounded-xl">
                  {DEFAULT_ROOMS.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setActiveRoom(r.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                        activeRoom === r.id
                          ? 'bg-white text-stone-900 shadow-xs'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {r.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Approval Summary Right */}
              <div className="lg:col-span-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-stone-900">
                  Ready to Publish
                </h3>

                <div className="space-y-2 text-xs text-stone-600">
                  <div className="flex items-center justify-between">
                    <span>Represented rooms</span>
                    <strong className="text-stone-900">{property.spaces.length} of {property.spaces.length}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Capture issues resolved</span>
                    <strong className="text-emerald-700">100%</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Mobile bundle size</span>
                    <strong className="text-stone-900">12.4 MB</strong>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 space-y-2">
                  <label className="text-xs font-bold text-stone-700 block">Default Visibility</label>
                  <select className="w-full rounded-xl border border-stone-200 p-2.5 text-xs text-stone-900">
                    <option>Unlisted link (Anyone with link)</option>
                    <option>Public (Search indexed)</option>
                    <option>Password protected</option>
                  </select>
                </div>

                <button
                  onClick={handleApprove}
                  disabled={isApproving}
                  className="w-full bg-[#0B1713] text-white rounded-xl py-3 text-xs font-bold hover:bg-black transition-all shadow-sm mt-2 disabled:opacity-50"
                >
                  {isApproving ? 'Publishing Experience…' : 'Approve and publish'}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: ACTIVITY */}
        {/* ========================================================================= */}
        {tab === 'Activity' && (
          <div className="space-y-4 animate-fadeIn max-w-[800px]">
            <h3 className="text-sm font-bold text-stone-900">
              Autonomous Activity History
            </h3>

            <div className="divide-y divide-stone-100 rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
              {property.timeline.map((event) => (
                <div key={event.id} className="py-3 first:pt-0 last:pb-0 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">{event.event}</span>
                    <span className="text-[11px] text-stone-400">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {event.detail && <p className="text-stone-600">{event.detail}</p>}
                  {event.agentDecision && (
                    <p className="text-emerald-800 text-[11px] bg-emerald-50 p-2 rounded-lg">
                      <strong>Agent Action:</strong> {event.agentDecision}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </WorkspaceShell>
  )
}
