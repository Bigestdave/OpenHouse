import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { RightPanel, ScoreBar } from '../components/RightPanel'
import { ThumbShotStrip, Thumb, type StripStatuses } from '../components/ShotStrip'
import { ChevronRight, ChevronDown } from '../components/icons'
import { TextShimmer } from '../components/ui/shimmer-text'
import { getProductionShots } from '../data/api'
import { useProductionEvents } from '../hooks/useProductionEvents'

export function KeyframesReviewScreen() {
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
        // Try to select an active shot, otherwise first shot
        const activeShot = data.find((s: any) => s.status.includes('keyframe_')) || data[0]
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
      if (s.status.includes('keyframe_approved') || s.status.includes('video_') || s.status === 'completed') st[s.id] = 'approved'
      else if (s.status.includes('keyframe_retry') || s.status.includes('needs_attention')) st[s.id] = 'warning'
      else if (s.status.includes('keyframe_')) st[s.id] = 'generating'
      else st[s.id] = 'pending'
    })
    return st
  }, [shots, selected])

  const selectedShot = shots.find(s => s.id === selected)
  const isApproved = selectedShot?.status.includes('keyframe_approved') || selectedShot?.status.includes('video_') || selectedShot?.status === 'completed'
  const numStr = selectedShot ? String(selectedShot.sequence_number).padStart(2, '0') : '01'

  return (
    <AppShell
      active="Keyframes"
      sidebarBadges={{ Keyframes: `${shots.filter(s => s.status.includes('keyframe_approved') || s.status.includes('video_') || s.status === 'completed').length || 6}/${shots.length || 6}` }}
      panel={
        <RightPanel
          defaultTab="Quality"
          render={(tab) =>
            tab === 'Quality' && selectedShot ? (
              <div>
                <ScoreBar label="Spatial accuracy" score={94} />
                <ScoreBar label="Geometry precision" score={96} />
                <ScoreBar label="Natural lighting" score={92} />
                <ScoreBar label="Texture fidelity" score={89} />
                <ScoreBar label="Floorplan alignment" score={95} />

                <div className="mt-4 border-t border-line pt-6">
                  <p className="flex items-center gap-2.5 text-[15.5px] font-semibold text-ink">
                    <span className="text-accent font-bold">✓</span>
                    Approved for 3D walkthrough
                  </p>
                  <p className="pt-2 text-[14px] text-ink-2">Spatial geometry and continuous room lighting are calibrated.</p>
                </div>

                <Link
                  to={`/keyframes-retry?productionId=${productionId}`}
                  className="mt-7 flex w-full items-center justify-between rounded-xl border border-line bg-surface px-4 py-3.5 text-[14.5px] font-medium text-ink transition-colors hover:bg-raised shadow-subtle"
                >
                  View calibration report
                  <ChevronRight className="text-ink-3" />
                </Link>
              </div>
            ) : null
          }
        />
      }
      strip={<ThumbShotStrip shots={shots} statuses={statuses} selected={selected} onSelect={setSelected} variant="plain" />}
    >
      <div className="flex h-full flex-col justify-between p-8">
        {selectedShot ? (
          <>
            <div className="flex gap-8">
              {/* Left: title */}
              <h1 className="shrink-0 pt-1 text-[26px] font-semibold tracking-tight text-ink">
                Space {numStr} <span className="px-1 text-[20px] font-normal text-ink-3">·</span>{' '}
                <span className="text-[22px] font-normal text-ink-2">{selectedShot.story_function}</span>
              </h1>

              {/* Center: portrait keyframe */}
              <div className="flex flex-1 flex-col items-center">
                <Thumb shotId={`S${numStr}`} artifactId={selectedShot.approved_keyframe_artifact_id} className="aspect-[4/3] w-[460px] rounded-xl border border-line shadow-subtle object-cover" />

                <div className="w-[460px] pt-5">
                  <p className="flex items-center gap-2.5 text-[15px] font-semibold text-ink">
                    <span className="flex h-[15px] w-[15px] items-center justify-center rounded-full border-2 border-accent">
                      <span className="h-[5px] w-[5px] rounded-full bg-accent" />
                    </span>
                    {isApproved ? 'Spatial keyframe calibrated' : 'Calibrating keyframe'}
                  </p>
                  <p className="pl-[26px] pt-1 text-[13.5px] text-ink-2">
                    {isApproved ? 'LiDAR geometry, depth and lighting aligned.' : 'Checking spatial depth, camera elevation, and daylight exposure.'}
                  </p>

                  <button className="mt-4 flex w-full items-center justify-between rounded-xl border border-line bg-surface px-4 py-3 text-[14px] text-ink transition-colors hover:bg-raised shadow-subtle">
                    <span>Reconstruction passes completed</span>
                    <ChevronDown size={15} className="text-ink-3" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 p-12 text-center">
            <TextShimmer className="text-[16px] font-medium tracking-wide" duration={2}>
              Rendering photorealistic spatial viewpoints…
            </TextShimmer>
            <p className="text-[13.5px] text-ink-3">OpenHouse 3D synthesis engine is constructing lighting and depth fields</p>
          </div>
        )}
      </div>
    </AppShell>
  )
}

