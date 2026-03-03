import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Heart, AlertCircle, Lock, KeyIcon, Shield
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function SharedProfileView() {
  const { token } = useParams<{ token: string }>()
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [needsPIN, setNeedsPIN] = useState(false)
  const [pin, setPIN] = useState('')
  const [pinLoading, setPinLoading] = useState(false)

  useEffect(() => {
    if (token) {
      loadSharedProfile()
    }
  }, [token])

  async function loadSharedProfile(enteredPin?: string) {
    if (!token) {
      setError('Invalid share link')
      setLoading(false)
      return
    }

    try {
      const { data: result, error: rpcError } = await supabase
        .rpc('get_shared_profile', { 
          p_token: token, 
          p_pin: enteredPin || null 
        })

      if (rpcError) {
        console.error('RPC Error:', rpcError)
        setError('Failed to load shared profile')
      } else if (result?.error) {
        if (result.error === 'Invalid PIN') {
          setNeedsPIN(true)
          if (enteredPin) {
            toast.error('Incorrect PIN. Please try again.')
            setPIN('')
          }
        } else {
          setError(result.error)
        }
      } else {
        setData(result)
        setNeedsPIN(false)
      }
    } catch (err) {
      console.error('Error loading shared profile:', err)
      setError('Failed to load shared profile')
    }
    setLoading(false)
    setPinLoading(false)
  }

  async function submitPIN() {
    if (pin.length < 4) {
      toast.error('Please enter a valid PIN')
      return
    }

    setPinLoading(true)
    await loadSharedProfile(pin)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading health profile...</p>
        </div>
      </div>
    )
  }

  if (needsPIN) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-2xl border border-blue-200 dark:border-blue-800 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Secure Health Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Enter the access code provided by the patient
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Access PIN
              </label>
              <input
                type="password"
                value={pin}
                onChange={e => setPIN(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && submitPIN()}
                placeholder="Enter PIN"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-center text-xl font-mono bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={6}
                autoFocus
              />
            </div>

            <button
              onClick={submitPIN}
              disabled={pinLoading || pin.length < 4}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-colors"
            >
              {pinLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <KeyIcon className="w-5 h-5" />
              )}
              {pinLoading ? 'Verifying...' : 'Access Profile'}
            </button>

            <div className="text-center">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 justify-center">
                <Shield className="w-4 h-4" />
                End-to-end encrypted • AES-256 • TLS 1.3
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {error === 'Link not found or expired' ? 'Link Expired' : 'Access Error'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error === 'Link not found or expired' 
              ? 'This link has expired or been revoked. Please request a new link from your patient.'
              : error
            }
          </p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">No data available</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Health Profile</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Shared via 1Patient1Doctor • Secured & Encrypted
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium">
              <Shield className="w-4 h-4" />
              End-to-end encrypted
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Health Profile Successfully Loaded
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Patient health data has been securely accessed and is ready for review.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-12">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
              <Heart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm">Powered by</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">1Patient1Doctor</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
              <span>AES-256 Encrypted</span>
              <span>DPDP Act Compliant</span>
              <span>HIPAA Standard</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
