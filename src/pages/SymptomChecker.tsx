import { useState } from 'react'
import { Search, AlertTriangle, Clock, Brain, CheckCircle, Activity } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const bodyParts = [
  { id: 'head', label: 'Head', x: 50, y: 8, w: 14, h: 10 },
  { id: 'throat', label: 'Throat', x: 50, y: 19, w: 8, h: 4 },
  { id: 'chest', label: 'Chest', x: 50, y: 28, w: 22, h: 12 },
  { id: 'left-arm', label: 'Left Arm', x: 28, y: 32, w: 8, h: 20 },
  { id: 'right-arm', label: 'Right Arm', x: 72, y: 32, w: 8, h: 20 },
  { id: 'abdomen', label: 'Abdomen', x: 50, y: 42, w: 18, h: 10 },
  { id: 'back', label: 'Lower Back', x: 50, y: 52, w: 18, h: 8 },
  { id: 'left-leg', label: 'Left Leg', x: 40, y: 68, w: 10, h: 24 },
  { id: 'right-leg', label: 'Right Leg', x: 60, y: 68, w: 10, h: 24 },
]

const conditionDb = [
  { symptoms: ['headache', 'fever', 'body ache', 'head'], condition: 'Flu / Viral Infection', urgency: 'moderate', advice: 'Rest, hydrate, and monitor temperature. See a doctor if fever persists beyond 3 days.' },
  { symptoms: ['chest pain', 'breathlessness', 'sweating', 'chest'], condition: 'Possible Cardiac Event', urgency: 'emergency', advice: 'Seek immediate emergency care. Call ambulance or go to the nearest ER.' },
  { symptoms: ['cough', 'cold', 'sore throat', 'throat'], condition: 'Upper Respiratory Infection', urgency: 'low', advice: 'Rest, warm fluids, and over-the-counter cold medicine. Consult a doctor if symptoms worsen.' },
  { symptoms: ['stomach', 'nausea', 'vomiting', 'abdomen'], condition: 'Gastroenteritis', urgency: 'moderate', advice: 'Stay hydrated with ORS. Avoid solid food temporarily. See a doctor if persistent.' },
  { symptoms: ['rash', 'itching', 'skin'], condition: 'Allergic Reaction / Dermatitis', urgency: 'low', advice: 'Antihistamines may help. Avoid known allergens. Consult a dermatologist if spreading.' },
  { symptoms: ['joint', 'pain', 'swelling', 'left-leg', 'right-leg', 'left-arm', 'right-arm'], condition: 'Arthritis / Joint Inflammation', urgency: 'moderate', advice: 'Rest the affected joint. Anti-inflammatory medication may help. Consult an orthopedic specialist.' },
  { symptoms: ['dizzy', 'faint', 'lightheaded', 'head'], condition: 'Vertigo / Low Blood Pressure', urgency: 'moderate', advice: 'Sit or lie down. Hydrate. Check blood pressure. See a doctor if recurring.' },
  { symptoms: ['anxiety', 'stress', 'sleep', 'insomnia'], condition: 'Anxiety / Sleep Disorder', urgency: 'low', advice: 'Practice relaxation techniques. Maintain sleep hygiene. Consider counseling.' },
  { symptoms: ['back', 'lower back', 'spine'], condition: 'Musculoskeletal Back Pain', urgency: 'low', advice: 'Apply heat/cold packs. Gentle stretching. Consult orthopedic if pain persists beyond a week.' },
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
  const [selectedParts, setSelectedParts] = useState<string[]>([])
  const [severity, setSeverity] = useState(5)

  function togglePart(id: string) {
    setSelectedParts(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])
  }

  function handleCheck() {
    const combinedInput = [input, ...selectedParts].join(' ')
    if (!combinedInput.trim()) return
    const words = combinedInput.toLowerCase().split(/[\s,]+/)
    const matches = conditionDb.filter(c => c.symptoms.some(s => words.some(w => w.includes(s) || s.includes(w))))
    setResults(matches)
    setSearched(true)
  }

  const severityLabel = severity <= 3 ? 'Mild' : severity <= 6 ? 'Moderate' : severity <= 8 ? 'Severe' : 'Very Severe'
  const severityColor = severity <= 3 ? 'text-green-600' : severity <= 6 ? 'text-yellow-600' : severity <= 8 ? 'text-orange-600' : 'text-red-600'

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Symptom Checker</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Tap body areas and describe symptoms to get possible conditions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Body Diagram */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" /> Tap where it hurts
          </h3>
          <div className="relative mx-auto" style={{ width: 200, height: 380 }}>
            {/* SVG human outline */}
            <svg viewBox="0 0 100 95" className="w-full h-full text-gray-300 dark:text-gray-600">
              {/* Head */}
              <ellipse cx="50" cy="10" rx="8" ry="9" fill="none" stroke="currentColor" strokeWidth="1.2" />
              {/* Neck */}
              <line x1="50" y1="19" x2="50" y2="23" stroke="currentColor" strokeWidth="1.2" />
              {/* Torso */}
              <path d="M 35 23 L 35 55 Q 35 58 38 58 L 62 58 Q 65 58 65 55 L 65 23 Q 57 20 50 20 Q 43 20 35 23 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
              {/* Left arm */}
              <path d="M 35 24 L 24 35 L 22 52 L 25 52 L 28 38 L 35 30" fill="none" stroke="currentColor" strokeWidth="1.2" />
              {/* Right arm */}
              <path d="M 65 24 L 76 35 L 78 52 L 75 52 L 72 38 L 65 30" fill="none" stroke="currentColor" strokeWidth="1.2" />
              {/* Left leg */}
              <path d="M 38 58 L 36 75 L 34 92 L 38 92 L 42 75 L 47 58" fill="none" stroke="currentColor" strokeWidth="1.2" />
              {/* Right leg */}
              <path d="M 53 58 L 58 75 L 62 92 L 66 92 L 64 75 L 62 58" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            {/* Clickable zones */}
            {bodyParts.map(part => (
              <button
                key={part.id}
                onClick={() => togglePart(part.id)}
                className={`absolute rounded-full transition-all ${
                  selectedParts.includes(part.id)
                    ? 'bg-red-500/40 border-2 border-red-500 shadow-lg shadow-red-500/20'
                    : 'bg-blue-500/0 hover:bg-blue-500/20 border-2 border-transparent'
                }`}
                style={{
                  left: `${part.x - part.w / 2}%`,
                  top: `${part.y - part.h / 2}%`,
                  width: `${part.w}%`,
                  height: `${part.h}%`,
                }}
                aria-label={`Select ${part.label}`}
                title={part.label}
              />
            ))}
          </div>
          {selectedParts.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedParts.map(id => {
                const part = bodyParts.find(p => p.id === id)
                return (
                  <span key={id} className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-xs font-medium">
                    {part?.label}
                  </span>
                )
              })}
            </div>
          )}
        </div>

        {/* Input section */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-start gap-3 mb-4">
              <Brain className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Describe your symptoms</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Enter symptoms separated by commas</p>
              </div>
            </div>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="e.g., headache, fever, body ache..."
              className="w-full h-28 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Symptom description"
            />

            {/* Severity slider */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Pain Severity</label>
                <span className={`text-sm font-semibold ${severityColor}`}>{severity}/10 - {severityLabel}</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={severity}
                onChange={e => setSeverity(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                aria-label="Pain severity"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>Mild</span>
                <span>Moderate</span>
                <span>Severe</span>
              </div>
            </div>

            <button
              onClick={handleCheck}
              className="mt-4 w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
              aria-label="Check symptoms"
            >
              <Search className="w-4 h-4" /> Analyze Symptoms
            </button>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-yellow-800 dark:text-yellow-300">This is for informational purposes only. Always consult a qualified healthcare professional for medical advice.</p>
          </div>
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {searched && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center"
          >
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p className="text-gray-900 dark:text-white font-medium">No matching conditions found</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Try different terms or consult a doctor for a thorough evaluation.</p>
          </motion.div>
        )}
        {results.map((r, i) => {
          const u = urgencyColors[r.urgency]
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{r.condition}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${u.bg} ${u.text}`}>{u.label}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 leading-relaxed">{r.advice}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>Matched symptoms: {r.symptoms.filter(s => {
                  const words = [input, ...selectedParts].join(' ').toLowerCase().split(/[\s,]+/)
                  return words.some(w => w.includes(s) || s.includes(w))
                }).join(', ')}</span>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>

      <p className="text-center text-xs text-gray-400 dark:text-gray-500">drmhope.com | A Bettroi Product</p>
    </div>
  )
}
