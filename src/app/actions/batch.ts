"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createBatch(formData: FormData) {
  const session = await auth()
  if (!session) return { error: "Not authenticated" }

  const name = formData.get("name") as string
  const subject = formData.get("subject") as string
  const schedule = formData.get("schedule") as string

  if (!name || !subject) {
    return { error: "Name and subject are required" }
  }

  await prisma.batch.create({
    data: {
      businessId: session.user.businessId,
      name,
      subject,
      schedule: schedule || null,
    },
  })

  revalidatePath("/dashboard/batches")
  return { success: true }
}

export async function getBatches() {
  const session = await auth()
  if (!session) return []

  return prisma.batch.findMany({
    where: { businessId: session.user.businessId },
    include: { students: true },
    orderBy: { name: "asc" },
  })
}