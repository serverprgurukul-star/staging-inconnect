'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Layers,
  ShoppingCart,
  CreditCard,
  Users,
  MessageSquare,
  Ticket,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  Calendar,
  ExternalLink,
  X,
  IdCard,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'
import toast from 'react-hot-toast'

interface AdminSidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

const navItems = [
  { href: '/masterman', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/masterman/categories', icon: FolderTree, label: 'Categories' },
  { href: '/masterman/sub-categories', icon: Layers, label: 'Sub-Categories' },
  { href: '/masterman/products', icon: Package, label: 'Products' },
  { href: '/masterman/orders', icon: ShoppingCart, label: 'Orders' },
  { href: '/masterman/card-details', icon: IdCard, label: 'Card Details' },
  { href: '/masterman/payments', icon: CreditCard, label: 'Payments' },
  { href: '/masterman/customers', icon: Users, label: 'Customers' },
  { href: '/masterman/demo-bookings', icon: Calendar, label: 'Demo Bookings' },
  { href: '/masterman/testimonials', icon: MessageSquare, label: 'Testimonials' },
  { href: '/masterman/coupons', icon: Ticket, label: 'Coupons' },
  { href: '/masterman/settings', icon: Settings, label: 'Settings' },
]

export function AdminSidebar({ isCollapsed, onToggle, isMobileOpen, onMobileClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Logged out successfully')
    router.push('/masterman/login')
  }

  const handleNavClick = () => {
    // Close mobile menu when navigating
    if (onMobileClose) {
      onMobileClose()
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-zinc-200 bg-white transition-all duration-300',
          // Desktop: show based on collapse state
          'hidden lg:flex',
          isCollapsed ? 'lg:w-16' : 'lg:w-64',
          // Mobile: show/hide based on isMobileOpen
          isMobileOpen && 'flex w-64'
        )}
      >
        {/* Header */}
        <div className={cn(
          'flex h-16 items-center border-b border-zinc-200 px-4',
          isCollapsed ? 'justify-center' : 'justify-between'
        )}>
          {(!isCollapsed || isMobileOpen) && (
            <Link prefetch={false} href="/masterman" className="flex items-center gap-2" onClick={handleNavClick}>
              <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-zinc-900 text-xs font-bold text-white">
                IC
              </div>
              <span className="font-bold text-zinc-900">Admin</span>
            </Link>
          )}
          {/* Desktop toggle */}
          <button
            onClick={onToggle}
            className="hidden lg:block rounded-[10px] p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
          >
            {isCollapsed ? (
              <Menu className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
          {/* Mobile close */}
          {isMobileOpen && (
            <button
              onClick={onMobileClose}
              className="lg:hidden rounded-[10px] p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/masterman' && pathname.startsWith(item.href))
              const Icon = item.icon

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    prefetch={false}
                    onClick={handleNavClick}
                    className={cn(
                      'flex items-center rounded-[10px] py-2.5 text-sm font-medium transition-colors',
                      isCollapsed && !isMobileOpen ? 'justify-center px-2' : 'gap-3 px-3',
                      isActive
                        ? 'bg-zinc-900 text-white'
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                    )}
                    title={isCollapsed && !isMobileOpen ? item.label : undefined}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {(!isCollapsed || isMobileOpen) && <span>{item.label}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-zinc-200 p-3 space-y-1">
          <Link
            prefetch={false}
            href="/"
            target="_blank"
            className={cn(
              'flex w-full items-center rounded-[10px] py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900',
              isCollapsed && !isMobileOpen ? 'justify-center px-2' : 'gap-3 px-3'
            )}
            title={isCollapsed && !isMobileOpen ? 'View Store' : undefined}
          >
            <ExternalLink className="h-5 w-5 flex-shrink-0" />
            {(!isCollapsed || isMobileOpen) && <span>View Store</span>}
          </Link>
          <button
            onClick={handleLogout}
            className={cn(
              'flex w-full items-center rounded-[10px] py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50',
              isCollapsed && !isMobileOpen ? 'justify-center px-2' : 'gap-3 px-3'
            )}
            title={isCollapsed && !isMobileOpen ? 'Logout' : undefined}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {(!isCollapsed || isMobileOpen) && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
