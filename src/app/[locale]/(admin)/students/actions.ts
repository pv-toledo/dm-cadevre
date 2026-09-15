"use server"

import prisma from "@/lib/prisma";
import { NewStudentFormData } from "./new/page";

export async function createStudent (data: NewStudentFormData) {
    const student = await prisma.student.create({
        data: {
            name: data.name,
            birthDate: data.birthDate,
            studentPhoneNumber: data.studentPhoneNumber,
            responsibleName: data.responsibleName,
            responsiblePhoneNumber: data.responsiblePhoneNumber,
            church: data.church ? data.church : 
        }
    })
}