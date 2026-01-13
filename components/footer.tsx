"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { useEffect, useState } from "react"
import { getContactConfig, type ContactConfig } from "@/lib/contact-data"
import { BrandingLogo } from "./branding-logo"

export default function Footer() {
  const [contact, setContact] = useState<ContactConfig>(getContactConfig())

  useEffect(() => {
    // Load initial data
    setContact(getContactConfig())

    // Listen for storage changes
    const handleStorageChange = () => {
      setContact(getContactConfig())
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return Facebook
      case "instagram":
        return Instagram
      case "twitter":
        return Twitter
      case "linkedin":
        return Linkedin
      case "youtube":
        return Youtube
      default:
        return Facebook
    }
  }

  return (
    <footer className="border-t border-border/50 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-8">
          {/* Company Info */}
          <div className="space-y-4">
            <BrandingLogo href="/" variant="footer" />
            <p className="text-sm text-muted-foreground text-pretty">{contact.description}</p>
            {/* Social Media */}
            <div className="flex gap-3 pt-2">
              {contact.socialLinks
                .filter((social) => social.enabled)
                .map((social) => {
                  const Icon = getSocialIcon(social.platform)
                  return (
                    <Link
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-10 w-10 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                      aria-label={social.platform}
                    >
                      <Icon className="h-5 w-5" />
                    </Link>
                  )
                })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Explorar</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/products" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Todos los Productos
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=electronics"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Electrónica
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=appliances"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Electrodomésticos
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=perfumes"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Perfumes
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Mis Favoritos
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Mis Pedidos
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Legal</h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping-policy"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Política de Envíos
                </Link>
              </li>
              <li>
                <Link
                  href="/return-policy"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Devoluciones y Cambios
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Garantía
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Dirección</p>
                  <p className="text-sm text-muted-foreground">
                    {contact.address}
                    <br />
                    {contact.city}, {contact.country}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Teléfono</p>
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {contact.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <a href={`mailto:${contact.email}`} className="text-sm text-muted-foreground hover:text-primary">
                    {contact.email}
                  </a>
                </div>
              </li>
            </ul>
            <div className="pt-2">
              <p className="text-xs text-muted-foreground">Horario de atención:</p>
              <p className="text-sm font-medium">{contact.workingHours.weekdays}</p>
              <p className="text-sm font-medium">{contact.workingHours.saturday}</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © 2026 TechZone. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
