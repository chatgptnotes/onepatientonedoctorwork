import { useEffect, useState } from 'react'
import {
  Share2, Copy, QrCode, Clock, Eye, ExternalLink,
  Check, X, Trash2, Plus, Calendar, Shield, Lock,
  Timer, AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { hashPin, validatePinFormat } from '../lib/crypto'
import type { SharedProfile } from '../types/database'

interface ShareOptions {
  expiryHours: number
  includeVitals: boolean
  includeRecords: boolean
  includeMedications: boolean
  includeAllergies: boolean
  includeImmunizations: boolean
  accessPin: string
}

const defaultOptions: ShareOptions = {
  expiryHours: 24,
  includeVitals: true,
  includeRecords: true,
  includeMedications: true,
  includeAllergies: true,
  includeImmunizations: true,
  accessPin: '',
}

const expiryOptions = [
  { label: '24 hours', hours: 24 },
  { label: '48 hours', hours: 48 },
  { label: '7 days', hours: 168 },
  { label: '30 days', hours: 720 },
]

export default function ShareWithDoctor() {
  const { user } = useAuth()
  const [shares, setShares] = useState<SharedProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [options, setOptions] = useState<ShareOptions>(defaultOptions)
  const [showQR, setShowQR] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadShares()
    }
  }, [user])

  async function loadShares() {
    if (!user) return
    
    const { data, error } = await supabase
      .from('shared_profiles')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading shares:', error)
      toast.error('Failed to load shared links')
    } else {
      setShares(data || [])
    }
    setLoading(false)
  }

  async function createShare() {
    if (!user) return
    
    // Validate PIN if provided
    if (options.accessPin && !validatePinFormat(options.accessPin)) {
      toast.error('PIN must be 4-6 digits')
      return
    }
    
    setCreating(true)
    
    try {
      // Generate a secure random token
      const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
      
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + options.expiryHours)
      
      // Hash PIN if provided
      const hashedPin = options.accessPin ? await hashPin(options.accessPin) : null
      
      const { error } = await supabase
        .from('shared_profiles')
        .insert({
          user_id: user.id,
          share_token: token,
          expires_at: expiresAt.toISOString(),
          include_vitals: options.includeVitals,
          include_records: options.includeRecords,
          include_medications: options.includeMedications,
          include_allergies: options.includeAllergies,
          include_immunizations: options.includeImmunizations,
          access_pin: hashedPin,
        })
      
      if (error) {
        console.error('Error creating share:', error)
        toast.error('Failed to create share link')
      } else {
        toast.success(
          hashedPin 
            ? `Secure share link created with PIN: ${options.accessPin}` 
            : 'Share link created successfully!'
        )
        setOptions(prev => ({ ...prev, accessPin: '' })) // Clear PIN
        loadShares()
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to create share link')
    } finally {
      setCreating(false)
    }
  }

  async function revokeShare(id: string) {
    const { error } = await supabase
      .from('shared_profiles')
      .update({ is_active: false })
      .eq('id', id)
    
    if (error) {
      console.error('Error revoking share:', error)
      toast.error('Failed to revoke share link')
    } else {
      toast.success('Share link revoked')
      loadShares()
    }
  }

  function copyToClipboard(token: string) {
    const url = `${window.location.origin}/shared/${token}`
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Link copied to clipboard!')
    }).catch(() => {
      toast.error('Failed to copy link')
    })
  }

  function formatExpiry(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffHours = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60))
    
    if (diffHours < 1) return 'Expired'
    if (diffHours < 24) return `${diffHours}h remaining`
    if (diffHours < 168) return `${Math.ceil(diffHours / 24)}d remaining`
    return date.toLocaleDateString()
  }

  function getTimeRemaining(dateString: string): { expired: boolean; timeLeft: string } {
    const expiryDate = new Date(dateString)
    const now = new Date()
    const diff = expiryDate.getTime() - now.getTime()
    
    if (diff <= 0) return { expired: true, timeLeft: 'Expired' }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) return { expired: false, timeLeft: `${days}d ${hours}h remaining` }
    if (hours > 0) return { expired: false, timeLeft: `${hours}h ${minutes}m remaining` }
    return { expired: false, timeLeft: `${minutes}m remaining` }
  }

  function getShareUrl(token: string): string {
    return `${window.location.origin}/shared/${token}`
  }

  function getAccessLogSummary(accessLog: SharedProfile['access_log']): string {
    if (!accessLog || accessLog.length === 0) return 'Never accessed'
    
    const lastAccess = accessLog[accessLog.length - 1]
    const lastDate = new Date(lastAccess.timestamp).toLocaleDateString()
    return `Last viewed: ${lastDate}`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="bg-gray-200 dark:bg-gray-700 h-96 rounded-2xl animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Share with Doctor</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
          Create secure, time-limited links to share your health profile
        </p>
      </div>

      {/* Security Features Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-blue-900 dark:text-blue-100">Enterprise-Grade Security</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
            <Lock className="w-4 h-4" />
            <span>Data encrypted at rest (AES-256)</span>
          </div>
          <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
            <Shield className="w-4 h-4" />
            <span>In transit encryption (TLS 1.3)</span>
          </div>
          <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
            <Check className="w-4 h-4" />
            <span>DPDP Act & HIPAA compliant</span>
          </div>
        </div>
      </div>

      {/* Create New Share */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-6">
          <Share2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Create New Share Link</h2>
        </div>

        {/* Expiry Options */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Link Expiry
          </label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {expiryOptions.map(option => (
              <button
                key={option.hours}
                onClick={() => setOptions(prev => ({ ...prev, expiryHours: option.hours }))}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
                  options.expiryHours === option.hours
                    ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Clock className="w-4 h-4 inline mr-1.5" />
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* PIN Protection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Access PIN (Optional)
          </label>
          <div className="max-w-xs">
            <input
              type="password"
              value={options.accessPin}
              onChange={e => setOptions(prev => ({ ...prev, accessPin: e.target.value }))}
              placeholder="Enter 4-6 digit PIN"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-center text-lg font-mono bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={6}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              <Lock className="w-3 h-3 inline mr-1" />
              Doctor will need this PIN to access your profile
            </p>
          </div>
        </div>

        {/* Create Button */}
        <button
          onClick={createShare}
          disabled={creating}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          {creating ? 'Creating...' : 'Create Share Link'}
        </button>
      </div>

      {/* Existing Shares */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Active Share Links</h2>
        
        {shares.length === 0 ? (
          <div className="text-center py-12">
            <Share2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No share links created yet</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              Create your first share link to securely share your health profile
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {shares.map(share => {
              const timeInfo = getTimeRemaining(share.expires_at)
              const isExpired = timeInfo.expired || !share.is_active
              const shareUrl = getShareUrl(share.share_token)
              const hasPIN = !!share.access_pin
              
              return (
                <div
                  key={share.id}
                  className={`p-4 border rounded-2xl transition-colors ${
                    isExpired
                      ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
                      : 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-2 h-2 rounded-full ${
                          isExpired ? 'bg-gray-400' : 'bg-green-500'
                        }`} />
                        <span className={`text-sm font-medium ${
                          isExpired 
                            ? 'text-gray-500 dark:text-gray-400' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {timeInfo.expired ? 'Expired' : !share.is_active ? 'Revoked' : 'Active'}
                        </span>
                        {hasPIN && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium">
                            <Lock className="w-3 h-3" />
                            Secured with PIN
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Timer className="w-3 h-3" />
                          {timeInfo.timeLeft}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          Viewed {share.viewed_count} times
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Created {new Date(share.created_at).toLocaleDateString()}
                        </div>
                        <div>{getAccessLogSummary(share.access_log)}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!isExpired && (
                        <>
                          <button
                            onClick={() => copyToClipboard(share.share_token)}
                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Copy link"
                            aria-label="Copy share link"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <a
                            href={`https://wa.me/?text=${encodeURIComponent('View my health profile: ' + shareUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                            title="Share via WhatsApp"
                            aria-label="Share via WhatsApp"
                          >
                            <Share2 className="w-4 h-4" />
                          </a>
                          <a
                            href={shareUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Open link"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </>
                      )}
                      
                      {share.is_active && (
                        <button
                          onClick={() => revokeShare(share.id)}
                          className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Revoke access"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Security Notice */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-900 dark:text-amber-100 mb-2">Security & Privacy</h3>
            <div className="text-sm text-amber-700 dark:text-amber-200 space-y-2">
              <p>• Share links are encrypted and automatically expire</p>
              <p>• PIN-protected links provide additional security</p>
              <p>• Only share with trusted healthcare providers</p>
              <p>• Revoke access immediately if link is compromised</p>
              <p>• Access attempts are logged for security auditing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
