import { useState, type ReactNode } from 'react'
import { NavLink, Link } from 'react-router-dom'
import {
  GridIcon,
  CaptureRequestsIcon,
  CubeIcon,
  ApprovalsIcon,
  ActivityIcon,
  UsageIcon,
  TeamIcon,
  GearIcon,
  BellIcon,
  PlusIcon,
} from './icons2'
import { ArrowLeft, ChevronDown } from './icons'
import { getRecentEvents, type WorkflowEventItem } from '../data/api'
import logoMarkUrl from '../assets/logo-mark.png'

export function OpenHouseLogoMark({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <img
      src={logoMarkUrl}
      alt="OpenHouse"
      className={`${className} object-contain`}
    />
  )
}

/** Reusable Header Notification Button & Popover */
export function NotificationButton() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [events, setEvents] = useState<WorkflowEventItem[]>([])
  const [eventsLoading, setEventsLoading] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => {
          const next = !showNotifications
          setShowNotifications(next)
          if (next) {
            setEventsLoading(true)
            getRecentEvents()
              .then(setEvents)
              .catch(() => setEvents([]))
              .finally(() => setEventsLoading(false))
          }
        }}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-ink-2 transition-all hover:border-line-strong hover:bg-surface-elevated hover:text-ink shadow-subtle"
        aria-label="Notifications"
      >
        <BellIcon size={17} />
        <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-accent" />
      </button>

      {showNotifications && (
        <div className="absolute right-0 top-full mt-3 w-[360px] rounded-2xl border border-border bg-surface shadow-overlay z-50 overflow-hidden font-sans">
          <div className="flex items-center justify-between border-b border-border p-4 bg-surface-elevated">
            <span className="font-bold text-ink text-[15px]">Property Notifications</span>
          </div>
          <div className="max-h-[380px] overflow-y-auto divide-y divide-border/60">
            {eventsLoading && (
              <div className="p-6 text-center text-[13.5px] text-ink-2">Loading updates…</div>
            )}
            {!eventsLoading && events.length === 0 && (
              <div className="p-6 text-center text-[13.5px] text-ink-2">
                No notifications yet — property events will appear here.
              </div>
            )}
            {!eventsLoading &&
              events.map((e) => (
                <div key={e.id} className="p-4 flex items-start gap-3 hover:bg-surface-elevated transition-colors">
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      e.severity === 'error' ? 'bg-danger' : e.severity === 'warning' ? 'bg-accent' : 'bg-success'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[14px] font-semibold text-ink leading-tight">{e.event_type}</h3>
                    {typeof e.payload?.message === 'string' && (
                      <p className="text-[13px] text-ink-2 mt-0.5 leading-snug">{e.payload.message}</p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

const workspaceNav = [
  { label: 'Properties', icon: GridIcon, to: '/properties' },
  { label: 'Capture requests', icon: CaptureRequestsIcon, to: '/capture-requests' },
  { label: 'Experiences', icon: CubeIcon, to: '/experiences' },
  { label: 'Approvals', icon: ApprovalsIcon, to: '/approvals' },
  { label: 'Activity', icon: ActivityIcon, to: '/activity' },
]

const accountNav = [
  { label: 'Usage', icon: UsageIcon, to: '/usage' },
  { label: 'Team', icon: TeamIcon, to: '/team' },
  { label: 'Settings', icon: GearIcon, to: '/settings' },
]

interface WorkspaceShellProps {
  children: ReactNode
  breadcrumb?: ReactNode
  backTo?: string
  actions?: ReactNode
}

export function WorkspaceShell({ children, breadcrumb, backTo, actions }: WorkspaceShellProps) {
  const [userName, setUserName] = useState(() => localStorage.getItem('openhouse.userName') || 'David Olabowale')
  const userEmail = localStorage.getItem('openhouse.userEmail') || 'kiki@citcable.dev'

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-canvas font-sans text-ink">
      {/* Sleek Deep Green-Black Sidebar */}
      <aside className="flex w-[240px] xl:w-[250px] shrink-0 flex-col bg-sidebar border-r border-border-dark select-none h-full z-20 transition-all">
        {/* Brand Header */}
        <div className="px-4 pt-5 pb-3 flex items-center justify-between">
          <Link to="/properties" className="flex items-center gap-2.5 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sidebar-active border border-border-dark shadow-subtle group-hover:border-accent/50 transition-colors">
              <OpenHouseLogoMark className="h-4 w-4" />
            </div>
            <span className="text-[17px] font-extrabold tracking-tight text-text-inverse leading-none">
              OpenHouse
            </span>
          </Link>
          <button className="text-text-inverse-muted/60 hover:text-text-inverse p-1 rounded transition-colors text-xs font-mono">
            &lt;
          </button>
        </div>

        {/* Top + Add Property Button CTA (White background as in original design) */}
        <div className="px-3.5 pb-4 pt-1">
          <Link
            to="/create-show"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white hover:bg-stone-100 px-3.5 py-2.5 text-[13.5px] font-bold text-ink shadow-subtle transition-all duration-150 active:scale-[0.98] whitespace-nowrap"
          >
            <PlusIcon size={14} strokeWidth={2.5} className="text-ink" />
            <span>+ Add property</span>
          </Link>
        </div>

        {/* WORKSPACE Navigation Section */}
        <div className="pt-1">
          <p className="px-4 pb-1.5 text-[10.5px] font-bold tracking-[0.12em] text-text-inverse-muted/50 uppercase">
            WORKSPACE
          </p>
          <nav className="flex flex-col gap-0.5 px-2.5">
            {workspaceNav.map(({ label, icon: Icon, to }) => (
              <NavLink
                key={label}
                to={to}
                className={({ isActive }) =>
                  `group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-semibold transition-all duration-150 whitespace-nowrap ${
                    isActive
                      ? 'bg-sidebar-active text-text-inverse border border-border-dark/60 shadow-sm'
                      : 'text-text-inverse-muted hover:bg-sidebar-active/50 hover:text-text-inverse'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-1 h-3.5 w-[2.5px] rounded-full bg-accent" />
                    )}
                    <Icon
                      size={16}
                      className={`shrink-0 transition-colors ${
                        isActive ? 'text-accent' : 'text-text-inverse-muted group-hover:text-text-inverse'
                      }`}
                    />
                    <span className="truncate">{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* ACCOUNT Navigation Section */}
        <div className="pt-5">
          <p className="px-4 pb-1.5 text-[10.5px] font-bold tracking-[0.12em] text-text-inverse-muted/50 uppercase">
            ACCOUNT
          </p>
          <nav className="flex flex-col gap-0.5 px-2.5">
            {accountNav.map(({ label, icon: Icon, to }) => (
              <NavLink
                key={label}
                to={to}
                className={({ isActive }) =>
                  `group relative flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13.5px] font-medium transition-all duration-150 whitespace-nowrap ${
                    isActive
                      ? 'bg-sidebar-active text-text-inverse border border-border-dark/60 shadow-sm'
                      : 'text-text-inverse-muted hover:bg-sidebar-active/50 hover:text-text-inverse'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-1 h-3 w-[2.5px] rounded-full bg-accent" />
                    )}
                    <Icon
                      size={16}
                      className={`shrink-0 transition-colors ${
                        isActive ? 'text-accent' : 'text-text-inverse-muted group-hover:text-text-inverse'
                      }`}
                    />
                    <span className="truncate">{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom User Profile */}
        <div className="mt-auto border-t border-border-dark px-2.5 py-2.5">
          <button
            onClick={() => {
              const next = window.prompt('Update display profile name:', userName)
              if (next && next.trim()) {
                localStorage.setItem('openhouse.userName', next.trim())
                setUserName(next.trim())
              }
            }}
            className="flex w-full items-center gap-2 rounded-lg border border-transparent p-1.5 text-[13px] text-text-inverse transition-colors hover:bg-sidebar-active/70 hover:border-border-dark text-left"
          >
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-text-inverse shadow-subtle"
              style={{ background: 'linear-gradient(135deg, #194534 0%, #0B1713 100%)', border: '1px solid #293A32' }}
            >
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-semibold text-text-inverse leading-tight">{userName}</p>
              <p className="truncate text-[10.5px] text-text-inverse-muted">{userEmail}</p>
            </div>
            <ChevronDown size={13} className="text-text-inverse-muted shrink-0" />
          </button>
        </div>
      </aside>

      {/* Main Workspace (Warm Limestone) */}
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto h-full bg-canvas">
        {/* Render Slim Breadcrumb Bar ONLY on Subpages with backTo/breadcrumb */}
        {breadcrumb && (
          <div className="flex h-14 shrink-0 items-center justify-between px-6 lg:px-10 border-b border-border/60 bg-canvas sticky top-0 z-10">
            <div className="flex items-center gap-2.5 min-w-0">
              {backTo && (
                <Link
                  to={backTo}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-ink-2 transition-all hover:bg-surface-elevated hover:text-ink shadow-subtle shrink-0"
                  aria-label="Back"
                >
                  <ArrowLeft size={16} />
                </Link>
              )}
              <div className="text-[14px] font-semibold text-ink truncate flex items-center gap-2">
                {breadcrumb}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {actions}
              <NotificationButton />
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}
