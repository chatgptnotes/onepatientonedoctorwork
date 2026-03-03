import { useEffect, useState } from 'react'
import { Plus, Pill, Search, Trash2, X, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Medication } from '../types/database'


interface MedForm {
  name: string
  dosage: string
  frequency: string
  start_date: string
  end_date: string
  prescribed_by: string
  notes: string
}

const defaultForm: MedForm = {
  name: '', dosage: '', frequency: 'Once daily',
  start_date: new Date().toISOString().split('T')[0],
  end_date: '', prescribed_by: '', notes: '',
}

const frequencies = ['Once daily', 'Twice daily', 'Three times daily', 'Four times daily', 'Every 8 hours', 'Every 12 hours', 'Weekly', 'As needed']

const sampleMeds: Omit<Medication, 'id' | 'user_id' | 'created_at'>[] = [
  { name: 'Metformin 500mg', dosage: '500mg', frequency: 'Twice daily', start_date: '2024-08-15', end_date: null, prescribed_by: 'Dr. R. Sharma', is_active: true, notes: 'Take with food' },
  { name: 'Amlodipine 5mg', dosage: '5mg', frequency: 'Once daily', start_date: '2024-06-01', end_date: null, prescribed_by: 'Dr. K. Patel', is_active: true, notes: 'Take in the morning' },
  { name: 'Vitamin D3', dosage: '60,000 IU', frequency: 'Weekly', start_date: '2025-01-01', end_date: '2025-06-30', prescribed_by: 'Dr. P. Mehta', is_active: false, notes: 'Course completed' },
]

export default function Medications() {
  const { user } = useAuth()
  const [medications, setMedications] = useState<Medication[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<MedForm>(defaultForm)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [showInactive, setShowInactive] = useState(false)

  useEffect(() => { if (user) loadMeds() }, [user])

  async function loadMeds() {
    const { data } = await supabase.from('medications').select('*').eq('user_id', user!.id).order('is_active', { ascending: false }).order('created_at', { ascending: false })
    setMedications(data ?? [])
    setLoading(false)
  }

  async function addMed() {
    setSaving(true)
    const { error } = await supabase.from('medications').insert({
      ...form,
      user_id: user!.id,
      is_active: true,
      end_date: form.end_date || null,
    })
    setSaving(false)
    if (error) { toast.error('Failed to add medication') }
    else { toast.success('Medication added!'); setShowModal(false); setForm(defaultForm); loadMeds() }
  }

  async function toggleActive(id: string, current: boolean) {
    const { error } = await supabase.from('medications').update({ is_active: !current }).eq('id', id)
    if (error) { toast.error('Failed to update') }
    else { toast.success(current ? 'Medication stopped' : 'Medication restarted'); loadMeds() }
  }

  async function deleteMed(id: string) {
    const { error } = await supabase.from('medications').delete().eq('id', id)
    if (error) { toast.error('Failed to delete') }
    else { toast.success('Medication removed'); setMedications(prev => prev.filter(m => m.id !== id)) }
  }

  const display = medications.length === 0 ? sampleMeds as Medication[] : medications
  const filtered = display.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase())
    const matchActive = showInactive ? true : m.is_active
    return matchSearch && matchActive
  })

  const activeMeds = display.filter(m => m.is_active)
  const inactiveMeds = display.filter(m => !m.is_active)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Medications</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{activeMeds.length} active · {inactiveMeds.length} past</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Add Medication
        </button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search medications..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
        </div>
        <button onClick={() => setShowInactive(!showInactive)} className={`px-4 py-2.5 rounded-xl text-sm border transition-colors ${showInactive ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
          Show Past
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16"><Pill className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" /><p className="text-gray-600 dark:text-gray-400">No medications found</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((med, idx) => (
            <div key={med.id || idx} className={`bg-white dark:bg-gray-900 rounded-2xl p-5 border transition-shadow hover:shadow-md ${med.is_active ? 'border-gray-200 dark:border-gray-800' : 'border-gray-100 dark:border-gray-900 opacity-70'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${med.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{med.is_active ? 'Active' : 'Stopped'}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{med.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{med.dosage} · {med.frequency}</p>
                  {med.prescribed_by && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">By {med.prescribed_by}</p>}
                  <div className="flex gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>From: {new Date(med.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}</span>
                    {med.end_date && <span>To: {new Date(med.end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}</span>}
                  </div>
                  {med.notes && <p className="text-xs italic text-gray-400 dark:text-gray-500 mt-1">{med.notes}</p>}
                </div>
                {med.id && (
                  <div className="flex flex-col gap-1">
                    <button onClick={() => toggleActive(med.id, med.is_active)} className={`p-1.5 rounded-lg transition-colors ${med.is_active ? 'text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20' : 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'}`}>
                      {med.is_active ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    </button>
                    <button onClick={() => deleteMed(med.id)} className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add Medication</h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Medicine Name *</label>
                  <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g., Metformin 500mg" className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Dosage *</label>
                  <input type="text" value={form.dosage} onChange={e => setForm(p => ({ ...p, dosage: e.target.value }))} placeholder="500mg" className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Frequency</label>
                  <select value={form.frequency} onChange={e => setForm(p => ({ ...p, frequency: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {frequencies.map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Start Date</label>
                  <input type="date" value={form.start_date} onChange={e => setForm(p => ({ ...p, start_date: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">End Date</label>
                  <input type="date" value={form.end_date} onChange={e => setForm(p => ({ ...p, end_date: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Prescribed By</label>
                  <input type="text" value={form.prescribed_by} onChange={e => setForm(p => ({ ...p, prescribed_by: e.target.value }))} placeholder="Dr. Name" className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Notes</label>
                  <input type="text" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Take with food, etc." className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
              <button onClick={addMed} disabled={!form.name || !form.dosage || saving} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors">
                {saving ? 'Adding...' : 'Add Medication'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
