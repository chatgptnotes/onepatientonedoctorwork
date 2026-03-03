import { useState } from 'react'
import { Users, Plus, Heart, Activity, AlertCircle, Trash2 } from 'lucide-react'

interface FamilyMember { id: number; name: string; relation: string; age: number; bloodType: string; conditions: string[]; healthScore: number }

export default function FamilyHealthHub() {
  const [members, setMembers] = useState<FamilyMember[]>([
    { id: 1, name: 'Dr. Murali', relation: 'Self', age: 45, bloodType: 'O+', conditions: ['Mild Hypertension'], healthScore: 85 },
    { id: 2, name: 'Priya', relation: 'Spouse', age: 42, bloodType: 'A+', conditions: ['None'], healthScore: 92 },
    { id: 3, name: 'Arjun', relation: 'Son', age: 16, bloodType: 'O+', conditions: ['Asthma (mild)'], healthScore: 88 },
  ])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', relation: '', age: '', bloodType: '', conditions: '' })

  function addMember() {
    if (!form.name) return
    setMembers([...members, { id: Date.now(), name: form.name, relation: form.relation, age: +form.age, bloodType: form.bloodType, conditions: form.conditions.split(',').map(c => c.trim()).filter(Boolean), healthScore: Math.floor(Math.random() * 20 + 75) }])
    setForm({ name: '', relation: '', age: '', bloodType: '', conditions: '' })
    setShowForm(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Family Health Hub</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track health for your entire family</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Add Family Member</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
            <input placeholder="Relation" value={form.relation} onChange={e => setForm({...form, relation: e.target.value})} className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
            <input placeholder="Age" type="number" value={form.age} onChange={e => setForm({...form, age: e.target.value})} className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
            <input placeholder="Blood Type" value={form.bloodType} onChange={e => setForm({...form, bloodType: e.target.value})} className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
            <input placeholder="Conditions (comma separated)" value={form.conditions} onChange={e => setForm({...form, conditions: e.target.value})} className="col-span-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
          <button onClick={addMember} className="mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium">Add</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map(m => (
          <div key={m.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">{m.name[0]}</div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{m.name}</p>
                  <p className="text-xs text-gray-500">{m.relation} - Age {m.age}</p>
                </div>
              </div>
              <button onClick={() => setMembers(members.filter(x => x.id !== m.id))} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Blood Type</span><span className="font-medium text-gray-900 dark:text-white">{m.bloodType}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Health Score</span><span className={`font-bold ${m.healthScore >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>{m.healthScore}/100</span></div>
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-500 mb-1">Conditions</p>
                <div className="flex flex-wrap gap-1">
                  {m.conditions.map((c, i) => (
                    <span key={i} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-600 dark:text-gray-400">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
