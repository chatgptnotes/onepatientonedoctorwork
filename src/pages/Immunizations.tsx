import { useEffect, useState } from 'react'
import { Plus, Syringe, X, Trash2, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Immunization } from '../types/database'


interface ImmForm {
  vaccine_name: string
  date_administered: string
  dose_number: string
  next_due_date: string
  administered_by: string
  lot_number: string
}

const defaultForm: ImmForm = {
  vaccine_name: '', date_administered: new Date().toISOString().split('T')[0],
  dose_number: '', next_due_date: '', administered_by: '', lot_number: '',
}

const commonVaccines = ['COVID-19 (Covishield)', 'COVID-19 (Covaxin)', 'Influenza', 'Hepatitis B', 'Hepatitis A', 'MMR', 'DPT', 'Typhoid', 'Tetanus', 'HPV', 'Pneumococcal', 'Meningococcal', 'Rabies', 'Yellow Fever', 'Varicella']

const sampleImm: Omit<Immunization, 'id' | 'user_id' | 'created_at'>[] = [
  { vaccine_name: 'COVID-19 (Covishield)', date_administered: '2021-04-15', dose_number: 1, next_due_date: '2021-05-13', administered_by: 'PHC Koramangala', lot_number: 'KL21B04' },
  { vaccine_name: 'COVID-19 (Covishield)', date_administered: '2021-05-14', dose_number: 2, next_due_date: null, administered_by: 'PHC Koramangala', lot_number: 'KL21B05' },
  { vaccine_name: 'COVID-19 Booster', date_administered: '2022-02-20', dose_number: 3, next_due_date: null, administered_by: 'Apollo Clinic', lot_number: 'BY22C02' },
  { vaccine_name: 'Influenza', date_administered: '2025-10-01', dose_number: 1, next_due_date: '2026-10-01', administered_by: 'Max Healthcare', lot_number: 'FL25X01' },
  { vaccine_name: 'Hepatitis B', date_administered: '2000-06-15', dose_number: 3, next_due_date: null, administered_by: 'District Hospital', lot_number: null },
]

export default function Immunizations() {
  const { user } = useAuth()
  const [immunizations, setImmunizations] = useState<Immunization[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<ImmForm>(defaultForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => { if (user) loadImm() }, [user])

  async function loadImm() {
    const { data } = await supabase.from('immunizations').select('*').eq('user_id', user!.id).order('date_administered', { ascending: false })
    setImmunizations(data ?? [])
    setLoading(false)
  }

  async function addImm() {
    setSaving(true)
    const { error } = await supabase.from('immunizations').insert({
      vaccine_name: form.vaccine_name,
      date_administered: form.date_administered,
      dose_number: form.dose_number ? parseInt(form.dose_number) : null,
      next_due_date: form.next_due_date || null,
      administered_by: form.administered_by || null,
      lot_number: form.lot_number || null,
      user_id: user!.id,
    })
    setSaving(false)
    if (error) { toast.error('Failed to add record') }
    else { toast.success('Vaccination recorded!'); setShowModal(false); setForm(defaultForm); loadImm() }
  }

  async function deleteImm(id: string) {
    const { error } = await supabase.from('immunizations').delete().eq('id', id)
    if (error) { toast.error('Failed to delete') }
    else { toast.success('Record removed'); setImmunizations(prev => prev.filter(i => i.id !== id)) }
  }

  const display = immunizations.length === 0 ? sampleImm as Immunization[] : immunizations
  const today = new Date()
  const dueSoon = display.filter(i => i.next_due_date && new Date(i.next_due_date) > today && new Date(i.next_due_date) < new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Immunization History</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{display.length} vaccinations recorded</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Add Vaccination
        </button>
      </div>

      {dueSoon.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="font-medium text-gray-900 dark:text-white">Upcoming Due Dates</h3>
          </div>
          {dueSoon.map((imm, idx) => (
            <p key={imm.id || idx} className="text-sm text-gray-700 dark:text-gray-300">
              <strong>{imm.vaccine_name}</strong> — Due {new Date(imm.next_due_date!).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          ))}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />)}</div>
      ) : (
        <div className="space-y-4">
          {display.map((imm, idx) => (
            <div key={imm.id || idx} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Syringe className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{imm.vaccine_name}</h3>
                      {imm.dose_number && (
                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                          Dose {imm.dose_number}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Administered: {new Date(imm.date_administered).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {imm.administered_by && <span>{imm.administered_by}</span>}
                      {imm.lot_number && <span>Lot: {imm.lot_number}</span>}
                      {imm.next_due_date && (
                        <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                          <AlertCircle className="w-3 h-3" />
                          Next due: {new Date(imm.next_due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      )}
                      {!imm.next_due_date && (
                        <span className="flex items-center gap-1 text-green-500">
                          <CheckCircle className="w-3 h-3" /> Series complete
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {imm.id && (
                  <button onClick={() => deleteImm(imm.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0">
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
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Record Vaccination</h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Vaccine Name *</label>
                  <input type="text" list="vaccines" value={form.vaccine_name} onChange={e => setForm(p => ({ ...p, vaccine_name: e.target.value }))} placeholder="e.g., Influenza"
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <datalist id="vaccines">{commonVaccines.map(v => <option key={v} value={v} />)}</datalist>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Date Administered *</label>
                  <input type="date" value={form.date_administered} onChange={e => setForm(p => ({ ...p, date_administered: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Dose Number</label>
                  <input type="number" min={1} value={form.dose_number} onChange={e => setForm(p => ({ ...p, dose_number: e.target.value }))} placeholder="1" className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Next Due Date</label>
                  <input type="date" value={form.next_due_date} onChange={e => setForm(p => ({ ...p, next_due_date: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Lot Number</label>
                  <input type="text" value={form.lot_number} onChange={e => setForm(p => ({ ...p, lot_number: e.target.value }))} placeholder="Optional" className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Administered By</label>
                  <input type="text" value={form.administered_by} onChange={e => setForm(p => ({ ...p, administered_by: e.target.value }))} placeholder="Hospital / PHC name" className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
              <button onClick={addImm} disabled={!form.vaccine_name || !form.date_administered || saving} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors">
                {saving ? 'Saving...' : 'Record Vaccination'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
