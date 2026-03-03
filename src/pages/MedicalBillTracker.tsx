import { useState } from 'react'
import { Receipt, Plus, TrendingUp, Filter } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Bill { id: number; hospital: string; date: string; amount: number; insuranceCovered: number; outOfPocket: number; status: string; category: string }

const bills: Bill[] = [
  { id: 1, hospital: 'Hope Hospital', date: '2026-02-15', amount: 45000, insuranceCovered: 35000, outOfPocket: 10000, status: 'Paid', category: 'Surgery' },
  { id: 2, hospital: 'City Diagnostics', date: '2026-02-20', amount: 8500, insuranceCovered: 6000, outOfPocket: 2500, status: 'Pending', category: 'Lab Tests' },
  { id: 3, hospital: 'Apollo Pharmacy', date: '2026-03-01', amount: 3200, insuranceCovered: 0, outOfPocket: 3200, status: 'Paid', category: 'Medicines' },
]

const monthlyData = [
  { month: 'Oct', amount: 12000 }, { month: 'Nov', amount: 8500 }, { month: 'Dec', amount: 25000 },
  { month: 'Jan', amount: 15000 }, { month: 'Feb', amount: 53500 }, { month: 'Mar', amount: 3200 },
]

export default function MedicalBillTracker() {
  const totalSpent = bills.reduce((a, b) => a + b.amount, 0)
  const totalCovered = bills.reduce((a, b) => a + b.insuranceCovered, 0)
  const totalOop = bills.reduce((a, b) => a + b.outOfPocket, 0)

  const statusColors: Record<string, string> = {
    Paid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    Pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    Disputed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Medical Bill Tracker</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track hospital bills, insurance claims, and expenses</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center gap-2"><Plus className="w-4 h-4" /> Add Bill</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-sm text-gray-500">Total Bills</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalSpent.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-sm text-gray-500">Insurance Covered</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{totalCovered.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-sm text-gray-500">Out of Pocket</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{totalOop.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Monthly Expenses</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="amount" fill="#ef4444" radius={[6,6,0,0]} /></BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        {bills.map(b => (
          <div key={b.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Receipt className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{b.hospital}</p>
                  <p className="text-xs text-gray-500">{b.date} - {b.category}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[b.status]}`}>{b.status}</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm mt-3">
              <div><p className="text-gray-500">Total</p><p className="font-medium text-gray-900 dark:text-white">{b.amount.toLocaleString()}</p></div>
              <div><p className="text-gray-500">Insurance</p><p className="font-medium text-green-600">{b.insuranceCovered.toLocaleString()}</p></div>
              <div><p className="text-gray-500">Out of Pocket</p><p className="font-medium text-red-600">{b.outOfPocket.toLocaleString()}</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
