'use client'

import { useState, useEffect } from 'react'
import { mockStore } from '@/lib/mockStore'
import { StatusBadge, PriorityBadge } from '@/components/StatusBadge'
import { FeedbackForm } from '@/components/FeedbackForm'
import type { Category, Issue, IssuePriority } from '@/lib/types'
import {
  PlusCircle, Search, Upload, X, Copy, Check, FileText,
  Clock, ChevronDown, ChevronUp, Image as ImageIcon, Sparkles
} from 'lucide-react'

export function StudentDashboardClient() {
  const [tab, setTab] = useState<'submit' | 'track' | 'myissues'>('submit')
  const [categories, setCategories] = useState<Category[]>([])
  const [myIssues, setMyIssues] = useState<Issue[]>([])
  const [currentUser, setCurrentUser] = useState(mockStore.getCurrentUser())

  // Submit form state
  const [form, setForm] = useState({
    categoryId: '',
    description: '',
    priority: 'medium' as IssuePriority,
  })
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [newTrackingId, setNewTrackingId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Track tab state
  const [trackingInput, setTrackingInput] = useState('')
  const [trackedIssue, setTrackedIssue] = useState<Issue | null>(null)
  const [trackError, setTrackError] = useState('')
  const [tracking, setTracking] = useState(false)

  // My issues state
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Sync with mock store
  const refreshData = () => {
    setCategories(mockStore.getCategories())
    setMyIssues(mockStore.getMyIssues())
    setCurrentUser(mockStore.getCurrentUser())
    setTrackedIssue((prev) => (prev ? mockStore.getIssueByTrackingId(prev.tracking_id) : null))
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

  // Auto-select first category if none selected
  useEffect(() => {
    if (categories.length > 0 && !form.categoryId) {
      setForm((prev) => ({ ...prev, categoryId: categories[0].id }))
    }
  }, [categories, form.categoryId])

  // Photo change handler converting to base64 Data URL
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setPhotoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.categoryId || !form.description.trim()) return
    setSubmitting(true)

    const created = mockStore.createIssue({
      categoryId: form.categoryId,
      description: form.description.trim(),
      priority: form.priority,
      photoUrl: photoPreview,
      submittedBy: currentUser?.id || 'usr-student-1',
    })

    // Force-refresh My Issues immediately so the tab is up-to-date
    setMyIssues(mockStore.getMyIssues())
    setNewTrackingId(created.tracking_id)
    setForm({
      categoryId: categories[0]?.id || '',
      description: '',
      priority: 'medium',
    })
    setPhotoPreview(null)
    setSubmitting(false)
  }

  const copyTrackingId = async () => {
    if (!newTrackingId) return
    try {
      await navigator.clipboard.writeText(newTrackingId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Track issue handler
  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackingInput.trim()) return
    setTracking(true)
    setTrackError('')
    setTrackedIssue(null)

    const found = mockStore.getIssueByTrackingId(trackingInput)
    if (!found) {
      setTrackError('No issue found with that tracking ID. Please verify the code (e.g. IRP-2026-1042).')
    } else {
      setTrackedIssue(found)
    }
    setTracking(false)
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Student Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Privacy-Protected: Submissions are anonymous to wardens and staff.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
            <Sparkles size={12} className="text-blue-500" />
            Student Portal
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 bg-slate-200/70 p-1.5 rounded-xl border border-slate-200">
        {([
          { id: 'submit', label: 'Report Issue', icon: PlusCircle },
          { id: 'track', label: 'Track Issue', icon: Search },
          { id: 'myissues', label: `My Issues (${myIssues.length})`, icon: FileText },
        ] as const).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 ${
              tab === id
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Icon size={15} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* === SUBMIT TAB === */}
      {tab === 'submit' && (
        <div className="card p-6 shadow-sm border-slate-200 animate-slide-up">
          {newTrackingId ? (
            <div className="text-center space-y-5 py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto shadow-sm">
                <Check size={34} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-xl">Issue Successfully Logged!</h3>
                <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-md mx-auto">
                  Your ticket has been dispatched to the department staff. Keep your tracking ID safe to monitor progress.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-md mx-auto">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Anonymous Tracking ID
                </p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl sm:text-3xl font-mono font-bold text-primary-700 tracking-wider">
                    {newTrackingId}
                  </span>
                  <button
                    onClick={copyTrackingId}
                    className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
                <button
                  onClick={() => setNewTrackingId(null)}
                  className="btn-secondary flex-1 py-2.5 text-xs font-semibold"
                >
                  <PlusCircle size={15} />
                  Report Another Issue
                </button>
                <button
                  onClick={() => {
                    setTrackingInput(newTrackingId ?? '')
                    setNewTrackingId(null)
                    setTab('track')
                  }}
                  className="btn-primary flex-1 py-2.5 text-xs font-semibold"
                >
                  <Search size={15} />
                  Track Live Progress
                </button>
              </div>
              <button
                onClick={() => {
                  setMyIssues(mockStore.getMyIssues())
                  setNewTrackingId(null)
                  setTab('myissues')
                }}
                className="btn-secondary w-full max-w-md mx-auto py-2.5 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <FileText size={15} />
                View in My Issues
              </button>
            </div>
          ) : (
            <>
              <div className="mb-5">
                <h2 className="text-base font-bold text-slate-900">File a Grievance or Repair Request</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your name and identity are hidden from the resolver to ensure fair resolution.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="label">Category / Area</label>
                    <select
                      id="category"
                      value={form.categoryId}
                      onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                      className="input"
                      required
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.department} • SLA {c.sla_hours}h)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="priority" className="label">Severity / Priority</label>
                    <select
                      id="priority"
                      value={form.priority}
                      onChange={(e) => setForm({ ...form, priority: e.target.value as IssuePriority })}
                      className="input"
                    >
                      <option value="low">Low — Minor inconvenience (within 48h)</option>
                      <option value="medium">Medium — Affects daily routine</option>
                      <option value="high">High — Significant disruption / urgently needed</option>
                      <option value="critical">Critical — Safety, water, or electrical emergency</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="label">
                    Issue Details (Block, Room No., Specific Grievance)
                  </label>
                  <textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="input min-h-[110px] resize-y"
                    placeholder="e.g. Room 204 Block A: Washroom tap handle broke and water is leaking continuously on the floor. Please send plumber."
                    required
                    maxLength={1000}
                  />
                  <div className="flex justify-between items-center text-xs text-slate-400 mt-1">
                    <span>Do not include personal confidential details</span>
                    <span>{form.description.length}/1000</span>
                  </div>
                </div>

                <div>
                  <label className="label">Attach Photo (Optional)</label>
                  {photoPreview ? (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-2">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-44 object-contain rounded-lg bg-black/5"
                      />
                      <button
                        type="button"
                        onClick={() => setPhotoPreview(null)}
                        className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition-colors shadow"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="photo-upload"
                      className="flex flex-col items-center justify-center gap-2 w-full h-28 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition-all duration-150"
                    >
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <Upload size={18} />
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-semibold text-primary-600">Click to upload photo</span>
                        <p className="text-[11px] text-slate-400">PNG, JPG, or JPEG up to 5MB</p>
                      </div>
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handlePhotoChange}
                      />
                    </label>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full py-2.5 font-semibold text-xs sm:text-sm mt-2 shadow-sm"
                >
                  <PlusCircle size={16} />
                  <span>{submitting ? 'Submitting...' : 'Submit Issue Anonymously'}</span>
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* === TRACK TAB === */}
      {tab === 'track' && (
        <div className="space-y-4 animate-slide-up">
          <div className="card p-6 shadow-sm border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-1">Track Live Issue Status</h2>
            <p className="text-xs text-slate-500 mb-4">
              Enter the unique tracking ID assigned to your issue (e.g. IRP-2026-1042).
            </p>

            <form onSubmit={handleTrack} className="flex gap-2">
              <input
                type="text"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value.toUpperCase())}
                className="input flex-1 font-mono uppercase tracking-widest text-sm"
                placeholder="e.g. IRP-2026-1042"
                required
              />
              <button type="submit" disabled={tracking} className="btn-primary px-5 shrink-0">
                <Search size={16} />
                <span className="hidden sm:inline text-xs font-semibold">Track</span>
              </button>
            </form>

            {/* Quick Demo Tracking Buttons */}
            <div className="mt-3 flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-400">Try demo tickets:</span>
              {['IRP-2026-1042', 'IRP-2026-0951', 'IRP-2026-0819'].map((demoId) => (
                <button
                  key={demoId}
                  type="button"
                  onClick={() => {
                    setTrackingInput(demoId)
                    const found = mockStore.getIssueByTrackingId(demoId)
                    setTrackedIssue(found)
                    setTrackError('')
                  }}
                  className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  {demoId}
                </button>
              ))}
            </div>

            {trackError && (
              <div className="p-3 mt-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {trackError}
              </div>
            )}
          </div>

          {/* Track Result Card */}
          {trackedIssue && (
            <div className="card p-6 shadow-sm border-slate-200 animate-slide-up space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-lg font-bold text-slate-900 tracking-wide">
                      #{trackedIssue.tracking_id}
                    </span>
                    <StatusBadge status={trackedIssue.status} />
                    <PriorityBadge priority={trackedIssue.priority} />
                  </div>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <Clock size={12} />
                    <span>Reported {formatDate(trackedIssue.created_at)}</span>
                  </p>
                </div>

                {trackedIssue.categories && (
                  <span className="badge bg-slate-100 text-slate-700 border border-slate-200 self-start sm:self-center">
                    {trackedIssue.categories.name} ({trackedIssue.categories.department})
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Issue Summary
                </p>
                <p className="text-sm text-slate-800 leading-relaxed">{trackedIssue.description}</p>
              </div>

              {/* Staff / Authority Notes */}
              {trackedIssue.staff_notes && (
                <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-blue-800 uppercase tracking-wider mb-1">
                    Staff &amp; Resolution Notes
                  </p>
                  <p className="text-xs sm:text-sm text-blue-900 leading-relaxed">{trackedIssue.staff_notes}</p>
                </div>
              )}

              {/* Photo Display */}
              {trackedIssue.photo_url && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <ImageIcon size={13} />
                    Attached Photo
                  </p>
                  <img
                    src={trackedIssue.photo_url}
                    alt="Issue attachment"
                    className="rounded-xl w-full max-h-64 object-contain bg-slate-100 border border-slate-200"
                  />
                </div>
              )}

              {/* Resolution Progress Bar */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Resolution Progress
                </p>
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-medium">
                  <div
                    className={`p-2 rounded-lg border ${
                      ['open', 'in_progress', 'resolved', 'escalated'].includes(trackedIssue.status)
                        ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    1. Submitted
                  </div>
                  <div
                    className={`p-2 rounded-lg border ${
                      trackedIssue.status === 'escalated'
                        ? 'bg-red-50 border-red-300 text-red-700 font-bold'
                        : ['in_progress', 'resolved'].includes(trackedIssue.status)
                        ? 'bg-amber-50 border-amber-300 text-amber-700 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    {trackedIssue.status === 'escalated' ? '2. Escalated (Dean)' : '2. In Progress'}
                  </div>
                  <div
                    className={`p-2 rounded-lg border ${
                      trackedIssue.status === 'resolved'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    3. Resolved &amp; Closed
                  </div>
                </div>
              </div>

              {/* Feedback Form if Resolved */}
              {trackedIssue.status === 'resolved' && (
                <div className="pt-2">
                  <FeedbackForm issueId={trackedIssue.id} />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* === MY ISSUES TAB === */}
      {tab === 'myissues' && (
        <div className="space-y-3 animate-slide-up">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-base font-bold text-slate-900">My Registered Grievances</h2>
            <span className="text-xs text-slate-400">{myIssues.length} total</span>
          </div>

          {myIssues.length === 0 ? (
            <div className="card p-10 text-center border-slate-200">
              <FileText size={36} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-600 text-sm font-semibold">No issues submitted yet</p>
              <p className="text-slate-400 text-xs mt-1">Have a maintenance or hostel problem? File a report.</p>
              <button
                onClick={() => setTab('submit')}
                className="btn-primary mt-4 text-xs font-semibold"
              >
                <PlusCircle size={14} />
                File a Report
              </button>
            </div>
          ) : (
            myIssues.map((issue) => (
              <div key={issue.id} className="card-hover overflow-hidden border border-slate-200 bg-white">
                <button
                  type="button"
                  className="w-full p-4 text-left focus:outline-none"
                  onClick={() => setExpandedId(expandedId === issue.id ? null : issue.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                          #{issue.tracking_id}
                        </span>
                        <StatusBadge status={issue.status} />
                        <PriorityBadge priority={issue.priority} />
                        {issue.categories && (
                          <span className="text-[11px] text-slate-500 font-medium">
                            • {issue.categories.name}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 font-medium line-clamp-1">
                        {issue.description}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                        <Clock size={11} />
                        <span>{formatDate(issue.created_at)}</span>
                      </p>
                    </div>

                    <div className="text-slate-400 shrink-0 mt-1">
                      {expandedId === issue.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>
                </button>

                {expandedId === issue.id && (
                  <div className="px-4 pb-4 border-t border-slate-100 pt-3 space-y-3 bg-slate-50/50 animate-fade-in">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Full Description</p>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                        {issue.description}
                      </p>
                    </div>

                    {issue.staff_notes && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs font-semibold text-blue-800 mb-0.5">Staff Notes</p>
                        <p className="text-xs sm:text-sm text-blue-900">{issue.staff_notes}</p>
                      </div>
                    )}

                    {issue.photo_url && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">Attached Photo</p>
                        <img
                          src={issue.photo_url}
                          alt="Issue visual"
                          className="rounded-lg w-full max-h-56 object-contain bg-white border border-slate-200"
                        />
                      </div>
                    )}

                    {issue.status === 'resolved' && (
                      <div className="pt-2">
                        <FeedbackForm issueId={issue.id} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
