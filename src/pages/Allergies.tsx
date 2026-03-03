import { useEffect, useState } from 'react'
import { Plus, Shield, X, Trash2, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import type { Database } from '../types/database'

type Allergy = Database['public']['Tables']['allergies']['Row']
type Severity = Allergy['severity']

const severityColors: Record<Severity, string> = {
  mild: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  moderate: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  severe: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  life_threatening: 'bg-red-200 dark:bg-red-900/50 text-red-800 dark:text-red-200',
}

const sampleAllergies: Omit<Allergy, 'id' | 'user_id' | 'created_at'>[] = [
  { allergen: 'Penicillin', reaction: 'Hives, difficulty breathing', severity: 'severe', diagnosed_date: '2015-03-10' },
  { allergen: 'Peanuts', reaction: 'Anaphylaxis, throat swelling', severity: 'life_threatening', diagnosed_date: '2010-06-15' },
  { allergen: 'Latex', reaction: 'Skin rash, itching', severity: 'mild', diagnosed_date: '2018-11-22' },
  { allergen: 'Dust mites', reaction: 'Sneezing, runny nose', severity: 'mild', diagnosed_date: '2020-02-08' },
]

interface AllergyForm {
  allergen: string
  reaction: string
  severity: Severity
  diagnosed_date: string
}

const defaultForm: AllergyForm = {
  allergen: '', reaction: '', severity: 'mild',
  diagnosed_date: new Date().toISOString().split('T')[0],
}

export default function Allergies() {
  const { user } = useAuth()
  const [allergies, setAllergies] = useState<Allergy[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<AllergyForm>(defaultForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => { if (user) loadAllergies() }, [user])

  async function loadAllergies() {
    const { data } = await supabase.from('allergies').select('*').eq('user_id', user!.id).order('severity', { ascending: false })
    setAllergies(data ?? [])
    setLoading(false)
  }

  async function addAllergy() {
    setSaving(true)
    const { error } = await supabase.from('allergies').insert({ ...form, user_id: user!.id, diagnosed_date: form.diagnosed_date || null })
    setSaving(false)
    if (error) { toast.error('Failed to add allergy') }
    else { toast.success('Allergy recorded!'); setShowModal(false); setForm(defaultForm); loadAllergies() }
  }

  async function deleteAllergy(id: string) {
    const { error } = await supabase.from('allergies').delete().eq('id', id)
    if (error) { toast.error('Failed to delete') }
    else { toast.success('Allergy removed'); setAllergies(prev => prev.filter(a => a.id !== id)) }
  }

  const display = allergies.length === 0 ? sampleAllergies as Allergy[] : allergies
  const lifeThreatening = display.filter(a => a.severity === 'life_threatening')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Allergies</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{display.length} allergies recorded</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Add Allergy
        </button>
      </div>

      {lifeThreatening.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <h3 className="font-semibold text-red-900 dark:text-red-100">Life-Threatening Allergies — Carry your EpiPen!</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {lifeThreatening.map((a, idx) => (
              <span key={a.id || idx} className="px-3 py-1 bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 rounded-full text-sm font-medium">{a.allergen}</span>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />)}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {display.map((allergy, idx) => (
            <div key={allergy.id || idx} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{allergy.allergen}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${severityColors[allergy.severity]}`}>
                        {allergy.severity.replace('_', ' ')}
                      </span>
                    </div>
                    {allergy.reaction && <p className="text-sm text-gray-600 dark:text-gray-400">{allergy.reaction}</p>}
                    {allergy.diagnosed_date && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Diagnosed: {new Date(allergy.diagnosed_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>
                {allergy.id && (
                  <button onClick={() => deleteAllergy(allergy.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add Allergy</h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Allergen *</label>
                <input type="text" value={form.allergen} onChange={e => setForm(p => ({ ...p, allergen: e.target.value }))} placeholder="e.g., Penicillin, Peanuts, Latex"
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Reaction</label>
                <input type="text" value={form.reaction} onChange={e => setForm(p => ({ ...p, reaction: e.target.value }))} placeholder="e.g., Hives, difficulty breathing"
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Severity</label>
                  <select value={form.severity} onChange={e => setForm(p => ({ ...p, severity: e.target.value as Severity }))}
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                    <option value="life_threatening">Life-Threatening</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Diagnosed Date</label>
                  <input type="date" value={form.diagnosed_date} onChange={e => setForm(p => ({ ...p, diagnosed_date: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
              <button onClick={addAllergy} disabled={!form.allergen || saving} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors">
                {saving ? 'Saving...' : 'Add Allergy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
