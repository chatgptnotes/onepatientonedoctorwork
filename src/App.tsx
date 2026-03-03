import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import DigitalTwin from './pages/DigitalTwin'
import HealthRecords from './pages/HealthRecords'
import Appointments from './pages/Appointments'
import Medications from './pages/Medications'
import Immunizations from './pages/Immunizations'
import Allergies from './pages/Allergies'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import SymptomChecker from './pages/SymptomChecker'
import NutritionTracker from './pages/NutritionTracker'
import FitnessLog from './pages/FitnessLog'
import FamilyHealthHub from './pages/FamilyHealthHub'
import InsuranceTracker from './pages/InsuranceTracker'
import MedicalBillTracker from './pages/MedicalBillTracker'
import HealthTimeline from './pages/HealthTimeline'
import WaterIntakeTracker from './pages/WaterIntakeTracker'
import VitalsLogger from './pages/VitalsLogger'
import EmergencyCard from './pages/EmergencyCard'
import PrescriptionScanner from './pages/PrescriptionScanner'
import HealthGamification from './pages/HealthGamification'
import PreventiveCare from './pages/PreventiveCare'
import DoctorReviews from './pages/DoctorReviews'
import Telemedicine from './pages/Telemedicine'
import WearableIntegration from './pages/WearableIntegration'
import ExportHealthData from './pages/ExportHealthData'
import LabResultsViewer from './pages/LabResultsViewer'
import MedicationReminders from './pages/MedicationReminders'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: '12px',
                background: 'var(--toast-bg, #fff)',
                color: 'var(--toast-color, #111)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
              },
            }}
          />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {[
              { path: '/dashboard', el: <Dashboard /> },
              { path: '/digital-twin', el: <DigitalTwin /> },
              { path: '/health-records', el: <HealthRecords /> },
              { path: '/appointments', el: <Appointments /> },
              { path: '/medications', el: <Medications /> },
              { path: '/immunizations', el: <Immunizations /> },
              { path: '/allergies', el: <Allergies /> },
              { path: '/profile', el: <Profile /> },
              { path: '/settings', el: <Settings /> },
              { path: '/symptom-checker', el: <SymptomChecker /> },
              { path: '/nutrition', el: <NutritionTracker /> },
              { path: '/fitness', el: <FitnessLog /> },
              { path: '/family-health', el: <FamilyHealthHub /> },
              { path: '/insurance', el: <InsuranceTracker /> },
              { path: '/bills', el: <MedicalBillTracker /> },
              { path: '/health-timeline', el: <HealthTimeline /> },
              { path: '/water-intake', el: <WaterIntakeTracker /> },
              { path: '/vitals', el: <VitalsLogger /> },
              { path: '/emergency-card', el: <EmergencyCard /> },
              { path: '/prescription-scanner', el: <PrescriptionScanner /> },
              { path: '/gamification', el: <HealthGamification /> },
              { path: '/preventive-care', el: <PreventiveCare /> },
              { path: '/doctor-reviews', el: <DoctorReviews /> },
              { path: '/telemedicine', el: <Telemedicine /> },
              { path: '/wearables', el: <WearableIntegration /> },
              { path: '/export-data', el: <ExportHealthData /> },
              { path: '/lab-results', el: <LabResultsViewer /> },
              { path: '/medication-reminders', el: <MedicationReminders /> },
            ].map(r => (
              <Route key={r.path} path={r.path} element={
                <ProtectedRoute>
                  <Layout>{r.el}</Layout>
                </ProtectedRoute>
              } />
            ))}

            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
