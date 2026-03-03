import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity, Calendar, Pill, Shield, FileText, Heart,
  TrendingUp, TrendingDown, AlertCircle, CheckCircle,
  Syringe, ArrowRight, Brain
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadialBarChart, RadialBar, Legend
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { computeHealthScore, getHealthStatus, getScoreGradient } from '../lib/healthScore'

const healthTrend = [
  { month: 'Sep', score: 72, bp: 128, glucose: 98 },
  { month: 'Oct', score: 75, bp: 125, glucose: 95 },
  { month: 'Nov', score: 78, bp: 122, glucose: 92 },
  { month: 'Dec', score: 74, bp: 130, glucose: 101 },
  { month: 'Jan', score: 80, bp: 120, glucose: 90 },
  { month: 'Feb', score: 83, bp: 118, glucose: 88 },
  { month: 'Mar', score: 87, bp: 115, glucose: 85 },
]

const vitalRadial = [
  { name: 'Heart Health', value: 88, fill: '#ef4444' },
  { name: 'Immunity', value: 76, fill: '#8b5cf6' },
  { name: 'Metabolism', value: 82, fill: '#f59e0b' },
  { name: 'Overall', value: 87, fill: '#3b82f6' },
]

interface Stats {
  healthRecords: number
  appointments: number
  medications: number
  allergies: number
  immunizations: number
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats>({ healthRecords: 0, appointments: 0, medications: 0, allergies: 0, immunizations: 0 })
  const [loading, setLoading] = useState(true)
  const [computedHealthScore, setComputedHealthScore] = useState<number | null>(null)
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'

  useEffect(() => {
    async function fetchStats() {
      if (!user) return
      const uid = user.id

      const [records, appts, meds, allergies, immunizations, twinData] = await Promise.all([
        supabase.from('health_records').select('id', { count: 'exact', head: true }).eq('user_id', uid),
        supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('user_id', uid),
        supabase.from('medications').select('id', { count: 'exact', head: true }).eq('user_id', uid).eq('is_active', true),
        supabase.from('allergies').select('id', { count: 'exact', head: true }).eq('user_id', uid),
        supabase.from('immunizations').select('id', { count: 'exact', head: true }).eq('user_id', uid),
        supabase.from('digital_twins').select('*').eq('user_id', uid).single()
      ])

      setStats({
        healthRecords: records.count ?? 0,
        appointments: appts.count ?? 0,
        medications: meds.count ?? 0,
        allergies: allergies.count ?? 0,
        immunizations: immunizations.count ?? 0,
      })

      // Compute health score from digital twin data
      if (twinData.data) {
        const score = computeHealthScore(twinData.data)
        setComputedHealthScore(score)
      } else {
        // Default demo data when no real data exists
        const demoVitals = { heart_rate: 72, systolic_bp: 115, diastolic_bp: 78, spo2: 98, glucose_level: 85, bmi: 22.4, temperature: 37.0 }
        const score = computeHealthScore(demoVitals)
        setComputedHealthScore(score)
      }
      setLoading(false)
    }
    fetchStats()
  }, [user])

