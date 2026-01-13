import { Suspense } from "react"
import PanelLayout from "@/components/panel-layout"
import AdminUsersContent from "./admin-users-content"

export default function AdminUsersPage() {
  return (
    <PanelLayout>
      <Suspense fallback={null}>
        <AdminUsersContent />
      </Suspense>
    </PanelLayout>
  )
}
