import { requireAdmin } from "@/lib/auth/require-admin";
import { getLocale } from "next-intl/server";
import { ReactNode } from "react";


export default async function AdminLayout({ children }: { children: ReactNode }) {

    const locale = await getLocale()
    await requireAdmin(locale)

    return (
        <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</div>
    )
}