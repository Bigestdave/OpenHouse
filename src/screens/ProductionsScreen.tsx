import { useState } from 'react'
import { Link } from 'react-router-dom'
import { WorkspaceShell } from '../components/WorkspaceShell'
import { SearchIcon, LockIcon, GlobeIcon } from '../components/icons2'
import { Ellipsis } from '../components/icons'
import { useStore } from '../data/store'
import { PROPERTY_STATUS_LABELS } from '../data/types'
import propAdmiraltyImg from '../assets/prop-admiralty.jpg'
import propOrchidImg from '../assets/prop-orchid.jpg'
import propLekkiImg from '../assets/prop-lekkigardens.jpg'
import propBourdillonImg from '../assets/prop-bourdillon.jpg'

const filterTabs = ['All', 'Live', 'Ready for review', 'Preparing', 'Needs attention'] as const
type FilterTab = (typeof filterTabs)[number]

export function ProductionsScreen() {
  const { properties } = useStore()
  const [filter, setFilter] = useState<FilterTab>('All')
  const [query, setQuery] = useState('')

  const getCoverImage = (p: typeof properties[0]) => {
    if (p.coverImage) return p.coverImage
    if (p.title.includes('Admiralty')) return propAdmiraltyImg
    if (p.title.includes('Bourdillon')) return propBourdillonImg
    if (p.title.includes('Orchid')) return propOrchidImg
    return propLekkiImg
  }

  const visibleProperties = properties.filter((p) => {
    if (query) {
      const q = query.toLowerCase()
      if (!p.title.toLowerCase().includes(q) && !p.address.toLowerCase().includes(q)) {
        return false
      }
    }
    if (filter === 'All') return true
    if (filter === 'Live') return p.status === 'live'
    if (filter === 'Ready for review') return p.status === 'ready_for_review'
    if (filter === 'Preparing') return p.status === 'preparing' || p.status === 'checking_media' || p.status === 'quality_check'
    if (filter === 'Needs attention') return p.status === 'needs_recapture' || p.status === 'failed'
    return true
  })

  return (
    <WorkspaceShell>
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10 xl:px-12 py-6 lg:py-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] sm:text-[32px] lg:text-[34px] font-extrabold tracking-tight text-text-primary leading-tight">
              Experiences
            </h1>
            <p className="text-[14px] text-text-secondary font-normal mt-0.5 whitespace-nowrap">
              Published and preparing spatial experiences for renters and buyers.
            </p>
          </div>

          <Link
            to="/import"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#194534] text-white px-4 py-2.5 text-xs font-bold shadow-2xs hover:bg-[#2F613D] transition-colors shrink-0 whitespace-nowrap"
          >
            <span>Ingest New Listing ➔</span>
          </Link>
        </div>

        {/* Toolbar: Filters, Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {filterTabs.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 whitespace-nowrap shrink-0 ${
                  filter === f
                    ? 'bg-primary text-text-inverse shadow-xs'
                    : 'border border-border bg-surface text-text-primary hover:bg-surface-elevated'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex w-full sm:w-[220px] md:w-[260px] items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-xs text-text-primary shadow-2xs focus-within:border-primary">
              <SearchIcon size={14} className="text-stone-400 shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search experiences..."
                className="flex-1 bg-transparent text-stone-900 outline-none placeholder:text-stone-400 min-w-0 font-normal"
              />
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-2xl border border-border bg-surface shadow-subtle overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-[1.8fr_2.4fr_1.1fr_1fr_140px] items-center gap-4 px-5 py-3 border-b border-border bg-surface-elevated/50 text-[11px] font-bold text-text-secondary uppercase tracking-wider whitespace-nowrap">
              <div>Property</div>
              <div>State</div>
              <div>Visibility</div>
              <div>Updated</div>
              <div className="text-right">Action</div>
            </div>

            <div className="divide-y divide-border/60">
              {visibleProperties.map((p) => (
                <div
                  key={p.id}
                  className="grid grid-cols-[1.8fr_2.4fr_1.1fr_1fr_140px] items-center gap-4 px-5 py-3.5 hover:bg-surface-elevated/40 transition-colors"
                >
                  {/* Property */}
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={getCoverImage(p)}
                      alt={p.title}
                      className="h-10 w-14 rounded-lg object-cover border border-border shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-text-primary text-[13.5px] truncate">{p.title}</p>
                      <p className="text-[12px] text-text-secondary truncate mt-0.5">{p.address}</p>
                    </div>
                  </div>

                  {/* State */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <span
                        className={`h-2 w-2 rounded-full shrink-0 ${
                          p.status === 'live'
                            ? 'bg-emerald-600'
                            : p.status === 'ready_for_review'
                            ? 'bg-amber-600'
                            : p.status === 'needs_recapture'
                            ? 'bg-rose-600 animate-pulse'
                            : 'bg-blue-600 animate-spin'
                        }`}
                      />
                      <span className="font-semibold text-text-primary text-[13px] truncate">
                        {PROPERTY_STATUS_LABELS[p.status] || p.status}
                      </span>
                    </div>
                    <p className="text-[12px] text-text-secondary mt-0.5 truncate">
                      {p.spaces.length} spaces · {p.spaces.filter(s => s.captured).length} captured
                    </p>
                  </div>

                  {/* Visibility */}
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-text-secondary rounded-full bg-surface-elevated border border-border px-2.5 py-0.5 whitespace-nowrap">
                      {p.status === 'live' ? <GlobeIcon size={12} className="text-emerald-700" /> : <LockIcon size={12} className="text-stone-400" />}
                      <span>{p.status === 'live' ? 'Public' : 'Unlisted link'}</span>
                    </span>
                  </div>

                  {/* Updated */}
                  <div className="text-xs text-text-secondary whitespace-nowrap">
                    {new Date(p.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>

                  {/* Action */}
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={p.status === 'live' ? `/view/${p.id}` : `/show/${p.id}`}
                      className={`inline-flex items-center justify-center rounded-xl px-3.5 py-1.5 text-xs font-bold transition-colors whitespace-nowrap ${
                        p.status === 'ready_for_review'
                          ? 'bg-[#0B1713] text-white shadow-2xs hover:bg-black'
                          : p.status === 'live'
                          ? 'border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                          : 'border border-border bg-surface text-text-primary hover:bg-surface-elevated'
                      }`}
                    >
                      {p.status === 'live' ? 'View 3D Tour ↗' : p.status === 'ready_for_review' ? 'Review & Publish' : 'Open'}
                    </Link>
                    <button className="text-text-secondary hover:text-text-primary p-1 rounded-md hover:bg-surface-elevated transition-colors">
                      <Ellipsis size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-stone-500 pt-2">
          <span>Showing {visibleProperties.length} active property experiences</span>
        </div>
      </div>
    </WorkspaceShell>
  )
}

