"use server"

import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { calculateAge } from "@/lib/utils";
import { NewStudentFormData } from "../_components/new-student-form";

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