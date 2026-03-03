import { useEffect, useState } from 'react'
import {
  Activity, Heart, Thermometer, Droplets, Wind,
  Brain, TrendingUp, AlertCircle, Save, RefreshCw
} from 'lucide-react'
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

interface TwinData {
  health_score: number
  bmi: number | null
  height_cm: number | null
  weight_kg: number | null
  systolic_bp: number | null
  diastolic_bp: number | null
  heart_rate: number | null
  glucose_level: number | null
  spo2: number | null
  temperature: number | null
}

const defaultTwin: TwinData = {
  health_score: 75,
  bmi: null, height_cm: null, weight_kg: null,
  systolic_bp: null, diastolic_bp: null,
  heart_rate: null, glucose_level: null,
  spo2: null, temperature: null,
}

const healthHistory = [
  { date: 'Jan', score: 70, hr: 78, glucose: 102 },
  { date: 'Feb', score: 73, hr: 75, glucose: 98 },
  { date: 'Mar', score: 78, hr: 72, glucose: 94 },
  { date: 'Apr', score: 75, hr: 74, glucose: 97 },
  { date: 'May', score: 80, hr: 70, glucose: 91 },
  { date: 'Jun', score: 83, hr: 72, glucose: 88 },
  { date: 'Mar\'26', score: 87, hr: 72, glucose: 85 },
]

