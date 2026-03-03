import { useState } from 'react'
import { Download, FileText, FileJson, File, CheckCircle, Loader } from 'lucide-react'

const exportOptions = [
  { id: 'pdf', label: 'PDF Report', desc: 'Complete health report with charts and summaries', icon: <FileText className="w-6 h-6" />, format: 'PDF' },
  { id: 'json', label: 'JSON Data', desc: 'Raw health data in JSON format for apps', icon: <FileJson className="w-6 h-6" />, format: 'JSON' },
  { id: 'csv', label: 'CSV Spreadsheet', desc: 'Tabular data for Excel or Google Sheets', icon: <File className="w-6 h-6" />, format: 'CSV' },
]

const dataCategories = ['Health Records', 'Medications', 'Lab Results', 'Vitals', 'Appointments', 'Immunizations', 'Allergies']

export default function ExportHealthData() {
  const [selected, setSelected] = useState<string[]>(dataCategories)
  const [exporting, setExporting] = useState(false)
  const [done, setDone] = useState(false)

  function handleExport(format: string) {
    setExporting(true)
    setDone(false)
    setTimeout(() => {
      setExporting(false)
      setDone(true)
      const content = format === 'JSON' ? JSON.stringify({ exported: selected, date: new Date().toISOString() }, null, 2) : `Health Data Export\nFormat: ${format}\nCategories: ${selected.join(', ')}\nDate: ${new Date().toLocaleDateString()}`
      const blob = new Blob([content], { type: 'text/plain' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `health-data.${format.toLowerCase()}`
      a.click()
    }, 2000)
  }

  function toggleCategory(cat: string) {
    setSelected(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Export Health Data</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Download your health data in various formats</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Select Data to Export</h3>
        <div className="flex flex-wrap gap-2">
          {dataCategories.map(cat => (
            <button key={cat} onClick={() => toggleCategory(cat)} className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${selected.includes(cat) ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>{cat}</button>
          ))}
        </div>
      </div>

      {exporting && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center">
          <Loader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">Preparing your export...</p>
        </div>
      )}

      {done && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-sm text-green-800 dark:text-green-300">Export downloaded successfully.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {exportOptions.map(opt => (
          <div key={opt.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 mx-auto mb-3">{opt.icon}</div>
            <p className="font-semibold text-gray-900 dark:text-white">{opt.label}</p>
            <p className="text-xs text-gray-500 mt-1 mb-4">{opt.desc}</p>
            <button onClick={() => handleExport(opt.format)} disabled={exporting || selected.length === 0} className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Export {opt.format}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
