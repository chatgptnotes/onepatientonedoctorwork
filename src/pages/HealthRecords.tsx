import { useEffect, useState } from 'react'
import { Plus, FileText, Search, Filter, Trash2, X, Calendar, Building2, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import type { Database } from '../types/database'

type HealthRecord = Database['public']['Tables']['health_records']['Row']
type RecordType = Database['public']['Tables']['health_records']['Row']['record_type']

const recordTypes: RecordType[] = ['diagnosis', 'lab_report', 'prescription', 'imaging', 'surgery', 'other']

const typeColors: Record<RecordType, string> = {
  diagnosis: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  lab_report: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  prescription: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  imaging: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  surgery: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  other: 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300',
}

const typeLabels: Record<RecordType, string> = {
  diagnosis: 'Diagnosis', lab_report: 'Lab Report', prescription: 'Prescription',
  imaging: 'Imaging', surgery: 'Surgery', other: 'Other',
}

const sampleRecords: Omit<HealthRecord, 'id' | 'user_id' | 'created_at' | 'fhir_resource' | 'file_url'>[] = [
  { record_type: 'diagnosis', title: 'Type 2 Diabetes Mellitus', description: 'HbA1c: 7.2%. Managed with metformin and lifestyle changes.', doctor_name: 'Dr. R. Sharma', hospital_name: 'Apollo Hospitals', date: '2024-08-15' },
  { record_type: 'lab_report', title: 'Complete Blood Count (CBC)', description: 'All values within normal range. Hemoglobin: 14.2 g/dL.', doctor_name: 'Dr. P. Mehta', hospital_name: 'SRL Diagnostics', date: '2025-01-10' },
  { record_type: 'prescription', title: 'Metformin 500mg', description: 'Take 1 tablet twice daily with meals. 3 months supply.', doctor_name: 'Dr. R. Sharma', hospital_name: 'Apollo Hospitals', date: '2025-01-15' },
  { record_type: 'imaging', title: 'Chest X-Ray', description: 'No active consolidation. Cardiac size normal.', doctor_name: 'Dr. K. Patel', hospital_name: 'Fortis Healthcare', date: '2024-11-20' },
]

interface RecordFormData {
  record_type: RecordType
  title: string
  description: string
  doctor_name: string
  hospital_name: string
  date: string
}

const defaultForm: RecordFormData = {
  record_type: 'diagnosis',
  title: '', description: '', doctor_name: '', hospital_name: '',
  date: new Date().toISOString().split('T')[0],
}

export default function HealthRecords() {
  const { user } = useAuth()
  const [records, setRecords] = useState<HealthRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<RecordFormData>(defaultForm)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<RecordType | 'all'>('all')

  useEffect(() => {
    if (user) loadRecords()
  }, [user])

  async function loadRecords() {
    const { data } = await supabase
      .from('health_records')
      .select('*')
      .eq('user_id', user!.id)
      .order('date', { ascending: false })

    setRecords(data ?? [])
    setLoading(false)
  }

  async function addRecord() {
    setSaving(true)
    const { error } = await supabase.from('health_records').insert({
      ...form,
      user_id: user!.id,
    })
    setSaving(false)

    if (error) {
      toast.error('Failed to add health record')
    } else {
      toast.success('Health record added!')
      setShowModal(false)
      setForm(defaultForm)
      loadRecords()
    }
  }

  async function deleteRecord(id: string) {
    const { error } = await supabase.from('health_records').delete().eq('id', id)
    if (error) {
      toast.error('Failed to delete record')
    } else {
      toast.success('Record deleted')
      setRecords(prev => prev.filter(r => r.id !== id))
    }
  }

  const filtered = records.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      (r.doctor_name ?? '').toLowerCase().includes(search.toLowerCase())
    const matchType = filterType === 'all' || r.record_type === filterType
    return matchSearch && matchType
  })

  const displayRecords = filtered.length === 0 && records.length === 0 ? sampleRecords as HealthRecord[] : filtered

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Health Records</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Your complete medical history in one place</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Record
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search records..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value as RecordType | 'all')}
            className="pl-9 pr-8 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
          >
            <option value="all">All Types</option>
            {recordTypes.map(t => (
              <option key={t} value={t}>{typeLabels[t]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Records */}
      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : displayRecords.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">No records found</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayRecords.map((record, idx) => (
            <div
              key={record.id || idx}
              className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[record.record_type]}`}>
                      {typeLabels[record.record_type]}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {new Date(record.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{record.title}</h3>
                  {record.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{record.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 mt-3">
                    {record.doctor_name && (
                      <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <User className="w-3 h-3" /> {record.doctor_name}
                      </span>
                    )}
                    {record.hospital_name && (
                      <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <Building2 className="w-3 h-3" /> {record.hospital_name}
                      </span>
                    )}
                  </div>
                </div>
                {record.id && (
                  <button
                    onClick={() => deleteRecord(record.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add Health Record</h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Record Type</label>
                  <select
                    value={form.record_type}
                    onChange={e => setForm(prev => ({ ...prev, record_type: e.target.value as RecordType }))}
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {recordTypes.map(t => <option key={t} value={t}>{typeLabels[t]}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Annual Blood Work"
                    required
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Doctor</label>
                  <input
                    type="text"
                    value={form.doctor_name}
                    onChange={e => setForm(prev => ({ ...prev, doctor_name: e.target.value }))}
                    placeholder="Dr. Name"
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Date *</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
                    required
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Hospital / Facility</label>
                  <input
                    type="text"
                    value={form.hospital_name}
                    onChange={e => setForm(prev => ({ ...prev, hospital_name: e.target.value }))}
                    placeholder="Apollo Hospitals, Mumbai"
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    placeholder="Details, findings, notes..."
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Cancel
              </button>
              <button
                onClick={addRecord}
                disabled={!form.title || !form.date || saving}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors"
              >
                {saving ? 'Saving...' : 'Add Record'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
