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
  const [selectedSource, setSelectedSource] = useState<'zillow' | 'realtor' | 'mls'>('zillow')
  const [selectedPreset, setSelectedPreset] = useState<'homestead_pd' | 'park_ave' | 'ocean_dr' | 'beverly_glen' | 'custom'>('homestead_pd')

  const [title, setTitle] = useState('72691 Homestead Road')
  const [address, setAddress] = useState('Palm Desert, CA 92260')
  const [type, setType] = useState('4-Bedroom Luxury Estate with Guest House')
  const [bedrooms, setBedrooms] = useState(4)
  const [bathrooms, setBathrooms] = useState(4)
  const [price, setPrice] = useState('$1,495,000')
  const [description, setDescription] = useState('Stunning mid-century modern estate in South Palm Desert with 2 bedroom suites, a detached guest house, resort-style pool, and 3-car garage on a 10,454 sqft lot.')
  const [missingSpaceFlag, setMissingSpaceFlag] = useState(true)
  const [coverImage, setCoverImage] = useState<string>(demoExterior)

  const [isPublishing, setIsPublishing] = useState(false)
  const [webhookSent, setWebhookSent] = useState(false)

  const handleSelectPreset = (preset: 'homestead_pd' | 'park_ave' | 'ocean_dr' | 'beverly_glen' | 'custom') => {
    setSelectedPreset(preset)
    if (preset === 'homestead_pd') {
      setTitle('72691 Homestead Road')
      setAddress('Palm Desert, CA 92260')
      setType('4-Bedroom Luxury Estate with Guest House')
      setBedrooms(4)
      setBathrooms(4)
      setPrice('$1,495,000')
      setDescription('Stunning mid-century modern estate in South Palm Desert with 2 bedroom suites, a detached guest house, resort-style pool, and 3-car garage on a 10,454 sqft lot.')
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
    if (selectedPreset === 'homestead_pd') {
      setWebhookSent(true)
      setTimeout(() => {
        setStage(1)
        navigate('/property/homestead-pd')
      }, 1600)
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
    }, 1600)
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 font-sans antialiased selection:bg-stone-200">
      
      {/* Top Navbar */}
      <header className="border-b border-[#E5E0D8] bg-white/90 backdrop-blur-md px-6 lg:px-10 py-3.5 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <Link to="/properties" className="flex items-center gap-2 group">
            <OpenHouseLogoMark className="h-6 w-6 object-contain" />
            <span className="text-[17px] font-extrabold tracking-tight text-[#0B1713]">
              OpenHouse
            </span>
          </Link>
          <span className="text-stone-300">/</span>
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-bold text-stone-900">MLS Syndication & Ingestion Gateway</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#EBF2EC] px-2.5 py-0.5 text-[11px] font-bold text-[#2F613D]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2F613D] animate-pulse" />
              Live Webhook Connected
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/properties"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5E0D8] bg-white px-3.5 py-2 text-[12.5px] font-semibold text-stone-800 shadow-xs hover:bg-stone-50 transition-colors"
          >
            <span>Realtor Workspace</span>
            <span>→</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-5 sm:px-8 py-8 sm:py-10 space-y-8">
        
        {/* Page Top Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#0B1713]/5 px-3 py-1 text-[11.5px] font-bold text-[#0B1713] uppercase tracking-wider">
            <span>⚡ MLS Integration Simulator</span>
          </div>
          <h1 className="text-[28px] sm:text-[34px] font-extrabold tracking-tight text-[#0B1713] leading-tight">
            Publish New Property Listing
          </h1>
          <p className="text-[14px] text-stone-500 max-w-2xl leading-relaxed">
            Realtors publish their listings on standard portals (Zillow, Realtor.com, MLS feeds). 
            OpenHouse automatically intercepts the listing webhook, triggers multimodal Gemini 3.7 Flash spatial analysis, 
            and prepares the verified 3D open house.
          </p>
        </div>

        {/* Existing Listing Platform Selector */}
        <div className="rounded-2xl border border-[#E5E0D8] bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[14px] font-bold text-stone-900">Source Platform</h2>
              <p className="text-[12px] text-stone-500 mt-0.5">Choose which feed OpenHouse is currently listening to</p>
            </div>
            <span className="text-[11px] font-mono font-medium text-stone-400 bg-stone-100 px-2 py-0.5 rounded-md">
              POST /api/webhook/listing.published
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setSelectedSource('zillow')}
              className={`flex items-center justify-center gap-2.5 rounded-xl border p-3 text-center transition-all cursor-pointer ${
                selectedSource === 'zillow'
                  ? 'border-[#0B1713] bg-[#0B1713] text-white shadow-sm'
                  : 'border-[#E5E0D8] bg-stone-50/70 text-stone-700 hover:bg-stone-100 hover:border-stone-300'
              }`}
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
              </svg>
              <span className="text-[13px] font-bold">Zillow MLS</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedSource('realtor')}
              className={`flex items-center justify-center gap-2.5 rounded-xl border p-3 text-center transition-all cursor-pointer ${
                selectedSource === 'realtor'
                  ? 'border-[#0B1713] bg-[#0B1713] text-white shadow-sm'
                  : 'border-[#E5E0D8] bg-stone-50/70 text-stone-700 hover:bg-stone-100 hover:border-stone-300'
              }`}
            >
              <span className="text-[13px] font-bold">realtor.com</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedSource('mls')}
              className={`flex items-center justify-center gap-2.5 rounded-xl border p-3 text-center transition-all cursor-pointer ${
                selectedSource === 'mls'
                  ? 'border-[#0B1713] bg-[#0B1713] text-white shadow-sm'
                  : 'border-[#E5E0D8] bg-stone-50/70 text-stone-700 hover:bg-stone-100 hover:border-stone-300'
              }`}
            >
              <span className="text-[13px] font-bold">Custom Webhook / MLS</span>
            </button>
          </div>
        </div>

        {/* Demo Listing Presets */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-bold uppercase tracking-wider text-stone-500">
              Select Sample Property Dataset
            </label>
            <span className="text-[11.5px] text-stone-500 font-medium">Click to populate listing form</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* DEMO PRESET — Homestead Palm Desert */}
            <button
              type="button"
              onClick={() => handleSelectPreset('homestead_pd')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative flex gap-3.5 ${
                selectedPreset === 'homestead_pd'
                  ? 'border-[#0B1713] bg-white ring-2 ring-[#0B1713] shadow-md'
                  : 'border-[#E5E0D8] bg-white hover:border-stone-300 shadow-xs'
              }`}
            >
              <img
                src={demoExterior}
                alt="72691 Homestead Road"
                className="h-16 w-20 rounded-xl object-cover shrink-0 border border-stone-200"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[13.5px] font-extrabold text-stone-900 truncate">72691 Homestead Road</span>
                  <span className="text-[10px] font-extrabold bg-[#2F613D] text-white px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wide">
                    Featured Demo
                  </span>
                </div>
                <p className="text-[12px] text-stone-500 truncate">Palm Desert, CA · $1,495,000</p>
                <p className="text-[11px] text-[#D97945] font-semibold mt-1">
                  Simulates missing pool connection → full agentic loop
                </p>
              </div>
            </button>

            {/* PRESET 2 — 740 Park Ave */}
            <button
              type="button"
              onClick={() => handleSelectPreset('park_ave')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative flex gap-3.5 ${
                selectedPreset === 'park_ave'
                  ? 'border-[#0B1713] bg-white ring-2 ring-[#0B1713] shadow-md'
                  : 'border-[#E5E0D8] bg-white hover:border-stone-300 shadow-xs'
              }`}
            >
              <img
                src={propAdmiraltyImg}
                alt="740 Park Avenue"
                className="h-16 w-20 rounded-xl object-cover shrink-0 border border-stone-200"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[13.5px] font-extrabold text-stone-900 truncate">740 Park Avenue</span>
                  <span className="text-[10px] font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full shrink-0">
                    Penthouse
                  </span>
                </div>
                <p className="text-[12px] text-stone-500 truncate">Upper East Side, NY · $18,500/mo</p>
                <p className="text-[11px] text-stone-500 font-medium mt-1">
                  Simulates terrace doorway recapture
                </p>
              </div>
            </button>

            {/* PRESET 3 — 1048 Ocean Drive */}
            <button
              type="button"
              onClick={() => handleSelectPreset('ocean_dr')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative flex gap-3.5 ${
                selectedPreset === 'ocean_dr'
                  ? 'border-[#0B1713] bg-white ring-2 ring-[#0B1713] shadow-md'
                  : 'border-[#E5E0D8] bg-white hover:border-stone-300 shadow-xs'
              }`}
            >
              <img
                src={propBourdillonImg}
                alt="1048 Ocean Drive"
                className="h-16 w-20 rounded-xl object-cover shrink-0 border border-stone-200"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[13.5px] font-extrabold text-stone-900 truncate">1048 Ocean Drive</span>
                  <span className="text-[10px] font-bold bg-[#EBF2EC] text-[#2F613D] px-2 py-0.5 rounded-full shrink-0">
                    Full Coverage
                  </span>
                </div>
                <p className="text-[12px] text-stone-500 truncate">South Beach, Miami · $35,000/mo</p>
                <p className="text-[11px] text-[#2F613D] font-semibold mt-1">
                  100% complete footage · Direct build
                </p>
              </div>
            </button>

            {/* PRESET 4 — 452 Beverly Glen */}
            <button
              type="button"
              onClick={() => handleSelectPreset('beverly_glen')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative flex gap-3.5 ${
                selectedPreset === 'beverly_glen'
                  ? 'border-[#0B1713] bg-white ring-2 ring-[#0B1713] shadow-md'
                  : 'border-[#E5E0D8] bg-white hover:border-stone-300 shadow-xs'
              }`}
            >
              <img
                src={propOrchidImg}
                alt="452 Beverly Glen"
                className="h-16 w-20 rounded-xl object-cover shrink-0 border border-stone-200"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[13.5px] font-extrabold text-stone-900 truncate">452 Beverly Glen</span>
                  <span className="text-[10px] font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full shrink-0">
                    Bel Air
                  </span>
                </div>
                <p className="text-[12px] text-stone-500 truncate">Los Angeles, CA · $24,000/mo</p>
                <p className="text-[11px] text-stone-500 font-medium mt-1">
                  Complete architectural asset set
                </p>
              </div>
            </button>

          </div>
        </div>

        {/* Listing Form Preview */}
        <div className="rounded-2xl bg-white border border-[#E5E0D8] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
            <div>
              <h3 className="text-[16px] font-extrabold text-[#0B1713]">
                Listing Details & Attached Media
              </h3>
              <p className="text-[12.5px] text-stone-500 mt-0.5">
                Payload data dispatched to OpenHouse Ingestion Webhook
              </p>
            </div>
            <span className="text-[11.5px] font-bold uppercase tracking-wider text-stone-500">
              {bedrooms} Beds · {bathrooms} Baths
            </span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-bold text-stone-700 mb-1.5">Property Title / Unit</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/80 px-3.5 py-2.5 text-[13.5px] font-medium text-stone-900 focus:border-[#0B1713] focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-stone-700 mb-1.5">Address / City, State</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/80 px-3.5 py-2.5 text-[13.5px] font-medium text-stone-900 focus:border-[#0B1713] focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[12px] font-bold text-stone-700 mb-1.5">Property Type</label>
                <input
                  type="text"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/80 px-3.5 py-2.5 text-[13.5px] font-medium text-stone-900 focus:border-[#0B1713] focus:bg-white focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-stone-700 mb-1.5">Bedrooms</label>
                <input
                  type="number"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/80 px-3.5 py-2.5 text-[13.5px] font-medium text-stone-900 focus:border-[#0B1713] focus:bg-white focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-stone-700 mb-1.5">Bathrooms</label>
                <input
                  type="number"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/80 px-3.5 py-2.5 text-[13.5px] font-medium text-stone-900 focus:border-[#0B1713] focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[12px] font-bold text-stone-700 mb-1.5">Listed Price</label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/80 px-3.5 py-2.5 text-[13.5px] font-medium text-stone-900 focus:border-[#0B1713] focus:bg-white focus:outline-none transition-all"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[12px] font-bold text-stone-700 mb-1.5">Attached Media Files</label>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] px-3 py-2 text-[12px] font-semibold text-stone-800">
                    📷 16 High-Res Photos
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] px-3 py-2 text-[12px] font-semibold text-stone-800">
                    📐 1 CAD Floor Plan
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] px-3 py-2 text-[12px] font-semibold text-stone-800">
                    📹 1 Walkthrough Video
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-stone-700 mb-1.5">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/80 px-3.5 py-2.5 text-[13.5px] font-medium text-stone-900 focus:border-[#0B1713] focus:bg-white focus:outline-none transition-all"
              />
            </div>

            {/* Test Simulation Controls */}
            <div className="pt-2">
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-stone-900">Simulate Spatial Gap Detection</span>
                    <span className="text-[10px] font-extrabold bg-[#D97945]/10 text-[#D97945] px-2 py-0.5 rounded-full uppercase">
                      Gemini 3.7 Flash QA
                    </span>
                  </div>
                  <p className="text-[12px] text-stone-500 mt-0.5">
                    When enabled, OpenHouse identifies the missing pool transition and generates a 15s mobile recapture link.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMissingSpaceFlag(!missingSpaceFlag)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    missingSpaceFlag ? 'bg-[#2F613D]' : 'bg-stone-300'
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
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#E5E0D8]">
              <div className="text-[12px] text-stone-500">
                <span>Webhook endpoint: </span>
                <code className="font-mono font-semibold text-stone-800 bg-stone-100 px-2 py-1 rounded">
                  POST /api/webhook/listing-intake
                </code>
              </div>

              <button
                type="button"
                onClick={handlePublish}
                disabled={isPublishing}
                className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#0B1713] px-7 py-3.5 text-[13.5px] font-bold text-white shadow-md hover:bg-black active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
              >
                {isPublishing ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Transmitting to OpenHouse Engine...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span>Publish & Trigger OpenHouse Ingestion →</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Webhook Broadcast Notification */}
        {webhookSent && (
          <div className="rounded-2xl bg-[#0B1713] text-white p-6 border border-stone-800 shadow-xl animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-3 w-3 rounded-full bg-[#4ADE80] animate-ping" />
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#4ADE80]">
                Webhook Intercepted by OpenHouse Intelligence Engine
              </span>
            </div>
            <p className="text-[13.5px] text-stone-300">
              Listing at <strong className="text-white">{address}</strong> ingested. Autonomous Gemini 3.7 Flash spatial analysis has started in your workspace.
            </p>
          </div>
        )}

      </main>
    </div>
  )
}
