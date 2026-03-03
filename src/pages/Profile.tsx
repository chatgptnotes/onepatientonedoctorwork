import { useEffect, useState } from 'react'
import { Save, User, Shield, Phone, MapPin, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Profile } from '../types/database'


interface ProfileForm {
  full_name: string
  phone: string
  date_of_birth: string
  gender: 'male' | 'female' | 'other' | ''
  blood_group: string
  abha_id: string
  address: string
}

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [form, setForm] = useState<ProfileForm>({
    full_name: '', phone: '', date_of_birth: '', gender: '',
    blood_group: '', abha_id: '', address: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) loadProfile()
  }, [user])

  async function loadProfile() {
    const { data } = await supabase.from('profiles').select('*').eq('user_id', user!.id).single()
    if (data) {
      setProfile(data)
      setForm({
        full_name: data.full_name ?? '',
        phone: data.phone ?? '',
        date_of_birth: data.date_of_birth ?? '',
        gender: data.gender ?? '',
        blood_group: data.blood_group ?? '',
        abha_id: data.abha_id ?? '',
        address: data.address ?? '',
      })
    }
    setLoading(false)
  }

  async function saveProfile() {
    setSaving(true)
    const { error } = await supabase.from('profiles').upsert({
      user_id: user!.id,
      ...form,
      gender: form.gender || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })

    setSaving(false)
    if (error) { toast.error('Failed to save profile') }
    else { toast.success('Profile updated!'); loadProfile() }
  }

  const displayName = form.full_name || user?.email?.split('@')[0] || 'User'
  const initial = displayName[0]?.toUpperCase() || 'U'

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Manage your personal health information</p>
      </div>

      {/* Avatar */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
            {initial}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{displayName}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.email}</p>
            <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
              <User className="w-3 h-3" /> {profile?.role ?? 'patient'}
            </span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 space-y-5">
        <h3 className="font-semibold text-gray-900 dark:text-white">Personal Information</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              <User className="w-4 h-4 inline mr-1.5" />Full Name
            </label>
            <input type="text" value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} placeholder="Your full name"
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              <Phone className="w-4 h-4 inline mr-1.5" />Phone Number
            </label>
            <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 98765 43210"
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              <Calendar className="w-4 h-4 inline mr-1.5" />Date of Birth
            </label>
            <input type="date" value={form.date_of_birth} onChange={e => setForm(p => ({ ...p, date_of_birth: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Gender</label>
            <select value={form.gender} onChange={e => setForm(p => ({ ...p, gender: e.target.value as ProfileForm['gender'] }))}
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other / Prefer not to say</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Blood Group</label>
            <select value={form.blood_group} onChange={e => setForm(p => ({ ...p, blood_group: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select blood group</option>
              {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              <MapPin className="w-4 h-4 inline mr-1.5" />Address
            </label>
            <textarea value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} rows={2} placeholder="Your address"
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
        </div>
      </div>

      {/* ABHA */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">ABHA (Ayushman Bharat Health Account)</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Link your ABHA ID to access your health records from any hospital in India that uses the Ayushman Bharat Digital Mission infrastructure.
        </p>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">ABHA ID</label>
          <input type="text" value={form.abha_id} onChange={e => setForm(p => ({ ...p, abha_id: e.target.value }))} placeholder="e.g., 12-3456-7890-1234"
            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">Create your ABHA ID at abdm.gov.in</p>
        </div>
      </div>

      <button onClick={saveProfile} disabled={saving} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-6 py-3 rounded-xl font-medium transition-colors">
        {saving ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : <Save className="w-4 h-4" />}
        Save Profile
      </button>
    </div>
  )
}
