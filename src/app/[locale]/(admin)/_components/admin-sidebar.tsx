"use client"

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarTrigger } from "@/components/ui/sidebar";

export default function AdminSidebar() {
    return (
        <Sidebar collapsible="icon" className="border-muted">
            <SidebarContent className="bg-primary">
                <SidebarGroup>
                    
                    <SidebarGroupContent>
                       
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}