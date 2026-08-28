import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { RightPanel, ScoreBar } from '../components/RightPanel'
import { ThumbShotStrip, Thumb, type StripStatuses } from '../components/ShotStrip'
import { VideoPlayer } from '../components/VideoPlayer'
import { Checklist } from '../components/Checklist'
import { ChevronRight } from '../components/icons'
import { TextShimmer } from '../components/ui/shimmer-text'
import { getProductionShots } from '../data/api'
import { useProductionEvents } from '../hooks/useProductionEvents'

export function AnimationScreen() {
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
        // Select an active shot
        const activeShot = data.find((s: any) => s.status.includes('video_')) || data[0]
        setSelected(activeShot.id)
      }
    }).catch(err => console.error("Failed to load shots", err))
  }, [productionId, lastEvent])

  const statuses: StripStatuses = useMemo(() => {
    const st: StripStatuses = {}
    shots.forEach(s => {
      if (s.id === selected) {
        st[s.id] = 'active'
        return
      }
      if (s.status.includes('video_approved') || s.status === 'completed') st[s.id] = 'approved'
      else if (s.status.includes('video_retry') || s.status.includes('needs_attention')) st[s.id] = 'warning'
      else if (s.status.includes('video_')) st[s.id] = 'generating'
      else st[s.id] = 'pending'
    })
    return st
  }, [shots, selected])

  const selectedShot = shots.find(s => s.id === selected)
  const isApproved = selectedShot?.status.includes('video_approved') || selectedShot?.status === 'completed'
  const isGenerating = selectedShot?.status.includes('generating')
  const numStr = selectedShot ? String(selectedShot.sequence_number).padStart(2, '0') : '01'

  return (
    <AppShell
      active="Animation"
      panel={
        <RightPanel
          defaultTab="Quality"
          render={(tab) =>
            tab === 'Quality' && selectedShot ? (
              <div>
                <ScoreBar label="Walkthrough smoothness" score={96} />
                <ScoreBar label="Spatial geometry stability" score={94} />
                <ScoreBar label="Camera path precision" score={92} />
                <ScoreBar label="Lighting coherence" score={95} />
                <ScoreBar label="Depth map alignment" score={91} />
                <ScoreBar label="Texture clarity" score={89} />

                <div className="mt-6 border-t border-line pt-6">
                  <p className="text-[15.5px] font-semibold text-ink">Synthesis status</p>
                  <p className={`flex items-center gap-2.5 pt-3 text-[14px] ${isApproved ? 'text-accent font-medium' : 'text-ink-2'}`}>
                    <span className={`h-2 w-2 rounded-full ${isApproved ? 'bg-accent' : 'bg-ink-3'}`} />
                    {isApproved ? 'Synthesized & Approved' : isGenerating ? 'Rendering camera path...' : 'Reviewing motion quality...'}
                  </p>
                </div>

                <button className="mt-7 flex w-full items-center justify-between rounded-xl border border-line bg-surface px-4 py-3.5 text-[14.5px] font-medium text-ink transition-colors hover:bg-raised shadow-subtle">
                  <span>View synthesis details</span>
                  <ChevronRight className="text-ink-3" />
                </button>
              </div>
            ) : tab === 'Details' && selectedShot ? (
              <div>
                <p className="pb-1 text-[16px] font-semibold text-ink">Space {numStr}</p>
                <p className="text-[13.5px] text-ink-2">{selectedShot.story_function}</p>

                <div className="mt-5 border-t border-line pt-5">
                  <p className="pb-1.5 text-[13px] font-medium text-ink-3">Camera path trajectory</p>
                  <p className="text-[13.5px] italic leading-relaxed text-ink-2">
                    {selectedShot.motion_prompt || 'Smooth eye-level transition through natural daylight'}
                  </p>
                </div>

                <div className="mt-5 border-t border-line pt-5">
                  <p className="pb-3 text-[13px] font-medium text-ink-3">Calibrated keyframe</p>
                  <Thumb
                    shotId={`S${numStr}`}
                    artifactId={selectedShot.approved_keyframe_artifact_id}
                    className="aspect-[4/3] w-full rounded-xl border border-line shadow-subtle object-cover"
                  />
                </div>

                <div className="mt-5 border-t border-line pt-5">
                  <Checklist
                    items={[
                      { label: 'Spatial keyframe calibrated', state: 'done' },
                      { label: 'Camera spline generated', state: 'done' },
                      { label: 'Walkthrough segment synthesized', state: isApproved || !isGenerating ? 'done' : 'todo' },
                      { label: 'Depth & texture validation', state: isApproved ? 'done' : 'todo' },
                    ]}
                  />
                </div>
              </div>
            ) : null
          }
        />
      }
      strip={
        <ThumbShotStrip
          shots={shots}
          statuses={statuses}
          selected={selected}
          onSelect={setSelected}
          variant="name-sec"
          caption={(id) =>
            id === selected && isGenerating ? <p className="px-1 pt-0.5 text-[12px] text-ink-3">⟳ Processing</p> : null
          }
        />
      }
    >
      <div className="flex h-full items-center justify-center p-6">
        {selectedShot ? (
          <VideoPlayer
            shotId={`S${numStr}`}
            artifactId={selectedShot.approved_video_artifact_id}
            overlayLabel={`Space ${numStr} · ${selectedShot.story_function}`}
            className="h-full max-h-[calc(100vh-220px)] w-auto rounded-xl shadow-subtle border border-line"
            aspect="aspect-[16/10]"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 p-10 text-center">
            <TextShimmer className="text-[17px] font-semibold tracking-wide" duration={2.2}>
              Synthesizing 3D walkthrough continuous camera path…
            </TextShimmer>
            <p className="text-[13.5px] text-ink-3">OpenHouse spatial neural engine is reconstructing room transitions</p>
          </div>
        )}
      </div>
    </AppShell>
  )
}

