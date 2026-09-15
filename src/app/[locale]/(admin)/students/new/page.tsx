"use client"

import { Input } from "@/components/ui/input"
import { DateInput } from "../../_components/date-input"
import { Field, FieldLabel } from "@/components/ui/field"
import { useTranslations } from "next-intl"
import z from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"

const newStudentFormSchema = z.object({
    name: z.string().trim().min(1, "Insira um nome válido"),
    birthDate: z.date(),
    studentPhoneNumber: z.string(),
    responsibleName: z.string().min(1, "Insira um nome válido").optional(),
    responsiblePhoneNumber: z.string(),
    church: z.string().min(1, "Insira um nome válido").optional(),
    address: z.string()
})

type NewStudentFormData = z.infer<typeof newStudentFormSchema>

export default function NewStudentPage() {

    const form = useForm<NewStudentFormData>({
        resolver: zodResolver(newStudentFormSchema),
        defaultValues: {
            name: "",
            birthDate: new Date(Date.now()),
            studentPhoneNumber: "",
            responsibleName: "",
            responsiblePhoneNumber: "",
            church: "",
            address: ""
        }
    })

    function handleSubmit(data: NewStudentFormData) {
        console.log(data.birthDate.toISOString())
    }

    const t = useTranslations("NewStudentPage")
    return (
        <div className="flex flex-col gap-10 mt-8 lg:mt-12">
            <h1 className="font-display text-3xl lg:text-4xl">{t("title")}</h1>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-3">
                <Controller
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                        <Field className="flex flex-col gap-2">
                            <FieldLabel htmlFor="name">Nome completo *</FieldLabel>
                            <Input {...field} id="name" autoComplete="off" className="text-sm lg:text-base" />
                        </Field>
                    )}
                />

                <Controller
                    name="birthDate"
                    control={form.control}
                    render={({ field }) => (
                        <div className="flex gap-5 items-center">
                            <div className="flex flex-col gap-2">
                                <FieldLabel htmlFor="birthDate">Data de nascimento *</FieldLabel>
                                <DateInput {...field} id="birthDate" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <FieldLabel>Idade</FieldLabel>
                                <Input id="age" disabled value={2} />
                            </div>
                        </div>
                    )}
                />

                <Controller
                    name="studentPhoneNumber"
                    control={form.control}
                    render={({ field }) => (
                        <Field className="flex flex-col gap-2">
                            <FieldLabel htmlFor="studentPhoneNumber">Telefone do aluno *</FieldLabel>
                            <Input {...field} id="studentPhoneNumber" className="text-sm lg:text-base" />
                        </Field>
                    )}
                />

                <Controller
                    name="responsibleName"
                    control={form.control}
                    render={({ field }) => (
                        <Field className="flex flex-col gap-2">
                            <FieldLabel htmlFor="responsibleName">Nome do responsável *</FieldLabel>
                            <Input {...field} id="responsibleName" className="text-sm lg:text-base" />
                        </Field>
                    )}
                />

                <Controller
                    name="responsiblePhoneNumber"
                    control={form.control}
                    render={({ field }) => (
                        <Field className="flex flex-col gap-2">
                            <FieldLabel htmlFor="responsiblePhoneNumber">Telefone do responsável *</FieldLabel>
                            <Input {...field} id="responsiblePhoneNumber" className="text-sm lg:text-base" />
                        </Field>

                    )}
                />

                <Controller
                    name="church"
                    control={form.control}
                    render={({ field }) => (
                        <Field className="flex flex-col gap-2">
                            <FieldLabel htmlFor="church">Igreja</FieldLabel>
                            <Input {...field} id="church" className="text-sm lg:text-base" />
                        </Field>
                    )}
                />

                <Controller
                    name="address"
                    control={form.control}
                    render={({ field }) => (
                        <Field className="flex flex-col gap-2">
                            <FieldLabel htmlFor="address">Endereço *</FieldLabel>
                            <Input {...field} id="address" className="text-sm lg:text-base" />
                        </Field>
                    )}
                />

                <Button type="submit">Salvar</Button>
            </form>
        </div>

    )
}