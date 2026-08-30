const fs = require('fs');
const path = require('path');

const rootDir = 'c:/Users/David PC/Documents/antigravity/proud-hawking';

// 1. ProductionsScreen.tsx (Experiences Dashboard)
const productionsScreenContent = `import { useState } from 'react'
import { Link } from 'react-router-dom'
import { WorkspaceShell } from '../components/WorkspaceShell'
import { SearchIcon, PlusIcon } from '../components/icons2'
import { Ellipsis, CheckCircle } from '../components/icons'

interface ExperienceItem {
  id: string
  propertyTitle: string
  propertyPremise: string
  propertyImg: string
  stateTitle: string
  stateSub: string
  stateKind: 'ready' | 'preparing' | 'live' | 'changes'
  visibility: 'Unlisted' | 'Public' | 'Not published'
  updated: string
  actionLabel: string
  actionKind: 'primary' | 'outline'
  showId: string
}

const EXPERIENCES_DATA: ExperienceItem[] = [
  {
    id: 'exp-1',
    propertyTitle: '8 Admiralty Way',
    propertyPremise: '3-bedroom apartment · Lekki, Lagos',
    propertyImg: '/src/assets/prop-admiralty.jpg',
    stateTitle: 'Ready for review',
    stateSub: '6 of 6 advertised rooms represented · 2 issues resolved',
    stateKind: 'ready',
    visibility: 'Unlisted',
    updated: '8 minutes ago',
    actionLabel: 'Review',
    actionKind: 'primary',
    showId: '8-admiralty-way',
  },
  {
    id: 'exp-2',
    propertyTitle: 'Orchid Apartments, Unit 4',
    propertyPremise: '2-bedroom apartment · Lekki, Lagos',
    propertyImg: '/src/assets/prop-orchid.jpg',
    stateTitle: 'Preparing experience',
    stateSub: 'Building connected room views',
    stateKind: 'preparing',
    visibility: 'Not published',
    updated: '4 minutes ago',
    actionLabel: 'Open',
    actionKind: 'outline',
    showId: 'orchid-1',
  },
  {
    id: 'exp-3',
    propertyTitle: 'Lekki Gardens, Unit 12',
    propertyPremise: '3-bedroom terrace · Lekki, Lagos',
    propertyImg: '/src/assets/prop-lekkigardens.jpg',
    stateTitle: 'Running final checks',
    stateSub: 'Checking room coverage and visual quality',
    stateKind: 'preparing',
    visibility: 'Not published',
    updated: '18 minutes ago',
    actionLabel: 'Open',
    actionKind: 'outline',
    showId: 'lekki-1',
  },
  {
    id: 'exp-4',
    propertyTitle: 'Bourdillon Court, Unit 8',
    propertyPremise: '4-bedroom apartment · Ikoyi, Lagos',
    propertyImg: '/src/assets/prop-bourdillon.jpg',
    stateTitle: 'Live',
    stateSub: 'Published yesterday',
    stateKind: 'live',
    visibility: 'Public',
    updated: 'Yesterday',
    actionLabel: 'Open experience',
    actionKind: 'outline',
    showId: 'bourdillon-1',
  },
  {
    id: 'exp-5',
    propertyTitle: 'Palm View Residence, Unit 5',
    propertyPremise: '2-bedroom apartment · Victoria Island, Lagos',
    propertyImg: '/src/assets/prop-hero-waterfront.jpg',
    stateTitle: 'Changes requested',
    stateSub: 'Bedroom 2 connection needs review',
    stateKind: 'changes',
    visibility: 'Unlisted',
    updated: 'Yesterday',
    actionLabel: 'View changes',
    actionKind: 'outline',
    showId: 'palm-view-5',
  },
]

const filterTabs = ['All', 'Preparing', 'Ready for review', 'Live', 'Failed'] as const
type FilterTab = (typeof filterTabs)[number]

export function ProductionsScreen() {
  const [filter, setFilter] = useState<FilterTab>('All')
  const [query, setQuery] = useState('')

  const visibleExperiences = EXPERIENCES_DATA.filter((e) => {
    if (query && !e.propertyTitle.toLowerCase().includes(query.toLowerCase()) && !e.propertyPremise.toLowerCase().includes(query.toLowerCase())) {
      return false
    }
    if (filter === 'All') return true
    if (filter === 'Preparing') return e.stateKind === 'preparing'
    if (filter === 'Ready for review') return e.stateKind === 'ready'
    if (filter === 'Live') return e.stateKind === 'live'
    if (filter === 'Failed') return e.stateKind === 'changes'
    return true
  })

  return (
    <WorkspaceShell>
      <div className="mx-auto max-w-[1360px] px-6 sm:px-10 lg:px-12 py-8 lg:py-10 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[32px] lg:text-[36px] font-extrabold tracking-tight text-text-primary leading-tight">
              Experiences
            </h1>
            <p className="text-[14.5px] text-text-secondary font-normal mt-0.5">
              Manage the interactive experiences visitors can open.
            </p>
          </div>

          <Link
            to="/create-show"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-[14px] font-semibold text-text-inverse shadow-subtle hover:bg-primary-hover transition-colors shrink-0"
          >
            <PlusIcon size={16} />
            <span>Create from property</span>
          </Link>
        </div>

        {/* Toolbar: Filters, Search, Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {filterTabs.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={\`rounded-full px-4 py-1.5 text-[13.5px] font-semibold transition-all duration-150 \${
                  filter === f
                    ? 'bg-primary text-text-inverse shadow-subtle'
                    : 'border border-border bg-surface text-text-primary hover:bg-surface-elevated'
                }\`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex w-full sm:w-[280px] lg:w-[320px] items-center gap-2.5 rounded-lg border border-border bg-surface px-3.5 py-2 text-[14px] text-text-primary shadow-subtle focus-within:border-primary">
              <SearchIcon size={16} className="text-text-secondary shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search experiences..."
                className="flex-1 bg-transparent text-text-primary outline-none placeholder:text-text-secondary/70"
              />
            </div>
            <span className="text-[13px] text-text-secondary whitespace-nowrap">
              Sort by: <strong className="text-text-primary">Recently updated ⌵</strong>
            </span>
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-2xl border border-border bg-surface shadow-subtle overflow-hidden">
          <div className="grid grid-cols-[2.2fr_2fr_1.2fr_1fr_150px] gap-4 px-6 py-3.5 border-b border-border bg-surface-elevated/50 text-[12.5px] font-bold text-text-secondary uppercase tracking-wider">
            <div>Experience</div>
            <div>State</div>
            <div>Visibility</div>
            <div>Updated</div>
            <div className="text-right">Action</div>
          </div>

          <div className="divide-y divide-border/60">
            {visibleExperiences.map((exp) => (
              <div
                key={exp.id}
                className="grid grid-cols-[2.2fr_2fr_1.2fr_1fr_150px] items-center gap-4 px-6 py-4 hover:bg-surface-elevated/40 transition-colors"
              >
                {/* Experience Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={exp.propertyImg}
                    alt={exp.propertyTitle}
                    className="h-14 w-20 rounded-lg object-cover border border-border shrink-0"
                  />
                  <div className="min-w-0">
                    <Link to={\`/show/\${exp.showId}\`} className="font-bold text-text-primary text-[15px] truncate block hover:text-primary transition-colors">
                      {exp.propertyTitle}
                    </Link>
                    <p className="text-[12.5px] text-text-secondary truncate">{exp.propertyPremise}</p>
                  </div>
                </div>

                {/* State Column */}
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-[13.5px] text-text-primary">
                    <span
                      className={\`h-2 w-2 rounded-full \${
                        exp.stateKind === 'live'
                          ? 'bg-success'
                          : exp.stateKind === 'ready'
                          ? 'bg-info'
                          : exp.stateKind === 'changes'
                          ? 'bg-accent'
                          : 'bg-primary animate-pulse'
                      }\`}
                    />
                    <span>{exp.stateTitle}</span>
                  </div>
                  <p className="text-[12px] text-text-secondary mt-0.5">{exp.stateSub}</p>
                </div>

                {/* Visibility */}
                <div className="text-[13px] text-text-secondary flex items-center gap-1.5">
                  {exp.visibility === 'Unlisted' && <span>🔒 Unlisted</span>}
                  {exp.visibility === 'Public' && <span>🌐 Public</span>}
                  {exp.visibility === 'Not published' && <span>🌐 Not published</span>}
                </div>

                {/* Updated */}
                <div className="text-[13px] text-text-secondary">
                  {exp.updated}
                </div>

                {/* Action */}
                <div className="flex items-center justify-end gap-2">
                  <Link
                    to={\`/show/\${exp.showId}\`}
                    className={\`inline-flex items-center justify-center rounded-lg px-4 py-1.5 text-[13px] font-semibold transition-colors \${
                      exp.actionKind === 'primary'
                        ? 'bg-primary text-text-inverse shadow-subtle hover:bg-primary-hover'
                        : 'border border-border bg-surface text-text-primary hover:bg-surface-elevated'
                    }\`}
                  >
                    {exp.actionLabel}
                  </Link>
                  <button className="text-text-secondary hover:text-text-primary p-1">
                    <Ellipsis size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between text-[13.5px] text-text-secondary pt-2">
          <span>Showing 1 to {visibleExperiences.length} of 25 experiences.</span>
          <div className="flex items-center gap-1">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary hover:bg-surface-elevated">
              &lt;
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-text-inverse font-bold">
              1
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-text-primary hover:bg-surface-elevated">
              2
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-text-primary hover:bg-surface-elevated">
              3
            </button>
            <span className="px-1">…</span>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-text-primary hover:bg-surface-elevated">
              5
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary hover:bg-surface-elevated">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </WorkspaceShell>
  )
}
`;

