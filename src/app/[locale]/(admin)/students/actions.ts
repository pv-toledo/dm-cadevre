"use server"

import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { calculateAge } from "@/lib/utils";
import { NewStudentFormData } from "../_components/new-student-form";

import { v7 as uuidv7 } from "uuid"
import { createClient } from "@supabase/supabase-js"
import { env } from "@/lib/env";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function createStudent(data: NewStudentFormData) {
  const isMinor = calculateAge(data.birthDate) < 18

  const payload: Prisma.StudentCreateInput = {
    ...data,
    church: data.church?.trim() || null,
    responsibleName: isMinor ? data.responsibleName : null,
    responsiblePhoneNumber: isMinor ? data.responsiblePhoneNumber : null,
    studentPhoneNumber: isMinor ? null : data.studentPhoneNumber
  }

  try {
    const student = await prisma.student.create({
      data: payload
    });

    return student
  } catch (error) {
    throw new Error("Error creating student", { cause: error })
  }

}

export async function uploadImage(file: File) {

  try {
    if (!file) {
      throw new Error("Arquivo é obrigatório");
    }

    if (!file.type.startsWith("image/")) {
      throw new Error("Arquivo inválido");
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error("Arquivo excede 10MB");
    }

    const supabase = createClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SECRET_KEY
    )

    const filePath = `${uuidv7()}.webp`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const { data, error: signedUrlError} = await supabase.storage
      .from("avatars")
      .createSignedUrl(filePath, 60*60);

      if (signedUrlError) throw signedUrlError;

    return {
      data: {
        path: filePath,
        signedUrl: data.signedUrl,
      },
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao enviar imagem",
    };
  }
}
