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
import { MobileCaptureScreen } from './screens/MobileCaptureScreen'
import { InitialSetupScreen } from './screens/InitialSetupScreen'
import { ListingPortalScreen } from './screens/ListingPortalScreen'
import { LandingScreen } from './screens/LandingScreen'
import { AuthScreen } from './screens/AuthScreen'
import { AddPropertyScreen } from './screens/AddPropertyScreen'
import { AuthGate } from './components/AuthGate'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingScreen />} />

        {/* Dedicated Auth Routes (Split-Screen with Pointcloud Artwork) */}
        <Route path="/login" element={<AuthScreen />} />
        <Route path="/signin" element={<AuthScreen />} />
        <Route path="/signup" element={<AuthScreen />} />
        <Route path="/auth" element={<AuthScreen />} />

        {/* MLS & Listing Intake Feeds */}
        <Route path="/import" element={<ListingPortalScreen />} />
        <Route path="/portal" element={<ListingPortalScreen />} />
        <Route path="/listing-portal" element={<ListingPortalScreen />} />
        <Route path="/demo-portal" element={<ListingPortalScreen />} />

        {/* Property Creation Flow */}
        <Route path="/add-property" element={<AuthGate><AddPropertyScreen /></AuthGate>} />
        <Route path="/create-show" element={<AuthGate><AddPropertyScreen /></AuthGate>} />
        <Route path="/new-property" element={<AuthGate><AddPropertyScreen /></AuthGate>} />

        {/* Realtor Onboarding & Setup */}
        <Route path="/setup" element={<AuthGate><InitialSetupScreen /></AuthGate>} />
        <Route path="/onboarding" element={<AuthGate><InitialSetupScreen /></AuthGate>} />
        <Route path="/initial-setup" element={<AuthGate><InitialSetupScreen /></AuthGate>} />

        {/* Protected Realtor Workspace Hubs */}
        <Route path="/properties" element={<AuthGate><ShowsHomeScreen /></AuthGate>} />
        <Route path="/shows" element={<Navigate to="/properties" replace />} />
        <Route path="/capture-requests" element={<AuthGate><CaptureRequestsScreen /></AuthGate>} />
        <Route path="/capture-requests/:id" element={<AuthGate><CaptureRequestDetailScreen /></AuthGate>} />
        <Route path="/experiences" element={<AuthGate><ProductionsScreen /></AuthGate>} />
        <Route path="/productions" element={<Navigate to="/experiences" replace />} />
        <Route path="/approvals" element={<AuthGate><ApprovalsScreen /></AuthGate>} />
        <Route path="/activity" element={<AuthGate><ShowOverviewScreen /></AuthGate>} />
        <Route path="/assets" element={<AuthGate><AssetsScreen /></AuthGate>} />

        {/* Account & Team Hubs */}
        <Route path="/usage" element={<AuthGate><UsageScreen /></AuthGate>} />
        <Route path="/team" element={<AuthGate><TeamScreen /></AuthGate>} />
        <Route path="/settings" element={<AuthGate><SettingsScreen /></AuthGate>} />
        <Route path="/notifications" element={<AuthGate><NotificationsScreen /></AuthGate>} />

        {/* Public Mobile Capture Link (Sent to Agent / Assistant) */}
        <Route path="/capture/:id" element={<MobileCaptureScreen />} />
        <Route path="/capture" element={<MobileCaptureScreen />} />
        <Route path="/c/:id" element={<MobileCaptureScreen />} />
        <Route path="/mobile-capture" element={<MobileCaptureScreen />} />

        {/* Property Inspector & Overview */}
        <Route path="/property/:id" element={<AuthGate><ShowOverviewScreen /></AuthGate>} />
        <Route path="/show/:id" element={<Navigate to="/property/:id" replace />} />
        <Route path="/experience/:id/published" element={<AuthGate><PublishedExperienceScreen /></AuthGate>} />

        {/* Public 3D Property Tour & Inspection Booking */}
        <Route path="/view/:id" element={<PublicPropertyViewerScreen />} />
        <Route path="/view" element={<PublicPropertyViewerScreen />} />
        <Route path="/viewer" element={<PublicPropertyViewerScreen />} />
        <Route path="/experience/:id" element={<PublicPropertyViewerScreen />} />
        <Route path="/p/:id" element={<PublicPropertyViewerScreen />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/properties" replace />} />
      </Routes>
    </HashRouter>
  )
}
