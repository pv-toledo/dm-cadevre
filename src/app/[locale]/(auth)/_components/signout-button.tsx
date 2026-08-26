"use client"

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignOutButton () {
    const supabase = createClient()
    const router = useRouter()

    async function handleSignOut() {
        const {error} = await supabase.auth.signOut()
        router.push("/login")
    }

    return (
        <Button onClick={handleSignOut}>sair</Button>
    )
}