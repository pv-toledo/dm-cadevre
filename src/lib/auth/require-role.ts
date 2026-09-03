import { redirect } from "@/i18n/navigation"
import { createClient } from "../supabase/server"
import { Locale } from "next-intl"
import { UserRole } from "@/generated/prisma/enums"
import prisma from "../prisma"
import { notFound } from "next/navigation"

export async function requireRole(locale: Locale, allowedRoles: UserRole[]) {
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

    if (!profile || !allowedRoles.includes(profile.role)) {
        return notFound()
    }

    return profile
}

export async function requireAdmin(locale: Locale) {
    return requireRole(locale, [UserRole.ADMIN]);
}