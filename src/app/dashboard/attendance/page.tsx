import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getBatches } from "@/app/actions/batch"
import { AttendanceClient } from "./attendance-client"

export default async function AttendancePage() {
  const session = await auth()
  if (!session) redirect("/login")

  const batches = await getBatches()

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-black">Attendance</h1>
      <AttendanceClient batches={batches} />
    </div>
  )
}