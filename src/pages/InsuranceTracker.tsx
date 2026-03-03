import { useState } from 'react'
import { Shield, Plus, Calendar, AlertCircle, CheckCircle, IndianRupee } from 'lucide-react'

interface Policy { id: number; provider: string; type: string; policyNo: string; premium: number; sumInsured: number; renewalDate: string; status: string }

export default function InsuranceTracker() {
  const [policies] = useState<Policy[]>([
    { id: 1, provider: 'Star Health', type: 'Family Floater', policyNo: 'SH-2024-78901', premium: 25000, sumInsured: 1000000, renewalDate: '2026-06-15', status: 'Active' },
    { id: 2, provider: 'ICICI Lombard', type: 'Critical Illness', policyNo: 'IL-2024-45678', premium: 12000, sumInsured: 500000, renewalDate: '2026-03-20', status: 'Renewal Due' },
    { id: 3, provider: 'HDFC Ergo', type: 'Personal Accident', policyNo: 'HE-2023-12345', premium: 5000, sumInsured: 2000000, renewalDate: '2025-12-01', status: 'Expired' },
  ])

  const statusColors: Record<string, string> = {
    Active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'Renewal Due': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    Expired: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Insurance Tracker</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage policies, claims, and renewals</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center gap-2"><Plus className="w-4 h-4" /> Add Policy</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-sm text-gray-500">Total Coverage</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">35,00,000</p>
          <p className="text-xs text-gray-400">across {policies.length} policies</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-sm text-gray-500">Annual Premium</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">42,000</p>
          <p className="text-xs text-gray-400">total yearly</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-sm text-gray-500">Next Renewal</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">Mar 20</p>
          <p className="text-xs text-gray-400">ICICI Lombard</p>
        </div>
      </div>

      <div className="space-y-4">
        {policies.map(p => (
          <div key={p.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{p.provider}</p>
                  <p className="text-xs text-gray-500">{p.type} - {p.policyNo}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[p.status]}`}>{p.status}</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div><p className="text-gray-500">Premium</p><p className="font-medium text-gray-900 dark:text-white">{p.premium.toLocaleString()}/yr</p></div>
              <div><p className="text-gray-500">Sum Insured</p><p className="font-medium text-gray-900 dark:text-white">{p.sumInsured.toLocaleString()}</p></div>
              <div><p className="text-gray-500">Renewal</p><p className="font-medium text-gray-900 dark:text-white">{p.renewalDate}</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
