import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { WorkspaceShell } from '../components/WorkspaceShell'
import { useStore } from '../data/store'
import { approveProperty } from '../data/workflow'
import { Button } from '../components/ui'
import { SearchIcon } from '../components/icons2'
import type { Property } from '../data/types'
import propAdmiraltyImg from '../assets/prop-admiralty.jpg'
import propBourdillonImg from '../assets/prop-bourdillon.jpg'
import propLekkiImg from '../assets/prop-lekkigardens.jpg'
import propOrchidImg from '../assets/prop-orchid.jpg'

const filterTabs = ['Ready for review', 'Published'] as const
type FilterTab = (typeof filterTabs)[number]

function getPropertyImage(p: Property) {
  if (p.coverImage) return p.coverImage
  if (p.title.includes('Admiralty')) return propAdmiraltyImg
  if (p.title.includes('Bourdillon')) return propBourdillonImg
  if (p.title.includes('Orchid')) return propOrchidImg
  return propLekkiImg
}

export function ApprovalsScreen() {
  const store = useStore()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<FilterTab>('Ready for review')
  const [query, setQuery] = useState('')
  const [approvingId, setApprovingId] = useState<string | null>(null)

  const readyProps = store.properties.filter(
    (p) => p.status === 'ready_for_review'
  )
  const publishedProps = store.properties.filter((p) => p.status === 'live')

  const activeList = filter === 'Ready for review' ? readyProps : publishedProps

  const filteredList = query
    ? activeList.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.address.toLowerCase().includes(query.toLowerCase())
      )
    : activeList

  // Featured = first in list, rest shown below
  const [featuredProp, ...restProps] = filteredList

  const handleApprove = (prop: Property) => {
    setApprovingId(prop.id)
    approveProperty(prop.id)
    setTimeout(() => {
      setApprovingId(null)
      navigate(`/experience/${prop.id}/published`)
    }, 900)
  }

  return (
    <WorkspaceShell>
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-10 py-6 lg:py-8 font-sans text-ink space-y-6">

        {/* ── Page Header ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-border">
          <div>
            <h1 className="text-[26px] sm:text-[30px] font-extrabold tracking-tight text-ink leading-tight">
              Tour Review & Approval
            </h1>
            <p className="text-sm text-ink-2 mt-1 leading-relaxed">
              Inspect completed 3D experiences before they go live on your listings.
            </p>
          </div>

          <div className="flex w-full sm:w-[280px] items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-ink shadow-subtle focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all shrink-0">
            <SearchIcon size={15} className="text-ink-3 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search properties..."
              className="w-full bg-transparent text-ink placeholder:text-ink-3 outline-none text-[13px]"
            />
          </div>
        </div>

        {/* ── Filter Tabs ──────────────────────────────────────────── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {filterTabs.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                filter === f
                  ? 'bg-primary text-text-inverse shadow-subtle'
                  : 'border border-border bg-surface text-ink hover:bg-raised-2'
              }`}
            >
              {f}
              <span className={`ml-1.5 font-bold ${filter === f ? 'text-text-inverse/70' : 'text-ink-3'}`}>
                ({f === 'Ready for review' ? readyProps.length : publishedProps.length})
              </span>
            </button>
          ))}
        </div>

        {/* ── Empty State ──────────────────────────────────────────── */}
        {filteredList.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-surface p-14 text-center">
            <p className="text-[15px] font-semibold text-ink">
              {filter === 'Ready for review' ? 'No tours ready for review yet' : 'No published properties yet'}
            </p>
            <p className="text-sm text-ink-2 mt-1.5">
              {filter === 'Ready for review'
                ? 'Properties appear here once OpenHouse finishes building their 3D experience.'
                : 'Approved tours will appear here once published.'}
            </p>
            {filter === 'Ready for review' && (
              <Link to="/properties" className="inline-block mt-4">
                <Button variant="secondary" size="sm">View properties</Button>
              </Link>
            )}
          </div>
        )}

        {/* ── Featured Hero Card ───────────────────────────────────── */}
        {featuredProp && filter === 'Ready for review' && (
          <section>
            <div className="flex items-center gap-2 pb-3">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-2">
                AWAITING YOUR APPROVAL
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] overflow-hidden rounded-2xl border border-primary/25 bg-surface shadow-featured">
              {/* Left: property photo */}
              <div className="relative aspect-[16/10] lg:aspect-auto lg:h-[360px] overflow-hidden bg-sidebar">
                <img
                  src={getPropertyImage(featuredProp)}
                  alt={featuredProp.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-3.5 left-3.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/90 backdrop-blur-sm px-3 py-1 text-[11px] font-bold text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/80 animate-pulse" />
                    Ready to publish
                  </span>
                </div>
                <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between rounded-xl bg-black/70 backdrop-blur-md px-3.5 py-2.5 text-white border border-white/10">
                  <div>
                    <p className="text-sm font-bold leading-tight">{featuredProp.title}</p>
                    <p className="text-[11px] text-white/75 mt-0.5">{featuredProp.address}</p>
                  </div>
                  <Link
                    to={`/view/${featuredProp.id}`}
                    className="rounded-lg bg-white/15 hover:bg-white/25 px-3 py-1.5 text-[11px] font-semibold transition-all whitespace-nowrap"
                  >
                    Preview tour ↗
                  </Link>
                </div>
              </div>

              {/* Right: approval panel */}
              <div className="p-6 lg:p-8 flex flex-col justify-between bg-surface">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-[21px] font-bold tracking-tight text-ink leading-snug">
                      {featuredProp.title}
                    </h2>
                    <p className="text-xs text-ink-2 mt-1">
                      {featuredProp.price} · {featuredProp.bedrooms} bed · {featuredProp.bathrooms} bath
                    </p>
                  </div>

                  {/* Verification checklist */}
                  <div className="rounded-xl bg-canvas border border-border p-4 space-y-2.5">
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-ink-3 pb-1">
                      OpenHouse verified
                    </p>
                    {[
                      `${featuredProp.spaces.length} of ${featuredProp.spaces.length} advertised rooms represented`,
                      'Doorway connections and room transitions confirmed',
                      'No people or private documents detected',
                      'Spatial fidelity check passed',
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2.5 text-xs text-ink">
                        <span className="text-primary font-bold mt-0.5 shrink-0">✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                    <div className="flex items-start gap-2.5 text-xs text-ink-2 pt-0.5">
                      <span className="text-accent font-bold mt-0.5 shrink-0">!</span>
                      <span>Unscaled measurements flagged — exact dimensions not verified</span>
                    </div>
                  </div>
                </div>

                <div className="pt-5 border-t border-border mt-4 space-y-2.5">
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    onClick={() => handleApprove(featuredProp)}
                  >
                    {approvingId === featuredProp.id ? 'Publishing…' : 'Approve and publish'}
                  </Button>
                  <Link to={`/property/${featuredProp.id}`} className="block">
                    <Button variant="secondary" size="md" fullWidth>
                      Inspect evidence first
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Rest of Queue (Ready for Review) ─────────────────────── */}
        {restProps.length > 0 && filter === 'Ready for review' && (
          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-2 pb-3">
              ALSO READY / {restProps.length}
            </h2>
            <div className="space-y-2.5">
              {restProps.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border bg-surface px-4 py-3.5 shadow-subtle hover:border-line-strong transition-all"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={getPropertyImage(p)}
                      alt={p.title}
                      className="h-12 w-[68px] rounded-lg object-cover border border-border shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="font-bold text-ink text-[13.5px] truncate">{p.title}</h3>
                      <p className="text-xs text-ink-2 truncate mt-0.5">
                        {p.address} · {p.price} · {p.spaces.length} rooms verified
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                    <Link to={`/property/${p.id}`}>
                      <Button variant="ghost" size="sm">Inspect</Button>
                    </Link>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApprove(p)}
                    >
                      {approvingId === p.id ? 'Publishing…' : 'Approve'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Published / Live Properties ───────────────────────────── */}
        {filter === 'Published' && filteredList.length > 0 && (
          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-2 pb-4">
              LIVE / {filteredList.length} PROPERTIES
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredList.map((p) => (
                <div
                  key={p.id}
                  className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-subtle hover:shadow-card hover:border-line-strong transition-all duration-200"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-sidebar">
                    <img
                      src={getPropertyImage(p)}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-sm px-2.5 py-1 text-[10.5px] font-bold text-white">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Live 24/7
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between rounded-lg bg-black/65 backdrop-blur-md px-3 py-1.5 text-white">
                      <span className="text-xs font-bold truncate">{p.price}</span>
                      <span className="text-[11px] text-white/75">{p.bedrooms} bed</span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-4 bg-surface">
                    <div>
                      <h3 className="text-[13.5px] font-bold text-ink line-clamp-1">{p.title}</h3>
                      <p className="text-xs text-ink-2 mt-0.5 line-clamp-1">{p.address}</p>
                    </div>

                    <div className="flex items-center gap-2 pt-3.5 mt-3 border-t border-border/60">
                      <Link to={`/view/${p.id}`} className="flex-1">
                        <Button variant="secondary" size="sm" fullWidth>
                          Explore 3D ↗
                        </Button>
                      </Link>
                      <Link to={`/property/${p.id}`}>
                        <Button variant="ghost" size="sm">Details</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </WorkspaceShell>
  )
}
