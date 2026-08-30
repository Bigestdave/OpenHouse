import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ShareIcon,
  GridIcon,
  MapPinIcon,
  SoundIcon,
  SoundOffIcon,
  ChatIcon,
  SendIcon,
  CalendarIcon,
  CopyIcon,
  QrCodeIcon,
} from '../components/icons2'
import { Ellipsis, FullscreenIcon, CloseIcon } from '../components/icons'

interface Room {
  id: string
  name: string
  img: string
  description: string
  hotspotTarget?: string
  hotspotLabel?: string
}

const PROPERTY_ROOMS: Room[] = [
  {
    id: 'entrance',
    name: 'Entrance',
    img: '/src/assets/prop-hero-waterfront.jpg',
    description: 'Welcoming marble entryway connected to the living room and guest washroom.',
    hotspotTarget: 'living',
    hotspotLabel: 'Living room',
  },
  {
    id: 'living',
    name: 'Living room',
    img: '/src/assets/prop-admiralty.jpg',
    description: 'Connected to the entrance hall, kitchen and balcony.',
    hotspotTarget: 'balcony',
    hotspotLabel: 'Balcony',
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    img: '/src/assets/prop-kitchen.png',
    description: 'Custom fitted cabinetry with premium integrated appliances, connected to the dining area.',
    hotspotTarget: 'living',
    hotspotLabel: 'Living room',
  },
  {
    id: 'main-bed',
    name: 'Main bedroom',
    img: '/src/assets/prop-bourdillon.jpg',
    description: 'Expansive master suite with floor-to-ceiling windows and en-suite bathroom.',
    hotspotTarget: 'balcony',
    hotspotLabel: 'Balcony',
  },
  {
    id: 'bed-2',
    name: 'Bedroom 2',
    img: '/src/assets/prop-lekkigardens.jpg',
    description: 'Spacious second bedroom with direct south-facing light and fitted wardrobes.',
    hotspotTarget: 'living',
    hotspotLabel: 'Living room',
  },
  {
    id: 'bed-3',
    name: 'Bedroom 3',
    img: '/src/assets/prop-orchid.jpg',
    description: 'Quiet third bedroom suitable for guests, children, or a dedicated home workspace.',
    hotspotTarget: 'living',
    hotspotLabel: 'Living room',
  },
  {
    id: 'balcony',
    name: 'Balcony',
    img: '/src/assets/prop-hero-waterfront.jpg',
    description: 'Panoramic private outdoor terrace overlooking the waterfront skyline.',
    hotspotTarget: 'living',
    hotspotLabel: 'Living room',
  },
]

interface Message {
  sender: 'user' | 'ai'
  text: string
  badge?: string
  subtext?: string
}

