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
            <SidebarHeader className="h-20 min-h-20 items-center justify-center bg-primary">
                <Card className="w-full bg-muted">
                    <p>{userData.role}</p>
                </Card>
                
            </SidebarHeader>
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