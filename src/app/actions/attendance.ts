"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function markAttendance(
  studentId: string,
  batchId: string,
  date: string,
  status: "PRESENT" | "ABSENT"
) {
  const session = await auth()
  if (!session) return { error: "Not authenticated" }

  await prisma.attendanceRecord.upsert({
    where: {
      studentId_date: {
        studentId,
        date: new Date(date),
      },
    },
    update: { status },
    create: {
      studentId,
      batchId,
      date: new Date(date),
      status,
      markedBy: session.user.id,
    },
  })

  revalidatePath("/dashboard/attendance")
  return { success: true }
}

export async function getAttendanceForBatchAndDate(batchId: string, date: string) {
  const session = await auth()
  if (!session) return []

  const students = await prisma.student.findMany({
    where: { batchId, businessId: session.user.businessId, status: "ACTIVE" },
    orderBy: { name: "asc" },
  })

  const records = await prisma.attendanceRecord.findMany({
    where: {
      batchId,
      date: new Date(date),
    },
  })

  return students.map((student) => {
    const record = records.find((r) => r.studentId === student.id)
    return {
      studentId: student.id,
      name: student.name,
      status: record?.status ?? null,
    }
  })
}