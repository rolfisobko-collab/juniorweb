"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { CreditCard, Building, DollarSign, Smartphone } from "lucide-react"

interface PaymentMethodSelectorProps {
  paymentMethod: string
  currency: string
  onPaymentMethodChange: (method: string) => void
  onCurrencyChange: (currency: string) => void
}

export default function PaymentMethodSelector({
  paymentMethod,
  currency,
  onPaymentMethodChange,
  onCurrencyChange
}: PaymentMethodSelectorProps) {
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <h3 className="font-medium mb-4">Método de Pago</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Método de Pago</Label>
            <Select value={paymentMethod} onValueChange={onPaymentMethodChange}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Tarjeta de Crédito/Débito</span>
                  </div>
                </SelectItem>
                <SelectItem value="transfer">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <span>Transferencia Bancaria</span>
                  </div>
                </SelectItem>
                <SelectItem value="cash">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span>Pago en Efectivo</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Moneda</Label>
            <Select value={currency} onValueChange={onCurrencyChange}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar moneda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PYG">
                  <span>Guaraníes (PYG)</span>
                </SelectItem>
                <SelectItem value="USD">
                  <span>Dólares Americanos (USD)</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
