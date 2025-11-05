import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold tracking-tight">TradieBear</h1>
          <p className="text-xl text-muted-foreground">Contractor Referral Platform</p>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button size="lg" variant="outline" className="min-w-[140px]">
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="lg" className="min-w-[140px]">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
