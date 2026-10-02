import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CoursesWithClassPlans, StudentCompleteInfo } from "../../actions";
import { getTranslations } from "next-intl/server";
import StudentEnrollmentBadge from "./student-enrollment-badge";

type EnrollmentDatailCardProps = {
    student: StudentCompleteInfo
    activeCourses: CoursesWithClassPlans
}

export default async function EnrollmentDetailCard({ student, activeCourses }: EnrollmentDatailCardProps) {

    const t = await getTranslations("EnrollmentDetailCard")

    const modalityLabel: Record<string, string> = {
        GROUP: t("groupModality"),
        INDIVIDUAL: t("individualModality")
    } as const

    return (
        <Card className="w-full">
            <CardHeader className="border-b border-muted-foreground/30">
                <CardTitle className="text-base lg:text-lg">
                    {t("title")}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {student.enrollments.map(e => (
                    <div key={e.id} className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <p className="font-display font-medium text-sm lg:text-base">{activeCourses.find((course) => course.id === e.classPlan.courseId)?.name} - {modalityLabel[e.classPlan.modalityType]}</p>
                            <p className="text-xs lg:text-sm text-muted-foreground">{t("startDate")}: {e.startedAt.toLocaleDateString("pt-BR", { timeZone: "UTC" })}</p>
                        </div>

                        <StudentEnrollmentBadge enrollment={e} />

                    </div>
                ))}
            </CardContent>
        </Card>
    )
}