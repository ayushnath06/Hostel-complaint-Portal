'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { mockStore } from '@/lib/mockStore'
import { Building2, LogOut, User, Menu, X, Shield, Lock } from 'lucide-react'
import type { Role } from '@/lib/types'

interface NavbarProps {
  role: Role
  fullName: string
  userId?: string
  department?: string | null
}

const ROLE_LABELS: Record<Role, string> = {
  student: 'Student',
  staff: 'Staff',
  authority: 'Authority',
  admin: 'Admin',
}

const ROLE_COLORS: Record<Role, string> = {
  student: 'bg-blue-50 text-blue-700 border-blue-200',
  staff: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  authority: 'bg-purple-50 text-purple-700 border-purple-200',
  admin: 'bg-amber-50 text-amber-700 border-amber-200',
}

export function Navbar({ role, fullName, userId, department }: NavbarProps) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    mockStore.logout()
    router.push('/login')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <Link href={`/dashboard/${role}`} className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary-600 text-white shadow-sm group-hover:bg-primary-700 transition-colors">
              <Building2 size={20} />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-base leading-none block">
                Campus IRP
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Issue Resolution Platform</span>
            </div>
          </Link>

          {/* Desktop Right - Static Profile Info & Sign Out (NO role switcher) */}
          <div className="hidden md:flex items-center gap-3">
            {/* Fixed Role Badge */}
            <div className="flex items-center gap-1.5">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${ROLE_COLORS[role]} flex items-center gap-1`}>
                <Shield size={12} />
                <span>{ROLE_LABELS[role]}</span>
              </span>
            </div>

            {/* User Profile & User ID */}
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200 text-xs text-slate-600">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold">
                <User size={15} />
              </div>
              <div className="leading-tight text-left">
                <p className="font-semibold text-slate-800">{fullName}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  {userId && <span className="font-mono text-primary-700 font-medium">ID: {userId}</span>}
                  {department && <span>• {department} Dept</span>}
                </div>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              id="logout-btn"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 ml-2 rounded-lg border border-slate-200 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 text-xs font-semibold transition-colors shadow-sm"
              title="Sign out of your session"
            >
              <LogOut size={13} />
              <span>Sign out</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (NO role switching) */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4 animate-fade-in shadow-lg">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
              <User size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{fullName}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`badge border text-[11px] font-semibold ${ROLE_COLORS[role]}`}>
                  {ROLE_LABELS[role]}
                </span>
                {userId && <span className="text-xs font-mono text-primary-700 font-medium">{userId}</span>}
              </div>
              {department && <p className="text-[11px] text-slate-400 mt-0.5">{department} Department</p>}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
            <Lock size={14} className="text-slate-400 shrink-0" />
            <span>Role is locked to this authenticated session. Sign out to change role.</span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full btn-secondary text-xs flex items-center justify-center gap-2 py-2.5 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
          >
            <LogOut size={14} />
            <span>Sign out</span>
          </button>
        </div>
      )}
    </nav>
  )
}
