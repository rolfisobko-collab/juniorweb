"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { useEffect, useState } from "react"
import { getContactConfig, type ContactConfig } from "@/lib/contact-data"
import { BrandingLogo } from "@/components/branding-logo"
import { useTranslation } from "@/lib/i18n/translation-provider"

export default function Footer() {
  const { t } = useTranslation()
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
            <p className="text-sm text-muted-foreground text-pretty">{t('Your premium destination for cutting-edge technology, smart appliances and exclusive fragrances from the most prestigious brands in the world')}</p>
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
            <h4 className="font-semibold text-lg">{t('Explore')}</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/products" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('All Products')}
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=electronics"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('Electronics')}
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=appliances"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('Appliances')}
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=perfumes"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('Perfumes')}
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('My Favorites')}
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('My Orders')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">{t('Legal')}</h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/legal#terminos"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('Terms and Conditions Link')}
                </Link>
              </li>
              <li>
                <Link
                  href="/legal#privacidad"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('Privacy Policy Link')}
                </Link>
              </li>
              <li>
                <Link
                  href="/legal#envios"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('Shipping and Warranty')}
                </Link>
              </li>
              <li>
                <Link
                  href="/legal#devoluciones"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('Returns Link')}
                </Link>
              </li>
              <li>
                <Link
                  href="/legal#faq"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('FAQ Link')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">{t('Footer Contact')}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{t('Footer Address')}</p>
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
                  <p className="text-sm font-medium">{t('Footer Phone')}</p>
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
                  <p className="text-sm font-medium">{t('Footer Email')}</p>
                  <a href={`mailto:${contact.email}`} className="text-sm text-muted-foreground hover:text-primary">
                    {contact.email}
                  </a>
                </div>
              </li>
            </ul>
            <div className="pt-2">
              <p className="text-xs text-muted-foreground">{t('Attention Hours')}</p>
              <p className="text-sm font-medium">{t('Monday to Friday: 9:00 - 18:00')}</p>
              <p className="text-sm font-medium">{t('Saturday: 10:00 - 14:00')}</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              {t('© 2026 TechZone. All rights reserved')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
