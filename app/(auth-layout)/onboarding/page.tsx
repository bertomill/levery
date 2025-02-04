'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { OnboardingProvider } from '@/components/onboarding/OnboardingContext'
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress'
import { ProfileStep } from '@/components/onboarding/ProfileStep'
import { IndustryStep } from '@/components/onboarding/IndustryStep'
import { GoalsStep } from '@/components/onboarding/GoalsStep'
import { useOnboarding } from '@/components/onboarding/OnboardingContext'

function OnboardingContent() {
  const { step } = useOnboarding()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome to Levery</h2>
        <p className="mt-2 text-sm text-gray-600">
          Let's get to know you better so we can personalize your experience
        </p>
      </div>

      <OnboardingProgress />

      {step === 1 && <ProfileStep />}
      {step === 2 && <IndustryStep />}
      {step === 3 && <GoalsStep />}
    </div>
  )
}

function OnboardingWithAuth() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.push('/login')
          return
        }
        
        // Check if user has already completed onboarding
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profile?.full_name && profile?.industry && profile?.goals) {
          router.push('/')
          return
        }

        setIsLoading(false)
      } catch (error) {
        console.error('Error checking session:', error)
        toast.error('Something went wrong')
        router.push('/login')
      }
    }

    checkSession()
  }, [router, supabase])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  return <OnboardingContent />
}

export default function OnboardingPage() {
  return (
    <OnboardingProvider>
      <OnboardingWithAuth />
    </OnboardingProvider>
  )
}
