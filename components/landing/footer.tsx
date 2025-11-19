import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-brand-charcoal text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo & Description */}
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🐻</span>
              <span className="text-xl font-bold">TradieBear</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Professional quote link platform for real estate agents, loan officers, and home service providers. 
              Get qualified leads with organized project details and instant notifications.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/how-it-works" className="text-gray-400 hover:text-brand-orange transition-colors">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="/vetting-process" className="text-gray-400 hover:text-brand-orange transition-colors">
                  Vetting Process
                </Link>
              </li>
              <li>
                <Link href="/service-types" className="text-gray-400 hover:text-brand-orange transition-colors">
                  Service Types
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-gray-400 hover:text-brand-orange transition-colors">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-brand-orange transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-brand-orange transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© 2025 Tradiebear. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Built for professionals who value efficiency and quality.</p>
        </div>
      </div>
    </footer>
  )
}

