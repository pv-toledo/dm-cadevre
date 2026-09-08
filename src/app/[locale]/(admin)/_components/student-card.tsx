import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Enrollment, Prisma, TuitionPayment } from "@/generated/prisma/client";
import { StudentStatus } from "@/generated/prisma/enums";
import { calculateAge, cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

type EnrollmentWithRelations = Prisma.EnrollmentGetPayload<{
    include: {
        tuitionPayments: true
    }
}>

type StudentCardProps = {
    studentName: string
    studentBirthDate: Date
    studentPhoneNumber: string | null
    responsiblePhoneNumber: string | null
    studentStatus: StudentStatus
    studentEnrollments: EnrollmentWithRelations[]
}

export default async function StudentCard({ studentName, studentBirthDate, studentPhoneNumber, responsiblePhoneNumber, studentStatus, studentEnrollments }: StudentCardProps) {
    const t = await getTranslations("StudentCard")
    const studentAge = calculateAge(studentBirthDate)

    const overdueTuition = studentEnrollments.find(
        enrollment => enrollment.tuitionPayments.length > 0 &&
            enrollment.tuitionPayments[0].paidAt === null
    )

    

    return (
        <Card className={cn("py-4 border-l-4", studentStatus === "ACTIVE" ? "border-l-transparent" : "border-l-red-500")}>
            <CardContent className="flex flex-row gap-3 items-center ">
                <Avatar size="lg">
                    <AvatarFallback>PV</AvatarFallback>
                    <AvatarBadge className={cn(studentStatus === "ACTIVE" ? "bg-green-500" : "bg-red-500")} />
                </Avatar>
                <div className="flex flex-col justify-between">
                    <p>{studentName}</p>
                    <div className="flex gap-1">
                        {overdueTuition && (
                            <Badge variant="destructive">{t("overdueStatus")}</Badge>
                        )}
                        <span>{studentAge} {t("age")}</span>
                        <span>•</span>
                        <span>{studentPhoneNumber ? studentPhoneNumber : responsiblePhoneNumber}</span>
                    </div>

                </div>
            </CardContent>
        </Card>
    )
}