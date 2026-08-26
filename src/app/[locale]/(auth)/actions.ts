"use server"

import { createClient } from "@/lib/supabase/server";
import { LoginFormData, loginFormSchema } from "./login-schema";
import { getTranslations } from "next-intl/server";
import { Locale } from "next-intl";

export async function login (data: LoginFormData, locale: Locale) {
    const t = await getTranslations({ locale, namespace: "LoginForm" })
    const parsed = loginFormSchema.safeParse(data)
    if (!parsed.success) {
        return {error: t("InvalidInput")}
    }

    const supabase = await createClient()

    const {error} = await supabase.auth.signInWithPassword(parsed.data)

    if (error) {
        return {error: t("InvalidCredentials")}
    }

}   