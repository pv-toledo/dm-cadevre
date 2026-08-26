"use client"

import { useTranslations } from "next-intl"
import z from "zod"
import {Controller, useForm} from 'react-hook-form'
import {zodResolver} from "@hookform/resolvers/zod"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function LoginForm() {

    const t = useTranslations("LoginForm")

    const loginFormSchema = z.object({
       email: z.email(`${t("EmailInputError")}`),
       password: z.string() 
    })

    type LoginFormData = z.infer<typeof loginFormSchema>

    const {control, handleSubmit} = useForm<LoginFormData>({
        defaultValues: {
            email: "",
            password: ""
        },
        resolver: zodResolver(loginFormSchema)
    })

    return (
        <form className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} id="email" type="email" placeholder={t("EmailPlaceholder")} required />
                    )}
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">{t("PasswordLabel")}</Label>
                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} id="password" type="password" placeholder={t("PasswordPlaceholder")} required />
                    )}
                />
            </div>

            {/* <PasswordField control={control} /> */}

            {/* {serverError && (
                <Alert variant="destructive">
                    <CircleAlert />
                    <AlertTitle>{serverError}</AlertTitle>
                </Alert>
            )} */}

            {/* <FormButton type="submit" disabled={isPending} className="w-full">
                {isPending ? "Signing in…" : "Sign in"}
            </FormButton> */}
            <Button type="submit" className="w-full">{t("SubmitButton")}</Button>
        </form>
    )
}