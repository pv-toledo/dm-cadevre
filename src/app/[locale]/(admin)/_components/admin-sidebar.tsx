"use client"

import { Card } from "@/components/ui/card";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarTrigger } from "@/components/ui/sidebar";
import { UserProfile } from "@/generated/prisma/client";

type AdminSidebarProps = {
    userData: UserProfile
}

export default function AdminSidebar({ userData }: AdminSidebarProps) {
    return (
        <Sidebar collapsible="icon" className="border-muted">
            <SidebarHeader className="h-20 min-h-20 items-center justify-center bg-secondary">
                
                
            </SidebarHeader>
            <SidebarContent className="bg-secondary border-muted">
                <SidebarGroup>

                    <SidebarGroupContent>

                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="bg-secondary">
                <SidebarTrigger />
            </SidebarFooter>
        </Sidebar>
    )
}