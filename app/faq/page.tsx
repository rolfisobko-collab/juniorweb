import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Preguntas Frecuentes | TechZone",
  description: "FAQ de TechZone. Respuestas a las preguntas más frecuentes sobre productos, envíos, pagos y garantía.",
}

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="prose prose-gray max-w-none">
        <h1 className="text-4xl font-bold mb-8">Preguntas Frecuentes</h1>
        
        <nav className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Categorías</h2>
          <ul className="space-y-2 text-sm">
            <li><a href="#productos" className="text-primary hover:underline">📱 Productos y Compras</a></li>
            <li><a href="#pagos" className="text-primary hover:underline">💳 Pagos y Precios</a></li>
            <li><a href="#envios" className="text-primary hover:underline">📦 Envíos y Entrega</a></li>
            <li><a href="#devoluciones" className="text-primary hover:underline">🔄 Devoluciones y Cambios</a></li>
            <li><a href="#garantia" className="text-primary hover:underline">🛡️ Garantía y Soporte</a></li>
            <li><a href="#cuenta" className="text-primary hover:underline">👤 Mi Cuenta</a></li>
          </ul>
        </nav>

        <section id="productos" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">📱 Productos y Compras</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">¿Son productos originales?</h3>
              <p>Sí, todos nuestros productos son 100% originales y cuentan con garantía oficial del fabricante. Trabajamos directamente con distribuidores autorizados.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">¿Cómo sé si un producto está en stock?</h3>
              <p>La disponibilidad se muestra en cada página de producto. Si un producto está agotado, puedes activar la notificación para saber cuando vuelva a estar disponible.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">¿Ofrecen precios especiales para empresas?</h3>
              <p>Sí, tenemos programas especiales para empresas y compras volumétricas. Contáctanos en empresas@techzone.com.py para más información.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">¿Puedo ver el producto antes de comprar?</h3>
              <p>¡Claro! Te invitamos a nuestro showroom en Av. Eusebio Ayala 1234, Asunción. Allí podrás ver y probar los productos antes de decidir.</p>
            </div>
          </div>
        </section>

        <section id="pagos" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">💳 Pagos y Precios</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">¿Qué métodos de pago aceptan?</h3>
              <p>Aceptamos tarjetas de crédito/débito (Visa, Mastercard, American Express), transferencias bancarias, billeteras digitales (Mercado Pago, Billetera Personal) y efectivo en nuestro local.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">¿Los precios incluyen impuestos?</h3>
              <p>Sí, todos los precios mostrados incluyen el IVA (10%) y todos los impuestos aplicables. No hay cargos ocultos.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">¿Ofrecen cuotas sin interés?</h3>
              <p>Sí, tenemos planes de cuotas sin interés con tarjetas seleccionadas. Las condiciones se muestran en el proceso de pago.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">¿Es seguro comprar con tarjeta en su sitio?</h3>
              <p>Absolutamente. Utilizamos encriptación SSL de 256 bits y cumplimos con los estándares PCI DSS para proteger tu información de pago.</p>
            </div>
          </div>
        </section>

        <section id="envios" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">📦 Envíos y Entrega</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">¿Hacen envíos a todo Paraguay?</h3>
              <p>Sí, realizamos envíos a todo el territorio paraguayo. Los tiempos y costos varían según la ubicación.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">¿Cuánto tarda el envío a Asunción?</h3>
              <p>Los envíos a Asunción y área metropolitana tardan 1-2 días hábiles.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">¿Puedo retirar mi pedido en el local?</h3>
              <p>Sí, puedes optar por retiro en nuestro local sin costo adicional. Tu pedido estará disponible en 24 horas hábiles.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">¿Cómo rastreo mi pedido?</h3>
              <p>Recibirás un número de seguimiento por email cuando tu pedido sea enviado. También puedes verificar el estado en tu cuenta de TechZone.</p>
            </div>
          </div>
        </section>

        <section id="devoluciones" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">🔄 Devoluciones y Cambios</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">¿Cuál es el plazo para devolver un producto?</h3>
              <p>Tienes 30 días calendario desde la fecha de recepción para devolver o cambiar tu producto.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">¿En qué condiciones puedo devolver un producto?</h3>
              <p>El producto debe estar en su estado original, sin usar, con todos sus accesorios, empaques y el recibo de compra.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">¿Cómo inicio una devolución?</h3>
              <p>Contáctanos por email o teléfono. Te guiaremos a través del proceso y te enviaremos una guía de devolución.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">¿Cuándo recibiré mi reembolso?</h3>
              <p>Una vez recibido y verificado el producto, el reembolso se procesa en 3-5 días hábiles. El tiempo depende de tu método de pago.</p>
            </div>
          </div>
        </section>

        <section id="garantia" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">🛡️ Garantía y Soporte</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">¿Cuánto dura la garantía de los productos?</h3>
              <p>La mayoría de nuestros productos tienen 1 año de garantía del fabricante. Algunos accesorios tienen 6 meses. Consulta cada producto para detalles específicos.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">¿Qué cubre la garantía?</h3>
              <p>La garantía cubre defectos de fabricación y fallas en materiales. No cubre daños por uso inadecuado, caídas, líquidos o modificaciones no autorizadas.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">¿Cómo hago un reclamo de garantía?</h3>
              <p>Contacta a nuestro soporte técnico con tu número de pedido y descripción del problema. Te guiaremos a través del proceso de diagnóstico y reparación.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">¿Ofrecen soporte técnico?</h3>
              <p>Sí, nuestro equipo de soporte técnico está disponible de lunes a viernes de 9:00 a 18:00. Podemos ayudarte con configuración, troubleshooting y preguntas técnicas.</p>
            </div>
          </div>
        </section>

        <section id="cuenta" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">👤 Mi Cuenta</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">¿Es obligatorio crear una cuenta para comprar?</h3>
              <p>No, puedes comprar como invitado, pero crear una cuenta te permite seguir tus pedidos, guardar direcciones y acceder a promociones exclusivas.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">¿Cómo cambio mi contraseña?</h3>
              <p>Entra en "Mi Cuenta" {">"} "Configuración" {">"} "Cambiar Contraseña" o usa la opción "Olvidé mi contraseña" en la página de login.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">¿Puedo ver mis pedidos anteriores?</h3>
              <p>Sí, en "Mi Cuenta" {">"} "Mis Pedidos" puedes ver todo tu historial de compras, descargar facturas y repetir pedidos.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">¿Cómo actualizo mi información de envío?</h3>
              <p>En "Mi Cuenta" {">"} "Direcciones" puedes agregar, editar o eliminar tus direcciones de envío.</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">¿No encuentras tu pregunta?</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="mb-4">
              Si no encuentras respuesta a tu pregunta, nuestro equipo de atención al cliente 
              está listo para ayudarte.
            </p>
            <div className="space-y-2">
              <p><strong>Email:</strong> ayuda@techzone.com.py</p>
              <p><strong>Teléfono:</strong> +595 21 123 456</p>
              <p><strong>WhatsApp:</strong> +595 971 234 567</p>
              <p><strong>Horario:</strong> Lunes a Viernes, 9:00 - 18:00</p>
            </div>
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
