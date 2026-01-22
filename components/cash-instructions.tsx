"use client"

import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, MapPin, CheckCircle, Phone } from "lucide-react"

interface CashInstructionsProps {
  currency: string
  amount: number
}

export default function CashInstructions({
  currency,
  amount
}: CashInstructionsProps) {
  const formatCurrency = (value: number) => {
    if (currency === "PYG") {
      return new Intl.NumberFormat("es-PY", {
        style: "currency",
        currency: "PYG",
        minimumFractionDigits: 0
      }).format(value)
    } else {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
      }).format(value)
    }
  }

  return (
    <Card className="border-green-200 bg-green-50">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <DollarSign className="h-8 w-8 text-green-600" />
          <div>
            <h3 className="font-semibold text-green-900">Instrucciones para Pago en Efectivo</h3>
            <p className="text-sm text-green-700">Sigue estos pasos para completar tu pago</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 font-bold">1</span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-green-900">Confirma tu pedido</h4>
              <p className="text-sm text-green-700">Revisa que todos los productos en tu carrito estén correctos antes de pagar</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 font-bold">2</span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-green-900">Prepara el monto exacto</h4>
              <p className="text-sm text-green-700">Ten listo el monto exacto en efectivo: {formatCurrency(amount)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 font-bold">3</span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-green-900">Coordina la entrega</h4>
              <p className="text-sm text-green-700">Proporciona una dirección clara donde recibirás tu pedido</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 font-bold">4</span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-green-900">Paga y espera</h4>
              <p className="text-sm text-green-700">Paga al repartidor y espera tu confirmación por WhatsApp o email</p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-green-100 rounded-lg">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Importante:</span>
          </div>
          <p className="text-sm text-green-700">
            El repartidor te entregará un comprobante de pago. Guárdalo para tu referencia.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
