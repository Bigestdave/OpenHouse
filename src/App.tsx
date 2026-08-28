import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ShowsHomeScreen } from './screens/ShowsHomeScreen'
import { ShowOverviewScreen } from './screens/ShowOverviewScreen'
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
import { CreateShowBasicsScreen } from './screens/CreateShowBasicsScreen'
import { CreateShowStyleScreen } from './screens/CreateShowStyleScreen'
import { CreateShowCharactersScreen } from './screens/CreateShowCharactersScreen'
import { MobileCaptureScreen } from './screens/MobileCaptureScreen'
import { InitialSetupScreen } from './screens/InitialSetupScreen'
import { AuthScreen } from './screens/AuthScreen'
import { LandingScreen } from './screens/LandingScreen'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingScreen />} />

        {/* Authentication */}
        <Route path="/login" element={<AuthScreen />} />
        <Route path="/signin" element={<AuthScreen />} />
        <Route path="/signup" element={<AuthScreen />} />
        <Route path="/auth" element={<AuthScreen />} />

        {/* Onboarding & Setup */}
        <Route path="/setup" element={<InitialSetupScreen />} />
        <Route path="/onboarding" element={<InitialSetupScreen />} />
        <Route path="/initial-setup" element={<InitialSetupScreen />} />

        {/* Create Property (3-Step Wizard) */}
        <Route path="/create-show" element={<CreateShowBasicsScreen />} />
        <Route path="/create-show/style" element={<CreateShowStyleScreen />} />
        <Route path="/create-show/characters" element={<CreateShowCharactersScreen />} />
        <Route path="/add-property" element={<CreateShowBasicsScreen />} />
        <Route path="/new-property" element={<CreateShowBasicsScreen />} />

        {/* Workspace Hubs */}
        <Route path="/properties" element={<ShowsHomeScreen />} />
        <Route path="/shows" element={<ShowsHomeScreen />} />
        <Route path="/capture-requests" element={<CaptureRequestsScreen />} />
        <Route path="/capture-requests/:id" element={<CaptureRequestDetailScreen />} />
        <Route path="/experiences" element={<ProductionsScreen />} />
        <Route path="/productions" element={<ProductionsScreen />} />
        <Route path="/approvals" element={<ApprovalsScreen />} />
        <Route path="/activity" element={<ShowOverviewScreen />} />
        <Route path="/assets" element={<AssetsScreen />} />

        {/* Account Hubs */}
        <Route path="/usage" element={<UsageScreen />} />
        <Route path="/team" element={<TeamScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="/notifications" element={<NotificationsScreen />} />

        {/* Mobile Capture App */}
        <Route path="/capture/:id" element={<MobileCaptureScreen />} />
        <Route path="/capture" element={<MobileCaptureScreen />} />
        <Route path="/c/:id" element={<MobileCaptureScreen />} />
        <Route path="/mobile-capture" element={<MobileCaptureScreen />} />

        {/* Property & Experience Details */}
        <Route path="/property/:id" element={<ShowOverviewScreen />} />
        <Route path="/show/:id" element={<ShowOverviewScreen />} />
        <Route path="/experience/:id/published" element={<PublishedExperienceScreen />} />
        <Route path="/experience/:id" element={<PublicPropertyViewerScreen />} />
        <Route path="/view/:id" element={<PublicPropertyViewerScreen />} />
        <Route path="/view" element={<PublicPropertyViewerScreen />} />
        <Route path="/viewer" element={<PublicPropertyViewerScreen />} />
        <Route path="/p/:id" element={<PublicPropertyViewerScreen />} />

        <Route path="*" element={<Navigate to="/properties" replace />} />
      </Routes>
    </HashRouter>
  )
}



