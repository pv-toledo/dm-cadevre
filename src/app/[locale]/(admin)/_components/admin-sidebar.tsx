"use client"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Link, usePathname } from "@/i18n/navigation";
import { Users } from "lucide-react";
import { Locale, useTranslations } from "next-intl";

type AdminSidebarProps = {
    locale: Locale
}

export default function AdminSidebar({ locale }: AdminSidebarProps) {
    const pathname = usePathname()
    const { setOpenMobile } = useSidebar()
    const t = useTranslations("Sidebar")
    const items = [
        {
            title: t("students"),
            url: "/students",
            icon: Users
        }
    ]
    return (
        <Sidebar collapsible="icon" className="dark border-sidebar-border">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        <span className="text-sidebar-foreground/55">{t("title")}</span>
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        isActive={pathname === item.url}
                                        className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground data-[active=true]:font-medium"
                                        render={
                                            <Link href={item.url} locale={locale} onClick={() => setOpenMobile(false)}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        }
                                    />
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarTrigger />
            </SidebarFooter>
        </Sidebar>
    )
}