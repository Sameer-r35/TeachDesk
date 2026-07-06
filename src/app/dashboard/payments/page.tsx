import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { PaymentsClient } from "./payments-client"

export default async function PaymentsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-black">Payments</h1>
      <PaymentsClient />
    </div>
  )
}