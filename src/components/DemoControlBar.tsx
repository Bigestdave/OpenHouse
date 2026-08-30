/**
 * DemoControlBar.tsx
 * Hidden floating bar (bottom-right) that lets the presenter manually advance
 * the demo through stages during a live recording.
 * Toggled by pressing the ` (backtick) key or clicking the tiny OpenHouse logo chip.
 */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDemoContext, type DemoStage } from '../context/DemoContext'

const STAGE_LABELS: Record<DemoStage, string> = {
  0: 'Idle',
  1: 'Listing imported',
  2: 'Build in progress',
  3: 'Capture issue detected',
  4: 'Recapture received',
  5: 'Ready for approval',
  6: 'Approved & live',
}

const STAGE_ROUTES: Partial<Record<DemoStage, string>> = {
  1: '/property/laurel-12a',
  2: '/property/laurel-12a',
  3: '/capture-requests/laurel-balcony',
  4: '/property/laurel-12a',
  5: '/approvals',
  6: '/view/laurel-12a',
}

export function DemoControlBar() {
  const [open, setOpen] = useState(false)
  const { stage, advance, setStage, resetDemo } = useDemoContext()
  const navigate = useNavigate()

  // Toggle with backtick key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === '`' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        setOpen((p) => !p)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function handleAdvance() {
    advance()
    const nextStage = ((stage < 6 ? stage + 1 : 6) as DemoStage)
    const route = STAGE_ROUTES[nextStage]
    if (route) setTimeout(() => navigate(route), 300)
  }

  return (
    <>
      {/* Tiny toggle chip */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="fixed bottom-4 right-4 z-[9998] h-7 w-7 rounded-full bg-[#194534] shadow-lg flex items-center justify-center opacity-30 hover:opacity-80 transition-opacity"
        title="Toggle demo controller (` key)"
        aria-label="Demo controller"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="6" stroke="white" strokeWidth="1.5"/>
          <path d="M7 4v3.5L9 9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Control panel */}
      {open && (
        <div className="fixed bottom-14 right-4 z-[9997] w-[280px] rounded-2xl bg-[#0B1713] border border-[#293A32] shadow-[0_16px_48px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#293A32]">
            <p className="text-[11px] font-bold tracking-widest text-[#5A7A65] uppercase">Demo Controller</p>
            <p className="text-[13px] font-semibold text-white mt-0.5">
              Stage {stage}: {STAGE_LABELS[stage]}
            </p>
          </div>

          <div className="p-3 flex flex-col gap-2">
            {/* Stage buttons */}
            {([0,1,2,3,4,5,6] as DemoStage[]).map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStage(s)
                  const route = STAGE_ROUTES[s]
                  if (route) setTimeout(() => navigate(route), 300)
                }}
                className={`flex items-center gap-2.5 w-full rounded-lg px-3 py-1.5 text-left text-[12.5px] transition-colors ${
                  stage === s
                    ? 'bg-[#194534] text-white font-semibold'
                    : 'text-[#8AAB96] hover:bg-[#162B1E] hover:text-white font-medium'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${stage === s ? 'bg-[#4ADE80]' : 'bg-[#293A32]'}`} />
                {s}: {STAGE_LABELS[s]}
              </button>
            ))}
          </div>

          <div className="border-t border-[#293A32] p-3 flex gap-2">
            <button
              onClick={handleAdvance}
              disabled={stage >= 6}
              className="flex-1 rounded-lg bg-[#194534] hover:bg-[#236148] disabled:opacity-30 text-white text-[12.5px] font-bold py-2 transition-colors"
            >
              Next stage
            </button>
            <button
              onClick={() => { resetDemo(); setOpen(false) }}
              className="rounded-lg border border-[#293A32] text-[#8AAB96] hover:bg-[#162B1E] text-[12.5px] font-semibold px-3 py-2 transition-colors"
            >
              Reset
            </button>
          </div>

          <p className="text-center text-[10px] text-[#3D5A46] pb-2">Press ` to toggle</p>
        </div>
      )}
    </>
  )
}
