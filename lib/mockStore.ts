'use client'

import type { Role, IssueStatus, IssuePriority, Profile, Category, Issue, EscalationLog, Feedback } from './types'

const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Hostel Room Maintenance',
    keywords: ['fan', 'light', 'bed', 'door', 'lock', 'window', 'cupboard'],
    sla_hours: 24,
    department: 'Hostel',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'cat-2',
    name: 'Water Supply & Plumbing',
    keywords: ['water', 'tap', 'leak', 'washroom', 'drain', 'geyser', 'flush'],
    sla_hours: 12,
    department: 'Hostel',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'cat-3',
    name: 'Electrical & Wiring',
    keywords: ['switch', 'spark', 'short circuit', 'mcb', 'power', 'socket'],
    sla_hours: 8,
    department: 'Hostel',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'cat-4',
    name: 'Mess Food Quality',
    keywords: ['food', 'taste', 'uncooked', 'meal', 'breakfast', 'lunch', 'dinner'],
    sla_hours: 24,
    department: 'Mess',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'cat-5',
    name: 'Mess Hygiene & Dining Area',
    keywords: ['cleanliness', 'plates', 'insects', 'flies', 'drinking water', 'table'],
    sla_hours: 12,
    department: 'Mess',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'cat-6',
    name: 'Campus Wi-Fi & Internet',
    keywords: ['wifi', 'network', 'lan', 'disconnect', 'slow', 'login portal'],
    sla_hours: 12,
    department: 'IT',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'cat-7',
    name: 'Computer Lab Systems',
    keywords: ['pc', 'system', 'mouse', 'keyboard', 'monitor', 'software'],
    sla_hours: 24,
    department: 'IT',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'cat-8',
    name: 'College Bus & Route Schedule',
    keywords: ['bus', 'driver', 'late', 'route', 'pickup', 'commute'],
    sla_hours: 24,
    department: 'Transport',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'cat-9',
    name: 'Classroom Projector & AC',
    keywords: ['projector', 'ac', 'mic', 'speaker', 'audio', 'board'],
    sla_hours: 24,
    department: 'Academics',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'cat-10',
    name: 'Student ID & Certificates',
    keywords: ['id card', 'bonafide', 'certificate', 'fees', 'verification'],
    sla_hours: 48,
    department: 'Administration',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
]

