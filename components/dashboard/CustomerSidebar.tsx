'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Globe,
  CreditCard,
  Settings,
  Package,
  BarChart3,
  MessageSquare,
  Menu,
  X,
  LogOut,
  User,
  ShoppingBag,
  Eye,
  Download,
  HelpCircle
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'

interface NavItem {
  title: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  children?: NavItem[]
}

const navigation: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'My Website',
    icon: Globe,
    children: [
      { title: 'View Website', href: '/dashboard/websites', icon: Globe },
      { title: 'Order Website', href: '/websites/pre-built', icon: ShoppingBag },
      { title: 'Custom Design', href: '/websites/custom', icon: Package }
    ]
  },
  {
    title: 'Billing',
    icon: CreditCard,
    children: [
      { title: 'Invoices & Payments', href: '/dashboard/billing', icon: CreditCard },
      { title: 'Payment Methods', href: '/dashboard/payment-methods', icon: CreditCard },
      { title: 'Usage & Analytics', href: '/dashboard/analytics', icon: BarChart3 },
      { title: 'Download Reports', href: '/dashboard/reports', icon: Download }
    ]
  },
  {
    title: 'Support',
    icon: MessageSquare,
    children: [
      { title: 'Submit Ticket', href: '/dashboard/support/new', icon: MessageSquare },
      { title: 'My Tickets', href: '/dashboard/support', icon: MessageSquare },
      { title: 'Help Center', href: '/dashboard/help', icon: HelpCircle }
    ]
  },
  {
    title: 'Settings',
    icon: Settings,
    children: [
      { title: 'Account Settings', href: '/dashboard/settings', icon: Settings },
      { title: 'Profile', href: '/dashboard/profile', icon: User }
    ]
  }
]

export function CustomerSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>(['My Website'])
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const MenuItemWithTooltip = ({ children, title, collapsed, level }: { 
    children: React.ReactNode
    title: string
    collapsed: boolean
    level: number
  }) => {
    if (collapsed && level === 0) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            {children}
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{title}</p>
          </TooltipContent>
        </Tooltip>
      )
    }
    return <>{children}</>
  }

  const renderNavItem = (item: NavItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.title)
    const isActive = pathname === item.href
    const Icon = item.icon

    if (hasChildren) {
      return (
        <div key={item.title}>
          <MenuItemWithTooltip title={item.title} collapsed={collapsed} level={level}>
            <button
              onClick={() => toggleExpanded(item.title)}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                collapsed && level === 0 && 'justify-center'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                {(!collapsed || level > 0) && <span>{item.title}</span>}
              </div>
              {(!collapsed || level > 0) && hasChildren && (
                <ChevronRight
                  className={cn(
                    'h-4 w-4 transition-transform',
                    isExpanded && 'rotate-90'
                  )}
                />
              )}
            </button>
          </MenuItemWithTooltip>
          {isExpanded && (!collapsed || level > 0) && (
            <div className="ml-4 mt-1 space-y-1">
              {item.children.map(child => renderNavItem(child, level + 1))}
            </div>
          )}
        </div>
      )
    }

    return (
      <MenuItemWithTooltip key={item.title} title={item.title} collapsed={collapsed} level={level}>
        <Link
          href={item.href || '#'}
          className={cn(
            'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            isActive && 'bg-accent text-accent-foreground',
            collapsed && level === 0 && 'justify-center'
          )}
        >
          <Icon className="h-4 w-4" />
          {(!collapsed || level > 0) && <span>{item.title}</span>}
        </Link>
      </MenuItemWithTooltip>
    )
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-card border-r transition-all duration-300',
          collapsed ? 'w-16' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b px-4">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <Globe className="h-6 w-6 text-primary" />
                <span className="font-semibold">Customer Portal</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              {navigation.map(item => renderNavItem(item))}
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t p-4 space-y-2">
            {/* User Account Section */}
            <div className={cn(
              'flex items-center gap-3 mb-2',
              collapsed && 'justify-center'
            )}>
              <div className="relative">
                <User className="h-4 w-4 text-primary" />
              </div>
              {!collapsed && session?.user && (
                <div className="flex-1">
                  <p className="text-xs font-medium truncate">
                    {session.user.name || session.user.email?.split('@')[0]}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {session.user.email}
                  </p>
                </div>
              )}
            </div>
            
            <MenuItemWithTooltip title="Logout" collapsed={collapsed} level={0}>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                size="sm"
                onClick={() => signOut({ callbackUrl: '/login' })}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {!collapsed && <span>Logout</span>}
              </Button>
            </MenuItemWithTooltip>
          </div>
        </div>
      </aside>
    </>
  )
}