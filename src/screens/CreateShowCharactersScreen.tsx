import { useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { WizardShell, WizardTitle } from '../components/WizardShell'
import { UploadCloud, PlusIcon } from '../components/icons2'
import {
  createShow,
  createCharacter,
  uploadCharacterReference,
  generateCharacterReference,
  generateShowPoster,
  DEFAULT_MOCK_PROPERTIES,
} from '../data/api'

export function CreateShowCharactersScreen() {
  const location = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [refFiles, setRefFiles] = useState<Record<number, File[]>>({})
  const fileInputs = useRef<Record<number, HTMLInputElement | null>>({})

  const initialProposal = location.state?.proposal || {}
  const [proposal, setProposal] = useState({
    ...initialProposal,
    characters: initialProposal.characters?.length
      ? initialProposal.characters
      : [
          { name: 'Living Room & Balcony', canonical_description: 'Open plan living area connecting seamlessly to the waterfront terrace.' },
          { name: 'Kitchen & Island', canonical_description: 'Modern fitted kitchen with marble countertop and breakfast bar.' },
          { name: 'Primary Bedroom Suite', canonical_description: 'En-suite bedroom with expansive coastal windows and fitted wardrobe.' },
        ],
  })

  const handleUpdateChar = (index: number, field: string, value: string) => {
    const chars = [...proposal.characters]
    chars[index] = { ...chars[index], [field]: value }
    setProposal({ ...proposal, characters: chars })
  }

  const handleRemoveChar = (index: number) => {
    setProposal({ ...proposal, characters: proposal.characters.filter((_: unknown, i: number) => i !== index) })
    setRefFiles((prev) => {
      const next: Record<number, File[]> = {}
      Object.entries(prev).forEach(([k, v]) => {
        const i = Number(k)
        if (i < index) next[i] = v
        else if (i > index) next[i - 1] = v
      })
      return next
    })
  }

  const handleFiles = (index: number, files: FileList | null) => {
    if (!files?.length) return
    const images = Array.from(files).filter((f) => f.type.startsWith('image/'))
    if (images.length) setRefFiles((prev) => ({ ...prev, [index]: [...(prev[index] || []), ...images].slice(0, 4) }))
  }

  const handleCreateShow = async () => {
    setLoading(true)
    setError(null)
    try {
      setProgress('Publishing property…')
      let showId = 'prop-01'
      try {
        const show = await createShow(proposal)
        showId = show.id
        const created: Array<{ id: string; name: string; index: number }> = []
        for (let i = 0; i < proposal.characters.length; i++) {
          const char = proposal.characters[i]
          if (!char.name) continue
          const c = await createCharacter(show.id, char)
          created.push({ id: c.id, name: c.name, index: i })
        }
        const jobs: Promise<unknown>[] = created.map(async (c) => {
          const uploads = refFiles[c.index] || []
          if (uploads.length > 0) {
            for (const file of uploads) {
              await uploadCharacterReference(c.id, file).catch((e) => console.error('upload failed', e))
            }
          } else {
            await generateCharacterReference(c.id).catch((e) => console.error('generation failed', e))
          }
        })
        jobs.push(generateShowPoster(show.id).catch((e) => console.error('poster failed', e)))
        await Promise.race([Promise.allSettled(jobs), new Promise((resolve) => setTimeout(resolve, 3000))])
      } catch {
        // In offline/mock mode
        showId = DEFAULT_MOCK_PROPERTIES[0].id
      }

      navigate(`/show/${showId}`)
    } catch (err) {
      console.error(err)
      navigate(`/show/prop-01`)
    }
  }

  return (
    <WizardShell
      step={3}
      footerLeft={
        <Link
          to="/create-show/style"
          state={{ proposal }}
          className="rounded-lg border border-line bg-surface px-6 py-3 text-[15px] font-medium text-ink transition-colors hover:bg-raised shadow-subtle"
        >
          Back
        </Link>
      }
      footerRight={
        <div className="flex items-center gap-4">
          {error && <p className="text-[13.5px] text-danger">{error}</p>}
          {loading && progress && <p className="text-[13.5px] text-accent font-medium">{progress}</p>}
          <button
            onClick={handleCreateShow}
            disabled={loading || proposal.characters.length === 0}
            className="flex items-center gap-2.5 rounded-lg bg-ink px-6 py-3 text-[15px] font-medium text-white transition-colors hover:bg-ink/90 disabled:opacity-50 shadow-subtle"
          >
            {loading ? 'Publishing…' : 'Publish property'}
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12M11 4.5L16.5 10 11 15.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      }
    >
      <WizardTitle
        title="Verify property spaces & coverage"
        subtitle="Confirm the identified spaces or upload additional photos and floor plan captures to finalize your property."
      />
      <div className="mx-auto max-w-[1080px] px-6">
        {proposal.characters.map((char: any, idx: number) => (
          <div key={idx} className="rounded-xl border border-line bg-surface p-6 mb-8 shadow-subtle">
            <div className="flex items-center justify-between pb-5">
              <p className="text-[16px] font-semibold text-ink">Space 0{idx + 1}</p>
              <button
                onClick={() => handleRemoveChar(idx)}
                className="rounded-lg border border-line px-3 py-1.5 text-[13px] text-ink-3 transition-colors hover:bg-raised hover:text-ink shadow-subtle"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-[1fr_440px] gap-8">
              {/* Left: upload + reference thumbs */}
              <div>
                <input
                  ref={(el) => { fileInputs.current[idx] = el }}
                  type="file"
                  accept="image/png,image/jpeg"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFiles(idx, e.target.files)}
                />
                <button
                  onClick={() => fileInputs.current[idx]?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault()
                    handleFiles(idx, e.dataTransfer.files)
                  }}
                  className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line py-9 bg-raised transition-colors hover:border-accent"
                >
                  <UploadCloud className="text-ink-2" />
                  <p className="text-[15px] font-medium text-ink">Upload space footage (optional)</p>
                  <p className="text-[13.5px] text-ink-2">
                    Drag captures here or <span className="text-accent font-medium">choose files</span>
                  </p>
                  <p className="text-[12.5px] text-ink-3">OpenHouse will reconstruct this space from your captures</p>
                </button>
                {(refFiles[idx]?.length ?? 0) > 0 && (
                  <div className="mt-4 flex gap-3">
                    {refFiles[idx].map((file, fi) => (
                      <div key={fi} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="h-20 w-20 rounded-lg border border-line object-cover"
                        />
                        <button
                          onClick={() =>
                            setRefFiles((prev) => ({ ...prev, [idx]: prev[idx].filter((_, i) => i !== fi) }))
                          }
                          className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border border-line bg-surface text-[11px] text-ink-2 hover:text-ink shadow-subtle"
                          aria-label="Remove image"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: name, description */}
              <div>
                <p className="pb-2 text-[14px] font-medium text-ink-2">Space Name</p>
                <input
                  value={char.name}
                  onChange={(e) => handleUpdateChar(idx, 'name', e.target.value)}
                  className="w-full rounded-lg border border-line bg-surface px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-accent shadow-subtle"
                />

                <p className="pb-2 pt-5 text-[14px] font-medium text-ink-2">Space Notes & Dimensions</p>
                <textarea
                  rows={5}
                  value={char.canonical_description}
                  onChange={(e) => handleUpdateChar(idx, 'canonical_description', e.target.value)}
                  className="w-full resize-y rounded-lg border border-line bg-surface px-4 py-3 text-[15px] text-ink leading-relaxed outline-none transition-colors focus:border-accent shadow-subtle"
                />
              </div>
            </div>
          </div>
        ))}

        {proposal.characters.length === 0 && (
          <div className="mb-8 rounded-xl border border-line bg-surface py-12 text-center text-[14.5px] text-ink-2 shadow-subtle">
            No spaces were configured. Add at least one space to continue.
          </div>
        )}

        <button
          onClick={() => setProposal({...proposal, characters: [...proposal.characters, {name: '', canonical_description: ''}]})}
          className="mt-5 flex items-center gap-2.5 text-[14.5px] text-ink-2 transition-colors hover:text-ink font-medium"
        >
          <PlusIcon size={15} />
          <span className="border-b border-dashed border-ink-3 pb-0.5">Add another space</span>
        </button>
      </div>
    </WizardShell>
  )
}
