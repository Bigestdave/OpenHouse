import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { WorkspaceShell } from '../components/WorkspaceShell'
import { CheckCircle, ChevronDown } from '../components/icons'
import { ClockIcon } from '../components/icons2'
import { TextShimmer } from '../components/ui/shimmer-text'
import { generateEpisodeDraft, createEpisode, startProduction, getShow, type Show } from '../data/api'

export function NewEpisodeScreen() {
  const [searchParams] = useSearchParams()
  const showId = searchParams.get('showId') || ''
  const navigate = useNavigate()

  const [show, setShow] = useState<Show | null>(null)
  const [ideaSeed, setIdeaSeed] = useState('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!showId) return
    getShow(showId).then(setShow).catch(console.error)
  }, [showId])

  const inherited = show
    ? [
        `${show.title} architectural profile`,
        `Continuous spatial walkthrough format`,
        `Lagos daylight calibration inherited`,
        `High-resolution space references locked`,
      ]
    : []

  const runPlan = async (seed: string) => {
    setLoading(true)
    setError(null)
    try {
      setProgress(seed ? 'OpenHouse is drafting spatial experience…' : 'OpenHouse is synthesizing property spaces…')
      let productionId = 'prod-01'
      try {
        const draft = await generateEpisodeDraft(showId, seed)
        const episode = await createEpisode(showId, {
          ...draft,
          duration_seconds: show?.default_duration_seconds || 45,
        })
        const production = await startProduction(episode.id)
        productionId = production.production_id
      } catch {
        // Mock fallback
        productionId = 'prod-01'
      }

      navigate(`/plan?productionId=${productionId}`)
    } catch (err) {
      console.error(err)
      navigate(`/plan?productionId=prod-01`)
    }
  }

  return (
    <WorkspaceShell
      breadcrumb={<><span>{show?.title || 'Property'}</span><span className="px-2 text-ink-3">/</span><span>New experience</span></>}
      backTo={showId ? `/show/${showId}` : '/shows'}
    >
      <div className="mx-auto max-w-[1280px] px-8 pb-8">
        <div className="grid grid-cols-[1fr_400px] gap-10">
          {/* Left: form */}
          <div>
            <h1 className="text-[30px] font-semibold tracking-tight text-ink">Create property experience</h1>
            <p className="pt-1.5 text-[15px] text-ink-2">
              Specify tour focus or highlights — or let OpenHouse automatically synthesize the optimal walkthrough sequence.
            </p>

            <p className="pb-2 pt-7 text-[14px] font-medium text-ink-2">Experience highlights & focus (optional)</p>
            <textarea
              rows={5}
              value={ideaSeed}
              onChange={(e) => setIdeaSeed(e.target.value)}
              placeholder="e.g. Focus on the sunset terrace views and the marble chef kitchen — or leave empty for full standard property walkthrough"
              className="w-full resize-y rounded-lg border border-line bg-surface px-4 py-3 text-[15px] text-ink leading-relaxed outline-none transition-colors focus:border-accent shadow-subtle"
            />

            <div className="mt-3 flex items-center justify-between">
              <p className="text-[13px] text-ink-3">
                No notes needed — OpenHouse maps all verified property spaces automatically.
              </p>
              <button
                type="button"
                onClick={() => runPlan('')}
                disabled={loading}
                className="flex shrink-0 items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2 text-[14px] font-medium text-accent transition-colors hover:bg-accent-soft disabled:opacity-50 shadow-subtle"
              >
                <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2l1.8 4.6L16.5 8l-4.7 1.4L10 14l-1.8-4.6L3.5 8l4.7-1.4L10 2z" fill="currentColor" />
                </svg>
                Auto-generate tour sequence
              </button>
            </div>

            <p className="pb-2 pt-6 text-[14px] font-medium text-ink-2">Tour duration</p>
            <div className="flex w-full items-center justify-between rounded-lg border border-line bg-surface px-4 py-3 text-[15px] shadow-subtle">
              <span className="flex items-center gap-3 text-ink">
                <ClockIcon size={16} className="text-ink-2" />
                Default walkthrough speed <span className="px-0.5 text-ink-3">·</span> {show?.default_duration_seconds || 60} seconds
              </span>
            </div>
          </div>

          {/* Right: inherited assets */}
          <aside className="pt-[72px]">
            <div className="rounded-xl border border-line bg-surface p-6 shadow-subtle">
              <p className="pb-4 text-[16px] font-semibold text-ink">Inherited from Property</p>
              <ul className="flex flex-col gap-3.5">
                {(inherited.length ? inherited : ['Loading property context…']).map((i) => (
                  <li key={i} className="flex items-center gap-3 text-[14px] text-ink-2">
                    <span className="text-accent font-semibold"><CheckCircle size={17} /></span>
                    {i}
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-line pt-5">
                <div className="flex w-full items-center justify-between text-left">
                  <div>
                    <p className="text-[15px] font-medium text-ink">Spatial preferences</p>
                    <p className="pt-1 text-[13.5px] text-ink-3">Property defaults will be used</p>
                  </div>
                  <ChevronDown className="text-ink-3" />
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between border-t border-line pt-5">
          <span />
          <div className="flex items-center gap-5">
            {error && <p className="max-w-[400px] text-right text-[13.5px] text-danger">{error}</p>}
            {loading && progress ? (
              <div className="text-right">
                <TextShimmer className="text-[14px] font-medium leading-snug" duration={2}>
                  {progress}
                </TextShimmer>
              </div>
            ) : (
              <p className="text-right text-[13.5px] leading-snug text-ink-3">
                OpenHouse will structure the spatial path<br />and prepare the interactive viewer.
              </p>
            )}
            <button
              onClick={() => runPlan(ideaSeed)}
              disabled={loading}
              className="flex items-center gap-2.5 rounded-lg bg-ink px-6 py-3 text-[15px] font-medium text-white transition-colors hover:bg-ink/90 disabled:opacity-50 shadow-subtle"
            >
              {loading ? 'Preparing…' : 'Prepare experience'}
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M4 10h12M11 4.5L16.5 10 11 15.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </WorkspaceShell>
  )
}
