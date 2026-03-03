import { AlertCircle, Download, Phone, Heart, User, Printer, Share2 } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function EmergencyCard() {
  const { user } = useAuth()
  const name = user?.user_metadata?.full_name || 'Patient Name'
  const email = user?.email || ''

  const info = {
    bloodType: 'O+',
    dob: '1985-03-15',
    abhaId: '12-3456-7890-1234',
    allergies: ['Penicillin', 'Sulfa drugs'],
    conditions: ['Mild Hypertension', 'Type 2 Diabetes (controlled)'],
    emergencyContacts: [
      { name: 'Priya (Spouse)', phone: '+91 98765 43210' },
      { name: 'Dr. Shah (Physician)', phone: '+91 98765 11111' },
    ],
    medications: ['Metformin 500mg', 'Amlodipine 5mg'],
    insuranceId: 'SH-2024-78901',
  }

  function handlePrint() {
    window.print()
  }

  function handleDownload() {
    const card = `EMERGENCY MEDICAL CARD\n${'='.repeat(50)}\nName: ${name}\nDate of Birth: ${info.dob}\nABHA ID: ${info.abhaId}\nBlood Type: ${info.bloodType}\nAllergies: ${info.allergies.join(', ')}\nConditions: ${info.conditions.join(', ')}\nMedications: ${info.medications.join(', ')}\nInsurance ID: ${info.insuranceId}\n\nEMERGENCY CONTACTS:\n${info.emergencyContacts.map(c => `  ${c.name}: ${c.phone}`).join('\n')}\n\nGenerated: ${new Date().toLocaleDateString()}\nVerify at: ${window.location.origin}/emergency/${user?.id || ''}`
    const blob = new Blob([card], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'emergency-medical-card.txt'
    a.click()
    toast.success('Emergency card downloaded')
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: 'Emergency Medical Card', text: `Emergency card for ${name}`, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard')
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Emergency Card</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Your critical medical information at a glance</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handlePrint} className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors" aria-label="Print card">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button onClick={handleShare} className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors" aria-label="Share card">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button onClick={handleDownload} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium flex items-center gap-2 text-sm transition-colors" aria-label="Download card">
            <Download className="w-4 h-4" /> Download
          </button>
        </div>
      </div>

      {/* ID Card - Front */}
      <div className="print:shadow-none" id="emergency-card">
        <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-900 rounded-2xl overflow-hidden shadow-xl print:shadow-none" style={{ aspectRatio: '1.586' }}>
          {/* Header stripe */}
          <div className="bg-red-900/40 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-white font-bold text-sm tracking-wider">EMERGENCY MEDICAL CARD</p>
                <p className="text-red-200 text-[10px]">1Patient1Doctor Health Platform</p>
              </div>
            </div>
            <AlertCircle className="w-6 h-6 text-white" />
          </div>

          <div className="px-6 py-4 flex gap-5">
            {/* Photo placeholder */}
            <div className="w-24 h-28 bg-red-800/50 rounded-xl border-2 border-red-400/30 flex flex-col items-center justify-center flex-shrink-0">
              <User className="w-10 h-10 text-red-300/60" />
              <p className="text-red-300/60 text-[8px] mt-1">PHOTO</p>
            </div>

            {/* Info */}
            <div className="flex-1 text-white space-y-2">
              <div>
                <p className="text-red-200 text-[10px] uppercase tracking-wider">Patient Name</p>
                <p className="font-bold text-lg leading-tight">{name}</p>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                <div>
                  <p className="text-red-200 text-[10px] uppercase tracking-wider">Blood Type</p>
                  <p className="font-bold text-2xl">{info.bloodType}</p>
                </div>
                <div>
                  <p className="text-red-200 text-[10px] uppercase tracking-wider">DOB</p>
                  <p className="font-semibold text-sm">{info.dob}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-red-200 text-[10px] uppercase tracking-wider">ABHA ID</p>
                  <p className="font-mono text-sm">{info.abhaId}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom section */}
          <div className="px-6 pb-4 space-y-2">
            <div className="bg-red-800/40 rounded-xl px-4 py-2">
              <p className="text-red-200 text-[10px] uppercase tracking-wider mb-1">Allergies (Critical)</p>
              <div className="flex flex-wrap gap-1.5">
                {info.allergies.map((a, i) => (
                  <span key={i} className="px-2 py-0.5 bg-yellow-500/20 border border-yellow-400/30 rounded-md text-yellow-200 text-xs font-medium">{a}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-200 text-[10px] uppercase tracking-wider">Current Medications</p>
                <p className="text-white text-xs">{info.medications.join(' | ')}</p>
              </div>
              <div className="bg-white rounded-lg p-1.5">
                <QRCodeSVG value={`${window.location.origin}/emergency/${user?.id || 'demo'}`} size={52} level="M" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ID Card - Back */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-lg print:shadow-none" style={{ aspectRatio: '1.586' }}>
        <div className="bg-gray-100 dark:bg-gray-800 px-6 py-3">
          <p className="font-bold text-gray-900 dark:text-white text-sm">Medical Conditions & Emergency Contacts</p>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Known Conditions</p>
            <div className="flex flex-wrap gap-2">
              {info.conditions.map((c, i) => (
                <span key={i} className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-lg text-xs font-medium border border-orange-200 dark:border-orange-800">{c}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1"><Phone className="w-3 h-3" /> Emergency Contacts</p>
            <div className="space-y-2">
              {info.emergencyContacts.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{c.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{c.phone}</p>
                  </div>
                  <a href={`tel:${c.phone.replace(/\s/g, '')}`} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition-colors" aria-label={`Call ${c.name}`}>
                    Call
                  </a>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Insurance ID</p>
              <p className="text-sm font-mono text-gray-900 dark:text-white">{info.insuranceId}</p>
            </div>
            <p className="text-[10px] text-gray-400">drmhope.com | A Bettroi Product</p>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #emergency-card, #emergency-card * { visibility: visible; }
          #emergency-card { position: absolute; left: 0; top: 0; width: 86mm; }
        }
      `}</style>
    </div>
  )
}
