"use server"

import { redirect } from "@/i18n/navigation"
import { createClient } from "../supabase/server"
import prisma from "../prisma"
import { notFound } from "next/navigation"
import { Locale } from "next-intl"

export async function requireAdmin(locale: Locale) {
    const supabase = await createClient()

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        return redirect({ href: "/login", locale })
    }

    const profile = await prisma.userProfile.findUnique({
        where: {
            id: user.id
        }
    })

    if (!profile || profile.role !== "ADMIN") {
        return notFound()
    }
}