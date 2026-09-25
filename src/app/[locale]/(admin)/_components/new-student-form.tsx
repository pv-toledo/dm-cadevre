"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { calculateAge } from "@/lib/utils";
import { createStudent, enrollStudent, updateStudentPhotoPath, uploadImage } from "../students/actions";
import { toast } from "@/components/ui/toast";
import { useTranslations } from "next-intl";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DateInput } from "./date-input";
import { AvatarUploadInput } from "./avatar-upload-input";
import { convertToWebp } from "@/lib/image";
import { PatternFormat } from "react-number-format"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Prisma } from "@/generated/prisma/client";
import { useState } from "react";

type CoursesWithClassPlans = Prisma.CourseGetPayload<{
  include: {
    classPlans: true
  }
}>[]

type NewStudentFormProps = {
  activeCourses: CoursesWithClassPlans
}

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
    course: z.string(),
    modality: z.enum(["GROUP", "INDIVIDUAL"])
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

export default function NewStudentForm({ activeCourses }: NewStudentFormProps) {

  const t = useTranslations("NewStudentPage")

  const [availableModalities, setAvailableModalities] = useState<string[] | null>(null)

  const form = useForm<NewStudentFormData>({
    resolver: zodResolver(newStudentFormSchema),
    defaultValues: {
      name: "",
      birthDate: undefined,
      studentPhoneNumber: "",
      responsibleName: "",
      responsiblePhoneNumber: "",
      church: "",
      address: "",
      photo: undefined,
      photoPath: undefined,
      course: "",
      modality: "INDIVIDUAL"
    },
  });

  const birthDate = form.watch("birthDate");
  const studentAge = birthDate ? calculateAge(birthDate) : undefined;

  async function handleSubmit(data: NewStudentFormData) {
    try {

      const { photo, course, modality, ...studentData } = data

      const newStudent = await createStudent(studentData);

      if (data.photo) {
        const webpFile = await convertToWebp(data.photo)
        const result = await uploadImage(webpFile, newStudent.id)
        if (result.data?.path) {
          await updateStudentPhotoPath(newStudent.id, result.data.path)
        }
      }

      await enrollStudent(newStudent.id, data.modality, data.course)

      toast.add({
        type: "success",
        description: t("successToastMessage"),
      });

      form.reset()
      setAvailableModalities(null)

    } catch {
      toast.add({
        type: "error",
        description: t("errorToastMessage"),
      });
    }
  }

  function getSelectedCourseModalities(courseId: string | null) {
    if (!courseId) return null

    const selectedCourse = activeCourses.find(c => c.id === courseId)

    if (!selectedCourse) return null

    const availableModalities = selectedCourse.classPlans.map((cp) => cp.modalityType)

    setAvailableModalities(availableModalities)
  }

  const modalityLabel: Record<string, string> = {
    GROUP: t("groupModality"),
    INDIVIDUAL: t("individualModality")
  } as const

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="grid grid-cols-1 items-center gap-8 pb-20 lg:pb-0 lg:gap-12 lg:grid-cols-[2fr_1fr]"
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
        <div className="flex gap-8 lg:gap-10">
          <Controller
            name="course"
            control={form.control}
            render={({ field }) => (
              <Field className="flex flex-col gap-2">
                <FieldLabel className="lg:text-base" htmlFor="course">
                  {t("courseField")}
                  <span className="text-destructive">*</span>
                </FieldLabel>
                <Select {...field} onValueChange={(value) => {
                  field.onChange(value)
                  getSelectedCourseModalities(value)
                }}>
                  <SelectTrigger>
                    <SelectValue>
                      {field.value ? activeCourses.find((c) => c.id === field.value)?.name : "Ex.: Clarinete"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {activeCourses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
          <Controller
            name="modality"
            control={form.control}
            render={({ field }) => (
              <Field className="flex flex-col gap-2">
                <FieldLabel className="lg:text-base" htmlFor="modality">
                  {t("modalityField")}
                  <span className="text-destructive">*</span>
                </FieldLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={availableModalities === null}>
                  <SelectTrigger>
                    <SelectValue>
                      {field.value ? modalityLabel[field.value] : "Ex.: Coletiva"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {availableModalities && (
                        availableModalities.map((modality) => (
                          <SelectItem key={modality} value={modality}>{modalityLabel[modality]}</SelectItem>
                        ))
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={!form.formState.isValid || form.formState.isSubmitting}
          className="mt-5"
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
            <AvatarUploadInput value={field.value} onChange={field.onChange} />
          </div>
        )}
      />
    </form>
  );
}

