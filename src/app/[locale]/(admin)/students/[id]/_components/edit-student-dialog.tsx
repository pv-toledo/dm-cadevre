"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { SquarePen } from "lucide-react"
import { Controller, useForm } from "react-hook-form";
import { EditStudentFormData, editStudentFormSchema } from "../../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Student } from "@/generated/prisma/client";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { calculateAge } from "@/lib/utils";
import { DateInput } from "../../../_components/date-input";
import { PatternFormat } from "react-number-format";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { updateStudentPersonalInfo } from "../../actions";
import { toast } from "@/components/ui/toast";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";

type EditStudentDialogProps = {
    student: Student
}

export default function EditStudentDialog({ student }: EditStudentDialogProps) {

    const t = useTranslations("EditStudentPage")
    const [isOpen, setIsOpen] = useState(false)
    const [isRefreshing, startTransition] = useTransition()
    const [saved, setSaved] = useState(false)
    const router = useRouter()

    const form = useForm<EditStudentFormData>({
        resolver: zodResolver(editStudentFormSchema),
        defaultValues: {
            name: student.name,
            birthDate: student.birthDate,
            studentPhoneNumber: student.studentPhoneNumber ?? "",
            responsibleName: student.responsibleName ?? "",
            responsiblePhoneNumber: student.responsiblePhoneNumber ?? "",
            church: student.church ?? "",
            address: student.address
        },
    });

    const studentAge = calculateAge(form.watch("birthDate") ?? student.birthDate)

    async function handleSubmit(payload: EditStudentFormData) {
        try {
            await updateStudentPersonalInfo(student.id, payload)
            setSaved(true)
            startTransition(() => {
                router.refresh()
            })
        } catch {
            toast.add({
                type: "error",
                description: "Erro ao atualizar informações pessoais"
            })
        }
    }

    useEffect(() => {
        if (saved && !isRefreshing) {
            setSaved(false)
            setIsOpen(false)
            form.reset(form.getValues())
            toast.add({
                type: "success",
                description: "Informações pessoais atualizadas"
            })
        }
    }, [saved, isRefreshing, form])

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                setIsOpen(open);

                if (!open) {
                    form.reset();
                }
            }}
        >
            <DialogTrigger className="hover:cursor-pointer">
                <SquarePen />
            </DialogTrigger>
            <DialogContent className="min-w-[50%]">
                <DialogHeader>
                    <DialogTitle>Editar informações do aluno</DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="flex flex-col gap-8 lg:gap-12"
                >
                    <div className="flex flex-col gap-3 order-2 lg:order-1">
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field }) => (
                                <Field className="flex flex-col gap-2">
                                    <FieldLabel className="lg:text-base" htmlFor="name">
                                        {t("fullNameField")}
                                        <span className="text-destructive">*</span>
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="name"
                                        autoComplete="off"
                                        className="text-sm lg:text-base"
                                    />
                                </Field>
                            )}
                        />

                        <Controller
                            name="birthDate"
                            control={form.control}
                            render={({ field }) => (
                                <div className="flex gap-5 items-center">
                                    <div className="flex flex-col gap-2">
                                        <FieldLabel className="lg:text-base" htmlFor="birthDate">
                                            {t("birthDateField")}
                                            <span className="text-destructive">*</span>
                                        </FieldLabel>
                                        <DateInput {...field} value={field.value} id="birthDate" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <FieldLabel className="lg:text-base">{t("ageField")}</FieldLabel>
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
                                            <FieldLabel
                                                className="lg:text-base"
                                                htmlFor="responsibleName"
                                            >
                                                {t("responsibleNameField")}
                                                <span className="text-destructive">*</span>
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="responsibleName"
                                                className="text-sm lg:text-base"
                                            />
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="responsiblePhoneNumber"
                                    control={form.control}
                                    render={({ field }) => (
                                        <Field className="flex flex-col gap-2">
                                            <FieldLabel
                                                className="lg:text-base"
                                                htmlFor="responsiblePhoneNumber"
                                            >
                                                {t("responsiblePhoneNumberField")}
                                                <span className="text-destructive">*</span>
                                            </FieldLabel>
                                            <PatternFormat
                                                format="(##) #####-####"
                                                mask="_"
                                                value={field.value}
                                                getInputRef={field.ref}
                                                onValueChange={(values) => { field.onChange(values.value) }}
                                                customInput={Input}
                                                placeholder="(00) 00000-0000"
                                            />
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
                                        <FieldLabel
                                            className="lg:text-base"
                                            htmlFor="studentPhoneNumber"
                                        >
                                            {t("studentPhoneNumberField")}
                                            <span className="text-destructive">*</span>
                                        </FieldLabel>
                                        <PatternFormat
                                            format="(##) #####-####"
                                            mask="_"
                                            value={field.value}
                                            getInputRef={field.ref}
                                            onValueChange={(values) => { field.onChange(values.value) }}
                                            customInput={Input}
                                            placeholder="(00) 00000-0000"
                                            className="text-sm"
                                        />
                                    </Field>
                                )}
                            />
                        )}

                        <Controller
                            name="church"
                            control={form.control}
                            render={({ field }) => (
                                <Field className="flex flex-col gap-2">
                                    <FieldLabel className="lg:text-base" htmlFor="church">
                                        {t("churchField")}
                                    </FieldLabel>
                                    <Input {...field} id="church" className="text-sm lg:text-base" />
                                </Field>
                            )}
                        />

                        <Controller
                            name="address"
                            control={form.control}
                            render={({ field }) => (
                                <Field className="flex flex-col gap-2">
                                    <FieldLabel className="lg:text-base" htmlFor="address">
                                        {t("addressField")}
                                        <span className="text-destructive">*</span>
                                    </FieldLabel>
                                    <Input {...field} id="address" className="text-sm lg:text-base" />
                                </Field>
                            )}
                        />

                        <Button
                            type="submit"
                            disabled={
                                !form.formState.isValid ||
                                form.formState.isSubmitting ||
                                isRefreshing ||
                                !form.formState.isDirty
                            }
                        >
                            {form.formState.isSubmitting || isRefreshing
                                ? t("submitButtonSubmitting")
                                : t("submitButtonDefault")}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}