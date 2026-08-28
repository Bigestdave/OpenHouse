import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { WorkspaceShell, NotificationButton } from '../components/WorkspaceShell'
import { SearchIcon, ClockIcon, PhoneIcon } from '../components/icons2'
import { useStore, usePropertyStats, deleteProperty } from '../data/store'
import { PROPERTY_STATUS_LABELS, type PropertyStatus } from '../data/types'
import propAdmiraltyImg from '../assets/prop-admiralty.jpg'
import propOrchidImg from '../assets/prop-orchid.jpg'
import propLekkiImg from '../assets/prop-lekkigardens.jpg'
import propBourdillonImg from '../assets/prop-bourdillon.jpg'

const filterOptions = ['All', 'Preparing', 'Needs attention', 'Ready', 'Live'] as const
type FilterType = (typeof filterOptions)[number]

export function ShowsHomeScreen() {
  const { properties, captureRequests, workspace } = useStore()
  const stats = usePropertyStats()
  const [filter, setFilter] = useState<FilterType>('All')
  const [query, setQuery] = useState('')
  const [menuFor, setMenuFor] = useState<string | null>(null)

  // Close card menu on outside click
  useEffect(() => {
    if (!menuFor) return
    const close = () => setMenuFor(null)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [menuFor])

  const handleDeleteProperty = (id: string, title: string) => {
    if (window.confirm(`Delete "${title}"?`)) {
      deleteProperty(id)
    }
  }

  // Filter properties based on search and active tab
  const visibleProperties = properties.filter((p) => {
    if (query) {
      const q = query.toLowerCase()
      const matchTitle = p.title.toLowerCase().includes(q)
      const matchAddress = p.address.toLowerCase().includes(q)
      const matchType = p.type.toLowerCase().includes(q)
      if (!matchTitle && !matchAddress && !matchType) return false
    }

    if (filter === 'All') return true
    if (filter === 'Preparing') return ['detected', 'checking_media', 'preparing', 'quality_check'].includes(p.status)
    if (filter === 'Needs attention') return p.status === 'needs_recapture'
    if (filter === 'Ready') return p.status === 'ready_for_review'
    if (filter === 'Live') return p.status === 'live'
    return true
  })

  // Attention hero property (first property with status needs_recapture)
  const attentionProperty = properties.find((p) => p.status === 'needs_recapture')
  const attentionRequest = attentionProperty
    ? captureRequests.find((cr) => cr.propertyId === attentionProperty.id && cr.status !== 'resolved')
    : undefined

  // Grouped properties for sections
  const inProgressProperties = properties.filter((p) =>
    ['detected', 'checking_media', 'preparing', 'quality_check'].includes(p.status)
  )
  const readyProperties = properties.filter((p) => p.status === 'ready_for_review')

  const getImageForProperty = (p: { coverImage?: string; title: string }) => {
    if (p.coverImage) return p.coverImage
    if (p.title.includes('Admiralty')) return propAdmiraltyImg
    if (p.title.includes('Bourdillon')) return propBourdillonImg
    if (p.title.includes('Orchid')) return propOrchidImg
    if (p.title.includes('Lekki')) return propLekkiImg
    return propAdmiraltyImg
  }

  const getStatusBadge = (status: PropertyStatus) => {
    switch (status) {
      case 'live':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800"><span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />Live</span>
      case 'ready_for_review':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-900"><span className="h-1.5 w-1.5 rounded-full bg-amber-600" />Ready for review</span>
      case 'needs_recapture':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-bold text-rose-800"><span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-pulse" />Capture needed</span>
      case 'preparing':
      case 'checking_media':
      case 'quality_check':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-bold text-blue-800"><span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-spin" />{PROPERTY_STATUS_LABELS[status]}</span>
      default:
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-semibold text-stone-700">{PROPERTY_STATUS_LABELS[status] || status}</span>
    }
  }

  const ownerFirstName = workspace?.ownerName ? workspace.ownerName.split(' ')[0] : 'David'

  return (
    <WorkspaceShell>
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10 xl:px-12 py-6 lg:py-8 space-y-6">
        
        {/* Header & Attention Inbox Overview */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-2">
          <div className="min-w-0">
            <h1 className="text-[26px] sm:text-[30px] lg:text-[32px] font-extrabold tracking-tight text-text-primary leading-tight">
              Good morning, {ownerFirstName}.
            </h1>
            <p className="text-[14px] text-text-secondary font-normal mt-1 leading-relaxed">
              <strong className="text-text-primary font-semibold">{stats.live} listings</strong> are live. OpenHouse is preparing <strong className="text-text-primary font-semibold">{stats.preparing}</strong>. <strong className="text-[#D97945] font-semibold">{stats.needsAttention} listing</strong> needs your attention.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/demo-portal"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0B1713] text-white px-4 py-2.5 text-xs font-bold shadow-sm hover:bg-black transition-all"
            >
              <span>+ Simulate New Listing</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Demo Trigger</span>
            </Link>

            <div className="flex w-full sm:w-[220px] md:w-[260px] items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-xs text-text-primary shadow-2xs">
              <SearchIcon size={14} className="text-text-secondary shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search properties..."
                className="flex-1 bg-transparent text-text-primary outline-none placeholder:text-text-secondary/70 font-normal min-w-0"
              />
            </div>
            
            <NotificationButton />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {filterOptions.map((f) => {
            let count = properties.length
            if (f === 'Preparing') count = stats.preparing
            if (f === 'Needs attention') count = stats.needsAttention
            if (f === 'Ready') count = stats.readyForReview
            if (f === 'Live') count = stats.live

            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  filter === f
                    ? 'bg-primary text-text-inverse shadow-xs'
                    : 'border border-border bg-surface text-text-primary hover:bg-surface-elevated'
                }`}
              >
                <span>{f}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${filter === f ? 'bg-white/20' : 'bg-stone-200/60'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* ========================================================================= */}
        {/* SECTION 1: NEEDS YOUR ATTENTION (Dynamic Hero Banner) */}
        {/* ========================================================================= */}
        {(filter === 'All' || filter === 'Needs attention') && attentionProperty && (
          <div className="space-y-2.5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold tracking-[0.12em] text-[#D97945] uppercase flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#D97945] animate-ping" />
                <span>NEEDS YOUR ATTENTION</span>
              </p>
              <span className="text-xs text-text-secondary font-medium">1 action required</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] xl:grid-cols-[1.35fr_1fr] overflow-hidden rounded-2xl border border-rose-200/80 bg-surface shadow-subtle ring-1 ring-rose-500/10">
              <div className="relative aspect-[16/9] lg:aspect-auto lg:h-[280px] w-full overflow-hidden bg-sidebar">
                <img
                  src={getImageForProperty(attentionProperty)}
                  alt={attentionProperty.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-3 left-3 rounded-lg bg-black/65 backdrop-blur-md px-3 py-1.5 text-white border border-white/10 shadow-lg">
                  <p className="text-[13.5px] font-bold leading-tight">{attentionProperty.title}</p>
                  <p className="text-[11.5px] text-white/80 font-normal">{attentionProperty.address}</p>
                </div>
              </div>

              <div className="flex flex-col justify-between p-5 lg:p-6 bg-surface">
                <div>
                  <div className="flex items-center gap-1.5 pb-1">
                    <span className="h-2 w-2 rounded-full bg-[#D97945] shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#D97945]">
                      RECAPTURE NEEDED
                    </span>
                  </div>

                  <h2 className="text-[18px] sm:text-[20px] font-bold tracking-tight text-text-primary leading-snug">
                    {attentionRequest?.reason || 'One room connection is missing.'}
                  </h2>
                  <p className="pt-1.5 text-xs text-text-secondary leading-relaxed">
                    {attentionRequest?.instructions || 'OpenHouse needs a short 15-second video pass to complete spatial coverage.'}
                  </p>
                </div>

                <div className="py-3">
                  <div className="flex flex-col gap-1 text-xs text-text-secondary">
                    <div className="flex items-center gap-2">
                      <ClockIcon size={13} className="text-text-secondary shrink-0" />
                      <span>Estimated time · {attentionRequest?.estimatedTime || '1 minute'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PhoneIcon size={13} className="text-text-secondary shrink-0" />
                      <span>
                        {attentionProperty.spaces.filter(s => s.captured).length} of {attentionProperty.spaces.length} spaces sufficiently captured
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="flex gap-1 pt-2.5">
                    {attentionProperty.spaces.map((s, idx) => (
                      <div
                        key={idx}
                        className={`h-1.5 flex-1 rounded-full ${
                          s.captured ? 'bg-[#2F613D]' : 'bg-[#D97945] animate-pulse'
                        }`}
                        title={`${s.name}: ${s.captured ? 'Captured' : 'Missing'}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-1">
                  <Link
                    to={attentionRequest ? `/capture/${attentionRequest.id}` : `/capture/${attentionProperty.id}`}
                    className="inline-flex items-center justify-center rounded-xl bg-[#0B1713] text-white px-5 py-2.5 text-xs font-bold hover:bg-black transition-colors shadow-xs"
                  >
                    Record now
                  </Link>
                  <Link
                    to={`/show/${attentionProperty.id}`}
                    className="inline-flex items-center justify-center rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-semibold text-text-primary hover:bg-stone-50 transition-colors"
                  >
                    See why
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 2: WORKING IN THE BACKGROUND */}
        {/* ========================================================================= */}
        {(filter === 'All' || filter === 'Preparing') && inProgressProperties.length > 0 && (
          <div className="space-y-2.5">
            <p className="text-[11px] font-bold tracking-[0.12em] text-text-secondary uppercase">
              WORKING IN THE BACKGROUND / {inProgressProperties.length}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {inProgressProperties.map((p) => (
                <Link
                  key={p.id}
                  to={`/show/${p.id}`}
                  className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4 shadow-2xs hover:border-stone-400/60 transition-all group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={getImageForProperty(p)}
                      alt={p.title}
                      className="h-12 w-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-text-primary group-hover:text-[#194534] transition-colors truncate">
                        {p.title}
                      </h4>
                      <p className="text-[11px] text-text-secondary truncate mt-0.5">
                        {p.address} · {p.type}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-3">
                    {getStatusBadge(p.status)}
                    <span className="text-[10px] text-stone-400 block mt-1">
                      Expected in 18–25 mins
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 3: READY FOR REVIEW */}
        {/* ========================================================================= */}
        {(filter === 'All' || filter === 'Ready') && readyProperties.length > 0 && (
          <div className="space-y-2.5">
            <p className="text-[11px] font-bold tracking-[0.12em] text-text-secondary uppercase">
              READY FOR REVIEW / {readyProperties.length}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {readyProperties.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50/40 p-4 shadow-2xs"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={getImageForProperty(p)}
                      alt={p.title}
                      className="h-12 w-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-text-primary truncate">{p.title}</h4>
                      <p className="text-[11px] text-text-secondary truncate mt-0.5">
                        {p.spaces.length} of {p.spaces.length} rooms ready · Quality verified
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/show/${p.id}`}
                    className="inline-flex items-center justify-center rounded-xl bg-[#0B1713] text-white px-3.5 py-2 text-xs font-bold hover:bg-black transition-colors shrink-0 shadow-2xs"
                  >
                    Review and publish
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 4: ALL PROPERTIES GRID */}
        {/* ========================================================================= */}
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold tracking-[0.12em] text-text-secondary uppercase">
              ALL LISTINGS / {visibleProperties.length}
            </p>
            <span className="text-xs text-text-secondary">Click any property to inspect timeline & evidence</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {visibleProperties.map((p) => (
              <div
                key={p.id}
                className="group relative flex flex-col rounded-2xl border border-border bg-surface overflow-hidden shadow-2xs hover:shadow-subtle hover:border-stone-400/70 transition-all"
              >
                {/* Cover Image */}
                <Link to={`/show/${p.id}`} className="relative aspect-[16/10] overflow-hidden bg-stone-900">
                  <img
                    src={getImageForProperty(p)}
                    alt={p.title}
                    className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 right-2.5">
                    {getStatusBadge(p.status)}
                  </div>
                  <div className="absolute bottom-2 left-2.5 right-2.5 text-white bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-lg">
                    <p className="text-xs font-bold truncate leading-tight">{p.title}</p>
                    <p className="text-[11px] text-white/80 truncate">{p.price}</p>
                  </div>
                </Link>

                {/* Body Details */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-text-primary truncate">{p.address}</p>
                    <p className="text-[11px] text-text-secondary">{p.type} · {p.bedrooms} Beds</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[11px]">
                    <span className="text-text-secondary font-medium">
                      {p.spaces.filter(s => s.captured).length}/{p.spaces.length} spaces
                    </span>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/show/${p.id}`}
                        className="font-bold text-[#194534] hover:underline"
                      >
                        Inspect →
                      </Link>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteProperty(p.id, p.title)
                        }}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                        title="Delete property"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </WorkspaceShell>
  )
}

