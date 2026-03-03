import { useState } from 'react'
import { Bell, Pill, CheckCircle, Clock, Flame, Calendar, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

interface Reminder { id: number; medicine: string; dosage: string; time: string; taken: boolean }

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const adherenceCalendar = daysOfWeek.map((d, i) => ({ day: d, taken: i < 5 }))

export default function MedicationReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: 1, medicine: 'Metformin 500mg', dosage: '1 tablet', time: '08:00 AM', taken: true },
    { id: 2, medicine: 'Amlodipine 5mg', dosage: '1 tablet', time: '08:00 AM', taken: true },
    { id: 3, medicine: 'Metformin 500mg', dosage: '1 tablet', time: '08:00 PM', taken: false },
    { id: 4, medicine: 'Vitamin D 60K', dosage: '1 sachet', time: 'Weekly (Sun)', taken: false },
  ])

  function toggleTaken(id: number) {
    const reminder = reminders.find(r => r.id === id)
    if (reminder && !reminder.taken) {
      toast.success(`${reminder.medicine} marked as taken`, { icon: '💊' })
    }
    setReminders(reminders.map(r => r.id === id ? { ...r, taken: !r.taken } : r))
  }

  const adherenceRate = Math.round((reminders.filter(r => r.taken).length / reminders.length) * 100)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Medication Reminders</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track adherence and set reminders</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center gap-2"><Plus className="w-4 h-4" /> Add Reminder</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 text-center">
          <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{adherenceRate}%</p>
          <p className="text-xs text-gray-500">Adherence Today</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 text-center">
          <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">5</p>
          <p className="text-xs text-gray-500">Day Streak</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 text-center">
          <Pill className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{reminders.length}</p>
          <p className="text-xs text-gray-500">Active Reminders</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Weekly Streak Calendar</h3>
        <div className="flex gap-2">
          {adherenceCalendar.map((d, i) => (
            <div key={i} className={`flex-1 p-3 rounded-xl text-center ${d.taken ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
              <p className="text-xs text-gray-500 mb-1">{d.day}</p>
              {d.taken ? <CheckCircle className="w-5 h-5 text-green-500 mx-auto" /> : <div className="w-5 h-5 rounded-full border-2 border-gray-300 mx-auto" />}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Today's Medications</h3>
        <div className="space-y-3">
          {reminders.map(r => (
            <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <button onClick={() => toggleTaken(r.id)} className={`w-6 h-6 rounded-full flex items-center justify-center ${r.taken ? 'bg-green-500' : 'border-2 border-gray-300'}`}>
                  {r.taken && <CheckCircle className="w-4 h-4 text-white" />}
                </button>
                <div>
                  <p className={`font-medium text-sm ${r.taken ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>{r.medicine}</p>
                  <p className="text-xs text-gray-500">{r.dosage}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{r.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
