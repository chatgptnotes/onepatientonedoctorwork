import { useState } from 'react'
import { Heart, Plus, TrendingUp, Droplets, Weight } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Vital { id: number; type: string; value: string; date: string; time: string }

const bpTrend = [
  { date: 'Feb 1', sys: 130, dia: 85 }, { date: 'Feb 8', sys: 128, dia: 82 },
  { date: 'Feb 15', sys: 125, dia: 80 }, { date: 'Feb 22', sys: 122, dia: 78 },
  { date: 'Mar 1', sys: 120, dia: 76 }, { date: 'Mar 3', sys: 118, dia: 75 },
]

export default function VitalsLogger() {
  const [vitals, setVitals] = useState<Vital[]>([
    { id: 1, type: 'Blood Pressure', value: '120/80 mmHg', date: '2026-03-03', time: '08:00 AM' },
    { id: 2, type: 'Blood Sugar', value: '110 mg/dL', date: '2026-03-03', time: '07:30 AM' },
    { id: 3, type: 'Weight', value: '75 kg', date: '2026-03-03', time: '07:00 AM' },
    { id: 4, type: 'SpO2', value: '98%', date: '2026-03-03', time: '08:15 AM' },
  ])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ type: 'Blood Pressure', value: '' })

  function addVital() {
    if (!form.value) return
    const now = new Date()
    setVitals([{ id: Date.now(), type: form.type, value: form.value, date: now.toISOString().slice(0,10), time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }, ...vitals])
    setForm({ type: 'Blood Pressure', value: '' })
    setShowForm(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Vitals Logger</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Quick-entry for BP, sugar, weight with trends</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center gap-2"><Plus className="w-4 h-4" /> Log Vital</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: <Heart className="w-5 h-5 text-red-500" />, label: 'Blood Pressure', value: '120/80', unit: 'mmHg' },
          { icon: <Droplets className="w-5 h-5 text-blue-500" />, label: 'Blood Sugar', value: '110', unit: 'mg/dL' },
          { icon: <Weight className="w-5 h-5 text-green-500" />, label: 'Weight', value: '75', unit: 'kg' },
          { icon: <Heart className="w-5 h-5 text-purple-500" />, label: 'SpO2', value: '98', unit: '%' },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center gap-2 mb-2">{s.icon}<span className="text-xs text-gray-500">{s.label}</span></div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}<span className="text-sm font-normal text-gray-400 ml-1">{s.unit}</span></p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Log a Vital</h3>
          <div className="flex gap-3">
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white">
              <option>Blood Pressure</option><option>Blood Sugar</option><option>Weight</option><option>SpO2</option><option>Heart Rate</option><option>Temperature</option>
            </select>
            <input placeholder="Value (e.g., 120/80)" value={form.value} onChange={e => setForm({...form, value: e.target.value})} className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
            <button onClick={addVital} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium">Log</button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Blood Pressure Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={bpTrend}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="date" /><YAxis /><Tooltip />
            <Line type="monotone" dataKey="sys" stroke="#ef4444" strokeWidth={2} name="Systolic" />
            <Line type="monotone" dataKey="dia" stroke="#3b82f6" strokeWidth={2} name="Diastolic" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Readings</h3>
        <div className="space-y-2">
          {vitals.map(v => (
            <div key={v.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">{v.type}</p>
                <p className="text-xs text-gray-500">{v.date} at {v.time}</p>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white text-sm">{v.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
