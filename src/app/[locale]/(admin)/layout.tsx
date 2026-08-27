import { requireAdmin } from "@/lib/auth/require-admin";
import { getLocale } from "next-intl/server";
import { ReactNode } from "react";
import AdminSidebar from "./_components/admin-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";


export default async function AdminLayout({ children }: { children: ReactNode }) {

    const locale = await getLocale()
    await requireAdmin(locale)

    return (
        <SidebarProvider>
            <AdminSidebar />
            <main className="flex size-full flex-col items-center">
                <header className="flex h-16 min-h-16 w-full shrink-0 justify-center border-b border-b-foreground/10 lg:h-20 lg:min-h-20">
                    <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-10 lg:px-0">
                        
                    </div>
                </header>
                <div className="flex w-full flex-1 flex-col overflow-auto">
                    {children}
                </div>
            </main>
        </SidebarProvider>



    )
}