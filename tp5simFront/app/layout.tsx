import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PLAYITA ATR',
  description: 'SIMULACION 4K1 '
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
