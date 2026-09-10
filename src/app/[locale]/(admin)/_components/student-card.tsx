import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Prisma, } from "@/generated/prisma/client";
import { calculateAge, cn, getInitials } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

type StudentWithEnrollmentsAndTuitionPayment = Prisma.StudentGetPayload<{
  include: {
    enrollments: {
      include: {
        tuitionPayments: true
      }
    }
  }
}>


type StudentCardProps = {
  student: StudentWithEnrollmentsAndTuitionPayment
};

export default async function StudentCard({
  student
}: StudentCardProps) {
  const t = await getTranslations("StudentCard");
  const studentAge = calculateAge(student.birthDate);

  return (
    <Card
      className={cn(
        "py-4 border-l-4",
        student.status === "ACTIVE"
          ? "border-l-transparent"
          : "border-l-red-500",
      )}
    >
      <CardContent className="flex flex-row gap-3 items-center ">
        <Avatar size="lg">
          <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
          <AvatarBadge
            className={cn(
              student.status === "ACTIVE" ? "bg-green-500" : "bg-red-500",
            )}
          />
        </Avatar>
        <div className="flex flex-col justify-between">
          <p>{student.name}</p>
          <div className="flex gap-1">
            {student.enrollments.some((enrollment) =>
              enrollment.tuitionPayments.some((tp) => tp.paidAt === null)
            ) && (
                <Badge variant="destructive">
                  {t("overdueStatus")}
                </Badge>
              )}
            <span>
              {studentAge} {t("age")}
            </span>
            <span>•</span>
            <span>
              {student.studentPhoneNumber ? student.studentPhoneNumber : student.responsiblePhoneNumber}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
