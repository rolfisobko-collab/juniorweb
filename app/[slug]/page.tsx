import { notFound } from "next/navigation"
import { defaultLegalContent } from "@/lib/legal-content-data"
import { Calendar, Mail, Phone } from "lucide-react"

interface LegalPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function LegalPage({ params }: LegalPageProps) {
  const { slug } = await params
  const content = defaultLegalContent.find((item) => item.slug === slug)

  if (!content) {
    notFound()
  }

  const formatContent = (markdown: string) => {
    return markdown
      .split("\n")
      .map((line) => {
        // Headers with proper legal styling
        if (line.startsWith("# ")) {
          return `<h1 class="text-3xl font-bold mb-6 mt-8 text-foreground border-b pb-3">${line.substring(2)}</h1>`
        }
        if (line.startsWith("## ")) {
          return `<h2 class="text-2xl font-bold mb-4 mt-8 text-foreground">${line.substring(3)}</h2>`
        }
        if (line.startsWith("### ")) {
          return `<h3 class="text-xl font-semibold mb-3 mt-6 text-foreground">${line.substring(4)}</h3>`
        }
        if (line.startsWith("#### ")) {
          return `<h4 class="text-lg font-semibold mb-2 mt-4 text-foreground">${line.substring(5)}</h4>`
        }
        // Bold
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
        // Lists with proper legal formatting
        if (line.startsWith("- ")) {
          return `<li class="ml-6 mb-3 text-muted-foreground leading-relaxed list-disc">${line.substring(2)}</li>`
        }
        // Numbered lists
        if (line.match(/^\d+\.\s/)) {
          return `<li class="ml-6 mb-3 text-muted-foreground leading-relaxed list-decimal">${line.replace(/^\d+\.\s/, "")}</li>`
        }
        // Empty lines
        if (line.trim() === "") {
          return '<div class="h-4"></div>'
        }
        // Regular paragraphs with legal styling
        return `<p class="mb-4 leading-relaxed text-muted-foreground text-justify">${line}</p>`
      })
      .join("")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Header Section */}
        <div className="mb-12 border-b pb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">{content.title}</h1>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Calendar className="h-5 w-5" />
            <span className="text-base">Última actualización: {content.lastUpdated}</span>
          </div>
        </div>

        {/* Legal Content with proper typography */}
        <div className="prose prose-lg max-w-none">
          <div
            className="legal-content space-y-4"
            style={{ fontFamily: "var(--font-sans)", lineHeight: "1.8" }}
            dangerouslySetInnerHTML={{ __html: formatContent(content.content) }}
          />
        </div>

        {/* Contact Section */}
        <div className="mt-16 p-8 bg-muted/30 rounded-xl border border-border">
          <h3 className="text-2xl font-semibold mb-4 text-foreground">¿Necesitas ayuda?</h3>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Si tienes preguntas sobre este documento legal, nuestro equipo está disponible para asistirte.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-background rounded-lg border">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Email</p>
                <a href="mailto:legal@techzone.com" className="text-primary hover:underline text-sm">
                  legal@techzone.com
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-background rounded-lg border">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Teléfono</p>
                <a href="tel:+5491123456789" className="text-primary hover:underline text-sm">
                  +54 9 11 2345-6789
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  return defaultLegalContent.map((content) => ({
    slug: content.slug,
  }))
}
