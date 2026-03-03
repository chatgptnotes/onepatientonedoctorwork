import { useState } from 'react'
import { Droplets, Plus, Minus, Target, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const weeklyData = [
  { day: 'Mon', glasses: 8 }, { day: 'Tue', glasses: 6 }, { day: 'Wed', glasses: 10 },
  { day: 'Thu', glasses: 7 }, { day: 'Fri', glasses: 9 }, { day: 'Sat', glasses: 5 }, { day: 'Sun', glasses: 4 },
]

export default function WaterIntakeTracker() {
  const [glasses, setGlasses] = useState(4)
  const goal = 8
  const pct = Math.min(100, Math.round((glasses / goal) * 100))

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Water Intake Tracker</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Stay hydrated, track daily water intake</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center">
        <Droplets className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <p className="text-6xl font-bold text-gray-900 dark:text-white">{glasses}</p>
        <p className="text-gray-500 mt-1">glasses of water today</p>
        <div className="mt-4 h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden max-w-xs mx-auto">
          <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-sm text-gray-500 mt-2">{pct}% of daily goal ({goal} glasses)</p>
        <div className="flex items-center justify-center gap-4 mt-6">
          <button onClick={() => setGlasses(Math.max(0, glasses - 1))} className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <Minus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button onClick={() => setGlasses(glasses + 1)} className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center transition-colors">
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 text-center">
          <Target className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{glasses * 250}ml</p>
          <p className="text-xs text-gray-500">Total intake</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 text-center">
          <TrendingUp className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">7.0</p>
          <p className="text-xs text-gray-500">Weekly average</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">This Week</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklyData}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Bar dataKey="glasses" fill="#3b82f6" radius={[6,6,0,0]} /></BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">Hydration Tips</p>
        <ul className="text-sm text-blue-700 dark:text-blue-400 mt-2 space-y-1 list-disc list-inside">
          <li>Start your day with a glass of water</li>
          <li>Carry a water bottle everywhere</li>
          <li>Set hourly reminders</li>
          <li>Drink a glass before each meal</li>
        </ul>
      </div>
    </div>
  )
}
