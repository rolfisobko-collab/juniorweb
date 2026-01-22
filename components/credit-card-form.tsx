"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { CreditCard, Lock } from "lucide-react"

interface CreditCardFormProps {
  cardNumber: string
  cardName: string
  cardExpiry: string
  cardCvv: string
  onCardNumberChange: (value: string) => void
  onCardNameChange: (value: string) => void
  onCardExpiryChange: (value: string) => void
  onCardCvvChange: (value: string) => void
}

export default function CreditCardForm({
  cardNumber,
  cardName,
  cardExpiry,
  cardCvv,
  onCardNumberChange,
  onCardNameChange,
  onCardExpiryChange,
  onCardCvvChange
}: CreditCardFormProps) {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h3 className="font-medium mb-4 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-blue-600" />
          <span>Información de Tarjeta</span>
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Número de Tarjeta *</Label>
              <Input
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => onCardNumberChange(e.target.value)}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cardName">Nombre en la Tarjeta *</Label>
              <Input
                id="cardName"
                value={cardName}
                onChange={(e) => onCardNameChange(e.target.value)}
                placeholder="JUAN PEREZ"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cardExpiry">Vencimiento *</Label>
              <Input
                id="cardExpiry"
                value={cardExpiry}
                onChange={(e) => onCardExpiryChange(e.target.value)}
                placeholder="MM/AA"
                maxLength={5}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cardCvv">CVV *</Label>
              <Input
                id="cardCvv"
                value={cardCvv}
                onChange={(e) => onCardCvvChange(e.target.value)}
                placeholder="123"
                maxLength={4}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <Lock className="h-4 w-4" />
          <span>Tus datos de pago están seguros y encriptados</span>
        </div>
      </CardContent>
    </Card>
  )
}
