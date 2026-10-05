"use server"

import prisma from "@/lib/prisma";
import { calculateAge } from "@/lib/utils";
import { createClient } from "@supabase/supabase-js"
import { env } from "@/lib/env";
import { EnrollmentStatus, ModalityType, Prisma } from "@/generated/prisma/client";
import { EditStudentFormData, NewStudentFormData } from "./schema";
import { revalidatePath } from "next/cache";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

type CreateStudentData = Omit<NewStudentFormData, "photo" | "course" | "modality">

export async function createStudent(data: CreateStudentData) {
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

export async function updateStudentPhotoPath(studentId: string, studentPhotoPath: string) {
  try {
    const updatedStudent = await prisma.student.update({
      where: {
        id: studentId
      },
      data: {
        photoPath: studentPhotoPath,
      },

    })
    return updatedStudent

  } catch (error) {
    throw new Error("Error updating student photo path", { cause: error })
  }
}

export async function updateStudentPersonalInfo(studentId: string, payload: EditStudentFormData) {
  const updatedStudent = await prisma.student.update({
    where: {
      id: studentId
    },
    data: {
      name: payload.name,
      birthDate: payload.birthDate,
      studentPhoneNumber: payload.studentPhoneNumber,
      responsibleName: payload.responsibleName,
      responsiblePhoneNumber: payload.responsiblePhoneNumber,
      church: payload.church,
      address: payload.address
    }
  })

  if (!updatedStudent) {
    throw new Error("Student not found")
  }
}

export async function uploadImage(file: File, studentId: string) {

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

    const filePath = `${studentId}/${file.name}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) throw error;

    const { data, error: signedUrlError } = await supabase.storage
      .from("avatars")
      .createSignedUrl(filePath, 60 * 60);

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

export async function getStudentProfilePicture(studentId: string) {
  const student = await prisma.student.findUnique({
    where: {
      id: studentId
    }
  })

  if (!student) {
    throw new Error("Student not found")
  }

  if (!student.photoPath) return undefined

  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SECRET_KEY
  )

  const { data, error } = await supabase.storage.from("avatars").createSignedUrl(student.photoPath, 60 * 60)

  if (error) throw error

  return data.signedUrl
}

export async function getActiveCourses() {
  const courses = await prisma.course.findMany({
    where: {
      status: "ACTIVE"
    },
    include: {
      classPlans: true
    },
    orderBy: {
      name: "asc"
    }
  })

  if (!courses) {
    throw new Error("No class plans found")
  }

  return courses
}

export type CoursesWithClassPlans = Prisma.CourseGetPayload<{
  include: {
    classPlans: true
  }
}>[]

export async function enrollStudent(studentId: string, modality: ModalityType, courseId: string) {

  const selectedClassPlan = await prisma.classPlan.findUnique({
    where: {
      courseId_modalityType: {
        courseId: courseId,
        modalityType: modality
      }
    }
  })

  if (!selectedClassPlan) {
    throw new Error("Class plan not found")
  }

  try {
    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: studentId,
        classPlanId: selectedClassPlan.id,
        courseId: courseId
      }
    })

    return enrollment

  } catch (error) {
    throw new Error("Error creating enrollment", { cause: error })
  }

}

export async function lockStudentEnrollment(enrollmentId: string) {
  await prisma.enrollment.update({
    where: {
      id: enrollmentId
    },
    data: {
      status: "LOCKED",
      lockedAt: new Date()
    }
  })

  revalidatePath("/[locale]/students/[id]", "page")
}

export async function unlockStudentEnrollment(enrollmentId: string) {
  await prisma.enrollment.update({
    where: {
      id: enrollmentId
    },
    data: {
      status: "ACTIVE",
      startedAt: new Date()
    }
  })

  revalidatePath("/[locale]/students/[id]", "page")
}
export async function endStudentEnrollment(enrollmentId: string) {
  await prisma.enrollment.update({
    where: {
      id: enrollmentId
    },
    data: {
      status: "ENDED",
      endedAt: new Date()
    }
  })

  revalidatePath("/[locale]/students/[id]", "page")
}

export async function getSingleStudentCompleteInfo(id: string) {
  const student = await prisma.student.findUnique({
    where: {
      id
    },
    include: {
      enrollments: {
        include: {
          classPlan: true,
          loans: true,
          maintenanceFees: true,
          tuitionPayments: true
        },
        orderBy: [
          {startedAt: "desc"},
          {lockedAt: "desc"},
          {endedAt: "desc"}
        ]
      }
    }
  })

  if (!student) {
    throw new Error("Student not found")
  }

  return student
}

export type StudentCompleteInfo = Prisma.StudentGetPayload<{
  include: {
    enrollments: {
      include: {
        classPlan: true,
        loans: true,
        maintenanceFees: true,
        tuitionPayments: true
      }
    }
  }
}>

export type EnrollmentCompleteInfo = Prisma.EnrollmentGetPayload<{
  include: {
    classPlan: true,
    loans: true,
    maintenanceFees: true,
    tuitionPayments: true
  }

}>
