"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createStudent(formData: FormData) {
  const session = await auth()
  if (!session) return { error: "Not authenticated" }

  const name = formData.get("name") as string
  const phone = formData.get("phone") as string
  const parentPhone = formData.get("parentPhone") as string
  const batchId = formData.get("batchId") as string

  if (!name || !batchId) {
    return { error: "Name and batch are required" }
  }

  await prisma.student.create({
    data: {
      businessId: session.user.businessId,
      batchId,
      name,
      phone: phone || null,
      parentPhone: parentPhone || null,
    },
  })

  revalidatePath("/dashboard/students")
  return { success: true }
}

export async function getStudents() {
  const session = await auth()
  if (!session) return []

  return prisma.student.findMany({
    where: { businessId: session.user.businessId },
    include: { batch: true },
    orderBy: { name: "asc" },
  })
}