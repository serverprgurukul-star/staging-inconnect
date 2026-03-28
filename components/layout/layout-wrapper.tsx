'use client'

import { usePathname } from 'next/navigation'
import { Header } from './header'
import { Footer } from './footer'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { Preloader } from './preloader'

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/masterman')
  const isComingSoon = pathname === '/coming-soon'

  if (isAdmin || isComingSoon) {
    return <>{children}</>
  }

  // Regular pages - with header/footer
  return (
    <div className="flex min-h-screen flex-col">
      <Preloader />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  )
}
