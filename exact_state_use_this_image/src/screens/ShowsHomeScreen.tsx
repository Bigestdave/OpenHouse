import { useState } from 'react'
import { Link } from 'react-router-dom'
import { WorkspaceShell, NotificationButton } from '../components/WorkspaceShell'
import { useStore, usePropertyStats } from '../data/store'
import { Button, Badge } from '../components/ui'
import { SearchIcon, ClockIcon, MapPinIcon, PhoneIcon } from '../components/icons2'
import { Ellipsis, CheckCircle, ShareIcon } from '../components/icons'
import type { Property } from '../data/types'

const filterOptions = ['All', 'Needs attention', 'Preparing', 'Ready for review', 'Live'] as const
type FilterType = (typeof filterOptions)[number]

export function ShowsHomeScreen() {
  const store = useStore()
  const stats = usePropertyStats()
  const [filter, setFilter] = useState<FilterType>('All')
  const [query, setQuery] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const properties = store.properties || []
  const workspace = store.workspace
  const userName = workspace?.ownerName?.split(' ')[0] || 'Kiki'

  // Partition properties by state
  const needsAttentionProp = properties.find(
    (p) => p.status === 'needs_recapture' || p.spaces.some((s) => !s.captured)
  )

  const inProgressProps = properties.filter(
    (p) => p.status === 'preparing' || p.status === 'checking_media' || p.status === 'quality_check' || p.status === 'detected'
  )

  const readyForReviewProps = properties.filter((p) => p.status === 'ready_for_review')

  const liveProps = properties.filter((p) => p.status === 'live')

  const handleCopyLink = (p: Property) => {
    const url = `${window.location.origin}/#/view/${p.id}`
    navigator.clipboard.writeText(url)
    setCopiedId(p.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleWhatsAppShare = (p: Property) => {
    const url = `${window.location.origin}/#/view/${p.id}`
    const text = `Explore ${p.title} (${p.price}) in interactive 3D: ${url}`
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <WorkspaceShell>
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-10 py-6 lg:py-8 font-sans text-ink">
        
        {/* Top Attention Inbox Greeting */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <h1 className="text-[26px] sm:text-[30px] font-extrabold tracking-tight text-ink leading-tight">
              Good morning, {userName}.
            </h1>
            <p className="text-[14px] text-ink-2 mt-1">
              <span className="font-semibold text-primary">{stats.live} listings</span> are live ·{' '}
              <span className="font-semibold text-ink">{stats.preparing}</span> in preparation ·{' '}
              {stats.needsAttention > 0 ? (
                <span className="font-semibold text-accent">{stats.needsAttention} listing needs your attention</span>
              ) : (
                <span className="text-ink-3">All captures up to date</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex w-full sm:w-[260px] md:w-[280px] items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-ink shadow-subtle focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all">
              <SearchIcon size={15} className="text-ink-3 shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search listings..."
                className="w-full bg-transparent text-ink placeholder:text-ink-3 outline-none text-xs sm:text-sm"
              />
            </div>
            <NotificationButton />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 py-5 overflow-x-auto">
          {filterOptions.map((f) => (
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
              {f === 'Needs attention' && stats.needsAttention > 0 && (
                <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] text-white">
                  {stats.needsAttention}
                </span>
              )}
              {f === 'Ready for review' && stats.readyForReview > 0 && (
                <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                  {stats.readyForReview}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* SECTION 1: NEEDS YOU (High Priority Action Card) */}
        {(filter === 'All' || filter === 'Needs attention') && needsAttentionProp && (
          <section className="mb-8">
            <div className="flex items-center justify-between pb-2.5">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
                <h2 className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-accent">
                  NEEDS YOU / 1 ACTION REQUIRED
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] overflow-hidden rounded-2xl border-2 border-accent/40 bg-surface shadow-md">
              <div className="relative aspect-[16/9] lg:aspect-auto lg:h-[280px] w-full overflow-hidden bg-sidebar">
                <img
                  src={needsAttentionProp.coverImage || '/src/assets/prop-hero-waterfront.jpg'}
                  alt={needsAttentionProp.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-3 left-3 rounded-lg bg-black/75 backdrop-blur-md px-3.5 py-2 text-white border border-white/10 shadow-lg">
                  <p className="text-sm font-bold leading-tight">{needsAttentionProp.title}</p>
                  <p className="text-xs text-white/80 font-normal">{needsAttentionProp.address}</p>
                </div>
              </div>

              <div className="flex flex-col justify-between p-6 sm:p-7 bg-surface">
                <div>
                  <div className="flex items-center gap-2 pb-2">
                    <Badge variant="accent">Missing Scene Coverage</Badge>
                    <span className="text-xs text-ink-3">Estimated ~1 min</span>
                  </div>

                  <h3 className="text-[20px] font-bold tracking-tight text-ink leading-snug">
                    One balcony capture is missing
                  </h3>
                  <p className="pt-1.5 text-xs sm:text-sm text-ink-2 leading-relaxed">
                    OpenHouse collected the 3-bedroom listing, but the balcony entrance was not clearly captured in the initial footage.
                  </p>
                </div>

                <div className="py-3">
                  <div className="flex items-center justify-between text-xs text-ink-2 pb-1.5">
                    <span>Coverage progress</span>
                    <span className="font-semibold text-ink">6 of 7 spaces verified</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5">
                    <div className="h-2 rounded-full bg-primary" />
                    <div className="h-2 rounded-full bg-primary" />
                    <div className="h-2 rounded-full bg-primary" />
                    <div className="h-2 rounded-full bg-primary" />
                    <div className="h-2 rounded-full bg-primary" />
                    <div className="h-2 rounded-full bg-primary" />
                    <div className="h-2 rounded-full bg-accent animate-pulse" />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Link to={`/capture/${needsAttentionProp.id}`}>
                    <Button variant="primary" size="md">
                      Record now (15s)
                    </Button>
                  </Link>
                  <Link to={`/property/${needsAttentionProp.id}`}>
                    <Button variant="secondary" size="md">
                      See why
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 2: WORKING IN THE BACKGROUND */}
        {(filter === 'All' || filter === 'Preparing') && inProgressProps.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 pb-3">
              <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
              <h2 className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-ink-2">
                WORKING IN THE BACKGROUND / {inProgressProps.length}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {inProgressProps.map((p) => {
                const isReconstructing = p.status === 'preparing'
                const isChecking = p.status === 'quality_check' || p.status === 'checking_media'
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-xl border border-border bg-surface p-4 shadow-subtle hover:border-line-strong transition-all"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={p.coverImage || '/src/assets/prop-orchid.jpg'}
                        alt={p.title}
                        className="h-12 w-16 rounded-lg object-cover border border-border shrink-0"
                      />
                      <div className="min-w-0">
                        <Link to={`/property/${p.id}`} className="hover:underline">
                          <h3 className="text-sm font-bold text-ink truncate">{p.title}</h3>
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                          <span className="text-xs text-ink-2 font-medium">
                            {isReconstructing
                              ? 'Building interactive tour'
                              : isChecking
                              ? 'Checking the finished experience'
                              : 'Property detected'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-xs text-ink-2 hidden sm:inline-block font-medium">
                        Expected in 18–25 minutes
                      </span>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-dashed border-primary border-t-transparent" />
                      <Link to={`/property/${p.id}`}>
                        <Button variant="ghost" size="sm">
                          Details →
                        </Button>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* SECTION 3: READY FOR REVIEW */}
        {(filter === 'All' || filter === 'Ready for review') && readyForReviewProps.length > 0 && (
          <section className="mb-8">
            <h2 className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-ink-2 pb-3">
              READY FOR REVIEW / {readyForReviewProps.length}
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {readyForReviewProps.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border-2 border-primary/30 bg-surface p-4 shadow-subtle hover:border-primary transition-all"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={p.coverImage || '/src/assets/prop-lekkigardens.jpg'}
                      alt={p.title}
                      className="h-14 w-20 rounded-lg object-cover border border-border shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-ink truncate">{p.title}</h3>
                      <p className="text-xs text-ink-2 mt-0.5">
                        {p.spaces.length} of {p.spaces.length} rooms ready · Verification passed
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                    <Link to={`/property/${p.id}`}>
                      <Button variant="secondary" size="md">
                        Inspect
                      </Button>
                    </Link>
                    <Link to="/approvals">
                      <Button variant="primary" size="md">
                        Review and publish
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 4: LIVE PROPERTIES */}
        {(filter === 'All' || filter === 'Live') && (
          <section className="mb-8">
            <div className="flex items-center justify-between pb-3">
              <h2 className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-ink-2">
                LIVE / {liveProps.length} PROPERTIES
              </h2>
            </div>

            {liveProps.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-surface p-8 text-center">
                <p className="text-sm text-ink-2">No properties currently live.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {liveProps.map((p) => (
                  <div
                    key={p.id}
                    className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-subtle hover:shadow-card hover:border-line-strong transition-all duration-200"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-sidebar">
                      <img
                        src={p.coverImage || '/src/assets/prop-bourdillon.jpg'}
                        alt={p.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <Badge variant="success">● Live 24/7</Badge>
                      </div>
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between rounded-lg bg-black/70 backdrop-blur-md px-3 py-1.5 text-white">
                        <span className="text-xs font-bold truncate">{p.price}</span>
                        <span className="text-[11px] text-white/80 font-normal">{p.bedrooms} Beds</span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-4 bg-surface">
                      <div>
                        <h3 className="text-sm font-bold text-ink line-clamp-1">{p.title}</h3>
                        <p className="text-xs text-ink-2 line-clamp-1 mt-0.5">{p.address}</p>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-4 mt-2 border-t border-border/60">
                        <Link to={`/view/${p.id}`} target="_blank" className="flex-1">
                          <Button variant="secondary" size="sm" fullWidth>
                            Explore 3D ↗
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleWhatsAppShare(p)}
                          title="Share via WhatsApp"
                        >
                          WhatsApp
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyLink(p)}
                          title="Copy Public Link"
                        >
                          {copiedId === p.id ? 'Copied!' : 'Link'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

      </div>
    </WorkspaceShell>
  )
}
