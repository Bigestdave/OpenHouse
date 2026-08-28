import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { WorkspaceShell } from '../components/WorkspaceShell'
import { useStore } from '../data/store'
import { approveProperty } from '../data/workflow'
import { Button, Badge } from '../components/ui'
import { SearchIcon } from '../components/icons2'
import type { Property } from '../data/types'

const filterTabs = ['Ready for review', 'Published'] as const
type FilterTab = (typeof filterTabs)[number]

export function ApprovalsScreen() {
  const store = useStore()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<FilterTab>('Ready for review')
  const [query, setQuery] = useState('')

  const readyProps = store.properties.filter(
    (p) => p.status === 'ready_for_review' || p.status === 'preparing'
  )
  const publishedProps = store.properties.filter((p) => p.status === 'live')

  const activeList = filter === 'Ready for review' ? readyProps : publishedProps
  const featuredProp = activeList[0] || store.properties[0]

  const handleApprove = (prop: Property) => {
    approveProperty(prop.id)
    navigate(`/experience/${prop.id}/published`)
  }

  return (
    <WorkspaceShell>
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-10 py-6 lg:py-8 font-sans text-ink space-y-6">
        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <h1 className="text-[26px] sm:text-[30px] font-extrabold tracking-tight text-ink leading-tight">
              Tour Review & Approval
            </h1>
            <p className="text-sm text-ink-2 mt-0.5">
              Inspect completed 3D experiences before publishing to listings.
            </p>
          </div>

          <div className="flex w-full sm:w-[280px] items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-ink shadow-subtle focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all">
            <SearchIcon size={15} className="text-ink-3 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search properties..."
              className="w-full bg-transparent text-ink placeholder:text-ink-3 outline-none text-xs sm:text-sm"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 pb-1 overflow-x-auto">
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
              {f} ({f === 'Ready for review' ? readyProps.length : publishedProps.length})
            </button>
          ))}
        </div>

        {/* Featured Approval Split Card */}
        {featuredProp && (
          <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] overflow-hidden rounded-2xl border-2 border-primary/30 bg-surface shadow-md">
            <div className="relative aspect-[16/10] lg:aspect-auto lg:h-[340px] overflow-hidden bg-sidebar">
              <img
                src={featuredProp.coverImage || '/src/assets/prop-admiralty.jpg'}
                alt={featuredProp.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <Badge variant={featuredProp.status === 'live' ? 'success' : 'info'}>
                  {featuredProp.status === 'live' ? '● Live' : '● Ready to Publish'}
                </Badge>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-black/70 backdrop-blur-md p-3 text-white">
                <div>
                  <p className="text-xs font-bold">{featuredProp.title}</p>
                  <p className="text-[11px] text-white/80">{featuredProp.address}</p>
                </div>
                <Link
                  to={`/view/${featuredProp.id}`}
                  target="_blank"
                  className="rounded-lg bg-white/20 px-3 py-1 text-xs font-semibold hover:bg-white/30 transition-all"
                >
                  Interactive Walkthrough ↗
                </Link>
              </div>
            </div>

            <div className="p-6 lg:p-7 flex flex-col justify-between bg-surface">
              <div>
                <h2 className="text-[20px] sm:text-[22px] font-bold tracking-tight text-ink leading-snug">
                  {featuredProp.title}
                </h2>
                <p className="text-xs text-ink-2 mt-0.5 truncate">
                  {featuredProp.price} · {featuredProp.bedrooms} Beds / {featuredProp.bathrooms} Baths
                </p>

                {/* What we verified */}
                <div className="space-y-2 pt-4 text-xs">
                  <div className="flex items-center gap-2 text-ink">
                    <span className="text-primary font-bold">✓</span>
                    <span>{featuredProp.spaces.length} of {featuredProp.spaces.length} advertised rooms represented</span>
                  </div>
                  <div className="flex items-center gap-2 text-ink">
                    <span className="text-primary font-bold">✓</span>
                    <span>Doorway and room transitions verified</span>
                  </div>
                  <div className="flex items-center gap-2 text-ink">
                    <span className="text-primary font-bold">✓</span>
                    <span>No people or private documents visible</span>
                  </div>
                  <div className="flex items-center gap-2 text-ink-2">
                    <span className="text-accent font-bold">!</span>
                    <span>Unscaled measurements flagged to protect visitor trust</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border mt-4 flex flex-col sm:flex-row items-center gap-3">
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => handleApprove(featuredProp)}
                >
                  Approve and publish (1-click)
                </Button>
                <Link to={`/property/${featuredProp.id}`} className="w-full sm:w-auto">
                  <Button variant="secondary" size="md" fullWidth>
                    Inspect evidence
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Other Ready Properties List */}
        <div className="space-y-3 pt-2">
          {activeList.map((p) => (
            <div
              key={p.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border bg-surface p-4 shadow-subtle hover:border-line-strong transition-all"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={p.coverImage || '/src/assets/prop-lekkigardens.jpg'}
                  alt={p.title}
                  className="h-12 w-16 rounded-lg object-cover border border-border shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="font-bold text-ink text-sm truncate">{p.title}</h3>
                  <p className="text-xs text-ink-2 truncate mt-0.5">{p.address} · {p.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 self-end sm:self-center">
                <Badge variant={p.status === 'live' ? 'success' : 'info'}>
                  {p.status === 'live' ? 'Published' : 'Ready for review'}
                </Badge>
                {p.status !== 'live' ? (
                  <Button variant="primary" size="sm" onClick={() => handleApprove(p)}>
                    Approve
                  </Button>
                ) : (
                  <Link to={`/view/${p.id}`} target="_blank">
                    <Button variant="secondary" size="sm">
                      Open ↗
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </WorkspaceShell>
  )
}
