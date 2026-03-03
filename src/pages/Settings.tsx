import { Sun, Moon, Bell, Shield, Download, Trash2 } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function Settings() {
  const { theme, toggleTheme } = useTheme()
  const { signOut, user } = useAuth()
  const navigate = useNavigate()

  async function handleDeleteAccount() {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) return
    toast.error('Account deletion requires manual support request. Email support@onepatientonedoctor.work')
  }

  async function handleSignOut() {
    await signOut()
    toast.success('Signed out')
    navigate('/')
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Manage your account preferences</p>
      </div>

      {/* Appearance */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Appearance</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? <Moon className="w-5 h-5 text-blue-400" /> : <Sun className="w-5 h-5 text-yellow-500" />}
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Toggle between light and dark themes</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative w-12 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Notifications</h3>
        <div className="space-y-4">
          {[
            { label: 'Appointment Reminders', desc: '24 hours before your appointment', enabled: true },
            { label: 'Medication Alerts', desc: 'Daily reminders for your medications', enabled: true },
            { label: 'Vaccination Due', desc: 'When a vaccine is due within 30 days', enabled: true },
            { label: 'AI Health Insights', desc: 'Weekly personalized health tips', enabled: false },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                </div>
              </div>
              <button
                onClick={() => toast.success('Notification preference saved')}
                className={`relative w-10 h-5 rounded-full transition-colors ${item.enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${item.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-500" /> Privacy & Security
        </h3>
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <p>Your data is protected under India's <strong className="text-gray-900 dark:text-white">DPDP Act</strong> and encrypted with <strong className="text-gray-900 dark:text-white">AES-256</strong>.</p>
          <p>We never share your health data without explicit consent. ABHA integration uses government-grade OAuth 2.0.</p>
          <p>Logged in as: <strong className="text-gray-900 dark:text-white">{user?.email}</strong></p>
        </div>
      </div>

      {/* Data Export */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-blue-500" /> Data Export
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Download a complete copy of your health data in FHIR-compliant format.</p>
        <div className="flex gap-3">
          <button onClick={() => toast.success('Preparing your health data export...')} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors">
            <Download className="w-4 h-4" /> Export as PDF
          </button>
          <button onClick={() => toast.success('Excel export coming soon in Pro plan')} className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-sm font-medium transition-colors">
            <Download className="w-4 h-4" /> Export as Excel
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-6 border border-red-200 dark:border-red-800">
        <h3 className="font-semibold text-red-900 dark:text-red-100 mb-4">Danger Zone</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={handleSignOut} className="flex items-center gap-2 px-4 py-2.5 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl text-sm font-medium transition-colors">
            Sign Out
          </button>
          <button onClick={handleDeleteAccount} className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors">
            <Trash2 className="w-4 h-4" /> Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}
