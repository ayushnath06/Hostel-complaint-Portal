import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Campus Issue Resolution Platform',
    template: '%s | Campus IRP',
  },
  description:
    'Anonymously report campus issues and track resolution in real time. Covering transport, mess, hostel, Wi-Fi, and academics.',
  keywords: ['campus', 'issues', 'hostel', 'report', 'resolution'],
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
