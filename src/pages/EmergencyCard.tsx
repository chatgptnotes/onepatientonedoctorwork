import { AlertCircle, Download, QrCode, Phone, Heart, Shield, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function EmergencyCard() {
  const { user } = useAuth()
  const name = user?.user_metadata?.full_name || 'Patient'

  const info = {
    bloodType: 'O+',
    allergies: ['Penicillin', 'Sulfa drugs'],
    conditions: ['Mild Hypertension', 'Type 2 Diabetes (controlled)'],
    emergencyContacts: [
      { name: 'Priya (Spouse)', phone: '+91 98765 43210' },
      { name: 'Dr. Shah (Physician)', phone: '+91 98765 11111' },
    ],
    medications: ['Metformin 500mg', 'Amlodipine 5mg'],
    insuranceId: 'SH-2024-78901',
  }

  function handleDownload() {
    const card = `EMERGENCY MEDICAL CARD\n${'='.repeat(40)}\nName: ${name}\nBlood Type: ${info.bloodType}\nAllergies: ${info.allergies.join(', ')}\nConditions: ${info.conditions.join(', ')}\nMedications: ${info.medications.join(', ')}\nInsurance: ${info.insuranceId}\n\nEMERGENCY CONTACTS:\n${info.emergencyContacts.map(c => `${c.name}: ${c.phone}`).join('\n')}\n\nGenerated: ${new Date().toLocaleDateString()}`
    const blob = new Blob([card], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'emergency-card.txt'
    a.click()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Emergency Card</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Your critical medical info at a glance</p>
        </div>
        <button onClick={handleDownload} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium flex items-center gap-2"><Download className="w-4 h-4" /> Download</button>
      </div>

      <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-8 h-8" />
          <div>
            <p className="text-xl font-bold">EMERGENCY MEDICAL CARD</p>
            <p className="text-red-200 text-sm">Show this to medical personnel in emergency</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div><p className="text-red-200 text-xs">PATIENT NAME</p><p className="font-semibold">{name}</p></div>
          <div><p className="text-red-200 text-xs">BLOOD TYPE</p><p className="text-3xl font-bold">{info.bloodType}</p></div>
        </div>
        <div className="mt-4 pt-4 border-t border-red-500/30">
          <p className="text-red-200 text-xs mb-1">ALLERGIES</p>
          <div className="flex flex-wrap gap-2">{info.allergies.map((a, i) => <span key={i} className="px-2 py-1 bg-red-500/30 rounded-lg text-sm">{a}</span>)}</div>
        </div>
        <div className="mt-4 pt-4 border-t border-red-500/30">
          <p className="text-red-200 text-xs mb-1">MEDICATIONS</p>
          <p className="text-sm">{info.medications.join(' | ')}</p>
        </div>
        <div className="mt-4 pt-4 border-t border-red-500/30">
          <p className="text-red-200 text-xs mb-1">CONDITIONS</p>
          <p className="text-sm">{info.conditions.join(' | ')}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Phone className="w-5 h-5 text-red-500" /> Emergency Contacts</h3>
        <div className="space-y-3">
          {info.emergencyContacts.map((c, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">{c.name}</p>
                <p className="text-xs text-gray-500">{c.phone}</p>
              </div>
              <a href={`tel:${c.phone.replace(/\s/g, '')}`} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium">Call</a>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 text-center">
        <QrCode className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <p className="text-sm text-gray-500">QR Code for quick access to emergency info</p>
        <p className="text-xs text-gray-400 mt-1">(QR generation available in future update)</p>
      </div>
    </div>
  )
}
