"use client"

import { useState, useEffect } from "react"
import PanelLayout from "@/components/panel-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { getContactConfig, updateContactConfig, type ContactConfig, type SocialLink } from "@/lib/contact-data"
import { Save, Phone, MapPin, Globe } from "lucide-react"

export default function ContactPage() {
  const [config, setConfig] = useState<ContactConfig>(getContactConfig())
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  useEffect(() => {
    setConfig(getContactConfig())
  }, [])

  const handleSave = () => {
    setIsSaving(true)
    setSaveMessage("")

    try {
      updateContactConfig(config)
      setSaveMessage("Configuración guardada exitosamente")
      setTimeout(() => setSaveMessage(""), 3000)
    } catch (error) {
      setSaveMessage("Error al guardar la configuración")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSocialLinkChange = (index: number, field: keyof SocialLink, value: string | boolean) => {
    const newSocialLinks = [...config.socialLinks]
    newSocialLinks[index] = { ...newSocialLinks[index], [field]: value }
    setConfig({ ...config, socialLinks: newSocialLinks })
  }

  return (
    <PanelLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Información de Contacto</h1>
          <p className="text-muted-foreground">Gestiona la información de contacto visible en el footer</p>
        </div>

        {saveMessage && (
          <div
            className={`p-4 rounded-lg ${saveMessage.includes("Error") ? "bg-destructive/10 text-destructive" : "bg-green-500/10 text-green-700"}`}
          >
            {saveMessage}
          </div>
        )}

        {/* Descripción de la Empresa */}
        <Card>
          <CardHeader>
            <CardTitle>Descripción de la Empresa</CardTitle>
            <CardDescription>Texto descriptivo que aparece en el footer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <textarea
                id="description"
                value={config.description}
                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                placeholder="Tu destino premium para tecnología..."
                className="w-full min-h-[100px] p-3 border rounded-md resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Este texto aparecerá debajo del logo en el footer del sitio
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Dirección */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Dirección
            </CardTitle>
            <CardDescription>Dirección física de tu negocio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                value={config.address}
                onChange={(e) => setConfig({ ...config, address: e.target.value })}
                placeholder="Av. Corrientes 1234"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  value={config.city}
                  onChange={(e) => setConfig({ ...config, city: e.target.value })}
                  placeholder="Buenos Aires"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">País</Label>
                <Input
                  id="country"
                  value={config.country}
                  onChange={(e) => setConfig({ ...config, country: e.target.value })}
                  placeholder="Argentina"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contacto */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contacto Directo
            </CardTitle>
            <CardDescription>Teléfono y email de contacto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={config.phone}
                onChange={(e) => setConfig({ ...config, phone: e.target.value })}
                placeholder="+54 9 11 2345-6789"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={config.email}
                onChange={(e) => setConfig({ ...config, email: e.target.value })}
                placeholder="contacto@techzone.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Horarios */}
        <Card>
          <CardHeader>
            <CardTitle>Horarios de Atención</CardTitle>
            <CardDescription>Define los horarios de atención al cliente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="weekdays">Días de semana</Label>
              <Input
                id="weekdays"
                value={config.workingHours.weekdays}
                onChange={(e) =>
                  setConfig({ ...config, workingHours: { ...config.workingHours, weekdays: e.target.value } })
                }
                placeholder="Lun - Vie: 9:00 - 18:00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="saturday">Sábado</Label>
              <Input
                id="saturday"
                value={config.workingHours.saturday}
                onChange={(e) =>
                  setConfig({ ...config, workingHours: { ...config.workingHours, saturday: e.target.value } })
                }
                placeholder="Sáb: 10:00 - 14:00"
              />
            </div>
          </CardContent>
        </Card>

        {/* Redes Sociales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Redes Sociales
            </CardTitle>
            <CardDescription>Configura los enlaces a tus redes sociales</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {config.socialLinks.map((social, index) => (
              <div key={social.platform} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-1 space-y-2">
                  <Label className="capitalize">{social.platform}</Label>
                  <Input
                    value={social.url}
                    onChange={(e) => handleSocialLinkChange(index, "url", e.target.value)}
                    placeholder={`https://${social.platform}.com/tu-negocio`}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`enabled-${social.platform}`} className="text-sm">
                    Activo
                  </Label>
                  <Switch
                    id={`enabled-${social.platform}`}
                    checked={social.enabled}
                    onCheckedChange={(checked) => handleSocialLinkChange(index, "enabled", checked)}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving} size="lg" className="min-w-[200px]">
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </div>
    </PanelLayout>
  )
}
