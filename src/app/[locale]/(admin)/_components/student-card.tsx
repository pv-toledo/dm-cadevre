import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { calculateAge } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

type StudentCardProps = {
    studentName: string
    studentBirthDate: Date
    studentPhoneNumber: string | null
    responsiblePhoneNumber: string | null
}

export default async function StudentCard({studentName, studentBirthDate, studentPhoneNumber, responsiblePhoneNumber}: StudentCardProps) {
    const t = await getTranslations("StudentCard")
    const studentAge = calculateAge(studentBirthDate)
    return (
        <Card className="py-4 border-l-4 border-l-red-600">
            <CardContent className="flex flex-row gap-3 items-center ">
                <Avatar size="lg">
                    <AvatarFallback>PV</AvatarFallback>
                    <AvatarBadge className="bg-green-600" />
                </Avatar>
                <div className="flex flex-col justify-between">
                    <p>{studentName}</p>
                    <div className="flex gap-1">
                        <Badge variant="destructive">{t("overdueStatus")}</Badge>
                        <span>{studentAge} {t("age")}</span>
                        <span>•</span>
                        <span>{studentPhoneNumber ? studentPhoneNumber : responsiblePhoneNumber}</span>
                    </div>

                </div>
            </CardContent>
        </Card>
    )
}