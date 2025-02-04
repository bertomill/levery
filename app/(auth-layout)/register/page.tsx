import { GoogleSignIn } from '@/components/shared/AuthProvider'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-gray-600 mt-2">Get started with Levery</p>
      </div>

      <div className="space-y-4">
        <GoogleSignIn />
        
        <div className="text-center text-sm">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 