// 2. ApprovalsScreen.tsx
const approvalsScreenContent = `import { useState } from 'react'
import { Link } from 'react-router-dom'
import { WorkspaceShell } from '../components/WorkspaceShell'
import { SearchIcon } from '../components/icons2'
import { CheckCircle } from '../components/icons'

const filterTabs = ['Ready', 'Changes requested', 'Published'] as const
type FilterTab = (typeof filterTabs)[number]

export function ApprovalsScreen() {
  const [filter, setFilter] = useState<FilterTab>('Ready')
  const [query, setQuery] = useState('')

  return (
    <WorkspaceShell>
      <div className="mx-auto max-w-[1360px] px-6 sm:px-10 lg:px-12 py-8 lg:py-10 space-y-8">
        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[32px] lg:text-[36px] font-extrabold tracking-tight text-text-primary leading-tight">
              Approvals
            </h1>
            <p className="text-[14.5px] text-text-secondary font-normal mt-0.5">
              Review completed experiences before they go live.
            </p>
          </div>

          <div className="flex w-full sm:w-[320px] lg:w-[360px] items-center gap-2.5 rounded-lg border border-border bg-surface px-3.5 py-2 text-[14px] text-text-primary shadow-subtle focus-within:border-primary">
            <SearchIcon size={16} className="text-text-secondary shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search properties..."
              className="flex-1 bg-transparent text-text-primary outline-none placeholder:text-text-secondary/70"
            />
          </div>
        </div>

        {/* Counter Subheading */}
        <p className="text-[13.5px] text-text-secondary font-medium">
          <strong className="text-text-primary">4</strong> ready for review
        </p>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 pb-1">
          {filterTabs.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={\`rounded-full px-4 py-1.5 text-[13.5px] font-semibold transition-all duration-150 \${
                filter === f
                  ? 'bg-primary text-text-inverse shadow-subtle'
                  : 'border border-border bg-surface text-text-primary hover:bg-surface-elevated'
              }\`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Hero Featured Approval Card (8 Admiralty Way) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] overflow-hidden rounded-2xl border border-border bg-surface shadow-subtle">
          <div className="relative aspect-[16/10] lg:aspect-auto lg:h-[340px] overflow-hidden bg-sidebar">
            <img
              src="/src/assets/prop-admiralty.jpg"
              alt="8 Admiralty Way"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="p-6 lg:p-8 flex flex-col justify-between bg-surface">
            <div>
              <div className="flex items-center gap-1.5 pb-2">
                <span className="h-2 w-2 rounded-full bg-success" />
                <span className="text-[11.5px] font-bold uppercase tracking-[0.1em] text-success">
                  READY TO PUBLISH
                </span>
              </div>

              <h2 className="text-[24px] font-bold tracking-tight text-text-primary leading-snug">
                8 Admiralty Way
              </h2>
              <p className="text-[13.5px] text-text-secondary mt-0.5">
                3-bedroom apartment · Lekki, Lagos
              </p>

              <div className="space-y-2.5 pt-5 text-[13.5px] text-text-secondary">
                <div className="flex items-center gap-2">
                  <CheckCircle size={15} className="text-success shrink-0" />
                  <span>6 of 6 advertised rooms represented</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={15} className="text-success shrink-0" />
                  <span>2 issues resolved</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={15} className="text-success shrink-0" />
                  <span>No blocking inconsistencies detected</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <Link
                to="/show/8-admiralty-way"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-[14px] font-semibold text-text-inverse shadow-subtle hover:bg-primary-hover transition-colors"
              >
                Review experience
              </Link>
              <Link
                to="/experience/8-admiralty-way/published"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-surface px-5 py-2.5 text-[14px] font-semibold text-text-primary hover:bg-surface-elevated transition-colors"
              >
                Preview as visitor
              </Link>
            </div>
          </div>
        </div>

        {/* Other Ready For Review Rows */}
        <div className="space-y-3">
          {/* Row 1 */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-4 shadow-subtle hover:border-line-strong transition-colors">
            <div className="flex items-center gap-4 min-w-0">
              <img
                src="/src/assets/prop-lekkigardens.jpg"
                alt="Lekki Gardens"
                className="h-14 w-20 rounded-lg object-cover border border-border shrink-0"
              />
              <div className="min-w-0">
                <h3 className="font-bold text-text-primary text-[15px]">Lekki Gardens, Unit 12</h3>
                <p className="text-[12.5px] text-text-secondary">3-bedroom terrace</p>
              </div>
            </div>

            <div className="flex items-center gap-12">
              <div className="flex items-center gap-2 text-[13px] text-text-secondary hidden md:flex">
                <CheckCircle size={14} className="text-success" />
                <span>8 of 8 rooms represented</span>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-text-secondary hidden sm:flex">
                <span className="h-2 w-2 rounded-full bg-success" />
                <span>Ready for review</span>
              </div>
              <Link
                to="/show/lekki-1"
                className="rounded-lg border border-border bg-surface px-4 py-1.5 text-[13px] font-semibold text-text-primary hover:bg-surface-elevated transition-colors"
              >
                Review
              </Link>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-4 shadow-subtle hover:border-line-strong transition-colors">
            <div className="flex items-center gap-4 min-w-0">
              <img
                src="/src/assets/prop-orchid.jpg"
                alt="Orchid Apartments"
                className="h-14 w-20 rounded-lg object-cover border border-border shrink-0"
              />
              <div className="min-w-0">
                <h3 className="font-bold text-text-primary text-[15px]">Orchid Apartments, Unit 4</h3>
                <p className="text-[12.5px] text-text-secondary">2-bedroom apartment</p>
              </div>
            </div>

            <div className="flex items-center gap-12">
              <div className="flex items-center gap-2 text-[13px] text-text-secondary hidden md:flex">
                <CheckCircle size={14} className="text-success" />
                <span>5 of 5 rooms represented</span>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-text-secondary hidden sm:flex">
                <span className="h-2 w-2 rounded-full bg-success" />
                <span>Ready for review</span>
              </div>
              <Link
                to="/show/orchid-1"
                className="rounded-lg border border-border bg-surface px-4 py-1.5 text-[13px] font-semibold text-text-primary hover:bg-surface-elevated transition-colors"
              >
                Review
              </Link>
            </div>
          </div>

          {/* Row 3 */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-4 shadow-subtle hover:border-line-strong transition-colors">
            <div className="flex items-center gap-4 min-w-0">
              <img
                src="/src/assets/prop-bourdillon.jpg"
                alt="Bourdillon Court"
                className="h-14 w-20 rounded-lg object-cover border border-border shrink-0"
              />
              <div className="min-w-0">
                <h3 className="font-bold text-text-primary text-[15px]">Bourdillon Court, Unit 8</h3>
                <p className="text-[12.5px] text-text-secondary">4-bedroom apartment</p>
              </div>
            </div>

            <div className="flex items-center gap-12">
              <div className="flex items-center gap-2 text-[13px] text-accent hidden md:flex">
                <span>⚠️ One unavailable measurement</span>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-text-secondary hidden sm:flex">
                <span className="h-2 w-2 rounded-full bg-success" />
                <span>Ready for review</span>
              </div>
              <Link
                to="/show/bourdillon-1"
                className="rounded-lg border border-border bg-surface px-4 py-1.5 text-[13px] font-semibold text-text-primary hover:bg-surface-elevated transition-colors"
              >
                Review
              </Link>
            </div>
          </div>
        </div>
      </div>
    </WorkspaceShell>
  )
}
`;

