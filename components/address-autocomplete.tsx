"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Search, Building2 } from "lucide-react"

interface Address {
  id: string
  city: string
  state: string
  zipCode: string
  address: string
  neighborhood: string
}

interface AddressAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onSelect: (address: Address) => void
  placeholder?: string
  label?: string
}

export default function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Buscar dirección...",
  label = "Dirección"
}: AddressAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const fetchAddresses = async (query: string) => {
    if (query.length < 2) {
      setAddresses([])
      setIsOpen(false)
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/addresses?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      
      if (data.success) {
        setAddresses(data.addresses)
        setIsOpen(true)
        setSelectedIndex(-1)
      }
    } catch (error) {
      console.error("Error fetching addresses:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    onChange(value)
    fetchAddresses(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || addresses.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % addresses.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev === -1 ? addresses.length - 1 : (prev - 1 + addresses.length) % addresses.length)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          selectAddress(addresses[selectedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        break
    }
  }

  const selectAddress = (address: Address) => {
    const fullAddress = `${address.address}, ${address.neighborhood}, ${address.city}, ${address.state}`
    onChange(fullAddress)
    onSelect(address)
    setIsOpen(false)
    setSelectedIndex(-1)
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
      <Label htmlFor="address" className="text-sm font-medium">
        {label}
      </Label>
      <div className="relative">
        <Input
          ref={inputRef}
          id="address"
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => value.length >= 2 && setIsOpen(true)}
          placeholder={placeholder}
          className="pr-10"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      </div>

      {isOpen && (
        <Card className="absolute z-50 w-full mt-1 max-h-64 overflow-y-auto">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Buscando direcciones...
              </div>
            ) : addresses.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No se encontraron direcciones
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto">
                {addresses.map((address, index) => (
                  <div
                    key={address.id}
                    className={`p-3 border-b cursor-pointer hover:bg-muted transition-colors ${
                      index === selectedIndex ? 'bg-muted' : ''
                    }`}
                    onClick={() => selectAddress(address)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{address.address}</div>
                        <div className="text-xs text-muted-foreground">
                          {address.neighborhood}, {address.city}, {address.state}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          CP: {address.zipCode}
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
