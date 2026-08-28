import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { CloseIcon } from './icons'

const steps = ['Property', 'Capture', 'Publish'] as const

interface WizardShellProps {
  step: 1 | 2 | 3
  children: ReactNode
  /** footer actions, right-aligned; left slot for Back */
  footerLeft?: ReactNode
  footerRight: ReactNode
}

function StepDot({ index, current }: { index: number; current: number }) {
  const n = index + 1
  if (n < current) {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-text-inverse shadow-subtle">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3.2 7.3l2.6 2.6 5-5.4" stroke="#F5F0E7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    )
  }
  if (n === current) {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[14px] font-bold text-text-inverse shadow-subtle ring-4 ring-accent/15">
        {n}
      </span>
    )
  }
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-[14px] font-semibold text-text-secondary shadow-subtle">
      {n}
    </span>
  )
}

import logoIconUrl from '../assets/logo-icon.png'

export function WizardShell({ step, children, footerLeft, footerRight }: WizardShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas font-sans">
      <header className="flex h-[68px] shrink-0 items-center justify-between px-8 border-b border-border bg-surface">
        <div className="flex items-center gap-6">
          <Link to="/shows" className="flex items-center gap-2.5 text-[20px] font-extrabold tracking-tight text-text-primary">
            <img src={logoIconUrl} alt="OpenHouse" className="h-7 w-7 rounded-lg object-contain" />
            <span>OpenHouse</span>
          </Link>
          <span className="h-5 w-px bg-border" />
          <Link to="/shows" className="flex items-center gap-2.5 text-[14.5px] font-semibold text-text-secondary transition-colors hover:text-text-primary">
            <CloseIcon size={16} />
            <span>Cancel & Back</span>
          </Link>
        </div>
        <span className="text-[14px] font-bold text-text-secondary uppercase tracking-wider">Step {step} of 3</span>
      </header>

      {/* Stepper */}
      <div className="flex justify-center pt-8 pb-4">
        <div className="flex items-start">
          {steps.map((label, i) => (
            <div key={label} className="flex items-start">
              <div className="flex w-[120px] flex-col items-center gap-2">
                <StepDot index={i} current={step} />
                <span className={`text-[13.5px] ${i + 1 === step ? 'font-bold text-text-primary' : 'font-medium text-text-secondary'}`}>{label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`mt-4 h-[2px] w-[110px] rounded-full ${i + 1 < step ? 'bg-primary' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <main className="flex-1 pb-28">{children}</main>

      <footer className="fixed inset-x-0 bottom-0 border-t border-border bg-surface/95 backdrop-blur-md shadow-overlay z-40">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-8 py-4">
          <div>{footerLeft}</div>
          <div>{footerRight}</div>
        </div>
      </footer>
    </div>
  )
}

export function WizardTitle({ title, subtitle, info }: { title: string; subtitle: string; info?: boolean }) {
  return (
    <div className="pt-8 pb-8 text-center">
      <h1 className="inline-flex items-center gap-3 text-[36px] font-semibold tracking-tight text-ink">
        {title}
        {info && (
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line bg-surface text-[13px] font-normal text-ink-2 shadow-subtle">
            i
          </span>
        )}
      </h1>
      <p className="pt-2.5 text-[15px] text-ink-2 max-w-[600px] mx-auto">{subtitle}</p>
    </div>
  )
}

/** Labeled input / textarea / select shells for wizard + property forms */
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="pb-6">
      <p className="pb-2 text-[14px] font-medium text-ink-2">{label}</p>
      {children}
    </div>
  )
}

export function TextInput({ value, placeholder, onChange }: { value?: string; placeholder?: string; onChange?: (val: string) => void }) {
  return (
    <input
      value={value}
      onChange={e => onChange?.(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-line bg-surface px-4 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-accent shadow-subtle"
    />
  )
}

export function TextArea({ value, placeholder, rows = 5, onChange }: { value?: string; placeholder?: string; rows?: number; onChange?: (val: string) => void }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange?.(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full resize-y rounded-lg border border-line bg-surface px-4 py-3 text-[15px] leading-relaxed text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-accent shadow-subtle"
    />
  )
}

export function SelectInput({ value, icon, options, onChange }: { value: string; icon?: ReactNode; options?: string[]; onChange?: (val: string) => void }) {
  if (options) {
    return (
      <div className="relative flex w-full items-center">
        {icon && <span className="absolute left-4">{icon}</span>}
        <select 
          value={value} 
          onChange={e => onChange?.(e.target.value)}
          className={`w-full appearance-none rounded-lg border border-line bg-surface py-3 pr-10 text-[15px] text-ink transition-colors hover:border-line-strong focus:outline-none focus:border-accent shadow-subtle ${icon ? 'pl-11' : 'pl-4'}`}
        >
          {options.map(opt => <option key={opt} value={opt} className="bg-surface text-ink">{opt}</option>)}
        </select>
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="pointer-events-none absolute right-4 text-ink-3">
          <path d="M4.5 7.5L10 13l5.5-5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    )
  }
  
  return (
    <button className="flex w-full items-center justify-between rounded-lg border border-line bg-surface px-4 py-3 text-[15px] text-ink transition-colors hover:border-line-strong shadow-subtle">
      <span className="flex items-center gap-3">{icon}{value}</span>
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="text-ink-3">
        <path d="M4.5 7.5L10 13l5.5-5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