// 3. UsageScreen.tsx
const usageScreenContent = `import { WorkspaceShell } from '../components/WorkspaceShell'
import { Ellipsis } from '../components/icons'

export function UsageScreen() {
  return (
    <WorkspaceShell>
      <div className="mx-auto max-w-[1360px] px-6 sm:px-10 lg:px-12 py-8 lg:py-10 space-y-8">
        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[32px] lg:text-[36px] font-extrabold tracking-tight text-text-primary leading-tight">
              Usage
            </h1>
            <p className="text-[14.5px] text-text-secondary font-normal mt-0.5">
              Track spatial processing, active storage and published experiences.
            </p>
          </div>

          <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-[14px] font-semibold text-text-primary shadow-subtle hover:bg-surface-elevated transition-colors">
            💳 Plan and billing
          </button>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Properties Processed */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-subtle flex flex-col justify-between">
            <div>
              <p className="text-[13px] text-text-secondary font-medium">Properties processed</p>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-[32px] font-extrabold text-text-primary">18</span>
                <span className="text-[16px] text-text-secondary font-medium">/ 25 this month</span>
              </div>
              <div className="h-2 rounded-full bg-border/60 overflow-hidden mt-4">
                <div className="h-full rounded-full bg-primary" style={{ width: '72%' }} />
              </div>
            </div>
            <p className="text-[12px] text-text-secondary mt-4">Resets September 1</p>
          </div>

          {/* Card 2: Reconstruction Time */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-subtle flex flex-col justify-between">
            <div>
              <p className="text-[13px] text-text-secondary font-medium">Reconstruction time</p>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-[32px] font-extrabold text-text-primary">7.4h</span>
                <span className="text-[16px] text-text-secondary font-medium">/ 20h included</span>
              </div>
              <div className="h-2 rounded-full bg-border/60 overflow-hidden mt-4">
                <div className="h-full rounded-full bg-primary" style={{ width: '37%' }} />
              </div>
            </div>
            <p className="text-[12px] text-text-secondary mt-4">Used for spatial processing</p>
          </div>

          {/* Card 3: Active Storage */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-subtle flex flex-col justify-between">
            <div>
              <p className="text-[13px] text-text-secondary font-medium">Active storage</p>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-[32px] font-extrabold text-text-primary">14.2 GB</span>
                <span className="text-[16px] text-text-secondary font-medium">/ 50 GB</span>
              </div>
              <div className="h-2 rounded-full bg-border/60 overflow-hidden mt-4">
                <div className="h-full rounded-full bg-primary" style={{ width: '28.4%' }} />
              </div>
            </div>
            <p className="text-[12px] text-text-secondary mt-4">Captures and published experiences</p>
          </div>
        </div>

        {/* Section: Usage by Property */}
        <div className="space-y-4">
          <h2 className="text-[18px] font-bold text-text-primary">Usage by property</h2>

          <div className="rounded-2xl border border-border bg-surface shadow-subtle overflow-hidden">
            <div className="grid grid-cols-[2.5fr_1.5fr_1.5fr_1.5fr_1fr_40px] gap-4 px-6 py-3.5 border-b border-border bg-surface-elevated/50 text-[12.5px] font-bold text-text-secondary uppercase tracking-wider">
              <div>Property</div>
              <div>Processing</div>
              <div>Storage</div>
              <div>Experience</div>
              <div>Updated</div>
              <div />
            </div>

            <div className="divide-y divide-border/60 text-[13.5px]">
              <div className="grid grid-cols-[2.5fr_1.5fr_1.5fr_1.5fr_1fr_40px] items-center gap-4 px-6 py-4 hover:bg-surface-elevated/40">
                <div className="flex items-center gap-3 min-w-0">
                  <img src="/src/assets/prop-admiralty.jpg" alt="" className="h-10 w-14 rounded-md object-cover border border-border shrink-0" />
                  <span className="font-bold text-text-primary truncate">8 Admiralty Way</span>
                </div>
                <div className="text-text-secondary">42 minutes</div>
                <div className="text-text-secondary">1.3 GB</div>
                <div><span className="inline-flex items-center gap-1.5 text-text-primary"><span className="h-2 w-2 rounded-full bg-success" />Live</span></div>
                <div className="text-text-secondary">Today</div>
                <div><button className="text-text-secondary hover:text-text-primary"><Ellipsis size={16} /></button></div>
              </div>

              <div className="grid grid-cols-[2.5fr_1.5fr_1.5fr_1.5fr_1fr_40px] items-center gap-4 px-6 py-4 hover:bg-surface-elevated/40">
                <div className="flex items-center gap-3 min-w-0">
                  <img src="/src/assets/prop-kitchen.png" alt="" className="h-10 w-14 rounded-md object-cover border border-border shrink-0" />
                  <span className="font-bold text-text-primary truncate">14 Cooper Road</span>
                </div>
                <div className="text-text-secondary">31 minutes</div>
                <div className="text-text-secondary">980 MB</div>
                <div><span className="inline-flex items-center gap-1.5 text-text-primary"><span className="h-2 w-2 rounded-full bg-accent" />Preparing</span></div>
                <div className="text-text-secondary">Today</div>
                <div><button className="text-text-secondary hover:text-text-primary"><Ellipsis size={16} /></button></div>
              </div>

              <div className="grid grid-cols-[2.5fr_1.5fr_1.5fr_1.5fr_1fr_40px] items-center gap-4 px-6 py-4 hover:bg-surface-elevated/40">
                <div className="flex items-center gap-3 min-w-0">
                  <img src="/src/assets/prop-orchid.jpg" alt="" className="h-10 w-14 rounded-md object-cover border border-border shrink-0" />
                  <span className="font-bold text-text-primary truncate">Orchid Apartments, Unit 4</span>
                </div>
                <div className="text-text-secondary">36 minutes</div>
                <div className="text-text-secondary">1.1 GB</div>
                <div><span className="inline-flex items-center gap-1.5 text-text-primary"><span className="h-2 w-2 rounded-full bg-accent" />Preparing</span></div>
                <div className="text-text-secondary">Today</div>
                <div><button className="text-text-secondary hover:text-text-primary"><Ellipsis size={16} /></button></div>
              </div>

              <div className="grid grid-cols-[2.5fr_1.5fr_1.5fr_1.5fr_1fr_40px] items-center gap-4 px-6 py-4 hover:bg-surface-elevated/40">
                <div className="flex items-center gap-3 min-w-0">
                  <img src="/src/assets/prop-lekkigardens.jpg" alt="" className="h-10 w-14 rounded-md object-cover border border-border shrink-0" />
                  <span className="font-bold text-text-primary truncate">Lekki Gardens, Unit 12</span>
                </div>
                <div className="text-text-secondary">49 minutes</div>
                <div className="text-text-secondary">1.5 GB</div>
                <div><span className="inline-flex items-center gap-1.5 text-text-primary"><span className="h-2 w-2 rounded-full bg-info" />Ready for review</span></div>
                <div className="text-text-secondary">Yesterday</div>
                <div><button className="text-text-secondary hover:text-text-primary"><Ellipsis size={16} /></button></div>
              </div>

              <div className="grid grid-cols-[2.5fr_1.5fr_1.5fr_1.5fr_1fr_40px] items-center gap-4 px-6 py-4 hover:bg-surface-elevated/40">
                <div className="flex items-center gap-3 min-w-0">
                  <img src="/src/assets/prop-bourdillon.jpg" alt="" className="h-10 w-14 rounded-md object-cover border border-border shrink-0" />
                  <span className="font-bold text-text-primary truncate">Bourdillon Court, Unit 8</span>
                </div>
                <div className="text-text-secondary">55 minutes</div>
                <div className="text-text-secondary">1.8 GB</div>
                <div><span className="inline-flex items-center gap-1.5 text-text-primary"><span className="h-2 w-2 rounded-full bg-success" />Live</span></div>
                <div className="text-text-secondary">Yesterday</div>
                <div><button className="text-text-secondary hover:text-text-primary"><Ellipsis size={16} /></button></div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Plan Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-2xl border border-border bg-surface p-6 shadow-subtle">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-primary/10 text-primary text-[22px]">
              ⭐
            </div>
            <div>
              <p className="text-[12px] text-text-secondary font-medium">Current plan</p>
              <p className="text-[18px] font-extrabold text-text-primary">Professional</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 text-[13.5px]">
            <div>
              <p className="font-bold text-text-primary">25</p>
              <p className="text-[12px] text-text-secondary">properties per month</p>
            </div>
            <div>
              <p className="font-bold text-text-primary">20</p>
              <p className="text-[12px] text-text-secondary">reconstruction hours</p>
            </div>
            <div>
              <p className="font-bold text-text-primary">50 GB</p>
              <p className="text-[12px] text-text-secondary">active storage</p>
            </div>
          </div>

          <button className="rounded-lg border border-border bg-surface px-4 py-2 text-[13.5px] font-semibold text-text-primary hover:bg-surface-elevated transition-colors">
            View plan details
          </button>
        </div>
      </div>
    </WorkspaceShell>
  )
}
`;

