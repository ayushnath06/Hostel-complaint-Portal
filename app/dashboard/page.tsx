'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { mockStore } from '@/lib/mockStore'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const user = mockStore.getCurrentUser()
    if (!user) {
      router.replace('/login')
      return
    }
    router.replace(`/dashboard/${user.role}`)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent" />
        <p className="text-xs text-slate-500 font-medium">Checking authentication...</p>
      </div>
    </div>
  )
}
