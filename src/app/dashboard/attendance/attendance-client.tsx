"use client"

import { useState, useEffect } from "react"
import { markAttendance, getAttendanceForBatchAndDate } from "@/app/actions/attendance"

type Batch = { id: string; name: string }
type StudentAttendance = {
  studentId: string
  name: string
  status: "PRESENT" | "ABSENT" | null
}

export function AttendanceClient({ batches }: { batches: Batch[] }) {
  const [batchId, setBatchId] = useState(batches[0]?.id ?? "")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [students, setStudents] = useState<StudentAttendance[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!batchId || !date) return
    setLoading(true)
    getAttendanceForBatchAndDate(batchId, date).then((data) => {
      setStudents(data)
      setLoading(false)
    })
  }, [batchId, date])

  async function handleMark(studentId: string, status: "PRESENT" | "ABSENT") {
    // optimistic update
    setStudents((prev) =>
      prev.map((s) => (s.studentId === studentId ? { ...s, status } : s))
    )
    await markAttendance(studentId, batchId, date, status)
  }

  if (batches.length === 0) {
    return <p className="text-gray-500">Create a batch first.</p>
  }

  return (
    <div>
      <div className="flex gap-3 mb-6">
        <select
          value={batchId}
          onChange={(e) => setBatchId(e.target.value)}
          className="border rounded p-2 text-black"
        >
          {batches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded p-2 text-black"
        />
      </div>

      {loading && <p className="text-gray-400">Loading...</p>}

      <div className="space-y-2">
        {!loading && students.length === 0 && (
          <p className="text-gray-500">No active students in this batch.</p>
        )}
        {students.map((s) => (
          <div
            key={s.studentId}
            className="border rounded p-3 flex justify-between items-center"
          >
            <span className="text-black font-medium">{s.name}</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleMark(s.studentId, "PRESENT")}
                className={`px-3 py-1 rounded text-sm ${
                  s.status === "PRESENT"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                Present
              </button>
              <button
                onClick={() => handleMark(s.studentId, "ABSENT")}
                className={`px-3 py-1 rounded text-sm ${
                  s.status === "ABSENT"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                Absent
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}