// 4. TeamScreen.tsx
const teamScreenContent = `import { useState } from 'react'
import { WorkspaceShell } from '../components/WorkspaceShell'
import { SearchIcon, PlusIcon } from '../components/icons2'
import { Ellipsis } from '../components/icons'

const TEAM_MEMBERS = [
  {
    name: 'David Olabowale',
    email: 'david@openhouse.com',
    role: 'Owner',
    access: 'All properties',
    lastActive: 'Now',
    status: 'Active',
    initial: 'D',
  },
  {
    name: 'Tola Adeyemi',
    email: 'tola@openhouse.com',
    role: 'Property manager',
    access: '12 properties',
    lastActive: '14 minutes ago',
    status: 'Active',
    initial: 'T',
  },
  {
    name: 'Maya Okafor',
    email: 'maya@openhouse.com',
    role: 'Reviewer',
    access: 'All properties',
    lastActive: 'Yesterday',
    status: 'Active',
    initial: 'M',
  },
  {
    name: 'Chidi Eze',
    email: 'chidi@openhouse.com',
    role: 'Capture contributor',
    access: 'Assigned properties only',
    lastActive: 'Monday',
    status: 'Active',
    initial: 'C',
  },
  {
    name: 'Amara Bello',
    email: 'amara@example.com',
    role: 'Property manager',
    access: '6 properties',
    lastActive: '—',
    status: 'Invitation pending',
    initial: 'AB',
  },
]

export function TeamScreen() {
  const [query, setQuery] = useState('')

  return (
    <WorkspaceShell>
      <div className="mx-auto max-w-[1360px] px-6 sm:px-10 lg:px-12 py-8 lg:py-10 space-y-8">
        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[32px] lg:text-[36px] font-extrabold tracking-tight text-text-primary leading-tight">
              Team
            </h1>
            <p className="text-[14.5px] text-text-secondary font-normal mt-0.5">
              Manage who can prepare, review and publish property experiences.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex w-full sm:w-[280px] lg:w-[320px] items-center gap-2.5 rounded-lg border border-border bg-surface px-3.5 py-2 text-[14px] text-text-primary shadow-subtle focus-within:border-primary">
              <SearchIcon size={16} className="text-text-secondary shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search team members..."
                className="flex-1 bg-transparent text-text-primary outline-none placeholder:text-text-secondary/70"
              />
            </div>

            <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2 text-[14px] font-semibold text-text-inverse shadow-subtle hover:bg-primary-hover transition-colors shrink-0">
              <PlusIcon size={16} />
              <span>Invite member</span>
            </button>
          </div>
        </div>

        {/* Counter */}
        <p className="text-[13.5px] text-text-secondary font-medium">
          <strong className="text-text-primary">4</strong> active members · <strong className="text-text-primary">1</strong> pending invitation
        </p>

        {/* Members Table */}
        <div className="rounded-2xl border border-border bg-surface shadow-subtle overflow-hidden">
          <div className="grid grid-cols-[2.5fr_1.8fr_1.8fr_1.2fr_1.2fr_100px] gap-4 px-6 py-3.5 border-b border-border bg-surface-elevated/50 text-[12.5px] font-bold text-text-secondary uppercase tracking-wider">
            <div>Member</div>
            <div>Role</div>
            <div>Property access</div>
            <div>Last active</div>
            <div>Status</div>
            <div className="text-right">Action</div>
          </div>

          <div className="divide-y divide-border/60 text-[13.5px]">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.email}
                className="grid grid-cols-[2.5fr_1.8fr_1.8fr_1.2fr_1.2fr_100px] items-center gap-4 px-6 py-4 hover:bg-surface-elevated/40 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-text-inverse font-bold text-[13px]">
                    {member.initial}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-text-primary truncate">{member.name}</p>
                    <p className="text-[12.5px] text-text-secondary truncate">{member.email}</p>
                  </div>
                </div>

                <div className="text-text-primary font-medium">{member.role}</div>
                <div className="text-text-secondary">{member.access}</div>
                <div className="text-text-secondary flex items-center gap-1.5">
                  {member.lastActive === 'Now' && <span className="h-2 w-2 rounded-full bg-success" />}
                  {member.lastActive}
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 text-text-primary">
                    <span
                      className={\`h-2 w-2 rounded-full \${
                        member.status === 'Active' ? 'bg-success' : 'bg-accent'
                      }\`}
                    />
                    {member.status}
                  </span>
                </div>
                <div className="text-right">
                  {member.status === 'Invitation pending' ? (
                    <button className="rounded-lg border border-border bg-surface px-3 py-1 text-[13px] font-semibold text-text-primary hover:bg-surface-elevated">
                      Resend
                    </button>
                  ) : (
                    <button className="text-text-secondary hover:text-text-primary p-1">
                      <Ellipsis size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Roles and Permissions Guide */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-subtle space-y-4">
          <h3 className="text-[15px] font-bold text-text-primary">Roles and permissions</h3>
          <div className="divide-y divide-border/60 text-[13.5px]">
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[18px]">🛡️</span>
                <span className="font-bold text-text-primary">Owner</span>
              </div>
              <span className="text-text-secondary">Full workspace access</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[18px]">💼</span>
                <span className="font-bold text-text-primary">Property manager</span>
              </div>
              <span className="text-text-secondary">Manage assigned properties and capture requests</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[18px]">✓</span>
                <span className="font-bold text-text-primary">Reviewer</span>
              </div>
              <span className="text-text-secondary">Review experiences and request changes</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[18px]">📷</span>
                <span className="font-bold text-text-primary">Capture contributor</span>
              </div>
              <span className="text-text-secondary">Respond to assigned capture requests</span>
            </div>
          </div>
        </div>
      </div>
    </WorkspaceShell>
  )
}
`;

