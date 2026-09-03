import { getLocale } from "next-intl/server";
import { ReactNode } from "react";
import AdminSidebar from "./_components/admin-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import AccountMenu from "./_components/account-menu";
import { requireAdmin } from "@/lib/auth/require-role";



export default async function AdminLayout({ children }: { children: ReactNode }) {

    const locale = await getLocale()
    const profile = await requireAdmin(locale)

    return (
        <SidebarProvider>
            <AdminSidebar userData={profile}/>
            <SidebarInset>
                <main className="flex size-full flex-col items-center">
                    <header className="flex h-16 min-h-16 w-full shrink-0 px-4 border-b border-b-foreground/10 md:h-20 md:min-h-20">
                        <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
                            <SidebarTrigger className="md:hidden" />
                            <Logo />
                            <AccountMenu userData={profile} locale={locale}/>
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