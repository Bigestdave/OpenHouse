import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { OpenHouseLogoMark } from '../components/WorkspaceShell'

// Custom SVGs matching the reference UI
function BuildingIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
    </svg>
  )
}

function UserProfileIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function BriefcaseIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )
}

function WebhookIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="3" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="18" r="3" />
      <path d="M12 8v4" />
      <path d="M10.5 13.5L7.5 16" />
      <path d="M13.5 13.5L16.5 16" />
    </svg>
  )
}

function CsvDocumentIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M8 15h1.5a1.5 1.5 0 0 0 0-3H8v6" />
      <path d="M13 18l2-6" />
    </svg>
  )
}

function ShieldCheckBadgeIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  )
}

function LinkChainIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

function BellNotificationIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function HomeHeartIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

export function InitialSetupScreen() {
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2 | 3>(1)

  // Step 1 Form Data
  const [workspaceName, setWorkspaceName] = useState("David's Property Workspace")
  const [workType, setWorkType] = useState<'agency' | 'independent' | 'manager'>('agency')
  const [portfolioSize, setPortfolioSize] = useState('11–50 active properties')
  const [primaryMarket, setPrimaryMarket] = useState('Lagos, Nigeria')
  const [teamSize, setTeamSize] = useState('2–5 people')
  const [userName, setUserName] = useState('David Olabowale')
  const [workEmail, setWorkEmail] = useState('david@openhouse.com')

  // Step 2 Form Data
  const [listingSource, setListingSource] = useState<'demo' | 'webhook' | 'csv' | 'manual'>('demo')

  // Step 3 Form Data
  const [requireApproval, setRequireApproval] = useState(true)
  const [visibility, setVisibility] = useState<'unlisted' | 'public' | 'password'>('unlisted')
  const [sendWhatsapp, setSendWhatsapp] = useState(true)
  const [sendEmail, setSendEmail] = useState(true)
  const [primaryRecipient, setPrimaryRecipient] = useState('David Olabowale')
  
  // Notification checkboxes
  const [notifyCaptureRequired, setNotifyCaptureRequired] = useState(true)
  const [notifyReviewReady, setNotifyReviewReady] = useState(true)
  const [notifyPublished, setNotifyPublished] = useState(true)
  const [notifyProcessingFailed, setNotifyProcessingFailed] = useState(true)
  const [notifyEveryUpdate, setNotifyEveryUpdate] = useState(false)

  const handleFinish = () => {
    navigate('/properties')
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-stone-900 antialiased flex flex-col justify-between selection:bg-stone-200">
      
      {/* TOP BAR */}
      <header className="px-8 py-5 flex items-center justify-between border-b border-stone-100">
        <Link to="/" className="flex items-center gap-2">
          <OpenHouseLogoMark className="h-6 w-6 object-contain" />
          <span className="text-[17px] font-extrabold tracking-tight text-[#0B1713]">
            OpenHouse
          </span>
        </Link>
        <span className="text-xs font-semibold text-stone-500">
          Step {step} of 3
        </span>
      </header>

      {/* MAIN WIZARD BODY */}
      <main className="flex-1 px-6 sm:px-8 max-w-[1100px] w-full mx-auto pt-6 pb-12">
        
        {/* STEPPER BAR */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            
            {/* Step 1 Node */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => setStep(1)}
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === 1
                    ? 'bg-[#194534] text-white shadow-xs'
                    : step > 1
                    ? 'bg-[#194534] text-white'
                    : 'border border-stone-300 text-stone-400 bg-white'
                }`}
              >
                {step > 1 ? '✓' : '1'}
              </button>
              <span className={`text-xs mt-1.5 ${step === 1 ? 'font-bold text-stone-900' : 'font-medium text-stone-500'}`}>
                Workspace
              </span>
            </div>

            {/* Line 1 -> 2 */}
            <div className={`h-px w-16 sm:w-24 mb-5 mx-2 transition-colors ${step > 1 ? 'bg-[#194534]' : 'bg-stone-300'}`} />

            {/* Step 2 Node */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => setStep(2)}
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === 2
                    ? 'bg-[#194534] text-white shadow-xs'
                    : step > 2
                    ? 'bg-[#194534] text-white'
                    : 'border border-stone-300 text-stone-400 bg-white'
                }`}
              >
                {step > 2 ? '✓' : '2'}
              </button>
              <span className={`text-xs mt-1.5 ${step === 2 ? 'font-bold text-stone-900' : 'font-medium text-stone-500'}`}>
                Listings
              </span>
            </div>

            {/* Line 2 -> 3 */}
            <div className={`h-px w-16 sm:w-24 mb-5 mx-2 transition-colors ${step > 2 ? 'bg-[#194534]' : 'bg-stone-300'}`} />

            {/* Step 3 Node */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => setStep(3)}
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === 3
                    ? 'bg-[#194534] text-white shadow-xs'
                    : 'border border-stone-300 text-stone-400 bg-white'
                }`}
              >
                3
              </button>
              <span className={`text-xs mt-1.5 ${step === 3 ? 'font-bold text-stone-900' : 'font-medium text-stone-500'}`}>
                Preferences
              </span>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: SET UP YOUR WORKSPACE */}
        {/* ========================================================================= */}
        {step === 1 && (
          <div className="max-w-[760px] mx-auto space-y-6 animate-fadeIn">
            
            {/* Title & Subtitle */}
            <div className="text-center space-y-1.5 mb-8">
              <h1 className="text-[32px] sm:text-[36px] font-bold text-stone-900 tracking-tight leading-tight">
                Set up your workspace
              </h1>
              <p className="text-sm text-stone-500 max-w-lg mx-auto leading-relaxed">
                Tell us how you manage properties so OpenHouse can prepare the right workflow.
              </p>
            </div>

            {/* Workspace Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-800 block">
                Workspace name
              </label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="e.g. David's Property Workspace"
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#194534]/15 focus:border-[#194534] shadow-2xs"
              />
            </div>

            {/* How do you work? Selectable Cards */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-semibold text-stone-800 block">
                How do you work?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                
                {/* Option 1: Property Agency */}
                <div
                  onClick={() => setWorkType('agency')}
                  className={`rounded-2xl p-4 relative cursor-pointer transition-all ${
                    workType === 'agency'
                      ? 'border-2 border-[#2F613D] bg-[#F9FAF8] shadow-xs'
                      : 'border border-stone-200 bg-white hover:border-stone-300 shadow-2xs'
                  }`}
                >
                  {workType === 'agency' && (
                    <span className="h-5 w-5 rounded-full bg-[#2F613D] text-white flex items-center justify-center text-[10px] font-bold absolute top-3.5 right-3.5 shadow-xs">
                      ✓
                    </span>
                  )}
                  <BuildingIcon className="h-6 w-6 text-stone-700 mb-3" />
                  <h3 className="text-sm font-bold text-stone-900">Property agency</h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    I represent clients and manage property listings.
                  </p>
                </div>

                {/* Option 2: Independent property professional */}
                <div
                  onClick={() => setWorkType('independent')}
                  className={`rounded-2xl p-4 relative cursor-pointer transition-all ${
                    workType === 'independent'
                      ? 'border-2 border-[#2F613D] bg-[#F9FAF8] shadow-xs'
                      : 'border border-stone-200 bg-white hover:border-stone-300 shadow-2xs'
                  }`}
                >
                  {workType === 'independent' && (
                    <span className="h-5 w-5 rounded-full bg-[#2F613D] text-white flex items-center justify-center text-[10px] font-bold absolute top-3.5 right-3.5 shadow-xs">
                      ✓
                    </span>
                  )}
                  <UserProfileIcon className="h-6 w-6 text-stone-700 mb-3" />
                  <h3 className="text-sm font-bold text-stone-900">Independent property professional</h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    I work independently with clients on property projects.
                  </p>
                </div>

                {/* Option 3: Property manager or operator */}
                <div
                  onClick={() => setWorkType('manager')}
                  className={`rounded-2xl p-4 relative cursor-pointer transition-all ${
                    workType === 'manager'
                      ? 'border-2 border-[#2F613D] bg-[#F9FAF8] shadow-xs'
                      : 'border border-stone-200 bg-white hover:border-stone-300 shadow-2xs'
                  }`}
                >
                  {workType === 'manager' && (
                    <span className="h-5 w-5 rounded-full bg-[#2F613D] text-white flex items-center justify-center text-[10px] font-bold absolute top-3.5 right-3.5 shadow-xs">
                      ✓
                    </span>
                  )}
                  <BriefcaseIcon className="h-6 w-6 text-stone-700 mb-3" />
                  <h3 className="text-sm font-bold text-stone-900">Property manager or operator</h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    I manage and operate properties on behalf of owners.
                  </p>
                </div>

              </div>
            </div>

            {/* 3-Column Meta Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              
              {/* Portfolio Size */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-800 block">
                  Portfolio size
                </label>
                <select
                  value={portfolioSize}
                  onChange={(e) => setPortfolioSize(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#194534]/15 focus:border-[#194534] shadow-2xs"
                >
                  <option value="1–10 active properties">1–10 active properties</option>
                  <option value="11–50 active properties">11–50 active properties</option>
                  <option value="51–200 active properties">51–200 active properties</option>
                  <option value="200+ active properties">200+ active properties</option>
                </select>
              </div>

              {/* Primary Market */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-800 block">
                  Primary market
                </label>
                <input
                  type="text"
                  value={primaryMarket}
                  onChange={(e) => setPrimaryMarket(e.target.value)}
                  placeholder="e.g. Lagos, Nigeria"
                  className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#194534]/15 focus:border-[#194534] shadow-2xs"
                />
              </div>

              {/* Team Size */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-800 block">
                  Team size
                </label>
                <select
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#194534]/15 focus:border-[#194534] shadow-2xs"
                >
                  <option value="Just me">Just me</option>
                  <option value="2–5 people">2–5 people</option>
                  <option value="6–20 people">6–20 people</option>
                  <option value="20+ people">20+ people</option>
                </select>
              </div>

            </div>

            {/* Contact Section */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-stone-800 block">
                Contact
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] text-stone-500 block">Your name</span>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Full name"
                    className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#194534]/15 focus:border-[#194534] shadow-2xs"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] text-stone-500 block">Work email</span>
                  <input
                    type="email"
                    value={workEmail}
                    onChange={(e) => setWorkEmail(e.target.value)}
                    placeholder="email@company.com"
                    className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#194534]/15 focus:border-[#194534] shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Buttons */}
            <div className="flex items-center justify-center gap-3 pt-6">
              <button
                onClick={() => setStep(2)}
                className="bg-[#0B1713] text-white rounded-xl font-semibold text-xs px-12 py-3.5 hover:bg-black active:scale-[0.99] transition-all shadow-sm"
              >
                Continue
              </button>
              <button
                onClick={() => navigate('/properties')}
                className="bg-white border border-stone-200 text-stone-700 rounded-xl font-semibold text-xs px-7 py-3.5 hover:bg-stone-50 transition-all shadow-2xs"
              >
                I'll finish this later
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: HOW SHOULD PROPERTIES ENTER OPENHOUSE? */}
        {/* ========================================================================= */}
        {step === 2 && (
          <div className="max-w-[1040px] mx-auto space-y-6 animate-fadeIn">
            
            {/* Title & Subtitle */}
            <div className="text-center space-y-1.5 mb-8">
              <h1 className="text-[32px] sm:text-[36px] font-bold text-stone-900 tracking-tight leading-tight">
                How should properties enter OpenHouse?
              </h1>
              <p className="text-sm text-stone-500 max-w-lg mx-auto leading-relaxed">
                Connect a listing source now, or begin by adding properties manually.
              </p>
            </div>

            {/* 4 Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: OpenHouse Demo Listings */}
              <div
                onClick={() => setListingSource('demo')}
                className={`rounded-2xl p-5 relative flex flex-col justify-between cursor-pointer transition-all min-h-[350px] ${
                  listingSource === 'demo'
                    ? 'border-2 border-[#2F613D] bg-[#F9FAF8] shadow-xs'
                    : 'border border-stone-200 bg-white hover:border-stone-300 shadow-2xs'
                }`}
              >
                {listingSource === 'demo' && (
                  <span className="h-5 w-5 rounded-full bg-[#2F613D] text-white flex items-center justify-center text-[10px] font-bold absolute top-3.5 right-3.5 shadow-xs">
                    ✓
                  </span>
                )}
                <div>
                  <div className="h-11 w-11 rounded-full bg-[#EBF2EC] text-[#2F613D] flex items-center justify-center mb-3">
                    <HomeHeartIcon className="h-5 w-5" />
                  </div>
                  <h3 className="text-[15px] font-bold text-stone-900">OpenHouse Demo Listings</h3>
                  <span className="inline-block bg-[#E8F0EA] text-[#2F613D] text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md uppercase my-2">
                    RECOMMENDED FOR DEMO
                  </span>
                  <p className="text-xs text-stone-600 leading-relaxed mt-1">
                    Detect new properties and listing updates automatically from the OpenHouse demo portal.
                  </p>
                  
                  {/* Checklist */}
                  <div className="space-y-1.5 text-xs text-stone-700 font-medium pt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[#2F613D] font-bold">✓</span>
                      <span>New listing events</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#2F613D] font-bold">✓</span>
                      <span>Updated media</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#2F613D] font-bold">✓</span>
                      <span>Property status changes</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setListingSource('demo')
                    setStep(3)
                  }}
                  className="w-full bg-[#0B1713] text-white rounded-xl py-2.5 font-semibold text-xs text-center mt-4 hover:bg-black shadow-2xs transition-colors"
                >
                  Connect demo source
                </button>
              </div>

              {/* Card 2: Custom Webhook */}
              <div
                onClick={() => setListingSource('webhook')}
                className={`rounded-2xl p-5 relative flex flex-col justify-between cursor-pointer transition-all min-h-[350px] ${
                  listingSource === 'webhook'
                    ? 'border-2 border-[#2F613D] bg-[#F9FAF8] shadow-xs'
                    : 'border border-stone-200 bg-white hover:border-stone-300 shadow-2xs'
                }`}
              >
                {listingSource === 'webhook' && (
                  <span className="h-5 w-5 rounded-full bg-[#2F613D] text-white flex items-center justify-center text-[10px] font-bold absolute top-3.5 right-3.5 shadow-xs">
                    ✓
                  </span>
                )}
                <div>
                  <div className="h-11 w-11 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center mb-3">
                    <WebhookIcon className="h-5 w-5" />
                  </div>
                  <h3 className="text-[15px] font-bold text-stone-900">Custom webhook</h3>
                  <p className="text-xs text-stone-500 leading-relaxed mt-2">
                    Send <code className="text-[11px] bg-stone-100 px-1 py-0.5 rounded text-stone-700">listing.created</code> and <code className="text-[11px] bg-stone-100 px-1 py-0.5 rounded text-stone-700">listing.updated</code> events from an existing system.
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setListingSource('webhook')
                    setStep(3)
                  }}
                  className="w-full bg-white border border-stone-200 text-stone-800 rounded-xl py-2.5 font-semibold text-xs text-center mt-auto hover:bg-stone-50 shadow-2xs transition-colors"
                >
                  Configure webhook
                </button>
              </div>

              {/* Card 3: CSV Import */}
              <div
                onClick={() => setListingSource('csv')}
                className={`rounded-2xl p-5 relative flex flex-col justify-between cursor-pointer transition-all min-h-[350px] ${
                  listingSource === 'csv'
                    ? 'border-2 border-[#2F613D] bg-[#F9FAF8] shadow-xs'
                    : 'border border-stone-200 bg-white hover:border-stone-300 shadow-2xs'
                }`}
              >
                {listingSource === 'csv' && (
                  <span className="h-5 w-5 rounded-full bg-[#2F613D] text-white flex items-center justify-center text-[10px] font-bold absolute top-3.5 right-3.5 shadow-xs">
                    ✓
                  </span>
                )}
                <div>
                  <div className="h-11 w-11 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center mb-3">
                    <CsvDocumentIcon className="h-5 w-5" />
                  </div>
                  <h3 className="text-[15px] font-bold text-stone-900">CSV import</h3>
                  <p className="text-xs text-stone-500 leading-relaxed mt-2">
                    Import multiple property records from a structured CSV file.
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setListingSource('csv')
                    setStep(3)
                  }}
                  className="w-full bg-white border border-stone-200 text-stone-800 rounded-xl py-2.5 font-semibold text-xs text-center mt-auto hover:bg-stone-50 shadow-2xs transition-colors"
                >
                  Import file
                </button>
              </div>

              {/* Card 4: Add Manually */}
              <div
                onClick={() => setListingSource('manual')}
                className={`rounded-2xl p-5 relative flex flex-col justify-between cursor-pointer transition-all min-h-[350px] ${
                  listingSource === 'manual'
                    ? 'border-2 border-[#2F613D] bg-[#F9FAF8] shadow-xs'
                    : 'border border-stone-200 bg-white hover:border-stone-300 shadow-2xs'
                }`}
              >
                {listingSource === 'manual' && (
                  <span className="h-5 w-5 rounded-full bg-[#2F613D] text-white flex items-center justify-center text-[10px] font-bold absolute top-3.5 right-3.5 shadow-xs">
                    ✓
                  </span>
                )}
                <div>
                  <div className="h-11 w-11 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center mb-3 text-lg font-light">
                    +
                  </div>
                  <h3 className="text-[15px] font-bold text-stone-900">Add manually</h3>
                  <p className="text-xs text-stone-500 leading-relaxed mt-2">
                    Create each property through the OpenHouse add-property workflow.
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setListingSource('manual')
                    setStep(3)
                  }}
                  className="w-full bg-white border border-stone-200 text-stone-800 rounded-xl py-2.5 font-semibold text-xs text-center mt-auto hover:bg-stone-50 shadow-2xs transition-colors"
                >
                  Continue manually
                </button>
              </div>

            </div>

            {/* Bottom Info Banner */}
            <div className="bg-[#F7F6F2] border border-stone-200/80 rounded-2xl p-3.5 flex items-center gap-3 text-xs text-stone-600 font-medium">
              <span className="h-6 w-6 rounded-full bg-stone-200/70 text-stone-700 flex items-center justify-center font-serif italic text-xs shrink-0">
                i
              </span>
              <span>
                OpenHouse imports only the property information and media needed to prepare the experience.
              </span>
            </div>

            {/* Navigation Footer */}
            <div className="flex items-center justify-between pt-6 border-t border-stone-100">
              <button
                onClick={() => setStep(1)}
                className="bg-white border border-stone-200 rounded-xl px-6 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-all shadow-2xs"
              >
                ← Back
              </button>

              <button
                onClick={() => setStep(3)}
                className="bg-[#0B1713] text-white rounded-xl px-7 py-2.5 text-xs font-semibold hover:bg-black transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>Continue</span>
                <span>→</span>
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: CHOOSE WHEN OPENHOUSE SHOULD INVOLVE YOU */}
        {/* ========================================================================= */}
        {step === 3 && (
          <div className="max-w-[1060px] mx-auto space-y-6 animate-fadeIn">
            
            {/* Title & Subtitle */}
            <div className="text-center space-y-1.5 mb-8">
              <h1 className="text-[32px] sm:text-[36px] font-bold text-stone-900 tracking-tight leading-tight">
                Choose when OpenHouse should involve you
              </h1>
              <p className="text-sm text-stone-500 max-w-lg mx-auto leading-relaxed">
                Set the default decisions that require your approval.
              </p>
            </div>

            {/* 2-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Form Settings Cards */}
              <div className="lg:col-span-8 space-y-4">
                
                {/* Section 1: Publication Card */}
                <div className="border border-stone-200/90 bg-[#FDFDFD] rounded-2xl p-5 shadow-2xs space-y-3">
                  <span className="text-[10px] font-bold text-stone-400 tracking-wider uppercase block">
                    PUBLICATION
                  </span>
                  
                  <div className="flex items-start gap-3.5">
                    {/* Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => setRequireApproval(!requireApproval)}
                      className={`w-11 h-6 rounded-full p-1 transition-colors flex items-center shrink-0 mt-0.5 ${
                        requireApproval ? 'bg-[#194534]' : 'bg-stone-300'
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded-full bg-white transition-transform ${
                          requireApproval ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">
                        Require approval before publishing
                      </h4>
                      <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                        OpenHouse will prepare and verify each experience, then ask you to review it.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 2: Visibility Card */}
                <div className="border border-stone-200/90 bg-[#FDFDFD] rounded-2xl p-5 shadow-2xs space-y-3">
                  <span className="text-[10px] font-bold text-stone-400 tracking-wider uppercase block">
                    VISIBILITY
                  </span>
                  
                  <div>
                    <span className="text-xs text-stone-700 font-medium block mb-2">
                      Default visibility
                    </span>

                    <div className="space-y-2.5">
                      {/* Option A: Unlisted */}
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="visibility"
                          checked={visibility === 'unlisted'}
                          onChange={() => setVisibility('unlisted')}
                          className="mt-0.5 text-[#194534] focus:ring-[#194534]"
                        />
                        <div>
                          <span className="text-xs font-bold text-stone-900 block">Unlisted link</span>
                          <span className="text-xs text-stone-500 block">Anyone with the link can view, but it won't appear in search.</span>
                        </div>
                      </label>

                      {/* Option B: Public */}
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="visibility"
                          checked={visibility === 'public'}
                          onChange={() => setVisibility('public')}
                          className="mt-0.5 text-[#194534] focus:ring-[#194534]"
                        />
                        <div>
                          <span className="text-xs font-bold text-stone-900 block">Public</span>
                          <span className="text-xs text-stone-500 block">Anyone can find and view the experience.</span>
                        </div>
                      </label>

                      {/* Option C: Password */}
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="visibility"
                          checked={visibility === 'password'}
                          onChange={() => setVisibility('password')}
                          className="mt-0.5 text-[#194534] focus:ring-[#194534]"
                        />
                        <div>
                          <span className="text-xs font-bold text-stone-900 block">Password protected</span>
                          <span className="text-xs text-stone-500 block">Viewers must enter a password to access the experience.</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Section 3: Capture Requests Card */}
                <div className="border border-stone-200/90 bg-[#FDFDFD] rounded-2xl p-5 shadow-2xs space-y-3">
                  <span className="text-[10px] font-bold text-stone-400 tracking-wider uppercase block">
                    CAPTURE REQUESTS
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={sendWhatsapp}
                          onChange={(e) => setSendWhatsapp(e.target.checked)}
                          className="rounded text-[#194534] focus:ring-[#194534]"
                        />
                        <span className="text-xs font-semibold text-stone-800">Send capture requests by WhatsApp</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={sendEmail}
                          onChange={(e) => setSendEmail(e.target.checked)}
                          className="rounded text-[#194534] focus:ring-[#194534]"
                        />
                        <span className="text-xs font-semibold text-stone-800">Send capture requests by email</span>
                      </label>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] text-stone-500 font-medium block">Primary recipient</span>
                      <select
                        value={primaryRecipient}
                        onChange={(e) => setPrimaryRecipient(e.target.value)}
                        className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#194534]/15 focus:border-[#194534] shadow-2xs"
                      >
                        <option value={userName}>{userName}</option>
                        <option value="Team Admin">Team Admin</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 4: Notifications Card */}
                <div className="border border-stone-200/90 bg-[#FDFDFD] rounded-2xl p-5 shadow-2xs space-y-3.5">
                  <span className="text-[10px] font-bold text-stone-400 tracking-wider uppercase block">
                    NOTIFICATIONS
                  </span>
                  
                  <p className="text-xs text-stone-500">
                    We'll notify you only about the decisions and exceptions that matter.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    
                    {/* Checkbox 1 */}
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifyCaptureRequired}
                        onChange={(e) => setNotifyCaptureRequired(e.target.checked)}
                        className="mt-0.5 rounded text-[#194534] focus:ring-[#194534]"
                      />
                      <div>
                        <span className="text-xs font-bold text-stone-900 block">Capture required</span>
                        <span className="text-[11px] text-stone-500 block">We need new photos or a video for a property.</span>
                      </div>
                    </label>

                    {/* Checkbox 2 */}
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifyProcessingFailed}
                        onChange={(e) => setNotifyProcessingFailed(e.target.checked)}
                        className="mt-0.5 rounded text-[#194534] focus:ring-[#194534]"
                      />
                      <div>
                        <span className="text-xs font-bold text-stone-900 block">Processing failed</span>
                        <span className="text-[11px] text-stone-500 block">Something stopped OpenHouse from completing a task.</span>
                      </div>
                    </label>

                    {/* Checkbox 3 */}
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifyReviewReady}
                        onChange={(e) => setNotifyReviewReady(e.target.checked)}
                        className="mt-0.5 rounded text-[#194534] focus:ring-[#194534]"
                      />
                      <div>
                        <span className="text-xs font-bold text-stone-900 block">Experience ready for review</span>
                        <span className="text-[11px] text-stone-500 block">An experience is prepared and ready for your review.</span>
                      </div>
                    </label>

                    {/* Checkbox 4 */}
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifyEveryUpdate}
                        onChange={(e) => setNotifyEveryUpdate(e.target.checked)}
                        className="mt-0.5 rounded text-[#194534] focus:ring-[#194534]"
                      />
                      <div>
                        <span className="text-xs font-bold text-stone-900 block">Every processing update</span>
                        <span className="text-[11px] text-stone-500 block">Get notified about every step in the background.</span>
                      </div>
                    </label>

                    {/* Checkbox 5 */}
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifyPublished}
                        onChange={(e) => setNotifyPublished(e.target.checked)}
                        className="mt-0.5 rounded text-[#194534] focus:ring-[#194534]"
                      />
                      <div>
                        <span className="text-xs font-bold text-stone-900 block">Publication completed</span>
                        <span className="text-[11px] text-stone-500 block">An experience has been published.</span>
                      </div>
                    </label>

                  </div>

                  {/* Info Pill */}
                  <div className="bg-[#F7F6F2] border border-stone-200/60 rounded-xl p-3 flex items-center gap-2.5 text-xs text-stone-600 font-medium mt-3">
                    <span className="h-5 w-5 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-serif italic text-xs shrink-0">
                      i
                    </span>
                    <span>OpenHouse will avoid notifying you about routine background work.</span>
                  </div>

                </div>

              </div>

              {/* Right Column: Setup Summary Card */}
              <div className="lg:col-span-4">
                <div className="border border-stone-200/90 bg-[#FDFDFD] rounded-2xl p-5 shadow-xs space-y-4 sticky top-6">
                  <h3 className="text-sm font-bold text-stone-900">Your setup summary</h3>
                  
                  <div className="space-y-4 pt-1">
                    
                    {/* Item 1: Workspace */}
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-full bg-[#EBF2EC] text-[#2F613D] flex items-center justify-center shrink-0">
                        <BuildingIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold text-stone-400 block">Workspace</span>
                        <span className="text-xs font-bold text-stone-900 block">{workspaceName}</span>
                      </div>
                    </div>

                    <div className="h-px bg-stone-100" />

                    {/* Item 2: Listing Source */}
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-full bg-[#EBF2EC] text-[#2F613D] flex items-center justify-center shrink-0">
                        <HomeHeartIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold text-stone-400 block">Listing source</span>
                        <span className="text-xs font-bold text-stone-900 block">
                          {listingSource === 'demo' ? 'OpenHouse Demo Listings' : listingSource === 'webhook' ? 'Custom webhook' : listingSource === 'csv' ? 'CSV Import' : 'Manual Entry'}
                        </span>
                      </div>
                    </div>

                    <div className="h-px bg-stone-100" />

                    {/* Item 3: Publication */}
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-full bg-[#EBF2EC] text-[#2F613D] flex items-center justify-center shrink-0">
                        <ShieldCheckBadgeIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold text-stone-400 block">Publication</span>
                        <span className="text-xs font-bold text-stone-900 block">
                          {requireApproval ? 'Approval required' : 'Automatic publishing'}
                        </span>
                        <span className="text-[11px] text-stone-500 block leading-tight mt-0.5">
                          {requireApproval ? "You'll review before anything is published." : "Experiences go live immediately when verified."}
                        </span>
                      </div>
                    </div>

                    <div className="h-px bg-stone-100" />

                    {/* Item 4: Visibility */}
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-full bg-[#EBF2EC] text-[#2F613D] flex items-center justify-center shrink-0">
                        <LinkChainIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold text-stone-400 block">Visibility</span>
                        <span className="text-xs font-bold text-stone-900 block capitalize">
                          {visibility === 'unlisted' ? 'Unlisted link' : visibility === 'public' ? 'Public' : 'Password protected'}
                        </span>
                        <span className="text-[11px] text-stone-500 block leading-tight mt-0.5">
                          {visibility === 'unlisted' ? 'Anyone with the link can view.' : visibility === 'public' ? 'Anyone can find and view.' : 'Password required for access.'}
                        </span>
                      </div>
                    </div>

                    <div className="h-px bg-stone-100" />

                    {/* Item 5: Notifications */}
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-full bg-[#EBF2EC] text-[#2F613D] flex items-center justify-center shrink-0">
                        <BellNotificationIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold text-stone-400 block">Notifications</span>
                        <span className="text-xs font-bold text-stone-900 block">Decisions and exceptions only</span>
                        <span className="text-[11px] text-stone-500 block leading-tight mt-0.5">
                          You'll be notified about important events that need your attention.
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </div>

            {/* Navigation Footer */}
            <div className="flex items-center justify-between pt-6 border-t border-stone-100">
              <button
                onClick={() => setStep(2)}
                className="bg-white border border-stone-200 rounded-xl px-6 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-all shadow-2xs"
              >
                ← Back
              </button>

              <button
                onClick={handleFinish}
                className="bg-[#0B1713] text-white rounded-xl px-8 py-2.5 text-xs font-semibold hover:bg-black active:scale-[0.98] transition-all shadow-sm"
              >
                Finish setup
              </button>
            </div>

          </div>
        )}

      </main>

    </div>
  )
}
