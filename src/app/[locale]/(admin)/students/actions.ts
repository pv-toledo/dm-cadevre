"use server"

import prisma from "@/lib/prisma";
import { NewStudentFormData } from "./new/page";
import { calculateAge, emptyToNull } from "@/lib/utils";

export async function createStudent (data: NewStudentFormData) {
  const isMinor = calculateAge(data.birthDate) < 18;

  const student = await prisma.student.create({
    data: {
      name: data.name,
      birthDate: data.birthDate,
      address: data.address,
      church: emptyToNull(data.church),
      studentPhoneNumber: isMinor ? null : emptyToNull(data.studentPhoneNumber),
      responsibleName: isMinor ? emptyToNull(data.responsibleName) : null,
      responsiblePhoneNumber: isMinor ? emptyToNull(data.responsiblePhoneNumber) : null,
    },
  });
}