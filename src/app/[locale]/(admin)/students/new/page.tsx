"use client"

import { Input } from "@/components/ui/input"
import { DateInput } from "../../_components/date-input"
import { Field, FieldLabel } from "@/components/ui/field"
import { useTranslations } from "next-intl"
import z from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { calculateAge } from "@/lib/utils"

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

type NewStudentFormData = z.infer<typeof newStudentFormSchema>

export default function NewStudentPage() {

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

    function handleSubmit(data: NewStudentFormData) {
        if (studentAge && studentAge < 18) {
            const payload = {
                ...data,
                studentPhoneNumber: null,
                church: data.church?.trim().length === 0 ? null : data.church
            }

            console.log(payload)
        } else {
            const payload = {
                ...data,
                responsibleName: null,
                responsiblePhoneNumber: null,
                church: data.church?.trim().length === 0 ? null : data.church
            }

            console.log(payload)
        }
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
                            <FieldLabel className="lg:text-base" htmlFor="name">Nome completo *</FieldLabel>
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
                                <FieldLabel className="lg:text-base" htmlFor="birthDate">Data de nascimento *</FieldLabel>
                                <DateInput {...field} id="birthDate" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <FieldLabel>Idade</FieldLabel>
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
                                    <FieldLabel className="lg:text-base" htmlFor="responsibleName">Nome do responsável *</FieldLabel>
                                    <Input {...field} id="responsibleName" className="text-sm lg:text-base" />
                                </Field>
                            )}
                        />

                        <Controller
                            name="responsiblePhoneNumber"
                            control={form.control}
                            render={({ field }) => (
                                <Field className="flex flex-col gap-2">
                                    <FieldLabel className="lg:text-base" htmlFor="responsiblePhoneNumber">Telefone do responsável *</FieldLabel>
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
                                <FieldLabel className="lg:text-base" htmlFor="studentPhoneNumber">Telefone do aluno *</FieldLabel>
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
                            <FieldLabel className="lg:text-base" htmlFor="church">Igreja</FieldLabel>
                            <Input {...field} id="church" className="text-sm lg:text-base" />
                        </Field>
                    )}
                />

                <Controller
                    name="address"
                    control={form.control}
                    render={({ field }) => (
                        <Field className="flex flex-col gap-2">
                            <FieldLabel className="lg:text-base" htmlFor="address">Endereço *</FieldLabel>
                            <Input {...field} id="address" className="text-sm lg:text-base" />
                        </Field>
                    )}
                />

                <Button type="submit" disabled={!form.formState.isValid || form.formState.isSubmitting}>Salvar</Button>
            </form>
        </div>

    )
}