import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CoursesWithClassPlans, StudentCompleteInfo } from "../../actions";
import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";

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

    const statusLabel: Record<string, string> = {
        ACTIVE: t("activeStatus"),
        INACTIVE: t("inactiveStatus")
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
                            <p className="text-xs lg:text-sm text-muted-foreground">{t("startDate")}: {e.classPlan.createdAt.toLocaleDateString("pt-BR", { timeZone: "UTC" })}</p>
                        </div>

                        <div className={cn("flex items-center gap-1 rounded-xl py-1 px-2 w-fit", e.classPlan.status === "ACTIVE" ? "bg-success/15" : "bg-muted")}>

                            <div className={cn("h-2 w-2 rounded-full", e.classPlan.status === "ACTIVE" ? "bg-success" : "bg-muted-foreground")} />
                            <span className={cn("text-xs font-semibold", e.classPlan.status === "ACTIVE" ? "text-success" : "text-muted-foregroundbg-muted-foreground")}>{statusLabel[e.classPlan.status]}</span>

                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}