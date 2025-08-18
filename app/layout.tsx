import type React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono, Inter } from "next/font/google"
import "./globals.css"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
})

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "ZenType Racing - Aesthetic Typing Game",
  description: "A minimalist typing racing game with beautiful themes",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${inter.variable} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
