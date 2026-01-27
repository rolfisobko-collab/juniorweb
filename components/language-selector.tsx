"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n/translation-provider"
import { Languages } from "lucide-react"

export function LanguageSelector() {
  const { language, setLanguage } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "pt", name: "Português", flag: "🇧🇷" }
  ]

  const currentLanguage = languages.find(lang => lang.code === language)

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Languages className="w-4 h-4" />
        <span>{currentLanguage?.flag} {currentLanguage?.name}</span>
      </Button>

      {isOpen && (
        <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[150px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code as any)
                setIsOpen(false)
              }}
              className={`w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2 ${
                language === lang.code ? "bg-blue-50 text-blue-600" : ""
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
