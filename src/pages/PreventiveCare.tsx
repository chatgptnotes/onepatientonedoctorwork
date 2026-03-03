import { ShieldCheck, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react'

const screenings = [
  { name: 'Blood Pressure Check', due: 'Monthly', lastDone: '2026-03-01', status: 'done', ageGroup: 'All adults' },
  { name: 'HbA1c / Diabetes', due: 'Every 3 months', lastDone: '2026-02-20', status: 'done', ageGroup: '40+' },
  { name: 'Lipid Profile', due: 'Yearly', lastDone: '2025-12-20', status: 'done', ageGroup: '35+' },
  { name: 'Eye Examination', due: 'Yearly', lastDone: '2025-06-15', status: 'overdue', ageGroup: '40+' },
  { name: 'Colonoscopy', due: 'Every 5 years', lastDone: 'Never', status: 'due', ageGroup: '45+' },
  { name: 'Prostate Screening (PSA)', due: 'Yearly', lastDone: 'Never', status: 'due', ageGroup: 'Men 50+' },
  { name: 'Bone Density (DEXA)', due: 'Every 2 years', lastDone: 'Never', status: 'upcoming', ageGroup: '50+' },
  { name: 'Dental Checkup', due: 'Every 6 months', lastDone: '2025-09-10', status: 'overdue', ageGroup: 'All adults' },
]

const vaccinations = [
  { name: 'Influenza (Flu)', schedule: 'Annually', lastDone: '2026-01-25', nextDue: '2027-01' },
  { name: 'Tdap Booster', schedule: 'Every 10 years', lastDone: '2020-03-15', nextDue: '2030-03' },
  { name: 'Pneumococcal (PCV)', schedule: 'Once after 65', lastDone: 'Not yet', nextDue: 'When eligible' },
  { name: 'Shingles (Zoster)', schedule: 'After 50', lastDone: 'Not yet', nextDue: 'Recommended now' },
]

const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  done: { icon: <CheckCircle className="w-4 h-4" />, color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400', label: 'Up to date' },
  overdue: { icon: <AlertCircle className="w-4 h-4" />, color: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400', label: 'Overdue' },
  due: { icon: <Clock className="w-4 h-4" />, color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400', label: 'Due now' },
  upcoming: { icon: <Calendar className="w-4 h-4" />, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400', label: 'Upcoming' },
}

export default function PreventiveCare() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Preventive Care</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Age and gender based screenings and vaccination schedule</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {Object.entries(statusConfig).map(([key, v]) => (
          <div key={key} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{screenings.filter(s => s.status === key).length}</p>
            <p className="text-xs text-gray-500 mt-1">{v.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-blue-500" /> Recommended Screenings</h3>
        <div className="space-y-3">
          {screenings.map((s, i) => {
            const st = statusConfig[s.status]
            return (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{s.name}</p>
                  <p className="text-xs text-gray-500">Frequency: {s.due} | For: {s.ageGroup} | Last: {s.lastDone}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${st.color}`}>{st.icon}{st.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-purple-500" /> Vaccination Schedule</h3>
        <div className="space-y-3">
          {vaccinations.map((v, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">{v.name}</p>
                <p className="text-xs text-gray-500">{v.schedule} | Last: {v.lastDone}</p>
              </div>
              <span className="text-xs text-gray-500">Next: {v.nextDue}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
