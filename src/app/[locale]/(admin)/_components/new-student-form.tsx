"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { calculateAge } from "@/lib/utils";
import { createStudent, updateStudentPhotoPath, uploadImage } from "../students/actions";
import { toast } from "@/components/ui/toast";
import { useTranslations } from "next-intl";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DateInput } from "./date-input";
import { AvatarUploadInput } from "./avatar-upload-input";
import { convertToWebp } from "@/lib/image";
import prisma from "@/lib/prisma";

const newStudentFormSchema = z
  .object({
    name: z.string().trim().min(1, "Insira um nome válido"),
    birthDate: z.date(),
    studentPhoneNumber: z.string().optional(),
    responsibleName: z.string().optional(),
    responsiblePhoneNumber: z.string().optional(),
    church: z.string().optional(),
    address: z.string().min(1, "Insira um endereço válido"),
    photo: z.instanceof(File).optional(),
    photoPath: z.string().optional(),
  })
  .superRefine((data, context) => {
    const age = calculateAge(data.birthDate);

    if (age < 18) {
      if (!data.responsibleName?.trim()) {
        context.addIssue({
          code: "custom",
          path: ["responsibleName"],
          message: "Nome do responsável é obrigatório para menores de idade",
        });
      }

      if (!data.responsiblePhoneNumber?.trim()) {
        context.addIssue({
          code: "custom",
          path: ["responsiblePhoneNumber"],
          message:
            "Telefone do responsável é obrigatório para menores de idade",
        });
      }
    } else {
      if (!data.studentPhoneNumber?.trim()) {
        context.addIssue({
          code: "custom",
          path: ["studentPhoneNumber"],
          message: "Telefone do aluno é obrigatório para maiores de idade",
        });
      }
    }
  });

export type NewStudentFormData = z.infer<typeof newStudentFormSchema>;

export default function NewStudentForm() {
  const form = useForm<NewStudentFormData>({
    resolver: zodResolver(newStudentFormSchema),
    defaultValues: {
      name: "",
      studentPhoneNumber: "",
      responsibleName: "",
      responsiblePhoneNumber: "",
      church: "",
      address: "",
    },
  });

  const birthDate = form.watch("birthDate");
  const studentAge = birthDate ? calculateAge(birthDate) : undefined;

  async function handleSubmit(data: NewStudentFormData) {
    try {

      const { photo, ...studentData } = data

      const newStudent = await createStudent(studentData);

      if (data.photo) {
        const webpFile = await convertToWebp(data.photo)
        const result = await uploadImage(webpFile, newStudent.id)
        if (result.data?.path) {
          const updatedStudent = await updateStudentPhotoPath(newStudent.id, result.data.path)
        }
      }

      toast.add({
        type: "success",
        description: t("successToastMessage"),
      });

    } catch {
      toast.add({
        type: "error",
        description: t("errorToastMessage"),
      });
    }
  }

  const t = useTranslations("NewStudentPage");
  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="grid grid-cols-1 items-center gap-8 lg:gap-12 lg:grid-cols-[2fr_1fr]"
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
                  <Input
                    {...field}
                    id="responsiblePhoneNumber"
                    className="text-sm lg:text-base"
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
                <Input
                  {...field}
                  id="studentPhoneNumber"
                  className="text-sm lg:text-base"
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
          disabled={!form.formState.isValid || form.formState.isSubmitting}
        >
          {form.formState.isSubmitting
            ? t("submitButtonSubmitting")
            : t("submitButtonDefault")}
        </Button>
      </div>
      <Controller
        name="photo"
        control={form.control}
        render={({ field }) => (
          <div className="flex h-full items-start justify-center order-1 lg:order-2">
            <AvatarUploadInput onChange={field.onChange} />
          </div>
        )}
      />
    </form>
  );
}
