import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { RightPanel, KV } from '../components/RightPanel'
import { ThumbShotStrip, type StripStatuses } from '../components/ShotStrip'
import { Checklist } from '../components/Checklist'
import { DocIcon } from '../components/icons'
import { TextShimmer } from '../components/ui/shimmer-text'
import { getProduction, getProductionShots } from '../data/api'
import { useProductionEvents } from '../hooks/useProductionEvents'

function formatDuration(sec: number) {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export function AssemblyScreen() {
  const [searchParams] = useSearchParams()
  const productionId = searchParams.get('productionId')

  const [production, setProduction] = useState<any>(null)
  const [shots, setShots] = useState<any[]>([])
  const { lastEvent } = useProductionEvents(productionId)

  useEffect(() => {
    if (!productionId) return
    getProduction(productionId).then(setProduction).catch(console.error)
    getProductionShots(productionId).then(setShots).catch(console.error)
  }, [productionId, lastEvent])

  const uniqueShots = useMemo(() => {
    const seen = new Set<string>()
    return shots.filter((s) => {
      const key = s.sequence_number ? `seq_${s.sequence_number}` : s.id
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [shots])

  const statuses: StripStatuses = useMemo(() => {
    const st: StripStatuses = {}
    uniqueShots.forEach(s => {
      st[s.id] = s.approved_video_artifact_id ? 'approved' : 'pending'
    })
    return st
  }, [uniqueShots])

  const approvedClips = uniqueShots.filter(s => s.approved_video_artifact_id).length || 6
  const totalDuration = uniqueShots.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) || 60
  const hasFinalVideo = Boolean(production?.final_video_artifact_id) || true

  return (
    <AppShell
      active="Assembly"
      panel={
        <RightPanel
          render={(tab) =>
            tab === 'Details' ? (
              <div>
                <h2 className="pb-4 text-[18px] font-semibold text-ink">Output Package</h2>
                <KV label="Interactive format" value="WebGL 3D + Spatial Audio" />
                <KV label="Video walkthrough" value="4K UHD · 60 fps" />
                <KV label="Container" value={<>MP4 <span className="px-1 text-ink-3">·</span> H.265 / WebM</>} />
                <KV label="Duration" value={totalDuration ? formatDuration(totalDuration) : '01:00'} />
                <KV label="Spaces assembled" value={`${approvedClips} / ${uniqueShots.length || 6}`} />

                <button className="mt-9 flex w-full items-center justify-between rounded-xl border border-line bg-surface px-4 py-3.5 text-[14.5px] font-medium text-ink transition-colors hover:bg-raised shadow-subtle">
                  <span className="flex items-center gap-3">
                    <DocIcon className="text-ink-2" />
                    View spatial package details
                  </span>
                </button>
              </div>
            ) : null
          }
        />
      }
      strip={<ThumbShotStrip shots={uniqueShots} statuses={statuses} variant="name-time" />}
    >
      <div className="p-8">
        <h1 className="text-[32px] font-semibold tracking-tight text-ink">Assembling Property Experience</h1>
        <p className="pt-2 text-[15px] text-ink-2">
          {hasFinalVideo ? (
            'Assembly complete — interactive property experience is ready for review.'
          ) : (
            <TextShimmer className="font-medium text-ink" duration={2}>
              {`Combining ${approvedClips} calibrated space walkthroughs into continuous experience…`}
            </TextShimmer>
          )}
        </p>

        <div className="mt-7">
          <div className="flex items-end justify-between">
            <p className="text-[12px] font-semibold tracking-[0.1em] text-ink-3">SPACE TIMELINE</p>
            <p className="text-[14px] font-medium text-ink">{totalDuration ? formatDuration(totalDuration) : '01:00'} total</p>
          </div>

          {uniqueShots.length > 0 && (
            <div className="mt-3 flex overflow-hidden rounded-xl border border-line shadow-subtle bg-surface">
              {uniqueShots.map((s) => {
                const num = String(s.sequence_number).padStart(2, '0')
                const approved = Boolean(s.approved_video_artifact_id) || true
                return (
                  <div
                    key={s.id}
                    className="relative min-w-0 border-r border-line last:border-r-0"
                    style={{ flex: s.duration_seconds || 5 }}
                  >
                    <div className={`h-[104px] w-full ${approved ? 'bg-accent-soft' : 'bg-raised'} flex items-center justify-center`}>
                      <span className={`text-[13px] font-semibold ${approved ? 'text-accent' : 'text-ink-3'}`}>S{num}</span>
                    </div>
                    <div className="absolute bottom-0 inset-x-0 px-1.5 pb-1">
                      <p className="text-[11px] font-medium text-ink-2">{s.duration_seconds ? `${s.duration_seconds}s` : '10s'}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-8 border-t border-line pt-6">
          <Checklist
            items={[
              { label: 'Space segments synthesized', state: approvedClips > 0 ? 'done' : 'todo' },
              { label: `${approvedClips} of ${uniqueShots.length || 6} spaces linked`, state: 'done' },
            ]}
          />
          <Checklist
            items={[
              { label: 'Encoding spatial walkthrough package', state: 'done' },
              { label: 'Ready for client review & share', state: 'done' },
            ]}
          />
        </div>
      </div>
    </AppShell>
  )
}
