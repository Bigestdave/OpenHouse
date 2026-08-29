import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { WorkspaceShell } from '../components/WorkspaceShell'
import { addProperty } from '../data/store'
import { startPropertyWorkflow } from '../data/workflow'
import { Button, Input, Select, Textarea } from '../components/ui'
import type { Space } from '../data/types'

const PROPERTY_TYPES = [
  '3-bedroom apartment',
  '2-bedroom apartment',
  '4-bedroom detached duplex',
  '3-bedroom terrace',
  '5-bedroom luxury penthouse',
  'Commercial space',
]

const SAMPLE_LEKKI = {
  title: '8 Admiralty Way',
  address: 'Admiralty Way, Lekki Phase 1, Lagos',
  price: '₦8,000,000 / year',
  type: '3-bedroom apartment',
  bedrooms: 3,
  bathrooms: 3,
  description:
    'Spacious 3-bedroom apartment with panoramic lagoon views, contemporary kitchen, fitted wardrobes, and private balcony overlooking Lekki Phase 1.',
  coverImage: '/src/assets/prop-admiralty.jpg',
  spaces: [
    { name: 'Living room', captured: true },
    { name: 'Kitchen', captured: true },
    { name: 'Master bedroom', captured: true },
    { name: 'Bedroom 2', captured: true },
    { name: 'Bedroom 3', captured: true },
    { name: 'Balcony', captured: false }, // Balcony missing to trigger the autonomous recapture flow!
  ],
}

const SAMPLE_IKOYI = {
  title: '14 Bourdillon Road',
  address: 'Bourdillon Road, Ikoyi, Lagos',
  price: '₦25,000,000 / year',
  type: '4-bedroom apartment',
  bedrooms: 4,
  bathrooms: 4,
  description:
    'Ultra-luxury 4-bedroom residence in the heart of Ikoyi featuring floor-to-ceiling windows, imported Italian finishes, swimming pool, and 24/7 power.',
  coverImage: '/src/assets/prop-bourdillon.jpg',
  spaces: [
    { name: 'Living room', captured: true },
    { name: 'Kitchen', captured: true },
    { name: 'Master bedroom', captured: true },
    { name: 'Bedroom 2', captured: true },
    { name: 'Bedroom 3', captured: true },
    { name: 'Bedroom 4', captured: true },
  ],
}

