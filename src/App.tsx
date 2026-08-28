import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ShowsHomeScreen } from './screens/ShowsHomeScreen'
import { ShowOverviewScreen } from './screens/ShowOverviewScreen'
import { CreateShowBasicsScreen } from './screens/CreateShowBasicsScreen'
import { CreateShowStyleScreen } from './screens/CreateShowStyleScreen'
import { CreateShowCharactersScreen } from './screens/CreateShowCharactersScreen'
import { NewEpisodeScreen } from './screens/NewEpisodeScreen'
import { PreflightScreen } from './screens/PreflightScreen'
import { BriefScreen } from './screens/BriefScreen'
import { PlanScreen } from './screens/PlanScreen'
import { ReferencesScreen } from './screens/ReferencesScreen'
import { KeyframesReviewScreen } from './screens/KeyframesReviewScreen'
import { KeyframesScreen } from './screens/KeyframesScreen'
import { AnimationScreen } from './screens/AnimationScreen'
import { AudioScreen } from './screens/AudioScreen'
import { AssemblyScreen } from './screens/AssemblyScreen'
import { FinalReviewScreen } from './screens/FinalReviewScreen'
import { ProductionsScreen } from './screens/ProductionsScreen'
import { AssetsScreen } from './screens/AssetsScreen'
import { UsageScreen } from './screens/UsageScreen'
import { SettingsScreen } from './screens/SettingsScreen'
import { NotificationsScreen } from './screens/NotificationsScreen'
import { CaptureRequestsScreen } from './screens/CaptureRequestsScreen'
import { CaptureRequestDetailScreen } from './screens/CaptureRequestDetailScreen'
import { ApprovalsScreen } from './screens/ApprovalsScreen'
import { TeamScreen } from './screens/TeamScreen'
import { PublishedExperienceScreen } from './screens/PublishedExperienceScreen'
import { PublicPropertyViewerScreen } from './screens/PublicPropertyViewerScreen'
import { MobileCaptureScreen } from './screens/MobileCaptureScreen'
import { InitialSetupScreen } from './screens/InitialSetupScreen'
import { DemoPortalScreen } from './screens/DemoPortalScreen'

import { LandingScreen } from './screens/LandingScreen'
import { AuthGate } from './components/AuthGate'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingScreen />} />

        {/* Demo Listing Trigger Portal */}
        <Route path="/demo-portal" element={<DemoPortalScreen />} />
        <Route path="/portal" element={<DemoPortalScreen />} />
        <Route path="/listing-portal" element={<DemoPortalScreen />} />

        {/* Onboarding & Setup */}
        <Route path="/setup" element={<AuthGate><InitialSetupScreen /></AuthGate>} />
        <Route path="/onboarding" element={<AuthGate><InitialSetupScreen /></AuthGate>} />
        <Route path="/initial-setup" element={<AuthGate><InitialSetupScreen /></AuthGate>} />

        {/* Workspace Hubs */}
        <Route path="/properties" element={<AuthGate><ShowsHomeScreen /></AuthGate>} />
        <Route path="/shows" element={<AuthGate><ShowsHomeScreen /></AuthGate>} />
        <Route path="/capture-requests" element={<AuthGate><CaptureRequestsScreen /></AuthGate>} />
        <Route path="/capture-requests/:id" element={<AuthGate><CaptureRequestDetailScreen /></AuthGate>} />
        <Route path="/experiences" element={<AuthGate><ProductionsScreen /></AuthGate>} />
        <Route path="/productions" element={<AuthGate><ProductionsScreen /></AuthGate>} />
        <Route path="/approvals" element={<AuthGate><ApprovalsScreen /></AuthGate>} />
        <Route path="/activity" element={<AuthGate><ShowOverviewScreen /></AuthGate>} />
        <Route path="/assets" element={<AuthGate><AssetsScreen /></AuthGate>} />

        {/* Account Hubs */}
        <Route path="/usage" element={<AuthGate><UsageScreen /></AuthGate>} />
        <Route path="/team" element={<AuthGate><TeamScreen /></AuthGate>} />
        <Route path="/settings" element={<AuthGate><SettingsScreen /></AuthGate>} />
        <Route path="/notifications" element={<AuthGate><NotificationsScreen /></AuthGate>} />

        {/* Mobile Capture App */}
        <Route path="/capture/:id" element={<MobileCaptureScreen />} />
        <Route path="/capture" element={<MobileCaptureScreen />} />
        <Route path="/c/:id" element={<MobileCaptureScreen />} />
        <Route path="/mobile-capture" element={<MobileCaptureScreen />} />

        {/* Property & Experience Details */}
        <Route path="/property/:id" element={<AuthGate><ShowOverviewScreen /></AuthGate>} />
        <Route path="/show/:id" element={<AuthGate><ShowOverviewScreen /></AuthGate>} />
        <Route path="/experience/:id/published" element={<AuthGate><PublishedExperienceScreen /></AuthGate>} />
        <Route path="/experience/:id" element={<PublicPropertyViewerScreen />} />
        <Route path="/view/:id" element={<PublicPropertyViewerScreen />} />
        <Route path="/view" element={<PublicPropertyViewerScreen />} />
        <Route path="/viewer" element={<PublicPropertyViewerScreen />} />
        <Route path="/p/:id" element={<PublicPropertyViewerScreen />} />

        {/* Create show wizard */}
        <Route path="/create-show" element={<CreateShowBasicsScreen />} />
        <Route path="/create-show/style" element={<CreateShowStyleScreen />} />
        <Route path="/create-show/characters" element={<CreateShowCharactersScreen />} />

        {/* Episode flow */}
        <Route path="/new-episode" element={<NewEpisodeScreen />} />
        <Route path="/preflight" element={<PreflightScreen />} />

        {/* Production workspace */}
        <Route path="/brief" element={<BriefScreen />} />
        <Route path="/plan" element={<PlanScreen />} />
        <Route path="/references" element={<ReferencesScreen />} />
        <Route path="/storyboards" element={<Navigate to="/keyframes" replace />} />
        <Route path="/keyframes" element={<KeyframesReviewScreen />} />
        <Route path="/keyframes-retry" element={<KeyframesScreen />} />
        <Route path="/animation" element={<AnimationScreen />} />
        <Route path="/audio" element={<AudioScreen />} />
        <Route path="/assembly" element={<AssemblyScreen />} />
        <Route path="/final-review" element={<FinalReviewScreen />} />

        <Route path="*" element={<Navigate to="/shows" replace />} />
      </Routes>
    </HashRouter>
  )
}

