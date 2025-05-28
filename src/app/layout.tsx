import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
// import localFont from 'next/font/local'

import './globals.css'
import { cn } from '~/utils'
import { Providers } from './provider'

const inter = Inter({ subsets: ['latin'] })
// const inter = localFont({
//   src: './fonts/Inter-Regular.woff2', // Place the font file in your project
//   variable: '--font-inter',
// })
export const metadata: Metadata = {
  title: 'Kadabite food delivery', // Replace with your app title
  description: 'Order food from your favorite restaurants.', // Replace with your app description
  manifest: '/manifest.json',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn(inter.className, 'max-w-[1920px] antialiased')}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
