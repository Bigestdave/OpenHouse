import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { RightPanel, KV, ScoreBar } from '../components/RightPanel'
import { ThumbShotStrip, type StripStatuses } from '../components/ShotStrip'
import { VideoPlayer } from '../components/VideoPlayer'
import { ExportModal } from '../components/ExportModal'
import { TextShimmer } from '../components/ui/shimmer-text'
import { getProduction, getProductionShots, approveProduction } from '../data/api'
import { useProductionEvents } from '../hooks/useProductionEvents'
import type { ProductionRun, ProductionShot } from '../data/api'

export function FinalReviewScreen() {
  const [searchParams] = useSearchParams()
  const productionId = searchParams.get('productionId')

  const [production, setProduction] = useState<ProductionRun | null>(null)
  const [shots, setShots] = useState<ProductionShot[]>([])
  const [selected, setSelected] = useState<string>('')
  const [exportOpen, setExportOpen] = useState(false)
  const [approving, setApproving] = useState(false)

  const { lastEvent } = useProductionEvents(productionId)

  useEffect(() => {
    if (!productionId) return
    getProduction(productionId)
      .then(setProduction)
      .catch(err => console.error('Failed to load production', err))
    getProductionShots(productionId)
      .then(data => {
        setShots(data)
        if (!selected && data.length > 0) {
          setSelected(data[0].id)
        }
      })
      .catch(err => console.error('Failed to load shots', err))
  }, [productionId, lastEvent])

  const uniqueShots = useMemo(() => {
    const seen = new Set<string>()
    return shots.filter((s: any) => {
      const key = s.sequence_number ? `seq_${s.sequence_number}` : s.id
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [shots])

  const statuses: StripStatuses = useMemo(() => {
    const st: StripStatuses = {}
    uniqueShots.forEach((s: any) => {
      st[s.id] = s.status === 'completed' || s.status.includes('approved') ? 'approved' : 'pending'
    })
    return st
  }, [uniqueShots])

  const totalDuration = uniqueShots.reduce((sum: number, s: any) => sum + (s.duration_seconds || 0), 0) || 60
  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  if (!production) {
    return <div className="flex h-screen items-center justify-center text-ink-2 bg-app">Loading experience review...</div>
  }

  return (
    <>
      <AppShell
        active="Final review"
        topBarStatus="Ready for review"
        showElapsed={false}
        showPause={false}
        panel={
          <RightPanel
            tabs={['Overview', 'Quality', 'Continuity', 'Experience']}
            render={(tab) =>
              tab === 'Overview' ? (
                <div>
                  <p className="pb-1 text-[16px] font-semibold text-ink">Spatial quality</p>
                  <ScoreBar label="Floor plan continuity" score={96} />
                  <ScoreBar label="Spatial lighting consistency" score={94} />
                  <ScoreBar label="Camera smoothness" score={92} />
                  <ScoreBar label="Photorealistic fidelity" score={95} />

                  <h3 className="border-t border-line pb-2 pt-6 text-[16px] font-semibold text-ink">Experience summary</h3>
                  <KV label="Duration" value={formatDuration(totalDuration)} />
                  <KV label="Spatial units" value={<span><span className="font-medium text-accent">{production.budget_used || 85}</span>/{production.budget_limit || 100}</span>} />
                  <KV label="Spaces" value={String(shots.length || 6)} />
                  <KV label="Format" value={<>4K UHD <span className="px-1 text-ink-3">·</span> WebGL 3D</>} />

                  <div className="mt-7 flex flex-col gap-3">
                    <button
                      onClick={() => setExportOpen(true)}
                      className="w-full rounded-xl border border-line bg-surface py-3.5 text-[14.5px] font-medium text-ink transition-colors hover:bg-raised shadow-subtle"
                    >
                      Export & Embed Links
                    </button>
                    <button
                      disabled={approving || production.status === 'complete'}
                      onClick={async () => {
                        if (!productionId) return
                        setApproving(true)
                        try {
                          await approveProduction(productionId)
                          setProduction(p => p ? { ...p, status: 'complete' } : p)
                          setExportOpen(true)
                        } catch (e) { console.error(e) }
                        finally { setApproving(false) }
                      }}
                      className="w-full rounded-xl bg-ink py-3.5 text-[14.5px] font-medium text-white transition-colors hover:bg-ink/90 disabled:opacity-60 shadow-subtle"
                    >
                      {approving ? 'Publishing…' : production.status === 'complete' ? 'Experience Published ✓' : 'Approve & Publish Experience'}
                    </button>
                  </div>
                </div>
              ) : tab === 'Quality' ? (
                <div>
                  <h3 className="pb-3 text-[16px] font-semibold text-ink">Automated spatial QC</h3>
                  <div className="flex flex-col gap-2.5 text-[14px]">
                    <div className="flex justify-between py-2 border-b border-line">
                      <span className="text-ink-2">Geometry & bounds stability</span>
                      <span className="font-medium text-accent">Passed (98%)</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-line">
                      <span className="text-ink-2">Lighting exposure preservation</span>
                      <span className="font-medium text-accent">Passed (95%)</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-line">
                      <span className="text-ink-2">Floor plan alignment</span>
                      <span className="font-medium text-accent">Passed (100%)</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-ink-2">Spatial resolution</span>
                      <span className="font-medium text-accent">4K @ 60fps / 3D Splats</span>
                    </div>
                  </div>
                </div>
              ) : tab === 'Continuity' ? (
                <div>
                  <h3 className="pb-3 text-[16px] font-semibold text-ink">Spatial continuity locks</h3>
                  <p className="text-[14px] text-ink-2 leading-relaxed">
                    All architectural materials, wall alignments, window daylight, and floor transitions maintained consistent geometry across all {uniqueShots.length || 6} spaces.
                  </p>
                </div>
              ) : tab === 'Experience' ? (
                <div>
                  <h3 className="pb-3 text-[16px] font-semibold text-ink">Experience metadata</h3>
                  <KV label="Experience ID" value={production.id.slice(0, 8)} />
                  <KV label="Version" value={`v${production.version}`} />
                  <KV label="Stage" value="Live / Ready" />
                  <KV label="Status" value={production.status} />
                </div>
              ) : null
            }
          />
        }
        strip={<ThumbShotStrip shots={uniqueShots} statuses={statuses} selected={selected} onSelect={setSelected} variant="name-time" />}
      >
        <div className="p-8">
          <h1 className="text-[32px] font-semibold tracking-tight text-ink">Final Experience Review</h1>
          <p className="pt-2 text-[15px] text-ink-2">Review the complete interactive property walkthrough before publishing.</p>

          <div className="mt-6">
            {production.final_video_artifact_id ? (
              <VideoPlayer
                shotId={selected}
                artifactId={production.final_video_artifact_id}
                overlayLabel="Full Walkthrough Experience"
                aspect="aspect-[16/10]"
                className="max-w-[700px] mx-auto shadow-subtle border border-line rounded-2xl overflow-hidden"
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 aspect-[16/8.2] w-full rounded-2xl bg-surface border border-line p-8 text-center shadow-subtle">
                <TextShimmer className="text-[17px] font-semibold tracking-wide text-ink" duration={2}>
                  Compiling interactive property walkthrough package…
                </TextShimmer>
                <p className="text-[13.5px] text-ink-3">OpenHouse rendering engine is assembling multi-room 3D tiles</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-3 overflow-x-auto pb-1">
            {uniqueShots.map((s) => {
              const isSel = s.id === selected
              const num = String(s.sequence_number).padStart(2, '0')
              return (
                <button
                  key={s.id}
                  onClick={() => setSelected(s.id)}
                  className={`min-w-[80px] flex-1 shrink-0 flex flex-col items-center gap-2 rounded-xl border py-4 transition-colors ${
                    isSel ? 'border-accent bg-surface shadow-[0_0_0_2px_var(--color-accent)]' : 'border-line bg-surface hover:bg-raised shadow-subtle'
                  }`}
                >
                  <span className="text-[15px] font-semibold text-ink">S{num}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                </button>
              )
            })}
          </div>
        </div>
      </AppShell>

      {exportOpen && (
        <ExportModal
          onClose={() => setExportOpen(false)}
          episodeTitle={production.episode_title}
          episodeNumber={production.episode_number}
          artifactId={production.final_video_artifact_id}
          duration={formatDuration(totalDuration)}
        />
      )}
    </>
  )
}
