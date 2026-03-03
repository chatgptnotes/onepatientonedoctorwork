import { useState } from 'react'
import { Camera, Upload, Pill, FileText, CheckCircle } from 'lucide-react'

const mockExtracted = [
  { name: 'Amoxicillin 500mg', dosage: '1 tablet 3 times daily', duration: '7 days' },
  { name: 'Pantoprazole 40mg', dosage: '1 tablet before breakfast', duration: '14 days' },
  { name: 'Paracetamol 650mg', dosage: 'As needed for pain', duration: 'PRN' },
]

export default function PrescriptionScanner() {
  const [uploaded, setUploaded] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [results, setResults] = useState<typeof mockExtracted>([])

  function handleUpload() {
    setUploaded(true)
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      setResults(mockExtracted)
    }, 2000)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Prescription Scanner</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Upload a prescription photo to extract medicines</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 mb-4">Upload prescription image or take a photo</p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={handleUpload} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center gap-2"><Upload className="w-4 h-4" /> Upload Image</button>
          <button onClick={handleUpload} className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium flex items-center gap-2"><Camera className="w-4 h-4" /> Take Photo</button>
        </div>
      </div>

      {processing && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center">
          <div className="animate-spin w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Analyzing prescription...</p>
        </div>
      )}

      {results.length > 0 && !processing && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Extracted Medicines</h3>
          </div>
          <div className="space-y-3">
            {results.map((m, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                <Pill className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{m.name}</p>
                  <p className="text-sm text-gray-500">{m.dosage} - {m.duration}</p>
                </div>
                <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium">Add to Meds</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