// 5. SettingsScreen.tsx
const settingsScreenContent = `import { useState } from 'react'
import { WorkspaceShell } from '../components/WorkspaceShell'
import { CopyIcon } from '../components/icons2'

const settingsTabs = ['Workspace', 'Connections', 'Security'] as const
type SettingsTab = (typeof settingsTabs)[number]

export function SettingsScreen() {
  const [tab, setTab] = useState<SettingsTab>('Workspace')
  const [saved, setSaved] = useState(false)

  return (
    <WorkspaceShell>
      <div className="mx-auto max-w-[1000px] px-6 sm:px-10 lg:px-12 py-8 lg:py-10 space-y-8">
        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[32px] lg:text-[36px] font-extrabold tracking-tight text-text-primary leading-tight">
              Settings
            </h1>
            <p className="text-[14.5px] text-text-secondary font-normal mt-0.5">
              Manage workspace defaults, connections, and security.
            </p>
          </div>

          <button
            onClick={() => {
              setSaved(true)
              setTimeout(() => setSaved(false), 2000)
            }}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-[14px] font-semibold text-text-inverse shadow-subtle hover:bg-primary-hover transition-colors shrink-0"
          >
            {saved ? 'Saved!' : 'Save changes'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-8 border-b border-border">
          {settingsTabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={\`relative pb-3 text-[14.5px] font-semibold transition-colors \${
                tab === t ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
              }\`}
            >
              {t}
              {tab === t && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>

        {/* Form Sections */}
        <div className="space-y-8">
          {/* Section 1: Workspace Details */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-subtle space-y-4">
            <h3 className="text-[16px] font-bold text-text-primary">Workspace details</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-text-primary mb-1.5">Workspace name</label>
                <input
                  defaultValue="OpenHouse Workspace"
                  className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-[14px] text-text-primary outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-text-primary mb-1.5">Workspace URL</label>
                <div className="flex items-center rounded-lg border border-border bg-surface px-4 py-2.5 text-[14px] text-text-primary">
                  <span className="flex-1 font-mono text-[13px]">openhouse.app/workspaces/david</span>
                  <CopyIcon size={16} className="text-text-secondary cursor-pointer" />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-text-primary mb-1.5">Workspace type</label>
                <select className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-[14px] text-text-primary outline-none">
                  <option>Property agency</option>
                  <option>Independent broker</option>
                  <option>Developer / Builder</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Region */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-subtle space-y-4">
            <h3 className="text-[16px] font-bold text-text-primary">Region</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-semibold text-text-primary mb-1.5">Time zone</label>
                <select className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-[14px] text-text-primary outline-none">
                  <option>Africa/Lagos</option>
                  <option>Europe/London</option>
                  <option>America/New_York</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-text-primary mb-1.5">Language</label>
                <select className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-[14px] text-text-primary outline-none">
                  <option>English</option>
                  <option>French</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-text-primary mb-1.5">Currency</label>
                <select className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-[14px] text-text-primary outline-none">
                  <option>Nigerian Naira — NGN</option>
                  <option>US Dollar — USD</option>
                  <option>British Pound — GBP</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-text-primary mb-1.5">Date format</label>
                <select className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-[14px] text-text-primary outline-none">
                  <option>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Default Contact */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-subtle space-y-4">
            <h3 className="text-[16px] font-bold text-text-primary">Default contact</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[13px] font-semibold text-text-primary mb-1.5">Name</label>
                <input
                  defaultValue="David Olabowale"
                  className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-[14px] text-text-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-text-primary mb-1.5">Email</label>
                <input
                  defaultValue="david@openhouse.com"
                  className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-[14px] text-text-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-text-primary mb-1.5">Phone</label>
                <input
                  defaultValue="+234 800 000 0000"
                  className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-[14px] text-text-primary outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Danger Zone */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-[15px] font-bold text-danger">Delete workspace</h3>
              <p className="text-[13px] text-text-secondary mt-0.5">
                Permanently removes workspace settings. Published experiences must be handled separately.
              </p>
            </div>

            <button
              onClick={() => alert('This action is protected in demo mode.')}
              className="rounded-lg border border-danger/40 bg-surface px-4 py-2 text-[13.5px] font-semibold text-danger hover:bg-danger/10 transition-colors shrink-0"
            >
              Delete workspace
            </button>
          </div>
        </div>
      </div>
    </WorkspaceShell>
  )
}
`;

