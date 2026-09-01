"use client"

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarTrigger } from "@/components/ui/sidebar";
import { UserProfile } from "@/generated/prisma/client";

type AdminSidebarProps = {
    userData: UserProfile
}

export default function AdminSidebar({userData}: AdminSidebarProps) {
    return (
        <Sidebar collapsible="icon" className="border-muted">
            <SidebarContent className="bg-primary border-muted">
                <SidebarGroup>

                    <SidebarGroupContent>
                        <p>{userData.role}</p>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="bg-primary">
                <SidebarTrigger className="text-primary-foreground hover:bg-primary hover:text-primary-foreground" />
            </SidebarFooter>
        </Sidebar>
    )
}