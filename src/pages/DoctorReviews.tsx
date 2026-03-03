import { useState } from 'react'
import { Star, ThumbsUp, MessageSquare, User } from 'lucide-react'

interface Review { id: number; doctor: string; specialty: string; rating: number; comment: string; date: string }

export default function DoctorReviews() {
  const [reviews, setReviews] = useState<Review[]>([
    { id: 1, doctor: 'Dr. R. Shah', specialty: 'Cardiologist', rating: 5, comment: 'Excellent doctor. Very thorough examination and clear explanation.', date: '2026-02-28' },
    { id: 2, doctor: 'Dr. M. Gupta', specialty: 'Endocrinologist', rating: 4, comment: 'Good treatment plan. Slightly long wait times.', date: '2026-02-15' },
    { id: 3, doctor: 'Dr. S. Patel', specialty: 'Dermatologist', rating: 5, comment: 'Resolved my skin condition in just 2 visits. Highly recommended.', date: '2026-01-20' },
  ])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ doctor: '', specialty: '', rating: 5, comment: '' })

  function addReview() {
    if (!form.doctor) return
    setReviews([{ id: Date.now(), ...form, date: new Date().toISOString().slice(0,10) }, ...reviews])
    setForm({ doctor: '', specialty: '', rating: 5, comment: '' })
    setShowForm(false)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Doctor Reviews</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Rate and review your doctors</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Write Review</button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Write a Review</h3>
          <div className="space-y-3">
            <input placeholder="Doctor name" value={form.doctor} onChange={e => setForm({...form, doctor: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
            <input placeholder="Specialty" value={form.specialty} onChange={e => setForm({...form, specialty: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Rating:</span>
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setForm({...form, rating: n})}><Star className={`w-6 h-6 ${n <= form.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} /></button>
              ))}
            </div>
            <textarea placeholder="Your review..." value={form.comment} onChange={e => setForm({...form, comment: e.target.value})} className="w-full h-20 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white resize-none" />
            <button onClick={addReview} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium">Submit Review</button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {reviews.map(r => (
          <div key={r.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center"><User className="w-5 h-5 text-white" /></div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{r.doctor}</p>
                <p className="text-xs text-gray-500">{r.specialty}</p>
              </div>
              <div className="ml-auto flex">{Array.from({length: 5}).map((_, i) => <Star key={i} className={`w-4 h-4 ${i < r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />)}</div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{r.comment}</p>
            <p className="text-xs text-gray-400 mt-2">{r.date}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
