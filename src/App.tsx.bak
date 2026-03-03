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

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/digital-twin" element={
              <ProtectedRoute>
                <Layout><DigitalTwin /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/health-records" element={
              <ProtectedRoute>
                <Layout><HealthRecords /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/appointments" element={
              <ProtectedRoute>
                <Layout><Appointments /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/medications" element={
              <ProtectedRoute>
                <Layout><Medications /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/immunizations" element={
              <ProtectedRoute>
                <Layout><Immunizations /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/allergies" element={
              <ProtectedRoute>
                <Layout><Allergies /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout><Profile /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Layout><Settings /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
