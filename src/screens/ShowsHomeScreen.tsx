import { useState } from 'react'
import { Link } from 'react-router-dom'
import { WorkspaceShell } from '../components/WorkspaceShell'
import { SearchIcon, ClockIcon, CameraIcon } from '../components/icons2'
import { Ellipsis } from '../components/icons'
import propOrchidImg from '../assets/prop-orchid.jpg'
import propLekkiImg from '../assets/prop-lekkigardens.jpg'
import propBourdillonImg from '../assets/prop-bourdillon.jpg'
import demoLiving from '../assets/demo-living-room.jpg'

const filterOptions = ['All', 'Preparing', 'Needs attention', 'Ready', 'Live'] as const
type FilterType = (typeof filterOptions)[number]

export function ShowsHomeScreen() {
  const [filter, setFilter] = useState<FilterType>('All')
  const [query, setQuery] = useState('')
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)

  return (
    <WorkspaceShell>
      <div className="mx-auto max-w-[1360px] px-6 sm:px-8 lg:px-10 py-7 font-sans text-ink">
        
        {/* Header with Title & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
          <div>
            <h1 className="text-[26px] sm:text-[28px] font-extrabold tracking-tight text-ink leading-tight">
              Properties
            </h1>
            <p className="text-[14px] text-ink-2 mt-0.5">
              Manage every open house from one place.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex w-full sm:w-[280px] items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-ink shadow-subtle focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all">
              <SearchIcon size={16} className="text-ink-3 shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search properties..."
                className="w-full bg-transparent text-ink placeholder:text-ink-3 outline-none text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 pb-7 overflow-x-auto">
          {filterOptions.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-4 py-1.5 text-[13px] font-semibold transition-all whitespace-nowrap shrink-0 ${
                filter === f
                  ? 'bg-[#17231E] text-white shadow-subtle'
                  : 'border border-border bg-surface text-ink hover:bg-raised-2'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* SECTION 1: NEEDS YOUR ATTENTION / 1 */}
        {/* ========================================================================= */}
        {(filter === 'All' || filter === 'Needs attention') && (
          <section className="mb-9">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-2 pb-3">
              NEEDS YOUR ATTENTION / 1
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
              {/* Left Photo */}
              <div className="relative aspect-[16/10] lg:aspect-auto lg:col-span-6 min-h-[260px] overflow-hidden bg-sidebar">
                <img
                  src={demoLiving}
                  alt="72691 Homestead Road, Palm Desert"
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-3.5 left-3.5 rounded-lg bg-black/75 backdrop-blur-md px-3.5 py-2 text-white border border-white/10 shadow-lg">
                  <p className="text-[13.5px] font-bold leading-tight">72691 Homestead Road</p>
                  <p className="text-[11.5px] text-white/80 font-normal mt-0.5">Palm Desert, CA 92260</p>
                </div>
              </div>

              {/* Right Content */}
              <div className="flex flex-col justify-between p-6 sm:p-7 lg:col-span-6 bg-surface">
                <div>
                  <div className="flex items-center gap-2 pb-2">
                    <span className="h-2 w-2 rounded-full bg-[#D97945]" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#D97945]">
                      CAPTURE NEEDED · GEMINI SPATIAL CHECK
                    </span>
                  </div>

                  <h3 className="text-[21px] font-bold tracking-tight text-ink leading-snug">
                    Pool-to-guest house connection missing.
                  </h3>
                  <p className="pt-2 text-[13.5px] text-ink-2 leading-relaxed">
                    OpenHouse detected an unbridged outdoor path. A 15-second mobile capture from main patio to the detached guest house is required.
                  </p>
                </div>

                <div className="py-4">
                  <div className="flex items-center gap-5 text-[12.5px] text-ink-2 pb-2.5">
                    <div className="flex items-center gap-1.5">
                      <ClockIcon size={14} className="text-ink-3" />
                      <span>Estimated time · <strong className="font-semibold text-ink">15 seconds</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CameraIcon size={14} className="text-ink-3" />
                      <span>6 of 7 spaces captured</span>
                    </div>
                  </div>

                  {/* 7 Segmented Bars: 6 Black, 1 Orange */}
                  <div className="grid grid-cols-7 gap-1.5">
                    <div className="h-1.5 rounded-full bg-[#17231E]" />
                    <div className="h-1.5 rounded-full bg-[#17231E]" />
                    <div className="h-1.5 rounded-full bg-[#17231E]" />
                    <div className="h-1.5 rounded-full bg-[#17231E]" />
                    <div className="h-1.5 rounded-full bg-[#17231E]" />
                    <div className="h-1.5 rounded-full bg-[#17231E]" />
                    <div className="h-1.5 rounded-full bg-[#D97945]" />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Link
                    to="/capture/homestead-pool"
                    className="rounded-lg bg-[#17231E] hover:bg-black px-5 py-2.5 text-[13.5px] font-bold text-white shadow-subtle transition-colors"
                  >
                    Record now
                  </Link>
                  <Link
                    to="/property/homestead-pd"
                    className="rounded-lg border border-border bg-surface hover:bg-raised-2 px-5 py-2.5 text-[13.5px] font-semibold text-ink transition-colors"
                  >
                    See why
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 2: IN PROGRESS / 2 */}
        {/* ========================================================================= */}
        {(filter === 'All' || filter === 'Preparing') && (
          <section className="mb-9">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-2 pb-3">
              IN PROGRESS / 2
            </h2>

            <div className="space-y-2.5">
              {/* Row 1: Orchid Apartments */}
              <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3.5 shadow-subtle hover:border-line-strong transition-all">
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={propOrchidImg}
                    alt="Orchid Apartments"
                    className="h-11 w-16 rounded-lg object-cover border border-border shrink-0"
                  />
                  <div className="flex items-center gap-3 flex-wrap">
                    <Link to="/property/prop-02" className="text-[14px] font-bold text-ink hover:underline">
                      Orchid Apartments, Unit 4
                    </Link>
                    <div className="flex items-center gap-1.5 text-xs text-ink-2">
                      <span className="h-2 w-2 rounded-full bg-[#194534]" />
                      <span>Building experience</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-[13px] text-ink-2 hidden sm:inline-block">
                    Expected in 18–25 minutes
                  </span>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-dashed border-[#194534] border-t-transparent" />
                  <button
                    onClick={() => setActiveMenuId(activeMenuId === 'prop-02' ? null : 'prop-02')}
                    className="text-ink-3 hover:text-ink p-1"
                  >
                    <Ellipsis size={16} />
                  </button>
                </div>
              </div>

              {/* Row 2: Lekki Gardens */}
              <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3.5 shadow-subtle hover:border-line-strong transition-all">
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={propLekkiImg}
                    alt="Lekki Gardens"
                    className="h-11 w-16 rounded-lg object-cover border border-border shrink-0"
                  />
                  <div className="flex items-center gap-3 flex-wrap">
                    <Link to="/property/prop-03" className="text-[14px] font-bold text-ink hover:underline">
                      Lekki Gardens, Unit 12
                    </Link>
                    <div className="flex items-center gap-1.5 text-xs text-ink-2">
                      <span className="h-2 w-2 rounded-full bg-[#194534]" />
                      <span>Running final checks</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-dashed border-[#194534] border-t-transparent" />
                  <button
                    onClick={() => setActiveMenuId(activeMenuId === 'prop-03' ? null : 'prop-03')}
                    className="text-ink-3 hover:text-ink p-1"
                  >
                    <Ellipsis size={16} />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 3: YOUR PROPERTIES */}
        {/* ========================================================================= */}
        <section className="mb-9">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-2 pb-3">
            YOUR PROPERTIES
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Card 1: Orchid Apartments */}
            <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-subtle hover:shadow-card hover:border-line-strong transition-all">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-sidebar">
                <img
                  src={propOrchidImg}
                  alt="Orchid Apartments"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between p-4 bg-surface">
                <div>
                  <Link to="/property/prop-02" className="text-[14.5px] font-bold text-ink hover:underline block">
                    Orchid Apartments
                  </Link>
                  <p className="text-[12.5px] text-ink-2 mt-0.5">2-bedroom apartment</p>
                  
                  <div className="flex items-center gap-1.5 text-xs text-ink-2 mt-2">
                    <span className="h-2 w-2 rounded-full bg-[#194534]" />
                    <span>Preparing experience</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-2 border-t border-border/60 text-[12px] text-ink-3">
                  <span>Updated 4 minutes ago</span>
                  <button className="text-ink-3 hover:text-ink">
                    <Ellipsis size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Lekki Gardens */}
            <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-subtle hover:shadow-card hover:border-line-strong transition-all">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-sidebar">
                <img
                  src={propLekkiImg}
                  alt="Lekki Gardens"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between p-4 bg-surface">
                <div>
                  <Link to="/property/prop-03" className="text-[14.5px] font-bold text-ink hover:underline block">
                    Lekki Gardens
                  </Link>
                  <p className="text-[12.5px] text-ink-2 mt-0.5">3-bedroom terrace</p>
                  
                  <div className="flex items-center gap-1.5 text-xs text-ink-2 mt-2">
                    <span className="h-2 w-2 rounded-full bg-[#194534]" />
                    <span>Ready for review</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-2 border-t border-border/60 text-[12px] text-ink-3">
                  <span>Updated 18 minutes ago</span>
                  <button className="text-ink-3 hover:text-ink">
                    <Ellipsis size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3: Bourdillon Court */}
            <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-subtle hover:shadow-card hover:border-line-strong transition-all">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-sidebar">
                <img
                  src={propBourdillonImg}
                  alt="Bourdillon Court"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between p-4 bg-surface">
                <div>
                  <Link to="/property/prop-04" className="text-[14.5px] font-bold text-ink hover:underline block">
                    Bourdillon Court
                  </Link>
                  <p className="text-[12.5px] text-ink-2 mt-0.5">4-bedroom apartment</p>
                  
                  <div className="flex items-center gap-1.5 text-xs text-ink-2 mt-2">
                    <span className="h-2 w-2 rounded-full bg-[#194534]" />
                    <span>Live</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-2 border-t border-border/60 text-[12px] text-ink-3">
                  <span>Published yesterday</span>
                  <button className="text-ink-3 hover:text-ink">
                    <Ellipsis size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </WorkspaceShell>
  )
}
