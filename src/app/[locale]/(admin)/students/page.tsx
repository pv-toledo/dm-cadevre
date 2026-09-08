import prisma from "@/lib/prisma"
import { getTranslations } from "next-intl/server"
import StudentCard from "../_components/student-card"



export default async function StudentsPage() {

    const today = new Date()
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    const students = await prisma.student.findMany({
        include: {
            enrollments: {
                include: {
                    tuitionPayments: {
                        where: {
                            referenceMonth: currentMonth
                        }
                    }
                }
            }
        }
    }) ?? []
    // console.dir(students[0].enrollments, { depth: null })
    const t = await getTranslations("StudentsPage")
    return (
        <div className="flex flex-col gap-10 pt-4">
            <h1 className="font-display text-2xl xl:text-3xl">{t("title")}</h1>
            <section className="grid lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                {students.map(student => (
                    <StudentCard
                        key={student.id}
                        studentName={student.name}
                        studentBirthDate={student.birthDate}
                        studentPhoneNumber={student.studentPhoneNumber}
                        responsiblePhoneNumber={student.responsiblePhoneNumber}
                        studentStatus={student.status}
                        studentEnrollments={student.enrollments}
                    />
                ))}

            </section>
            
        </div>
    )
}   