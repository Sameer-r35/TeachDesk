import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        phone: {},
        password: {},
      },
      authorize: async (credentials) => {
        const phone = credentials.phone as string
        const password = credentials.password as string

        const user = await prisma.user.findUnique({
          where: { phone },
        })

        if (!user) return null

        const isValid = await bcrypt.compare(password, user.passwordHash)
        if (!isValid) return null

        return {
          id: user.id,
          name: user.name,
          phone: user.phone,
          role: user.role,
          businessId: user.businessId,
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.phone = user.phone
        token.role = user.role
        token.businessId = user.businessId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.phone = token.phone as string
        session.user.role = token.role as string
        session.user.businessId = token.businessId as string
      }
      return session
    },
  },
})