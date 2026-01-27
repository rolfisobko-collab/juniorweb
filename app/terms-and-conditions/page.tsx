import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Términos y Condiciones | TechZone",
  description: "Términos y condiciones de uso de TechZone. Conoce nuestras políticas de compra, envío y garantía.",
}

export default function TermsAndConditionsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="prose prose-gray max-w-none">
        <h1 className="text-4xl font-bold mb-8">Términos y Condiciones</h1>
        
        <nav className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Contenido</h2>
          <ul className="space-y-2 text-sm">
            <li><a href="#aceptacion" className="text-primary hover:underline">1. Aceptación de los Términos</a></li>
            <li><a href="#productos" className="text-primary hover:underline">2. Productos y Servicios</a></li>
            <li><a href="#precios" className="text-primary hover:underline">3. Precios y Pagos</a></li>
            <li><a href="#envios" className="text-primary hover:underline">4. Envíos y Entrega</a></li>
            <li><a href="#devoluciones" className="text-primary hover:underline">5. Devoluciones y Cambios</a></li>
            <li><a href="#garantia" className="text-primary hover:underline">6. Garantía</a></li>
            <li><a href="#privacidad" className="text-primary hover:underline">7. Privacidad y Datos</a></li>
            <li><a href="#propiedad" className="text-primary hover:underline">8. Propiedad Intelectual</a></li>
            <li><a href="#limitacion" className="text-primary hover:underline">9. Limitación de Responsabilidad</a></li>
            <li><a href="#contacto" className="text-primary hover:underline">10. Contacto</a></li>
          </ul>
        </nav>

        <section id="aceptacion" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">1. Aceptación de los Términos</h2>
          <p>
            Al acceder y utilizar el sitio web de TechZone, aceptas cumplir con estos términos y condiciones. 
            Si no estás de acuerdo con alguno de estos términos, por favor no utilices nuestros servicios.
          </p>
        </section>

        <section id="productos" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">2. Productos y Servicios</h2>
          <p>
            TechZone ofrece productos tecnológicos de alta calidad. Nos esforzamos por proporcionar descripciones 
            precisas y actualizadas de todos nuestros productos. Nos reservamos el derecho de modificar o 
            discontinuar productos sin previo aviso.
          </p>
        </section>

        <section id="precios" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">3. Precios y Pagos</h2>
          <p>
            Todos los precios están expresados en Guaraníes (PYG) e incluyen impuestos aplicables. 
            Los precios pueden cambiar sin previo aviso. Aceptamos pagos mediante tarjeta de crédito, 
            débito y otros métodos electrónicos seguros.
          </p>
        </section>

        <section id="envios" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">4. Envíos y Entrega</h2>
          <p>
            Ofrecemos envíos a todo Paraguay. Los tiempos de entrega varían según la ubicación: 
            Asunción (1-2 días hábiles), resto del país (3-5 días hábiles). Los costos de envío 
            se calculan automáticamente al momento del checkout.
          </p>
        </section>

        <section id="devoluciones" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">5. Devoluciones y Cambios</h2>
          <p>
            Aceptamos devoluciones dentro de los 30 días posteriores a la compra. Los productos deben 
            estar en su estado original, sin usar y con empaque intacto. Los costos de envío de 
            devolución corren por cuenta del cliente.
          </p>
        </section>

        <section id="garantia" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">6. Garantía</h2>
          <p>
            Todos nuestros productos incluyen garantía del fabricante. Los períodos de garantía varían 
            según el producto y están especificados en cada descripción. La garantía cubre defectos 
            de fabricación, no daños por uso inadecuado.
          </p>
        </section>

        <section id="privacidad" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">7. Privacidad y Datos</h2>
          <p>
            Nos comprometemos a proteger tu información personal. Consulta nuestra Política de 
            Privacidad para详细了解 cómo recopilamos, usamos y protegemos tus datos.
          </p>
        </section>

        <section id="propiedad" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">8. Propiedad Intelectual</h2>
          <p>
            Todo el contenido de este sitio web, incluyendo但不限于 textos, imágenes, logos y 
            diseños, es propiedad de TechZone y está protegido por derechos de autor.
          </p>
        </section>

        <section id="limitacion" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">9. Limitación de Responsabilidad</h2>
          <p>
            TechZone no será responsable por daños indirectos, incidentales o consecuentes que 
            surjan del uso de nuestros productos o servicios.
          </p>
        </section>

        <section id="contacto" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">10. Contacto</h2>
          <p>
            Para cualquier pregunta sobre estos términos y condiciones, contáctanos en:<br />
            Email: info@techzone.com.py<br />
            Teléfono: +595 21 123 456<br />
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
