import './globals.css'
import Link from 'next/link'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'FastShip Express',
  description: 'FedEx-style shipping portal demo',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="bg-brand-purple text-white">
          <div className="container py-3 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold">FastShip <span className="text-brand-orange">Express</span></Link>
            <nav className="flex gap-6">
              <Link href="/track">Track</Link>
              <Link href="/shipments/new">Create Shipment</Link>
              <Link href="/admin">Admin</Link>
            </nav>
          </div>
        </header>
        <main className="container py-6">{children}</main>
        <footer className="mt-16 bg-gray-50 border-t">
          <div className="container py-6 text-sm text-gray-600 flex items-center justify-between">
            <p>© {new Date().getFullYear()} FastShip Express</p>
            <p>Demo app. Not affiliated with FedEx.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
