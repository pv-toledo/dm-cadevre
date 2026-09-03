import { getLocale } from "next-intl/server";
import { ReactNode } from "react";
import AdminSidebar from "./_components/admin-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import AccountMenu from "./_components/account-menu";
import { requireAdmin } from "@/lib/auth/require-role";
import { cookies } from "next/headers";

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const locale = await getLocale()
    const profile = await requireAdmin(locale)

    const cookieStore = await cookies();
	const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AdminSidebar locale={locale} />
            <SidebarInset>
                <main className="flex size-full flex-col items-center">
                    <header className="dark bg-sidebar text-sidebar-foreground flex h-16 min-h-16 w-full shrink-0 border-b-2 border-b-sidebar-primary/40 md:h-20 md:min-h-20">
                        <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-4">
                            <SidebarTrigger className="md:hidden" />
                            <Logo />
                            <AccountMenu userData={profile} locale={locale} />
                        </div>
                    </header>
                    <div className="flex w-full max-w-7xl mx-auto px-4 flex-1 flex-col">
                        {children}
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}