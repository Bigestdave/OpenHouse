import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { WorkspaceShell, NotificationButton } from '../components/WorkspaceShell'
import { Thumb } from '../components/ShotStrip'
import { Ellipsis } from '../components/icons'
import { SearchIcon, ClockIcon, PhoneIcon } from '../components/icons2'
import { getShows, deleteShow, listProductions, type Show, type ProductionListItem } from '../data/api'
import { showBanner, usePoster } from '../data/artwork'
import { SkeletonShowCard } from '../components/Skeleton'

function ShowCardArt({ showId, title, thumbId }: { showId: string; title: string; thumbId: string }) {
  const poster = usePoster(showId, title)
  return poster ? (
    <img
      src={poster}
      alt={title}
      className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
    />
  ) : (
    <Thumb shotId={thumbId} className="aspect-[16/10] w-full rounded-none" />
  )
}

const filterOptions = ['All', 'Preparing', 'Needs attention', 'Ready', 'Live'] as const
type FilterType = (typeof filterOptions)[number]

export function ShowsHomeScreen() {
  const [filter, setFilter] = useState<FilterType>('All')
  const [shows, setShows] = useState<Show[]>([])
  const [, setProductions] = useState<ProductionListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [menuFor, setMenuFor] = useState<string | null>(null)
  const [, setDeleting] = useState<string | null>(null)

  // Close card menu on outside click
  useEffect(() => {
    if (!menuFor) return
    const close = () => setMenuFor(null)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [menuFor])

  const handleDeleteShow = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"?`)) return
    setDeleting(id)
    try {
      await deleteShow(id)
      setShows((prev) => prev.filter((s) => s.id !== id))
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(null)
    }
  }

  useEffect(() => {
    Promise.all([getShows(), listProductions().catch(() => [])])
      .then(([showData, prodData]) => {
        setShows(showData)
        setProductions(prodData as ProductionListItem[])
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const defaultShows: Show[] = [
    {
      id: 'orchid-1',
      title: 'Orchid Apartments',
      premise: '2-bedroom apartment · Lekki, Lagos',
      status: 'Preparing experience',
      default_duration_seconds: 60,
      default_aspect_ratio: '16:9',
      current_continuity_version: 1,
      episode_count: 1,
    },
    {
      id: 'lekki-1',
      title: 'Lekki Gardens',
      premise: '3-bedroom terrace · Lekki, Lagos',
      status: 'Ready for review',
      default_duration_seconds: 60,
      default_aspect_ratio: '16:9',
      current_continuity_version: 1,
      episode_count: 1,
    },
    {
      id: 'bourdillon-1',
      title: 'Bourdillon Court',
      premise: '4-bedroom apartment · Ikoyi, Lagos',
      status: 'Live',
      default_duration_seconds: 60,
      default_aspect_ratio: '16:9',
      current_continuity_version: 1,
      episode_count: 1,
    },
  ]

  const displayShows = shows.length > 0 ? shows : defaultShows

  const visibleShows = displayShows.filter((s) => {
    if (query && !s.title.toLowerCase().includes(query.toLowerCase()) && !s.premise?.toLowerCase().includes(query.toLowerCase())) {
      return false
    }
    if (filter === 'All') return true
    if (filter === 'Preparing') return s.status?.toLowerCase().includes('prepar') || s.status?.toLowerCase().includes('build')
    if (filter === 'Needs attention') return s.id.includes('admiralty') || s.status?.toLowerCase().includes('attention')
    if (filter === 'Ready') return s.status?.toLowerCase().includes('ready') || s.status?.toLowerCase().includes('review')
    if (filter === 'Live') return s.status?.toLowerCase().includes('live') || s.status?.toLowerCase().includes('publish')
    return true
  })

  return (
    <WorkspaceShell>
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10 xl:px-12 py-6 lg:py-8">
        {/* Header and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5">
          <div className="min-w-0">
            <h1 className="text-[28px] sm:text-[32px] lg:text-[34px] font-extrabold tracking-tight text-text-primary leading-tight">
              Properties
            </h1>
            <p className="text-[14px] text-text-secondary font-normal mt-0.5 whitespace-nowrap">
              Manage every open house from one place.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex w-full sm:w-[260px] md:w-[300px] lg:w-[320px] items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-[13.5px] text-text-primary transition-all duration-150 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 shadow-subtle">
              <SearchIcon size={15} className="text-text-secondary shrink-0" />
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
        <div className="flex items-center gap-2 pb-6 overflow-x-auto">
          {filterOptions.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3.5 py-1 text-[13px] font-semibold transition-all duration-150 whitespace-nowrap shrink-0 ${
                filter === f
                  ? 'bg-primary text-text-inverse shadow-subtle'
                  : 'border border-border bg-surface text-text-primary hover:bg-surface-elevated'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Needs Attention Hero Card */}
        {(filter === 'All' || filter === 'Needs attention') && (
          <div className="mb-8">
            <p className="text-[11px] font-bold tracking-[0.12em] text-text-secondary uppercase mb-2.5">
              NEEDS YOUR ATTENTION / 1
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] xl:grid-cols-[1.35fr_1fr] overflow-hidden rounded-2xl border border-border bg-surface shadow-subtle">
              <div className="relative aspect-[16/9] lg:aspect-auto lg:h-[300px] w-full overflow-hidden bg-sidebar">
                <img
                  src={showBanner('8 Admiralty Way') || '/src/assets/prop-hero-waterfront.jpg'}
                  alt="8 Admiralty Way"
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-3 left-3 rounded-lg bg-black/65 backdrop-blur-md px-3 py-1.5 text-white border border-white/10 shadow-lg whitespace-nowrap">
                  <p className="text-[13.5px] font-bold leading-tight">8 Admiralty Way</p>
                  <p className="text-[11.5px] text-white/80 font-normal">Lekki, Lagos</p>
                </div>
              </div>

              <div className="flex flex-col justify-between p-5 lg:p-6 xl:p-7 bg-surface">
                <div>
                  <div className="flex items-center gap-1.5 pb-1.5">
                    <span className="h-2 w-2 rounded-full bg-accent shrink-0" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-accent whitespace-nowrap">
                      CAPTURE NEEDED
                    </span>
                  </div>

                  <h2 className="text-[19px] sm:text-[21px] xl:text-[22px] font-bold tracking-tight text-text-primary leading-snug">
                    One balcony connection is missing.
                  </h2>
                  <p className="pt-1.5 text-[13.5px] text-text-secondary font-normal leading-relaxed">
                    OpenHouse needs a slow 15-second capture from the living room through the balcony doorway.
                  </p>
                </div>

                <div className="py-3">
                  <div className="flex flex-col gap-1.5 text-[12.5px] text-text-secondary">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <ClockIcon size={14} className="text-text-secondary shrink-0" />
                      <span>Estimated time · 1 minute</span>
                    </div>
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <PhoneIcon size={14} className="text-text-secondary shrink-0" />
                      <span>6 of 7 spaces sufficiently captured</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 pt-3">
                    <div className="h-1.5 rounded-full bg-primary" />
                    <div className="h-1.5 rounded-full bg-primary" />
                    <div className="h-1.5 rounded-full bg-primary" />
                    <div className="h-1.5 rounded-full bg-primary" />
                    <div className="h-1.5 rounded-full bg-primary" />
                    <div className="h-1.5 rounded-full bg-primary" />
                    <div className="h-1.5 rounded-full bg-accent animate-pulse" />
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-1">
                  <Link
                    to="/capture-requests/1"
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-[13.5px] font-semibold text-text-inverse shadow-subtle hover:bg-primary-hover transition-colors whitespace-nowrap"
                  >
                    Record now
                  </Link>
                  <Link
                    to="/show/8-admiralty-way"
                    className="inline-flex items-center justify-center rounded-lg border border-border bg-surface px-4 py-2 text-[13.5px] font-semibold text-text-primary shadow-subtle hover:bg-surface-elevated transition-colors whitespace-nowrap"
                  >
                    See why
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* In Progress Queue */}
        {(filter === 'All' || filter === 'Preparing') && (
          <div className="mb-8">
            <p className="text-[11px] font-bold tracking-[0.12em] text-text-secondary uppercase mb-2.5">
              IN PROGRESS / 2
            </p>

            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-3.5 shadow-subtle hover:border-line-strong transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src="/src/assets/prop-orchid.jpg"
                    alt="Orchid Apartments"
                    className="h-11 w-14 rounded-lg object-cover border border-border shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="text-[14.5px] font-bold text-text-primary truncate">Orchid Apartments, Unit 4</h3>
                    <div className="flex items-center gap-1.5 mt-0.5 whitespace-nowrap">
                      <span className="h-2 w-2 rounded-full bg-success shrink-0" />
                      <span className="text-[12.5px] text-text-secondary">Building experience</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-[13px] text-text-secondary hidden sm:inline-block whitespace-nowrap">
                    Expected in 18–25 minutes
                  </span>
                  <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-dashed border-success border-t-transparent" />
                  <button className="text-text-secondary hover:text-text-primary p-1">
                    <Ellipsis size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-3.5 shadow-subtle hover:border-line-strong transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src="/src/assets/prop-lekkigardens.jpg"
                    alt="Lekki Gardens"
                    className="h-11 w-14 rounded-lg object-cover border border-border shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="text-[14.5px] font-bold text-text-primary truncate">Lekki Gardens, Unit 12</h3>
                    <div className="flex items-center gap-1.5 mt-0.5 whitespace-nowrap">
                      <span className="h-2 w-2 rounded-full bg-success shrink-0" />
                      <span className="text-[12.5px] text-text-secondary">Running final checks</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-dashed border-success border-t-transparent" />
                  <button className="text-text-secondary hover:text-text-primary p-1">
                    <Ellipsis size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Your Properties Grid */}
        <div>
          <p className="text-[11px] font-bold tracking-[0.12em] text-text-secondary uppercase mb-3">
            YOUR PROPERTIES
          </p>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              <SkeletonShowCard />
              <SkeletonShowCard />
              <SkeletonShowCard />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {visibleShows.map((show, idx) => (
                <div
                  key={show.id}
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-subtle transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card hover:border-line-strong"
                >
                  <Link to={`/show/${show.id}`} className="block relative overflow-hidden bg-sidebar">
                    <ShowCardArt showId={show.id} title={show.title} thumbId={`S0${(idx % 6) + 1}`} />
                  </Link>

                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link to={`/show/${show.id}`} className="group-hover:text-accent transition-colors min-w-0">
                          <h3 className="text-[16px] font-bold tracking-tight text-text-primary truncate">{show.title}</h3>
                        </Link>
                        <div className="relative shrink-0">
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setMenuFor(menuFor === show.id ? null : show.id)
                            }}
                            className="text-text-secondary hover:text-text-primary p-1 rounded-md hover:bg-surface-elevated"
                          >
                            <Ellipsis size={15} />
                          </button>
                          {menuFor === show.id && (
                            <div className="absolute right-0 top-full mt-1 w-40 rounded-xl border border-border bg-surface py-1.5 shadow-overlay z-30">
                              <Link
                                to={`/show/${show.id}`}
                                className="block px-3.5 py-1.5 text-[13px] font-medium text-text-primary hover:bg-surface-elevated"
                              >
                                View property
                              </Link>
                              <Link
                                to={`/new-episode?showId=${show.id}`}
                                className="block px-3.5 py-1.5 text-[13px] font-medium text-text-primary hover:bg-surface-elevated"
                              >
                                New experience
                              </Link>
                              <button
                                onClick={() => handleDeleteShow(show.id, show.title)}
                                className="w-full text-left px-3.5 py-1.5 text-[13px] font-medium text-danger hover:bg-danger/10"
                              >
                                Delete property
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-[13px] text-text-secondary mt-0.5 truncate">{show.premise || 'Apartment · Lagos'}</p>
                    </div>

                    <div className="mt-3.5 pt-2.5 border-t border-border/60 flex items-center justify-between text-[12px] text-text-secondary gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className={`h-2 w-2 rounded-full shrink-0 ${
                            show.status === 'Live'
                              ? 'bg-success'
                              : show.status === 'Ready for review'
                              ? 'bg-info'
                              : 'bg-accent'
                          }`}
                        />
                        <span className="font-semibold text-text-primary truncate whitespace-nowrap">{show.status || 'Preparing experience'}</span>
                      </div>
                      <span className="shrink-0 whitespace-nowrap">Updated 4m ago</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </WorkspaceShell>
  )
}
