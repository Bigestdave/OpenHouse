import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { handleNewListing } from '../data/workflow'
import propAdmiraltyImg from '../assets/prop-admiralty.jpg'
import propOrchidImg from '../assets/prop-orchid.jpg'
import propBourdillonImg from '../assets/prop-bourdillon.jpg'
import { OpenHouseLogoMark } from '../components/WorkspaceShell'

export function DemoPortalScreen() {
  const navigate = useNavigate()
  const [selectedPreset, setSelectedPreset] = useState<'admiralty' | 'bourdillon' | 'orchid' | 'custom'>('admiralty')
  
  const [title, setTitle] = useState('8 Admiralty Way')
  const [address, setAddress] = useState('Lekki Phase 1, Lagos')
  const [type, setType] = useState('3-Bedroom Luxury Apartment')
  const [bedrooms, setBedrooms] = useState(3)
  const [bathrooms, setBathrooms] = useState(3)
  const [price, setPrice] = useState('₦8,000,000 / year')
  const [description, setDescription] = useState('Spectacular waterfront apartment with panoramic lagoon views, contemporary kitchen, and expansive balcony.')
  const [simulateMissingSpace, setSimulateMissingSpace] = useState(true)
  const [coverImage, setCoverImage] = useState<string>(propAdmiraltyImg)
  
  const [isPublishing, setIsPublishing] = useState(false)
  const [webhookSent, setWebhookSent] = useState(false)

  const handleSelectPreset = (preset: 'admiralty' | 'bourdillon' | 'orchid' | 'custom') => {
    setSelectedPreset(preset)
    if (preset === 'admiralty') {
      setTitle('8 Admiralty Way')
      setAddress('Lekki Phase 1, Lagos')
      setType('3-Bedroom Luxury Apartment')
      setBedrooms(3)
      setBathrooms(3)
      setPrice('₦8,000,000 / year')
      setDescription('Spectacular waterfront apartment with panoramic lagoon views, contemporary kitchen, and expansive balcony.')
      setSimulateMissingSpace(true)
      setCoverImage(propAdmiraltyImg)
    } else if (preset === 'bourdillon') {
      setTitle('14 Bourdillon Road')
      setAddress('Ikoyi, Lagos')
      setType('5-Bedroom Detached Villa')
      setBedrooms(5)
      setBathrooms(6)
      setPrice('₦45,000,000 / year')
      setDescription('Ultra-luxury detached villa in the heart of Old Ikoyi with private swimming pool and landscaped gardens.')
      setSimulateMissingSpace(false)
      setCoverImage(propBourdillonImg)
    } else if (preset === 'orchid') {
      setTitle('Orchid Apartments, Unit 4')
      setAddress('Lekki Peninsula, Lagos')
      setType('2-Bedroom Contemporary Flat')
      setBedrooms(2)
      setBathrooms(2)
      setPrice('₦4,500,000 / year')
      setDescription('Brand new 2-bedroom executive residence with open-plan kitchen and dedicated security.')
      setSimulateMissingSpace(false)
      setCoverImage(propOrchidImg)
    }
  }

  const handlePublish = () => {
    setIsPublishing(true)

    const spaces = [
      { name: 'Living Room', captured: true },
      { name: 'Kitchen', captured: true },
      { name: 'Main Bedroom', captured: true },
      { name: 'Bedroom 2', captured: true },
      { name: 'Bedroom 3', captured: true },
      { name: 'Bathroom', captured: true },
      { name: 'Balcony', captured: !simulateMissingSpace }
    ]

    const newPropId = handleNewListing({
      title,
      address,
      type,
      bedrooms,
      bathrooms,
      price,
      description,
      coverImage,
      spaces
    })

    setWebhookSent(true)

    setTimeout(() => {
      navigate(`/show/${newPropId}`)
    }, 1800)
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 font-sans antialiased">
      {/* Top Banner */}
      <header className="border-b border-stone-200/80 bg-white/90 backdrop-blur-md px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-900 text-white font-bold text-xs">
            MLS
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-stone-900">Demo Listing Portal</h1>
              <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                External Trigger Source
              </span>
            </div>
            <p className="text-[11px] text-stone-500">
              Simulates a property portal webhook (e.g. PropertyPro, Private Brokerage MLS)
            </p>
          </div>
        </div>

        <Link
          to="/properties"
          className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-stone-700 shadow-2xs hover:bg-stone-50 transition-all"
        >
          <OpenHouseLogoMark className="h-4 w-4" />
          <span>OpenHouse Console ↗</span>
        </Link>
      </header>

      {/* Main Form Container */}
      <main className="max-w-[860px] mx-auto px-6 py-8 space-y-6">
        
        {/* Intro Card */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs space-y-2">
          <h2 className="text-lg font-bold text-stone-900 tracking-tight">
            Trigger OpenHouse with a New Property Listing
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            In OpenHouse, the realtor does <strong>not</strong> push a "Generate 3D" button. The property listing itself is the trigger.
            Publishing a property below immediately fires a simulated webhook payload to OpenHouse to start autonomous intake, room assessment, and spatial reconstruction.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
            Select Demo Scenario
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Preset 1: Admiralty Way */}
            <div
              onClick={() => handleSelectPreset('admiralty')}
              className={`rounded-xl p-4 border cursor-pointer transition-all ${
                selectedPreset === 'admiralty'
                  ? 'border-[#194534] bg-[#F2F7F4] ring-2 ring-[#194534]/10 shadow-xs'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-stone-900">8 Admiralty Way</span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                  Recapture Flow
                </span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                3-Bed in Lekki. Simulates missing balcony footage to demonstrate autonomous recapture.
              </p>
            </div>

            {/* Preset 2: Bourdillon */}
            <div
              onClick={() => handleSelectPreset('bourdillon')}
              className={`rounded-xl p-4 border cursor-pointer transition-all ${
                selectedPreset === 'bourdillon'
                  ? 'border-[#194534] bg-[#F2F7F4] ring-2 ring-[#194534]/10 shadow-xs'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-stone-900">14 Bourdillon Rd</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                  Happy Path
                </span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                5-Bed Luxury Villa in Ikoyi. Complete media coverage, direct preparation to review.
              </p>
            </div>

            {/* Preset 3: Orchid */}
            <div
              onClick={() => handleSelectPreset('orchid')}
              className={`rounded-xl p-4 border cursor-pointer transition-all ${
                selectedPreset === 'orchid'
                  ? 'border-[#194534] bg-[#F2F7F4] ring-2 ring-[#194534]/10 shadow-xs'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-stone-900">Orchid Apts Unit 4</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                  Fast Track
                </span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                2-Bed Executive Flat in Lekki with high-speed quality checks.
              </p>
            </div>

          </div>
        </div>

        {/* Listing Form */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-3">
            Listing Specifications & Evidence
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Property Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#194534]/15"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Location Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#194534]/15"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Property Type</label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#194534]/15"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Price / Rent</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#194534]/15"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Bedrooms</label>
              <input
                type="number"
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#194534]/15"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Bathrooms</label>
              <input
                type="number"
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
                className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#194534]/15"
              />
            </div>
          </div>

          <div className="space-y-1 pt-1">
            <label className="text-xs font-semibold text-stone-700">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#194534]/15"
            />
          </div>

          {/* Autonomy Demonstration Controls */}
          <div className="rounded-xl bg-stone-50 border border-stone-200/90 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-stone-900">
                  Simulate Missing Space Coverage (Balcony)
                </h4>
                <p className="text-[11px] text-stone-500">
                  When enabled, OpenHouse detects missing balcony coverage and requests a 15s mobile capture.
                </p>
              </div>
              <input
                type="checkbox"
                checked={simulateMissingSpace}
                onChange={(e) => setSimulateMissingSpace(e.target.checked)}
                className="h-4 w-4 rounded text-[#194534] focus:ring-[#194534]"
              />
            </div>
          </div>

          {/* Webhook Broadcast Alert when firing */}
          {webhookSent && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 animate-fadeIn space-y-1">
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-ping" />
                <span>Webhook Dispatched: <code>POST /api/webhook/new-listing</code> ➔ 200 OK</span>
              </div>
              <p className="text-[11px] text-emerald-700">
                OpenHouse detected the new listing and initiated background intake. Redirecting to attention inbox...
              </p>
            </div>
          )}

          {/* CTA Action */}
          <div className="pt-3 flex items-center justify-between border-t border-stone-100">
            <span className="text-[11px] text-stone-500">
              Payload: <code className="bg-stone-100 px-1 py-0.5 rounded text-[10px]">listing.created</code>
            </span>

            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="bg-[#0B1713] text-white rounded-xl px-7 py-3 text-xs font-bold hover:bg-black active:scale-[0.98] transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {isPublishing ? (
                <>
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Broadcasting Webhook…</span>
                </>
              ) : (
                <>
                  <span>Publish Listing to OpenHouse</span>
                  <span>→</span>
                </>
              )}
            </button>
          </div>

        </div>

      </main>
    </div>
  )
}
