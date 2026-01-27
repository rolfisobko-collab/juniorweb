import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Devoluciones y Cambios | TechZone",
  description: "Política de devoluciones y cambios de TechZone. Conoce nuestros plazos, condiciones y proceso para devolver productos.",
}

export default function ReturnPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="prose prose-gray max-w-none">
        <h1 className="text-4xl font-bold mb-8">Devoluciones y Cambios</h1>
        
        <nav className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Contenido</h2>
          <ul className="space-y-2 text-sm">
            <li><a href="#plazos" className="text-primary hover:underline">1. Plazos de Devolución</a></li>
            <li><a href="#condiciones" className="text-primary hover:underline">2. Condiciones para Devolución</a></li>
            <li><a href="#productos" className="text-primary hover:underline">3. Productos No Devolvibles</a></li>
            <li><a href="#proceso" className="text-primary hover:underline">4. Proceso de Devolución</a></li>
            <li><a href="#reembolso" className="text-primary hover:underline">5. Reembolsos</a></li>
            <li><a href="#cambios" className="text-primary hover:underline">6. Cambios de Producto</a></li>
            <li><a href="#costos" className="text-primary hover:underline">7. Costos de Envío</a></li>
            <li><a href="#garantia" className="text-primary hover:underline">8. Devoluciones por Garantía</a></li>
            <li><a href="#contacto" className="text-primary hover:underline">9. Contacto</a></li>
          </ul>
        </nav>

        <section id="plazos" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">1. Plazos de Devolución</h2>
          <p>Tienes hasta <strong>30 días calendario</strong> desde la fecha de recepción para devolver o cambiar tu producto.</p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-blue-800 mb-2">Excepción: Período de Navidad</h4>
            <p className="text-blue-700 text-sm">
              Para compras realizadas entre el 15 de noviembre y el 24 de diciembre, 
              el plazo de devolución se extiende hasta el 15 de enero.
            </p>
          </div>
        </section>

        <section id="condiciones" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">2. Condiciones para Devolución</h2>
          <p>Para que tu devolución sea aceptada, el producto debe:</p>
          <ul className="list-disc pl-6">
            <li>Estar en su estado original, sin usar</li>
            <li>Tener todas las etiquetas y empaques originales</li>
            <li>Incluir accesorios, manuales y cables originales</li>
            <li>No presentar daños físicos o signos de uso</li>
            <li>Tener el recibo de compra original</li>
          </ul>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Importante</h4>
            <p className="text-yellow-700 text-sm">
              Los productos que no cumplan con estas condiciones pueden ser rechazados 
              o sujetos a cargos por reacondicionamiento.
            </p>
          </div>
        </section>

        <section id="productos" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">3. Productos No Devolvibles</h2>
          <p>Los siguientes productos no pueden ser devueltos:</p>
          <ul className="list-disc pl-6">
            <li>Software descargado o licencias digitales</li>
            <li>Productos personalizados o hechos a medida</li>
            <li>Periódicos, revistas o publicaciones periódicas</li>
            <li>Productos de higiene personal (por razones de salud)</li>
            <li>Productos con sellos de seguridad rotos</li>
            <li>Productos electrónicos con garantía activada</li>
          </ul>
        </section>

        <section id="proceso" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">4. Proceso de Devolución</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold">1</div>
              <div>
                <h3 className="font-semibold">Solicita la Devolución</h3>
                <p className="text-sm text-muted-foreground">
                  Contáctanos por email o teléfono para iniciar el proceso. 
                  Necesitaremos tu número de pedido y motivo de la devolución.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold">2</div>
              <div>
                <h3 className="font-semibold">Recibe Autorización</h3>
                <p className="text-sm text-muted-foreground">
                  Te enviaremos una guía de devolución y las instrucciones 
                  para empacar el producto correctamente.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold">3</div>
              <div>
                <h3 className="font-semibold">Envía el Producto</h3>
                <p className="text-sm text-muted-foreground">
                  Empaca el producto con todos sus accesorios y llévalo al 
                  transportista indicado. Conserva el comprobante de envío.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold">4</div>
              <div>
                <h3 className="font-semibold">Inspección y Procesamiento</h3>
                <p className="text-sm text-muted-foreground">
                  Una vez recibido, inspeccionaremos el producto. Si cumple 
                  con las condiciones, procesaremos tu reembolso en 3-5 días hábiles.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="reembolso" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">5. Reembolsos</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Métodos de Reembolso</h3>
              <p>El reembolso se realizará mediante:</p>
              <ul className="list-disc pl-6">
                <li>Devolución a tu tarjeta de crédito/débito (5-7 días hábiles)</li>
                <li>Transferencia bancaria (3-5 días hábiles)</li>
                <li>Crédito en tienda (inmediato)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold">Montos Reembolsables</h3>
              <ul className="list-disc pl-6">
                <li>Costo del producto (100%)</li>
                <li>Costo de envío original (si la devolución es por nuestro error)</li>
                <li>No se reembolsan costos de envío de devolución</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="cambios" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">6. Cambios de Producto</h2>
          <p>Puedes cambiar tu producto por otro de igual o mayor valor. Si el nuevo producto tiene un mayor valor, deberás pagar la diferencia.</p>
          
          <div className="bg-gray-50 rounded-lg p-4 mt-4">
            <h4 className="font-semibold mb-2">Ejemplo de Cambio:</h4>
            <ul className="text-sm space-y-1">
              <li>• Producto original: Gs. 500.000</li>
              <li>• Nuevo producto: Gs. 600.000</li>
              <li>• Diferencia a pagar: Gs. 100.000</li>
            </ul>
          </div>
        </section>

        <section id="costos" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">7. Costos de Envío</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Devoluciones por Nuestro Error</h3>
              <p>Si la devolución es por un error nuestro (producto incorrecto, dañado, etc.), cubriremos todos los costos de envío.</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Devoluciones por Decisión del Cliente</h3>
              <p>Si devuelves el producto por decisión propia, los costos de envío de devolución corren por tu cuenta.</p>
            </div>
          </div>
        </section>

        <section id="garantia" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">8. Devoluciones por Garantía</h2>
          <p>Los productos con defectos de fabricación están cubiertos por la garantía del fabricante. El proceso es:</p>
          <ul className="list-disc pl-6">
            <li>Reporta el problema dentro del período de garantía</li>
            <li>Proporciona prueba de compra y descripción del problema</li>
            <li>Te guiaremos a través del proceso de garantía del fabricante</li>
            <li>Las reparaciones o reemplazos están sujetos a los términos del fabricante</li>
          </ul>
        </section>

        <section id="contacto" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">9. Contacto</h2>
          <p>
            Para iniciar una devolución o si tienes preguntas, contáctanos:<br />
            Email: devoluciones@techzone.com.py<br />
            Teléfono: +595 21 123 456<br />
            WhatsApp: +595 971 234 567<br />
            Horario: Lunes a Viernes, 9:00 - 18:00
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-green-800 mb-2">Consejo Útil</h4>
            <p className="text-green-700 text-sm">
              Guarda el empaque original hasta que estés seguro de que quieres 
              mantener el producto. Esto facilitará cualquier devolución futura.
            </p>
          </div>
        </section>

        <div className="mt-16 pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            Última actualización: {new Date().toLocaleDateString('es-PY')}
          </p>
        </div>
      </div>
    </div>
  )
}
