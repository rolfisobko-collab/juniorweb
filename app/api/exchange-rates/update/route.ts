import { NextResponse } from "next/server"
import { memoryStorage, type ExchangeRate } from "@/lib/memory-storage"

const CURRENCIES = [
  { code: "USD", name: "Dólar Estadounidense" },
  { code: "PYG", name: "Guaraní Paraguayo" },
  { code: "ARS", name: "Peso Argentino" },
  { code: "BRL", name: "Real Brasileño" },
]

async function fetchExchangeRates() {
  try {
    // Using exchange rate API with API key
    const API_KEY = "3146b556f2e59b7b0cc616e5"
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD?apiKey=${API_KEY}`)
    if (!response.ok) {
      throw new Error("Failed to fetch from external API")
    }
    
    const data = await response.json()
    console.log("Exchange rates fetched:", data.conversion_rates)
    return data.conversion_rates
  } catch (error) {
    console.error("Error fetching from external API:", error)
    
    // Fallback rates (updated with real values from API example)
    return {
      PYG: 6664.7514,  // 1 USD = 6664.75 PYG
      ARS: 1452.25,   // 1 USD = 1452.25 ARS  
      BRL: 5.3493,   // 1 USD = 5.35 BRL
      USD: 1          // Base rate
    }
  }
}

export async function POST() {
  try {
    const rates = await fetchExchangeRates()
    
    // Create rate objects with IDs
    const rateObjects = [
      { id: "1", currency: "USD", rate: rates.USD || 1, isActive: true, updatedAt: new Date().toISOString() },
      { id: "2", currency: "PYG", rate: rates.PYG || 7350, isActive: true, updatedAt: new Date().toISOString() },
      { id: "3", currency: "ARS", rate: rates.ARS || 890, isActive: true, updatedAt: new Date().toISOString() },
      { id: "4", currency: "BRL", rate: rates.BRL || 5.2, isActive: true, updatedAt: new Date().toISOString() },
    ]
    
    // Try to update or create each currency rate in database
    try {
      const { prisma } = await import("@/lib/db")
      
      for (const currency of CURRENCIES) {
        const rate = rates[currency.code] || 1
        
        // First try to find existing rate
        const existingRate = await prisma.exchangeRate.findFirst({
          where: { currency: currency.code }
        })
        
        if (existingRate) {
          // Update existing rate
          await prisma.exchangeRate.update({
            where: { id: existingRate.id },
            data: {
              rate: rate,
              isActive: true,
              updatedAt: new Date()
            }
          })
        } else {
          // Create new rate
          await prisma.exchangeRate.create({
            data: {
              currency: currency.code,
              rate: rate,
              isActive: true
            }
          })
        }
      }
    } catch (dbError) {
      // Fallback: store in memory using shared storage
      console.warn("Database not available, storing in memory:", dbError)
      console.log("Storing rates:", rateObjects)
      memoryStorage.setRates(rateObjects)
      console.log("Stored rates, verifying:", memoryStorage.getRates())
    }

    return NextResponse.json({ 
      success: true,
      message: "Exchange rates updated successfully",
      rates: rateObjects
    })
  } catch (error) {
    console.error("Error updating exchange rates:", error)
    return NextResponse.json(
      { error: "Error updating exchange rates" },
      { status: 500 }
    )
  }
}
