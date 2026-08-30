import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { handleNewListing } from '../data/workflow'
import propAdmiraltyImg from '../assets/prop-admiralty.jpg'
import propOrchidImg from '../assets/prop-orchid.jpg'
import propBourdillonImg from '../assets/prop-bourdillon.jpg'
import demoExterior from '../assets/demo-exterior.jpg'
import { OpenHouseLogoMark } from '../components/WorkspaceShell'
import { useDemoContext } from '../context/DemoContext'

export function ListingPortalScreen() {
  const navigate = useNavigate()
  const { setStage } = useDemoContext()
  const [selectedPreset, setSelectedPreset] = useState<'laurel_12a' | 'park_ave' | 'ocean_dr' | 'beverly_glen' | 'custom'>('laurel_12a')

  const [title, setTitle] = useState('2847 Laurel Canyon Rd, Unit 12A')
  const [address, setAddress] = useState('Austin, TX 78701')
  const [type, setType] = useState('3-Bedroom Luxury Condo')
  const [bedrooms, setBedrooms] = useState(3)
  const [bathrooms, setBathrooms] = useState(2)
  const [price, setPrice] = useState('$6,400 / month')
  const [description, setDescription] = useState('Corner-unit high-rise condo with panoramic Lady Bird Lake views, chef kitchen with island, and wraparound balcony terrace.')
  const [missingSpaceFlag, setMissingSpaceFlag] = useState(true)
  const [coverImage, setCoverImage] = useState<string>(demoExterior)

  const [isPublishing, setIsPublishing] = useState(false)
  const [webhookSent, setWebhookSent] = useState(false)

  const handleSelectPreset = (preset: 'laurel_12a' | 'park_ave' | 'ocean_dr' | 'beverly_glen' | 'custom') => {
    setSelectedPreset(preset)
    if (preset === 'laurel_12a') {
      setTitle('2847 Laurel Canyon Rd, Unit 12A')
      setAddress('Austin, TX 78701')
      setType('3-Bedroom Luxury Condo')
      setBedrooms(3)
      setBathrooms(2)
      setPrice('$6,400 / month')
      setDescription('Corner-unit high-rise condo with panoramic Lady Bird Lake views, chef kitchen with island, and wraparound balcony terrace.')
      setMissingSpaceFlag(true)
      setCoverImage(demoExterior)
    } else if (preset === 'park_ave') {
      setTitle('740 Park Avenue, Apt 12B')
      setAddress('Upper East Side, New York, NY 10021')
      setType('3-Bedroom Luxury Penthouse')
      setBedrooms(3)
      setBathrooms(3)
      setPrice('$18,500 / month')
      setDescription('Iconic pre-war architectural masterpiece with private elevator landing, grand entertaining gallery, and private terrace.')
      setMissingSpaceFlag(true)
      setCoverImage(propAdmiraltyImg)
    } else if (preset === 'ocean_dr') {
      setTitle('1048 Ocean Drive')
      setAddress('South Beach, Miami, FL 33139')
      setType('5-Bedroom Waterfront Villa')
      setBedrooms(5)
      setBathrooms(6)
      setPrice('$35,000 / month')
      setDescription('Modern waterfront sanctuary with infinity-edge pool, private dock, chef kitchen, and panoramic rooftop sunset deck.')
      setMissingSpaceFlag(false)
      setCoverImage(propBourdillonImg)
    } else if (preset === 'beverly_glen') {
      setTitle('452 Beverly Glen Blvd')
      setAddress('Bel Air, Los Angeles, CA 90077')
      setType('4-Bedroom Architectural Estate')
      setBedrooms(4)
      setBathrooms(5)
      setPrice('$24,000 / month')
      setDescription('Contemporary estate featuring floor-to-ceiling glass walls, terrazzo floors, smart home automation, and tranquil canyon views.')
      setMissingSpaceFlag(false)
      setCoverImage(propOrchidImg)
    }
  }

  const handlePublish = () => {
    setIsPublishing(true)

    // For demo preset: fire Stage 1, navigate to demo property
    if (selectedPreset === 'laurel_12a') {
      setWebhookSent(true)
      setTimeout(() => {
        setStage(1)
        navigate('/property/laurel-12a')
      }, 1800)
      return
    }

    const spaces = [
      { name: 'Living Room', captured: true },
      { name: 'Kitchen', captured: true },
      { name: 'Primary Suite', captured: true },
      { name: 'Guest Bedroom', captured: true },
      { name: 'Library / Den', captured: true },
      { name: 'Marble Bath', captured: true },
      { name: 'Private Terrace', captured: !missingSpaceFlag }
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
      navigate(`/property/${newPropId}`)
    }, 1800)
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 font-sans antialiased">
      {/* Top Banner */}
      <header className="border-b border-stone-200/80 bg-white/90 backdrop-blur-md px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#194534] text-white font-bold text-xs">
            MLS
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-stone-900">MLS Syndication & Ingestion Gateway</span>
              <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800 ring-1 ring-inset ring-emerald-600/20">
                Connected
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Live automated listing intake pipeline for OpenHouse
            </p>
          </div>
        </div>

        <Link
          to="/properties"
          className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-stone-800 transition-colors"
        >
          <OpenHouseLogoMark className="h-4 w-4 fill-white" />
          <span>Open Realtor Inbox</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        
        {/* Editorial Context */}
        <div className="mb-8 rounded-2xl bg-white border border-stone-200/80 p-6 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#194534]/10 text-[#194534]">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                How OpenHouse Autonomous Processing Begins
              </h2>
              <p className="mt-1 text-sm text-stone-600 leading-relaxed">
                OpenHouse connects once to your listing source (MLS, Zillow feed, or brokerage CRM). 
                When a new listing is published, OpenHouse automatically detects the media, validates room coverage, 
                generates 3D Gaussian Splats in the background, and prompts for your approval when the virtual open house is ready.
              </p>
            </div>
          </div>
        </div>

        {/* Source Presets */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
            Select Active Listing Feed:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            {/* DEMO PRESET — Laurel Canyon */}
            <button
              type="button"
              onClick={() => handleSelectPreset('laurel_12a')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                selectedPreset === 'laurel_12a'
                  ? 'border-[#194534] bg-emerald-50/50 ring-2 ring-[#194534]/20'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <div className="absolute top-2 right-2 text-[10px] font-bold bg-[#194534] text-white px-2 py-0.5 rounded-full uppercase tracking-wide">
                Demo
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold text-stone-900">2847 Laurel Canyon Rd</span>
              </div>
              <p className="text-xs text-stone-500">Austin, TX · \$6,400/mo</p>
              <p className="text-[11px] text-amber-700 font-medium mt-2">
                Simulates missing balcony terrace footage — full demo flow.
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleSelectPreset('park_ave')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                selectedPreset === 'park_ave'
                  ? 'border-[#194534] bg-emerald-50/50 ring-2 ring-[#194534]/20'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-stone-900">740 Park Avenue</span>
                <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                  Recapture Test
                </span>
              </div>
              <p className="text-xs text-stone-500">Upper East Side, NY · \$18,500/mo</p>
              <p className="text-[11px] text-amber-700 font-medium mt-2">
                Simulates missing terrace doorway footage.
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleSelectPreset('ocean_dr')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                selectedPreset === 'ocean_dr'
                  ? 'border-[#194534] bg-emerald-50/50 ring-2 ring-[#194534]/20'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-stone-900">1048 Ocean Drive</span>
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                  Full Coverage
                </span>
              </div>
              <p className="text-xs text-stone-500">South Beach, Miami · \$35,000/mo</p>
              <p className="text-[11px] text-emerald-700 font-medium mt-2">
                All rooms captured. Direct reconstruction flow.
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleSelectPreset('beverly_glen')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                selectedPreset === 'beverly_glen'
                  ? 'border-[#194534] bg-emerald-50/50 ring-2 ring-[#194534]/20'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-stone-900">452 Beverly Glen</span>
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                  Bel Air Estate
                </span>
              </div>
              <p className="text-xs text-stone-500">Los Angeles, CA · \$24,000/mo</p>
              <p className="text-[11px] text-emerald-700 font-medium mt-2">
                Complete architectural photo set.
              </p>
            </button>

          </div>
        </div>

        {/* Listing Form Preview */}
        <div className="rounded-2xl bg-white border border-stone-200/80 p-8 shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-6">
            Listing Metadata & Spatial Assets
          </h3>

          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Property Title / Unit</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3.5 py-2.5 text-sm font-medium text-stone-900 focus:border-[#194534] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Address / Location</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3.5 py-2.5 text-sm font-medium text-stone-900 focus:border-[#194534] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">Property Type</label>
                <input
                  type="text"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3.5 py-2.5 text-sm font-medium text-stone-900 focus:border-[#194534] focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Bedrooms</label>
                <input
                  type="number"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3.5 py-2.5 text-sm font-medium text-stone-900 focus:border-[#194534] focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Bathrooms</label>
                <input
                  type="number"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(Number(e.target.value))}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3.5 py-2.5 text-sm font-medium text-stone-900 focus:border-[#194534] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Price</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3.5 py-2.5 text-sm font-medium text-stone-900 focus:border-[#194534] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3.5 py-2.5 text-sm font-medium text-stone-900 focus:border-[#194534] focus:bg-white focus:outline-none"
              />
            </div>

            {/* Test Simulation Controls */}
            <div className="pt-2 border-t border-stone-100">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
                <div>
                  <span className="text-xs font-bold text-stone-900">Flag Missing Room Coverage</span>
                  <p className="text-[11px] text-stone-500">
                    When enabled, OpenHouse detects insufficient terrace footage and triggers a guided 15s mobile capture request.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMissingSpaceFlag(!missingSpaceFlag)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    missingSpaceFlag ? 'bg-[#194534]' : 'bg-stone-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      missingSpaceFlag ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Ingestion Trigger Button */}
            <div className="pt-4 flex items-center justify-between">
              <div className="text-xs text-stone-500">
                Webhook target: <code className="font-mono text-stone-700">POST /api/webhook/listing-intake</code>
              </div>

              <button
                type="button"
                onClick={handlePublish}
                disabled={isPublishing}
                className="inline-flex items-center gap-2 rounded-xl bg-[#194534] px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-[#2F613D] transition-all disabled:opacity-50 cursor-pointer"
              >
                {isPublishing ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Transmitting Webhook to OpenHouse...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span>Trigger Listing Ingestion</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Webhook Broadcast Notification */}
        {webhookSent && (
          <div className="mt-6 rounded-2xl bg-[#0B1713] text-white p-6 border border-stone-800 shadow-xl animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Webhook Received by OpenHouse Engine
              </span>
            </div>
            <p className="text-sm text-stone-300">
              Listing at <strong className="text-white">{address}</strong> ingested. Autonomous quality analysis has started in your workspace.
            </p>
          </div>
        )}

      </main>
    </div>
  )
}
