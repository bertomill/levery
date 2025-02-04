'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface OnboardingContextType {
  step: number
  formData: {
    full_name?: string
    job_title?: string
    industry?: string
    goals?: string
  }
  setFormValue: (key: string, value: string) => void
  nextStep: () => void
  prevStep: () => void
  submitForm: () => Promise<void>
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    full_name: '',
    job_title: '',
    industry: '',
    goals: '',
  })

  const setFormValue = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, 3))
  }

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const submitForm = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('No user found')
      }

      // First try to get the existing user profile
      const { data: existingProfile } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single()

      let error

      if (!existingProfile) {
        // If no profile exists, insert a new one
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            ...formData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
        error = insertError
      } else {
        // If profile exists, update it
        const { error: updateError } = await supabase
          .from('users')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id)
        error = updateError
      }

      if (error) {
        console.error('Error submitting form:', error)
        throw error
      }

      toast.success('Profile updated successfully')
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Failed to update profile')
    }
  }

  const value = {
    step,
    formData,
    setFormValue,
    nextStep,
    prevStep,
    submitForm,
  }

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}
