'use client'

export function CopyrightFooter() {
  return (
    <p className="mt-8 text-center text-sm text-gray-500">
      &copy; {new Date().getFullYear()} Levery. All rights reserved.
    </p>
  )
}
