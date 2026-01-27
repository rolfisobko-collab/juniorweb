import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Política de Privacidad | TechZone",
  description: "Política de privacidad de TechZone. Cómo recopilamos, usamos y protegemos tu información personal.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="prose prose-gray max-w-none">
        <h1 className="text-4xl font-bold mb-8">Política de Privacidad</h1>
        
        <nav className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Contenido</h2>
          <ul className="space-y-2 text-sm">
            <li><a href="#informacion" className="text-primary hover:underline">1. Información que Recopilamos</a></li>
            <li><a href="#uso" className="text-primary hover:underline">2. Cómo Usamos tu Información</a></li>
            <li><a href="#compartir" className="text-primary hover:underline">3. Compartir Información</a></li>
            <li><a href="#cookies" className="text-primary hover:underline">4. Cookies y Tecnologías</a></li>
            <li><a href="#seguridad" className="text-primary hover:underline">5. Seguridad de Datos</a></li>
            <li><a href="#derechos" className="text-primary hover:underline">6. Derechos del Usuario</a></li>
            <li><a href="#menores" className="text-primary hover:underline">7. Protección de Menores</a></li>
            <li><a href="#cambios" className="text-primary hover:underline">8. Cambios en la Política</a></li>
            <li><a href="#contacto" className="text-primary hover:underline">9. Contacto</a></li>
          </ul>
        </nav>

        <section id="informacion" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">1. Información que Recopilamos</h2>
          <h3 className="text-xl font-semibold mb-3">Información Personal</h3>
          <p>
            Recopilamos información que nos proporcionas voluntariamente,包括但不限于:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Nombre y apellidos</li>
            <li>Dirección de correo electrónico</li>
            <li>Número de teléfono</li>
            <li>Dirección de envío</li>
            <li>Información de pago (procesada de forma segura)</li>
          </ul>
          
          <h3 className="text-xl font-semibold mb-3">Información Técnica</h3>
          <p>
            Recopilamos automáticamente información técnica sobre tu dispositivo y navegación:
          </p>
          <ul className="list-disc pl-6">
            <li>Dirección IP</li>
            <li>Tipo de navegador y sistema operativo</li>
            <li>Páginas visitadas y tiempo de navegación</li>
            <li>Información de cookies</li>
          </ul>
        </section>

        <section id="uso" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">2. Cómo Usamos tu Información</h2>
          <p>Utilizamos tu información para:</p>
          <ul className="list-disc pl-6">
            <li>Procesar y cumplir con tus pedidos</li>
            <li>Mejorar nuestros productos y servicios</li>
            <li>Enviarte comunicaciones sobre tu pedido</li>
            <li>Personalizar tu experiencia en nuestro sitio</li>
            <li>Prevenir fraudes y proteger la seguridad</li>
            <li>Cumplir con obligaciones legales</li>
          </ul>
        </section>

        <section id="compartir" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">3. Compartir Información</h2>
          <p>No vendemos ni alquilamos tu información personal. Compartimos tu información solo con:</p>
          <ul className="list-disc pl-6">
            <li>Servicios de pago procesadores (para transacciones seguras)</li>
            <li>Servicios de envío (para entregar tus pedidos)</li>
            <li>Proveedores de servicios técnicos (bajo estricta confidencialidad)</li>
            <li>Autoridades gubernamentales (cuando sea requerido por ley)</li>
          </ul>
        </section>

        <section id="cookies" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">4. Cookies y Tecnologías</h2>
          <p>
            Utilizamos cookies para mejorar tu experiencia. Puedes configurar tu navegador 
            para rechazar cookies, pero esto puede afectar algunas funcionalidades del sitio.
          </p>
          <h3 className="text-xl font-semibold mb-3">Tipos de Cookies</h3>
          <ul className="list-disc pl-6">
            <li><strong>Cookies Esenciales:</strong> Necesarias para el funcionamiento del sitio</li>
            <li><strong>Cookies de Rendimiento:</strong> Nos ayudan a mejorar el sitio</li>
            <li><strong>Cookies de Marketing:</strong> Para mostrar anuncios relevantes</li>
          </ul>
        </section>

        <section id="seguridad" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">5. Seguridad de Datos</h2>
          <p>
            Implementamos medidas de seguridad apropiadas para proteger tu información, 
            incluyendo但不限于:
          </p>
          <ul className="list-disc pl-6">
            <li>Encriptación SSL/TLS</li>
            <li>Firewalls y sistemas de detección de intrusos</li>
            <li>Acceso restringido a la información personal</li>
            <li>Actualizaciones regulares de seguridad</li>
          </ul>
        </section>

        <section id="derechos" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">6. Derechos del Usuario</h2>
          <p>Tienes derecho a:</p>
          <ul className="list-disc pl-6">
            <li>Acceder a tu información personal</li>
            <li>Corregir información inexacta</li>
            <li>Eliminar tu información personal</li>
            <li>Oponerte al procesamiento de tus datos</li>
            <li>Portabilidad de datos</li>
          </ul>
          <p>Para ejercer estos derechos, contáctanos mediante los datos proporcionados abajo.</p>
        </section>

        <section id="menores" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">7. Protección de Menores</h2>
          <p>
            Nuestro sitio no está dirigido a menores de 18 años. No recopilamos 
            intencionalmente información personal de menores. Si somos conscientes de que 
            hemos recopilado información de un menor, la eliminaremos inmediatamente.
          </p>
        </section>

        <section id="cambios" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">8. Cambios en la Política</h2>
          <p>
            Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos 
            cualquier cambio significativo mediante correo electrónico o aviso en nuestro sitio.
          </p>
        </section>

        <section id="contacto" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">9. Contacto</h2>
          <p>
            Para preguntas sobre esta política de privacidad, contáctanos en:<br />
            Email: privacy@techzone.com.py<br />
            Teléfono: +595 21 123 456<br />
            Dirección: Av. Eusebio Ayala 1234, Asunción, Paraguay
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
