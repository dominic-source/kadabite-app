import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '~/utils'
import { Providers } from './provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kadabite food delivery', // Replace with your app title
  description: 'Order food from your favorite restaurants.', // Replace with your app description
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, 'max-w-[1920px] antialiased')}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
