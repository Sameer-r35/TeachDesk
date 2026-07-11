"use client"

import { useState, useEffect } from "react"
import { markAttendance, getAttendanceForBatchAndDate } from "@/app/actions/attendance"
import { StatCard } from "@/components/ui/stat-card"

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
    setStudents((prev) =>
      prev.map((s) => (s.studentId === studentId ? { ...s, status } : s))
    )
    await markAttendance(studentId, batchId, date, status)
  }

  if (batches.length === 0) {
    return <p className="text-sm text-ink-muted">Create a batch first.</p>
  }

  const presentCount = students.filter((s) => s.status === "PRESENT").length
  const absentCount = students.filter((s) => s.status === "ABSENT").length
  const notMarked = students.length - presentCount - absentCount

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 max-w-6xl">
      <div className="space-y-6 min-w-0">
        <div className="bg-surface border border-border rounded-xl p-4 flex flex-wrap gap-4 items-end">
          <div>
            <label className="text-xs font-medium text-ink-muted uppercase tracking-wide block mb-1">
              Batch
            </label>
            <select
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              className="border border-border rounded-md p-2 text-ink bg-paper focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-ink-muted uppercase tracking-wide block mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-border rounded-md p-2 text-ink font-mono bg-paper focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {loading && <p className="text-sm text-ink-muted">Loading...</p>}

        <div className="bg-surface border border-border rounded-xl divide-y divide-border overflow-hidden">
          {!loading && students.length === 0 && (
            <p className="p-5 text-sm text-ink-muted">No active students in this batch.</p>
          )}
          {students.map((s) => (
            <div key={s.studentId} className="px-5 py-3 flex justify-between items-center">
              <span className="text-ink font-medium">{s.name}</span>
              <div className="flex rounded-md overflow-hidden border border-border">
                <button
                  onClick={() => handleMark(s.studentId, "PRESENT")}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                    s.status === "PRESENT"
                      ? "bg-success text-white"
                      : "bg-surface text-ink-muted hover:bg-paper"
                  }`}
                >
                  Present
                </button>
                <button
                  onClick={() => handleMark(s.studentId, "ABSENT")}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors border-l border-border ${
                    s.status === "ABSENT"
                      ? "bg-danger text-white"
                      : "bg-surface text-ink-muted hover:bg-paper"
                  }`}
                >
                  Absent
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className="space-y-4">
        <StatCard label="Present" value={presentCount} sublabel={`of ${students.length} students`} />
        <StatCard label="Absent" value={absentCount} />
        {notMarked > 0 && <StatCard label="Not yet marked" value={notMarked} />}
      </aside>
    </div>
  )
}