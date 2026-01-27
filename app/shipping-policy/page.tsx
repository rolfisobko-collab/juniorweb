import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Política de Envíos | TechZone",
  description: "Política de envíos de TechZone. Conoce nuestros tiempos, costos y métodos de envío en Paraguay.",
}

export default function ShippingPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="prose prose-gray max-w-none">
        <h1 className="text-4xl font-bold mb-8">Política de Envíos</h1>
        
        <nav className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Contenido</h2>
          <ul className="space-y-2 text-sm">
            <li><a href="#metodos" className="text-primary hover:underline">1. Métodos de Envío</a></li>
            <li><a href="#tiempos" className="text-primary hover:underline">2. Tiempos de Entrega</a></li>
            <li><a href="#costos" className="text-primary hover:underline">3. Costos de Envío</a></li>
            <li><a href="#procesamiento" className="text-primary hover:underline">4. Procesamiento de Pedidos</a></li>
            <li><a href="#seguimiento" className="text-primary hover:underline">5. Seguimiento de Envíos</a></li>
            <li><a href="#entrega" className="text-primary hover:underline">6. Recepción de Pedidos</a></li>
            <li><a href="#problemas" className="text-primary hover:underline">7. Problemas con Envíos</a></li>
            <li><a href="#restricciones" className="text-primary hover:underline">8. Restricciones de Envío</a></li>
            <li><a href="#contacto" className="text-primary hover:underline">9. Contacto</a></li>
          </ul>
        </nav>

        <section id="metodos" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">1. Métodos de Envío</h2>
          <p>TechZone ofrece las siguientes opciones de envío en Paraguay:</p>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">Retiro en Local</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Retira tu pedido en nuestro local sin costo adicional.
              </p>
              <ul className="text-sm">
                <li>• Costo: Gratuito</li>
                <li>• Tiempo: Inmediato</li>
                <li>• Dirección: Av. Eusebio Ayala 1234, Asunción</li>
                <li>• Horario: Lunes a Viernes 9:00-18:00, Sábados 9:00-12:00</li>
              </ul>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">Envío AEX Express</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Envío rápido y seguro con Agencia de Envíos Express.
              </p>
              <ul className="text-sm">
                <li>• Costo: Calculado automáticamente según destino y peso</li>
                <li>• Tiempo: 1-3 días hábiles según ubicación</li>
                <li>• Cobertura: Todo Paraguay</li>
                <li>• Seguimiento: Incluido</li>
              </ul>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">Envío a Coordinar</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Coordinamos entrega directa a tu domicilio.
              </p>
              <ul className="text-sm">
                <li>• Costo: Se confirma al momento de coordinar</li>
                <li>• Tiempo: 1-2 días hábiles</li>
                <li>• Disponibilidad: Asunción y área metropolitana</li>
                <li>• Horario: Según conveniencia con el cliente</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="tiempos" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">2. Tiempos de Entrega</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border px-4 py-2 text-left">Ubicación</th>
                  <th className="border px-4 py-2 text-left">Tiempo Estimado</th>
                  <th className="border px-4 py-2 text-left">Días Hábiles</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">Asunción</td>
                  <td className="border px-4 py-2">1-2 días</td>
                  <td className="border px-4 py-2">Sí</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Ciudad del Este</td>
                  <td className="border px-4 py-2">1-2 días</td>
                  <td className="border px-4 py-2">Sí</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Encarnación</td>
                  <td className="border px-4 py-2">2-3 días</td>
                  <td className="border px-4 py-2">Sí</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Otras ciudades</td>
                  <td className="border px-4 py-2">3-5 días</td>
                  <td className="border px-4 py-2">Sí</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            * Los tiempos son estimados y pueden variar por factores externos como clima, feriados o volumen de pedidos.
          </p>
        </section>

        <section id="costos" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">3. Costos de Envío</h2>
          <p>Los costos de envío se calculan automáticamente según:</p>
          <ul className="list-disc pl-6">
            <li>Peso total del pedido</li>
            <li>Dimensiones de los paquetes</li>
            <li>Ubicación de destino</li>
            <li>Método de envío seleccionado</li>
          </ul>
          
          <div className="bg-gray-50 rounded-lg p-4 mt-4">
            <h4 className="font-semibold mb-2">Costos de Referencia AEX:</h4>
            <ul className="text-sm space-y-1">
              <li>• Asunción y Central: Desde Gs. 25.000</li>
              <li>• Alto Paraná: Desde Gs. 45.000</li>
              <li>• Itapúa: Desde Gs. 50.000</li>
              <li>• Resto del país: Desde Gs. 55.000</li>
            </ul>
          </div>
        </section>

        <section id="procesamiento" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">4. Procesamiento de Pedidos</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Confirmación del Pedido</h3>
              <p>Recibirás un correo electrónico de confirmación dentro de las 24 horas posteriores a tu compra.</p>
            </div>
            <div>
              <h3 className="font-semibold">Preparación del Envío</h3>
              <p>Los pedidos se procesan en 1-2 días hábiles. Te notificaremos cuando tu pedido haya sido enviado.</p>
            </div>
            <div>
              <h3 className="font-semibold">Información de Seguimiento</h3>
              <p>Recibirás un número de seguimiento para rastrear tu pedido en tiempo real.</p>
            </div>
          </div>
        </section>

        <section id="seguimiento" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">5. Seguimiento de Envíos</h2>
          <p>Puedes seguir tu pedido de las siguientes maneras:</p>
          <ul className="list-disc pl-6">
            <li>A través de tu cuenta en nuestro sitio web</li>
            <li>Con el número de seguimiento en el sitio del transportista</li>
            <li>Recibiendo actualizaciones por correo electrónico</li>
            <li>Contactando a nuestro servicio de atención al cliente</li>
          </ul>
        </section>

        <section id="entrega" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">6. Recepción de Pedidos</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Al Recibir tu Pedido:</h3>
              <ul className="list-disc pl-6">
                <li>Verifica que el paquete esté en buen estado</li>
                <li>Confirma que recibiste todos los productos</li>
                <li>Firma de recibido si es necesario</li>
                <li>Informa cualquier daño inmediatamente</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Si no estás disponible:</h3>
              <p>El transportista intentará entregar tu pedido en otro momento o dejará un aviso con instrucciones.</p>
            </div>
          </div>
        </section>

        <section id="problemas" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">7. Problemas con Envíos</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Pedido No Recibido</h3>
              <p>Si no recibes tu pedido en el tiempo estimado, contáctanos de inmediato para investigar el estado.</p>
            </div>
            <div>
              <h3 className="font-semibold">Paquete Dañado</h3>
              <p>Si recibes un paquete dañado, toma fotos y contáctanos dentro de las 24 horas para gestionar una solución.</p>
            </div>
            <div>
              <h3 className="font-semibold">Dirección Incorrecta</h3>
              <p>Si proporcionaste una dirección incorrecta, pueden aplicarse cargos adicionales por reenvío.</p>
            </div>
          </div>
        </section>

        <section id="restricciones" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">8. Restricciones de Envío</h2>
          <p>No enviamos los siguientes productos:</p>
          <ul className="list-disc pl-6">
            <li>Productos peligrosos o inflamables</li>
            <li>Líquidos corrosivos o tóxicos</li>
            <li>Armas de fuego o municiones</li>
            <li>Productos farmacéuticos controlados</li>
            <li>Animales vivos</li>
            <li>Productos que violen la ley paraguaya</li>
          </ul>
        </section>

        <section id="contacto" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">9. Contacto</h2>
          <p>
            Para preguntas sobre envíos, contáctanos:<br />
            Email: envios@techzone.com.py<br />
            Teléfono: +595 21 123 456<br />
            WhatsApp: +595 971 234 567<br />
            Horario: Lunes a Viernes, 9:00 - 18:00
          </p>
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
