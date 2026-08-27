import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "next-intl/server";
import { ReactNode } from "react";


export default async function AdminLayout({ children }: { children: ReactNode }) {
    const locale = await getLocale()
    const supabase = await createClient()

    const {data: {user}, error} = await supabase.auth.getUser()

    if (error || !user) {
        redirect({href: "/login", locale} )
    }

    return (
        <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</div>
    )
}