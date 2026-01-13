import { Suspense } from "react"
import PanelLayout from "@/components/panel-layout"
import { LegalContentManagement } from "./legal-content-management"

export default function LegalContentPage() {
  return (
    <PanelLayout>
      <Suspense fallback={null}>
        <LegalContentManagement />
      </Suspense>
    </PanelLayout>
  )
}
