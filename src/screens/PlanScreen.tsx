import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { RightPanel, KV } from '../components/RightPanel'
import { TextShotStrip, type StripStatuses } from '../components/ShotStrip'
import { DocIcon, ChevronDown } from '../components/icons'
import { TextShimmer } from '../components/ui/shimmer-text'
import { getProductionShots } from '../data/api'
import { useProductionEvents } from '../hooks/useProductionEvents'

export function PlanScreen() {
  const [searchParams] = useSearchParams()
  const productionId = searchParams.get('productionId')
  
  const [shots, setShots] = useState<any[]>([])
  const [selected, setSelected] = useState<string>('')
  
  const { lastEvent } = useProductionEvents(productionId)

  // Fetch shots on mount and when SSE events arrive
  useEffect(() => {
    if (!productionId) return
    getProductionShots(productionId).then(data => {
      setShots(data)
      if (!selected && data.length > 0) {
        setSelected(data[0].id)
      }
    }).catch(err => console.error("Failed to load shots", err))
  }, [productionId, lastEvent])

  const statuses: StripStatuses = useMemo(() => {
    const st: StripStatuses = {}
    shots.forEach(s => {
      if (s.id === selected) st[s.id] = 'active'
      else if (s.status !== 'planned') st[s.id] = 'approved'
      else st[s.id] = 'pending'
    })
    return st
  }, [shots, selected])

  const shot = shots.find((s) => s.id === selected)
  const totalSec = shots.reduce((a, s) => a + (s.duration_seconds || 0), 0)

  return (
    <AppShell
      active="Plan"
      panel={
        <RightPanel
          render={(tab) =>
            tab === 'Details' && shot ? (
              <div>
                <h2 className="pb-4 text-[18px] font-semibold text-ink">
                  Space {String(shot.sequence_number).padStart(2, '0')} <span className="px-1 text-ink-3">·</span> {shot.story_function}
                </h2>
                <KV label="Duration" value={`${shot.duration_seconds} seconds`} />
                <KV label="Room / Area" value={shot.characters?.map((c:any) => c.name || c).join(', ') || 'Living & Balcony'} />
                <KV label="Location" value={shot.location_id || '8 Admiralty Way, Lekki'} />
                <KV label="Camera Path" value={`${shot.camera?.framing || 'Eye level'} · ${shot.camera?.movement || 'Continuous walkthrough'}`} />
                <KV label="Spatial Notes" value={shot.motion_prompt || 'Natural coastal daylight, open transition'} />

                <h3 className="pb-3 pt-6 text-[16px] font-semibold text-ink">Verified spatial references</h3>
                <ul className="flex flex-col gap-2.5">
                  {(shot.characters || []).map((c:any) => c.name || c).map((r:string) => (
                    <li key={r} className="flex items-center gap-3 text-[14px] text-ink-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      Space capture: {r}
                    </li>
                  ))}
                  <li className="flex items-center gap-3 text-[14px] text-ink-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Property: {shot.location_id || 'Main Floor Gallery'}
                  </li>
                </ul>

                <button className="mt-7 flex w-full items-center justify-between rounded-xl border border-line bg-surface px-4 py-3.5 text-[14.5px] transition-colors hover:bg-raised shadow-subtle text-ink">
                  <span className="flex items-center gap-3">
                    <DocIcon className="text-ink-2" />
                    Reconstruction parameters
                  </span>
                  <ChevronDown className="text-ink-3" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <TextShimmer className="text-[15px] font-medium" duration={2}>
                  Synthesizing spatial continuity & room layouts…
                </TextShimmer>
              </div>
            )
          }
        />
      }
      strip={<TextShotStrip shots={shots} statuses={statuses} selected={selected} onSelect={setSelected} />}
    >
      <div className="p-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[32px] font-semibold tracking-tight text-ink">Spatial Walkthrough Plan</h1>
            <p className="pt-2 text-[15px] text-ink-2">
              {shots.length > 0 ? (
                `${shots.length} space segments prepared for a ${Math.round(totalSec || 60)}-second continuous experience.`
              ) : (
                <TextShimmer className="text-[15px] font-medium text-ink" duration={2.2}>
                  OpenHouse is arranging space segments — they will appear here as the pipeline processes…
                </TextShimmer>
              )}
            </p>
          </div>
          <p className="pt-3 text-[14.5px] text-ink-2 font-medium">
            <span className="text-ink">{totalSec || 60} sec total</span>
            <span className="px-2 text-ink-3">·</span>
            {shots.length} spaces
          </p>
        </div>

        <div className="mt-8">
          {shots.length > 0 ? (
            shots.map((s) => {
              const isSel = s.id === selected
              const numStr = String(s.sequence_number).padStart(2, '0')
              return (
                <button
                  key={s.id}
                  onClick={() => setSelected(s.id)}
                  className={`flex w-full items-center gap-2 border px-4 py-[18px] text-left transition-colors mb-2 shadow-subtle ${
                    isSel
                      ? 'rounded-xl border-accent bg-surface shadow-[0_0_0_2px_var(--color-accent)]'
                      : 'rounded-xl border-line bg-surface hover:bg-raised'
                  }`}
                >
                  <span className="w-10 text-[15px] font-semibold text-ink-2">{numStr}</span>
                  <span className="pr-3 text-ink-3">·</span>
                  <span className={`w-[180px] text-[15px] font-semibold truncate ${isSel ? 'text-accent' : 'text-ink'}`}>{s.story_function}</span>
                  <span className="flex-1 text-[14px] text-ink-2 truncate">{s.keyframe_prompt || 'Natural coastal daylight transition'}</span>
                  <span className="text-[14px] text-ink-3 font-medium">{s.duration_seconds} sec</span>
                </button>
              )
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-64 gap-3 rounded-2xl border border-line bg-surface p-8 shadow-subtle">
              <TextShimmer className="text-[15px] font-medium" duration={2}>
                Synthesizing spatial geometry and room transitions…
              </TextShimmer>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}

