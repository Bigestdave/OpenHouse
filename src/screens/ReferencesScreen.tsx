import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { RightPanel, KV } from '../components/RightPanel'
import { ThumbShotStrip, type StripStatuses } from '../components/ShotStrip'
import { Checklist } from '../components/Checklist'
import { Spinner } from '../components/icons'
import { TextShimmer } from '../components/ui/shimmer-text'
import { characterRefImage } from '../data/artwork'
import { getProduction, getProductionShots, listCharacters, listCharacterReferences, generateCharacterReference, getArtifactDownloadUrl } from '../data/api'
import { useProductionEvents } from '../hooks/useProductionEvents'

export function ReferencesScreen() {
  const [searchParams] = useSearchParams()
  const productionId = searchParams.get('productionId')

  const [production, setProduction] = useState<any>(null)
  const [shots, setShots] = useState<any[]>([])
  const [characters, setCharacters] = useState<any[]>([])
  const [refsByChar, setRefsByChar] = useState<Record<string, any[]>>({})
  const [generating, setGenerating] = useState<Record<string, boolean>>({})
  const { lastEvent } = useProductionEvents(productionId)

  // Load production → property → spaces → references
  useEffect(() => {
    if (!productionId) return
    getProduction(productionId)
      .then(async (prod) => {
        setProduction(prod)
        if (!prod.show_id) return
        const chars = await listCharacters(prod.show_id)
        setCharacters(chars)
        const map: Record<string, any[]> = {}
        await Promise.all(
          chars.map(async (c: any) => {
            try { map[c.id] = await listCharacterReferences(c.id) }
            catch { map[c.id] = [] }
          })
        )
        setRefsByChar(map)
      })
      .catch(console.error)
    getProductionShots(productionId).then(setShots).catch(console.error)
  }, [productionId, lastEvent])

  const statuses: StripStatuses = useMemo(() => {
    const st: StripStatuses = {}
    shots.forEach(s => { st[s.id] = s.approved_keyframe_artifact_id ? 'approved' : 'pending' })
    return st
  }, [shots])

  const totalRefs = Object.values(refsByChar).reduce((n, refs) => n + refs.length, 0)
  const charsReady = characters.filter(c => (refsByChar[c.id]?.length ?? 0) > 0 || Boolean(characterRefImage(c.name))).length

  const handleGenerate = async (characterId: string) => {
    if (generating[characterId]) return
    setGenerating(prev => ({ ...prev, [characterId]: true }))
    try {
      await generateCharacterReference(characterId)
      const refs = await listCharacterReferences(characterId)
      setRefsByChar(prev => ({ ...prev, [characterId]: refs }))
    } catch (e) { console.error(e) }
    finally { setGenerating(prev => ({ ...prev, [characterId]: false })) }
  }

  return (
    <AppShell
      active="References"
      panel={
        <RightPanel
          render={(tab) =>
            tab === 'Details' ? (
              <div>
                <h2 className="pb-4 text-[18px] font-semibold text-ink">Spatial reference status</h2>
                <KV label="Spaces verified" value={`${charsReady || 4} / ${characters.length || 4} ready`} />
                <KV label="Total captures" value={String(totalRefs || 12)} />
                <KV label="Property" value={production?.show_title || '8 Admiralty Way'} />
              </div>
            ) : null
          }
        />
      }
      strip={<ThumbShotStrip shots={shots} statuses={statuses} variant="plain" />}
    >
      <div className="p-8">
        <h1 className="text-[32px] font-semibold tracking-tight text-ink">Verifying Space Captures</h1>
        <p className="pt-2 text-[15px] text-ink-2">
          {characters.length === 0 ? (
            <TextShimmer className="text-[15px] font-medium" duration={2}>
              Verifying LiDAR geometry and spatial reference images…
            </TextShimmer>
          ) : (
            `${charsReady} of ${characters.length} spaces fully reconstructed`
          )}
        </p>
        {characters.length > 0 && (
          <div className="mt-4 h-[6px] w-full overflow-hidden rounded-full bg-raised">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${characters.length ? (charsReady / characters.length) * 100 : 100}%` }}
            />
          </div>
        )}

        <div className="mt-8 grid grid-cols-[1fr_300px] gap-8">
          <div>
            <p className="pb-3 text-[12px] font-semibold tracking-[0.12em] text-ink-3">CAPTURED PROPERTY SPACES</p>
            <div className="flex flex-col gap-3">
              {characters.length === 0 && (
                <p className="text-[14.5px] text-ink-3">No spaces mapped for this property yet.</p>
              )}
              {characters.map((char) => {
                const refs = refsByChar[char.id] ?? []
                const isGen = generating[char.id]
                const firstRef = refs[0]
                const refUrl = (firstRef ? getArtifactDownloadUrl(firstRef.artifact_id) : undefined) || characterRefImage(char.name)
                const hasRef = refs.length > 0 || Boolean(characterRefImage(char.name))
                return (
                  <div
                    key={char.id}
                    className="flex w-full items-center gap-4 rounded-xl border border-line bg-surface p-3 shadow-subtle"
                  >
                    {refUrl ? (
                      <img src={refUrl} alt={char.name} className="aspect-[4/3] w-[90px] shrink-0 rounded-lg object-cover border border-line" />
                    ) : (
                      <div className="aspect-[4/3] w-[90px] shrink-0 rounded-lg bg-raised flex items-center justify-center text-ink-3 text-[12px]">
                        No capture
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-[15.5px] font-semibold text-ink">{char.name}</p>
                      <p className="pt-1 text-[13.5px] text-ink-2">
                        {hasRef
                          ? <span className="text-accent font-medium">{Math.max(refs.length, 1)} angle{Math.max(refs.length, 1) !== 1 ? 's' : ''} · Calibrated</span>
                          : 'Awaiting spatial capture'}
                      </p>
                    </div>
                    {isGen ? (
                      <Spinner size={18} />
                    ) : !hasRef ? (
                      <button
                        onClick={() => handleGenerate(char.id)}
                        className="rounded-lg border border-line bg-surface px-3 py-1.5 text-[13.5px] font-medium text-ink transition-colors hover:bg-raised shadow-subtle"
                      >
                        Recalibrate
                      </button>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="pt-8">
            <Checklist
              items={[
                { label: 'Property space layout mapped', state: characters.length > 0 ? 'done' : 'active' },
                { label: 'Spatial key angles calibrated', state: charsReady > 0 ? 'done' : 'todo' },
                { label: 'All spaces verified for 3D walkthrough', state: charsReady === characters.length && characters.length > 0 ? 'done' : 'todo' },
              ]}
            />
          </div>
        </div>
      </div>
    </AppShell>
  )
}
