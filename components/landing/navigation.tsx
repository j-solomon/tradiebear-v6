"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

interface NavigationProps {
  isLoggedIn?: boolean
  userRole?: 'admin' | 'partner' | null
}

export function Navigation({ isLoggedIn = false, userRole = null }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const dashboardUrl = userRole === 'admin' ? '/admin' : '/dashboard'

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🐻</span>
            <span className="text-xl font-bold text-brand-text-dark">TradieBear</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/how-it-works" className="text-brand-text-dark hover:text-brand-orange transition-colors">
              How it Works
            </Link>
            <Link href="#services" className="text-brand-text-dark hover:text-brand-orange transition-colors">
              Service Types
            </Link>
            <Link href="#faq" className="text-brand-text-dark hover:text-brand-orange transition-colors">
              FAQ
            </Link>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <Link href={dashboardUrl}>
                <Button className="bg-brand-orange hover:bg-brand-orange-light text-white">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-brand-text-dark hover:text-brand-orange">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-brand-orange hover:bg-brand-orange-light text-white">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-brand-text-dark" />
            ) : (
              <Menu className="h-6 w-6 text-brand-text-dark" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t">
            <Link 
              href="/how-it-works" 
              className="block py-2 text-brand-text-dark hover:text-brand-orange transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              How it Works
            </Link>
            <Link 
              href="#services" 
              className="block py-2 text-brand-text-dark hover:text-brand-orange transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Service Types
            </Link>
            <Link 
              href="#faq" 
              className="block py-2 text-brand-text-dark hover:text-brand-orange transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            
            <div className="pt-4 space-y-2">
              {isLoggedIn ? (
                <Link href={dashboardUrl} className="block">
                  <Button className="w-full bg-brand-orange hover:bg-brand-orange-light text-white">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login" className="block">
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" className="block">
                    <Button className="w-full bg-brand-orange hover:bg-brand-orange-light text-white">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

