import type React from "react"
import { Inter } from "next/font/google"
import ClientLayout from "./client-layout"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}

export const metadata = {
  title: 'TechZone - Tu Tienda de Tecnología',
  description: 'Descubre los mejores productos tecnológicos en TechZone. Laptops, smartphones, gadgets y más con las mejores marcas.',
  icons: {
    icon: 'https://i.ibb.co/dF0YLJw/Tech-Zone-store-11.png',
    shortcut: 'https://i.ibb.co/dF0YLJw/Tech-Zone-store-11.png',
    apple: 'https://i.ibb.co/dF0YLJw/Tech-Zone-store-11.png',
  },
  generator: 'v0.app'
};
