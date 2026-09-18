"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { calculateAge } from "@/lib/utils"
import { createStudent } from "../students/actions"
import { toast } from "@/components/ui/toast"
import { useTranslations } from "next-intl"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DateInput } from "./date-input"

const newStudentFormSchema = z
    .object({
        name: z.string().trim().min(1, "Insira um nome válido"),
        birthDate: z.date(),
        studentPhoneNumber: z.string().optional(),
        responsibleName: z.string().optional(),
        responsiblePhoneNumber: z.string().optional(),
        church: z.string().optional(),
        address: z.string().min(1, "Insira um endereço válido"),
    })
    .superRefine((data, context) => {
        const age = calculateAge(data.birthDate)

        if (age < 18) {
            if (!data.responsibleName?.trim()) {
                context.addIssue({
                    code: "custom",
                    path: ["responsibleName"],
                    message: "Nome do responsável é obrigatório para menores de idade",
                })
            }

            if (!data.responsiblePhoneNumber?.trim()) {
                context.addIssue({
                    code: "custom",
                    path: ["responsiblePhoneNumber"],
                    message: "Telefone do responsável é obrigatório para menores de idade",
                })
            }
        } else {
            if (!data.studentPhoneNumber?.trim()) {
                context.addIssue({
                    code: "custom",
                    path: ["studentPhoneNumber"],
                    message: "Telefone do aluno é obrigatório para maiores de idade",
                })
            }
        }
    })

export type NewStudentFormData = z.infer<typeof newStudentFormSchema>

export default function NewStudentForm() {

    const form = useForm<NewStudentFormData>({
        resolver: zodResolver(newStudentFormSchema),
        defaultValues: {
            name: "",
            studentPhoneNumber: "",
            responsibleName: "",
            responsiblePhoneNumber: "",
            church: "",
            address: ""
        },
    })

    const birthDate = form.watch("birthDate")
    const studentAge = birthDate ? calculateAge(birthDate) : undefined

    async function handleSubmit(data: NewStudentFormData) {
        try {
            await createStudent(data)
            toast.add({
                type: "success",
                description: t("successToastMessage")
            })
        } catch {
            toast.add({
                type: "error",
                description: t("errorToastMessage")
            })
        }
    }

    const t = useTranslations("NewStudentPage")
    return (

        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-3">
            <Controller
                name="name"
                control={form.control}
                render={({ field }) => (
                    <Field className="flex flex-col gap-2">
                        <FieldLabel className="lg:text-base" htmlFor="name">{t("fullNameField")}<span className="text-destructive">*</span></FieldLabel>
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
                            <FieldLabel className="lg:text-base" htmlFor="birthDate">{t("birthDateField")}<span className="text-destructive">*</span></FieldLabel>
                            <DateInput {...field} id="birthDate" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <FieldLabel>{t("ageField")}</FieldLabel>
                            <Input id="age" disabled value={studentAge ?? ""} />
                        </div>
                    </div>
                )}
            />

            {studentAge && studentAge < 18 ? (
                <>
                    <Controller
                        name="responsibleName"
                        control={form.control}
                        render={({ field }) => (
                            <Field className="flex flex-col gap-2">
                                <FieldLabel className="lg:text-base" htmlFor="responsibleName">{t("responsibleNameField")}<span className="text-destructive">*</span></FieldLabel>
                                <Input {...field} id="responsibleName" className="text-sm lg:text-base" />
                            </Field>
                        )}
                    />

                    <Controller
                        name="responsiblePhoneNumber"
                        control={form.control}
                        render={({ field }) => (
                            <Field className="flex flex-col gap-2">
                                <FieldLabel className="lg:text-base" htmlFor="responsiblePhoneNumber">{t("responsiblePhoneNumberField")}<span className="text-destructive">*</span></FieldLabel>
                                <Input {...field} id="responsiblePhoneNumber" className="text-sm lg:text-base" />
                            </Field>

                        )}
                    />
                </>
            ) : (
                <Controller
                    name="studentPhoneNumber"
                    control={form.control}
                    render={({ field }) => (
                        <Field className="flex flex-col gap-2">
                            <FieldLabel className="lg:text-base" htmlFor="studentPhoneNumber">{t("studentPhoneNumberField")}<span className="text-destructive">*</span></FieldLabel>
                            <Input {...field} id="studentPhoneNumber" className="text-sm lg:text-base" />
                        </Field>
                    )}
                />
            )}

            <Controller
                name="church"
                control={form.control}
                render={({ field }) => (
                    <Field className="flex flex-col gap-2">
                        <FieldLabel className="lg:text-base" htmlFor="church">{t("churchField")}</FieldLabel>
                        <Input {...field} id="church" className="text-sm lg:text-base" />
                    </Field>
                )}
            />

            <Controller
                name="address"
                control={form.control}
                render={({ field }) => (
                    <Field className="flex flex-col gap-2">
                        <FieldLabel className="lg:text-base" htmlFor="address">{t("addressField")}<span className="text-destructive">*</span></FieldLabel>
                        <Input {...field} id="address" className="text-sm lg:text-base" />
                    </Field>
                )}
            />

            <Button type="submit" disabled={!form.formState.isValid || form.formState.isSubmitting}>
                {form.formState.isSubmitting ? t("submitButtonSubmitting") : t("submitButtonDefault")}
            </Button>
        </form>


    )
}