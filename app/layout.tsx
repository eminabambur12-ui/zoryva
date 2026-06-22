import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Zoryva — Know Your Numbers. Grow With Confidence.',
  description: 'The luxury financial companion for ambitious women. Track personal and business finances, set smart budgets, and get AI-powered coaching.',
  keywords: 'personal finance, business finance, AI financial coach, budgeting, women finance',
  openGraph: {
    title: 'Zoryva — Know Your Numbers. Grow With Confidence.',
    description: 'The luxury financial companion for ambitious women.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
