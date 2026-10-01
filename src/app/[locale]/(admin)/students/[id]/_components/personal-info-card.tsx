import { Student } from "@/generated/prisma/client"
import EditStudentDialog from "./edit-student-dialog"
import { calculateAge, formatPhoneNumber } from "@/lib/utils"
import { getTranslations } from "next-intl/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type PersonalInfoCardProps = {
    student: Student
}

export default async function PersonalInfoCard({ student }: PersonalInfoCardProps) {

    const t = await getTranslations("PersonalInfoTable")
    const studentAge = calculateAge(student.birthDate)

    return (
        <Card className="w-full">
            <CardHeader className="flex items-center justify-between border-b border-muted-foreground/30">
                <CardTitle className="text-base lg:text-lg">{t("title")}</CardTitle>
                <EditStudentDialog student={student} />
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                <div>
                    <p className="text-xs lg:text-sm text-muted-foreground">{t("name")}</p>
                    <p className="font-display font-medium text-sm lg:text-base">{student.name}</p>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs lg:text-sm text-muted-foreground">{t("birthDate")}</p>
                        <p className="font-display font-medium text-sm lg:text-base">{student.birthDate.toLocaleDateString("pt-BR", { timeZone: "UTC" })}</p>
                    </div>
                    <div>
                        <p className="text-xs lg:text-sm text-muted-foreground">{t("age")}</p>
                        <p className="font-display font-medium text-sm lg:text-base">{studentAge}</p>
                    </div>
                </div>
                {studentAge < 18 ? (
                    <>
                        <div>
                            <p className="text-xs lg:text-sm text-muted-foreground">{t("responsibleName")}</p>
                            <p className="font-display font-medium text-sm lg:text-base">{student.responsibleName}</p>
                        </div>
                        <div>
                            <p className="text-xs lg:text-sm text-muted-foreground">{t("responsiblePhoneNumber")}</p>
                            <p className="font-display font-medium text-sm lg:text-base">{formatPhoneNumber(student.responsiblePhoneNumber)}</p>
                        </div>
                    </>
                ) : (
                    <div>
                        <p className="text-xs lg:text-sm text-muted-foreground">{t("studentPhoneNumber")}</p>
                        <p className="font-display font-medium text-sm lg:text-base">{formatPhoneNumber(student.studentPhoneNumber)}</p>
                    </div>
                )}
                <div>
                    <p className="text-xs lg:text-sm text-muted-foreground">{t("church")}</p>
                    <p className="font-display font-medium text-sm lg:text-base">{student.church}</p>
                </div>
                <div>
                    <p className="text-xs lg:text-sm text-muted-foreground">{t("address")}</p>
                    <p className="font-display font-medium text-sm lg:text-base">{student.address}</p>
                </div>
            </CardContent>
        </Card>
    )
}