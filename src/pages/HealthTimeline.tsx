import { Calendar, Pill, Syringe, FileText, Heart, AlertCircle, Activity, CheckCircle } from 'lucide-react'

const events = [
  { date: '2026-03-01', type: 'medication', title: 'Started Metformin 500mg', desc: 'Prescribed by Dr. Shah for blood sugar management', icon: <Pill className="w-4 h-4" />, color: 'blue' },
  { date: '2026-02-20', type: 'lab', title: 'Blood Test - CBC, HbA1c', desc: 'HbA1c: 6.8%, within target range', icon: <FileText className="w-4 h-4" />, color: 'purple' },
  { date: '2026-02-15', type: 'surgery', title: 'Knee Arthroscopy', desc: 'Minor procedure at Hope Hospital. Recovery on track.', icon: <Heart className="w-4 h-4" />, color: 'red' },
  { date: '2026-02-10', type: 'appointment', title: 'Orthopedic Consultation', desc: 'Dr. Murali recommended arthroscopy for meniscus tear', icon: <Calendar className="w-4 h-4" />, color: 'green' },
  { date: '2026-01-25', type: 'vaccination', title: 'Flu Vaccine 2026', desc: 'Annual influenza vaccination at City Clinic', icon: <Syringe className="w-4 h-4" />, color: 'yellow' },
  { date: '2026-01-15', type: 'vitals', title: 'BP Spike: 150/95', desc: 'Stress-related. Advised lifestyle changes and monitoring.', icon: <Activity className="w-4 h-4" />, color: 'red' },
  { date: '2026-01-05', type: 'allergy', title: 'Allergic Reaction to Sulfa', desc: 'Rash and hives. Sulfa drugs added to allergy list.', icon: <AlertCircle className="w-4 h-4" />, color: 'orange' },
  { date: '2025-12-20', type: 'checkup', title: 'Annual Health Checkup', desc: 'All parameters normal except slightly elevated cholesterol', icon: <CheckCircle className="w-4 h-4" />, color: 'green' },
]

const colorMap: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
  green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
  yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
  orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800',
}

export default function HealthTimeline() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Health Timeline</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Visual timeline of all your health events</p>
      </div>
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800" />
        <div className="space-y-6">
          {events.map((e, i) => (
            <div key={i} className="relative flex gap-4 pl-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 z-10 border ${colorMap[e.color]}`}>{e.icon}</div>
              <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{e.title}</h3>
                  <span className="text-xs text-gray-500">{e.date}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
