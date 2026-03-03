import { useState, useRef, useEffect } from 'react'
import { Search, X, FileText, Pill, Calendar, Shield, Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const searchablePages = [
  { label: 'Dashboard', path: '/dashboard', icon: Heart, keywords: ['home', 'overview', 'health score'] },
  { label: 'Health Records', path: '/health-records', icon: FileText, keywords: ['records', 'reports', 'documents', 'lab'] },
  { label: 'Medications', path: '/medications', icon: Pill, keywords: ['medicine', 'drugs', 'prescription', 'pills'] },
  { label: 'Appointments', path: '/appointments', icon: Calendar, keywords: ['doctor', 'visit', 'schedule', 'booking'] },
  { label: 'Allergies', path: '/allergies', icon: Shield, keywords: ['allergy', 'reaction', 'sensitivity'] },
  { label: 'Immunizations', path: '/immunizations', icon: Shield, keywords: ['vaccine', 'vaccination', 'immunize'] },
  { label: 'Digital Twin', path: '/digital-twin', icon: Heart, keywords: ['twin', 'vitals', 'ai', 'model'] },
  { label: 'Symptom Checker', path: '/symptom-checker', icon: Search, keywords: ['symptoms', 'check', 'diagnosis'] },
  { label: 'Emergency Card', path: '/emergency-card', icon: Shield, keywords: ['emergency', 'sos', 'card', 'id'] },
  { label: 'Share with Doctor', path: '/share-with-doctor', icon: FileText, keywords: ['share', 'doctor', 'qr'] },
  { label: 'Fitness Log', path: '/fitness', icon: Heart, keywords: ['exercise', 'workout', 'gym', 'fitness'] },
  { label: 'Nutrition Tracker', path: '/nutrition', icon: Heart, keywords: ['food', 'diet', 'calories', 'meal'] },
  { label: 'Profile', path: '/profile', icon: Heart, keywords: ['profile', 'account', 'abha', 'settings'] },
  { label: 'Lab Results', path: '/lab-results', icon: FileText, keywords: ['lab', 'test', 'results', 'blood'] },
  { label: 'Vitals Logger', path: '/vitals', icon: Heart, keywords: ['vitals', 'bp', 'heart rate', 'spo2'] },
  { label: 'Water Intake', path: '/water-intake', icon: Heart, keywords: ['water', 'hydration', 'drink'] },
  { label: 'Preventive Care', path: '/preventive-care', icon: Shield, keywords: ['preventive', 'screening', 'checkup'] },
  { label: 'Family Health', path: '/family-health', icon: Heart, keywords: ['family', 'members', 'dependents'] },
  { label: 'Insurance', path: '/insurance', icon: Shield, keywords: ['insurance', 'policy', 'claim', 'coverage'] },
  { label: 'Medical Bills', path: '/bills', icon: FileText, keywords: ['bills', 'payments', 'expenses'] },
  { label: 'Settings', path: '/settings', icon: Heart, keywords: ['settings', 'preferences', 'theme'] },
]

export default function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const results = query.trim()
    ? searchablePages.filter(p =>
        p.label.toLowerCase().includes(query.toLowerCase()) ||
        p.keywords.some(k => k.includes(query.toLowerCase()))
      ).slice(0, 8)
    : []

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  function go(path: string) {
    navigate(path)
    setOpen(false)
    setQuery('')
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
        aria-label="Search"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden sm:inline text-xs bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">Ctrl+K</kbd>
      </button>
    )
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setOpen(false)} />
      <div className="fixed top-[10%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50 px-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search records, pages, medications..."
              className="flex-1 bg-transparent text-gray-900 dark:text-white outline-none text-sm"
              aria-label="Global search"
            />
            <button onClick={() => setOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          {results.length > 0 && (
            <div className="max-h-80 overflow-y-auto py-2">
              {results.map(r => (
                <button
                  key={r.path}
                  onClick={() => go(r.path)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                >
                  <r.icon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-900 dark:text-white">{r.label}</span>
                </button>
              ))}
            </div>
          )}
          {query && results.length === 0 && (
            <div className="py-8 text-center text-sm text-gray-500">No results found</div>
          )}
        </div>
      </div>
    </>
  )
}
