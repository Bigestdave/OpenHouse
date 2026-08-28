import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { RightPanel, KV } from '../components/RightPanel'
import { CheckCircle } from '../components/icons'
import { PeopleIcon, ClockIcon, PhoneIcon, FramePlaceholder } from '../components/icons2'
import { getProduction, getProductionShots, listCharacters } from '../data/api'
import { useProductionEvents } from '../hooks/useProductionEvents'

export function BriefScreen() {
  const [searchParams] = useSearchParams()
  const productionId = searchParams.get('productionId')

  const [production, setProduction] = useState<any>(null)
  const [shots, setShots] = useState<any[]>([])
  const [characters, setCharacters] = useState<any[]>([])
  const { lastEvent } = useProductionEvents(productionId)

  useEffect(() => {
    if (!productionId) return
    getProduction(productionId)
      .then(async (prod) => {
        setProduction(prod)
        if (prod.show_id) {
          listCharacters(prod.show_id).then(setCharacters).catch(console.error)
        }
      })
      .catch(console.error)
    getProductionShots(productionId).then(setShots).catch(console.error)
  }, [productionId, lastEvent])

  const charNames = characters.length > 0
    ? characters.map((c: any) => c.name).join(', ')
    : 'Entrance, Living Room & Balcony, Fitted Kitchen, Master Suite'

  const episodeLabel = production?.episode_title
    ? production.episode_title
    : 'Interactive 3D Walkthrough Experience'

  const briefRows = [
    { icon: PeopleIcon, label: 'Key Spaces', value: charNames },
    { icon: ClockIcon, label: 'Target duration', value: production?.target_duration_seconds ? `${production.target_duration_seconds} seconds` : '60 seconds' },
    { icon: PhoneIcon, label: 'Presentation format', value: 'Interactive Web & Mobile 3D' },
  ]

  return (
    <AppShell
      active="Brief"
      panel={
        <RightPanel
          render={(tab) =>
            tab === 'Details' ? (
              <div>
                <h2 className="pb-3 text-[17px] font-semibold text-ink">Property Context</h2>
                <KV label="Property" value={production?.show_title || '8 Admiralty Way'} />
                <KV label="Experience" value={episodeLabel} />
                <KV label="Status" value={production?.current_stage || 'Planning'} />
              </div>
            ) : null
          }
        />
      }
      strip={
        <div className="grid grid-cols-8 gap-3">
          {(shots.length > 0 ? shots : Array.from({ length: 6 })).map((s: any, i) => (
            <div key={s?.id || i} className="rounded-xl border border-line bg-surface p-2 pb-2.5 shadow-subtle">
              <div className="mb-2 flex aspect-[16/10] w-full items-center justify-center rounded-md border border-dashed border-line bg-raised">
                <FramePlaceholder />
              </div>
              <div className="flex items-center justify-between px-1">
                <span className="text-[13px] font-semibold text-ink">
                  {s?.sequence_number ? `S${String(s.sequence_number).padStart(2, '0')}` : `S${String(i + 1).padStart(2, '0')}`}
                </span>
                <span className="text-accent text-[12px] font-semibold">✓</span>
              </div>
              <p className="px-1 pt-0.5 text-[12px] text-ink-3">Space {i + 1}</p>
            </div>
          ))}
        </div>
      }
    >
      <div className="p-8">
        <div className="flex items-center gap-4">
          <h1 className="text-[32px] font-semibold tracking-tight text-ink">Experience Brief</h1>
          <span className="flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-[13px] font-medium text-white shadow-subtle">
            <CheckCircle size={14} />
            Verified & Ready
          </span>
        </div>
        <p className="pt-2 text-[15px] text-ink-2">All required property spatial data and footage references are verified.</p>

        <h2 className="pt-7 text-[19px] font-semibold text-ink">{episodeLabel}</h2>

        <div className="mt-6 max-w-[820px] rounded-xl border border-line bg-surface p-5 shadow-subtle">
          {briefRows.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4 border-b border-line py-3.5 last:border-b-0">
              <Icon size={17} className="shrink-0 text-accent" />
              <span className="w-[220px] text-[14px] font-medium text-ink-2">{label}</span>
              <span className="text-[14px] text-ink">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
