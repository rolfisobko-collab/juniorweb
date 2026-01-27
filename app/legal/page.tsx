"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Truck, FileText, ChevronUp } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useTranslation } from "@/lib/i18n/translation-provider"

export default function LegalPage() {
  const { t } = useTranslation()
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                <FileText className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('Legal Information')}
            </h1>
            <p className="text-xl text-blue-100">
              {t('Terms and Conditions • Privacy Policy • Warranty • Shipping')}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Términos y Condiciones */}
          <Card id="terminos" className="shadow-lg border-0 scroll-mt-24">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <FileText className="h-6 w-6 text-blue-600" />
                {t('Terms and Conditions')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="font-semibold text-blue-900">{t('Tech Zone Store')}</p>
                <p className="text-sm text-blue-700">{t('Last updated: 2026')}</p>
              </div>

              <div className="space-y-6">
                <section>
                  <h3 className="text-xl font-semibold mb-3">{t('1. Company Identification')}</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {t('Tech Zone Store is a company dedicated to selling technological products, with commercial domicile in Ciudad del Este, Republic of Paraguay.')}
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">{t('2. Acceptance of Terms')}</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {t('By accessing and using this website, the user fully accepts these Terms and Conditions.')}
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">{t('3. Site Usage')}</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {t('The user commits to using the site lawfully, without affecting its operation or the rights of third parties.')}
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">{t('4. Products and Availability')}</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {t('All products are subject to stock availability. Published images are illustrative.')}
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">{t('5. Prices and Billing')}</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {t('Prices may be modified without prior notice. Tech Zone Store reserves the right to cancel orders for price or stock errors.')}
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">{t('6. Payment Methods')}</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {t('Purchases can be made through the payment methods enabled on the platform. All transactions are subject to verification.')}
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">{t('7. Shipping')}</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {t('Shipments are made throughout the Paraguayan territory. Once the product is dispatched, responsibility passes to the logistics company.')}
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">{t('8. Warranty')}</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {t('Products have a limited 30-day warranty for factory failures, according to provider conditions.')}
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">{t('9. Changes and Returns')}</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {t('Only changes for factory failures are accepted, prior technical evaluation.')}
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">{t('10. Intellectual Property')}</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {t('All site content is property of Tech Zone Store. Reproduction is prohibited without authorization.')}
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">{t('11. Applicable Legislation')}</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {t('These terms are governed by the laws of the Republic of Paraguay.')}
                  </p>
                </section>
              </div>
            </CardContent>
          </Card>

          {/* Política de Privacidad */}
          <Card id="privacidad" className="shadow-lg border-0 scroll-mt-24">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Shield className="h-6 w-6 text-green-600" />
                {t('Privacy Policy')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                {t('At Tech Zone Store we respect and protect our customers\' personal data.')}
              </p>

              <div className="space-y-6">
                <section>
                  <h3 className="text-xl font-semibold mb-3">{t('1. Collected Data')}</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {t('We may collect personal data such as name, phone, email, and address.')}
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">{t('2. Information Usage')}</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {t('Data is used to process orders, customer service, and authorized commercial communications.')}
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">{t('3. Data Protection')}</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {t('We implement security measures to protect user information.')}
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">{t('4. Confidentiality')}</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {t('We do not share personal data with third parties, except legal or logistical obligation.')}
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">{t('5. User Rights')}</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {t('The user may request updating or deleting their data.')}
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">{t('6. Modifications')}</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {t('This policy may be modified at any time.')}
                  </p>
                </section>
              </div>
            </CardContent>
          </Card>

          {/* Política de Garantía y Envíos */}
          <Card id="envios" className="shadow-lg border-0 scroll-mt-24">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Truck className="h-6 w-6 text-orange-600" />
                {t('Warranty and Shipping Policy')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-8">
                <section>
                  <h3 className="text-xl font-semibold mb-4">{t('Warranty Title')}</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {t('All products marketed by Tech Zone Store have a 30-day warranty for factory failures.')}
                  </p>
                  
                  <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded mb-4">
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        <span>{t('Does not cover drops, moisture, mishandling, or electrical damage.')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        <span>{t('Does not cover normal wear or software updates.')}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed">
                    {t('After 30 days, any inconvenience is the customer\'s responsibility, according to the provider\'s warranty.')}
                  </p>
                </section>

                <section id="devoluciones">
                  <h3 className="text-xl font-semibold mb-4">{t('Shipping Title')}</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {t('Shipments are made through external logistics companies.')}
                  </p>
                  
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <p className="text-red-800 font-medium">
                      {t('Once the order is dispatched, Tech Zone Store is not responsible for delays, losses, or damages during transportation.')}
                    </p>
                  </div>
                </section>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card id="faq" className="shadow-lg border-0 bg-gradient-to-r from-gray-50 to-gray-100 scroll-mt-24">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-semibold mb-4">{t('Do you have questions?')}</h3>
              <p className="text-gray-600 mb-6">
                {t('If you have any questions about our terms, policies or need assistance, do not hesitate to contact us')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/contact">{t('Contact Support')}</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/faq">{t('View FAQ')}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="fixed bottom-8 right-8 z-50 bg-blue-600 hover:bg-blue-700 shadow-lg"
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}
