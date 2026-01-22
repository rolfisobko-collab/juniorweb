"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search, ArrowLeft, Package } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Number */}
        <div className="relative mb-8">
          <div className="text-8xl sm:text-9xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
            404
          </div>
          <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                <Package className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
              </div>
              <div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 bg-blue-200 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>
        </div>

        {/* Error Messages */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          ¡Página no encontrada!
        </h1>
        
        <p className="text-gray-600 text-lg sm:text-xl mb-12 max-w-md mx-auto leading-relaxed">
          Ups! La página que buscas parece haber desaparecido. 
          Puede que el enlace esté roto o la página haya sido movida.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild className="w-full sm:w-auto gap-2 bg-blue-500 hover:bg-blue-600 text-white">
            <Link href="/">
              <Home className="h-4 w-4" />
              Ir al Inicio
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full sm:w-auto gap-2 border-blue-500 text-blue-500 hover:bg-blue-50">
            <Link href="/products">
              <Search className="h-4 w-4" />
              Ver Productos
            </Link>
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver Atrás
          </Button>
        </div>
      </div>
    </div>
  )
}
