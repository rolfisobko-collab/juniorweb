"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCurrency } from "@/lib/currency-context"
import { CURRENCY_INFO, type Currency } from "@/lib/currency-context"
import { ChevronDown } from "lucide-react"

export function CurrencySelector() {
  const { currency, setCurrency, loading } = useCurrency()

  if (loading) {
    return (
      <Button variant="outline" size="sm" disabled className="border-2 border-gray-200 bg-white hover:border-blue-300 shadow-sm">
        <div className="animate-pulse flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <div className="w-8 h-4 bg-gray-200 rounded"></div>
        </div>
      </Button>
    )
  }

  const currentCurrency = CURRENCY_INFO[currency]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 border-2 border-gray-200 bg-white hover:border-blue-500 hover:bg-blue-50 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <span className="text-lg">{currentCurrency.flag}</span>
          <span className="font-medium text-gray-700">{currency}</span>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 border-2 border-gray-200 bg-white shadow-lg">
        {Object.entries(CURRENCY_INFO).map(([code, info]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setCurrency(code as Currency)}
            className={`flex items-center gap-3 cursor-pointer hover:bg-blue-50 transition-colors duration-200 ${
              currency === code ? "bg-blue-50 border-l-4 border-blue-500" : ""
            }`}
          >
            <span className="text-xl">{info.flag}</span>
            <div className="flex-1">
              <div className="font-semibold text-gray-800">{code}</div>
              <div className="text-sm text-gray-600">{info.name}</div>
            </div>
            {currency === code && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
