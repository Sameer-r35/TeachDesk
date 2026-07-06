"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

function currentMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
}

export async function getDashboardData() {
  const session = await auth()
  if (!session) return null

  const businessId = session.user.businessId
  const month = currentMonth()

  const [batches, overduePayments, recentAbsences] = await Promise.all([
    prisma.batch.findMany({
      where: { businessId },
      include: { students: { where: { status: "ACTIVE" } } },
      orderBy: { name: "asc" },
    }),

    prisma.payment.findMany({
      where: { businessId, month, status: { not: "PAID" } },
      include: { student: { include: { batch: true } } },
      orderBy: { student: { name: "asc" } },
    }),

    prisma.attendanceRecord.findMany({
      where: {
        status: "ABSENT",
        date: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        student: { businessId },
      },
      include: { student: true },
      orderBy: { date: "desc" },
      take: 10,
    }),
  ])

  return {
    batchCount: batches.length,
    studentCount: batches.reduce((sum, b) => sum + b.students.length, 0),
    batches,
    overduePayments,
    recentAbsences,
  }
}