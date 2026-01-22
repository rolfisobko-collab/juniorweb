import { NextRequest, NextResponse } from "next/server"
import { memoryStorage, type ExchangeRate } from "@/lib/memory-storage"

// Mock data for when database is not available
const MOCK_RATES: ExchangeRate[] = [
  { id: "1", currency: "USD", rate: 1.0, isActive: true, updatedAt: new Date().toISOString() },
  { id: "2", currency: "PYG", rate: 7350.0, isActive: true, updatedAt: new Date().toISOString() },
  { id: "3", currency: "ARS", rate: 890.0, isActive: true, updatedAt: new Date().toISOString() },
  { id: "4", currency: "BRL", rate: 5.2, isActive: true, updatedAt: new Date().toISOString() },
]

export async function GET() {
  try {
    // If we have in-memory rates, use them
    const memoryRates = memoryStorage.getRates()
    console.log("Memory rates:", memoryRates)
    if (memoryRates.length > 0) {
      return NextResponse.json({ rates: memoryRates })
    }

    // Try to get from database first
    try {
      const { prisma } = await import("@/lib/db")
      const rates = await prisma.exchangeRate.findMany({
        orderBy: { currency: "asc" }
      })
      return NextResponse.json({ rates })
    } catch (dbError) {
      // Fallback to mock data if database is not available
      console.warn("Database not available, using mock exchange rates:", dbError)
      return NextResponse.json({ rates: MOCK_RATES })
    }
  } catch (error) {
    console.error("Error fetching exchange rates:", error)
    return NextResponse.json(
      { error: "Error fetching exchange rates" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { rates } = await request.json()

    if (!Array.isArray(rates)) {
      return NextResponse.json(
        { error: "Invalid rates data" },
        { status: 400 }
      )
    }

    // Try to update in database first
    try {
      const { prisma } = await import("@/lib/db")
      
      // Update each rate
      for (const rate of rates) {
        await prisma.exchangeRate.update({
          where: { id: rate.id },
          data: {
            rate: rate.rate,
            isActive: rate.isActive,
          }
        })
      }
      
      return NextResponse.json({ success: true })
    } catch (dbError) {
      // Fallback: store in memory
      console.warn("Database not available, storing in memory:", dbError)
      memoryStorage.setRates(rates)
      return NextResponse.json({ success: true, message: "Rates updated in memory" })
    }
  } catch (error) {
    console.error("Error updating exchange rates:", error)
    return NextResponse.json(
      { error: "Error updating exchange rates" },
      { status: 500 }
    )
  }
}
