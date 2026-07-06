"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function generateMonthlyPayments(month: string, amount: number) {
  const session = await auth()
  if (!session) return { error: "Not authenticated" }

  const students = await prisma.student.findMany({
    where: { businessId: session.user.businessId, status: "ACTIVE" },
  })

  for (const student of students) {
    await prisma.payment.upsert({
      where: {
        studentId_month: {
          studentId: student.id,
          month,
        },
      },
      update: {},
      create: {
        studentId: student.id,
        businessId: session.user.businessId,
        month,
        amount,
        status: "PENDING",
      },
    })
  }

  revalidatePath("/dashboard/payments")
  return { success: true }
}

export async function markPaymentPaid(paymentId: string, paidVia: string) {
  const session = await auth()
  if (!session) return { error: "Not authenticated" }

  await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: "PAID",
      paidAt: new Date(),
      paidVia,
    },
  })

  revalidatePath("/dashboard/payments")
  return { success: true }
}

export async function getPaymentsForMonth(month: string) {
  const session = await auth()
  if (!session) return []

  return prisma.payment.findMany({
    where: { businessId: session.user.businessId, month },
    include: { student: { include: { batch: true } } },
    orderBy: { student: { name: "asc" } },
  })
}