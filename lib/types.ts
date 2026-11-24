export type Role = 'student' | 'staff' | 'authority' | 'admin'
export type IssueStatus = 'open' | 'in_progress' | 'escalated' | 'resolved'
export type IssuePriority = 'low' | 'medium' | 'high' | 'critical'

export interface Profile {
  id: string
  user_id: string
  email: string
  password?: string
  full_name: string
  role: Role
  department: string | null
  created_at: string
}

export interface Category {
  id: string
  name: string
  keywords: string[]
  sla_hours: number
  department: string
  created_at: string
}

export interface Issue {
  id: string
  tracking_id: string
  category_id: string
  description: string
  photo_url: string | null
  status: IssueStatus
  priority: IssuePriority
  submitted_by?: string // only visible to own student
  current_handler_role: string
  staff_notes: string | null
  created_at: string
  updated_at: string
  // joined
  categories?: Category
}

export interface EscalationLog {
  id: string
  issue_id: string
  from_role: string
  to_role: string
  reason: string
  created_at: string
}

export interface Feedback {
  id: string
  issue_id: string
  rating: number
  comment: string | null
  created_at: string
}
