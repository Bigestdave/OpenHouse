import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { WorkspaceShell } from '../components/WorkspaceShell'
import { useStore } from '../data/store'
import { CopyIcon, ClockIcon } from '../components/icons2'
import { Ellipsis } from '../components/icons'
import propBourdillonImg from '../assets/prop-bourdillon.jpg'
import propAdmiraltyImg from '../assets/prop-admiralty.jpg'
import propKitchenImg from '../assets/prop-kitchen.png'
import propOrchidImg from '../assets/prop-orchid.jpg'
import propLekkiImg from '../assets/prop-lekkigardens.jpg'
import pointcloudImg from '../assets/openhouse-pointcloud-doorway.png'
import propHeroWaterfront from '../assets/prop-hero-waterfront.jpg'

export function ShowOverviewScreen() {
  const { id } = useParams()

  const { properties } = useStore()
  const [activeTab, setActiveTab] = useState<'Overview' | 'Evidence' | 'Experience' | 'Activity'>('Overview')
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [activeRoomIndex, setActiveRoomIndex] = useState(1) // Living room default
  const [isPublished, setIsPublished] = useState(false)
  const [issuesOpen, setIssuesOpen] = useState(true)

  // Find property by id, slug, or fallback to 8 Admiralty Way
  const property = properties.find((p) => 
    p.id === id || 
    p.title.toLowerCase().includes(id?.toLowerCase() || '')
  ) || properties[0] || {
    id: 'prop-01',
    title: '8 Admiralty Way',
    address: 'Lekki, Lagos',
    code: 'OH-00241',
    type: '3-bedroom apartment',
    status: 'preparing',
    spaces: [
      { id: '1', name: 'Entrance', captured: true, source: 'Phone capture', type: 'entrance' },
      { id: '2', name: 'Living room', captured: true, source: 'Phone capture', type: 'living' },
      { id: '3', name: 'Kitchen', captured: true, source: 'Phone capture', type: 'kitchen' },
      { id: '4', name: 'Main bedroom', captured: true, source: 'Phone capture', type: 'bedroom' },
      { id: '5', name: 'Bedroom 2', captured: true, source: 'Phone capture', type: 'bedroom' },
      { id: '6', name: 'Bedroom 3', captured: true, source: 'Phone capture', type: 'bedroom' },
      { id: '7', name: 'Balcony', captured: true, source: 'Original video + requested recapture', recaptured: true, type: 'balcony' },
    ]
  }

  const spacesList = [
    { id: '1', name: 'Entrance', image: propAdmiraltyImg, desc: 'Connected to the building corridor and living room.' },
    { id: '2', name: 'Living room', image: propHeroWaterfront || propAdmiraltyImg, desc: 'Connected to the entrance hall, kitchen and balcony.' },
    { id: '3', name: 'Kitchen', image: propKitchenImg, desc: 'Contemporary fitted kitchen with central marble island.' },
    { id: '4', name: 'Main bedroom', image: propBourdillonImg, desc: 'Master suite with lagoon views and connected en-suite bath.' },
    { id: '5', name: 'Bedroom 2', image: propOrchidImg, desc: 'Secondary bedroom with natural light.' },
    { id: '6', name: 'Bedroom 3', image: propLekkiImg, desc: 'Third bedroom overlooking the residential courtyard.' },
    { id: '7', name: 'Balcony', image: propHeroWaterfront || propAdmiraltyImg, desc: 'Panoramic terrace overlooking the waterfront.' },
  ]

  const activeRoom = spacesList[activeRoomIndex] || spacesList[1]

  const handleCopyId = () => {
    navigator.clipboard.writeText(property.title || '8 Admiralty Way')
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  return (
    <WorkspaceShell>
      <div className="mx-auto max-w-[1340px] px-6 sm:px-8 py-6 font-sans text-ink">
        
        {/* ========================================================================= */}
        {/* TOP HEADER: Breadcrumbs, Title, Metadata & Action Buttons */}
        {/* ========================================================================= */}
        <div className="pb-5 border-b border-border">
          {/* Breadcrumb row */}
          <div className="flex items-center gap-1.5 text-xs text-ink-2 mb-1.5">
            <Link to="/properties" className="hover:underline hover:text-ink">
              Properties
            </Link>
            <span>&gt;</span>
            <span className="font-semibold text-ink">{property.title}</span>
          </div>

          {/* Title & Actions Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-[26px] sm:text-[30px] font-extrabold tracking-tight text-ink leading-tight">
                  {property.title}
                </h1>
                <button
                  onClick={handleCopyId}
                  className="text-ink-3 hover:text-ink p-1 rounded transition-colors"
                  title="Copy title"
                >
                  <CopyIcon size={16} />
                </button>
                {copiedLink && <span className="text-[10.5px] font-semibold text-[#194534]">Copied!</span>}
              </div>

              {/* Subtitle / Metadata */}
              <p className="text-[13px] text-ink-2 mt-1 flex items-center gap-2 flex-wrap">
                <span>{property.type || '3-bedroom apartment'}</span>
                <span>·</span>
                <span>{property.address || 'Lekki, Lagos'}</span>
                <span>·</span>
                <span>OH-00241</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1.5 font-medium text-ink">
                  <span className={`h-2 w-2 rounded-full ${activeTab === 'Experience' ? 'bg-[#194534]' : 'bg-[#194534]'}`} />
                  {activeTab === 'Experience' ? 'Ready for review' : 'Preparing experience'}
                </span>
              </p>
            </div>

            {/* Top Right Action Buttons */}
            <div className="flex items-center gap-2.5">
              {activeTab === 'Experience' ? (
                <Link
                  to={`/view/${property.id}`}
                  target="_blank"
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-surface hover:bg-raised-2 px-3.5 py-2 text-xs sm:text-[13px] font-semibold text-ink transition-colors shadow-subtle"
                >
                  <span>Preview as visitor</span>
                  <span className="text-xs">↗</span>
                </Link>
              ) : (
                <button
                  onClick={() => setActiveTab('Experience')}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-surface hover:bg-raised-2 px-3.5 py-2 text-xs sm:text-[13px] font-semibold text-ink transition-colors shadow-subtle"
                >
                  <span>Preview media</span>
                  <span className="text-xs">↗</span>
                </button>
              )}
              <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface hover:bg-raised-2 text-ink-2 hover:text-ink shadow-subtle">
                <Ellipsis size={16} />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-6 pt-5 mt-2 border-t border-border/40 text-[13.5px] font-medium overflow-x-auto">
            <button
              onClick={() => setActiveTab('Overview')}
              className={`pb-2.5 flex items-center gap-1.5 transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'Overview'
                  ? 'border-ink text-ink font-bold'
                  : 'border-transparent text-ink-2 hover:text-ink'
              }`}
            >
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('Evidence')}
              className={`pb-2.5 flex items-center gap-1.5 transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'Evidence'
                  ? 'border-ink text-ink font-bold'
                  : 'border-transparent text-ink-2 hover:text-ink'
              }`}
            >
              <span>Evidence</span>
            </button>
            <button
              onClick={() => setActiveTab('Experience')}
              className={`pb-2.5 flex items-center gap-1.5 transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'Experience'
                  ? 'border-ink text-ink font-bold'
                  : 'border-transparent text-ink-2 hover:text-ink'
              }`}
            >
              <span>Experience</span>
            </button>
            <button
              onClick={() => setActiveTab('Activity')}
              className={`pb-2.5 flex items-center gap-1.5 transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'Activity'
                  ? 'border-ink text-ink font-bold'
                  : 'border-transparent text-ink-2 hover:text-ink'
              }`}
            >
              <span>Activity</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW (Matches Reference 5) */}
        {/* ========================================================================= */}
        {activeTab === 'Overview' && (
          <div className="space-y-6 pt-6">
            
            {/* HERO SPLIT BANNER */}
            <div className="grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
              {/* Left Photo */}
              <div className="relative aspect-[16/10] lg:aspect-auto lg:col-span-6 min-h-[300px] overflow-hidden bg-sidebar">
                <img
                  src={propHeroWaterfront || propAdmiraltyImg}
                  alt={property.title}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Right Status Panel with Checklist */}
              <div className="flex flex-col justify-between p-6 sm:p-7 lg:col-span-6 bg-surface">
                <div>
                  <div className="flex items-center gap-2 pb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#194534]">
                      OPENHOUSE IS WORKING
                    </span>
                    <span className="h-2 w-2 rounded-full bg-[#194534]" />
                  </div>

                  <h2 className="text-[22px] font-bold tracking-tight text-ink leading-tight">
                    Building the property experience
                  </h2>
                  <p className="pt-2 text-[13px] text-ink-2 leading-relaxed">
                    The additional balcony capture passed its quality check. OpenHouse is now preparing the connected experience.
                  </p>

                  <div className="flex items-center gap-4 pt-3 text-[12.5px] text-ink-2">
                    <div className="flex items-center gap-1.5">
                      <ClockIcon size={14} className="text-ink-3" />
                      <span><strong className="font-semibold text-ink">18–25 minutes</strong> · Estimated completion</span>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      onClick={() => setShowActivityModal(true)}
                      className="rounded-lg border border-border bg-surface hover:bg-raised-2 px-3.5 py-1.5 text-xs font-semibold text-ink transition-colors shadow-subtle"
                    >
                      View activity
                    </button>
                  </div>
                </div>

                {/* Vertical Progress Checklist */}
                <div className="pt-5 mt-4 border-t border-border/60 space-y-2.5 text-[12.5px]">
                  <div className="flex items-center gap-2.5 text-ink-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-stone-200 text-[10px] text-stone-700 font-bold">✓</span>
                    <span>Listing collected</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-ink-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-stone-200 text-[10px] text-stone-700 font-bold">✓</span>
                    <span>Seven expected spaces identified</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-ink-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-stone-200 text-[10px] text-stone-700 font-bold">✓</span>
                    <span>Balcony capture requested</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-ink-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-stone-200 text-[10px] text-stone-700 font-bold">✓</span>
                    <span>New footage received</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-ink font-semibold">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#194534] text-[10px] text-white">➔</span>
                    <div className="flex items-center gap-2">
                      <span>Building interactive experience</span>
                      <span className="text-[11px] font-normal text-ink-2">In progress</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-ink-3">
                    <span className="h-3.5 w-3.5 rounded-full border border-stone-300 ml-0.5" />
                    <span>Checking the finished experience · <span className="text-[11px]">Pending</span></span>
                  </div>
                  <div className="flex items-center gap-2.5 text-ink-3">
                    <span className="h-3.5 w-3.5 rounded-full border border-stone-300 ml-0.5" />
                    <span>Ready for your approval · <span className="text-[11px]">Pending</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTTOM 3 CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* CARD 1: Reconstruction status */}
              <div className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-subtle">
                <div>
                  <h3 className="text-[14px] font-bold text-ink mb-3">Reconstruction status</h3>
                  <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-border/80 bg-stone-100 flex items-center justify-center">
                    <img
                      src={pointcloudImg}
                      alt="Pointcloud Reconstruction"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <p className="text-[12.5px] font-medium text-ink flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#194534]" />
                    <span>Connecting living room to balcony</span>
                  </p>
                  <p className="text-[11px] text-ink-3 pl-4">Reconstruction underway</p>
                </div>
              </div>

              {/* CARD 2: Property evidence */}
              <div className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-subtle">
                <div>
                  <h3 className="text-[14px] font-bold text-ink mb-3">Property evidence</h3>
                  
                  {/* Top Stats */}
                  <div className="grid grid-cols-3 gap-2 pb-3 mb-3 border-b border-border/60 text-center">
                    <div className="bg-canvas rounded-lg p-2">
                      <span className="text-[18px] font-bold text-ink block leading-none">7</span>
                      <span className="text-[10.5px] text-ink-3 mt-1 block">Expected spaces</span>
                    </div>
                    <div className="bg-canvas rounded-lg p-2">
                      <span className="text-[18px] font-bold text-[#194534] block leading-none">7</span>
                      <span className="text-[10.5px] text-ink-3 mt-1 block">Captured</span>
                    </div>
                    <div className="bg-canvas rounded-lg p-2">
                      <span className="text-[18px] font-bold text-ink block leading-none">1</span>
                      <span className="text-[10.5px] text-ink-3 mt-1 block">Issue resolved</span>
                    </div>
                  </div>

                  {/* Spaces List */}
                  <div className="space-y-2 text-[12px] max-h-[190px] overflow-y-auto pr-1">
                    <div className="flex items-center justify-between py-1 border-b border-border/40">
                      <span className="font-medium text-ink">Entrance</span>
                      <span className="text-ink-2">Phone capture</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-border/40">
                      <span className="font-medium text-ink">Living room</span>
                      <span className="text-ink-2">Phone capture</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-border/40">
                      <span className="font-medium text-ink">Kitchen</span>
                      <span className="text-ink-2">Phone capture</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-border/40">
                      <span className="font-medium text-ink">Main bedroom</span>
                      <span className="text-ink-2">Phone capture</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-border/40">
                      <span className="font-medium text-ink">Bedroom 2</span>
                      <span className="text-ink-2">Phone capture</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-border/40">
                      <span className="font-medium text-ink">Bedroom 3</span>
                      <span className="text-ink-2">Phone capture</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="font-bold text-ink">Balcony</span>
                      <span className="text-[#194534] font-semibold">Original video + recapture</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 3: Recent activity */}
              <div className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-subtle">
                <div>
                  <h3 className="text-[14px] font-bold text-ink mb-3">Recent activity</h3>
                  
                  {/* Timeline Items */}
                  <div className="space-y-3.5 text-[12px]">
                    <div className="flex items-start gap-3">
                      <span className="text-ink-3 font-mono text-[11px] shrink-0 pt-0.5">14:02</span>
                      <span className="h-2 w-2 rounded-full bg-[#194534] mt-1.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-ink leading-tight">Additional balcony footage received</p>
                        <p className="text-ink-3 text-[11px]">New media uploaded</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-ink-3 font-mono text-[11px] shrink-0 pt-0.5">14:03</span>
                      <span className="h-2 w-2 rounded-full bg-[#194534] mt-1.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-ink leading-tight">Capture quality passed</p>
                        <p className="text-ink-3 text-[11px]">All footage verified</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-ink-3 font-mono text-[11px] shrink-0 pt-0.5">14:04</span>
                      <span className="h-2 w-2 rounded-full bg-[#194534] mt-1.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-ink leading-tight">Reconstruction resumed</p>
                        <p className="text-ink-3 text-[11px]">Building the connected experience</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-ink-3 font-mono text-[11px] shrink-0 pt-0.5">14:08</span>
                      <span className="h-2 w-2 rounded-full bg-[#194534] mt-1.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-ink leading-tight">Living room and balcony connected</p>
                        <p className="text-ink-3 text-[11px]">Spatial connection established</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/60">
                  <button
                    onClick={() => setShowActivityModal(true)}
                    className="w-full rounded-lg border border-border bg-surface hover:bg-raised-2 py-2 text-xs font-semibold text-ink text-center transition-colors"
                  >
                    View all activity
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2 & 3: EXPERIENCE (Matches Reference 3) */}
        {/* ========================================================================= */}
        {(activeTab === 'Experience' || activeTab === 'Evidence') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 pt-6">
            
            {/* LEFT: 3D Interactive Room Tour Viewer */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Main Viewer Card */}
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-border bg-stone-900 shadow-card">
                <img
                  src={activeRoom.image}
                  alt={activeRoom.name}
                  className="h-full w-full object-cover"
                />

                {/* Top Left Room Tag */}
                <div className="absolute top-4 left-4 rounded-md bg-black/60 backdrop-blur-md px-3 py-1 text-white text-[11px] font-mono font-bold tracking-wider uppercase border border-white/10">
                  {activeRoom.name.toUpperCase()} / 0{activeRoomIndex + 1}
                </div>

                {/* Bottom Left Room Details */}
                <div className="absolute bottom-4 left-4 max-w-[400px] rounded-xl bg-black/75 backdrop-blur-md p-3.5 text-white border border-white/10 shadow-lg">
                  <h4 className="text-[15px] font-bold leading-tight">{activeRoom.name}</h4>
                  <p className="text-[12px] text-white/80 font-normal mt-1 leading-snug">
                    {activeRoom.desc}
                  </p>
                </div>

                {/* Bottom Right Control Buttons */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                  <button className="flex items-center gap-1.5 rounded-lg bg-black/60 backdrop-blur-md px-3 py-1.5 text-xs text-white border border-white/10 hover:bg-black/80 transition-colors">
                    <span>Rooms</span>
                  </button>
                  <button className="flex items-center gap-1.5 rounded-lg bg-black/60 backdrop-blur-md px-3 py-1.5 text-xs text-white border border-white/10 hover:bg-black/80 transition-colors">
                    <span>Map</span>
                  </button>
                  <button className="flex items-center gap-1.5 rounded-lg bg-black/60 backdrop-blur-md px-3 py-1.5 text-xs text-white border border-white/10 hover:bg-black/80 transition-colors">
                    <span>Full screen</span>
                  </button>
                </div>
              </div>

              {/* Room Carousel Strip */}
              <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1">
                {spacesList.map((space, idx) => (
                  <button
                    key={space.id}
                    onClick={() => setActiveRoomIndex(idx)}
                    className={`flex flex-col items-center gap-1.5 shrink-0 transition-all ${
                      activeRoomIndex === idx
                        ? 'opacity-100 scale-105'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div
                      className={`h-16 w-24 rounded-lg overflow-hidden border-2 ${
                        activeRoomIndex === idx
                          ? 'border-[#194534] ring-2 ring-[#194534]/30 shadow-md'
                          : 'border-border'
                      }`}
                    >
                      <img
                        src={space.image}
                        alt={space.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="text-[11.5px] font-semibold text-ink truncate max-w-[90px]">
                      {space.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Bottom Action Controls Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3">
                <button
                  onClick={() => alert('Change request recorded')}
                  className="rounded-lg border border-border bg-surface hover:bg-raised-2 px-4 py-2 text-[13px] font-semibold text-ink transition-colors shadow-subtle"
                >
                  Request changes
                </button>

                <div className="flex items-center gap-3">
                  <div className="rounded-lg border border-border bg-surface px-3 py-2 text-[13px] text-ink font-medium shadow-subtle flex items-center gap-2">
                    <span>Visibility: <strong>Unlisted link</strong></span>
                    <span className="text-xs">⌵</span>
                  </div>

                  <button
                    onClick={() => setIsPublished(true)}
                    className={`rounded-lg px-5 py-2 text-[13.5px] font-bold text-white shadow-subtle transition-all ${
                      isPublished
                        ? 'bg-[#194534] hover:bg-[#16A34A]'
                        : 'bg-[#17231E] hover:bg-black'
                    }`}
                  >
                    {isPublished ? 'Published ✓' : 'Approve and publish'}
                  </button>
                </div>
              </div>

            </div>

            {/* RIGHT SIDEBAR: Ready to publish, Evidence & Activity */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Card 1: Ready to publish checklist */}
              <div className="rounded-2xl border border-border bg-surface p-5 shadow-subtle">
                <h3 className="text-[14px] font-bold text-ink mb-3">Ready to publish</h3>
                <div className="space-y-2.5 text-[12.5px] text-ink-2">
                  <div className="flex items-start gap-2.5">
                    <span className="h-4 w-4 rounded-full bg-[#194534] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
                    <span className="text-ink font-medium">6 of 6 advertised rooms represented</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="h-4 w-4 rounded-full bg-[#194534] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
                    <span className="text-ink font-medium">2 capture issues identified and resolved</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="h-4 w-4 rounded-full bg-[#194534] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
                    <span className="text-ink font-medium">No blocking inconsistencies detected</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Evidence breakdown with signal bars */}
              <div className="rounded-2xl border border-border bg-surface p-5 shadow-subtle">
                <h3 className="text-[14px] font-bold text-ink mb-3">Evidence</h3>
                
                <div className="space-y-3.5 text-[12px]">
                  {/* Item 1 */}
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-border/40">
                    <div>
                      <p className="font-bold text-ink">Room coverage</p>
                      <p className="text-ink-3 text-[11px]">7 captured spaces</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-[#194534]">Verified</span>
                      <div className="flex items-center gap-0.5">
                        <span className="h-3 w-1 rounded-sm bg-[#194534]" />
                        <span className="h-3 w-1 rounded-sm bg-[#194534]" />
                        <span className="h-3 w-1 rounded-sm bg-[#194534]" />
                      </div>
                      <span className="text-ink-3 text-xs">›</span>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-border/40">
                    <div>
                      <p className="font-bold text-ink">Balcony connection</p>
                      <p className="text-ink-3 text-[11px]">Original video + requested recapture</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-[#194534]">Verified</span>
                      <div className="flex items-center gap-0.5">
                        <span className="h-3 w-1 rounded-sm bg-[#194534]" />
                        <span className="h-3 w-1 rounded-sm bg-[#194534]" />
                        <span className="h-3 w-1 rounded-sm bg-[#194534]" />
                      </div>
                      <span className="text-ink-3 text-xs">›</span>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-border/40">
                    <div>
                      <p className="font-bold text-ink">Living-room dimensions</p>
                      <p className="text-ink-3 text-[11px]">Supplied floor plan</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-[#194534]">Verified</span>
                      <div className="flex items-center gap-0.5">
                        <span className="h-3 w-1 rounded-sm bg-[#194534]" />
                        <span className="h-3 w-1 rounded-sm bg-[#194534]" />
                        <span className="h-3 w-1 rounded-sm bg-[#194534]" />
                      </div>
                      <span className="text-ink-3 text-xs">›</span>
                    </div>
                  </div>

                  {/* Item 4 */}
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-bold text-ink">Bedroom 3 dimensions</p>
                      <p className="text-ink-3 text-[11px]">No scale evidence supplied</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium text-ink-3">Unavailable</span>
                      <div className="flex items-center gap-0.5">
                        <span className="h-3 w-1 rounded-sm bg-stone-300" />
                        <span className="h-3 w-1 rounded-sm bg-stone-200" />
                        <span className="h-3 w-1 rounded-sm bg-stone-200" />
                      </div>
                      <span className="text-ink-3 text-xs">›</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: 2 issues resolved Accordion */}
              <div className="rounded-2xl border border-border bg-surface p-4 shadow-subtle">
                <button
                  onClick={() => setIssuesOpen(!issuesOpen)}
                  className="w-full flex items-center justify-between text-[13px] font-bold text-ink text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border border-stone-400 flex items-center justify-center text-[10px]">✓</span>
                    <span>2 issues resolved</span>
                  </div>
                  <span className="text-xs">{issuesOpen ? '▲' : '▼'}</span>
                </button>

                {issuesOpen && (
                  <div className="pt-3 space-y-2 text-[11.5px] text-ink-2 pl-6">
                    <p className="flex items-center gap-2">
                      <span className="text-[#194534]">✓</span>
                      <span>Balcony doorway recaptured</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-[#194534]">✓</span>
                      <span>Floating visual artefact removed during quality review</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Card 4: OpenHouse activity */}
              <div className="rounded-2xl border border-border bg-surface p-5 shadow-subtle">
                <h3 className="text-[14px] font-bold text-ink mb-3">OpenHouse activity</h3>
                <div className="space-y-2 text-[12px] text-ink-2">
                  <p className="flex items-center gap-2">
                    <span className="text-[#194534]">✓</span>
                    <span>Listing evidence organized</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-[#194534]">✓</span>
                    <span>Missing balcony capture requested</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-[#194534]">✓</span>
                    <span>New footage received</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-[#194534]">✓</span>
                    <span>Experience reconstructed</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-[#194534]">✓</span>
                    <span>Visual verification passed</span>
                  </p>
                  <p className="flex items-center gap-2 font-bold text-ink pt-1">
                    <span className="text-[#194534]">➔</span>
                    <span>Awaiting your approval</span>
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: ACTIVITY (Full Log) */}
        {/* ========================================================================= */}
        {activeTab === 'Activity' && (
          <div className="pt-6">
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-subtle max-w-[800px]">
              <h2 className="text-[16px] font-bold text-ink mb-4">Complete Audit Log</h2>
              <div className="space-y-4 text-[13px]">
                <div className="flex items-start gap-4 pb-3 border-b border-border/60">
                  <span className="font-mono text-xs text-ink-3">14:08</span>
                  <div>
                    <p className="font-bold text-ink">Living room & balcony connected</p>
                    <p className="text-ink-2 text-xs">Spatial connection established</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 pb-3 border-b border-border/60">
                  <span className="font-mono text-xs text-ink-3">14:04</span>
                  <div>
                    <p className="font-bold text-ink">Reconstruction resumed</p>
                    <p className="text-ink-2 text-xs">Building connected experience</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 pb-3 border-b border-border/60">
                  <span className="font-mono text-xs text-ink-3">14:03</span>
                  <div>
                    <p className="font-bold text-ink">Capture quality passed</p>
                    <p className="text-ink-2 text-xs">All footage verified</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="font-mono text-xs text-ink-3">14:02</span>
                  <div>
                    <p className="font-bold text-ink">Additional balcony footage received</p>
                    <p className="text-ink-2 text-xs">New media uploaded from mobile capture</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVITY MODAL */}
        {showActivityModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-overlay font-sans text-ink">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <h3 className="text-lg font-bold text-ink">Reconstruction Activity Log</h3>
                <button onClick={() => setShowActivityModal(false)} className="text-ink-3 hover:text-ink font-mono text-lg">✕</button>
              </div>
              <div className="py-4 space-y-3 max-h-[360px] overflow-y-auto">
                <div className="p-3 bg-canvas rounded-xl text-xs space-y-1">
                  <span className="font-mono text-ink-3">14:08 UTC</span>
                  <p className="font-bold text-ink">Living room and balcony connected</p>
                  <p className="text-ink-2">Spatial graph solver aligned camera coordinate frames with 99.4% confidence.</p>
                </div>
                <div className="p-3 bg-canvas rounded-xl text-xs space-y-1">
                  <span className="font-mono text-ink-3">14:04 UTC</span>
                  <p className="font-bold text-ink">Reconstruction resumed</p>
                  <p className="text-ink-2">High-resolution radiance field rendering initialized.</p>
                </div>
                <div className="p-3 bg-canvas rounded-xl text-xs space-y-1">
                  <span className="font-mono text-ink-3">14:03 UTC</span>
                  <p className="font-bold text-ink">Quality check passed</p>
                  <p className="text-ink-2">Lighting balance and trajectory stability verified.</p>
                </div>
              </div>
              <div className="pt-3 border-t border-border flex justify-end">
                <button onClick={() => setShowActivityModal(false)} className="rounded-lg bg-[#17231E] px-4 py-2 text-xs font-bold text-white">Done</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </WorkspaceShell>
  )
}