export const DEMO_PROFILES: Record<Role, Profile> = {
  student: {
    id: 'usr-student-1',
    user_id: 'STU-2024-089',
    email: 'student@campus.edu',
    password: 'student@123',
    full_name: 'Rahul Sharma',
    role: 'student',
    department: null,
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
  staff: {
    id: 'usr-staff-1',
    user_id: 'STF-HOSTEL-012',
    email: 'warden.hostel@campus.edu',
    password: 'staff@123',
    full_name: 'Vikram Patel',
    role: 'staff',
    department: 'Hostel',
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
  authority: {
    id: 'usr-auth-1',
    user_id: 'AUTH-DEAN-001',
    email: 'dean.affairs@campus.edu',
    password: 'dean@123',
    full_name: 'Dr. Ananya Sen (Dean)',
    role: 'authority',
    department: null,
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
  admin: {
    id: 'usr-admin-1',
    user_id: 'ADM-ROOT-099',
    email: 'admin@campus.edu',
    password: 'admin@123',
    full_name: 'System Administrator',
    role: 'admin',
    department: null,
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
}

const INITIAL_ISSUES: Issue[] = [
  {
    id: 'iss-1',
    tracking_id: 'IRP-2026-1042',
    category_id: 'cat-2',
    description: 'Room 304, Block B: Bathroom tap is leaking continuously and hot water geyser is not turning on since this morning.',
    photo_url: null,
    status: 'in_progress',
    priority: 'high',
    submitted_by: 'usr-student-1',
    current_handler_role: 'staff',
    staff_notes: 'Hostel maintenance plumber notified. Replacement valve dispatched.',
    created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 3600000).toISOString(),
  },
  {
    id: 'iss-2',
    tracking_id: 'IRP-2026-1088',
    category_id: 'cat-6',
    description: 'Block C 2nd floor Wi-Fi access point restarts every 15 minutes, dropping connection during evening study hours.',
    photo_url: null,
    status: 'open',
    priority: 'medium',
    submitted_by: 'usr-student-1',
    current_handler_role: 'staff',
    staff_notes: null,
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: 'iss-3',
    tracking_id: 'IRP-2026-0951',
    category_id: 'cat-4',
    description: 'Hostel Mess Hall 2: Undercooked food and unhygienic drinking water filter tap. Multiple students faced stomach issues.',
    photo_url: null,
    status: 'escalated',
    priority: 'critical',
    submitted_by: 'usr-student-1',
    current_handler_role: 'authority',
    staff_notes: 'Repeated hygiene warning to mess contractor. Escalated to Dean Campus Affairs for penalty review.',
    created_at: new Date(Date.now() - 18 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 3600000).toISOString(),
  },
  {
    id: 'iss-4',
    tracking_id: 'IRP-2026-0819',
    category_id: 'cat-3',
    description: 'Room 112 Block A: Wall socket spark when plugging in study laptop charger. Breaker tripped.',
    photo_url: null,
    status: 'resolved',
    priority: 'high',
    submitted_by: 'usr-student-1',
    current_handler_role: 'resolved',
    staff_notes: 'Electrician installed a new grounded modular socket and replaced faulty 16A switch.',
    created_at: new Date(Date.now() - 48 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 3600000).toISOString(),
  },
  {
    id: 'iss-5',
    tracking_id: 'IRP-2026-0740',
    category_id: 'cat-8',
    description: 'Route 4 morning college bus failed to arrive at Sector 14 stop, causing 20+ students to miss their 8:30 AM test.',
    photo_url: null,
    status: 'resolved',
    priority: 'medium',
    submitted_by: 'usr-student-2',
    current_handler_role: 'resolved',
    staff_notes: 'Bus 4 had a flat tyre; backup vehicle deployed. Driver schedule updated.',
    created_at: new Date(Date.now() - 72 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: 'iss-6',
    tracking_id: 'IRP-2026-0611',
    category_id: 'cat-1',
    description: 'Room 205 Block B: Main entrance door latch is broken, cannot lock room securely when going to class.',
    photo_url: null,
    status: 'open',
    priority: 'high',
    submitted_by: 'usr-student-3',
    current_handler_role: 'staff',
    staff_notes: null,
    created_at: new Date(Date.now() - 8 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 8 * 3600000).toISOString(),
  },
]

const INITIAL_ESCALATIONS: EscalationLog[] = [
  {
    id: 'esc-1',
    issue_id: 'iss-3',
    from_role: 'staff',
    to_role: 'authority',
    reason: 'SLA exceeded (12h limit) and repeated severe hygiene violation by mess caterer.',
    created_at: new Date(Date.now() - 4 * 3600000).toISOString(),
  },
]

const INITIAL_FEEDBACK: Feedback[] = [
  {
    id: 'fb-1',
    issue_id: 'iss-4',
    rating: 5,
    comment: 'Super fast fix! Electrician arrived in under 2 hours and replaced the entire switchboard.',
    created_at: new Date(Date.now() - 10 * 3600000).toISOString(),
  },
]

interface StoreState {
  currentUser: Profile | null
  categories: Category[]
  issues: Issue[]
  escalations: EscalationLog[]
  feedback: Feedback[]
}

const STORAGE_KEY = 'campus_irp_data_v3'

function getInitialState(): StoreState {
  if (typeof window === 'undefined') {
    return {
      currentUser: null,
      categories: INITIAL_CATEGORIES,
      issues: INITIAL_ISSUES,
      escalations: INITIAL_ESCALATIONS,
      feedback: INITIAL_FEEDBACK,
    }
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        currentUser: parsed.currentUser || null,
        categories: parsed.categories?.length ? parsed.categories : INITIAL_CATEGORIES,
        issues: parsed.issues?.length ? parsed.issues : INITIAL_ISSUES,
        escalations: parsed.escalations || INITIAL_ESCALATIONS,
        feedback: parsed.feedback || INITIAL_FEEDBACK,
      }
    }
  } catch (err) {
    console.error('Error loading mock store from localStorage:', err)
  }

  return {
    currentUser: null,
    categories: INITIAL_CATEGORIES,
    issues: INITIAL_ISSUES,
    escalations: INITIAL_ESCALATIONS,
    feedback: INITIAL_FEEDBACK,
  }
}

// In-memory singleton state
let state: StoreState = getInitialState()
const listeners = new Set<() => void>()

function syncFromStorage() {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      state = {
        currentUser: parsed.currentUser ?? state.currentUser,
        categories: parsed.categories?.length ? parsed.categories : INITIAL_CATEGORIES,
        issues: parsed.issues?.length ? parsed.issues : INITIAL_ISSUES,
        escalations: parsed.escalations || INITIAL_ESCALATIONS,
        feedback: parsed.feedback || INITIAL_FEEDBACK,
      }
    }
  } catch (err) {
    console.error('Error syncing mock store from localStorage:', err)
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      syncFromStorage()
      listeners.forEach((listener) => {
        try {
          listener()
        } catch (err) {
          console.error(err)
        }
      })
    }
  })
}

