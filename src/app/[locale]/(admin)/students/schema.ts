import { calculateAge } from "@/lib/utils";
import z from "zod";

const baseStudentFormSchema = z.object({
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
  modality: z.enum(["GROUP", "INDIVIDUAL"]),
});

export const newStudentFormSchema = baseStudentFormSchema.superRefine(
  (data, context) => {
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
  }
);

export type NewStudentFormData = z.infer<typeof newStudentFormSchema>;

export const editStudentFormSchema = baseStudentFormSchema.omit({
  photo: true,
  photoPath: true,
  course: true,
  modality: true
})

export type EditStudentFormData = z.infer<typeof editStudentFormSchema>