// 6. PublishedExperienceScreen.tsx
const publishedExperienceScreenContent = `import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { WorkspaceShell } from '../components/WorkspaceShell'
import { CopyIcon } from '../components/icons2'
import { CheckCircle } from '../components/icons'

const ROOM_LIST = [
  { id: 'entrance', name: 'Entrance', img: '/src/assets/prop-hero-waterfront.jpg' },
  { id: 'living', name: 'Living room', img: '/src/assets/prop-admiralty.jpg' },
  { id: 'kitchen', name: 'Kitchen', img: '/src/assets/prop-kitchen.png' },
  { id: 'main-bed', name: 'Main bedroom', img: '/src/assets/prop-bourdillon.jpg' },
  { id: 'bed-2', name: 'Bedroom 2', img: '/src/assets/prop-lekkigardens.jpg' },
  { id: 'bed-3', name: 'Bedroom 3', img: '/src/assets/prop-orchid.jpg' },
  { id: 'balcony', name: 'Balcony', img: '/src/assets/prop-hero-waterfront.jpg' },
]

export function PublishedExperienceScreen() {
  const { id } = useParams()
  const [activeRoom, setActiveRoom] = useState('living')
  const [copiedLink, setCopiedLink] = useState(false)

  const propertyTitle = id?.includes('admiralty') ? '8 Admiralty Way' : '8 Admiralty Way'

  return (
    <WorkspaceShell
      breadcrumb={
        <div className="flex items-center gap-2 text-[14px] text-text-secondary">
          <Link to="/productions" className="hover:text-text-primary">Experiences</Link>
          <span>&gt;</span>
          <Link to={\`/show/\${id || '8-admiralty-way'}\`} className="hover:text-text-primary">{propertyTitle}</Link>
          <span>&gt;</span>
          <span className="font-semibold text-text-primary">Published</span>
        </div>
      }
      backTo="/productions"
    >
      <div className="mx-auto max-w-[1360px] px-6 sm:px-10 lg:px-12 py-8 lg:py-10 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-success" />
              <span className="text-[12px] font-bold uppercase tracking-wider text-success">
                LIVE · UNLISTED
              </span>
            </div>
            <h1 className="text-[30px] lg:text-[34px] font-extrabold tracking-tight text-text-primary leading-tight mt-1">
              Your OpenHouse is ready to share
            </h1>
            <p className="text-[14.5px] text-text-secondary font-normal mt-0.5">
              {propertyTitle} is published as an unlisted experience.
            </p>
          </div>

          <a
            href="https://openhouse.app"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-[14px] font-semibold text-text-inverse shadow-subtle hover:bg-primary-hover transition-colors shrink-0"
          >
            <span>Open experience ↗</span>
          </a>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 items-start">
          {/* Left Column: 3D Interactive Viewer + Metrics */}
          <div className="space-y-6">
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-sidebar border border-border shadow-card">
              <img
                src={ROOM_LIST.find((r) => r.id === activeRoom)?.img || '/src/assets/prop-admiralty.jpg'}
                alt={activeRoom}
                className="h-full w-full object-cover"
              />

              <div className="absolute top-4 left-4 rounded-md bg-black/65 backdrop-blur-md px-3 py-1.5 text-white border border-white/10 text-[11px] font-bold tracking-wider uppercase">
                {ROOM_LIST.find((r) => r.id === activeRoom)?.name} / 01
              </div>

              <div className="absolute bottom-4 left-4 right-20 sm:right-auto rounded-xl bg-black/65 backdrop-blur-md p-4 text-white border border-white/10 max-w-sm">
                <p className="text-[16px] font-bold leading-tight">
                  {ROOM_LIST.find((r) => r.id === activeRoom)?.name}
                </p>
                <p className="text-[12.5px] text-white/80 mt-1 leading-snug">
                  Connected to the entrance hall, kitchen and balcony.
                </p>
              </div>

              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <button className="rounded-lg bg-black/65 backdrop-blur-md px-3 py-1.5 text-[12px] font-semibold text-white border border-white/10 hover:bg-black/80">
                  ⊞ Rooms
                </button>
                <button className="rounded-lg bg-black/65 backdrop-blur-md px-3 py-1.5 text-[12px] font-semibold text-white border border-white/10 hover:bg-black/80">
                  📍 Map
                </button>
                <button className="rounded-lg bg-black/65 backdrop-blur-md px-3 py-1.5 text-[12px] font-semibold text-white border border-white/10 hover:bg-black/80">
                  ⛶ Full screen
                </button>
              </div>
            </div>

            {/* Room Selector Strip Carousel */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {ROOM_LIST.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setActiveRoom(room.id)}
                  className={\`flex flex-col items-center gap-1.5 rounded-xl border p-1.5 shrink-0 transition-all \${
                    activeRoom === room.id
                      ? 'border-primary bg-primary/5 shadow-subtle'
                      : 'border-border bg-surface hover:bg-surface-elevated'
                  }\`}
                >
                  <img src={room.img} alt={room.name} className="h-16 w-24 rounded-lg object-cover" />
                  <span className="text-[12px] font-semibold text-text-primary">{room.name}</span>
                </button>
              ))}
            </div>

            {/* Published Summary Metrics Card */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-2xl border border-border bg-surface p-6 shadow-subtle text-center">
              <div>
                <p className="text-[24px] font-extrabold text-text-primary">7</p>
                <p className="text-[12.5px] text-text-secondary mt-0.5">captured spaces</p>
              </div>
              <div>
                <p className="text-[24px] font-extrabold text-text-primary">6 of 6</p>
                <p className="text-[12.5px] text-text-secondary mt-0.5">rooms represented</p>
              </div>
              <div>
                <p className="text-[20px] font-extrabold text-success mt-1">Verified</p>
                <p className="text-[12.5px] text-text-secondary mt-0.5">OpenHouse badge</p>
              </div>
              <div>
                <p className="text-[20px] font-extrabold text-primary mt-1">Enabled</p>
                <p className="text-[12.5px] text-text-secondary mt-0.5">booking action</p>
              </div>
            </div>
          </div>

          {/* Right Column: Share & Embed Cards */}
          <div className="space-y-6">
            {/* Share Link Card */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-subtle space-y-4">
              <h3 className="text-[14.5px] font-bold text-text-primary">Share link</h3>
              <div className="flex items-center rounded-lg border border-border bg-surface p-1 shadow-subtle">
                <span className="flex-1 px-3 text-[13.5px] font-mono text-text-primary truncate">
                  openhouse.app/h/8-admiralty-way
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText('https://openhouse.app/h/8-admiralty-way')
                    setCopiedLink(true)
                    setTimeout(() => setCopiedLink(false), 2000)
                  }}
                  className="rounded-md bg-primary px-3.5 py-1.5 text-[13px] font-semibold text-text-inverse hover:bg-primary-hover transition-colors"
                >
                  {copiedLink ? 'Copied!' : 'Copy link'}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2">
                <button className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface py-2 text-[13px] font-semibold text-text-primary hover:bg-surface-elevated transition-colors">
                  💬 WhatsApp
                </button>
                <button className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface py-2 text-[13px] font-semibold text-text-primary hover:bg-surface-elevated transition-colors">
                  ✉️ Email
                </button>
                <button className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface py-2 text-[13px] font-semibold text-text-primary hover:bg-surface-elevated transition-colors">
                  ▦ QR code
                </button>
              </div>
            </div>

            {/* Visibility Card */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-subtle space-y-3">
              <h3 className="text-[14.5px] font-bold text-text-primary">Visibility</h3>
              <select className="w-full rounded-lg border border-border bg-surface px-3.5 py-2 text-[13.5px] font-medium text-text-primary outline-none">
                <option>Unlisted link</option>
                <option>Public discovery</option>
                <option>Password protected</option>
              </select>
              <p className="text-[12.5px] text-text-secondary leading-relaxed">
                Anyone with the link can enter. The experience will not appear in public discovery.
              </p>
            </div>

            {/* Add to Listing Card */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-subtle space-y-4">
              <h3 className="text-[14.5px] font-bold text-text-primary">Add to listing</h3>
              <div className="space-y-2">
                <button className="w-full rounded-lg border border-border bg-surface py-2 text-[13.5px] font-semibold text-text-primary hover:bg-surface-elevated transition-colors">
                  Copy listing button
                </button>
                <button className="w-full rounded-lg border border-border bg-surface py-2 text-[13.5px] font-semibold text-text-primary hover:bg-surface-elevated transition-colors">
                  Copy embed code
                </button>
              </div>

              <div className="rounded-lg bg-sidebar p-3 text-[12px] font-mono text-text-inverse-muted overflow-x-auto">
                <code>&lt;iframe src="https://openhouse.app/h/8-admiralty-way/embed" width="100%" height="600" /&gt;</code>
              </div>
            </div>

            {/* Visitor Contact Card */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-subtle space-y-4">
              <h3 className="text-[14.5px] font-bold text-text-primary">Visitor contact</h3>
              <button className="w-full rounded-lg bg-primary py-2.5 text-[14px] font-semibold text-text-inverse shadow-subtle hover:bg-primary-hover transition-colors">
                Book an inspection
              </button>

              <div className="flex items-center justify-between text-[13px] pt-1">
                <div>
                  <p className="font-semibold text-text-primary">David Olabowale</p>
                  <p className="text-text-secondary">WhatsApp and email</p>
                </div>
                <button className="rounded-lg border border-border bg-surface px-3 py-1 text-[12.5px] font-semibold text-text-primary hover:bg-surface-elevated">
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WorkspaceShell>
  )
}
`;

fs.writeFileSync(path.join(rootDir, 'src/screens/ProductionsScreen.tsx'), productionsScreenContent, 'utf8');
fs.writeFileSync(path.join(rootDir, 'src/screens/ApprovalsScreen.tsx'), approvalsScreenContent, 'utf8');
fs.writeFileSync(path.join(rootDir, 'src/screens/UsageScreen.tsx'), usageScreenContent, 'utf8');
fs.writeFileSync(path.join(rootDir, 'src/screens/TeamScreen.tsx'), teamScreenContent, 'utf8');
fs.writeFileSync(path.join(rootDir, 'src/screens/SettingsScreen.tsx'), settingsScreenContent, 'utf8');
fs.writeFileSync(path.join(rootDir, 'src/screens/PublishedExperienceScreen.tsx'), publishedExperienceScreenContent, 'utf8');
console.log('All remaining workspace screens generated successfully.');
