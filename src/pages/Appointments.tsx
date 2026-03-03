import { useEffect, useState } from 'react'
import { Plus, Calendar, Clock, User, Building2, Video, X, Trash2, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import type { Database } from '../types/database'

type Appointment = Database['public']['Tables']['appointments']['Row']
type AppStatus = Appointment['status']

const statusColors: Record<AppStatus, string> = {
  scheduled: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  completed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  no_show: 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300',
}

const sampleAppts: Omit<Appointment, 'id' | 'user_id' | 'created_at'>[] = [
  { doctor_name: 'Dr. Rajesh Sharma', specialty: 'Endocrinologist', hospital_name: 'Apollo Hospitals', appointment_date: '2026-03-15', appointment_time: '10:30', status: 'scheduled', notes: 'Routine diabetes check-up', is_teleconsult: false },
  { doctor_name: 'Dr. Priya Menon', specialty: 'General Physician', hospital_name: 'Max Healthcare', appointment_date: '2026-03-22', appointment_time: '14:00', status: 'scheduled', notes: 'Follow-up on BP medication', is_teleconsult: true },
  { doctor_name: 'Dr. Arun Kumar', specialty: 'Cardiologist', hospital_name: 'Fortis Hospitals', appointment_date: '2026-02-20', appointment_time: '09:00', status: 'completed', notes: 'Annual cardiac review', is_teleconsult: false },
]

interface AppFormData {
  doctor_name: string
  specialty: string
  hospital_name: string
  appointment_date: string
  appointment_time: string
  notes: string
  is_teleconsult: boolean
}

const defaultForm: AppFormData = {
  doctor_name: '', specialty: '', hospital_name: '',
  appointment_date: new Date().toISOString().split('T')[0],
  appointment_time: '10:00', notes: '', is_teleconsult: false,
}

export default function Appointments() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<AppFormData>(defaultForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) loadAppointments()
  }, [user])

  async function loadAppointments() {
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', user!.id)
      .order('appointment_date', { ascending: true })

    setAppointments(data ?? [])
    setLoading(false)
  }

  async function addAppointment() {
    setSaving(true)
    const { error } = await supabase.from('appointments').insert({
      ...form,
      user_id: user!.id,
      status: 'scheduled',
    })
    setSaving(false)

    if (error) { toast.error('Failed to add appointment') }
    else { toast.success('Appointment scheduled!'); setShowModal(false); setForm(defaultForm); loadAppointments() }
  }

  async function updateStatus(id: string, status: AppStatus) {
    const { error } = await supabase.from('appointments').update({ status }).eq('id', id)
    if (error) { toast.error('Failed to update status') }
    else { toast.success(`Appointment ${status}`); loadAppointments() }
  }

  async function deleteAppointment(id: string) {
    const { error } = await supabase.from('appointments').delete().eq('id', id)
    if (error) { toast.error('Failed to delete') }
    else { toast.success('Appointment removed'); setAppointments(prev => prev.filter(a => a.id !== id)) }
  }

  const display = appointments.length === 0 ? sampleAppts as Appointment[] : appointments
  const upcoming = display.filter(a => a.status === 'scheduled')
  const past = display.filter(a => a.status !== 'scheduled')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Appointments</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Manage your doctor visits and teleconsults</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Schedule Appointment
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-28 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />)}</div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Upcoming ({upcoming.length})</h2>
              <div className="space-y-4">
                {upcoming.map((appt, idx) => (
                  <AppointmentCard key={appt.id || idx} appt={appt} onStatus={updateStatus} onDelete={deleteAppointment} />
                ))}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 mt-6">Past</h2>
              <div className="space-y-4">
                {past.map((appt, idx) => (
                  <AppointmentCard key={appt.id || idx} appt={appt} onStatus={updateStatus} onDelete={deleteAppointment} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Schedule Appointment</h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Doctor Name *', key: 'doctor_name', type: 'text', placeholder: 'Dr. Name', span: 2 },
                  { label: 'Specialty', key: 'specialty', type: 'text', placeholder: 'Cardiology', span: 1 },
                  { label: 'Hospital', key: 'hospital_name', type: 'text', placeholder: 'Hospital name', span: 1 },
                  { label: 'Date *', key: 'appointment_date', type: 'date', placeholder: '', span: 1 },
                  { label: 'Time *', key: 'appointment_time', type: 'time', placeholder: '', span: 1 },
                ].map(field => (
                  <div key={field.key} className={`col-span-${field.span}`}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{field.label}</label>
                    <input
                      type={field.type}
                      value={(form as Record<string, string>)[field.key]}
                      onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={2}
                    placeholder="Reason for visit..."
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
                <div className="col-span-2 flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="teleconsult"
                    checked={form.is_teleconsult}
                    onChange={e => setForm(prev => ({ ...prev, is_teleconsult: e.target.checked }))}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <label htmlFor="teleconsult" className="text-sm text-gray-700 dark:text-gray-300">This is a teleconsultation (video call)</label>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
              <button onClick={addAppointment} disabled={!form.doctor_name || !form.appointment_date || saving} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors">
                {saving ? 'Scheduling...' : 'Schedule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function AppointmentCard({ appt, onStatus, onDelete }: {
  appt: Appointment
  onStatus: (id: string, status: AppStatus) => void
  onDelete: (id: string) => void
}) {
  const date = new Date(`${appt.appointment_date}T${appt.appointment_time}`)
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[appt.status]}`}>
              {appt.status.replace('_', ' ')}
            </span>
            {appt.is_teleconsult && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-full text-xs font-medium">
                <Video className="w-3 h-3" /> Teleconsult
              </span>
            )}
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" /> {appt.doctor_name}
          </h3>
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
            {appt.specialty && <span>{appt.specialty}</span>}
            {appt.hospital_name && <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{appt.hospital_name}</span>}
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{appt.appointment_time}</span>
          </div>
          {appt.notes && <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{appt.notes}</p>}
        </div>
        {appt.id && appt.status === 'scheduled' && (
          <div className="flex flex-col gap-1">
            <button onClick={() => onStatus(appt.id, 'completed')} className="p-1.5 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" title="Mark completed"><CheckCircle className="w-4 h-4" /></button>
            <button onClick={() => onStatus(appt.id, 'cancelled')} className="p-1.5 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors" title="Cancel"><XCircle className="w-4 h-4" /></button>
            <button onClick={() => onDelete(appt.id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
          </div>
        )}
      </div>
    </div>
  )
}