export function PublicPropertyViewerScreen() {
  // Viewer state
  const [isEntered, setIsEntered] = useState(false)
  const [activeRoomId, setActiveRoomId] = useState('living')
  const [roomsDrawerOpen, setRoomsDrawerOpen] = useState(true)
  const [activeRightDrawer, setActiveRightDrawer] = useState<'none' | 'ask' | 'book' | 'map'>('none')
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [, setIsFullscreen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [copiedShare, setCopiedShare] = useState(false)
  const [isTouring, setIsTouring] = useState(false)

  // Booking state
  const [selectedDay, setSelectedDay] = useState<number>(20)
  const [selectedTime, setSelectedTime] = useState<string>('11:30 AM')
  const [bookingName, setBookingName] = useState('David Olabowale')
  const [bookingEmail, setBookingEmail] = useState('david@example.com')
  const [bookingPhone, setBookingPhone] = useState('+234 801 234 5678')
  const [bookingNote, setBookingNote] = useState('')
  const [bookingSubmitted, setBookingSubmitted] = useState(false)

  // AI Chat state
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'user',
      text: 'Which room gets the most natural light?',
    },
    {
      sender: 'ai',
      text: 'The living room appears to receive the strongest natural light in the supplied daytime capture, primarily through the balcony glazing.',
      badge: 'Observed from daytime property capture',
      subtext: 'Measurements are shown only when supported by a floor plan or reference scale.',
    },
  ])

  const activeRoom = PROPERTY_ROOMS.find((r) => r.id === activeRoomId) || PROPERTY_ROOMS[1]

  // Guided tour interval
  useEffect(() => {
    if (!isTouring) return
    const interval = setInterval(() => {
      setActiveRoomId((curr) => {
        const index = PROPERTY_ROOMS.findIndex((r) => r.id === curr)
        const nextIndex = (index + 1) % PROPERTY_ROOMS.length
        return PROPERTY_ROOMS[nextIndex].id
      })
    }, 4500)
    return () => clearInterval(interval)
  }, [isTouring])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      document.exitFullscreen().catch(() => {})
      setIsFullscreen(false)
    }
  }

  const handleSendMessage = (textToSend?: string) => {
    const q = textToSend || chatInput.trim()
    if (!q) return

    const newMsgs: Message[] = [...messages, { sender: 'user', text: q }]
    setMessages(newMsgs)
    setChatInput('')

    // Generate smart response based on question
    setTimeout(() => {
      let aiReply = 'OpenHouse has cross-referenced the property captures and verified listing details.'
      let badge = 'Observed from property capture'

      const lower = q.toLowerCase()
      if (lower.includes('light') || lower.includes('sun')) {
        aiReply = 'The living room and balcony receive optimal southern natural exposure throughout the day.'
        badge = 'Observed from daytime property capture'
      } else if (lower.includes('park') || lower.includes('car') || lower.includes('garage')) {
        aiReply = 'Yes, this property includes 2 dedicated covered parking spaces and guest parking on the ground level.'
        badge = 'Verified in listing specifications'
      } else if (lower.includes('balcony') || lower.includes('terrace') || lower.includes('connect')) {
        aiReply = 'The living room connects directly to the private balcony through sliding acoustic glass doors.'
        badge = 'Observed from spatial reconstruction'
      } else if (lower.includes('dimension') || lower.includes('size') || lower.includes('sqft')) {
        aiReply = 'The living room measures approximately 6.8m × 4.5m with a 3.1m high ceiling.'
        badge = 'Calculated from architectural survey'
      } else if (lower.includes('bedroom') || lower.includes('main')) {
        aiReply = 'The main bedroom is located down the private hallway with uninterrupted skyline views and en-suite bath.'
        badge = 'Observed from property capture'
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: aiReply,
          badge,
          subtext: 'Measurements are shown only when supported by a floor plan or reference scale.',
        },
      ])
    }, 400)
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-sidebar select-none font-sans text-white">
      {/* Background Room Viewport (Full Screen Image / Spatial Canvas) */}
      <div className="absolute inset-0 z-0">
        <img
          src={activeRoom.img}
          alt={activeRoom.name}
          className="h-full w-full object-cover transition-all duration-700 ease-out transform scale-105"
        />
        {/* Subtle Vignette & Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60 pointer-events-none" />
      </div>

      {/* TOP HEADER BAR */}
      <header className="relative z-20 flex items-center justify-between px-6 py-5">
        {/* Left: OpenHouse Logo & Property Info */}
        <div className="flex items-center gap-4">
          <Link
            to="/productions"
            className="flex items-center gap-2.5 rounded-lg bg-black/40 backdrop-blur-md px-3 py-1.5 border border-white/10 hover:bg-black/60 transition-colors"
          >
            <div className="h-6 w-6 rounded-md bg-white flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9.5L12 2.5L21 9.5V20.5C21 21.0523 20.5523 21.5 20 21.5H4C3.44772 21.5 3 21.0523 3 20.5V9.5Z" fill="#0B1713" />
                <path d="M9 21.5V12.5H15V21.5" fill="white" />
              </svg>
            </div>
            <span className="text-[14px] font-bold tracking-tight text-white">OpenHouse</span>
          </Link>

          {isEntered && (
            <div className="hidden sm:block">
              <h1 className="text-[15px] font-bold text-white leading-tight">8 Admiralty Way</h1>
              <p className="text-[12px] text-white/70">{activeRoom.name}</p>
            </div>
          )}
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShareModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-black/40 backdrop-blur-md px-3 py-2 text-[12.5px] font-semibold text-white border border-white/10 hover:bg-black/60 transition-colors"
          >
            <ShareIcon size={14} />
            <span>Share</span>
          </button>

          {isEntered && (
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12.5px] font-semibold border border-white/10 backdrop-blur-md transition-colors ${
                soundEnabled ? 'bg-primary text-white' : 'bg-black/40 text-white hover:bg-black/60'
              }`}
            >
              {soundEnabled ? <SoundIcon size={14} /> : <SoundOffIcon size={14} />}
              <span>Sound</span>
            </button>
          )}

          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 rounded-lg bg-black/40 backdrop-blur-md px-3 py-2 text-[12.5px] font-semibold text-white border border-white/10 hover:bg-black/60 transition-colors hidden sm:flex"
          >
            <FullscreenIcon size={14} />
            <span>Full screen</span>
          </button>

          <button
            onClick={() => setShareModalOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/40 backdrop-blur-md text-white border border-white/10 hover:bg-black/60 transition-colors"
          >
            <Ellipsis size={16} />
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 1. ENTRY SCREEN OVERLAY (When isEntered === false) */}
      {/* ========================================================================= */}
      {!isEntered && (
        <div className="relative z-10 flex h-[calc(100vh-80px)] flex-col justify-end p-6 sm:p-10 lg:p-14">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            {/* Left Property Entry Hero Card */}
            <div className="w-full max-w-lg rounded-3xl bg-black/75 backdrop-blur-2xl border border-white/15 p-7 sm:p-8 shadow-2xl space-y-4">
              <div className="flex items-center gap-2 text-white/80 text-[13px] font-medium">
                <MapPinIcon size={14} className="text-white/80" />
                <span>Lekki, Lagos</span>
              </div>

              <div>
                <h2 className="text-[28px] sm:text-[34px] font-extrabold text-white tracking-tight leading-none">
                  8 Admiralty Way
                </h2>
                <p className="text-[14px] text-white/80 font-medium mt-2">
                  3 bedrooms · 3 bathrooms · Private balcony
                </p>
              </div>

              <p className="text-[13.5px] text-white/70 leading-relaxed pt-1">
                Explore the property at your own pace or take the one-minute guided tour.
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setIsEntered(true)}
                  className="flex-1 rounded-xl bg-white py-3 px-5 text-[14px] font-bold text-black shadow-lg hover:bg-white/90 active:scale-[0.98] transition-all text-center"
                >
                  Enter home
                </button>
                <button
                  onClick={() => {
                    setIsEntered(true)
                    setIsTouring(true)
                  }}
                  className="flex-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 py-3 px-5 text-[14px] font-bold text-white backdrop-blur-md active:scale-[0.98] transition-all text-center"
                >
                  Take guided tour
                </button>
              </div>

              <div className="pt-2 flex items-center justify-between text-[12px] text-white/60 border-t border-white/10">
                <span className="flex items-center gap-1.5">
                  <span>📱</span> No app required
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span>✓</span> Property information checked by OpenHouse
                </span>
              </div>
            </div>

            {/* Bottom-Right Space Count Pill */}
            <button
              onClick={() => setIsEntered(true)}
              className="self-start lg:self-end flex items-center gap-2 rounded-xl bg-black/75 backdrop-blur-xl border border-white/15 px-4 py-2.5 text-[13.5px] font-semibold text-white hover:bg-black/90 transition-colors shadow-lg"
            >
              <GridIcon size={16} />
              <span>7 spaces available</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. EXPLORE WALKTHROUGH MODE (When isEntered === true) */}
      {/* ========================================================================= */}
      {isEntered && (
        <>
          {/* Spatial Floor Interactive Hotspot */}
          {activeRoom.hotspotTarget && (
            <div className="absolute top-[62%] left-[68%] -translate-x-1/2 -translate-y-1/2 z-10 group cursor-pointer">
              <button
                onClick={() => {
                  if (activeRoom.hotspotTarget) setActiveRoomId(activeRoom.hotspotTarget)
                }}
                className="relative flex items-center justify-center h-12 w-12 rounded-full bg-white/90 text-black shadow-2xl border-2 border-white/50 backdrop-blur-md hover:scale-110 hover:bg-white transition-all group-hover:ring-4 group-hover:ring-emerald-400/40"
              >
                <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-30 pointer-events-none" />
                <span className="text-[18px] font-extrabold text-black">↑</span>
              </button>
              <div className="absolute top-14 left-1/2 -translate-x-1/2 rounded-md bg-black/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white whitespace-nowrap border border-white/15 opacity-0 group-hover:opacity-100 transition-opacity">
                Walk to {activeRoom.hotspotLabel || 'next room'}
              </div>
            </div>
          )}

          {/* Left Drawer: Explore the Property (Room Selector) */}
          {roomsDrawerOpen && (
            <div className="absolute top-20 left-6 z-20 w-64 rounded-2xl bg-black/70 backdrop-blur-2xl border border-white/15 p-4 shadow-2xl space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-[13px] font-bold uppercase tracking-wider text-white/70">
                  Explore the property
                </h3>
                <button
                  onClick={() => setRoomsDrawerOpen(false)}
                  className="text-white/50 hover:text-white p-1"
                >
                  <CloseIcon size={14} />
                </button>
              </div>

              <div className="space-y-1.5">
                {PROPERTY_ROOMS.map((room) => {
                  const isActive = room.id === activeRoomId
                  return (
                    <button
                      key={room.id}
                      onClick={() => setActiveRoomId(room.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl transition-all ${
                        isActive
                          ? 'bg-emerald-950/60 border border-emerald-500/50 shadow-inner'
                          : 'hover:bg-white/10 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={room.img}
                          alt={room.name}
                          className="h-9 w-12 rounded-lg object-cover border border-white/10 shrink-0"
                        />
                        <span
                          className={`text-[13px] truncate text-left ${
                            isActive ? 'font-bold text-white' : 'font-medium text-white/80'
                          }`}
                        >
                          {room.name}
                        </span>
                      </div>
                      {isActive && (
                        <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_#34d399]" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Bottom-Left Room Context Card */}
          <div className="absolute bottom-24 left-6 z-10 w-full max-w-sm rounded-2xl bg-black/75 backdrop-blur-2xl border border-white/15 p-4 shadow-2xl space-y-1.5 hidden sm:block">
            <h3 className="text-[15px] font-bold text-white leading-tight">
              {activeRoom.name}
            </h3>
            <p className="text-[12.5px] text-white/80 leading-snug">
              {activeRoom.description}
            </p>
            <div className="flex items-center gap-1.5 pt-1 text-[11.5px] text-emerald-400 font-medium">
              <span>✓</span>
              <span>Observed from property capture</span>
            </div>
          </div>

          {/* Bottom Center Floating Navigation Toolbar */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 rounded-2xl bg-black/75 backdrop-blur-2xl border border-white/15 p-1.5 shadow-2xl">
            {/* Rooms Toggle Button */}
            <button
              onClick={() => setRoomsDrawerOpen(!roomsDrawerOpen)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-all ${
                roomsDrawerOpen
                  ? 'bg-white/15 text-white border-b-2 border-emerald-400'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <GridIcon size={15} />
              <span>Rooms</span>
            </button>

            {/* Ask AI Assistant Button */}
            <button
              onClick={() => setActiveRightDrawer(activeRightDrawer === 'ask' ? 'none' : 'ask')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-all ${
                activeRightDrawer === 'ask'
                  ? 'bg-white/15 text-white border-b-2 border-emerald-400'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <ChatIcon size={15} />
              <span>Ask</span>
            </button>

            {/* Map Floorplan Button */}
            <button
              onClick={() => setActiveRightDrawer(activeRightDrawer === 'map' ? 'none' : 'map')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-all ${
                activeRightDrawer === 'map'
                  ? 'bg-white/15 text-white border-b-2 border-emerald-400'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <MapPinIcon size={15} />
              <span>Map</span>
            </button>

            {/* Guided Tour Button */}
            <button
              onClick={() => setIsTouring(!isTouring)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-all ${
                isTouring
                  ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 animate-pulse'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{isTouring ? '⏸' : '▶'}</span>
              <span>Guided tour</span>
            </button>

            {/* Book Inspection Action Button */}
            <button
              onClick={() => setActiveRightDrawer(activeRightDrawer === 'book' ? 'none' : 'book')}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[13px] font-bold text-black shadow-lg hover:bg-white/90 active:scale-95 transition-all ml-1"
            >
              <CalendarIcon size={15} className="text-black" />
              <span>Book inspection</span>
            </button>
          </div>

          {/* ========================================================================= */}
          {/* 3. RIGHT DRAWER: ASK OPENHOUSE AI ASSISTANT */}
          {/* ========================================================================= */}
          {activeRightDrawer === 'ask' && (
            <div className="absolute top-20 right-6 bottom-6 z-30 w-full max-w-md rounded-3xl bg-surface border border-border shadow-2xl flex flex-col overflow-hidden text-text-primary">
              {/* Header */}
              <div className="p-5 border-b border-border flex items-start justify-between">
                <div>
                  <h3 className="text-[17px] font-bold text-text-primary">Ask about this home</h3>
                  <p className="text-[12.5px] text-text-secondary mt-0.5">
                    Ask about rooms, features or information supplied with the listing.
                  </p>
                </div>
                <button
                  onClick={() => setActiveRightDrawer('none')}
                  className="p-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
                >
                  <CloseIcon size={16} />
                </button>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    {msg.sender === 'user' ? (
                      <div className="rounded-2xl bg-primary/10 text-primary border border-primary/20 px-4 py-2.5 text-[13.5px] font-medium max-w-[85%]">
                        {msg.text}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-border bg-surface-elevated/40 p-4 space-y-2 max-w-[95%]">
                        <p className="text-[13.5px] text-text-primary leading-relaxed">{msg.text}</p>
                        {msg.badge && (
                          <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-success">
                            <span>✓</span>
                            <span>{msg.badge}</span>
                          </div>
                        )}
                        {msg.subtext && (
                          <p className="text-[11px] text-text-secondary/80 leading-normal pt-1 border-t border-border/50">
                            {msg.subtext}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Suggested Questions */}
                <div className="space-y-2 pt-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                    Suggested questions
                  </p>
                  <div className="space-y-1.5">
                    {[
                      'Show me the main bedroom',
                      'Is parking included?',
                      'Which rooms connect to the balcony?',
                      'Are the bedroom dimensions available?',
                    ].map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          if (q === 'Show me the main bedroom') setActiveRoomId('main-bed')
                          handleSendMessage(q)
                        }}
                        className="w-full text-left rounded-xl border border-border bg-surface px-3.5 py-2 text-[12.5px] font-medium text-text-primary hover:bg-surface-elevated hover:border-text-secondary/40 transition-colors"
                      >
                        {q}
                      </button>
                    ))}

                    <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-3.5 py-2 text-[12.5px]">
                      <span className="font-semibold text-text-primary">Take me to the living room</span>
                      <span className="text-[11px] font-medium text-success flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-success" />
                        You're here
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Input Bar */}
              <div className="p-4 border-t border-border bg-surface">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage()
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask another question..."
                    className="flex-1 rounded-xl border border-border bg-surface-elevated/40 px-3.5 py-2.5 text-[13px] text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary text-text-inverse shadow-subtle hover:bg-primary-hover active:scale-95 transition-all"
                  >
                    <SendIcon size={16} />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. RIGHT DRAWER: BOOK AN INSPECTION */}
          {/* ========================================================================= */}
          {activeRightDrawer === 'book' && (
            <div className="absolute top-20 right-6 bottom-6 z-30 w-full max-w-md rounded-3xl bg-surface border border-border shadow-2xl flex flex-col overflow-hidden text-text-primary">
              {/* Header */}
              <div className="p-5 border-b border-border flex items-start justify-between">
                <div>
                  <h3 className="text-[17px] font-bold text-text-primary">Book an inspection</h3>
                  <div className="flex items-center gap-2.5 mt-2">
                    <img
                      src="/src/assets/prop-admiralty.jpg"
                      alt="8 Admiralty Way"
                      className="h-10 w-14 rounded-lg object-cover border border-border"
                    />
                    <div>
                      <p className="text-[13px] font-bold text-text-primary">8 Admiralty Way</p>
                      <p className="text-[11.5px] text-text-secondary">Lekki, Lagos</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveRightDrawer('none')}
                  className="p-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
                >
                  <CloseIcon size={16} />
                </button>
              </div>

              {/* Booking Form Scroll Area */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* 1. Choose a time */}
                <div className="space-y-3">
                  <h4 className="text-[13px] font-bold uppercase tracking-wider text-text-primary">
                    1. Choose a time
                  </h4>

                  {/* Calendar Matrix */}
                  <div className="grid grid-cols-[1.5fr_1fr] gap-3 rounded-2xl border border-border bg-surface-elevated/20 p-3.5">
                    <div>
                      <div className="flex items-center justify-between text-[12px] font-bold text-text-primary pb-2">
                        <span>August 2026</span>
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center text-[10.5px] font-bold text-text-secondary uppercase">
                        <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center text-[11.5px] pt-1">
                        {[17, 18, 19, 20, 21, 22, 23].map((day) => (
                          <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`h-7 w-7 mx-auto rounded-full flex items-center justify-center font-semibold transition-colors ${
                              selectedDay === day
                                ? 'bg-primary text-text-inverse shadow-sm'
                                : 'hover:bg-surface-elevated text-text-primary'
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time Slots */}
                    <div className="space-y-1.5 border-l border-border pl-3">
                      <p className="text-[10.5px] font-bold uppercase text-text-secondary">Available</p>
                      {['10:00 AM', '11:30 AM', '1:00 PM', '3:30 PM'].map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`w-full rounded-lg py-1.5 text-[12px] font-semibold text-center transition-all ${
                            selectedTime === time
                              ? 'bg-primary/15 text-primary border border-primary/30 font-bold'
                              : 'border border-border bg-surface text-text-primary hover:bg-surface-elevated'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Your contact details */}
                <div className="space-y-3">
                  <h4 className="text-[13px] font-bold uppercase tracking-wider text-text-primary">
                    2. Your contact details
                  </h4>

                  <div className="space-y-2.5 text-[13px]">
                    <div>
                      <label className="block text-[11.5px] font-medium text-text-secondary mb-1">Full name</label>
                      <input
                        type="text"
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                        className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-[13px] text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-[11.5px] font-medium text-text-secondary mb-1">Email</label>
                      <input
                        type="email"
                        value={bookingEmail}
                        onChange={(e) => setBookingEmail(e.target.value)}
                        className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-[13px] text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-[11.5px] font-medium text-text-secondary mb-1">Phone number</label>
                      <input
                        type="tel"
                        value={bookingPhone}
                        onChange={(e) => setBookingPhone(e.target.value)}
                        className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-[13px] text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-[11.5px] font-medium text-text-secondary mb-1">
                        Anything the agent should know? <span className="text-text-secondary/70">(optional)</span>
                      </label>
                      <textarea
                        rows={2}
                        value={bookingNote}
                        onChange={(e) => setBookingNote(e.target.value)}
                        placeholder="e.g. Preferred entry point, parking, accessibility needs..."
                        className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-[12.5px] text-text-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-border bg-surface space-y-2">
                <button
                  onClick={() => {
                    setBookingSubmitted(true)
                    setTimeout(() => {
                      setBookingSubmitted(false)
                      setActiveRightDrawer('none')
                    }, 2000)
                  }}
                  className="w-full rounded-xl bg-primary py-2.5 text-[13.5px] font-bold text-text-inverse shadow-subtle hover:bg-primary-hover active:scale-[0.98] transition-all"
                >
                  {bookingSubmitted ? 'Inspection Requested ✓' : 'Request inspection'}
                </button>
                <p className="text-[11.5px] text-center text-text-secondary">
                  David Olabowale will confirm your appointment.
                </p>
                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-surface py-2 text-[12.5px] font-semibold text-text-primary hover:bg-surface-elevated transition-colors"
                >
                  <span>💬</span>
                  <span>Contact on WhatsApp</span>
                </a>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 5. RIGHT DRAWER: 2D FLOORPLAN & MAP */}
          {/* ========================================================================= */}
          {activeRightDrawer === 'map' && (
            <div className="absolute top-20 right-6 bottom-6 z-30 w-full max-w-md rounded-3xl bg-surface border border-border shadow-2xl flex flex-col overflow-hidden text-text-primary">
              <div className="p-5 border-b border-border flex items-start justify-between">
                <div>
                  <h3 className="text-[17px] font-bold text-text-primary">Property floorplan</h3>
                  <p className="text-[12.5px] text-text-secondary mt-0.5">
                    Interactive layout representation of 8 Admiralty Way.
                  </p>
                </div>
                <button
                  onClick={() => setActiveRightDrawer('none')}
                  className="p-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
                >
                  <CloseIcon size={16} />
                </button>
              </div>

              <div className="flex-1 p-5 flex flex-col items-center justify-center space-y-4">
                <div className="relative w-full aspect-[4/3] rounded-2xl bg-canvas border border-border p-4 flex items-center justify-center">
                  <svg viewBox="0 0 300 220" className="w-full h-full text-text-secondary">
                    {/* Living Room */}
                    <rect x="20" y="20" width="160" height="110" fill="#194534" fillOpacity="0.1" stroke="#194534" strokeWidth="2" rx="4" />
                    <text x="100" y="80" textAnchor="middle" fill="#0B1713" fontSize="12" fontWeight="bold">Living Room</text>
                    
                    {/* Kitchen */}
                    <rect x="190" y="20" width="90" height="90" fill="#F2EEE5" stroke="#D1C7B7" strokeWidth="2" rx="4" />
                    <text x="235" y="70" textAnchor="middle" fill="#5A6660" fontSize="11">Kitchen</text>

                    {/* Balcony */}
                    <rect x="20" y="140" width="160" height="60" fill="#D97945" fillOpacity="0.15" stroke="#D97945" strokeWidth="2" strokeDasharray="4 4" rx="4" />
                    <text x="100" y="175" textAnchor="middle" fill="#D97945" fontSize="11" fontWeight="bold">Private Balcony</text>

                    {/* Bedrooms */}
                    <rect x="190" y="120" width="90" height="80" fill="#F2EEE5" stroke="#D1C7B7" strokeWidth="2" rx="4" />
                    <text x="235" y="165" textAnchor="middle" fill="#5A6660" fontSize="11">Bedrooms</text>

                    {/* Active Point Indicator */}
                    <circle cx="100" cy="85" r="6" fill="#194534" />
                    <circle cx="100" cy="85" r="12" fill="#194534" fillOpacity="0.3" className="animate-ping" />
                  </svg>
                </div>
                <p className="text-[12px] text-text-secondary text-center">
                  Click any room in the floorplan or room drawer to jump to that perspective.
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* 6. SHARE MODAL OVERLAY */}
      {/* ========================================================================= */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl bg-surface border border-border p-6 shadow-2xl space-y-5 text-text-primary">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-[18px] font-bold text-text-primary">Share property experience</h3>
                <p className="text-[13px] text-text-secondary mt-0.5">8 Admiralty Way · Lekki, Lagos</p>
              </div>
              <button
                onClick={() => setShareModalOpen(false)}
                className="p-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
              >
                <CloseIcon size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href)
                  setCopiedShare(true)
                  setTimeout(() => setCopiedShare(false), 2000)
                }}
                className="w-full flex items-center justify-between rounded-xl border border-border bg-surface-elevated/40 p-3.5 hover:bg-surface-elevated transition-colors"
              >
                <div className="flex items-center gap-3 text-[13.5px] font-semibold text-text-primary">
                  <CopyIcon size={16} />
                  <span>{copiedShare ? 'Copied link to clipboard!' : 'Copy experience link'}</span>
                </div>
                <span className="text-[12px] text-text-secondary">openhouse.app/view/8-admiralty</span>
              </button>

              <a
                href="https://wa.me/"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center gap-3 rounded-xl border border-border bg-surface-elevated/40 p-3.5 hover:bg-surface-elevated transition-colors text-[13.5px] font-semibold text-text-primary"
              >
                <span className="text-[16px]">💬</span>
                <span>Share via WhatsApp</span>
              </a>

              <button
                onClick={() => alert('QR Code generated for 8 Admiralty Way')}
                className="w-full flex items-center gap-3 rounded-xl border border-border bg-surface-elevated/40 p-3.5 hover:bg-surface-elevated transition-colors text-[13.5px] font-semibold text-text-primary"
              >
                <QrCodeIcon size={16} />
                <span>Show QR code for brochures</span>
              </button>
            </div>

            <button
              onClick={() => setShareModalOpen(false)}
              className="w-full rounded-xl bg-primary py-2.5 text-[13px] font-bold text-text-inverse hover:bg-primary-hover transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
