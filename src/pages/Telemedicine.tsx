import { useState } from 'react'
import { Video, Phone, MessageSquare, Calendar, Clock, User } from 'lucide-react'

const upcomingCalls = [
  { id: 1, doctor: 'Dr. R. Shah', specialty: 'Cardiologist', date: '2026-03-05', time: '10:00 AM', status: 'Scheduled' },
  { id: 2, doctor: 'Dr. M. Gupta', specialty: 'Endocrinologist', date: '2026-03-08', time: '02:30 PM', status: 'Scheduled' },
]

const pastCalls = [
  { id: 3, doctor: 'Dr. S. Patel', specialty: 'Dermatologist', date: '2026-02-25', time: '11:00 AM', duration: '15 min', notes: 'Follow-up on skin treatment. Prescribed new topical cream. Review in 2 weeks.' },
  { id: 4, doctor: 'Dr. R. Shah', specialty: 'Cardiologist', date: '2026-02-10', time: '09:30 AM', duration: '20 min', notes: 'BP review. Current medication working well. Continue Amlodipine 5mg.' },
]

export default function Telemedicine() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Telemedicine</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Video consultations with your doctors</p>
      </div>

      <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Video className="w-8 h-8" />
          <div>
            <p className="font-bold text-lg">Next Consultation</p>
            <p className="text-blue-100">Dr. R. Shah - Cardiologist</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-blue-100">
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Mar 5, 2026</span>
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 10:00 AM</span>
        </div>
        <button className="mt-4 px-5 py-2.5 bg-white text-blue-600 rounded-xl font-medium hover:bg-blue-50 flex items-center gap-2">
          <Video className="w-4 h-4" /> Join Video Call
        </button>
      </div>

      <div className="flex gap-2">
        {(['upcoming', 'past'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
            {tab === 'upcoming' ? 'Upcoming' : 'Past Consultations'}
          </button>
        ))}
      </div>

      {activeTab === 'upcoming' && (
        <div className="space-y-3">
          {upcomingCalls.map(c => (
            <div key={c.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center"><User className="w-5 h-5 text-blue-600" /></div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{c.doctor}</p>
                  <p className="text-xs text-gray-500">{c.specialty} - {c.date} at {c.time}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-xl hover:bg-green-200"><Video className="w-4 h-4" /></button>
                <button className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl hover:bg-blue-200"><MessageSquare className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'past' && (
        <div className="space-y-3">
          {pastCalls.map(c => (
            <div key={c.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center"><User className="w-5 h-5 text-gray-500" /></div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{c.doctor}</p>
                    <p className="text-xs text-gray-500">{c.date} - {c.duration}</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <p className="text-xs text-gray-500 mb-1">Consultation Notes</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{c.notes}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
