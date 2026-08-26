"use client"

import { Locale, useTranslations } from "next-intl"
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { login } from "../actions"
import { LoginFormData, loginFormSchema } from "../login-schema"
import { useRouter } from "@/i18n/navigation"

type LoginFormProps = {
    nextPage: string
    locale: Locale
}

export default function LoginForm({ nextPage, locale }: LoginFormProps) {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const t = useTranslations("LoginForm")

    const { control, handleSubmit, formState: { isValid, errors, touchedFields } } = useForm<LoginFormData>({
        defaultValues: {
            email: "",
            password: ""
        },
        resolver: zodResolver(loginFormSchema),
        mode: "onTouched"
    })

    async function handleLogin(loginCredentials: LoginFormData) {
        setError(null)
        setIsLoading(true)
        try {
            const result = await login(loginCredentials, locale)
            if (result?.error) {
                setError(result.error)
                setIsLoading(false)
                return
            }
            router.push(nextPage)
        } catch {
            setError(t("UnexpectedError"))
            setIsLoading(false)
        }
    }
    return (
        <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} id="email" type="email" placeholder={t("EmailPlaceholder")} />
                    )}
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">{t("PasswordLabel")}</Label>
                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} id="password" type="password" placeholder={t("PasswordPlaceholder")} />
                    )}
                />
            </div>

            {(errors.email && touchedFields.email) && (
                <p className="text-red-500 text-sm">{t("EmailInputError")}</p>
            )}
            {error && (
                <p className="text-red-500 text-sm">{error}</p>
            )}
            
            <Button type="submit" className="w-full" disabled={!isValid || isLoading}>
                {isLoading ? t("LogingIn") : t("SubmitButton")}

            </Button>
        </form>
    )
}