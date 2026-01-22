"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MapPin, X } from "lucide-react"

interface LocationModalProps {
  isOpen: boolean
  onClose: () => void
  onLocationSelect: (location: { address: string; lat: number; lng: number }) => void
}

export default function LocationModal({ isOpen, onClose, onLocationSelect }: LocationModalProps) {
  const [searchAddress, setSearchAddress] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<{ address: string; lat: number; lng: number } | null>(null)
  const [map, setMap] = useState<any>(null)

  // Inicializar mapa cuando se abre el modal
  const initMap = () => {
    if (!window.google || !window.google.maps) return

    const mapInstance = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: -25.296, lng: -57.636 }, // Centro de Paraguay
      zoom: 7,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    })

    setMap(mapInstance)

    // Agregar marcador al hacer clic
    mapInstance.addListener("click", (event: any) => {
      const lat = event.latLng.lat()
      const lng = event.latLng.lng()
      
      // Obtener dirección inversa
      const geocoder = new window.google.maps.Geocoder()
      geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
        if (status === "OK" && results[0]) {
          const address = results[0].formatted_address
          setSelectedLocation({ address, lat, lng })
          setSearchAddress(address)
        }
      })
    })
  }

  // Buscar dirección
  const searchLocation = () => {
    if (!window.google || !window.google.maps) return

    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ address: searchAddress }, (results: any, status: any) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location
        const lat = location.lat()
        const lng = location.lng()
        
        setSelectedLocation({
          address: results[0].formatted_address,
          lat,
          lng
        })

        // Centrar mapa en la ubicación encontrada
        if (map) {
          map.setCenter({ lat, lng })
          map.setZoom(15)
          
          // Agregar marcador
          new window.google.maps.Marker({
            position: { lat, lng },
            map: map,
            title: results[0].formatted_address
          })
        }
      }
    })
  }

  // Cargar Google Maps API
  const loadGoogleMaps = () => {
    if (window.google && window.google.maps) {
      initMap()
      return
    }

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&callback=initMap`
    script.async = true
    script.defer = true
    
    window.initMap = initMap
    document.body.appendChild(script)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Seleccionar Ubicación
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Búsqueda de dirección */}
          <div className="space-y-2">
            <Label htmlFor="address-search">Buscar Dirección</Label>
            <div className="flex gap-2">
              <Input
                id="address-search"
                placeholder="Ej: Av. Eusebio Ayala 1234, Asunción"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                className="flex-1"
              />
              <Button onClick={searchLocation} variant="outline">
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mapa */}
          <div className="space-y-2">
            <Label>Selecciona tu ubicación en el mapa</Label>
            <div 
              id="map" 
              className="w-full h-96 rounded-lg border border-border bg-muted"
              onClick={loadGoogleMaps}
            >
              {!window.google && (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 mx-auto mb-2" />
                    <p>Clic para cargar el mapa</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ubicación seleccionada */}
          {selectedLocation && (
            <div className="space-y-2 p-4 bg-muted rounded-lg">
              <Label>Ubicación Seleccionada</Label>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm">{selectedLocation.address}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={() => {
                if (selectedLocation) {
                  onLocationSelect(selectedLocation)
                  onClose()
                }
              }}
              disabled={!selectedLocation}
            >
              Confirmar Ubicación
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Declaración para TypeScript
declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}