  const summaryCards = [
    { label: 'Health Records', value: stats.healthRecords, icon: <FileText className="w-5 h-5" />, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400', href: '/health-records' },
    { label: 'Upcoming Appts', value: stats.appointments, icon: <Calendar className="w-5 h-5" />, color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400', href: '/appointments' },
    { label: 'Active Meds', value: stats.medications, icon: <Pill className="w-5 h-5" />, color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400', href: '/medications' },
    { label: 'Vaccinations', value: stats.immunizations, icon: <Syringe className="w-5 h-5" />, color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400', href: '/immunizations' },
    { label: 'Allergies', value: stats.allergies, icon: <Shield className="w-5 h-5" />, color: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400', href: '/allergies' },
  ]

  const vitals = [
    { label: 'Heart Rate', value: '72', unit: 'bpm', trend: 'stable', icon: <Heart className="w-4 h-4" />, color: 'text-red-500' },
    { label: 'Blood Pressure', value: '115/78', unit: 'mmHg', trend: 'improved', icon: <Activity className="w-4 h-4" />, color: 'text-blue-500' },
    { label: 'SpO2', value: '98', unit: '%', trend: 'stable', icon: <TrendingUp className="w-4 h-4" />, color: 'text-green-500' },
    { label: 'Glucose', value: '85', unit: 'mg/dL', trend: 'improved', icon: <Activity className="w-4 h-4" />, color: 'text-yellow-500' },
  ]

  const aiInsights = [
    { type: 'warning', icon: <AlertCircle className="w-4 h-4 text-amber-500" />, text: 'Your next influenza vaccine is due in 3 months.' },
    { type: 'success', icon: <CheckCircle className="w-4 h-4 text-green-500" />, text: 'Blood pressure has improved 8% over the last 90 days.' },
    { type: 'info', icon: <Brain className="w-4 h-4 text-blue-500" />, text: 'Based on your profile, consider scheduling an annual lipid panel.' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {displayName.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Here's your health overview for today</p>
        </div>
        <Link
          to="/digital-twin"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          <Activity className="w-4 h-4" />
          View Digital Twin
        </Link>
      </div>

      {/* Health Score Banner */}
      <div className="className={`bg-gradient-to-r ${getScoreGradient(computedHealthScore) || 'from-blue-600 to-cyan-600'}`} rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-blue-100 text-sm font-medium mb-1">Current Health Score</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold">{computedHealthScore || 87}</span>
              <span className="text-blue-200 text-lg">/100</span>
              <span className="flex items-center gap-1 text-green-300 text-sm font-medium">
                <TrendingUp className="w-4 h-4" /> +5 this month
              </span>
            </div>
            <p className="text-blue-100 text-sm mt-2">Excellent — Keep maintaining your healthy lifestyle!</p>
          </div>
          <div className="w-full sm:w-64 h-24 sm:h-28">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthTrend.slice(-5)}>
                <Area type="monotone" dataKey="score" stroke="#a5f3fc" fill="rgba(165,243,252,0.2)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {summaryCards.map(card => (
          <Link
            key={card.label}
            to={card.href}
            className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow group"
          >
            <div className={`inline-flex p-2 rounded-xl ${card.color} mb-3`}>
              {card.icon}
            </div>
            {loading ? (
              <div className="h-7 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1" />
            ) : (
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
            )}
            <p className="text-xs text-gray-600 dark:text-gray-400">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health trend */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Health Score Trend</h2>
            <span className="text-xs text-gray-500 dark:text-gray-400">Last 7 months</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={healthTrend}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100 dark:stroke-gray-800" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} domain={[60, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--tw-bg-white, #fff)', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="score" stroke="#3b82f6" fill="url(#scoreGrad)" strokeWidth={2} name="Health Score" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Vitals radial */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Vital Scores</h2>
          <ResponsiveContainer width="100%" height={160}>
            <RadialBarChart innerRadius="30%" outerRadius="100%" data={vitalRadial} startAngle={180} endAngle={0}>
              <RadialBar dataKey="value" cornerRadius={4} />
              <Legend iconSize={8} formatter={(value) => <span className="text-xs text-gray-600 dark:text-gray-400">{value}</span>} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Vitals */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Current Vitals</h2>
            <Link to="/digital-twin" className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              Update <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {vitals.map(v => (
              <div key={v.label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                <div className={`flex items-center gap-1.5 ${v.color} mb-1`}>
                  {v.icon}
                  <span className="text-xs font-medium">{v.label}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">{v.value}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{v.unit}</span>
                </div>
                <div className={`flex items-center gap-1 mt-1 text-xs ${
                  v.trend === 'improved' ? 'text-green-500' : 'text-gray-400'
                }`}>
                  {v.trend === 'improved' ? <TrendingDown className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
                  {v.trend}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">AI Health Insights</h2>
          </div>
          <div className="space-y-3">
            {aiInsights.map((insight, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="flex-shrink-0 mt-0.5">{insight.icon}</div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{insight.text}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 italic">
            ⚠️ AI insights are for informational purposes only. Always consult a qualified doctor for medical decisions.
          </p>
        </div>
      </div>
    </div>
  )
}
