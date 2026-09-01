import { requireAdmin } from "@/lib/auth/require-admin";
import { getLocale } from "next-intl/server";
import { ReactNode } from "react";
import AdminSidebar from "./_components/admin-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { getUserData } from "@/lib/auth/get-user-data";


export default async function AdminLayout({ children }: { children: ReactNode }) {

    const locale = await getLocale()
    const user = await requireAdmin(locale)
    const userData = await getUserData(user)

    return (
        <SidebarProvider>
            <AdminSidebar userData={userData}/>
            <SidebarInset>
                <main className="flex size-full flex-col items-center">
                    <header className="flex h-16 min-h-16 w-full shrink-0 px-4 border-b border-b-foreground/10 md:h-20 md:min-h-20">
                        <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
                            <SidebarTrigger className="md:hidden" />
                            <Logo />
                            <button>sair</button>
                        </div>
                    </header>
                    <div className="flex w-full flex-1 flex-col">
                        {children}
                    </div>
                </main>
            </SidebarInset>

        </SidebarProvider>



    )
}