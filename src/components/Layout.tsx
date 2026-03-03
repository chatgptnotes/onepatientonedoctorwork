import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Heart, LayoutDashboard, Activity, Calendar, Pill,
  Shield, FileText, Settings, LogOut, Menu, X,
  Sun, Moon, Bell, User, Syringe, Brain, Apple,
  Dumbbell, Users, Receipt, Clock, Droplets,
  Trophy, ShieldCheck, Star, Video, Watch, Download,
  Camera, AlertCircle
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import toast from 'react-hot-toast'
import GlobalSearch from './GlobalSearch'
import MobileBottomNav from './MobileBottomNav'

const navSections = [
  {
    title: 'Overview',
    items: [
      { path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
      { path: '/digital-twin', icon: <Activity className="w-5 h-5" />, label: 'Digital Twin' },
      { path: '/health-timeline', icon: <Clock className="w-5 h-5" />, label: 'Health Timeline' },
      { path: '/gamification', icon: <Trophy className="w-5 h-5" />, label: 'Achievements' },
    ]
  },
  {
    title: 'Health',
    items: [
      { path: '/vitals', icon: <Heart className="w-5 h-5" />, label: 'Vitals Logger' },
      { path: '/health-records', icon: <FileText className="w-5 h-5" />, label: 'Health Records' },
      { path: '/lab-results', icon: <FileText className="w-5 h-5" />, label: 'Lab Results' },
      { path: '/symptom-checker', icon: <Brain className="w-5 h-5" />, label: 'Symptom Checker' },
      { path: '/preventive-care', icon: <ShieldCheck className="w-5 h-5" />, label: 'Preventive Care' },
    ]
  },
  {
    title: 'Medications',
    items: [
      { path: '/medications', icon: <Pill className="w-5 h-5" />, label: 'Medications' },
      { path: '/medication-reminders', icon: <Bell className="w-5 h-5" />, label: 'Reminders' },
      { path: '/prescription-scanner', icon: <Camera className="w-5 h-5" />, label: 'Scan Prescription' },
    ]
  },
  {
    title: 'Lifestyle',
    items: [
      { path: '/nutrition', icon: <Apple className="w-5 h-5" />, label: 'Nutrition' },
      { path: '/fitness', icon: <Dumbbell className="w-5 h-5" />, label: 'Fitness' },
      { path: '/water-intake', icon: <Droplets className="w-5 h-5" />, label: 'Water Intake' },
    ]
  },
  {
    title: 'Appointments',
    items: [
      { path: '/appointments', icon: <Calendar className="w-5 h-5" />, label: 'Appointments' },
      { path: '/telemedicine', icon: <Video className="w-5 h-5" />, label: 'Telemedicine' },
      { path: '/doctor-reviews', icon: <Star className="w-5 h-5" />, label: 'Doctor Reviews' },
    ]
  },
  {
    title: 'Records',
    items: [
      { path: '/immunizations', icon: <Syringe className="w-5 h-5" />, label: 'Immunizations' },
      { path: '/allergies', icon: <Shield className="w-5 h-5" />, label: 'Allergies' },
      { path: '/family-health', icon: <Users className="w-5 h-5" />, label: 'Family Health' },
    ]
  },
  {
    title: 'Finance',
    items: [
      { path: '/insurance', icon: <Shield className="w-5 h-5" />, label: 'Insurance' },
      { path: '/bills', icon: <Receipt className="w-5 h-5" />, label: 'Medical Bills' },
    ]
  },
  {
    title: 'Account',
    items: [
      { path: '/emergency-card', icon: <AlertCircle className="w-5 h-5" />, label: 'Emergency Card' },
      { path: '/profile', icon: <User className="w-5 h-5" />, label: 'Profile' },
      { path: '/wearables', icon: <Watch className="w-5 h-5" />, label: 'Wearables' },
      { path: '/export-data', icon: <Download className="w-5 h-5" />, label: 'Export Data' },
      { path: '/settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
    ]
  },
]

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    toast.success('Signed out successfully')
    navigate('/')
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const avatarInitial = displayName[0]?.toUpperCase() || 'U'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col z-30 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center gap-3 p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-900 dark:text-white text-sm leading-tight">1Patient1Doctor</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Digital Health Platform</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto space-y-4" role="navigation" aria-label="Main navigation">
          {navSections.map(section => (
            <div key={section.title}>
              <p className="px-3 py-1 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{section.title}</p>
              <div className="space-y-0.5">
                {section.items.map(item => {
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${isActive
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                      {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {avatarInitial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{displayName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleSignOut} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 h-16 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" aria-label="Open menu">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 flex items-center justify-center"><GlobalSearch /></div>
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg relative" aria-label="Notifications">
            <Bell className="w-5 h-5" />
            <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
          </button>
          <button onClick={toggleTheme} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            {avatarInitial}
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">{children}</main>
        <MobileBottomNav />
      </div>
    </div>
  )
}
