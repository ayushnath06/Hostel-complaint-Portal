import type { IssueStatus, IssuePriority } from '@/lib/types'
import { Clock, Zap, CheckCircle, AlertTriangle } from 'lucide-react'

const STATUS_CONFIG: Record<IssueStatus, { label: string; className: string; Icon: React.ElementType }> = {
  open: {
    label: 'Open',
    className: 'badge-open',
    Icon: Clock,
  },
  in_progress: {
    label: 'In Progress',
    className: 'badge-in_progress',
    Icon: Zap,
  },
  escalated: {
    label: 'Escalated',
    className: 'badge-escalated',
    Icon: AlertTriangle,
  },
  resolved: {
    label: 'Resolved',
    className: 'badge-resolved',
    Icon: CheckCircle,
  },
}

const PRIORITY_CONFIG: Record<IssuePriority, { label: string; className: string }> = {
  low: { label: 'Low', className: 'priority-low' },
  medium: { label: 'Medium', className: 'priority-medium' },
  high: { label: 'High', className: 'priority-high' },
  critical: { label: 'Critical', className: 'priority-critical' },
}

export function StatusBadge({ status }: { status: IssueStatus }) {
  const config = STATUS_CONFIG[status]
  if (!config) return null
  const { Icon } = config
  return (
    <span className={config.className}>
      <Icon size={11} />
      {config.label}
    </span>
  )
}

export function PriorityBadge({ priority }: { priority: IssuePriority }) {
  const config = PRIORITY_CONFIG[priority]
  if (!config) return null
  return <span className={config.className}>{config.label}</span>
}
