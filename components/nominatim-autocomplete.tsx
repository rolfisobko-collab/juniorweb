"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Search, Building, Home, Map } from "lucide-react"

interface NominatimResult {
  id: string
  display_name: string
  lat: string
  lon: string
  type: string
  importance: number
  address: {
    road: string
    house_number: string
    suburb: string
    city: string
    town?: string
    village?: string
    state: string
    postcode: string
    country: string
  }
}

interface NominatimAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onSelect: (result: NominatimResult) => void
  placeholder?: string
  label?: string
  street?: string
  number?: string
  onStreetChange?: (value: string) => void
  onNumberChange?: (value: string) => void
}

export default function NominatimAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Buscar dirección en Paraguay...",
  label = "Buscar dirección",
  street = "",
  number = "",
  onStreetChange,
  onNumberChange
}: NominatimAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<NominatimResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const searchAddresses = async (query: string) => {
    if (query.length < 2) {
      setResults([])
      setIsOpen(false)
      setError("")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/addresses?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      
      if (data.success) {
        if (data.error) {
          setError(data.message || "Error al buscar direcciones")
          setResults([])
        } else {
          setResults(data.results || [])
          setIsOpen(true)
          setSelectedIndex(-1)
        }
      } else {
        setError("Error al conectar con el servicio")
        setResults([])
      }
    } catch (error) {
      console.error("Error fetching addresses:", error)
      setError("Error de conexión. Intenta nuevamente.")
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    onChange(value)
    searchAddresses(value)
  }

  const handleStreetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const streetValue = e.target.value
    if (onStreetChange) {
      onStreetChange(streetValue)
    }
    // Buscar con la calle actual
    const searchQuery = number ? `${streetValue} ${number}` : streetValue
    searchAddresses(searchQuery)
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numberValue = e.target.value
    if (onNumberChange) {
      onNumberChange(numberValue)
    }
    // Buscar con la calle y número actuales
    const searchQuery = street ? `${street} ${numberValue}` : numberValue
    searchAddresses(searchQuery)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % results.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev === -1 ? results.length - 1 : (prev - 1 + results.length) % results.length)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          selectResult(results[selectedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        break
    }
  }

  const selectResult = (result: NominatimResult) => {
    onChange(result.display_name)
    onSelect(result)
    setIsOpen(false)
    setSelectedIndex(-1)
  }

  const getIconForType = (type: string) => {
    switch (type) {
      case 'house':
      case 'building':
        return <Building className="h-4 w-4 text-blue-500" />
      case 'road':
      case 'street':
        return <Map className="h-4 w-4 text-green-500" />
      case 'city':
      case 'town':
      case 'village':
        return <Home className="h-4 w-4 text-orange-500" />
      default:
        return <MapPin className="h-4 w-4 text-primary" />
    }
  }

  const formatDisplayName = (result: NominatimResult) => {
    const { address } = result
    let parts = []
    
    if (address.road && address.house_number) {
      parts.push(`${address.road} ${address.house_number}`)
    } else if (address.road) {
      parts.push(address.road)
    }
    
    if (address.suburb) {
      parts.push(address.suburb)
    }
    
    if (address.city || address.town || address.village) {
      parts.push(address.city || address.town || address.village)
    }
    
    if (address.state) {
      parts.push(address.state)
    }
    
    return parts.join(", ")
  }

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (listRef.current && !listRef.current.contains(event.target as Node) && 
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative">
      <Label htmlFor="address-search" className="text-sm font-medium">
        {label}
      </Label>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="relative">
          <Input
            ref={inputRef}
            id="street-search"
            type="text"
            value={street}
            onChange={handleStreetChange}
            onKeyDown={handleKeyDown}
            onFocus={() => (street || number) && setIsOpen(true)}
            placeholder="Calle (Ej: Av. España)"
            className="pr-10"
          />
          {loading ? (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          )}
        </div>
        
        <div className="relative">
          <Input
            id="number-search"
            type="text"
            value={number}
            onChange={handleNumberChange}
            onKeyDown={handleKeyDown}
            onFocus={() => (street || number) && setIsOpen(true)}
            placeholder="Número (Ej: 123)"
            className="pr-10"
          />
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-500 mt-1">
          {error}
        </div>
      )}

      {isOpen && (
        <Card className="absolute z-50 w-full mt-1 max-h-80 overflow-y-auto">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Buscando direcciones reales...
              </div>
            ) : results.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No se encontraron direcciones
              </div>
            ) : (
              <div className="max-h-72 overflow-y-auto">
                {results.map((result, index) => (
                  <div
                    key={result.id}
                    className={`p-3 border-b cursor-pointer hover:bg-muted transition-colors ${
                      index === selectedIndex ? 'bg-muted' : ''
                    }`}
                    onClick={() => selectResult(result)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0">
                        {getIconForType(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm line-clamp-2">
                          {formatDisplayName(result)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {result.address.city && result.address.state && 
                            `${result.address.city}, ${result.address.state}`
                          }
                          {result.address.postcode && 
                            ` • CP: ${result.address.postcode}`
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
