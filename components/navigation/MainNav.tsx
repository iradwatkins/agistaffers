'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/hooks/useLanguage'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { 
  Bot, 
  Menu, 
  X, 
  ChevronDown,
  ArrowRight,
  Globe,
  ShoppingBag,
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  Bell,
  Sparkles,
  Info,
  MessageCircle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggleSimple } from '@/components/theme-toggle-simple'

export default function MainNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mobileWebsiteOpen, setMobileWebsiteOpen] = useState(false)
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false)
  const pathname = usePathname()
  const { language, setLanguage, t } = useLanguage()
  const { data: session, status } = useSession()

  const navItems = useMemo(() => [
    { label: t?.nav?.aiAssistants || 'AI Assistants', href: '/ai-assistants' },
    { label: t?.nav?.workflowAutomation || 'AI Automation', href: '/workflow-automation' },
    { label: t?.nav?.contentSeo || 'AI SEO', href: '/seo' },
    { label: t?.nav?.promptEngineering || 'Custom Prompts', href: '/prompt-engineering' }
  ], [t])

  const isActive = (href: string) => pathname === href

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/95 border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-8">
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Bot className="h-6 w-6 text-primary" />
            </motion.div>
            <span className="text-2xl font-bold text-foreground">
              AGI STAFFERS
            </span>
          </Link>

          {/* Desktop Navigation - Only show when NOT logged in */}
          {!session && (
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive(item.href) ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}

              {/* Need a Website Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-primary",
                  pathname?.startsWith('/websites') ? "text-primary" : "text-muted-foreground"
                )}>
                  {t?.nav?.needWebsite || 'Need a Website?'} <ChevronDown className="ml-1 h-3 w-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/websites/pre-built" className="flex items-center">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      {t?.nav?.prebuiltStores || 'Pre-built Stores'}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/websites/custom" className="flex items-center">
                      <Globe className="mr-2 h-4 w-4" />
                      {t?.nav?.customWebsites || 'Custom Websites'}
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* About Us Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-primary",
                  (pathname === '/about' || pathname === '/contact') ? "text-primary" : "text-muted-foreground"
                )}>
                  {t?.nav?.about || 'About Us'} <ChevronDown className="ml-1 h-3 w-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/about" className="flex items-center">
                      {t?.nav?.about || 'About Us'}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/contact" className="flex items-center">
                      {t?.nav?.contact || 'Contact Us'}
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            </nav>
          )}
        </div>

        {/* Right side buttons */}
        <div className="flex items-center space-x-3">
          {/* Language Switcher - Desktop only */}
          <div className="hidden md:flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Globe className="h-5 w-5" />
                  <span className="sr-only">Language</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                  <span className="mr-2">🇺🇸</span>
                  English
                  {language === 'en' && <span className="ml-auto text-xs">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('es')}>
                  <span className="mr-2">🇩🇴</span>
                  Español
                  {language === 'es' && <span className="ml-auto text-xs">✓</span>}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <ThemeToggleSimple />
          
          {/* Notifications - Only show when logged in */}
          {session && (
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              <span className="sr-only">Notifications</span>
            </Button>
          )}
          
          {/* User Menu or Login Button */}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hidden md:flex items-center space-x-2 hover:bg-accent">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                    {session.user?.name?.charAt(0) || session.user?.email?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="max-w-[150px] truncate">{session.user?.name || session.user?.email?.split('@')[0]}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-3 p-2 border-b">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-semibold">
                    {session.user?.name?.charAt(0) || session.user?.email?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {session.user?.name || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {session.user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => signOut({ callbackUrl: '/login' })}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              asChild
              className={cn(
                "hidden md:inline-flex",
                "bg-gradient-to-r from-primary to-purple-500",
                "hover:from-primary/90 hover:to-purple-500/90",
                "shadow-lg shadow-primary/25"
              )}
            >
              <Link href="/login">
                {t?.nav?.customerLogin || 'Login'} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => {
              setIsMobileMenuOpen(!isMobileMenuOpen)
              // Reset dropdown states when closing menu
              if (isMobileMenuOpen) {
                setMobileWebsiteOpen(false)
                setMobileAboutOpen(false)
              }
            }}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-border shadow-2xl z-50 max-h-[calc(100vh-4rem)] overflow-y-auto"
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              {/* Only show navigation items when NOT logged in */}
              {!session && (
                <>
                  {/* Main Navigation Items */}
                  <div className="space-y-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "block py-3 px-4 text-base font-medium transition-all",
                          isActive(item.href) 
                            ? "text-primary font-semibold" 
                            : "hover:text-primary"
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  {/* Mobile Website Dropdown */}
                  <div>
                    <button
                      onClick={() => setMobileWebsiteOpen(!mobileWebsiteOpen)}
                      className={cn(
                        "w-full flex items-center justify-between py-3 px-4 text-base font-medium transition-all",
                        pathname?.startsWith('/websites')
                          ? "text-primary font-semibold"
                          : "hover:text-primary"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        {t?.nav?.needWebsite || 'Need a Website?'}
                      </span>
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-transform",
                        mobileWebsiteOpen && "rotate-180"
                      )} />
                    </button>
                    <AnimatePresence>
                      {mobileWebsiteOpen && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-8 pr-4 py-2 space-y-1">
                            <Link
                              href="/websites/pre-built"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={cn(
                                "flex items-center gap-2 py-2 text-sm transition-all",
                                isActive('/websites/pre-built')
                                  ? "text-primary font-semibold"
                                  : "text-muted-foreground hover:text-primary"
                              )}
                            >
                              <ShoppingBag className="h-4 w-4" />
                              {t?.nav?.prebuiltStores || 'Pre-built Stores'}
                            </Link>
                            <Link
                              href="/websites/custom"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={cn(
                                "flex items-center gap-2 py-2 text-sm transition-all",
                                isActive('/websites/custom')
                                  ? "text-primary font-semibold"
                                  : "text-muted-foreground hover:text-primary"
                              )}
                            >
                              <Sparkles className="h-4 w-4" />
                              {t?.nav?.customWebsites || 'Custom Websites'}
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Mobile About Dropdown */}
                  <div>
                    <button
                      onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                      className={cn(
                        "w-full flex items-center justify-between py-3 px-4 text-base font-medium transition-all",
                        (pathname === '/about' || pathname === '/contact')
                          ? "text-primary font-semibold"
                          : "hover:text-primary"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        {t?.nav?.about || 'About Us'}
                      </span>
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-transform",
                        mobileAboutOpen && "rotate-180"
                      )} />
                    </button>
                    <AnimatePresence>
                      {mobileAboutOpen && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-8 pr-4 py-2 space-y-1">
                            <Link
                              href="/about"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={cn(
                                "flex items-center gap-2 py-2 text-sm transition-all",
                                isActive('/about')
                                  ? "text-primary font-semibold"
                                  : "text-muted-foreground hover:text-primary"
                              )}
                            >
                              <Info className="h-4 w-4" />
                              {t?.nav?.about || 'About Us'}
                            </Link>
                            <Link
                              href="/contact"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={cn(
                                "flex items-center gap-2 py-2 text-sm transition-all",
                                isActive('/contact')
                                  ? "text-primary font-semibold"
                                  : "text-muted-foreground hover:text-primary"
                              )}
                            >
                              <MessageCircle className="h-4 w-4" />
                              {t?.nav?.contact || 'Contact Us'}
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              )}


              {/* Mobile User Menu or Login */}
              {session ? (
                <div className="border-t pt-4 space-y-3">
                  <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">{session.user?.name || 'User'}</p>
                        <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="font-medium">Settings</span>
                  </Link>
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      signOut({ callbackUrl: '/login' })
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="border-t pt-4">
                  <Button asChild className="w-full bg-gradient-to-r from-primary to-purple-500 hover:opacity-90">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      {t?.nav?.customerLogin || 'Login'} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}

              {/* Language & Theme Controls */}
              <div className="border-t pt-4 space-y-3">
                {/* Language Selector */}
                <div className="px-4">
                  <div className="text-xs font-medium text-muted-foreground mb-2">Language / Idioma</div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={language === 'en' ? 'default' : 'outline'}
                      onClick={() => setLanguage('en')}
                      className="w-full justify-start"
                      size="sm"
                    >
                      <span className="mr-2">🇺🇸</span>
                      English
                    </Button>
                    <Button
                      variant={language === 'es' ? 'default' : 'outline'}
                      onClick={() => setLanguage('es')}
                      className="w-full justify-start"
                      size="sm"
                    >
                      <span className="mr-2">🇩🇴</span>
                      Español
                    </Button>
                  </div>
                </div>
                
                {/* Theme Controls */}
                <div className="px-4">
                  <div className="text-xs font-medium text-muted-foreground mb-2">Theme</div>
                  <div className="flex justify-center">
                    <ThemeToggleSimple />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}