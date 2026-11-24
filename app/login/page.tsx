'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { mockStore, DEMO_PROFILES } from '@/lib/mockStore'
import {
  Building2, GraduationCap, Wrench, ShieldAlert,
  ShieldCheck, ArrowRight, Eye, EyeOff, AlertCircle,
  KeyRound, Sparkles, Check, Lock, User
} from 'lucide-react'
import type { Role } from '@/lib/types'

const ROLE_CARDS: {
  role: Role
  title: string
  subtitle: string
  icon: React.ElementType
  colorClass: string
  borderClass: string
  activeRing: string
  badgeColor: string
}[] = [
  {
    role: 'student',
    title: 'Student',
    subtitle: 'Hostel & Campus Grievance Filing',
    icon: GraduationCap,
    colorClass: 'text-blue-600 bg-blue-50',
    borderClass: 'border-blue-200 hover:border-blue-400',
    activeRing: 'ring-2 ring-blue-600 border-blue-500 bg-blue-50/40',
    badgeColor: 'bg-blue-100 text-blue-800',
  },
  {
    role: 'staff',
    title: 'Staff / Warden',
    subtitle: 'Hostel Maintenance & Repair Queue',
    icon: Wrench,
    colorClass: 'text-emerald-600 bg-emerald-50',
    borderClass: 'border-emerald-200 hover:border-emerald-400',
    activeRing: 'ring-2 ring-emerald-600 border-emerald-500 bg-emerald-50/40',
    badgeColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    role: 'authority',
    title: 'Campus Authority',
    subtitle: 'Dean Office, SLA & Escalations',
    icon: ShieldAlert,
    colorClass: 'text-purple-600 bg-purple-50',
    borderClass: 'border-purple-200 hover:border-purple-400',
    activeRing: 'ring-2 ring-purple-600 border-purple-500 bg-purple-50/40',
    badgeColor: 'bg-purple-100 text-purple-800',
  },
  {
    role: 'admin',
    title: 'System Admin',
    subtitle: 'Category SLAs & Platform Config',
    icon: ShieldCheck,
    colorClass: 'text-amber-600 bg-amber-50',
    borderClass: 'border-amber-200 hover:border-amber-400',
    activeRing: 'ring-2 ring-amber-600 border-amber-500 bg-amber-50/40',
    badgeColor: 'bg-amber-100 text-amber-800',
  },
]

export default function LoginPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<Role>('student')
  const [userId, setUserId] = useState(DEMO_PROFILES.student.user_id)
  const [email, setEmail] = useState(DEMO_PROFILES.student.email)
  const [password, setPassword] = useState(DEMO_PROFILES.student.password || '')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const activeDemo = DEMO_PROFILES[selectedRole]

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role)
    const demo = DEMO_PROFILES[role]
    setUserId(demo.user_id)
    setEmail(demo.email)
    setPassword(demo.password || '')
    setError('')
  }

  const handleAutoFill = () => {
    const demo = DEMO_PROFILES[selectedRole]
    setUserId(demo.user_id)
    setEmail(demo.email)
    setPassword(demo.password || '')
    setError('')
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = mockStore.loginWithCredentials({
      role: selectedRole,
      userId,
      email,
      password,
    })

    if (!result.success) {
      setError(result.error || 'Authentication failed. Please verify credentials.')
      setLoading(false)
      return
    }

    // Redirect to the role's dashboard
    const target = `/dashboard/${selectedRole}`
    router.push(target)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/60 to-indigo-50/60 flex flex-col justify-center py-10 px-4 sm:px-6">
      <div className="w-full max-w-4xl mx-auto space-y-8 animate-slide-up">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-500/20">
            <Building2 size={28} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Campus Issue Resolution Platform
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto">
            Choose who wants to enter the dashboard. Each persona has a unique User ID, Email, and Password.
          </p>
        </div>

        {/* STEP 1: CHOOSE WHO WANTS TO ENTER */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-primary-600 text-white text-[11px] flex items-center justify-center font-bold">1</span>
              Select Account Persona to Enter
            </span>
            <span className="text-xs text-slate-400">Click a card to switch portal</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {ROLE_CARDS.map(({ role, title, subtitle, icon: Icon, colorClass, borderClass, activeRing, badgeColor }) => {
              const isSelected = selectedRole === role
              const demo = DEMO_PROFILES[role]
              return (
                <div
                  key={role}
                  onClick={() => handleRoleSelect(role)}
                  className={`card p-4 cursor-pointer transition-all duration-200 border relative ${
                    isSelected ? activeRing : borderClass
                  } hover:shadow-md`}
                >
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-sm">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}

                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 ${colorClass}`}>
                    <Icon size={18} />
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{subtitle}</p>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-slate-500 font-medium">{demo.user_id}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${badgeColor}`}>
                      {demo.role}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* STEP 2: CREDENTIALS AUTHENTICATION FORM */}
        <div className="card p-6 sm:p-8 bg-white shadow-md border-slate-200 max-w-xl mx-auto w-full">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Lock size={16} className="text-primary-600" />
                Sign in to {ROLE_CARDS.find((r) => r.role === selectedRole)?.title} Dashboard
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Authenticating as: <strong className="text-slate-800">{activeDemo.full_name}</strong>
              </p>
            </div>

            <button
              type="button"
              onClick={handleAutoFill}
              className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 border-primary-200 bg-primary-50 text-primary-700 hover:bg-primary-100"
              title="Auto-fill this persona's credentials"
            >
              <Sparkles size={13} className="text-amber-500" />
              <span>Auto-fill Demo</span>
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* User ID Field */}
            <div>
              <label htmlFor="userId" className="label text-xs">
                Unique User ID / Campus ID
              </label>
              <div className="relative">
                <input
                  id="userId"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value.toUpperCase())}
                  className="input font-mono uppercase tracking-wider text-xs"
                  placeholder={activeDemo.user_id}
                  required
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Official assigned ID for this role (e.g. <span className="font-mono text-slate-600">{activeDemo.user_id}</span>)
              </p>
            </div>

            {/* Campus Email Field */}
            <div>
              <label htmlFor="email" className="label text-xs">
                Registered Campus Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input text-xs"
                placeholder={activeDemo.email}
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="label text-xs">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-10 text-xs"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Demo password: <span className="font-mono text-slate-600">{activeDemo.password}</span>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 text-xs sm:text-sm font-semibold mt-3 shadow-sm flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : `Enter ${ROLE_CARDS.find((r) => r.role === selectedRole)?.title} Dashboard`}</span>
              <ArrowRight size={15} />
            </button>
          </form>

          {/* Persona Security Notice */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
            <span>Role is locked inside the dashboard. To switch persona, you must sign out first.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
