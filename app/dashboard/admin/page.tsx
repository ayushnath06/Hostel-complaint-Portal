'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { StatusBadge, PriorityBadge } from '@/components/StatusBadge'
import { mockStore } from '@/lib/mockStore'
import type { Category } from '@/lib/types'
import {
  ShieldCheck, Clock, Plus, RotateCcw,
  Layers, CheckCircle, AlertTriangle, Building
} from 'lucide-react'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [issues, setIssues] = useState(mockStore.getIssues())
  const [user, setUser] = useState(mockStore.getCurrentUser())
  const [ready, setReady] = useState(false)
  const [showAddCat, setShowAddCat] = useState(false)
  const [newCat, setNewCat] = useState({
    name: '',
    department: 'Hostel',
    sla_hours: 24,
  })
  const [resetMessage, setResetMessage] = useState('')

  const refreshData = () => {
    setCategories(mockStore.getCategories())
    setIssues(mockStore.getIssues())
    setUser(mockStore.getCurrentUser())
  }

  useEffect(() => {
    const current = mockStore.getCurrentUser()
    if (!current) {
      router.replace('/login')
      return
    }
    if (current.role !== 'admin') {
      router.replace(`/dashboard/${current.role}`)
      return
    }
    setUser(current)
    setReady(true)
    refreshData()

    const unsubscribe = mockStore.subscribe(() => {
      const u = mockStore.getCurrentUser()
      if (!u) {
        router.replace('/login')
      } else if (u.role !== 'admin') {
        router.replace(`/dashboard/${u.role}`)
      } else {
        refreshData()
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

  const totals = {
    open: issues.filter((i) => i.status === 'open').length,
    in_progress: issues.filter((i) => i.status === 'in_progress').length,
    escalated: issues.filter((i) => i.status === 'escalated').length,
    resolved: issues.filter((i) => i.status === 'resolved').length,
  }

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCat.name.trim()) return

    const cat: Category = {
      id: `cat-${Date.now()}`,
      name: newCat.name.trim(),
      keywords: [newCat.name.toLowerCase()],
      sla_hours: Number(newCat.sla_hours) || 24,
      department: newCat.department,
      created_at: new Date().toISOString(),
    }

    mockStore.addCategory(cat)
    setNewCat({ name: '', department: 'Hostel', sla_hours: 24 })
    setShowAddCat(false)
    refreshData()
  }

  const handleResetData = () => {
    mockStore.resetToDefault()
    setResetMessage('Database restored to initial mock demo dataset.')
    setTimeout(() => setResetMessage(''), 3000)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar role="admin" fullName={user.full_name} userId={user.user_id} />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">System Admin Console</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Service categories, SLA policy enforcement, and platform diagnostics.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetData}
            className="btn-secondary text-xs py-2 px-3 border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 self-start sm:self-center"
          >
            <RotateCcw size={13} />
            <span>Reset Demo Data</span>
          </button>
        </div>

        {resetMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2">
            <CheckCircle size={15} className="text-emerald-600" />
            <span>{resetMessage}</span>
          </div>
        )}

        {/* Global Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Open Issues', count: totals.open, color: 'bg-blue-50/80 text-blue-800 border-blue-200' },
            { label: 'In Progress', count: totals.in_progress, color: 'bg-amber-50/80 text-amber-800 border-amber-200' },
            { label: 'Escalations', count: totals.escalated, color: 'bg-red-50/80 text-red-800 border-red-200' },
            { label: 'Resolved Tickets', count: totals.resolved, color: 'bg-emerald-50/80 text-emerald-800 border-emerald-200' },
          ].map(({ label, count, color }) => (
            <div key={label} className={`rounded-xl border p-4 ${color} shadow-sm`}>
              <p className="text-xs font-semibold">{label}</p>
              <p className="text-2xl font-bold mt-1">{count}</p>
            </div>
          ))}
        </div>

        {/* Categories & SLA Management */}
        <div className="card p-6 shadow-sm border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Configured Categories &amp; SLA Limits</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Tickets exceeding SLA limits trigger automatic escalation warnings.
              </p>
            </div>

            <button
              onClick={() => setShowAddCat(!showAddCat)}
              className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
            >
              <Plus size={14} />
              <span>{showAddCat ? 'Cancel' : 'Add Category'}</span>
            </button>
          </div>

          {showAddCat && (
            <form onSubmit={handleAddCategory} className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 space-y-3 animate-fade-in">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">New Category Definition</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="label text-xs">Name</label>
                  <input
                    type="text"
                    value={newCat.name}
                    onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                    placeholder="e.g. Library Study AC"
                    className="input text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="label text-xs">Department</label>
                  <select
                    value={newCat.department}
                    onChange={(e) => setNewCat({ ...newCat, department: e.target.value })}
                    className="input text-xs"
                  >
                    {['Hostel', 'Mess', 'IT', 'Transport', 'Academics', 'Administration'].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label text-xs">SLA (Hours)</label>
                  <input
                    type="number"
                    min={1}
                    max={168}
                    value={newCat.sla_hours}
                    onChange={(e) => setNewCat({ ...newCat, sla_hours: Number(e.target.value) })}
                    className="input text-xs"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary text-xs py-1.5 px-3">
                Save Category
              </button>
            </form>
          )}

          <div className="divide-y divide-slate-100">
            {categories.map((c) => (
              <div key={c.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800">{c.name}</p>
                  <p className="text-[11px] text-slate-400">{c.department} Department</p>
                </div>
                <span className="badge bg-slate-50 text-slate-700 border border-slate-200 font-mono text-xs">
                  SLA: {c.sla_hours}h
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* All Campus Complaints Live Feed */}
        <div className="card p-6 shadow-sm border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">All Campus Complaints ({issues.length})</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Live feed of all student grievances and current resolution status.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {issues.map((issue) => (
              <div key={issue.id} className="py-3.5 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                    #{issue.tracking_id}
                  </span>
                  <StatusBadge status={issue.status} />
                  <PriorityBadge priority={issue.priority} />
                  {issue.categories && (
                    <span className="text-[11px] text-slate-500 font-medium">
                      • {issue.categories.name} ({issue.categories.department})
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-800">{issue.description}</p>
                {issue.staff_notes && (
                  <p className="text-xs text-blue-700 bg-blue-50/70 px-2.5 py-1.5 rounded-lg border border-blue-100">
                    <span className="font-semibold">Staff Note: </span>{issue.staff_notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
