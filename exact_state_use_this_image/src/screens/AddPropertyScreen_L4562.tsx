import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { OpenHouseLogoMark } from '../components/WorkspaceShell'
import { useStore } from '../data/store'
import {
  CameraIcon,
  VideoCameraIcon,
  CropIcon,
  Box3dPointIcon,
  PlusIcon,
  CheckCircleIcon,
} from '../components/icons2'
import propHeroWaterfront from '../assets/prop-hero-waterfront.jpg'
import propKitchenImg from '../assets/prop-kitchen.png'
import propBourdillonImg from '../assets/prop-bourdillon.jpg'
import propOrchidImg from '../assets/prop-orchid.jpg'
import pointcloudImg from '../assets/openhouse-pointcloud-doorway.png'

export function AddPropertyScreen() {
  const navigate = useNavigate()
  const { addProperty } = useStore()
  
  const [tab, setTab] = useState<'import' | 'manual'>('import')
  const [listingUrl, setListingUrl] = useState('https://example.com/listings/14-cooper-road')
  const [address, setAddress] = useState('14 Cooper Road')
  const [area, setArea] = useState('Ikoyi')
  const [city, setCity] = useState('Lagos')
  const [propertyType, setPropertyType] = useState('Apartment')
  const [bedrooms, setBedrooms] = useState('3')
  const [bathrooms, setBathrooms] = useState('3')
  const [price, setPrice] = useState('₦12,000,000 / year')
  const [title, setTitle] = useState('3-bedroom apartment in Ikoyi')
  const [description, setDescription] = useState(
    'A bright three-bedroom apartment with connected living and dining spaces, a private balcony and secure parking.'
  )
  const [amenities, setAmenities] = useState([
    'Balcony',
    'Parking',
    'En-suite bedrooms',
    'Security',
    'Fitted kitchen',
  ])
  const [newAmenity, setNewAmenity] = useState('')
  const [isAddingAmenity, setIsAddingAmenity] = useState(false)

  const handleRemoveAmenity = (name: string) => {
    setAmenities(amenities.filter((a) => a !== name))
  }

  const handleAddAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()])
      setNewAmenity('')
      setIsAddingAmenity(false)
    }
  }

  const handleContinue = () => {
    const newProp = {
      id: `prop-${Date.now().toString().slice(-4)}`,
      title: title || 'New Property Listing',
      address: `${address}, ${area}, ${city}`,
      price,
      type: propertyType,
      bedrooms: parseInt(bedrooms) || 3,
      bathrooms: parseInt(bathrooms) || 3,
      description,
      status: 'preparing' as const,
      coverImage: propHeroWaterfront,
      spaces: [
        { id: '1', name: 'Entrance', captured: true, verified: true, issues: [] },
        { id: '2', name: 'Living room', captured: true, verified: true, issues: [] },
        { id: '3', name: 'Kitchen', captured: true, verified: true, issues: [] },
        { id: '4', name: 'Main bedroom', captured: true, verified: true, issues: [] },
        { id: '5', name: 'Balcony', captured: false, verified: false, issues: ['recapture_needed'] },
      ],
      media: [],
      amenities,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    addProperty(newProp)
    navigate(`/property/${newProp.id}`)
  }

  return (
    <div className="min-h-screen bg-canvas font-sans text-ink flex flex-col justify-between">
      {/* ========================================================================= */}
      {/* TOP WIZARD NAVBAR */}
      {/* ========================================================================= */}
      <header className="h-16 px-6 lg:px-12 flex items-center justify-between border-b border-border bg-canvas sticky top-0 z-20">
        {/* Left: Brand + Screen Title */}
        <div className="flex items-center gap-3">
          <Link to="/properties" className="flex items-center gap-2">
            <OpenHouseLogoMark className="h-5 w-5" />
            <span className="text-[17px] font-extrabold tracking-tight text-ink">OpenHouse</span>
          </Link>
          <div className="h-4 w-[1px] bg-border mx-1" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-ink">Add property</span>
            <Link to="/properties" className="text-ink-3 hover:text-ink text-sm font-mono">
              ✕
            </Link>
          </div>
        </div>

        {/* Center: Stepper */}
        <div className="hidden sm:flex items-center gap-6 text-xs font-semibold">
          <div className="flex items-center gap-2 text-ink">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#194534] text-white text-[11px]">
              1
            </span>
            <span className="font-bold">Property</span>
          </div>
          <div className="h-[1px] w-6 bg-border" />
          <div className="flex items-center gap-2 text-ink-3">
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-stone-300 text-[11px]">
              2
            </span>
            <span>Capture</span>
          </div>
          <div className="h-[1px] w-6 bg-border" />
          <div className="flex items-center gap-2 text-ink-3">
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-stone-300 text-[11px]">
              3
            </span>
            <span>Publish</span>
          </div>
        </div>

        {/* Right: Step Indicator */}
        <div className="text-xs text-ink-2 font-medium">
          Step 1 of 3
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN FORM CONTENT */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-6 lg:px-12 py-8">
        
        {/* Title and Subtitle */}
        <div className="pb-6">
          <h1 className="text-[28px] sm:text-[32px] font-extrabold tracking-tight text-ink leading-tight">
            Add a property
          </h1>
          <p className="text-[14px] text-ink-2 mt-1">
            Import an existing listing or enter the property details manually.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Input Form */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Import vs Manual Toggle */}
            <div className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-surface p-1.5 max-w-[420px] shadow-subtle">
              <button
                onClick={() => setTab('import')}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                  tab === 'import'
                    ? 'bg-[#EBF3ED] text-[#194534] border border-[#194534]/30 shadow-sm'
                    : 'text-ink-2 hover:text-ink'
                }`}
              >
                <span>↗</span>
                <span>Import listing</span>
              </button>
              <button
                onClick={() => setTab('manual')}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                  tab === 'manual'
                    ? 'bg-[#EBF3ED] text-[#194534] border border-[#194534]/30 shadow-sm'
                    : 'text-ink-2 hover:text-ink'
                }`}
              >
                <span>✎</span>
                <span>Enter manually</span>
              </button>
            </div>

            {/* Listing URL Input */}
            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">
                Listing URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={listingUrl}
                  onChange={(e) => setListingUrl(e.target.value)}
                  placeholder="https://example.com/listings/14-cooper-road"
                  className="flex-1 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-ink outline-none focus:border-[#194534] focus:ring-2 focus:ring-[#194534]/15 shadow-subtle transition-all"
                />
                <button
                  onClick={() => alert('Listing details imported successfully!')}
                  className="rounded-xl bg-[#17231E] hover:bg-black px-5 py-2.5 text-xs font-bold text-white shadow-subtle transition-colors"
                >
                  Import listing
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex-1 h-[1px] bg-border" />
              <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-ink-3">
                OR REVIEW THE DETAILS
              </span>
              <div className="flex-1 h-[1px] bg-border" />
            </div>

            {/* Form Fields */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-subtle space-y-4">
              
              {/* Address & Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-lg border border-border bg-canvas px-3 py-2 text-xs sm:text-sm text-ink outline-none focus:border-[#194534]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Area</label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full rounded-lg border border-border bg-canvas px-3 py-2 text-xs sm:text-sm text-ink outline-none focus:border-[#194534]"
                  />
                </div>
              </div>

              {/* City & Property type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-lg border border-border bg-canvas px-3 py-2 text-xs sm:text-sm text-ink outline-none focus:border-[#194534]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Property type</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full rounded-lg border border-border bg-canvas px-3 py-2 text-xs sm:text-sm text-ink outline-none focus:border-[#194534]"
                  >
                    <option>Apartment</option>
                    <option>Terrace Duplex</option>
                    <option>Detached House</option>
                    <option>Penthouse</option>
                  </select>
                </div>
              </div>

              {/* Bedrooms & Bathrooms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Bedrooms</label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full rounded-lg border border-border bg-canvas px-3 py-2 text-xs sm:text-sm text-ink outline-none focus:border-[#194534]"
                  >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Bathrooms</label>
                  <select
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className="w-full rounded-lg border border-border bg-canvas px-3 py-2 text-xs sm:text-sm text-ink outline-none focus:border-[#194534]"
                  >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5+</option>
                  </select>
                </div>
              </div>

              {/* Price & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Listing price</label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-lg border border-border bg-canvas px-3 py-2 text-xs sm:text-sm text-ink outline-none focus:border-[#194534]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Listing title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-lg border border-border bg-canvas px-3 py-2 text-xs sm:text-sm text-ink outline-none focus:border-[#194534]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-border bg-canvas px-3 py-2 text-xs sm:text-sm text-ink outline-none focus:border-[#194534]"
                />
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-canvas px-3 py-1.5 text-xs text-ink font-medium"
                    >
                      <span>{item}</span>
                      <button
                        onClick={() => handleRemoveAmenity(item)}
                        className="text-ink-3 hover:text-ink text-[11px]"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                  
                  {isAddingAmenity ? (
                    <div className="inline-flex items-center gap-1">
                      <input
                        type="text"
                        value={newAmenity}
                        onChange={(e) => setNewAmenity(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddAmenity()}
                        placeholder="Amenity name"
                        className="rounded-lg border border-border bg-canvas px-2.5 py-1 text-xs text-ink outline-none"
                        autoFocus
                      />
                      <button
                        onClick={handleAddAmenity}
                        className="rounded-lg bg-[#17231E] px-2 py-1 text-xs text-white"
                      >
                        Add
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsAddingAmenity(true)}
                      className="inline-flex items-center gap-1 rounded-lg border border-dashed border-border px-3 py-1.5 text-xs text-ink-2 hover:text-ink font-medium"
                    >
                      <span>+ Add amenity</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: Imported Summary & Photo Grid */}
          <div className="lg:col-span-5 rounded-2xl border border-border bg-surface p-6 shadow-card space-y-5">
            <div>
              <h3 className="text-[16px] font-bold text-ink mb-3">Imported from listing</h3>
              
              <div className="space-y-2 text-xs text-ink-2">
                <p className="flex items-center gap-2">
                  <span className="text-ink-3">🖼</span>
                  <span>12 property photos</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-ink-3">🎥</span>
                  <span>1 walkthrough video</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-ink-3">📐</span>
                  <span>1 floor plan</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-ink-3">📄</span>
                  <span>Listing description</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-ink-3">📋</span>
                  <span>Property specifications</span>
                </p>
              </div>
            </div>

            {/* Photo Grid Preview */}
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <div className="aspect-[4/3] rounded-lg overflow-hidden border border-border/60 bg-stone-100">
                  <img src={propHeroWaterfront} alt="Balcony" className="h-full w-full object-cover" />
                </div>
                <div className="aspect-[4/3] rounded-lg overflow-hidden border border-border/60 bg-stone-100">
                  <img src={propKitchenImg} alt="Kitchen" className="h-full w-full object-cover" />
                </div>
                <div className="aspect-[4/3] rounded-lg overflow-hidden border border-border/60 bg-stone-100">
                  <img src={propBourdillonImg} alt="Bedroom" className="h-full w-full object-cover" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="aspect-[16/10] rounded-lg overflow-hidden border border-border/60 bg-stone-100">
                  <img src={pointcloudImg} alt="Floor plan" className="h-full w-full object-cover" />
                </div>
                <div className="relative aspect-[16/10] rounded-lg overflow-hidden border border-border/60 bg-stone-900">
                  <img src={propOrchidImg} alt="Courtyard" className="h-full w-full object-cover opacity-60" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/40 backdrop-blur-[2px]">
                    <span className="text-base font-bold">+7</span>
                    <span className="text-[11px]">more photos</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* ========================================================================= */}
      {/* BOTTOM ACTION BAR */}
      {/* ========================================================================= */}
      <footer className="h-18 px-6 lg:px-12 flex items-center justify-between border-t border-border bg-canvas sticky bottom-0 z-20 py-4">
        <Link
          to="/properties"
          className="rounded-xl border border-border bg-surface hover:bg-raised-2 px-6 py-2.5 text-xs sm:text-sm font-semibold text-ink transition-colors shadow-subtle"
        >
          Cancel
        </Link>
        <button
          onClick={handleContinue}
          className="rounded-xl bg-[#17231E] hover:bg-black px-8 py-2.5 text-xs sm:text-sm font-bold text-white shadow-subtle transition-colors"
        >
          Continue
        </button>
      </footer>
    </div>
  )
}