export function AddPropertyScreen() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [address, setAddress] = useState('')
  const [price, setPrice] = useState('')
  const [type, setType] = useState(PROPERTY_TYPES[0])
  const [bedrooms, setBedrooms] = useState(3)
  const [bathrooms, setBathrooms] = useState(3)
  const [description, setDescription] = useState('')
  const [coverImage, setCoverImage] = useState('/src/assets/prop-hero-waterfront.jpg')
  const [spaces, setSpaces] = useState<Array<{ name: string; captured: boolean }>>([
    { name: 'Living room', captured: true },
    { name: 'Kitchen', captured: true },
    { name: 'Master bedroom', captured: true },
    { name: 'Bedroom 2', captured: true },
    { name: 'Bedroom 3', captured: true },
    { name: 'Balcony', captured: false },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFillSample = (sample: typeof SAMPLE_LEKKI) => {
    setTitle(sample.title)
    setAddress(sample.address)
    setPrice(sample.price)
    setType(sample.type)
    setBedrooms(sample.bedrooms)
    setBathrooms(sample.bathrooms)
    setDescription(sample.description)
    setCoverImage(sample.coverImage)
    setSpaces(sample.spaces)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      alert('Please provide a property title.')
      return
    }

    setIsSubmitting(true)

    const formattedSpaces: Space[] = spaces.map((s, idx) => ({
      id: `space-${Date.now()}-${idx}`,
      name: s.name,
      captured: s.captured,
      verified: false,
      issues: [],
    }))

    const newProp = addProperty({
      title: title.trim(),
      address: address.trim() || 'Lekki, Lagos',
      price: price.trim() || '₦8,000,000 / year',
      type,
      bedrooms: Number(bedrooms) || 3,
      bathrooms: Number(bathrooms) || 3,
      description: description.trim() || 'Modern residential property in prime location.',
      status: 'detected',
      spaces: formattedSpaces,
      sourceMedia: [],
      timeline: [],
      coverImage: coverImage || '/src/assets/prop-hero-waterfront.jpg',
      workspaceId: 'default',
    })

    // Start autonomous pipeline
    startPropertyWorkflow(newProp.id)

    setTimeout(() => {
      setIsSubmitting(false)
      navigate('/properties')
    }, 400)
  }

  return (
    <WorkspaceShell breadcrumb="Add Property" backTo="/properties">
      <div className="mx-auto max-w-[840px] px-5 sm:px-8 py-6 lg:py-8 font-sans text-ink">
        
        {/* Page Top Header */}
        <div className="pb-6 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-[26px] sm:text-[30px] font-extrabold tracking-tight text-ink leading-tight">
                Add New Property
              </h1>
              <p className="text-xs sm:text-sm text-ink-2 mt-1">
                List the property normally. OpenHouse evaluates footage and orchestrates the 3D tour in the background.
              </p>
            </div>

            {/* Quick Demo Pre-fill */}
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleFillSample(SAMPLE_LEKKI)}
                title="Auto-fill 8 Admiralty Way demo property"
              >
                ⚡ Fill Lekki Demo
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleFillSample(SAMPLE_IKOYI)}
                title="Auto-fill 14 Bourdillon demo property"
              >
                ⚡ Fill Ikoyi Demo
              </Button>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="pt-6 space-y-6">
          
          {/* Section 1: Basic Info */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-subtle space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-2">Listing Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Input
                  label="Property Title"
                  placeholder="e.g. 8 Admiralty Way"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <Input
                  label="Address / Location"
                  placeholder="e.g. Admiralty Way, Lekki Phase 1, Lagos"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div>
                <Input
                  label="Price"
                  placeholder="e.g. ₦8,000,000 / year"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div>
                <Select
                  label="Property Type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  options={PROPERTY_TYPES}
                />
              </div>

              <div>
                <Input
                  label="Bedrooms"
                  type="number"
                  min="1"
                  max="20"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                />
              </div>

              <div>
                <Input
                  label="Bathrooms"
                  type="number"
                  min="1"
                  max="20"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(Number(e.target.value))}
                />
              </div>

              <div className="sm:col-span-2">
                <Textarea
                  label="Property Description"
                  placeholder="Describe the property highlights, layout, and key amenities..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Advertised Spaces */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-ink-2">Advertised Spaces</h2>
                <p className="text-xs text-ink-3 mt-0.5">Rooms identified from listing description and photos.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {spaces.map((s, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between rounded-xl border p-3 text-xs transition-all ${
                    s.captured ? 'border-border bg-canvas/40' : 'border-accent/40 bg-accent/5'
                  }`}
                >
                  <span className="font-semibold text-ink">{s.name}</span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-[11px]">
                    <input
                      type="checkbox"
                      checked={s.captured}
                      onChange={(e) => {
                        const updated = [...spaces]
                        updated[idx].captured = e.target.checked
                        setSpaces(updated)
                      }}
                      className="accent-primary"
                    />
                    <span className={s.captured ? 'text-primary font-medium' : 'text-accent font-medium'}>
                      {s.captured ? 'Captured' : 'Missing'}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Link to="/properties">
              <Button variant="secondary" size="md">
                Cancel
              </Button>
            </Link>

            <Button
              type="submit"
              variant="dark"
              size="md"
              loading={isSubmitting}
              className="px-8"
            >
              Publish property & start agent →
            </Button>
          </div>

        </form>

      </div>
    </WorkspaceShell>
  )
}
