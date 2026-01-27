import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Garantía | TechZone",
  description: "Política de garantía de TechZone. Conoce nuestros términos de garantía para productos tecnológicos.",
}

export default function WarrantyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="prose prose-gray max-w-none">
        <h1 className="text-4xl font-bold mb-8">Garantía</h1>
        
        <nav className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Contenido</h2>
          <ul className="space-y-2 text-sm">
            <li><a href="#cobertura" className="text-primary hover:underline">1. Cobertura de Garantía</a></li>
            <li><a href="#periodos" className="text-primary hover:underline">2. Períodos de Garantía</a></li>
            <li><a href="#exclusiones" className="text-primary hover:underline">3. Exclusiones de Garantía</a></li>
            <li><a href="#reclamo" className="text-primary hover:underline">4. Proceso de Reclamo</a></li>
            <li><a href="#reparacion" className="text-primary hover:underline">5. Reparación y Reemplazo</a></li>
            <li><a href="#tiempos" className="text-primary hover:underline">6. Tiempos de Reparación</a></li>
            <li><a href="#extencion" className="text-primary hover:underline">7. Extensión de Garantía</a></li>
            <li><a href="#contacto" className="text-primary hover:underline">8. Contacto</a></li>
          </ul>
        </nav>

        <section id="cobertura" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">1. Cobertura de Garantía</h2>
          <p>Nuestra garantía cubre defectos de fabricación y materiales bajo uso normal. La garantía aplica a:</p>
          <ul className="list-disc pl-6">
            <li>Defectos de fabricación en componentes electrónicos</li>
            <li>Fallas en el funcionamiento normal del producto</li>
            <li>Problemas de calidad de materiales y mano de obra</li>
            <li>Funcionamiento incorrecto según especificaciones del fabricante</li>
          </ul>
        </section>

        <section id="periodos" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">2. Períodos de Garantía</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border px-4 py-2 text-left">Categoría</th>
                  <th className="border px-4 py-2 text-left">Período de Garantía</th>
                  <th className="border px-4 py-2 text-left">Garantía Extendida</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">Laptops y Computadoras</td>
                  <td className="border px-4 py-2">1 año</td>
                  <td className="border px-4 py-2">Hasta 3 años</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Smartphones</td>
                  <td className="border px-4 py-2">1 año</td>
                  <td className="border px-4 py-2">Hasta 2 años</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Tablets</td>
                  <td className="border px-4 py-2">1 año</td>
                  <td className="border px-4 py-2">Hasta 2 años</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Accesorios (Cargadores, Cables)</td>
                  <td className="border px-4 py-2">6 meses</td>
                  <td className="border px-4 py-2">Hasta 1 año</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Audio (Auriculares, Parlantes)</td>
                  <td className="border px-4 py-2">6 meses</td>
                  <td className="border px-4 py-2">Hasta 1 año</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Gaming (Consolas, Controles)</td>
                  <td className="border px-4 py-2">1 año</td>
                  <td className="border px-4 py-2">Hasta 2 años</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="exclusiones" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">3. Exclusiones de Garantía</h2>
          <p>La garantía no cubre:</p>
          <ul className="list-disc pl-6">
            <li>Daños causados por uso inadecuado o negligencia</li>
            <li>Daños por caídas, golpes o impacto</li>
            <li>Exposición a líquidos, humedad o temperatura extrema</li>
            <li>Modificaciones o reparaciones no autorizadas</li>
            <li>Desgaste normal por uso (baterías, botones, etc.)</li>
            <li>Daños por sobrecarga eléctrica o rayos</li>
            <li>Software de terceros o virus informáticos</li>
            <li>Pérdida de datos (respalda tu información regularmente)</li>
            <li>Productos sin número de serie legible</li>
          </ul>
        </section>

        <section id="reclamo" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">4. Proceso de Reclamo</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold">1</div>
              <div>
                <h3 className="font-semibold">Documenta el Problema</h3>
                <p className="text-sm text-muted-foreground">
                  Toma fotos o videos del problema y describe detalladamente 
                  cuándo y cómo ocurre la falla.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold">2</div>
              <div>
                <h3 className="font-semibold">Contacta Soporte</h3>
                <p className="text-sm text-muted-foreground">
                  Llámanos o envía un email con tu número de pedido, 
                  número de serie del producto y descripción del problema.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold">3</div>
              <div>
                <h3 className="font-semibold">Diagnóstico Inicial</h3>
                <p className="text-sm text-muted-foreground">
                  Nuestro equipo técnico realizará un diagnóstico inicial 
                  para determinar si el problema está cubierto por garantía.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold">4</div>
              <div>
                <h3 className="font-semibold">Envío para Reparación</h3>
                <p className="text-sm text-muted-foreground">
                  Si es cubierto por garantía, te enviaremos instrucciones 
                  para enviar el producto a nuestro centro técnico.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="reparacion" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">5. Reparación y Reemplazo</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Reparación</h3>
              <p>
                En la mayoría de los casos, intentaremos reparar el producto 
                utilizando piezas originales del fabricante.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold">Reemplazo</h3>
              <p>
                Si la reparación no es posible o no es económica, 
                reemplazaremos el producto por uno equivalente o superior.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold">Devolución del Dinero</h3>
              <p>
                En casos excepcionales donde no podemos reparar ni reemplazar, 
                ofrecemos la devolución completa del dinero.
              </p>
            </div>
          </div>
        </section>

        <section id="tiempos" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">6. Tiempos de Reparación</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border px-4 py-2 text-left">Tipo de Producto</th>
                  <th className="border px-4 py-2 text-left">Tiempo Estimado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">Smartphones</td>
                  <td className="border px-4 py-2">7-14 días hábiles</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Laptops</td>
                  <td className="border px-4 py-2">10-21 días hábiles</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Tablets</td>
                  <td className="border px-4 py-2">7-14 días hábiles</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Accesorios</td>
                  <td className="border px-4 py-2">5-10 días hábiles</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            * Los tiempos pueden variar según la disponibilidad de piezas y la complejidad de la reparación.
          </p>
        </section>

        <section id="extencion" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">7. Extensión de Garantía</h2>
          <p>Ofrecemos planes de extensión de garantía para mayor tranquilidad:</p>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">Plan Protección Plus</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Extiende tu garantía por 1 año adicional.
              </p>
              <ul className="text-sm">
                <li>• Cobertura adicional de 12 meses</li>
                <li>• Soporte prioritario</li>
                <li>• Reemplazo exprés en caso de falla crítica</li>
              </ul>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">Plan Protección Premium</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Extiende tu garantía por 2 años adicionales.
              </p>
              <ul className="text-sm">
                <li>• Cobertura adicional de 24 meses</li>
                <li>• Soporte VIP 24/7</li>
                <li>• Reemplazo inmediato sin diagnóstico previo</li>
                <li>• Incluye 1 año de seguro contra daños accidentales</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="contacto" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">8. Contacto</h2>
          <p>
            Para servicio de garantía, contáctanos:<br />
            Email: garantia@techzone.com.py<br />
            Teléfono: +595 21 123 456 (Opción 2)<br />
            WhatsApp: +595 971 234 567<br />
            Horario: Lunes a Viernes, 9:00 - 18:00
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-blue-800 mb-2">Información Necesaria</h4>
            <p className="text-blue-700 text-sm">
              Ten a mano: número de pedido, número de serie del producto, 
              fecha de compra y descripción detallada del problema.
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
