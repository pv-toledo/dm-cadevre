import { requireAdmin } from "@/lib/auth/require-admin";
import { getLocale } from "next-intl/server";
import { ReactNode } from "react";
import AdminSidebar from "./_components/admin-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import { Logo } from "@/components/logo";


export default async function AdminLayout({ children }: { children: ReactNode }) {

    const locale = await getLocale()
    await requireAdmin(locale)

    return (
        <SidebarProvider>
            <AdminSidebar />
            <main className="flex size-full flex-col items-center">
                <header className="flex h-16 min-h-16 w-full shrink-0 items-center justify-between px-4 border-b border-b-foreground/10 md:h-20 md:min-h-20">
                    <Logo />
                </header>
                <div className="flex w-full flex-1 flex-col overflow-auto">
                    {children}
                </div>
            </main>
        </SidebarProvider>



    )
}