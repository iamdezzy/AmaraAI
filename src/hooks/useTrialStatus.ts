import { useState, useEffect } from 'react'
import { TrialService, TrialStatus } from '../lib/trialService'

export function useTrialStatus() {
  const [trialStatus, setTrialStatus] = useState<TrialStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [fingerprintId, setFingerprintId] = useState<string>('')

  useEffect(() => {
    const initializeTrialStatus = async () => {
      try {
        // Generate or get stored fingerprint
        let storedFingerprint = localStorage.getItem('amara-device-fingerprint')
        
        if (!storedFingerprint) {
          storedFingerprint = TrialService.generateDeviceFingerprint()
          localStorage.setItem('amara-device-fingerprint', storedFingerprint)
        }

        setFingerprintId(storedFingerprint)

        // Get trial status from server
        const status = await TrialService.getTrialStatus(storedFingerprint)
        setTrialStatus(status)
      } catch (error) {
        console.error('Error initializing trial status:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeTrialStatus()
  }, [])

  const updateTrialUsage = async (chatMessages: number, voiceNotes: number) => {
    if (!fingerprintId) return null

    try {
      const result = await TrialService.updateTrialUsage({
        fingerprintId,
        chatMessages,
        voiceNotes
      })

      if (result) {
        // Update local state
        setTrialStatus(prev => prev ? {
          ...prev,
          chatMessages,
          voiceNotes,
          isTrialExceeded: result.isTrialExceeded
        } : null)
      }

      return result
    } catch (error) {
      console.error('Error updating trial usage:', error)
      return null
    }
  }

  return {
    trialStatus,
    loading,
    fingerprintId,
    updateTrialUsage
  }
}