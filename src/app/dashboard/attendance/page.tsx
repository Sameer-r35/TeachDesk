import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getBatches } from "@/app/actions/batch"
import { PageHeader } from "@/components/ui/page-header"
import { AttendanceClient } from "./attendance-client"

export default async function AttendancePage() {
  const session = await auth()
  if (!session) redirect("/login")

  const batches = await getBatches()

  return (
    <div>
      <PageHeader title="Attendance" subtitle="Mark who showed up, one tap at a time" />
      <div className="p-8">
        <AttendanceClient batches={batches} />
      </div>
    </div>
  )
}