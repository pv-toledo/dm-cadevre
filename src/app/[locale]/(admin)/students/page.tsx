import prisma from "@/lib/prisma"
import { getTranslations } from "next-intl/server"
import StudentCard from "../_components/student-card"

export default async function StudentsPage() {
    // const students = await prisma.student.findFirst({
    //     include: {
    //         enrollments: {
    //             include: {
    //                 course: true
    //             }
    //         }
    //     }
    // })
    const t = await getTranslations("StudentsPage")
    return (
        <div className="flex flex-col gap-10 pt-4">
            <h1 className="font-display text-2xl xl:text-3xl">{t("title")}</h1>
            <section className="grid lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                <StudentCard />
            </section>
        </div>
    )
}   