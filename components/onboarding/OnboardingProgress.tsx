'use client'

import { useOnboarding } from './OnboardingContext'
import { CheckIcon } from 'lucide-react'

const steps = [
  { id: 1, name: 'Profile' },
  { id: 2, name: 'Industry' },
  { id: 3, name: 'Goals' },
]

export function OnboardingProgress() {
  const { step } = useOnboarding()

  return (
    <nav aria-label="Progress" className="mb-8">
      <ol role="list" className="flex space-x-4 items-center justify-center">
        {steps.map((stepItem, stepIdx) => (
          <li key={stepItem.name} className="flex-1 max-w-[120px]">
            <div className="group relative flex items-center justify-center">
              <span
                className="absolute left-0 right-0 h-0.5 -translate-y-5"
                aria-hidden="true"
              >
                <div
                  className={`h-full transition-colors ${
                    stepItem.id <= step ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              </span>

              <span
                className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                  stepItem.id < step
                    ? 'border-blue-600 bg-blue-600'
                    : stepItem.id === step
                    ? 'border-blue-600 bg-white'
                    : 'border-gray-300 bg-white'
                }`}
              >
                {stepItem.id < step ? (
                  <CheckIcon className="h-4 w-4 text-white" />
                ) : (
                  <span
                    className={`text-sm ${
                      stepItem.id === step ? 'text-blue-600' : 'text-gray-500'
                    }`}
                  >
                    {stepItem.id}
                  </span>
                )}
              </span>
              <span
                className={`absolute mt-16 text-sm font-medium ${
                  stepItem.id <= step ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                {stepItem.name}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}