export default function DigitalTwin() {
  const { user } = useAuth()
  const [twin, setTwin] = useState<TwinData>(defaultTwin)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState<TwinData>(defaultTwin)

  useEffect(() => {
    if (!user) return
    loadTwin()
  }, [user])

  async function loadTwin() {
    const { data } = await supabase
      .from('digital_twins')
      .select('*')
      .eq('user_id', user!.id)
      .single()

    if (data) {
      setTwin(data)
      setForm(data)
    }
    setLoading(false)
  }

  async function saveTwin() {
    setSaving(true)
    const payload = {
      ...form,
      user_id: user!.id,
      last_updated: new Date().toISOString(),
      bmi: form.height_cm && form.weight_kg
        ? parseFloat(((form.weight_kg / Math.pow(form.height_cm / 100, 2)).toFixed(1)))
        : form.bmi,
    }

    const { error } = await supabase
      .from('digital_twins')
      .upsert(payload, { onConflict: 'user_id' })

    setSaving(false)
    if (error) {
      toast.error('Failed to update Digital Twin')
    } else {
      setTwin(payload)
      setEditMode(false)
      toast.success('Digital Twin updated!')
    }
  }

  function handleChange(key: keyof TwinData, value: string) {
    setForm(prev => ({ ...prev, [key]: value === '' ? null : parseFloat(value) || value }))
  }

  const radarData = [
    { subject: 'Cardiovascular', A: twin.heart_rate ? Math.max(0, 100 - Math.abs(twin.heart_rate - 72) * 2) : 75 },
    { subject: 'Metabolic', A: twin.glucose_level ? Math.max(0, 100 - Math.max(0, twin.glucose_level - 90)) : 80 },
    { subject: 'Respiratory', A: twin.spo2 ? Math.min(100, twin.spo2) : 90 },
    { subject: 'BP Control', A: twin.systolic_bp ? Math.max(0, 100 - Math.abs(twin.systolic_bp - 120)) : 80 },
    { subject: 'Weight', A: twin.bmi ? Math.max(0, 100 - Math.abs(twin.bmi - 22) * 5) : 75 },
    { subject: 'Overall', A: twin.health_score },
  ]

  const scoreColor = twin.health_score >= 80 ? 'text-green-500' : twin.health_score >= 60 ? 'text-yellow-500' : 'text-red-500'
  const scoreBg = twin.health_score >= 80 ? 'from-green-500 to-emerald-400' : twin.health_score >= 60 ? 'from-yellow-500 to-orange-400' : 'from-red-500 to-rose-400'

  const vitalFields = [
    { key: 'height_cm' as keyof TwinData, label: 'Height', unit: 'cm', icon: <Activity className="w-4 h-4" />, color: 'text-blue-500' },
    { key: 'weight_kg' as keyof TwinData, label: 'Weight', unit: 'kg', icon: <Activity className="w-4 h-4" />, color: 'text-purple-500' },
    { key: 'systolic_bp' as keyof TwinData, label: 'Systolic BP', unit: 'mmHg', icon: <Heart className="w-4 h-4" />, color: 'text-red-500' },
    { key: 'diastolic_bp' as keyof TwinData, label: 'Diastolic BP', unit: 'mmHg', icon: <Heart className="w-4 h-4" />, color: 'text-red-400' },
    { key: 'heart_rate' as keyof TwinData, label: 'Heart Rate', unit: 'bpm', icon: <Activity className="w-4 h-4" />, color: 'text-pink-500' },
    { key: 'glucose_level' as keyof TwinData, label: 'Blood Glucose', unit: 'mg/dL', icon: <Droplets className="w-4 h-4" />, color: 'text-amber-500' },
    { key: 'spo2' as keyof TwinData, label: 'SpO2', unit: '%', icon: <Wind className="w-4 h-4" />, color: 'text-cyan-500' },
    { key: 'temperature' as keyof TwinData, label: 'Temperature', unit: '°C', icon: <Thermometer className="w-4 h-4" />, color: 'text-orange-500' },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Digital Twin</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Your living virtual health model</p>
        </div>
        <div className="flex gap-2">
          {editMode ? (
            <>
              <button onClick={() => setEditMode(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Cancel
              </button>
              <button
                onClick={saveTwin}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Twin
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Update Vitals
            </button>
          )}
        </div>
      </div>

      {/* Health Score */}
      <div className={`bg-gradient-to-r ${scoreBg} rounded-2xl p-6 text-white`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-white/80 text-sm font-medium mb-1">Digital Twin Health Score</p>
            <div className="flex items-baseline gap-3">
              <span className="text-6xl font-bold">{twin.health_score}</span>
              <span className="text-white/70 text-xl">/100</span>
            </div>
            <div className="mt-3 bg-white/20 rounded-full h-2 w-full max-w-xs">
              <div className="bg-white h-2 rounded-full transition-all" style={{ width: `${twin.health_score}%` }} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {twin.bmi && (
              <div className="bg-white/20 rounded-xl px-4 py-2">
                <p className="text-white/70 text-xs">BMI</p>
                <p className="text-white font-bold">{twin.bmi}</p>
              </div>
            )}
            <div className="bg-white/20 rounded-xl px-4 py-2">
              <p className="text-white/70 text-xs">Status</p>
              <p className="text-white font-bold text-sm">{twin.health_score >= 80 ? 'Excellent' : twin.health_score >= 60 ? 'Good' : 'Needs Attention'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vitals Grid */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
          {editMode ? 'Update Vitals' : 'Current Vitals'}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {vitalFields.map(field => (
            <div key={field.key} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <div className={`flex items-center gap-1.5 ${field.color} mb-2`}>
                {field.icon}
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{field.label}</span>
              </div>
              {editMode ? (
                <input
                  type="number"
                  value={(form[field.key] as number | null) ?? ''}
                  onChange={e => handleChange(field.key, e.target.value)}
                  placeholder="—"
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {(twin[field.key] as number | null) ?? '—'}
                  </span>
                  {(twin[field.key] as number | null) && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">{field.unit}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Health Profile Radar</h2>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid className="stroke-gray-200 dark:stroke-gray-700" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <Radar dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Health Score History</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={healthHistory}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100 dark:stroke-gray-800" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} domain={[60, 100]} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #e5e7eb' }}
              />
              <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} name="Health Score" />
              <Line type="monotone" dataKey="hr" stroke="#ef4444" strokeWidth={1.5} dot={false} name="Heart Rate" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ABHA + Disclaimer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Link Your ABHA ID</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Connect your Ayushman Bharat Health Account to automatically import your complete health history from government and private hospitals.
          </p>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
            <TrendingUp className="w-4 h-4" />
            Connect ABHA Account
          </button>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Medical Disclaimer</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            The Digital Twin and AI health insights are for informational purposes only. They do not constitute medical advice, diagnosis, or treatment.
            <strong className="text-gray-900 dark:text-white"> Always consult a qualified medical professional</strong> before making health decisions.
          </p>
        </div>
      </div>
    </div>
  )
}
