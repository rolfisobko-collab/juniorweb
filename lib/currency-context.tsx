"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type Currency = "USD" | "PYG" | "ARS" | "BRL"

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  convertPrice: (priceInUSD: number) => number
  formatPrice: (priceInUSD: number) => string
  exchangeRates: Record<Currency, number>
  loading: boolean
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

const CURRENCY_INFO = {
  USD: { symbol: "$", code: "USD", name: "Dólar Estadounidense", flag: "🇺🇸" },
  PYG: { symbol: "₲", code: "PYG", name: "Guaraní Paraguayo", flag: "🇵🇾" },
  ARS: { symbol: "$", code: "ARS", name: "Peso Argentino", flag: "🇦🇷" },
  BRL: { symbol: "R$", code: "BRL", name: "Real Brasileño", flag: "🇧🇷" },
}

const DEFAULT_RATES: Record<Currency, number> = {
  USD: 1,
  PYG: 7350,
  ARS: 890,
  BRL: 5.2,
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("USD")
  const [exchangeRates, setExchangeRates] = useState<Record<Currency, number>>(DEFAULT_RATES)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load saved currency from localStorage
    const savedCurrency = localStorage.getItem("currency") as Currency
    if (savedCurrency && Object.keys(CURRENCY_INFO).includes(savedCurrency)) {
      setCurrency(savedCurrency)
    }

    // Fetch exchange rates
    fetchExchangeRates()
  }, [])

  const fetchExchangeRates = async () => {
    try {
      const response = await fetch("/api/exchange-rates")
      if (response.ok) {
        const data = await response.json()
        const rates: Record<Currency, number> = {
          USD: 1,
          PYG: 7350,
          ARS: 890,
          BRL: 5.2,
        }

        data.rates?.forEach((rate: any) => {
          if (rate.isActive && Object.keys(rates).includes(rate.currency)) {
            rates[rate.currency as Currency] = rate.rate
          }
        })

        setExchangeRates(rates)
      }
    } catch (error) {
      console.error("Error fetching exchange rates:", error)
      // Keep default rates if API fails
    } finally {
      setLoading(false)
    }
  }

  const handleSetCurrency = (newCurrency: Currency) => {
    setCurrency(newCurrency)
    localStorage.setItem("currency", newCurrency)
  }

  const convertPrice = (priceInUSD: number): number => {
    return priceInUSD * exchangeRates[currency]
  }

  const formatPrice = (priceInUSD: number): string => {
    const convertedPrice = convertPrice(priceInUSD)
    const info = CURRENCY_INFO[currency]
    
    // Format based on currency
    if (currency === "PYG") {
      // Guaraní doesn't use decimal places
      return `${info.symbol} ${convertedPrice.toLocaleString("es-PY", { maximumFractionDigits: 0 })}`
    } else if (currency === "BRL") {
      // Brazilian Real uses 2 decimal places
      return `${info.symbol} ${convertedPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    } else {
      // USD and ARS use 2 decimal places
      return `${info.symbol} ${convertedPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
  }

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency: handleSetCurrency,
        convertPrice,
        formatPrice,
        exchangeRates,
        loading,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}

export { CURRENCY_INFO }
