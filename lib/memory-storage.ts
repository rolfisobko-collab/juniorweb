import { writeFileSync, readFileSync, existsSync } from "fs"
import { join } from "path"

// Simple in-memory storage for development without database
export interface ExchangeRate {
  id: string
  currency: string
  rate: number
  isActive: boolean
  updatedAt: string
}

class MemoryStorage {
  private getFilePath(): string {
    return join(process.cwd(), '.exchange-rates.json')
  }

  getRates(): ExchangeRate[] {
    try {
      if (existsSync(this.getFilePath())) {
        const data = readFileSync(this.getFilePath(), 'utf-8')
        return JSON.parse(data)
      }
    } catch (error) {
      console.warn("Error reading exchange rates file:", error)
    }
    return []
  }

  setRates(rates: ExchangeRate[]): void {
    try {
      writeFileSync(this.getFilePath(), JSON.stringify(rates, null, 2))
    } catch (error) {
      console.warn("Error writing exchange rates file:", error)
    }
  }

  clearRates(): void {
    try {
      if (existsSync(this.getFilePath())) {
        writeFileSync(this.getFilePath(), '[]')
      }
    } catch (error) {
      console.warn("Error clearing exchange rates file:", error)
    }
  }
}

export const memoryStorage = new MemoryStorage()
