"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Building, CreditCard, Smartphone, DollarSign, CheckCircle } from "lucide-react"

interface TransferInstructionsProps {
  currency: string
  amount: number
}

export default function TransferInstructions({
  currency,
  amount
}: TransferInstructionsProps) {
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
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <Building className="h-8 w-8 text-blue-600" />
          <div>
            <h3 className="font-semibold text-blue-900">Instrucciones para Transferencia Bancaria</h3>
            <p className="text-sm text-blue-700">Sigue estos pasos para completar tu pago</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-bold">1</span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-blue-900">Inicia sesión en tu banca</h4>
              <p className="text-sm text-blue-700">Accede a tu banca en línea o aplicación móvil</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-bold">2</span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-blue-900">Selecciona transferencia</h4>
              <p className="text-sm text-blue-700">Busca la opción de transferencia a otras cuentas o transferencia programada</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-bold">3</span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-blue-900">Ingresa los datos</h4>
              <p className="text-sm text-blue-700">Completa los datos de transferencia:</p>
              <ul className="text-sm text-blue-700 space-y-1 mt-2">
                <li><strong>Banco:</strong> Banco Continental S.A.E.C.</li>
                <li><strong>Titular de la cuenta:</strong> TechZone Ecommerce</li>
                <li><strong>Número de cuenta:</strong> 123456789</li>
                <li><strong>CI/RUC:</strong> 800123456</li>
                <li><strong>Monto:</strong> {formatCurrency(amount)}</li>
                <li><strong>Referencia:</strong> Pedido #{Math.random().toString(36).slice(2, 8).toUpperCase()}</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-bold">4</span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-blue-900">Confirma y envía comprobante</h4>
              <p className="text-sm text-blue-700">Envía el comprobante de transferencia a nuestro WhatsApp o email para procesar tu pedido</p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-100 rounded-lg">
          <div className="flex items-center gap-2 text-blue-700">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Importante:</span>
          </div>
          <p className="text-sm text-blue-700">
            El procesamiento puede tomar hasta 24 horas hábiles. Te notificaremos cuando tu pedido sea confirmado.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
