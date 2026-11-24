'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { mockStore } from '@/lib/mockStore'
import { Eye, EyeOff, UserPlus, Building2, CheckCircle } from 'lucide-react'
import type { Role } from '@/lib/types'

const DEPARTMENTS = [
  'Hostel',
  'Mess',
  'Transport',
  'IT',
  'Academics',
  'Administration',
]

export default function SignupPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'student' as Role,
    department: 'Hostel',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const needsDepartment = form.role === 'staff' || form.role === 'authority'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    mockStore.signup({
      fullName: form.fullName || 'New Campus User',
      email: form.email,
      role: form.role,
      department: needsDepartment ? form.department : undefined,
    })

    setSuccess(true)
    setTimeout(() => {
      const target =
        form.role === 'staff'
          ? '/dashboard/staff'
          : form.role === 'authority'
          ? '/dashboard/authority'
          : form.role === 'admin'
          ? '/dashboard/admin'
          : '/dashboard/student'
      router.push(target)
    }, 1000)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center animate-slide-up">
          <div className="card p-8 shadow-md">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mb-4">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Account Created!</h2>
            <p className="text-slate-500 text-sm mb-4">
              Redirecting you to your {form.role} dashboard...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-600 text-white mb-3 shadow-lg shadow-primary-500/20">
            <Building2 size={28} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Campus IRP</h1>
          <p className="text-slate-500 text-sm mt-1">Register for an account</p>
        </div>

        {/* Card */}
        <div className="card p-6 shadow-md bg-white">
          <h2 className="text-base font-semibold text-slate-900 mb-5">Create your profile</h2>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="label">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={form.fullName}
                onChange={handleChange}
                className="input"
                placeholder="e.g. Rahul Sharma"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="label">Campus Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="input"
                placeholder="you@college.edu"
                required
              />
            </div>

            <div>
              <label htmlFor="role" className="label">Account Role</label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="input"
              >
                <option value="student">Student (Hostel &amp; Campus)</option>
                <option value="staff">Staff / Hostel Warden</option>
                <option value="authority">Campus Authority (Dean)</option>
                <option value="admin">System Admin</option>
              </select>
            </div>

            {needsDepartment && (
              <div>
                <label htmlFor="department" className="label">Assigned Department</label>
                <select
                  id="department"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="password" className="label">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  className="input pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 mt-2"
            >
              <UserPlus size={16} />
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary-600 hover:text-primary-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
