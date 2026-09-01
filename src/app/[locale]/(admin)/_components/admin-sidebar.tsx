"use client"

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarTrigger } from "@/components/ui/sidebar";

export default function AdminSidebar() {
    return (
        <Sidebar collapsible="icon" className="border-muted">
            <SidebarContent className="bg-primary border-muted">
                <SidebarGroup>

                    <SidebarGroupContent>

                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="bg-primary">
                <SidebarTrigger className="text-primary-foreground hover:bg-primary hover:text-primary-foreground" />
            </SidebarFooter>
        </Sidebar>
    )
}