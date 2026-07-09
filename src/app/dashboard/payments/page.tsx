import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { PaymentsClient } from "./payments-client"

export default async function PaymentsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div>
      <PageHeader title="Payments" subtitle="Know who's paid and who needs a nudge" />
      <div className="p-8 max-w-2xl">
        <PaymentsClient />
      </div>
    </div>
  )
}