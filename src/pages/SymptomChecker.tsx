import { useState } from 'react'
import { Search, AlertTriangle, Clock, Brain, CheckCircle } from 'lucide-react'

const conditionDb = [
  { symptoms: ['headache', 'fever', 'body ache'], condition: 'Flu / Viral Infection', urgency: 'moderate', advice: 'Rest, hydrate, and monitor temperature. See a doctor if fever persists beyond 3 days.' },
  { symptoms: ['chest pain', 'breathlessness', 'sweating'], condition: 'Possible Cardiac Event', urgency: 'emergency', advice: 'Seek immediate emergency care. Call ambulance or go to nearest ER.' },
  { symptoms: ['cough', 'cold', 'sore throat'], condition: 'Upper Respiratory Infection', urgency: 'low', advice: 'Rest, warm fluids, and OTC cold medicine. Consult doctor if symptoms worsen.' },
  { symptoms: ['stomach', 'nausea', 'vomiting'], condition: 'Gastroenteritis', urgency: 'moderate', advice: 'Stay hydrated with ORS. Avoid solid food temporarily. See doctor if persistent.' },
  { symptoms: ['rash', 'itching', 'skin'], condition: 'Allergic Reaction / Dermatitis', urgency: 'low', advice: 'Antihistamines may help. Avoid known allergens. Consult dermatologist if spreading.' },
  { symptoms: ['joint', 'pain', 'swelling'], condition: 'Arthritis / Joint Inflammation', urgency: 'moderate', advice: 'Rest the affected joint. Anti-inflammatory medication may help. Consult orthopedic specialist.' },
  { symptoms: ['dizzy', 'faint', 'lightheaded'], condition: 'Vertigo / Low Blood Pressure', urgency: 'moderate', advice: 'Sit or lie down. Hydrate. Check blood pressure. See doctor if recurring.' },
  { symptoms: ['anxiety', 'stress', 'sleep', 'insomnia'], condition: 'Anxiety / Sleep Disorder', urgency: 'low', advice: 'Practice relaxation techniques. Maintain sleep hygiene. Consider counseling.' },
]

const urgencyColors: Record<string, { bg: string; text: string; label: string }> = {
  low: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Low Urgency' },
  moderate: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', label: 'Moderate' },
  emergency: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', label: 'Emergency' },
}

export default function SymptomChecker() {
  const [input, setInput] = useState('')
  const [results, setResults] = useState<typeof conditionDb>([])
  const [searched, setSearched] = useState(false)

  function handleCheck() {
    if (!input.trim()) return
    const words = input.toLowerCase().split(/[\s,]+/)
    const matches = conditionDb.filter(c => c.symptoms.some(s => words.some(w => w.includes(s) || s.includes(w))))
    setResults(matches)
    setSearched(true)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Symptom Checker</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Describe your symptoms to get possible conditions and urgency level</p>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-start gap-3 mb-4">
          <Brain className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Describe your symptoms</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Enter symptoms separated by commas</p>
          </div>
        </div>
        <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="e.g., headache, fever, body ache..." className="w-full h-32 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        <button onClick={handleCheck} className="mt-3 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center gap-2 transition-colors">
          <Search className="w-4 h-4" /> Check Symptoms
        </button>
      </div>
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-yellow-800 dark:text-yellow-300">For informational purposes only. Always consult a qualified healthcare professional.</p>
      </div>
      {searched && results.length === 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center">
          <CheckCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No matching conditions found. Try different terms or consult a doctor.</p>
        </div>
      )}
      {results.map((r, i) => {
        const u = urgencyColors[r.urgency]
        return (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{r.condition}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${u.bg} ${u.text}`}>{u.label}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{r.advice}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Matched: {r.symptoms.join(', ')}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