function persistState() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (err) {
      console.error('Error saving state to localStorage:', err)
    }
  }
  listeners.forEach((listener) => {
    try {
      listener()
    } catch (e) {
      console.error(e)
    }
  })
}

// Ensure state joins category object
function populateIssue(issue: Issue, categories: Category[]): Issue {
  const cat = categories.find((c) => c.id === issue.category_id)
  return {
    ...issue,
    categories: cat || {
      id: issue.category_id,
      name: 'General Campus',
      department: 'Hostel',
      keywords: [],
      sla_hours: 24,
      created_at: issue.created_at,
    },
  }
}

export const mockStore = {
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },

  getCurrentUser(): Profile | null {
    syncFromStorage()
    return state.currentUser
  },

  setCurrentUser(user: Profile | null) {
    state.currentUser = user
    persistState()
  },

  loginWithCredentials(params: {
    role: Role
    userId: string
    email: string
    password: string
  }): { success: boolean; user?: Profile; error?: string } {
    const profile = DEMO_PROFILES[params.role]
    if (!profile) {
      return { success: false, error: 'Invalid role selected.' }
    }

    const cleanInputUserId = params.userId.trim().toLowerCase()
    const cleanInputEmail = params.email.trim().toLowerCase()
    const cleanInputPassword = params.password.trim()

    const cleanExpectedUserId = profile.user_id.toLowerCase()
    const cleanExpectedEmail = profile.email.toLowerCase()
    const cleanExpectedPassword = (profile.password || '').trim()

    const matchesUserId = cleanInputUserId === cleanExpectedUserId
    const matchesEmail = cleanInputEmail === cleanExpectedEmail
    const matchesPassword = cleanInputPassword === cleanExpectedPassword

    if (!matchesUserId || !matchesEmail || !matchesPassword) {
      const issues: string[] = []
      if (!matchesUserId) issues.push('User ID')
      if (!matchesEmail) issues.push('Email')
      if (!matchesPassword) issues.push('Password')

      return {
        success: false,
        error: `Incorrect ${issues.join(' and ')} for ${profile.role.toUpperCase()} account. Please verify credentials.`,
      }
    }

    state.currentUser = profile
    persistState()
    return { success: true, user: profile }
  },

  signup(data: { fullName: string; email: string; role: Role; department?: string; password?: string }): Profile {
    const prefix = data.role === 'student' ? 'STU' : data.role === 'staff' ? 'STF' : data.role === 'authority' ? 'AUTH' : 'ADM'
    const randomNum = Math.floor(100 + Math.random() * 900)
    const newProfile: Profile = {
      id: `usr-${Date.now()}`,
      user_id: `${prefix}-2026-${randomNum}`,
      email: data.email,
      password: data.password || 'welcome@123',
      full_name: data.fullName,
      role: data.role,
      department: data.department || (data.role === 'staff' ? 'Hostel' : null),
      created_at: new Date().toISOString(),
    }
    state.currentUser = newProfile
    persistState()
    return newProfile
  },

  logout() {
    state.currentUser = null
    persistState()
  },

  getCategories(): Category[] {
    syncFromStorage()
    return state.categories
  },

  addCategory(category: Category): Category {
    syncFromStorage()
    state.categories = [...state.categories, category]
    persistState()
    return category
  },

  getIssues(): Issue[] {
    syncFromStorage()
    return state.issues.map((i) => populateIssue(i, state.categories))
  },

  getMyIssues(userId?: string): Issue[] {
    syncFromStorage()
    const uid = userId || state.currentUser?.id || 'usr-student-1'
    return state.issues
      .filter((i) => i.submitted_by === uid)
      .map((i) => populateIssue(i, state.categories))
  },

  getIssueByTrackingId(trackingId: string): Issue | null {
    syncFromStorage()
    const trimmed = trackingId.trim().toUpperCase()
    const found = state.issues.find(
      (i) => i.tracking_id.toUpperCase() === trimmed || i.id.toUpperCase() === trimmed
    )
    return found ? populateIssue(found, state.categories) : null
  },

  createIssue(params: {
    categoryId: string
    description: string
    priority: IssuePriority
    photoUrl?: string | null
    submittedBy?: string
  }): Issue {
    syncFromStorage()
    const trackingId = `IRP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
    const now = new Date().toISOString()
    const newIssue: Issue = {
      id: `iss-${Date.now()}`,
      tracking_id: trackingId,
      category_id: params.categoryId,
      description: params.description,
      photo_url: params.photoUrl || null,
      status: 'open',
      priority: params.priority,
      submitted_by: params.submittedBy || state.currentUser?.id || 'usr-student-1',
      current_handler_role: 'staff',
      staff_notes: null,
      created_at: now,
      updated_at: now,
    }

    state.issues = [newIssue, ...state.issues]
    persistState()
    return populateIssue(newIssue, state.categories)
  },

  updateIssueStatus(
    issueId: string,
    newStatus: IssueStatus,
    staffNotes?: string | null
  ): Issue | null {
    syncFromStorage()
    const index = state.issues.findIndex((i) => i.id === issueId)
    if (index === -1) return null

    const existing = state.issues[index]
    const updated: Issue = {
      ...existing,
      status: newStatus,
      staff_notes: staffNotes !== undefined ? staffNotes : existing.staff_notes,
      current_handler_role: newStatus === 'resolved' ? 'resolved' : newStatus === 'escalated' ? 'authority' : 'staff',
      updated_at: new Date().toISOString(),
    }

    state.issues[index] = updated

    // If escalated, add escalation log automatically
    if (newStatus === 'escalated' && existing.status !== 'escalated') {
      const escLog: EscalationLog = {
        id: `esc-${Date.now()}`,
        issue_id: issueId,
        from_role: 'staff',
        to_role: 'authority',
        reason: staffNotes || 'Escalated by department staff due to SLA / priority requirements.',
        created_at: new Date().toISOString(),
      }
      state.escalations = [escLog, ...state.escalations]
    }

    persistState()
    return populateIssue(updated, state.categories)
  },

  getEscalations(): EscalationLog[] {
    syncFromStorage()
    return state.escalations
  },

  getFeedback(issueId: string): Feedback | null {
    syncFromStorage()
    return state.feedback.find((f) => f.issue_id === issueId) || null
  },

  submitFeedback(issueId: string, rating: number, comment?: string | null): Feedback {
    syncFromStorage()
    const existingIndex = state.feedback.findIndex((f) => f.issue_id === issueId)
    const fb: Feedback = {
      id: existingIndex >= 0 ? state.feedback[existingIndex].id : `fb-${Date.now()}`,
      issue_id: issueId,
      rating,
      comment: comment || null,
      created_at: new Date().toISOString(),
    }

    if (existingIndex >= 0) {
      state.feedback[existingIndex] = fb
    } else {
      state.feedback = [fb, ...state.feedback]
    }

    persistState()
    return fb
  },

  resetToDefault() {
    state = {
      currentUser: null,
      categories: INITIAL_CATEGORIES,
      issues: INITIAL_ISSUES,
      escalations: INITIAL_ESCALATIONS,
      feedback: INITIAL_FEEDBACK,
    }
    persistState()
  },
}
