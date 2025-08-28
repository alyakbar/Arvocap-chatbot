import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

export const metadata: Metadata = {
  title: "ArvoCap Bot",
  description: "ArvoCap AI - Your intelligent investment assistant for asset management and financial guidance",
  generator: "v0.app",
  openGraph: {
    title: "ArvoCap AI",
    description: "Your intelligent investment assistant for asset management and financial guidance",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ArvoCap AI",
    description: "Your intelligent investment assistant for asset management and financial guidance",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>{children}</body>
    </html>
  )
}
