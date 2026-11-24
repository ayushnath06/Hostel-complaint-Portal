'use client'

import { useState, useEffect } from 'react'
import { mockStore } from '@/lib/mockStore'
import { StatusBadge, PriorityBadge } from '@/components/StatusBadge'
import type { Issue, Category, EscalationLog, IssueStatus } from '@/lib/types'
import {
  BarChart2, AlertTriangle, Clock, CheckCircle,
  Inbox, Zap, TrendingUp, Building2, Check, ArrowDownRight
} from 'lucide-react'

export function AuthorityDashboardClient() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [escalations, setEscalations] = useState<EscalationLog[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'all' | 'escalated'>('overview')
  const [actionDone, setActionDone] = useState<string | null>(null)

  const refreshData = () => {
    setIssues(mockStore.getIssues())
    setCategories(mockStore.getCategories())
    setEscalations(mockStore.getEscalations())
  }

  useEffect(() => {
    refreshData()
    const unsubscribe = mockStore.subscribe(() => {
      refreshData()
    })
    return () => {
      unsubscribe()
    }
  }, [])

  // Build department stats
  const departments = [...new Set(categories.map((c) => c.department))]

  const deptStats = departments.map((dept) => {
    const deptCategoryIds = categories
      .filter((c) => c.department === dept)
      .map((c) => c.id)
    const deptIssues = issues.filter((i) => deptCategoryIds.includes(i.category_id))
    return {
      dept,
      total: deptIssues.length,
      open: deptIssues.filter((i) => i.status === 'open').length,
      in_progress: deptIssues.filter((i) => i.status === 'in_progress').length,
      escalated: deptIssues.filter((i) => i.status === 'escalated').length,
      resolved: deptIssues.filter((i) => i.status === 'resolved').length,
    }
  })

  // Global totals
  const totalOpen = issues.filter((i) => i.status === 'open').length
  const totalInProgress = issues.filter((i) => i.status === 'in_progress').length
  const totalEscalated = issues.filter((i) => i.status === 'escalated').length
  const totalResolved = issues.filter((i) => i.status === 'resolved').length

  const escalatedIssues = issues.filter((i) => i.status === 'escalated')

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  const resolutionRate = issues.length > 0
    ? Math.round((totalResolved / issues.length) * 100)
    : 0

  const handleAuthorityResolve = (issueId: string) => {
    mockStore.updateIssueStatus(
      issueId,
      'resolved',
      'Directly resolved and approved by Dean Office.'
    )
    setActionDone(issueId)
    setTimeout(() => setActionDone(null), 2500)
  }

  const handleAuthorityDeescalate = (issueId: string) => {
    mockStore.updateIssueStatus(
      issueId,
      'in_progress',
      'Remanded back to department warden with 12h resolution mandate by Dean.'
    )
    setActionDone(issueId)
    setTimeout(() => setActionDone(null), 2500)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Authority &amp; Dean Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Campus-wide governance, resolution monitoring, and SLA breach interventions.
          </p>
        </div>
        <span className="badge bg-purple-50 text-purple-700 border-purple-200 font-semibold self-start sm:self-center">
          Dean of Campus Affairs
        </span>
      </div>

      {/* Global Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Open Issues', count: totalOpen, color: 'text-blue-700 bg-blue-50/70 border-blue-200', icon: Inbox },
          { label: 'In Progress', count: totalInProgress, color: 'text-amber-700 bg-amber-50/70 border-amber-200', icon: Zap },
          { label: 'Escalations', count: totalEscalated, color: 'text-red-700 bg-red-50/70 border-red-200', icon: AlertTriangle },
          { label: 'Resolved Tickets', count: totalResolved, color: 'text-emerald-700 bg-emerald-50/70 border-emerald-200', icon: CheckCircle },
        ].map(({ label, count, color, icon: Icon }) => (
          <div key={label} className={`card p-4 border rounded-xl ${color}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold">{label}</span>
              <Icon size={16} />
            </div>
            <p className="text-2xl font-bold mt-1">{count}</p>
          </div>
        ))}
      </div>

      {/* Resolution Rate Card */}
      <div className="card p-5 border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-primary-600" />
            <span className="text-sm font-semibold text-slate-800">Campus-Wide Resolution Rate</span>
          </div>
          <span className="text-xl font-extrabold text-primary-600">{resolutionRate}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-primary-600 h-2.5 rounded-full transition-all duration-700"
            style={{ width: `${resolutionRate}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-xs text-slate-400 mt-2">
          <span>{totalResolved} of {issues.length} total campus issues resolved</span>
          <span>Target: &gt; 85% within SLA</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 bg-slate-200/70 p-1.5 rounded-xl border border-slate-200 w-fit">
        {([
          { id: 'overview', label: 'Department Overview', icon: BarChart2 },
          { id: 'all', label: `All Issues (${issues.length})`, icon: Inbox },
          { id: 'escalated', label: `Escalations (${totalEscalated})`, icon: AlertTriangle },
        ] as const).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 py-2 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === id
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Icon size={14} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* === OVERVIEW TAB === */}
      {activeTab === 'overview' && (
        <div className="space-y-3 animate-slide-up">
          {deptStats.map((d) => (
            <div key={d.dept} className="card p-5 border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                    <Building2 size={16} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{d.dept} Department</h3>
                    <p className="text-[11px] text-slate-400">{d.total} total logged issues</p>
                  </div>
                </div>

                {d.escalated > 0 && (
                  <span className="badge bg-red-50 text-red-700 border border-red-200">
                    <AlertTriangle size={11} />
                    {d.escalated} Escalated
                  </span>
                )}
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { label: 'Open', count: d.open, color: 'text-blue-600 bg-blue-50/50' },
                  { label: 'In Progress', count: d.in_progress, color: 'text-amber-600 bg-amber-50/50' },
                  { label: 'Escalated', count: d.escalated, color: 'text-red-600 bg-red-50/50' },
                  { label: 'Resolved', count: d.resolved, color: 'text-emerald-600 bg-emerald-50/50' },
                ].map(({ label, count, color }) => (
                  <div key={label} className={`rounded-xl p-2.5 border border-slate-100 ${color}`}>
                    <div className="text-lg font-bold">{count}</div>
                    <div className="text-[11px] text-slate-500 font-medium">{label}</div>
                  </div>
                ))}
              </div>

              {d.total > 0 && (
                <div className="mt-3">
                  <div className="flex h-2 rounded-full overflow-hidden bg-slate-100 gap-0.5">
                    {d.open > 0 && (
                      <div className="bg-blue-500" style={{ width: `${(d.open / d.total) * 100}%` }} title="Open" />
                    )}
                    {d.in_progress > 0 && (
                      <div className="bg-amber-500" style={{ width: `${(d.in_progress / d.total) * 100}%` }} title="In Progress" />
                    )}
                    {d.escalated > 0 && (
                      <div className="bg-red-500" style={{ width: `${(d.escalated / d.total) * 100}%` }} title="Escalated" />
                    )}
                    {d.resolved > 0 && (
                      <div className="bg-emerald-500" style={{ width: `${(d.resolved / d.total) * 100}%` }} title="Resolved" />
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* === ESCALATED TAB === */}
      {activeTab === 'escalated' && (
        <div className="space-y-4 animate-slide-up">
          {escalatedIssues.length === 0 ? (
            <div className="card p-10 text-center border-slate-200">
              <CheckCircle size={36} className="mx-auto text-emerald-500 mb-2" />
              <p className="text-slate-700 text-sm font-semibold">Zero Pending Escalations</p>
              <p className="text-slate-400 text-xs mt-0.5">All escalated tickets have been resolved.</p>
            </div>
          ) : (
            escalatedIssues.map((issue) => (
              <div key={issue.id} className="card border-red-200 bg-white p-5 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                        #{issue.tracking_id}
                      </span>
                      <StatusBadge status={issue.status} />
                      <PriorityBadge priority={issue.priority} />
                      {issue.categories && (
                        <span className="badge bg-slate-100 text-slate-600 border border-slate-200 text-[11px]">
                          {issue.categories.name} ({issue.categories.department})
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-semibold text-slate-900 mt-2">
                      {issue.description}
                    </p>

                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-2">
                      <Clock size={12} />
                      <span>Reported {formatDate(issue.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Escalation history records */}
                {escalations
                  .filter((e) => e.issue_id === issue.id)
                  .map((esc) => (
                    <div key={esc.id} className="bg-red-50/80 border border-red-200 rounded-xl p-3.5 text-xs">
                      <div className="flex items-center justify-between text-red-800 font-semibold mb-1">
                        <span>Escalation Notice: {esc.from_role.toUpperCase()} → {esc.to_role.toUpperCase()}</span>
                        <span className="text-[11px] text-red-500 font-normal">{formatDate(esc.created_at)}</span>
                      </div>
                      <p className="text-red-700 leading-relaxed">{esc.reason}</p>
                    </div>
                  ))}

                {/* Authority Intervention Action Bar */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  {actionDone === issue.id ? (
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                      <Check size={14} className="text-emerald-600" />
                      Action executed successfully!
                    </span>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleAuthorityResolve(issue.id)}
                        className="btn-primary text-xs py-2 px-3 bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Check size={13} />
                        Directly Resolve Ticket
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAuthorityDeescalate(issue.id)}
                        className="btn-secondary text-xs py-2 px-3 border-slate-300 text-slate-700 hover:bg-slate-50"
                      >
                        <ArrowDownRight size={13} />
                        Remand to Staff with 12h Mandate
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* === ALL ISSUES TAB === */}
      {activeTab === 'all' && (
        <div className="space-y-3 animate-slide-up">
          {issues.length === 0 ? (
            <div className="card p-10 text-center border-slate-200">
              <Inbox size={36} className="mx-auto text-slate-300 mb-2" />
              <p className="text-slate-600 text-sm font-semibold">No issues reported yet</p>
            </div>
          ) : (
            issues.map((issue) => (
              <div key={issue.id} className="card p-4 sm:p-5 border-slate-200 bg-white space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                    #{issue.tracking_id}
                  </span>
                  <StatusBadge status={issue.status} />
                  <PriorityBadge priority={issue.priority} />
                  {issue.categories && (
                    <span className="badge bg-slate-50 text-slate-600 border border-slate-200 text-[11px]">
                      {issue.categories.name} ({issue.categories.department})
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-800 font-medium">{issue.description}</p>
                {issue.staff_notes && (
                  <div className="bg-blue-50/70 border border-blue-100 rounded-lg p-2.5 text-xs text-blue-900">
                    <span className="font-semibold text-blue-800">Staff Note: </span>
                    {issue.staff_notes}
                  </div>
                )}
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock size={12} />
                  <span>Reported {formatDate(issue.created_at)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
