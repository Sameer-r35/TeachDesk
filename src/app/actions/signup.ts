"use server"

import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function signup(formData: FormData) {
  const businessName = formData.get("businessName") as string
  const name = formData.get("name") as string
  const phone = formData.get("phone") as string
  const password = formData.get("password") as string

  if (!businessName || !name || !phone || !password) {
    return { error: "All fields are required" }
  }

  const existing = await prisma.user.findUnique({ where: { phone } })
  if (existing) {
    return { error: "Phone number already registered" }
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const business = await prisma.business.create({
    data: { name: businessName },
  })

  await prisma.user.create({
    data: {
      businessId: business.id,
      name,
      phone,
      passwordHash,
      role: "OWNER",
    },
  })

  return { success: true }
}