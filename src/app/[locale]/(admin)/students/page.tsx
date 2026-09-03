import { Card } from "@/components/ui/card"
import prisma from "@/lib/prisma"
import { getTranslations } from "next-intl/server"

export default async function StudentsPage() {
    const students = await prisma.student.findFirst({
        include: {
            enrollments: {
                include: {
                    course: true
                }
            }
        }
    })
    const t = await getTranslations("StudentsPage")
    return (
        <div className="flex flex-col gap-10 pt-4">
            <h1 className="font-display text-2xl xl:text-3xl">{t("title")}</h1>
            <Card className="flex flex-row w-xl items-center justify-evenly">

                <div className="h-8 w-8 rounded-sm bg-red-500 "></div>

                <div>
                    <p>{students?.name}</p>
                    {students?.enrollments.map(e => (
                        <p key={e.id}>{e.course.name}</p>
                    ))}
                </div>
            </Card>
        </div>
    )
}   