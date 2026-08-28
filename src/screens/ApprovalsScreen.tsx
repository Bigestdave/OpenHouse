import { useState } from 'react'
import { Link } from 'react-router-dom'
import { WorkspaceShell } from '../components/WorkspaceShell'
import { SearchIcon } from '../components/icons2'
import { CheckCircle } from '../components/icons'
import { useStore } from '../data/store'
import { approveProperty } from '../data/workflow'
import propAdmiraltyImg from '../assets/prop-admiralty.jpg'
import propOrchidImg from '../assets/prop-orchid.jpg'
import propLekkiImg from '../assets/prop-lekkigardens.jpg'
import propBourdillonImg from '../assets/prop-bourdillon.jpg'

const filterTabs = ['Ready', 'All Pending', 'Published'] as const
type FilterTab = (typeof filterTabs)[number]

export function ApprovalsScreen() {
  const { properties } = useStore()
  const [filter, setFilter] = useState<FilterTab>('Ready')
  const [query, setQuery] = useState('')
  const [publishingId, setPublishingId] = useState<string | null>(null)

  const getCoverImage = (p: typeof properties[0]) => {
    if (p.coverImage) return p.coverImage
    if (p.title.includes('Admiralty')) return propAdmiraltyImg
    if (p.title.includes('Bourdillon')) return propBourdillonImg
    if (p.title.includes('Orchid')) return propOrchidImg
    return propLekkiImg
  }

  const reviewProperties = properties.filter((p) => {
    if (query) {
      const q = query.toLowerCase()
      if (!p.title.toLowerCase().includes(q) && !p.address.toLowerCase().includes(q)) {
        return false
      }
    }
    if (filter === 'Ready') return p.status === 'ready_for_review'
    if (filter === 'All Pending') return p.status !== 'live'
    if (filter === 'Published') return p.status === 'live'
    return true
  })

  const readyCount = properties.filter(p => p.status === 'ready_for_review').length
  const featured = reviewProperties[0] || properties.find(p => p.status === 'ready_for_review') || properties[0]

  const handleApprove = (propId: string) => {
    setPublishingId(propId)
    approveProperty(propId)
    setTimeout(() => {
      setPublishingId(null)
    }, 800)
  }

  return (
    <WorkspaceShell>
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10 xl:px-12 py-6 lg:py-8 space-y-6">
        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] sm:text-[32px] lg:text-[34px] font-extrabold tracking-tight text-stone-900 leading-tight">
              Approvals
            </h1>
            <p className="text-[14px] text-stone-500 font-normal mt-0.5 whitespace-nowrap">
              Review completed experiences before they go live to prospective renters.
            </p>
          </div>

          <div className="flex w-full sm:w-[260px] md:w-[300px] lg:w-[320px] items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 shadow-2xs">
            <SearchIcon size={14} className="text-stone-400 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search properties..."
              className="flex-1 bg-transparent text-stone-900 outline-none placeholder:text-stone-400 min-w-0 font-normal"
            />
          </div>
        </div>

        {/* Counter Subheading */}
        <p className="text-xs text-stone-500 font-medium whitespace-nowrap">
          <strong className="text-stone-900 font-bold">{readyCount}</strong> ready for publication review
        </p>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 pb-1 overflow-x-auto">
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

        {/* Featured Approval Card */}
        {featured && (
          <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] overflow-hidden rounded-2xl border border-border bg-surface shadow-subtle">
            <div className="relative aspect-[16/10] lg:aspect-auto lg:h-[320px] overflow-hidden bg-sidebar">
              <img
                src={getCoverImage(featured)}
                alt={featured.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="p-5 lg:p-6 xl:p-7 flex flex-col justify-between bg-surface">
              <div>
                <div className="flex items-center gap-1.5 pb-1.5">
                  <span className={`h-2 w-2 rounded-full shrink-0 ${featured.status === 'live' ? 'bg-emerald-600' : 'bg-amber-600'}`} />
                  <span className={`text-[11px] font-bold uppercase tracking-[0.1em] ${featured.status === 'live' ? 'text-emerald-700' : 'text-amber-800'} whitespace-nowrap`}>
                    {featured.status === 'live' ? 'PUBLISHED & LIVE' : 'READY TO PUBLISH'}
                  </span>
                </div>

                <h2 className="text-[20px] sm:text-[22px] font-bold tracking-tight text-text-primary leading-snug">
                  {featured.title}
                </h2>
                <p className="text-[13px] text-text-secondary mt-0.5 truncate">
                  {featured.type} · {featured.address} · {featured.price}
                </p>

                <div className="space-y-2 pt-4 text-[13px] text-text-secondary">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <CheckCircle size={15} className="text-success shrink-0" />
                    <span className="truncate">{featured.spaces.length} of {featured.spaces.length} advertised rooms represented</span>
                  </div>
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <CheckCircle size={15} className="text-success shrink-0" />
                    <span className="truncate">All capture issues resolved</span>
                  </div>
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <CheckCircle size={15} className="text-success shrink-0" />
                    <span className="truncate">Spatial consistency verification passed</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-4">
                {featured.status !== 'live' && (
                  <button
                    onClick={() => handleApprove(featured.id)}
                    disabled={publishingId === featured.id}
                    className="inline-flex items-center justify-center rounded-xl bg-[#0B1713] text-white px-4 py-2 text-xs font-bold shadow-2xs hover:bg-black transition-colors whitespace-nowrap disabled:opacity-50"
                  >
                    {publishingId === featured.id ? 'Publishing…' : 'Approve & Publish'}
                  </button>
                )}
                <Link
                  to={`/show/${featured.id}`}
                  className="inline-flex items-center justify-center rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-text-primary shadow-2xs hover:bg-surface-elevated transition-colors whitespace-nowrap"
                >
                  Review experience
                </Link>
                <Link
                  to={`/view/${featured.id}`}
                  className="inline-flex items-center justify-center rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-text-primary shadow-2xs hover:bg-surface-elevated transition-colors whitespace-nowrap"
                >
                  Preview 3D Tour ↗
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Other Review Rows */}
        <div className="space-y-3">
          {reviewProperties.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-xl border border-border bg-surface p-4 shadow-subtle hover:border-line-strong transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={getCoverImage(p)}
                  alt={p.title}
                  className="h-12 w-16 rounded-lg object-cover border border-border shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="font-bold text-text-primary text-[13.5px] truncate">{p.title}</h3>
                  <p className="text-[12px] text-text-secondary truncate mt-0.5">{p.type} · {p.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 sm:gap-8 shrink-0">
                <div className="flex items-center gap-1.5 text-xs text-text-secondary hidden md:flex">
                  <CheckCircle size={14} className="text-success shrink-0" />
                  <span>{p.spaces.length} rooms represented</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-text-secondary hidden sm:flex">
                  <span className={`h-2 w-2 rounded-full shrink-0 ${p.status === 'live' ? 'bg-emerald-600' : 'bg-amber-600'}`} />
                  <span>{p.status === 'live' ? 'Live' : 'Ready for review'}</span>
                </div>
                {p.status === 'ready_for_review' && (
                  <button
                    onClick={() => handleApprove(p.id)}
                    className="rounded-xl bg-[#0B1713] text-white px-3.5 py-1.5 text-xs font-bold hover:bg-black transition-colors"
                  >
                    Approve
                  </button>
                )}
                <Link
                  to={`/show/${p.id}`}
                  className="rounded-xl border border-border bg-surface px-3.5 py-1.5 text-xs font-semibold text-text-primary hover:bg-surface-elevated transition-colors"
                >
                  Review
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </WorkspaceShell>
  )
}

