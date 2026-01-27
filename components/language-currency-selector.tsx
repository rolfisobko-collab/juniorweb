"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslation } from "@/lib/i18n/translation-provider"
import { useCurrency } from "@/lib/currency-context"
import { CURRENCY_INFO, type Currency } from "@/lib/currency-context"
import { Languages, DollarSign, Globe, ChevronDown } from "lucide-react"

export function LanguageCurrencySelector() {
  const { language, setLanguage } = useTranslation()
  const { currency, setCurrency, loading } = useCurrency()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "pt", name: "Português", flag: "🇧🇷" }
  ]

  const currentLanguage = languages.find(lang => lang.code === language)
  const currentCurrency = CURRENCY_INFO[currency]

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 border-2 border-gray-200/60 bg-gradient-to-r from-white to-gray-50/80 backdrop-blur-sm hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100/80 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <Globe className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {currentLanguage?.flag} {currentCurrency.flag}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 border-2 border-gray-200/60 bg-gradient-to-r from-white to-gray-50/90 backdrop-blur-md shadow-xl shadow-gray-200/50">
        {/* Language Section */}
        <div className="px-2 py-2">
          <div className="flex items-center gap-2 px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <Languages className="h-3 w-3" />
            Idioma
          </div>
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => setLanguage(lang.code as any)}
              className={`flex items-center gap-3 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100/60 transition-all duration-300 rounded-md ${
                language === lang.code ? "bg-gradient-to-r from-blue-50 to-blue-100/60 border-l-4 border-blue-500" : ""
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="font-medium text-gray-800">{lang.name}</span>
              {language === lang.code && (
                <div className="w-2 h-2 bg-blue-500 rounded-full ml-auto"></div>
              )}
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator />

        {/* Currency Section */}
        <div className="px-2 py-2">
          <div className="flex items-center gap-2 px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <DollarSign className="h-3 w-3" />
            Moneda
          </div>
          {Object.entries(CURRENCY_INFO).map(([code, info]) => (
            <DropdownMenuItem
              key={code}
              onClick={() => setCurrency(code as Currency)}
              className={`flex items-center gap-3 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100/60 transition-all duration-300 rounded-md ${
                currency === code ? "bg-gradient-to-r from-blue-50 to-blue-100/60 border-l-4 border-blue-500" : ""
              }`}
            >
              <span className="text-lg">{info.flag}</span>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{code}</div>
                <div className="text-sm text-gray-600">{info.name}</div>
              </div>
              {currency === code && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
