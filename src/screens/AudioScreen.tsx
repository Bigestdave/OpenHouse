import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { RightPanel, KV } from '../components/RightPanel'
import { ThumbShotStrip, type StripStatuses } from '../components/ShotStrip'
import { Checklist } from '../components/Checklist'
import { MusicNote } from '../components/icons'
import { TextShimmer } from '../components/ui/shimmer-text'
import { getProduction, getProductionShots } from '../data/api'
import { useProductionEvents } from '../hooks/useProductionEvents'

export function AudioScreen() {
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

  const statuses: StripStatuses = useMemo(() => {
    const st: StripStatuses = {}
    shots.forEach(s => { st[s.id] = s.approved_video_artifact_id ? 'approved' : 'pending' })
    return st
  }, [shots])

  return (
    <AppShell
      active="Audio"
      panel={
        <RightPanel
          render={(tab) =>
            tab === 'Details' ? (
              <div>
                <h2 className="pb-4 text-[18px] font-semibold text-ink">Spatial Audio</h2>
                <KV label="Property" value={production?.show_title || '8 Admiralty Way'} />
                <KV label="Audio Track" value="Ambient coastal soundscape" />
                <KV label="Status" value="Pass-through" />
              </div>
            ) : null
          }
        />
      }
      strip={<ThumbShotStrip shots={shots} statuses={statuses} variant="plain" />}
    >
      <div className="p-8">
        <h1 className="text-[32px] font-semibold tracking-tight text-ink">Spatial Audio</h1>
        <p className="pt-2 text-[15px] text-ink-2">
          <TextShimmer className="font-medium" duration={2}>
            Passing ambient audio track — advancing directly to tour assembly…
          </TextShimmer>
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-5 rounded-xl border border-line bg-surface py-14 text-center shadow-subtle">
          <MusicNote size={36} className="text-ink-3" />
          <p className="text-[17px] font-semibold text-ink">Standard Ambient Audio Track</p>
          <p className="max-w-[440px] text-[14px] leading-relaxed text-ink-2">
            OpenHouse delivers clean ambient acoustic profiles for spatial walkthroughs. Custom voiceover and agent narration can be added after final assembly.
          </p>
        </div>

        <div className="mt-8 max-w-[400px]">
          <Checklist
            items={[
              { label: 'Ambient soundscape configured', state: 'done' },
              { label: 'Proceeding to tour assembly', state: production?.current_stage === 'ASSEMBLY' ? 'done' : 'active' },
            ]}
          />
        </div>
      </div>
    </AppShell>
  )
}
