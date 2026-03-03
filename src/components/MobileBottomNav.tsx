import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, FileText, Pill, Calendar, User } from 'lucide-react'

const tabs = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { path: '/health-records', icon: FileText, label: 'Records' },
  { path: '/medications', icon: Pill, label: 'Meds' },
  { path: '/appointments', icon: Calendar, label: 'Appts' },
  { path: '/profile', icon: User, label: 'Profile' },
]

export default function MobileBottomNav() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 lg:hidden" role="navigation" aria-label="Mobile navigation">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map(tab => {
          const isActive = location.pathname === tab.path
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
