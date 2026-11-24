'use client'

import { useState, useEffect } from 'react'
import { mockStore } from '@/lib/mockStore'
import { StatusBadge, PriorityBadge } from '@/components/StatusBadge'
import type { Issue, IssueStatus, Category } from '@/lib/types'
import {
  Inbox, Clock, Filter, CheckCircle, Zap,
  ChevronDown, ChevronUp, AlertTriangle, RefreshCw,
  Building, MessageSquare, ArrowUpRight, Sparkles
} from 'lucide-react'

const STATUS_FILTERS: { label: string; value: IssueStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Escalated', value: 'escalated' },
  { label: 'Resolved', value: 'resolved' },
]

const ALL_DEPARTMENTS = ['All', 'Hostel', 'Mess', 'IT', 'Transport', 'Academics', 'Administration']

export function StaffDashboardClient() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [currentUser, setCurrentUser] = useState(mockStore.getCurrentUser())
  const [selectedDept, setSelectedDept] = useState<string>('All')
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'all'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({})
  const [updating, setUpdating] = useState<string | null>(null)

  const refreshData = () => {
    setIssues(mockStore.getIssues())
    setCategories(mockStore.getCategories())
    setCurrentUser(mockStore.getCurrentUser())
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

  // Filter issues by department & status
  const deptIssues = selectedDept === 'All'
    ? issues
    : issues.filter((i) => i.categories?.department === selectedDept)

  const filtered = statusFilter === 'all'
    ? deptIssues
    : deptIssues.filter((i) => i.status === statusFilter)

  const counts = {
    all: deptIssues.length,
    open: deptIssues.filter((i) => i.status === 'open').length,
    in_progress: deptIssues.filter((i) => i.status === 'in_progress').length,
    escalated: deptIssues.filter((i) => i.status === 'escalated').length,
    resolved: deptIssues.filter((i) => i.status === 'resolved').length,
  }

  const handleStatusUpdate = (issueId: string, newStatus: IssueStatus) => {
    setUpdating(issueId)
    const note = noteInputs[issueId]
    mockStore.updateIssueStatus(issueId, newStatus, note)
    setUpdating(null)
    setExpandedId(null)
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Staff / Warden Queue</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Resolve student maintenance requests, log updates, or escalate to Dean.
          </p>
        </div>

        {/* Department Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Building size={13} />
            Dept:
          </span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="input py-1.5 px-3 text-xs font-semibold bg-white w-auto"
          >
            {ALL_DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Status Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card p-3.5 bg-blue-50/70 border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-700">Open Tickets</span>
            <Inbox size={16} className="text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-900 mt-1">{counts.open}</p>
        </div>

        <div className="card p-3.5 bg-amber-50/70 border-amber-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700">In Progress</span>
            <Zap size={16} className="text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-900 mt-1">{counts.in_progress}</p>
        </div>

        <div className="card p-3.5 bg-red-50/70 border-red-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-red-700">Escalated</span>
            <AlertTriangle size={16} className="text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-900 mt-1">{counts.escalated}</p>
        </div>

        <div className="card p-3.5 bg-emerald-50/70 border-emerald-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700">Resolved</span>
            <CheckCircle size={16} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-900 mt-1">{counts.resolved}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 bg-slate-200/70 p-1.5 rounded-xl border border-slate-200 overflow-x-auto">
        {STATUS_FILTERS.map(({ label, value }) => {
          const count = counts[value]
          const active = statusFilter === value
          return (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`flex-1 min-w-[80px] py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                active
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <span>{label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${active ? 'bg-slate-100 text-slate-800' : 'text-slate-400'}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Issues List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="card p-10 text-center border-slate-200">
            <Inbox size={36} className="mx-auto text-slate-300 mb-2" />
            <p className="text-slate-600 text-sm font-semibold">No issues in this view</p>
            <p className="text-slate-400 text-xs mt-0.5">
              Great job! All {selectedDept !== 'All' ? selectedDept : ''} tickets are settled.
            </p>
          </div>
        ) : (
          filtered.map((issue) => (
            <div key={issue.id} className="card-hover overflow-hidden border border-slate-200 bg-white">
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
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

                    <p className="text-sm font-medium text-slate-800 leading-snug">
                      {issue.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {formatDate(issue.created_at)}
                      </span>
                      {issue.categories && (
                        <span>SLA Target: {issue.categories.sla_hours} hours</span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setExpandedId(expandedId === issue.id ? null : issue.id)}
                    className="btn-secondary text-xs py-1.5 px-3 shrink-0"
                  >
                    <span>{expandedId === issue.id ? 'Close' : 'Actions & Notes'}</span>
                    {expandedId === issue.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>

                {/* Staff Notes existing display */}
                {issue.staff_notes && expandedId !== issue.id && (
                  <div className="mt-3 p-2.5 rounded-lg bg-blue-50/60 border border-blue-100 text-xs text-blue-900">
                    <span className="font-semibold text-blue-800">Current Note: </span>
                    {issue.staff_notes}
                  </div>
                )}
              </div>

              {/* Action Drawer */}
              {expandedId === issue.id && (
                <div className="px-4 sm:px-5 pb-5 pt-3 border-t border-slate-100 bg-slate-50/70 space-y-4 animate-fade-in">
                  {issue.photo_url && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Attached Photo</p>
                      <img
                        src={issue.photo_url}
                        alt="Issue"
                        className="rounded-lg max-h-52 object-contain bg-white border border-slate-200"
                      />
                    </div>
                  )}

                  {/* Note input */}
                  <div>
                    <label className="label text-xs">
                      Update Staff / Resolver Note
                    </label>
                    <textarea
                      rows={2}
                      value={noteInputs[issue.id] !== undefined ? noteInputs[issue.id] : (issue.staff_notes || '')}
                      onChange={(e) =>
                        setNoteInputs((prev) => ({ ...prev, [issue.id]: e.target.value }))
                      }
                      placeholder="e.g. Plumber Mohan assigned to Room 304. Parts sourced from central store."
                      className="input text-xs"
                    />

                    {/* Quick Presets */}
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <span className="text-[11px] text-slate-400">Quick inserts:</span>
                      {[
                        'Technician assigned & on-site.',
                        'Spare parts ordered from vendor.',
                        'Repair inspected and completed.',
                        'Breached SLA - escalated to Dean.',
                      ].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() =>
                            setNoteInputs((prev) => ({ ...prev, [issue.id]: preset }))
                          }
                          className="text-[10px] px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Status Action Buttons */}
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    <button
                      type="button"
                      disabled={updating === issue.id || issue.status === 'in_progress'}
                      onClick={() => handleStatusUpdate(issue.id, 'in_progress')}
                      className="btn-secondary text-xs py-2 px-3 border-amber-300 text-amber-800 hover:bg-amber-50"
                    >
                      <Zap size={14} className="text-amber-500" />
                      Mark In Progress
                    </button>

                    <button
                      type="button"
                      disabled={updating === issue.id || issue.status === 'resolved'}
                      onClick={() => handleStatusUpdate(issue.id, 'resolved')}
                      className="btn-primary text-xs py-2 px-4 bg-emerald-600 hover:bg-emerald-700"
                    >
                      <CheckCircle size={14} />
                      Resolve &amp; Close Ticket
                    </button>

                    <button
                      type="button"
                      disabled={updating === issue.id || issue.status === 'escalated'}
                      onClick={() => handleStatusUpdate(issue.id, 'escalated')}
                      className="btn-secondary text-xs py-2 px-3 border-red-300 text-red-700 hover:bg-red-50 ml-auto"
                    >
                      <ArrowUpRight size={14} className="text-red-500" />
                      Escalate to Dean
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
