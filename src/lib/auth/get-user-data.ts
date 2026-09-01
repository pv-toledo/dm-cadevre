"use server"

import { User } from "@supabase/supabase-js";
import prisma from "../prisma";

export async function getUserData(user: User) {
    const userData = await prisma.userProfile.findUnique({
        where: {
            id: user.id
        }
    })

    if (!userData) {
        throw new Error("user not found")
    }

    return userData
}