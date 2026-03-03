import { useState } from 'react'
import { Apple, Plus, Trash2, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Meal { id: number; name: string; calories: number; protein: number; carbs: number; fat: number; time: string }

const sampleMeals: Meal[] = [
  { id: 1, name: 'Oatmeal with Banana', calories: 350, protein: 12, carbs: 58, fat: 8, time: '08:00 AM' },
  { id: 2, name: 'Grilled Chicken Salad', calories: 420, protein: 35, carbs: 15, fat: 22, time: '01:00 PM' },
  { id: 3, name: 'Dal Rice with Vegetables', calories: 550, protein: 18, carbs: 72, fat: 14, time: '08:00 PM' },
]

const weeklyData = [
  { day: 'Mon', calories: 1800 }, { day: 'Tue', calories: 2100 }, { day: 'Wed', calories: 1950 },
  { day: 'Thu', calories: 1700 }, { day: 'Fri', calories: 2200 }, { day: 'Sat', calories: 2400 },
  { day: 'Sun', calories: 1320 },
]

export default function NutritionTracker() {
  const [meals, setMeals] = useState<Meal[]>(sampleMeals)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '', time: '' })
  const total = meals.reduce((a, m) => ({ cal: a.cal + m.calories, p: a.p + m.protein, c: a.c + m.carbs, f: a.f + m.fat }), { cal: 0, p: 0, c: 0, f: 0 })

  function addMeal() {
    if (!form.name || !form.calories) return
    setMeals([...meals, { id: Date.now(), name: form.name, calories: +form.calories, protein: +form.protein, carbs: +form.carbs, fat: +form.fat, time: form.time || 'N/A' }])
    setForm({ name: '', calories: '', protein: '', carbs: '', fat: '', time: '' })
    setShowForm(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nutrition Tracker</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Log meals and track calories and macros</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" /> Log Meal
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Calories', value: total.cal, unit: 'kcal', target: 2000, color: 'blue' },
          { label: 'Protein', value: total.p, unit: 'g', target: 60, color: 'red' },
          { label: 'Carbs', value: total.c, unit: 'g', target: 250, color: 'yellow' },
          { label: 'Fat', value: total.f, unit: 'g', target: 65, color: 'green' },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{s.value}<span className="text-sm font-normal text-gray-400 ml-1">{s.unit}</span></p>
            <div className="mt-2 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div className={`h-full bg-${s.color}-500 rounded-full`} style={{ width: `${Math.min(100, (s.value / s.target) * 100)}%` }} />
            </div>
            <p className="text-xs text-gray-400 mt-1">Target: {s.target}{s.unit}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Add Meal</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <input placeholder="Meal name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="col-span-2 sm:col-span-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
            <input placeholder="Calories" type="number" value={form.calories} onChange={e => setForm({...form, calories: e.target.value})} className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
            <input placeholder="Protein (g)" type="number" value={form.protein} onChange={e => setForm({...form, protein: e.target.value})} className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
            <input placeholder="Carbs (g)" type="number" value={form.carbs} onChange={e => setForm({...form, carbs: e.target.value})} className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
            <input placeholder="Fat (g)" type="number" value={form.fat} onChange={e => setForm({...form, fat: e.target.value})} className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
            <input placeholder="Time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
          <button onClick={addMeal} className="mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium">Add Meal</button>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Weekly Calorie Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklyData}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Bar dataKey="calories" fill="#3b82f6" radius={[6,6,0,0]} /></BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Today's Meals</h3>
        <div className="space-y-3">
          {meals.map(m => (
            <div key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <Apple className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{m.name}</p>
                  <p className="text-xs text-gray-500">{m.time} - P:{m.protein}g C:{m.carbs}g F:{m.fat}g</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{m.calories} kcal</span>
                <button onClick={() => setMeals(meals.filter(x => x.id !== m.id))} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
