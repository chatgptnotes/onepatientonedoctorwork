import { useState } from 'react'
import { FileText, Upload, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const labResults = [
  { test: 'HbA1c', value: 6.8, unit: '%', normal: '4.0-5.6', status: 'high', history: [{date:'Oct',val:7.2},{date:'Nov',val:7.0},{date:'Dec',val:6.9},{date:'Jan',val:6.8},{date:'Feb',val:6.8}] },
  { test: 'Total Cholesterol', value: 210, unit: 'mg/dL', normal: '<200', status: 'high', history: [{date:'Oct',val:230},{date:'Nov',val:225},{date:'Dec',val:218},{date:'Jan',val:215},{date:'Feb',val:210}] },
  { test: 'Hemoglobin', value: 14.2, unit: 'g/dL', normal: '13.5-17.5', status: 'normal', history: [{date:'Oct',val:13.8},{date:'Nov',val:14.0},{date:'Dec',val:14.1},{date:'Jan',val:14.0},{date:'Feb',val:14.2}] },
  { test: 'Creatinine', value: 1.0, unit: 'mg/dL', normal: '0.7-1.3', status: 'normal', history: [{date:'Oct',val:1.1},{date:'Nov',val:1.0},{date:'Dec',val:1.0},{date:'Jan',val:1.0},{date:'Feb',val:1.0}] },
  { test: 'TSH', value: 3.5, unit: 'mIU/L', normal: '0.4-4.0', status: 'normal', history: [{date:'Oct',val:3.8},{date:'Nov',val:3.6},{date:'Dec',val:3.5},{date:'Jan',val:3.5},{date:'Feb',val:3.5}] },
  { test: 'Vitamin D', value: 18, unit: 'ng/mL', normal: '30-100', status: 'low', history: [{date:'Oct',val:15},{date:'Nov',val:16},{date:'Dec',val:17},{date:'Jan',val:17},{date:'Feb',val:18}] },
]

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  normal: { color: 'text-green-600 bg-green-100 dark:bg-green-900/30', icon: <Minus className="w-3 h-3" /> },
  high: { color: 'text-red-600 bg-red-100 dark:bg-red-900/30', icon: <TrendingUp className="w-3 h-3" /> },
  low: { color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30', icon: <TrendingDown className="w-3 h-3" /> },
}

export default function LabResultsViewer() {
  const [selectedTest, setSelectedTest] = useState(labResults[0])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lab Results</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">View reports and track trends</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center gap-2"><Upload className="w-4 h-4" /> Upload Report</button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{selectedTest.test} Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={selectedTest.history}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Line type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={2} /></LineChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        {labResults.map((r, i) => {
          const s = statusConfig[r.status]
          return (
            <button key={i} onClick={() => setSelectedTest(r)} className={`w-full text-left bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between hover:border-blue-300 transition-colors ${selectedTest.test === r.test ? 'ring-2 ring-blue-500' : ''}`}>
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{r.test}</p>
                  <p className="text-xs text-gray-500">Normal: {r.normal}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-900 dark:text-white">{r.value} <span className="text-sm font-normal text-gray-400">{r.unit}</span></span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${s.color}`}>{s.icon}{r.status}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
