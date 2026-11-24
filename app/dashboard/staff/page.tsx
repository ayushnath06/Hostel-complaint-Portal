'use client'

import { Navbar } from '@/components/Navbar'
import { StaffDashboardClient } from './StaffDashboardClient'
import { mockStore } from '@/lib/mockStore'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function StaffDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(mockStore.getCurrentUser())
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const current = mockStore.getCurrentUser()
    if (!current) {
      router.replace('/login')
      return
    }
    if (current.role !== 'staff') {
      router.replace(`/dashboard/${current.role}`)
      return
    }
    setUser(current)
    setReady(true)

    const unsubscribe = mockStore.subscribe(() => {
      const u = mockStore.getCurrentUser()
      if (!u) {
        router.replace('/login')
      } else if (u.role !== 'staff') {
        router.replace(`/dashboard/${u.role}`)
      } else {
        setUser(u)
      }
    })
    return () => {
      unsubscribe()
    }
  }, [router])

  if (!ready || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar
        role="staff"
        fullName={user.full_name}
        userId={user.user_id}
        department={user.department || 'Hostel'}
      />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <StaffDashboardClient />
      </main>
    </div>
  )
}
