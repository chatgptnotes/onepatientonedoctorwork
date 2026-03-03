import { useState } from 'react'
import { Footprints, Dumbbell, Moon, Plus, TrendingUp } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const stepsData = [
  { day: 'Mon', steps: 8200 }, { day: 'Tue', steps: 6500 }, { day: 'Wed', steps: 10200 },
  { day: 'Thu', steps: 7800 }, { day: 'Fri', steps: 9100 }, { day: 'Sat', steps: 11500 }, { day: 'Sun', steps: 5400 },
]
const sleepData = [
  { day: 'Mon', hours: 7.2 }, { day: 'Tue', hours: 6.5 }, { day: 'Wed', hours: 8.0 },
  { day: 'Thu', hours: 6.8 }, { day: 'Fri', hours: 7.5 }, { day: 'Sat', hours: 8.5 }, { day: 'Sun', hours: 7.0 },
]

interface Exercise { id: number; name: string; duration: string; calories: number; type: string }

export default function FitnessLog() {
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: 1, name: 'Morning Walk', duration: '30 min', calories: 150, type: 'Cardio' },
    { id: 2, name: 'Yoga', duration: '45 min', calories: 200, type: 'Flexibility' },
    { id: 3, name: 'Weight Training', duration: '40 min', calories: 300, type: 'Strength' },
  ])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', duration: '', calories: '', type: 'Cardio' })

  function addExercise() {
    if (!form.name) return
    setExercises([...exercises, { id: Date.now(), ...form, calories: +form.calories }])
    setForm({ name: '', duration: '', calories: '', type: 'Cardio' })
    setShowForm(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fitness Log</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track steps, exercise, and sleep</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" /> Log Exercise
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: <Footprints className="w-5 h-5 text-blue-500" />, label: 'Steps Today', value: '8,450', sub: 'Goal: 10,000' },
          { icon: <Dumbbell className="w-5 h-5 text-orange-500" />, label: 'Calories Burned', value: '650', sub: '3 exercises' },
          { icon: <Moon className="w-5 h-5 text-purple-500" />, label: 'Sleep Last Night', value: '7.2h', sub: 'Goal: 8h' },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center gap-2 mb-2">{s.icon}<span className="text-sm text-gray-500 dark:text-gray-400">{s.label}</span></div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Weekly Steps</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stepsData}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Bar dataKey="steps" fill="#3b82f6" radius={[6,6,0,0]} /></BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Sleep Pattern</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={sleepData}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Area type="monotone" dataKey="hours" stroke="#8b5cf6" fill="#8b5cf680" /></AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Add Exercise</h3>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Exercise name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
            <input placeholder="Duration" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
            <input placeholder="Calories" type="number" value={form.calories} onChange={e => setForm({...form, calories: e.target.value})} className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white">
              <option>Cardio</option><option>Strength</option><option>Flexibility</option><option>Sports</option>
            </select>
          </div>
          <button onClick={addExercise} className="mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium">Add</button>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Today's Exercises</h3>
        <div className="space-y-3">
          {exercises.map(e => (
            <div key={e.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <Dumbbell className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{e.name}</p>
                  <p className="text-xs text-gray-500">{e.type} - {e.duration}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{e.calories} kcal</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
